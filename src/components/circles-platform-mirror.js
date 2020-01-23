'use strict';

AFRAME.registerComponent('circles-platform-mirror', {
  schema: {
  },

  init: function() {
    let Context_AF = this;

    if (AFRAME.utils.device.isMobile()) {
      Context_AF.el.setAttribute('aframe-mirror', {color:'#848485', intensity:0.4, textureWidth:512, textureHeight:512});
    }
    else if (AFRAME.utils.device.isMobileVR()) {
      Context_AF.el.setAttribute('scale', {x:0.0001, y:0.0001, z:0.0001}); //get rid of mirror geometry ...
    }
    else if (AFRAME.utils.device.isTablet()) {
      Context_AF.el.setAttribute('aframe-mirror', {color:'#848485', intensity:0.4, textureWidth:512, textureHeight:512});
    }
    else {
      //desktop and desktop HMD
      if (AFRAME.utils.device.checkHeadsetConnected()) {
        Context_AF.el.setAttribute('aframe-mirror', {color:'#848485', intensity:0.4, textureWidth:2048, textureHeight:2048});
      }
      else {
        Context_AF.el.setAttribute('aframe-mirror', {color:'#848485', intensity:0.4, textureWidth:2048, textureHeight:2048});
      }
    }
  }
});