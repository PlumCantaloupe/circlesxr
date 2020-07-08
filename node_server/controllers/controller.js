'use strict';

require('../../src/core/circles_server');
const mongoose = require('mongoose');
const User     = require('../models/user');
const Room     = require('../models/room');
const Model3D  = require('../models/model3D');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const dotenv   = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');

//load in config
let env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

// Parse the dot configs so that things like false are boolean, not strings
env = dotenvParseVariables(env.parsed);

exports.letsEncrypt = function (req, res, next) {
  let key = req.params.challengeHash;
  let val = null;
  let challengePath = path.resolve(__dirname + '/../public/certs/webroot/.well_known/acme-challenge/' + key);

  fs.readFileSync(challengePath, 'utf8', (err, data) => {
    if (err) {
      console.log(error);
    }
    else {
      res.send( data.toString());
    }
  });
};

exports.getAllUsers = function(req, res, next) {
  User.find({}, function(error, data) {
    if (error)
      res.send(error);
    res.json(data);
  });
};

exports.getUser = (req, res, next) => {
  User.findOne({username: req.params.username}, function(error, data) {
    if (error) {
      res.send(error);
    }
    res.json(data);
  });
};

//!!TODO: look this over
exports.updateUser = (req, res, next) => {
  User.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, function(error, data) {
    if (error) {
      res.send(error);
    }
    res.json(data);
  });
};

exports.deleteUser = (req, res, next) => {
  User.remove({username: req.params.username}, function(error, data) {
    if (error) {
      res.send(error);
    }
    res.json({ message: 'User successfully deleted' });
  });
};

exports.updateUser = (req, res, next) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  else {
    console.log('updating user info.');

    if (req.body.password !== req.body.passwordConf) {
      var error = new Error('Passwords do not match.');
      error.status = 400;
      res.send("passwords dont match");
      return next(error);
    }

    //Mongoose promises http://mongoosejs.com/docs/promises.html
    const promises = [
      Model3D.findOne({name: req.body.headModel}).exec(),
      Model3D.findOne({name: req.body.hairModel}).exec(),
      Model3D.findOne({name: req.body.bodyModel}).exec(),
      Model3D.findOne({name: req.body.handLeftModel}).exec(),
      Model3D.findOne({name: req.body.handRightModel}).exec(),
      User.findOne({_id:req.user._id}).exec()
    ];

    Promise.all(promises).then( (results) => {
      //add properties dynamically after, depending on what was updated ...
      const userData = {};

      //console.log(results);

      //basic info
      if ( req.body.firstname !== results[5].firstname ) {
        userData.firstname = req.body.firstname;
      }

      if ( req.body.lastname !== results[5].lastname ) {
        userData.lastname = req.body.lastname;
      }

      if ( req.body.email !== results[5].email ) {
        userData.email = req.body.email;
      }

      //check to make sure passwords match better some day far away ....
      if ( results[0].url !== results[5].gltf_head_url ) {
        userData.gltf_head_url = results[0].url;
      }

      //paths to models
      if ( results[1].url !== results[5].gltf_hair_url ) {
        userData.gltf_hair_url = results[1].url;
      }

      if ( results[2].url !== results[5].gltf_body_url ) {
        userData.gltf_body_url = results[2].url;
      }

      if ( results[3].url !== results[5].gltf_hand_left_url ) {
        userData.gltf_hand_left_url = results[3].url;
      }

      if ( results[4].url !== results[5].gltf_hand_right_url ) {
        userData.gltf_hand_right_url = results[4].url;
      }

      //colors
      if ( req.body.color_head !== results[5].color_head ) {
        userData.color_head = req.body.color_head;
      }

      if ( req.body.color_hair !== results[5].color_hair ) {
        userData.color_hair = req.body.color_hair;
      }

      if ( req.body.color_body !== results[5].color_body ) {
        userData.color_body = req.body.color_body;
      }

      if ( req.body.color_hand_left !== results[5].color_hand_left ) {
        userData.color_hand_left = req.body.color_hand_left;
      }

      if ( req.body.color_hand_right !== results[5].color_hand_right ) {
        userData.color_hand_right = req.body.color_hand_right;
      }

      User.findOneAndUpdate({_id:req.user._id}, userData, {new:true}, function (error, user) {
        //User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          return res.redirect('/profile');
        }
      });
    }).catch(function(err){
      console.log(err);
    });
  }
};

