const onButton1Press = () => {
  const ball = document.querySelector('#test-ball-triggerable');

  ball.emit('startAnimation');
};

const onTrigger = () => {
  const droppingBall = document.querySelector('#droppingBall');
  const shootingBall = document.querySelector('#shootingBall');

  droppingBall.emit('trigger');
  shootingBall.emit('trigger');
};

const onReset = () => {
  const droppingBall = document.querySelector('#droppingBall');
  const shootingBall = document.querySelector('#shootingBall');

  droppingBall.emit('reset');
  shootingBall.emit('reset');
};
