//class containing part info


//sockets component for the world
AFRAME.registerComponent('multi-interactions', {
    init: function(){
        
        //setting up socket.io connections
        CONTEXT_AF              = this;
        CONTEXT_AF.socket       = null;
        CONTEXT_AF.connected    = false;

        CONTEXT_AF.parts = document.querySelectorAll("[id*='part']");

        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.socket    = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;

            //updates part location when another player picks up a part
            CONTEXT_AF.socket.on("partEvent", function(data){
                
                let posibPlayers = document.querySelectorAll('[networked]');    //select all nodes that contain the networked attribute (expected that players will only have this)
                let otherPlayer = null;                                         //variable for the player who is holding the part

                //loop through all players in posibPlayers variable
                for(let i = 0; i < posibPlayers.length; i++){
                    
                    //get the current possible player's networked id
                    let curNetId = posibPlayers[i].getAttribute("networked").networkId;
                    
                    //when a match is found this means we found the player who's holding the part
                    if(curNetId == data.pnID){
                        otherPlayer = posibPlayers[i];
                        break;
                    }
                }

                //if there has been another player found then have the part be a child of their avatar
                if(otherPlayer){
                    console.log("calling adoption");
                    adoptPart(otherPlayer.querySelector(".avatar"), data.partIdx);
                }
                
            });

            //loop through all possible parts
            for(let i=0; i < CONTEXT_AF.parts.length; i++){

                let part = CONTEXT_AF.parts[i];
                console.log(part.id);

                //add eventlistener for parts
                part.addEventListener('update', function(){
                    
                    console.log("updateListener");

                    //getting correct variables to send
                    let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;
                    let partIdx = Number(this.id.slice(-2));

                    //send message to other users that a part is being held
                    CONTEXT_AF.socket.emit('partEvent', {partIdx:partIdx, pnID:playerNetId, room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
                });

                //testing stuff out
                /*part.addEventListener('test', function(){

                    let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;

                    CONTEXT_AF.socket.emit('test', {pnID:playerNetId, room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
                });*/

            }

        });

    }
});