exports.serveWorld = (req, res, next) => {
  const worldName = req.params.world_id;
  const user = req.user;
  const pathStr = path.resolve(__dirname + '/../public/worlds/' + worldName + '/index.html');

  // Ensure the world file exists
  fs.readFile(pathStr, {encoding: 'utf-8'}, (error, data) => {
    if (error) {
      return res.redirect('/profile');
    }
    else {
      let specialStatus = '';

      if (user.usertype === CIRCLES.USER_TYPE.TEACHER) {
        specialStatus = '*';
      }
      else if (user.usertype === CIRCLES.USER_TYPE.RESEARCHER) {
        specialStatus = '**';
      }

      let result = data.replace(/__WORLDNAME__/g, worldName);
      result = result.replace(/__USERTYPE__/g, user.usertype);
      result = result.replace(/__USERNAME__/g, user.username + specialStatus);

      result = result.replace(/__MODEL_HEAD__/g,  '/' + user.gltf_head_url);
      result = result.replace(/__MODEL_HAIR__/g,  '/' + user.gltf_hair_url);
      result = result.replace(/__MODEL_BODY__/g,  '/' + user.gltf_body_url);
      result = result.replace(/__COLOR_HEAD__/g,  user.color_head);
      result = result.replace(/__COLOR_HAIR__/g,  user.color_hair);
      result = result.replace(/__COLOR_BODY__/g,  user.color_body);
      result = result.replace(/__FACE_MAP__/g,    CIRCLES.CONSTANTS.DEFAULT_FACE_HAPPY_MAP);
      result = result.replace(/__USER_HEIGHT__/g, CIRCLES.CONSTANTS.DEFAULT_USER_HEIGHT);

      // Replace room ID with generic explore name too keep the HTML output
      // clean
      result = result.replace(/__ROOM_NAME__/g, 'explore');

      res.set('Content-Type', 'text/html');
      res.end(result); //not sure exactly why res.send doesn't work here ...
    }
  });
};

exports.serveProfile = (req, res, next) => {
  // Route now authenticates and ensures a user is logged in by this point
  let user = req.user;

  //Mongoose promises http://mongoosejs.com/docs/promises.html
  const promises = [
    Model3D.find({type: CIRCLES.MODEL_TYPE.HEAD}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAIR}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.BODY}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAND_LEFT}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAND_RIGHT}).exec(),
    user.getAccessibleRooms()
  ];

  const queryChecks = [
    user.gltf_head_url,
    user.gltf_hair_url,
    user.gltf_body_url,
    user.gltf_hand_left_url,
    user.gltf_hand_right_url,
  ];

  Promise.all(promises).then((results) => {
    let optionStrs = [];   //save all option str to replace after ...

    for ( let r = 0; r < results.length - 1; r++ ) {
      let optionsStr  = '';
      let models = results[r];
      for ( let i = 0; i < models.length; i++ ) {
        if (models[i].url === queryChecks[r]) {
          optionsStr += '<option selected>' + models[i].name + '</option>';
        }
        else {
          optionsStr += '<option>' + models[i].name + '</option>';
        }
      }
      optionStrs.push(optionsStr);
    }

    const userInfo = {
      userName: user.username,
      userType: user.usertype,
      firstName: user.firstname,
      lastName: user.lastname,
      email: user.email,
      headUrl: user.gltf_head_url,
      hairUrl: user.gltf_hair_url,
      bodyUrl: user.gltf_body_url,
      handLeftUrl: user.gltf_hand_left_url,
      handRightUrl: user.gltf_hand_right_url,
      headColor: user.color_head,
      hairColor: user.color_hair,
      bodyColor: user.color_body,
      handLeftColor: user.color_hand_left,
      handRightColor: user.color_hand_right,
    }

    const userOptions = {
      headOptions: optionStrs[0],
      hairOptions: optionStrs[1],
      bodyOptions: optionStrs[2],
      handLeftOptions: optionStrs[3],
      handRightOptions: optionStrs[4],
    }

    res.render(path.resolve(__dirname + '/../public/web/views/profile'), {
      title: `Welcome ${user.username}`,
      userInfo: userInfo,
      userOptions: userOptions,
      userRooms: results[5]
    });
  }).catch(function(err){
    console.log(err);
  });
};

