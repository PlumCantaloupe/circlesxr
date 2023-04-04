'use strict';

AFRAME.registerComponent('circles-description', {
  schema: {
    title_text_front:       {type:'string',   default:'[~20-25 chars] title_front'},
    title_text_back:        {type:'string',   default:''},
    description_text_front: {type:'string',   default:'[~240-280 chars] description_front'},
    description_text_back:  {type:'string',   default:''},
    offset:                 {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},    //this is the height at which the description is poining at the at the original original
    arrow_position:         {type:'string',   default:'down', oneOf: ['up', 'down', 'left', 'right']},
    arrow_visible:          {type:'boolean',  default:true},
    lookAtCamera:           {type:'boolean',  default:true},
    constrainYAxis:         {type:'boolean',  default:true},
    updateRate:             {type:'number',   default:200},   //in ms
    smoothingOn:            {type:'boolean',  default:true},
    smoothingAlpha:         {type:'float',    default:0.05}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init : function() {
    const CONTEXT_AF  = this;

    //elements
    CONTEXT_AF.descWrapper                = null
    CONTEXT_AF.rotateDescElem             = null;  //wrapper to rotate everything
    CONTEXT_AF.rotateElem                 = null;  //rotate button
    CONTEXT_AF.desc_BG                    = null;  //background eleent (rounded white rectangle)
    CONTEXT_AF.objectDescriptionText      = null;  //description text (front)
    CONTEXT_AF.objectDescriptionTextBack  = null;  //description text (back)
    CONTEXT_AF.objectTitleText            = null;  //title text (front)
    CONTEXT_AF.objectTitleTextBack        = null;  //title text (back)
    CONTEXT_AF.descArrow                  = null;  //pointing towards the ground

    CONTEXT_AF.TEXT_DESC_WINDOW_HEIGHT    = 0.9;
    CONTEXT_AF.TEXT_TITLE_WINDOW_HEIGHT   = 0.3;
    CONTEXT_AF.TEXT_WINDOW_WIDTH          = 2.0;
    CONTEXT_AF.TEXT_WINDOW_HEIGHT         = CONTEXT_AF.TEXT_DESC_WINDOW_HEIGHT + CONTEXT_AF.TEXT_TITLE_WINDOW_HEIGHT;
    CONTEXT_AF.TEXT_PADDING               = 0.1;
    CONTEXT_AF.DIST_BETWEEN_PLATES        = 0.05;
    CONTEXT_AF.ARROW_SIZE                 = 0.2;
    CONTEXT_AF.ROTATION_PADDING           = CONTEXT_AF.TEXT_PADDING * 2;

    CONTEXT_AF.isRotatingAroundY  = true;
    CONTEXT_AF.isAnimating        = false;

    CONTEXT_AF.createDescElement();

    if (CIRCLES.isReady()) {
      CONTEXT_AF.el.setAttribute('circles-lookat', {  targetElement:CIRCLES.getMainCameraElement(), 
                                                      enabled:CONTEXT_AF.data.lookAtCamera, 
                                                      constrainYAxis:CONTEXT_AF.data.constrainYAxis, 
                                                      updateRate:CONTEXT_AF.data.updateRate, 
                                                      smoothingOn:CONTEXT_AF.data.smoothingOn, 
                                                      smoothingAlpha:CONTEXT_AF.data.smoothingAlpha} );
    }
    else {
        const readyFunc = function (e) {
            CONTEXT_AF.camera = CIRCLES.getMainCameraElement(); //get reference to camera in scene (assume there is only one)
            CONTEXT_AF.el.setAttribute('circles-lookat', {  targetElement:CIRCLES.getMainCameraElement(), 
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
  update: function (oldData) {  
    const CONTEXT_AF    = this;
    const data          = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    //text changes
    if (oldData.title_text_front !== data.title_text_front) {
      CONTEXT_AF.objectTitleText.setAttribute('text', {value:data.title_text_front});
    }

    if (oldData.title_text_back !== data.title_text_back) {
      CONTEXT_AF.objectTitleTextBack.setAttribute('text', {value:data.title_text_back});

      //don't show rotate button if both back title and back description are blank
      CONTEXT_AF.rotateElem.setAttribute('circles-interactive-visible', !(data.title_text_back === '' && data.description_text_back === ''));
    }

    if (oldData.description_text_front !== data.description_text_front) {
      CONTEXT_AF.objectDescriptionText.setAttribute('text', {value:data.description_text_front});
    }

    if (oldData.description_text_back !== data.description_text_back) {
      CONTEXT_AF.objectDescriptionTextBack.setAttribute('text', {value:data.description_text_back});

      //don't show rotate button if both back title and back description are blank
      CONTEXT_AF.rotateElem.setAttribute('circles-interactive-visible', !(data.title_text_back === '' && data.description_text_back === ''));
    }

    if ( (oldData.offset !== data.offset) && (data.offset !== '') ) {
      CONTEXT_AF.descWrapper.object3D.position.set(data.offset.x, data.offset.y, data.offset.z);
    }

    if ( (oldData.arrow_position !== data.arrow_position) && (data.arrow_position !== '') ) {
      if (CONTEXT_AF.descArrow !== null) {
        if ( data.arrow_position == 'up' ) {
          CONTEXT_AF.descArrow.setAttribute('visible', true);
          CONTEXT_AF.descArrow.setAttribute('position', {x:0.0, y:CONTEXT_AF.TEXT_WINDOW_HEIGHT/2, z:0.0});
          CONTEXT_AF.descArrow.setAttribute('rotation', {x:0.0, y:0.0, z:180});
          CONTEXT_AF.rotateElem.setAttribute('position', {x:0.0, y:-CONTEXT_AF.TEXT_WINDOW_HEIGHT/2 - CONTEXT_AF.ROTATION_PADDING, z:0});
          CONTEXT_AF.textBack.setAttribute('rotation', {x:0.0, y:0.0, z:0.0});
          CONTEXT_AF.textBack.setAttribute('position', {x:CONTEXT_AF.TEXT_WINDOW_WIDTH/2, y:CONTEXT_AF.TEXT_WINDOW_HEIGHT/2, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
          CONTEXT_AF.rotateDescElem.setAttribute('rotation', {x:0.0, y:0.0, z:0.0});
          CONTEXT_AF.isRotatingAroundY = true;
        }
        else if ( data.arrow_position == 'right' ) {
          CONTEXT_AF.descArrow.setAttribute('visible', true);
          CONTEXT_AF.descArrow.setAttribute('position', {x:CONTEXT_AF.TEXT_WINDOW_WIDTH/2, y:0.0, z:0.0});
          CONTEXT_AF.descArrow.setAttribute('rotation', {x:0.0, y:0.0, z:90});
          CONTEXT_AF.rotateElem.setAttribute('position', {x:-CONTEXT_AF.TEXT_WINDOW_WIDTH/2 - CONTEXT_AF.ROTATION_PADDING, y:0.0, z:0});
          CONTEXT_AF.textBack.setAttribute('rotation', {x:0.0, y:0.0, z:180.0});
          CONTEXT_AF.textBack.setAttribute('position', {x:-CONTEXT_AF.TEXT_WINDOW_WIDTH/2, y:-CONTEXT_AF.TEXT_WINDOW_HEIGHT/2, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
          CONTEXT_AF.rotateDescElem.setAttribute('rotation', {x:0.0, y:0.0, z:0.0});
          CONTEXT_AF.isRotatingAroundY = false;
        }
        else if ( data.arrow_position == 'down' ) {
          CONTEXT_AF.descArrow.setAttribute('visible', true);
          CONTEXT_AF.descArrow.setAttribute('position', {x:0.0, y:-CONTEXT_AF.TEXT_WINDOW_HEIGHT/2, z:0.0});
          CONTEXT_AF.descArrow.setAttribute('rotation', {x:0.0, y:0.0, z:0.0});
          CONTEXT_AF.rotateElem.setAttribute('position', {x:0.0, y:CONTEXT_AF.TEXT_WINDOW_HEIGHT/2 + CONTEXT_AF.ROTATION_PADDING, z:0});
          CONTEXT_AF.textBack.setAttribute('rotation', {x:0.0, y:0.0, z:0.0});
          CONTEXT_AF.textBack.setAttribute('position', {x:CONTEXT_AF.TEXT_WINDOW_WIDTH/2, y:CONTEXT_AF.TEXT_WINDOW_HEIGHT/2, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
          CONTEXT_AF.rotateDescElem.setAttribute('rotation', {x:0.0, y:0.0, z:0.0});
          CONTEXT_AF.isRotatingAroundY = true;
        }
        else if ( data.arrow_position == 'left' ) {
          CONTEXT_AF.descArrow.setAttribute('visible', true);
          CONTEXT_AF.descArrow.setAttribute('position', {x:-CONTEXT_AF.TEXT_WINDOW_WIDTH/2, y:0.0, z:0.0});
          CONTEXT_AF.descArrow.setAttribute('rotation', {x:0.0, y:0.0, z:-90});
          CONTEXT_AF.rotateElem.setAttribute('position', {x:CONTEXT_AF.TEXT_WINDOW_WIDTH/2 + CONTEXT_AF.ROTATION_PADDING, y:0.0, z:0});
          CONTEXT_AF.textBack.setAttribute('rotation', {x:0.0, y:0.0, z:180.0});
          CONTEXT_AF.textBack.setAttribute('position', {x:-CONTEXT_AF.TEXT_WINDOW_WIDTH/2, y:-CONTEXT_AF.TEXT_WINDOW_HEIGHT/2, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
          CONTEXT_AF.rotateDescElem.setAttribute('rotation', {x:0.0, y:0.0, z:0.0});
          CONTEXT_AF.isRotatingAroundY = false;
        }
      }
    }

    if (oldData.arrow_visible !== data.arrow_visible && (data.arrow_visible !== '')) {
      CONTEXT_AF.descArrow.object3D.visible = data.arrow_visible;
    }
  },
  createDescElement: function() {
    const CONTEXT_AF = this;
    const data       = this.data;

    //how we will position offset
    CONTEXT_AF.descWrapper = document.createElement('a-entity');
    CONTEXT_AF.el.appendChild(CONTEXT_AF.descWrapper);

    CONTEXT_AF.rotateDescElem = document.createElement('a-entity');
    CONTEXT_AF.rotateDescElem.setAttribute('position', {x:0, y:0.0, z:0});
    CONTEXT_AF.descWrapper.appendChild(CONTEXT_AF.rotateDescElem);

    //add bg for desc
    CONTEXT_AF.desc_BG = document.createElement('a-entity');
    CONTEXT_AF.desc_BG.setAttribute('circles-rounded-rectangle',  {width:CONTEXT_AF.TEXT_WINDOW_WIDTH, height:CONTEXT_AF.TEXT_WINDOW_HEIGHT, radius:CIRCLES.CONSTANTS.GUI.rounded_rectangle_radius});
    CONTEXT_AF.desc_BG.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    CONTEXT_AF.rotateDescElem.appendChild(CONTEXT_AF.desc_BG);

    //add title text (15 char limit for now)
    CONTEXT_AF.textFront = document.createElement('a-entity');
    CONTEXT_AF.textFront.setAttribute('position', {x:-CONTEXT_AF.TEXT_WINDOW_WIDTH/2, y:CONTEXT_AF.TEXT_WINDOW_HEIGHT/2, z:0.0});
    CONTEXT_AF.rotateDescElem.appendChild(CONTEXT_AF.textFront);

    CONTEXT_AF.objectTitleText = document.createElement('a-entity');
    CONTEXT_AF.objectTitleText.setAttribute('id', 'title_text');
    CONTEXT_AF.objectTitleText.setAttribute('position', {x:CONTEXT_AF.TEXT_PADDING, y:-CONTEXT_AF.TEXT_PADDING, z:0.0});
    CONTEXT_AF.objectTitleText.setAttribute('text', { anchor:'left', baseline:'top', wrapCount:20,
                                                      color:'rgb(0,0,0)', width:CONTEXT_AF.TEXT_WINDOW_WIDTH - CONTEXT_AF.TEXT_PADDING*2, height:CONTEXT_AF.TEXT_TITLE_WINDOW_HEIGHT- CONTEXT_AF.TEXT_PADDING*1.5, 
                                                      font: CIRCLES.CONSTANTS.GUI.font_body});
    CONTEXT_AF.textFront.appendChild(CONTEXT_AF.objectTitleText);

    //add description text (220 char limit for now)
    CONTEXT_AF.objectDescriptionText = document.createElement('a-entity');
    CONTEXT_AF.objectDescriptionText.setAttribute('id', 'description_text');
    CONTEXT_AF.objectDescriptionText.setAttribute('position', {x:CONTEXT_AF.TEXT_PADDING, y:-CONTEXT_AF.TEXT_PADDING/2 - CONTEXT_AF.TEXT_TITLE_WINDOW_HEIGHT, z:CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectDescriptionText.setAttribute('text', {  anchor:'left', baseline:'top', wrapCount:33,
                                      color:'rgb(0,0,0)', width:CONTEXT_AF.TEXT_WINDOW_WIDTH - CONTEXT_AF.TEXT_PADDING * 2, height:CONTEXT_AF.TEXT_DESC_WINDOW_HEIGHT - CONTEXT_AF.TEXT_PADDING * 2,
                                      font: CIRCLES.CONSTANTS.GUI.font_body});
    CONTEXT_AF.textFront.appendChild(CONTEXT_AF.objectDescriptionText);

    CONTEXT_AF.textBack = document.createElement('a-entity');
    CONTEXT_AF.textBack.setAttribute('position', {x:CONTEXT_AF.TEXT_WINDOW_WIDTH/2, y:CONTEXT_AF.TEXT_WINDOW_HEIGHT/2, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.rotateDescElem.appendChild(CONTEXT_AF.textBack);

    //[optional] text on back
    CONTEXT_AF.objectTitleTextBack = document.createElement('a-entity');
    CONTEXT_AF.objectTitleTextBack.setAttribute('id', 'title_text2');
    CONTEXT_AF.objectTitleTextBack.setAttribute('rotation', {x:0.0, y:180.0, z:0.0});
    CONTEXT_AF.objectTitleTextBack.setAttribute('position', {x:-CONTEXT_AF.TEXT_PADDING, y:-CONTEXT_AF.TEXT_PADDING, z:0.0});
    CONTEXT_AF.objectTitleTextBack.setAttribute('text', { anchor:'left', baseline:'top', wrapCount:20,
                                      color:'rgb(0,0,0)', width:CONTEXT_AF.TEXT_WINDOW_WIDTH - CONTEXT_AF.TEXT_PADDING*2, height:CONTEXT_AF.TEXT_TITLE_WINDOW_HEIGHT- CONTEXT_AF.TEXT_PADDING*1.5, 
                                      font: CIRCLES.CONSTANTS.GUI.font_body});
    CONTEXT_AF.textBack.appendChild(CONTEXT_AF.objectTitleTextBack);

    CONTEXT_AF.objectDescriptionTextBack = document.createElement('a-entity');
    CONTEXT_AF.objectDescriptionTextBack.setAttribute('id', 'description_text2');
    CONTEXT_AF.objectDescriptionTextBack.setAttribute('rotation', {x:0.0, y:180.0, z:0.0});
    CONTEXT_AF.objectDescriptionTextBack.setAttribute('position', {x:-CONTEXT_AF.TEXT_PADDING, y:-CONTEXT_AF.TEXT_PADDING/2 - CONTEXT_AF.TEXT_TITLE_WINDOW_HEIGHT, z:0.0});
    CONTEXT_AF.objectDescriptionTextBack.setAttribute('text', {  anchor:'left', baseline:'top', wrapCount:33,
                                      color:'rgb(0,0,0)', width:CONTEXT_AF.TEXT_WINDOW_WIDTH - CONTEXT_AF.TEXT_PADDING * 2, height:CONTEXT_AF.TEXT_DESC_WINDOW_HEIGHT - CONTEXT_AF.TEXT_PADDING * 2,
                                      font: CIRCLES.CONSTANTS.GUI.font_body});
    CONTEXT_AF.textBack.appendChild(CONTEXT_AF.objectDescriptionTextBack);

    CONTEXT_AF.rotateElem = document.createElement('a-entity');
    CONTEXT_AF.rotateElem.setAttribute('id', 'rotate_desc_control');
    CONTEXT_AF.rotateElem.setAttribute('class', 'interactive button');
    CONTEXT_AF.rotateElem.setAttribute('position', {x:0.0, y:CONTEXT_AF.TEXT_WINDOW_HEIGHT/2 + CONTEXT_AF.ROTATION_PADDING, z:0});
    CONTEXT_AF.rotateElem.setAttribute('circles-interactive-visible', true);
    CONTEXT_AF.rotateElem.setAttribute('geometry',  {  primitive:'plane', 
                                            width:0.3,
                                            height:0.3 
                                          });
                                          CONTEXT_AF.rotateElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_ROTATE, color:'rgb(255,255,255)', shader:'flat', transparent:true, side:'double'});
    CONTEXT_AF.descWrapper.appendChild(CONTEXT_AF.rotateElem);
    CONTEXT_AF.rotateElem.addEventListener('mouseenter', function (e) { e.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
    CONTEXT_AF.rotateElem.addEventListener('mouseleave', function (e) { e.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });

    //make sure we can't click again when moving
    CONTEXT_AF.rotateDescElem.addEventListener('animationbegin', function(e) {
      CONTEXT_AF.isAnimating = true;
    });
    CONTEXT_AF.rotateDescElem.addEventListener('animationcomplete', function(e) {
      CONTEXT_AF.isAnimating = false;
    });

    //rotate when clicking if top/bottom rotate on y, else left/right, rotate on x
    CONTEXT_AF.rotateElem.addEventListener('click', function (e) {
      if (CONTEXT_AF.isAnimating === false) {
        if (CONTEXT_AF.isRotatingAroundY === true) {  //otherwise flip on x
          const newAngle = THREE.MathUtils.radToDeg(CONTEXT_AF.rotateDescElem.object3D.rotation.y) + 180;
          CONTEXT_AF.rotateDescElem.setAttribute('animation__desc', {property:'rotation.y', dur:500, dir:'normal', to:newAngle, easing:'easeInQuad'});
        }
        else {
          const newAngle = THREE.MathUtils.radToDeg(CONTEXT_AF.rotateDescElem.object3D.rotation.x) + 180;
          CONTEXT_AF.rotateDescElem.setAttribute('animation__desc', {property:'rotation.x', dur:500, dir:'normal', to:newAngle, easing:'easeInQuad'});
        }
      }
    });

    CONTEXT_AF.descArrow = document.createElement('a-entity');
    CONTEXT_AF.descArrow.setAttribute('geometry',  {  primitive:'triangle', 
                                                      vertexA:{x:CONTEXT_AF.ARROW_SIZE, y:0.0, z:0}, 
                                                      vertexB:{x:-CONTEXT_AF.ARROW_SIZE, y:0.0, z:0}, 
                                                      vertexC:{x:0.0, y:-CONTEXT_AF.ARROW_SIZE, z:0}
                                                    });
    CONTEXT_AF.descArrow.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    CONTEXT_AF.rotateDescElem.appendChild(CONTEXT_AF.descArrow);
  }
});
