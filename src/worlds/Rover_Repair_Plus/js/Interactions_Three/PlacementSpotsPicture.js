//component that should be on all parts that a player can hold
AFRAME.registerComponent('picturespots', {
    init: function () {

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function () {

            let pickUpElem = CIRCLES.getPickedUpElement();
            if (pickUpElem !== null) {

                let elemId = CIRCLES.getNonNetworkedID(pickUpElem);
                let thisID = CONTEXT_AF.el.id;

                //stop holding part
                pickUpElem.click();  //forward click to element to release

                adoptPictureObject(thisID, elemId, true); // place object in placementspot

                console.log('objectPicturePlaced emit');
                CONTEXT_AF.el.emit('objectPicturePlaced', { dataID: thisID, pickUpID: elemId }, false);

            }

        });

    }
});