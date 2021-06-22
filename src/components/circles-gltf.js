'use strict';

//This is just a shorthand form of adding other attributes :)
AFRAME.registerComponent('circles-gltf', {
  // dependencies: ['gltf-model','circles-sphere-env-map','circles-color'],
  schema: {
    // ... Define schema to pass properties from DOM to this component
    src:        {type: 'asset',     default:''},
    //position:   {type: 'vec3',      default:{x:0.0, y:0.0, z:0.0}},
    // envMap:     {type: 'asset',     default:''},
    color:      {type: 'string',    default:'rgb(255,255,255)'}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function()
  {
    const CONTEXT_AF = this;
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    //model change
    if ( (oldData.src !== data.src) && (data.src !== '') ) {
      CONTEXT_AF.el.setAttribute('gltf-model', data.src);
    }

    // //envMap change
    // if ((oldData.envMap !== data.envMap) && (data.envMap !== '')) {
    //     CONTEXT_AF.el.setAttribute('circles-sphere-env-map', { src:data.envMap });
    // }

    //color change
    if (oldData.color !== data.color) {
      CONTEXT_AF.el.setAttribute('circles-color', {color:data.color});
    }
  },
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
