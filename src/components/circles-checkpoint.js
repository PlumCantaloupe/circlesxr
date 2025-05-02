'use strict';

AFRAME.registerComponent('circles-checkpoint', {
  schema: {
    offset:           {type:'vec3', default:{x: 0, y: 0, z: 0} },   //where the user spawns, relative to the position of the checkpoint
    useDefaultModel:  {type:'boolean', default:true },
    //added in properties to change colour and transparency 
    colour:           {type: 'color', default: 'rgb(57, 187, 130)'},
    emission:         {type: 'color', default: 'rgb(7,137,80)'},
    transparent:      {type:'boolean', default: false },
    opacity:          {type:'number', default: 1},
  },

  init: function () {
    const CONTEXT_AF = this;

    //make sure this is interactive
    if (!CONTEXT_AF.el.classList.contains('checkpoint')) {
        CONTEXT_AF.el.classList.add('checkpoint');
    }

    console.log("init checkpoint", CONTEXT_AF)
  },
  update : function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    console.log("update called", CONTEXT_AF)

    if ( (oldData.offset !== data.offset) && (data.offset !== '') ) {
      CONTEXT_AF.el.setAttribute('checkpoint', {offset:CONTEXT_AF.data.offset});
    }

    if ( (oldData.useDefaultModel !== data.useDefaultModel) && (data.useDefaultModel !== '') ) {
      CONTEXT_AF.setDefaultModel(data.useDefaultModel);
    }

    //added in for colour and transparency customization
    if ( (oldData.colour !== data.colour) && (data.colour !== '') ) {
      CONTEXT_AF.setDefaultModel(data.useDefaultModel);
    }

    if ( (oldData.emissive !== data.emissive) && (data.emissive !== '') ) {
      CONTEXT_AF.setDefaultModel(data.useDefaultModel);
    }

    if ( (oldData.transparent !== data.transparent) && (data.transparent !== '') ) {
      CONTEXT_AF.setDefaultModel(data.useDefaultModel);
    }

    if ( (oldData.opacity !== data.opacity) && (data.opacity !== '') ) {
      CONTEXT_AF.setDefaultModel(data.useDefaultModel);
    }
  },
  setDefaultModel : function(useDefaultModel) {
    const CONTEXT_AF = this;
    const data = CONTEXT_AF.data;
    
    console.log("set default", data)

    if (useDefaultModel) {
      //create sphere component for portal
      CONTEXT_AF.el.setAttribute('material', {transparent:data.transparent, opacity:data.opacity, color:data.colour, emissive:data.emissive, roughness:0.8, metalness:0.0});
      CONTEXT_AF.el.setAttribute('geometry', {primitive:'cylinder', radius:0.5, height:0.06});
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'outline'});
    }
    else {
      CONTEXT_AF.el.removeAttribute('material');
      CONTEXT_AF.el.removeAttribute('geometry');
      CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'none'});
    }
  }
});