'use strict';

AFRAME.registerComponent('circles-pickup-object', {
  schema: {
    pickupPosition:     { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this relative to the camera
    pickupRotation:     { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //what orientation relative to teh camera
    pickupScale:        { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //what scale relative to the camera
    dropPosition:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to end up after it is released
    dropRotation:       { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //where do we want this to orient as after it is released
    dropScale:          { type: "vec3", default:{x:100001.0, y:0.0, z:0.0} },   //what scale after it is released
    animate:            { type: "boolean", default:false },                     //whether we animate
    animateDurationMS:  { type: "number", default:400 },                        //how long animation is
  },
  init: function() {
    const CONTEXT_AF    = this;
    const data          = CONTEXT_AF.data;
    CONTEXT_AF.pickedUp = false;

    CONTEXT_AF.player   = null
    if (CIRCLES.isReady()) {
      CONTEXT_AF.player = CIRCLES.getAvatarElement();  //this is our player/camera
    }
    else {
      const readyFunc = function() {
        CONTEXT_AF.player = CIRCLES.getAvatarElement();  //this is our player/camera
        CIRCLES.getCirclesSceneElement().removeEventListener(CIRCLES.EVENTS.READY, readyFunc);
      };
      CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, readyFunc);
    }

    CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.clickFunc);
  },
  pickup : function(passedContext) {
    let CONTEXT_AF = null;
    if (passedContext) {
      CONTEXT_AF = passedContext;
    }
    else {
      CONTEXT_AF = this;
    }
    const data          = CONTEXT_AF.data;

    CONTEXT_AF.player.object3D.attach(CONTEXT_AF.el.object3D);

    //set pickup transforms, if any
    if (data.pickupPosition.x < 100000.0) {
      if (data.animate === true) {
        CONTEXT_AF.el.setAttribute('animation__cpo_position', {property:'position', dur:data.animateDurationMS, to:{x:data.pickupPosition.x, y:data.pickupPosition.y, z:data.pickupPosition.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.position.set(data.pickupPosition.x, data.pickupPosition.y, data.pickupPosition.z);
      }
    }
    if (data.pickupRotation.x < 100000.0) {
      if (data.animate === true) {
        CONTEXT_AF.el.setAttribute('animation__cpo_rotation', {property:'rotation', dur:data.animateDurationMS, to:{x:data.pickupRotation.x, y:data.pickupRotation.y, z:data.pickupRotation.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.rotation.set(
          THREE.MathUtils.degToRad(data.pickupRotation.x),
          THREE.MathUtils.degToRad(data.pickupRotation.y),
          THREE.MathUtils.degToRad(data.pickupRotation.z)
        );
      }
    }
    if (data.pickupScale.x < 100000.0) {
      if (data.animate === true) {
        CONTEXT_AF.el.setAttribute('animation__cpo_scale', {property:'scale', dur:data.animateDurationMS, to:{x:data.pickupScale.x, y:data.pickupScale.y, z:data.pickupScale.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.scale.set(data.pickupScale.x, data.pickupScale.y, data.pickupScale.z);
      }
    }

    CONTEXT_AF.pickedUp = true;
  },
  release : function(passedContext) {
    let CONTEXT_AF = null;
    if (passedContext) {
      CONTEXT_AF = passedContext;
    }
    else {
      CONTEXT_AF = this;
    }
    const data          = CONTEXT_AF.data;

    //release
    CONTEXT_AF.el.sceneEl.object3D.attach(CONTEXT_AF.el.object3D); //using three's "attach" allows us to retain world transforms during pickup/release

    //set drop transforms, if any
    if (data.dropPosition.x < 100000.0) {
      if (data.animate === true) {
        CONTEXT_AF.el.setAttribute('animation__cpo_position', {property:'position', dur:data.animateDurationMS, to:{x:data.dropPosition.x, y:data.dropPosition.y, z:data.dropPosition.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.position.set(data.dropPosition.x, data.dropPosition.y, data.dropPosition.z);
      }
    }

    if (data.dropRotation.x < 100000.0) {
      if (data.animate === true) {
        CONTEXT_AF.el.setAttribute('animation__cpo_rotation', {property:'rotation', dur:data.animateDurationMS, to:{x:data.dropRotation.x, y:data.dropRotation.y, z:data.dropRotation.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.rotation.set(
          THREE.MathUtils.degToRad(data.dropRotation.x),
          THREE.MathUtils.degToRad(data.dropRotation.y),
          THREE.MathUtils.degToRad(data.dropRotation.z)
        );
      }
    }

    if (data.dropScale.x < 100000.0) {
      if (data.animate === true) {
        CONTEXT_AF.el.setAttribute('animation__cpo_scale', {property:'scale', dur:data.animateDurationMS, to:{x:data.dropScale.x, y:data.dropScale.y, z:data.dropScale.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.scale.set(data.dropScale.x, data.dropScale.y, data.dropScale.z);
      }
    }

    CONTEXT_AF.pickedUp = false;
  },
  clickFunc : function(e) {
    const CONTEXT_AF = e.srcElement.components['circles-pickup-object'];
    if (CONTEXT_AF.pickedUp === true) {
      CONTEXT_AF.release(CONTEXT_AF);
    }
    else {
      CONTEXT_AF.pickup(CONTEXT_AF);
    }
  },
  remove : function() {
    CONTEXT_AF.el.removeEventListener('click', CONTEXT_AF.clickFunc);
  }
});