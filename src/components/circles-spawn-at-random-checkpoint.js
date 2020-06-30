'use strict';

AFRAME.registerComponent('circles-spawn-at-random-checkpoint', {
  schema: {},
  init: function()
  {
    const Context_AF = this;

    //set position
    const checkpoints       = document.querySelectorAll('.checkpoint');         //first get list of checkpoint elements
    const randCheckpoint    = Math.floor(Math.random() * checkpoints.length);   //randomly choose one
    const randElemPos       = new THREE.Vector3(); 
    checkpoints[randCheckpoint].object3D.getWorldPosition( randElemPos );       //get and set "player1" to position 
    Context_AF.el.setAttribute('position',{x:randElemPos.x, y:randElemPos.y, z:randElemPos.z});

    //set rotation toward centre of scene (assume origin)
    const yRotation = THREE.Math.radToDeg(Math.atan2( Context_AF.el.object3D.position.x, Context_AF.el.object3D.position.z ));
    Context_AF.el.setAttribute('rotation',{x:0.0, y:yRotation, z:0.0});
  }
});