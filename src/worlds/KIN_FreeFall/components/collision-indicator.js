AFRAME.registerComponent('collision-indicator', {
  init: function () {
    // Setup self references
    const CONTEXT_AF = this;

    // Create the collision indicator elements
    let indicatorLight = document.createElement('a-entity');
    indicatorLight.setAttribute('class', 'indicatorLight');
    indicatorLight.setAttribute('position', '-1.15 0 0');
    indicatorLight.setAttribute('geometry', {
      primitive: "box",
      width: 0.2,
      height: 1,
      depth: 0.2
    });
    indicatorLight.setAttribute('material', {color: "white"});
    CONTEXT_AF.el.appendChild(indicatorLight);

    let textBackdrop = document.createElement('a-entity');
    textBackdrop.setAttribute('class', 'indicatorBackdrop');
    textBackdrop.setAttribute('geometry', {
      primitive: "box",
      width: 2,
      height: 1,
      depth: 0.2
    });
    textBackdrop.setAttribute('material', {color: "white"});
    CONTEXT_AF.el.appendChild(textBackdrop);

    let text = document.createElement('a-entity');
    text.setAttribute('class', 'indicatorText');
    text.setAttribute('indicatorText');
    text.setAttribute('position', '0 0.133 0.12');
    text.setAttribute('text', {
      value: "00.00",
      color: "#0476d9",
      width: 8,
      wrapCount: 22,
      align: "center",
      font: "/worlds/KIN_FreeFall/assets/font/Nunito-Bold-msdf.json",
      negate: "false"
    });
    CONTEXT_AF.el.appendChild(text);

    let text2 = document.createElement('a-entity');
    text2.setAttribute('class', 'indicatorText');
    text2.setAttribute('indicatorText');
    text2.setAttribute('position', '0 0.133 -0.12');
    text2.setAttribute('rotation', '0 180 0');
    text2.setAttribute('text', {
      value: "00.00",
      color: "#0476d9",
      width: 8,
      wrapCount: 22,
      align: "center",
      font: "/worlds/KIN_FreeFall/assets/font/Nunito-Bold-msdf.json",
      negate: "false"
    });
    CONTEXT_AF.el.appendChild(text2);

    // setup global variables
    CONTEXT_AF.currentState = "stopped";
    CONTEXT_AF.startTime = 0;

    // Setup trigger event listeners
    CONTEXT_AF.el.addEventListener('start', function () {
      console.log('indicator started');

      // set the indicator light to red
      CONTEXT_AF.setIndicatorColour("red");

      // set the start time
      CONTEXT_AF.startTime = Date.now();

      // set the current state to running
      CONTEXT_AF.currentState = "running";
    });

    CONTEXT_AF.el.addEventListener('stop', function () {
      console.log('indicator stopped');

      // set the indicator light to green
      CONTEXT_AF.setIndicatorColour("green");

      // set the current state
      CONTEXT_AF.currentState = "stopped";
    });

    CONTEXT_AF.el.addEventListener('reset', function () {
      console.log('indicator reset');

      // set the indicator light to white
      CONTEXT_AF.setIndicatorColour('white');

      // set the current state
      CONTEXT_AF.currentState = "stopped";

      // reset the indicator text
      CONTEXT_AF.setTextValue('00.00');
    });
  },

  tick: function () {
    // setup self references
    const CONTEXT_AF = this;

    // check if the indicator is running
    if (CONTEXT_AF.currentState == "running") {
      // get the current time (epoch milliseconds)
      let t = Date.now();

      // calculate the time elapsed in seconds
      let timeElapsed = t - CONTEXT_AF.startTime;
      let timeString = Math.round(timeElapsed/10).toString().padStart(4, '0');

      // update the text to show the time elapsed (with a leading zero if below 10)
      CONTEXT_AF.setTextValue(timeString.slice(0, 2) + '.' + timeString.slice(2));
    }
  },

  setIndicatorColour: function (colour) {
    // setup self references
    const CONTEXT_AF = this;

    let indicatorLight = CONTEXT_AF.el.querySelector('.indicatorLight');
    indicatorLight.setAttribute('material', {
      color: colour
    });
  },

  setTextValue: function (textValue) {
    // setup self references
    const CONTEXT_AF = this;

    let texts = CONTEXT_AF.el.querySelectorAll('.indicatorText');
    texts.forEach(text => {
      text.setAttribute('text', {
        value: textValue,
        color: "#0476d9",
        width: 8,
        wrapCount: 22,
        align: "center"
      });
    });
  }
});
