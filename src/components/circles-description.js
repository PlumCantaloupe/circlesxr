'use strict';

AFRAME.registerComponent('circles-description', {
  schema: {
    title_text_front:       {type:'string',   default:'[~20-25 chars] title_front'},
    title_text_back:        {type:'string',   default:''},
    description_text_front: {type:'string',   default:'[~240-280 chars] description_front'},
    description_text_back:  {type:'string',   default:''},
    lookAtCamera:           {type:'boolean',  default:true},
    constrainYAxis:         {type:'boolean',  default:true},
    updateRate:             {type:'number',   default:200},   //in ms
    smoothingOn:            {type:'boolean',  default:true},
    smoothingAlpha:         {type:'float',    default:0.05}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init : function() {
    const CONTEXT_AF  = this;

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

    //elements
    CONTEXT_AF.rotateDescElem             = null;  //wrapper to rotate everything
    CONTEXT_AF.rotateElem                 = null;  //rotate button
    CONTEXT_AF.desc_BG                    = null;  //background eleent (rounded white rectangle)
    CONTEXT_AF.objectDescriptionText      = null;  //description text (front)
    CONTEXT_AF.objectDescriptionTextBack  = null;  //description text (back)
    CONTEXT_AF.objectTitleText            = null;  //title text (front)
    CONTEXT_AF.objectTitleTextBack        = null;  //title text (back)
    CONTEXT_AF.triangle_point             = null;  //pointing towards the ground

    const TEXT_WINDOW_WIDTH         = 2.0;
    const TEXT_DESC_WINDOW_HEIGHT   = 0.9;
    const TEXT_TITLE_WINDOW_HEIGHT  = 0.3;
    const TEXT_PADDING              = 0.1;
    const DIST_BETWEEN_PLATES       = 0.05;
    const POINTER_HEIGHT            = 0.2;
    const HEIGHT_FUDGE              = 1.22;   //just bringing everything up terribly so that pointer is at origin ...

    CONTEXT_AF.rotateDescElem = document.createElement('a-entity');
    CONTEXT_AF.rotateDescElem.setAttribute('position', {x:0, y:HEIGHT_FUDGE, z:0});
    CONTEXT_AF.el.appendChild(CONTEXT_AF.rotateDescElem);

    CONTEXT_AF.infoOffsetElem = document.createElement('a-entity');
    CONTEXT_AF.infoOffsetElem.setAttribute('position',{x:-TEXT_WINDOW_WIDTH/2, y:-(DIST_BETWEEN_PLATES + TEXT_TITLE_WINDOW_HEIGHT)/2, z:0});
    CONTEXT_AF.rotateDescElem.appendChild(CONTEXT_AF.infoOffsetElem);

    //add bg for desc
    CONTEXT_AF.desc_BG = document.createElement('a-entity');
    // desc_BG.setAttribute('geometry',  {primitive:'plane', width:TEXT_WINDOW_WIDTH, height:TEXT_DESC_WINDOW_HEIGHT});
    CONTEXT_AF.desc_BG.setAttribute('circles-rounded-rectangle',  {width:TEXT_WINDOW_WIDTH, height:TEXT_DESC_WINDOW_HEIGHT + TEXT_TITLE_WINDOW_HEIGHT, radius:CIRCLES.CONSTANTS.GUI.rounded_rectangle_radius});
    CONTEXT_AF.desc_BG.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    CONTEXT_AF.desc_BG.setAttribute('position',  {x:TEXT_WINDOW_WIDTH/2, y:-TEXT_DESC_WINDOW_HEIGHT/2 + POINTER_HEIGHT, z:0});
    CONTEXT_AF.infoOffsetElem.appendChild(CONTEXT_AF.desc_BG);

    //add description text (220 char limit for now)
    CONTEXT_AF.objectDescriptionText = document.createElement('a-entity');
    CONTEXT_AF.objectDescriptionText.setAttribute('id', 'description_text');
    // CONTEXT_AF.objectDescriptionText.setAttribute('material',  {depthTest:false});
    CONTEXT_AF.objectDescriptionText.setAttribute('position', {x:TEXT_PADDING, y:0.0, z:CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectDescriptionText.setAttribute('text', {  anchor:'left', baseline:'top', wrapCount:33,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING * 2, height:TEXT_DESC_WINDOW_HEIGHT - TEXT_PADDING * 2,
                                      font: CIRCLES.CONSTANTS.GUI.font_body});
                                      CONTEXT_AF.infoOffsetElem.appendChild(CONTEXT_AF.objectDescriptionText);

    CONTEXT_AF.objectDescriptionTextBack = document.createElement('a-entity');
    CONTEXT_AF.objectDescriptionTextBack.setAttribute('id', 'description_text2');
    CONTEXT_AF.objectDescriptionTextBack.setAttribute('rotation', {x:0.0, y:180.0, z:0.0});
    CONTEXT_AF.objectDescriptionTextBack.setAttribute('position', {x:TEXT_WINDOW_WIDTH - TEXT_PADDING, y:0.0, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectDescriptionTextBack.setAttribute('text', {  anchor:'left', baseline:'top', wrapCount:33,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING * 2, height:TEXT_DESC_WINDOW_HEIGHT - TEXT_PADDING * 2,
                                      font: CIRCLES.CONSTANTS.GUI.font_body});
    CONTEXT_AF.infoOffsetElem.appendChild(CONTEXT_AF.objectDescriptionTextBack);

    //add title text (15 char limit for now)
    CONTEXT_AF.objectTitleText = document.createElement('a-entity');
    CONTEXT_AF.objectTitleText.setAttribute('id', 'title_text');
    CONTEXT_AF.objectTitleText.setAttribute('position', {x:TEXT_PADDING, y:-TEXT_PADDING + TEXT_TITLE_WINDOW_HEIGHT, z:CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectTitleText.setAttribute('text', { anchor:'left', baseline:'top', wrapCount:20,
                                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING*2, height:TEXT_TITLE_WINDOW_HEIGHT- TEXT_PADDING*1.5, 
                                                      font: CIRCLES.CONSTANTS.GUI.font_body});
    CONTEXT_AF.infoOffsetElem.appendChild(CONTEXT_AF.objectTitleText);

    CONTEXT_AF.objectTitleTextBack = document.createElement('a-entity');
    CONTEXT_AF.objectTitleTextBack.setAttribute('id', 'title_text2');
    CONTEXT_AF.objectTitleTextBack.setAttribute('rotation', {x:0.0, y:180.0, z:0.0});
    CONTEXT_AF.objectTitleTextBack.setAttribute('position', {x:TEXT_WINDOW_WIDTH - TEXT_PADDING, y:-TEXT_PADDING + TEXT_TITLE_WINDOW_HEIGHT, z:-CIRCLES.CONSTANTS.GUI.text_z_pos});
    CONTEXT_AF.objectTitleTextBack.setAttribute('text', { anchor:'left', baseline:'top', wrapCount:20,
                                      color:'rgb(0,0,0)', width:TEXT_WINDOW_WIDTH - TEXT_PADDING*2, height:TEXT_TITLE_WINDOW_HEIGHT- TEXT_PADDING*1.5, 
                                      font: CIRCLES.CONSTANTS.GUI.font_body});
    CONTEXT_AF.infoOffsetElem.appendChild(CONTEXT_AF.objectTitleTextBack);

    CONTEXT_AF.rotateElem = document.createElement('a-entity');
    CONTEXT_AF.rotateElem.setAttribute('id', 'rotate_desc_control');
    CONTEXT_AF.rotateElem.setAttribute('class', 'interactive button');
    CONTEXT_AF.rotateElem.setAttribute('position', {x:0.0, y:1.6, z:0});
    CONTEXT_AF.rotateElem.setAttribute('circles-interactive-visible', true);
    CONTEXT_AF.rotateElem.setAttribute('geometry',  {  primitive:'plane', 
                                            width:0.3,
                                            height:0.3 
                                          });
                                          CONTEXT_AF.rotateElem.setAttribute('material',  {src:CIRCLES.CONSTANTS.ICON_ROTATE, color:'rgb(255,255,255)', shader:'flat', transparent:true, side:'double'});
    CONTEXT_AF.el.appendChild(CONTEXT_AF.rotateElem);
    CONTEXT_AF.rotateElem.addEventListener('mouseenter', function (e) { e.target.setAttribute('scale',{x:1.1, y:1.1, z:1.1}); });
    CONTEXT_AF.rotateElem.addEventListener('mouseleave', function (e) { e.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });
    CONTEXT_AF.rotationDesc = CONTEXT_AF.rotateElem.getAttribute('rotation').y;
    CONTEXT_AF.rotateElem.addEventListener('click', function (e) {
      CONTEXT_AF.rotationDesc += 180;
      CONTEXT_AF.rotateDescElem.setAttribute('animation__desc', {property:'rotation.y', dur:500, dir:'normal', to:CONTEXT_AF.rotationDesc, easing:'easeInQuad'});
    });

    CONTEXT_AF.triangle_point = document.createElement('a-entity');
    CONTEXT_AF.triangle_point.setAttribute('geometry',  {  primitive:'triangle', 
                                                vertexA:{x:TEXT_WINDOW_WIDTH/2 + 0.2, y:-(TEXT_DESC_WINDOW_HEIGHT + DIST_BETWEEN_PLATES) + TEXT_PADDING, z:0}, 
                                                vertexB:{x:TEXT_WINDOW_WIDTH/2 - 0.2, y:-(TEXT_DESC_WINDOW_HEIGHT + DIST_BETWEEN_PLATES) + TEXT_PADDING, z:0}, 
                                                vertexC:{x:TEXT_WINDOW_WIDTH/2, y:-(TEXT_DESC_WINDOW_HEIGHT + POINTER_HEIGHT + DIST_BETWEEN_PLATES) + TEXT_PADDING, z:0}
                                              });
    CONTEXT_AF.triangle_point.setAttribute('material',  CIRCLES.CONSTANTS.GUI.material_bg_basic);
    CONTEXT_AF.infoOffsetElem.appendChild(CONTEXT_AF.triangle_point);
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
  }
});
