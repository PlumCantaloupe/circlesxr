'use strict';

// Set up and parse Environment based configuation
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

let env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

// Parse the dot configs so that things like false are boolean, not strings
env = dotenvParseVariables(env.parsed);

// Make the parsed environment config globally accessible
global.env = env;

const express       = require('express');
const app           = express();
const fs            = require('fs');
const url           = require('url');
const path          = require('path');

const http          = require('http');
const server        = http.createServer(app);

process.title = "cert-check";

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res, next) {
  res.send('Hello World!');
});

app.get('/.well-known/acme-challenge/:challengeHash', function (req, res, next) {
  let key = req.params.challengeHash;
  let val = null;
  let challengePath = path.resolve(__dirname + '/public/certs/webroot/.well_known/acme-challenge/' + key);

  fs.readFileSync(challengePath, 'utf8', (err, data) => {

    if (err) {
      console.log(error);
    }
    else {
      res.send( data.toString());
    }
  });
});

//lets start up
server.listen(env.SERVER_PORT, () => {
  console.log("Listening on http port: " + env.SERVER_PORT );
});
