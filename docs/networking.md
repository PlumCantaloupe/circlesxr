# Networking

## Overview
<br>

Circles uses [Networked-Aframe](https://github.com/networked-aframe/networked-aframe) to sync avatars and various networked objects i.e., circles-artefacts. Please consult the [Networked-Aframe documentation](https://github.com/networked-aframe/networked-aframe/blob/master/README.md) if you wish to add your own _networked_ objects. However, for sending basic messages and smaller javascript objects to other clients, messages and synch events some functions have been added to Circles API. Hopefully, in the future, we can also explore persistent worlds that save their states even when no one is currently within them. However, for now, the world will match between users while they are within if you follow the example structure below.

Users in circles are connected to each other by [Circles Groups](https://github.com/networked-aframe/networked-aframe#scene-component). If two users are in the same group they are visible to each other even in different worlds based on their positional values.

_For voice or vother large bandwidth items like video, you will have to run a janus server and use the [naf-janus-adapter](https://github.com/networked-aframe/naf-janus-adapter). For local development, it defaults to fast and reliable [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) communication._ that do not support voice and video.




## Architecture

There are a few key emitters that are useful when dealing with networked objects in circles particularly. All of these functions are useful for grabbing and manipulating networked objects and avatars.

```js

// returns the avatar element of the local user
CIRCLES.getAvatarElement();

//return the rig of the local avatar
CIRCLES.getAvatarRigElement();

//return all avatars in the scene. Yourself and other networked-aframe avatar entities
CIRCLES.getNetworkedAvatarElements();

//return all networked-aframe networked entities (includes avatars and any other objects). You may have to dig into children for the geometry, materials etc.
CIRCLES.getAllNetworkedElements();

```

You will find an example of synching simple switches in the "hub"/campfire world and the "ExampleWorld". The process for synching actions i.e., a light being turned off and on for all connected users follows (abridged from the "hub"/campfire example): 


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



## Avatar Syncing and Components

Circles avatars are networked via Networked-Aframe (NAF). The circles NAF avatar template can be seen in [Circles Assets](../src/webpack.worlds.parts/circles_assets.part.html) and the NAF schemes used for syncing a-frame components can be found in [Circles End Scripts](src/webpack.worlds.parts/circles_scene_properties.part.html).

Circles avatar hair, body and head positions and rotation attributes are sync'd and shared with all other NAF members on the network through NAF schemes. The attributes are accessed through the circles-user-networked component which is also an NAF scheme.

Mesh types, models, usernames and colors are also syncronized via circles-user-networked, but are changeable locally through circles-user-local which handles the model updates. This allows for more finite control over the appearance of avatar models.

user-networked updates user-local in order to make an avatar change. This means you can change how an avatar from the perspective of a specific user by updating the circles-user-local for another model, without triggering an NAF sync that would change the visuals for everyone. 

An example is given below of a function that changes how users in a specific world see other users mesh types:

```js
function onWorldReadyAll() {
    document.querySelectorAll('[circles-user-networked]').forEach(av => {
        av.components['circles-user-local'].el.setAttribute('circles-user-local', 'userVisibility', 'wireframe');
    });

    // also catch avatars that join after world load
    document.addEventListener(CIRCLES.EVENTS.USER_CONNECTED, (e) => {
        // NAF has prefix of NAF so we skip it to get the true network-id
        NAF.entities.getEntity(e.detail.id.slice(4)).querySelector('.avatar').setAttribute('circles-user-local', 'userVisibility', 'wireframe');
    });
}

```

