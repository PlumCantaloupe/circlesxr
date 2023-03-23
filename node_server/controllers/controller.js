'use strict';

require('../../src/core/circles_server');
const mongoose = require('mongoose');
const User     = require('../models/user');
const Model3D  = require('../models/model3D');
const path     = require('path');
const fs       = require('fs');
const crypto   = require('crypto');
const dotenv   = require('dotenv');
const url      = require('url');
const dotenvParseVariables = require('dotenv-parse-variables');
const jwt      = require('jsonwebtoken');
const { CONSTANTS } = require('../../src/core/circles_research');

//load in config
let env = dotenv.config({})
if (env.error) {
  throw 'Missing environment config. Copy .env.dist to .env and make any adjustments needed from the defaults';
}

// Parse the dot configs so that things like false are boolean, not strings
env = dotenvParseVariables(env.parsed);

// const getAllUsers = function(req, res, next) {
//   User.find({}, function(error, data) {
//     if (error) {
//       res.send(error);
//     }
//     res.json(data);
//   });
// };

// const getUser = (req, res, next) => {
//   User.findOne({username: req.params.username}, function(error, data) {
//     if (error) {
//       res.send(error);
//     }
//     res.json(data);
//   });
// };

// //!!TODO: look this over
// const updateUser = (req, res, next) => {
//   User.findOneAndUpdate({username: req.params.username}, req.body, {new: true}, function(error, data) {
//     if (error) {
//       res.send(error);
//     }
//     res.json(data);
//   });
// };

// const deleteUser = (req, res, next) => {
//   User.remove({username: req.params.username}, function(error, data) {
//     if (error) {
//       res.send(error);
//     }
//     res.json({ message: 'User successfully deleted' });
//   });
// };

