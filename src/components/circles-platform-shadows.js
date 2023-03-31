'use strict';

//this goe son lights to only cast shadows on platforms that can handle it
AFRAME.registerComponent('circles-platform-shadows', {
  schema: {
  },

  init: function() {
    const CONTEXT_AF = this;

    if (AFRAME.utils.device.isMobile()) {
      CONTEXT_AF.el.setAttribute('light', {castShadow:true, shadowMapHeight:1024, shadowMapWidth:1024, shadowBias:-0.00001});
    }
    else if (AFRAME.utils.device.isMobileVR()) {
      CONTEXT_AF.el.setAttribute('light', {castShadow:false, shadowMapHeight:256, shadowMapWidth:256, shadowBias:-0.00001}); //no shadows
    }
    else if (AFRAME.utils.device.isTablet()) {
      CONTEXT_AF.el.setAttribute('light', {castShadow:true, shadowMapHeight:1024, shadowMapWidth:1024, shadowBias:-0.00001});
    }
    else {
      //desktop and desktop HMD
      if (AFRAME.utils.device.checkHeadsetConnected()) {
        CONTEXT_AF.el.setAttribute('light', {castShadow:true, shadowMapHeight:1024, shadowMapWidth:2048, shadowBias:-0.00001});
      }
      else {
        CONTEXT_AF.el.setAttribute('light', {castShadow:true, shadowMapHeight:1024, shadowMapWidth:2048, shadowBias:-0.00001});
      }
    }
  }
});