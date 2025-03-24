AFRAME.registerComponent('ria-manager', {
    init: function () {
        this.logs = [];
        this.logsPlaced = 0;
        this.scene = this.el.sceneEl;
        this.pedestal = null;

        this.cabin = document.querySelector("#Cabin");


        // Wait for the red painting click event
        this.el.addEventListener('ria-painting-clicked', () => {
            this.startRaftTask();
        });

        this.el.addEventListener('ria-complete', () =>{
            this.spawnPortal();
        });

        this.el.addEventListener('return-clicked', () => {
            this.riaWorld = document.querySelector('riaWorld');
            this.environment = document.querySelector('#environment');
            riaWorld.setAttribute('visible', 'false');
            this.cabin.setAttribute('visible', 'true');
            this.environment.setAttribute('position', '0 -2.265 0');
            this.environment.setAttribute('environment', {
                preset: 'checkerboard',
                seed: 123,
                fog: 0.06,
                lightPosition: '-4.160 1 0',
                skyType: 'gradient',
                skyColor: '#0f0c14',
                horizonColor: '#000000',
                lighting: 'none',
                dressing: 'none'
            });

            console.log(this.environment);
        });
    },

    startRaftTask: function () {
        console.log('Starting Raft in Autumn task');
        this.spawnLogs();
        this.spawnPedestal();
        this.cabin.setAttribute('visible', 'false');
    },
   
    spawnLogs: function () {
        const riaWorld = document.querySelector('#riaWorld');
        const positions = [
            { x: 1, y: 1.23968, z: -8 },
            { x: -6, y: 1.779, z: 12 },
            { x: 11, y: 0.1, z: 4 },
            { x: -15, y: 2.431, z: 6.5 }
        ];

        const rotations = [
            { x: 0, y: 0, z: -11.141 },
            { x: 0, y: 0, z: -1.662 },
            { x: 0, y: 0, z: 4 },
            { x: 0, y: 0, z: -5.258 }
        ];

        positions.forEach((pos, index) => {
            let log = document.createElement('a-entity');
            log.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
            // log.setAttribute('geometry', 'primitive: cylinder; height: 1; radius: 0.2'); // Fixed typo
            log.setAttribute('id', `log${pos.x}`);
            log.setAttribute('gltf-model', `#logModel`);
            log.setAttribute('material', 'color: brown'); // Material needs to be separate
            log.setAttribute('class', 'interactable-log');
            log.setAttribute('circles-interactive-object', '');
            log.setAttribute('circles-pickup-networked', '');
            log.setAttribute('static-body', '');
            
            log.setAttribute('scale', '1 1 1'); // Scale down by half in all directions
            const rot = rotations[index];
            log.setAttribute('rotation', `${rot.x} ${rot.y} ${rot.z}`);

            riaWorld.appendChild(log);
            this.logs.push(log);
        });
    },

    spawnPedestal: function () {
        const riaWorld = document.querySelector('#riaWorld');
        this.pedestal = document.createElement('a-box');
        this.pedestal.setAttribute('id', 'raftPedestal');
        this.pedestal.setAttribute('position', '-0.876 1.741 -14.777');
        this.pedestal.setAttribute('width', '3');
        this.pedestal.setAttribute('height', '0.3');
        this.pedestal.setAttribute('depth', '3');
        this.pedestal.setAttribute('color', 'red');
        this.pedestal.setAttribute('pedestal-trigger', '');
    
        let raft = document.createElement('a-entity');
        raft.setAttribute('position', `-1.017 1.983 -14.995`);

        raft.setAttribute('id', `raft`);
        raft.setAttribute('gltf-model', `#Raft4`);
        raft.setAttribute('material', 'color: brown'); // Material needs to be separate
        
        raft.setAttribute('scale', '0.5 0.5 0.5'); // Scale down by half in all directions
        raft.setAttribute('rotation', '0 90 0');
        
        // Make it a physics trigger
        this.pedestal.setAttribute('dynamic-body', 'mass: 0;'); // A-Frame physics component
    
        riaWorld.appendChild(this.pedestal);
        riaWorld.appendChild(raft);

    },
    
    spawnPortal: function () {
        // Create the a-box element
        const riaWorld = document.querySelector('#riaWorld');
        let redPaint = document.createElement('a-box');
        redPaint.setAttribute('position', '-0.584 3.046 -18.700');
        redPaint.setAttribute('scale', '1 1.3 0.071');
        redPaint.setAttribute('rotation', '-15.487622160181282 -38.13320605493194 0.3472124238492789');
        redPaint.setAttribute('color', '#940000');
        redPaint.setAttribute('id', 'redPaint_return');
        redPaint.setAttribute('class', 'interactive');
        redPaint.setAttribute('circles-interactive-object', 'type:highlight');
        redPaint.setAttribute('environemntProp', 'preset: forest; groundYScale: 2.000; seed: 222; skyType: atmosphere; lighting: distant; dressing: none;');
        redPaint.setAttribute('painting-highlight', '');
        redPaint.setAttribute('material', 'color:#ffffff; src: #RIA; shader: standard; transparent: true; emissive: #ffffff; emissiveIntensity: 0;');

        // Create the a-entity element
        let painting3 = document.createElement('a-entity');
        painting3.setAttribute('id', 'painting3_return');
        painting3.setAttribute('scale', '20 20 20');
        painting3.setAttribute('gltf-model', '#painting_gltf');
        painting3.setAttribute('position', '-0.579 1.707 -18.683');
        painting3.setAttribute('rotation', '0 -130.53239080229443 0');

        let voteCounter = document.createElement('a-entity');
        voteCounter.setAttribute('id', 'voteCounter_redPaint_return');
        voteCounter.setAttribute('position', '0.89307 2.7 -4.2979');
        voteCounter.setAttribute('rotation', '-15.487622160181282 -38.13320605493194 0.3472124238492789');
        voteCounter.setAttribute('text', 'value: Votes: 0; align: center; color: white; width: 4');
    

        // Append elements to the scene
        riaWorld.appendChild(redPaint);
        riaWorld.appendChild(painting3);
    }
    
});

