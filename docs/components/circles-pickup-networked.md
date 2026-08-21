# circles-pickup-networked
[Component, **Experimental**, Modifier, Networked]

[circles-pickup-networked](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pickup-object.js) allows the _circles-pickup-object_ to be shared with other connected clients. It also attempts to handle cases of when clients disconnecting, and remove the duplication of networked object basic networked-aframe objects have.

## Properties
  _NOTE!!: All circles-networked objects require an element id_

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | networkedEnabled   | boolean         | turn off and on networking of this object to others       | true |
  | networkedTemplate  | string          | Name of networked template                                | CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT |

## Examples
  *'circles-pickup-networked' code*

  ```html
  <!-- make sure the object is also interactive and has the circles-pickup-object component -->
  <a-entity id="required-id" circles-pickup-object="animate:false;" circles-interactive-object="type:highlight;" circles-pickup-networked></a-entity>
  ```