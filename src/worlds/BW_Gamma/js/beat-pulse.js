AFRAME.registerComponent('beat-pulse', {
    schema: {
        minInput: {type: 'number', default: 2},
        maxInput: {type: 'number', default: 4},
        minOutput: {type: 'number', default: 0.01},
        maxOutput: {type: 'number', default: 0.015}
    },
    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.audioanalyserEl = document.querySelector('#audioanalyser-entity');

        // Set the initial scale of the object to refer to for future scaling
        CONTEXT_AF.initScale = {...CONTEXT_AF.el.object3D.scale};
    },
    tick: function () {
        const {data: {minInput, maxInput, minOutput, maxOutput}, initScale} = this;

        // Reference audioanalyser component
        const audioanalyser = this.audioanalyserEl?.components?.audioanalyser;

        // If undefined, return and skip setting the scale
        if (!audioanalyser) return
        const vol = audioanalyser.volume;

        // Map the volume input to an acceptable range for the scaling visualisation
        const adjVol = this.mapToRange(vol, minInput, maxInput, minOutput, maxOutput);
        // Add the adjusted vol to the initial scale
        const adjScale = {x: initScale.x + adjVol, y: initScale.y + adjVol, z: initScale.z + adjVol};

        this.el.object3D.scale.set(adjScale.x, adjScale.y, adjScale.z);
    },
    mapToRange: function (value, minA, maxA, minB, maxB) {
        // Reference: https://docs.arduino.cc/language-reference/en/functions/math/map/ 
        // Function maps from one range to another range
        return (value - minA) * (maxB - minB) / (maxA - minA) + minB
    }
})