'use strict';

//raycasters still click on interactive elements with "visible:false" entities so we will control that here manually
//see here: https://github.com/aframevr/aframe/issues/3551
AFRAME.registerComponent('circles-interactive-visible', {
  schema: {type:'boolean', default:true},
  multiple: false, //do not allow multiple instances of this component on this entity
  update: function (oldData) {  
    this.el.object3D.visible = this.data;

    //update raycaster objects ...
    if (this.data === true) {
      if (!this.el.classList.contains("interactive")) {
        this.el.classList.add('interactive');
      }
    }
    else {
      if (this.el.classList.contains("interactive")) {
        this.el.classList.remove("interactive");
      }
    }

    const raycasters = this.el.sceneEl.querySelectorAll('[raycaster]');
    raycasters.forEach(rc => {
        //if (rc.components.raycaster.data) {
            rc.components.raycaster.refreshObjects();
       // }
    }); 
  }
});
