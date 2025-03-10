AFRAME.registerComponent('spawn-visualiser', {
    dependencies: ['audioanalyser'],
    schema: {
        maxSpawnCount: {type: 'number', default: 1},
        currentSpawnCount: {type: 'number', default: 0},
        beatType: {type: 'string', default: 'low'}
    },
    init: function () {
        const CONTEXT_AF = this;

        CONTEXT_AF.el.addEventListener(`audioanalyser-beat-${this.data.beatType}`, function () {
            if (CONTEXT_AF.data.currentSpawnCount < CONTEXT_AF.data.maxSpawnCount) {
                const newEl = document.createElement('a-entity');
                newEl.setAttribute('temp-lifetime', {})
                newEl.setAttribute('lifting', {})
                newEl.setAttribute('geometry', {
                    primitive: 'sphere',
                    radius: 0.5
                })
                newEl.setAttribute('material', {
                    color: '#' + new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString()
                })
                newEl.setAttribute('position', CONTEXT_AF.el.object3D.position);
    
                CONTEXT_AF.el.sceneEl.appendChild(newEl);
            } else {
                console.log('Too many spawned objects; wait for some to be destroyed.');s
            }
        })
    },
    tick: function () {
        const vol = this.el.components.audioanalyser.volume;

    }
})

// https://github.com/ryota-mitarai/aframe-audio-analyser/blob/master/examples/components/color-on-beat.js