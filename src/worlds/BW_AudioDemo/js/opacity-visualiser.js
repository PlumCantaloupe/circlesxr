AFRAME.registerComponent('opacity-visualiser', {
    dependencies: ['audioanalyser'],
    schema: {
        modifier: {type: 'number', default: 0.01},

    },
    init: function () {
        const CONTEXT_AF = this;
    },
    tick: function () {
        const vol = this.el.components.audioanalyser.volume;
        const adjVol = vol * this.data.modifier;
        this.el.setAttribute('material', {opacity: adjVol})
    }
})