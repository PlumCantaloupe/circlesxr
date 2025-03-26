AFRAME.registerComponent('spawn-object', {
    schema: {},
    init() {
        const CONTEXT_AF = this;
        //CONTEXT_AF.guessOne = document.querySelector('#guessOne');
        //CONTEXT_AF.guessTwo = document.querySelector('#guessTwo');
        //CONTEXT_AF.guessThree = document.querySelector('#guessThree');
        //CONTEXT_AF.guessFour = document.querySelector('#guessFour');
        CONTEXT_AF.scene = document.querySelector('a-scene')

        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.spawnEventName = "spawn_event";

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            // CONTEXT_AF.el.addEventListener('click', function () {
            //     CONTEXT_AF.socket.emit(CONTEXT_AF.campfireEventName, {campfireOn:true, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            //     console.log("emit")
            //   });

            CONTEXT_AF.el.addEventListener('click', function() {
                
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

                randPosition = xVal.toString() + " 1.7 27"

                toSpawn = document.createElement("a-entity")
                toSpawn.setAttribute("id", "spawnedObject")
                toSpawn.setAttribute("material", shapeKey.material)
                toSpawn.setAttribute("geometry", shapeKey.geometry)
                toSpawn.setAttribute("position", randPosition)
                toSpawn.setAttribute("scale", shapeKey.scale)
                //toSpawn.setAttribute("network-test", "")
                toSpawn.setAttribute("circles-interactive-object", "")
                CONTEXT_AF.scene.appendChild(toSpawn)

                CONTEXT_AF.socket.emit(CONTEXT_AF.spawnEventName, {shapeKeyNet:shapeKey, netRandPos: randPosition, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                
            })

            //listen for when others turn on campfire
            CONTEXT_AF.socket.on(CONTEXT_AF.spawnEventName, function(data) {

                shapeKey = data.shapeKeyNet

                toSpawn = document.createElement("a-entity")
                toSpawn.setAttribute("id", "spawnedObject")
                toSpawn.setAttribute("material", shapeKey.material)
                toSpawn.setAttribute("geometry", shapeKey.geometry)
                toSpawn.setAttribute("position", data.netRandPos)
                toSpawn.setAttribute("scale", shapeKey.scale)
                //toSpawn.setAttribute("network-test", "")
                toSpawn.setAttribute("circles-interactive-object", "")
                CONTEXT_AF.scene.appendChild(toSpawn)

            });

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                //if the same world as the one requesting
                if (data.world === CIRCLES.getCirclesWorldName()) {

                    //CONTEXT_AF.items = document.querySelectorAll('#spawnedObject')
                    //console.log(CONTEXT_AF.items)

                    //CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {

                    //console.log(data)

                    //if(data.items.length > 0){
                    //    for (let i=0; i<data.items.length; i++){
                    //        shapeKey = data.items[i]
                    //        toSpawn = document.createElement("a-entity")
                    //        toSpawn.setAttribute("id", "spawnedObject")
                    //        toSpawn.setAttribute("material", shapeKey.getAttribute("material"))
                    //        toSpawn.setAttribute("geometry", shapeKey.getAttribute("geometry"))
                    //        toSpawn.setAttribute("position", shapeKey.getAttribute("position"))
                    //        toSpawn.setAttribute("scale", shapeKey.getAttribute("scale"))
                    //        CONTEXT_AF.scene.appendChild(toSpawn)
                    //    }
                    //}
                }
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

        /*CONTEXT_AF.el.addEventListener('click', function(e){

            keyNum = Math.floor((Math.random() * 4) + 1);

            function colorGenerator(key) {
                switch(key){
                    case 1:
                        return 'color:yellow';
                        break;
                    case 2:
                        return 'color:black';
                        break;
                    case 3:
                        return 'color:purple';
                        break;
                    case 4:
                        return 'color:green';
                        break;
                }
            }

            colorChange = colorGenerator(keyNum)

            CONTEXT_AF.guessOne.setAttribute('material', colorChange)
        });*/
    },
    tick: function(time, timeDelta) {
        const CONTEXT_AF = this;
        CONTEXT_AF.items = document.querySelectorAll('#spawnedObject')
        //console.log(CONTEXT_AF.items)
        if (CONTEXT_AF.items.length > 0) {
            for (let i=0; i<CONTEXT_AF.items.length; i++){
                CONTEXT_AF.items[i].getAttribute("position").z -= 0.2
                if(CONTEXT_AF.items[i].getAttribute("position").z < -3.5){
                    CONTEXT_AF.items[i].parentNode.removeChild(CONTEXT_AF.items[i])
                }
            }
            //console.log(CONTEXT_AF.items[0])
            //CONTEXT_AF.items.getAttribute("position").z -= 0.2
        }
    }
});