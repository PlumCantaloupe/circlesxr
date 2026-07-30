# circles-sound
[Component, Core, Audio]

[circles-sound](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-sound.js) is a component that extends A-Frame's [sound component](https://github.com/aframevr/aframe/blob/master/docs/components/sound.md), and connects to enter experience events, so that autoplay sounds do play after enter a Circles world.

## Properties
| Property           | Type            | Description                                               | Default Value        |
|--------------------|-----------------|-----------------------------------------------------------|----------------------|
| src                | audio          | audio asset                               | ''                  |
| autoplay           | boolean        | will it play when the app starts.         | false               |
| type               | string, oneOf: ['basic', 'basic-diegetic', 'basic-nondiegetic', 'dialogue', 'music', 'soundeffect', 'foley', 'ambience', 'artefact']           | By changing type it changes how sound is played i.e., whthere it is spatial (in the world, diegetic) or not spatial (not in the world, a UI element, non-diegetic)                                       | 'basic' |
| loop                | boolean          | does this sound loop           | false                  |
| volume              | number          | how loud the sound is | 1.0                 |
| state               | string, oneOf: ['play', 'stop', 'pause']          | Whether the sound is playing, stopped, or paused                 | 'stop                 |
| poolSize            | number          | number of simultaneous instances of _this_ sound that can be playing at the same time                | 1                   |

## Examples
*'circles-sound' code*

```html
<!-- ambient music/sound -->
<a-entity circles-sound="type:music; src:#ambient_music; autoplay:true; loop:true; volume:0.02;"></a-entity>
 ```