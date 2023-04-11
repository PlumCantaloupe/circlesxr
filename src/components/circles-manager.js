'use strict';

AFRAME.registerComponent('circles-manager', {
  schema: {
    world: {type:'string', default:''},    //use __WORLDNAME__ unless you want to control synching in some other fashion
    user: {type:'string', default:''}     //use __VISIBLENAME__ unless you want to control synching in some other fashion
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function()
  {
    const CONTEXT_AF  = this;
    const scene = document.querySelector('a-scene');
    CONTEXT_AF.selectedObject     = null;
    CONTEXT_AF.camera             = null;
    CONTEXT_AF.playerHolder       = null;
    CONTEXT_AF.isCirclesReadyVar  = false;
    CONTEXT_AF.artefactZoomSteps    = [-2.0, -1.0];
    CONTEXT_AF.artefactRotSteps     = [360.0, 90.0, 180.0, 270.0];

    CONTEXT_AF.arteElems          = [];

    //remove AR/VR buttons if not in a standalone VR HMD (can play with this later but pressing them may result in unexpected behaviour for now i.e. mobile device going into cardboard mode)
    if (!AFRAME.utils.device.isMobileVR()) {
      scene.setAttribute('vr-mode-ui', {enabled:false});
    }

    CONTEXT_AF.addEventListeners();
    CONTEXT_AF.addArtefactNarrationController();

    //attach networkedcomponent (to create avatar) to player rig
    console.log('circles-manager: attaching networked component to avatar');
    CIRCLES.getAvatarRigElement().setAttribute('networked', {template:'#' + CIRCLES.NETWORKED_TEMPLATES.AVATAR, attachTemplateToLocal:true});

    scene.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, (e) => {
        CONTEXT_AF.playerHolder = CIRCLES.getAvatarHolderElementBody();  //this is our player holder
        CONTEXT_AF.objectControls = scene.querySelector('#object_controls');

        CONTEXT_AF.rotateControl  = scene.querySelector('#rotate_control');
        CONTEXT_AF.zoomControl    = scene.querySelector('#zoom_control');
        CONTEXT_AF.releaseControl = scene.querySelector('#release_control');

        //artefact rotation
        CONTEXT_AF.rotateControl.addEventListener('click', (e) => {
          //want the artefact only spinning one way in 90 deg increments.
          if (CONTEXT_AF.artefactRotIndexTarget === 0) {
            // if (Math.abs(Math.PI * 2.0 - CONTEXT_AF.selectedObject.object3D.rotation.y) < Math.PI/2) {
            //   CONTEXT_AF.selectedObject.object3D.rotation.y = Math.PI * 2.0 - CONTEXT_AF.selectedObject.object3D.rotation.y;
            // }
            CONTEXT_AF.playerHolder.setAttribute('rotation', {y:0.0});
          }

          CONTEXT_AF.artefactRotIndexTarget = ((++CONTEXT_AF.artefactRotIndexTarget) > CONTEXT_AF.artefactRotSteps.length - 1) ? 0 : CONTEXT_AF.artefactRotIndexTarget;
          const targetRot = CONTEXT_AF.artefactRotSteps[CONTEXT_AF.artefactRotIndexTarget];

          CONTEXT_AF.playerHolder.setAttribute('animation__rotate', {property:'rotation.y', dur:400, to:targetRot, easing:'easeInOutBack'});
        });

        //release object (can also click on object)
        CONTEXT_AF.releaseControl.addEventListener('click', (e) => { 
          if ( CONTEXT_AF.selectedObject !== null ) {
            CONTEXT_AF.selectedObject.click();  //forward click to artefact
          }
        });

        //artefact zoom
        CONTEXT_AF.zoomControl.addEventListener('click', (e) => { 
          CONTEXT_AF.artefactZoomIndexTarget = ((++CONTEXT_AF.artefactZoomIndexTarget) > CONTEXT_AF.artefactZoomSteps.length - 1) ? 0 : CONTEXT_AF.artefactZoomIndexTarget;
          const targetPos = CONTEXT_AF.artefactZoomSteps[CONTEXT_AF.artefactZoomIndexTarget];
          CONTEXT_AF.playerHolder.setAttribute('animation__zoom', {property:'position.z', dur:400, to:targetPos, easing:'easeInOutBack'});
        });

        //let everyone know that circles is ready
        CONTEXT_AF.isCirclesReadyVar = true;
        CIRCLES.getCirclesSceneElement().emit(CIRCLES.EVENTS.READY);
    });
  },
  update: function() {
    const CONTEXT_AF  = this;
    const data        = CONTEXT_AF.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet
  },
  addArtefactNarrationController: function() {
    const CONTEXT_AF = this;
    const scene = document.querySelector('a-scene');
    const player1 = document.querySelector('#Player1');

    const narrativeElems = document.querySelectorAll('[circles-artefact]');
    let narrativePlayingID = '';

    const stopAllNarrativesFunc = () => {
      narrativePlayingID = '';
      narrativeElems.forEach( artefact => {
        if (artefact.components['circles-sound']) {
          artefact.setAttribute('circles-sound', {state:'stop'});
        }
      });
    }; 
    
    const stopCurrNarrativeFunc = () => {
      narrativePlayingID = '';
      //narrativeElems.forEach( artefact => {
        if (CONTEXT_AF.selectedObject && CONTEXT_AF.selectedObject.components['circles-sound']) {
          CONTEXT_AF.selectedObject.setAttribute('circles-sound', {state:'stop'});
        }
      //});
    }; 

    narrativeElems.forEach( artefact => {
      const start_sound_func = (e) => {
        if (artefact.components['circles-sound']) {
          if ( artefact.getAttribute('id') !== narrativePlayingID ) {
            //if clicking on a new narrtive then stop any playing and play this one.
            stopAllNarrativesFunc();
            narrativePlayingID = artefact.getAttribute('id');
            artefact.setAttribute('circles-sound', {state:'play'});
          }
          // else {
          //   //if you click on the same artefact stop the narrative playing
          //   stopAllNarrativesFunc();
          // }
        }
      };

      artefact.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, start_sound_func);
      artefact.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT_PRE, stopCurrNarrativeFunc);
    });

    //need to also stop sound when "release" button clicked on camera during inspect
    const checkForCameraFunc = (e) => {
      let release_control = player1.querySelector('#release_control');
      //wait until release control exists before we try to add ...
      if (release_control) {
        release_control.addEventListener('click', stopAllNarrativesFunc);
        player1.removeEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, checkForCameraFunc);
      }
      else {
        player1.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, checkForCameraFunc);
      }
    };
    checkForCameraFunc();
  },
  getWorld: function() {
    return this.data.world;
  },
  getUser: function() {
    return this.data.user;
  },
  getRoom: function() {
    return document.querySelector('a-scene').components['networked-scene'].data.room;
  },
  isCirclesReady : function() {
    return this.isCirclesReadyVar;
  },
  addEventListeners : function () {
    const CONTEXT_AF  = this;

    document.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, (e) => {
      CONTEXT_AF.pickupObject( e.srcElement );
    });

    document.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT_PRE, (e) => {
      CONTEXT_AF.releaseObject();
    });

    document.addEventListener(CIRCLES.EVENTS.AVATAR_COSTUME_CHANGED, (e) => {
      //console.log("Event: "  + e.detail.components["circles-user-networked"].data.visiblename + " costume-changed " + e.detail.components["circles-user-networked"].data.color_body);
    });

    CONTEXT_AF.el.sceneEl.addEventListener('camera-set-active', (e) => {
      CONTEXT_AF.camera = e.detail.cameraEl; //get reference to camera in scene (assume there is only one)
    });
  },
  removeEventListeners : function () {
    //TODO
  },
  pickupObject : function (elem) {
    const CONTEXT_AF = this;

    //if already holding an artefact ...
    if ( CONTEXT_AF.selectedObject !== null) {
      //check if same object is being selected
      const isSameObject = CONTEXT_AF.selectedObject.isSameNode( elem );

      if (isSameObject === false) {
        //need to release held artefact
        CONTEXT_AF.selectedObject.components['circles-pickup-object'].release(true, CONTEXT_AF.selectedObject.components['circles-pickup-object']);
      }

      //release currently held object before we pick up another
      CONTEXT_AF.releaseObject();
    }

    CONTEXT_AF.selectedObject = elem;
    CONTEXT_AF.artefactZoomIndexTarget   = 0;
    CONTEXT_AF.artefactRotIndexTarget    = 0;

    //reset control position
    CONTEXT_AF.objectControls.object3D.position.z = CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z;

    //show inspect controls
    CONTEXT_AF.objectControls.querySelectorAll('.button').forEach( (button) => {
      button.setAttribute('circles-interactive-visible', true);
    });
    CONTEXT_AF.objectControls.setAttribute('visible', true);
  },
  releaseObject : function () {
    const CONTEXT_AF = this;

    //turn off object controls
    CONTEXT_AF.objectControls.querySelectorAll('.button').forEach( (button) => {
      button.setAttribute('circles-interactive-visible', false);
    });
    CONTEXT_AF.objectControls.setAttribute('visible', false);

    //reset rotation of "holder" from zooming and rotation effects
    CONTEXT_AF.playerHolder.setAttribute('position', {x:0, y:0, z:-2.0});
    CONTEXT_AF.playerHolder.setAttribute('rotation', {x:0, y:0, z:0});

    CONTEXT_AF.selectedObject  = null;
  }
});
