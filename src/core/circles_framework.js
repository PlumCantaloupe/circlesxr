'use strict';

//documentation of url query params we are expected (better place someday)
//These params elp us to pass information between pages

//__USER_TRAITS__
//name        : avatar username
//height      : avatar height

//__APPEARANCE__
//head        : head model(GLTF) url
//hair        : hair model(GLTF) url
//body        : body model(GLTF) url
//head_col    : head color in the rgb(255,255,255) format
//hair_col    : hair color in the rgb(255,255,255) format
//body_col    : body color in the rgb(255,255,255) format

//__
//group       : the "group" we belong to. All users with the same group can see each other
//last_route  : last route that we traversed from using the circles-portal component
//dressed     : true/false that states whether the user visited "wardrobe" area yet

const CONSTANTS = require('./circles_constants');
const UTILS     = require('./circles_utils');
const RESEARCH  = require('./circles_research');

let circlesWebsocket = null;
let circlesResearchWebsocket = null;
let warningLogsEnabled = true;
let basicLogsEnabled = true;
let errorLogsEnabled = true;
let circlesWebsocketConnectTime = 0;

const DISPLAY_MODES = {
  MODE_AVATAR       : 0,
  MODE_BOUNDINGBOX  : 1,
  MODE_HYBRID       : 2
}

const USER_COLLISION_STATE = {
  NO_COLLISION    : 0,
  FAR_COLLISION   : 1,
  NEAR_COLLISION  : 2,
  COLLISION       : 3
}

const MODEL_TYPE = {
  HEAD        : 'HEAD',
  HAIR        : 'HAIR',
  BODY        : 'BODY',
  HAND_LEFT   : 'HAND_LEFT',
  HAND_RIGHT  : 'HAND_RIGHT'
};

const MODEL_FORMAT = {
  GLTF  : 'GLTF',
  OBJ   : 'OBJ',
  NONE  : 'NONE'
};

const USER_TYPE = {
  STUDENT     : 'Student',
  TEACHER     : 'Teacher',
  RESEARCHER  : 'Researcher',
  PARTICIPANT : 'Participant',
  TESTER      : 'TESTER',
  NONE        : 'NONE',
};

const MODEL_HEAD_TYPE = {
  head_0   : '/global/assets/models/gltf/head/Head_Circle.glb',
  head_1   : '/global/assets/models/gltf/head/Head_Jaw.glb',
  head_2   : '/global/assets/models/gltf/head/Head_Oval.glb',
  head_3   : '/global/assets/models/gltf/head/Head_Square.glb',
  head_4   : '/global/assets/models/gltf/head/Head_Thin.glb',
};

const MODEL_HAIR_TYPE = {
  hair_0   : '/global/assets/models/gltf/hair/Hair_Curly.glb',
  hair_1   : '/global/assets/models/gltf/hair/Hair_Long.glb',
  hair_2   : '/global/assets/models/gltf/hair/Hair_PonyTail.glb',
  hair_3   : '/global/assets/models/gltf/hair/Hair_Hat.glb',
  hair_4   : '/global/assets/models/gltf/hair/Hair_Hat_OpenXR.glb',
  hair_5   : '/global/assets/models/gltf/hair/Hair_Hat_Aframe.glb'
};

const MODEL_BODY_TYPE = {
  body_0  : '/global/assets/models/gltf/body/Body_Belly.glb',
  body_1  : '/global/assets/models/gltf/body/Body_Hourglass.glb',
  body_2  : '/global/assets/models/gltf/body/Body_Rectangle.glb',
  body_3  : '/global/assets/models/gltf/body/Body_Strong.glb',
  body_4  : '/global/assets/models/gltf/body/Body_Thin.glb',
};

