AFRAME.registerComponent('lazy-load-environment', {
  init: function () {
    const scene = document.querySelector('a-scene');
    scene.addEventListener('loaded', () => {
      const riaEnv = document.createElement('a-entity');
      riaEnv.setAttribute('gltf-model', '#ria_environment');
      riaEnv.setAttribute('position', '32.323 0.246 0');
      riaEnv.setAttribute('rotation', '0 90 0');
      riaEnv.setAttribute('scale', '5 5 5');
      riaEnv.setAttribute('visible', 'false');
      riaEnv.setAttribute('id', 'riaEnv');
      scene.appendChild(riaEnv);

      
    });
    
   
    const gameManager = document.querySelector('#GameManager');
    if (gameManager) {
      gameManager.addEventListener('painting-clicked', () => {
        const ocean = document.querySelector('#ocean');
        if (ocean) {
          ocean.setAttribute('circles-interactive-visible', 'true');
        }
      
        const riaEnv = document.querySelector('#riaEnv');
        if (riaEnv) {
          riaEnv.setAttribute('visible', 'true');
        }

      });
    }
  }
});
