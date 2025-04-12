//component is responsible for animating the suction tube orb emotion sharing 
AFRAME.registerComponent('share-emotion', {
    schema: {
      visualizationID: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;
      const scene = document.querySelector('a-scene');
      CONTEXT_AF.manager = document.querySelector('#manager')
      CONTEXT_AF.managerData = document.querySelector('[manager]').components['manager'];
      CONTEXT_AF.visualizationContainer = document.querySelector(`#${CONTEXT_AF.data.visualizationID}-visualization`);

      CONTEXT_AF.socket     = null;
      CONTEXT_AF.connected  = false;
      CONTEXT_AF.shareEmotionEventName = "shareEmotion_event";

      CONTEXT_AF.createNetworkingSystem = function () {
          CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
          CONTEXT_AF.connected = true;
          console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

          CONTEXT_AF.el.addEventListener('click', function() {
            
            const holdingOrb = manager.getAttribute('manager').holdingOrb;
            //if holding orb then it can be dispensed
            if(holdingOrb) {
              // play sound
              CONTEXT_AF.el.components.sound.playSound();
              //un-parent orb from user and parent above the suction tube
              const holdingOrbId = manager.getAttribute('manager').holdingOrbId;
              const orb = document.querySelector(`#${holdingOrbId}`);
              orb.object3D.parent = CONTEXT_AF.el.object3D;
              orb.object3D.position.set(0, 1.1, 0);
              orb.object3D.scale.set(SUCTION_ORB_SCALE.x, SUCTION_ORB_SCALE.y, SUCTION_ORB_SCALE.z);
              
              //display animation for suction tube after 0.3 seconds
              setTimeout(function(){
                orb.setAttribute('animation', {property: 'position',
                                                duration: 500,
                                                to: '0 -2 0'})
              }, 300);
    
              //delete the orb once it's finished animating
              setTimeout(function() {
                orb.parentNode.children[0].setAttribute('dispense-emotion', {enabled: true});
                orb.parentNode.removeChild(orb);
                //trigger visualization update
                CONTEXT_AF.managerData.updateEmotionData(CONTEXT_AF.data.visualizationID, manager.getAttribute('manager').holdingOrbEmotion);
                CONTEXT_AF.socket.emit(CONTEXT_AF.shareEmotionEventName, {orbTypeToUpdate: manager.getAttribute('manager').holdingOrbEmotion, visualizationContainer: CONTEXT_AF.data.visualizationID, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                CONTEXT_AF.manager.emit(CONTEXT_AF.shareEmotionEventName, {orbTypeToUpdate: manager.getAttribute('manager').holdingOrbEmotion, visualizationContainer: CONTEXT_AF.data.visualizationID});
                CONTEXT_AF.manager.setAttribute('manager', {holdingOrb: false, 
                                                            holdingOrbId: ''});       
              }, 1000);
            }
          });
      };

      //check if circle networking is ready. If not, add an event to listen for when it is ...
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

    }

      
});


