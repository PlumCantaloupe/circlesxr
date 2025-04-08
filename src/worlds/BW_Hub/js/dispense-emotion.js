//component is responsible for dispensing an emotion orb from a emotion dispenser
AFRAME.registerComponent('dispense-emotion', {
    schema: {
        orbColour: {type: 'color'},
        enabled: {type: 'boolean', default: true},
        emotion: {type: 'string'}
    },

    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];

        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;

        // Get socket so we can get the socket ID to add a unique identifier to the created orb
        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            // console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());
        }

        //check if circle networking is ready. If not, add an went to listen for when it is ...
        if (CIRCLES.isCirclesWebsocketReady()) {
            CONTEXT_AF.createNetworkingSystem();
        }
        else {
            const wsReadyFunc = async function() {
                CONTEXT_AF.createNetworkingSystem();
                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }

        CONTEXT_AF.el.addEventListener('click', function() {
            //dispose a ball if the slot is empty
            if(CONTEXT_AF.data.enabled) {
                CONTEXT_AF.createOrb();
                CONTEXT_AF.el.setAttribute('dispense-emotion', {enabled: false})
            }
            //display error text if the slot is filled
            else
                CONTEXT_AF.guidingText.displayError(ERROR_TEXT.DISPOSE_ONE_TYPE_PART1 + CONTEXT_AF.data.emotion + ERROR_TEXT.DISPOSE_ONE_TYPE_PART2);
        })
    },

    //function creates an orb and positions it in the dispenser slot
    createOrb: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.parent = CONTEXT_AF.el.parentNode;

        //create orb and append to the parent container
        const orbEl = document.createElement('a-entity');

        orbEl.setAttribute('geometry', {primitive: 'sphere',
                                        radius: EMOTION_ORB_INFO.RADIUS});
        orbEl.object3D.position.set(EMOTION_ORB_INFO.X_POS, EMOTION_ORB_INFO.Y_POS, EMOTION_ORB_INFO.Z_POS);
        orbEl.setAttribute('material', {color: CONTEXT_AF.data.orbColour});
        orbEl.setAttribute('emotion-pick-up', {animate:true});
        orbEl.setAttribute('circles-interactive-object', {type: 'outline'});
        // Set id for orb that is the emotion + the socket id so the orb is uniquely identified when networked across clients
        orbEl.setAttribute('id', `${CONTEXT_AF.data.emotion}-${CONTEXT_AF.socket.id}`);
        // Set a new 'data-emotion' attribute on the orb so the attribute can be referenced when the orb's emotion is shared in the emotion data update logic
        orbEl.setAttribute('data-emotion', CONTEXT_AF.data.emotion);

        CONTEXT_AF.parent.appendChild(orbEl);
    }
});
