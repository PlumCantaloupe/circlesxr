'use strict';

AFRAME.registerComponent('circles-shader',{
    schema: {
        enableShader: {type: 'boolean', default: false},
    },

    init: function(){
        // working similarly to circles-material
        const CONTEXT_AF = this;
        CONTEXT_AF.shaderReady = false;
        CONTEXT_AF.wispMesh = null;
        CONTEXT_AF.wispMaterial = null;
        CONTEXT_AF.el.addEventListener('model-loaded', function loader() {
            CONTEXT_AF.createRimLight()
        });
    },


    createRimLight: function (e){
        //console.log('create rimlight')
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
            newMaterial.needsUpdate = true;


            newMaterial.onBeforeCompile = (shader) => {
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


            // https://blog.zero-one-group.com/creating-a-coffee-smoke-shader-with-three-js-and-glsl-a911ff99a880
            //  Copied the whispy coffee tendrils from here thought they would be a good fit, needed some changes to attach to body
            CONTEXT_AF.wispMesh = node.clone();
            CONTEXT_AF.wispMesh.scale.multiplyScalar(1.02);
            const textureLoader = new THREE.TextureLoader();
            const perlinTexture = textureLoader.load('/global/assets/textures/noiseTexture.png');
            perlinTexture.wrapS = THREE.RepeatWrapping;
            perlinTexture.wrapT = THREE.RepeatWrapping;

            CONTEXT_AF.wispMaterial = new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    time: { value: 0.0 },
                    uPerlinTexture: { value: perlinTexture },
                    color: { value: new THREE.Color('#02feff') },
                },
                vertexShader: `
                    uniform float time;
                    uniform sampler2D uPerlinTexture;
                    varying vec3 vWorldPos;
                    
            
                    void main() {
                        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    varying vec3 vWorldPos;
                    uniform sampler2D uPerlinTexture;
                    uniform vec3 color;

                    void main() {
                        vec2 smokeUv = vWorldPos.xy;
                        smokeUv.x *= 0.5;
                        smokeUv.y *= 0.3;
                        smokeUv.y -= time * 0.05;

                        // Smoothing the edges around smoke
                        float smoke = texture(uPerlinTexture, smokeUv).r;
                        smoke = smoothstep(0.4, 1.0, smoke);

                        // Color the saders, parameter is RGB and Material
                        gl_FragColor = vec4(color, smoke);
                    }`
            });
            CONTEXT_AF.wispMesh.material = CONTEXT_AF.wispMaterial;
            CONTEXT_AF.wispMesh.renderOrder = 2
            CONTEXT_AF.wispMesh.visible = true;
            node.parent.add(CONTEXT_AF.wispMesh);




        });
        CONTEXT_AF.shaderReady = true;
        CONTEXT_AF.el.emit('shader-ready');
    },

    update(oldData){
        const CONTEXT_AF = this;

        if (CONTEXT_AF.data.enableShader === oldData.enableShader) return;
        console.log('Changing shader');

        if (CONTEXT_AF.data.enableShader){
            CONTEXT_AF.enable();
        } else {
            CONTEXT_AF.disable();
        }
    },

    tick(time) {
        if (this.wispMaterial) {
            this.wispMaterial.uniforms.time.value = time * 0.001;
        }
    },

    enable: function () {

        if (!this.shaderReady) {
            this.el.addEventListener('shader-ready', () => this.enable(), { once: true });
            return;
        }

        //console.log('enable shader');
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            if (!node.isMesh) return;
            if (!node.userData.fresnelShader) return;
            this.wispMesh.visible = true;
            node.material = node.userData.fresnelShader;
            node.material.needsUpdate = true;
        });
    },

    disable: function () {
        if (!this.shaderReady) {
            this.el.addEventListener('shader-ready', () => this.disable(), { once: true });
            return;
        }
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            if (!node.isMesh) return  
            if (!node.userData.original) return;
            this.wispMesh.visible = false;
            node.material = node.userData.original;
            node.material.needsUpdate = true;

        });
    },

    

});