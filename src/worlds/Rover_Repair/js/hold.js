AFRAME.registerComponent('wield', {
    schema:{
        wieldStatus:    {type:"boolean", default: false},
        thisPos:        {type: "vec3"}
    },
    init:function(){
        const CONTEXT_AF = this;

        //setting up variables on init
        thisPos     = this.el.getAttribute("position");
        wieldStatus = false;

        //add event listener to object for when it's clicked (may want to use schema)
        this.el.addEventListener('click', function(){
            
            //select the player's camera and constrain object to the camera
            let wielder = document.getElementById("Player1Cam");
            this.setAttribute("circles-parent-constraint", {parent: wielder, positionOffset: {x:-0.75, y:-0.5, z:-1}});
            
            this.emit('test', null, false);

            //when the player is holding the object set the wield status to true
            wieldStatus = true;
        });

    },

    //every tick check if the item is being held
    tick: function(time, timeDelta){

        if(wieldStatus){
            //this.el.emit('test', null, false);
        }
    }
});

