AFRAME.registerComponent('spawn-object', {
    schema: {
        moveSpeed: {type: 'number', default: 0.05}
    },
    init() {
        // setting variables
        const CONTEXT_AF = this;
        CONTEXT_AF.scene = document.querySelector('a-scene')

        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.spawnEventName = "spawn_event";

        // Audio analyser element
        CONTEXT_AF.analyserEl = document.querySelector('#audioanalyser-entity');

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            // spawn object on low beat detected
            CONTEXT_AF.analyserEl.addEventListener('audioanalyser-beat-low', function () {
                // gets a random shape based on an integer as well as a random x-value within 2 and -2
                shapeNum = Math.floor((Math.random() * 4) + 1);
                xVal = (Math.random() * 4) -2;

                function letterGenerator(key) {
                    switch(key){
                        case 1:
                            return {geometry:'primitive:box', material:"color:blue", scale:"0.4167 0.4167 0.4167"};
                            break;
                        case 2:
                            return {geometry:'primitive:sphere', material:"color:red", scale:"0.25 0.25 0.25"};
                            break;
                        case 3:
                            return {geometry:'primitive:cone', material:"color:green", scale:"0.25 0.4167 0.25"};
                            break;
                        case 4:
                            return {geometry:'primitive:octahedron', material:"color:purple", scale:"0.25 0.25 0.25"};
                            break;
                    }
                }

                shapeKey = letterGenerator(shapeNum)
                randPosition = {x: xVal, y: 1.7, z: 27}

                // spawn object with attributes
                toSpawn = document.createElement("a-entity")
                toSpawn.setAttribute('spawned-shape', {
                    material: shapeKey.material,
                    geometry: shapeKey.geometry,
                    scale: shapeKey.scale,
                    spawnPos: randPosition
                })
                CONTEXT_AF.scene.appendChild(toSpawn);

                // Create ring/torus spawning entity and append to scene
                ringVisual = document.createElement('a-entity');
                ringVisual.setAttribute('ring-visualiser', {});
                ringVisual.object3D.position.set(randPosition.x, randPosition.y, 27.5);

                CONTEXT_AF.scene.appendChild(ringVisual);
            });
        };

        //check if circle networking is ready. If not, add an eent to listen for when it is ...
        if (CIRCLES.isCirclesWebsocketReady()) {
            CONTEXT_AF.createNetworkingSystem();
        }
        else {
            const wsReadyFunc = function() {
                CONTEXT_AF.createNetworkingSystem();
                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }

    },
    tick: function(time, timeDelta) {
        const CONTEXT_AF = this;
        CONTEXT_AF.items = document.querySelectorAll('.spawnedObject');

        // move all spawned objects by move speed in the z-direction per tick
        // check if objects' z-values are less than -3.5 and delete them if so
        if (CONTEXT_AF.items.length > 0) {
            for (let i=0; i<CONTEXT_AF.items.length; i++){
                const currShape = CONTEXT_AF.items[i];

                currShape.object3D.position.z -= CONTEXT_AF.data.moveSpeed;

                if(currShape.object3D.position.z < -3.5){
                    currShape.parentNode.removeChild(currShape)
                }
            }
        }
    }
});