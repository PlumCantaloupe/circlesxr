//Once the user clicks the "Enter Circles" Button Gea's intro animation will start
//Que Gea's introduction of the path
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, function() {
  console.log(document.querySelector('#user-gesture-enter'));
  document.querySelector('#user-gesture-enter').addEventListener('click', function() {
      //Get all the parts of Gea that will be animated
      const leftArmAnimation = document.querySelector('#GeaArmLeft');
      const headAnimation = document.querySelector('#GeaHead');
      const fullBodyArmAnimation = document.querySelector('#Gea');

      //Start the animation sequence and use timeouted emits to seperate the start of each animation
      setTimeout(() => leftArmAnimation.emit('armPath-animation'), 100);
      setTimeout(() => headAnimation.emit('lookPath-animation'), 100);
      setTimeout(() => fullBodyArmAnimation.emit('followThePath-animation'), 4000);
      setTimeout(() => headAnimation.emit('lookBack-animation'), 7000);
      setTimeout(() => fullBodyArmAnimation.emit('returnToStartBody-animation'), 10000);
      setTimeout(() => headAnimation.emit('returnToStartHead-animation'), 10000);
      setTimeout(() => leftArmAnimation.emit('armDown-animation'), 10000);
      setTimeout(() => headAnimation.emit('goOn1-animation'), 16000);
      setTimeout(() => headAnimation.emit('goOn2-animation'), 17000);
      setTimeout(() => headAnimation.emit('laugh1-animation'), 19000);
      setTimeout(() => headAnimation.emit('laugh2-animation'), 19250);
      setTimeout(() => headAnimation.emit('laugh3-animation'), 19500);
      setTimeout(() => headAnimation.emit('laughReturn-animation'), 19900);
      setTimeout(() => headAnimation.emit('lookPath-animation'), 22000);
      setTimeout(() => leftArmAnimation.emit('armPath-animation'), 22500);
      //Finishing animation 
    });
});

//Que Gea leaving after the player finishes questions the first question
document.querySelector("#Gea").addEventListener('endQuestion1', function () {
  //Get all the parts of Gea that will be animated
  const FullBodyArmAnimation = document.querySelector('#Gea');
  const leftArmAnimation = document.querySelector('#GeaArmLeft');
  const rightArmAnimation = document.querySelector('#GeaArmRight');
  const headAnimation = document.querySelector('#GeaHead');

  //Start the animation sequence and use timeouted emits to seperate the start of each animation
  setTimeout(() => leftArmAnimation.emit('leftArmExit-animation'), 100);
  setTimeout(() => rightArmAnimation.emit('rightArmExit-animation'), 100);
  setTimeout(() => headAnimation.emit('headExit-animation'), 300);
  setTimeout(() => FullBodyArmAnimation.emit('exit-animation'), 500);
  setTimeout(() => leftArmAnimation.emit('resetLeftArm-animation'), 5000);
  setTimeout(() => rightArmAnimation.emit('resetRightArm-animation'), 5000);
  setTimeout(() => headAnimation.emit('resetHead-animation'), 5000);
  //Finishing animation 

  //Move and rotate Gea to the next location
  setTimeout(() => document.querySelector("#Gea").setAttribute("position", "-61.075 15.298 -138.532"), 8000);
  setTimeout(() => document.querySelector("#Gea").setAttribute("rotation", "0 -129.118 0"), 8000);
});

