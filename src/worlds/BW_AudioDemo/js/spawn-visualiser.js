AFRAME.registerComponent('spawn-visualiser', {
    dependencies: ['audioanalyser'],
    schema: {
        maxSpawnCount: {type: 'number', default: 1},
        currentSpawnCount: {type: 'number', default: 0},
        beatType: {type: 'string', default: 'low'}
    },
    init: function () {
        const CONTEXT_AF = this;

        // On the detected beat tyoe, if the current spawn count is less than the max spawn count, then spawn new sphere with rnadom colour
        CONTEXT_AF.el.addEventListener(`audioanalyser-beat-${this.data.beatType}`, function () {
            if (CONTEXT_AF.data.currentSpawnCount < CONTEXT_AF.data.maxSpawnCount) {
                const newEl = document.createElement('a-entity');
                newEl.setAttribute('temp-lifetime', {});
                newEl.setAttribute('lifting', {});
                newEl.setAttribute('geometry', {
                    primitive: 'sphere',
                    radius: 0.5
                });
                newEl.setAttribute('material', {
                    color: '#' + new THREE.Color(Math.random(), Math.random(), Math.random()).getHexString()
                });
                newEl.setAttribute('position', CONTEXT_AF.el.object3D.position);
    
                CONTEXT_AF.el.sceneEl.appendChild(newEl);
            } else {
                console.log('Too many spawned objects; wait for some to be destroyed.');
            }
        })
    }
})

// https://github.com/ryota-mitarai/aframe-audio-analyser/blob/master/examples/components/color-on-beat.js