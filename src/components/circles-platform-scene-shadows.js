'use strict';

//this goe son lights to only cast shadows on platforms that can handle it
AFRAME.registerComponent('circles-platform-scene-shadows', {
  schema: {
  },
  init: function() {
    let Context_AF = this;
    Context_AF.prevTime = 0;
    Context_AF.shadowUpdateInterval = 60;

    if (AFRAME.utils.device.isMobile()) {
      Context_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'});
    }
    else if (AFRAME.utils.device.isMobileVR()) {
      Context_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'}); //no shadows
    }
    else if (AFRAME.utils.device.isTablet()) {
        Context_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'});
    }
    else {
      //desktop and desktop HMD
      if (AFRAME.utils.device.checkHeadsetConnected()) {
        Context_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'});
      }
      else {
        Context_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'});
      }
    }
  },
  tick: function(time, timeDelta) {
      if ( time - this.prevTime > this.shadowUpdateInterval ) {
        this.el.sceneEl.renderer.shadowMap.needsUpdate = true;
        this.prevTime = time;
      }
  },
  //tock: function(time, timeDelta, camera) {}
});