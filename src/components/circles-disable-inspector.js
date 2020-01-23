'use strict';

//may want to use this for production code. Meant to be put on scene (doesn't seem to work elsewhere)
AFRAME.registerComponent('circles-disable-inspector', {
  dependencies: ['inspector'],
  init: function () {
    this.el.components.inspector.remove();
  }
});
