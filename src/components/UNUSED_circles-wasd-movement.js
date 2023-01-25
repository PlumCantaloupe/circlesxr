//TODO: combine this with all other movement (i.e. snap-turning, teleport etc.). Also need to support this on other devices

var KEYCODE_TO_CODE = {
    '38': 'ArrowUp',
    '37': 'ArrowLeft',
    '40': 'ArrowDown',
    '39': 'ArrowRight',
    '87': 'KeyW',
    '65': 'KeyA',
    '83': 'KeyS',
    '68': 'KeyD'
  };
var bind = AFRAME.utils.bind;
var shouldCaptureKeyEvent = AFRAME.utils.shouldCaptureKeyEvent;

var CLAMP_VELOCITY = 0.00001;
var MAX_DELTA = 0.2;
var KEYS = [
  'KeyW', 'KeyA', 'KeyS', 'KeyD',
  'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'
];

/**
 * WASD component to control entities using WASD keys. This is modified from A-Frame code to include rotation snapping and be used on camera rig
 */
'use strict';

AFRAME.registerComponent('circles-wasd-movement', {
  schema: {
    acceleration:   {default: 65},
    adAxis:         {default: 'x', oneOf: ['x', 'y', 'z']},
    adEnabled:      {default: true},
    adInverted:     {default: false},
    enabled:        {default: true},
    fly:            {default: false},
    wsAxis:         {default: 'z', oneOf: ['x', 'y', 'z']},
    wsEnabled:      {default: true},
    wsInverted:     {default: false}
  },

  init: function () {
    const CONTEXT_AF = this;

    if (this.el.components['camera']) {
      CONTEXT_AF.cameraElem = CONTEXT_AF.el.components['camera'];
    }
    else {
      CONTEXT_AF.cameraElem = this.el.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID + 'Cam');

      if (!CONTEXT_AF.cameraElem) {
        const camHandle = (e) => {
          CONTEXT_AF.cameraElem = this.el.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID + 'Cam');
          CONTEXT_AF.el.removeEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, camHandle);
        };
        CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, camHandle);
      }
    }

    // To keep track of the pressed keys.
    this.keys = {};
    this.easing = 1.1;

    this.velocity = new THREE.Vector3();

    // Bind methods and add event listeners.
    this.onBlur = bind(this.onBlur, this);
    this.onFocus = bind(this.onFocus, this);
    this.onKeyDown = bind(this.onKeyDown, this);
    this.onKeyUp = bind(this.onKeyUp, this);
    this.onVisibilityChange = bind(this.onVisibilityChange, this);
    this.attachVisibilityEventListeners();
  },

  tick: function (time, delta) {
    var data = this.data;
    var el = this.el;
    var velocity = this.velocity;

    if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
        isEmptyObject(this.keys)) { return; }

    // Update velocity.
    delta = delta / 1000;
    this.updateVelocity(delta);

    if (!velocity[data.adAxis] && !velocity[data.wsAxis]) { return; }

    // Get movement vector and translate position.
    el.object3D.position.add(this.getMovementVector(delta));
  },

  remove: function () {
    this.removeKeyEventListeners();
    this.removeVisibilityEventListeners();
  },

  play: function () {
    this.attachKeyEventListeners();
  },

  pause: function () {
    this.keys = {};
    this.removeKeyEventListeners();
  },

  updateVelocity: function (delta) {
    var acceleration;
    var adAxis;
    var adSign;
    var data = this.data;
    var keys = this.keys;
    var velocity = this.velocity;
    var wsAxis;
    var wsSign;

    adAxis = data.adAxis;
    wsAxis = data.wsAxis;

    // If FPS too low, reset velocity.
    if (delta > MAX_DELTA) {
      velocity[adAxis] = 0;
      velocity[wsAxis] = 0;
      return;
    }

    // https://gamedev.stackexchange.com/questions/151383/frame-rate-independant-movement-with-acceleration
    var scaledEasing = Math.pow(1 / this.easing, delta * 60);
    // Velocity Easing.
    if (velocity[adAxis] !== 0) {
      velocity[adAxis] = velocity[adAxis] * scaledEasing;
    }
    if (velocity[wsAxis] !== 0) {
      velocity[wsAxis] = velocity[wsAxis] * scaledEasing;
    }

    // Clamp velocity easing.
    if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) { velocity[adAxis] = 0; }
    if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) { velocity[wsAxis] = 0; }

    if (!data.enabled) { return; }

    // Update velocity using keys pressed.
    acceleration = data.acceleration;
    if (data.adEnabled) {
      adSign = data.adInverted ? -1 : 1;
      if (keys.KeyA || keys.ArrowLeft) { velocity[adAxis] -= adSign * acceleration * delta; }
      if (keys.KeyD || keys.ArrowRight) { velocity[adAxis] += adSign * acceleration * delta; }
    }
    if (data.wsEnabled) {
      wsSign = data.wsInverted ? -1 : 1;
      if (keys.KeyW || keys.ArrowUp) { velocity[wsAxis] -= wsSign * acceleration * delta; }
      if (keys.KeyS || keys.ArrowDown) { velocity[wsAxis] += wsSign * acceleration * delta; }
    }
  },

  getMovementVector: (function () {
    var directionVector = new THREE.Vector3(0, 0, 0);
    var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

    return function (delta) {
        // this.cameraElem.object3D.getWorldDirection(directionVector);
        // directionVector.add(this.velocity);
        // directionVector.normalize();
        // directionVector.multiplyScalar(delta);

        // if (!this.data.fly) {
        //     directionVector.x = 0.0;
        // }

        // var tempQuat = new THREE.Quaternion();
        //var tempQuat = this.el.object3D.quaternion.clone();
        // this.cameraElem.object3D.getWorldQuaternion(tempQuat);

        // console.log(tempQuat);

        // var rotation = new THREE.Euler().setFromQuaternion( tempQuat, 'XYZ' );

        // console.log(rotation);

    //   var rotation = this.cameraElem.object3D.rotation.clone();
    //   rotation.x += this.el.object3D.rotation.x;
    //   rotation.y += this.el.object3D.rotation.y;
    //   rotation.z += this.el.object3D.rotation.z;

      var rotation = this.cameraElem.getAttribute('rotation');
      var rotationRig = this.el.getAttribute('rotation');
      rotation.x += rotationRig.x;
      rotation.y += rotationRig.y;
      rotation.z += rotationRig.z;

      var velocity = this.velocity;
      var xRotation;

      directionVector.copy(velocity);
      directionVector.multiplyScalar(delta);

      // Absolute.
      if (!rotation) { return directionVector; }

      xRotation = this.data.fly ? rotation.x : 0;

      // Transform direction relative to heading.
      rotationEuler.set(THREE.MathUtils.degToRad(xRotation), THREE.MathUtils.degToRad(rotation.y), 0);
      directionVector.applyEuler(rotationEuler);

      return directionVector;
    };
  })(),

  attachVisibilityEventListeners: function () {
    window.addEventListener('blur', this.onBlur);
    window.addEventListener('focus', this.onFocus);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  },

  removeVisibilityEventListeners: function () {
    window.removeEventListener('blur', this.onBlur);
    window.removeEventListener('focus', this.onFocus);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  },

  attachKeyEventListeners: function () {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  },

  removeKeyEventListeners: function () {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },

  onBlur: function () {
    this.pause();
  },

  onFocus: function () {
    this.play();
  },

  onVisibilityChange: function () {
    if (document.hidden) {
      this.onBlur();
    } else {
      this.onFocus();
    }
  },

  onKeyDown: function (event) {
    var code;
    if (!shouldCaptureKeyEvent(event)) { return; }
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    if (KEYS.indexOf(code) !== -1) { this.keys[code] = true; }
  },

  onKeyUp: function (event) {
    var code;
    code = event.code || KEYCODE_TO_CODE[event.keyCode];
    delete this.keys[code];
  }
});

function isEmptyObject (keys) {
  var key;
  for (key in keys) { return false; }
  return true;
}
