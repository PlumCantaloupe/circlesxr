// https://aframe.io/docs/1.7.0/components/raycaster.html#listening-for-raycaster-intersection-data-change


let positions = [];


AFRAME.registerComponent('raycaster-listen', {
	init: function () {
    // Use events to figure out what raycaster is listening so we don't have to
    // hardcode the raycaster.
    const Context_AF = this;
    Context_AF.socket= null;
    Context_AF.connected  = false;

    this.el.addEventListener('raycaster-intersected', evt => {
    // this is the raycasting entity that fired
      this.raycaster = evt.detail.el;
    });
    this.el.addEventListener('raycaster-intersected-cleared', evt => {
      this.raycaster = null;
    });


    this.el.addEventListener("mouseup", e => {
      
        this.isDrawing = false;

        Context_AF.socket.emit('lineData', positions);
        console.log('why is this repeating');

    

        // this function repeates multiple times not sure why
        // Fixed when it was moved to the networking system
        // drawRecievedLine();


        // clearing position array
        positions = [];

  
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

    // function drawRecievedLine(){
    //   Context_AF.socket.on ("addNewLine", (pos) => {
    //     console.log("array of intersection pos");
    //     console.log(pos);
    //   });
    // }; 

    document.addEventListener(CIRCLES.EVENTS.READY, function() {
      console.log('Circles is ready!');
      startedDrawing = true;
  });

    Context_AF.createNetworkingSystem = function () {
      Context_AF.socket = CIRCLES.getCirclesWebsocket();
      Context_AF.connected = true;
      const scene = this.el.sceneEl;

      console.log('CONNECTED!!!!!!!!');
      console.log(Context_AF.socket.id);

      Context_AF.socket.on ("addNewLine", (pos) => {
        console.log("array of intersection pos");
   

        // TODO create draw function
        for (let i = 0; i< pos.length; i++){
          console.log(pos[i]);
          const dot = document.createElement('a-entity');
          dot.setAttribute('geometry', {primitive: 'plane', height:0.05, width: 0.05});
          dot.setAttribute('material', {color:'black'});
          dot.object3D.rotation.y = THREE.MathUtils.degToRad(90);
          dot.object3D.position.set(pos[i].x, pos[i].y, (pos[i].z + 0.06));
          dot.classList.add('drawingDot');
          scene.appendChild(dot);
        }
      });

  };

  if (CIRCLES.isCirclesWebsocketReady()) {
    Context_AF.createNetworkingSystem();
    console.log('circles websocket is ready ');
}
else {
    const wsReadyFunc = function() {
        Context_AF.createNetworkingSystem();
        Context_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
    };
    Context_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
}

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
        recordPositions(pos);
    }
  }
});


function recordPositions(pos){
  positions.push({x: pos.x, y:pos.y, z: pos.z});
  
  // console.log(Array.isArray(positions));     /// true
  // console.log(positions.lenght);             /// undefine.... ??? i was spelling lenght WRONG AAA

};
