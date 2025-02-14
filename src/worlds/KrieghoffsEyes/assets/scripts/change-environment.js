AFRAME.registerComponent('change-environment', {
    init: function () {
        const scene = document.querySelector('a-scene');
        const environment = scene.querySelector("#environment");

        const paintings = document.querySelectorAll(".interactive");

        paintings.forEach(painting => {
            painting.addEventListener('click', function () {
                const newEnvironment = painting.getAttribute("environemntProp");
                if (newEnvironment) {
                    environment.setAttribute("environment", newEnvironment);
                }
            });
        });
    }
});
