'use strict';

AFRAME.registerComponent('circles-shader',{
    schema: {
    },

    init: function(){
        // working similarly to circles-material
        const CONTEXT_AF = this;
        //CONTEXT_AF.shadergroup = new THREE.Group();
        CONTEXT_AF.el.addEventListener('model-loaded', this.createRimLight.bind(this));
    },
    createRimLight: function (){
        const CONTEXT_AF = this;
        const mesh = CONTEXT_AF.el.getObject3D('mesh');

        if(!mesh) return;

        // https://threejs.org/docs/#Group
        // Create an Object3d group that mimicks our current models mesh
        //this.shadergroup = new THREE.Group();


        mesh.traverse(function (node) {
            if (!node.isMesh) return;

            node.userData.original = node.material;

            const newMaterial = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('rgb(255, 255, 255)'),
                transparent: true,
                opacity: 1.0,
                depthWrite: false,
                //side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
            });


            newMaterial.onBeforeCompile = (shader) => {
                console.log('onbeforecompile');
                shader.uniforms.uFresnelColor = { value: new THREE.Color('#02feff') };
                shader.uniforms.uBaseColor = { value: new THREE.Color('#0777fd') };
                shader.uniforms.uFresnelAmt = { value: 6.0};
                shader.uniforms.uFresnelOffset = { value: 0.1 };
                shader.uniforms.uFresnelIntensity = { value: 3.0 };
                shader.uniforms.uFresnelAlpha = { value: 0.8 };


                shader.fragmentShader = shader.fragmentShader.replace('#include <common>',

                    `
                    #include <common>
                    uniform vec3 uFresnelColor;
                    uniform vec3 uBaseColor;
                    uniform float uFresnelAmt;
                    uniform float uFresnelOffset;
                    uniform float uFresnelIntensity;
                    uniform float uFresnelAlpha;
                    varying vec3 vView;


                    float lambertLighting( vec3 normal, vec3 viewDirection )
                    {
                        return max( dot( normal, viewDirection ), 0.0 );
                    }

                    float fresnelFunc( float amount, float offset, vec3 normal, vec3 view)
                    {
                    return offset + ( 1.0 - offset ) * pow( 1.0 - dot( normal , view ), amount );
                    }`
                );



                
                shader.fragmentShader = shader.fragmentShader.replace('#include <fog_fragment>',
                    ` #include <fog_fragment>
                   
                    // fresnel color
                    // Only need the fresnel part, no point in having the under layer
                    float fresnel = fresnelFunc( uFresnelAmt, uFresnelOffset, normalize(vNormal), normalize(vView) );
                    vec3 fresnelColor = ( uFresnelColor * fresnel ) * uFresnelIntensity;

                    gl_FragColor = vec4(fresnelColor, fresnel);`);


                    
                shader.vertexShader = shader.vertexShader.replace('#include <common>',
                        `
                        #include <common>
                        varying vec3 vView;
                        `
                    );
       
                shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', 
                        `
                        #include <begin_vertex>
                        vec3 objectPosition = ( modelMatrix * vec4( position, 1.0 ) ).xyz; // object space coordinates
                        vView = normalize( cameraPosition - objectPosition ); // view direction in object space
                        vNormal = normalize( ( modelMatrix * vec4( normal, 0.0 ) ).xyz ); // normalized object space normals
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );`
                    );
        


            
                    newMaterial.userData.shader = shader;
            };

            newMaterial.renderOrder = 1;
            newMaterial.needsUpdate = true;
            node.userData.fresnelShader = newMaterial;
            // https://jsfiddle.net/Horsetopus/33623mpv/

        });
    },

    enable: function () {
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            if (!node.isMesh) return;
            if (!node.userData.fresnelShader) return;
            node.material = node.userData.fresnelShader;
        });
    },

    disable: function () {
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            if (!node.isMesh) return  
            if (!node.userData.original) return;
            node.material = node.userData.original;

        });
    },

});