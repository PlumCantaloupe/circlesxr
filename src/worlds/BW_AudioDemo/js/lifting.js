AFRAME.registerComponent('lifting', {
    schema: {
        moveSpeed: {type: 'number', default: 0.1}
    },
    init: function () {},
    tick: function () {
        const pos = this.el.getAttribute('position')
        this.el.setAttribute('position', {x: pos.x, y: pos.y + this.data.moveSpeed, z: pos.z})
    }
})