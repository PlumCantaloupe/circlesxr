// used to only trigger the startExperiment when possible
let experimentRunning = false;

// the gravity control that controls the physics of each object in the scene
let currentGravityStrength = 1;
const gravityMaxStrength = 3;
const gravityMinStrength = 0;
const gravityIncrementAmount = 0.5;

// the shoot strength that controls ball's initial velocity
let currentAngle = 0;
const angleMax = 60;
const angleMin = 0;
const angleIncrementAmount = 30;
const force = 8;
let forceToApply = {
  x : 8,
  y : 0
}

// to be called once the scene is loaded to perform setup tasks
function setup () {
  // add collision events to both balls
  let ball = document.querySelector('#ball');

  ball.addEventListener('collide', function (e) {
    // check if the other object is the monkey
    if (e.detail.body.el.id == "monkey") {
      // get the right object collision indicator
      let indicator = document.querySelector('#rightCollisionIndicator');

      // trigger the stop event on the right indicator
      indicator.emit('stop');
    }
  });

  // set the starting gravity
  setGravity(currentGravityStrength);

  // set the starting angle
  updateAngleTexts();
}

// called when the start button is pressed
function startExperiment () {
  // ensure that the experiment is not already running
  if (!experimentRunning) {
    experimentRunning = true;
    console.log('Starting experiment');

    // get the balls
    let monkey = document.querySelector('#monkey');
    let ball = document.querySelector('#ball');

    // drop monkey
    monkey.setAttribute('dynamic-body', 'shape: box;');

    // shoot object2
    ball.setAttribute('dynamic-body', 'shape: sphere; sphereRadius: 0.125; offset: 0 -1 0;');
    console.log(forceToApply.x);
    ball.body.velocity.set(forceToApply.x, forceToApply.y, 0);

    // get the collision indicators
    let rightIndicator = document.querySelector('#rightCollisionIndicator');

    // start the indicators
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

  // reset ball position
  rotateNozzle();

  // get the collision indicators
  let rightIndicator = document.querySelector('#rightCollisionIndicator');

  // reset the indicators
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

// increases the angle of the cannon (initial ball velocity)
function increaseAngle () {
  // ensure the angle is not currently at max value
  if (currentAngle < angleMax) {
    // increase the angle
    currentAngle += angleIncrementAmount;
    console.log(`Increasing angle to ${currentAngle} degrees`);
    updateAngleTexts();

    // rotate the cannon nozzle
    rotateNozzle();
  }
}

function decreaseAngle () {
  // ensure the angle is not currently at min value
  if (currentAngle > angleMin) {
    // decrease the angle
    currentAngle -= angleIncrementAmount;
    console.log(`Decreasing angle to ${currentAngle} degrees`);
    updateAngleTexts();

    // rotate the cannon nozzle
    rotateNozzle();
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

// updates all texts with class 'angleText' to show the current angle
function updateAngleTexts () {
  // update the angle texts
  let angleTexts = document.querySelectorAll('.angleText');
  angleTexts.forEach(text => {
    AFRAME.utils.entity.setComponentProperty(text, 'text', {value: currentAngle + ' deg'});
  });
}

// rotates the cannon's nozzle when the angle is either increased or decreased
function rotateNozzle() {
  let cannonNozzle = document.querySelector('#cannonNozzle');
  cannonNozzle.setAttribute('rotation', `-${currentAngle} 90 0`);

  // Update the ball's position as well as set the force to apply to it
  let cannonBall = document.querySelector('#ball');
  switch(currentAngle) {
    case 0:
      cannonBall.setAttribute('position', `-3.01 3.62 -6.97`);
      forceToApply.x = force;
      forceToApply.y = 0;
      break;
    
    case 30:
      cannonBall.setAttribute('position', `-3.07 3.84 -6.97`);
      forceToApply.x = force * (Math.sqrt(3) / 2);
      forceToApply.y = force * (1 / 2);
      break;

    case 60:
      cannonBall.setAttribute('position', `-3.26 3.97 -6.97`);
      forceToApply.y = force * (1 / 2);
      forceToApply.x = force * (Math.sqrt(3) / 2);
      break;
  }
}
