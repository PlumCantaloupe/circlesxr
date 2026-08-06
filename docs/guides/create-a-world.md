## Creating A New Circles World

<br>

- Go to src/worlds and see that each world has its own folder and associated index.html
- See [ExampleWorld](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/ExampleWorld) for a fully-featured example of how to set up your own.
- Currently, routes are not automatically created for each world (in progress); but you can type in the URL in the following format: `http://127.0.0.1:{SERVER_PORT}/w/{YOUR_WORLD_FOLDER}`, or as recommended above using [ngrok](https://ngrok.com/), `https://your_ngrok_url.ngrok.io/w/{YOUR_WORLD_FOLDER}`.
- Note that when you enter that `?group=explore` is added to your URL. `explore` is the default group (everyone in that same group can see each other). If you wish to add your own group so that only others within teh same group can see each other, set that last poart of teh URL yourself i.e., `http://127.0.0.1:{SERVER_PORT}/w/{YOUR_WORLD_FOLDER}?group={YOUR_GROUP_NAME}`, or as recommended above using [ngrok](https://ngrok.com/), `https://your_ngrok_url.ngrok.io/w/{YOUR_WORLD_FOLDER}?group={YOUR_GROUP_NAME}`. 
- Note that in [ExampleWorld](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/ExampleWorld) you can see a few HTML entities that are required for your world to properly connect to this framework. These are replaced with the appropriate scripts in [webpack.worlds.parts](https://github.com/PlumCantaloupe/circlesxr/tree/Workshop_Features/src/webpack.worlds.parts) during the build stage so please pay attention to their position within the page.
  ```html  
  <circles-start-scripts/>

  <!-- a-scene with 'circles-properties' component [REQUIRED] -->
  <a-scene circles_scene_properties>

  <circles-assets/>

  <circles-manager-avatar/>

  <circles-end-scripts/>
  ```
  Below is the most basic example, with only a Circles' avatar networked into a scene. Feel free to use [A-Frame](https://aframe.io) components to add [geometry](https://github.com/aframevr/aframe/blob/master/docs/components/geometry.md), [3D models](https://aframe.io/docs/1.4.0/introduction/models.html), [animations](https://github.com/aframevr/aframe/blob/master/docs/components/animation.md), [lights](https://github.com/aframevr/aframe/blob/master/docs/components/light.md), and [load assets](https://aframe.io/docs/1.4.0/core/asset-management-system.html). You may also want to add some [Circles specific components](#circles-components) for navigation, artefacts, buttons etc. 

**NOTE:** _for your world to be visible within the "explore" page below, you will need to include and edit the settings.JSON in your world folder with "showInExplore" set to 'true' (note that the "BasicStart" world is set to false by default)._

![screenshot of the explore menu, which is automaticacly display links to any Circles' world with settings.JSON's "showInExplore" set to true](node_server/public/global/images/CirclesExploreMenu.png?raw=true)



  ```html
  <html>
  <head>
    <!-- Circles' head scripts [REQUIRED] -->
    <circles-start-scripts/>
  </head>
  <body>
    <!-- this is used to create our enter UI that creates a 2D overlay to capture a user gesture for sound/mic access etc. -->
    <circles-start-ui/>

    <!-- a-scene with 'circles-properties' component [REQUIRED] -->
    <a-scene circles_scene_properties>
      <a-assets>

        <!-- Circles' built-in assets [REQUIRED] -->
        <circles-assets/>
      </a-assets>

      <!-- Circles' built-in manager and avatar [REQUIRED] -->
      <circles-manager-avatar/>

    </a-scene>

    <!-- Circles' end scripts [REQUIRED] -->
    <circles-end-scripts/>
   </body>
  </html>
  ```
