// Credit goes to ryota-mitarai https://github.com/ryota-mitarai/aframe-audio-analyser/blob/master/src/audioanalyser.js
// And the original creators https://www.npmjs.com/package/aframe-audio-analyser
// Minor modifications were done to the initContext() method based on mr-spaghetti-code's raised issue and solution https://github.com/ryota-mitarai/aframe-audio-analyser/issues/2

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var audioBufferCache = {};

/**
 * Audio visualizer component for A-Frame using AnalyserNode.
 */
AFRAME.registerComponent('audioanalyser', {
  schema: {
    buffer: { default: false },
    beatStartCutoff: { default: 0.8 },
    beatEndCutoff: { default: 0.75 },
    cache: { default: false },
    enabled: { default: true },
    enableBeatDetection: { default: true },
    enableLevels: { default: true },
    enableWaveform: { default: true },
    enableVolume: { default: true },
    fftSize: { default: 2048 },
    smoothingTimeConstant: { default: 0.8 },
    soundEntitySrc: { type: 'string', default: ''},
    src: {
      parse: function (val) {
        if (val.constructor !== String) {
          return val;
        }
        if (val.startsWith('#') || val.startsWith('.')) {
          return document.querySelector(val);
        }
        return val;
      },
    },
    unique: { default: false },
  },

  init: function () {
    this.audioEl = null;
    this.levels = null;
    this.waveform = null;
    this.volume = 0;
    this.xhr = null;

    this.beat_low = false;
    this.beat_mid = false;
    this.beat_high = false;
    this.beat_low_max = 20;
    this.beat_mid_max = 20;
    this.beat_high_max = 20;

    this.initContext();
  },

  update: function (oldData) {
    const analyser = this.analyser;
    const data = this.data;

    // Update analyser stuff.
    if (oldData.fftSize !== data.fftSize || oldData.smoothingTimeConstant !== data.smoothingTimeConstant) {
      analyser.fftSize = data.fftSize;
      analyser.smoothingTimeConstant = data.smoothingTimeConstant;
      this.levels = new Uint8Array(analyser.frequencyBinCount);
      this.waveform = new Uint8Array(analyser.fftSize);
    }

    if (!data.src) {
      return;
    }
    this.refreshSource();
  },

  /**
   * Update spectrum on each frame.
   */
  tick: function () {
    const data = this.data;

    if (!data.enabled) {
      return;
    }

    // Levels (frequency).
    if (data.enableLevels || data.enableVolume) {
      this.analyser.getByteFrequencyData(this.levels);
    }

    // Waveform.
    if (data.enableWaveform) {
      this.analyser.getByteTimeDomainData(this.waveform);
    }

    // Average volume.
    if (data.enableVolume || data.enableBeatDetection) {
      var sum = 0;
      for (var i = 0; i < this.levels.length; i++) {
        sum += this.levels[i];
      }
      this.volume = sum / this.levels.length;
    }

    // Beat detection.
    if (data.enableBeatDetection) {
      //frequencies here are on a scale of 0 - 23600hz
      var val = this.beatInRange(1, 350, this.beat_low, this.beat_low_max, 'audioanalyser-beat-low');
      this.beat_low = val[0];
      this.beat_low_max = val[1];
      val = this.beatInRange(500, 2000, this.beat_mid, this.beat_mid_max, 'audioanalyser-beat-mid');
      this.beat_mid = val[0];
      this.beat_mid_max = val[1];
      val = this.beatInRange(4000, 10000, this.beat_high, this.beat_high_max, 'audioanalyser-beat-high');
      this.beat_high = val[0];
      this.beat_high_max = val[1];
    }
  },

  //uses fourier transforms to detect beats in a given frequency range
  beatInRange: function (_start, _end, _lastBeat, beat_max, _emitName) {
    const frequencyLength = this.levels.length;
    const adjStart = Math.floor((_start / 23600) * frequencyLength);
    const adjEnd = Math.floor((_end / 23600) * frequencyLength);

    const slice = this.levels.slice(adjStart, adjEnd);
    const average = slice.reduce((a, b) => a + b) / slice.length;

    beat_max = Math.max(average, beat_max);

    if (average >= beat_max * this.data.beatStartCutoff && _lastBeat == false) {
      this.el.emit(_emitName, null, false);
      return [true, beat_max];
    } else if (average < beat_max * this.data.beatEndCutoff && _lastBeat == true) {
      return [false, beat_max];
    }
    return [_lastBeat, beat_max];
  },

  // Changed this based on mr-spaghetti-code's comment: https://github.com/ryota-mitarai/aframe-audio-analyser/issues/2 
  initContext: function () {
    const data = this.data;
    const soundEntitySrc = data.soundEntitySrc

    let sound;
    let threeAnalyser;
    let analyser;

    // Can either set the soundEntitySrc property on the audioanalyser component OR add a sound component to the same entity as the audioanalyser
    if (soundEntitySrc.length > 0) {
      sound = document.querySelector(soundEntitySrc).getObject3D('sound').children[0];
    } else {
      sound = this.el.getObject3D('sound').children[0];
    }
    threeAnalyser = new THREE.AudioAnalyser(sound, data.fftSize);
    analyser = (this.analyser = threeAnalyser.analyser);
    this.context = this.el.sceneEl.audioListener.context;

    analyser.smoothingTimeConstant = data.smoothingTimeConstant;
    const gainNode = (this.gainNode = this.context.createGain());
    gainNode.connect(analyser);
    analyser.connect(this.context.destination);
    analyser.fftSize = data.fftSize;
    analyser.smoothingTimeConstant = data.smoothingTimeConstant;
    this.levels = new Uint8Array(analyser.frequencyBinCount);
    this.waveform = new Uint8Array(analyser.fftSize);
  },

  refreshSource: function () {
    const data = this.data;

    if (data.buffer && data.src.constructor === String) {
      this.getBufferSource().then((source) => {
        this.source = source;
        this.source.connect(this.gainNode);
      });
    } else {
      this.source = this.getMediaSource();
      this.source.connect(this.gainNode);
    }
  },

  suspendContext: function () {
    this.context.suspend();
  },

  resumeContext: function () {
    this.context.resume();
  },

  /**
   * Fetch and parse buffer to audio buffer. Resolve a source.
   */
  fetchAudioBuffer: function (src) {
    // From cache.
    if (audioBufferCache[src]) {
      if (audioBufferCache[src].constructor === Promise) {
        return audioBufferCache[src];
      } else {
        return Promise.resolve(audioBufferCache[src]);
      }
    }

    if (!this.data.cache) {
      Object.keys(audioBufferCache).forEach(function (src) {
        delete audioBufferCache[src];
      });
    }

    audioBufferCache[src] = new Promise((resolve) => {
      // Fetch if does not exist.
      const xhr = (this.xhr = new XMLHttpRequest());
      xhr.open('GET', src);
      xhr.responseType = 'arraybuffer';
      xhr.addEventListener('load', () => {
        // Support Webkit with callback.
        function cb(audioBuffer) {
          audioBufferCache[src] = audioBuffer;
          resolve(audioBuffer);
        }
        const res = this.context.decodeAudioData(xhr.response, cb);
        if (res && res.constructor === Promise) {
          res.then(cb).catch(console.error);
        }
      });
      xhr.send();
    });
    return audioBufferCache[src];
  },

  getBufferSource: function () {
    const data = this.data;
    return this.fetchAudioBuffer(data.src)
      .then(() => {
        const source = this.context.createBufferSource();
        source.buffer = audioBufferCache[data.src];
        this.el.emit('audioanalyserbuffersource', source, false);
        return source;
      })
      .catch(console.error);
  },

  getMediaSource: (function () {
    const nodeCache = {};

    return function () {
      const src = this.data.src.constructor === String ? this.data.src : this.data.src.src;
      if (nodeCache[src]) {
        return nodeCache[src];
      }

      if (this.data.src.constructor === String) {
        this.audio = document.createElement('audio');
        this.audio.crossOrigin = 'anonymous';
        this.audio.setAttribute('src', this.data.src);
      } else {
        this.audio = this.data.src;
      }
      const node = this.context.createMediaElementSource(this.audio);

      nodeCache[src] = node;
      return node;
    };
  })(),
});