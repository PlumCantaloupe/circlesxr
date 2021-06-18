'use strict';

const MAX_USERS                     = 30;
const DEFAULT_USER_HEIGHT           = 1.6;
const SERVER_UPDATE_INTERVAL_MS     = 50;
const SHOW_DEBUG_LOGS               = false;
const USER_COLLISION_RADIUS         = 1.5;
const USER_COLLISION_NEAR_RADIUS    = 2.25;
const USER_COLLISION_FAR_RADIUS     = 3.0;
const USER_COLLISION_RADIUS_SQ      = USER_COLLISION_RADIUS * USER_COLLISION_RADIUS;
const USER_COLLISION_NEAR_RADIUS_SQ = USER_COLLISION_NEAR_RADIUS * USER_COLLISION_NEAR_RADIUS;
const USER_COLLISION_FAR_RADIUS_SQ  = USER_COLLISION_FAR_RADIUS * USER_COLLISION_FAR_RADIUS;

const PRIMARY_USER_ID         = 'Player1';

const WS_NSP_RESEARCH         = '/WS_NSP_RESEARCH';

const CIRCLES_WEBRTC_ENABLED  = 'REPLACE_CIRCLES_WEBRTC_ENABLED_REPLACE';
const CIRCLES_MIC_ENABLED     = 'REPLACE_CIRCLES_MIC_ENABLED_REPLACE';

const AUTH_TOKEN_EXPIRATION_MINUTES = 15;

//models
const DEFAULT_GLTF_HEAD       = '/global/assets/models/gltf/head/Head_Circle.glb';
const DEFAULT_GLTF_HAIR       = '';
const DEFAULT_GLTF_BODY       = '/global/assets/models/gltf/body/Body_Rectangle.glb';
const DEFAULT_GLTF_HAND_LEFT  = '/global/assets/models/gltf/hands/left/Hand_Basic_L.glb';
const DEFAULT_GLTF_HAND_RIGHT = '/global/assets/models/gltf/hands/right/Hand_Basic_R.glb';
const DEFAULT_USER_BOUNDARY   = '/global/assets/models/gltf/User_Boundary.glb';

//textures
const DEFAULT_ENV_MAP         = '/global/assets/textures/equirectangular/WhiteBlue.jpg';
const DEFAULT_WIREFRAME_MAP   = '/global/assets/textures/wireframe.png';
const DEFAULT_FACE_HAPPY_MAP  = '/global/assets/textures/facialExpressions/Happy.png';

const ICON_DEVICE_DESKTOP     = '/global/assets/textures/icons/Icon_Device-Desktop.png';
const ICON_DEVICE_MOBILE      = '/global/assets/textures/icons/Icon_Device-Mobile.png';
const ICON_DEVICE_HMD3DOF     = '/global/assets/textures/icons/Icon_Device-HMD3DOF.png';
const ICON_DEVICE_HMD6DOF     = '/global/assets/textures/icons/Icon_Device-HMD6DOF.png';
const ICON_DEVICE_UNKNOWN     = '/global/assets/textures/icons/Icon_Device-Unknown.png';
const ICON_ROTATE             = '/global/assets/textures/icons/Icon-Rotate.png';
const ICON_ZOOM               = '/global/assets/textures/icons/Icon-Zoom.png';
const ICON_RELEASE            = '/global/assets/textures/icons/Icon-Release.png';

const DEFAULT_CHECKPOINT_COLOR  = 'rgb(57, 187, 130)';
const DEFAULT_SNAP_TURN_DEG     = 30.0;

//camera controls
const CONTROLS_OFFSET_Z         = -1.5;
const CONTROLS_SNAP_ROTATE      = 90.0;
const CONTROLS_SNAP_TRANSLATE   = 1.0;

const GUI = {
  material_bg_basic : {color:'rgb(255,255,255)', opacity:0.9, shader:'flat', transparent:true, side:'double'},
  rounded_rectangle_radius: 0.15,
  text_z_pos: 0.01,
  font_body: '/global/assets/fonts/Roboto-msdf.json',
  font_header: '/global/assets/fonts/Roboto-msdf.json'
};

module.exports = {
  MAX_USERS,
  DEFAULT_USER_HEIGHT,
  SERVER_UPDATE_INTERVAL_MS,
  SHOW_DEBUG_LOGS,
  USER_COLLISION_RADIUS,
  USER_COLLISION_NEAR_RADIUS,
  USER_COLLISION_FAR_RADIUS,
  USER_COLLISION_RADIUS_SQ,
  USER_COLLISION_NEAR_RADIUS_SQ,
  USER_COLLISION_FAR_RADIUS_SQ,
  PRIMARY_USER_ID,
  WS_NSP_RESEARCH,
  CIRCLES_WEBRTC_ENABLED,
  CIRCLES_MIC_ENABLED,
  AUTH_TOKEN_EXPIRATION_MINUTES,
  DEFAULT_GLTF_HEAD,
  DEFAULT_GLTF_HAIR,
  DEFAULT_GLTF_BODY,
  DEFAULT_GLTF_HAND_LEFT,
  DEFAULT_GLTF_HAND_RIGHT,
  DEFAULT_USER_BOUNDARY,
  DEFAULT_ENV_MAP,
  DEFAULT_WIREFRAME_MAP,
  DEFAULT_FACE_HAPPY_MAP,
  DEFAULT_CHECKPOINT_COLOR,
  DEFAULT_SNAP_TURN_DEG,
  ICON_DEVICE_DESKTOP,
  ICON_DEVICE_MOBILE,
  ICON_DEVICE_HMD3DOF,
  ICON_DEVICE_HMD6DOF,
  ICON_DEVICE_UNKNOWN,
  ICON_ROTATE,
  ICON_ZOOM,
  ICON_RELEASE,
  CONTROLS_OFFSET_Z,
  CONTROLS_SNAP_ROTATE,
  CONTROLS_SNAP_TRANSLATE,
  GUI
};
