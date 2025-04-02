AFRAME.registerComponent('transform-visualiser', {
    dependencies: ['audioanalyser'],
    schema: {
        modifier: {type: 'number', default: 1},
        maxDistance: {type: 'number', default: 5}
    },
    init: function () {
        const CONTEXT_AF = this;
    },
    tick: function () {
        const vol = this.el.components.audioanalyser.volume;
    }
})