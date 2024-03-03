# CIRCLES XR Learning Framework

<img src="node_server/public/global/images/Circles_MultiPlatform.jpg?raw=true" width="49.3%" alt="Screenshot of 3D avatars around the campfire in CIRCLES" />  <img src="node_server/public/global/images/Circles_WomenInTrades.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' world that highlights the challenges women face in the trades" /><img src="node_server/public/global/images/Circles_KinematicsHub.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' hub world for showcasing basic kinematics" /> <img src="node_server/public/global/images/Circles_ExampleWorld.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' example world for showing Circles' features to developers" />

## Table of Contents
##### *[back to top](#circles-xr-learning-framework)*

<br>

- [Circles Overview](#circles-overview)
  - [Why Use VR in Learning?](#why-use-vr-in-learning)
  - [Why Circles?](#why-circles)
- [Circles Interactions](#circles-interactions)
- [Running Circles Locally](#running-circles-locally)
- [Creating A New Circles World](#creating-a-new-circles-world)
- [Circles Structure](#circles-structure)
- [Circles Components](#circles-components)
- [Circles Networking](#circles-networking)
- [Learning More About A-Frame and Javascript Development](#learning-more-about-a-frame-and-javascript-development)
- [Contributing to Circles](#contributing-to-circles)
- [Early Contributors](#early-contributors)

----------------

## Circles Overview
##### *[back to top](#circles-xr-learning-framework)*

<br>

This **CIRCLES** framework is meant to easily allow
developers to create multi-user and multi-platform [WebXR](https://www.w3.org/TR/webxr/) learning activities on top of another WebXR framework [A-Frame](https://aframe.io), with networking provided by [Networked-Aframe](https://github.com/networked-aframe/networked-aframe).

CIRCLES is the practical Work-In-Progress (WIP) implementation of a research project into [universal](http://universaldesign.ie/What-is-Universal-Design/The-7-Principles/) and [inclusive](https://www.microsoft.com/design/inclusive/) multi-user VR considering how people interact with each other, their physical and virtual environments, and with learning artefacts in variable VR space. Our current focus is within both guided and unguided classroom and museum learning contexts; but we aim to keep the framework flexible where possible to allow for greater creativity.

**[Click here for more information on Circles and its progress, research, and development](https://www.anthony-scavarelli.com/portfolio/circles-webvr-education-platform/)**

<br>

### **Why use VR in Learning?**
##### *[back to top](#circles-xr-learning-framework)*

<br>

While VR/AR technologies first appeared in research and development dating back to middle of the twentieth century ([Azuma 1997](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Azuma+R+%281997%29+A+survey+of+augmented+reality.+Presence+Teleoper+Virtual+Environ+6%284%29%3A355–385&btnG=); [Mazuryk and Gervautz 1996](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Mazuryk+T%2C+Gervautz+M+%281996%29+Virtual+reality-history%2C+applications%2C+technology+and+future.+Vienna+University+of+Technology&btnG=)) there is tremendous human interest in the concept of simulating reality which can be seen within fiction as early as the 1930s ([Weinbaum 1935](https://www.historyofinformation.com/detail.php?entryid=4543)), and much earlier within the philosophical realm, when humans started to consider whether our perceived reality is an “absolute” reality, rather than merely “shadows on a cave wall” ([Plato](https://en.wikipedia.org/wiki/Allegory_of_the_cave)), “a dream” ([Descartes](https://en.wikipedia.org/wiki/Dream_argument)) or a robust “computer simulation” ([Bostrom 2003](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Bostrom+N+%282003%29+Are+you+living+in+a+computer+simulation%3F+Philos+Q+53%28211%29%3A243–255&btnG=)).

Post-Secondary Education in many industrialized countries such as Canada is currently facing performance and outcome challenges due to the lack of student engagement, experiential learning, and higher-order [21st-century skills such as critical thinking, communication, and collaboration](https://en.wikipedia.org/wiki/21st_century_skills). Virtual reality, with its ability to increase engagement, embodiment, experiential learning, and enhanced collaboration across co-located and remote spaces, appears a powerful tool for addressing some of the challenges we face in learning within social learning spaces. However, there are still many challenges concerning the ubiquitous use of virtual reality technology for learning within social learning spaces.

<br>

### **Why Circles?**
##### *[back to top](#circles-xr-learning-framework)*

<br>

Rather than trying to recreate our physical learning spaces or be a more general communication platform, of [which](https://hubs.mozilla.com) [there](https://framevr.io) [are](https://altvr.com) [many](https://recroom.com), we are developing the Circles framework as a transformative learning tool for use within social learning spaces, that aims to provide engaging, social, and experiential learning activities from which to springboard toward deeper processing and reflection. This framework is based on the concept of Circle, a collection of virtual environments or worlds that connect to one another - the basic experiential element of the virtual learning environments - and Artefacts - the basic element for sharing and receiving knowledge. Though creating more inclusive VR technologies is an extremely broad objective we choose to use the concept of social accessibility to focus on increasing the comfort of using VR technologies around and with others within social learning spaces.
<br><br>

### The (3) primary motivations for **CIRCLES** are as follows:
derived from [Scavarelli et al. 2021](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Scavarelli%2C+A.%2C+Arya%2C+A.%2C+%26+Teather%2C+R.+J.+%282020%29.+Virtual+reality+and+augmented+reality+in+social+learning+spaces%3A+a+literature+review.+Virtual+Reality.+https%3A%2F%2Fdoi.org%2F10.1007%2Fs10055-020-00444-8++&btnG=)

- **Accessibility**
  - **Device Scalability:** Platform Scalability refers to a system capable of adapting to a range of [VR](https://en.wikipedia.org/wiki/Virtual_reality)/[AR](https://en.wikipedia.org/wiki/Augmented_reality) capable platforms (desktop, mobile, large screens, etc.). This is comparable to a virtual form of [UDL (Universal Design for Learning)](https://udlguidelines.cast.org), which suggests increasing the accessibility of learning activities via (1) Multiple Means of Representation, (2) Multiple Means of Expression, and (3) Multiple Means of Engagement ([Rose et al., 2006](https://scholar.google.com/scholar_lookup?title=Universal%20design%20for%20learning%20in%20postsecondary%20education%3A%20reflections%20on%20principles%20and%20their%20application&journal=J%20Postsecond%20Educ%20Disabil&volume=19&issue=2&pages=135-151&publication_year=2006&author=Rose%2CDH&author=Harbour%2CWS&author=Johnston%2CCS&author=Daley%2CSG&author=Abarnall%2CL)). By supporting multiple platforms (Desktop, Mobile\[tablet\], and Head-Mounted Display (HMD - [Oculus Quest](https://www.oculus.com/blog/introducing-oculus-quest-our-first-6dof-all-in-one-vr-system-launching-spring-2019/) only right now)), VR/AR content can be potentially more accessible with “multiple means of action and expression.” *Note that we are only supporting Oculus Quest 1/2 at this time because the Quest does not introduce trip-hazards i.e., wires to a computer, is the most cost-effective immersive HMD on the market, includes the most well-supported HMD [WebXR browser](https://developer.oculus.com/documentation/oculus-browser/), and standalone HMDs have **much less** friction pushing immersive WebXR content over an HMD wired to a PC.*

  - **Social Scalability:** To create a framework that allows variable forms of one-to-many users across both co-located and remote perspectives. This framework should encourage the use of experiences that allow one to interact; but that also the experience should scale naturally and with collaboration and/or competition in mind to provide a more visceral experience as the number of users increases. Social Scalability is based on Snibbe et al’s definition of social scalability within a museum context whereby *“interactions are designed to share with others ... interaction, representation, and users’ engagement and satisfaction should become richer as more people interact”* ([Snibbe & Raffle, 2009](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Snibbe+SS%2C+Raffle+HS+%282009%29+Social+immersive+media&btnG=)).

  - **Reality Scalability [future]:** To create a framework that encourages developers to create experiences that allow VR, AR, and physical installation experiences, across a variable number of users. *Note that the recent inclusion of AR into WebXR soon should help with this *future* goal.

- **Consideration of Parallel Realities:** 
There is some work looking at how the virtual work can affect our reality, in how we identify in virtual worlds can change our behaviour ([Yee & Bailenson, 2007](https://scholar.google.com/scholar_lookup?title=The%20proteus%20effect%3A%20the%20effect%20of%20transformed%20self-representation%20on%20behavior&journal=Hum%20Commun%20Res&volume=33&issue=3&pages=271-290&publication_year=2007&author=Yee%2CN&author=Bailenson%2CJ)), in how task performance can be affected by others through social facilitation and social inhibition ([Miller et al., 2019](https://scholar.google.com/scholar_lookup?title=Social%20interaction%20in%20augmented%20reality&journal=PLoS%20ONE&volume=14&issue=5&pages=1-26&publication_year=2019&author=Miller%2CMR&author=Jun%2CH&author=Herrera%2CF&author=Villa%2CJY&author=Welch%2CG&author=Bailenson%2CJN)), and in how virtual spaces can also change behaviour ([MacIntyre et al., 2004](https://scholar.google.com/scholar_lookup?title=Presence%20and%20the%20aura%20of%20meaningful%20places&journal=Presence%20Teleoper%20Virtual%20Environ&volume=6&issue=2&pages=197-206&publication_year=2004&author=MacIntyre%2CB&author=Bolter%2CJD&author=Gandy%2CM); [Proulx et al., 2016](https://scholar.google.com/scholar_lookup?title=Where%20am%20I%3F%20Who%20am%20I%3F%20The%20relation%20between%20spatial%20cognition%2C%20social%20cognition%20and%20individual%20differences%20in%20the%20built%20environment&journal=Front%20Psychol&doi=10.3389%2Ffpsyg.2016.00064&volume=7&issue=February&pages=1-23&publication_year=2016&author=Proulx%2CMJ&author=Todorov%2COS&author=Aiken%2CAT&author=Sousa%2CAA)); but there is still much work to be done on how the physical learning spaces we inhabit may affect our virtual behaviours. We have seen that the very nature of using this technology can inhibit participation and comfort ([Brignull & Rogers, 2002](https://scholar.google.com/scholar_lookup?title=Enticing%20people%20to%20interact%20with%20large%20public%20displays%20in%20public%20spaces&journal=Proc%20INTERACT&volume=3&pages=17-24&publication_year=2002&author=Brignull%2CH&author=Rogers%2CY); [Outlaw & Duckles, 2017](https://extendedmind.io/social-vr); [Rogers et al., 2019](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Rogers+K%2C+Funke+J%2C+Frommel+J%2C+Stamm+S%2C+Weber+M+%282019%29+Exploring+interaction+fidelity+in+virtual+reality&btnG=)); but it is still very early beyond some studies into how we prevent collisions in shared virtual spaces ([Langbehn et al., 2018](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Langbehn+E%2C+Harting+E%2C+Steinicke+F+%282018%29+Shadow-avatars%3A+a+visualization+method+to+avoid+collisions+of+physically+co-located+users+in+room&btnG=); [Scavarelli & Teather, 2017](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Scavarelli+A%2C+Teather+RJ+%282017%29+VR+Collide%21+comparing+collision-avoidance+methods+between+co-located+virtual+reality+users&btnG=)). Just as connectivism and activity theory suggest that our digital tools and the socio-historical culture that surround learners become intrinsic part of the learning process, we should also consider how these same processes apply to both virtual environments and physical worlds as it becomes clear that the virtual worlds and physical worlds are not mutually exclusive perspectives.

- **Learning Foundations:** Though most VR/AR projects in learning depend on constructivism, experiential learning, and/or social cognitive theory as a foundation for chosen features and properties, there are additional theoretical and methodological foundations within [CSCL (Computer-Supported Collaborative Learning)](https://en.wikipedia.org/wiki/Computer-supported_collaborative_learning) that may help lend more significant consideration to both the virtual and physical environments within a socio-cultural context. [Activity theory](https://en.wikipedia.org/wiki/Activity_theory), in the form of expansive learning, includes not only digital tools and objects/artefacts as an intrinsic part of the learning process; but also the socio-historical properties of learning spaces ([Engeström, 2016](https://www.cambridge.org/core/books/studies-in-expansive-learning/E68E35B6DC42FCD58853E098917F4764); [Stahl & Hakkarainen, 2020](https://researchportal.helsinki.fi/en/publications/theories-of-cscl)). This could include some exciting explorations into the interplay between the social, spatial, and cultural aspects present within both the virtual and physical learning spaces; and how to better create VR/AR content that acknowledges them. This could include exploring how wearing in HMDs in learning spaces is not yet culturally acceptable ([Rogers et al., 2019](https://scholar.google.com/scholar?hl=en&as_sdt=0%2C5&q=Rogers+K%2C+Funke+J%2C+Frommel+J%2C+Stamm+S%2C+Weber+M+%282019%29+Exploring+interaction+fidelity+in+virtual+reality&btnG=)), or that being a woman in social VR spaces may encourage virtual harassment, decreasing participation in activities using these technologies ([Outlaw & Duckles, 2017](https://extendedmind.io/social-vr)). The interconnected processes of learning within individuals and their actions, the social environment, and the spatial environments are complex, and as we add in virtual environments that may change behaviour, we may need to look towards additional learning theories that better encapsulate how this learning happens.

----------------

## Circles Interactions
##### *[back to top](#circles-xr-learning-framework)*

<br>

Within the 3D worlds of Circles all interactions aim towards single-click selections where possible as an exploration into how to make controls symmetric across all three supported platforms (Desktop, Mobile, and HMD). This may change as our user studies and user feedback propose more significant differences between the three platforms. As this is a learning framework is meant for use within social learnig spaces like classrooms and museums it is important that advanced functionality is hidden by default (i.e., hiding joystick movement in HMD VR so that unexpected users do not get [motion sickness](https://en.wikipedia.org/wiki/Virtual_reality_sickness)) and that the interactions are [simple and intuitive](http://universaldesign.ie/What-is-Universal-Design/The-7-Principles/#p3). We are also inspired to reduce interactions to a form that *could* be controlled by [a single user input](https://blog.prototypr.io/accessible-locomotion-and-interaction-in-webxr-e4d87c512e51) for more extreme but significant use-cases.

_NOTE: For navigation, we use the [Aframe-Extras'](https://github.com/c-frame/aframe-extras) "[movement-controls](https://github.com/c-frame/aframe-extras/tree/master/src/controls)" that support [nav-meshes](https://github.com/c-frame/aframe-extras/tree/master/src/pathfinding)._

![Illustration of the three different control schemes for Circles. From left to right, Desktop with mouse, Mobile with finger tap, and raycast with HMD VR controller](node_server/public/global/images/Circles_PlatformInteractions.jpg?raw=true)

### Interaction Controls

| <br>Interaction      | Default<br>Desktop  | <br>Mobile          |<br>HMD              | Advanced<br>Desktop | <br>Mobile          | <br>HMD             |
|:---                  |:---                 |:---                 |:---                 |:---                 |:---                 |:---                 |
|  Navigation          | Checkpoint Teleport                       ||                    | WASD                | n/a                 | Left Joysick        |
|  Look                | Left-Mouse Drag     | Device Orientation  | HMD Orientation     | n/a                 | tap-drag left/right | n/a                 |
|  Selection           | Single Click/Tap/Raycast Object           ||                    | TBD                 | TBD                 | TBD                 |
|  Manipulation        | Non-Diegetic UI (rotate, zoom, release)   ||                    | TBD                 | TBD                 | TBD                 |
|  Release             | Single Click/Tap/Raycast Object           ||                    | TBD                 | TBD                 | TBD                 |         

<br>

----------------

## Running Circles Locally
##### *[back to top](#circles-xr-learning-framework)*

<br>

1. Clone repo
    - `git clone https://github.com/PlumCantaloupe/circlesxr.git`
1. Though not necessary, [Visual Studio Code](https://code.visualstudio.com/) is recommended to develop, run, and modify *Circles*. Additionally, VSCode allows you to easily open [an integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal) to execute the terminal commands below. It also has many [built-in Github features](https://code.visualstudio.com/docs/editor/versioncontrol). 
1. [Install mongo community server](https://www.mongodb.com/docs/manual/administration/install-community/)
    - We also _recommend_ installing the [MongoDB command line tool](https://www.mongodb.com/docs/mongodb-shell/) so that you can access the Mongo databases via command line, though you can also use the [Compass application](https://www.mongodb.com/docs/compass/current/). This is usually included with the mongo community server install.
1. [Install node/npm](https://nodejs.org/en/download/). **NOTE: We recommend installing the "LTS" version of npm/node.** Currently, this framework is running on  *Node version 14.18.0* and *NPM version 8.3.1.* You can check versions after install with the commands `node --version` and `npm --version`. For Windows you may have this additional command after install to downgrade NPM `npm install -g npm@8.3.1`. *Unfortunately many the libraries associated with A-frame and circles may not build correctly if you use other versions.*
1. Make sure you have [Python installed](https://www.python.org/downloads/) (as some libraries may require Python to build this project with NPM)
1. Go into project folder and install NPM dependencies 
    - `npm install`
1. Set up the Environment file
    - `cp .env.dist .env` (or just duplicate the .env.dist file and rename it as .env :)
    - Make any changes to your .env file that are specific to your environment
1. Make sure that a Mongo instance is started and running, either as a service or via command line (see [installation and running instructions for your specific operating system](https://www.mongodb.com/docs/manual/administration/install-community/)).
1. Serve the app so you can view it in your browser
    - `npm run serve`
    - This will build the needed bundles and serve the app for viewing. Check
      out the `scripts` section of `package.json` for more build options and
      details.
1. Please note that due some insecurities around running WebXR (and this library) that we need to [serve webXR content using https](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API/Startup_and_shutdown). Any easy way to do so using localhost is to use a port-forwarding tool like [ngrok](https://ngrok.com/) to run everything properly across all supported WebXR platforms.
1. In a browser (recommend Chrome at this time), go to `localhost:{SERVER_PORT}/add-all-test-data` (default is `localhost:1111/add-all-test-data`) to add both models to mongo db and test users. Note that if you are using localhost your browser (Chrome at this time) may complain about your site [re-directing assets to load via https and creating https mismatches](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) so you may try other browsers (i.e., Firefox), or consider _[highly recommended]_ using [ngrok](https://ngrok.com/) to serve up localhost as a remote https endpoint (note for WebXR to properly function on reality-based devices i.e. tablets or HMDs the content must served via https). Though ngrok works very well, [please see here for ngrok alternatives](https://github.com/anderspitman/awesome-tunneling). This will also allow you to easily test locally on other devices i.e., a mobile or standalone HMD device, and show your development to other collaborators via a publicly accessible URL.
    - **NOTE:** If you need to clean up or modify db contents use th MongoDB [Compass Application](https://www.mongodb.com/docs/compass/current/?_ga=2.136660531.242864686.1674159088-1142880638.1674159088) or [mongosh](https://www.mongodb.com/docs/mongodb-shell/) shell. For example, to drop the entire _circles_ db (which you will have to do when we make changes to the db structure) use the following commands within the mongosh shell (the re-add data with `localhost:{SERVER_PORT}/add-all-test-data` url):
        - `use circles`
        - `db.dropDatabase()`
1. Login with one of the 3 test users when you enter `localhost:{SERVER_PORT}/`, or as recommended above using [ngrok](https://ngrok.com/), `https://your_ngrok_url.ngrok.io/`(there are also others i.e., t1, r1, p1, p2, p3)
    - `{username}:{password}`
    - `s1@circlesxr.com:password`
    - `s2@circlesxr.com:password`
    - `s3@circlesxr.com:password`
1. Open another instance of browser (or open incognito mode, or another browser)
1. Log in with another user and have fun seeing each other!

*Deploying Remotely: If you are planning on running this on a remote instance like [AWS](https://aws.amazon.com) please see [Networked-Aframe's instructions on doing so with WebRTC](https://github.com/networked-aframe/naf-janus-adapter/blob/master/docs/janus-deployment.md), including some notes from the [Mozilla Hubs team on potential hosting costs](https://hubs.mozilla.com/docs/hubs-cloud-aws-costs.html).*

### Instance Routes

- */explore* (this is to see the list of worlds included here)
- */register* (has been disabled for now)
- */profile*
- */campfire*
- */add-all-test-data* (only do this once, or if you have deleted/dropped the database and need to re-populate test data )

----------------

## Creating A New Circles World
##### *[back to top](#circles-xr-learning-framework)*

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

----------------

## Circles Structure
##### *[back to top](#circles-xr-learning-framework)*

<br>

Circles follows the [ECS (Entity-Component System)](https://aframe.io/docs/1.4.0/introduction/entity-component-system.html) programming design pattern that [A-Frame](https://aframe.io) follows, likely be familiar to [Unity](https://unity.com) Developers.

Also note that Circle sis built on several libraries, giving you additional functionality. They follow:
- [A-Frame](https://aframe.io/docs/1.4.0/introduction/), which is built on [Three.js](https://aframe.io/docs/1.4.0/introduction/developing-with-threejs.html): This gives us a 3D engine specifically created for building multi-platform WebXR content using [HTML](https://www.w3schools.com/whatis/whatis_html.asp) and [Javascript](https://www.w3schools.com/js/).
- [Networked-Aframe](https://github.com/networked-aframe/networked-aframe): For quickly networking objects. To send simple message, and synching client states, see [Circles Networking](https://github.com/PlumCantaloupe/circlesxr#circles-networking).
- [Aframe-extras (controls and pathfinding)](https://github.com/c-frame/aframe-extras). This library gives us additional multi-platform controls, including the ability to use [nav meshes](https://medium.com/@donmccurdy/creating-a-nav-mesh-for-a-webvr-scene-b3fdb6bed918) to limit movement within Circles' worlds.
- [Aframe-Physics](https://github.com/c-frame/aframe-physics-system): Available for those that wish to include physics into their Circles worlds (see the "KIN_" worlds included as an example).

The general structure of the framework (and the Github repository) follows:

- [The Server](https://github.com/PlumCantaloupe/circlesxr/tree/master/node_server): Circles uses a javscript server [node.js] and all associated code relevant to the delivery of all HTML and JS content is can be found in this folder. [app.js](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/app.js) is the main file that connects to a javascript databse [MongoDB](https://www.mongodb.com/) for saving user information, and serves up Circles' html and javascript pages. Note that [router.js](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/routes/router.js) is reponsible for creating appropriate paths to content, and [controller.js](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/controllers/controller.js) is reponsible for connecting with the mongo database, and that much of the 2D html content (e.g., login and explore pages) are rendered with [pug](https://pugjs.org/), which allows us to generate HTML and CSS via javascript. All files related to 2D HTML and CSS are found within the [web folder](https://github.com/PlumCantaloupe/circlesxr/tree/master/node_server/public/web).
- [Circles Core](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/core): All core functionality of the Circles can be found here, including any constants or global functions, we would like to be able to access on both the server and client sides. This will be invisible to most developers. To simplify development for content we also modify code during the [webpack](https://webpack.js.org) project build before we serve it.
- [Circles Worlds](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds): All Circles' worlds are placed here. From here they are modified to include Circles specific functionality and copied into an untracked folder on the server.
- [Circles Groups](https://github.com/networked-aframe/networked-aframe#scene-component): All Circles' users are connected to others within the same "group" (or "room"), no matter which Circles world they are within. You can set this manually by adding `?group=YOUR_GROUP_NAME` manually to the end of your Circles URL e.g., `http://127.0.0.1:{SERVER_PORT}/w/{YOUR_WORLD_FOLDER}?group={YOUR_GROUP_NAME}`, or as recommended above using [ngrok](https://ngrok.com/), `https://your_ngrok_url.ngrok.io/w/{YOUR_WORLD_FOLDER}?group={YOUR_GROUP_NAME}`. This group is then passed to the [networked-aframe](https://github.com/networked-aframe/networked-aframe) room property to connect users only to users within the same group..

*Also note, that a [TestBed](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/Testbed/scripts) is currently in development for testing selection and find performance using [Fitt's Law](https://www.yorku.ca/mack/hhci2018.html). At this time the TestBed, and the associated [research-manager](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/Testbed/scripts) components are local to the ["TestBed" world](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/Testbed). After more extensive testing it will likely be moved to the Circles core.*

----------------

## Circles Components
##### *[back to top](#circles-xr-learning-framework)*

<br>

There are dozens of components created for use within this framework that you can find in the [components folder of this repo](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/components); but the following will likely be the most used, and thus the most significant.

First, some useful functions that may be useful for the creation of your own components:

```js
//get the name of the group we are in (users in a group can only see each other)
CIRCLES.getCirclesGroupName();

//get the name of the Circles' world the user is in
CIRCLES.getCirclesWorldName();

//get the name of the current user
CIRCLES.getCirclesUserName();

//find out if Circles is ready i.e., your avatar is constructed.
CIRCLES.isReady();

//return the avatar element (perhaps we want to add something to the avatar or query for body elements to change their colour).
CIRCLES.getAvatarElement();

//return the rig of the avatar (when we want to move our avatar i.e., teleport them somewhere. or access things like aframe-extra's "movement-controls" to adjust speed, enable/disble etc.)
CIRCLES.getAvatarRigElement();

//return the camera element (from the avatar's point of view, if you want parent things to the camera e.g., adding UIs))
CIRCLES.getMainCameraElement();

//get reference to the Circles manager entity
CIRCLES.getCirclesManagerElement();

//get reference to the Circles manager component
CIRCLES.getCirclesManagerComp();

//returns reference to held element, or null if no held object on this player/client  
CIRCLES.getPickedUpElement();

//to get the non-networked id of an elem (queries the 'circles-object-world' component for tehj original "id") 
CIRCLES.getNonNetworkedID(elem);

//Example
//You may also listen to the CIRCLES.READY event on the scene to find out when Circles is ready to manipulate
CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, function() {
    //to change speed of character movement
    CIRCLES.getAvatarRigElement().setAttribute('movement-controls', {speed:0.3});
});
```

And now the components available for you.

- [circles-artefact](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-artefact.js):
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

- [circles-button](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-button.js): This is a general purpose button that we can use to listen for click events on and trigger our own code or use in combination with another Circles' component i.e., '[circles-sendpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-sendpoint.js), see next below'.

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | type               | string, oneOf:['box', 'cylinder']            | Set whether the button pedastal is a cylinder or box shape.                                             | 'box'                  |
  | button_color       | color           | colour of button                                          | 'rgb(255, 100, 100)'                  |
  | button_color_hover | color           | colour of button on mouseover/hover.                      | 'rgb(255, 0, 0)'                      |
  | pedastal_color     | color           | colour of button pedestal                                 | 'rgb(255, 255, 255)'                  |
  | diameter           | number          | set the size of the button                                | 0.5                                   |

  *Example 'circles-button' used in combination with 'circles-sendpoint' to send the player to a far-off checkpoint elsewhere in the world.*
  
  ```html
  <a-entity circles-button="pedastal_color:rgb(74, 87, 95);" circles-sendpoint="target:#door;" position="0 0 0" rotation="90 0 0" scale="0.8 0.8 0.8"></a-entity>
  ```

- [circles-checkpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-checkpoint.js): Attach to to an entity that you wish to act as a navigation checkpoint. Appearance is automatically set.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | offset          | vec3            | Adjust where the player is positioned, relative to checkpoint position.               | 0 0 0                |
  | useDefaultModel | boolean         | Whether the default "green cylinder" used (set false to use your own model).          | true               |

  *Example 'circles-checkpoint' code: Note we are setting position of the checkpoint to also denote where the player is placed after clicking on this checkpoint.*

  ```html
  <a-entity circles-checkpoint position="10 0 9.5"></a-entity>
  ```
- [circles-description](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-description.js): Used to create a large two-sided element to have textual descriptions.

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

  *Example 'circles-description' code: Note that if no back title and description provided the rotate button above is not shown.*

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
- [circles-interactive-object](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-interactive-object.js): Attach to an entity that you wish to be interactive, and add some visual feedback to the object i.e., hover effects like scale, highlight, or an outline. Also have teh ability to quickly add a sound effect to be played during click here.

  _NOTE!!: There needs to be a material on the model before we "extend" it with a "highlight" using the "circles-material-extend-fresnel" component. A gltf likely already has one, but make sure if manually defining a metrial that the "material" attribute is listed **before** this component is added._

    | Property           | Type            | Description                                               | Default Value        |
    |--------------------|-----------------|-----------------------------------------------------------|----------------------|
    | type               | string, oneOf:['outline', 'scale', 'highlight']    | set the hover effect type  | ''               |
    | highlight_color    | color           | colour of highlight                                       | 'rgb(255, 255, 255)' |
    | neutral_scale      | number          | scale of outline highlight with no interaction            | 1.0                  |
    | hover_scale        | number          | scale of outline highlight with a "hover" i.e., mouseover | 1.08                 |
    | click_scale        | number          | scale of outline highlight with a "click"                 | 1.10                 |
    | click_sound        | audio           | sound asset for sound played during click                 | ''                   |
    | click_volume       | number          | volume of sound played during click                       | 0.5                  |
    | enabled            | boolean         | to turn on/off interactivity                              | true                 |

    *Example 'circles-interactive-object'*

    ```html
    <!-- allows us to interact with this element and listen for events i.e., "click", "mouseover", and "mouseleave" -->
    <!-- Important: note that "material" is listed before "circles-interactive-object" because it uses "circles-material-extend-fresnel" -->
    <a-entity material="color:rgb(101,6,23);" geometry="primitive:sphere; radius:0.4" circles-interactive-object="type:highlight"></a-entity>
    ```
- [circles-interactive-visible](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-interactive-visible.js): Attach to an entity that (or one or more of its child nodes) is interactive already, using _circles-interactive-object_, so that when we make it visible/non-visible, all interaction are enabled/disabled also. Otherwise, if you just use A-frame's ['visible' component](https://github.com/aframevr/aframe/blob/master/docs/components/visible.md), you can still click on invisible entities.

  _NOTE: This component attempts to look through all child elements also, o toggle interactive components._  

    | Value              | Description                                                                       |
    |--------------------|-----------------------------------------------------------------------------------|
    | true               | The entity will be rendered and visible (and interactive); the default value.     |
    | false              | The entity will not be rendered and visible (and not interactive).                |

    *Example 'circles-interactive-visible'*

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
- [circles-label](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-label.js): Used to create a small visual label.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | text            | string          | Label test [20-24 characters].               | 'label_text'               |
  | offset          | vec3            | Adjust where the label is positioned, relative to rotation origin.               | 0 0 0                |
  | arrow_position  | string, oneOf: ['up', 'down', 'left', 'right']            | Adjust where the player is positioned, relative to checkpoint position.               | 'up'               |
  | lookAtCamera    | boolean            | Whether the label rotates to face the camera.               | true               |
  | updateRate      | number            | How often the lookAtCamera rotates the label, in ms.               | 20                |

  *Example 'circles-label' code.*

  ```html
  <a-entity circles-label="text:click here; visible:true; offset:1.1 0.2 0; arrow_position:left;"></a-entity>
  ```
- [circles-lookat](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-lookat.js): Attch to an object to have it always facing another element.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | targetElement   | selector        | The element you "this" element to always point towards.                         | null, reverts to player camera  |
  | enabled         | boolean         | Are we still rotating this element towards the target element.                  | 0 0 0                |
  | constrainYAxis  | boolean         | Do we only want the roptation to happen on the y-axis.                          | 0 0 0                |
  | updateRate      | number          | How often the new position is upfdated (in milliseconds).                       | 200               |
  | smoothingOn     | boolean         | Are we smoothing motion between updates.                                        | true                |
  | smoothingAlpha  | number          | How aggressively are we smoothing. Range [0.0, 1.0]. Smaller is more smoothing. | 0.05                |

  *Example 'circles-lookat' code:*

  ```html
  <a-entity id="lookyElement" circles-lookat="targetElement:#myCam; constrainYAxis:true;"></a-entity>
  ```

- [circles-networked-basic](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-networked-basic.js): **_[ Experimental ]_** This component allows the any object to be shared with other connected clients. It also attempts to handle cases of when clients disconnecting, and remove the duplication of networked object basic networked-aframe objects have. Unlike _circles-pickup-networked_ these objects do not need to be interactive and cannot be picked up. This networked component also enables A-Frame's _[text](https://github.com/aframevr/aframe/blob/master/docs/components/text.md)_ to be synched.

  _NOTE!!: ALl circles-networked objects require an element id_

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | networkedEnabled   | boolean         | turn off and on networking of this object to others       | true |
  | networkedTemplate  | string          | Name of networked template                                | CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT |

  *Example 'circles-networked-basic'*

  ```html
  <!-- this object will be synched by the networked between multiple clients -->
  <a-entity id="required-id" circles-networked-basic geometry="primitive:sphere; radius:0.3;"></a-entity>
  ```

- [circles-pickup-object](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pickup-object.js): This component allows you to pickup and drop objects on click.

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | pickupPosition     | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep position relative to camera_ |
  | pickupScale        | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep rotation relative to camera_ |
  | dropPosition       | vec3            | position of object, relative to camera, when picked up                   | _if unset, will keep scale relative to camera_    |
  | dropPosition       | vec3            | position of object, relative to original parent node, when released      | _if unset, will keep position relative to camera_ |
  | dropRotation       | vec3            | rotation(deg) of object, relative to original parent node, when released | _if unset, will keep rotation relative to camera_ |
  | dropScale          | vec3            | scale of object, relative to original parent node, when released         | _if unset, will keep scale relative to camera_    |
  | animate            | boolean         | whether the object animates between different positions                  | false                        |
  | animateDurationMS  | number          | how long animations take if animate=true               | 400                          |

  *Example 'circles-pickup-object'*

  ```html
  <!-- make sure the object is also interactive -->
  <a-entity circles-pickup-object="animate:false;" circles-interactive-object="type:highlight;"></a-entity>
  ```
- [circles-pickup-networked](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pickup-object.js): **_[ Experimental ]_** This component allows the _circles-pickup-object_ to be shared with other connected clients. It also attempts to handle cases of when clients disconnecting, and remove the duplication of networked object basic networked-aframe objects have.

  _NOTE!!: ALl circles-networked objects require an element id_

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | networkedEnabled   | boolean         | turn off and on networking of this object to others       | true |
  | networkedTemplate  | string          | Name of networked template                                | CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT |

  *Example 'circles-pickup-networked'*

  ```html
  <!-- make sure the object is also interactive and has the circles-pickup-object component -->
  <a-entity id="required-id" circles-pickup-object="animate:false;" circles-interactive-object="type:highlight;" circles-pickup-networked></a-entity>
  ```

- [circles-pdf-loader](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-pdf-loader.js): **_[ Experimental ]_** A component to load in PDFs with basic next page annd previous page controls.

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | src                | string          | the url to the PDF to be loaded                           | ''                   |
  | scale              | number          | increasing scale increases the resolution of rendered pdf | 1.5                  |

  *Example 'circles-pdf-loader'*

  ```html
  <a-entity circles-pdf-loader="src:/global/assets/pdfs/Scavarelli2020_Article_VirtualRealityAndAugmentedReal.pdf;"></a-entity>
  ```

- [circles-portal](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-portal.js): A simple component that creates a sphere that can be used as clickable hyperlinks to jump between virtual environments.

  | Property           | Type            | Description                                               | Default Value        |
  |--------------------|-----------------|-----------------------------------------------------------|----------------------|
  | img_src            | asset           | a equirectangular texture map                             | CIRCLES.CONSTANTS.DEFAULT_ENV_MAP               |
  | title_text         | string          | an optional label                                         | '' |
  | link_url           | string          | hyperlink of url users will travel to on click            | ''                   |
  | useDefaultModel    | boolean         | Whether the default sphere with outline is used (set false to use your own model).          | true               |

  *Example 'circles-portal'*

  ```html
  <!-- allows us enter the wardrobe "world" to change avatar appearance. Note that it is using a built-in equirectangular texture "WhiteBlue.jpg" -->
  <a-entity id="Portal-Wardrobe" circles-portal="img_src:/global/assets/textures/equirectangular/WhiteBlue.jpg; title_text:Wardrobe; link_url:/w/Wardrobe"></a-entity>
  ```

- [circles-sendpoint](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-sendpoint.js): Attach to to a circles-button or circles-interactive-object entity when you want that button to send them to any checkpoint (with an id that we can point to).

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | target          | selector        | The id of the checkpoint you want to send the player to.  | null                 |

  *Example 'circles-button' used in combination with 'circles-sendpoint' to send the player to a far-off checkpoint elsewhere in the world.*

  ```html
  <a-entity id="checkpoint_far" circles-checkpoint position="30 0 0"></a-entity>

  <!-- click on this button to be sent to the checkpoint above -->
  <a-entity circles-button circles-sendpoint="target:#checkpoint_far;" position="0 0 0" rotation="0 0 0" scale="1 1 1"></a-entity>
  ```
- [circles-sound](https://github.com/PlumCantaloupe/circlesxr/blob/main/src/components/circles-sound.js): This is a component that extends A-Frame's [sound component](https://github.com/aframevr/aframe/blob/master/docs/components/sound.md), and connects to enter experience events, so that autoplay sounds do play after enter a Circles world.

    | Property           | Type            | Description                                               | Default Value        |
    |--------------------|-----------------|-----------------------------------------------------------|----------------------|
    | src                | audio          | audio asset                               | ''                  |
    | autoplay           | boolean        | will it play when the app starts.         | false               |
    | type               | string, oneOf: ['basic', 'basic-diegetic', 'basic-nondiegetic', 'dialogue', 'music', 'soundeffect', 'foley', 'ambience', 'artefact']           | By changing type it changes how sound is played i.e., whthere it is spatial (in the world, diegetic) or not spatial (not in the world, a UI element, non-diegetic)                                       | 'basic' |
    | loop                | boolean          | does this sound loop           | false                  |
    | volume              | number          | how loud the sound is | 1.0                 |
    | state               | string, oneOf: ['play', 'stop', 'pause']          | Whether the sound is playing, stopped, or paused                 | 'stop                 |
    | poolSize            | number          | number of simultaneous instances of _this_ sound that can be playing at the same time                | 1                   |

    *Example 'circles-sound'*

    ```html
    <!-- ambient music/sound -->
    <a-entity circles-sound="type:music; src:#ambient_music; autoplay:true; loop:true; volume:0.02;"></a-entity>
    ```
- [circles-spawnpoint](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-spawnpoint.js): Attach to to a circles-checkpoint entity that you wish to act as a spawn point when entering the world. If there are multiple spawnpoints in a single world one is chosen randomly to position the player on.

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | n/a             | n/a             | no properties                                             | n/a                  |

  *Example 'circles-checkpoint' set as a 'circles-spawnpoint'*

  ```html
  <a-entity circles-checkpoint circles-spawnpoint position="10 0 9.5"></a-entity>
  ```

  ```html
  <a-entity id="checkpoint_far" circles-checkpoint position="30 0 0"></a-entity>

  <!-- click on this button to be sent to the checkpoint above -->
  <a-entity circles-button circles-sendpoint="target:#checkpoint_far;" position="0 0 0" rotation="0 0 0" scale="1 1 1"></a-entity>
  ```

- [circles-sphere-env-map](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-sphere-env-map.js): In the [Physical-Based Rendering (PBR)](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/) workflow of A-frame, any "metal" objects will reflect their environment. To make sure metal objects are not reflecting black we must set a [environment map](https://www.reindelsoftware.com/Documents/Mapping/Mapping.html). A common format is to use a [spherical-environment map](https://www.zbrushcentral.com/t/100-free-spherical-environment-maps-200-sky-backgrounds-1000-textures/328672), and this component allows you to add a spherical-env-map to any model. In particular, [gltf models](https://github.com/aframevr/aframe/blob/master/docs/components/gltf-model.md). If not using gltf models you may use the standard A-Frame [material component](https://github.com/aframevr/aframe/blob/master/docs/components/material.md). If while using gltf models you would like to affect some other material properties, i.e, transparency, please consider the [circles-material-override](https://github.com/PlumCantaloupe/circlesxr/blob/master/src/components/circles-material-override.js) component. 

  | Property        | Type            | Description                                               | Default Value        |
  |-----------------|-----------------|-----------------------------------------------------------|----------------------|
  | src             | asset           | The id of the spherical environment map image asset.      | ''                 |
  | format          | string          | The format of the image. You likely don't have to change this.      | 'RGBFormat'                 |

  *Example 'circles-sphere-env-map' uses the 'sphericalEnvMap' image asset in the gltf 'model_gltf' reflections below. *

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

----------------

## Circles Networking
##### *[back to top](#circles-xr-learning-framework)*

<br>

Circles uses [Networked-Aframe](https://github.com/networked-aframe/networked-aframe) to sync avatars and various networked objects i.e., circles-artefacts. Please consult the [Networked-Aframe documentation](https://github.com/networked-aframe/networked-aframe/blob/master/README.md) if you wish to add your own _networked_ objects. However, for sending basic messages and smaller javascript objects to other clients, messages and synch events some functions have been added to Circles API. Hopefully, in the future, we can also explore persistent worlds that save their states even when no one is currently within them. However, for now, the world will match between users while they are within if you follow the example structure below.

_For voice or vother large bandwidth items like video, you will have to run a janus server and use the [naf-janus-adapter](https://github.com/networked-aframe/naf-janus-adapter). For local development, it defaults to fast and reliable [websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) communication._ that do not support voice and video.

You will find an example of synching simple switches in the "hub"/campfire world and the "ExampleWorld". The process for synching actions i.e., a light being turned off and on for all connected users follows (abridged from the "hub"/campfire example):

_First, some useful functions (please note there are others noted in the [Circles Componenets](#circle-components) section:_

```js
//get communication socket
CIRCLES.getCirclesWebsocket();

//return all avatars in the scene. Yourself and other networked-aframe avatar entities
CIRCLES.getNAFAvatarElements();

//return all networked-aframe networked entities (includes avatars and any other objects). You may have to dig into children for the geometry, materials etc.
CIRCLES.getAllNAFElements();
```

```js
//get the webcocket we will use to communicate between all users via the server (which will forward all events to all other users)

//connect to web sockets so we can sync the campfire lights between users
CONTEXT_AF.socket = null;
CONTEXT_AF.campfireEventName = "campfire_event";

  //create a function we can call to get all our networked stuff connected
  CONTEXT_AF.createNetworkingSystem = function () {
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket(); //get socket
    
    //let the user click on the campfire to turn it on/off, and then after let all other clients know it has been toggled
    CONTEXT_AF.campfire.addEventListener('click', function () {
      CONTEXT_AF.fireOn = !CONTEXT_AF.fireOn;

      //change (this) client current world
      CONTEXT_AF.turnFire(CONTEXT_AF.fireOn);

      //send event to change other client's worlds. Use CIRCLES object to get relevant infomation i.e., room and world. Room is used to know where server will send message.
      CONTEXT_AF.socket.emit(CONTEXT_AF.campfireEventName, {campfireOn:CONTEXT_AF.fireOnue, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }
  };

    //check if circle networking is ready. If not, listen for network event to call out network setup function
    if (CIRCLES.isCirclesWebsocketReady()) {
        CONTEXT_AF.createNetworkingSystem();
    }
    else {
        const wsReadyFunc = function() {
            CONTEXT_AF.createNetworkingSystem();

            //always good practise to remove eventlisteners we are not using
            CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        };
        CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
    }

    //listen for when others turn on campfire
    CONTEXT_AF.socket.on(CONTEXT_AF.campfireEventName, function(data) {
      CONTEXT_AF.turnFire(data.campfireOn);
      CONTEXT_AF.fireOn = data.campfireOn;
    });

    //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time (not perfect) ...
    setTimeout(function() {
      CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }, THREE.MathUtils.randInt(0,1200));

    //if someone else requests our sync data, we send it.
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
      //if the same world as the one requesting (remember, in Circles you can connect with others in different worlds)
      if (data.world === CIRCLES.getCirclesWorldName()) {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {campfireON:CONTEXT_AF.fireOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
      }
    });

    //receiving sync data from others (assuming all others is the same for now)
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
      //make sure we are receiving data for this world (as others may be visiting other worlds simultaneously)
      if (data.world === CIRCLES.getCirclesWorldName()) {
        CONTEXT_AF.turnFire(data.campfireON);
        CONTEXT_AF.fireOn = data.campfireON;
      }
    });
  ```

----------------

## Learning More About A-Frame and Javascript Development
##### *[back to top](#circles-xr-learning-framework)*

<br>

- **To learn more about A-Frame development, I recommend checking out this [brief introduction to A-Frame](https://aframe.io/docs/1.4.0/introduction/), and a [brief tutorial that overviews some of the most common functionality](https://glitch.com/edit/#!/aframe-1hr-intro).**
- For a quick refresher on Javascript please see [W3 Schools Javascript Introduction](https://www.w3schools.com/js/js_intro.asp).

----------------

## Contributing to Circles
##### *[back to top](#circles-xr-learning-framework)*

<br>

We can always learn more, and can always do things better. This framework is open-source under the MIT license in the hopes that it can be co-designed and extended by others looking for similar VR learning tools. To contribute, please make a new [fork](https://github.com/PlumCantaloupe/circlesxr/network/members), or if already a collaborator, a new [branch](https://github.com/PlumCantaloupe/circlesxr/branches), add your changes into that new fork/branch and submit a [PR (pull request)](https://github.com/PlumCantaloupe/circlesxr/pulls). We can then review the changes and merge them into to this main branch for us all to use when ready.

Also, of course, if you have any formal or informal bugs, feedback, or suggestions please submit an [issue](https://github.com/PlumCantaloupe/circlesxr/issues).

:pray: grazie mille! :pray:

----------------

## Early Contributors
##### *[back to top](#circles-xr-learning-framework)*

<br>

The following are several companions that have helped to bring this project into existence. Starting as a prototype for [Oculus Launchpad 2018](https://developer.oculus.com/launch-pad/) to showcase [Viola Desmond's story as a pioneer for Canadian civil rights](https://humanrights.ca/story/one-womans-resistance), I wanted to recognize them for their early direction and support. Though this project is an extension of my completed [Ph.D. research at Carleton University](https://carleton.ca/engineering-design/story/giving-new-life-to-a-canadian-legend/), I hope that their contributions in this open-source repository will also help inspire others as they have myself.

Thank you from an aspiring student of all things XR and learning, 
[Anthony Scavarelli](http://portfolio.anthony-scavarelli.com/)


To all those that helped along the way:

- **[Dr. Ali Arya](https://www.csit.carleton.ca/~arya/)**, *Research Advisor*
- **[Dr. Robert J. Teather](https://www.csit.carleton.ca/~rteather/)**, *Research Advisor*
- **[Favour Diokpo](https://www.behance.net/favourdiokpo)**, *3D Artist*
- **[Virginia Mielke](https://www.linkedin.com/in/virginia-mielke-ba1a361/)**, *3D Artist*
- **[Nathaniel Parant](https://www.linkedin.com/in/nathaniel-parant-43901341/?originalSubdomain=ca)**, *Storyteller*
- **[Jessica Alberga](http://jessicaalberga.ca/)**, *Journalist*
- **[Julie McCann](http://portfolios.camayak.com/julie-mccann/page/4/)**, *Journalist*
- **[Grant Lucas](https://grantlucas.com/)**, *Web Developer*
- **[Tetsuro Takara](https://www.tetchi.ca/)**, *Web Developer*
- **[Heather Hennessey](https://www.linkedin.com/in/heather-hennessey-4961a5132/)**, *WebXR Developer*
