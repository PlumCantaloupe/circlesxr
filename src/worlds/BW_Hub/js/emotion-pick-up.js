AFRAME.registerComponent('emotion-pick-up', {
    init: function () {
      const Context_AF = this;
      Context_AF.parent = Context_AF.el.parentNode;
      Context_AF.camera = CIRCLES.getMainCameraElement();
      Context_AF.manager = document.querySelector('#manager');
      
      Context_AF.el.addEventListener('click', function() {
        //only allow pick up if the no orb is in hand
        const holdingAnotherOrb = Context_AF.manager.getAttribute('manager').holdingOrb;
        if(holdingAnotherOrb)
          console.log("cannot pick up orb right now")
        else
          Context_AF.pickUp(Context_AF.el, Context_AF.camera, Context_AF.manager);
      })
    },

    pickUp: function (orb, camera, manager) {
      orb.removeAttribute('circles-interactive-object');
      orb.object3D.parent = camera.object3D;
      orb.object3D.position.set(0, 0, -1);
      orb.object3D.scale.set(2, 2, 2);
      manager.setAttribute('manager', {holdingOrb: true});
    },

    remove: function () {
      //allow an emotion of this type to be dispensed again
      Context_AF.parent.children[0].setAttribute('dispense-emotion', {enabled: true});
    }
});
