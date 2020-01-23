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
    checkpoints[randCheckpoint].object3D.getWorldPosition( randElemPos );       //get and set position 
    //Context_AF.el.object3D.position.set(randElemPos.x, randElemPos.y, randElemPos.z);
    Context_AF.el.setAttribute('position',{x:randElemPos.x, y:randElemPos.y, z:randElemPos.z});

    //set rotation toward centre of scene
    const lookPoint   = new THREE.Vector3(0.0, Context_AF.el.object3D.position.y, 0.0);
    const toDir       = new THREE.Vector3( -lookPoint.x + Context_AF.el.object3D.position.x, -lookPoint.y + Context_AF.el.object3D.position.y, -lookPoint.z + Context_AF.el.object3D.position.z );
    const fromDir     = new THREE.Vector3( 0.0, 0.0, -1.0 ); //facing direction
    //Context_AF.el.object3D.lookAt( lookAtPoint );
    //Context_AF.el.object3D.rotation.y +=  Math.PI; //face the right way :) ... need to use setAttribute for NAF to work correctly
    Context_AF.el.setAttribute('rotation',{x:0.0, y:THREE.Math.radToDeg(fromDir.angleTo(toDir) + Math.PI), z:0.0});

    console.log( THREE.Math.radToDeg(fromDir.angleTo(toDir)) );
  }
});