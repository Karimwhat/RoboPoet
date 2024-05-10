// const url = require('url')
// const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const openai = require('./openai.js')

// Create database handle
const db = new sqlite3.Database('data/db_RoboPoet.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE)

// Make a couple of users exist in the database
db.serialize(function () {
    // user: big     password: boss 		role: admin
    // user: hiphip  password: hooray		role: user
    db.run("CREATE TABLE IF NOT EXISTS users (userid TEXT PRIMARY KEY, password TEXT, role TEXT)");
    db.run("INSERT OR REPLACE INTO users VALUES ('big', 'boss', 'admin')");
    db.run("INSERT OR REPLACE INTO users VALUES ('hiphip', 'hooray', 'user')");
});

exports.authenticate = function (request, response, next) {
    /*
      Middleware to do BASIC http 401 authentication
    */
    let auth = request.headers.authorization

    // auth is a base64 representation of (username:password)
    // so we will need to decode the base64
    if (!auth) {
        //note here the setHeader must be before the writeHead
        response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
        response.writeHead(401, {
            'Content-Type': 'text/html'
        })
        console.log('No authorization found, send 401.')

        // TODO(karim): respond with the login page or sign up page
        response.end();
    } else {
        console.log("Authorization Header: " + auth)
        //decode authorization header
        // Split on a space, the original auth
        //looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
        var tmp = auth.split(' ')

        // create a buffer and tell it the data coming in is base64
        var buf = Buffer.from(tmp[1], 'base64');

        // read it back out as a string
        //should look like 'ldnel:secret'
        var plain_auth = buf.toString()
        console.log("Decoded Authorization ", plain_auth)

        //extract the userid and password as separate strings
        var credentials = plain_auth.split(':') // split on a ':'
        var username = credentials[0]
        var password = credentials[1]
        console.log("User: ", username)
        console.log("Password: ", password)

        var authorized = false
        db.all("SELECT userid, password, role FROM users", function (err, rows) {

            // Detect if given user exists (i.e. authorized)
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].userid == username & rows[i].password == password) {
                    authorized = true
                    request.user_role = rows[i].role
                    request.user_name = rows[i].userid
                    break
                }
            }

            if (authorized) {
                next()
            } else {
                //we had an authorization header by the user:password is not valid
                response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
                response.writeHead(401, {
                    'Content-Type': 'text/html'
                })
                console.log('Authorization not found, send 401.')

                // TODO(karim): respond with the login page or sign up page
                response.end()
            }
        })
    }

}

// index.hbs
exports.index = function (request, response) {
    response.render('index', {
        // TODO(karim): set variables for index.hbs
        title: 'Poem Generator - Karim Fouad - COMP2406 Project - Fall 2022',
        userId: request.user_name,
        isAdmin: (request.user_role == 'admin'),
        usersRoute: '/users',
        signupRoute: '/'
    });
}

// users.hbs
exports.users = function (request, response) {
    db.all("SELECT userid, role FROM users", function (err, rows) {
        if (request.user_role == 'admin') {

            // Create isAdmin boolean for hbs conditional rendering
            for (row of rows) {
                if (row.role == 'admin') {
                    row.isAdmin = true
                }
            }

            response.render('users', {
                title: 'Users - Poem Generator - Karim Fouad - COMP2406 Project - Fall 2022',
                users: rows,
                poemsRoute: '/mypoems',
                signupRoute: '/'
            });
        } else {
            // TODO(karim): extract 401 error as a common function / or hbs repsonse
            response.setHeader('WWW-Authenticate', 'Basic realm="need to login"')
            response.writeHead(401, {
                'Content-Type': 'text/html'
            })
            // TODO(karim): send user to login/signup page
            response.write(`<h1>ERROR: Admin Privileges Required To See Users</h1>`)
            response.end()
        }
    })
}

exports.newuser = function (request, response, next) {
    // Process username
    let username = request.query.username
    if (!username) {
        response.json({ message: 'Please enter a username' })
        return
    }

    let password = request.query.password
    if (!password) {
        response.json({ message: 'Please enter a password' })
        return
    }

    db.serialize(function () {
        db.run(`INSERT INTO users values ('${username}', '${password}', 'user')`)
    })

    response.json({ message: "Account created" })
}


