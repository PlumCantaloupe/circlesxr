'use strict';

AFRAME.registerComponent('circles-avatar-construction', {
  schema: {
  },

  init: function() {
    this.el.emit(CIRCLES.EVENTS.AVATAR_LOADED, {element: this.el}, true);
  }
});