const EVENTS = {
  READY                     : 'CIRCLES_READY',
  CAMERA_ATTACHED           : 'CAMERA_ATTACHED',
  OBJECT_HIGHLIGHT_LOADED   : 'OBJECT_HIGHLIGHT_LOADED',
  AVATAR_LOADED             : 'AVATAR_LOADED',
  AVATAR_RIG_LOADED         : 'AVATAR_RIG_LOADED',
  AVATAR_COSTUME_CHANGED    : 'AVATAR_COSTUME_CHANGED',
  CUSTOM_MAT_SET            : 'CUSTOM_MAT_SET',
  SELECT_THIS_OBJECT        : 'SELECT_THIS_OBJECT',
  PICKUP_THIS_OBJECT        : 'PICKUP_THIS_OBJECT',
  RELEASE_THIS_OBJECT       : 'RELEASE_THIS_OBJECT',
  RELEASE_THIS_OBJECT_PRE   : 'RELEASE_THIS_OBJECT_PRE',
  OBJECT_OWNERSHIP_GAINED   : 'OBJECT_OWNERSHIP_GAINED',
  OBJECT_OWNERSHIP_LOST     : 'OBJECT_OWNERSHIP_LOST',
  OBJECT_OWNERSHIP_CHANGED  : 'OBJECT_OWNERSHIP_CHANGED',
  OBJECT_NETWORKED_ATTACHED : 'OBJECT_NETWORKED_ATTACHED',
  OBJECT_NETWORKED_DETACHED : 'OBJECT_NETWORKED_DETACHED',
  WS_CONNECTED              : 'WS_CONNECTED',
  WS_RESEARCH_CONNECTED     : 'WS_RESEARCH_CONNECTED',
  REQUEST_DATA_SYNC         : 'REQUEST_DATA_SYNC',
  SEND_DATA_SYNC            : 'SEND_DATA_SYNC',
  RECEIVE_DATA_SYNC         : 'RECEIVE_DATA_SYNC',
  SYNC_OBJECT_RELEASE       : 'CIRCLES_SYNC_OBJECT_RELEASE',
  SYNC_OBJECT_PICKUP        : 'CIRCLES_SYNC_OBJECT_PICKUP',
  QUESTION_OBJECT_STATE     : 'CIRCLES_QUESTION_OBJECT_STATE',
  ANSWER_OBJECT_STATE       : 'CIRCLES_ANSWER_OBJECT_STATE',
  OBJECT_OWNER_GONE         : 'CIRCLES_OBJECT_OWNER_GONE',
  // OBJECT_CREATED            : 'CIRCLES_OBJECT_CREATED',
  // OBJECT_DESTROYED          : 'CIRCLES_OBJECT_DESTROYED',
};

const VR_PLATFORMS = {
  DESKTOP              : 'DESKTOP',
  MOBILE_PHONE         : 'MOBILE',
  MOBILE_TABLET        : 'MOBILE_TABLET',
  HMD_STANDALONE       : 'HMD_MOBILE',
  HMD_WIRED            : 'HMD_OTHER',
};

const NETWORKED_TEMPLATES = {
  AVATAR              : 'circles-user-template',
  INTERACTIVE_OBJECT  : 'circles-interactive-object-template',
  BASIC_OBJECT        : 'circles-basic-object-template',
  ARTEFACT            : 'circles-artefact-template',
  TEXT                : 'circles-text-template'
};

//!!DEPRE 8 color
const COLOR_PALETTE = {
  PEARL     : {r:255,  g:252,  b:250},
  TURQUOISE : {r:2,    g:191,  b:155},
  EMERALD   : {r:33,   g:211,  b:105},
  RIVER     : {r:43,   g:146,  b:223},
  AMETHYST  : {r:155,  g:71,   b:186},
  ASPHALT   : {r:51,   g:73,   b:96},
  SUNFLOWER : {r:243,  g:201,  b:3},
  CARROT    : {r:233,  g:126,  b:1},
  MANDARIN  : {r:233,  g:65,   b:4},
  OCEAN     : {r:30,   g:100,  b:230}
};

//from here: https://gist.github.com/jed/92883
const getUUID = function() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
};

//time that the socket connected
const getCirclesConnectTime = function() {
  return circlesWebsocketConnectTime;
}

const setupCirclesWebsocket = function() {
  // console.log('setupCirclesWebsocket');

  circlesWebsocketConnectTime = new Date();
  console.log(circlesWebsocketConnectTime);

  if (!circlesWebsocket) {
    if (NAF.connection.adapter.socket) {
      console.log('using NAF socket');
      circlesWebsocket = NAF.connection.adapter.socket;
      document.querySelector('a-scene').emit(CIRCLES.EVENTS.WS_CONNECTED);
    }
    else {
      console.log('creating socket');
      let socket = io();
      socket.on('connect', (userData) => {
        circlesWebsocket = socket;
        document.querySelector('a-scene').emit(CIRCLES.EVENTS.WS_CONNECTED);
      });
    }

    let rs_socket = io(CIRCLES.CONSTANTS.WS_NSP_RESEARCH);
    rs_socket.on('connect', (userData) => {
      circlesResearchWebsocket = rs_socket;
      document.querySelector('a-scene').emit(CIRCLES.EVENTS.WS_RESEARCH_CONNECTED);
    });
  }
  else {
    console.warn('CIRCLES: web socket already set up. Use CIRCLES.getCirclesWebsocket() to find it');
  }
};

const getCirclesWebsocket = function() {
  if ( !circlesWebsocket ) {
    console.warn('CIRCLES: web socket not set up. Use CIRCLES.setupCirclesWebSocket() to set up and listen for CIRCLES.EVENTS.WS_CONNECTED to flag ready');
  }
  return circlesWebsocket;
};

const getCirclesResearchWebsocket = function() {
  if ( !circlesResearchWebsocket ) {
    console.warn('[circles_framework]: web socket not set up. Use CIRCLES.setupCirclesWebSocket() to set up and listen for CIRCLES.EVENTS.WS_RESEARCH_CONNECTED to flag ready');
  }
  return circlesResearchWebsocket;
};

const getCirclesGroupName = function() {
  return getCirclesManagerComp().getRoom();
}

const getCirclesUserName = function() {
  return getCirclesManagerComp().getUser();
}