exports.registerUser = (req, res, next) => {
  //!!
  console.log('disabling register feature for prototype'); 
  return next();
  //!!
  
  /*
  if (
    req.body.firstname &&
    req.body.lastname &&
    req.body.username &&
    req.body.email &&
    req.body.password &&
    req.body.passwordConf
  ) {
    // TODO: Improve this by returning to the page with an error flash message
    if (req.body.password !== req.body.passwordConf) {
      var error = new Error('Passwords do not match.');
      error.status = 400;
      res.send("passwords dont match");
      return next(error);
    }

    //Mongoose promises http://mongoosejs.com/docs/promises.html
    const promises = [
      Model3D.findOne({
        name: req.body.headModel
      }).exec(),
      Model3D.findOne({
        name: req.body.hairModel
      }).exec(),
      Model3D.findOne({
        name: req.body.bodyModel
      }).exec(),
      Model3D.findOne({
        name: req.body.handLeftModel
      }).exec(),
      Model3D.findOne({
        name: req.body.handRightModel
      }).exec()
    ];

    Promise.all(promises).then((results) => {
      const userData = {
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        gltf_head_url: results[0].url,
        gltf_hair_url: results[1].url,
        gltf_body_url: results[2].url,
        gltf_hand_left_url: results[3].url,
        gltf_hand_right_url: results[4].url,
        color_head: req.body.color_head,
        color_hair: req.body.color_hair,
        color_body: req.body.color_body,
        color_hand_left: req.body.color_hand_left,
        color_hand_right: req.body.color_hand_right,
      };

      User.create(userData, function (error, user) {
        if (error) {
          return next(error);
        } else {
          return next();
        }
      });
    }).catch(function (err) {
      return next(error);
    });
  } else {
    // Fallback to redirecting home if we're missing data so we don't just hang
    // on the submit page
    return res.redirect('/');
  }
  */
};

exports.serveRegister = (req, res, next) => {
  //Mongoose promises http://mongoosejs.com/docs/promises.html

  const promises = [
    Model3D.find({type: CIRCLES.MODEL_TYPE.HEAD}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAIR}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.BODY}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAND_LEFT}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAND_RIGHT}).exec()
  ];

  Promise.all(promises).then((results) => {
    let optionStrs = [];   //save all option str to replace after ...

    for ( let r = 0; r < results.length; r++ ) {
      let optionsStr  = '';
      let models = results[r];
      for ( let i = 0; i < models.length; i++ ) {
        if (i==0) {
          optionsStr += '<option selected>' + models[i].name + '</option>';
        }
        else {
          optionsStr += '<option>' + models[i].name + '</option>';
        }
      }
      optionStrs.push(optionsStr);
    }
    console.log(optionStrs);

    const userOptions = {
      headOptions: optionStrs[0],
      hairOptions: optionStrs[1],
      bodyOptions: optionStrs[2],
      handLeftOptions: optionStrs[3],
      handRightOptions: optionStrs[4],
    }

    res.render(path.resolve(__dirname + '/../public/web/views/register'), {
      title: `Register for Circles`,
      userOptions: userOptions,
    });
  }).catch(function(err){
    console.log(err);
  });

};


//test function to add models to dbs
exports.addModel3Ds = (req, res, next) => {
  addAvatarModels();
  return res.redirect('/');
};

//test function to add test users to dbs
exports.addUsers = (req, res, next) => {
  addTestUsers();
  return res.redirect('/');
};

exports.addAllTestData = (req, res, next) => {
  addAvatarModels();
  addTestUsers();
  return res.redirect('/');
};

exports.serveExplore = (req, res, next) => {
  res.render(path.resolve(__dirname + '/../public/web/views/explore'), {
    title: "Explore worlds",
  });
};

