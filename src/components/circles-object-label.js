'use strict';

AFRAME.registerComponent('circles-object-label', {
  schema: {
    label_text:         {type:'string',     default:'label_text'},
    label_visible:      {type:'boolean',    default:true},
    label_offset:       {type:'vec3'},
    arrow_position:     {type:'string',     default:'up', oneOf: ['up', 'down', 'left', 'right']},
    updateRate:         {type:'number',     default:20},
    billboard:          {type:'boolean',    default:true}
  },
  init: function() {
    const CONTEXT_AF = this;
    const data = this.data;

    CONTEXT_AF.label            = null;
    CONTEXT_AF.labelWrapper     = null;
    CONTEXT_AF.labelText        = null;
    CONTEXT_AF.labelArrow       = null;
    CONTEXT_AF.camera           = null;
    CONTEXT_AF.prevTime         = 0;

    CONTEXT_AF.TEXT_WIDTH           = 1.0;
    CONTEXT_AF.TEXT_HEIGHT          = 0.3;
    CONTEXT_AF.LABEL_WIDTH          = 0.8; 
    CONTEXT_AF.LABEL_HEIGHT         = 0.4;
    CONTEXT_AF.ARROW_SIZE           = 0.05; 
    CONTEXT_AF.worldPos             = new THREE.Vector3();

    CONTEXT_AF.createLabelElement();

    CONTEXT_AF.el.classList.add('label_wrapper');

    CONTEXT_AF.el.sceneEl.addEventListener('camera-set-active', function (evt) {
        CONTEXT_AF.camera = evt.detail.cameraEl; //get reference to camera in scene (assume there is only one)
    });
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.label_text !== data.label_text) && (data.label_text !== '') ) {
        CONTEXT_AF.labelText.setAttribute('text', {value:data.label_text});
    }

    if ( (oldData.label_visible !== data.label_visible) && (data.label_visible !== '') ) {
        CONTEXT_AF.label.setAttribute('visible', data.label_visible);
    }

    if ( (oldData.label_offset !== data.label_offset) && (data.label_offset !== '') ) {
        CONTEXT_AF.labelWrapper.object3D.position.set(data.label_offset.x, data.label_offset.y, data.label_offset.z);
    }

    if ( (oldData.arrow_position !== data.arrow_position) && (data.arrow_position !== '') ) {
        if (CONTEXT_AF.labelArrow !== null) {
            if ( data.arrow_position == 'up' ) {
                CONTEXT_AF.labelArrow.object3D.position.set( 0.0, CONTEXT_AF.LABEL_HEIGHT/2, 0.0 );
                CONTEXT_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, THREE.MathUtils.degToRad(180.0) );
            }
            else if ( data.arrow_position == 'right' ) {
                CONTEXT_AF.labelArrow.object3D.position.set( CONTEXT_AF.LABEL_WIDTH/2, 0.0, 0.0 );
                CONTEXT_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, THREE.MathUtils.degToRad(90.0) );
            }
            else if ( data.arrow_position == 'down' ) {
                CONTEXT_AF.labelArrow.object3D.position.set( 0.0, -CONTEXT_AF.LABEL_HEIGHT/2, 0.0 );
                CONTEXT_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, THREE.MathUtils.degToRad(0.0) );
            }
            else if ( data.arrow_position == 'left' ) {
                CONTEXT_AF.labelArrow.object3D.position.set( -CONTEXT_AF.LABEL_WIDTH/2 , 0.0, 0.0 );
                CONTEXT_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, THREE.MathUtils.degToRad(-90.0) );
            }
        }
    }
  },
  tick : function (time, timeDelta) {
    if (this.data.billboard === true) {
        if ( time - this.prevTime > this.data.updateRate ) {
            if (this.data.label_visible === true) {
                this.camera.object3D.getWorldPosition(this.worldPos);
                this.worldPos.y = this.el.object3D.position.y;
                this.label.object3D.lookAt(this.worldPos);
            }
            this.prevTime = time;
        }
    }
  },
