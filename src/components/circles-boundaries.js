'use strict';

//this component allows us to draw boundaries around a user (i.e. Vive's Chaperone)
AFRAME.registerComponent('circles-boundaries', {
  //dependencies: ['circles-gltf'],
  schema: {
    color:          {type: 'string',    default: 'rgb(0, 255, 0)'},
    alpha:          {type: 'number',    default: 1.0}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    var loader = new THREE.GLTFLoader();
    var CONTEXT_AF = this;

    CONTEXT_AF.el.addEventListener('object3dset', () => {
      //console.log('BOUNDARIES');
    });

    const properties = {
      src: CIRCLES.CONSTANTS.DEFAULT_WIREFRAME_MAP,
      alphaTest: 0.5,
      shading: false,
      renderSide: 'double' //front, back, double
    };

    CONTEXT_AF.el.setAttribute('circles-cutout-material', properties);
    CONTEXT_AF.el.setAttribute('circles-color', {color:'rgba(0, 255, 0)', alpha:0.5});

    loader.load(
      // resource URL
      CIRCLES.CONSTANTS.DEFAULT_USER_BOUNDARY,
      // called when the resource is loaded
      function ( gltf ) {
        const model = gltf.scene || gltf.scenes[0];
        CONTEXT_AF.el.setObject3D('mesh', model);
      },
      // called when loading is in progresses
      function ( xhr ) {
        //console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
      },
      // called when loading has errors
      function ( error ) {
        console.log( error.message );
      }
    );
  },
  update: function (oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.color !== data.color) && (data.color !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-color', {color: data.color});
    }

    if ( (oldData.alpha !== data.alpha) && (data.alpha !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-color', {alpha: data.alpha});
    }
  },
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
