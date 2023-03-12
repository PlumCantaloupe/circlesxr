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

//authentication tutorial used : https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359
require('../src/core/circles_server');

const express         = require('express');
const app             = express();
const fs              = require('fs');
const url             = require('url');
const path            = require('path');
const helmet          = require("helmet");
const sassMiddleware  = require('node-sass-middleware');

const http            = require('http');
const server          = http.createServer(app);

//server stuff
const session       = require('express-session');
const MongoStore    = require('connect-mongo');

//database
const mongoose      = require('mongoose');
const User          = require('./models/user');
const bodyParser    = require('body-parser');
const dbURL         = 'mongodb://' + env.DATABASE_HOST + ':' +  env.DATABASE_PORT + '/circles';

// Set process name
process.title = "node-circlesxr";

//database connect
mongoose.connect(dbURL);
const db            = mongoose.connection;
const sessionObj    = session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: dbURL
  })
});

//handle mongo error
db.on('error', function(e) {
  console.log('connection error:' + e);
  process.exit(1);
});
db.once('open', function () {
  console.log("Database connected!");
});

//use sessions for tracking logins (needs to be before routes app.use)
app.use(sessionObj);
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "default-src":      ["'self'"],
      "connect-src":      ["*", "'unsafe-inline'", "blob:"],
      "img-src":          ["*", "blob:", "data:"],
      "media-src":        ["*"],
      "frame-src":        ["*"],
      "style-src":        ["*", "'unsafe-inline'"],
      "script-src":       ["'self'", "'unsafe-inline'", "'unsafe-eval'", "unpkg.com", "aframe.io", "blob:"],
      "script-src-attr":  ["'unsafe-inline'"],
      "object-src":       ["'none'"],
    },
  })
);
app.use(bodyParser.json());                                 //set body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(sassMiddleware({
  src: __dirname + '/scss',
  dest: __dirname + '/public/web/css',
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

// Set up Passport
const passport              = require('passport');
const passportLocalStrategy = require('passport-local').Strategy;
const JwtStrategy           = require('passport-jwt').Strategy
const ExtractJwt            = require('passport-jwt').ExtractJwt

const jwtOptions = {
  secretOrKey: env.JWT_SECRET, //the same one we used for token generation
  algorithms: 'HS256', //the same one we used for token generation
  jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'), //how we want to extract token from the request
  passReqToCallback: true
};

passport.use(
  'jwt',
  new JwtStrategy(jwtOptions, (req, token, done) => {
    const email = token.data
    User.findOne({ email: email })
      .exec(function (err, user) {
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      });
  })
);

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
});

// Bind the routes to the app
app.use('/', require('./routes/router'));

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

//websockets
let io = require("socket.io")(server, {
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

//this code is unused when we are using the janus sever/adapter 
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
    socket.to(curRoom).emit("broadcast", data);
  });

  socket.on("disconnect", () => {
    console.log('disconnected: ', socket.id, curRoom);
    if (rooms[curRoom]) {
      console.log("user disconnected", socket.id);

      delete rooms[curRoom].occupants[socket.id];
      const occupants = rooms[curRoom].occupants;
      socket.to(curRoom).emit("occupantsChanged", { occupants });

      if (occupants == {}) {
        console.log("everybody left room");
        delete rooms[curRoom];
      }
    }
  });
});
///

//trying to create a system for easy communication here.
io.on("connection", socket => {
  console.log('connection test for general circles messaging system');

  //to catch all events: https://stackoverflow.com/questions/10405070/socket-io-client-respond-to-all-events-with-one-handler
  let onevent = socket.onevent;
  socket.onevent = function (packet) {
      let args = packet.data || [];
      onevent.call (this, packet);    // original call
      packet.data = ["*"].concat(args);
      onevent.call(this, packet);      // additional call to catch-all
  };

  //listen for all events and forward to all other clients
  socket.on("*", function(event, data) {
    //ignore reserved event names
    if (  event === CIRCLES.EVENTS.REQUEST_DATA_SYNC ||
          event === CIRCLES.EVENTS.SEND_DATA_SYNC ) {
      return; //exit
    }

    if (data.room) {
      socket.join(data.room); //hacky solution for janus adapter which doesn't set room
      socket.to(data.room).emit(event, data);
    }
  });

  //this is a request to ask others for their world state for syncing purposes
  socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
    if (data.room) {
      socket.join(data.room); //hacky solution for janus adapter which doesn't set room
      socket.to(data.room).emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, data);
    }
  });

  //this is an event to send world data for syncing to others
  socket.on(CIRCLES.EVENTS.SEND_DATA_SYNC, function(data) {
    if (data.room) {
      socket.join(data.room); //hacky solution for janus adapter which doesn't set room
      socket.to(data.room).emit(CIRCLES.EVENTS.SEND_DATA_SYNC, data);
    }
  });
});

