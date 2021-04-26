'use strict';

AFRAME.registerComponent('circles-sendpoint', {
  schema: {
    target: {type: 'selector'}
  },

  init: function () {
    const CONTEXT_AF = this;
    console.log(CONTEXT_AF.data.target);
  },

  update: function () {
    
  }
});