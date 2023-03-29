AFRAME.registerComponent('multi-interactions', {
    init: function(){
        
        CONTEXT_AF = this;
        
        //setting up socket.io connections
        CONTEXT_AF.socket         = null;
        CONTEXT_AF.connected      = false;

        CONTEXT_AF.parts = ["wheel"];

        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;

            //update position of part for other players
            CONTEXT_AF.socket.on("partEvent", function(data){
                let part = document.getElementById(data.partID);
                part.setAttribute("position", data.partPos);
                part.setAttribute("rotation", data.partRot);

                console.log("emitted");
            });

            CONTEXT_AF.socket.on("test", function(data){
                let potentialPlayers = document.querySelectorAll('[networked]');

                let part = document.getElementById("wheel");
                console.log(part);

                for(let i = 0; i < potentialPlayers.length; i++){
                    let curNetId = potentialPlayers[i].getAttribute("networked").networkId;
                    if(curNetId == data.pnID){
                        console.log("FOUND");
                        part.setAttribute("circles-parent-constraint", {parent: potentialPlayers[i], positionOffset: {x:-0.75, y:-0.5, z:-1}});
                        break;
                    }
                }

                //document.getElementById("wheel").setAttribute("circles-parent-constraint", {parent: player, positionOffset: {x:-0.75, y:-0.5, z:-1}});
            });

            //loop through all possible parts
            for(let i=0; i < CONTEXT_AF.parts.length; i++){

                console.log("looping");

                let part = document.getElementById(CONTEXT_AF.parts[i]);

                //add eventlistener for parts
                part.addEventListener('update', function(){

                    //get/set info of the part
                    let thisID = CONTEXT_AF.parts[i];
                    let curPos = part.getAttribute("position");
                    let curRot = part.getAttribute("rotation");

                    CONTEXT_AF.socket.emit('partEvent', {partID:thisID, partPos:curPos, partRot:curRot, room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
                });

                //add eventlistener for parts
                part.addEventListener('test', function(){

                    let playerNetId = document.getElementById("Player1").getAttribute("networked").networkId;

                    CONTEXT_AF.socket.emit('test', {pnID:playerNetId, room:CIRCLES.getCirclesRoom(), world:CIRCLES.getCirclesWorld()});
                });

            }

        });

    }
});

