# circles-interactive-object
[Component, Core, Object, Networked]

[circles-interactive-object](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-interactive-object.js), attach this object to an entity that you wish to be interactive, and add some visual feedback to the object i.e., hover effects like scale, highlight, or an outline. Also have teh ability to quickly add a sound effect to be played during click here.

## Properties
 _NOTE!!: There needs to be a material on the model before we "extend" it with a "highlight" using the "circles-material-extend-fresnel" component. A gltf likely already has one, but make sure if manually defining a metrial that the "material" attribute is listed **before** this component is added._

| Property           | Type                                              | Description                                                | Default Value        |
|--------------------|---------------------------------------------------|-------------------------------------------------------------|-----------------------|
| type               | string, oneOf: `['outline', 'scale', 'highlight']` | set the hover effect type                                    | `''`                  |
| highlight_color    | color                                             | colour of highlight                                          | `rgb(255, 255, 255)`  |
| neutral_scale      | number                                            | scale of outline highlight with no interaction               | `1.0`                 |
| hover_scale        | number                                            | scale of outline highlight with a "hover" i.e., mouseover     | `1.08`                |
| click_scale        | number                                            | scale of outline highlight with a "click"                     | `1.10`                |
| click_sound        | audio                                             | sound asset for sound played during click                    | `''`                  |
| click_volume       | number                                            | volume of sound played during click                          | `0.5`                 |
| enabled            | boolean                                           | to turn on/off interactivity                                  | `true`                |



## Examples

*'circles-interactive-object' code*

```html
<!-- allows us to interact with this element and listen for events i.e., "click", "mouseover", and "mouseleave" -->
<!-- Important: note that "material" is listed before "circles-interactive-object" because it uses "circles-material-extend-fresnel" -->
<a-entity material="color:rgb(101,6,23);" geometry="primitive:sphere; radius:0.4" circles-interactive-object="type:highlight"></a-entity>
```