'use strict';

//this goe son lights to only cast shadows on platforms that can handle it
AFRAME.registerComponent('circles-platform-scene-shadows', {
  schema: {
    updateInterval: {type: "number",  default:15}    //ms
  },
  init: function() {
    const CONTEXT_AF = this;
    CONTEXT_AF.prevTime = 0;

    if (AFRAME.utils.device.isMobile()) {
      CONTEXT_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'});
    }
    else if (AFRAME.utils.device.isMobileVR()) {
      CONTEXT_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'}); //no shadows
    }
    else if (AFRAME.utils.device.isTablet()) {
        CONTEXT_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'});
    }
    else {
      //desktop and desktop HMD
      if (AFRAME.utils.device.checkHeadsetConnected()) {
        CONTEXT_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'});
      }
      else {
        CONTEXT_AF.el.setAttribute('shadow', {autoUpdate:false, type:'basic'});
      }
    }
  },
  tick: function(time, timeDelta) {
      if (time - this.prevTime > this.data.updateInterval) {
        this.el.sceneEl.renderer.shadowMap.needsUpdate = true;
        this.prevTime = time;
      }
  },
  //tock: function(time, timeDelta, camera) {}
});