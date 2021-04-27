'use strict';

AFRAME.registerComponent('circles-checkpoint', {
  schema: {
    offset: {default: {x: 0, y: 0, z: 0}, type: 'vec3'}
  },

  init: function () {
    const Context_AF = this;

    //add some basic styling
    Context_AF.el.setAttribute('material', {transparent:false, color:'rgb(57, 187, 130)', emissive:'rgb(7,137,80)'});
    Context_AF.el.setAttribute('geometry', {primitive:'cylinder', radius:0.5, height:0.04});
    Context_AF.el.setAttribute('circles-interactive-object', '');
    Context_AF.el.setAttribute('checkpoint', {offset:Context_AF.data.offset});

    //make sure this is interactive
    if (!Context_AF.el.classList.contains('checkpoint')) {
        Context_AF.el.classList.add('checkpoint');
    }
  }
});