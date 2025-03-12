'use strict';

//component drawing interaction

AFRAME.registerComponent('toggle-canvas', {
    schema: {},

    init: function () {

        const Context_AF = this;
        Context_AF.showingCanvasUI = false;
        Context_AF.canvasView = document.getElementById("canvasDiv");

        Context_AF.el.addEventListener('click', function(){
          
            if (Context_AF.showingCanvasUI === true) {
                Context_AF.canvasView.style.visibility = "hidden";
                console.log('hiding canvas');
                Context_AF.showingCanvasUI = false;
              }
            else {
                Context_AF.canvasView.style.visibility = "visible";
                console.log('displaying canvas');
                Context_AF.showingCanvasUI = true;

            }
        });
    },
  });