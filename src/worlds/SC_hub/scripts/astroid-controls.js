'use strict';

//this component will basically just toggle off/on the spinning of the walls
AFRAME.registerComponent('astroid-controls', {
  schema: {
    duration: {type: 'number', default:20000.0},  //duration is in milliseconds
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    
    //get a local reference to our entities and set some property variables
    const Context_AF = this;
    
    Context_AF.astroid      = document.querySelector('#astroid');
    //var entityEl = document.createElement('a-entity');
    
    Context_AF.spawned = false;
    Context_AF.objectCount == 0;
    //var sceneEl = null;
        var sceneEl = document.querySelector('a-scene');
        var entityEl = document.createElement('a-entity');
        entityEl.setAttribute('geometry', {
          id: "astriod",
          primitive: 'box',
          height: 3,
          width: 1

        });

    //var keyboardControls = el.components['keyboard-controls'];
    //keyboardControls.isPressed('KeyR');


    //var sceneEl = document.querySelector('a-scene');
    //let's add the basic animation to teh walls entity
    //note that it is not enabled initially
    
    
    
    //listen on click
    Context_AF.el.addEventListener('click', function() {

        
     

      if (Context_AF.spawned == true) {
      var sphere = document.querySelector('a-sphere');

      sphere.parentNode.removeChild(sphere);
        //entityEl.parentNode.removeChild(entityEl);
        Context_AF.spawned = false;
          //var entityEl = document.createElement('a-entity');
       
        

      }
      else if(Context_AF.spawned == false) {

        var entity = document.createElement('a-sphere');
        entity.setAttribute('position', {x: -9, y: 3, z: 0});
        entity.setAttribute('geometry', {'radius': 2});
        entity.setAttribute('material', {'src':'#earth_map'});
        
        entity.setAttribute("class", "cube");
        entity.setAttribute('grabbable', 'true');
        
        
        
        sceneEl.appendChild(entity);
        
        //sceneEl.appendChild(entityEl);
        Context_AF.spawned = true;

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
