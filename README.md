# CIRCLES VR Learning Framework

![Screenshot of 3D avatars around the campfire in CIRCLES](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/public/global/images/Circles_MultiPlatform.jpg?raw=true)

![Screenshot of CIRCLES' world that highlights the challenges women face in the trades](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/public/global/images/Circles_WomenInTrades.jpg?raw=true)

## Overview

This **CIRCLES** framework is meant to easily allow
developers to create multi-user and multi-platform
[WebXR](https://www.w3.org/TR/webxr/) learning activities on top of another WebXR framework
[A-Frame](https://aframe.io), with networking provided by [Networked-Aframe](https://github.com/networked-aframe/networked-aframe).

CIRCLES is the practical implmenetation of a research project into [universal](http://universaldesign.ie/What-is-Universal-Design/The-7-Principles/) and [inclusive](https://www.microsoft.com/design/inclusive/) multi-user VR that will evolve as the research dictates how users interact with each other, their physical and virtual environments, and with learning artefacts in variable VR space. Our current focus is within both guided and unguided classroom and museum learning contexts; but we aim to keep the framework flexible where possible to allow for greater creativity.

**[Click here for more information on Circles and its progress, research, and development](https://www.anthony-scavarelli.com/portfolio/circles-webvr-education-platform/)**

### The (3) main impetuses for **CIRCLES** are as follows:

- **Accessibility**
  - **Device Scalability:** Platform Scalability refers to a system capable of adapting to a range of [VR]()/[AR]() capable platforms (desktop, mobile, large screens, etc.). This is comparable to a virtual form of [UDL (Universal Design for Learning)](), which suggests increasing the accessibility of learning activities via (1) Multiple Means of Representation, (2) Multiple Means of Expression, and (3) Multiple Means of Engagement ([Rose et al., 2006]()). By supporting multiple platforms (Desktop, Mobile\[tablet\], and Head-Mounted Display (HMD \[[Oculus Quest]()\] only right now)), VR/AR content can be potentially more accessible with “multiple means of action and expression.”

  - **Social Scalability:** To create a framework that allows variable forms of one-to-many users across both co-located and remote perspectives. This framework should encourage the use of experiences that allow one to interact; but that also the experience should scale naturally and with collaboration and/or competition in mind to provide a more visceral experience as the number of users increases. Social Scalability is based on Snibbe et al’s definition of social scalability within a museum context whereby *“interactions are designed to share with others ... interaction, representation, and users’ engagement and satisfaction should become richer as more people interact”* ([Snibbe & Raffle, 2009]()).

  - **Reality Scalability [future]:** To create a framework that allows encourages developers to create experiences that allow VR, AR, and physical installation experiences, across a variable number of users. *Note that the recent inclusion of AR into WebXR soon should help with this goal.

- **Considerartion of Parallel Realities:** 
There is some work looking at how the virtual work can affect our reality, in how we identify in virtual worlds can change our behaviour ([Yee & Bailenson, 2007]()), in how task performance can be affected by others through social facilitation and social inhibition ([Miller et al., 2019]()), and in how virtual spaces can also change behaviour ([MacIntyre et al., 2004](); [Proulx et al., 2016]()); but there is still much work to be done on how the physical learning spaces we inhabit may affect our virtual behaviours. We have seen that the very nature of using this technology can inhibit participation and comfort ([Brignull & Rogers, 2002](); [Outlaw & Duckles, 2017](); [Rogers et al., 2019]()); but it is still very early beyond some studies into how we prevent collisions in shared virtual spaces ([Langbehn et al., 2018](); [Scavarelli & Teather, 2017]()). Just as connectivism and activity theory suggest that our digital tools and the socio-historical culture that surround learners become intrinsic part of the learning process, we should also consider how these same processes apply to both virtual environments and physical worlds as it becomes clear that the virtual worlds and physical worlds are not mutually exclusive entities.

- **Learning Foundations:** Though most VR/AR projects in learning depend on constructivism, experiential learning, and/or social cognitive theory as a foundation for chosen features and properties, there are additional theoretical and methodological foundations within [CSCL (Computer-Supported Collaborative Learning)]() that may help lend more significant consideration to both the virtual and physical environments within a socio-cultural context. [Activity theory](), in the form of expansive learning, includes not only digital tools and objects/artefacts as an intrinsic part of the learning process; but also the socio-historical properties of learning spaces ([Engeström, 2016; Stahl & Hakkarainen, 2020]()). This could include some exciting explorations into the interplay between the social, spatial, and cultural aspects present within both the virtual and physical learning spaces; and how to better create VR/AR content that acknowledges them. This could include exploring how wearing in HMDs in learning spaces is not yet culturally acceptable ([Rogers et al., 2019]()), or that being a woman in social VR spaces may encourage virtual harassment, decreasing participation in activities using these technologies ([Outlaw & Duckles, 2017]()). The interconnected processes of learning within individuals and their actions, the social environment, and the spatial environments are complex, and as we add in virtual environments that may change behaviour, we may need to look towards additional learning theories that better encapsulate how this learning happens.

----------------

## Running this Framwork Locally

1. Clone repo
    - `git clone https://github.com/PlumCantaloupe/circlesxr.git`
1. Though not necessary, it is recommend to use [Visual Studio Code](https://code.visualstudio.com/) to develop, run, and modify _Circles_. VSCode allows you to easily open [an integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal) to execute the terminal commands below. It also has many [built-in Github features](https://code.visualstudio.com/docs/editor/versioncontrol). 
1. [Install mongo](https://docs.mongodb.com/manual/installation/)
    - **Create a `data/db` folder on your PC** that Mongo can write to
    - `chmod -R 755 /data` should be sufficient (if using Mac OSX Catalina you can will have to create this data/db folder in a non-root area. Make sure to set this in your .env file - see Step 7)
    - Please note that if the _mongo_ or _mongod_ cmds "are not recognized" that you may need to add the [mongo executables to your windows path](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#add-mongodb-binaries-to-the-system-path). More information [here](https://helpdeskgeek.com/windows-10/add-windows-path-environment-variable/).
1. [Install node/npm](https://nodejs.org/en/download/)
1. Go into project folder and install NPM dependencies
    - `npm install`
1. Set up the Environment file
    - `cp .env.dist .env` (or just duplicate the .env.dist file and rename it as .env :)
    - Make any changes to your .env file that are specific to your environment
1. Open another terminal window/session and start Mongo
    - `npm run mongo`
    - You can also query Mongo using the consle by just running `mongo` in your
      terminal (if you also have the mongo db running)
1. Server the app so you can view it in your browser
    - `npm run serve`
    - This will build the needed bundles and serve the app for viewing. Check
      out the `scripts` section of `package.json` for more build options and
      details.
1. In a browser (recommend Chrome at this time), go to `localhost:{SERVER_PORT}/add-all-test-data` (default is `localhost:1111/add-all-test-data`) to add both models to mongo db and test users. Note that if you are using localhost it may complain about https mismatches. Other browsers may work, or consider using [ngrok](https://ngrok.com/) to serve up localhost as a remote https endpoint (note for WebXR to properly function on reality-based devices i.e. tablets or HMDs the content must served via https).
    - **NOTE:** If you need to clean up or modify db contents use the `mongo` shell. [see here](https://docs.mongodb.com/manual/reference/mongo-shell/). To drop entire _circles_ db (which you will have to do when we make changes to db items) use the following commands within the mongo shell (the re-add data with `localhost:{SERVER_PORT}/add-all-test-data` url):
        - `use circles`
        - `db.dropDatabase()`
1. Login with one of the 3 test users (there are also others i.e., t1, r1, p1, p2, p3)
    - `{username}:{password}`
    - `s1@circlesxr.com:password`
    - `s2@circlesxr.com:password`
    - `s3@circlesxr.com:password`
1. Open another instance of browser (or open incognito mode, or another browser)
1. Log in with another user and have fun seeing each other :)

### Instance Routes

- */register* (has been diabled for now)
- */profile*
- */campfire*
- */explore* (this is to see the list of worlds included here)
- */add-all-test-data* (only do this once, or if you have deleted/dropped the database and need to re-populate test data )

----------------

## Creating your own "world"

- Go to src/worlds and see that each world has its own folder and associated index.html
- See [ExampleWorld](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/ExampleWorld) for a simple example of how to set up your own
- Currently, routes are not automatically created for each world ([in progress]); but you can type in URL http://localhost:{SERVER_PORT}/rooms/explore/world/{YOUR_WORLD_FOLDER}
- Note that in [ExampleWorld](https://github.com/PlumCantaloupe/circlesxr/tree/master/src/worlds/ExampleWorld) you can see a few HTMl entities that are required for your world to properly connect to all features of this framework. These are replaced when served for the appropriate scripts so please pay attention to their position within the page.
  ```html  
  <circles-start-scripts/>

  <!-- a-scene with 'circles-properties' component [REQUIRED] -->
  <a-scene circles_properties>

  <circles-assets/>

  <circles-avatar/>

  <circles-end-scripts/>
  ```
  
  ----------------

## Early Contributors

The following are several companions that have helped to bring this project into existence. Starting as a prototype for [Oculus Launchpad 2018](https://developer.oculus.com/launch-pad/) to showcase [Viola Desmond's story as a pioneer for Canadian civil rights](https://humanrights.ca/story/one-womans-resistance) and, more recently, helping direct content for highlighting the challenges women face in the trades, I wanted to recognize them for their early direction and support. Though this is mainly a research project for my [Ph.D. work at Carleton University](https://carleton.ca/engineering-design/story/giving-new-life-to-a-canadian-legend/) I hope that their contributions in this open-source repository will also help and inspire others as they have myself.

Thank you from an aspiring student of all things XR and learning, [Anthony Scavarelli](http://portfolio.anthony-scavarelli.com/)

- **[Favour Diokpo](https://www.behance.net/favourdiokpo)**, *3D Artist*
- **[Virginia Mielke](https://www.linkedin.com/in/virginia-mielke-ba1a361/)**, *3D Artist*
- **[Jessica Alberga](http://jessicaalberga.ca/)**, *Journalist*
- **[Julie McCann](http://portfolios.camayak.com/julie-mccann/page/4/)**, *Journalist*
- **[Dr. Ali Arya](https://www.csit.carleton.ca/~arya/)**, *Research Advisor*
- **[Dr. Robert J. Teather](https://www.csit.carleton.ca/~rteather/)**, *Research Advisor*
- **[Grant Lucas](https://grantlucas.com/)**, *Web Developer*
- **[Tetsuro Takara](https://www.tetchi.ca/)**, *Web Developer*
- **[Heather Hennessey](https://www.linkedin.com/in/heather-hennessey-4961a5132/)**, *WebXR Developer*
