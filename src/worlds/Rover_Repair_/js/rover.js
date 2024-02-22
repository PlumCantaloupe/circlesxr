//component that should be on all parts that a player can hold
AFRAME.registerComponent('rover', {
    init:function(){

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(){

            //will need CHANGESS
            //let holdingInfo = isHolding(document.getElementById("Player1Cam")); //get player holding info

            let pickUpElem = CIRCLES.getPickedUpElement();
            if (pickUpElem !== null) {
            //verify that player is holdig a part. we have to assume they can only hold one part
            //if(holdingInfo.holding){
                
                //find the part index and call adopt part
                // let partIdx = Number(holdingInfo.id.slice(-2));
                let elemId = CIRCLES.getNonNetworkedID(pickUpElem);
                let partIdx = Number(elemId.slice(-2)); //have array index built into the last two digits of id ...

                //stop holding part
                pickUpElem.click();  //forward click to element to release

                adoptPart(this, partIdx, true);

                //update other players of the event
                this.emit('partPlaced', null, false);

                //play sound
                let soundEl = document.getElementById("place_sound_el");
                soundEl.components.sound.playSound();

                //waiting for a brief moment to then trigger rover sound (have it speak)
                setTimeout(()=>{
                    this.emit("speak");
                }, 1000);

            }

        });

    }
});