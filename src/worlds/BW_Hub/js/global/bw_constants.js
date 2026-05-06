'use strict';

let BRAINWAVES = window.BRAINWAVES || {};

//constants for managing the local storage
BRAINWAVES.LS_TELEPORT_PAD = 'isPadTransparent';
BRAINWAVES.LS_RECENT_ROOM = 'recentRoom';
BRAINWAVES.LS_GUIDING_TEXT = 'isGuidingText';
BRAINWAVES.LS_BLOOM = 'isBloom';

//local storage state default values
BRAINWAVES.DEFAULT_TELEPORT_PAD = false;
BRAINWAVES.DEFAULT_GUIDING_TEXT = false;
BRAINWAVES.DEFAULT_BLOOM = false;

//guiding text constants
BRAINWAVES.GUIDING_TEXT = {
  HIDDEN: 'none',
  SHOW: 'flex',
  TIMER_MS: 3000,
};
