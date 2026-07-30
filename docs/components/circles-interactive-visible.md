# circles-interactive-visible
[Component, Core, Visual]

[circles-interactive-visible](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-interactive-visible.js): Attach to an entity that (or one or more of its child nodes) is interactive already, using _circles-interactive-object_, so that when we make it visible/non-visible, all interaction are enabled/disabled also. Otherwise, if you just use A-frame's ['visible' component](https://github.com/aframevr/aframe/blob/master/docs/components/visible.md), you can still click on invisible entities.

## Properties
_NOTE: This component attempts to look through all child elements also, o toggle interactive components._  

| Value | Description                                                                   |
|-------|--------------------------------------------------------------------------------|
| true  | The entity will be rendered and visible (and interactive); the default value.  |
| false | The entity will not be rendered and visible (and not interactive).             |


## Examples
    
*'circles-interactive-visible' code*

```html
<!-- allows us to hide/show and interactuve object without it being stil interactuve when invisible -->
<a-entity geometry="primitive:sphere; radius:0.4" circles-interactive-object circles-interactive-visible="false"></a-entity>

<!-- child node example -->
<a-entity id="controls" circles-interactive-visible="false">
  <a-entity geometry="primitive:sphere; radius:0.4" circles-interactive-object></a-entity>
  <a-entity geometry="primitive:sphere; radius:0.4" circles-interactive-object></a-entity>
  <a-entity geometry="primitive:sphere; radius:0.4" circles-interactive-object></a-entity>
</a-entity>
```