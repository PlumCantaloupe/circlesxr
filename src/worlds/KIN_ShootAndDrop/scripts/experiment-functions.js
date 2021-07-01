// used to only trigger the startExperiment when possible
let experimentRunning = false;

// the gravity control that controls the physics of each object in the scene
let currentGravityStrength = 1;
const gravityMaxStrength = 3;
const gravityMinStrength = 0;
const gravityIncrementAmount = 0.5;

// the shoot strength that controls ball2's initial velocity
let currentPower = 2;
const powerMax = 5;
const powerMin = 0.5;
const powerIncrementAmount = 0.5;

// to be called once the scene is loaded to perform setup tasks
function setup () {
  // add collision events to both balls
  let ball1 = document.querySelector('#ball1');
  let ball2 = document.querySelector('#ball2');

  ball1.addEventListener('collide', function (e) {
    // check if the other object is the floor
    if (e.detail.body.el.id == "floor") {
      // get the left object collision indicator
      let indicator = document.querySelector('#leftCollisionIndicator');

      // trigger the stop event on the left indicator
      indicator.emit('stop');
    }
  });

  ball2.addEventListener('collide', function (e) {
    // check if the other object is the floor
    if (e.detail.body.el.id == "floor") {
      // get the right object collision indicator
      let indicator = document.querySelector('#rightCollisionIndicator');

      // trigger the stop event on the right indicator
      indicator.emit('stop');
    }
  });

  // set the starting gravity
  setGravity(currentGravityStrength);

  // set the starting power
  updatePowerTexts();
}

// called when the start button is pressed
function startExperiment () {
  // ensure that the experiment is not already running
  if (!experimentRunning) {
    experimentRunning = true;
    console.log('Starting experiment');

    // shoot ball 2
    let ball2 = document.querySelector('#ball2');
    ball2.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: 0.125; offset: 0 -1 0; linearDamping:0.2;');
    ball2.body.velocity.set(currentPower * 2, 0, 0);

    // Drop ball 1
    let ball1 = document.querySelector('#ball1');
    ball1.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: 0.125; offset: 0 -1 0;');

    // get the collision indicators
    let leftIndicator = document.querySelector('#leftCollisionIndicator');
    let rightIndicator = document.querySelector('#rightCollisionIndicator');

    // start the indicators
    leftIndicator.emit('start');
    rightIndicator.emit('start');
  }
};

// called when the reset button is pressed
function resetExperiment () {
  console.log('Reseting experiment');

  // get all the free fall objects
  let freeFallObjects = document.querySelectorAll("[physics-object]");

  // loop through each free fall object
  freeFallObjects.forEach(element => {
    // remove velocity on the object
    element.setAttribute('velocity', {x: 0, y: 0, z: 0});

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

  experimentRunning = false;
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

// increases the power of the cannon (initial ball velocity)
function increasePower () {
  // ensure the power is not currently at max value
  if (currentPower < powerMax) {
    // increase the power
    currentPower += powerIncrementAmount;
    console.log(`Increasing power to ${currentPower}`);
    updatePowerTexts();
  }
}

function decreasePower () {
  // ensure the power is not currently at min value
  if (currentPower > powerMin) {
    // decrease the power
    currentPower -= powerIncrementAmount;
    console.log(`Decreasing power to ${currentPower}`);
    updatePowerTexts();
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

// updates all texts with class 'powerText' to show the current power
function updatePowerTexts () {
  // update the power texts
  let powerTexts = document.querySelectorAll('.powerText');
  powerTexts.forEach(text => {
    AFRAME.utils.entity.setComponentProperty(text, 'text', {value: currentPower});
  });
}
