AFRAME.registerComponent('manager', {
    schema: {
      holdingOrb: {type: 'boolean', default: false},
      holdingOrbId: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.alphaVisualization = document.querySelector("#alpha-visualization");
      CONTEXT_AF.deltaVisualization = document.querySelector("#delta-visualization");
      CONTEXT_AF.gammaVisualization = document.querySelector("#gamma-visualization");

      // Initialize Firebase
      fetch("https://firestore.googleapis.com/v1/projects/brainwavedata-bd008/databases/(default)/documents/deltaEmotionData", {
              method: "POST",
              headers: {
                  'Content-type': 'application/json; charset=UTF-8'
              },
              body: JSON.stringify({
                  fields: {
                  id: {
                      stringValue: "test"
                  },
                  name: {
                      stringValue: "test"
                  }
              }})
          }).then(body => console.log("success")).catch(console.log("there was an error adding data"));

      //check if circle networking is ready. If not, add an went to listen for when it is ...
      if (CIRCLES.isCirclesWebsocketReady()) {
          CONTEXT_AF.createNetworkingSystem();
      }
      else {
          const wsReadyFunc = function() {
              CONTEXT_AF.createNetworkingSystem();
              CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
          };
          CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
      }
    },

    update: function () {
      // Do something when component's data is updated.
    },

    remove: function () {
      // Do something the component or its entity is detached.
    },

    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
    }
});
