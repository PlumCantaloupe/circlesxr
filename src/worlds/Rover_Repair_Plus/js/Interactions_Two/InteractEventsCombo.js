//class for object's info
class deleteObjectInfoCombo {
    constructor(objectID) {
        this.objectID = objectID;
    }
}

// ensure that entity id matches deleteObjectInfo so that it can be referenced properly
const deleteCombo1 = new deleteObjectInfoCombo("delete1Combo");
let deleteComboObjects = [deleteCombo1];

//button is an interactable entity that checks to see if all objects are at the correct number
AFRAME.registerComponent('checkcombobutton', {
    init: function () {

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function () {
            checkComboCorrect();
            console.log('buttonPressedCB emit');
            CONTEXT_AF.el.emit('buttonPressedCB', {}, false);



        });

    }

});

function checkComboCorrect() {
    let allCorrectNumber = checkIfCorrectCode(); // check if objects have correct number
    console.log(allCorrectNumber);
    if (allCorrectNumber == true) { // if true do something (Code within if statement will be executed. Can be changed for more functionality or added on too | Currently jsut deletes objects like a door)
        for (let i = 0; deleteComboObjects.length > i; i++) {
            //Added functionality here if required
            let currentDeleteObject = document.getElementById(deleteComboObjects[i].objectID);
            currentDeleteObject.remove();
            console.log("ObjectDeleted");
        }
        managerSetPuzzle2Solved();
        deleteComboObjects = []; // clear list to avoid errors
        //Add any other logic below this comment
    }
}