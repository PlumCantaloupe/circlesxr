//class for object's info
class deleteObjectInfo {
    constructor(objectID){
        this.objectID   = objectID;
    }
}
class screenTextInfo {
    constructor(screenTextID){
        this.screenTextID   = screenTextID;
    }
}


// ensure that entity id matches deleteObjectInfo so that it can be referenced properly
const delete1 = new deleteObjectInfo("delete1");
let deleteObjects = [delete1];

const screenText1 = new screenTextInfo("ScreenTextPlacementSpot");
let mainScreen = [screenText1];

//button is an interactable entity that checks to see if all objects are in the correct placementspots
AFRAME.registerComponent('button', {
    init:function(){

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(data){

            deleteAllObjects();
            console.log('buttonPressed emit');
            CONTEXT_AF.el.emit('buttonPressed', {}, false);
            

        });

    }
    
});

function deleteAllObjects(){
    let allInCorrectPositions = checkPlacements(); // check if objects are in placementspots
        if(allInCorrectPositions == true){ // if true do something (Code within if statement will be executed. Can be changed for more functionality or added on too | Currently jsut deletes objects like a door)
            for(let i = 0; deleteObjects.length > i; i++){
                //Added functionality here if required
                let currentDeleteObject = document.getElementById(deleteObjects[i].objectID);
                currentDeleteObject.remove();
                console.log("ObjectDeleted");
            }
            PuzzleSolved();
            deleteObjects = []; // clear list to avoid errors
        }
}

function PuzzleSolved(){
    console.log("YUP1");
    for(let i = 0; mainScreen.length > i; i++){
        let screentext = document.getElementById(mainScreen[i].screenTextID);
        screentext.setAttribute('text', 'value', "Power: Online");
        screentext.setAttribute('text', 'color', "rgb(0, 255, 0)");
    }
}