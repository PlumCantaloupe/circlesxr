# circles-button
[Component, Core, Object]

[circles-button](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-button.js) is a general purpose button that we can use to listen for click events on and trigger our own code or use in combination with another Circles' component i.e., '[circles-sendpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-sendpoint.js), see next below'.

## Properties

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | type               | string, oneOf:['box', 'cylinder']            | Set whether the button pedastal is a cylinder or box shape.                                             | 'box'                  |
  | button_color       | color           | colour of button                                          | 'rgb(255, 100, 100)'                  |
  | button_color_hover | color           | colour of button on mouseover/hover.                      | 'rgb(255, 0, 0)'                      |
  | pedastal_color     | color           | colour of button pedestal                                 | 'rgb(255, 255, 255)'                  |
  | diameter           | number          | set the size of the button                                | 0.5                                   |


## Examples
*'circles-button' used in combination with 'circles-sendpoint' to send the player to a far-off checkpoint elsewhere in the world.*
  
  ```html
  <a-entity circles-button="pedastal_color:rgb(74, 87, 95);" circles-sendpoint="target:#door;" position="0 0 0" rotation="90 0 0" scale="0.8 0.8 0.8"></a-entity>
  ```