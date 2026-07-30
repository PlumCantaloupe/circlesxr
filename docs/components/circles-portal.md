# circles-portal
[Component, Core, Object]

[circles-portal](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-portal.js) is a simple component that creates a sphere that can be used as clickable hyperlinks to jump between virtual environments.

## Properties
  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | img_src            | asset           | a equirectangular texture map                             | CIRCLES.CONSTANTS.DEFAULT_ENV_MAP               |
  | title_text         | string          | an optional label                                         | '' |
  | link_url           | string          | hyperlink of url users will travel to on click            | ''                   |
  | useDefaultModel    | boolean         | Whether the default sphere with outline is used (set false to use your own model).          | true               |



## Examples
  *'circles-portal' code*

  ```html
  <!-- allows us enter the wardrobe "world" to change avatar appearance. Note that it is using a built-in equirectangular texture "WhiteBlue.jpg" -->
  <a-entity id="Portal-Wardrobe" circles-portal="img_src:/global/assets/textures/equirectangular/WhiteBlue.jpg; title_text:Wardrobe; link_url:/w/Wardrobe"></a-entity>
  ```