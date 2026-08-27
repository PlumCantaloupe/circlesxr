//Access the Player Avatar, edit the character and replace its shapes with new ones.
//skeleton is being set up within the Circles Avatar, 
//create a skeleton of nested possible shape locations.
    "use strict";
//define the position variables for the lock on locations
let soulOrb;
let bodyGrp;
let head;
let torso;
let hips;
let lEye;
let rEye;
let mouth;
let headAccessory1;
let headAccessory2;
let bodyAccessory1;
let bodyAccessory2;




function createSkeleton() {
    
    const avatarCharacter = CIRCLES.getAvatarElement();
    avatarCharacter.removeAttribute("CIRCLES-USER-CONNECTED");
    //cuts out geometry from camera if it is too close
    avatarCharacter.setAttribute("camera","near:0.4");

    

    let baseMoveVariation = 0.1;

    //creates a skeleton of parent objects that pieces you pick up can be locked on to in the future.
    //head lock on position created
    bodyGrp = document.createElement("a-entity");
    bodyGrp.setAttribute("id", "bodyGrp-"+CIRCLES.getAvatarRigElement().getAttribute('networked').networkId);
    bodyGrp.setAttribute("position", "0 0 0");
    bodyGrp.setAttribute("rotation", "0 0 0");
    avatarCharacter.appendChild(bodyGrp);
    //create soul orb, used to show other player positions before they pick up a shape.
    soulOrb = document.createElement("a-entity");
    soulOrb.setAttribute("id", "soulOrb-"+CIRCLES.getAvatarRigElement().getAttribute('networked').networkId);
    soulOrb.setAttribute("position", "0 -0.4 0");
    soulOrb.setAttribute("scale", "0.25 0.25 0.25");
    soulOrb.setAttribute("gltf-model","#soulOrb");

    soulOrb.setAttribute("circles-object-world","pickedup: true;");
    soulOrb.setAttribute("circles-networked-basic","networkEnabled:true;");
    avatarCharacter.appendChild(soulOrb);

    head = document.createElement("a-entity");
    head.setAttribute("id", "head");
    head.setAttribute("class", "mainBody");
    head.setAttribute("geometry", "primitive: sphere; radius:0.001");
    head.setAttribute("position", "0 0 0");
    head.setAttribute("rotation", "0 0 0");
    bodyGrp.appendChild(head);

    //left eye lock on position created 
    lEye = document.createElement("a-entity");
    lEye.setAttribute("id", "lEye");
    lEye.setAttribute("class", "subBody");
    lEye.setAttribute("geometry", "primitive: sphere; radius:0.001");
    
    lEye.setAttribute("position", "0.15 "+(0.05+(baseMoveVariation/4*((Math.random() * 2)-1)))+" -0.2");
    lEye.setAttribute("rotation", "0 0 0");
    head.appendChild(lEye);

    //right eye lock on position created 
    rEye = document.createElement("a-entity");
    rEye.setAttribute("id", "rEye");
    rEye.setAttribute("class", "subBody");
    rEye.setAttribute("geometry", "primitive: sphere; radius:0.001");
    rEye.setAttribute("position", "-0.15 "+(0.05+(baseMoveVariation/4*((Math.random() * 2)-1)))+" -0.2");
    rEye.setAttribute("rotation", "0 0 0");
    head.appendChild(rEye);

    //mouth lock on position created 
    mouth = document.createElement("a-entity");
    mouth.setAttribute("id", "mouth");
    mouth.setAttribute("class", "subBody");
    mouth.setAttribute("geometry", "primitive: sphere; radius:0.001");
    mouth.setAttribute("position", "0 "+(-0.1+(baseMoveVariation/2*((Math.random() * 2)-1))) +" -0.2");
    mouth.setAttribute("rotation", "0 0 0");
    head.appendChild(mouth);

    //headAccessory1 lock on position created 
    headAccessory1 = document.createElement("a-entity");
    headAccessory1.setAttribute("id", "headAccessory1");
    headAccessory1.setAttribute("class", "subBody");
    headAccessory1.setAttribute("geometry", "primitive: sphere; radius:0.001");
    headAccessory1.setAttribute("position", (0.1+(baseMoveVariation*((Math.random() * 2)-1)))+" 0.2 0");
    headAccessory1.setAttribute("rotation", "0 0 0");
    head.appendChild(headAccessory1);

    //headAccessory2 lock on position created 
    headAccessory2 = document.createElement("a-entity");
    headAccessory2.setAttribute("id", "headAccessory2");
    headAccessory2.setAttribute("class", "subBody");
    headAccessory2.setAttribute("geometry", "primitive: sphere; radius:0.001");
    headAccessory2.setAttribute("position", (-0.1+(baseMoveVariation*((Math.random() * 2)-1)))+" 0.2 0");
    headAccessory2.setAttribute("rotation", "0 0 0");
    head.appendChild(headAccessory2);

    //torso lock on position created
    torso = document.createElement("a-entity");
    torso.setAttribute("id", "torso");
    torso.setAttribute("class", "mainBody");
    torso.setAttribute("geometry", "primitive: sphere; radius:0.001");
    torso.setAttribute("position", "0 -0.4 0");
    bodyGrp.appendChild(torso);

    //accessory1 lock on position created 
    bodyAccessory1 = document.createElement("a-entity");
    bodyAccessory1.setAttribute("id", "bodyAccessory1");
    bodyAccessory1.setAttribute("class", "subBody");
    bodyAccessory1.setAttribute("geometry", "primitive: sphere; radius:0.001");
    bodyAccessory1.setAttribute("position", "0.3 "+ (baseMoveVariation*((Math.random() * 2)-1)) +" 0");
    bodyAccessory1.setAttribute("rotation", "0 0 0");
    torso.appendChild(bodyAccessory1);

    //accessory2 lock on position created 
    bodyAccessory2 = document.createElement("a-entity");
    bodyAccessory2.setAttribute("id", "bodyAccessory2");
    bodyAccessory2.setAttribute("class", "subBody");
    bodyAccessory2.setAttribute("geometry", "primitive: sphere; radius:0.001");
    bodyAccessory2.setAttribute("position", "-0.3 "+ (baseMoveVariation*((Math.random() * 2)-1)) +" 0");
    bodyAccessory2.setAttribute("rotation", "0 0 0");
    torso.appendChild(bodyAccessory2);

    //hips lock on position created
    hips = document.createElement("a-entity");
    hips.setAttribute("id", "hips");
    hips.setAttribute("class", "mainBody");
    hips.setAttribute("geometry", "primitive: sphere; radius:0.001");
    hips.setAttribute("position", "0 -0.8 0");
    bodyGrp.appendChild(hips);
    
    
    console.log("Skeleton has been built!");  
}

