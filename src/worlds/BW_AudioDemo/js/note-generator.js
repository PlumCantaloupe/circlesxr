AFRAME.registerComponent('note-generator', {
    init: function () {
        const CONTEXT_AF = this;

        const listener = new THREE.AudioListener();
        const sound = new THREE.Audio(listener);

        CONTEXT_AF.audio = sound;
        // CONTEXT_AF.el.add(listener);

        const audioLoader = new THREE.AudioLoader();
        audioLoader.load('assets/sounds/test_feb21.wav', function (buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(true);
            sound.play();
        })
    },
    tick: function () {
        // console.log(this.audio)
    }
})