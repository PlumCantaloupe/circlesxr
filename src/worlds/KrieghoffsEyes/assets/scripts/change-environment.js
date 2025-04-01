AFRAME.registerComponent('change-environment', {
    init: function () {
        const scene = document.querySelector('a-scene');
        const environment = scene.querySelector("#environment");
        const cabin = document.querySelector("#Cabin");
        const paintings = document.querySelectorAll(".interactive");
        const riaManager = document.querySelector("#GameManager");

        paintings.forEach(painting => {
            painting.addEventListener('click', function () {
                const newEnvironment = painting.getAttribute("environemntProp");
                if (newEnvironment) {
                    environment.setAttribute("environment", newEnvironment);
                    cabin.setAttribute('visible', 'false');
                }

                // Only activate RIAmanager if the red painting is clicked
                if (painting.id === "redPaint") {
                    riaManager.emit('painting-clicked');  // Trigger ria-manager
                }
            });
        });
    }
});