exports.poem = async function (request, response) {
    // Request path (example: localhost:3000/poem?topic=Pokemon&style=Shakespeare)
    console.log(request.path)

    let openAiPrompt = ""

    // Process poem topic
    let poemTopic = request.query.topic
    if (!poemTopic) {
        response.json({ message: 'Please enter a poem topic' })
        return
    }
    poemTopic = poemTopic.trim()
    openAiPrompt += "Write a poem about " + poemTopic

    // Process poem style
    let poemStyle = request.query.style
    if (poemStyle) {
        poemStyle = poemStyle.trim()
        openAiPrompt += " in the style of " + poemStyle
    }

    // Process poem word count
    // Reference on accepted word counts:
    // https://beta.openai.com/docs/api-reference/completions/create#completions/create-max_tokens
    const DEFAULT_MAXWORD_COUNT = 100
    const MIN_MAXWORD_COUNT = 4
    const MAX_MAXWORD_COUNT = 2048

    let poemMaxWordCount = request.query.maxWordCount
    if (poemMaxWordCount) {
        poemMaxWordCount = poemMaxWordCount.trim()
        if (isNaN(poemMaxWordCount)) {
            poemMaxWordCount = DEFAULT_MAXWORD_COUNT
        } else {
            poemMaxWordCount = Math.max(MIN_MAXWORD_COUNT, poemMaxWordCount)
            poemMaxWordCount = Math.min(MAX_MAXWORD_COUNT, poemMaxWordCount)
        }
    } else {
        poemMaxWordCount = DEFAULT_MAXWORD_COUNT
    }

    console.log('Max word count:', poemMaxWordCount)
    console.log('OpenAI prompt:', openAiPrompt)

    // Send prompt to OpenAI
    try {
        const openAiResponse = await openai.ask(openAiPrompt, poemMaxWordCount)

        // console.log('OpenAI response:', openAiResponse)

        // Check poem in reponse
        const poems = openAiResponse.data.choices
        if (poems.length < 1) {
        }
        const poem = poems[0].text
        console.log("OpenAI poem:", poem)

        response.contentType('application/json').json({ poem: poem })
    } catch (e) {

        // TODO(karim): error.hbs ????
        response.status(500).json(e)
    }
}


exports.signup = async function (request, response) {
    response.render('signup', {
        title: 'Signup - Poem Generator - Karim Fouad - COMP2406 Project - Fall 2022',
        authRoute: '/mypoems'
    })
}


exports.find = function (request, response) {
    // find.html
    console.log("RUNNING FIND SONGS");

    var urlObj = parseURL(request, response);
    var sql = "SELECT id, title FROM songs";

    if (urlObj.query['title']) {
        let keywords = urlObj.query['title']
        keywords = keywords.replace(/\s/g, '%')
        console.log("finding title: " + keywords);
        sql = "SELECT id, title FROM songs WHERE title LIKE '%" +
            keywords + "%'"
    }

    db.all(sql, function (err, rows) {
        response.render('songs', { title: 'Songs:', songEntries: rows });
    });
}
exports.songDetails = function (request, response) {

    var urlObj = parseURL(request, response);
    var songID = urlObj.path; //expected form: /song/235
    songID = songID.substring(songID.lastIndexOf("/") + 1, songID.length);

    var sql = "SELECT id, title, composer, key, bars FROM songs WHERE id=" + songID;
    console.log("GET SONG DETAILS: " + songID);

    db.all(sql, function (err, rows) {
        let song = rows[0];
        song.individualBars = [];
        //parsing:
        song.individualBars.indexOf("|")

        for (let i = 0; i < song.bars.length;) {
            let tempbars = song.bars.indexOf("|", i)
            song.bars.substring(i, tempbars)
            song.individualBars.push(song.bars.substring(i, tempbars))
            if (song.bars[tempbars + 1] == "|" || song.bars[tempbars + 1] == "]") {
                tempbars++;
            }
            i = tempbars + 1;
        }


        let middle = Math.ceil(song.individualBars.length / 4);
        let html = ''
        for (i = 0; i < middle; i++) {

            if (song.individualBars[i * 4])
                html += '<tr><td>' + song.individualBars[i * 4] + '</td>'
            if (song.individualBars[i * 4 + 1])
                html += '<td>' + song.individualBars[i * 4 + 1] + '</td>'
            if (song.individualBars[i * 4 + 2])
                html += '<td>' + song.individualBars[i * 4 + 2] + '</td>'
            if (song.individualBars[i * 4 + 3])
                html += '<td>' + song.individualBars[i * 4 + 3] + '</td></tr>'
        }


        console.log("SONG LENGHT", song.individualBars.length)
        console.log('Song Data');
        console.log(song);
        response.render('songDetails', { title: 'Songs Details:', song: song, barsTable: html });

    });

}

