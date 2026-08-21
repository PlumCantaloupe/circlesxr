# Circles Events
As in many JavaScript projects, Circles makes extensive use of events to allow some transparency about when things are happening. Below are some events that may be useful:

```js
//'CIRCLES.EVENTS.READY' emitted on scene element, when Circles has loaded
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, (e) => {});

//'CIRCLES.EVENTS.EXPERIENCE_ENTERED' emitted on scene element, when user clicks on 'enter experience button'
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.EXPERIENCE_ENTERED, (e) => {});

//'CIRCLES.EVENTS.PICKUP_OBJECT' emitted on scene element, when the user picks up an object, returns {id:e.detail.id} with callback function
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.PICKUP_OBJECT, (e) => {});

//'CIRCLES.EVENTS.RELEASE_OBJECT' emitted on scene element, when the user picks up an object, returns {id:releasedElem.id} with callback function
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.RELEASE_OBJECT, (e) => {});

//'CIRCLES.EVENTS.USER_CONNECTED' emitted on scene element, when a networked user connects, returns {id:e.detail.id, world:e.detail.world, device:e.detail.device} with callback function
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.USER_CONNECTED, (e) => {});

//'CIRCLES.EVENTS.USER_DISCONNECTED' emitted on scene element, when a networked user disconnects, returns {id:e.detail.id, world:e.detail.world, device:e.detail.device} with callback function
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.USER_DISCONNECTED, (e) => {});

//NOTE: for more detail on networking events and functionality, please see the Circles networking section
```