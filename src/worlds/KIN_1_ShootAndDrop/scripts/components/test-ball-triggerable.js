AFRAME.registerComponent('test-ball-triggerable', {
  init: function () {
    const CONTEXT_AF = this;

    // setup the animation
    CONTEXT_AF.el.setAttribute('animation', {
      property: "position",
      from: "-3 2 -2.5",
      to: "-3 5 -2.5",
      easing: "easeInOutQuad",
      dur: "1000",
      startEvents: "startAnimation"
    });
  }
});
