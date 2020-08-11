'use strict';

const CONSTANTS = require('./circles_constants');
const RESEARCH  = require('./circles_research');

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
  NONE        : 'NONE',
};

const EVENTS = {
  CAMERA_ATTACHED           : 'CAMERA_ATTACHED',
  OBJECT_HIGHLIGHT_LOADED   : 'OBJECT_HIGHLIGHT_LOADED',
  AVATAR_LOADED             : 'AVATAR_LOADED',  
  AVATAR_RIG_LOADED         : 'AVATAR_RIG_LOADED',
  AVATAR_COSTUME_CHANGED    : 'AVATAR_COSTUME_CHANGED',
  CUSTOM_MAT_SET            : 'CUSTOM_MAT_SET',
  SELECT_THIS_OBJECT        : 'SELECT_THIS_OBJECT',
  INSPECT_THIS_OBJECT       : 'INSPECT_THIS_OBJECT',
  RELEASE_THIS_OBJECT       : 'RELEASE_THIS_OBJECT',
  OBJECT_LABEL_LOADED       : 'OBJECT_LABEL_LOADED',
  OBJECT_OWNERSHIP_GAINED   : 'OBJECT_OWNERSHIP_GAINED',
  OBJECT_OWNERSHIP_LOST     : 'OBJECT_OWNERSHIP_LOST',
  OBJECT_OWNERSHIP_CHANGED  : 'OBJECT_OWNERSHIP_CHANGED',
  OBJECT_NETWORKED_ATTACHED : 'OBJECT_NETWORKED_ATTACHED',
  NAF_CONNECTED             : 'NAF_CONNECTED'
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
  MANDARIN  : {r:233,  g:65,   b:4}
};

//from here: https://gist.github.com/jed/92883
const getUUID = function() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}; 

module.exports = {
  CONSTANTS,
  RESEARCH,
  DISPLAY_MODES,
  USER_COLLISION_STATE,
  MODEL_TYPE,
  MODEL_FORMAT,
  USER_TYPE,
  EVENTS,
  COLOR_PALETTE,
  getUUID
};
