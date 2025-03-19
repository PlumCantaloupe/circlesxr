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

      //listen for an emotion visualizer event. If it occurs then update the corresponding visualizer
      CONTEXT_AF.socket     = null;
      CONTEXT_AF.connected  = false;
      CONTEXT_AF.campfireEventName = "campfire_event";

      CONTEXT_AF.createNetworkingSystem = function () {
          CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
          CONTEXT_AF.connected = true;
          console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

          //listen for when others turn on campfire
          CONTEXT_AF.socket.on(CONTEXT_AF.campfireEventName, function(data) {
            
            const visualizationContainer = data.visualizationContainer;
            
            switch (visualizationContainer){
              case "delta-visualization": 
                console.log("delta stuff")
                CONTEXT_AF.deltaVisualization.setAttribute('room', {orbTypeToUpdate: data.orbTypeToUpdate}); 
                break;

              case "alpha-visualization":
                console.log("alpha stuff")
                CONTEXT_AF.alphaVisualization.setAttribute('room', {orbTypeToUpdate: data.orbTypeToUpdate}); 
                break;

              case "gamma-visualization":
                console.log("gamma stuff")
                CONTEXT_AF.gammaVisualization.setAttribute('room', {orbTypeToUpdate: data.orbTypeToUpdate}); 
                break;
              
              default:
                console.log("No matching case found");
            }
        });
      };

      //check if circle networking is ready. If not, add an eent to listen for when it is ...
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
