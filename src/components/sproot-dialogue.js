'use strict';
AFRAME.registerComponent('sproot-dialogue', {
    schema: {
      isPlaying:  {type:'boolean', default:false},
     
    },
    init: function() {
      const CONTEXT_AF = this;
     
      document.addEventListener(CIRCLES.EVENTS.READY, function() {
        
        console.log("i am registered!");
        
        //if (CONTEXT_AF.el.hasAttribute('circles-interactive-object') === false) {
         //  CONTEXT_AF.el.setAttribute('circles-interactive-object', {});
       // } 
       CONTEXT_AF.el.addEventListener('click', CONTEXT_AF.playDialogue());
  
      });
      
      //make sure this is interactive
    
 
    },
    update : function(oldData) {
     
    },
    tick : function (time, timeDelta) {
    
    },
    playDialogue : function() {
      

      const CONTEXT_AF = this;
      console.log("I am clicked!");
      if (!CONTEXT_AF.isPlaying){
        console.log("I am playing!");
        CONTEXT_AF.isPlaying = true;
        let sproot = document.querySelector("#sproot");
        let dialogue = document.querySelector("#dialogue");
        sproot.setAttribute("animation-mixer", "clip: Sproot_Waving; loop:once");
        dialogue.setAttribute('circles-sound', {state: 'play'});
        CONTEXT_AF.el.addEventListener('animation-finished', endFunction());
        
        function endFunction(){
          CONTEXT_AF.el.removeEventListener('animation-finished', endFunction());
          sproot.setAttribute("animation-mixer", "clip: Sproot_Idle; loop:repeat");
          CONTEXT_AF.isPlaying = false;
        }

      }
    },
    prepElemsForInteraction: function(){
      console.log("I am active");
      
    },
    
    
  });