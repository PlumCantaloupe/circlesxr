//animation component for opening and closing the drawer of desks. Mostly holds actual animation and eventssz
AFRAME.registerComponent('drawer_anim', {
    schema:{
        isOpen: {type:"bool", default:true}
    },
    init:function(){

        let curPos = this.el.getAttribute("position");  //get the position of the element

        //draw opening animation
        this.el.setAttribute('animation__open', {'property':'position', 'to': {x:curPos.x, y:curPos.y, z:curPos.z + 0.4},
                                                'startEvents': 'drawerOpen', 'dur': 300});

        //drawer closing animation
        this.el.setAttribute('animation__close', {'property':'position', 'to': {x:curPos.x, y:curPos.y, z:curPos.z},
                                                'startEvents': 'drawerClose', 'dur': 300});

        //listner for when the player clicks on the drawer
        this.el.addEventListener('click', function(){
            //have the animation play when clicked
            playDrawerAnim(this.id);

            //update the event for other connected players
            CONTEXT_AF.socket.emit("drawerEvent", {drawerId:this.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});

        });

    }
});

//funciton used for playing drawer animations
//only works on drawers with the drawAnim component
function playDrawerAnim(drawerId){
    
    //find the drawer
    let drawer = document.getElementById(drawerId);

    //when it is opened play the closing animation
    if(drawer.isOpen){
        drawer.isOpen = false;
        drawer.emit("drawerClose", null, false);
    }
    //when it is closed play the open animation
    else{
        drawer.emit("drawerOpen", null, false);
        drawer.isOpen = true;
    } 

}

//animation component for 3D printer to "print" a rover part
AFRAME.registerComponent('printer_anim', {
    schema:{
        printObjId: {type:"string", default:"hello world"}
    },
    init:function(){

        this.el.addEventListener("click", function(){
            
            let printerModel = document.getElementById(this.nextElementSibling.id);   //finding parent of printed part
            let part = printerModel.querySelector("[id*='part']");  //getting printed part

            printerCreate(part.id); //animated the "created" 

            //update for other exisiting players
            CONTEXT_AF.socket.emit("updatePrinter", {pPartId:part.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});

        });
    }
});

//function used for animating the "created" part from a 3D printer
function printerCreate(pPartId){
    
    //getting the "printed" part and it's current position
    let part    = document.getElementById(pPartId);
    let curPos  = part.getAttribute("position");

    //animation to reveal printed object
    part.setAttribute('animation__print', {'property':'position', 'to': {x:curPos.x, y:curPos.y + 0.25, z:curPos.z},
    'startEvents': 'printPart', 'dur': 300});

    //waiting for a brief moment to then trigger animation
    setTimeout(()=>{
        part.emit("printPart", null, false);
    }, 10);
}

//component for hologram events
AFRAME.registerComponent("hologram", {
    schema:{
        redImgId: {type:"string", default:null}, 
        blueImgId: {type:"string", default:null}
    },
    init: function(){

        //on it, we can just make the hologram image red
        this.el.querySelector("#holoImg").setAttribute("src", this.data.redImgId);

        //event for when a rover part has been placed onto the 
        this.el.addEventListener("partPlaced", function(){
            flipHolo(this.id);
        });

    }
});

//flips the hologram img from red to blue
function flipHolo(holoId){
    
    //get the proper hologram
    let hologram = document.getElementById(holoId);
    
    //extract the child and the info within it
    let hologramImg = hologram.querySelector("#holoImg");
    let hologramInfo = hologram.getAttribute("hologram");

    //change the hologram to the blue version
    hologramImg.setAttribute("src", hologramInfo.blueImgId);
}