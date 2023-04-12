//class for each part's info
class partInfo {
    constructor(partID, holoID, holding, roverPos, holdingPos, roverRot, roverQuip){
        this.partID     = partID;
        this.holoID     = holoID;
        this.holding    = holding; 
        this.roverPos   = roverPos; 
        this.holdingPos = holdingPos;
        this.roverRot   = roverRot;
        this.roverQuip  = roverQuip;
    }
}

//sojourner part info
const soj_wheel = new partInfo("sj_part_wheel_00", "h_base_00", false, {x:0.438, y:0.17, z:0.3}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:180, z:0}, 
"You found my tires. And all six to boot! I lost those ages ago, thanks pal. I guess you’re not so bad.");
const test_part = new partInfo("test_part_01", "h_base_00", false, {x:1, y:1, z:1}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:180, z:0}, 
"Would you look at that, you even found my Alpha Proton X-Ray Spectrometer! Thanks for putting in all the work, I like your spunk. You’re only missing one more part, I believe in you.");
const test_part2 = new partInfo("test_part_02", "h_base_00", false, {x:-1, y:1, z:1}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:180, z:0}, 
"Amazing! You found my camera! That was the last part, you got me all fixed up! I look 20 years younger!");

//other rover info part

//other rover info part

//array of parts
let roverParts = [soj_wheel, test_part, test_part2];

//component that should be on all parts that a player can hold
AFRAME.registerComponent('wield', {
    init:function(){

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(){

            let pCam = document.getElementById("Player1Cam");   //getting player's camera
            pickup(pCam, this.id);                              //call the pick up function to place the object in the player's hand
            this.emit('playerGrab');                            //emit playerGrab to update object for other players

        });

        //event listner for networking/multi-user interactions
        this.el.addEventListener('playerGrab', function(){

            //getting correct variables to send
            let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
            let partId = this.id;

            //send message to other users that a part is being held
            CONTEXT_AF.socket.emit('partHoldEvent', {partId:partId, pnID:playerNetId, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
        });

    }
});

//returns true and part id if the suspect is holding an object. assumes that they can only hold one part
function isHolding(suspect){
    //let pCam = document.getElementById(suspect);       //get player camera
    //let partList = pCam.querySelectorAll("[id*='part']");   //get list of parts that are children of camera

    let partList = suspect.querySelectorAll("[id*='part']"); 

    if(partList.length > 0){
        return {holding:true, id:partList[0].getAttribute("id")};
    } else {
        return {holding:false, id:null};
    }
}

//function used for when a player picks up an object. It is expect that they can only hold one object at a time
function pickup(holdParent, partId){
    
    //let scene = document.querySelector("a-scene");      //getting scene
    let parent = null;
    let part = document.getElementById(partId);

    //check if the player is already holding something
    if(isHolding(holdParent).holding){

        //get the part that is in the player's hand
        let inHand      = holdParent.querySelector("[id*='part']");
        let partSwap    = inHand.cloneNode(true);

        //remove the part and make a clone at the position of the item that has been picked up (essentially swap the part and what's in the player's hand)
        inHand.remove();                                                                //remove the item in the player's hand
        let thisPos = part.getAttribute("position");                                    //get the position of the item clicked on
        partSwap.setAttribute("position", {x:thisPos.x, y:thisPos.y, z:thisPos.z});     //place the clone of the item that was in the players hand at the position

        //turn back on interactive features
        partSwap.setAttribute("circles-interactive-object", {enabled:true});

        //see if the parent was a drawer
        let partParent = part.parentElement.id;
        if(partParent.search("drawer") != -1 || partParent.search("printer") != -1){
            //add part to drawer
            parent = document.getElementById(partParent);
        } else {
            //add part back to the scene
            parent = document.getElementById("a-scene");
        }

        //add swapped item to the scene through it's relative parent
        parent.appendChild(partSwap);

    }
    
    //always add the object to the player's hand
    let partIdx = Number(partId.slice(-2));       //getting part info index based off of id
    adoptPart(holdParent, partIdx, false);               //making the object a child of the player camera
}

//makes a given element a parent of a given rover part. Changes position based off the new parent
//toRover: True = parent is the rover | false = parent is to player
function adoptPart(parent, objIdx, toRover){
    
    //get part information
    let childInfo = roverParts[objIdx];

    //find part, clone it, then delete it
    let child   = document.getElementById(childInfo.partID);
    let newChild = child.cloneNode(true);
    child.remove();

    //trigger series of events when added to a rover
    //apply offset position/rotation and append to the parent
    if(toRover){
        newChild.setAttribute("position", childInfo.roverPos);
        newChild.setAttribute("rotation", childInfo.roverRot);

        //find the correct hologram to update
        let holo = document.getElementById(childInfo.holoID);
        holo.emit("partPlaced");

        //get the text of ther rover and update it with the special dialogue
        let roverText = parent.querySelector("#roverText");
        roverText.setAttribute("circles-description", {description_text_front:childInfo.roverQuip});

    } else {
        newChild.setAttribute("position", childInfo.holdingPos);
        newChild.setAttribute("circles-interactive-object", {enabled:false});
    }
    
    parent.appendChild(newChild);

    console.log("adopted");

}