'use strict';

//this goe son lights to only cast shadows on platforms that can handle it
AFRAME.registerComponent('circles-platform-shadows', {
  schema: {
  },

  init: function() {
    let Context_AF = this;

    if (AFRAME.utils.device.isMobile()) {
      Context_AF.el.setAttribute('light', {castShadow:true, shadowMapHeight:1024, shadowMapWidth:1024, shadowBias:-0.00001});
    }
    else if (AFRAME.utils.device.isMobileVR()) {
      Context_AF.el.setAttribute('light', {castShadow:false, shadowMapHeight:256, shadowMapWidth:256, shadowBias:-0.00001}); //no shadows
    }
    else if (AFRAME.utils.device.isTablet()) {
      Context_AF.el.setAttribute('light', {castShadow:true, shadowMapHeight:1024, shadowMapWidth:1024, shadowBias:-0.00001});
    }
    else {
      //desktop and desktop HMD
      if (AFRAME.utils.device.checkHeadsetConnected()) {
        Context_AF.el.setAttribute('light', {castShadow:true, shadowMapHeight:4096, shadowMapWidth:4096, shadowBias:-0.00001});
      }
      else {
        Context_AF.el.setAttribute('light', {castShadow:true, shadowMapHeight:4096, shadowMapWidth:4096, shadowBias:-0.00001});
      }
    }
  }
});