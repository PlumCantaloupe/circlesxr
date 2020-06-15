'use strict';

AFRAME.registerComponent('circles-platform-mirror', {
  schema: {
    textureOne:           {type:'string',   default:''},
	  textureTwo: 	        {type:'string',		default:''},
	  wrapOne: 		          {type:'vec2', 		default:{x: 1, y: 1}},
	  wrapTwo: 		          {type:'vec2', 		default:{x: 1, y: 1}},
	  invertedUV: 	        {type:'boolean', 	default:false},
    textureSizeDesktop:   {type:'int', 		  default:1024},
    textureSizeMobile:    {type:'int', 		  default:512},
    textureSizeHMD:       {type:'int', 		  default:256},
	  color: 			          {type:'color', 		default:'#848485'},
	  intensity: 		        {type:'number', 	default:0.5},
	  blendIntensity:       {type:'number', 	default:1.0}
  },

  init: function() {

    if (AFRAME.utils.device.isMobile() || AFRAME.utils.device.isTablet()) {
      // Context_AF.el.setAttribute('aframe-mirror', {color:'#848485', intensity:0.4, textureWidth:512, textureHeight:512});
      this.el.setAttribute('aframe-mirror', { 
                                                    textureOne:this.data.textureOne, 
                                                    textureTwo:this.data.textureTwo, 
                                                    wrapOne:this.data.wrapOne, 
                                                    wrapTwo:this.data.wrapTwo, 
                                                    color:this.data.color, 
                                                    intensity:this.data.intensity, 
                                                    blendIntensity:this.data.blendIntensity, 
                                                    textureWidth:this.data.textureSizeMobile, 
                                                    textureHeight:this.data.textureSizeMobile
                                                  });
    }
    else if (AFRAME.utils.device.isMobileVR()) {
      this.el.setAttribute('aframe-mirror', { 
                                                    textureOne:this.data.textureOne, 
                                                    textureTwo:this.data.textureTwo, 
                                                    wrapOne:this.data.wrapOne, 
                                                    wrapTwo:this.data.wrapTwo, 
                                                    color:this.data.color, 
                                                    intensity:this.data.intensity, 
                                                    blendIntensity:this.data.blendIntensity, 
                                                    textureWidth:this.data.textureSizeHMD, 
                                                    textureHeight:this.data.textureSizeHMD
                                                  });
    }
    else {
      //Desktop
      // this.el.setAttribute('aframe-mirror', {color:'#848485', intensity:0.4, textureWidth:1024, textureHeight:1024});
      //Context_AF.el.setAttribute('aframe-mirror', {textureOne:'/global/images/dirtyWindow.png', textureTwo:'/global/images/Circles_WomenInTrades.jpg', wrapOne:'10 1', wrapTwo:"1 1", color:'#815e01', intensity:0.0, blendIntensity:0.0, textureWidth:1024, textureHeight:1024});
      this.el.setAttribute('aframe-mirror', { 
                                                    textureOne:this.data.textureOne, 
                                                    textureTwo:this.data.textureTwo, 
                                                    wrapOne:this.data.wrapOne, 
                                                    wrapTwo:this.data.wrapTwo, 
                                                    color:this.data.color, 
                                                    intensity:this.data.intensity, 
                                                    blendIntensity:this.data.blendIntensity, 
                                                    textureWidth:this.data.textureSizeDesktop, 
                                                    textureHeight:this.data.textureSizeDesktop
                                                  });
    }
  }
});