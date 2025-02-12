'use strict';

AFRAME.registerComponent('circles-platform-mirror', {
  schema: {
    textureSizeDesktop:   {type:'int', 		  default:1024},
    textureSizeMobile:    {type:'int', 		  default:512},
    textureSizeHMD:       {type:'int', 		  default:256},
  },

  init: function() {

    if (AFRAME.utils.device.isMobile() || AFRAME.utils.device.isTablet()) {
      // CONTEXT_AF.el.setAttribute('aframe-mirror', {color:'#848485', intensity:0.4, textureWidth:512, textureHeight:512});
      this.el.setAttribute('aframe-mirror', {   textureWidth:this.data.textureSizeMobile, 
                                                textureHeight:this.data.textureSizeMobile
                                              });
    }
    else if (AFRAME.utils.device.isMobileVR()) {
      //mirrors broken on Quest currently
      // this.el.removeAttribute('geometry');
      this.el.setAttribute('aframe-mirror', {   textureWidth:this.data.textureSizeHMD, 
                                                textureHeight:this.data.textureSizeHMD
                                              });
    }
    else {
      //Desktop
      // this.el.setAttribute('aframe-mirror', {color:'#848485', intensity:0.4, textureWidth:1024, textureHeight:1024});
      //CONTEXT_AF.el.setAttribute('aframe-mirror', {textureOne:'/global/images/dirtyWindow.png', textureTwo:'/global/images/Circles_WomenInTrades.jpg', wrapOne:'10 1', wrapTwo:"1 1", color:'#815e01', intensity:0.0, blendIntensity:0.0, textureWidth:1024, textureHeight:1024});
      this.el.setAttribute('aframe-mirror', {   textureWidth:this.data.textureSizeDesktop, 
                                                textureHeight:this.data.textureSizeDesktop
                                              });
    }
  }
});