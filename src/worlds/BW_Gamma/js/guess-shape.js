AFRAME.registerComponent('guess-shape', {
    schema: {},
    init() {
        // setting variables
        const CONTEXT_AF = this;
        CONTEXT_AF.guessOne = document.querySelector('#guessOne');
        CONTEXT_AF.guessTwo = document.querySelector('#guessTwo');
        CONTEXT_AF.guessThree = document.querySelector('#guessThree');
        CONTEXT_AF.guessFour = document.querySelector('#guessFour');
        CONTEXT_AF.scene = document.querySelector('a-scene')

        CONTEXT_AF.guessOneLabel = document.querySelector('#guessOneLabel');
        CONTEXT_AF.guessTwoLabel = document.querySelector('#guessTwoLabel');
        CONTEXT_AF.guessThreeLabel = document.querySelector('#guessThreeLabel');
        CONTEXT_AF.guessFourLabel = document.querySelector('#guessFourLabel');
        
        CONTEXT_AF.resultOne = document.querySelector('#resultOne');
        CONTEXT_AF.resultTwo = document.querySelector('#resultTwo');
        CONTEXT_AF.resultThree = document.querySelector('#resultThree');
        CONTEXT_AF.resultFour = document.querySelector('#resultFour');

        CONTEXT_AF.resetButton = document.querySelector('#resetButton');
        CONTEXT_AF.resultText = document.querySelector('#resultText');

        CONTEXT_AF.username = CIRCLES.getCirclesUserName();

        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.guessEventName = "guess_event";

        //guiding text manager
        CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];
        
        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            // when user clicks on a shape
            CONTEXT_AF.el.addEventListener('click', function() {
                //hide guiding text
                CONTEXT_AF.guidingText.hideGuidingText();
                // if no cross/check icons are shown, user must be guessing for the first shape in the sequence
                if(CONTEXT_AF.resultOne.getAttribute('visible') == false){
                    // update user guess labels
                    CONTEXT_AF.guessOneLabel.setAttribute('text', 'value: ' + CONTEXT_AF.username + '\n guessed!; align:center; color:black; width:5.3')
                    CONTEXT_AF.guessOneLabel.setAttribute('visible', true)
                    if(CONTEXT_AF.guessOne.getAttribute('geometry').primitive == this.getAttribute('geometry').primitive){
                        CONTEXT_AF.resultOne.setAttribute('src', 'assets/textures/Check.png')
                        CONTEXT_AF.resultOne.setAttribute('visible', 'true')
                    } else {
                        CONTEXT_AF.resultOne.setAttribute('src', 'assets/textures/Cross.png')
                        CONTEXT_AF.resultOne.setAttribute('visible', 'true')
                        //reset code after one second of showing cross
                        setTimeout(function(){
                            CONTEXT_AF.resetButton.click()
                        }, 1000);
                        CONTEXT_AF.resultText.setAttribute('text', 'value: Sequences in row: 0; align:center; color:black;');
                    }
                }
                // if the second cross/check icon is not visible, user must be guessing for the second shape in the sequence
                else if(CONTEXT_AF.resultTwo.getAttribute('visible') == false){
                    // update user guess labels
                    CONTEXT_AF.guessTwoLabel.setAttribute('text', 'value: ' + CONTEXT_AF.username + '\n guessed!; align:center; color:black; width:5.3')
                    CONTEXT_AF.guessTwoLabel.setAttribute('visible', true)
                    if(CONTEXT_AF.guessTwo.getAttribute('geometry').primitive == this.getAttribute('geometry').primitive){
                        CONTEXT_AF.resultTwo.setAttribute('src', 'assets/textures/Check.png')
                        CONTEXT_AF.resultTwo.setAttribute('visible', 'true')
                    } else {
                        CONTEXT_AF.resultTwo.setAttribute('src', 'assets/textures/Cross.png')
                        CONTEXT_AF.resultTwo.setAttribute('visible', 'true')
                        //reset code after one second of showing cross
                        setTimeout(function(){
                            CONTEXT_AF.resetButton.click()
                        }, 1000);
                        CONTEXT_AF.resultText.setAttribute('text', 'value: Sequences in row: 0; align:center; color:black;');
                    }
                }
                // if the third cross/check icon is not visible, user must be guessing for the third shape in the sequence
                else if(CONTEXT_AF.resultThree.getAttribute('visible') == false){
                    // update user guess labels
                    CONTEXT_AF.guessThreeLabel.setAttribute('text', 'value: ' + CONTEXT_AF.username + '\n guessed!; align:center; color:black; width:5.3')
                    CONTEXT_AF.guessThreeLabel.setAttribute('visible', true)
                    if(CONTEXT_AF.guessThree.getAttribute('geometry').primitive == this.getAttribute('geometry').primitive){
                        CONTEXT_AF.resultThree.setAttribute('src', 'assets/textures/Check.png')
                        CONTEXT_AF.resultThree.setAttribute('visible', 'true')
                    } else {
                        CONTEXT_AF.resultThree.setAttribute('src', 'assets/textures/Cross.png')
                        CONTEXT_AF.resultThree.setAttribute('visible', 'true')
                        //reset code after one second of showing cross
                        setTimeout(function(){
                            CONTEXT_AF.resetButton.click()
                        }, 1000);
                        CONTEXT_AF.resultText.setAttribute('text', 'value: Sequences in row: 0; align:center; color:black;');
                    }
                }
                // if the fourth cross/check icon is not visible, user must be guessing for the fourth shape in the sequence
                else if(CONTEXT_AF.resultFour.getAttribute('visible') == false){
                    // update user guess labels
                    CONTEXT_AF.guessFourLabel.setAttribute('text', 'value: ' + CONTEXT_AF.username + '\n guessed!; align:center; color:black; width:5.3')
                    CONTEXT_AF.guessFourLabel.setAttribute('visible', true)
                    if(CONTEXT_AF.guessFour.getAttribute('geometry').primitive == this.getAttribute('geometry').primitive){
                        CONTEXT_AF.resultFour.setAttribute('src', 'assets/textures/Check.png')
                        CONTEXT_AF.resultFour.setAttribute('visible', 'true')
                        //reset code after one second of showing completed state, increase 'sequences in row' by 1
                        setTimeout(function(){
                            CONTEXT_AF.resetButton.click()
                        }, 1000);
                        resultNum = parseInt(CONTEXT_AF.resultText.getAttribute('text').value.substring(18), 10)
                        resultNum++;
                        CONTEXT_AF.resultText.setAttribute('text', 'value: Sequences in row: '+resultNum.toString()+'; align:center; color:black;')
                    } else {
                        CONTEXT_AF.resultFour.setAttribute('src', 'assets/textures/Cross.png')
                        CONTEXT_AF.resultFour.setAttribute('visible', 'true')
                        //reset code after one second of showing cross
                        setTimeout(function(){
                            CONTEXT_AF.resetButton.click()
                        }, 1000);
                        CONTEXT_AF.resultText.setAttribute('text', 'value: Sequences in row: 0; align:center; color:black;');
                    }
                }

                thisPosition=this.getAttribute('position')

                resultOne = {visible: CONTEXT_AF.resultOne.getAttribute('visible'), src: CONTEXT_AF.resultOne.getAttribute('src')}
                resultTwo = {visible: CONTEXT_AF.resultTwo.getAttribute('visible'), src: CONTEXT_AF.resultTwo.getAttribute('src')}
                resultThree = {visible: CONTEXT_AF.resultThree.getAttribute('visible'), src: CONTEXT_AF.resultThree.getAttribute('src')}
                resultFour = {visible: CONTEXT_AF.resultFour.getAttribute('visible'), src: CONTEXT_AF.resultFour.getAttribute('src')}

                labelOne = {visible: CONTEXT_AF.guessOneLabel.getAttribute('visible'), text:CONTEXT_AF.guessOneLabel.getAttribute('text')}
                labelTwo = {visible: CONTEXT_AF.guessTwoLabel.getAttribute('visible'), text:CONTEXT_AF.guessTwoLabel.getAttribute('text')}
                labelThree = {visible: CONTEXT_AF.guessThreeLabel.getAttribute('visible'), text:CONTEXT_AF.guessThreeLabel.getAttribute('text')}
                labelFour = {visible: CONTEXT_AF.guessFourLabel.getAttribute('visible'), text:CONTEXT_AF.guessFourLabel.getAttribute('text')}

                resultText = CONTEXT_AF.resultText.getAttribute('text')

                CONTEXT_AF.socket.emit(CONTEXT_AF.guessEventName, {netLabels: {netLabelOne: labelOne, netLabelTwo: labelTwo, netLabelThree: labelThree, netLabelFour: labelFour}, netPos: thisPosition, netText:resultText, netResults:{netResultOne: resultOne, netResultTwo:resultTwo, netResultThree: resultThree, netResultFour: resultFour}, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});

                // hides shape and sends it behind the player to be deleted
                this.setAttribute('visible', 'false')
                this.setAttribute('position', '0 0 -3.6')
                
            })

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
});