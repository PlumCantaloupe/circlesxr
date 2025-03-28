AFRAME.registerComponent('network-reset', {
    schema: {},
    init() {
        // setting variables
        const CONTEXT_AF = this;
        CONTEXT_AF.guessOne = document.querySelector('#guessOne');
        CONTEXT_AF.guessTwo = document.querySelector('#guessTwo');
        CONTEXT_AF.guessThree = document.querySelector('#guessThree');
        CONTEXT_AF.guessFour = document.querySelector('#guessFour');

        CONTEXT_AF.resultOne = document.querySelector('#resultOne');
        CONTEXT_AF.resultTwo = document.querySelector('#resultTwo');
        CONTEXT_AF.resultThree = document.querySelector('#resultThree');
        CONTEXT_AF.resultFour = document.querySelector('#resultFour');

        CONTEXT_AF.resultText = document.querySelector('#resultText');

        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.codeEventName = "code_event";
        CONTEXT_AF.guessEventName = "guess_event";

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            CONTEXT_AF.el.addEventListener('click', function() {
                
                // generate random numbers corresponding to item types
                keyOne = Math.floor((Math.random() * 4) + 1);
                keyTwo = Math.floor((Math.random() * 4) + 1);
                keyThree = Math.floor((Math.random() * 4) + 1);
                keyFour = Math.floor((Math.random() * 4) + 1);
        
                function letterGenerator(key) {
                    switch(key){
                        case 1:
                            return {geometry:'primitive:box', material:"color:blue", scale:"0.7 0.7 0.7"};
                            break;
                        case 2:
                            return {geometry:'primitive:sphere; segmentsHeight:36; segmentsWidth:36;', material:"color:red", scale:"0.42 0.42 0.42"};
                            break;
                        case 3:
                            return {geometry:'primitive:cone; thetaLength:360;', material:"color:green", scale:"0.42 0.7 0.42"};
                            break;
                        case 4:
                            return {geometry:'primitive:octahedron', material:"color:purple", scale:"0.42 0.42 0.42"};
                            break;
                    }
                }
        
                // convert numbers to letters and assemble them into guess codes
                keyOne = letterGenerator(keyOne)
                keyTwo = letterGenerator(keyTwo)
                keyThree = letterGenerator(keyThree)
                keyFour = letterGenerator(keyFour)
    
                // set attribute for each shape in the sequence
                CONTEXT_AF.guessOne.setAttribute('material', keyOne.material)
                CONTEXT_AF.guessOne.setAttribute('geometry', keyOne.geometry)
                CONTEXT_AF.guessOne.setAttribute('scale', keyOne.scale)

                CONTEXT_AF.guessTwo.setAttribute('material', keyTwo.material)
                CONTEXT_AF.guessTwo.setAttribute('geometry', keyTwo.geometry)
                CONTEXT_AF.guessTwo.setAttribute('scale', keyTwo.scale)

                CONTEXT_AF.guessThree.setAttribute('material', keyThree.material)
                CONTEXT_AF.guessThree.setAttribute('geometry', keyThree.geometry)
                CONTEXT_AF.guessThree.setAttribute('scale', keyThree.scale)

                CONTEXT_AF.guessFour.setAttribute('material', keyFour.material)
                CONTEXT_AF.guessFour.setAttribute('geometry', keyFour.geometry)
                CONTEXT_AF.guessFour.setAttribute('scale', keyFour.scale)

                // reset check/cross icons
                CONTEXT_AF.resultOne.setAttribute('visible', 'false')
                CONTEXT_AF.resultTwo.setAttribute('visible', 'false')
                CONTEXT_AF.resultThree.setAttribute('visible', 'false')
                CONTEXT_AF.resultFour.setAttribute('visible', 'false')

                CONTEXT_AF.socket.emit(CONTEXT_AF.codeEventName, {netKeyOne:keyOne, netKeyTwo:keyTwo, netKeyThree:keyThree, netKeyFour:keyFour, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                
            })

            //listen for when others reset code
            CONTEXT_AF.socket.on(CONTEXT_AF.codeEventName, function(data) {

                CONTEXT_AF.guessOne.setAttribute('material', data.netKeyOne.material)
                CONTEXT_AF.guessOne.setAttribute('geometry', data.netKeyOne.geometry)
                CONTEXT_AF.guessOne.setAttribute('scale', data.netKeyOne.scale)

                CONTEXT_AF.guessTwo.setAttribute('material', data.netKeyTwo.material)
                CONTEXT_AF.guessTwo.setAttribute('geometry', data.netKeyTwo.geometry)
                CONTEXT_AF.guessTwo.setAttribute('scale', data.netKeyTwo.scale)

                CONTEXT_AF.guessThree.setAttribute('material', data.netKeyThree.material)
                CONTEXT_AF.guessThree.setAttribute('geometry', data.netKeyThree.geometry)
                CONTEXT_AF.guessThree.setAttribute('scale', data.netKeyThree.scale)

                CONTEXT_AF.guessFour.setAttribute('material', data.netKeyFour.material)
                CONTEXT_AF.guessFour.setAttribute('geometry', data.netKeyFour.geometry)
                CONTEXT_AF.guessFour.setAttribute('scale', data.netKeyFour.scale)

                CONTEXT_AF.resultOne.setAttribute('visible', 'false')
                CONTEXT_AF.resultTwo.setAttribute('visible', 'false')
                CONTEXT_AF.resultThree.setAttribute('visible', 'false')
                CONTEXT_AF.resultFour.setAttribute('visible', 'false')
            });

            //listen for when others click on shapes
            CONTEXT_AF.socket.on(CONTEXT_AF.guessEventName, function(data) {

                // searches for shape with same x-value as the other user clicked
                CONTEXT_AF.items = document.querySelectorAll('#spawnedObject')
                if (CONTEXT_AF.items.length > 0) {
                    for (let i=0; i<CONTEXT_AF.items.length; i++){
                        if(CONTEXT_AF.items[i].getAttribute("position").x == data.netPos.x){
                            // hides shape and sends it behind the player to be deleted
                            CONTEXT_AF.items[i].setAttribute('visible', 'false')
                            CONTEXT_AF.items[i].setAttribute('position', '0 0 -3.6')
                        }
                    }
                }

                // update check/cross icons
                CONTEXT_AF.resultOne.setAttribute('visible', data.netResults.netResultOne.visible)
                CONTEXT_AF.resultOne.setAttribute('src', data.netResults.netResultOne.src)

                CONTEXT_AF.resultTwo.setAttribute('visible', data.netResults.netResultTwo.visible)
                CONTEXT_AF.resultTwo.setAttribute('src', data.netResults.netResultTwo.src)

                CONTEXT_AF.resultThree.setAttribute('visible', data.netResults.netResultThree.visible)
                CONTEXT_AF.resultThree.setAttribute('src', data.netResults.netResultThree.src)

                CONTEXT_AF.resultFour.setAttribute('visible', data.netResults.netResultFour.visible)
                CONTEXT_AF.resultFour.setAttribute('src', data.netResults.netResultFour.src)

                CONTEXT_AF.resultText.setAttribute('text', data.netText)
            });

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                //if the same world as the one requesting
                if (data.world === CIRCLES.getCirclesWorldName()) {

                    keyOne = {geometry:CONTEXT_AF.guessOne.getAttribute('geometry'), material:CONTEXT_AF.guessOne.getAttribute('material'), scale:CONTEXT_AF.guessOne.getAttribute('scale')}
                    keyTwo = {geometry:CONTEXT_AF.guessTwo.getAttribute('geometry'), material:CONTEXT_AF.guessTwo.getAttribute('material'), scale:CONTEXT_AF.guessTwo.getAttribute('scale')}
                    keyThree = {geometry:CONTEXT_AF.guessThree.getAttribute('geometry'), material:CONTEXT_AF.guessThree.getAttribute('material'), scale:CONTEXT_AF.guessThree.getAttribute('scale')}
                    keyFour = {geometry:CONTEXT_AF.guessFour.getAttribute('geometry'), material:CONTEXT_AF.guessFour.getAttribute('material'), scale:CONTEXT_AF.guessFour.getAttribute('scale')}

                    resultOne = {visible: CONTEXT_AF.resultOne.getAttribute('visible'), src: CONTEXT_AF.resultOne.getAttribute('src')}
                    resultTwo = {visible: CONTEXT_AF.resultTwo.getAttribute('visible'), src: CONTEXT_AF.resultTwo.getAttribute('src')}
                    resultThree = {visible: CONTEXT_AF.resultThree.getAttribute('visible'), src: CONTEXT_AF.resultThree.getAttribute('src')}
                    resultFour = {visible: CONTEXT_AF.resultFour.getAttribute('visible'), src: CONTEXT_AF.resultFour.getAttribute('src')}

                    resultText = CONTEXT_AF.resultText.getAttribute('text')

                    CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {netText: resultText, netKeys:{netKeyOne: keyOne, netKeyTwo: keyTwo, netKeyThree: keyThree, netKeyFour: keyFour}, netResults:{netResultOne: resultOne, netResultTwo:resultTwo, netResultThree: resultThree, netResultFour: resultFour}, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });

            //receiving sync data from others (assuming all others is the same for now)
            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {

                    CONTEXT_AF.guessOne.setAttribute('material', data.netKeys.netKeyOne.material)
                    CONTEXT_AF.guessOne.setAttribute('geometry', data.netKeys.netKeyOne.geometry)
                    CONTEXT_AF.guessOne.setAttribute('scale', data.netKeys.netKeyOne.scale)
                    
                    CONTEXT_AF.guessTwo.setAttribute('material', data.netKeys.netKeyTwo.material)
                    CONTEXT_AF.guessTwo.setAttribute('geometry', data.netKeys.netKeyTwo.geometry)
                    CONTEXT_AF.guessTwo.setAttribute('scale', data.netKeys.netKeyTwo.scale)

                    CONTEXT_AF.guessThree.setAttribute('material', data.netKeys.netKeyThree.material)
                    CONTEXT_AF.guessThree.setAttribute('geometry', data.netKeys.netKeyThree.geometry)
                    CONTEXT_AF.guessThree.setAttribute('scale', data.netKeys.netKeyThree.scale)

                    CONTEXT_AF.guessFour.setAttribute('material', data.netKeys.netKeyFour.material)
                    CONTEXT_AF.guessFour.setAttribute('geometry', data.netKeys.netKeyFour.geometry)
                    CONTEXT_AF.guessFour.setAttribute('scale', data.netKeys.netKeyFour.scale)

                    CONTEXT_AF.resultOne.setAttribute('visible', data.netResults.netResultOne.visible)
                    CONTEXT_AF.resultOne.setAttribute('src', data.netResults.netResultOne.src)

                    CONTEXT_AF.resultTwo.setAttribute('visible', data.netResults.netResultTwo.visible)
                    CONTEXT_AF.resultTwo.setAttribute('src', data.netResults.netResultTwo.src)

                    CONTEXT_AF.resultThree.setAttribute('visible', data.netResults.netResultThree.visible)
                    CONTEXT_AF.resultThree.setAttribute('src', data.netResults.netResultThree.src)

                    CONTEXT_AF.resultFour.setAttribute('visible', data.netResults.netResultFour.visible)
                    CONTEXT_AF.resultFour.setAttribute('src', data.netResults.netResultFour.src)

                    CONTEXT_AF.resultText.setAttribute('text', data.netText)

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

    }
});