const updateUserInfo = (req, res, next) => {
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

      // if ( results[3].url !== results[5].gltf_hand_left_url ) {
      //   userData.gltf_hand_left_url = results[3].url;
      // }

      // if ( results[4].url !== results[5].gltf_hand_right_url ) {
      //   userData.gltf_hand_right_url = results[4].url;
      // }

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

      let doc   = null;
      let error = null;
      async function updateItems() {
        try {
          doc = await User.findOneAndUpdate({_id:req.user._id}, userData, {new:true});
        } catch(err) {
          error = err;
        }
      }

      updateItems().then(function() {
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

const modifyServeWorld = (world_id, searchParamsObj, user, pathStr, req, res) => {
  // Ensure the world file exists
  fs.readFile(pathStr, {encoding: 'utf-8'}, (error, data) => {
    if (error) {
      return res.redirect('/profile');
    }
    else {
      let specialStatus = '';

      const u_name = ((searchParamsObj.has('name')) ? searchParamsObj.get('name') : user.firstname);
      const u_height = ((searchParamsObj.has('height')) ? searchParamsObj.get('height') : CIRCLES.CONSTANTS.DEFAULT_USER_HEIGHT);

      //need to get types if available in params
      //if not valid in params set to "nothing". Could be fun to be a floating head l ;)
      let head_type = ''
      if (searchParamsObj.has('head')) {
        head_type = CIRCLES.MODEL_HEAD_TYPE['head_' + searchParamsObj.get('head')];
        if (!head_type) {
          head_type = '';
        }
      }
      else {
        head_type = user.gltf_head_url;
      }

      let hair_type = ''
      if (searchParamsObj.has('hair')) {
        hair_type = CIRCLES.MODEL_HAIR_TYPE['hair_' + searchParamsObj.get('hair')];
        if (!hair_type) {
          hair_type = '';
        }
      }
      else {
        hair_type = user.gltf_hair_url;
      }

      let body_type = ''
      if (searchParamsObj.has('body')) {
        body_type = CIRCLES.MODEL_BODY_TYPE['body_' + searchParamsObj.get('body')];
        if (!body_type) {
          body_type = '';
        }
      }
      else {
        body_type = user.gltf_body_url;
      }

      const head_col = ((searchParamsObj.has('head_col')) ? searchParamsObj.get('head_col') : user.color_head);
      const hair_col = ((searchParamsObj.has('hair_col')) ? searchParamsObj.get('hair_col') : user.color_hair);
      const body_col = ((searchParamsObj.has('body_col')) ? searchParamsObj.get('body_col') : user.color_body);

      //to be added later
      // head_tex=0
      // body_tex=0
      
      if (user.usertype === CIRCLES.USER_TYPE.TEACHER) {
        specialStatus = ' (T)';
      }
      else if (user.usertype === CIRCLES.USER_TYPE.RESEARCHER) {
        specialStatus = ' (R)';
      }

      let result = data.replace(/__WORLDNAME__/g, world_id);
      result = result.replace(/__USERTYPE__/g, user.usertype);
      result = result.replace(/__VISIBLENAME__/g, u_name + specialStatus);
      result = result.replace(/__FACE_MAP__/g, CIRCLES.CONSTANTS.DEFAULT_FACE_HAPPY_MAP);

      result = result.replace(/__USER_HEIGHT__/g, u_height);
      result = result.replace(/__MODEL_HEAD__/g, head_type);
      result = result.replace(/__MODEL_HAIR__/g, hair_type);
      result = result.replace(/__MODEL_BODY__/g, body_type);
      result = result.replace(/__COLOR_HEAD__/g, head_col);
      result = result.replace(/__COLOR_HAIR__/g, hair_col);
      result = result.replace(/__COLOR_BODY__/g, body_col);

      // Replace room ID with generic explore name too keep the HTML output
      // clean
      result = result.replace(/__ROOM_NAME__/g, searchParamsObj.get('group'));

      res.set('Content-Type', 'text/html');
      res.end(result); //not sure exactly why res.send doesn't work here ...
    }
  });
};

const serveWorld = (req, res, next) => {
  //need to make sure we have the trailing slash to signify a folder so that relative links works correctly
  //https://stackoverflow.com/questions/30373218/handling-relative-urls-in-a-node-js-http-server 
  const splitURL = req.url.split('?');
  const baseURL = (splitURL.length > 0)?splitURL[0]:'';
  const urlParamsStr = (splitURL.length > 1)?splitURL[1]:'';

  if (splitURL.length > 0) {
    if (baseURL.charAt(baseURL.length - 1) !== '/') {
      const fixedURL = baseURL + "/"  + ((urlParamsStr === '')?'':'?' + urlParamsStr);
      res.writeHead(302, { "Location": fixedURL });
      res.end();
      return;
    }
  }

  //make sure there are the correct url seatch params available
  const urlObj = new URL(req.protocol + '://' + req.get('host') + req.originalUrl);
  const searchParamsObj = urlObj.searchParams;
  //if no group indicated then assume the group 'explore'
  if (!searchParamsObj.has('group')) {
    const fixedURL = baseURL + "?" + 'group=explore' + ((urlParamsStr === '')?'':'&' + urlParamsStr);
    res.writeHead(302, { "Location": fixedURL });
    res.end();
    return;
  }

  const world_id = req.params.world_id;
  const user = req.user;
  const pathStr = path.resolve(__dirname + '/../public/worlds/' + world_id + '/index.html');

  modifyServeWorld(world_id, searchParamsObj, user, pathStr, req, res);
};

const serveRelativeWorldContent = (req, res, next) => {
  //making it easier for devs as absolute paths are a pain to type in ...
  const worldID = req.params.world_id;
  const relURL = req.params[0];
  const newURL = '/worlds/' + worldID + '/' + relURL;
  return res.redirect(newURL);
};

const serveProfile = (req, res, next) => {
  // Route now authenticates and ensures a user is logged in by this point
  let user = req.user;

  //Mongoose promises http://mongoosejs.com/docs/promises.html
  const promises = [
    Model3D.find({type: CIRCLES.MODEL_TYPE.HEAD}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.HAIR}).exec(),
    Model3D.find({type: CIRCLES.MODEL_TYPE.BODY}).exec(),
    //Model3D.find({type: CIRCLES.MODEL_TYPE.HAND_LEFT}).exec(),
    //Model3D.find({type: CIRCLES.MODEL_TYPE.HAND_RIGHT}).exec()
  ];

  const queryChecks = [
    user.gltf_head_url,
    user.gltf_hair_url,
    user.gltf_body_url,
    //user.gltf_hand_left_url,
    //user.gltf_hand_right_url,
  ];

  Promise.all(promises).then((results) => {
    let optionStrs = [];   //save all option str to replace after ...

    for ( let r = 0; r < results.length; r++ ) {
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
      //handLeftUrl: user.gltf_hand_left_url,
      //handRightUrl: user.gltf_hand_right_url,
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
      //handLeftOptions: optionStrs[3],
      //handRightOptions: optionStrs[4],
    }

    res.render(path.resolve(__dirname + '/../public/web/views/profile'), {
      title: `Welcome ${user.username}`,
      userInfo: userInfo,
      userOptions: userOptions
    });
  }).catch(function(err){
    console.log(err);
  });
};

const registerUser = (req, res, next) => {
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

const serveRegister = (req, res, next) => {
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
const addModel3Ds = (req, res, next) => {
  addAvatarModels();
  return res.redirect('/');
};

//test function to add test users to dbs
const addUsers = (req, res, next) => {
  addTestUsers();
  return res.redirect('/');
};

const addAllTestData = (req, res, next) => {
  addAvatarModels();
  addTestUsers();
  return res.redirect('/');
};

const serveExplore = (req, res, next) => {
  // Route now authenticates and ensures a user is logged in by this point
  let user = req.user;

  const queryChecks = [
    user.gltf_head_url,
    user.gltf_hair_url,
    user.gltf_body_url,
    user.gltf_hand_left_url,
    user.gltf_hand_right_url,
  ];

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

  res.render(path.resolve(__dirname + '/../public/web/views/explore'), {
    title: "Explore Worlds",
    userInfo: userInfo
  });
};

const generateAuthLink = (email, baseURL, route, expiryTimeMin) => {
  const jwtOptions = {
    issuer: 'circlesxr.com',
    audience: 'circlesxr.com',
    algorithm: 'HS256',
    expiresIn: expiryTimeMin + 'm',
  };

  const token = jwt.sign({data:email}, env.JWT_SECRET, jwtOptions); //expects seconds as expiration
  return baseURL + '/magic-login?token=' + token + '&route=' + route;
};

const getMagicLinks = (req, res, next) => {
  const route = req.query.route;
  const usernameAsking  = req.query.usernameAsking;
  const emailAsking     = req.query.emailAsking;
  const userTypeAsking  = req.query.userTypeAsking;
  const expiryTimeMin   = req.query.expiryTimeMin;
  let allAccounts = [];

  //ignore req.protocol as it will try and re-direct to https anyhow.
  const baseURL = req.get('host');

  let users = null;
  let error = null;
  async function getItems() {
    try {
      users = await User.find({usertype: (userTypeAsking === CIRCLES.USER_TYPE.TEACHER) ? CIRCLES.USER_TYPE.STUDENT : CIRCLES.USER_TYPE.PARTICIPANT }).exec();
    } catch(err) {
      error = err;
    }
  }

  getItems().then(function() {
    if (error) {
      res.send(error);
    }

    //add "self" first
    allAccounts.push({username:usernameAsking, email:emailAsking, magicLink:generateAuthLink(emailAsking, baseURL, route, expiryTimeMin)});

    for (let i = 0; i < users.length; i++) {
      allAccounts.push({username:users[i].username, email:users[i].email, magicLink:generateAuthLink(users[i].email, baseURL, route, expiryTimeMin)});

      if (i === users.length - 1 ) {
        res.json(allAccounts);
      }
    }
  });
};

const loopAndGetFolderNames =  async (folderPath) => {
  let allSubFolderNames = [];
  // Get the files as an array
  let files = null;
  try{
    files = await fs.promises.readdir(folderPath);
  }
  catch(e) {
    console.log(e.message);
    return allSubFolderNames;
  }

  // Loop them all with the new for...of
  let worldName = "";
  for( const file of files ) {
      // Get the full paths
      const fullPath = path.join( folderPath, file );

      // Stat the file to see if we have a file or dir
      const stat = await fs.promises.stat( fullPath );

      if( stat.isDirectory() ) {
          //console.log( fullPath + " is a directory.");
          worldName = file;
          worldName.replace(folderPath, "");
          allSubFolderNames.push(file);
      }
  }
  allSubFolderNames.sort();

  return allSubFolderNames;
};

const getWorldsList = async (req, res, next) => {
  const folderPath = __dirname + '/../../src/worlds';
  loopAndGetFolderNames(folderPath).then(function(data) {
    res.json(data);
  });
}


const addTestUsers = () => {
  let usersToAdd  = [];
  let tenColors   = [ CIRCLES.COLOR_PALETTE.PEARL, CIRCLES.COLOR_PALETTE.TURQUOISE, CIRCLES.COLOR_PALETTE.EMERALD, CIRCLES.COLOR_PALETTE.RIVER, CIRCLES.COLOR_PALETTE.AMETHYST,
                      CIRCLES.COLOR_PALETTE.ASPHALT, CIRCLES.COLOR_PALETTE.SUNFLOWER, CIRCLES.COLOR_PALETTE.CARROT, CIRCLES.COLOR_PALETTE.MANDARIN, CIRCLES.COLOR_PALETTE.OCEAN];
  let threeColors = [CIRCLES.COLOR_PALETTE.SUNFLOWER, CIRCLES.COLOR_PALETTE.AMETHYST, CIRCLES.COLOR_PALETTE.RIVER];

  usersToAdd.push({
    username:               'Teacher1',
    usertype:               CIRCLES.USER_TYPE.TEACHER,
    firstname:              'Teacher',
    lastname:               '1',
    email:                  't1@circlesxr.com',
    password:               env.DEFAULT_PASSWORD,
    gltf_head_url:          '/global/assets/models/gltf/head/Head_Oval.glb',
    gltf_hair_url:          '/global/assets/models/gltf/hair/Hair_PonyTail.glb',
    gltf_body_url:          '/global/assets/models/gltf/body/Body_Hourglass.glb',
    //gltf_hand_left_url:     '/global/assets/models/gltf/hands/left/Hand_Basic_L.glb',
    //gltf_hand_right_url:    '/global/assets/models/gltf/hands/left/Hand_Basic_R.glb',
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
    email:                  'r1@circlesxr.com',
    password:               env.DEFAULT_PASSWORD,
    gltf_head_url:          '/global/assets/models/gltf/head/Head_Circle.glb',
    gltf_hair_url:          '/global/assets/models/gltf/hair/Hair_Hat.glb',
    gltf_body_url:          '/global/assets/models/gltf/body/Body_Thin.glb',
    //gltf_hand_left_url:     '/global/assets/models/gltf/hands/left/Hand_Basic_L.glb',
    //gltf_hand_right_url:    '/global/assets/models/gltf/hands/left/Hand_Basic_R.glb',
    color_head:             'rgb(237, 194, 122)',
    color_hair:             'rgb(23, 22, 21)',
    color_body:             'rgb(242, 246, 252)',
    color_hand_right:       'rgb(237, 194, 122)',
    color_hand_left:        'rgb(237, 194, 122)',
  });

  //add students
  for (let i = 0; i < tenColors.length; i++) {
    usersToAdd.push({
      username:               'Student' + i,
      usertype:               CIRCLES.USER_TYPE.STUDENT,
      firstname:              'Student',
      lastname:               i,
      email:                  's' + i + '@circlesxr.com',
      password:               env.DEFAULT_PASSWORD,
      gltf_head_url:          CIRCLES.CONSTANTS.DEFAULT_GLTF_HEAD,
      gltf_hair_url:          CIRCLES.CONSTANTS.DEFAULT_GLTF_HAIR,
      gltf_body_url:          CIRCLES.CONSTANTS.DEFAULT_GLTF_BODY,
      //gltf_hand_left_url:     CIRCLES.CONSTANTS.DEFAULT_GLTF_HAND_LEFT,
      //gltf_hand_right_url:    CIRCLES.CONSTANTS.DEFAULT_GLTF_HAND_RIGHT,
      color_head:             'rgb(' + tenColors[i].r + ',' + tenColors[i].g + ',' + tenColors[i].b + ')',
      color_hair:             'rgb(' + tenColors[i].r + ',' + tenColors[i].g + ',' + tenColors[i].b + ')',
      color_body:             'rgb(' + tenColors[i].r + ',' + tenColors[i].g + ',' + tenColors[i].b + ')',
      color_hand_right:       'rgb(' + tenColors[i].r + ',' + tenColors[i].g + ',' + tenColors[i].b + ')',
      color_hand_left:        'rgb(' + tenColors[i].r + ',' + tenColors[i].g + ',' + tenColors[i].b + ')',
    });
  }

  //add students
  for (let i = 0; i < threeColors.length; i++) {
    usersToAdd.push({
      username:               'Participant' + i,
      usertype:               CIRCLES.USER_TYPE.PARTICIPANT,
      firstname:              'Participant',
      lastname:               i,
      email:                  'p' + i + '@circlesxr.com',
      password:               env.DEFAULT_PASSWORD,
      gltf_head_url:          CIRCLES.CONSTANTS.DEFAULT_GLTF_HEAD,
      gltf_hair_url:          CIRCLES.CONSTANTS.DEFAULT_GLTF_HAIR,
      gltf_body_url:          CIRCLES.CONSTANTS.DEFAULT_GLTF_BODY,
      //gltf_hand_left_url:     CIRCLES.CONSTANTS.DEFAULT_GLTF_HAND_LEFT,
      //gltf_hand_right_url:    CIRCLES.CONSTANTS.DEFAULT_GLTF_HAND_RIGHT,
      color_head:             'rgb(' + threeColors[i].r + ',' + threeColors[i].g + ',' + threeColors[i].b + ')',
      color_hair:             'rgb(' + threeColors[i].r + ',' + threeColors[i].g + ',' + threeColors[i].b + ')',
      color_body:             'rgb(' + threeColors[i].r + ',' + threeColors[i].g + ',' + threeColors[i].b + ')',
      color_hand_right:       'rgb(' + threeColors[i].r + ',' + threeColors[i].g + ',' + threeColors[i].b + ')',
      color_hand_left:        'rgb(' + threeColors[i].r + ',' + threeColors[i].g + ',' + threeColors[i].b + ')',
    });
  }

  let user   = null;
  let error   = null;
  async function findUser(userToAdd) {
    try {
      user = await User.findOne(userToAdd).exec();
    } catch(err) {
      error = err;
    }

    error = null;
  }
  async function createUser(userToAdd) {
    try {
      user = await User.create(userToAdd);
    } catch(err) {
      error = err;
    }

    error = null;
  }

  for (let i = 0; i < usersToAdd.length; i++) {
    findUser(usersToAdd[i]).then(function() {
      if (error) {
        console.log("findUser error on [" + usersToAdd[i].username + "]: " + error.message);
      }
      else {
        //add model
        createUser(usersToAdd[i]).then(function() {
          if (error) {
            console.log("createUser error on [" + usersToAdd[i].username + "]: " + error.message);
          } else {
            console.log("successfully added test user: " + user.username);
          }

          error = null;
        });
      }

      error = null;
    });
  }

  console.log('added test users to database');
};

const addAvatarModels = () => {
  let modelsToAdd = new Array();

  //head
  modelsToAdd.push({
    name:           "Head_Circle",
    url:            '/global/assets/models/gltf/head/Head_Circle.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Head_Jaw",
    url:            '/global/assets/models/gltf/head/Head_Jaw.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Head_Oval",
    url:            '/global/assets/models/gltf/head/Head_Oval.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Head_Square",
    url:            '/global/assets/models/gltf/head/Head_Square.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Head_Thin",
    url:            '/global/assets/models/gltf/head/Head_Thin.glb',
    type:           CIRCLES.MODEL_TYPE.HEAD,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  //hairs
  modelsToAdd.push({
    name:           "Hair_Curly",
    url:            '/global/assets/models/gltf/hair/Hair_Curly.glb',
    type:           CIRCLES.MODEL_TYPE.HAIR,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Hair_Hat",
    url:            '/global/assets/models/gltf/hair/Hair_Hat.glb',
    type:           CIRCLES.MODEL_TYPE.HAIR,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Hair_Long",
    url:            '/global/assets/models/gltf/hair/Hair_Long.glb',
    type:           CIRCLES.MODEL_TYPE.HAIR,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Hair_PonyTail",
    url:            '/global/assets/models/gltf/hair/Hair_PonyTail.glb',
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
    url:            '/global/assets/models/gltf/body/Body_Belly.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Body_HourGlass",
    url:            '/global/assets/models/gltf/body/Body_Hourglass.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Body_Rectangle",
    url:            '/global/assets/models/gltf/body/Body_Rectangle.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Body_Strong",
    url:            '/global/assets/models/gltf/body/Body_Strong.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  modelsToAdd.push({
    name:           "Body_Thin",
    url:            '/global/assets/models/gltf/body/Body_Thin.glb',
    type:           CIRCLES.MODEL_TYPE.BODY,
    format3D:       CIRCLES.MODEL_FORMAT.GLTF
  });

  let model   = null;
  let error   = null;
  async function findModel(modelToAdd) {
    try {
      model = await Model3D.findOne(modelToAdd).exec();
    } catch(err) {
      error = err;
    }
  }
  async function createModel(modelToAdd) {
    try {
      model = await Model3D.create(modelToAdd);
    } catch(err) {
      error = err;
    }
  }

  for (let i = 0; i < modelsToAdd.length; i++) {
    findModel(modelsToAdd[i]).then(function() {
      if (error) {
        console.log("findModel error on [" + modelsToAdd[i].name + "]: " + error.message);
      }
      else {
        //add model
        createModel(modelsToAdd[i]).then(function() {
          if (error) {
            console.log("createModel error on [" + modelsToAdd[i].name + "]: " + error.message);
          } else {
            console.log("successfully added model: " + model.name);
          }
        });
      }
    });
  }

  console.log('added test models to database');
};

module.exports = {
  // getAllUsers,
  // getUser,
  // updateUser,
  // deleteUser,
  updateUserInfo,
  modifyServeWorld,
  serveWorld,
  serveRelativeWorldContent,
  serveProfile,
  registerUser,
  serveRegister,
  addModel3Ds,
  addUsers,
  addAllTestData,
  serveExplore,
  generateAuthLink,
  getMagicLinks,
  getWorldsList,
};