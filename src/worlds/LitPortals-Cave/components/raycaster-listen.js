// https://aframe.io/docs/1.7.0/components/raycaster.html#listening-for-raycaster-intersection-data-change

AFRAME.registerComponent('raycaster-listen', {
	init: function () {
    // Use events to figure out what raycaster is listening so we don't have to
    // hardcode the raycaster.

    this.el.addEventListener('raycaster-intersected', evt => {
    // this is the raycasting entity that fired
      this.raycaster = evt.detail.el;
    });
    this.el.addEventListener('raycaster-intersected-cleared', evt => {
      this.raycaster = null;
    });


    this.el.addEventListener("mouseup", e => {
        this.isDrawing = false;
    });
    this.el.addEventListener("mouseout", e => {
        this.isDrawing = false;
    });
    this.el.addEventListener("mousedown", e => {
        this.isDrawing = true;
    });

    this.el.addEventListener("touchend", e => {
        this.isDrawing = false;
    });
    this.el.addEventListener("touchmove", e => {
        this.isDrawing = true;
    });
    this.el.addEventListener("touchstart", e => {
        this.isDrawing = true;
    });

  },

  tick: function () {

    const scene = this.el.sceneEl;


    if (!this.raycaster) { return; }  // Not intersecting.

    //
    let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
    let pos = intersection.point;
    if (!intersection) { return; }

    if(this.isDrawing){
        // console.log(intersection.point);
        // console.log(pos.x);

        const dot = document.createElement('a-entity');
        dot.setAttribute('geometry', {primitive: 'plane', height:0.05, width: 0.05});
        dot.setAttribute('material', {color:'black'});
        dot.object3D.rotation.y = THREE.MathUtils.degToRad(90);
        dot.object3D.position.set(pos.x, pos.y, (pos.z + 0.06));
        dot.classList.add('drawingDot');
        scene.appendChild(dot);

       


    }
  }
});