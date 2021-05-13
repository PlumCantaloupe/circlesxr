'use strict';

//based on Don's existing component. Pulling out so we can modify later : https://github.com/donmccurdy/aframe-extras/blob/99535cd878eb36cb25cdcda4a32a40eb248c990a/src/misc/cube-env-map.js
AFRAME.registerComponent('circles-cube-map', {
  //dependencies: ['circles-gltf'],
  schema: {
    dirPath:        {type:'string',     default: ''},           //path to folder containing all 6 images for cube map
    extension:      {type:'string',     default: 'jpg'},
    format:         {type:'string',     default: 'RGBFormat'},
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    this.loader = new THREE.CubeTextureLoader();
    this.applyEnvMap();
    this.el.addEventListener('object3dset', this.applyEnvMap.bind(this));
  },
  //custom function
  applyEnvMap : function () {
    const CONTEXT_AF = this;
    const mesh = this.el.getObject3D('mesh');
    const data = this.data;

    if (!mesh) {return;}

    if (data.dirPath !== null) {
      CONTEXT_AF.loader.load([
        data.dirPath + 'posx.' + data.extension, data.dirPath + 'negx.' + data.extension,
        data.dirPath + 'posy.' + data.extension, data.dirPath + 'negy.' + data.extension,
        data.dirPath + 'posz.' + data.extension, data.dirPath + 'negz.' + data.extension
      ],
        function onLoad(texture) {
          texture.format = THREE[data.format];

          mesh.traverse(function (node) {
            if (node.material && 'envMap' in node.material) {
              node.material.envMap = texture;
              node.material.needsUpdate = true;
            }
          });
        },
        function onProgress(xmlHttpRequest) {
          //xmlHttpRequest.total (bytes), xmlHttpRequest.loaded (bytes)
        },
        function onError(message) {
          var message = (error && error.message) ? error.message : 'Failed to load cube env map';
          console.warn(message);
        }
      );
    }
  },
  //update: function () {},
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
