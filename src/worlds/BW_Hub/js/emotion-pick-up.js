AFRAME.registerComponent('emotion-pick-up', {
    init: function () {
      const Context_AF = this;
      Context_AF.parent = Context_AF.el.parentNode;
      Context_AF.camera = CIRCLES.getMainCameraElement();
      
      //disable interactivity when the emotion orb gets picked up
      Context_AF.el.addEventListener('click', function() {
        Context_AF.el.object3D.parent = camera.object3D
      })

    },

    update: function () {
      // Do something when component's data is updated.
    },

    remove: function () {
      // update the emotion dispenser here
    },

    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
    }
});
