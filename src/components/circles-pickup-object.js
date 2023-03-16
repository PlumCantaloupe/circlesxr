'use strict';

AFRAME.registerComponent('circles-pickup-object', {
  schema: {
    pickupPosition: { type: "vec3", default:{} },   //where do we want this relative to the camera
    pickupRotation: { type: "vec3", default:{} },   //what orientation relative to teh camera
    pickupScale:    { type: "vec3", default:{} },   //what scale relative to the camera
    dropPosition:   { type: "vec3", default:{} },   //where do we want this to end up after it is released
    dropRotation:   { type: "vec3", default:{} },   //where do we want this to orient as after it is released
    dropScale:      { type: "vec3", default:{} },   //what scale after it is released
  },
  init: function() {
    const CONTEXT_AF    = this;
    const data          = CONTEXT_AF.data;
    CONTEXT_AF.pickedUp = false;

    CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.READY, function() {
      console.log('Circles is ready: ' + CIRCLES.isReady());

      //this is the camera that is now also ready, if we want to parent elements to it i.e., a user interface or 2D buttons
      console.log("Circles camera ID: " + CIRCLES.getMainCameraElement().id);
  });

    CONTEXT_AF.player   = null
    if (CIRCLES.isReady()) {
      CONTEXT_AF.player   = CIRCLES.getAvatarElement();  //this is our player/camera
      console.log("ready");
      console.log(CONTEXT_AF.player);
    }
    else {
      CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, function() {
        CONTEXT_AF.player   = CIRCLES.getAvatarElement();  //this is our player/camera
        console.log("event.ready");
        console.log(CONTEXT_AF.player);
      });
    }

    CONTEXT_AF.el.addEventListener('click', (e) => {
        if (CONTEXT_AF.pickedUp === true) {
            //release
            CONTEXT_AF.el.sceneEl.object3D.attach(CONTEXT_AF.el.object3D); //using three's "attach" allows us to retain world transforms during pickup/release

            //set drop transforms, if any
            if (!CIRCLES.UTILS.isEmptyObj(data.dropPosition)) {
              CONTEXT_AF.el.object3D.position.set(data.dropPosition.x, data.dropPosition.y, data.dropPosition.z);
            }
            if (!CIRCLES.UTILS.isEmptyObj(data.dropRotation)) {
              CONTEXT_AF.el.object3D.rotation.set(
                THREE.MathUtils.degToRad(data.dropRotation.x),
                THREE.MathUtils.degToRad(data.dropRotation.y),
                THREE.MathUtils.degToRad(data.dropRotation.z)
              );
            }
            if (!CIRCLES.UTILS.isEmptyObj(data.dropPosition)) {
              CONTEXT_AF.el.object3D.scale.set(data.dropScale.x, data.dropScale.y, data.dropScale.z);
            }

            CONTEXT_AF.pickedUp = false;
        }
        else {
            //pick-up
            CONTEXT_AF.player.object3D.attach(CONTEXT_AF.el.object3D);

            //set pickup transforms, if any
            if (!CIRCLES.UTILS.isEmptyObj(data.pickupPosition)) {
              CONTEXT_AF.el.object3D.position.set(data.pickupPosition.x, data.pickupPosition.y, data.pickupPosition.z);
            }
            if (!CIRCLES.UTILS.isEmptyObj(data.pickupRotation)) {
              CONTEXT_AF.el.object3D.rotation.set(
                THREE.MathUtils.degToRad(data.pickupRotation.x),
                THREE.MathUtils.degToRad(data.pickupRotation.y),
                THREE.MathUtils.degToRad(data.pickupRotation.z)
              );
            }
            if (!CIRCLES.UTILS.isEmptyObj(data.pickupScale)) {
              CONTEXT_AF.el.object3D.scale.set(data.pickupScale.x, data.pickupScale.y, data.pickupScale.z);
            }

            CONTEXT_AF.pickedUp = true;

        }
    });
  }
});