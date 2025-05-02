// Function creates toruses that expand outwards for a set lifetime of 300
AFRAME.registerComponent('ring-visualiser', {
    schema: {
        lifetime: {type: 'number', default: 0},
        timeLimit: {type: 'number', default: 300}
    },
    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.toruses = [];

        CONTEXT_AF.analyserEl = document.querySelector('#audioanalyser-entity');
        CONTEXT_AF.sceneEl = document.querySelector('a-scene');
        CONTEXT_AF.torusSpawn(CONTEXT_AF);
    },
    tick: function () {
        const CONTEXT_AF = this;
        // Update lifetime of the entity to track whether to remove it or not
        CONTEXT_AF.data.lifetime++;

        const {toruses} = CONTEXT_AF;

        // If no toruses exist, skip updates
        if (!toruses) return

        // Loop through all toruses and update them
        for (let i = 0; i < toruses.length; i++) {
            const ringEl = toruses[i];
            const rad = ringEl.getAttribute('radius');
            // Increase the radius over time
            ringEl.setAttribute('radius', parseFloat(rad) + 0.01);

            // remove when lifetime is exceeded
            if (CONTEXT_AF.data.lifetime > CONTEXT_AF.data.timeLimit) {
                CONTEXT_AF.el.parentNode.removeChild(CONTEXT_AF.el);
            }
        }
    },
    torusSpawn: function (context) {
        // Create a torus
        const ringEl = document.createElement('a-torus');
        ringEl.classList.add('ring-visual');
        ringEl.setAttribute('radius', 0.1);
        ringEl.setAttribute('radius-tubular', 0.1);
        ringEl.setAttribute('color', 'white');
        ringEl.setAttribute('opacity', '1.0');
        ringEl.setAttribute('transparent', true);
        context.el.appendChild(ringEl);
        
        // Copy toruses array and add ringEl
        context.toruses = [...context.toruses, ringEl];
    }
});