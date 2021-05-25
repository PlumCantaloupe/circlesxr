AFRAME.registerComponent("test-ball-animated", {
  init: function () {
    const CONTEXT_AF = this;

    // setup the animation
    CONTEXT_AF.el.setAttribute('animation', {
      property: "position",
      from: "0 2 -2.5",
      to: "0 5 -2.5",
      easing: "easeInOutQuad",
      dur: "1000",
      loop: "true"
    });
  }
});
