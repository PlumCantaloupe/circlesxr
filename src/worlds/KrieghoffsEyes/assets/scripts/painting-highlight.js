//Responsive UI: https://github.com/aframevr/aframe/blob/gh-pages/examples/showcase/ui/index.html 

AFRAME.registerComponent('painting-highlight', {
  init: function () {
    var el = this.el;
    var originalColor ='#ffffff';
    // change color and scale up.
    el.addEventListener('mouseenter', function () {
      el.setAttribute('material', 'emisive', '#ffffff');
      el.setAttribute('material', 'emissiveIntensity', '0.1');
      el.object3D.scale.set(1.3, 1.6, 0.071);
    });
    // restore to original color and scale.
    el.addEventListener('mouseleave', function () {
      el.setAttribute('material', 'emisive', '#ffffff');
      el.setAttribute('material', 'emissiveIntensity', '0');
      el.setAttribute('material', 'color', originalColor);
      el.object3D.scale.set(1, 1.3, .071);
    });
    // On click emit painting selected to info panel
    el.addEventListener('click', function () {
      el.emit('paintingSelected', { id: el.id });
    });
  }
});

AFRAME.registerComponent('highlight-button', {
    init: function () {
      var el = this.el;
      let scale = el.getAttribute('scale');
      // Save the original color to restore on mouse leave.
      var originalColor = el.getAttribute('color');
      // On hover: change color and scale up.
      el.addEventListener('mouseenter', function () {
        el.setAttribute('material', 'color', '#ff0000');
        el.object3D.scale.set(scale.x * 1.2, scale.y * 1.2, scale.z * 1.2);
      });
      // On exit: restore original color and scale.
      el.addEventListener('mouseleave', function () {
        el.setAttribute('material', 'color', '#a22020');
        el.object3D.scale.set(0.082, 0.082, 0.08346);
      });
      // On click: emit a custom event to signal selection.
      el.addEventListener('click', function () {
        // Optionally, add a “clicked” state if you want to prevent repeated clicks.
        el.emit('paintingSelected', { id: el.id });
      });

      el.addEventListener('click', function () {
        el.setAttribute('animation', {
          property: 'position',
          from: { x: 0.7, y: -0.955, z: -0.08},
          to: { x: 0.7, y: -0.955, z:  0.030 },
          dur: 100, 
          easing: 'linear'
        });
      });
    }
  });
