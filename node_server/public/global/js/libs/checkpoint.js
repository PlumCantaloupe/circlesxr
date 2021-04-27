'use strict';

AFRAME.registerComponent('checkpoint', {
  schema: {
    offset: {default: {x: 0, y: 0, z: 0}, type: 'vec3'}
  },

  init: function () {
    const Context_AF = this;

    Context_AF.active = false;
    Context_AF.targetEl = null;
    Context_AF.fire = Context_AF.fire.bind(Context_AF);
    Context_AF.offset = new THREE.Vector3();
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