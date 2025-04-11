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
        // Get the volume from the audioanalyser and get an adjusted value using the modifier
        const adjVol = vol * this.data.modifier;
        // Use adjusted value to change the object's opacity
        this.el.setAttribute('material', {opacity: adjVol});
    }
})