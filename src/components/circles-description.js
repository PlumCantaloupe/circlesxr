'use strict';

AFRAME.registerComponent('circles-description', {
  schema: {
    window_width        : {type:'number', default:2.0},
    title_height        : {type:'number', default:0.9},
    description_height  : {type:'number', default:0.3},
    text_padding        : {type:'number', default:0.1},
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init : function() {
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
      CONTEXT_AF.rotateDescElem.setAttribute('animation__desc', {property:'rotation.y', dur:500, dir:'normal', to:CONTEXT_AF.rotationDesc, easing:'easeInQuad'});
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
  update: function (oldData) {  
    this.el.object3D.visible = this.data;

    //update raycaster objects ...
    if (this.data === true) {
      if (!this.el.classList.contains("interactive")) {
        this.el.classList.add('interactive');
      }
    }
    else {
      if (this.el.classList.contains("interactive")) {
        this.el.classList.remove("interactive");
      }
    }
  }
});
