'use strict';

// Set up and parse Environment based configuation
const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const crypto = require('crypto');

let env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

// Parse the dot configs so that things like false are boolean, not strings
env = dotenvParseVariables(env.parsed);

// Make the parsed environment config globally accessible
//global.env = env;

//shared CIRCLES code with client
//authentication tutorial used : https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359
require('../src/core/circles_server');

const express         = require('express');
const app             = express();
const fs              = require('fs');
const url             = require('url');
const path            = require('path');
const helmet          = require("helmet");
const forceSSL        = require('express-force-ssl');
const sassMiddleware  = require('node-sass-middleware');

// const easyrtc         = require("easyrtc");               // EasyRTC external module

let serverSecure      = null; //use on remote 'linux' server
const http            = require('http');
const server          = http.createServer(app);

//if linux we can assume this is our remote server otherwise just run over http for localhost)
if (env.MAKE_SSL) {
  const http = require('https');
  const options = {
    key:    fs.readFileSync('/etc/letsencrypt/live/circlesxr.com/privkey.pem', 'utf8'),
    cert:  fs.readFileSync('/etc/letsencrypt/live/circlesxr.com/fullchain.pem', 'utf8')
  };
  console.log('HTTPS server being created ...');
  serverSecure  = http.createServer(options, app);
}

//server stuff
const session       = require('express-session');
const MongoStore    = require('connect-mongo')(session);

//database
const mongoose      = require('mongoose');
const User          = require('./models/user');
const bodyParser    = require('body-parser');
const dbURL         = 'mongodb://' + env.DATABASE_HOST + ':' +  env.DATABASE_PORT + '/mdmu';

// Set process name
process.title = "node-circlesxr";

//database connect
mongoose.connect(dbURL);
const db            = mongoose.connection;
const sessionObj    = session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
});

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("Database connected!");
});

//use sessions for tracking logins (needs to be before routes app.use)
app.use(sessionObj);
app.use(helmet());
app.use(bodyParser.json());                                 //set body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));


const srcPath = __dirname + '/scss';
const destPath = __dirname + '/public/web/css';

app.use(sassMiddleware({
  src: srcPath,
  dest: destPath,
  debug: true,
  outputStyle: 'compressed',
  prefix: '/web/css',
}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // * => allow all origins
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-Auth-Token, Accept'); // add remove headers according to your needs
  next()
});

app.use(express.static(__dirname + '/public'));             //set root path of server ...
if (env.MAKE_SSL) {
  app.use(forceSSL);
}

// Set up Passport
const passport              = require('passport');
const passportLocalStrategy = require('passport-local').Strategy;

// Build the passport local strategy for authentication
passport.use(new passportLocalStrategy (
  {
    usernameField: 'email'
  },
  function (username, password, done) {
    // Find user by email
    User.findOne({ email: username })
      .exec(function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, { message: 'Incorrect username or password' });
        }

        user.validatePassword(password, function (err, user) {
          if (err) {
            return done(null, false, { message: 'Incorrect username or password' });
          }

          return done(null, user);
        });
      });
  }
));

// Set up serialization of user to the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  // If the request is authenticated, add user info to the response locals for use in templates
  if (req.isAuthenticated()) {
    res.locals.currentUser = {
      username: req.user.username,
      firstname: req.user.firstname,
      lastname: req.user.lastname,
      email: req.user.email,
      emailHash: crypto.createHash('md5').update(req.user.email).digest('hex'),
    };
  }
  next();
})

// Bind the routes to the app
const routes = require('./routes/router');
app.use('/', routes);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler, define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

//!!easyRTC start
//websockets
let io = null;
if (env.MAKE_SSL) {
  //io = require('socket.io')(serverSecure);
  io = require("socket.io")(serverSecure, {
      handlePreflightRequest: (req, res) => {
          const headers = {
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
              "Access-Control-Allow-Credentials": true
          };
          res.writeHead(200, headers);
          res.end();
      }
  });
}
else {
  //io = require('socket.io')(server);
  io = require("socket.io")(server, {
      handlePreflightRequest: (req, res) => {
          const headers = {
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Allow-Origin": req.headers.origin, //or the specific origin you want to give access to,
              "Access-Control-Allow-Credentials": true
          };
          res.writeHead(200, headers);
          res.end();
      }
  });
}

const rooms = {};

io.on("connection", socket => {
  console.log("user connected", socket.id);

  let curRoom = null;

  socket.on("joinRoom", data => {
    const { room } = data;

    if (!rooms[room]) {
      rooms[room] = {
        name: room,
        occupants: {},
      };
    }

    const joinedTime = Date.now();
    rooms[room].occupants[socket.id] = joinedTime;
    curRoom = room;

    console.log(`${socket.id} joined room ${room}`);
    socket.join(room);

    socket.emit("connectSuccess", { joinedTime });
    const occupants = rooms[room].occupants;
    io.in(curRoom).emit("occupantsChanged", { occupants });
  });

  socket.on("send", data => {
    io.to(data.to).emit("send", data);
  });

  socket.on("broadcast", data => {
    socket.to(curRoom).broadcast.emit("broadcast", data);
  });

  socket.on("disconnect", () => {
    console.log('disconnected: ', socket.id, curRoom);
    if (rooms[curRoom]) {
      console.log("user disconnected", socket.id);

      delete rooms[curRoom].occupants[socket.id];
      const occupants = rooms[curRoom].occupants;
      socket.to(curRoom).broadcast.emit("occupantsChanged", { occupants });

      if (occupants == {}) {
        console.log("everybody left room");
        delete rooms[curRoom];
      }
    }
  });

  //custom socket events
  socket.on("dataTest", data => {
    console.log('I heard you!!');
    console.log("data received: " + data.testData) 
  });
});
//!!easyRTC end

//lets start up
server.listen(env.SERVER_PORT, () => {
  console.log("Listening on http port: " + env.SERVER_PORT );
});

if (env.MAKE_SSL) {
  serverSecure.listen(env.SERVER_PORT_SECURE, () => {
    console.log("Listening on https port: " + env.SERVER_PORT_SECURE );
  });
}


app.set('views', './views');
app.set('view engine', 'pug');
