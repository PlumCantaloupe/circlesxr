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
            adoptPart(pCam, partIdx);                   //making the object a child of the player camera
            
            this.emit('update', null, false);    //call update for other players
        });

    }
});

//makes a given element a parent of a given rover part
function adoptPart(parent, objIdx){
    
    //get part information
    let childInfo = roverParts[objIdx];

    //find part, clone it, then delete it
    let child   = document.getElementById(childInfo.partID);
    let newChild = child.cloneNode(true);
    child.remove();

    //apply offset position and append to the parent
    newChild.setAttribute("position", childInfo.holdingPos);
    parent.appendChild(newChild);

    console.log("adopted");

}