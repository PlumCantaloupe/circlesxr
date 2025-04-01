// https://aframe.io/docs/1.7.0/components/raycaster.html#listening-for-raycaster-intersection-data-change


let positions = [];

let colorStr = 'rgb(0, 0,0)';
let recieveColorStr = 'rgb(73, 47, 47)';


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
      this.raycaster.setAttribute('raycaster', {interval:0});
    });
    this.el.addEventListener('raycaster-intersected-cleared', evt => {
      this.raycaster = null;
    });


    this.el.addEventListener("mouseup", e => {
      
        this.isDrawing = false;

        Context_AF.socket.emit('lineData', positions, colorStr);
        console.log('sending line data to server');
        console.log('sending color: ' + colorStr);

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

    document.querySelector('#redPaint').addEventListener('click', function(e){
      console.log('red paint clicked');
      colorStr = 'rgb(120,40,50)'
      // Context_AF.socket.emit('red');
     
  });

  document.querySelector('#blackPaint').addEventListener('click', function(e){
    console.log('black paint clicked');
    colorStr = 'rgb(0,0,0)'
    // Context_AF.socket.emit('black');
   
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

      Context_AF.socket.on ("addNewLine", (pos,color) => {
        //console.log("array of intersection pos");
   
        // TODO create draw function
        for (let i = 0; i< pos.length; i++){
          console.log(pos[i]);
          const dot = document.createElement('a-entity');
          dot.setAttribute('geometry', {primitive: 'plane', height:0.05, width: 0.05});
          dot.setAttribute('material', {color: color});
          dot.object3D.rotation.y = THREE.MathUtils.degToRad(90);
          dot.object3D.position.set((pos[i].x +0.06), pos[i].y, pos[i].z);
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
    let intersection = this.raycaster.components.raycaster.getIntersection(this.el);
    let pos = intersection.point;
    if (!intersection) { return; }

    if(this.isDrawing){
        // console.log(intersection.point);
        // console.log(pos.x);

        // creating plane at POI using colour selected
        const dot = document.createElement('a-entity');
        dot.setAttribute('geometry', {primitive: 'plane', height:0.05, width: 0.05});
        dot.setAttribute('material', {color:colorStr});
        dot.object3D.rotation.y = THREE.MathUtils.degToRad(90);
        dot.object3D.position.set((pos.x + 0.06), pos.y, pos.z );
        dot.classList.add('drawingDot');
        scene.appendChild(dot);
        recordPositions(pos);
    }
  }
});


function recordPositions(pos){

  // pushing point coordinates to global array
  positions.push({x: pos.x, y:pos.y, z: pos.z})

};
