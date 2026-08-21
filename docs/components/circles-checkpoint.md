# circles-checkpoint
[Component, Core, Object]

[circles-checkpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-checkpoint.js) is an object that can be attached to an entity that you wish to act as a navigation checkpoint. Appearance is automatically set.

## Properties
| Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | offset          | vec3            | Adjust where the player is positioned, relative to checkpoint position.               | 0 0 0                |
  | useDefaultModel | boolean         | Whether the default "green cylinder" used (set false to use your own model).          | true               |


## Examples
*'circles-checkpoint' code: Note we are setting position of the checkpoint to also denote where the player is placed after clicking on this checkpoint.*

  ```html
  <a-entity circles-checkpoint position="10 0 9.5"></a-entity>
  ```