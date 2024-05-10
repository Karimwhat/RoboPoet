// Karim Fouad
// Fall 2022

// based on client-server-server and user accounts

const express = require('express')
const path = require('path')
const app = express()
const router = require('./router.js');

// Tell express where to find Handlebar templates
app.set('views', path.join(__dirname, '/views'))

// Tell express to use Handlebar templates
app.set('view engine', 'hbs')

// Sign up is available without authentication
app.get(['/index.html', '/index.htm', '/', ''], router.signup);

// Static server (to serve CSS and js scripts)
app.use(express.static(__dirname + '/public'))

// Always start with authenticating users
app.use(router.authenticate)

// Serve specifc routes after authentication
app.get('/users', router.users)
app.get('/poem', router.poem)
app.get('/newuser', router.newuser)
app.get('/mypoems', router.index)
// app.get('/song/*', routes.songDetails);

//start server
const PORT = process.env.PORT || 3000
app.listen(PORT, err => {
  if (err) {
    console.log(err)
  }
  else {
    console.log(`Server listening on port: ${PORT}`)
    console.log(`To use Robo Poet, visit:`)
    console.log(`http://localhost:${PORT}`)
  }
})
