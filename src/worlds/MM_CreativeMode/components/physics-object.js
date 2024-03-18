// Free fall object component
AFRAME.registerComponent('physics-object', {
  schema: {
    initialPosition: {type: "vec3"},
    initialRotation: {type: "vec3"},
    mass: {type: "number"}
  },

  init: function () {
    const CONTEXT_AF = this;

    CONTEXT_AF.el.addEventListener('resetTransform', function (event) {
      CONTEXT_AF.el.setAttribute('position', CONTEXT_AF.data.initialPosition);
      CONTEXT_AF.el.setAttribute('rotation', CONTEXT_AF.data.initialRotation);
    });

    // position the physics object at it's starting position
    CONTEXT_AF.el.emit('resetTransform', {});

    // add the mass label
    // let labelElement = document.createElement('a-entity');
    // labelElement.setAttribute('text', {
    //   value: CONTEXT_AF.data.mass + "kg",
    //   color: "black"
    // });
    // labelElement.setAttribute('circles-rounded-rectangle', {
    //   color: "white",
    //   width: 3
    // });
    // labelElement.setAttribute('position', "0 3 0");
    // labelElement.setAttribute('scale', "2 2 2");
    // CONTEXT_AF.el.appendChild(labelElement);


    // let labelElement = document.createElement('a-entity');
    // labelElement.setAttribute('circles-label', {
    //   text: CONTEXT_AF.data.mass + " kg",
    //   offset: "0 0 0",
    //   arrow_position: "down"
    // });
    // labelElement.setAttribute('position', "0 3 0");
    // labelElement.setAttribute('scale', "2 2 2");
    // CONTEXT_AF.el.appendChild(labelElement);
  }
});
