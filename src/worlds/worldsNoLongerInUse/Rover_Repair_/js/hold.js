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

//sojourner parts info
const soj_wheel = new partInfo("sj_part_wheel_00", "h_base_00", false, {x:0.376, y:-0.342, z:0.311}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:180, z:0}, 
"You found my tires. And all six to boot! I lost those ages ago, thanks pal. I guess you’re not so bad.");
const soj_laser = new partInfo("sj_part_laser_01", "h_base_01", false, {x:0.4, y:-0.155, z:0}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:0, z:0}, 
"Would you look at that, you even found my Alpha Proton X-Ray Spectrometer! Thanks for putting in all the work, I like your spunk. You’re only missing one more part, I believe in you.");
const soj_camera = new partInfo("sj_part_camera_02", "h_base_02", false, {x:-0.303, y:-0.155, z:0}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:0, z:0}, 
"Amazing! You found my camera! That was the last part, you got me all fixed up! I look 20 years younger!");

//perseverance parts info
const pers_radar = new partInfo("pers_part_radar_03", "h_base_03", false, {x:1.266, y:-0.302, z:-0.037}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:0, z:0}, 
"My RIMFAX, I can’t wait to see what materials are located beneath us! I am for sure going to find something extraordinary.");
const pers_superCam = new partInfo("pers_part_cam_04", "h_base_04", false, {x:-0.62, y:0.96, z:-0.274}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:0, z:0}, 
"Super, super, super, SuperCam! Thank you, I needed this to help examine the rocks and soils.");
const pers_MEDA = new partInfo("pers_part_Meda_05", "h_base_05", false, {x:-0.267, y:0.584, z:-0.552}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:0, z:0}, 
"Hey you found my MEDA! I can finally check todays weather.");

//curiosity parts info
const curi_hand = new partInfo("curi_part_hand_06", "h_base_06", false, {x:-2.04, y:0.06, z:0.12}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:0, z:0}, 
"You found my robotic hand, I use it to analyze the elemental composition of the rocks and soil found here on Mars.");
const curi_bat = new partInfo("curi_part_bat_07", "h_base_07", false, {x:1.1, y:-0.086, z:-0.017}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:0, z:0}, 
"Hey you found my radioisotope power system. I use this to generate electricity from the heat of plutonium's radioactive decay.");
const curi_cam = new partInfo("curi_part_cam_08", "h_base_08", false, {x:-1.5, y:-0.6, z:0}, {x:-0.6, y:-0.2, z:-0.5}, {x:0, y:0, z:0}, 
"My front facing camera! This camera helps me aid in autonomous navigation and obstacle avoidance.");

//array of parts
let roverParts = [soj_wheel, soj_laser, soj_camera, pers_radar, pers_superCam, pers_MEDA, curi_hand, curi_bat, curi_cam];

//makes a given element a parent of a given rover part. Changes position based off the new parent
//toRover: True = parent is the rover | false = parent is to player
function adoptPart(parent, objIdx, toRover){
    
    console.log("adopting part", parent.id, objIdx, toRover)

    //get part information
    let childInfo = roverParts[objIdx];

    console.log(objIdx);
    console.log(childInfo);

    //find part, clone it, then delete it
    let child   = document.getElementById(childInfo.partID);
    //let newChild = child.cloneNode(true);
    //child.remove();

    //trigger series of events when added to a rover
    //apply offset position/rotation and append to the parent
    if(toRover === true){
        console.log(parent.id);
        
        parent.object3D.attach(child.object3D);
        child.object3D.position.set(childInfo.roverPos.x, childInfo.roverPos.y, childInfo.roverPos.z);
        child.object3D.rotation.set(THREE.MathUtils.radToDeg(childInfo.roverRot.x), THREE.MathUtils.radToDeg(childInfo.roverRot.y), THREE.MathUtils.radToDeg(childInfo.roverRot.z));
        child.object3D.scale.set(1.0, 1.0, 1.0);

        //child.setAttribute("position", childInfo.roverPos);
        //child.setAttribute("rotation", childInfo.roverRot);
        child.setAttribute("circles-interactive-object", {enabled:false});

        //find the correct hologram to update
        let holo = document.getElementById(childInfo.holoID);
        holo.emit("partPlaced");

        //get the text of ther rover and update it with the special dialogue
        let roverText = parent.querySelector("#roverText");
        roverText.setAttribute("circles-description", {description_text_front:childInfo.roverQuip});

        //add one to rover parts num
        let roverIdx = findRoverIdx(parent.id);
        rovers[roverIdx].partsNum++;

        //activate scren info when enough parts are found
        if(rovers[roverIdx].partsNum > 2){
            activate(parent.id);
        }
    } else {
        // child.setAttribute("position", childInfo.holdingPos);
        // child.setAttribute("circles-interactive-object", {enabled:false});
    }
    
    //parent.appendChild(child);

    console.log("adopted");

}