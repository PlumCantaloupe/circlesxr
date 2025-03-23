'use strict';

//constants for managing the local storage
const LS_TELEPORT_PAD = 'isPadTransparent';
const LS_RECENT_ROOM = 'recentRoom';
const LS_GUIDING_TEXT= 'isGuidingText';
const LS_BLOOM= 'isBloom';

//local storage state default values
const DEFAULT_TELEPORT_PAD = false;
const DEFAULT_GUIDING_TEXT = false;
const DEFAULT_BLOOM = false;

//guiding text constants
const GUIDING_TEXT = {
  GUIDING_STATE: 'guiding',
  ERROR_STATE: 'error',
  TIMED_DISPLAY: 'timed',
  CONSTANT_DISPLAY: 'constant',
  TIMER_MS: 3000,
}

module.exports = {
  LS_TELEPORT_PAD,
  LS_RECENT_ROOM,
  LS_GUIDING_TEXT,
  LS_BLOOM,
  DEFAULT_TELEPORT_PAD,
  DEFAULT_GUIDING_TEXT,
  DEFAULT_BLOOM,
  GUIDING_TEXT
};
