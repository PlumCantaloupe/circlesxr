'use strict';

//This is just a shorthand form of adding other attributes :)
AFRAME.registerComponent('circles-controls', {
  // dependencies: ['gltf-model','circles-sphere-env-map','circles-color'],
  schema: {
    hand:                 {type: 'string',    default: ''},
    model:                {type: 'asset',     default: ''},
    orientationOffset:    {type: 'vec3'},
    defaultPos:           {type: 'vec3'},     //expects local coordinates (position hand will go to when no trackedControls)
    envMap:               {type: 'asset',     default: ''},
    color:                {type: 'string',    default: 'rgb(255,255,255)'},
    parentConstraint:     {type: 'selector',  default: null}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    //console.log( navigator );
    //TDOD: use this code go to find out if we have motion controllers or not https://github.com/chenzlabs/auto-detect-controllers/blob/master/auto-detect-controllers.js
    //connect and disconnect events ..

    let el          = this.el;
    let data        = this.data;

    const controlConfiguration = {
      hand: data.hand,
      model: false,
      orientationOffset: data.orientationOffset
    };

    // Build on top of controller components.
    el.setAttribute('vive-controls',           controlConfiguration);
    el.setAttribute('oculus-touch-controls',   controlConfiguration);
  },
  update: function(oldData) {
    const Context_AF    = this;
    const data          = Context_AF.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    //model change
    if ( (oldData.model !== data.model) && (data.model !== '') ) {
      Context_AF.el.setAttribute('circles-gltf', {src : data.model} );
    }

    //envMap change
    if ((oldData.envMap !== data.envMap) && (data.envMap !== '')) {
      Context_AF.el.setAttribute('circles-gltf', {envMap : data.envMap} );
    }

    //color change
    if (oldData.color !== data.color) {
      Context_AF.el.setAttribute('circles-gltf', {color : data.color} );
    }

    //parent change
    if (oldData.parentConstraint !== data.parentConstraint) {
      // have a default constraint that we will remove when controllers are detectected .. TODO remove/add again
      Context_AF.el.setAttribute('rotation', data.orientationOffset); //will have to do this on connect and disconnect events too ... later
      Context_AF.el.setAttribute('position', data.defaultPos); //will have to do this on connect and disconnect events too ... later
      Context_AF.el.setAttribute('circles-parent-constraint', {  parent:'#' + data.parentConstraint.getAttribute('id'),
        position:true, rotation:true, scale:true,
        copyParentTransforms:false,
        maintainOffset:true
      });
    }
  },
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  remove: function() {
    clearInterval(this.gamePadLoopCheck);
  },
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
