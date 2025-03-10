AFRAME.registerComponent('manager', {
    init: function () {
      const Context_AF = this;
      Context_AF.holdingObject = false;
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
