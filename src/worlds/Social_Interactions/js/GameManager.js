// helper variables to ensure that new players, late joiners, and reconnected players are synced to the rest of the game.
let puzzle1solved = false;
let puzzle2solved = false;
let puzzle3solved = false;
let puzzle1Caughtup = false;
let puzzle2Caughtup = false;
let puzzle3Caughtup = false;


function managerSetPuzzle1Solved() {
    puzzle1solved = true;
}
function managerSetPuzzle2Solved() {
    puzzle2solved = true;
}
function managerSetPuzzle3Solved() {
    puzzle3solved = true;
}

AFRAME.registerComponent('gamemanager', {
    init: function () {

        //setting up socket.io connections
        CONTEXT_AF = this;
        CONTEXT_AF.socketSocialEvent = null;
        CONTEXT_AF.connectedSocialEvent = false;
        CONTEXT_AF.lateJoiner = true;

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

            CONTEXT_AF.socketSocialEvent.on("objectPlacedEvent", function (data) {

                console.log('on objectPlacedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');


                adoptObject(data.dataId, data.pickUpId, true);

            });

            //looping through all possible puzzleObjects
            for (let i = 0; i < CONTEXT_AF.puzzleObjects.length; i++) {

                let placementspotsCurrent = CONTEXT_AF.puzzleObjects[i];

                console.log('placementspots: ', placementspotsCurrent.id);

                //add event liseners for rovers
                placementspotsCurrent.addEventListener('objectPlaced', function (e) {

                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit objectPlacedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("objectPlacedEvent", { dataId: e.detail.dataID, pickUpId: e.detail.pickUpID, room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
                });
            }

            CONTEXT_AF.socketSocialEvent.on("buttonPressedEvent", function (data) {

                console.log('on buttonPressedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

                deleteAllObjects();

            });

            for (let i = 0; i < CONTEXT_AF.buttonPS.length; i++) {

                let mainButton = CONTEXT_AF.buttonPS[i];

                console.log('buttonPS: ', mainButton.id);

                //add event liseners for rovers
                mainButton.addEventListener('buttonPressed', function (e) {

                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit buttonPressedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("buttonPressedEvent", { room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
                });
            }

            //PLACEMENTSPOTS EVENT END ------------------------------------------------------------------------------------------------------------------------------------------------

            //NUMCOMBO EVENT ----------------------------------------------------------------------------------------------------------------------------------------------------------

            CONTEXT_AF.socketSocialEvent.on("increaseNumberEvent", function (data) {

                console.log('on increaseNumberEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                increaseNumber(data.ParentID);



            });

            //looping through all possible puzzleObjects
            for (let i = 0; i < CONTEXT_AF.increaseNumber.length; i++) {

                let increaseNumberCurrent = CONTEXT_AF.increaseNumber[i];

                console.log('increaseNumberButton: ', increaseNumberCurrent.id);

                //add event liseners for rovers
                increaseNumberCurrent.addEventListener('increaseNumberForAll', function (e) {

                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit increaseNumberEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("increaseNumberEvent", { ParentID: e.detail.DataParentID, room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
                });
            }

            CONTEXT_AF.socketSocialEvent.on("decreaseNumberEvent", function (data) {

                console.log('on decreaseNumberEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                decreaseNumber(data.ParentID);


            });

            //looping through all possible puzzleObjects
            for (let i = 0; i < CONTEXT_AF.decreaseNumber.length; i++) {

                let decreaseNumberCurrent = CONTEXT_AF.decreaseNumber[i];

                console.log('decreaseNumberButton: ', decreaseNumberCurrent.id);

                //add event liseners for rovers
                decreaseNumberCurrent.addEventListener('decreaseNumberForAll', function (e) {

                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit decreaseNumberEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("decreaseNumberEvent", { ParentID: e.detail.DataParentID, room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
                });
            }

            CONTEXT_AF.socketSocialEvent.on("buttonPressedEventCB", function (data) {

                console.log('on buttonPressedEventCB !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');


                checkComboCorrect();

            });

            for (let i = 0; i < CONTEXT_AF.buttonCB.length; i++) {

                let mainButton = CONTEXT_AF.buttonCB[i];

                console.log('buttonCB: ', mainButton.id);

                //add event liseners for rovers
                mainButton.addEventListener('buttonPressedCB', function (e) {

                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit buttonPressedEventCB !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("buttonPressedEventCB", { room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
                });
            }

            //NUMCOMBO EVENT END ------------------------------------------------------------------------------------------------------------------------------------------------------

            //PICTURE EVENT -----------------------------------------------------------------------------------------------------------------------------------------------------------
            CONTEXT_AF.socketSocialEvent.on("objectPicturePlacedEvent", function (data) {

                console.log('on objectPicturePlacedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');


                adoptPictureObject(data.dataId, data.pickUpId, true);

            });

            //looping through all possible puzzleObjects
            for (let i = 0; i < CONTEXT_AF.pictureObject.length; i++) {

                let picturespotsCurrent = CONTEXT_AF.pictureObject[i];

                console.log('picturespots: ', picturespotsCurrent.id);

                //add event liseners for rovers
                picturespotsCurrent.addEventListener('objectPicturePlaced', function (e) {

                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit objectPlacedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("objectPicturePlacedEvent", { dataId: e.detail.dataID, pickUpId: e.detail.pickUpID, room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
                });
            }

            CONTEXT_AF.socketSocialEvent.on("buttonPicPressedEvent", function (data) {

                console.log('on buttonPicPressedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');


                checkPictures();

            });

            for (let i = 0; i < CONTEXT_AF.buttonPic.length; i++) {

                let mainButton = CONTEXT_AF.buttonPic[i];

                console.log('buttonPic: ', mainButton.id);

                //add event liseners for rovers
                mainButton.addEventListener('buttonPicPressed', function (e) {

                    //find the player who place the object and call the socket function
                    //let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    console.log('emit buttonPicPressedEvent !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    CONTEXT_AF.socketSocialEvent.emit("buttonPicPressedEvent", { room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
                });
            }
            //if someone else requests our sync data, we send it.
            CONTEXT_AF.socketSocialEvent.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function (data) {
                //if the same world as the one requesting (remember, in Circles you can connect with others in different worlds)
                if (data.world === CIRCLES.getCirclesWorldName()) {
                    console.log("YES")
                    //CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {campfireON:CONTEXT_AF.fireOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            });
            CONTEXT_AF.socketSocialEvent.on("catchUpPuzzle1", function (data) {

                console.log('on catchUpPuzzle1 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                console.log('Recieved update from', data.sender);
                if (puzzle1Caughtup == true) return;

                puzzle1Caughtup = true;
                if (data.isPuzzle1Solved) {
                    console.log("Puzzle 1 is solved");
                    puzzleAlreadySolved(); // if puzzle is solved assume all object are in place for late joiner
                    deleteAllObjects();
                    setInAllRequiredSpots(data.currentPuzzle1State); // update to proper values
                } else {
                    console.log("Puzzle 1 is not solved");
                    console.log(data.currentPuzzle1State);
                    setInAllRequiredSpots(data.currentPuzzle1State); // if puzzle not solve, update if objects are in correct spot
                }

            });
            CONTEXT_AF.socketSocialEvent.on("catchUpPuzzle2", function (data) {

                console.log('on catchUpPuzzle2 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                console.log('Recieved update from', data.sender);
                if (puzzle2Caughtup == true) return;

                puzzle2Caughtup = true;
                if (data.isPuzzle2Solved) {
                    console.log("Puzzle 2 is solved");
                    puzzleComboAlreadySolved(); // if puzzle is solved assume all numbers are correct for late joiner
                    checkComboCorrect();
                    setCurrentNumber(data.currentPuzzle2State); // update to proper values
                } else {
                    console.log("Puzzle 2 is not solved");
                    console.log(data.currentPuzzle2State);
                    setCurrentNumber(data.currentPuzzle2State); // if puzzle not solve, update if objects are in correct spot
                }

            });

            CONTEXT_AF.socketSocialEvent.on("catchUpPuzzle3", function (data) {

                console.log('on catchUpPuzzle3 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                console.log('Recieved update from', data.sender);
                if (puzzle3Caughtup == true) return;

                puzzle3Caughtup = true;
                if (data.isPuzzle3Solved) {
                    console.log("Puzzle 3 is solved");
                    puzzlePictureAlreadySolved(); // if puzzle is solved assume all numbers are correct for late joiner
                    checkPictures();
                    setPictureisInTheRequiredSpot(data.currentPuzzle3State); // update to proper values
                } else {
                    console.log("Puzzle 3 is not solved");
                    console.log(data.currentPuzzle3State);
                    setPictureisInTheRequiredSpot(data.currentPuzzle3State); // if puzzle not solve, update if objects are in correct spot
                }

            });

            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.USER_CONNECTED, function (e) {
                console.log("Player", e.detail);
                if (CONTEXT_AF.lateJoiner == false) { // check if later joiner, if false means player who is triggered by this event listener is not a late joiner
                    console.log('messaging from', CONTEXT_AF.socketSocialEvent.id);
                    //Puzzle1 catch up
                    currentObjectPlacements = getInAllReqiredSpots();
                    if (currentObjectPlacements != null) {
                        CONTEXT_AF.socketSocialEvent.emit("catchUpPuzzle1", { currentPuzzle1State: currentObjectPlacements, isPuzzle1Solved: puzzle1solved, sender: CONTEXT_AF.socketSocialEvent.id, room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
                    }
                    currentNumbers = getCurrentNumber();
                    if (currentNumbers != null){
                        CONTEXT_AF.socketSocialEvent.emit("catchUpPuzzle2", { currentPuzzle2State: currentNumbers, isPuzzle2Solved: puzzle2solved, sender: CONTEXT_AF.socketSocialEvent.id, room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });

                    }
                    currentPicturePlacements = getPictureisInTheRequiredSpot();
                    if (currentPicturePlacements != null){
                        CONTEXT_AF.socketSocialEvent.emit("catchUpPuzzle3", { currentPuzzle3State: currentPicturePlacements, isPuzzle3Solved: puzzle3solved, sender: CONTEXT_AF.socketSocialEvent.id, room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });

                    }
                }
                CONTEXT_AF.lateJoiner = false; // player caught up, no longer a late joiners
            });

            


        });

    }
});
