'use strict';

AFRAME.registerComponent('circles-label', {
  schema: {
    text:               {type:'string',     default:'label_text'},
    offset:             {type:'vec3',       default:{x:0.0, y:0.0, z:0.0}},
    arrow_position:     {type:'string',     default:'down', oneOf: ['up', 'down', 'left', 'right' ]},
    arrow_visible:      {type:'boolean',    default:true},
    lookAtCamera:       {type:'boolean',    default:true},
    constrainYAxis:     {type:'boolean',    default:true},
    updateRate:         {type:'number',     default:200},   //in ms
    smoothingOn:        {type:'boolean',    default:true},
    smoothingAlpha:     {type:'float',      default:0.05}
  },
  init: function() {
    const CONTEXT_AF = this;

    //CONTEXT_AF.label            = null;
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

    if (CIRCLES.isReady()) {
        CONTEXT_AF.label.setAttribute('circles-lookat', {   targetElement:CIRCLES.getMainCameraElement(), 
                                                            enabled:CONTEXT_AF.data.lookAtCamera, 
                                                            constrainYAxis:CONTEXT_AF.data.constrainYAxis, 
                                                            updateRate:CONTEXT_AF.data.updateRate, 
                                                            smoothingOn:CONTEXT_AF.data.smoothingOn, 
                                                            smoothingAlpha:CONTEXT_AF.data.smoothingAlpha} );
    }
    else {
        const readyFunc = function (e) {
            CONTEXT_AF.camera = CIRCLES.getMainCameraElement(); //get reference to camera in scene (assume there is only one)
            CONTEXT_AF.el.setAttribute('circles-lookat', {   targetElement:CIRCLES.getMainCameraElement(), 
                                                                enabled:CONTEXT_AF.data.lookAtCamera, 
                                                                constrainYAxis:CONTEXT_AF.data.constrainYAxis, 
                                                                updateRate:CONTEXT_AF.data.updateRate, 
                                                                smoothingOn:CONTEXT_AF.data.smoothingOn, 
                                                                smoothingAlpha:CONTEXT_AF.data.smoothingAlpha} );
            CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.READY, readyFunc);
        };
        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.READY, readyFunc);
    }
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.text !== data.text) && (data.text !== '') ) {
        CONTEXT_AF.labelText.setAttribute('text', {value:data.text});
    }

    if ( (oldData.offset !== data.offset) && (data.offset !== '') ) {
        CONTEXT_AF.labelWrapper.object3D.position.set(data.offset.x, data.offset.y, data.offset.z);
    }

    if ( (oldData.arrow_position !== data.arrow_position) && (data.arrow_position !== '') ) {
        if (CONTEXT_AF.labelArrow !== null) {
            if ( data.arrow_position == 'up' ) {
                CONTEXT_AF.labelArrow.object3D.visible = true;
                CONTEXT_AF.labelArrow.object3D.position.set( 0.0, CONTEXT_AF.LABEL_HEIGHT/2, 0.0 );
                CONTEXT_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, Math.PI );
            }
            else if ( data.arrow_position == 'right' ) {
                CONTEXT_AF.labelArrow.object3D.visible = true;
                CONTEXT_AF.labelArrow.object3D.position.set( CONTEXT_AF.LABEL_WIDTH/2, 0.0, 0.0 );
                CONTEXT_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, Math.PI/2.0 );
            }
            else if ( data.arrow_position == 'down' ) {
                CONTEXT_AF.labelArrow.object3D.visible = true;
                CONTEXT_AF.labelArrow.object3D.position.set( 0.0, -CONTEXT_AF.LABEL_HEIGHT/2, 0.0 );
                CONTEXT_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, 0.0 );
            }
            else if ( data.arrow_position == 'left' ) {
                CONTEXT_AF.labelArrow.object3D.visible = true;
                CONTEXT_AF.labelArrow.object3D.position.set( -CONTEXT_AF.LABEL_WIDTH/2 , 0.0, 0.0 );
                CONTEXT_AF.labelArrow.object3D.rotation.set( 0.0, 0.0, -Math.PI/2.0 );
            }
            else if ( data.arrow_position == 'none' ) {
                CONTEXT_AF.labelArrow.object3D.visible = false;
            }
        }
    }

    if ( (oldData.lookAtCamera !== data.lookAtCamera) && (data.lookAtCamera !== '') ) {
        CONTEXT_AF.el.setAttribute('circles-lookat', {enabled:data.lookAtCamera});

        //set back to original rotation
        if (data.lookAtCamera === false) {
            CONTEXT_AF.el.setAttribute('rotation', {x:0, y:0, z:0});
        }
    }

    if (oldData.arrow_visible !== data.arrow_visible && (data.arrow_visible !== '')) {
        CONTEXT_AF.labelArrow.object3D.visible = data.arrow_visible;
      }
  },
  createLabelElement : function () {
    const CONTEXT_AF = this;
    const data = this.data;

    //how we will position offset
    CONTEXT_AF.labelWrapper = document.createElement('a-entity');
    CONTEXT_AF.labelWrapper.object3D.position.set(data.offset.x, data.offset.y, data.offset.z);
    CONTEXT_AF.el.appendChild(CONTEXT_AF.labelWrapper);

    //create white bg for text legibility
    let bg = document.createElement('a-entity');
    bg.classList.add('interactive');
    bg.classList.add('label_bg');
    bg.setAttribute('circles-rounded-rectangle',  {width:CONTEXT_AF.LABEL_WIDTH, height:CONTEXT_AF.LABEL_HEIGHT, radius:CIRCLES.CONSTANTS.GUI.rounded_rectangle_radius});
    bg.setAttribute('position',  {x:0.0, y:0.0, z:0.0});
    bg.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    bg.addEventListener('loaded', function () {
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
                                      value:data.text});
    CONTEXT_AF.labelText.setAttribute('position', {x:0, y:0.0, z:0.05});
    CONTEXT_AF.labelWrapper.appendChild(CONTEXT_AF.labelText);
 
    //createpointer
    CONTEXT_AF.labelArrow = document.createElement('a-entity');
    CONTEXT_AF.labelArrow.setAttribute('geometry',  {   primitive:'triangle', 
                                                        vertexA:{x:CONTEXT_AF.ARROW_SIZE, y:0.0, z:0}, 
                                                        vertexB:{x:-CONTEXT_AF.ARROW_SIZE, y:0.0, z:0}, 
                                                        vertexC:{x:0.0, y:-CONTEXT_AF.ARROW_SIZE, z:0}
                                                    });
    CONTEXT_AF.labelArrow.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    CONTEXT_AF.labelWrapper.appendChild(CONTEXT_AF.labelArrow);
  },
  remove: function () {}
});