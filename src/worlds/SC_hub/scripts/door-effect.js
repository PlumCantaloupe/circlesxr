'use strict';

//this component will basically just toggle off/on the spinning of the walls
AFRAME.registerComponent('door-effect', {
  schema: {
    duration: {type: 'number', default:0.000001},  //duration is in milliseconds
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    
    //get a local reference to our entities and set some property variables
    const Context_AF = this;
    
    Context_AF.door1      = document.querySelector('#door1');
    Context_AF.door2      = document.querySelector('#door2');
    
    Context_AF.isSpinning = false;
    
    //let's add the basic animation to teh walls entity
    //note that it is not enabled initially
    
    
 
    
    //listen on click
    Context_AF.el.addEventListener('click', function() {
      if (Context_AF.isSpinning == true) {
       // Context_AF.venus.setAttribute("visible",false);
        
        console.log('door close')
        Context_AF.door1.setAttribute('animation', {property:'position', to: "0 5  0",  dur:1000 , easing:'linear', enabled:true});
        Context_AF.door2.setAttribute('animation', {property:'position', to: "0 2  0",  dur:1000, easing:'linear', enabled:true});
        Context_AF.isSpinning = false;
      }
      else {
        
        
        console.log('Door open')
        Context_AF.door1.setAttribute('animation', {property:'position', to: "0 7  0",  dur:1000, easing:'linear', enabled:true});
    Context_AF.door2.setAttribute('animation', {property:'position', to: "0 -5  0",  dur:1000, easing:'linear', enabled:true});
        Context_AF.isSpinning = true;
        //Context_AF.venus.setAttribute("visible",true);
      }
    });
    
  },
  
  //component documentation: https://github.com/aframevr/aframe/blob/master/docs/core/component.md
  
  // update: function (oldData) {},
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
