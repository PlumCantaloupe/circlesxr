//class for each rover's info
class roverInfo {
    constructor(roverId, screenId, roverDialogue, partsNum){
        this.roverId        = roverId;
        this.screenId       = screenId;
        this.roverDialogue  = roverDialogue;
        this.partsNum       = partsNum;
    }
}

//info for sojourner
const soj_info = new roverInfo("rover_sojourner", "soj_screen", 
["When did you first come to Mars?\n\nI was sent down here in December 1996 and finally landed down on Mars in July 1997." +
"I was the first of us Rovers to make it down here, and I don’t want to toot my own horn but if it weren’t for me the others might not even be here today.", 

"How was your mission?\n\n My mission lasted for 3 months after I was stationed up on Mars. My job was to explore the surface of Mars with all the scientific" + 
"tools the scientist on Earth equipped me with, and test out how well these tools worked on Mars. You found a good handful of them today when you were fixing me up today pal!" + 
"\n\nThose tires you found were super handy with exploring the surface; I was able to move at speeds of 0.6 inches (1.5 cm) per second and even climb over obstacles up to 1.6 inches (4 cm) high." + 
"\n\nI might’ve been the smallest rover to explore Mars, but I did a bang up job at completing my mission and explored 330 feet (100 meters).", 

"How did your mission end?\n\nAfter about 3 months, I started to really get tired. Maybe it was my old age catching up to me, but the wear and tear on my parts were no joke."+ 
"The scientists back at home realized my design wasn’t great at surviving extended exposure to the martian environment.\n\nSeptember of 1997, I was really worn down from my mission and couldn’t move any longer." +
"\n\nWith all my parts degraded and my energy spent, I chose to rest in a location known as the 'Rock Garden' on Mars' Ares Vallis plain.", 

"What is your legacy?\n\nI’m so glad you asked sonny! You should know that my mission contributed to the future of Mars exploration, and paved the way to the future mission."+ 
"\n\nAll the other guys in this building are here thanks to me, and the scientists backon Earth were able togive them a better design and life expectancy thanks to what was discovered from my mission on Mars. "+
"\n\nI might’ve only lasted 3 months, but the other rovers around here lasted exponentially longer than I did! They make the young guys different these days."
], 0);

//info for perseverance rover
const pers_info = new roverInfo("rover_perseverance", "pers_screen", 
["When did you first come to Mars?\n\nI was launched to Mars by NASA in July 2020. I traveled through space for a brief period of time and landed in February 18, 2021 and I have been here ever since!", 

"How was your mission?\n\nIt is super fun and exciting. I have all these new technologies that make me more capable of new discoveries compared to all the older rovers. I’m currently in progress for my" +
" mission, however I have been sent here to explore the Martian surface collecting samples and signs of microbial life.", 

"How did your mission end?\n\nMy mission is still going, I will go on as long as I can. With my discoveries we can improve and change the world."
], 0);

const curi_info = new roverInfo("rover_curiosity", "curi_screen", 
["When did you first come to Mars?\n\nI was launched to Mars by NASA in November 2011 and landed in August 2021", 

"How was your mission?\n\nMy mission was fairly successful I travelled over 23 kilometers on the martian surface and taken over 800,000 images. I made a lot of new discoveries such as finding out " +
"that in the past that there was water activity, I detected organic compounds in the rocks, and identified the presence of methane within the Martian atmosphere.", 

"How did your mission end?\n\nI am still on Mars today. I am going to go for as long as I can and continue to make new discoveries."
], 0);

//array of rover info
let rovers = [soj_info, pers_info, curi_info];

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

//finds index rover is located at in array of rovers based off of it's id
function findRoverIdx(roverId){
    for(let i=0; i < rovers.length; i++){
        if(roverId == rovers[i].roverId){
            return i;
        }
    }
}

//activates looping through rover facts
function activate(roverId){
    
    //find out where the rover is in array of rover info
    let roverIdx = findRoverIdx(roverId);

    //variables used for looping
    let screen = document.getElementById(rovers[roverIdx].screenId);
    let txtEl  = screen.querySelector("#screenTxt");
    let dialogue = rovers[roverIdx].roverDialogue;

    //used to track which dialogue is being displayed
    let diaIdx = dialogue.length - 1;

    //for first display
    txtEl.setAttribute("text", {value: dialogue[diaIdx]});
    diaIdx--;

    //infinitly cycle through dialogue
    setInterval(function(){
        
        txtEl.setAttribute("text", {value: dialogue[diaIdx]});
        
        if(diaIdx == 0){
            diaIdx = dialogue.length - 1;
        } else {
            diaIdx--;
        }

    }, 15000);
}