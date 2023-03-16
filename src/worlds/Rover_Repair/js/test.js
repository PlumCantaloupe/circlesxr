
class partsInfo {
    constructor(partID, holding, whoHolding, roverPos, infoMessage){
        this.partID     = partID; 
        this.holding    = holding; 
        this.whoHolding = whoHolding;
        this.roverPos   = roverPos;
        this.infoMessage = infoMessage;
    }
}

//list of soj parts
const soj_camera = new partsInfo("camera", false, null, {x:0, y:0, z:0}, "You found my camera");
const soj_wheel = new partsInfo("wheels", false, null, {x:0.4404, y:0.14935, z:0.31451}, "You found my wheel");

//let parts = [camera, wheel];

AFRAME.registerComponent('holdable', {
    init: function(){
        this.el.addEventListener("click", function(){

            let myPlayer = document.getElementById("Player1Cam");    //find player camera
            let holdingPart = this.cloneNode(true);         //creating clone of itself

            myPlayer.appendChild(holdingPart);              //add clone as a child of the player's camera
            holdingPart.setAttribute('position', {x:-0.5, y:-0.5, z:-0.5});
            //holdingPart.removeAttribute('circles-interactive-object');  //this has issues as once it's removed it permanently highlights the object
            
            console.log("item picked up");
            
            this.remove();                                  //remove this from the world

        });
    }
});


AFRAME.registerComponent('soj', {
    init:function(){
        this.el.addEventListener("click", function(){

            let myPlayer = document.getElementById('Player1Cam');   //player camera
            let inHand = null;                                      //variable to determine if a part is in a player's hand
            let parts = ["#wheel", "#camera", "#thing"];

            //loop through all potential parts in the player's hand
            for(let i=0; i < parts.length; i++){
                inHand = myPlayer.querySelector(parts[i]);

                console.log(inHand);

                if(inHand){
                    
                    console.log("found matching object");

                    let roverPart = inHand.cloneNode(true);
                    this.appendChild(roverPart);
                    roverPart.setAttribute("position", {x:0.4404, y:0.14935, z:0.31451});
                    roverPart.setAttribute("rotation", {x: 0, y:180, z:0});

                    inHand.remove();
                    break; //stop searching if something has been found
                }

            }

        });
    }
});

//finds part based off of given parts array in player1cam. When found the part is removed from the cam and place onto the rover
function findPart(parts, rover){

    let myPlayer = document.getElementById('Player1Cam');   //player camera
    let inHand = null;                                      //variable to determine if a part is in a player's hand

    for(let i = 0; i < parts.length; i++){
        inHand = myPlayer.querySelector("#" + parts[i].partID);
        
        if(inHand){
            //add part to rover model in it's predetermined position
            let roverPart = inHand.cloneNode(true);
            rover.setAttribute("position", parts[i].roverPos);
            rover.appendChild(roverPart);

            inHand.remove();
        }
    }


}