//class for each part's info
class partInfo {
    constructor(partID, holding, roverPos, holdingPos){
        this.partID     = partID;
        this.holding    = holding; 
        this.roverPos   = roverPos; 
        this.holdingPos = holdingPos;
    }
}

//sojourner part info
const soj_wheel = new partInfo("sj_part_wheel_00", false, {x:0.438, y:0.17, z:0.3}, {x:-0.6, y:-0.2, z:-0.5});
const test_part = new partInfo("test_part_01", false, {x:1, y:1, z:1}, {x:-0.6, y:-0.2, z:-0.5});

//array of parts
let roverParts = [soj_wheel, test_part];

//component that should be on all parts that a player can hold
AFRAME.registerComponent('wield', {
    init:function(){

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(){

            let pCam = document.getElementById("Player1Cam");   //getting player's camera
            let scene = document.querySelector("a-scene");      //getting scene

            //check if the player is already holding something
            if(isHolding().holding){

                //get the part that is in the player's hand
                let inHand = pCam.querySelector("[id*='part']");
                let partSwap = inHand.cloneNode(true);

                //remove the part and make a clone at the position of the item that has been picked up (essentially swap the part and what's in the player's hand)
                inHand.remove();
                let thisPos = this.getAttribute("position");
                partSwap.setAttribute("position", {x:thisPos.x, y:thisPos.y, z:thisPos.z});

                //turn back on interactive features
                partSwap.setAttribute("circles-interactive-object", {enabled:true});

                //add part back to the scene
                scene.appendChild(partSwap);

            }
            
            //always add the object to the player's hand
            let partIdx = Number(this.id.slice(-2));       //getting part info index based off of id
            adoptPart(pCam, partIdx, false);               //making the object a child of the player camera
    
            this.emit('playerGrab', null, false);    //call update for other players
            
        });

    }
});

//component that should be on all parts that a player can hold
AFRAME.registerComponent('rover', {
    init:function(){

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(){

            let holdingInfo = isHolding(); //get player holding info

            //verify that player is holdig a part. we have to assume they can only hold one part
            if(holdingInfo.holding){
                
                //find the part index and call adopt part
                //let partID  = querey.getAttribute("id");
                let partIdx = Number(holdingInfo.id.slice(-2));

                adoptPart(this, partIdx, true);

                //update other players of the event
                this.emit('partPlaced', null, false);

            }

        });

    }
});

//returns true and part id if local player is holding an object. assumes that they can only hold one part
function isHolding(){
    let pCam = document.getElementById("Player1Cam");       //get player camera
    let partList = pCam.querySelectorAll("[id*='part']");   //get list of parts that are children of camera

    if(partList.length > 0){
        return {holding:true, id:partList[0].getAttribute("id")};
    } else {
        return {holding:false, id:null};
    }
}

//function used for when a player picks up an object. It is expect that they can only hold one object at a time
/*
function pickup(holdParent, partObj){
    
    let scene = document.querySelector("a-scene");      //getting scene

    //check if the player is already holding something
    if(isHolding().holding){

        //get the part that is in the player's hand
        let inHand      = holdParent.querySelector("[id*='part']");
        let partSwap    = inHand.cloneNode(true);

        //remove the part and make a clone at the position of the item that has been picked up (essentially swap the part and what's in the player's hand)
        inHand.remove();
        let thisPos = partObj.getAttribute("position");
        partSwap.setAttribute("position", {x:thisPos.x, y:thisPos.y, z:thisPos.z});

        //turn back on interactive features
        partSwap.setAttribute("circles-interactive-object", {enabled:true});

        //add part back to the scene
        scene.appendChild(partSwap);

    }
    
    //always add the object to the player's hand
    let partIdx = Number(partObj.id.slice(-2));       //getting part info index based off of id
    adoptPart(pCam, partIdx, false);               //making the object a child of the player camera
}*/

//makes a given element a parent of a given rover part. Changes position based off the new parent
//toRover: True = parent is the rover | false = parent is to player
function adoptPart(parent, objIdx, toRover){
    
    //get part information
    let childInfo = roverParts[objIdx];

    //find part, clone it, then delete it
    let child   = document.getElementById(childInfo.partID);
    let newChild = child.cloneNode(true);
    child.remove();

    //apply offset position and append to the parent
    if(toRover){
        newChild.setAttribute("position", childInfo.roverPos);
    } else {
        newChild.setAttribute("position", childInfo.holdingPos);
        newChild.setAttribute("circles-interactive-object", {enabled:false});
    }
    
    parent.appendChild(newChild);

    console.log("adopted");

}