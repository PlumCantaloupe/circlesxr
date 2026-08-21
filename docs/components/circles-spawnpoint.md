# circles-spawnpoint
[Component, Modifier, Core]

[circles-spawnpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-spawnpoint.js) can be attached to a circles-checkpoint entity that you wish to act as a spawn point when entering the world. If there are multiple spawnpoints in a single world one is chosen randomly to position the player on.

## Properties
  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | n/a             | n/a             | no properties                                             | n/a    


## Examples
  *'circles-checkpoint' set as a 'circles-spawnpoint'*

  ```html
  <a-entity circles-checkpoint circles-spawnpoint position="10 0 9.5"></a-entity>
  ```

  ```html
  <a-entity id="checkpoint_far" circles-checkpoint position="30 0 0"></a-entity>

  <!-- click on this button to be sent to the checkpoint above -->
  <a-entity circles-button circles-sendpoint="target:#checkpoint_far;" position="0 0 0" rotation="0 0 0" scale="1 1 1"></a-entity>
  ```