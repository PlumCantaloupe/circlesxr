'use strict';

AFRAME.registerComponent('moodFlower-bttn', {
    init: function(){
        setTimeout('10000');
        //const CONTEXT_AF = this;
        //const moodButton = this.data;
        //console.log(moodButton);
        console.log("Mood flower button component is registering");

        this.el.addEventListener("click", () => {
            console.log("mood flower has been clicked")
        });
    },

});