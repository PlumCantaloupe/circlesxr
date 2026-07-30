# circles-sphere-env-map
[Component, Modifier, Visual]

[circles-sphere-env-map](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-sphere-env-map.js): In the [Physical-Based Rendering (PBR)](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/) workflow of A-frame, any "metal" objects will reflect their environment. To make sure metal objects are not reflecting black we must set a [environment map](https://www.reindelsoftware.com/Documents/Mapping/Mapping.html). A common format is to use a [spherical-environment map](https://www.zbrushcentral.com/t/100-free-spherical-environment-maps-200-sky-backgrounds-1000-textures/328672), and this component allows you to add a spherical-env-map to any model. In particular, [gltf models](https://github.com/aframevr/aframe/blob/master/docs/components/gltf-model.md). If not using gltf models you may use the standard A-Frame [material component](https://github.com/aframevr/aframe/blob/master/docs/components/material.md). If while using gltf models you would like to affect some other material properties, i.e, transparency, please consider the [circles-material-override](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-material-override.js) component. 

## Properties
  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | src             | asset           | The id of the spherical environment map image asset.      | ''                 |
  | format          | string          | The format of the image. You likely don't have to change this.      | 'RGBFormat'                 |


## Examples
  *'circles-sphere-env-map' uses the 'sphericalEnvMap' image asset in the gltf 'model_gltf' reflections below. *

  ```html
  <a-assets>
    <img id='sphericalEnvMap' src='/worlds/ExampleWorld/assets/textures/above_clouds.jpg' crossorigin="anonymous">

    <a-asset-item id="model_gltf"  src="/worlds/ExampleWorld/assets/models/model/scene.gltf" response-type="arraybuffer" crossorigin="anonymous"></a-asset-item>

    <!-- Circles' built-in assets [REQUIRED] -->
    <circles-assets/>
  </a-assets>

  <!-- a gltf model with the spherical-env-map applied -->
  <a-entity gltf-model="#model_gltf" circles-sphere-env-map="src:#sphericalEnvMap"></a-entity>
  ```