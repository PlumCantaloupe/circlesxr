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
    const CONTEXT_AF = this;
    CONTEXT_AF.mapURL = null;

    CONTEXT_AF.loader = new THREE.TextureLoader();

    CONTEXT_AF.applyMats();
    CONTEXT_AF.el.addEventListener('object3dset', this.applyMats.bind(this));
  },
  update: function(oldData) {
    const CONTEXT_AF = this;
    const data = CONTEXT_AF.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.src !== data.src) && (data.src !== '') ) {
        CONTEXT_AF.mapURL  = (typeof CONTEXT_AF.data.src === 'string') ? CONTEXT_AF.data.src : CONTEXT_AF.data.src.getAttribute('src');
    }
  },
  applyMats : function () {
    const CONTEXT_AF = this;
    const mesh = CONTEXT_AF.el.getObject3D('mesh');
    if (!mesh) return;

    if ( CONTEXT_AF.mapURL === null ) {
      console.warn('No src defined in component');
      //just apply override without map
      CONTEXT_AF.applyShader(null);
    }
    else {
        CONTEXT_AF.loader.load( CONTEXT_AF.mapURL ,
            function onLoad(texture) {
                CONTEXT_AF.applyShader(texture);
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
        const CONTEXT_AF = this;
        const mesh = CONTEXT_AF.el.getObject3D('mesh');
        let customDepthMaterial = null;

        if (texture !== null) {
            texture.wrapS           = THREE.RepeatWrapping;
            texture.wrapT           = THREE.RepeatWrapping;
            if ( CONTEXT_AF.data.flipTextureY === true ) {
                texture.repeat.y =      -1;
            }
            if ( CONTEXT_AF.data.flipTextureX === true ) {
                texture.repeat.x =      -1;
            }

            if (CONTEXT_AF.data.transparent === true) {
                //https://stackoverflow.com/questions/43848330/three-js-shadows-cast-by-partially-transparent-mesh?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa\
                customDepthMaterial = new THREE.MeshDepthMaterial( {
                depthPacking:   THREE.RGBADepthPacking,
                map:            texture,
                alphaTest:      CONTEXT_AF.data.alphaTest
            });
            }
        }

        let newMaterial = null; 
        if (CONTEXT_AF.data.shader === 'flat') {
            newMaterial = new THREE.MeshBasicMaterial();
        }
        else if (CONTEXT_AF.data.shader === 'standard') {
            newMaterial = new THREE.MeshStandardMaterial();
        }
        else {
            //default to standard
            newMaterial = new THREE.MeshStandardMaterial();
        }

        let renderSide = null;
        if ( CONTEXT_AF.data.side === 'front' ) {
            renderSide = THREE.FrontSide;
        }
        else if ( CONTEXT_AF.data.side === 'back' ) {
            renderSide = THREE.BackSide;
        }
        else if (CONTEXT_AF.data.side === 'double') {
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

                if ( CONTEXT_AF.data.transparent === true) {
                    node.material.transparent   = CONTEXT_AF.data.transparent;
                    node.material.opacity       = CONTEXT_AF.data.opacity; 
                    node.material.alphaTest     = CONTEXT_AF.data.alphaTest;

                    if (texture !== null && CONTEXT_AF.data.transparent === true) {
                        node.customDepthMaterial = customDepthMaterial;
                        node.customDepthMaterial.needsUpdate = true;
                    }
                }
                node.material.needsUpdate               = true;
            });
        }

        CONTEXT_AF.el.emit(CIRCLES.EVENTS.CUSTOM_MAT_SET, false);
    }
});