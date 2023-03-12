'use strict';

AFRAME.registerComponent('circles-checkpoint', {
  schema: {
    offset: {default: {x: 0, y: 0, z: 0}, type: 'vec3'}
  },

  init: function () {
    const CONTEXT_AF = this;

    //add some basic styling
    CONTEXT_AF.el.setAttribute('material', {transparent:false, color:'rgb(57, 187, 130)', emissive:'rgb(7,137,80)', roughness:0.8, metalness:0.0});
    CONTEXT_AF.el.setAttribute('geometry', {primitive:'cylinder', radius:0.5, height:0.04});
    CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'outline'});
    CONTEXT_AF.el.setAttribute('checkpoint', {offset:CONTEXT_AF.data.offset});

    //make sure this is interactive
    if (!CONTEXT_AF.el.classList.contains('checkpoint')) {
        CONTEXT_AF.el.classList.add('checkpoint');
    }
  }
});