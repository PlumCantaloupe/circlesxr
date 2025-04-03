AFRAME.registerComponent('test', {
    init: function() {
      const parent = document.querySelector('a-scene')
      
      const CONTEXT_AF = this;

      CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, (e) => {
        CONTEXT_AF.camera = CIRCLES.getMainCameraElement();

        const el = document.createElement('a-entity');
        el.setAttribute('geometry', {primitive: 'plane'});
        el.object3D.position.set(0, 1, -1);
        el.object3D.scale.set(1, 0.2, 1);
        el.setAttribute('material', {color: '#FFF', transparent: true, opacity: 0.7});
        el.setAttribute('text', {value: 'hello'});

        parent.appendChild(el);

        
        el.object3D.parent = CONTEXT_AF.camera.object3D;
      });
      

      
    }
  })
