AFRAME.registerComponent('lights-interactive', {
    schema: {},
    init() {
        const CONTEXT_AF = this;
        const scene      = CIRCLES.getCirclesSceneElement();

        scene.addEventListener(CIRCLES.EVENTS.READY, function() {
            console.log('Circles is ready: ' + CIRCLES.isReady());

            //this is the camera that is now also ready, if we want to parent elements to it i.e., a user interface or 2D buttons
            console.log("Circles camera ID: " + CIRCLES.getMainCameraElement().id);
        });

        //have to capture all components we need to play with here
        CONTEXT_AF.light_1    = scene.querySelector('#light_1');
        CONTEXT_AF.light_2    = scene.querySelector('#light_2');
        CONTEXT_AF.light_3    = scene.querySelector('#light_3');
        CONTEXT_AF.light_4    = scene.querySelector('#light_4');

        //want to keep track of which light in on/off
        CONTEXT_AF.light_1.lightOn = false;
        CONTEXT_AF.light_2.lightOn = false;
        CONTEXT_AF.light_3.lightOn = false;
        CONTEXT_AF.light_4.lightOn = false;

        //connect to web sockets so we can sync the campfire lights between users
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.synchEventName = "lights_event";

        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            //light 1
            CONTEXT_AF.light_1.addEventListener('click', function () {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light_1, false);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1.lightOn , light_2_on:CONTEXT_AF.light_2.lightOn , 
                                                                    light_3_on:CONTEXT_AF.light_3.lightOn , light_4_on:CONTEXT_AF.light_4.lightOn ,
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });
            
            //light 2
            CONTEXT_AF.light_2.addEventListener('click', function () {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light_2, false);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1.lightOn , light_2_on:CONTEXT_AF.light_2.lightOn , 
                                                                    light_3_on:CONTEXT_AF.light_3.lightOn , light_4_on:CONTEXT_AF.light_4.lightOn ,
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });

            //light 3
            CONTEXT_AF.light_3.addEventListener('click', function () {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light_3, false);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1.lightOn , light_2_on:CONTEXT_AF.light_2.lightOn , 
                                                                    light_3_on:CONTEXT_AF.light_3.lightOn , light_4_on:CONTEXT_AF.light_4.lightOn ,
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });

            //light 4
            CONTEXT_AF.light_4.addEventListener('click', function () {
                CONTEXT_AF.toggleLight(CONTEXT_AF.light_4, false);
                CONTEXT_AF.socket.emit(CONTEXT_AF.synchEventName, { light_1_on:CONTEXT_AF.light_1.lightOn , light_2_on:CONTEXT_AF.light_2.lightOn , 
                                                                    light_3_on:CONTEXT_AF.light_3.lightOn , light_4_on:CONTEXT_AF.light_4.lightOn ,
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });

            //listen for when others turn on campfire
            CONTEXT_AF.socket.on(CONTEXT_AF.synchEventName, function(data) {
                //light 1
                if (CONTEXT_AF.light_1.lightOn !== data.light_1_on) {
                    CONTEXT_AF.toggleLight(CONTEXT_AF.light_1, true);
                }

                //light 2
                if (CONTEXT_AF.light_2.lightOn !== data.light_2_on) {
                    CONTEXT_AF.toggleLight(CONTEXT_AF.light_2, true);
                }

                //light 3
                if (CONTEXT_AF.light_3.lightOn !== data.light_3_on) {
                    CONTEXT_AF.toggleLight(CONTEXT_AF.light_3, true);
                }

                //light 4
                if (CONTEXT_AF.light_4.lightOn !== data.light_4_on) {
                    CONTEXT_AF.toggleLight(CONTEXT_AF.light_4, true);
                }
            });

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                //if the same world as the one requesting
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, { light_1_on:CONTEXT_AF.light_1.lightOn , light_2_on:CONTEXT_AF.light_2.lightOn , 
                                                                            light_3_on:CONTEXT_AF.light_3.lightOn , light_4_on:CONTEXT_AF.light_4.lightOn , 
                                                                            room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    //light 1
                    if (CONTEXT_AF.light_1.lightOn !== data.light_1_on) {
                        CONTEXT_AF.toggleLight(CONTEXT_AF.light_1, false);
                    }

                    //light 2
                    if (CONTEXT_AF.light_2.lightOn !== data.light_2_on) {
                        CONTEXT_AF.toggleLight(CONTEXT_AF.light_2, false);
                    }

                    //light 3
                    if (CONTEXT_AF.light_3.lightOn !== data.light_3_on) {
                        CONTEXT_AF.toggleLight(CONTEXT_AF.light_3, false);
                    }

                    //light 4
                    if (CONTEXT_AF.light_4.lightOn !== data.light_4_on) {
                        CONTEXT_AF.toggleLight(CONTEXT_AF.light_4, false);
                    }
                }
            });
        });
    },
    update() {},
    toggleLight : function (lightElem, playSound) {
        lightElem.lightOn = !lightElem.lightOn;

        let emissiveIntensity = (lightElem.lightOn ) ? 6.0 : 0.0;
        let lightIntensity = (lightElem.lightOn ) ? 15.0 : 5.0;

        lightElem.setAttribute('material', {emissiveIntensity:emissiveIntensity});
        lightElem.querySelector('[light]').setAttribute('light', {intensity:lightIntensity});

        //play sound (if another client turned on so we can make music together :)
        if (lightElem.components['circles-interactive-object'].sound && playSound === true) {
            lightElem.components['circles-interactive-object'].sound.stopSound();
            lightElem.components['circles-interactive-object'].sound.playSound();
        }
    }
});