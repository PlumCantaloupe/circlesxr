AFRAME.registerComponent('campfire-interactive', {
    schema: {},
    init() {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');

        //have to capture all components we need to play with here
        CONTEXT_AF.fireSound    = scene.querySelector('#fireParticlesSound');
        CONTEXT_AF.fireRig      = scene.querySelector('#fireRig');
        CONTEXT_AF.campfire     = scene.querySelector('#campfire');
        CONTEXT_AF.moonlight    = scene.querySelector('#moonlight');
        CONTEXT_AF.campfireElem = scene.querySelector('#campfire');     
        CONTEXT_AF.fireOn       = false; //at scene start is false    

        CONTEXT_AF.link_1           = scene.querySelector('#link_1');
        CONTEXT_AF.link_2           = scene.querySelector('#link_2');
        CONTEXT_AF.link_3           = scene.querySelector('#link_3');
        CONTEXT_AF.link_wardrobe    = scene.querySelector('#link_wardrobe');

        // CONTEXT_AF.salonLink.addEventListener('animationcomplete', function(event) {

        //     //console.log(event.detail);

        //     // if ( event.detail.name === 'animation__fireon' ) {

        //     // }
        //     // else if ( event.detail.name === 'animation__fireoff' ) {
        //     //     // CONTEXT_AF.salonLink.setAttribute('scale', {x:0.0, y:0.0, z:0.0});
        //     //     // CONTEXT_AF.salonLink.setAttribute('visible', false);
        //     // }
        // });

        //lets see if fire should be on already ...
        //source: https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
        CONTEXT_AF.getParams = function (url) {
            var params = {};
            var parser = document.createElement('a');
            parser.href = url;
            var query = parser.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                params[pair[0]] = decodeURIComponent(pair[1]);
            }
            return params;
        };
        const params = CONTEXT_AF.getParams(window.location.href);

        //when sound is loaded call this ...
        if (params.hasOwnProperty('fire') ) {
            if (params['fire'] === 'on') {
                CONTEXT_AF.fireSound.addEventListener('sound-loaded', function(e) {
                    CONTEXT_AF.turnFireOn();
                });
            }
        }

        //connect to web sockets so we can sync the campfire lights between users
        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.campfireEventName = "campfire_event";
        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            CONTEXT_AF.campfire.addEventListener('click', function () {
                CONTEXT_AF.fireOn = !CONTEXT_AF.fireOn;
                CONTEXT_AF.turnFire(CONTEXT_AF.fireOn );
                CONTEXT_AF.socket.emit(CONTEXT_AF.campfireEventName, {campfireOn:CONTEXT_AF.fireOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });

            //listen for when others turn on campfire
            CONTEXT_AF.socket.on(CONTEXT_AF.campfireEventName, function(data) {
                CONTEXT_AF.turnFire(data.campfireOn);
                CONTEXT_AF.fireOn = data.campfireOn;
            });

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                //if the same world as the one requesting
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {campfireON:CONTEXT_AF.fireOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    CONTEXT_AF.turnFire(data.campfireON );
                    CONTEXT_AF.fireOn = data.campfireON;
                }
            });
        });
    },
    update() {},
    turnFire : function (turnOn) {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');

        if (turnOn) {
            CONTEXT_AF.fireSound.components.sound.playSound();

            CONTEXT_AF.moonlight.setAttribute('visible', false);
            CONTEXT_AF.fireRig.setAttribute('visible', true);

            // CONTEXT_AF.salonLink.setAttribute('visible', true);
            // CONTEXT_AF.theatreLink.setAttribute('visible', true);
            // CONTEXT_AF.phLink.setAttribute('visible', true);

            //raycaster interaction back on
            CONTEXT_AF.link_1.setAttribute('class', 'interactive');
            CONTEXT_AF.link_2.setAttribute('class', 'interactive');
            CONTEXT_AF.link_3.setAttribute('class', 'interactive');
            CONTEXT_AF.link_wardrobe.setAttribute('class', 'interactive');
            //scene.querySelector('[raycaster]').components.raycaster.refreshObjects(); //update raycaster

            //animate
            CONTEXT_AF.link_1.emit('startFireAnim',{}, false);
            CONTEXT_AF.link_2.emit('startFireAnim',{}, false);
            CONTEXT_AF.link_3.emit('startFireAnim',{}, false);
            CONTEXT_AF.link_wardrobe.emit('startFireAnim',{}, false);

            CONTEXT_AF.campfireElem.setAttribute('circles-label',{text:'click fire to stop'});
        }
        else {
            CONTEXT_AF.fireSound.components.sound.stopSound();

            CONTEXT_AF.moonlight.setAttribute('visible', true);
            CONTEXT_AF.fireRig.setAttribute('visible', false);

            // CONTEXT_AF.salonLink.setAttribute('visible', false);
            // CONTEXT_AF.theatreLink.setAttribute('visible', false);
            // CONTEXT_AF.phLink.setAttribute('visible', false);

            //don't want raycaster accessing when not visible
            //TODO: definiotely need to make a portal link component ...
            CONTEXT_AF.link_1.removeAttribute("class");
            CONTEXT_AF.link_2.removeAttribute("class");
            CONTEXT_AF.link_3.removeAttribute("class");
            CONTEXT_AF.link_wardrobe.removeAttribute("class");
            //scene.querySelector('[raycaster]').components.raycaster.refreshObjects();

            //animate
            CONTEXT_AF.link_1.emit('stopFireAnim',{}, false);
            CONTEXT_AF.link_2.emit('stopFireAnim',{}, false);
            CONTEXT_AF.link_3.emit('stopFireAnim',{}, false);
            CONTEXT_AF.link_wardrobe.emit('stopFireAnim',{}, false);

            CONTEXT_AF.campfireElem.setAttribute('circles-label',{text:'click fire to start'});
        }
    }
});