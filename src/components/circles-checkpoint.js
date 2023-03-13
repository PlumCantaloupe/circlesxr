'use strict';

AFRAME.registerComponent('circles-checkpoint', {
  schema: {
    offset: { type: 'vec3', default:{x: 0, y: 0, z: 0} },
    modelOn: {  type: 'boolean', default:true }
  },

  init: function () {
    const CONTEXT_AF = this;

    //add some basic styling
    CONTEXT_AF.el.setAttribute('material', {transparent:false, color:'rgb(57, 187, 130)', emissive:'rgb(7,137,80)', roughness:0.8, metalness:0.0});
    CONTEXT_AF.el.setAttribute('geometry', {primitive:'cylinder', radius:0.5, height:0.04});
    CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'outline'});

    //make sure this is interactive
    if (!CONTEXT_AF.el.classList.contains('checkpoint')) {
        CONTEXT_AF.el.classList.add('checkpoint');
    }
  },
  update : function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if ( (oldData.offset !== data.offset) && (data.offset !== '') ) {
      CONTEXT_AF.el.setAttribute('checkpoint', {offset:CONTEXT_AF.data.offset});
    }

    if ( (oldData.modelOn !== data.modelOn) && (data.modelOn !== '') ) {
      
    }
  }
});