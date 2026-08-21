# circles-networked-basic
[Component, **Experimental**, Networked, Modifier]

[circles-networked-basic](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-networked-basic.js) allows any object to be shared with other connected clients. It also attempts to handle cases of when clients disconnecting, and remove the duplication of networked object basic networked-aframe objects have. Unlike [_circles-pickup-networked_](https://github.com/PlumCantaloupe/circlesxr/blob/main/docs/components/circles-networked-basic.md) these objects do not need to be interactive and cannot be picked up. This networked component also enables A-Frame's _[text](https://github.com/aframevr/aframe/blob/master/docs/components/text.md)_ to be synched.

## Properties
  _NOTE!!: All circles-networked objects require an element id_

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | networkedEnabled   | boolean         | turn off and on networking of this object to others       | true |
  | networkedTemplate  | string          | Name of networked template                                | CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT |


## Examples
  *'circles-networked-basic' code*

  ```html
  <!-- this object will be synched by the networked between multiple clients -->
  <a-entity id="required-id" circles-networked-basic geometry="primitive:sphere; radius:0.3;"></a-entity>
  ```