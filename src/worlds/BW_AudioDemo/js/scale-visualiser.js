AFRAME.registerComponent('scale-visualiser', {
    dependencies: ['audioanalyser'],
    schema: {
        modifier: {type: 'number', default: 1},
        maxSize: {type: 'number', default: 5}
    },
    tick: function () {
        const vol = this.el.components.audioanalyser.volume;
        // Get volume from the audioanalyser component and adjust the volume
        const adjVol = Math.min(vol * this.data.modifier, this.data.maxSize);

        // Scale the object according to the adjust volume
        this.el.setAttribute('scale', {
            x: adjVol,
            y: adjVol,
            z: adjVol
        })
    }
})