//adds the object you picked up to its specified parent location
function addBodyPart(locationID,bodyPiece,shape)
{
    let qX;
    let qY;
    let qZ;

    let bodyPartScale;
    //could be between 0 and 2
    let randomRotation = (Math.floor(Math.random() * 3));
    //0 or 1
    let faceDirection = (Math.floor(Math.random() * 2));
    let faceDirectionZ = (Math.floor(Math.random() * 2));

    let baseScaleVariation = 0.05;

    //attach the piece to the head location if it has that id.
    //depending on the piece it can be changed in a variety of ways, scaled, rotated and more
    if(locationID == "head")
    {
        head.object3D.attach(bodyPiece.el.object3D);
        bodyPartScale = (0.6+(baseScaleVariation*((Math.random() * 2)-1)));
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        
        if(shape=="cone")
        {
            bodyPiece.el.setAttribute("rotation","90 0 0");
        }
        else if(shape!="torus")
        {   
            
            if(faceDirection == 0)
            {
                qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(0));
                qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0));
                qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(randomRotation*45));
            }
            else if(faceDirection == 1)
            {
                qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(90));
                qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(randomRotation*45));
                qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(0));
            }

            // Combine rotations so each one is applied in the original coordinate system
            bodyPiece.el.object3D.quaternion.identity(); // Reset quaternion
            bodyPiece.el.object3D.quaternion.premultiply(qX); // Apply X first
            bodyPiece.el.object3D.quaternion.premultiply(qY); // Then Y
            bodyPiece.el.object3D.quaternion.premultiply(qZ); // Then Z
        }
        else{
            bodyPiece.el.object3D.rotation.set(THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(0),
            THREE.MathUtils.degToRad(randomRotation*45));
        }
        
    }
    else if(locationID == "headAccessory1")
    {
        bodyPartScale = (0.3+(baseScaleVariation*((Math.random() * 2)-1)));
        headAccessory1.object3D.attach(bodyPiece.el.object3D);
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        
    }
    else if(locationID == "headAccessory2")
    {
        bodyPartScale = (0.3+(baseScaleVariation*((Math.random() * 2)-1)));
        headAccessory2.object3D.attach(bodyPiece.el.object3D);
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
    }
    else if(locationID == "lEye")
    {
        lEye.object3D.attach(bodyPiece.el.object3D);
        bodyPartScale = (0.25+(baseScaleVariation/2*((Math.random() * 2)-1)));
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        if(shape=="cone")
        {
            bodyPiece.el.setAttribute("rotation","90 0 0");
        }

        else if(shape!="torus")
        {
            qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(90));
            qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0));
            qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(randomRotation*45));
            // Combine rotations so each one is applied in the original coordinate system
            bodyPiece.el.object3D.quaternion.identity(); // Reset quaternion
            bodyPiece.el.object3D.quaternion.premultiply(qX); // Apply X first
            bodyPiece.el.object3D.quaternion.premultiply(qY); // Then Y
            bodyPiece.el.object3D.quaternion.premultiply(qZ); // Then Z
        }
        else{
            bodyPiece.el.setAttribute("rotation","0 0 "+randomRotation*45);
        }
    }
    else if(locationID == "rEye")
    {
        rEye.object3D.attach(bodyPiece.el.object3D);
        bodyPartScale = (0.25+(baseScaleVariation/2*((Math.random() * 2)-1)));
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        if(shape=="cone")
        {
            bodyPiece.el.setAttribute("rotation","90 0 0");
        }
        else if(shape!="torus")
        {
            qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(90));
            qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0));
            qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(randomRotation*45));
            // Combine rotations so each one is applied in the original coordinate system
            bodyPiece.el.object3D.quaternion.identity(); // Reset quaternion
            bodyPiece.el.object3D.quaternion.premultiply(qX); // Apply X first
            bodyPiece.el.object3D.quaternion.premultiply(qY); // Then Y
            bodyPiece.el.object3D.quaternion.premultiply(qZ); // Then Z
        }
        else{
            bodyPiece.el.setAttribute("rotation","0 0 "+randomRotation*45);
        }
    }
    else if(locationID == "mouth")
    {
        mouth.object3D.attach(bodyPiece.el.object3D);
        bodyPartScale = (0.25+(baseScaleVariation/2*((Math.random() * 2)-1)));
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        if(shape=="cone")
        {
            if(faceDirection == 0)
            {
                bodyPiece.el.setAttribute("rotation","90 0 0");
            }
            else{
                bodyPiece.el.setAttribute("rotation","-90 0 0");
            }
        }
        else if(shape!="torus")
        {
            qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(90));
            qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0));
            qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(randomRotation*45));
            // Combine rotations so each one is applied in the original coordinate system
            bodyPiece.el.object3D.quaternion.identity(); // Reset quaternion
            bodyPiece.el.object3D.quaternion.premultiply(qX); // Apply X first
            bodyPiece.el.object3D.quaternion.premultiply(qY); // Then Y
            bodyPiece.el.object3D.quaternion.premultiply(qZ); // Then Z
        }
        else{
            bodyPiece.el.setAttribute("rotation","0 0 "+randomRotation*45);
        }
    }
    //attach the piece to the torso location if it has that id.
    else if(locationID == "torso")
    {
        torso.object3D.attach(bodyPiece.el.object3D);
        bodyPartScale = (0.7+(baseScaleVariation*((Math.random() * 2)-1)));
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        
        if(shape!="torus"&&shape!="cone")
        {
            qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(faceDirection*90));
            qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0));
            qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(randomRotation*45));
            // Combine rotations so each one is applied in the original coordinate system
            bodyPiece.el.object3D.quaternion.identity(); // Reset quaternion
            bodyPiece.el.object3D.quaternion.premultiply(qX); // Apply X first
            bodyPiece.el.object3D.quaternion.premultiply(qY); // Then Y
            bodyPiece.el.object3D.quaternion.premultiply(qZ); // Then Z
        }
        else if(shape!="cone")
        {
            bodyPiece.el.setAttribute("rotation","0 0 "+randomRotation*45);
        }
    }
    else if(locationID == "bodyAccessory1")
    {
        bodyAccessory1.object3D.attach(bodyPiece.el.object3D);
        bodyPartScale = (0.35+(baseScaleVariation*((Math.random() * 2)-1)));
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(faceDirection*90));
        qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0));
        qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad((faceDirectionZ*90)+45));
        // Combine rotations so each one is applied in the original coordinate system
        bodyPiece.el.object3D.quaternion.identity(); // Reset quaternion
        bodyPiece.el.object3D.quaternion.premultiply(qX); // Apply X first
        bodyPiece.el.object3D.quaternion.premultiply(qY); // Then Y
        bodyPiece.el.object3D.quaternion.premultiply(qZ); // Then Z

    }
    else if(locationID == "bodyAccessory2")
    {
        bodyAccessory2.object3D.attach(bodyPiece.el.object3D);
        bodyPartScale = (0.35+(baseScaleVariation*((Math.random() * 2)-1)));
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(faceDirection*90));
        qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0));
        qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad((faceDirectionZ*90)+45));
        // Combine rotations so each one is applied in the original coordinate system
        bodyPiece.el.object3D.quaternion.identity(); // Reset quaternion
        bodyPiece.el.object3D.quaternion.premultiply(qX); // Apply X first
        bodyPiece.el.object3D.quaternion.premultiply(qY); // Then Y
        bodyPiece.el.object3D.quaternion.premultiply(qZ); // Then Z
    }

    //attach the piece to the hips location if it has that id.
    else if(locationID == "hips")
    {
        hips.object3D.attach(bodyPiece.el.object3D);
        bodyPartScale = (0.5+(baseScaleVariation*((Math.random() * 2)-1)));
        bodyPiece.el.setAttribute("scale",((bodyPiece.el.getAttribute('scale').x)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').y)*bodyPartScale)+" "+((bodyPiece.el.getAttribute('scale').z)*bodyPartScale))
        if(shape!="torus"&&shape!="cone")
        {
            qX = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(faceDirection*90));
            qY = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(0));
            qZ = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(randomRotation*45));
            // Combine rotations so each one is applied in the original coordinate system
            bodyPiece.el.object3D.quaternion.identity(); // Reset quaternion
            bodyPiece.el.object3D.quaternion.premultiply(qX); // Apply X first
            bodyPiece.el.object3D.quaternion.premultiply(qY); // Then Y
            bodyPiece.el.object3D.quaternion.premultiply(qZ); // Then Z
        }
        else if(shape!="cone")
        {
            bodyPiece.el.setAttribute("rotation","0 0 "+randomRotation*45);
        }
        else{
            bodyPiece.el.setAttribute("rotation","180 0 0");
        }
    }
    //sets rotation and position to 0 so that it is centered on the body part lock positions
    bodyPiece.el.setAttribute("position", "0 0 0");
    //enables networking so other players can see it. 
    bodyPiece.el.setAttribute("circles-object-world","pickedup: true;");
    bodyPiece.el.setAttribute("circles-networked-basic","networkEnabled:true;");
    
    //remove interactive so it can no longer be clicked on
    bodyPiece.el.classList.remove('interactive');

    //set the position variation now going forward, this will allow for slight shifts of eyes, mouth and body accesories. 

}
//https://www.30secondsofcode.org/js/s/rgb-hex-hsl-hsb-color-format-conversion/
const hsbToRgb = (h, s, b) => {
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)];
  };
//converts rgb component to hexadecimal
function componentToHex(rgbVal) {
    let hex = Math.round(rgbVal).toString(16);
    //if value is below 16 in decimal, it needs a 0 added before it 
    if(Math.round(rgbVal)<16)
    {
        hex = "0" + hex;
    }
    return hex;
}

  

