'use strict';


AFRAME.registerComponent("solaris-moodFlower", {
    init: function(){
        setTimeout('10000');
        const CONTEXT_AF          = this;
        const data                = CONTEXT_AF.data;
        console.log("FLOWER BUTTONR READY");

        if (CIRCLES.isReady()) {
            console.log("FLOWER BUTTONR READY");
          }
          else {
            const readyFunc = function() {
              console.log("FLOWER BUTTON READY");
              CIRCLES.getCirclesSceneElement().removeEventListener(CIRCLES.EVENTS.READY, readyFunc);
            };
            CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, readyFunc);
          }
    },
});