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
    CONTEXT_AF.selectedObject  = null;
    CONTEXT_AF.zoomNear         = false;    //1=normal, 2=near
    CONTEXT_AF.camera           = null;

    //remove AR/VR buttons if not in a standalone VR HMD (can play with this later but pressing them may result in unexpected behaviour for now i.e. mobile device going into cardboard mode)
    if (!AFRAME.utils.device.isMobileVR()) {
      scene.setAttribute('vr-mode-ui', {enabled:false});
    }

    CONTEXT_AF.createFloatingObjectDescriptions();
    CONTEXT_AF.addEventListeners(); //want after everything loaded in via network
    CONTEXT_AF.addArtefactNarrationController();

    scene.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, (e) => {
        CONTEXT_AF.objectControls = scene.querySelector('#object_controls');

        CONTEXT_AF.rotateControl  = scene.querySelector('#rotate_control');
        CONTEXT_AF.zoomControl    = scene.querySelector('#zoom_control');
        CONTEXT_AF.releaseControl = scene.querySelector('#release_control');

        CONTEXT_AF.rotateControl.addEventListener('click', (e) => { 
          let rotationOffset = CONTEXT_AF.selectedObject.components['circles-parent-constraint'].data.rotationOffset;
          let rotationOffsetY =  rotationOffset.y;
          rotationOffsetY += 90.0;
          //now round to 90 increments so that if a user presses quickly it doesn't end on a strange angle
          rotationOffsetY = Math.round(rotationOffsetY);                      //round so we have whole numbers
          let remainder   = rotationOffsetY % 90;                             //find remainder
          let diff        = ( remainder < 90/2 ) ? -remainder : 90-remainder; //if too small round down to "0" else round up to "90" increment
          rotationOffsetY += diff;

          console.log("rotate artefact");
          CONTEXT_AF.selectedObject.components['circles-parent-constraint'].data.rotationOffset.y = rotationOffsetY;
        });

        //release object (can also click on object)
        CONTEXT_AF.releaseControl.addEventListener('click', (e) => { 
          if ( CONTEXT_AF.selectedObject !== null ) {
            CONTEXT_AF.selectedObject.emit( CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {}, true );
            CONTEXT_AF.releaseInspectedObject(CONTEXT_AF.selectedObject.components['circles-inspect-object']);
          }
        });

        CONTEXT_AF.zoomControl.addEventListener('click', (e) => { 
          CONTEXT_AF.zoomNear = !CONTEXT_AF.zoomNear;
          let positionOffset =  CONTEXT_AF.selectedObject.components['circles-parent-constraint'].data.positionOffset;
          let positionOffsetZ = (CONTEXT_AF.zoomNear) ? -1.0 : -2.0;
          //CONTEXT_AF.selectedObject.setAttribute('circles-parent-constraint', {positionOffset:positionOffset});

          CONTEXT_AF.selectedObject.components['circles-parent-constraint'].data.positionOffset.z = positionOffsetZ;
        });
    });
  },
  update: function() {
    const CONTEXT_AF  = this;
    const data        = CONTEXT_AF.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet
  },
  addArtefactNarrationController: function() {
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

    narrativeElems.forEach( artefact => {
      
      const start_sound_func = (e) => {
        if (artefact.components['circles-sound']) {
          if ( artefact.getAttribute('id') !== narrativePlayingID ) {
            //if clicking on a new narrtive then stop any playing and play this one.
            stopAllNarrativesFunc();
            narrativePlayingID = artefact.getAttribute('id');
            artefact.setAttribute('circles-sound', {state:'play'});
          }
          else {
            //if you click on the same artefact stop the narrative playing
            stopAllNarrativesFunc();
          }
        }
      };

      artefact.addEventListener('click', start_sound_func);
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
  addEventListeners : function () {
    const CONTEXT_AF  = this;
    
    document.addEventListener(CIRCLES.EVENTS.SELECT_THIS_OBJECT, (e) => {
      CONTEXT_AF.selectObject( e.detail );
    });

    document.addEventListener(CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, (e) => {
      console.log("Event: "  + e.detail.getAttribute('id') + " ownership-gained");
    });

    document.addEventListener(CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, (e) => {
      console.log("Event: "  + e.detail.getAttribute('id') + " ownership-lost");

      if ( CONTEXT_AF.selectedObject !== null ) {
        CONTEXT_AF.selectedObject.emit( CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {}, true );
        CONTEXT_AF.releaseInspectedObject(CONTEXT_AF.selectedObject.components['circles-inspect-object']);
      }
    });

    document.addEventListener(CIRCLES.EVENTS.OBJECT_OWNERSHIP_CHANGED, (e) => {
      console.log("Event: "  + e.detail.getAttribute('id') + " ownership-changed");
    });

    document.addEventListener(CIRCLES.EVENTS.AVATAR_COSTUME_CHANGED, (e) => {
        console.log("Event: "  + e.detail.components["circles-user-networked"].data.visiblename + " costume-changed " + e.detail.components["circles-user-networked"].data.color_body);
      });

    CONTEXT_AF.el.sceneEl.addEventListener('camera-set-active', (e) => {
      CONTEXT_AF.camera = e.detail.cameraEl; //get reference to camera in scene (assume there is only one)
    });
  },
  removeEventListeners : function () {
    //TODO
  },
  createFloatingObjectDescriptions : function () 
  {
    const CONTEXT_AF  = this;
    let scene = CONTEXT_AF.el.sceneEl;

    const TEXT_WINDOW_WIDTH         = 2.0;
    const TEXT_DESC_WINDOW_HEIGHT   = 0.9;
    const TEXT_TITLE_WINDOW_HEIGHT  = 0.3;
    const TEXT_PADDING              = 0.1;
    const DIST_BETWEEN_PLATES       = 0.05;
    const POINTER_HEIGHT            = 0.2;

    CONTEXT_AF.objectDescriptions  = document.createElement('a-entity');
    CONTEXT_AF.objectDescriptions.setAttribute('id', 'object_descriptions');
    CONTEXT_AF.objectDescriptions.setAttribute('visible', false);
    CONTEXT_AF.objectDescriptions.setAttribute('position', {x:0.0, y:0.0, z:0.0});
    CONTEXT_AF.objectDescriptions.setAttribute('rotation', {x:0, y:0, z:0});
    scene.appendChild(CONTEXT_AF.objectDescriptions );

    CONTEXT_AF.rotateDescElem = document.createElement('a-entity');
    CONTEXT_AF.objectDescriptions.appendChild(CONTEXT_AF.rotateDescElem);

    let infoOffsetElem = document.createElement('a-entity');
    infoOffsetElem.setAttribute('position',{x:-TEXT_WINDOW_WIDTH/2, y:-(DIST_BETWEEN_PLATES + TEXT_TITLE_WINDOW_HEIGHT)/2, z:0});
    CONTEXT_AF.rotateDescElem.appendChild(infoOffsetElem);

    //add bg for desc
    let desc_BG = document.createElement('a-entity');
    // desc_BG.setAttribute('geometry',  {primitive:'plane', width:TEXT_WINDOW_WIDTH, height:TEXT_DESC_WINDOW_HEIGHT});
    desc_BG.setAttribute('circles-rounded-rectangle',  {width:TEXT_WINDOW_WIDTH, height:TEXT_DESC_WINDOW_HEIGHT + TEXT_TITLE_WINDOW_HEIGHT, radius:CIRCLES.CONSTANTS.GUI.rounded_rectangle_radius});
    desc_BG.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    desc_BG.setAttribute('position',  {x:TEXT_WINDOW_WIDTH/2, y:-TEXT_DESC_WINDOW_HEIGHT/2 + POINTER_HEIGHT, z:0});
    infoOffsetElem.appendChild(desc_BG);

    //add description text (220 char limit for now)
    CONTEXT_AF.objectDescriptionText = document.createElement('a-entity');
    CONTEXT_AF.objectDescriptionText.setAttribute('id', 'description_text');
    // CONTEXT_AF.objectDescriptionText.setAttribute('material',  {depthTest:false});
    CONTEXT_AF.objectDescriptionText.setAttribute('position', {x:TEXT_PADDING, y:0.0, z:CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectDescriptionText.setAttribute('text', {  anchor:'left', baseline:'top', wrapCount:33,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING * 2, height:TEXT_DESC_WINDOW_HEIGHT - TEXT_PADDING * 2,
                                      font: CIRCLES.CONSTANTS.GUI.font_body,
                                      value:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.'});
    infoOffsetElem.appendChild(CONTEXT_AF.objectDescriptionText);

    CONTEXT_AF.objectDescriptionBack = document.createElement('a-entity');
    CONTEXT_AF.objectDescriptionBack.setAttribute('id', 'description_text2');
    CONTEXT_AF.objectDescriptionBack.setAttribute('rotation', {x:0.0, y:180.0, z:0.0});
    CONTEXT_AF.objectDescriptionBack.setAttribute('position', {x:TEXT_WINDOW_WIDTH - TEXT_PADDING, y:0.0, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectDescriptionBack.setAttribute('text', {  anchor:'left', baseline:'top', wrapCount:33,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING * 2, height:TEXT_DESC_WINDOW_HEIGHT - TEXT_PADDING * 2,
                                      font: CIRCLES.CONSTANTS.GUI.font_body,
                                      value:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.'});
    infoOffsetElem.appendChild(CONTEXT_AF.objectDescriptionBack);

    //add title text (15 char limit for now)
    CONTEXT_AF.objectTitleText = document.createElement('a-entity');
    CONTEXT_AF.objectTitleText.setAttribute('id', 'title_text');
    CONTEXT_AF.objectTitleText.setAttribute('position', {x:TEXT_PADDING, y:-TEXT_PADDING + TEXT_TITLE_WINDOW_HEIGHT, z:CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectTitleText.setAttribute('text', { anchor:'left', baseline:'top', wrapCount:20,
                                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING*2, height:TEXT_TITLE_WINDOW_HEIGHT- TEXT_PADDING*1.5, 
                                                      font: CIRCLES.CONSTANTS.GUI.font_body,
                                                      value:'A Story Title'});
    infoOffsetElem.appendChild(CONTEXT_AF.objectTitleText);

    CONTEXT_AF.objectTitleBack = document.createElement('a-entity');
    CONTEXT_AF.objectTitleBack.setAttribute('id', 'title_text2');
    CONTEXT_AF.objectTitleBack.setAttribute('rotation', {x:0.0, y:180.0, z:0.0});
    CONTEXT_AF.objectTitleBack.setAttribute('position', {x:TEXT_WINDOW_WIDTH - TEXT_PADDING, y:-TEXT_PADDING + TEXT_TITLE_WINDOW_HEIGHT, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectTitleBack.setAttribute('text', { anchor:'left', baseline:'top', wrapCount:20,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING*2, height:TEXT_TITLE_WINDOW_HEIGHT- TEXT_PADDING*1.5, 
                                      font: CIRCLES.CONSTANTS.GUI.font_body,
                                      value:'A Story Title'});
    infoOffsetElem.appendChild(CONTEXT_AF.objectTitleBack);

    let rotateElem = document.createElement('a-entity');
    rotateElem.setAttribute('id', 'rotate_desc_control');
    rotateElem.setAttribute('class', 'interactive button');
    rotateElem.setAttribute('position', {x:TEXT_WINDOW_WIDTH/2, y:0.55, z:0});
    rotateElem.setAttribute('geometry',  {  primitive:'plane', 
                                            width:0.3,
                                            height:0.3 
                                          });
    rotateElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_ROTATE, color:'rgb(255,255,255)', shader:'flat', transparent:true, side:'double'});
    infoOffsetElem.appendChild(rotateElem);
    rotateElem.addEventListener('mouseenter', function (evt) { evt.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
    rotateElem.addEventListener('mouseleave', function (evt) { evt.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });
    rotateElem.addEventListener('click', function (evt) {
      CONTEXT_AF.rotationDesc += 180;
      CONTEXT_AF.rotateDescElem.setAttribute('animation', {property:'rotation.y', dur:500, dir:'normal', to:CONTEXT_AF.rotationDesc, easing:'easeInQuad'});
    });

    let triangle_point = document.createElement('a-entity');
    triangle_point.setAttribute('geometry',  {  primitive:'triangle', 
                                                vertexA:{x:TEXT_WINDOW_WIDTH/2 + 0.2, y:-(TEXT_DESC_WINDOW_HEIGHT + DIST_BETWEEN_PLATES) + TEXT_PADDING, z:0}, 
                                                vertexB:{x:TEXT_WINDOW_WIDTH/2 - 0.2, y:-(TEXT_DESC_WINDOW_HEIGHT + DIST_BETWEEN_PLATES) + TEXT_PADDING, z:0}, 
                                                vertexC:{x:TEXT_WINDOW_WIDTH/2, y:-(TEXT_DESC_WINDOW_HEIGHT + POINTER_HEIGHT + DIST_BETWEEN_PLATES) + TEXT_PADDING, z:0}
                                              });
    triangle_point.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    infoOffsetElem.appendChild(triangle_point);
  },
  selectObject : function ( obj ) {
    const CONTEXT_AF = this;

    if ( CONTEXT_AF.selectedObject === null) {
      let regex = /(naf)/i;
      let nafMatch  = regex.test(obj.el.getAttribute('id')); //don't want description if being taken from someone else

      CONTEXT_AF.pickupInspectedObject(obj, !nafMatch);
      obj.el.emit( CIRCLES.EVENTS.INSPECT_THIS_OBJECT, {}, true );
    }
    else {
      //release currently selected object
      const isSameObject = CONTEXT_AF.selectedObject.isSameNode( obj.el );
      CONTEXT_AF.selectedObject.emit( CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {}, true );
      CONTEXT_AF.releaseInspectedObject( CONTEXT_AF.selectedObject.components['circles-inspect-object'] );

      //pick up another object if not the same object that was released
      if ( !isSameObject ) {
        this.pickupInspectedObject(obj, true);
      }
    }
  },
  pickupInspectedObject : function ( obj, showDescription ) {
    const CONTEXT_AF = this;
    CONTEXT_AF.selectedObject = obj.el;
    CONTEXT_AF.zoomNear       = false;

    CONTEXT_AF.selectedObject.setAttribute('circles-inspect-object', {networkedEnabled:true});

    //hide label
    if (CONTEXT_AF.selectedObject.hasAttribute('circles-object-label') === true) {
      CONTEXT_AF.selectedObject.setAttribute('circles-object-label', {label_visible:false});
    }

    //reset control position
    CONTEXT_AF.objectControls.object3D.position.z = CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z;

    //reset rotation of description
    CONTEXT_AF.rotateDescElem.setAttribute('rotation', {x:0, y:0, z:0});
    CONTEXT_AF.rotationDesc = 0.0;
    
    //take over networked membership
    if (CONTEXT_AF.selectedObject.hasAttribute('networked') === true) {
      NAF.utils.getNetworkedEntity(CONTEXT_AF.selectedObject).then((el) => {
        console.log("is this mine?");
        if (!NAF.utils.isMine(el)) {
          console.log("No but ... ")
          NAF.utils.takeOwnership(el);
          console.log("it is mine now");
        } 
        else {
          console.log("Yes, it is mine already");
        }
      });
    }

    // let avatarHead = CONTEXT_AF.el.sceneEl.querySelector('#player1');
    // avatarHead = avatarHead.querySelector('.user_head');

    //set new transform
    //CONTEXT_AF.selectedObject.object3D.position.set(0.0, 0.0, 0.0);

    CONTEXT_AF.selectedObject.object3D.rotation.set(obj.data.inspectRotation.x, obj.data.inspectRotation.y, obj.data.inspectRotation.z);
    CONTEXT_AF.selectedObject.object3D.scale.set(obj.data.inspectScale.x, obj.data.inspectScale.y, obj.data.inspectScale.z);
    CONTEXT_AF.selectedObject.setAttribute('circles-parent-constraint', {parent:this.camera, positionOffset:{x:0.0, y:obj.data.inspectOffsetY, z:-2.0}, rotationOffset:{x:obj.data.inspectRotation.x, y:obj.data.inspectRotation.y, z:obj.data.inspectRotation.z}});

    if ( showDescription )  {
      //show description text with appropriate values
      CONTEXT_AF.objectTitleText.setAttribute('text', {value:obj.data.title});
      CONTEXT_AF.objectDescriptionText.setAttribute('text', {value:obj.data.description});
      CONTEXT_AF.objectTitleBack.setAttribute('text', {value:(obj.data.title_back === '') ? obj.data.title : obj.data.title_back});
      CONTEXT_AF.objectDescriptionBack.setAttribute('text', {value:(obj.data.description_back === '') ? obj.data.description : obj.data.description_back});
      CONTEXT_AF.objectDescriptions.setAttribute('visible', true);

      //display element at position 
      CONTEXT_AF.objectDescriptions.object3D.position.set(obj.data.origPos.x, obj.data.origPos.y + 1.5, obj.data.origPos.z);
      if ( obj.data.textLookAt === true ) {
        let worldPos = new THREE.Vector3();
        CONTEXT_AF.camera.object3D.getWorldPosition(worldPos);
        worldPos.y = obj.data.origPos.y + 1.3;

        CONTEXT_AF.objectDescriptions.object3D.lookAt(CONTEXT_AF.camera.object3D.getWorldPosition()); //rotate to face user
        CONTEXT_AF.objectDescriptions.object3D.rotation.x = 0.0; //only rotate on y axis
        CONTEXT_AF.objectDescriptions.object3D.rotation.z = 0.0;
      } 
      else {
        CONTEXT_AF.objectDescriptions.object3D.rotation.y = THREE.MathUtils.degToRad(obj.data.textRotationY);
      }
    }

    CONTEXT_AF.objectControls.querySelectorAll('.button').forEach( (button) => {
      button.setAttribute('circles-interactive-visible', true);
    });
    CONTEXT_AF.objectControls.setAttribute('visible', true);

    //remove interaction
    CONTEXT_AF.selectedObject.setAttribute('circles-interactive-object', {enabled:false});

  },
  releaseInspectedObject : function ( obj ) {
    const CONTEXT_AF = this;

    CONTEXT_AF.selectedObject.setAttribute('circles-inspect-object', {networkedEnabled:false});

    //show label
    if (CONTEXT_AF.selectedObject.hasAttribute('circles-object-label') === true) {
      CONTEXT_AF.selectedObject.setAttribute('circles-object-label', {label_visible:true});
    }

    CONTEXT_AF.selectedObject.removeAttribute('circles-parent-constraint');

    CONTEXT_AF.selectedObject.object3D.position.set(obj.data.origPos.x, obj.data.origPos.y, obj.data.origPos.z);
    CONTEXT_AF.selectedObject.object3D.rotation.set(obj.data.origRot.x, obj.data.origRot.y, obj.data.origRot.z);
    CONTEXT_AF.selectedObject.object3D.scale.set(obj.data.origScale.x, obj.data.origScale.y, obj.data.origScale.z);

    //hide floating descriptions
    CONTEXT_AF.objectDescriptions.setAttribute('visible', false);

    //turn off object controls
    CONTEXT_AF.objectControls.querySelectorAll('.button').forEach( (button) => {
      button.setAttribute('circles-interactive-visible', false);
    });
    CONTEXT_AF.objectControls.setAttribute('visible', false);

    //add back interaction
    CONTEXT_AF.selectedObject.setAttribute('circles-interactive-object', {enabled:true});
    CONTEXT_AF.selectedObject  = null;
  }
});
