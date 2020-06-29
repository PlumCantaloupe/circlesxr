'use strict';

//this will add camera equipment to networked "player1" only
AFRAME.registerComponent('circles-add-camera-equipment', {
  schema: {
  },
  init: function() {
    let Context_AF = this;

    //only want to attach to 'this' player aka 'player1'
    if ( Context_AF.el.getAttribute('id') === 'player1' ) {
      Context_AF.el.addEventListener(CIRCLES.EVENTS.AVATAR_RIG_LOADED, function (event) {
        let rigElem = event.detail.element;
        //rigElem.setAttribute('circles-spawn-in-circle',{radius:1});
        rigElem.setAttribute('id', 'player1CamRig');
        rigElem.setAttribute('circles-spawn-at-random-checkpoint', {});
        rigElem.setAttribute('circles-teleport',{});
        rigElem.setAttribute('circles-snap-turning',{});
        rigElem.setAttribute('keyboard-controls',{enabled:false});
        console.log('Attached camera controls to rig');

        //assuming there are hand controllers ...
        if ( AFRAME.utils.device.checkHeadsetConnected() )  {
          //get hand colours
          const avatar      = document.querySelector("#player1").querySelector('.avatar');
          const bodyColor   = avatar.components["circles-user-networked"].data.color_head;

          let entity_Controller_1 = document.createElement('a-entity');
          entity_Controller_1.setAttribute('id','controller_right');
          entity_Controller_1.setAttribute('class', 'controller_thumb');
          entity_Controller_1.setAttribute('laser-controls',{hand:'right', model:false});
          entity_Controller_1.setAttribute('hand-controls', {hand:'right', handModelStyle:'lowPoly', color:bodyColor});
          entity_Controller_1.setAttribute('raycaster', {far:20, interval:300, objects:'.interactive', showLine:true});
          rigElem.appendChild(entity_Controller_1);

          let entity_Controller_2 = document.createElement('a-entity');
          entity_Controller_2.setAttribute('id','controller_left');
          entity_Controller_2.setAttribute('class', 'controller_thumb');
          entity_Controller_2.setAttribute('hand-controls', {hand:'left', handModelStyle:'lowPoly', color:bodyColor});
          rigElem.appendChild(entity_Controller_2);
        }

        //detect Oculus GO
        // const vrDisplayName = AFRAME.utils.device.getVRDisplay().displayName;
        // console.log('vrDisplayName: ' + vrDisplayName);
        // console.log(AFRAME.utils.device.getVRDisplay());
        // if (/^Oculus GO$/.test(vrDisplayName)) {
        //   console.log('setting oculus GO controller');
        //   //add 3DOF controller
        //   let entity_Controller_1 = document.createElement('a-entity');
        //   entity_Controller_1.setAttribute('id','controller_3DOF');
        //   entity_Controller_1.setAttribute('class', 'controller_track');
        //   entity_Controller_1.setAttribute('laser-controls',{});
        //   entity_Controller_1.setAttribute('raycaster', {far:20, interval:300, objects:'.interactive', showLine:true});
        //   rigElem.appendChild(entity_Controller_1);

        //   // let fps_entity = document.createElement('a-entity');
        //   // fps_entity.setAttribute('fps-counter',{});
        //   // fps_entity.setAttribute('position',{x:0.0, y:0.1, z:-0.2});
        //   // entity_Controller_1.appendChild(fps_entity);
        // }
        // else if (/^Oculus Quest$/.test(vrDisplayName)) {
        //   //add 6DOF Controller
        //   console.log('setting Oculus Quest controller');

        //   let entity_Controller_1 = document.createElement('a-entity');
        //   entity_Controller_1.setAttribute('id','controller_right');
        //   entity_Controller_1.setAttribute('class', 'controller_thumb');
        //   entity_Controller_1.setAttribute('laser-controls',{hand:'right', model:false});
        //   entity_Controller_1.setAttribute('hand-controls','right');
        //   entity_Controller_1.setAttribute('raycaster', {far:20, interval:300, objects:'.interactive', showLine:true});
        //   rigElem.appendChild(entity_Controller_1);

        //   let entity_Controller_2 = document.createElement('a-entity');
        //   entity_Controller_2.setAttribute('id','controller_left');
        //   entity_Controller_1.setAttribute('class', 'controller_thumb');
        //   entity_Controller_2.setAttribute('hand-controls','left');
        //   rigElem.appendChild(entity_Controller_2);

        //   // let fps_entity = document.createElement('a-entity');
        //   // fps_entity.setAttribute('fps-counter',{});
        //   // fps_entity.setAttribute('position',{x:0.0, y:0.1, z:-0.2});
        //   // entity_Controller_1.appendChild(fps_entity);
        // }
        // else {
        //   console.log('setting "everything else" controller');

        //   let entity_Controller_1 = document.createElement('a-entity');
        //   entity_Controller_1.setAttribute('id','controller_3DOF');
        //   entity_Controller_1.setAttribute('class', 'controller');
        //   entity_Controller_1.setAttribute('laser-controls',{});
        //   entity_Controller_1.setAttribute('raycaster', {far:20, interval:300, objects:'.interactive', showLine:true});
        //   rigElem.appendChild(entity_Controller_1);

        //   // let fps_entity = document.createElement('a-entity');
        //   // fps_entity.setAttribute('fps-counter',{});
        //   // fps_entity.setAttribute('position',{x:0.0, y:0.1, z:-0.2});
        //   // entity_Controller_1.appendChild(fps_entity);
        // }

        
      });
  
      Context_AF.el.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function (event) {
        let cameraElem = event.detail.element;
        cameraElem.setAttribute('id', 'player1Cam');
        cameraElem.setAttribute('camera',{});
        cameraElem.setAttribute('look-controls',{pointerLockEnabled:false});

        //add pointer if not a standalone HMD (we will use laser controls there instead)
        if (!AFRAME.utils.device.isMobileVR()) {

          console.log('pointer/cursor controls ADDED');

          let entity_Pointer = document.createElement('a-entity');
          entity_Pointer.setAttribute('class', 'pointer');
          entity_Pointer.setAttribute('cursor', 'fuse:false; rayOrigin:mouse;'); //don't want fuse - just clicks as expected :)
          entity_Pointer.setAttribute('raycaster', {far:20, interval:300, objects:'.interactive'});
          entity_Pointer.setAttribute('position', {x:0.0, y:0.0, z:-1.0});
          cameraElem.appendChild(entity_Pointer);
        }
        else {

          console.log('pointer/cursor controls NOT ADDED');

          //modify cursor down and up events that laser-controls is setting 
          //look to laser-controls https://github.com/aframevr/aframe/blob/master/src/components/laser-controls.js
          //cursor: {downEvents: ['trackpaddown', 'triggerdown'], upEvents: ['trackpadup', 'triggerup']},
        }

        const CONTROL_BUTTON_SIZE = 0.2;
        const CONTROL_BUTTON_OFFSET_X = 0.3;
        const CONTROL_BUTTON_OFFSET_Y = 0.45;
        const CONTROLS_OFFSET_Y = -0.4;
        const CONTROLS_OPACITY_NEUTRAL = 0.1;
        const CONTROLS_OPACITY_HOVER = 0.5;

        //create object controls will toggle on when pickung up an object
        let objectControls = document.createElement('a-entity');
        objectControls.setAttribute('id', 'object_controls');
        objectControls.setAttribute('visible', false);
        objectControls.setAttribute('position', {x:0.0, y:CONTROLS_OFFSET_Y, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        objectControls.setAttribute('rotation', {x:0, y:0, z:0});
        cameraElem.appendChild(objectControls);

        let rotateElem = document.createElement('a-entity');
        rotateElem.setAttribute('id', 'rotate_control');
        rotateElem.setAttribute('class', 'interactive');
        rotateElem.setAttribute('position', {x:-CONTROL_BUTTON_OFFSET_X, y:-CONTROL_BUTTON_OFFSET_Y, z:0.0});
        rotateElem.setAttribute('geometry',  {  primitive:'plane', 
                                                width:CONTROL_BUTTON_SIZE,
                                                height:CONTROL_BUTTON_SIZE
                                                });
        rotateElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_ROTATE, color:'rgb(255,255,255)', shader:'flat', transparent:true});
        objectControls.appendChild(rotateElem);
        rotateElem.addEventListener('mouseenter', function (evt) { evt.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
        rotateElem.addEventListener('mouseleave', function (evt) { evt.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });

        let releaseElem = document.createElement('a-entity');
        releaseElem.setAttribute('id', 'release_control');
        releaseElem.setAttribute('class', 'interactive');
        releaseElem.setAttribute('position', {x:0.0, y:-CONTROL_BUTTON_OFFSET_Y, z:0.0});
        releaseElem.setAttribute('geometry',  {  primitive:'plane', 
                                                width:CONTROL_BUTTON_SIZE,
                                                height:CONTROL_BUTTON_SIZE
                                                });
        releaseElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_RELEASE, color:'rgb(255,255,255)', shader:'flat', transparent:true});
        objectControls.appendChild(releaseElem);
        releaseElem.addEventListener('mouseenter', function (evt) { evt.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
        releaseElem.addEventListener('mouseleave', function (evt) { evt.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });

        let zoomElem = document.createElement('a-entity');
        zoomElem.setAttribute('id', 'zoom_control');
        zoomElem.setAttribute('class', 'interactive');
        zoomElem.setAttribute('position', {x:CONTROL_BUTTON_OFFSET_X, y:-CONTROL_BUTTON_OFFSET_Y, z:0.0});
        zoomElem.setAttribute('geometry',  {  primitive:'plane', 
                                                width:CONTROL_BUTTON_SIZE,
                                                height:CONTROL_BUTTON_SIZE
                                                });
        zoomElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_ZOOM, color:'rgb(255,255,255)', shader:'flat', transparent:true});
        objectControls.appendChild(zoomElem);
        zoomElem.addEventListener('mouseenter', function (evt) { evt.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
        zoomElem.addEventListener('mouseleave', function (evt) { evt.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });

        console.log('Attached camera controls to avatar');
        Context_AF.el.emit(CIRCLES.EVENTS.CAMERA_ATTACHED, {element:Context_AF.el}, true);
      });
    }
  }
});
