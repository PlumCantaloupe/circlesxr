AFRAME.registerComponent('ria-manager', {
    init: function () {
        this.logs = [];
        this.logsPlaced = 0;
        this.scene = this.el.sceneEl;
        this.pedestal = null;
        this.navmesh = document.querySelector("#nav-mesh");
        this.cabin = document.querySelector("#Cabin");

       /*  window.gameState = {
          RIAdone: false,
          blizzardDone: false
        }; */     

        // Wait for the red painting click event
        this.el.addEventListener('ria-painting-clicked', () => {
            this.startRaftTask();
            this.riaWorld = document.querySelector('#riaWorld');
            // this.navmesh.setAttribute("gltf-model", '#ria_navmesh');
            this.navmesh.setAttribute('position', '-6.614 2.162 -0.061');
            this.navmesh.setAttribute('rotation', '6.571 89.829 0.505');
            this.navmesh.setAttribute('scale', '295.198 0.087 33.998');
            this.navmesh.removeAttribute('nav-mesh');
            this.navmesh.setAttribute('nav-mesh', '');

            // this.navmesh.removeAttribute('geometry');
        });

        this.el.addEventListener('ria-complete', () =>{

            this.spawnPortal();
            gameState.RIAdone = true;
            let checklist = document.querySelector('#painting2_riaTask');
            checklist.setAttribute('text', {
              value: '- Raft In Autumn: Painting Restored!',
              color: 'green'
            });
        });

        this.el.addEventListener('return-clicked', () => {
            this.riaWorld = document.querySelector('#riaWorld');
            this.environment = document.querySelector('#environment');
            this.redPaint = document.querySelector('#redPaint');
            this.redPaint.setAttribute('material', 'src:#RIA')

            // Hide Ria world, show cabin
            this.riaWorld.setAttribute('visible', 'false');
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
        
            // Remove all logs from the scene
            this.logs.forEach(log => {
                if (log.parentNode) {
                    log.parentNode.removeChild(log);
                }
            });
            this.logs = []; // Clear the logs array
        
            // Remove pedestal and raft
            const pedestal = document.querySelector('#raftPedestal');
            if (pedestal && pedestal.parentNode) {
                pedestal.parentNode.removeChild(pedestal);
            }
        
            const raft = document.querySelector('#raft');
            if (raft && raft.parentNode) {
                raft.parentNode.removeChild(raft);
            }
        
            // Remove portal elements
            ['redPaint_return', 'painting3_return', 'voteCounter_redPaint_return'].forEach(id => {
                const element = document.querySelector(`#${id}`);
                if (element && element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });
        
            console.log("All spawned objects removed. Environment reset.");
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
        raft.setAttribute('gltf-model', `#Raft4_Gray`);
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
        let button = document.querySelector('#button');
        let redPaint = document.createElement('a-box');
        redPaint.setAttribute('position', '-0.584 3.046 -18.700');
        redPaint.setAttribute('scale', '1 1.3 0.071');
        redPaint.setAttribute('rotation', '-15.487622160181282 -38.13320605493194 0.3472124238492789');
        redPaint.setAttribute('color', '#940000');
        redPaint.setAttribute('id', 'redPaint_return');
        redPaint.setAttribute('class', 'interactive');
        redPaint.setAttribute('circles-interactive-object', 'type:highlight');
        redPaint.setAttribute('environemntProp', 'preset: forest; groundYScale: 0.000; seed: 222; skyType: atmosphere; lightPosition: 0 4.88 25; lighting: distant; dressing: none;');
        redPaint.setAttribute('painting-highlight', '');
        redPaint.setAttribute('material', 'color:#ffffff; src: #RIA; shader: standard; transparent: true; emissive: #ffffff; emissiveIntensity: 0;');

        button.setAttribute('position', '0.238 -0.36 0.195')

        // Create the a-entity element
        let painting3 = document.createElement('a-entity');
        painting3.setAttribute('id', 'painting3_return');
        painting3.setAttribute('scale', '20 20 20');
        painting3.setAttribute('gltf-model', '#painting_gltf');
        painting3.setAttribute('position', '-0.579 1.707 -18.683');
        painting3.setAttribute('rotation', '0 -130.53239080229443 0');

        if(painting3)
        {
          button.setAttribute('position', '0.238 -0.36 0.195');
        }
        else
        {
          button.setAttribute('position', '0.219 -0.387 0.030')
        }

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

AFRAME.registerComponent("pedestal-trigger", {
    init: function () {
      this.logsPlaced = 0;
      this.maxLogs = 4;
      this.el = document.querySelector("#raftPedestal");
      this.raft = document.querySelector("#raft");
      let gameManager = document.querySelector("#GameManager");
  
      // Ensure CONTEXT_AF exists
      window.CONTEXT_AF = window.CONTEXT_AF || {};
      CONTEXT_AF.raftEventName = "deleteLog_event";
      CONTEXT_AF.socket = null;
  
      // Helper function to update the raft model based on logsPlaced
      this.updateRaftModel = () => {
        switch (this.logsPlaced) {
          case 1:
            this.raft.setAttribute("gltf-model", "#Raft1");
            break;
          case 2:
            this.raft.setAttribute("gltf-model", "#Raft2");
            break;
          case 3:
            this.raft.setAttribute("gltf-model", "#Raft3");
            break;
          case 4:
            this.raft.setAttribute("gltf-model", "#Raft4");
            this.el.setAttribute("color", "green");
            console.log("Raft is complete!");
            gameManager.emit("ria-complete");
            break;
          default:
            break;
        }
        console.log("Local logs placed: " + this.logsPlaced);
      };
  
      // Create the networking system using CONTEXT_AF
      CONTEXT_AF.createNetworkingSystem = () => {
        CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
        console.warn(
          "Networking system ready. Socket ID: " +
            CONTEXT_AF.socket.id +
            " in room: " +
            CIRCLES.getCirclesGroupName() +
            " in world: " +
            CIRCLES.getCirclesWorldName()
        );
  
        // Local collision: update logsPlaced immediately, update model, then emit global update
        this.el.addEventListener("collide", (event) => {
          let log = event.detail.body.el;
          if (!log || !log.classList.contains("interactable-log")) return;
            
          log.emit('click');  

  
          // Let physics settle before removing the log element
          setTimeout(() => {
            if (log.parentNode) {
              log.parentNode.removeChild(log);
              // Update local count immediately
              this.logsPlaced++;
              this.updateRaftModel();
              // Emit the updated count globally
              CONTEXT_AF.socket.emit(CONTEXT_AF.raftEventName, {
                logsPlaced: this.logsPlaced,
                room: CIRCLES.getCirclesGroupName(),
                world: CIRCLES.getCirclesWorldName()
              });
            }
          }, 0);
        });
  
        // Listen for the global raft update events
        CONTEXT_AF.socket.on(CONTEXT_AF.raftEventName, (data) => {
          if (
            data.world === CIRCLES.getCirclesWorldName() &&
            data.room === CIRCLES.getCirclesGroupName()
          ) {
            // Only update if the incoming count is greater than the local value
            if (data.logsPlaced > this.logsPlaced) {
              this.logsPlaced = data.logsPlaced;
              this.updateRaftModel();
            }
            console.log("Global logs placed: " + data.logsPlaced);
          }
        });
  
        // Request data sync after a random delay (for late joiners)
        setTimeout(() => {
          CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {
            room: CIRCLES.getCirclesGroupName(),
            world: CIRCLES.getCirclesWorldName()
          });
        },1200);
  
        // When another client requests sync data, send your current logsPlaced value
        CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, (data) => {
          if (data.world === CIRCLES.getCirclesWorldName()) {
            CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {
              logsPlaced: this.logsPlaced,
              room: CIRCLES.getCirclesGroupName(),
              world: CIRCLES.getCirclesWorldName()
            });
          }
        });
  
        // Receive sync data from others
        CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, (data) => {
          if (data.world === CIRCLES.getCirclesWorldName()) {
            if (data.logsPlaced > this.logsPlaced) {
              this.logsPlaced = data.logsPlaced;
              this.updateRaftModel();
            }
          }
        });
      };
  
      // If the Circles websocket is ready, set up networking immediately; otherwise, wait for WS_CONNECTED event
      if (CIRCLES.isCirclesWebsocketReady()) {
        CONTEXT_AF.createNetworkingSystem();
      } else {
        let wsReadyFunc = () => {
          CONTEXT_AF.createNetworkingSystem();
          this.el.sceneEl.removeEventListener(
            CIRCLES.EVENTS.WS_CONNECTED,
            wsReadyFunc
          );
        };
        this.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
      }
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
  

