//class for object's info
class objectPictureInfo {
    constructor(objectID, holding, holdingPos, requiredSpot, isInTheRequiredSpot){
        this.objectID   = objectID;
        this.holding    = holding;  
        this.holdingPos = holdingPos;
        this.requiredSpot = requiredSpot;
        this.isInTheRequiredSpot = isInTheRequiredSpot;
    }
}

//puzzle object info. Ensure that objectId matches entity id so that references work
const greenPictureObject_01 = new objectPictureInfo("greenPictureObject_01", false, {x:-0.6, y:-0.2, z:-0.5}, "picturespots_green", false);
const redPictureObject_01 = new objectPictureInfo("redPictureObject_01", false, {x:-0.6, y:-0.2, z:-0.5}, "picturespots_red", false);
const bluePictureObject_01 = new objectPictureInfo("bluePictureObject_01", false, {x:-0.6, y:-0.2, z:-0.5}, "picturespots_blue", false);
const yellowPictureObject_01 = new objectPictureInfo("yellowPictureObject_01", false, {x:-0.6, y:-0.2, z:-0.5}, "picturespots_yellow", false);
const purplePictureObject_01 = new objectPictureInfo("purplePictureObject_01", false, {x:-0.6, y:-0.2, z:-0.5}, "picturespots_purple", false);


//array of objects
let puzzlePictureObjects = [greenPictureObject_01, redPictureObject_01, bluePictureObject_01, yellowPictureObject_01, purplePictureObject_01];

function adoptPictureObject(parentID, childID, toPlaceHolder){ // handles object being placed/ picked up
    console.log("adopting part", parentID, childID, toPlaceHolder)

    //get part information
    let childInfo = null;
    for(let i = 0; puzzlePictureObjects.length > i; i++){
        if(puzzlePictureObjects[i].objectID == childID){
            childInfo = puzzlePictureObjects[i];
            break;
        }
    }
    if(childInfo != null){
        console.log(childInfo);

        let child = document.getElementById(childInfo.objectID);
        let parent = document.getElementById(parentID);
    
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


        } else {
            childInfo.isInTheRequiredSpot = false;
        }

        console.log("adopted");
    }

}

function checkPicturePlacements(){ // parse through object array to see if all objects are in the correct position
    for(let i = 0; puzzlePictureObjects.length > i; i++){
        if(puzzlePictureObjects[i].isInTheRequiredSpot == false){
            return false // if one is found flase, return false
        }

    }
    return true // reached the end of the array, therefore all objects in the correct spots.
}
