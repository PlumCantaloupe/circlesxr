'use strict';

AFRAME.registerComponent('circles-shadow', {
  schema: {
    cast:               {type: 'boolean',    default: true},
    receive:            {type: 'boolean',    default: true},
    applyToChildren:    {type: 'boolean',    default: true}

  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    this.applyShadow();
    this.el.addEventListener('object3dset', this.applyShadow.bind(this));
  },
  //custom function
  applyShadow : function () {
    const data    = this.data;
    const mesh    = this.el.getObject3D('mesh');

    if (!mesh) return;

    // if (data.applyToChildren) {
    mesh.traverse(function (node) {
      node.castShadow     = data.cast;
      node.receiveShadow  = data.receive;

      if (data.applyToChildren) {
        return;
      }
    });
    // }
    // else {
    //     mesh.castShadow = data.cast;
    //     mesh.receiveShadow = data.receive;
    // }
  },
  update: function (oldData) {
    this.applyShadow.bind(this);
  },
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
