//want this to make using sounds easier so peopel use them more
//General concept based on this lecture: https://frost.ics.uci.edu/ics62/BasicsofSoundDesignforVideoGames-MichaelCullen.pdf

'use strict';

AFRAME.registerComponent('circles-sound', {
  schema: {
    autoplay: {type:'boolean', default:false},
    type:     {type:'string', default:'basic', oneOf: ['basic', 'dialogue', 'music', 'soundeffect', 'foley', 'ambience']},
    loop:     {type:'boolean', default:false},
    volume:   {type:'number', default:1.0},
    state:    {type:'string', default:'stopped', oneOf: ['playing', 'stopped', 'paused']},
    src:      {type:'audio', default:null},
  },

  init: function () {
    const CONTEXT_AF = this;
    
  },
  update: function () {
    
  }
});