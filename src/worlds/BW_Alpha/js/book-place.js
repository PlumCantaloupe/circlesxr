//save location arrays with postion and rotation

//randomize four numbers function
// store each number in a seperate variable

//place books at postion function
AFRAME.registerComponent('book-place', {
    schema: {
        id: {type: int},
        position: {type: vec3},
        rotation: {type: vec3},
    },

    init() {
        const CONTEXT_AF = this;
        const scene = CIRCLES.getCirclesSceneElement();

        // Circles WebSocket and room tracking
        CONTEXT_AF.socket = null;
        CONTEXT_AF.connected = false;

        CONTEXT_AF.buffer = 0.5;

        CONTEXT_AF.track1 = scene.querySelector('#track1');
        CONTEXT_AF.track2 = scene.querySelector('#track2');
        CONTEXT_AF.track3 = scene.querySelector('#track3');
        CONTEXT_AF.track4 = scene.querySelector('#track4');

        // Setup WebSocket & Event Listeners
        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {
                }
            });
        };

        scene.addEventListener(CIRCLES.EVENTS.READY, function() {
            console.log("Circles is ready:", CIRCLES.isReady());
        });

        CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            console.log("placed position is: ");
            console.log(CONTEXT_AF.betweenPos);
            if(CONTEXT_AF.betweenPos){
                //emit to others
                CONTEXT_AF.el.setAttribute('position', CONTEXT_AF.data.position);
                CONTEXT_AF.el.setAttribute('rotation', CONTEXT_AF.data.rotation);
                startMusic();
            }
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


    betweenPos: function (){
        const CONTEXT_AF = this;

        //CONTEXT_AF.corner1 = CONTEXT_AF.data.position;
        //CONTEXT_AF.corner2 = CONTEXT_AF.data.position;

        CONTEXT_AF.corner1 = {x: -0.5, y: 1.6, z: -12.4};
        CONTEXT_AF.corner2 = {x: 0.370, y: 1, z: -12.2};

        const minX = Math.min(CONTEXT_AF.corner1.x, CONTEXT_AF.corner2.x);
        const maxX = Math.max(CONTEXT_AF.corner1.x, CONTEXT_AF.corner2.x);
        const minY = Math.min(CONTEXT_AF.corner1.y, CONTEXT_AF.corner2.y);
        const maxY = Math.max(CONTEXT_AF.corner1.y, CONTEXT_AF.corner2.y);
        const minZ = Math.min(CONTEXT_AF.corner1.z, CONTEXT_AF.corner2.z);
        const maxZ = Math.max(CONTEXT_AF.corner1.z, CONTEXT_AF.corner2.z);

        if (CONTEXT_AF.data.position.x >= minX && CONTEXT_AF.data.position.x <= maxX && 
        CONTEXT_AF.data.position.y >= minY && CONTEXT_AF.data.position.y <= maxY &&
        CONTEXT_AF.data.position.z >= minZ && CONTEXT_AF.data.position.z <= maxZ){
            return true;
        }
        else {
            return false;
        }
    },

    // set locations of books
    startMusic: function () {
        const CONTEXT_AF = this;
        

    },
});