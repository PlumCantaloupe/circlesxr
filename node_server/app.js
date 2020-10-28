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

const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
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

  //research socket events
  if (env.ENABLE_RESEARCH_MODE) {
    const researchUtils = require('./modules/research-utils');

    socket.on(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, (data) => {
      console.log('CIRCLES RESEARCH EVENT: '+ data.event_type);

      switch (data.event_type) {
        case CIRCLES.RESEARCH.EVENT_TYPE.CONNECTED: {
          console.log('Research user connected, user_type:' + data.user_type + ' user_id:' + data.user_id);
          // data.event_type = CIRCLES.RESEARCH.EVENT_TYPE.NEW_TRIAL;
          // socket.to(curRoom).broadcast.emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_PREPARE: {
          researchUtils.startExperiment(data);
          io.in(curRoom).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, data);
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
            //eData.exp_id        = CONTEXT_COMP.experimentID; (will need to make sure we can run multiple experiments on teh same server someday ..)
            researchUtils.stopExperiment(eData);
            io.in(curRoom).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, eData);
          } else {
            newData.event_type  = data.event_type
            newData.exp_id      = data.exp_id
            newData.user_id     = data.user_id
            newData.user_type   = data.user_type
            
            io.in(curRoom).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, newData);
          }
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP: {
          researchUtils.stopExperiment(data);
          io.in(curRoom).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, data);
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
            //eData.exp_id        = CONTEXT_COMP.experimentID; (will need to make sure we can run multiple experiments on teh same server someday ..)
            researchUtils.stopExperiment(eData);
            io.in(curRoom).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, eData);
          } else {
            newData.event_type  = CIRCLES.RESEARCH.EVENT_TYPE.NEW_TRIAL;
            newData.exp_id      = data.exp_id
            newData.user_id     = data.user_id
            newData.user_type   = data.user_type

            io.in(curRoom).emit(CIRCLES.RESEARCH.EVENT_FROM_SERVER, newData);
          } 
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_PAUSE: {
          researchUtils.pauseExperiment(data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_UNPAUSE: {
          researchUtils.unpauseExperiment(data);
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
  }
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
