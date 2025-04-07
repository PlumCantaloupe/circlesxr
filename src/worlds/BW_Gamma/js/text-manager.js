AFRAME.registerComponent('text-manager', {

    init: function () {
      const CONTEXT_AF = this;
      
      CONTEXT_AF.showGuidingText = true;

      CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, (e) => {
        //display guiding text to prompt the user to hit the shape
        CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];
        CONTEXT_AF.guidingText.showOneTimeText(GUIDING_TEXT.HIT_SHAPES);
      });
    },
});
