'use strict';

AFRAME.registerComponent('circles-checkpoint', {
  schema: {
    offset: {default: {x: 0, y: 0, z: 0}, type: 'vec3'}
  },

  init: function () {
    const Context_AF = this;

    Context_AF.active = false;
    Context_AF.targetEl = null;
    Context_AF.fire = Context_AF.fire.bind(Context_AF);
    Context_AF.offset = new THREE.Vector3();

    //add some basic styling
    Context_AF.el.setAttribute('material', {transparent:false, color:'rgb(57, 187, 130)', emissive:'rgb(7,137,80)'});
    Context_AF.el.setAttribute('geometry', {primitive:'cylinder', radius:0.5, height:0.04});
    Context_AF.el.setAttribute('circles-interactive-object', '');

    //make sure this is interactive
    if (!Context_AF.el.classList.contains('checkpoint')) {
        Context_AF.el.classList.add('checkpoint');
    }
  },

  update: function () {
    this.offset.copy(this.data.offset);
  },

  play: function () { this.el.addEventListener('click', this.fire); },
  pause: function () { this.el.removeEventListener('click', this.fire); },
  remove: function () { this.pause(); },

  fire: function () {
    const targetEl = this.el.sceneEl.querySelector('[checkpoint-controls]');
    if (!targetEl) {
      throw new Error('No `checkpoint-controls` component found.');
    }
    targetEl.components['checkpoint-controls'].setCheckpoint(this.el);
  },

  getOffset: function () {
    return this.offset.copy(this.data.offset);
  }
});