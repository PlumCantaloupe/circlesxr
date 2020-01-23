'use strict';

AFRAME.registerComponent('circles-avatar-rig-construction', {
  schema: {
  },

  init: function() {
    this.el.emit(CIRCLES.EVENTS.AVATAR_RIG_LOADED, {element: this.el}, true);
  }
});