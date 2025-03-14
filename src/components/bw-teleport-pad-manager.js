'use strict';

AFRAME.registerComponent('bw-teleport-pad-manager', {
    schema: {
      isTransparent: {type: 'boolean', default: false},
      colour: {type: 'color'}
    },

    init: function () {    
      const Context_AF = this;

      Context_AF.teleportPads = document.querySelectorAll('[circles-checkpoint]');
      Context_AF.setTeleportPadMat(Context_AF.data.isTransparent);

    },

    update: function(oldData) {
      const Context_AF = this;
      const data = this.data;
      console.log("hi im teelprot")
      if ( (oldData.isTransparent !== data.isTransparent) && (data.isTransparent !== '') && (oldData.colour === data.colour)) {
        Context_AF.setTeleportPadMat(data.isTransparent);
      }
    },

    setTeleportPadMat: function(isTransparent) {
      const Context_AF = this;
      for(let i=0; i<Context_AF.teleportPads.length; i++){
        if(isTransparent) {
          Context_AF.teleportPads[i].setAttribute('circles-checkpoint', {colour: Context_AF.data.colour,
                                                                         emission: Context_AF.data.colour,
                                                                         transparent: true,
                                                                         opacity: 0.3});
        }
        else {
          Context_AF.teleportPads[i].setAttribute('circles-checkpoint', {colour: Context_AF.data.colour,
                                                                         emission: Context_AF.data.colour,
                                                                         transparent: false,
                                                                         opacity: 1});
        }
      }
    }
});
