'use strict';
//NOTE!!: There needs to be a material on the model before we "extend" it with "highlight". A gltf likley has one, but make sure if manually defining that the "material" attribute is listed before this component


AFRAME.registerComponent('onclick-sproot', {
    schema: {
      isPlaying:  {type:'boolean', default:false},
     
    },
    init: function() {
      const CONTEXT_AF = this;
      this.el.addEventListener('click', function(){
        
        console.log("I am clicked!");
        
        
          CONTEXT_AF.isPlaying = true;
          let sproot = document.querySelector("#sproot");
          let dialogue = document.querySelector("#dialogue");
          sproot.setAttribute("animation-mixer", "clip: Sproot_Waving; loop:once");
          dialogue.setAttribute('circles-sound', {state: 'play'});
     
          setTimeout(function(){
            sproot.setAttribute("animation-mixer", "clip: Sproot_Idle; loop:repeat");
          }, 8000)
        
        
        
      });
      CONTEXT_AF.el.addEventListener('animation-finished', function(){
        sproot.setAttribute("animation-mixer", "clip: Sproot_Idle; loop:repeat");
       
      });
      
        
      },

    

  

      //make sure this is interactive
    
    
  });