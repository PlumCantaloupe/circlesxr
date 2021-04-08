# CIRCLES Framework

![Screenshot of 3D avatars around the campfire in CIRCLES](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/public/global/images/Circles_MultiPlatform.jpg?raw=true)

![Screenshot of CIRCLES' world that highlights the challenges women face in the trades](https://github.com/PlumCantaloupe/circlesxr/blob/master/node_server/public/global/images/Circles_WomenInTrades.jpg?raw=true)

## Overview

This **CIRCLES** framework is meant to easily allow
developers to create multi-user and multi-platform
[WebVR/WebXR](https://webvr.info) content on top of another WebXR framework
[A-Frame](https://aframe.io), with networking provided by [Networked-Aframe](https://github.com/networked-aframe/networked-aframe).

CIRCLES development is part of a research project into multi-user VR/AR that will
constantly evolve as the research dictates how users will interact with each
other in variable VR space. Our current focus is within both the formal (classroom) and
informal (museums) educational contexts; but we  aim to keep the framework flexible where possible to allow for greater creativity.

**[Click here for more information on Circles and its progress, research, and development](https://www.anthony-scavarelli.com/portfolio/circles-webvr-education-platform/)**

### The (3) main goals for **CIRCLES** are as follows:

#### Device Scalability

To create a framework that allows itself to be displayed across a range of VR/AR
capable platforms. The current focus is on supporting desktop, mobile, and standalone HMD (e.g. Oculus Quest). Interaction techniques will be kept simple and straightforward so that they are easily understandable and accessible between platforms.

#### Social Scalability

To create a framework that allows variable forms of one-many users across both
co-located and remote perspectives. This framework should encourage the use of
experiences that allow one to interact; but that also the experience should
scale naturally and with collaboration and/or competition in mind to provide a
more visceral experience as the number of users increases.

#### Reality Scalability [future]

To create a framework that allows encourages developers to create experiences
that allow both VR and AR experiences, across a variable numbver of users using
either technology. *Note that the inclusion AR into WebVR (to become WebXR) soon
should help with this goal.

___TODO: will add more to this later___

----------------

## Running Locally

1. Clone repo
    - `git clone https://github.com/PlumCantaloupe/circlesxr.git`
1. Though not necessary, it is recommend to use [Visual Studio Code](https://code.visualstudio.com/) to develop, run, and modify _Circles_. It also allows you to easily open [an integrated terminal](https://code.visualstudio.com/docs/editor/integrated-terminal) to execute the terminal commands below. It also has many [built-in Github features](https://code.visualstudio.com/docs/editor/versioncontrol). 
1. [Install mongo](https://docs.mongodb.com/manual/installation/)
    - **Create a `data/db` folder on your PC** that Mongo can write to
    - `chmod -R 755 /data` should be sufficient (if using Mac OSX Catalina you can will have to create this data/db folder in a non-root area. Make sure to set this in your .env file - see Step 7)
    - Please note that if the _mongo_ or _mongod_ cmds "are not recognized" that you may need to add the [mongo executables to your windows path](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/#add-mongodb-binaries-to-the-system-path). More information [here](https://helpdeskgeek.com/windows-10/add-windows-path-environment-variable/).
1. [Install node/npm](https://nodejs.org/en/download/)
1. In terminal install webpack globally
    - `npm install --save-dev webpack`
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
1. In a browser (recommend Chrome at this time), go to `localhost:{SERVER_PORT}/add-all-test-data` to add both models to mongo db and test users. Note that if you are using localhost it may complain about https mismatches. Other browsers may work, or consider using [ngrok](https://ngrok.com/) to serve up localhost as a remote https endpoint (this also allows you to easily test your local content on a mobile device i.e., a smartphone or Oculus Quest). You may also have to change NAF_SERVER in .env i.e. **'NAF_SERVER='wss://<your_ngrok_server>.ngrok.io'**
    - Alternatively, you can also go to `localhost:{SERVER_PORT}/add-models-to-db` then `localhost:{SERVER_PORT}/add-users-to-db` to add models then users manually.
    - **NOTE:** If you need to clean up or modify db contents use the `mongo` shell. [see here](https://docs.mongodb.com/manual/reference/mongo-shell/). To drop entire mdmu db (which you will have to do when we make changes to db items) use the following commands within the mongo shell:
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

- /register
- /profile
- /campfire
- /rooms
- /add-all-test-data (only do this once, or if you have deleted/dropped the database and need to re-populate test data )

----------------

## Creating your own "world"

- Go to src/worlds and see that each world has its own folder and associated index.html
- See testworld for a simple example of how to set up your own
- Currently, routes are not automatically created for each world ([in progress]); but you can type in URL http://localhost:{SERVER_PORT}/rooms/explore/world/{YOUR_WORLD_FOLDER}
- Note that in testWorld you can see a few HTMl entities that are required for your world to properly connect to all features of this framework. These are replaced when served for the appropriate scripts so please pay attention to their position within the page.
  ```  
  <circles-start-scripts/>

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
