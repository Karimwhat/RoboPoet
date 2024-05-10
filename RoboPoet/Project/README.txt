Karim Fouad
RoboPoet Project - Fall 2022

Description
-----------
This project is a single-page-app (SPA) that generates poems.

The main user features are:
  * The user can choose a poem topic, style, and word limit
  * The user will be notified of input errors (like submitting an empty field)
  * The user will be notified of server errors (like status 500)
  * Admins can access a user list

The main implementation highlights are:
  * The app uses handlebars templates (server-side rendering)
  * The server uses OpenAI's text generation API to generate the poems.
  * The server uses an SQLite database to persist user accounts and their poems.
  * The database starts with a couple of users:
      username: big     password: boss    role: admin
      username: hiphip  password: hooray  role: user

Demo Video
----------
Watch a working demonstration of the app on the file uploaded:
https://youtu.be/mPiaRMmPoSQ?t=84


Working Directory
-----------------
Before proceeding, please make sure to set the current working directory to the
directory containing this README.txt file


Installing Dependencies
-----------------------
To install npm modules execute:  npm install
This will install the modules listed as dependencies in the package.json file.


Running the Server
------------------
To run the server execute:  node server.js


Running the Client
------------------
To run the client app, use your browser to visit:
    http://localhost:3000/

Fun combinations to try:
   Topic           | Style
   ----------------|---------------------
   Pokemon         | Shakespeare
   Firefox         | Graduation speech
   BBQ sauce       | Marketing Tweet
   Music           | Customer complaint
   Crypto currency | Baby shark


Remarks
-------
  * Server tested using Node v16.16.0 on Windows 10

  * Client tested using Firefox 107 and Chrome 108 on Windows 10

  * Please don't share my API key (in openai.js) with others

  * Please don't violate OpenAI's usage policies while using my key
    See https://beta.openai.com/docs/usage-policies

    If you would like to use your own key, set OPENAI_API_KEY variable
    before launching the server. For example:

      Linux or macOS:
        export OPENAI_API_KEY='###'
        node server.js

      Windows (PowerShell):
        $env:OPENAI_API_KEY='###'
        node server.js

