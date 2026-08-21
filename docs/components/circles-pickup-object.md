# circles-pickup-object
[Component, Modifier, Core]

[circles-pickup-object](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pickup-object.js) allows you to pickup and drop objects on click.


## Properties
  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | pickupPosition     | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep position relative to camera_ |
  | pickupScale        | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep rotation relative to camera_ |
  | dropPosition       | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep scale relative to camera_    |
  | dropPosition       | vec3            | position of object, relative to original parent node, when released      | _if unset, will keep position relative to camera_ |
  | dropRotation       | vec3            | rotation(deg) of object, relative to original parent node, when released | _if unset, will keep rotation relative to camera_ |
  | dropScale          | vec3            | scale of object, relative to original parent node, when released         | _if unset, will keep scale relative to camera_    |
  | animate            | boolean         | whether the object animates between different positions                  | false                        |
  | animateDurationMS  | number          | how long animations take if animate=true               | 400                          |


## Examples
  *'circles-pickup-object' code*

  ```html
  <!-- make sure the object is also interactive -->
  <a-entity circles-pickup-object="animate:false;" circles-interactive-object="type:highlight;"></a-entity>
  ```