# circles-description
[Component, Text, Object]

[circles-description](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-description.js) is used to create a large two-sided element to have textual descriptions.

## Properties
  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | title_text_front       | string         | Front title text.                                         | '[~20-25 chars] title_front'                |
  | title_text_back        | string         | Back title text.                                          | ''                |
  | description_text_front | string         | Front title text.                                         | '[~240-280 chars] description_front'                |
  | description_text_back  | string         | Front title text.                                         | ''                |
  | offset          | vec3            | Adjust where the label is positioned, relative to rotation origin.               | 0 0 0                |
  | arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']            | Adjust where the player is positioned, relative to checkpoint position.               | 'up'               |
  | lookAtCamera    | boolean            | Whether the label rotates to face the camera.               | true               |
  | updateRate      | number            | How often the lookAtCamera rotates the label, in ms.               | 20                |


## Examples
  *'circles-description' code: Note that if no back title and description provided the rotate button above is not shown.*

  ```html
  <a-entity id="description_box" position="1.0 2.0 3.0" rotation="0 90 0"
            circles-description=" title_text_front:       Hello!;
                                  description_text_front: I am saying hello.;
                                  title_text_back:        Good-bye!;
                                  description_text_back:  I am saying good-bye.;
                                  offset:                 2 0 0;
                                  arrow_position:         left;
                                  lookAtCamera            :true; "></a-entity>
  ```