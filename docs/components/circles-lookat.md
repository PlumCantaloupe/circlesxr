# circles-lookat
[Component, Modifier]

[circles-lookat](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-lookat.js) attaches to an object to have it always facing another element.

## Properties
  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | targetElement   | selector        | The element you "this" element to always point towards.                         | null, reverts to player camera  |
  | enabled         | boolean         | Are we still rotating this element towards the target element.                  | 0 0 0                |
  | constrainYAxis  | boolean         | Do we only want the roptation to happen on the y-axis.                          | 0 0 0                |
  | updateRate      | number          | How often the new position is upfdated (in milliseconds).                       | 200               |
  | smoothingOn     | boolean         | Are we smoothing motion between updates.                                        | true                |
  | smoothingAlpha  | number          | How aggressively are we smoothing. Range [0.0, 1.0]. Smaller is more smoothing. | 0.05                |


## Examples
  *'circles-lookat' code:*

  ```html
  <a-entity id="lookyElement" circles-lookat="targetElement:#myCam; constrainYAxis:true;"></a-entity>
  ```