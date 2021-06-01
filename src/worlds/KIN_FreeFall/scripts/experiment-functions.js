// the list of physics objects that can be used in the scene (and their properties)
const PHYSICS_OBJECTS = {
  object1 = {name: "ball", mass: 0.3, assetId=""},
  object2 = {name: "teddy", mass: 0.1, assetId=""},
  object3 = {name: "car", mass: 100, assetId=""}
};

// the gravity control that controls the physics of each object in the scene
let currentGravityStrength = 1;
const gravityMaxStrength = 3;
const gravityMinStrength = 0;
const gravityIncrementAmount = 0.5;

function startExperiment () {
  console.log('Starting experiment');

  // get all the free fall objects
  let freeFallObjects = document.querySelectorAll("[physics-object]");

  // loop through each free fall object
  freeFallObjects.forEach(element => {
    // enable physics on the object
    element.setAttribute('dynamic-body', '');
  });
};

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
};

function setLeftObject (object) {
  console.log('Setting left object to ' + object.name);
};

function setRightObject (object) {
  console.log('Setting right object to ' + object.name);
};

function increaseGravity () {
  // ensure the gravity is not currently at max value
  if (currentGravityStrength < gravityMaxStrength) {
    console.log('Increasing gravity');

    // increase the gravity
    currentGravityStrength += gravityIncrementAmount;
    setGravity(currentGravityStrength);
  }
};

function decreaseGravity () {
  // ensure the gravity is not currently at min value
  if (currentGravityStrength > gravityMinStrength) {
    console.log('Decreasing gravity');

    // decrease the gravity
    currentGravityStrength -= gravityIncrementAmount;
    setGravity(currentGravityStrength);
  }
}

// used to easily update the gravity text and physics system
function setGravity (gMultiplier) {
  // get the a-scene
  let sceneEl = document.querySelector('a-scene');

  // update the physics system
  sceneEl.systems.physics.driver.world.gravity.y = -9.8 * gMultiplier

  console.log(sceneEl.getAttribute('physics'));

  // update the gravity strength text
  gravityStengthText = document.querySelector('#gravityStrengthText');
  gravityStengthText.setAttribute('text', {
    value: "Current Gravity: " + gMultiplier + "g",
    align: "center"
  });
}
