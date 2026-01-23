//class for object's info
class deleteObjectPicInfo {
    constructor(objectID) {
        this.objectID = objectID;
    }
}

// ensure that entity id matches deleteObjectInfo so that it can be referenced properly
const delete1pic = new deleteObjectPicInfo("delete1pic");
let deletePicObjects = [delete1pic];

//button is an interactable entity that checks to see if all objects are in the correct placementspots
AFRAME.registerComponent('buttonpic', {
    init: function () {

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function (data) {

            checkPictures();
            console.log('buttonPicPressed emit');
            CONTEXT_AF.el.emit('buttonPicPressed', {}, false);


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
            managerSetPuzzle3Solved();
        }
        deletePicObjects = []; // clear list to avoid errors
    }
}