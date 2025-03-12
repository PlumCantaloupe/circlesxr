AFRAME.registerComponent('share-emotion', {
    schema: {
      visualizationID: {type: 'string'}
    },

    init: function () {
      const Context_AF = this;
      Context_AF.manager = document.querySelector('#manager')
      Context_AF.visualizationContainer = document.querySelector(`#${Context_AF.data.visualizationID}`);

      Context_AF.el.addEventListener('click', function() {
        const holdingOrb = manager.getAttribute('manager').holdingOrb;
        //if holding orb then it can be dispensed
        if(holdingOrb) {
          //un-parent orb from user and parent above the suction tube
          const holdingOrbId = manager.getAttribute('manager').holdingOrbId;
          const orb = document.querySelector(`#${holdingOrbId}`);
          orb.object3D.parent = Context_AF.el.object3D;
          orb.object3D.position.y = 0.9;
          
          //display animation for suction tube after 0.3 seconds
          setTimeout(function(){
            orb.setAttribute('animation', {property: 'position',
                                           duration: 500,
                                           to: '0 -1.8 0'})

            
          }, 300);

          //delete the orb once it's finished animating
            //maybe move this one outside the function
            setTimeout(function() {
              //trigger visualization update
              Context_AF.visualizationContainer.setAttribute('room', {orbTypeToUpdate: manager.getAttribute('manager').holdingOrbId}) 
              orb.parentNode.children[0].setAttribute('dispense-emotion', {enabled: true});
              orb.parentNode.removeChild(orb);
              Context_AF.manager.setAttribute('manager', {holdingOrb: false, 
                                                          holdingOrbId: ''});
              
                                                         
            }, 800);
          

          
          //share webscoket
        }
        else {
          console.log("no rob in hand")
        }
      })
    },

});


