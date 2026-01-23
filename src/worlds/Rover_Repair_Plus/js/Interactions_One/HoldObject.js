//class for object's info
class objectInfo {
    constructor(objectID, holding, holdingPos, requiredSpot, isInTheRequiredSpot) {
        this.objectID = objectID;
        this.holding = holding;
        this.holdingPos = holdingPos;
        this.requiredSpot = requiredSpot;
        this.isInTheRequiredSpot = isInTheRequiredSpot;
    }
}

//puzzle object info. Ensure that objectId matches entity id so that references work
const greenObject_01 = new objectInfo("greenObject_01", false, { x: -0.6, y: -0.2, z: -0.5 }, "placementspots_green", false);
const redObject_01 = new objectInfo("redObject_01", false, { x: -0.6, y: -0.2, z: -0.5 }, "placementspots_red", false);
const blueObject_01 = new objectInfo("blueObject_01", false, { x: -0.6, y: -0.2, z: -0.5 }, "placementspots_blue", false);


//array of objects
let puzzleObjects = [greenObject_01, redObject_01, blueObject_01];

function adoptObject(parentID, childID, toPlaceHolder) { //handles object being placed/ picked up
    console.log("adopting part", parentID, childID, toPlaceHolder)

    //get part information
    let childInfo = null;
    for (let i = 0; puzzleObjects.length > i; i++) {
        if (puzzleObjects[i].objectID == childID) {
            childInfo = puzzleObjects[i];
            break;
        }
    }
    if (childInfo != null) {
        console.log(childInfo);

        let child = document.getElementById(childInfo.objectID);
        let parent = document.getElementById(parentID);

        if (toPlaceHolder === true) {
            console.log(parent.id);

            parent.object3D.attach(child.object3D);
            child.object3D.position.set(0, 0, 0);
            child.object3D.rotation.set(0, 0, 0);
            child.object3D.scale.set(1.1, 1.1, 1.1);

            if (childInfo.requiredSpot == parent.id) {
                childInfo.isInTheRequiredSpot = true;
            } else {
                childInfo.isInTheRequiredSpot = false;
            }

            console.log(childInfo.objectID, childInfo.isInTheRequiredSpot);


        } else {
            childInfo.isInTheRequiredSpot = false;
        }

        console.log("adopted");
    }

}

function checkPlacements() { // parse through object array to see if all objects are in the correct position
    for (let i = 0; puzzleObjects.length > i; i++) {
        if (puzzleObjects[i].isInTheRequiredSpot == false) {
            return false // if one is found flase, return false
        }

    }
    return true // reached the end of the array, therefore all objects in the correct spots.
}

function puzzleAlreadySolved() { // Force set all puzzleObjects[i].isInTheRequiredSpot to be true since puzzle is solved
    for (let i = 0; puzzleObjects.length > i; i++) {
        puzzleObjects[i].isInTheRequiredSpot = true;

    }
}

function getInAllReqiredSpots() { // for syncing 
    let booleanArry = new Array();
    for (let i = 0; puzzleObjects.length > i; i++) {
        booleanArry.push(puzzleObjects[i].isInTheRequiredSpot);

    }
    return booleanArry;
}

function setInAllRequiredSpots(booleanArray) { // for syncing 
    for (let i = 0; puzzleObjects.length > i; i++) {
        puzzleObjects[i].isInTheRequiredSpot = booleanArray[i];

    }
}