//   tock : function (time, timeDelta, camera) {
//   },
  createLabelElement : function () {
    const CONTEXT_AF = this;
    const data = this.data;
    const scene = document.querySelector('a-scene');

    CONTEXT_AF.label = document.createElement('a-entity');
    CONTEXT_AF.label.setAttribute('id', CONTEXT_AF.el.getAttribute('id') + '_label');
    CONTEXT_AF.label.setAttribute('class', 'label interactive');
    CONTEXT_AF.label.setAttribute('position', CONTEXT_AF.el.getAttribute('position'));
    CONTEXT_AF.label.setAttribute('visible', data.label_visible);
    CONTEXT_AF.label.addEventListener('loaded', function () {
        CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_LABEL_LOADED, CONTEXT_AF.label);
    });
    CONTEXT_AF.el.sceneEl.appendChild(CONTEXT_AF.label);

    //how we will position offset
    CONTEXT_AF.labelWrapper = document.createElement('a-entity');
    CONTEXT_AF.labelWrapper.object3D.position.set(data.label_offset.x, data.label_offset.y, data.label_offset.z);
    CONTEXT_AF.label.appendChild(CONTEXT_AF.labelWrapper);

    //create white bg for text legibility
    let bg = document.createElement('a-entity');
    bg.classList.add('interactive');
    bg.classList.add('label_bg');
    bg.setAttribute('circles-rounded-rectangle',  {width:CONTEXT_AF.LABEL_WIDTH, height:CONTEXT_AF.LABEL_HEIGHT, radius:CIRCLES.CONSTANTS.GUI.rounded_rectangle_radius});
    bg.setAttribute('position',  {x:0.0, y:0.0, z:0.0});
    bg.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    bg.addEventListener('loaded', function () {

        //want this clicked to also send message to manager (to trigger inspect). Users have asked for this.
        bg.addEventListener('click', (e) => {
            CONTEXT_AF.el.click();  //easiest to make sure all click functionality happens
        });

        bg.addEventListener('mouseenter', (e) => {
            const scaleSize = 1.05;
            bg.setAttribute('scale', {x:scaleSize, y:scaleSize, z:scaleSize});
        });

        bg.addEventListener('mouseleave', (e) => {
            bg.setAttribute('scale', {x:1.0, y:1.0, z:1.0});
        });

    });
    CONTEXT_AF.labelWrapper.appendChild(bg);

    //create label
    CONTEXT_AF.labelText = document.createElement('a-entity');
    CONTEXT_AF.labelText.setAttribute('text', {  align:'center', baseline:'center', wrapCount:20,
                                      color:'rgb(0,0,0)', width:CONTEXT_AF.TEXT_WIDTH, height:CONTEXT_AF.TEXT_HEIGHT, 
                                      font: CIRCLES.CONSTANTS.GUI.font_header,
                                      value:data.label_text});
    CONTEXT_AF.labelText.setAttribute('position', {x:0, y:0.0, z:0.05});
    CONTEXT_AF.labelWrapper.appendChild(CONTEXT_AF.labelText);
 
    //createpointer
    CONTEXT_AF.labelArrow = document.createElement('a-entity');
    CONTEXT_AF.labelArrow.setAttribute('geometry',  {  primitive:'triangle', 
                                                        vertexA:{x:CONTEXT_AF.ARROW_SIZE, y:0.0, z:0}, 
                                                        vertexB:{x:-CONTEXT_AF.ARROW_SIZE, y:0.0, z:0}, 
                                                        vertexC:{x:0.0, y:-CONTEXT_AF.ARROW_SIZE, z:0}
                                                    });
    CONTEXT_AF.labelArrow.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    CONTEXT_AF.labelWrapper.appendChild(CONTEXT_AF.labelArrow);
  },
  remove: function () {}
});