//class for object's info
class objectInfo {
    constructor(objectID, holding, holdingPos, requiredSpot, isInTheRequiredSpot){
        this.objectID   = objectID;
        this.holding    = holding;  
        this.holdingPos = holdingPos;
        this.requiredSpot = requiredSpot;
        this.isInTheRequiredSpot = isInTheRequiredSpot;
    }
}

//sojourner parts info
const greenObject_01 = new objectInfo("greenObject_01", false, {x:-0.6, y:-0.2, z:-0.5}, "green", false);
const redObject_01 = new objectInfo("redObject_01", false, {x:-0.6, y:-0.2, z:-0.5}, "red", false);
const blueObject_01 = new objectInfo("blueObject_01", false, {x:-0.6, y:-0.2, z:-0.5}, "blue", false);


//array of objects
let puzzleObjects = [greenObject_01, redObject_01, blueObject_01];

function adoptObject(parent, childID, toPlaceHolder){
    console.log("adopting part", parent.id, childID, toPlaceHolder)

    //get part information
    let childInfo = null;
    for(let i = 0; puzzleObjects.length > i; i++){
        if(puzzleObjects[i].objectID == childID){
            childInfo = puzzleObjects[i];
            break;
        }
    }
    if(childInfo != null){
        console.log(childInfo);

        //find part, clone it, then delete it
        let child   = document.getElementById(childInfo.objectID);
    
        //let newChild = child.cloneNode(true);
        //child.remove();

        //trigger series of events when added to a rover
        //apply offset position/rotation and append to the parent
        if(toPlaceHolder === true){
            console.log(parent.id);
        
            parent.object3D.attach(child.object3D);
            child.object3D.position.set(0, 0, 0);
            child.object3D.rotation.set(0, 0, 0);
            child.object3D.scale.set(1.1, 1.1, 1.1);

            if(childInfo.requiredSpot == parent.id){
                childInfo.isInTheRequiredSpot = true;
            }else{
                childInfo.isInTheRequiredSpot = false;
            }

            console.log(childInfo.objectID, childInfo.isInTheRequiredSpot);

            //child.setAttribute("position", childInfo.roverPos);
            //child.setAttribute("rotation", childInfo.roverRot);
            //child.setAttribute("circles-interactive-object", {enabled:true});

        } else {
            childInfo.isInTheRequiredSpot = false;
            // child.setAttribute("position", childInfo.holdingPos);
            // child.setAttribute("circles-interactive-object", {enabled:false});
        }
    
        //parent.appendChild(child);

        console.log("adopted");
    }

}

function checkPlacements(){
    for(let i = 0; puzzleObjects.length > i; i++){
        if(puzzleObjects[i].isInTheRequiredSpot == false){
            return false // if one is found flase, return false
        }
    
    }
    return true // reached the end of the array, therefore all objects in the correct spots.

}

/*
function resetValue(childID){
    let childInfo = null;
        for(let i = 0; puzzleObjects.length > i; i++){
            if(puzzleObjects[i].objectID == childID){
                childInfo = puzzleObjects[i];
                break;
            }
        }
        let child  = document.getElementById(childInfo.objectID);
        child.isInTheRequiredSpot = false;
}
*/