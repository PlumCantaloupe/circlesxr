AFRAME.registerComponent('open-door', {
    init: () => {
        const exitDoor = document.querySelector("#exit_door");
        const btn = document.querySelector("#exit_button");

        btn.addEventListener('click', () => {
            exitDoor.setAttribute('animation', {
                property: 'position',
                dur: 2000,
                from: "-7 2 0",
                to: "-7 6 0"
            });
        });
    }
});