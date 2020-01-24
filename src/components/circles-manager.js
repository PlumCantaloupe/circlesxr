'use strict';

AFRAME.registerComponent('circles-manager', {
  schema: {},
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function()
  {
    const Context_AF  = this;
    const scene = document.querySelector('a-scene');
    Context_AF.selectedObject  = null;
    Context_AF.zoomNear         = false;    //1=normal, 2=near
    Context_AF.camera           = null;

    Context_AF.createFloatingObjectDescriptions();
    Context_AF.addEventListeners(); //want after everything loaded in via network

    scene.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, (e) => {
        Context_AF.objectControls           = scene.querySelector('#object_controls');

        Context_AF.rotateControl  = scene.querySelector('#rotate_control');
        Context_AF.zoomControl    = scene.querySelector('#zoom_control');
        Context_AF.releaseControl = scene.querySelector('#release_control');

        Context_AF.rotateControl.addEventListener('click', (e) => { 
          let rotationOffset = Context_AF.selectedObject.components['circles-parent-constraint'].rotationOffset;
          let rotationOffsetY =  rotationOffset.y;
          rotationOffsetY += 90.0;
          //now round to 90 increments so that if a user presses quickly it doesn't end on a strange angle
          rotationOffsetY = Math.round(rotationOffsetY);                      //round so we have whole numbers
          let remainder   = rotationOffsetY % 90;                             //find remainder
          let diff        = ( remainder < 90/2 ) ? -remainder : 90-remainder; //if too small round down to "0" else round up to "90" increment
          rotationOffsetY += diff;

          AFRAME.ANIME({
            targets: Context_AF.selectedObject.components['circles-parent-constraint'].rotationOffset,
            y: rotationOffsetY,
            easing: 'easeOutQuad',
            duration: 250,
            // update: function() {
            //   //console.log("running?");
            // }
          });

        });

        //release object (can also click on object)
        Context_AF.releaseControl.addEventListener('click', (e) => { 
          if ( Context_AF.selectedObject !== null ) {
            Context_AF.selectedObject.emit( CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {}, true );
            Context_AF.releaseInspectedObject(Context_AF.selectedObject.components['circles-inspect-object']);
          }
        });

        Context_AF.zoomControl.addEventListener('click', (e) => { 
          Context_AF.zoomNear = !Context_AF.zoomNear;
          let positionOffset =  Context_AF.selectedObject.components['circles-parent-constraint'].positionOffset;
          let positionOffsetZ = (Context_AF.zoomNear) ? -1.0 : -2.0;
          //Context_AF.selectedObject.setAttribute('circles-parent-constraint', {positionOffset:positionOffset});

          AFRAME.ANIME({
            targets: Context_AF.selectedObject.components['circles-parent-constraint'].positionOffset,
            z: positionOffsetZ,
            easing: 'easeOutQuad',
            duration: 250,
            // update: function() {
            //   //console.log("running?");
            // }
          });
        });
    });
  },
  update: function() {
    const Context_AF  = this;
    const data        = Context_AF.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet
  },
  addEventListeners : function () {
    let Context_AF  = this;
    
    document.addEventListener(CIRCLES.EVENTS.SELECT_THIS_OBJECT, (e) => {
      Context_AF.selectObject( e.detail );
    });

    document.addEventListener(CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, (e) => {
      console.log("Event: "  + e.detail.getAttribute('id') + " ownership-gained");
    });

    document.addEventListener(CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, (e) => {
      console.log("Event: "  + e.detail.getAttribute('id') + " ownership-lost");

      if ( Context_AF.selectedObject !== null ) {
        Context_AF.selectedObject.emit( CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {}, true );
        Context_AF.releaseInspectedObject(Context_AF.selectedObject.components['circles-inspect-object']);
      }
    });

    document.addEventListener(CIRCLES.EVENTS.OBJECT_OWNERSHIP_CHANGED, (e) => {
      console.log("Event: "  + e.detail.getAttribute('id') + " ownership-changed");
    });

    document.addEventListener(CIRCLES.EVENTS.AVATAR_COSTUME_CHANGED, (e) => {
        console.log(e);
        console.log("Event: "  + e.detail.components["circles-user-networked"].data.username + " costume-changed " + e.detail.components["circles-user-networked"].data.color_body);
      });

    Context_AF.el.sceneEl.addEventListener('camera-set-active', (e) => {
      Context_AF.camera = e.detail.cameraEl; //get reference to camera in scene (assume there is only one)
    });
  },
  removeEventListeners : function () {
    //TODO
  },
  createFloatingObjectDescriptions : function () 
  {
    let Context_AF  = this;
    let scene = Context_AF.el.sceneEl;

    const TEXT_WINDOW_WIDTH         = 2.0;
    const TEXT_DESC_WINDOW_HEIGHT   = 0.9;
    const TEXT_TITLE_WINDOW_HEIGHT  = 0.3;
    const TEXT_PADDING              = 0.1;
    const DIST_BETWEEN_PLATES       = 0.05;
    const POINTER_HEIGHT            = 0.2;

    Context_AF.objectDescriptions  = document.createElement('a-entity');
    Context_AF.objectDescriptions.setAttribute('id', 'object_descriptions');
    Context_AF.objectDescriptions.setAttribute('visible', false);
    Context_AF.objectDescriptions.setAttribute('position', {x:0.0, y:0.0, z:0.0});
    Context_AF.objectDescriptions.setAttribute('rotation', {x:0, y:0, z:0});
    scene.appendChild(Context_AF.objectDescriptions );

    let infoOffsetElem = document.createElement('a-entity');
    infoOffsetElem.setAttribute('position',{x:-TEXT_WINDOW_WIDTH/2, y:-(DIST_BETWEEN_PLATES + TEXT_TITLE_WINDOW_HEIGHT)/2, z:0});
    Context_AF.objectDescriptions .appendChild(infoOffsetElem);

    //add bg for desc
    let desc_BG = document.createElement('a-entity');
    // desc_BG.setAttribute('geometry',  {primitive:'plane', width:TEXT_WINDOW_WIDTH, height:TEXT_DESC_WINDOW_HEIGHT});
    desc_BG.setAttribute('circles-rounded-rectangle',  {width:TEXT_WINDOW_WIDTH, height:TEXT_DESC_WINDOW_HEIGHT + TEXT_TITLE_WINDOW_HEIGHT, radius:CIRCLES.CONSTANTS.GUI.rounded_rectangle_radius});
    desc_BG.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    desc_BG.setAttribute('position',  {x:TEXT_WINDOW_WIDTH/2, y:-TEXT_DESC_WINDOW_HEIGHT/2 + POINTER_HEIGHT, z:0});
    infoOffsetElem.appendChild(desc_BG);

    //add description text (220 char limit for now)
    Context_AF.objectDescriptionText = document.createElement('a-entity');
    Context_AF.objectDescriptionText.setAttribute('id', 'description_text');
    // Context_AF.objectDescriptionText.setAttribute('material',  {depthTest:false});
    Context_AF.objectDescriptionText.setAttribute('position', {x:TEXT_PADDING, y:0.0, z:CIRCLES.CONSTANTS.GUI.text_z_pos});
    Context_AF.objectDescriptionText.setAttribute('text', {  anchor:'left', baseline:'top', wrapCount:30,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING * 2, height:TEXT_DESC_WINDOW_HEIGHT - TEXT_PADDING * 2,
                                      font: CIRCLES.CONSTANTS.GUI.font_body,
                                      value:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.'});
    infoOffsetElem.appendChild(Context_AF.objectDescriptionText);

    Context_AF.objectDescriptionText2 = document.createElement('a-entity');
    Context_AF.objectDescriptionText2.setAttribute('id', 'description_text2');
    Context_AF.objectDescriptionText2.setAttribute('rotation', {x:0.0, y:180.0, z:0.0});
    Context_AF.objectDescriptionText2.setAttribute('position', {x:TEXT_WINDOW_WIDTH - TEXT_PADDING, y:0.0, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
    Context_AF.objectDescriptionText2.setAttribute('text', {  anchor:'left', baseline:'top', wrapCount:30,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING * 2, height:TEXT_DESC_WINDOW_HEIGHT - TEXT_PADDING * 2,
                                      font: CIRCLES.CONSTANTS.GUI.font_body,
                                      value:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut.'});
    infoOffsetElem.appendChild(Context_AF.objectDescriptionText2);

    //add title text (15 char limit for now)
    Context_AF.objectTitleText = document.createElement('a-entity');
    Context_AF.objectTitleText.setAttribute('id', 'title_text');
    Context_AF.objectTitleText.setAttribute('position', {x:TEXT_PADDING, y:-TEXT_PADDING + TEXT_TITLE_WINDOW_HEIGHT, z:CIRCLES.CONSTANTS.GUI.text_z_pos});
    Context_AF.objectTitleText.setAttribute('text', { anchor:'left', baseline:'top', wrapCount:20,
                                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING*2, height:TEXT_TITLE_WINDOW_HEIGHT- TEXT_PADDING*1.5, 
                                                      font: CIRCLES.CONSTANTS.GUI.font_body,
                                                      value:'A Story Title'});
    infoOffsetElem.appendChild(Context_AF.objectTitleText);

    Context_AF.objectTitleText2 = document.createElement('a-entity');
    Context_AF.objectTitleText2.setAttribute('id', 'title_text2');
    Context_AF.objectTitleText2.setAttribute('rotation', {x:0.0, y:180.0, z:0.0});
    Context_AF.objectTitleText2.setAttribute('position', {x:TEXT_WINDOW_WIDTH - TEXT_PADDING, y:-TEXT_PADDING + TEXT_TITLE_WINDOW_HEIGHT, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
    Context_AF.objectTitleText2.setAttribute('text', { anchor:'left', baseline:'top', wrapCount:20,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING*2, height:TEXT_TITLE_WINDOW_HEIGHT- TEXT_PADDING*1.5, 
                                      font: CIRCLES.CONSTANTS.GUI.font_body,
                                      value:'A Story Title'});
    infoOffsetElem.appendChild(Context_AF.objectTitleText2);

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
    const Context_AF = this;

    if ( Context_AF.selectedObject === null) {
      let regex = /(naf)/i;
      let nafMatch  = regex.test(obj.el.getAttribute('id')); //don't want description if being taken from someone else

      Context_AF.pickupInspectedObject(obj, !nafMatch);
      obj.el.emit( CIRCLES.EVENTS.INSPECT_THIS_OBJECT, {}, true );
    }
    else {
      //release currentlys elected object
      const isSameObject = Context_AF.selectedObject.isSameNode( obj.el );
      Context_AF.selectedObject.emit( CIRCLES.EVENTS.RELEASE_THIS_OBJECT, {}, true );
      Context_AF.releaseInspectedObject( Context_AF.selectedObject.components['circles-inspect-object'] );

      //pick up another object if not the same object that was released
      if ( !isSameObject ) {
        this.pickupInspectedObject(obj, true);
      }
    }
  },
  pickupInspectedObject : function ( obj, showDescription ) {
    const Context_AF = this;
    Context_AF.selectedObject = obj.el;
    Context_AF.zoomNear       = false;

    //hide label
    if (Context_AF.selectedObject.hasAttribute('circles-object-label') === true) {
      Context_AF.selectedObject.setAttribute('circles-object-label', {label_visible:false});
    }

    //reset control position
    Context_AF.objectControls.object3D.position.z = CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z;
    
    //take over networked membership
    NAF.utils.getNetworkedEntity(Context_AF.selectedObject).then((el) => {
      if (!NAF.utils.isMine(el)) {
        NAF.utils.takeOwnership(el);
      } 
    });

    //set new transform
    Context_AF.selectedObject.object3D.position.set(0.0, 0.0, 0.0);
    Context_AF.selectedObject.object3D.rotation.set(obj.data.inspectRotation.x, obj.data.inspectRotation.y, obj.data.inspectRotation.z);
    Context_AF.selectedObject.object3D.scale.set(obj.data.inspectScale.x, obj.data.inspectScale.y, obj.data.inspectScale.z);
    Context_AF.selectedObject.setAttribute('circles-parent-constraint', {parent:Context_AF.camera, positionOffset:{x:0.0, y:0.0, z:-2.0}, rotationOffset:{x:obj.data.inspectRotation.x, y:obj.data.inspectRotation.y, z:obj.data.inspectRotation.z}});

    if ( showDescription )  {
      //show description text with appropriate values
      Context_AF.objectTitleText.setAttribute('text', {value:obj.data.title});
      Context_AF.objectDescriptionText.setAttribute('text', {value:obj.data.description});
      Context_AF.objectTitleText2.setAttribute('text', {value:obj.data.title});
      Context_AF.objectDescriptionText2.setAttribute('text', {value:obj.data.description});
      Context_AF.objectDescriptions.setAttribute('visible', true);

      //display element at position 
      Context_AF.objectDescriptions.object3D.position.set(obj.data.origPos.x, obj.data.origPos.y + 1.5, obj.data.origPos.z);
      if ( obj.data.textLookAt === true ) {
        let worldPos = new THREE.Vector3();
        Context_AF.camera.object3D.getWorldPosition(worldPos);
        worldPos.y = obj.data.origPos.y + 1.3;

        Context_AF.objectDescriptions.object3D.lookAt(Context_AF.camera.object3D.getWorldPosition()); //rotate to face user
        Context_AF.objectDescriptions.object3D.rotation.x = 0.0; //only rotate on y axis
        Context_AF.objectDescriptions.object3D.rotation.z = 0.0;
      } 
      else {
        Context_AF.objectDescriptions.object3D.rotation.y = THREE.Math.degToRad(obj.data.textRotationY);
      }
    }

    Context_AF.objectControls.setAttribute('visible', true); //turn on object controls
  },
  releaseInspectedObject : function ( obj ) {
    const Context_AF = this;

    //show label
    if (Context_AF.selectedObject.hasAttribute('circles-object-label') === true) {
      Context_AF.selectedObject.setAttribute('circles-object-label', {label_visible:true});
    }

    Context_AF.selectedObject.removeAttribute('circles-parent-constraint');

    Context_AF.selectedObject.object3D.position.set(obj.data.origPos.x, obj.data.origPos.y, obj.data.origPos.z);
    Context_AF.selectedObject.object3D.rotation.set(obj.data.origRot.x, obj.data.origRot.y, obj.data.origRot.z);
    Context_AF.selectedObject.object3D.scale.set(obj.data.origScale.x, obj.data.origScale.y, obj.data.origScale.z);

    //hide floating descriptions
    Context_AF.objectDescriptions.setAttribute('visible', false);

    //turn off object controls
    Context_AF.objectControls.setAttribute('visible', false);

    Context_AF.selectedObject  = null;
  }
});
