//component that should be on all parts that a player can hold
AFRAME.registerComponent('placementspots', {
    init:function(){

        const CONTEXT_AF = this;

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
                

                //stop holding part
                pickUpElem.click();  //forward click to element to release

                adoptObject(CONTEXT_AF.el, pickUpElem.id, true);

                console.log('partPlaced emit');

                //update other players of the event
                //CONTEXT_AF.el.emit('partPlaced', {placementspotsId:CONTEXT_AF.el.id, partIdx:partIdx}, false);

            }

        });

    }
});