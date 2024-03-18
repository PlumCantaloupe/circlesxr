// the list of physics objects that can be used in the scene (and their properties)
const PHYSICS_OBJECTS = {
  object1 = {name: "SoccerBall", mass: 0.3, assetId="", height: 4.83, handHeight: 5.55, mesh: "sphere"},
  object2 = {name: "Bear", mass: 0.23, assetId="", height: 4.0, handHeight: 5.6, mesh: "box"},
  object3 = {name: "Car", mass: 1300, assetId="", height: 3.94, handHeight: 6.01, mesh: "box"},
  object4 = {name: "TennisBall", mass: 0.06, assetId="", height: 4.03, handHeight: 4.8, mesh: "sphere"}
};

// the gravity control that controls the physics of each object in the scene
let currentGravityStrength = 1;
const gravityMaxStrength = 3;
const gravityMinStrength = 0;
const gravityIncrementAmount = 0.5;

// to be called once the scene is loaded to perform setup tasks
function setup () {
  // add collision events to both objects
  let leftObject = document.querySelector('#leftObject');
  let rightObject = document.querySelector('#rightObject');

  leftObject.addEventListener('collide', function () {
    // get the left object collision indicator
    let indicator = document.querySelector('#leftCollisionIndicator');

    // trigger the stop event on the left indicator
    indicator.emit('stop');
  });

  rightObject.addEventListener('collide', function () {
    // get the right object collision indicator
    let indicator = document.querySelector('#rightCollisionIndicator');

    // trigger the stop event on the right indicator
    indicator.emit('stop');
  });

  // set the starting gravity
  setGravity(currentGravityStrength);
}

// called when the start button is pressed
function startExperiment () {
  console.log('Starting experiment');

  // get all the free fall objects
  let freeFallObjects = document.querySelectorAll("[physics-object]");
  console.log(freeFallObjects);

  // loop through each free fall object
  freeFallObjects.forEach(element => {
    // enable physics on the object
    element.setAttribute('dynamic-body', 'shape: box;');
  });

  // get the collision indicators
  let leftIndicator = document.querySelector('#leftCollisionIndicator');
  let rightIndicator = document.querySelector('#rightCollisionIndicator');

  // start the indicators
  leftIndicator.emit('start');
  rightIndicator.emit('start');
};

// called when the reset button is pressed
function resetExperiment () {
  console.log('Reseting experiment');

  // get all the free fall objects
  let freeFallObjects = document.querySelectorAll("[physics-object]");

  // loop through each free fall object
  freeFallObjects.forEach(element => {
    // disable physics on the object
    element.removeAttribute('dynamic-body');

    // reset the position of the object
    element.emit('resetTransform', {});
  });

  // get the collision indicators
  let leftIndicator = document.querySelector('#leftCollisionIndicator');
  let rightIndicator = document.querySelector('#rightCollisionIndicator');

  // reset the indicators
  leftIndicator.emit('reset');
  rightIndicator.emit('reset');
};

function setNewObject (object, direction) {
  let newObject = PHYSICS_OBJECTS[object];
  console.log(`Setting ${direction} object to ${newObject.name}`);

  // get left object
  let sceneObject = document.querySelector(`#${direction}Object`);

  // remove  geometry
  sceneObject.removeAttribute('geometry');

  // set gltf model to newObject
  sceneObject.setAttribute('gltf-model', `/worlds/KIN_FreeFall/assets/models/experimentObjects/${newObject.name}.glb`);

  // set new model scale
  // sceneObject.setAttribute('scale', `${newObject.scale.x} ${newObject.scale.y} ${newObject.scale.z}`);

  // update model mass
  sceneObject.setAttribute('physics-object', `mass: ${newObject.mass}`);

  // update model mesh shape
  //sceneObject.setAttribute('static-body', `shape: ${newObject.mesh}`);

  // rotate the object in the Y axis
  // let objectRotation = sceneObject.getAttribute('rotation');
  // sceneObject.setAttribute('rotation', `${objectRotation.x} ${newObject.rotationY} ${objectRotation.z}`);

  // set new object height
  let objectPosition = sceneObject.getAttribute('position');
  sceneObject.setAttribute('position', `${objectPosition.x} ${newObject.height} ${objectPosition.z}`);
  sceneObject.setAttribute('physics-object', `initialPosition: ${objectPosition.x} ${newObject.height} ${objectPosition.z}`);

  // set hand's new height
  let hand = document.querySelector(`#${direction}Hand`);
  console.log(hand);
  let handPosition = hand.getAttribute('position');
  console.log(handPosition);
  hand.setAttribute('position', `${handPosition.x} ${newObject.handHeight} ${handPosition.z}`);

  // change mass text
  let objectMassText = document.querySelector(`#mass${direction}ObjText`);
  AFRAME.utils.entity.setComponentProperty(objectMassText, 'text', {value: `${newObject.mass}kg`});
};

// called when the 'increaseGravity' button is pressed
function increaseGravity () {
  // ensure the gravity is not currently at max value
  if (currentGravityStrength < gravityMaxStrength) {
    // increase the gravity
    currentGravityStrength += gravityIncrementAmount;
    console.log(`Increasing gravity to ${currentGravityStrength}`);
    setGravity(currentGravityStrength);
  }
};

// called when the 'decreaseGravity' button is pressed
function decreaseGravity () {
  // ensure the gravity is not currently at min value
  if (currentGravityStrength > gravityMinStrength) {
    // decrease the gravity
    currentGravityStrength -= gravityIncrementAmount;
    console.log(`Decreasing gravity to ${currentGravityStrength}`);
    setGravity(currentGravityStrength);
  }
}

// used to easily update the gravity text and physics system
function setGravity (gMultiplier) {
  // get the a-scene
  let sceneEl = document.querySelector('a-scene');

  // update the physics system
  sceneEl.systems.physics.driver.world.gravity.y = -9.8 * gMultiplier

  // update the gravity strength text
  let gravityStrengthTexts = document.querySelectorAll('.gravityStrengthText');
  gravityStrengthTexts.forEach(text => {
    AFRAME.utils.entity.setComponentProperty(text, 'text', {value: `${gMultiplier}g`});
  });
}
