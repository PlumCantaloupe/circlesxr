'use strict';

AFRAME.registerComponent('circles-object-label', {
  schema: {
    label_text:         {type:'string',     default:'label_text'},
    label_visible:      {type:'boolean',    default:true},
    label_offset:       {type:'vec3'},
    arrow_position:     {type:'string',     default: 'up', oneOf: ['up', 'down', 'left', 'right']},
    updateRate:         {type:'number',     default:200}
  },
  init: function() {
    const Context_AF = this;
    const data = this.data;

    Context_AF.label            = null;
    Context_AF.labelWrapper     = null;
    Context_AF.labelText        = null;
    Context_AF.labelArrow       = null;
    Context_AF.camera           = null;
    Context_AF.prevTime         = 0;

    Context_AF.TEXT_WIDTH           = 1.0;
    Context_AF.TEXT_HEIGHT          = 0.3;
    Context_AF.LABEL_WIDTH          = 0.8; 
    Context_AF.LABEL_HEIGHT         = 0.4;
    Context_AF.ARROW_SIZE           = 0.05; 
    Context_AF.worldPos             = new THREE.Vector3();

    Context_AF.createLabelElement();

    Context_AF.el.sceneEl.addEventListener('camera-set-active', function (evt) {
        Context_AF.camera = evt.detail.cameraEl; //get reference to camera in scene (assume there is only one)
    });
  },
  update: function(oldData) {
    const Context_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.label_text !== data.label_text) && (data.label_text !== '') ) {
        Context_AF.labelText.setAttribute('text', {value:data.label_text});
    }

    if ( (oldData.label_visible !== data.label_visible) && (data.label_visible !== '') ) {
        Context_AF.label.setAttribute('visible', data.label_visible);
    }

    if ( (oldData.label_offset !== data.label_offset) && (data.label_offset !== '') ) {
        Context_AF.labelWrapper.object3D.position.set(data.label_offset.x, data.label_offset.y, data.label_offset.z);
    }

    if ( (oldData.arrow_position !== data.arrow_position) && (data.arrow_position !== '') ) {
        if (Context_AF.labelArrow !== null) {
            if ( data.arrow_position == 'up' ) {
                Context_AF.labelArrow.object3D.position.set( 0.0, Context_AF.LABEL_HEIGHT/2, 0.0 );
                Context_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, THREE.Math.degToRad(180.0) );
            }
            else if ( data.arrow_position == 'right' ) {
                Context_AF.labelArrow.object3D.position.set( Context_AF.LABEL_WIDTH/2, 0.0, 0.0 );
                Context_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, THREE.Math.degToRad(90.0) );
            }
            else if ( data.arrow_position == 'down' ) {
                Context_AF.labelArrow.object3D.position.set( 0.0, -Context_AF.LABEL_HEIGHT/2, 0.0 );
                Context_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, THREE.Math.degToRad(0.0) );
            }
            else if ( data.arrow_position == 'left' ) {
                Context_AF.labelArrow.object3D.position.set( -Context_AF.LABEL_WIDTH/2 , 0.0, 0.0 );
                Context_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, THREE.Math.degToRad(-90.0) );
            }
        }
    }
  },
  tick : function (time, timeDelta) {
    if ( time - this.prevTime > this.data.updateRate ) {
        if (this.data.label_visible === true) {
            this.camera.object3D.getWorldPosition(this.worldPos);
            this.worldPos.y = this.el.object3D.position.y;
            this.label.object3D.lookAt(this.worldPos);
        }
        this.prevTime = time;
    }
  },
//   tock : function (time, timeDelta, camera) {
//   },
  createLabelElement : function () {
    const Context_AF = this;
    const data = this.data;
    const scene = document.querySelector('a-scene');

    Context_AF.label = document.createElement('a-entity');
    Context_AF.label.setAttribute('id', Context_AF.el.getAttribute('id') + '_label');
    Context_AF.label.setAttribute('class', 'label interactive');
    Context_AF.label.setAttribute('position', Context_AF.el.getAttribute('position'));
    Context_AF.label.setAttribute('visible', data.label_visible);
    Context_AF.label.addEventListener('loaded', function () {
        Context_AF.el.emit(CIRCLES.EVENTS.OBJECT_LABEL_LOADED, Context_AF.label);
    });
    scene.appendChild(Context_AF.label);

    //how we will position offset
    Context_AF.labelWrapper = document.createElement('a-entity');
    Context_AF.labelWrapper.object3D.position.set(data.label_offset.x, data.label_offset.y, data.label_offset.z);
    Context_AF.label.appendChild(Context_AF.labelWrapper);

    //create white bg for text legibility
    let bg = document.createElement('a-entity');
    bg.setAttribute('class', 'interactive');
    bg.setAttribute('circles-rounded-rectangle',  {width:Context_AF.LABEL_WIDTH, height:Context_AF.LABEL_HEIGHT, radius:CIRCLES.CONSTANTS.GUI.rounded_rectangle_radius});
    bg.setAttribute('position',  {x:0.0, y:0.0, z:0.0});
    bg.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    bg.addEventListener('loaded', function () {

        //want this clicked to also send message to manager (to trigger inspect). Users have asked for this.
        bg.addEventListener('click', (e) => {
            Context_AF.el.emit( CIRCLES.EVENTS.SELECT_THIS_OBJECT, Context_AF.el.components['circles-inspect-object'], true );
        });

        bg.addEventListener('mouseenter', (e) => {
            const scaleSize = 1.05;
            bg.setAttribute('scale', {x:scaleSize, y:scaleSize, z:scaleSize});
        });

        bg.addEventListener('mouseleave', (e) => {
            bg.setAttribute('scale', {x:1.0, y:1.0, z:1.0});
        });

    });
    Context_AF.labelWrapper.appendChild(bg);

    //create label
    Context_AF.labelText = document.createElement('a-entity');
    Context_AF.labelText.setAttribute('text', {  align:'center', baseline:'center', wrapCount:20,
                                      color:'rgb(0,0,0)', width:Context_AF.TEXT_WIDTH, height:Context_AF.TEXT_HEIGHT, 
                                      font: CIRCLES.CONSTANTS.GUI.font_header,
                                      value:data.label_text});
    Context_AF.labelText.setAttribute('position', {x:0, y:0.0, z:0.05});
    Context_AF.labelWrapper.appendChild(Context_AF.labelText);
 
    //createpointer
    Context_AF.labelArrow = document.createElement('a-entity');
    Context_AF.labelArrow.setAttribute('geometry',  {  primitive:'triangle', 
                                                        vertexA:{x:Context_AF.ARROW_SIZE, y:0.0, z:0}, 
                                                        vertexB:{x:-Context_AF.ARROW_SIZE, y:0.0, z:0}, 
                                                        vertexC:{x:0.0, y:-Context_AF.ARROW_SIZE, z:0}
                                                    });
    Context_AF.labelArrow.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    Context_AF.labelWrapper.appendChild(Context_AF.labelArrow);
  },
  remove: function () {}
});