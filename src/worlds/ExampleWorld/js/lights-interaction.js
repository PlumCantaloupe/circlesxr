AFRAME.registerComponent('lights-interactive', {
    schema: {},
    init() {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');

        //have to capture all components we need to play with here
        CONTEXT_AF.light_1    = scene.querySelector('#light_1');
        CONTEXT_AF.light_2    = scene.querySelector('#light_2');
        CONTEXT_AF.light_3    = scene.querySelector('#light_3');
        CONTEXT_AF.light_4    = scene.querySelector('#light_4');

        CONTEXT_AF.light_1_on    = false;
        CONTEXT_AF.light_2_on    = false;
        CONTEXT_AF.light_3_on    = false;
        CONTEXT_AF.light_4_on    = false;

        //connect to web sockets so we can sync the campfire lights between users
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.synchEventName = "lights_event";

        console.log("!!!!!!!!!!!!!!!!!!!!");

        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesRoom() + ' in world:' + CIRCLES.getCirclesWorld());

            //light 1
            CONTEXT_AF.light_1.addEventListener('click', function () {
                console.log('click');

                CONTEXT_AF.light_1_on  = !CONTEXT_AF.light_1_on;
                CONTEXT_AF.turnLightOn(CONTEXT_AF.light_1, CONTEXT_AF.light_1_on);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1_on, light_2_on:CONTEXT_AF.light_2_on, 
                                                                    light_3_on:CONTEXT_AF.light_3_on, light_4_on:CONTEXT_AF.light_4_on,
                                                                    room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
            });
            
            //light 2
            CONTEXT_AF.light_2.addEventListener('click', function () {
                CONTEXT_AF.light_2_on  = !CONTEXT_AF.light_2_on;
                CONTEXT_AF.turnLightOn(CONTEXT_AF.light_2, CONTEXT_AF.light_2_on);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1_on, light_2_on:CONTEXT_AF.light_2_on, 
                                                                    light_3_on:CONTEXT_AF.light_3_on, light_4_on:CONTEXT_AF.light_4_on,
                                                                    room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
            });

            //light 3
            CONTEXT_AF.light_3.addEventListener('click', function () {
                CONTEXT_AF.light_3_on  = !CONTEXT_AF.light_3_on;
                CONTEXT_AF.turnLightOn(CONTEXT_AF.light_3, CONTEXT_AF.light_3_on);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1_on, light_2_on:CONTEXT_AF.light_2_on, 
                                                                    light_3_on:CONTEXT_AF.light_3_on, light_4_on:CONTEXT_AF.light_4_on,
                                                                    room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
            });

            //light 4
            CONTEXT_AF.light_4.addEventListener('click', function () {
                CONTEXT_AF.light_4_on  = !CONTEXT_AF.light_4_on;
                CONTEXT_AF.turnLightOn(CONTEXT_AF.light_4, CONTEXT_AF.light_4_on);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1_on, light_2_on:CONTEXT_AF.light_2_on, 
                                                                    light_3_on:CONTEXT_AF.light_3_on, light_4_on:CONTEXT_AF.light_4_on,
                                                                    room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
            });

            //listen for when others turn on campfire
            CONTEXT_AF.socket.on(CONTEXT_AF.synchEventName, function(data) {
                //light 1
                CONTEXT_AF.turnLightOn(CONTEXT_AF.light_1, data.light_1_on);
                CONTEXT_AF.light_1_on = data.light_1_on;

                //light 2
                CONTEXT_AF.turnLightOn(CONTEXT_AF.light_2, data.light_2_on);
                CONTEXT_AF.light_2_on = data.light_2_on;

                //light 3
                CONTEXT_AF.turnLightOn(CONTEXT_AF.light_3, data.light_3_on);
                CONTEXT_AF.light_3_on = data.light_3_on;

                //light 4
                CONTEXT_AF.turnLightOn(CONTEXT_AF.light_4, data.light_4_on);
                CONTEXT_AF.light_4_on = data.light_4_on;
            });

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, { light_1_on:CONTEXT_AF.light_1_on, light_2_on:CONTEXT_AF.light_2_on, 
                                                                        light_3_on:CONTEXT_AF.light_3_on, light_4_on:CONTEXT_AF.light_4_on, 
                                                                        room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.SEND_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorld()) {
                    //light 1
                    CONTEXT_AF.turnLightOn(CONTEXT_AF.light_1, data.light_1_on);
                    CONTEXT_AF.light_1_on = data.light_1_on;

                    //light 2
                    CONTEXT_AF.turnLightOn(CONTEXT_AF.light_2, data.light_2_on);
                    CONTEXT_AF.light_2_on = data.light_2_on;

                    //light 3
                    CONTEXT_AF.turnLightOn(CONTEXT_AF.light_3, data.light_3_on);
                    CONTEXT_AF.light_3_on = data.light_3_on;

                    //light 4
                    CONTEXT_AF.turnLightOn(CONTEXT_AF.light_4, data.light_4_on);
                    CONTEXT_AF.light_4_on = data.light_4_on;
                }
            });
        });
    },
    update() {},
    turnLightOn : function (lightElem, turnOn) {
        let emissiveIntensity = (turnOn) ? 6.0 : 0.0;
        let lightIntensity = (turnOn) ? 15.0 : 5.0;

        lightElem.setAttribute('material', {emissiveIntensity:emissiveIntensity});
        lightElem.querySelector('[light]').setAttribute('light', {intensity:lightIntensity});
    }
});