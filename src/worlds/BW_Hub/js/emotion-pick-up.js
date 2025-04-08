AFRAME.registerComponent('emotion-pick-up', {
    init: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.parent = CONTEXT_AF.el.parentNode;
      CONTEXT_AF.camera = CIRCLES.getMainCameraElement();
      CONTEXT_AF.manager = document.querySelector('#manager');
      CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];
      CONTEXT_AF.sharedStateManager = document.querySelector('[bw-shared-state-manager]').components['bw-shared-state-manager'];
      CONTEXT_AF.room = CONTEXT_AF.sharedStateManager.getRoom();
      
      CONTEXT_AF.el.addEventListener('click', function() {
        //only allow pick up if the no orb is in hand
        const holdingAnotherOrb = CONTEXT_AF.manager.getAttribute('manager').holdingOrb;
        if(holdingAnotherOrb) {
          CONTEXT_AF.guidingText.displayError(ERROR_TEXT.PICK_UP_ONE);
        }
        else {
          CONTEXT_AF.pickUp(CONTEXT_AF.el, CONTEXT_AF.camera, CONTEXT_AF.manager);
        }
      })
      
    },

    pickUp: function (orb, camera, manager) {
      const CONTEXT_AF = this;
      
      // Make orb no longer interactive once it is picked up
      orb.removeAttribute('circles-interactive-object');

      // Add component to network the orb so it is visible across clients once it is picked up
      orb.setAttribute('circles-networked-basic', {});

      // Parent the orb to the camera and set the position and scale accordingly
      orb.object3D.parent = camera.object3D;
      orb.object3D.position.set(0, 0, -1);
      orb.object3D.scale.set(2, 2, 2);
      // Set orb states on the manager for whether the user is holding the orb, the orb's ID, and the orb's emotion so it can be used in the emotion data logic
      manager.setAttribute('manager', {holdingOrb: true, holdingOrbId: orb.id, holdingOrbEmotion: orb.getAttribute('data-emotion')});

      if(CONTEXT_AF.room.toLowerCase() == 'hub')
        CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.SHARE_EMOTION_PART1);
      else
        CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.SHARE_EMOTION_PART2 + CONTEXT_AF.room + ' tunnel');
        
    },

    remove: function () {
      //allow an emotion of this type to be dispensed again
      const CONTEXT_AF = this;
      CONTEXT_AF.guidingText.hideGuidingText();
      //CONTEXT_AF.parent.children[0].setAttribute('dispense-emotion', {enabled: true});
    }
});
