AFRAME.registerComponent('gamemanagercombo', {
    init: function(){
        
        //setting up socket.io connections
        CONTEXT_AF              = this;
        CONTEXT_AF.socket       = null;
        CONTEXT_AF.connected    = false;

        CONTEXT_AF.increaseNumber = document.querySelectorAll("[id*='UpCB']");
        CONTEXT_AF.decreaseNumber = document.querySelectorAll("[id*='DownCB']");
        CONTEXT_AF.button = document.querySelectorAll("[id*='buttonCB']");
        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.socket    = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            //updates rover with part that has been placed by other player
            CONTEXT_AF.socket.on("increaseNumberEvent", function(data){

                console.log('on increaseNumberEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                increaseNumber(data.ParentID);


                
            });

                        //looping through all possible puzzleObjects
            for(let i=0; i < CONTEXT_AF.increaseNumber.length; i++){
                
                let increaseNumberCurrent = CONTEXT_AF.increaseNumber[i];

                console.log('increaseNumberButton: ', increaseNumberCurrent.id);
                
                //add event liseners for rovers
                increaseNumberCurrent.addEventListener('increaseNumberForAll', function(e){
                    
                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit increaseNumberEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socket.emit("increaseNumberEvent", {ParentID:e.detail.DataParentID, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }
            //updates rover with part that has been placed by other player
            CONTEXT_AF.socket.on("decreaseNumberEvent", function(data){

                console.log('on decreaseNumberEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                decreaseNumber(data.ParentID);

                
            });

                        //looping through all possible puzzleObjects
            for(let i=0; i < CONTEXT_AF.decreaseNumber.length; i++){
                
                let decreaseNumberCurrent = CONTEXT_AF.decreaseNumber[i];

                console.log('decreaseNumberButton: ', decreaseNumberCurrent.id);
                
                //add event liseners for rovers
                decreaseNumberCurrent.addEventListener('decreaseNumberForAll', function(e){
                    
                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit decreaseNumberEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socket.emit("decreaseNumberEvent", {ParentID:e.detail.DataParentID, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }

            CONTEXT_AF.socket.on("buttonPressedEventCB", function(data){

                console.log('on buttonPressedEventCB !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                

                checkComboCorrect();
                
            });

            for(let i=0; i < CONTEXT_AF.button.length; i++){
                
                let mainButton = CONTEXT_AF.button[i];

                console.log('buttonCB: ', mainButton.id);
                
                //add event liseners for rovers
                mainButton.addEventListener('buttonPressedCB', function(e){
                    
                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit buttonPressedEventCB !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socket.emit("buttonPressedEventCB", {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }

        });

    }
});
