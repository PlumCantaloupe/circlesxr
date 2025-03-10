'use strict';

AFRAME.registerComponent('bw-world-state-manager', {
    schema: {
        
    },

    init: function () {
      console.log("Hello, I am the state world manager");
    },

    update: function () {
      // Do something when component's data is updated.
    },

    remove: function () {
      // Do something the component or its entity is detached.
    },

    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
    }
});
