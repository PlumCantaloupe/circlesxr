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
const soj_wheel = new partInfo("sj_part_wheel_00", false, {x:1, y:1, z:1}, {x:-0.6, y:-0.2, z:-0.5});

//array of parts
let roverParts = [soj_wheel];

//component that should be on all parts that a player can hold
AFRAME.registerComponent('wield', {
    init:function(){

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(){
            
            let partIdx = Number(this.id.slice(-2));            //getting part info index based off of id
            let pCam    = document.getElementById("Player1Cam");//getting player's camera
            adoptPart(pCam, partIdx, false);                    //making the object a child of the player camera
            
            this.emit('playerGrab', null, false);    //call update for other players
        });

    }
});

//component that should be on all parts that a player can hold
AFRAME.registerComponent('rover', {
    init:function(){

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(){
            
            let pCam = document.getElementById("Player1Cam");       //get player camera
            let partList = pCam.querySelectorAll("[id*='part']");   //get list of parts that are children of camera

            //verify that player is holdig a part. we have to assume they can only hold one part
            if(partList.length > 0){
                
                //find the part index and call adopt part
                let partID  = partList[0].getAttribute("id");
                let partIdx = Number(partID.slice(-2));

                adoptPart(this, partIdx, true);

                //update other players of the event
                this.emit('partPlaced', null, false);

            }

        });

    }
});

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
    }
    
    parent.appendChild(newChild);

    console.log("adopted");

}