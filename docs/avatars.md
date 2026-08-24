# Avatars

## Overview

Circles avatars give users the ability to represent themselves and interact with others across their groups. The main avatar template can be found in [Circles Assets](src/webpack.worlds.parts/circles_assets.part.html), models are custom made GLTF-models and can be found [here](node_server/public/global/assets/models).

Avatars are constructed through the the nodejs server on player connect to a world.

More on finite avatar control and networking can be found in [network docs](docs/networking.md).

## Architecture

### Models

Models are custom GLTF-models created for circles. The models are treated as aframe components that at their core are ThreeJS objects. The avatar models can be changed for through circles-user-networked (network wide) and locally through circles-user-local.

### Meshes

Meshes are ThreeJS objects that are fundamental for rendering 3D shapes on the browser, they consist of a geometry (the shape or model) and its material (the appearance, colour and texture).

 Aframe has a default mesh type that is changeable through component updates see [circles-material-override](src/components/circles-material-override.js). In circles the material type can be interacted with at either the component level through Aframe or directly manipulated at the ThreeJS level.


#### Examples of ThreeJS custom shaders in circles
- circles-shader (Ghostly scrolling custom mesh and shader)
- circles-material-extend-fresnel (Fresnel shader)

#### Examples of Aframe mesh material manipulation in circles
- circles-matte-black (A flat black ThreeJS material made through Aframe mesh defaults)


We manipulate meshes primarily for Avatars in Circles; however there is many use cases for creating custom shaders or manipulating default Aframe meshes to design different environments.

### Colors

Avatars have colors set in circles-user-networked and circles-user-local (for local control). These colour presets and changes are handled in circles-color which provides finite colour control for default meshes and objects in circles.

## The Wardrobe

The Wardrobe is a Circles world that can be accessed on enter to any circles world. The world includes a mirror and provides users with a way to customize their Model types (Hair, Body, Head) and Colors based on a preset list.
