AFRAME.registerComponent('easy-transparency', {
  init: function() {
    const self = this;
    const el = this.el;

    AFRAME.utils.entity.setComponentProperty(el, 'material.alphaTest', 0.2);
  }
});
