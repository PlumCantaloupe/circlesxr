
(() => {

    const VERTEX = `
    precision highp float;

    #define PI 3.1415926535897932384626433832795

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    uniform float time;
    uniform float size;
    
    attribute vec3 position;
    attribute vec3 direction;
    attribute float offset;

    varying vec3 vUv;

    void main() {
        float sawTime = mod(time * offset, PI);
        float sineTime = (sawTime * abs(sin(time * offset)));

        vec3 timeVec = vec3(sineTime, sawTime, sineTime);

        vUv = ((normalize(position) * 0.2) + (timeVec * direction)) * size;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( vUv, 1.0 );
    }
    `;

    const FRAGMENT = `
    precision highp float;
    uniform float time;
    uniform float yMax;

    varying vec3 vUv;

    float random(vec2 ab) {
        float f = (cos(dot(ab ,vec2(21.9898,78.233))) * 43758.5453);
        return fract(f);
    }

    void main() {
        float alpha = (yMax - vUv.y) * 0.8;
        float red = 1.0;
        float green = 0.3 + (0.7 * mix(((yMax - vUv.y) * 0.5) + 0.5, 0.5 - abs(max(vUv.x, vUv.y)), 0.5));
        float blueMin = abs(max(max(vUv.x, vUv.z), (vUv.y / yMax)));
        float blue = (1.0 / (blueMin + 0.5)) - 1.0;

        gl_FragColor = vec4(red, green, blue, alpha);
    }
    `;

    const createSparks = (count) => {
        const positions = [];
        const directions = [];
        const offsets = [];
        const verticesCount = count * 3;

        for (let i = 0; i < count; i += 1) {
            const direction = [
                Math.random() - 0.5,
                (Math.random() + 0.3),
                Math.random() - 0.5];
            const offset = Math.random() * Math.PI;

            const xFactor = 1;
            const zFactor = 1;

            for (let j = 0; j < 3; j += 1) {
                const x = Math.random() - 0.5;
                const y = Math.random() - 0.2;
                const z = Math.random() - 0.5;

                positions.push(x, y, z);
                directions.push(...direction);
                offsets.push(offset);
            }
        }

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('direction', new THREE.Float32BufferAttribute(directions, 3));
        geometry.setAttribute('offset', new THREE.Float32BufferAttribute(offsets, 1));

        return geometry;
    };

    AFRAME.registerComponent('fire', {
        schema: {
            particles: {
                type: 'number',
                default: 1
            },
            size: {
                type: 'number',
                default: 0.5,
            },
        },
        init() {
            const size = this.data.size;

            this.material = new THREE.RawShaderMaterial({
                uniforms: {
                    time: { value: 0.0 },
                    size: { value: size },
                    yMax: { value: 0.3 + Math.PI * size },
                },
                vertexShader: VERTEX,
                fragmentShader: FRAGMENT,
                side: THREE.DoubleSide,
                transparent: true,
            });

            this.object3D = new THREE.Object3D();
            this.el.setObject3D('mesh', this.object3D);
        },
        update() {
            const data = this.data;
            const size = data.size;

            if (this.mesh) {
                this.object3D.remove(this.mesh);
            }

            this.material.uniforms.size.value = size;

            const geometry = createSparks(data.particles);
            this.mesh = new THREE.Mesh(geometry, this.material);

            this.object3D.add(this.mesh);
        },
        remove() {
            const curr = this.el.getObject3D('mesh')
            if (curr) {
                this.object3D.remove(curr);
            }
        },
        tick(time) {
            this.material.uniforms.time.value = time * 0.0005;
        },
    });

})();