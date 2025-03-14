AFRAME.registerComponent('share-emotion', {
    schema: {
      visualizationID: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.manager = document.querySelector('#manager')
      CONTEXT_AF.visualizationContainer = document.querySelector(`#${CONTEXT_AF.data.visualizationID}`);
      
      CONTEXT_AF.el.addEventListener('click', function() {
        const holdingOrb = manager.getAttribute('manager').holdingOrb;
        //if holding orb then it can be dispensed
        if(holdingOrb) {
          // play sound
          CONTEXT_AF.el.components.sound.playSound();

          //un-parent orb from user and parent above the suction tube
          const holdingOrbId = manager.getAttribute('manager').holdingOrbId;
          const orb = document.querySelector(`#${holdingOrbId}`);
          orb.object3D.parent = CONTEXT_AF.el.parentNode.object3D;
          orb.object3D.position.set(0, 0.9, 0);
          
          //display animation for suction tube after 0.3 seconds
          setTimeout(function(){
            orb.setAttribute('animation', {property: 'position',
                                           duration: 500,
                                           to: '0 -2 0'})

            
          }, 300);

          //delete the orb once it's finished animating
          setTimeout(function() {
            //trigger visualization update
            CONTEXT_AF.visualizationContainer.setAttribute('room', {orbTypeToUpdate: manager.getAttribute('manager').holdingOrbId}) 
            orb.parentNode.children[0].setAttribute('dispense-emotion', {enabled: true});
            orb.parentNode.removeChild(orb);
            CONTEXT_AF.manager.setAttribute('manager', {holdingOrb: false, 
                                                        holdingOrbId: ''});
                        
          }, 1000);
          

          
          //share websocket
        }
        else {
          console.log("no rob in hand")
        }
      })
    },

});


