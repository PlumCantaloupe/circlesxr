AFRAME.registerComponent('ria-manager', {
    init: function () {
        this.logs = [];
        this.logsPlaced = 0;
        this.scene = this.el.sceneEl;
        this.pedestal = null;

        // Wait for the red painting click event
        this.el.addEventListener('painting-clicked', () => {
            this.startRaftTask();
        });
    },

    startRaftTask: function () {
        console.log('Starting Raft in Autumn task');
        this.spawnLogs();
        this.spawnPedestal();
    },

    spawnLogs: function () {
        const positions = [
            { x: 22, y: .1, z: -3 },
            { x: 23, y: 0.1, z: -2 },
            { x: 21, y: 0.1, z: 2 },
            { x: 24, y: 0.1, z: 3 }
        ];

        positions.forEach(pos => {
            let log = document.createElement('a-entity');
            log.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
            // log.setAttribute('geometry', 'primitive: cylinder; height: 1; radius: 0.2'); // Fixed typo
            log.setAttribute('id', `log${pos.x}`);
            log.setAttribute('gltf-model', `#logModel`);
            log.setAttribute('material', 'color: brown'); // Material needs to be separate
            log.setAttribute('class', 'interactable-log');
            log.setAttribute('circles-interactive-object', '');
            log.setAttribute('circles-pickup-object', '');
            log.setAttribute('static-body', '');
        
            log.setAttribute('scale', '0.3 0.3 0.3'); // Scale down by half in all directions
            log.setAttribute('rotation', '0 90 0');

            this.scene.appendChild(log);
            this.logs.push(log);
        });
    },

    spawnPedestal: function () {
        this.pedestal = document.createElement('a-box');
        this.pedestal.setAttribute('id', 'raftPedestal');
        this.pedestal.setAttribute('position', '20 0 -12');
        this.pedestal.setAttribute('width', '3');
        this.pedestal.setAttribute('height', '0.2');
        this.pedestal.setAttribute('depth', '3');
        this.pedestal.setAttribute('color', 'gray');
        this.pedestal.setAttribute('pedestal-trigger', '');
    
        let raft = document.createElement('a-entity');
        raft.setAttribute('position', `20 .2 -12`);

        raft.setAttribute('id', `raft`);
        raft.setAttribute('gltf-model', `#Raft4`);
        raft.setAttribute('material', 'color: brown'); // Material needs to be separate
        
        raft.setAttribute('scale', '0.3 0.3 0.3'); // Scale down by half in all directions
        raft.setAttribute('rotation', '0 90 0');
        
        // Make it a physics trigger
        this.pedestal.setAttribute('dynamic-body', 'mass: 0;'); // A-Frame physics component
    
        this.scene.appendChild(this.pedestal);
        this.scene.appendChild(raft);

    }
});

AFRAME.registerComponent('pedestal-trigger', {
    init: function () {
        this.logsPlaced = 0;
        this.maxLogs = 4;
        this.el = document.querySelector("#raftPedestal");
        this.raft = document.querySelector('#raft');

        this.el.addEventListener('collide', (event) => {
            const log = event.detail.body.el;
            if (!log || !log.classList.contains('interactable-log')) return;

            console.log("HELLOOOOOO IT IS LOGGGG");

            // First, disable physics
            log.removeAttribute('dynamic-body');

            //Wait a frame before removing to let physics settle
            setTimeout(() => {
                if (log.parentNode) {
                    log.parentNode.removeChild(log);
                    this.logsPlaced++;
                    this.raft.setAttribute('gltf-model', `#Raft${this.logsPlaced}`);
                    console.log(this.raft);
                    

                    if (this.logsPlaced === this.maxLogs) {
                        console.log("Raft is complete!");
                    }
                }
            }, 0);
        });
    }
});

