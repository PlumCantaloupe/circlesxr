'use strict';

const CONSTANTS = require('./circles_constants');

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
  GLTF : 'GLTF',
  OBJ : 'OBJ',
  NONE : 'NONE'
};

const EVENTS = {
  CAMERA_ATTACHED         : 'CAMERA_ATTACHED',
  OBJECT_HIGHLIGHT_LOADED : 'OBJECT_HIGHLIGHT_LOADED',
  AVATAR_LOADED           : 'AVATAR_LOADED',  
  AVATAR_RIG_LOADED       : 'AVATAR_RIG_LOADED',
  CUSTOM_MAT_SET          : 'CUSTOM_MAT_SET',
  SELECT_THIS_OBJECT      : 'SELECT_THIS_OBJECT',
  INSPECT_THIS_OBJECT     : 'INSPECT_THIS_OBJECT',
  RELEASE_THIS_OBJECT     : 'RELEASE_THIS_OBJECT',
  OBJECT_LABEL_LOADED     : 'OBJECT_LABEL_LOADED',
  OBJECT_OWNERSHIP_GAINED : 'OBJECT_OWNERSHIP_GAINED',
  OBJECT_OWNERSHIP_LOST   : 'OBJECT_OWNERSHIP_LOST',
  OBJECT_OWNERSHIP_CHANGED: 'OBJECT_OWNERSHIP_CHANGED',
};

//!!DEPRE 8 color
const COLOR_PALETTES = [
  {name: 'turquoise', r:2,    g:191,  b:155,  beingUsed:false},
  {name: 'emerald',   r:33,   g:211,  b:105,  beingUsed:false},
  {name: 'river',     r:43,   g:146,  b:223,  beingUsed:false},
  {name: 'amethyst',  r:155,  g:71,   b:186,  beingUsed:false},
  {name: 'asphalt',   r:51,   g:73,   b:96,   beingUsed:false},
  {name: 'sunflower', r:243,  g:201,  b:3,    beingUsed:false},
  {name: 'carrot',    r:233,  g:126,  b:1,    beingUsed:false},
  {name: 'mandarin',  r:233,  g:65,   b:46,   beingUsed:false}
];

module.exports = {
  CONSTANTS,
  DISPLAY_MODES,
  USER_COLLISION_STATE,
  MODEL_TYPE,
  MODEL_FORMAT,
  EVENTS,
  COLOR_PALETTES
};