//Que Gea checking on the player after they finish questions the fifth question
document.querySelector("#Gea").addEventListener('endQuestion5', function () {
  //Get all the parts of Gea that will be animated
  const FullBodyArmAnimation = document.querySelector('#Gea');
  const leftArmAnimation = document.querySelector('#GeaArmLeft');
  const rightArmAnimation = document.querySelector('#GeaArmRight');
  const headAnimation = document.querySelector('#GeaHead');

  //Move and rotate Gea to the correct location
  document.querySelector("#GeaArmLeft").setAttribute("rotation", "-20.923 18.183 -6.210");
  document.querySelector("#GeaArmRight").setAttribute("rotation", "22.056 -18.525 -7.825");
  document.querySelector("#GeaHead").setAttribute("rotation", "2.920 14.575 28.884");

  //Start the animation sequence and use timeouted emits to seperate the start of each animation
  setTimeout(() => FullBodyArmAnimation.emit('GeaMidEntry-animation'), 0);
  setTimeout(() => headAnimation.emit('entryMidHead-animation'), 1500);
  setTimeout(() => leftArmAnimation.emit('resetLeftArm-animation'), 1000);
  setTimeout(() => rightArmAnimation.emit('resetRightArm-animation'), 1000);
  
  //Select Gea and start the intro dialogue
  document.querySelector("#GeaHead").setAttribute('sound', {src:'#GeaHalfway'});
  setTimeout(() => document.querySelector("#GeaHead").components['sound'].playSound(), 2500);

  //Continue the animation sequence and use timeouted emits to seperate the start of each animation
  setTimeout(() => FullBodyArmAnimation.emit('wow-animation'), 2750);
  setTimeout(() => FullBodyArmAnimation.emit('wowReturn-animation'), 3250);
  setTimeout(() => leftArmAnimation.emit('armPath-animation'), 6000);
  setTimeout(() => headAnimation.emit('lookPath-animation'), 6000);
  setTimeout(() => FullBodyArmAnimation.emit('GeaMidExit-animation'), 10000);
  setTimeout(() => headAnimation.emit('headMidExit-animation'), 10000);
  setTimeout(() => leftArmAnimation.emit('leftArmExit-animation'), 10000);
  setTimeout(() => rightArmAnimation.emit('rightArmExit-animation'), 10000);
  //Finishing animation 

});

//Que Gea's ending dialogue once the player has completeed the last question
document.querySelector("#Gea").addEventListener('endQuestion10', function () {
  //Get all the parts of Gea that will be animated
  const FullBodyArmAnimation = document.querySelector('#Gea');
  const leftArmAnimation = document.querySelector('#GeaArmLeft');
  const rightArmAnimation = document.querySelector('#GeaArmRight');
  const headAnimation = document.querySelector('#GeaHead');

  //Move and rotate Gea to the correct location
  document.querySelector("#Gea").setAttribute("rotation", "0 125.340 0");
  document.querySelector("#GeaArmLeft").setAttribute("rotation", "-20.923 18.183 -6.210");
  document.querySelector("#GeaArmRight").setAttribute("rotation", "22.056 -18.525 -7.825");
  document.querySelector("#GeaHead").setAttribute("rotation", "2.920 14.575 28.884");

  //Start the animation sequence and use timeouted emits to seperate the start of each animation
  setTimeout(() => FullBodyArmAnimation.emit('GeaEndEntry-animation'), 0);
  setTimeout(() => headAnimation.emit('entryMidHead-animation'), 1500);
  setTimeout(() => leftArmAnimation.emit('resetLeftArm-animation'), 1000);
  setTimeout(() => rightArmAnimation.emit('resetRightArm-animation'), 1000);

  //Select Gea and start the intro dialogue
  document.querySelector("#GeaHead").setAttribute('sound', {src:'#GeaEnd'});
  setTimeout(() => document.querySelector("#GeaHead").components['sound'].playSound(), 2500);

  //Continue the animation sequence and use timeouted emits to seperate the start of each animation
  setTimeout(() => rightArmAnimation.emit('raiseRightArm-animation'), 5000);
  setTimeout(() => leftArmAnimation.emit('raiseLeftArm-animation'), 5000);
  setTimeout(() => leftArmAnimation.emit('resetLeftArm-animation'), 10000);
  setTimeout(() => rightArmAnimation.emit('resetRightArm-animation'), 10000);
  setTimeout(() => rightArmAnimation.emit('shurgRightArm-animation'), 13500);
  setTimeout(() => leftArmAnimation.emit('shurgLeftArm-animation'), 13500);
  setTimeout(() => leftArmAnimation.emit('shurgEndLeftArm-animation'), 14000);
  setTimeout(() => rightArmAnimation.emit('shurgEndRightArm-animation'), 14000);
  setTimeout(() => headAnimation.emit('gallery1-animation'), 17000);
  setTimeout(() => headAnimation.emit('gallery2-animation'), 18000);
  setTimeout(() => headAnimation.emit('lookPath-animation'), 23000);
  setTimeout(() => leftArmAnimation.emit('armPath-animation'), 23500);
  //Finishing animation 
});