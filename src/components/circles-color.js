'use strict';

//based on Don's existing component. Pulling out so we can modify later : https://github.com/donmccurdy/aframe-extras/blob/99535cd878eb36cb25cdcda4a32a40eb248c990a/src/misc/cube-env-map.js
AFRAME.registerComponent('circles-color', {
  //dependencies: ['circles-gltf'],
  schema: {
    color:          {type: 'string',    default: 'rgb(255, 255, 255)'},
    alpha:          {type: 'number',    default: 1.0}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    this.applyColor();
    this.el.addEventListener('object3dset', this.applyColor.bind(this));
    this.el.addEventListener(CIRCLES.EVENTS.CUSTOM_MAT_SET, this.applyColor.bind(this));
  },
  //custom function
  applyColor : function () {
    const mesh = this.el.getObject3D('mesh');
    const color = this.data.color;
    const alpha = this.data.alpha;

    if (!mesh) return;

    mesh.traverse(function (node) {
      if (node.material) {
        node.material.color         = new THREE.Color(color);
        node.material.opacity       = alpha;
        node.material.transparent   = (Math.abs(1.0 - alpha) > Number.EPSILON );
        node.material.visible       = (Math.abs(alpha) > Number.EPSILON );
        node.material.needsUpdate   = true;
      }
    });
  },
  update: function (oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.color !== data.color) && (data.color !== '') ) {
      this.applyColor();
    }

    if ( (oldData.alpha !== data.alpha) && (data.alpha !== '') ) {
      this.applyColor();
    }
  },
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
