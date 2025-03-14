'use strict';
AFRAME.registerComponent('sproot-dialogue', {
    schema: {
      isPlaying:  {type:'boolean', default:false},
     
    },
    init: function() {
      const CONTEXT_AF = this;
      console.log("i am registered!");
      document.querySelector("#sproot_collider").addEventListener('click', function(e) {
        console.log("I am listening!");
        CONTEXT_AF.playDialogue();
      });
    },
    update : function(oldData) {
     
    },
    tick : function (time, timeDelta) {
      
    },
    playDialogue : function() {
      const CONTEXT_AF = this;
      console.log("I am clicked!");
      if (!CONTEXT_AF.isPlaying){
        console.log("I am clicked!");
        CONTEXT_AF.isPlaying = true;
        let sproot = document.querySelector("#sproot");
        let dialogue = DocumentTimeline.querySelector("#dialogue");
        sproot.setAttribute("animation-mixer", "clip: Sproot_Waving");
        dialogue.components['sound'].play();



      }
    }
    
  });