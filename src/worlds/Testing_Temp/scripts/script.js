
AFRAME.registerComponent('test', {
    schema: {
        particles: {type:'number', default:1.0},
    },
    init() {
        const CONTEXT_AF = this;
        const DATA = CONTEXT_AF.data;
    },
    update() {
        const CONTEXT_AF = this;
        const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet
    },
    remove() {},
    tick(time, timeDelta) {},
});