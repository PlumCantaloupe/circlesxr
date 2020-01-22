'use strict';

AFRAME.registerComponent('circles-cutout-material', {
  schema: {
    src:            {type:'asset',   default:''},
    alphaTest:      {type:'number',  default:0.5},
    shading:        {type:'boolean', default:true},     //shading at all?
    renderSide:     {type:'string',  default:'double'}  //front, back, double
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    const Context_AF = this;

    Context_AF.loader = new THREE.TextureLoader();
    Context_AF.applyMats();
    Context_AF.el.addEventListener('object3dset', this.applyMats.bind(this));
  },
  //custom function
  applyMats : function () {
    const Context_AF = this;
    const mesh = Context_AF.el.getObject3D('mesh');

    if (!mesh) return;

    if ( Context_AF.data.src === '' ) {
      console.warn('No src defined in component');
    }
    else {
      Context_AF.loader.load( Context_AF.data.src,
        function onLoad(texture) {
          //texture.anisotropy = 16;

          const customDepthMaterial = new THREE.MeshDepthMaterial( {
            depthPacking: THREE.RGBADepthPacking,
            map: texture,
            alphaTest: Context_AF.data.alphaTest
          });

          const basicMaterial = new THREE.MeshBasicMaterial();

          let renderSide = THREE.DoubleSide;
          if ( Context_AF.data.renderSide === 'front' ) {
            renderSide = THREE.FrontSide;
          }
          else if ( Context_AF.data.renderSide === 'back' ) {
            renderSide = THREE.BackSide;
          }

          if (mesh) {
            mesh.traverse(function (node) {

              if (!Context_AF.data.shading) {
                node.material = basicMaterial;
              }

              //if (node.material) {
              //https://stackoverflow.com/questions/43848330/three-js-shadows-cast-by-partially-transparent-mesh?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa\
              node.material.map           = texture;
              node.material.side          = renderSide;
              node.material.alphaTest     = Context_AF.data.alphaTest;
              node.customDepthMaterial    = customDepthMaterial;

              node.customDepthMaterial.needsUpdate    = true;
              node.material.needsUpdate               = true;
              //}
            });
          }

          Context_AF.el.emit(CIRCLES.EVENTS.CUSTOM_MAT_SET);
        },
        function onProgress(xmlHttpRequest) {
          //xmlHttpRequest.total (bytes), xmlHttpRequest.loaded (bytes)
        },
        function onError(message) {
          var message = (error && error.message) ? error.message : 'Failed to load texture';
          console.log(message);
        }
      );
    }



  },
  //update: function () {},
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  remove: function() {
    this.el.removeEventListener('object3dset', this.applyMats.bind(this));
  },
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
