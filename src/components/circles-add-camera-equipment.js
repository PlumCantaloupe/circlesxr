'use strict';

//this will add camera equipment to networked "player1" only
AFRAME.registerComponent('circles-add-camera-equipment', {
  schema: {},
  init: function() {
    const CONTEXT_AF = this;

    //only want to attach to 'this' player aka 'player1'
      CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function (event) {
  
        let rigElem = CONTEXT_AF.el;
        const avatarCam = rigElem.querySelector('.avatar');

        //set camera
        avatarCam.setAttribute('id', CIRCLES.CONSTANTS.PRIMARY_USER_ID + 'Cam');
        avatarCam.setAttribute('camera',{});
        avatarCam.setAttribute('look-controls',{pointerLockEnabled:false});

        rigElem.setAttribute('circles-spawn-at-random-checkpoint', {});
        rigElem.setAttribute('circles-snap-turning',{enabled:true});
        rigElem.setAttribute('movement-controls',{controls:'checkpoint,keyboard, gamepad', constrainToNavMesh:true, speed:0.2});
        rigElem.setAttribute('checkpoint-controls',{mode:'teleport'});

        //console.log('Attached camera controls to rig');

        const lineDistance = 20;
        const raycasterTestInterval = 30;

        //don't want nipple controls on anything but mobile
        if (AFRAME.utils.device.isMobile() === true) {
          rigElem.setAttribute('movement-controls',{controls:'checkpoint,keyboard, gamepad, nipple'});
          rigElem.setAttribute('nipple-controls', {mode:'static'});
        }

        //add pointer if not a standalone HMD (we will use laser controls there instead)
        if (!AFRAME.utils.device.isMobileVR()) {
          //console.log('Adding pointer/cursor controls');

          let entity_Pointer = document.createElement('a-entity');
          entity_Pointer.setAttribute('id', 'primary_pointer');
          entity_Pointer.setAttribute('class', 'pointer');
          entity_Pointer.setAttribute('cursor', 'fuse:false; rayOrigin:mouse;'); //don't want fuse - just clicks as expected :)
          entity_Pointer.setAttribute('raycaster', {far:lineDistance, interval:raycasterTestInterval, objects:'.interactive', useWorldCoordinates:true});
          entity_Pointer.setAttribute('position', {x:0.0, y:0.0, z:-1.0});
          avatarCam.appendChild(entity_Pointer);
        }
        else {
          console.log('Adding VR controls');

          //get hand colours
          const bodyColor   = avatarCam.components["circles-user-networked"].data.color_head;

          let primaryController = document.createElement('a-entity');
          primaryController.setAttribute('class', 'controller_thumb controller_right');
          primaryController.setAttribute('hand-controls', {hand:'right', handModelStyle:'lowPoly', color:bodyColor});
          rigElem.appendChild(primaryController);

          let secondaryController = document.createElement('a-entity');
          secondaryController.setAttribute('class', 'controller_thumb controller_left');
          secondaryController.setAttribute('hand-controls', {hand:'left', handModelStyle:'lowPoly', color:bodyColor});
          rigElem.appendChild(secondaryController);

          //we will default with right controller having pointer first (both active at first though)
          const primaryControllerID = 'primary_pointer';
          const secondaryControllerID = 'secondary_pointer';
          let raycasterProperties = {enabled:true, showLine:true, showLine:true, far:lineDistance, interval:raycasterTestInterval, objects:'.interactive'};
          let lineProperties = {visible:true, start:{x:0, y:0, z:0}, end:{x:0, y:-Math.sqrt(lineDistance), z:-Math.sqrt(lineDistance)}, color:'rgb(100, 100, 100)', gapSize:0.02, dashSize:0.02};
         
          primaryController.setAttribute('id', primaryControllerID);
          primaryController.setAttribute('laser-controls',{hand:'right', model:false});
          primaryController.setAttribute('raycaster', raycasterProperties);
          primaryController.setAttribute('circles-dashed-line', lineProperties);
          
          secondaryController.setAttribute('id', secondaryControllerID);
          secondaryController.setAttribute('laser-controls',{hand:'left', model:false});
          secondaryController.setAttribute('raycaster', raycasterProperties);
          secondaryController.setAttribute('circles-dashed-line', lineProperties);

          //HACK: Delaying soem initialization until components are ready
          CONTEXT_AF.el.sceneEl.addEventListener('enter-vr', function (e) {
            // if (e.detail.name === 'raycaster') {
              console.log('enter VR event');
              setTimeout(function(e) {
                console.log('YAHOOOOOOOOOO');
                primaryController.setAttribute('raycaster', {enabled:true, showLine:true, direction:{x: 0, y: -1, z: -1}});
                primaryController.setAttribute('circles-dashed-line', {visible:false});

                secondaryController.setAttribute('raycaster', {enabled:false, showLine:false, direction:{x: 0, y: -1, z: -1}});
                secondaryController.setAttribute('circles-dashed-line', {visible:true});

                rigElem.setAttribute('gamepad-controls', {enabled:false});
              }, 300);
            // }
          });

          //TODO: add a debug toggle
          //let fps_entity = document.createElement('a-entity');
          //fps_entity.setAttribute('fps-counter',{});
          //fps_entity.setAttribute('position',{x:0.0, y:0.1, z:-0.2});
          //primaryController.appendChild(fps_entity);

          //advanced features
          //we want 'gamepade movement-controls' as an "advanced" feature only triggered when the user clicks down on joystick as a new Vr doing this can make themselves nauseous
          let gamepadOn = false;
          const toggleGamepadControlsFunc = (e) => {
            //console.log(e.type);
            //console.log(CONTEXT_AF.el);
            gamepadOn = !gamepadOn;

            if (gamepadOn === true) {
              console.log('turn on smooth gamepad controls');
              // rigElem.setAttribute('movement-controls',{controls:'checkpoint,keyboard,gamepad,nipple'});
              rigElem.setAttribute('gamepad-controls', {enabled:true});
              rigElem.setAttribute('circles-snap-turning', {enabled:false});
            } 
            else {
              console.log('turn off smooth gamepad controls');
              rigElem.setAttribute('gamepad-controls', {enabled:false});
              rigElem.setAttribute('circles-snap-turning',{enabled:true});
            }
          };

          //to switch and trigger laser-controls (so that you can use either controller)
          const toggleLaserPointerFunc = (e) => {
            // console.log(e);
            if (e.type === 'triggerdown') {              
              console.log(e.target.id);

              const newActiveController = e.target;
              const oldActiveControllerID = (newActiveController.id === primaryControllerID) ? secondaryControllerID : primaryControllerID;
              const oldActiveController = document.querySelector('#' + oldActiveControllerID);

              //turn off old active pointer
              oldActiveController.setAttribute('raycaster', {enabled:false, showLine:false});
              oldActiveController.setAttribute('circles-dashed-line', {visible:true});
              oldActiveController.setAttribute('id', secondaryControllerID);

              //turn on new active pointer
              newActiveController.setAttribute('raycaster', {enabled:true, showLine:true, direction:{x: 0, y: -1, z: -1}});
              newActiveController.setAttribute('circles-dashed-line', {visible:false});
              newActiveController.setAttribute('id', primaryControllerID);

              console.log(e.target.components['raycaster']);
              console.log(e.target.components['line']);
            } 
            else {
              console.warn('toggleLaserPointerFunc has an unexpected event');
            }
          };

          primaryController.addEventListener('thumbstickup', toggleGamepadControlsFunc);
          primaryController.addEventListener('triggerdown', toggleLaserPointerFunc);

          secondaryController.addEventListener('thumbstickup', toggleGamepadControlsFunc);
          secondaryController.addEventListener('triggerdown', toggleLaserPointerFunc);
        }

        const CONTROL_BUTTON_SIZE = 0.2;
        const CONTROL_BUTTON_OFFSET_X = 0.3;
        const CONTROL_BUTTON_OFFSET_Y = 0.45;
        const CONTROLS_OFFSET_Y = -0.4;

        //create object controls will toggle on when picking up an object
        let objectControls = document.createElement('a-entity');
        objectControls.setAttribute('id', 'object_controls');
        objectControls.setAttribute('position', {x:0.0, y:CONTROLS_OFFSET_Y, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        objectControls.setAttribute('rotation', {x:0, y:0, z:0});
        avatarCam.appendChild(objectControls);

        //rotate button
        let rotateElem = document.createElement('a-entity');
        rotateElem.setAttribute('id', 'rotate_control');
        rotateElem.setAttribute('class', 'interactive button');
        rotateElem.setAttribute('position', {x:-CONTROL_BUTTON_OFFSET_X, y:-CONTROL_BUTTON_OFFSET_Y, z:0.0});
        rotateElem.setAttribute('geometry',  { primitive:'plane', width:CONTROL_BUTTON_SIZE, height:CONTROL_BUTTON_SIZE });
        rotateElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_ROTATE, color:'rgb(255,255,255)', shader:'flat', transparent:true});
        rotateElem.addEventListener('mouseenter', function (evt) { evt.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
        rotateElem.addEventListener('mouseleave', function (evt) { evt.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });
        objectControls.appendChild(rotateElem);
        
        let rotateElemLabel = document.createElement('a-entity');
        rotateElemLabel.setAttribute('id', 'rotate_label');
        rotateElemLabel.setAttribute('position', {x:-CONTROL_BUTTON_OFFSET_X, y:-CONTROL_BUTTON_OFFSET_Y - CONTROL_BUTTON_SIZE/1.5, z:0.0});
        rotateElemLabel.setAttribute('text',  { value:'rotate', color:'rgb(255,255,255)', width:CONTROL_BUTTON_SIZE * 2, wrapCount:10, align:'center', anchor:'center' });
        objectControls.appendChild(rotateElemLabel);

        let releaseElem = document.createElement('a-entity');
        releaseElem.setAttribute('id', 'release_control');
        releaseElem.setAttribute('class', 'interactive button');
        releaseElem.setAttribute('position', {x:0.0, y:-CONTROL_BUTTON_OFFSET_Y, z:0.0});
        releaseElem.setAttribute('geometry',  {  primitive:'plane', 
                                                width:CONTROL_BUTTON_SIZE,
                                                height:CONTROL_BUTTON_SIZE
                                                });
        releaseElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_RELEASE, color:'rgb(255,255,255)', shader:'flat', transparent:true});
        releaseElem.addEventListener('mouseenter', function (evt) { evt.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
        releaseElem.addEventListener('mouseleave', function (evt) { evt.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });
        objectControls.appendChild(releaseElem);

        let releaseElemLabel = document.createElement('a-entity');
        releaseElemLabel.setAttribute('id', 'release_label');
        releaseElemLabel.setAttribute('position', {x:0.0, y:-CONTROL_BUTTON_OFFSET_Y - CONTROL_BUTTON_SIZE/1.5, z:0.0});
        releaseElemLabel.setAttribute('text',  { value:'release', color:'rgb(255,255,255)', width:CONTROL_BUTTON_SIZE * 2, wrapCount:10, align:'center', anchor:'center' });
        objectControls.appendChild(releaseElemLabel);

        let zoomElem = document.createElement('a-entity');
        zoomElem.setAttribute('id', 'zoom_control');
        zoomElem.setAttribute('class', 'interactive button');
        zoomElem.setAttribute('position', {x:CONTROL_BUTTON_OFFSET_X, y:-CONTROL_BUTTON_OFFSET_Y, z:0.0});
        zoomElem.setAttribute('geometry',  {  primitive:'plane', 
                                                width:CONTROL_BUTTON_SIZE,
                                                height:CONTROL_BUTTON_SIZE
                                                });
        zoomElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_ZOOM, color:'rgb(255,255,255)', shader:'flat', transparent:true});
        objectControls.appendChild(zoomElem);
        zoomElem.addEventListener('mouseenter', function (evt) { evt.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
        zoomElem.addEventListener('mouseleave', function (evt) { evt.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });

        let zoomElemLabel = document.createElement('a-entity');
        zoomElemLabel.setAttribute('id', 'release_label');
        zoomElemLabel.setAttribute('position', {x:CONTROL_BUTTON_OFFSET_X, y:-CONTROL_BUTTON_OFFSET_Y - CONTROL_BUTTON_SIZE/1.5, z:0.0});
        zoomElemLabel.setAttribute('text',  { value:'zoom', color:'rgb(255,255,255)', width:CONTROL_BUTTON_SIZE * 2, wrapCount:10, align:'center', anchor:'center' });
        objectControls.appendChild(zoomElemLabel);

        //hide object control buttons
        objectControls.querySelectorAll('.button').forEach( (button) => {
          button.setAttribute('circles-interactive-visible', false);
        });
        objectControls.setAttribute('visible', false);

        //TODO: if a teacher, give extra controls
        if (avatarCam.components["circles-user-networked"].data.usertype === CIRCLES.USER_TYPE.TEACHER) {
          console.log('I am a teacher.');
        }

        //If a researcher give extra controls
        if (avatarCam.components["circles-user-networked"].data.usertype === CIRCLES.USER_TYPE.RESEARCHER) {
          console.log('I am a researcher.');
        }

        //console.log('Attached camera controls to avatar');
        CONTEXT_AF.el.emit(CIRCLES.EVENTS.CAMERA_ATTACHED, {element:CONTEXT_AF.el}, true);
      });
    // }
  }
});