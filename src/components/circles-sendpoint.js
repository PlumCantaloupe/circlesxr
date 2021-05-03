'use strict';

AFRAME.registerComponent('circles-sendpoint', {
  schema: {
    target: {type:'selector', default:null}    //pass in id to checkpoint (must be checkpoint to work with navmesh) you want user to go to ...
  },

  init: function () {
    const CONTEXT_AF = this;

    CONTEXT_AF.el.addEventListener('click', (e) => {
      if ( CONTEXT_AF.data.target ) {
        const checkPos = CONTEXT_AF.data.target.click();
      }
    });
  },
  // update: function () {}
});