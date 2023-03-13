'use strict';

AFRAME.registerComponent('circles-checkpoint', {
  schema: {
    offset:           {type:'vec3', default:{x: 0, y: 0, z: 0} },   //where the user spawns, relative to the position of the checkpoint
    useDefaultModel:  {type:'boolean', default:true }
  },

  init: function () {
    const CONTEXT_AF = this;

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

    if ( (oldData.useDefaultModel !== data.useDefaultModel) && (data.useDefaultModel !== '') ) {
      CONTEXT_AF.setDefaultModel(data.useDefaultModel);
    }
  },
  setDefaultModel : function(useDefaultModel) {
    const CONTEXT_AF = this;
    const data = CONTEXT_AF.data;
    
    if (useDefaultModel) {
      //create sphere component for portal
      CONTEXT_AF.el.setAttribute('material', {transparent:false, color:'rgb(57, 187, 130)', emissive:'rgb(7,137,80)', roughness:0.8, metalness:0.0});
      CONTEXT_AF.el.setAttribute('geometry', {primitive:'cylinder', radius:0.5, height:0.04});
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'outline'});
    }
    else {
      CONTEXT_AF.el.removeAttribute('material');
      CONTEXT_AF.el.removeAttribute('geometry');
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'none'});
    }
  }
});