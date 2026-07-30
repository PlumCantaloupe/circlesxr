# Circles Networking

Circles uses [Networked-Aframe](https://github.com/networked-aframe/networked-aframe) to sync avatars and various networked objects i.e., circles-artefacts. Please consult the [Networked-Aframe documentation](https://github.com/networked-aframe/networked-aframe/blob/master/README.md) if you wish to add your own _networked_ objects. However, for sending basic messages and smaller javascript objects to other clients, messages and synch events some functions have been added to Circles API. Hopefully, in the future, we can also explore persistent worlds that save their states even when no one is currently within them. However, for now, the world will match between users while they are within if you follow the example structure below.

_For voice or vother large bandwidth items like video, you will have to run a janus server and use the [naf-janus-adapter](https://github.com/networked-aframe/naf-janus-adapter). For local development, it defaults to fast and reliable [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) communication._ that do not support voice and video.

You will find an example of synching simple switches in the "hub"/campfire world and the "ExampleWorld". The process for synching actions i.e., a light being turned off and on for all connected users follows (abridged from the "hub"/campfire example):

_First, some useful functions (please note there are others noted in the [Circles Componenets](#circle-components) section:_

```js
//get the webcocket we will use to communicate between all users via the server (which will forward all events to all other users)

//connect to web sockets so we can sync the campfire lights between users
CONTEXT_AF.socket = null;
CONTEXT_AF.campfireEventName = "campfire_event";

  //create a function we can call to get all our networked stuff connected
  CONTEXT_AF.createNetworkingSystem = function () {
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket(); //get socket
    
    //let the user click on the campfire to turn it on/off, and then after let all other clients know it has been toggled
    CONTEXT_AF.campfire.addEventListener('click', function () {
      CONTEXT_AF.fireOn = !CONTEXT_AF.fireOn;

      //change (this) client current world
      CONTEXT_AF.turnFire(CONTEXT_AF.fireOn);

      //send event to change other client's worlds. Use CIRCLES object to get relevant infomation i.e., room and world. Room is used to know where server will send message.
      CONTEXT_AF.socket.emit(CONTEXT_AF.campfireEventName, {campfireOn:CONTEXT_AF.fireOnue, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }
  };

    //check if circle networking is ready. If not, listen for network event to call out network setup function
    if (CIRCLES.isCirclesWebsocketReady()) {
        CONTEXT_AF.createNetworkingSystem();
    }
    else {
        const wsReadyFunc = function() {
            CONTEXT_AF.createNetworkingSystem();

            //always good practise to remove eventlisteners we are not using
            CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        };
        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
    }

    //listen for when others turn on campfire
    CONTEXT_AF.socket.on(CONTEXT_AF.campfireEventName, function(data) {
      CONTEXT_AF.turnFire(data.campfireOn);
      CONTEXT_AF.fireOn = data.campfireOn;
    });

    //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time (not perfect) ...
    setTimeout(function() {
      CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }, THREE.MathUtils.randInt(0,1200));

    //if someone else requests our sync data, we send it.
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
      //if the same world as the one requesting (remember, in Circles you can connect with others in different worlds)
      if (data.world === CIRCLES.getCirclesWorldName()) {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {campfireON:CONTEXT_AF.fireOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
      }
    });

    //receiving sync data from others (assuming all others is the same for now)
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
      //make sure we are receiving data for this world (as others may be visiting other worlds simultaneously)
      if (data.world === CIRCLES.getCirclesWorldName()) {
        CONTEXT_AF.turnFire(data.campfireON);
        CONTEXT_AF.fireOn = data.campfireON;
      }
    });
  ```