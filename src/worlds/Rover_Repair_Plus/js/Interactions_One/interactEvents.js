//class for object's info
class deleteObjectInfo {
    constructor(objectID){
        this.objectID   = objectID;
    }
}

const delete1 = new deleteObjectInfo("delete1");
const delete2 = new deleteObjectInfo("delete2");
const delete3 = new deleteObjectInfo("delete3");
let deleteObjects = [delete1, delete2, delete3];

//component that should be on all parts that a player can hold
AFRAME.registerComponent('button', {
    init:function(){

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function(){

            let allInCorrectPositions = checkPlacements();
            if(allInCorrectPositions == true){
                for(let i = 0; deleteObjects.length > i; i++){
                    let currentDeleteObject = document.getElementById(deleteObjects[i].objectID);
                    currentDeleteObject.remove();
                    console.log("ObjectDeleted");
                }
            }
            

        });

    }
    
});

/*
AFRAME.registerComponent('puzzleObject', {
    init:function(){
        const CONTEXT_AF = this;
        //add event listener to object for when it's clicked
        this.el.addEventListener('mousedown', function(){
            console.log("aa");
            console.log(this.id);
            
        });

    }
});
*/