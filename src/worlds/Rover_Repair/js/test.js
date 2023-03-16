AFRAME.registerComponent('pickupable',{
    init: function(){
        
        this.el.addEventListener("click", function(){
            
            let myPlayer = document.getElementById("Player1Cam");
            
            this.setAttribute("circles-parent-constraint", {parent: myPlayer, position:true, rotation:true});
        });
        
    }
});