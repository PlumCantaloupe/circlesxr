'use strict';

AFRAME.registerComponent('circles-pickup-object', {
  schema: {
    pickupPosition:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //where do we want this relative to the camera
    pickupRotation:     { type: "vec3", default:{x:0.0, y:0.0, z:0.0} },   //what orientation relative to teh camera
    pickupScale:        { type: "vec3", default:{x:1.0, y:1.0, z:1.0} },   //what scale relative to the camera
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
  pickup : function(sendNetworkEvent, passedContext) {
    const CONTEXT_AF    = (passedContext) ? passedContext : this;
    const data          = CONTEXT_AF.data;
    const SAME_DIFF     = 0.001;

    CONTEXT_AF.playerHolder.object3D.attach(CONTEXT_AF.el.object3D);

    const thisPos = {x:CONTEXT_AF.el.object3D.position.x, y:CONTEXT_AF.el.object3D.position.y, z:CONTEXT_AF.el.object3D.position.z};
    const thisRot = {x:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.x), y:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.y), z:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.z)};
    const thisSca = {x:CONTEXT_AF.el.object3D.scale.x, y:CONTEXT_AF.el.object3D.scale.y, z:CONTEXT_AF.el.object3D.scale.z};

    const pickupPos  = (data.pickupPosition.x < 100001.0) ? {x:data.pickupPosition.x, y:data.pickupPosition.y, z:data.pickupPosition.z} : thisPos;
    const pickupRot  = (data.pickupRotation.x < 100001.0) ? {x:data.pickupRotation.x, y:data.pickupRotation.y, z:data.pickupRotation.z} : thisRot;
    const pickupSca  = (data.pickupScale.x < 100001.0) ? {x:data.pickupScale.x, y:data.pickupScale.y, z:data.pickupScale.z} : thisSca;

    //set pickup transforms
    if (data.animate === true) {
      CONTEXT_AF.el.setAttribute('animation__cpo_position', { property:'position', dur:(CIRCLES.UTILS.isTheSameXYZ(pickupPos, thisPos, SAME_DIFF) ? 0.0 : data.animateDurationMS), 
                                                              isRawProperty:true, to:pickupPos, easing:'easeInOutQuad'});
      CONTEXT_AF.el.setAttribute('animation__cpo_rotation', { property:'rotation', dur:(CIRCLES.UTILS.isTheSameXYZ(pickupRot, thisRot, SAME_DIFF) ? 0.0 : data.animateDurationMS), 
                                                              isRawProperty:true, to:pickupRot, easing:'easeInOutQuad'});
      CONTEXT_AF.el.setAttribute('animation__cpo_scale', {    property:'scale', dur:(CIRCLES.UTILS.isTheSameXYZ(pickupSca, thisSca, SAME_DIFF) ? 0.0 : data.animateDurationMS), 
                                                              isRawProperty:true, to:pickupSca, easing:'easeInOutQuad'});
    }
    else {
      CONTEXT_AF.el.object3D.position.set(pickupPos.x, pickupPos.y, pickupPos.z);
      CONTEXT_AF.el.object3D.rotation.set(pickupRot.x, pickupRot.y, pickupRot.z);
      CONTEXT_AF.el.object3D.scale.set(pickupSca.x, pickupSca.y, pickupSca.z);
    }

    CONTEXT_AF.pickedUp = true;

    //let others know
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
    CIRCLES.getCirclesManagerElement().emit(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, {el:CONTEXT_AF.el}, false);
  },
  release : function(sendNetworkEvent, passedContext) {
    const CONTEXT_AF  = (passedContext) ? passedContext : this;
    const data        = CONTEXT_AF.data;
    const SAME_DIFF   = 0.001;

    //release
    CONTEXT_AF.origParent.object3D.attach(CONTEXT_AF.el.object3D); //using three's "attach" allows us to retain world transforms during pickup/release

    const releaseEventFunc = function() {
      //send off event for others
      CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
      CIRCLES.getCirclesManagerElement().emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {el:CONTEXT_AF.el}, false);
    };
    if (data.animate === false) {
      releaseEventFunc();
    }

    //----------------------------------------------------------------------------------------------
    //dropPos
    var thisPos = {x:0, y:0, z:0};  
    if ((CONTEXT_AF.el.object3D.position.x < -2) && (CONTEXT_AF.el.object3D.position.z < -5.5)){

        if ((CONTEXT_AF.el.object3D.position.x < -14) && (CONTEXT_AF.el.object3D.position.z < -8)){
          console.log("new pos 11");
          thisPos = {x:-16.4, y:1.4, z:-8.8};
        }
        if ((CONTEXT_AF.el.object3D.position.x < -14) && (CONTEXT_AF.el.object3D.position.z < -10)){
          console.log("new pos 12");
          thisPos = {x:-16.4, y:1.4, z:-11.75};
        }

        if ((CONTEXT_AF.el.object3D.position.x < -3) && (CONTEXT_AF.el.object3D.position.z < -12)){
          console.log("new pos 21");
          thisPos = {x:-5.5, y:1.4, z:-16.4};
        }
        if ((CONTEXT_AF.el.object3D.position.x < -8) && (CONTEXT_AF.el.object3D.position.z < -12)){
          console.log("new pos 22");
          thisPos = {x:-8.5, y:1.4, z:-16.4};
        }
        if ((CONTEXT_AF.el.object3D.position.x < -10) && (CONTEXT_AF.el.object3D.position.z < -12)){
          console.log("new pos 23");
          thisPos = {x:-11.5, y:1.4, z:-16.4};
        }
        
        if ((CONTEXT_AF.el.object3D.position.x < -14) && (CONTEXT_AF.el.object3D.position.z < -12)){
          console.log("here");
          console.log("new pos 13");
          thisPos = {x:-16.4, y:1.4, z:-14.8};
        }

    }
    else{ //obj go back to orig pos in storage room
      thisPos = {x:data.dropPosition.x, y:data.dropPosition.y, z:data.dropPosition.z};  
      console.log("orig new pos");
    }




    const thisRot = {x:0, y:THREE.MathUtils.radToDeg(CONTEXT_AF.el.object3D.rotation.y), z:0};
    const thisSca = {x:CONTEXT_AF.el.object3D.scale.x, y:CONTEXT_AF.el.object3D.scale.y, z:CONTEXT_AF.el.object3D.scale.z};

    const dropPos  = thisPos;
    const dropRot  = thisRot;
    const dropSca  = (data.dropScale.x < 100001.0) ? {x:data.dropScale.x, y:data.dropScale.y, z:data.dropScale.z} : thisSca;

    //set drop transforms, if any
    if (data.animate === true) {
      CONTEXT_AF.el.setAttribute('animation__cpo_position', { property:'position', dur:(CIRCLES.UTILS.isTheSameXYZ(dropPos, thisPos, SAME_DIFF) ? 0.0 : data.animateDurationMS), 
                                                              isRawProperty:true, to:dropPos, easing:'easeInOutQuad'});
      CONTEXT_AF.el.setAttribute('animation__cpo_rotation', { property:'rotation', dur:(CIRCLES.UTILS.isTheSameXYZ(dropRot, thisRot, SAME_DIFF) ? 0.0 : data.animateDurationMS), 
                                                              isRawProperty:true, to:dropRot, easing:'easeInOutQuad'});
      CONTEXT_AF.el.setAttribute('animation__cpo_scale', {    property:'scale', dur:(CIRCLES.UTILS.isTheSameXYZ(dropSca, thisSca, SAME_DIFF) ? 0.0 : data.animateDurationMS),
                                                              isRawProperty:true, to:dropSca, easing:'easeInOutQuad'});
    }
    else {
      CONTEXT_AF.el.object3D.position.set(dropPos.x, dropPos.y, dropPos.z);
      CONTEXT_AF.el.object3D.rotation.set(dropRot.x, dropRot.y, dropRot.z);
      CONTEXT_AF.el.object3D.scale.set(dropSca.x, dropSca.y, dropSca.z);
    }

    CONTEXT_AF.pickedUp = false;

    //sending a "pre" event to turn off controls before any animations might be done
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT_PRE, null, true);
    //let others know
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {sendNetworkEvent:sendNetworkEvent}, true);
    //CIRCLES.getCirclesManagerElement().emit(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, {el:CONTEXT_AF.el}, false);
  },
  clickFunc : function(e) {
    console.log("clickFunction?")
    const CONTEXT_AF = (e) ? e.srcElement.components['circles-pickup-object'] : this;
    if (CONTEXT_AF.pickedUp === true) {
      CONTEXT_AF.release(true, CONTEXT_AF);
      console.log("clickFunction01")
    }
    else {
      CONTEXT_AF.pickup(true, CONTEXT_AF);
      console.log("clickFunction02")
    }
  }
});