AFRAME.registerComponent('memory-core', {
    schema: {
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

        // Reference audioanalyser component
        const audioanalyser = this.audioanalyserEl.components.audioanalyser;
        const vol = audioanalyser.volume;

        // Scale the core by adding the mapped volume value to a base scale value of 1
        const adjVol = 1 + this.mapToRange(vol, minInput, maxInput, minOutput, maxOutput);

        this.el.object3D.scale.set(adjVol, adjVol, adjVol);
    },
    mapToRange: function (value, minA, maxA, minB, maxB) {
        // Reference: https://docs.arduino.cc/language-reference/en/functions/math/map/
        // Function maps from one range to another range
        return (value - minA) * (maxB - minB) / (maxA - minA) + minB
    }
})