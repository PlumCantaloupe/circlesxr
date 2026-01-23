//class for object's info
class deleteObjectInfo {
    constructor(objectID){
        this.objectID   = objectID;
    }
}
// class for object text reference
class screenTextPuzzle1Info {
    constructor(screenTextID){
        this.screenTextID   = screenTextID;
    }
}


// ensure that entity id matches deleteObjectInfo so that it can be referenced properly
const delete1 = new deleteObjectInfo("delete1");
let deleteObjects = [delete1];

// screen text for user feedback
const screenTextPlacement1 = new screenTextPuzzle1Info("ScreenTextPlacementSpot");
let mainScreenPuzzle1 = [screenTextPlacement1];

//button is an interactable entity that checks to see if all objects are in the correct placementspots
AFRAME.registerComponent('button', {
    init:function(){

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(data){

            deleteAllObjects();
            console.log('buttonPressed emit');
            CONTEXT_AF.el.emit('buttonPressed', {}, false); // for syncing
            

        });

    }
    
});

// deleteAllObject() function basically checks to see if the puzzle is solve, and then execute some code
function deleteAllObjects(){
    let allInCorrectPositions = checkPlacements(); // check if objects are in placementspots
        if(allInCorrectPositions == true){ // if true do something (Code within if statement will be executed. Can be changed for more functionality or added on too | Currently jsut deletes objects like a door)
            for(let i = 0; deleteObjects.length > i; i++){
                //Added functionality here if required
                let currentDeleteObject = document.getElementById(deleteObjects[i].objectID);
                currentDeleteObject.remove();
                console.log("ObjectDeleted");
            }
            Puzzle1SolvedUpdateScreens(); // updateScreens
            managerSetPuzzle1Solved();
            deleteObjects = []; // clear list to avoid errors
        }else{
            //add any other logic below this comment. This is if puzzle is solved (suggestion a sound effect)
        }
}

function Puzzle1SolvedUpdateScreens(){ // updates the screen
    for(let i = 0; mainScreenPuzzle1.length > i; i++){
        let screentext = document.getElementById(mainScreenPuzzle1[i].screenTextID);
        screentext.setAttribute('text', 'value', "All Objects Found!"); // Change text
        screentext.setAttribute('text', 'color', "rgb(0, 255, 0)"); // Change colour
    }
}