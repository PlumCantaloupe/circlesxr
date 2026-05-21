//component is responsible for the emotion orb pick up mechanic
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
        
        const holdingAnotherOrb = CONTEXT_AF.manager.getAttribute('manager').holdingOrb;
        //only allow pick up if the no orb is in hand
        if(!holdingAnotherOrb) {
          CONTEXT_AF.pickUp(CONTEXT_AF.el, CONTEXT_AF.camera, CONTEXT_AF.manager);
        }
        //display error text if holding another orb
        else {
          CONTEXT_AF.guidingText.displayError(ERROR_TEXT.PICK_UP_ONE);
        }
      })
    },

    //function handles parenting the orb to the camera
    pickUp: function (orb, camera, manager) {
      const CONTEXT_AF = this;
      
      // Make orb no longer interactive once it is picked up
      orb.removeAttribute('circles-interactive-object');

      // Add component to network the orb so it is visible across clients once it is picked up
      orb.setAttribute('circles-networked-basic', {});

      // Parent the orb to the camera and set the position and scale accordingly
      orb.object3D.parent = camera.object3D;
      orb.object3D.position.set(EMOTION_ORB_HOLD_POS.x, EMOTION_ORB_HOLD_POS.y, EMOTION_ORB_HOLD_POS.z);
      orb.object3D.scale.set(EMOTION_ORB_SCALE, EMOTION_ORB_SCALE, EMOTION_ORB_SCALE);
      // Set orb states on the manager for whether the user is holding the orb, the orb's ID, and the orb's emotion so it can be used in the emotion data logic
      manager.setAttribute('manager', {holdingOrb: true, holdingOrbId: orb.id, holdingOrbEmotion: orb.getAttribute('data-emotion')});

      if(CONTEXT_AF.room.toLowerCase() == 'hub')
        CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.SHARE_EMOTION_PART1);
      else
        CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.SHARE_EMOTION_PART2 + CONTEXT_AF.room + ' tunnel');
    },

    //function removes orb guiding text when orb is deleted
    remove: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.guidingText.hideGuidingText();
    }
});
