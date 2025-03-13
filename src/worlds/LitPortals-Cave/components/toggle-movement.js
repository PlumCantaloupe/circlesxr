'use strict';

//component to toggle players movement

AFRAME.registerComponent('toggle-movement', {
    schema: {},

    init: function () {

        const Context_AF = this;
        Context_AF.avatarRig = CIRCLES.getAvatarRigElement();
        Context_AF.isMoving = true;

        Context_AF.el.addEventListener('click', function(){
          
            if (Context_AF.isMoving === true) {
                console.log(' disable player movement');
                Context_AF.avatarRig.setAttribute('movement-controls',{enabled:false});
                Context_AF.isMoving = false;

              }
            else {
                console.log('enable player movement');
                Context_AF.avatarRig.setAttribute('movement-controls',{enabled:true});
                Context_AF.isMoving = true;

            }
        });
    },
  });