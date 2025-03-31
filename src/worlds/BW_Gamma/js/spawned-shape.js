// Component initialises the spawned shapes and set attributes
AFRAME.registerComponent('spawned-shape', {
    schema: {
        material: {default: ''},
        geometry: {default: ''},
        scale: {type: 'vec3'},
        spawnPos: {type: 'vec3'},
        rotationSpeed: {type: 'number', default: 0.006},
        lifetime: {type: 'number', default: 0},

    },
    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.scene = document.querySelector('a-scene');

        CONTEXT_AF.el.classList.add("spawnedObject")
        CONTEXT_AF.el.setAttribute("material", CONTEXT_AF.data.material)
        CONTEXT_AF.el.setAttribute("geometry", CONTEXT_AF.data.geometry)
        CONTEXT_AF.el.setAttribute("position", CONTEXT_AF.data.spawnPos),
        CONTEXT_AF.el.setAttribute("scale", CONTEXT_AF.data.scale)
        CONTEXT_AF.el.setAttribute("guess-shape", "")
        CONTEXT_AF.el.setAttribute("circles-interactive-object", "")
    }
})