AFRAME.registerComponent('pedestal-trigger', {
    init: function () {
        this.logsPlaced = 0;
        this.maxLogs = 4;
        this.el = document.querySelector("#raftPedestal");
        this.raft = document.querySelector('#raft');
        const gameManager = document.querySelector('#GameManager');

        this.el.addEventListener('collide', (event) => {
            const log = event.detail.body.el;
            if (!log || !log.classList.contains('interactable-log')) return;


            // First, disable physics
            log.removeAttribute('dynamic-body');

            //Wait a frame before removing to let physics settle
            setTimeout(() => {
                if (log.parentNode) {
                    log.parentNode.removeChild(log);
                    this.logsPlaced++;
                    this.raft.setAttribute('gltf-model', `#Raft${this.logsPlaced}`);
                    

                    if (this.logsPlaced === this.maxLogs) {
                        console.log("Raft is complete!");
                        this.el.setAttribute('color', 'green');
                        gameManager.emit('ria-complete');
                    }
                }
            }, 0);
        });
    }
});

AFRAME.registerComponent('lazy-load-environment', {
    init: function () {
      const scene = document.querySelector('a-scene');
      const riaWorld = document.querySelector('#riaWorld');
      scene.addEventListener('loaded', () => {
        const riaEnv = document.createElement('a-entity');
        riaEnv.setAttribute('gltf-model', '#ria_environment');
        riaEnv.setAttribute('position', '32.323 0.246 0');
        riaEnv.setAttribute('rotation', '0 90 0');
        riaEnv.setAttribute('scale', '5 5 5');
        riaEnv.setAttribute('visible', 'false');
        riaEnv.setAttribute('id', 'riaEnv');
        riaWorld.appendChild(riaEnv);
  
        
      });
      
     
      const gameManager = document.querySelector('#GameManager');
      if (gameManager) {
        gameManager.addEventListener('ria-painting-clicked', () => {
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
  

