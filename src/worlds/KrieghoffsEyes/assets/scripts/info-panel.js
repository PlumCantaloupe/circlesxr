AFRAME.registerComponent('info-panel', {
  init: function () {
    // Query or create the fade background and info text elements.
    //this.fadeBackgroundEl = document.querySelector('#fadeBackground');
    this.titleEl = document.querySelector('#panelTitle');
    this.descriptionEl = document.querySelector('#panelDescription');

    this.panelPositions = {
      redPaint: { x: 3.893, y: 1.805, z: -8.242 },
      greenPaint: { x: 0.045, y: 1.805, z: -8.242 },
      bluePaint: { x: -3.816, y: 1.805, z: -8.242 }
    };
    
    // Mapping painting IDs to their info. Customize as needed.
    this.paintingInfo = {
      redPaint: {
        title: 'Red Painting',
        description: 'A red painting.'
      },
      greenPaint: {
        title: 'Green Painting',
        description: 'A green painting.'
      },
      bluePaint: {
        title: 'Blue Painting',
        description: 'A blue painting.'
      }
    };
    
    // Listen for the custom event on the scene.
    this.el.sceneEl.addEventListener('paintingSelected', this.onPaintingSelected.bind(this));
    
    // Also, click on the background hides the panel.
    //var backgroundEl = document.querySelector('#background');
   // backgroundEl.addEventListener('click', this.hidePanel.bind(this));
    
    // Initially hide the panel.
    this.el.setAttribute('visible', false);
  },
  
  onPaintingSelected: function (evt) {
    var paintingId = evt.detail.id;
    var info = this.paintingInfo[paintingId];
    var panelPosition = this.panelPositions[paintingId];

    if (!info) { return; }

    this.el.setAttribute('position', panelPosition);
    this.el.object3D.scale.set(1, 1, 1);
    this.el.setAttribute('visible', true);
    
    // Set the text content.
    this.titleEl.setAttribute('text', 'value', info.title);
    this.descriptionEl.setAttribute('text', 'value', info.description);
  },
  
  
  hidePanel: function () {
    this.el.object3D.scale.set(0.001, 0.001, 0.001);
    this.el.setAttribute('visible', false);
  }
});

