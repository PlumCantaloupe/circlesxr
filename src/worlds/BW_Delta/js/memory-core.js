AFRAME.registerComponent('memory-core', {
    schema: {
        modifier: {type: 'number', default: 1},
        minInput: {type: 'number', default: 2},
        maxInput: {type: 'number', default: 4},
        minOutput: {type: 'number', default: 0.1},
        maxOutput: {type: 'number', default: 0.3}
    },
    init: function () {
        const CONTEXT_AF = this;

        CONTEXT_AF.audioanalyserEl = document.querySelector('#audioanalyser-entity');

    },
    tick: function () {
        const {minInput, maxInput, minOutput, maxOutput} = this.data;

        const audioanalyser = this.audioanalyserEl.components.audioanalyser;
        const vol = audioanalyser.volume;

        const adjVol = 1 + this.mapToRange(vol, minInput, maxInput, minOutput, maxOutput);

        this.el.setAttribute('scale', {
            x: adjVol,
            y: adjVol,
            z: adjVol
        });

        //console.log(vol);
    },
    mapToRange: function (value, minA, maxA, minB, maxB) {
        // Reference: https://docs.arduino.cc/language-reference/en/functions/math/map/ 
        return (value - minA) * (maxB - minB) / (maxA - minA) + minB
    }
})