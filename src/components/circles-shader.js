'use strict';

AFRAME.registerComponent('circles-shader',{
    schema: {
        enableShader: {type: 'boolean', default: false},
    },

    init: function(){
        // working similarly to circles-material

        // Can add texture building here so only one call needs to be made
        const CONTEXT_AF = this;

        CONTEXT_AF.shaderReady = false;
        CONTEXT_AF.wispMesh = null;
        CONTEXT_AF.el.addEventListener('model-loaded', function loader(e) {
            if (e.target !== CONTEXT_AF.el) return;
            if (CONTEXT_AF.wispMesh) {
                CONTEXT_AF.wispMesh.parent?.remove(CONTEXT_AF.wispMesh);
                CONTEXT_AF.wispMesh.material?.dispose();
                CONTEXT_AF.wispMesh = null;
            }
            
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
            if (node === CONTEXT_AF.wispMesh) return;

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
                shader.uniforms.uFresnelAmt = { value: 8.0};
                shader.uniforms.uFresnelOffset = { value: 0.0 };
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

            CONTEXT_AF.wispMesh = node.clone();
            CONTEXT_AF.wispMesh.scale.multiplyScalar(1.0);
            CONTEXT_AF.wispMesh.renderOrder = 2
            CONTEXT_AF.wispMesh.visible = false;
            node.parent.add(CONTEXT_AF.wispMesh);

        });
        CONTEXT_AF.shaderReady = true;
        CONTEXT_AF.el.emit('shader-ready');

    },

     createWisp: function (e){
            // https://blog.zero-one-group.com/creating-a-coffee-smoke-shader-with-three-js-and-glsl-a911ff99a880
            //  Copied the whispy coffee tendrils from here thought they would be a good fit, needed some changes to attach to body
            const textureLoader = new THREE.TextureLoader();
            const perlinTexture = textureLoader.load('/global/assets/textures/noiseTexture.png');
            perlinTexture.wrapS = THREE.RepeatWrapping;
            perlinTexture.wrapT = THREE.RepeatWrapping;

             return new THREE.ShaderMaterial({
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                uniforms: {
                    time: { value: 0.0 },
                    uPerlinTexture: { value: perlinTexture },
                    color: { value: new THREE.Color('#ffffff') },
                },
                vertexShader: `
                    uniform float time;
                    uniform sampler2D uPerlinTexture;
                    varying vec3 vWorldPos;
                    varying vec3 vNormal;
                    
            
                    void main() {
                        //vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
                        //gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
                        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    uniform float time;
                    varying vec3 vWorldPos;
                    uniform sampler2D uPerlinTexture;
                    uniform vec3 color;
                    varying vec3 vNormal;

                    void main() {

                        // Hit every world position so it doesn't freeze anywhere
                        vec2 smokeUvX = vWorldPos.yz * 0.3;
                        vec2 smokeUvY = vWorldPos.xz * 0.3;
                        vec2 smokeUvZ = vWorldPos.yx * 0.3;

                        // Randomize the timings a little bit to make the speed look more random

                        smokeUvZ.y -= 0.015 * time;
                        smokeUvZ.x -= 0.017 * time;

                        smokeUvX.y -= 0.012 * time;
                        smokeUvX.x -= 0.019 * time;

                        smokeUvY.x -= 0.018 * time;
                        smokeUvY.y -= 0.013 * time;


                        // Smoothing the edges around smoke
                        float smokeX = texture(uPerlinTexture, smokeUvX).r;
                        float smokeY = texture(uPerlinTexture, smokeUvY).r;
                        float smokeZ = texture(uPerlinTexture, smokeUvZ).r;


                        // Normalization technique + blending we are sending 2D --> 3D, we also want to normalize them all to 1 for smooth step to work correctly
                        vec3 smoke = abs(vNormal);
                        smoke = smoke / (smoke.x + smoke.y + smoke.z);
                        float wisp = smokeX * smoke.x + smokeY * smoke.y + smokeZ * smoke.z;


                        // Set the smooth step, constrast threshold operation anything below 0.4 is 0 above 0.95 is 0, gives us a way to create transparency
                        // was 0.4, 0.95
                        float wisps = smoothstep(0.4, 0.95, wisp);
                        gl_FragColor = vec4(color, wisps);

                    }`
            });
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
        const CONTEXT_AF = this;
        if (CONTEXT_AF.wispMesh && CONTEXT_AF.wispMesh.material && CONTEXT_AF.wispMesh.material.uniforms) {

            CONTEXT_AF.wispMesh.material.uniforms.time.value = time * 0.001;
        }
    },

    enable: function () {
        const CONTEXT_AF = this;

        if (!CONTEXT_AF.shaderReady) {
            CONTEXT_AF.el.addEventListener('shader-ready', () => CONTEXT_AF.enable(), { once: true });
            return;
        }

        //console.log('enable shader');
        const mesh = CONTEXT_AF.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            if (!node.isMesh) return;
            if (node == CONTEXT_AF.wispMesh) return;
            if (!node.userData.fresnelShader) return;
            node.material = node.userData.fresnelShader;
            node.material.needsUpdate = true;
            CONTEXT_AF.wispMesh.material = CONTEXT_AF.createWisp();
            CONTEXT_AF.wispMesh.visible = true;
        });
    },

    disable: function () {
        const CONTEXT_AF = this;
        if (!CONTEXT_AF.shaderReady) {
            CONTEXT_AF.el.addEventListener('shader-ready', () => CONTEXT_AF.disable(), { once: true });
            return;
        }
        
        
        CONTEXT_AF.wispMesh.visible = false;
        CONTEXT_AF.wispMesh.material.dispose();
        CONTEXT_AF.wispMesh.material = null;

        const mesh = CONTEXT_AF.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            if (!node.isMesh) return  
            if (node == CONTEXT_AF.wispMesh) return;
            if (!node.userData.original) return;
            console.log('turning normal');
            
            node.material = node.userData.original;
            node.material.needsUpdate = true;

        });
    },

    

});