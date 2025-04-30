//Once the user clicks the "Enter Circles" Button Gea's intro animation will start
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, function() {
  console.log(document.querySelector('#user-gesture-enter'));
  document.querySelector('#user-gesture-enter').addEventListener('click', function() {

    console.log("Animation Ready");
    //Get all the parts of Gea that will be animated
    const FullBodyArmAnimation = document.querySelector('#Gea');
    const leftArmAnimation = document.querySelector('#GeaArmLeft');
    const rightArmAnimation = document.querySelector('#GeaArmRight');
    const headAnimation = document.querySelector('#GeaHead');
    const armsAnimation = document.querySelector('#GeaArms');
  
    //Wait for the title intro to end
    setTimeout(() => headAnimation.emit('lookPlayer-animation'), 8000);
  
    //Select Gea and start the intro dialogue
    document.querySelector("#GeaHead").setAttribute('sound', {src:'#GeaWelcome'});
    setTimeout(() => document.querySelector("#GeaHead").components['sound'].playSound(), 9500);

    //Start the animation sequence and use timeouted emits to seperate the start of each animation
    setTimeout(() => FullBodyArmAnimation.emit('turnToPlayer-animation'), 10000);
    setTimeout(() => headAnimation.emit('lookBackPlayer-animation'), 10000);
    setTimeout(() => FullBodyArmAnimation.emit('moveToPlayer-animation'), 10500);
    setTimeout(() => headAnimation.emit('tiltHead-animation'), 15000);
    setTimeout(() => rightArmAnimation.emit('armReach-animation'), 16000);
    setTimeout(() => headAnimation.emit('headReset-animation'), 18500);
    setTimeout(() => rightArmAnimation.emit('armReset-animation'), 19000);
    setTimeout(() => armsAnimation.emit('moveArms-animation'), 20000);
    setTimeout(() => leftArmAnimation.emit('reachToPlayer-animation'), 21000);
    setTimeout(() => headAnimation.emit('tiltHead-animation'), 25000);
    setTimeout(() => armsAnimation.emit('resetArms-animation'), 27000);
    setTimeout(() => leftArmAnimation.emit('ArmReset-animation'), 27000);
    setTimeout(() => headAnimation.emit('headReset-animation'), 27000);
    setTimeout(() => headAnimation.emit('headNod-animation'), 28000);
    setTimeout(() => headAnimation.emit('headReset-animation'), 29500);
    setTimeout(() => headAnimation.emit('headDistance-animation'), 33000);
    setTimeout(() => leftArmAnimation.emit('armDistance-animation'), 33000);
    setTimeout(() => headAnimation.emit('headReset-animation'), 36000);
    setTimeout(() => leftArmAnimation.emit('ArmReset-animation'), 36000);
    setTimeout(() => armsAnimation.emit('moveArms-animation'), 38000);
    setTimeout(() => leftArmAnimation.emit('reachToPlayer-animation'), 39000);
    setTimeout(() => headAnimation.emit('lookPortal-animation'), 41000);
    //Finishing animation 
    });
});
