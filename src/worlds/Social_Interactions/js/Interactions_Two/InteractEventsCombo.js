//class for delete object's info
class deleteObjectInfoCombo {
    constructor(objectID) {
        this.objectID = objectID;
    }
}

// class for screen text reference
class screenTextPuzzle2Info {
    constructor(screenTextID){
        this.screenTextID   = screenTextID;
    }
}


// ensure that entity id matches deleteObjectInfoCombo so that it can be referenced properly
const deleteCombo1 = new deleteObjectInfoCombo("delete1Combo");
let deleteComboObjects = [deleteCombo1];

// screen text for user feedback
const screenTextCombo1 = new screenTextPuzzle2Info("ScreenTextCombo");
let mainScreenPuzzle2 = [screenTextCombo1];

//button is an interactable entity that checks to see if all objects are at the correct number
AFRAME.registerComponent('checkcombobutton', {
    init: function () {

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function () {
            checkComboCorrect();
            console.log('buttonPressedCB emit');
            CONTEXT_AF.el.emit('buttonPressedCB', {}, false); // for syncing



        });

    }

});
// checks to see if the combaination is correct, if so, execute functions
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
        Puzzle2SolvedUpdateScreens();
        deleteComboObjects = []; // clear list to avoid errors
        //Add any other logic below this comment
    }else{
        //add any other logic below this comment. This is if puzzle is solved (suggestion a sound effect)
    }
}

function Puzzle2SolvedUpdateScreens(){ // updates text
    for(let i = 0; mainScreenPuzzle2.length > i; i++){
        let screentext = document.getElementById(mainScreenPuzzle2[i].screenTextID); 
        screentext.setAttribute('text', 'value', "Correct Code!"); // change text
        screentext.setAttribute('text', 'color', "rgb(0, 255, 0)"); // change colour
    }
}