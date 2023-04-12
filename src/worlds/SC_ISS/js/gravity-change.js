// let currentGravityStrength = 1;

AFRAME.registerComponent('gravity-change', {
    schema: {
        direction: {type: 'string', default:'down'}
    },
    init() {
        const Context_AF = this;
        let sceneEl = document.querySelector('a-scene');
        let person = CIRCLES.getAvatarRigElement();

        Context_AF.el.addEventListener('click', function() {
            if(Context_AF.data.direction == 'up'){
                // update the physics system
                person.setAttribute("rotation", '0 0 180');
                console.log(person.getAttribute('rotation'));
            }
            else {
                person.setAttribute("rotation", '0 0 0');
                console.log(person.getAttribute('rotation'));

            }
        });
        // Context_AF.el.addEventListener('click', function() {
        //     if(Context_AF.data.direction == 'up'){
        //         // update the physics system
        //         sceneEl.systems.physics.driver.world.gravity.y = 9.8
        //         console.log(sceneEl.systems.physics.driver.world.gravity.y);
        //     }
        //     else {
        //         sceneEl.systems.physics.driver.world.gravity.y = -9.8
        //         console.log(sceneEl.systems.physics.driver.world.gravity.y);

        //     }
        // });
        
    },
    update() {},
    toggleLight : function (lightElem, playSound) {
        lightElem.lightOn = !lightElem.lightOn;

        let emissiveIntensity = (lightElem.lightOn ) ? 6.0 : 0.0;
        let lightIntensity = (lightElem.lightOn ) ? 15.0 : 5.0;

        lightElem.setAttribute('material', {emissiveIntensity:emissiveIntensity});
        lightElem.querySelector('[light]').setAttribute('light', {intensity:lightIntensity});

        //play sound (if another client turned on so we can make music together :)
        if (lightElem.components['circles-interactive-object'].sound && playSound === true) {
            lightElem.components['circles-interactive-object'].sound.stopSound();
            lightElem.components['circles-interactive-object'].sound.playSound();
        }
    }
});