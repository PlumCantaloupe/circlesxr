AFRAME.registerComponent('synth-note', {
    schema: {
        note: {type: 'string', default: 'C4'},
        duration: {type: 'string', default: '8n'}
    },
    init: function () {
        const CONTEXT_AF = this;

        CONTEXT_AF.el.addEventListener('click', function () {
            // create a synth
            const synth = new Tone.Synth().toDestination();
            // play a note from that synth
            synth.triggerAttackRelease(CONTEXT_AF.data.note, CONTEXT_AF.data.duration);
        })
    }
})