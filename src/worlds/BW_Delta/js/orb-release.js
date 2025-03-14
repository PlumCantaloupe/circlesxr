AFRAME.registerComponent('orb-release', {
    schema: {
        duration: {type: 'int', default: 9000},
        clipNum: {type: 'number', default: 30},
    },
    init: function () {
        const CONTEXT_AF = this;

        CONTEXT_AF.orbs = document.querySelectorAll('.orb'); 
        CONTEXT_AF.orb1 = document.querySelector('#orboutside1'); 
        CONTEXT_AF.releasebtn = document.querySelector('#release_control'); 

        CONTEXT_AF.sound = new Audio('path/to/sound.mp3'); // Load sound

        CONTEXT_AF.orbs.forEach(orb => {
            orb.addEventListener('click', function () { //id = release_control but its a general for all, get the held entity and
                console.log("wow disappearing");
                CONTEXT_AF.playParticles(orb);
                CONTEXT_AF.playAnimation(orb);
                setTimeout(() =>{
                    orb.setAttribute('circles-interactive-visible', "false")
                }, CONTEXT_AF.data.duration);
                //playSound(Math.floor(Math.random() * CONTEXT_AF.data.clipNum) + 1);
            });
        }
    )},
    
    tick: function(){
        const CONTEXT_AF = this;

        //add the tube spawned orbs into the clickable orbs
        CONTEXT_AF.orbs = document.querySelectorAll('.orb'); 

        //add new event listeners to the newly added orbs in context_af.orbs
        CONTEXT_AF.orbs.forEach(orb => {
            if (!orb.dataset.hasClickListener) { 
                orb.dataset.hasClickListener = true;
                orb.addEventListener('click', function () {
                    console.log("peepeepoopoo");
                    CONTEXT_AF.playParticles(orb);
                    CONTEXT_AF.playAnimation(orb);
                    setTimeout(() => {
                        orb.setAttribute('circles-interactive-visible', "false");
                    }, CONTEXT_AF.data.duration);
                });
            }
        });
    },

    playParticles: function (orb) {
        const CONTEXT_AF = this;

        const particleSystem = document.createElement('a-entity');
        particleSystem.setAttribute('particle-system', "preset: dust; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; positionSpread: 0.7 0.5 0.7; maxAge:2.5,blending: 3; dragValue: 1; velocityValue: 0 0.5 0; size: 0.1; sizeSpread: 0.3; duration: 9000; particleCount: 150");
        particleSystem.setAttribute('position', '0 -0.2 0');
        particleSystem.setAttribute('rotation', '0 90 136');
        orb.appendChild(particleSystem);
        setTimeout(() => particleSystem.remove(),  CONTEXT_AF.data.duration + 2000);
    },

    playAnimation: function (orb) {
        orb.setAttribute('animation', {
        property: 'opacity',
        to: '0',
        dur: 9000,
        });
    },

    playSound: function (soundNum) {
        const CONTEXT_AF = this;
        CONTEXT_AF[`clip${soundNum}`].components.sound.playSound();
    },

});