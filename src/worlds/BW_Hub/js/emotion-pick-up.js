AFRAME.registerComponent('emotion-pick-up', {
    init: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.parent = CONTEXT_AF.el.parentNode;
      CONTEXT_AF.camera = CIRCLES.getMainCameraElement();
      CONTEXT_AF.manager = document.querySelector('#manager');
      CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];
      
      CONTEXT_AF.el.addEventListener('click', function() {
        //only allow pick up if the no orb is in hand
        const holdingAnotherOrb = CONTEXT_AF.manager.getAttribute('manager').holdingOrb;
        if(holdingAnotherOrb) {
          console.log("cannot pick up orb right now")
          CONTEXT_AF.guidingText.displayError("cannot display info rn");
        }
        else 
          CONTEXT_AF.pickUp(CONTEXT_AF.el, CONTEXT_AF.camera, CONTEXT_AF.manager);
      })
      
    },

    pickUp: function (orb, camera, manager) {
      const CONTEXT_AF = this;
      
      orb.removeAttribute('circles-interactive-object');
      orb.object3D.parent = camera.object3D;
      orb.object3D.position.set(0, 0, -1);
      orb.object3D.scale.set(2, 2, 2);
      manager.setAttribute('manager', {holdingOrb: true, holdingOrbId: orb.id});
      CONTEXT_AF.guidingText.updateGuidingText("place the orb into a tube to share your emotion");
    },

    remove: function () {
      //allow an emotion of this type to be dispensed again
      const CONTEXT_AF = this;
      CONTEXT_AF.guidingText.hideGuidingText();
      //CONTEXT_AF.parent.children[0].setAttribute('dispense-emotion', {enabled: true});
    }
});
