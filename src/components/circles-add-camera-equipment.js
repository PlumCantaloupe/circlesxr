'use strict';

//this will add camera equipment to networked "player1" only
AFRAME.registerComponent('circles-add-camera-equipment', {
  schema: {},
  init: function() {
    const CONTEXT_AF = this;

    //only want to attach to 'this' player aka 'player1'
    // if ( CONTEXT_AF.el.getAttribute('id') === CIRCLES.CONSTANTS.PRIMARY_USER_ID ) {
      CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function (event) {
  
        let rigElem = CONTEXT_AF.el;
        //rigElem.setAttribute('id', CIRCLES.CONSTANTS.PRIMARY_USER_ID);
        const avatarCam = rigElem.querySelector('.avatar');

        //set camera
        //let cameraElem = event.detail.element;
        avatarCam.setAttribute('id', CIRCLES.CONSTANTS.PRIMARY_USER_ID + 'Cam');
        avatarCam.setAttribute('camera',{});
        avatarCam.setAttribute('look-controls',{pointerLockEnabled:false});

        //set rig
        rigElem.setAttribute('circles-spawn-at-random-checkpoint', {});
        rigElem.setAttribute('circles-snap-turning',{enabled:true});
        //rigElem.setAttribute('circles-teleport',{});
        //rigElem.setAttribute('circles-wasd-movement',{adEnabled:true, fly:false, acceleration:20});
        rigElem.setAttribute('movement-controls',{controls:'gamepad,keyboard,checkpoint', constrainToNavMesh:true, speed:0.2});
        rigElem.setAttribute('gamepad-controls', {enabled:false});  //default we want off for now (can make unsuspecting users nauseous ...)
        rigElem.setAttribute('checkpoint-controls',{mode:'teleport'});
        //console.log('Attached camera controls to rig');

        //add pointer if not a standalone HMD (we will use laser controls there instead)
        if (!AFRAME.utils.device.isMobileVR()) {
          //console.log('Adding pointer/cursor controls');

          let entity_Pointer = document.createElement('a-entity');
          entity_Pointer.setAttribute('id', 'primary_pointer');
          entity_Pointer.setAttribute('class', 'pointer');
          entity_Pointer.setAttribute('cursor', 'fuse:false; rayOrigin:mouse;'); //don't want fuse - just clicks as expected :)
          entity_Pointer.setAttribute('raycaster', {far:20, interval:30, objects:'.interactive', useWorldCoordinates:true});
          entity_Pointer.setAttribute('position', {x:0.0, y:0.0, z:-1.0});
          avatarCam.appendChild(entity_Pointer);
        }
        else {
          console.log('Adding VR controls');

          //get hand colours
          const bodyColor   = avatarCam.components["circles-user-networked"].data.color_head;

          let entity_Controller_1 = document.createElement('a-entity');
          entity_Controller_1.setAttribute('id', 'primary_pointer');
          entity_Controller_1.setAttribute('class', 'controller_thumb controller_right');
          entity_Controller_1.setAttribute('laser-controls',{hand:'right', model:false});
          entity_Controller_1.setAttribute('hand-controls', {hand:'right', handModelStyle:'lowPoly', color:bodyColor});
          entity_Controller_1.setAttribute('raycaster', {far:20, interval:30, objects:'.interactive', showLine:true, useWorldCoordinates:true});
          rigElem.appendChild(entity_Controller_1);

          let entity_Controller_2 = document.createElement('a-entity');
          entity_Controller_2.setAttribute('class', 'controller_thumb controller_left');
          entity_Controller_2.setAttribute('hand-controls', {hand:'left', handModelStyle:'lowPoly', color:bodyColor});
          rigElem.appendChild(entity_Controller_2);

          //let fps_entity = document.createElement('a-entity');
          //fps_entity.setAttribute('fps-counter',{});
          //fps_entity.setAttribute('position',{x:0.0, y:0.1, z:-0.2});
          //entity_Controller_1.appendChild(fps_entity);

          //modify cursor down and up events that laser-controls is setting 
          //look to laser-controls https://github.com/aframevr/aframe/blob/master/src/components/laser-controls.js
          //cursor: {downEvents: ['trackpaddown', 'triggerdown'], upEvents: ['trackpadup', 'triggerup']},

          //advanced features
          //we want 'gamepade movement-controls' as an "advanced" feature only triggered when the user clicks down on joystick as a new Vr doing this can make themselves nauseous
          //just don't want joystick movement and snap-turning on at the same time (as we want to have each controller have the same controls)
          const toggleGamepadControlsFunc = (e) => {
            //console.log(e.type);
            //console.log(CONTEXT_AF.el);
            if (e.type === 'thumbstickdown') {
              console.log('turn on smooth gamepad controls');
              CONTEXT_AF.el.setAttribute('gamepad-controls', {enabled:true});
              CONTEXT_AF.el.setAttribute('circles-snap-turning', {enabled:false});
            } 
            else if (e.type === 'thumbstickup') {
              console.log('turn off smooth gamepad controls');
              CONTEXT_AF.el.setAttribute('gamepad-controls', {enabled:false});
              CONTEXT_AF.el.setAttribute('circles-snap-turning',{enabled:true});
            }
            else {
              console.warn('toggleGamepadControlsFunc has an unexpected event');
            }
          };

          entity_Controller_1.addEventListener('thumbstickdown', toggleGamepadControlsFunc);
          entity_Controller_1.addEventListener('thumbstickup', toggleGamepadControlsFunc);

          entity_Controller_2.addEventListener('thumbstickdown', toggleGamepadControlsFunc);
          entity_Controller_2.addEventListener('thumbstickup', toggleGamepadControlsFunc);
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