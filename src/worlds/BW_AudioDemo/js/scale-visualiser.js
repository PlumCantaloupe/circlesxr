AFRAME.registerComponent('scale-visualiser', {
    dependencies: ['audioanalyser'],
    schema: {
        modifier: {type: 'number', default: 1},
        minSize: {type: 'number', default: 1},
        maxSize: {type: 'number', default: 5}
    },
    init: function () {
        const CONTEXT_AF = this;
    },
    tick: function () {
        const vol = this.el.components.audioanalyser.volume;
        // const adjVol = Math.min(this.data.maxSize, Math.max(this.data.minSize, vol * this.data.modifier));
        const adjVol = Math.min(vol * this.data.modifier, this.data.maxSize);

        this.el.setAttribute('scale', {
            x: adjVol,
            y: adjVol,
            z: adjVol
        })
    }
})