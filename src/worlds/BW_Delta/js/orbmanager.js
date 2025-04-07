AFRAME.registerComponent('orb-manager', {
    schema: {
        duration: {type: 'int', default: 5000},
        clipNum: {type: 'number', default: 30},
        sendRate: {type: 'int', default: 100},
    },
    init() {
        const CONTEXT_AF = this;
        const scene = CIRCLES.getCirclesSceneElement();

        //guiding text manager
        CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];

        // Circles WebSocket and room tracking
        CONTEXT_AF.socket = null;
        CONTEXT_AF.connected = false;
        CONTEXT_AF.orbDropEventName = "orbdrop_event";
        CONTEXT_AF.orbReleaseEventName = "orbrelease_event";
        CONTEXT_AF.orbPosUpdateEventName = "orbposition_event";
        CONTEXT_AF.orbNumUpdateEventName = "orbnumber_event";
        CONTEXT_AF.lastDropTime = 0; // Timestamp of last orb drop
        CONTEXT_AF.DROP_COOLDOWN = 5000; // cooldown between orb drop position generation
        CONTEXT_AF.timer = null; // Store the timer ID
        CONTEXT_AF.numOrbs = 0; //used to give a unique id to each orb

        CONTEXT_AF.orb1 = document.querySelector('#orboutside1'); 
        CONTEXT_AF.orb2 = document.querySelector('#orboutside2'); 
        CONTEXT_AF.orb3 = document.querySelector('#orboutside3'); 
        CONTEXT_AF.orb4 = document.querySelector('#orboutside4'); 

        CONTEXT_AF.innerorb1 = document.querySelector('#orbinside1'); 
        CONTEXT_AF.innerorb2 = document.querySelector('#orbinside2'); 
        CONTEXT_AF.innerorb3 = document.querySelector('#orbinside3'); 
        CONTEXT_AF.innerorb4 = document.querySelector('#orbinside4'); 

        CONTEXT_AF.orbs = document.querySelectorAll('.orb');

        // Bézier curve paths for orb drops of the 6 tubes yayyyyy
        //i love numbers!!! SO MUCHHH
        CONTEXT_AF.curve1 = [
            [[12.771, 2.99, -10.301], [12.436, 3.093, -10.301], [12.102, 3.187, -10.301], [11.529, 3.218, -10.301]],
            [[11.529, 3.218, -10.301], [10.955, 3.249, -10.301], [10.143, 3.217, -10.301], [9.483, 3.267, -10.301]],
            [[9.483, 3.267, -10.301], [8.822, 3.317, -10.301], [8.314, 3.448, -10.301], [7.705, 3.779, -10.301]],
            [[7.705, 3.779, -10.301], [7.096, 4.109, -10.301], [6.386, 4.637, -10.301], [5.83, 5.313, -10.301]],
            [[5.83, 5.313, -10.301], [5.273, 5.988, -10.301], [4.869, 6.811, -10.301], [4.417, 7.359, -10.301]],
            [[4.417, 7.359, -10.301], [3.966, 7.906, -10.301], [3.467, 8.18, -10.301], [2.98, 8.43, -10.301]],
            [[2.98, 8.43, -10.301], [2.493, 8.681, -10.301], [2.018, 8.909, -10.301], [1.543, 9.136, -10.301]]
        ];
        CONTEXT_AF.curve2 = [
            [[5.035, 17.082, -2.823], [5.02, 17.029, -2.885], [4.938, 16.708, -3.263], [4.843, 16.373, -3.551]],
            [[4.843, 16.373, -3.551], [4.748, 16.038, -3.839], [4.674, 15.742, -4.095], [4.506, 15.222, -4.391]],
            [[4.506, 15.222, -4.391], [4.337, 14.701, -4.687], [4.234, 14.409, -4.811], [4.064, 13.734, -4.926]],
            [[4.064, 13.734, -4.926], [3.894, 13.058, -5.041], [3.875, 13.043, -4.991], [3.597, 12.142, -5.195]],
            [[3.597, 12.142, -5.195], [3.319, 11.241, -5.398], [2.943, 10.557, -5.978], [2.645, 10.384, -6.402]],
            [[2.645, 10.384, -6.402], [2.347, 10.212, -6.826], [2.136, 10.194, -7.11], [1.947, 10.255, -7.399]],
            [[1.947, 10.255, -7.399], [1.758, 10.315, -7.689], [1.338, 10,537, -8.279], [0.97, 10.853, -8.663]]
        ];
        CONTEXT_AF.curve3 = [
            [[-6.743, 9.622, 0.473], [-6.571, 9.565, -0.0652], [-6.413, 9.449, -0.523], [-6.24, 9.071, -0.986]],
            [[-6.24, 9.071, -0.986], [-6.067, 8.693, -1.448], [-6.067, 8.693, -1.448], [-5.774, 7.726, -2.158]],
            [[-5.774, 7.726, -2.158], [-5.567, 7.317, -2.622], [-5.415, 7.187, -3.039], [-5.078, 7.143, -3.711]],
            [[-5.078, 7.143, -3.711], [-4.741, 7.098, -4.383], [-4.435, 7.474, -4.871], [-4.257, 7.786, -5.185]],
            [[-4.257, 7.786, -5.185], [-4.078, 8.099, -5.499], [-3.861, 9.537, -6.159], [-3.547, 9.537, -6.159]],
            [[-3.547, 9.537, -6.159], [-3.232, 10.138, -6.59], [-3.1, 10.245, -6.84], [-2.666, 10.385, -7.437]],
            [[-2.666, 10.385, -7.437], [-2.232, 10.526, -8.034], [-1.864, 10.368, -8.54], [-1.563, 10.209, -8.948]]
        ];
        CONTEXT_AF.curve4 = [
            [[-5.865, 10.551, -21.437], [-5.541, 10.489, -20.841], [-5.135, 10.26, -20.224], [-5.025, 10.192, -20.035]],
            [[-5.025, 10.192, -20.035], [-4.915, 10.125, -19.846], [-4.637, 9.894, -19.379], [-4.404, 9.692, -19.104]],
            [[-4.404, 9.692, -19.104], [-4.172, 9.491, -18.828], [-3.911, 9.255, -18.51], [-3.643, 8.952, -18.206]],
            [[-3.643, 8.952, -18.206], [-3.374, 8.648, -17.901], [-2.816, 8.068, -17.468], [-2.376, 7.662, -16.988]],
            [[-2.376, 7.662, -16.988], [-1.937, 7.237, -16.508], [-1.392, 6.803, -15.862], [-1.22, 6.695, -15.595]],
            [[-1.22, 6.695, -15.59], [-1.047, 6.587, -15.328], [-0.586, 6.419, -14.51], [-0.426, 6.444, -14.103]],
            [[-0.426, 6.444, -14.103], [-0.265, 6.468, -13.696], [-0.0795, 6.709, -12.97], [-0.00525, 6.961, -12.568]],
            [[-0.00525, 6.961, -12.568], [0.069, 7.213, -12.167], [0.132, 7.634, -11.571], [0.17, 8.732, -10.613]]
        ];
        CONTEXT_AF.curve5 = [
            [[-11.003, 12.846, -11.848], [-10.247, 12.378, -11.617], [-10.124, 12.306, -11.58], [-9.683, 12.108, -11.426]],
            [[-9.683, 12.108, -11.426], [-9.243, 11.911, -11.271], [-8.856, 11.76, -11.164], [-8.38, 11.716, -11.009]],
            [[-8.38, 11.716, -11.009], [-7.905, 11.672, -10.854], [-7.514, 11.539, -10.7], [-5.964, 12.134, -10.449]],
            [[-5.964, 12.134, -10.449], [-4.414, 12.728, -10.197], [-3.444, 12.295, -10.121], [-3.046, 12.121, -10.097]],
            [[-3.046, 12.121, -10.097], [-2.649, 11.947, -10.073], [-1.503, 10.989, -10.163], [-1.382, 10.866, -10.177]]
        ];
        CONTEXT_AF.curve6 = [
            [[2.856, 16.856, -16.723], [2.811, 16.349, -16.498], [2.686, 15.875, -16.225], [2.569, 15.501, -15.968]],
            [[2.569, 15.501, -15.968], [2.452, 15.126, -15.712], [2.167, 14.463, -15.193], [2.01, 14.145, -14.923]],
            [[2.01, 14.145, -14.923], [1.853, 13.828, -14.653], [1.52, 13.337, -14.06], [1.339, 13.082, -13.708]],
            [[1.339, 13.082, -13.708], [1.158, 12.827, -13.357], [0.0475, 11.68, -11.436], [-0.0271, 11.599, -11.302]]
        ];

        /*CONTEXT_AF.curve3 = [
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []],
            [[], [], [], []],
        ];*/ 


        CONTEXT_AF.duration = 200;

        // Setup WebSocket & Event Listeners
        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            //yu need this as part of the emitted data: room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()

            // Start the timer for the drop cycle 
            CONTEXT_AF.scheduleNextDrop();

            CONTEXT_AF.socket.on(CONTEXT_AF.orbNumUpdateEventName, (data) => {
                CONTEXT_AF.numOrbs = data.numOrbs;
                console.log("current: " + CONTEXT_AF.numOrbs);
            });

             // Listen for incoming orb drop events
             CONTEXT_AF.socket.on(CONTEXT_AF.orbDropEventName, (data) => {
                console.log("received drop PLSS IMMA KMS");
                //onsole.log(data.colour);
                CONTEXT_AF.lastDropTime = Date.now();
                CONTEXT_AF.colour = data.colour;
                CONTEXT_AF.dropOrbAtPosition(data.position);
            });

            //listen for incoming orb release events to sync position and animation
            CONTEXT_AF.socket.on(CONTEXT_AF.orbReleaseEventName, (data) => {
                const releaseorb = document.querySelector(`#${data.id}`); 
                CONTEXT_AF.playParticles(releaseorb);
                CONTEXT_AF.playAnimation(releaseorb);
                releaseorb.setAttribute('circles-interactive-object', 'enabled:false');
                setTimeout(() => {
                    releaseorb.parentNode.removeChild(releaseorb); // Remove from the scene
                }, CONTEXT_AF.data.duration);
            });

            //listen for updating orb positions on pickup
            CONTEXT_AF.socket.on(CONTEXT_AF.orbPosUpdateEventName, (data) => {
                //data.id and data.position (id and positioon of orb)
                //console.log("position received");
                //console.log(data.id);
                const moveorb = document.querySelector(`#${data.id}`); 
                moveorb.setAttribute('position', data.position);
            });

            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    console.log("received drop 2nd");
                    CONTEXT_AF.lastDropTime = Date.now();
                    CONTEXT_AF.dropOrbAtPosition(data.position);
                }
            });
        };

        scene.addEventListener(CIRCLES.EVENTS.READY, function() {
            console.log("Circles is ready:", CIRCLES.isReady());
        });

        if (CIRCLES.isCirclesWebsocketReady()) {
            CONTEXT_AF.createNetworkingSystem();
        } else {
            const wsReadyFunc = function() {
                CONTEXT_AF.createNetworkingSystem();
                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }
    },

    //emit the next orb drop to other users
    scheduleNextDrop() {
        const CONTEXT_AF = this;
        setTimeout(() => {
            const now = Date.now();
            // dnly emit drop if no one else has dropped in the last 10 seconds
            if (now - CONTEXT_AF.lastDropTime > CONTEXT_AF.DROP_COOLDOWN) {
                const spawnPos = CONTEXT_AF.randomizePosition();
                console.log("sending: " + CONTEXT_AF.numOrbs);
                CONTEXT_AF.socket.emit(CONTEXT_AF.orbNumUpdateEventName, {numOrbs: CONTEXT_AF.numOrbs, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                CONTEXT_AF.lastDropTime = now;
                CONTEXT_AF.position = spawnPos;
                CONTEXT_AF.socket.emit(CONTEXT_AF.orbDropEventName, {position:spawnPos, colour:CONTEXT_AF.colour, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()}); 
                console.log("send drop");
                CONTEXT_AF.dropOrbAtPosition(spawnPos);
            }
            // Schedule the next drop
            CONTEXT_AF.scheduleNextDrop();
        },  CONTEXT_AF.DROP_COOLDOWN); // delay depening on cooldown value
    },

    // Select a random position on the predefined curve
    randomizePosition: function () {
        const CONTEXT_AF = this;
        let n = Math.floor(Math.random() * 6) + 1;
        CONTEXT_AF.colour = Math.floor(Math.random() * 4) + 1;

        let cs = Math.floor(Math.random() * CONTEXT_AF[`curve${n}`].length);
        let t = Math.random();

        let P1 = CONTEXT_AF[`curve${n}`][cs][0];
        let P2 = CONTEXT_AF[`curve${n}`][cs][1];
        let P3 = CONTEXT_AF[`curve${n}`][cs][2];
        let P4 = CONTEXT_AF[`curve${n}`][cs][3];

        let spawnPointX = Math.pow((1 - t), 3) * P1[0] + 3 * Math.pow((1 - t), 2) * t * P2[0] + 3 * (1 - t) * Math.pow(t, 2) * P3[0] + Math.pow(t, 3) * P4[0];
        let spawnPointY = Math.pow((1 - t), 3) * P1[1] + 3 * Math.pow((1 - t), 2) * t * P2[1] + 3 * (1 - t) * Math.pow(t, 2) * P3[1] + Math.pow(t, 3) * P4[1];
        let spawnPointZ = Math.pow((1 - t), 3) * P1[2] + 3 * Math.pow((1 - t), 2) * t * P2[2] + 3 * (1 - t) * Math.pow(t, 2) * P3[2] + Math.pow(t, 3) * P4[2];

        return {x: spawnPointX, y: spawnPointY, z: spawnPointZ};
    },

    remove: function () {
        const CONTEXT_AF = this;
        clearTimeout(CONTEXT_AF.timer);
    },

    // Drops an orb at a specific position
    dropOrbAtPosition: function (spawnPos) {
        const CONTEXT_AF = this;

        const scene = this.el.sceneEl;

        //console.log(CONTEXT_AF.colour);
        //create outer orb
        const orb = CONTEXT_AF[`orb${CONTEXT_AF.colour}`].cloneNode(true);
        orb.setAttribute('id', `orb${CONTEXT_AF.numOrbs}`);
        orb.setAttribute('class', 'orb');
        orb.setAttribute('position', spawnPos);
        orb.setAttribute('animation', {
            property: 'position',
            from: spawnPos,
            to: { x: spawnPos.x, y: 0.6, z: spawnPos.z },
            dur: CONTEXT_AF.duration * spawnPos.y,
            easing: 'linear'
        });
        
        //create inner orb and parent to outer orb
        const innerorb = CONTEXT_AF[`innerorb${CONTEXT_AF.colour}`].cloneNode(true);
        innerorb.setAttribute('id', `innerorb${CONTEXT_AF.numOrbs}`);
        innerorb.setAttribute('position', {x: 0, y: 0, z: 0});
        orb.appendChild(innerorb);

        orb.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            CONTEXT_AF.socket.emit(CONTEXT_AF.orbReleaseEventName, {id: orb.getAttribute("id"), position: orb.getAttribute("position"), room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            CONTEXT_AF.playParticles(orb);
            CONTEXT_AF.playAnimation(orb); 
            CONTEXT_AF.playSound(Math.floor(Math.random() * CONTEXT_AF.data.clipNum) + 1);
            //hide one time guiding text
            CONTEXT_AF.guidingText.hideGuidingText();
            orb.setAttribute('circles-interactive-object', 'enabled:false');
            setTimeout(() => {
                if (orb.parentNode) {
                    orb.parentNode.removeChild(orb);
                }
            }, CONTEXT_AF.data.duration + 1000);
        });

        //display one time guiding text
        CONTEXT_AF.guidingText.showOneTimeText(GUIDING_TEXT.PICK_UP_MEMORY);
        orb.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.sendPosition(orb);
        });

        scene.appendChild(orb);

        CONTEXT_AF.numOrbs++;

        setTimeout(() => {
            if (orb.getAttribute("position").x != 0 && orb.getAttribute("position").y != -0.1 && orb.getAttribute("position").z != 0.2){
                orb.parentNode.removeChild(orb);
            }
        }, CONTEXT_AF.duration * spawnPos.y + 30000);
    }, 

    playParticles: function (orb, colour) {
        const CONTEXT_AF = this;

        //make particle colour match orb colour
        const curColour = orb.children[0].getAttribute("material").emissive;

        const particleSystem = document.createElement('a-entity');
        particleSystem.setAttribute('particle-system', "preset: dust; color:" + curColour + "; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; positionSpread: 0.7 0.5 0.7; maxAge:2.5,blending: 3; dragValue: 1; velocityValue: 0 0.5 0; size: 0.1; sizeSpread: 0.3; duration:" + CONTEXT_AF.data.duration + "; particleCount: 150");
        particleSystem.setAttribute('position', '0 -0.2 0');
        particleSystem.setAttribute('rotation', '-10 90 136');
        orb.appendChild(particleSystem);
        setTimeout(() => particleSystem.remove(),  CONTEXT_AF.data.duration);
    },

    playAnimation: function (orb) {
        const CONTEXT_AF = this;
        orb.setAttribute('animation', {
            property: 'material.opacity',
            to: 0,
            dur: CONTEXT_AF.data.duration,
            startEvents: onclick,
        });

        orb.children[0].setAttribute('animation', {
            property: 'material.opacity',
            to: 0,
            dur: CONTEXT_AF.data.duration,
            startEvents: onclick,
        });

        const position = orb.getAttribute("position");
        orb.setAttribute('animation__ascend', {
            property: 'position',
            from: position,
            to: {x: position.x, y: position.y + 2, z: position.z},
            dur: CONTEXT_AF.data.duration,
            startEvents: onclick,
        });
    },

    playSound: function (soundNum) {
        const CONTEXT_AF = this;
        CONTEXT_AF.clip = document.querySelector(`#clip${soundNum}`);
        CONTEXT_AF.clip.components.sound.playSound();
    },

    sendPosition: function (orb) {
        const CONTEXT_AF = this;
        const sendRate = CONTEXT_AF.data.sendRate;
        const emitPosition = () => {
            //x: 0, y: -0.1, z: 0.2 when pickedup
            // if orb is not picked up 
            if (orb.getAttribute("position").x != 0 && orb.getAttribute("position").y != -0.1 && orb.getAttribute("position").z != 0.2){
                return;
            }

            let worldPos = new THREE.Vector3();
            orb.object3D.getWorldPosition(worldPos);
            //console.log(worldPos);
;
            CONTEXT_AF.socket.emit(CONTEXT_AF.orbPosUpdateEventName, {
                id: orb.getAttribute("id"),
                position: {x: worldPos.x, y: worldPos.y, z: worldPos.z},
                room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });

            setTimeout(emitPosition, 1000 / sendRate); // Repeat at the defined rate
        };
    
        emitPosition(); // Start sending
    }
});