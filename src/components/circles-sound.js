//want this to make using sounds easier so peopel use them more
//General concept based on this lecture: https://frost.ics.uci.edu/ics62/BasicsofSoundDesignforVideoGames-MichaelCullen.pdf

'use strict';

AFRAME.registerComponent('circles-sound', {
  schema: {
    autoplay: {type:'boolean', default:false},
    type:     {type:'string', default:'basic', oneOf: ['basic', 'basic-diegetic', 'basic-nondiegetic', 'dialogue', 'music', 'soundeffect', 'foley', 'ambience']},
    loop:     {type:'boolean', default:false},
    volume:   {type:'number', default:1.0},
    state:    {type:'string', default:'stop', oneOf: ['play', 'stop', 'pause']},
    poolSize: {type:'int', default:1},
    src:      {type:'audio', default:null},
  },

  init: function () {
    const Context_AF = this;
  },
  update: function (oldData) {
    const Context_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.autoplay !== data.autoplay) && (data.autoplay !== '') ) {

      if (data.autoplay === true) {
        if (!Context_AF.el.classList.contains('autoplay-sound')) {
          Context_AF.el.classList.add('autoplay-sound');
        }
      }

      Context_AF.el.setAttribute('sound', {autoplay:false});
    }

    //note that for all psoitional sound we shoudl be using mono sound clips
    if ( (oldData.type !== data.type) && (data.type !== '') ) {
      switch (data.type) {
        case 'basic':
        case 'basic-diegetic': {
          Context_AF.el.setAttribute('sound', {positional:true, distanceModel:'inverse', maxDistance:10000.0, refDistance:1.0, rolloffFactor:1.0});
        } break;
        case 'basic-nondiegetic': {
          Context_AF.el.setAttribute('sound', {positional:false});
        } break;
        case 'dialogue': {
          ontext_AF.el.setAttribute('sound', {positional:true, distanceModel:'inverse', maxDistance:10000.0, refDistance:1.0, rolloffFactor:1.0});
        } break;
        case 'soundeffect': {
          ontext_AF.el.setAttribute('sound', {positional:true, distanceModel:'inverse', maxDistance:10000.0, refDistance:1.0, rolloffFactor:1.0});
        } break;
        case 'foley': {
          ontext_AF.el.setAttribute('sound', {positional:true, distanceModel:'inverse', maxDistance:10000.0, refDistance:1.0, rolloffFactor:1.0});
        } break;
        case 'music':
        case 'ambience': {
          Context_AF.el.setAttribute('sound', {positional:false});
        } break;
      }
    }

    if ( (oldData.loop !== data.loop) && (data.loop !== '') ) {
      Context_AF.el.setAttribute('sound', {loop:data.loop});
    }

    if ( (oldData.volume !== data.volume) && (data.volume !== '') ) {
      Context_AF.el.setAttribute('sound', {volume:data.volume});
    }

    if ( (oldData.state !== data.state) && (data.state !== '') ) {
      switch (data.state) {
        case 'stop': {
          Context_AF.el.setAttribute('sound', {});
          Context_AF.el.components['sound'].stopSound();
        } break;
        case 'play': {
          Context_AF.el.setAttribute('sound', {});
          Context_AF.el.components['sound'].playSound();
        } break;
        case 'pause': {
          Context_AF.el.setAttribute('sound', {});
          Context_AF.el.components['sound'].pauseSound();
        } break;
      }
    }

    if ( (oldData.poolSize !== data.poolSize) && (data.poolSize !== '') ) {
      Context_AF.el.setAttribute('poolSize', {poolSize:data.poolSize});
    }

    if ( (oldData.src !== data.src) && (data.src !== '') ) {
      Context_AF.el.setAttribute('sound', {src:data.src});
    }
  }
});