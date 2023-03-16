
class partsInfo {
    constructor(partID, holding, whoHolding){
        this.partID = partID; 
        this.holding = holding; 
        this.whoHolding = whoHolding;
    }
}

//list of parts
const camera = new partsInfo("camera", false, null);
const wheel = new partsInfo("wheel", false, null);

let parts = [camera, wheel];

AFRAME.registerComponent('pickupable',{
    init: function(){
        
        this.el.addEventListener("click", function(){
            
            let myPlayer = document.getElementById("Player1Cam"); //get the player's camera
            
            //use circles parent constraint to constrain it to the camera
            this.setAttribute("circles-parent-constraint", {parent: myPlayer, position:true, rotation:true, positionOffset: {x: -1.5, y: -0.5, z:-1}, smoothingOn: false, updateRate: 10});

            for(let i=0; i < parts.length; i++){
                if(parts[i].partID == this.getAttribute("id")){
                    parts[i].holding = true; 
                    //parts[i].whoHolding = socket.id;

                    console.log("updated part status");
                }
            }

        });
        
    }
});


AFRAME.registerComponent('rover', {
    init:function(){
        this.el.addEventListener('click', function(){

            let myPlayer = document.getElementById("Player1Cam");

            for(let i=0; i < parts.length; i++){
                if(parts[i].holding){
                    let roverPart = document.getElementById(parts[i].partID).cloneNode(true);
                    roverPart.setAttribute("position", {x:1, y:-0.5, z:2});
                    this.appendChild(roverPart);

                    document.getElementById(parts[i].partID).remove();
                    break;
                }
            }

            /*
            let parts = ["#wheel", "#camera", "#suspension", "#lazer", "#chases"];
            let inHand = null;

            //keep looping through potential parts
            for(let i=0; i < parts.length; i++){
                
                inHand = myPlayer.querySelector(parts[i]);
                console.log(inHand);
                if(inHand){
                    
                    console.log("found matching object");

                    let roverPart = inHand.cloneNode(true);
                    this.appendChild(roverPart);
                    roverPart.setAttribute("position", {x:1, y:-0.5, z:2});
                    
                    inHand.remove();
                    break; //stop searching if something has been found
                }
            }
    
            console.log("running function");

            */

        });
    }
});