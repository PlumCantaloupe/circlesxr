AFRAME.registerComponent('holdable', {
    init: function(){
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');

        CONTEXT_AF.socket     = null;
        CONTEXT_AF.connected  = false;
        CONTEXT_AF.partEventName = "part_event";

        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesRoom() + ' in world:' + CIRCLES.getCirclesWorld());

            let part = scene.querySelector("#wheel");

            CONTEXT_AF.socket.on(CONTEXT_AF.partEventName, function(data){
                console.log(CONTEXT_AF.socket.id);
                //let holdPlayer = scene.querySelector()
            });

            part.addEventListener("click", function(){
                CONTEXT_AF.socket.emit(CONTEXT_AF.partEventName, {room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
            });
        });

        this.el.addEventListener("click", function(){

            let myPlayer = document.getElementById("Player1Cam");    //find player camera
            let holdingPart = this.cloneNode(true);         //creating clone of itself

            myPlayer.appendChild(holdingPart);              //add clone as a child of the player's camera
            holdingPart.setAttribute('position', {x:-0.65, y:-0.2, z:-0.5});
            //holdingPart.removeAttribute('circles-interactive-object'); //this has issues as once it's removed it permanently highlights the object

            this.remove();//remove this from the world

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

                    editText(); //edit

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