//let's create a research namespace.
//This will definitely need to be redone if we run more than one experiemnet on this server at a time in the future
if (env.ENABLE_RESEARCH_MODE) {
  var rnsp = io.of(CIRCLES.CONSTANTS.WS_NSP_RESEARCH);
  rnsp.on("connection", socket => {
    console.log("research websockets connected", socket.id);

    //research socket events
    
    const researchUtils = require('./modules/research-utils');

    socket.on(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, (data) => {
      console.log('CIRCLES RESEARCH EVENT: '+ data.event_type);

      switch (data.event_type) {
        case CIRCLES.RESEARCH.EVENT_TYPE.CONNECTED: {
          console.log('CIRCLES.RESEARCH.EVENT_TYPE.CONNECTED:' + data.room);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_PREPARE: {
          researchUtils.startExperiment(data);
          io.of(CIRCLES.CONSTANTS.WS_NSP_RESEARCH).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_START: {
          //start trials

          //send out new trial
          const newData = researchUtils.getNextTrial();

          //if no new trial then all trials complete, end experiment
          if (newData === null) {
            //creating new object as data may not be valid
            const eData         = CIRCLES.RESEARCH.createExpData();
            eData.event_type    = CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP;
            researchUtils.stopExperiment(eData);
            eData.and = {downloadURL:researchUtils.getDownloadLink()};
            io.of(CIRCLES.CONSTANTS.WS_NSP_RESEARCH).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, eData);
          } else {
            newData.event_type  = data.event_type
            newData.exp_id      = data.exp_id
            newData.user_id     = data.user_id
            newData.user_type   = data.user_type
            
            io.of(CIRCLES.CONSTANTS.WS_NSP_RESEARCH).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, newData);
          }
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP: {
          researchUtils.stopExperiment(data);
          data.and = {downloadURL:researchUtils.getDownloadLink()};
          io.of(CIRCLES.CONSTANTS.WS_NSP_RESEARCH).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_START: {
          researchUtils.startSelection(data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_STOP: {
          researchUtils.stopSelection(data);

          //if no new trial then all trials complete, end experiment
          const newData = researchUtils.getNextTrial();
          if (newData === null) {
            const eData         = CIRCLES.RESEARCH.createExpData();
            eData.event_type    = CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP;
            researchUtils.stopExperiment(eData);
            eData.and = {downloadURL:researchUtils.getDownloadLink()};
            io.of(CIRCLES.CONSTANTS.WS_NSP_RESEARCH).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, eData);
          } else {
            newData.event_type  = CIRCLES.RESEARCH.EVENT_TYPE.NEW_TRIAL;
            newData.exp_id      = data.exp_id
            newData.user_id     = data.user_id
            newData.user_type   = data.user_type

            io.of(CIRCLES.CONSTANTS.WS_NSP_RESEARCH).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, newData);
          } 
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_PAUSE: {
          // researchUtils.pauseExperiment(data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_UNPAUSE: {
          // researchUtils.unpauseExperiment(data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_ERROR: {
          researchUtils.noteSelectionError(data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.TRANSFORM_UPDATE: {
          // not implemented yet
          // socket.to(curRoom).broadcast.emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, data);
        }
        break;
      }
    });
  });
}

//lets start up
server.listen(env.SERVER_PORT, () => {
  console.log("Listening on http port: " + env.SERVER_PORT );
});

app.set('views', './views');
app.set('view engine', 'pug');
