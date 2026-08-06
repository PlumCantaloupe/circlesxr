# CIRCLES XR Learning Framework

<img src="node_server/public/global/images/Circles_MultiPlatform.jpg?raw=true" width="49.3%" alt="Screenshot of 3D avatars around the campfire in CIRCLES" />   <img src="node_server/public/global/images/Circles_WomenInTrades.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' world that highlights the challenges women face in the trades" /> <img src="node_server/public/global/images/Circles_KinematicsHub.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' hub world for showcasing basic kinematics" /> <img src="node_server/public/global/images/Circles_ExampleWorld.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' example world for showing Circles' features to developers" />
<img src="node_server/public/global/images/EOM_2_Screen.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' Echoes of the Mind Experience about brainwaves" /> <img src="node_server/public/global/images/MarsRover_1_Screen.jpg?raw=true" width="49.3%" alt="Screenshot of CIRCLES' Mars Rover world" />

## Table of Contents
##### *[back to top](#circles-xr-learning-framework)*

<br>

- [Circles Overview](#circles-overview)
  - [Why Use VR in Learning?](#why-use-vr-in-learning)
  - [Why Circles?](#why-circles)
  - [Research Using Circles](#research-using-circles)
- [Circles Interactions](#circles-interactions)
- [Running Circles Locally](#running-circles-locally)
- [Creating A New Circles World](./docs/guides/create-a-world.md)
- [Circles Structure](#circles-structure)
- [Circles Components](#circles-components)
- [Circles Events](#circles-events)
- [Circles Networking](./docs/core/networks/core-networking.md)
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

- **[Click here for a blogpost on Circles and its progress, research, and development.](https://www.anthony-scavarelli.com/portfolio/circles-webvr-education-platform/)**
- **[Click here to view an open-access paper describing Circles and its core motivation, elements,and features.](https://publications.immersivelrn.org/index.php/academic/article/view/228)**

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

<br>

### **Research Using Circles**
##### *[back to top](#circles-xr-learning-framework)*

- [Scavarelli, A., Arya, A., Teather, R.J., Wakelin, R., Gauen, S., McCann, J., “Exploring the Inclusive Design and Use of Social Multi-Platform Virtual Reality for a Post-Secondary Gender Diversity Workshop,” 2024 10th International Conference of the Immersive Learning Research Network (iLRN), Glasgow, Scotland, 2024.](https://www.immersivelrn.org/ilrn2024/home/)
- [Scavarelli, A., Arya, A., & Teather, R. J., “Circles: A Framework for Creating Inclusive Virtual Reality Learning Activities in Social Learning Spaces,” Immersive Learning Research – Academic, 1(1), pp. 1–11, 2024.](https://publications.immersivelrn.org/index.php/academic/article/view/228) 
- [Scavarelli, A., Teather, R. J. & Arya, A., “Exploring Selection and Search Usability Across Desktop, Tablet, and Head-Mounted Display WebXR Platforms,” 2023 9th International Conference on Virtual Reality (ICVR), 2023, pp. 505-514, 2023.](https://ieeexplore.ieee.org/document/10169549)
- [Yong, A., Arya A., & Mantch M., "Indigenous Technology Empowerment Model: A Community-based Design Framework," 2023 IEEE International Conference on Engineering, Technology and Innovation (ICE/ITMC), Edinburgh, United Kingdom, pp. 1-9, 2023.](https://ieeexplore.ieee.org/abstract/document/10332432?casa_token=ORzJMJ2PVIMAAAAA:WljQYCNyilcfzFahu8dRTlio58CkAZTAUH0q6NJ5L3F1uwb_SgvhDGTRTGydVFPHPf-RK9UWy8od)
- [Kroma A., Grinyer K., Scavarelli A., Samimi E., Kyian S. and Teather R.J., “The Reality of Remote Extended Reality Research: Practical Case Studies and Taxonomy,” Front. Comput. Sci., 2022.](https://www.frontiersin.org/articles/10.3389/fcomp.2022.954038/)
- [Blais, L., Qorbani, H. S., Arya, A., & Davies, J. "A Memory Palace for Brain Anatomy and Function Represented in Virtual Reality. International Association for Development of the Information Society," 19th International Conference on Cognition and Exploratory Learning in Digital Age (CELDA). 2022.](https://eric.ed.gov/?id=ED626951)
- [Scavarelli, A., Arya, A., & Teather, R. J., “Circles: exploring multi-platform accessible, socially scalable VR in the classroom,” 2019 IEEE Games, Entertainment, Media Conference (GEM), pp. 1–4, 2019.](https://ieeexplore.ieee.org/abstract/document/8897532)
- [Scavarelli, A., Teather, R. J., & Arya, A. “Towards a Framework on Accessible and Social VR in Education,” 2019 IEEE Conference on Virtual Reality and 3D User Interfaces (VR), pp. 1148–1149, 2019.](https://ieeexplore.ieee.org/abstract/document/8798100)

_[More information on Circles' related research](https://www.anthony-scavarelli.com/research/)_

<br><br>

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
|  Navigation          | Checkpoint Teleport | Checkpoint Teleport | Checkpoint Teleport | Keyboard's WASD     | On-screen Left Joystick                 | Click-in Left Joysick        |
|  Look                | Left-Mouse Drag     | Device Orientation  | HMD Orientation     | n/a                 | On-screen Right Joystick | Joysicks left/right (click-in for smooth)                 |
|  Selection           | Single Click        | Tap                 | Raycast (laser pointer)     | TBD                 | TBD                 | TBD                 |
|  Manipulation        | Non-Diegetic UI     | Non-Diegetic UI     | Non-Diegetic UI     | TBD                 | TBD                 | TBD                 |
|  Release             | Single Click        | Tap                 | Raycast Object      | TBD                 | TBD                 | TBD                 |         

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
1. [Install node/npm](https://nodejs.org/en/download/). **NOTE: We recommend installing the "LTS" version of npm/node.**
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

## Circles Structure
##### *[back to top](#circles-xr-learning-framework)*
<br>

Circles follows the [ECS (Entity-Component System)](https://aframe.io/docs/1.4.0/introduction/entity-component-system.html) programming design pattern that [A-Frame](https://aframe.io) follows, likely be familiar to [Unity](https://unity.com) Developers.

Also note that Circles is built on several libraries, giving you additional functionality. The foundational libraries are:
- [A-Frame](https://aframe.io), which is built on [Three.js](https://threejs.org): This gives us a 3D engine specifically created for building multi-platform WebXR content using [HTML](https://www.w3schools.com/whatis/whatis_html.asp) and [Javascript](https://www.w3schools.com/js/).
- [Networked-Aframe](https://github.com/networked-aframe/networked-aframe): For quickly networking objects. To send simple message, and synching client states, see [Circles Networking](https://github.com/PlumCantaloupe/circlesxr#circles-networking).
- [Aframe-extras (controls and pathfinding)](https://github.com/c-frame/aframe-extras). This library gives us additional multi-platform controls, including the ability to use [nav meshes](https://medium.com/@donmccurdy/creating-a-nav-mesh-for-a-webvr-scene-b3fdb6bed918) to limit movement within Circles' worlds.
- [Aframe-Physics-System](https://github.com/c-frame/aframe-physics-system): Available for those that wish to include physics into their Circles worlds (see the "KIN_" worlds included as an example).

The general structure of the framework (and the Github repository) follows:

- [The Server](https://github.com/PlumCantaloupe/circlesxr/tree/master/node_server): Circles uses a javscript server [node.js] and all associated code relevant to the delivery of all HTML and JS content is can be found in this folder. [app.js](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/app.js) is the main file that connects to a javascript databse [MongoDB](https://www.mongodb.com/) for saving user information, and serves up Circles' html and javascript pages. Note that [router.js](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/routes/router.js) is reponsible for creating appropriate paths to content, and [controller.js](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/controllers/controller.js) is reponsible for connecting with the mongo database, and that much of the 2D html content (e.g., login and explore pages) are rendered with [pug](https://pugjs.org/), which allows us to generate HTML and CSS via javascript. All files related to 2D HTML and CSS are found within the [web folder](https://github.com/PlumCantaloupe/circlesxr/tree/master/node_server/public/web).
- [Circles Core](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/core): All core functionality of the Circles can be found here, including any constants or global functions, we would like to be able to access on both the server and client sides. This will be invisible to most developers. To simplify development for content we also modify code during the [webpack](https://webpack.js.org) project build before we serve it.
- [Circles Worlds](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds): All Circles' worlds are placed here. From here they are modified to include Circles specific functionality and copied into an untracked folder on the server.
- [Circles Groups](https://github.com/networked-aframe/networked-aframe#scene-component): All Circles' users are connected to others within the same "group" (or "room"), no matter which Circles world they are within. You can set this manually by adding `?group=YOUR_GROUP_NAME` manually to the end of your Circles URL e.g., `http://127.0.0.1:{SERVER_PORT}/w/{YOUR_WORLD_FOLDER}?group={YOUR_GROUP_NAME}`, or as recommended above using [ngrok](https://ngrok.com/), `https://your_ngrok_url.ngrok.io/w/{YOUR_WORLD_FOLDER}?group={YOUR_GROUP_NAME}`. This group is then passed to the [networked-aframe](https://github.com/networked-aframe/networked-aframe) room property to connect users only to users within the same group..

*Also note, that a [ResearchSpace](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/ResearchSpace/) is currently in development for evaluating [Fitts' Law selections](https://www.yorku.ca/mack/hhci2018.html) and search performance. At this time the ResearchSpace, and the associated [research components](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/ResearchSpace/scripts) are local to the ["ResearchSpace" world](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/ResearchSpace/index.html). After more extensive testing it will likely be moved to the Circles core.*

----------------

## Circles Components
##### *[back to top](#circles-xr-learning-framework)*

<br>

There are dozens of components created for use within this framework that you can find in the [components folder of this repo](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/components); but the following will likely be the most used, and thus the most significant.


Information on components available can be found under [docs/components].

Some useful core functions can be found in [docs/core/core-functions.md]

Circles core events can be found under [docs/core/core-events.md]


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
