# circles-label
[Component, Text, Object]

[circles-label](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-label.js) creates a small visual label.

## Properties
  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | text            | string          | Label test [20-24 characters].               | 'label_text'               |
  | offset          | vec3            | Adjust where the label is positioned, relative to rotation origin.               | 0 0 0                |
  | arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']            | Adjust where the player is positioned, relative to checkpoint position.               | 'up'               |
  | lookAtCamera    | boolean            | Whether the label rotates to face the camera.               | true               |
  | updateRate      | number            | How often the lookAtCamera rotates the label, in ms.               | 20                |


## Examples

  *'circles-label' code.*

  ```html
  <a-entity circles-label="text:click here; visible:true; offset:1.1 0.2 0; arrow_position:left;"></a-entity>
  ```