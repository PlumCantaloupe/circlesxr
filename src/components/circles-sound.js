//want this to make using sounds easier so peopel use them more
//General concept based on this lecture: https://frost.ics.uci.edu/ics62/BasicsofSoundDesignforVideoGames-MichaelCullen.pdf

'use strict';

AFRAME.registerComponent('circles-sound', {
  schema: {
    autoplay: {type:'boolean',  default:false},
    type:     {type:'string',   default:'basic', oneOf: ['basic', 'basic-diegetic', 'basic-nondiegetic', 'dialogue', 'music', 'soundeffect', 'foley', 'ambience', 'artefact']},
    loop:     {type:'boolean',  default:false},
    volume:   {type:'number',   default:1.0}, 
    state:    {type:'string',   default:'stop', oneOf: ['play', 'stop', 'pause']},
    poolSize: {type:'int',      default:1},
    src:      {type:'audio',    default:''},
  },

  init: function () {
    const CONTEXT_AF = this;
  },
  update: function (oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.autoplay !== data.autoplay) && (data.autoplay !== '') ) {

      if (data.autoplay === true) {
        if (!CONTEXT_AF.el.classList.contains('autoplay-sound')) {
          CONTEXT_AF.el.classList.add('autoplay-sound');
        }
      }

      CONTEXT_AF.el.setAttribute('sound', {autoplay:false});
    }

    //note that for all positional sound we shoudl be using mono sound clips
    if ( (oldData.type !== data.type) && (data.type !== '') ) {
      switch (data.type) {
        case 'basic':
        case 'basic-diegetic': {
          CONTEXT_AF.el.setAttribute('sound', {positional:true, distanceModel:'inverse', maxDistance:10000.0, refDistance:1.0, rolloffFactor:1.0});
        } break;
        case 'basic-nondiegetic': {
          CONTEXT_AF.el.setAttribute('sound', {positional:false});
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
        case 'artefact':
        case 'ambience': {
          CONTEXT_AF.el.setAttribute('sound', {positional:false});
        } break;
      }
    }

    if ( (oldData.loop !== data.loop) && (data.loop !== '') ) {
      CONTEXT_AF.el.setAttribute('sound', {loop:data.loop});
    }

    if ( (oldData.volume !== data.volume) && (data.volume !== '') ) {
      CONTEXT_AF.el.setAttribute('sound', {volume:data.volume});
    }

    if ( (oldData.state !== data.state) && (data.state !== '') ) {
      switch (data.state) {
        case 'stop': {
          CONTEXT_AF.el.setAttribute('sound', {});
          CONTEXT_AF.el.components['sound'].stopSound();
        } break;
        case 'play': {
          CONTEXT_AF.el.setAttribute('sound', {});
          CONTEXT_AF.el.components['sound'].playSound();
        } break;
        case 'pause': {
          CONTEXT_AF.el.setAttribute('sound', {});
          CONTEXT_AF.el.components['sound'].pauseSound();
        } break;
      }
    }

    if ( (oldData.poolSize !== data.poolSize) && (data.poolSize !== '') ) {
      CONTEXT_AF.el.setAttribute('poolSize', {poolSize:data.poolSize});
    }

    if ( (oldData.src !== data.src) && (data.src !== '') ) {
      CONTEXT_AF.el.setAttribute('sound', {src:data.src});
    }
  }
});