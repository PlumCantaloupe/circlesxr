// NOTE!!: There needs to be a material on the model before we "extend" it. 
// A gltf likely has one, but make sure if manually defining that the "material" attribute is listed before this component
// also note that this component will probably not work with materials that are not MeshStandardMaterial ...

'use strict';

AFRAME.registerComponent('circles-material-extend-fresnel', {
  schema: {
    fresnelPow:       {type:'number',   default:1.0},
    fresnelOpacity:   {type:'number',   default:1.0},
    fresnelColor:     {type:'color',    default:'rgb(255,255,255)'},
    debug:            {type:'boolean',  default:false}
  },
  init: function() {
    const CONTEXT_AF = this;
    CONTEXT_AF.newMaterial = null;
    CONTEXT_AF.originalVertShader = null;
    CONTEXT_AF.originalFragShader = null;

    CONTEXT_AF.applyShader();
    CONTEXT_AF.el.addEventListener('object3dset', this.applyShader.bind(this));
    
    //fresnel shader: https://codepen.io/Fyrestar/pen/WNjXqXv
    //extending MeshStandardMaterial: https://stackoverflow.com/questions/64560154/applying-color-gradient-to-material-by-extending-three-js-material-class-with-on
    CONTEXT_AF.uniforms = {
      fresnelPow:     {value: CONTEXT_AF.data.fresnelPow},
      fresnelOpacity: {value: CONTEXT_AF.data.fresnelOpacity},
      fresnelColor:   {value: new THREE.Color(CONTEXT_AF.data.fresnelColor)}
    }
  },
  update: function(oldData)  {
    const CONTEXT_AF  = this;
    const data = CONTEXT_AF.data;
    
    if (CONTEXT_AF.uniforms) {
      if ( (oldData.fresnelPow !== data.fresnelPow) && (data.fresnelPow !== '') ) {
        CONTEXT_AF.uniforms.fresnelPow.value = data.fresnelPow;
      }

      if ( (oldData.fresnelOpacity !== data.fresnelOpacity) && (data.fresnelOpacity !== '') ) {
        CONTEXT_AF.uniforms.fresnelOpacity.value = data.fresnelOpacity;
      }

      if ( (oldData.fresnelColor !== data.fresnelColor) && (data.fresnelColor !== '') ) {
        CONTEXT_AF.uniforms.fresnelColor.value = new THREE.Color(data.fresnelColor);
      }
    }
  },
  applyShader : function () {  
    const CONTEXT_AF = this;
    const mesh = CONTEXT_AF.el.getObject3D('mesh');
    
    if (!mesh) {
      if (CONTEXT_AF.data.debug === true) {
        console.warn('DEBUG ON [circles-material-extend-fresnel]: circles-material-extend-fresnel can only be added to an entity containing a 3D mesh');
      }
      return;
    }
    
    let foundMatNode = false;
    //this node traversal is necessary to work on gltf models as there may be more than one mesh
    mesh.traverse(function (node) {
      if (node.material) {
        foundMatNode = true;

        if (node.material.isMeshStandardMaterial) {
          CONTEXT_AF.extendStandardMat(node.material); 
        }
        else {
          if (CONTEXT_AF.data.debug === true) {
            console.warn('DEBUG ON [circles-material-extend-fresnel]: can only extend MeshStandardMaterial, so no fresnel added');
          }
        }
      }
    });
    
    if (!foundMatNode) {
      if (CONTEXT_AF.data.debug === true) {
        console.warn('DEBUG ON [circles-material-extend-fresnel]: no material (maybe just an a-frame primitive), so trying to add one');
      }

      CONTEXT_AF.el.setAttribute('material', {shader:'standard'});
      CONTEXT_AF.extendStandardMat(mesh.material);
    }
  },
  extendStandardMat: function(material) {
    const CONTEXT_AF = this;
    
    if (!material) {
      if (CONTEXT_AF.data.debug === true) {
        console.warn('DEBUG ON [circles-material-extend-fresnel]: add a material first before calling "extendStandardMat"');
      }
    }
    
     material.onBeforeCompile = (shader, renderer) => {
      shader.uniforms.fresnelPow      = CONTEXT_AF.uniforms.fresnelPow;
      shader.uniforms.fresnelOpacity  = CONTEXT_AF.uniforms.fresnelOpacity;
      shader.uniforms.fresnelColor    = CONTEXT_AF.uniforms.fresnelColor;

      CONTEXT_AF.originalVertShader = shader.vertexShader;
      CONTEXT_AF.originalFragShader = shader.fragmentShader;

      shader.vertexShader = `
        varying vec3 vNormalW;
        varying vec3 vPositionW;

        ${shader.vertexShader}
      `.replace(
      `#include <fog_vertex>`,`
        #include <fog_vertex>

        vNormalW = normalize(vec3(modelMatrix * vec4( normal, 0.0 )));
        vPositionW = vec3(modelMatrix * vec4(position, 1.0));
      `);
      shader.fragmentShader = `
         varying vec3   vNormalW;
         varying vec3   vPositionW;

         uniform float  fresnelPow;
         uniform float  fresnelOpacity;
         uniform vec3   fresnelColor;

        ${shader.fragmentShader}
       `.replace(
        `#include <dithering_fragment>`,`
         #include <dithering_fragment>

         if(abs(fresnelOpacity) > 0.0001) {
           vec3 vDirectionW = normalize(cameraPosition - vPositionW);
           float fresnelTerm = dot(vDirectionW, vNormalW);
           fresnelTerm = clamp(1.0 - fresnelTerm, 0.0, 1.0);
           fresnelTerm = pow(fresnelTerm, fresnelPow);

           gl_FragColor.rgb +=  ((fresnelTerm * fresnelColor) * fresnelOpacity);
         }
      `);
      // console.log(shader.vertexShader);
      // console.log(shader.fragmentShader);
    }
    
    material.needsUpdate = true;  //need to force a re-compile of shader to take in new fresnel code
  },
  resetExtendedMaterial : function() {
    const CONTEXT_AF = this;
    const mesh = CONTEXT_AF.el.getObject3D('mesh');
    
    if (!mesh) {
      if (CONTEXT_AF.data.debug === true) {
        console.warn('DEBUG ON [circles-material-extend-fresnel]: can only add/remove materials to an entity containing a 3D mesh');
      }
      return;
    }

    mesh.traverse(function (node) {
      if (node.material) {
        node.material.onBeforeCompile = (shader, renderer) => {
          if (shader.uniforms.fresnelPow) {
            shader.uniforms.fresnelPow      = null;
          }

          if (shader.uniforms.fresnelOpacity ) {
            shader.uniforms.fresnelOpacity  = null;
          }

          if (shader.uniforms.fresnelColor ) {
            shader.uniforms.fresnelColor  = null;
          }
    
          shader.vertexShader = CONTEXT_AF.originalVertShader;
          shader.fragmentShader = CONTEXT_AF.originalFragShader;

          // console.log(shader.vertexShader);
          // console.log(shader.fragmentShader);
        }
        
        node.material.needsUpdate = true;  //need to force a re-compile of shader to take in new (original) shader code
      }
    });
  },
  remove : function() {
    this.resetExtendedMaterial();
  }
});