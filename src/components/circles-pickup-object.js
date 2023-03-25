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
    enabled:            { type: "boolean", default:true },                      //whethere this works
  },
  init: function() {
    const CONTEXT_AF          = this;
    const data                = CONTEXT_AF.data;
    CONTEXT_AF.pickedUp       = false;
    CONTEXT_AF.rotationFudge  = 0.1;   //seems to be required to have some rotation on inspect so that it animates properly back to orig/dropRotation

    CONTEXT_AF.playerHolder   = null;
    CONTEXT_AF.origParent     = null;

    if (CONTEXT_AF.el.hasAttribute('circles-interactive-object') === false) {
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {});
    }

    if (CIRCLES.isReady()) {
      CONTEXT_AF.playerHolder = CIRCLES.getAvatarHolderElementBody();  //this is our player holder
      CONTEXT_AF.origParent = CONTEXT_AF.el.parentNode;
    }
    else {
      const readyFunc = function() {
        CONTEXT_AF.playerHolder = CIRCLES.getAvatarHolderElementBody();  //this is our player holder
        CONTEXT_AF.origParent   = CONTEXT_AF.el.parentNode;
        CIRCLES.getCirclesSceneElement().removeEventListener(CIRCLES.EVENTS.READY, readyFunc);
      };
      CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, readyFunc);
    }
    CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.clickFunc);
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.enabled !== data.enabled) && (data.enabled !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {enabled:data.enabled});
    }
  },
  remove : function() {
    this.el.removeEventListener('click', this.clickFunc);
  },
  pickup : function(passedContext) {
    const CONTEXT_AF = (passedContext) ? passedContext : this;
    const data          = CONTEXT_AF.data;

    CONTEXT_AF.playerHolder.object3D.attach(CONTEXT_AF.el.object3D);

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
        CONTEXT_AF.el.setAttribute('animation__cpo_rotation', {property:'rotation', dur:data.animateDurationMS, to:{x:data.pickupRotation.x, y:data.pickupRotation.y + CONTEXT_AF.rotationFudge, z:data.pickupRotation.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.rotation.set(
          THREE.MathUtils.degToRad(data.pickupRotation.x),
          THREE.MathUtils.degToRad(data.pickupRotation.y) + CONTEXT_AF.rotationFudge,
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

    //let others know
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, null, true);
  },
  release : function(passedContext) {
    const CONTEXT_AF = (passedContext) ? passedContext : this;
    const data = CONTEXT_AF.data;

    //release
    CONTEXT_AF.origParent.object3D.attach(CONTEXT_AF.el.object3D); //using three's "attach" allows us to retain world transforms during pickup/release

    //set drop transforms, if any
    if (data.dropPosition.x < 100000.0) {
      if (data.animate === true) {
        CONTEXT_AF.el.setAttribute('animation__cpo_position', {property:'position', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.dropPosition.x, y:data.dropPosition.y, z:data.dropPosition.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.position.set(data.dropPosition.x, data.dropPosition.y, data.dropPosition.z);
      }
    }

    if (data.dropRotation.x < 100000.0) {
      if (data.animate === true) {
        CONTEXT_AF.el.setAttribute('animation__cpo_rotation', {property:'rotation', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.dropRotation.x, y:data.dropRotation.y, z:data.dropRotation.z}, easing:'easeInOutQuad'});
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
        CONTEXT_AF.el.setAttribute('animation__cpo_scale', {property:'scale', dur:data.animateDurationMS, isRawProperty:true, to:{x:data.dropScale.x, y:data.dropScale.y, z:data.dropScale.z}, easing:'easeInOutQuad'});
      }
      else {
        CONTEXT_AF.el.object3D.scale.set(data.dropScale.x, data.dropScale.y, data.dropScale.z);
      }
    }

    CONTEXT_AF.pickedUp = false;

    const releaseEventFunc = function() {
      //send off event for others
      CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, null, true);
      if (data.animate === true) {
        CONTEXT_AF.el.removeEventListener('animationcomplete__cpo_position', releaseEventFunc);
      }
    };

    //let others know
    if (data.animate === true) {
      CONTEXT_AF.el.addEventListener('animationcomplete__cpo_position', releaseEventFunc);
    }
    else {
      releaseEventFunc();
    }
  },
  clickFunc : function(e) {
    const CONTEXT_AF = e.srcElement.components['circles-pickup-object'];
    if (CONTEXT_AF.pickedUp === true) {
      CONTEXT_AF.release(CONTEXT_AF);
    }
    else {
      CONTEXT_AF.pickup(CONTEXT_AF);
    }
  }
});