const getCirclesWorldName = function() {
  return getCirclesManagerComp().getWorld();
}

const getCirclesManagerElement = function() {
  return document.querySelector('[circles-manager]');
}

const getCirclesManagerComp = function() {
  return getCirclesManagerElement().components['circles-manager'];
}

const isReady = function() {
  return getCirclesManagerComp().isCirclesReady();
}

const isCirclesWebsocketReady = function() {
  return (circlesWebsocket) ? true : false;
}

const getMainCameraElement = function() {
  const elem = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID + 'Cam');
  if (!elem) {
    console.warn("[circles_framework]: make sure to access the camera after the CIRCLES.READY event has fired on the scene (or CIRCLES.isReady() is true).");
  }
  return elem;
}

const getAvatarElement = function() {
  const elem = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID).querySelector('.avatar');

  if (!elem) {
    console.warn("[circles_framework]: make sure to access the avatar after the CIRCLES.READY has fired on the scene.");
  }
  return elem;
}

const getAvatarHolderElementBody = function() {
  const elem = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID).querySelector('.head_holder');

  if (!elem) {
    console.warn("[circles_framework]: make sure to access the avatar after the CIRCLES.READY has fired on the scene.");
  }
  return elem;
}

const getAvatarRigElement = function() {
  const elem = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
  return elem;
}

const getCirclesSceneElement = function() {
  return document.querySelector('a-scene');
}

const getNAFAvatarElements = function() {
  return document.querySelectorAll('[circles-user-networked]');  //return all avatars being networked by NAF
}

const getAllNAFElements = function() {
  return document.querySelectorAll('[networked]');              //returns all NAF networked objects. You may have to dig into children for more detail.             
}

const getPickedUpElement = function() {
  return getCirclesManagerComp().pickedUpElem;             //returns reference to held element, or null if no held object on this player/client            
}

const getNonNetworkedID = function(elem) {
  return (elem.hasAttribute('circles-object-world')) ? elem.components['circles-object-world'].data.id : elem.id;             //returns reference to held element, or null if no held object on this player/client            
}

//CIRCLES.log(text);
const log = function(text) {
  if (basicLogsEnabled === true) {
    console.log(text);
  }
}
const enableLogs = function(enable) {
  basicLogsEnabled = enabled;
}

//CIRCLES.warn(text);
const warn = function(text) {
  if (warningLogsEnabled === true) {
    console.warn(text);
  }
}
const enableWarning = function(enable) {
  warningLogsEnabled = enabled;
}

//CIRCLES.error(text);
const error = function(text) {
  if (errorLogsEnabled === true) {
    console.error(text);
  }
}
const enableErrors = function(enable) {
  errorLogsEnabled = enabled;
}

const getVRPlatform = function() {
  let vr_platform = 'not_available';

  if (AFRAME.utils.device.checkHeadsetConnected() === true) {
    //alert('isVRDisplay!!!');
    vr_platform = VR_PLATFORMS.HMD_WIRED;
  }
  if (AFRAME.utils.device.isMobileVR() === true) {
    //alert('isMobileVR!!!');
    vr_platform = VR_PLATFORMS.HMD_STANDALONE;
  }
  else if (AFRAME.utils.device.isMobile() === true) {
    //alert('isMobile!!!');
    vr_platform = VR_PLATFORMS.MOBILE_PHONE;
  }
  else if (AFRAME.utils.device.isTablet() === true || AFRAME.utils.device.isMobileDeviceRequestingDesktopSite() === true ) {
    //alert('isTabletVR!!!');
    vr_platform = VR_PLATFORMS.MOBILE_TABLET;
  }
  else {
    //alert('isDesktop!!!');
    vr_platform = VR_PLATFORMS.DESKTOP;
  }

  return vr_platform
}

module.exports = {
  CONSTANTS,
  UTILS,
  RESEARCH,
  DISPLAY_MODES,
  USER_COLLISION_STATE,
  MODEL_TYPE,
  MODEL_FORMAT,
  USER_TYPE,
  MODEL_HEAD_TYPE,
  MODEL_HAIR_TYPE,
  MODEL_BODY_TYPE,
  EVENTS,
  NETWORKED_TEMPLATES,
  VR_PLATFORMS,
  COLOR_PALETTE,
  getUUID,
  getCirclesConnectTime,
  setupCirclesWebsocket,
  getCirclesWebsocket,
  getCirclesResearchWebsocket,
  getCirclesGroupName,
  getCirclesUserName,
  getCirclesWorldName,
  getCirclesManagerElement,
  getCirclesManagerComp,
  isReady,
  isCirclesWebsocketReady,
  getAvatarElement,
  getAvatarHolderElementBody,
  getAvatarRigElement,
  getMainCameraElement,
  getCirclesSceneElement,
  getNAFAvatarElements,
  getAllNAFElements,
  getPickedUpElement,
  getNonNetworkedID,
  log,
  enableLogs,
  warn,
  enableWarning,
  error,
  enableErrors,
  getVRPlatform
};
