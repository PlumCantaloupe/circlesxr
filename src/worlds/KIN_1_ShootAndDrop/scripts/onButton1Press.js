const onButton1Press = () => {
  const ball = document.querySelector('#test-ball-triggerable');

  ball.emit('startAnimation');
};
