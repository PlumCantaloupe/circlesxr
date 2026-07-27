

[circles-artefact](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-artefact.js):
This is a core component in our framework that explores learning around tools and objects. The circles-artefact allows you to create an object that has textual (and audio) descriptions and narratives, that can be picked up by an user's avatar and manipulated.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | inspectPosition | Vec3            | Adjust the position of artefact when picked up.           | 0 0 0                |
  | inspectRotation | vec3, degrees   | Adjust rotation of artefact when picked up.               | 0 0 0                |
  | inspectScale    | Vec3            | Adjust the size of artefact when picked up.               | 1 1 1                |
  | textRotationY   | number, degrees | Adjust the rotation of the description text. Degrees.     | 0                    |
  | label_on        | boolean         | Whether label is visible/used.                            | true                 |
  | label_text      | string          | Label text.                                               | 'label_text'         |
  | label_offset    | vec3            | Position relative to artefact it is attached to.          | 0 0 0                |
  | label_arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']         | Which way the labels points.                 | 'up'         |
  | description_on  | boolean         | Whether description is visible/used.                            | true                 |
  | descriptionLookAt  | boolean         | Whether description rotates to follow avatar.                            | false                 |
  | description_offset    | vec3            | Position relative to artefact it is attached to.          | 0 1.22 0                |
  | desc_arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']         | Which way the labels points.                 | 'up'         |
  | title           | string          | Title of description.                                     | 'No Title Set'       |
  | title_back      | string          | Title of description on back.                                     | ''       |
  | description     | string          | Description text.                                         | 'No decription set'  |
  | description_back | string          | Description text on back.                                         | ''  |
  | audio           | audio           | Narration audio that can be added to play when artefact picked up.        | ''         |
  | volume          | number          | If there is narration audio attached to this, this controls volume.       | '1.0'         |

  *Example 'circles-artefact' code: Note we are loading in a gltf model sing A-Frame's [gltf-model loader](https://github.com/aframevr/aframe/blob/master/docs/components/gltf-model.md), setting position, rotation, scale, and then setting several properties for the 'circles-artefact.'*

   ```html
  <a-entity id="Artefact_ID"
            position="0 0 0" 
            rotation="0 0 0" 
            scale="1 1 1"
            gltf-model="#model_gltf"
            circles-artefact="
                inspectPosition:      0.0 0.0 0.0;
                inspectScale:         0.5 0.5 0.5;
                inspectRotation:      0 0 0;
                textRotationY:        90;
                descrption_offset:    0 1 0;
                description_on:       true;
                desc_arrow_position:  down;
                label_text:           Some Label;
                label_offset:         0 1 0;
                label_on:             true;
                label_arrow_position: down;
                title:                Some Title;
                description:          Some description text.;
                title_back:           Some Title;
                description_back:     Some description text.;
                audio:                #some-snd; 
                volume:               0.4;" >
  </a-entity>
  ```