//component that should be on all parts that a player can hold
AFRAME.registerComponent('rover', {
    init:function(){

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(){
            
            let pCam = document.getElementById("Player1Cam");       //get player camera
            let partList = pCam.querySelectorAll("[id*='part']");   //get list of parts that are children of camera

            //verify that player is holdig a part. we have to assume they can only hold one part
            if(partList.length > 0){
                
                let inHand = partList[0];
                let toPlace = inHand.cloneNode(true);

                toPlace.setAttribute("position", )

            }

        });

    }
});