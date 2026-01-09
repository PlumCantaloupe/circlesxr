AFRAME.registerComponent('gamemanager', {
    init: function(){
        
        //setting up socket.io connections
        CONTEXT_AF = this;
        CONTEXT_AF.socketSocialEvent = null;
        CONTEXT_AF.connectedSocialEvent = false;

        //Placement info
        CONTEXT_AF.puzzleObjects = document.querySelectorAll("[id*='placementspots']");
        CONTEXT_AF.buttonPS = document.querySelectorAll("[id*='buttonPS']");

        //Combo info
        CONTEXT_AF.increaseNumber = document.querySelectorAll("[id*='UpCB']");
        CONTEXT_AF.decreaseNumber = document.querySelectorAll("[id*='DownCB']");
        CONTEXT_AF.buttonCB = document.querySelectorAll("[id*='buttonCB']");

        //Picture info
        CONTEXT_AF.pictureObject = document.querySelectorAll("[id*='picturespots']");
        CONTEXT_AF.buttonPic = document.querySelectorAll("[id*='buttonPic']");

        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.socketSocialEvent = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connectedSocialEvent = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socketSocialEvent.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());
            
            //PLACEMENTSPOTS EVENT ----------------------------------------------------------------------------------------------------------------------------------------------------
            
            CONTEXT_AF.socketSocialEvent.on("objectPlacedEvent", function(data){

                console.log('on objectPlacedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                

                adoptObject(data.dataId, data.pickUpId, true);
                
            });

                        //looping through all possible puzzleObjects
            for(let i=0; i < CONTEXT_AF.puzzleObjects.length; i++){
                
                let placementspotsCurrent = CONTEXT_AF.puzzleObjects[i];

                console.log('placementspots: ', placementspotsCurrent.id);
                
                //add event liseners for rovers
                placementspotsCurrent.addEventListener('objectPlaced', function(e){
                    
                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit objectPlacedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("objectPlacedEvent", {dataId:e.detail.dataID, pickUpId:e.detail.pickUpID, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }

            CONTEXT_AF.socketSocialEvent.on("buttonPressedEvent", function(data){

                console.log('on buttonPressedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                

                deleteAllObjects();
                
            });
 
            for(let i=0; i < CONTEXT_AF.buttonPS.length; i++){
                
                let mainButton = CONTEXT_AF.buttonPS[i];

                console.log('buttonPS: ', mainButton.id);
                
                //add event liseners for rovers
                mainButton.addEventListener('buttonPressed', function(e){
                    
                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit buttonPressedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("buttonPressedEvent", {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }

            //PLACEMENTSPOTS EVENT END ------------------------------------------------------------------------------------------------------------------------------------------------

            //NUMCOMBO EVENT ----------------------------------------------------------------------------------------------------------------------------------------------------------
            
            CONTEXT_AF.socketSocialEvent.on("increaseNumberEvent", function(data){

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
                    CONTEXT_AF.socketSocialEvent.emit("increaseNumberEvent", {ParentID:e.detail.DataParentID, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }
            
            CONTEXT_AF.socketSocialEvent.on("decreaseNumberEvent", function(data){

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
                    CONTEXT_AF.socketSocialEvent.emit("decreaseNumberEvent", {ParentID:e.detail.DataParentID, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }

            CONTEXT_AF.socketSocialEvent.on("buttonPressedEventCB", function(data){

                console.log('on buttonPressedEventCB !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                

                checkComboCorrect();
                
            });

            for(let i=0; i < CONTEXT_AF.buttonCB.length; i++){
                
                let mainButton = CONTEXT_AF.buttonCB[i];

                console.log('buttonCB: ', mainButton.id);
                
                //add event liseners for rovers
                mainButton.addEventListener('buttonPressedCB', function(e){
                    
                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit buttonPressedEventCB !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("buttonPressedEventCB", {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }

            //NUMCOMBO EVENT END ------------------------------------------------------------------------------------------------------------------------------------------------------

            //PICTURE EVENT -----------------------------------------------------------------------------------------------------------------------------------------------------------
            CONTEXT_AF.socketSocialEvent.on("objectPicturePlacedEvent", function(data){

                console.log('on objectPicturePlacedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                

                adoptPictureObject(data.dataId, data.pickUpId, true);
                
            });

                        //looping through all possible puzzleObjects
            for(let i=0; i < CONTEXT_AF.pictureObject.length; i++){
                
                let picturespotsCurrent = CONTEXT_AF.pictureObject[i];

                console.log('picturespots: ', picturespotsCurrent.id);
                
                //add event liseners for rovers
                picturespotsCurrent.addEventListener('objectPicturePlaced', function(e){
                    
                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit objectPlacedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("objectPicturePlacedEvent", {dataId:e.detail.dataID, pickUpId:e.detail.pickUpID, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }

            CONTEXT_AF.socketSocialEvent.on("buttonPicPressedEvent", function(data){

                console.log('on buttonPicPressedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                

                checkPictures();
                
            });
 
            for(let i=0; i < CONTEXT_AF.buttonPic.length; i++){
                
                let mainButton = CONTEXT_AF.buttonPic[i];

                console.log('buttonPic: ', mainButton.id);
                
                //add event liseners for rovers
                mainButton.addEventListener('buttonPicPressed', function(e){
                    
                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit buttonPicPressedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("buttonPicPressedEvent", {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                });
            }


        });

    }
});
