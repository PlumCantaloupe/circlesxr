# circles-sendpoint
[Component, Modifier, Core]

[circles-sendpoint](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-sendpoint.js) can be attached to a circles-button or circles-interactive-object entity when you want that button to send them to any checkpoint (with an id that we can point to).

## Properties
  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | target          | selector        | The id of the checkpoint you want to send the player to.  | null                 |


## Examples
  *'circles-button' used in combination with 'circles-sendpoint' to send the player to a far-off checkpoint elsewhere in the world.*

  ```html
  <a-entity id="checkpoint_far" circles-checkpoint position="30 0 0"></a-entity>

  <!-- click on this button to be sent to the checkpoint above -->
  <a-entity circles-button circles-sendpoint="target:#checkpoint_far;" position="0 0 0" rotation="0 0 0" scale="1 1 1"></a-entity>
  ```