//class for delete object's info
class deleteObjectPicInfo {
    constructor(objectID) {
        this.objectID = objectID;
    }
}
// class for screen text reference
class screenTextPuzzle3Info {
    constructor(screenTextID){
        this.screenTextID   = screenTextID;
    }
}

// ensure that entity id matches deleteObjectInfo so that it can be referenced properly
const delete1pic = new deleteObjectPicInfo("delete1pic");
let deletePicObjects = [delete1pic];

// screen text for user feedback
const screenTextPicture1 = new screenTextPuzzle1Info("ScreenTextPicture");
let mainScreenPuzzle3 = [screenTextPicture1];

//button is an interactable entity that checks to see if all objects are in the correct placementspots
AFRAME.registerComponent('buttonpic', {
    init: function () {

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function (data) {

            checkPictures();
            console.log('buttonPicPressed emit');
            CONTEXT_AF.el.emit('buttonPicPressed', {}, false); // for syncing


        });

    }

});

function checkPictures() {
    let allInCorrectPositions = checkPicturePlacements(); // check if objects are in placementspots
    if (allInCorrectPositions == true) { // if true do something (Code within if statement will be executed. Can be changed for more functionality or added on too | Currently jsut deletes objects like a door)
        for (let i = 0; deletePicObjects.length > i; i++) {
            //Added functionality here if required
            let currentDeleteObject = document.getElementById(deletePicObjects[i].objectID);
            currentDeleteObject.remove();
            console.log("ObjectDeleted");
        }
        managerSetPuzzle3Solved();
        Puzzle3SolvedUpdateScreens();
        deletePicObjects = []; // clear list to avoid errors
        // add any other logic below this comment. This is if puzzle is solved
    }else{
        //add any other logic below this comment. This is if puzzle is solved (suggestion a sound effect)

    }
}
// update the screen text
function Puzzle3SolvedUpdateScreens(){
    for(let i = 0; mainScreenPuzzle3.length > i; i++){
        let screentext = document.getElementById(mainScreenPuzzle3[i].screenTextID);
        screentext.setAttribute('text', 'value', "Picture Completed!"); // change text
        screentext.setAttribute('text', 'color', "rgb(0, 255, 0)"); // change colour
    }
}