const addTestUsers = () => {
  let usersToAdd = new Array();

  /*
{ "_id" : ObjectId("5b4027ba3f07c7086c6caac3"), "username" : "FelixCat", "firstname" : "Felix", "lastname" : "cat", "email" : "felix@test.ca", "password" : "$2b$10$2lxGK4FoJMQCd/b8/nQkquUmARnZshYj.acNW7LGVql.V8BlmpQzS", "gltf_head_url" : "global/assets/models/gltf/head/Head_Jaw.glb", "gltf_hair_url" : "global/assets/models/gltf/hair/Hair_Curly.glb", "gltf_body_url" : "global/assets/models/gltf/body/Body_Strong.glb", "gltf_hand_left_url" : "global/assets/models/gltf/hands/left/Hand_Basic_L.glb", "gltf_hand_right_url" : "global/assets/models/gltf/hands/right/Hand_Basic_R.glb", "color_head" : "rgb(255, 255, 255)", "color_hair" : "rgb(255, 255, 255)", "color_body" : "rgb(255, 255, 255)", "color_hand_left" : "rgb(255, 255, 255)", "color_hand_right" : "rgb(255, 255, 255)", "__v" : 0 }
*/

  usersToAdd.push({
    username:               'Student1',
    usertype:               CIRCLES.USER_TYPE.STUDENT,
    firstname:              'Student',
    lastname:               '1',
    email:                  'student1@test.ca',
    password:               env.DEFAULT_PASSWORD,
    gltf_head_url:          'global/assets/models/gltf/head/Head_Circle.glb',
    gltf_hair_url:          'global/assets/models/gltf/hair/Hair_Hat.glb',
    gltf_body_url:          'global/assets/models/gltf/body/Body_Thin.glb',
    gltf_hand_left_url:     'global/assets/models/gltf/hands/left/Hand_Basic_L.glb',
    gltf_hand_right_url:    'global/assets/models/gltf/hands/left/Hand_Basic_R.glb',
    color_head:             'rgb(255, 209, 237)',
    color_hair:             'rgb(255, 255, 255)',
    color_body:             'rgb(92, 237, 255)',
    color_hand_right:       'rgb(255, 209, 237)',
    color_hand_left:        'rgb(255, 209, 237)',
  });

  usersToAdd.push({
    username:               'Student2',
    usertype:               CIRCLES.USER_TYPE.STUDENT,
    firstname:              'Student',
    lastname:               '2',
    email:                  'student2@test.ca',
    password:               env.DEFAULT_PASSWORD,
    gltf_head_url:          'global/assets/models/gltf/head/Head_Oval.glb',
    gltf_hair_url:          'global/assets/models/gltf/hair/Hair_PonyTail.glb',
    gltf_body_url:          'global/assets/models/gltf/body/Body_Hourglass.glb',
    gltf_hand_left_url:     'global/assets/models/gltf/hands/left/Hand_Basic_L.glb',
    gltf_hand_right_url:    'global/assets/models/gltf/hands/left/Hand_Basic_R.glb',
    color_head:             'rgb(59, 45, 37)',
    color_hair:             'rgb(10, 7, 5)',
    color_body:             'rgb(101, 255, 101)',
    color_hand_right:       'rgb(59, 45, 37)',
    color_hand_left:        'rgb(59, 45, 37)',
  });

  usersToAdd.push({
    username:               'Student3',
    usertype:               CIRCLES.USER_TYPE.STUDENT,
    firstname:              'Student',
    lastname:               '3',
    email:                  'student3@test.ca',
    password:               env.DEFAULT_PASSWORD,
    gltf_head_url:          'global/assets/models/gltf/head/Head_Jaw.glb',
    gltf_hair_url:          'global/assets/models/gltf/hair/Hair_Curly.glb',
    gltf_body_url:          'global/assets/models/gltf/body/Body_Strong.glb',
    gltf_hand_left_url:     'global/assets/models/gltf/hands/left/Hand_Basic_L.glb',
    gltf_hand_right_url:    'global/assets/models/gltf/hands/left/Hand_Basic_R.glb',
    color_head:             'rgb(237, 194, 122)',
    color_hair:             'rgb(222, 126, 20)',
    color_body:             'rgb(255, 42, 36)',
    color_hand_right:       'rgb(237, 194, 122)',
    color_hand_left:        'rgb(237, 194, 122)',
  });

  usersToAdd.push({
    username:               'Teacher1',
    usertype:               CIRCLES.USER_TYPE.TEACHER,
    firstname:              'Teacher',
    lastname:               '1',
    email:                  'teacher1@test.ca',
    password:               env.DEFAULT_PASSWORD,
    gltf_head_url:          'global/assets/models/gltf/head/Head_Oval.glb',
    gltf_hair_url:          'global/assets/models/gltf/hair/Hair_PonyTail.glb',
    gltf_body_url:          'global/assets/models/gltf/body/Body_Hourglass.glb',
    gltf_hand_left_url:     'global/assets/models/gltf/hands/left/Hand_Basic_L.glb',
    gltf_hand_right_url:    'global/assets/models/gltf/hands/left/Hand_Basic_R.glb',
    color_head:             'rgb(59, 45, 37)',
    color_hair:             'rgb(10, 7, 5)',
    color_body:             'rgb(101, 255, 101)',
    color_hand_right:       'rgb(59, 45, 37)',
    color_hand_left:        'rgb(59, 45, 37)',
  });

  usersToAdd.push({
    username:               'Researcher1',
    usertype:               CIRCLES.USER_TYPE.RESEARCHER,
    firstname:              'Researcher',
    lastname:               '1',
    email:                  'researcher1@test.ca',
    password:               env.DEFAULT_PASSWORD,
    gltf_head_url:          'global/assets/models/gltf/head/Head_Circle.glb',
    gltf_hair_url:          'global/assets/models/gltf/hair/Hair_Hat.glb',
    gltf_body_url:          'global/assets/models/gltf/body/Body_Thin.glb',
    gltf_hand_left_url:     'global/assets/models/gltf/hands/left/Hand_Basic_L.glb',
    gltf_hand_right_url:    'global/assets/models/gltf/hands/left/Hand_Basic_R.glb',
    color_head:             'rgb(237, 194, 122)',
    color_hair:             'rgb(23, 22, 21)',
    color_body:             'rgb(242, 246, 252)',
    color_hand_right:       'rgb(237, 194, 122)',
    color_hand_left:        'rgb(237, 194, 122)',
  });

  for (let i = 0; i < usersToAdd.length; i++) {
    User.findOne(usersToAdd[i], function(error, data) {
      if (error) {
        //res.send(error);
        console.log(error.message);
      }
      else {
        //add model
        User.create(usersToAdd[i], function (error, user) {
          if (error) {
            console.log(error.message);
          } else {
            console.log("successfully added test user: " + user.username);
          }
        });
      }
    });
  }

  console.log('added test models to db');
};

