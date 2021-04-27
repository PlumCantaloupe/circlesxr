'use strict';

AFRAME.registerComponent('circles-teleport', {
  schema: {},

  init: function() {
    let avatarRigElem = this.el.object3D;
    let checkpoints = document.querySelectorAll('.checkpoint');

    for ( let i = 0; i < checkpoints.length; i++ ) {
        checkpoints[i].addEventListener('click', function (evt) {
            //console.log('Checkpoint#' + i + ' was CLICKED at: ', evt.detail.intersection.point);
            const checkPos = checkpoints[i].object3D.position;
            avatarRigElem.position.x = checkPos.x;
            avatarRigElem.position.y = checkPos.y;
            avatarRigElem.position.z = checkPos.z;
        });
    }
  }
});