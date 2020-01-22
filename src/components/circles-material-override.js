'use strict';

//UNFINISHED
AFRAME.registerComponent('circles-material-override', {
  schema: {
    src:            {type:'map',  default:''},
    alphaTest:      {type:'number', default:0.5},
    transparent:    {type:'boolean', default:false},
    opacity:        {type:'number', default:1.0},
    shader:         {type:'string', default:'standard', oneOf: ['standard', 'flat']},
    side:           {type:'string', default:'front', oneOf: ['front', 'back', 'double']},
    flipTextureY:   {type:'boolean', default:false},
    flipTextureX:   {type:'boolean', default:false}

    //TODO - this shader should replace the cutout material component (being a more general use-case)
  },
  init: function() {
    const Context_AF = this;
    Context_AF.mapURL = null;

    Context_AF.loader = new THREE.TextureLoader();

    Context_AF.applyMats();
    Context_AF.el.addEventListener('object3dset', this.applyMats.bind(this));
  },
  update: function(oldData) {
    const Context_AF = this;
    const data = Context_AF.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.src !== data.src) && (data.src !== '') ) {
        if ( data.src instanceof HTMLElement ) {
            Context_AF.mapURL = data.src.getAttribute('src');
        }
        else {
            Context_AF.mapURL = data.src;
        }
    }
  },
  applyMats : function () {
    const Context_AF = this;
    const mesh = Context_AF.el.getObject3D('mesh');
    if (!mesh) return;

    if ( Context_AF.mapURL === null ) {
      console.warn('No src defined in component');
      //just apply override without map
      Context_AF.applyShader(null);
    }
    else {
        Context_AF.loader.load( Context_AF.mapURL ,
            function onLoad(texture) {
                Context_AF.applyShader(texture);
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
    applyShader : function (texture) {
        const Context_AF = this;
        const mesh = Context_AF.el.getObject3D('mesh');
        let customDepthMaterial = null;

        if (texture !== null) {
            texture.wrapS           = THREE.RepeatWrapping;
            texture.wrapT           = THREE.RepeatWrapping;
            if ( Context_AF.data.flipTextureY === true ) {
                texture.repeat.y =      -1;
            }
            if ( Context_AF.data.flipTextureX === true ) {
                texture.repeat.x =      -1;
            }

            if (Context_AF.data.transparent === true) {
                //https://stackoverflow.com/questions/43848330/three-js-shadows-cast-by-partially-transparent-mesh?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa\
                customDepthMaterial = new THREE.MeshDepthMaterial( {
                depthPacking:   THREE.RGBADepthPacking,
                map:            texture,
                alphaTest:      Context_AF.data.alphaTest
            });
            }
        }

        let newMaterial = null; 
        if (Context_AF.data.shader === 'flat') {
            newMaterial = new THREE.MeshBasicMaterial();
        }
        else if (Context_AF.data.shader === 'standard') {
            newMaterial = new THREE.MeshStandardMaterial();
        }
        else {
            //default to standard
            newMaterial = new THREE.MeshStandardMaterial();
        }

        let renderSide = null;
        if ( Context_AF.data.side === 'front' ) {
            renderSide = THREE.FrontSide;
        }
        else if ( Context_AF.data.side === 'back' ) {
            renderSide = THREE.BackSide;
        }
        else if (Context_AF.data.side === 'double') {
            renderSide = THREE.DoubleSide;
        }
        else {
            //default to front
            renderSide = THREE.FrontSide;
        }

        if (mesh) {
            mesh.traverse(function (node) {
                node.material       = newMaterial;
                node.material.side  = renderSide;
                
                if (texture !== null) {
                    node.material.map       = texture;
                }

                if ( Context_AF.data.transparent === true) {
                    node.material.transparent   = Context_AF.data.transparent;
                    node.material.opacity       = Context_AF.data.opacity; 
                    node.material.alphaTest     = Context_AF.data.alphaTest;

                    if (texture !== null && Context_AF.data.transparent === true) {
                        node.customDepthMaterial = customDepthMaterial;
                        node.customDepthMaterial.needsUpdate = true;
                    }
                }
                node.material.needsUpdate               = true;
            });
        }

        Context_AF.el.emit(CIRCLES.EVENTS.CUSTOM_MAT_SET, false);
    }
});