const addAvatarModels = () => {
  let modelsToAdd = new Array();

  //head
  modelsToAdd.push({
    name:           "Head_Circle",
    url:            'global/assets/models/gltf/head/Head_Circle.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Head_Jaw",
    url:            'global/assets/models/gltf/head/Head_Jaw.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Head_Oval",
    url:            'global/assets/models/gltf/head/Head_Oval.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Head_Square",
    url:            'global/assets/models/gltf/head/Head_Square.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Head_Thin",
    url:            'global/assets/models/gltf/head/Head_Thin.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  //hairs
  modelsToAdd.push({
    name:           "Hair_Curly",
    url:            'global/assets/models/gltf/hair/Hair_Curly.glb',
    type:           CIRCLES.MODEL_TYPE.HAIR,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Hair_Hat",
    url:            'global/assets/models/gltf/hair/Hair_Hat.glb',
    type:           CIRCLES.MODEL_TYPE.HAIR,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Hair_Long",
    url:            'global/assets/models/gltf/hair/Hair_Long.glb',
    type:           CIRCLES.MODEL_TYPE.HAIR,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Hair_PonyTail",
    url:            'global/assets/models/gltf/hair/Hair_PonyTail.glb',
    type:           CIRCLES.MODEL_TYPE.HAIR,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Hair_Bald",
    url:            "", //empty string - easy to compare later
    type:           CIRCLES.MODEL_TYPE.HAIR,
    format3D:       CIRCLES.MODEL_FORMAT.NONE //don't show/render
  });

  //bodies
  modelsToAdd.push({
    name:           "Body_Belly",
    url:            'global/assets/models/gltf/body/Body_Belly.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Body_HourGlass",
    url:            'global/assets/models/gltf/body/Body_Hourglass.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Body_Rectangle",
    url:            'global/assets/models/gltf/body/Body_Rectangle.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Body_Strong",
    url:            'global/assets/models/gltf/body/Body_Strong.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Body_Thin",
    url:            'global/assets/models/gltf/body/Body_Thin.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  //left hands
  modelsToAdd.push({
    name:           "Hand_L_Basic",
    url:            'global/assets/models/gltf/hands/left/Hand_Basic_L.glb',
    type:           CIRCLES.MODEL_TYPE.HAND_LEFT,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  //right hands
  modelsToAdd.push({
    name:           "Hand_R_Basic",
    url:            'global/assets/models/gltf/hands/right/Hand_Basic_R.glb',
    type:           CIRCLES.MODEL_TYPE.HAND_RIGHT,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  for (let i = 0; i < modelsToAdd.length; i++) {
    Model3D.findOne(modelsToAdd[i], function(error, data) {
      if (error) {
        //res.send(error);
        console.log(error.message);
      }
      else {
        //add model
        Model3D.create(modelsToAdd[i], function (error, model3D) {
          if (error) {
            console.log(error.message);
          } else {
            console.log("successfully added model: " + model3D.name);
          }
        });
      }
    });
  }

  console.log('added test models to db');
};
