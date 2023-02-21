'use strict';

AFRAME.registerComponent('circles-spawn-at-random-checkpoint', {
  schema: {},
  init: function()
  {
    const CONTEXT_AF = this;

    //set position
    const checkpoints       = document.querySelectorAll('[circles-spawnpoint]');         //first get list of checkpoint elements

    if (checkpoints.length === 0) {
      console.warn('CIRCLES: no designated \'circles-spawnpoint\' in scene. Will default to origin[0, 0, 0]');
      CONTEXT_AF.el.setAttribute('position',{x:0.0, y:0.0, z:0.0});
      return;
    }

    const randCheckpoint    = Math.floor(Math.random() * checkpoints.length);   //randomly choose one
    const randElemPos       = new THREE.Vector3(); 
    checkpoints[randCheckpoint].object3D.getWorldPosition( randElemPos );       //get and set "player1" to position 
    CONTEXT_AF.el.setAttribute('position',{x:randElemPos.x, y:randElemPos.y, z:randElemPos.z});

    //set rotation toward centre of scene (assume origin)
    const yRotation = THREE.MathUtils.radToDeg(Math.atan2( CONTEXT_AF.el.object3D.position.x, CONTEXT_AF.el.object3D.position.z ));
    CONTEXT_AF.el.setAttribute('rotation',{x:0.0, y:yRotation, z:0.0});
  }
});