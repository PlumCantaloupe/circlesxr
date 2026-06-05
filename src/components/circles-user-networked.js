'use strict';

const { CIRCLES_MIC_ENABLED } = require("../core/circles_constants");

AFRAME.registerComponent('circles-user-networked', {
  schema: {
    // ... Define schema to pass properties from DOM to this component
    gltf_head:                  {type: 'asset',     default: ''},
    gltf_hair:                  {type: 'asset',     default: ''},
    gltf_body:                  {type: 'asset',     default: ''},

    color_head:                 {type: 'string',    default: ''}, 
    color_hair:                 {type: 'string',    default: ''},
    color_body:                 {type: 'string',    default: ''}, 

    visiblename:                {type: 'string',    default: ''},
    usertype:                   {type: 'string',    default: ''},
    userDevice:                 {type: 'string',    default: ''},
    userWorld:                  {type: 'string',    default: ''},

    headVisibility:             {type: 'boolean',   default: true},
    hairVisibility:             {type: 'boolean',   default: true},
    bodyVisibility:             {type: 'boolean',   default: true},
    userVisibility:             {type: 'string',    default: 'visible', oneOf: ['visible', 'hidden', 'wireframe', 'shade']},
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    const CONTEXT_AF      = this;
    CONTEXT_AF.isPlayer1  = false;

    // We check if a user is connected, then rebroadcast our state, the double switch seems to be the only way it syncs properly through my testing so far, hopefully 
    //    we can get something less janky in the future??
    // document.addEventListener(CIRCLES.EVENTS.USER_CONNECTED, (e) => {
    //   if (this.el !== CIRCLES.getAvatarElement()) return;
    //   const currentVisibility = this.data.userVisibility;
    //   //console.log(currentVisibility);
    //   setTimeout(() => this.el.setAttribute('circles-user-networked', 'userVisibility', 'visible'), 100);
    //   setTimeout(() => this.el.setAttribute('circles-user-networked', 'userVisibility', currentVisibility), 100);
    // });


    // Janky way using naf data channels to set local meshes, we should be able to still completely hide meshes
    //  but the shader function will need to be reworked likely
    NAF.connection.subscribeToDataChannel('change-world', (senderID, dataType, data) => {

      const jitter = Math.floor(Math.random() * (600 - 300 + 1)) + 300;

      setTimeout(() => {
        const localWorld = CIRCLES.getAvatarElement().components["circles-user-networked"]?.data?.userWorld;
        let otherPlayer;

        Object.values(NAF.entities.entities).forEach(e => {
          if (e.components.networked.attrValue.networkId === data.clientID) {
            otherPlayer = e;
          }
        });

        const avatar = otherPlayer.querySelector('.avatar');

        // If already loaded
        if (avatar.querySelector('.user_hair') && avatar.querySelector('.user_body') && avatar.querySelector('.user_head')) {
          CONTEXT_AF.applyMesh(otherPlayer, localWorld !== data.world);

        } else {
          // A loaded trigger
          avatar.addEventListener('model-loaded', () => {
            CONTEXT_AF.applyMesh(otherPlayer, localWorld !== data.world);
          }, { once: true });
        }
      }, jitter)
    });


    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function(e) {
      const playerOneNode       = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
      const playerOneAvatarNode = playerOneNode.querySelector('.avatar');
      const thisNode            = CONTEXT_AF.el;
      const eventNode           = e.detail.element;


      //lets only move forward to event node is the same as this one
      if ( thisNode.isSameNode(eventNode) === true ) {
        CONTEXT_AF.isPlayer1 = thisNode.isSameNode(playerOneAvatarNode); //now make sure this is the player1 node

        if (CONTEXT_AF.isPlayer1 === true) {
          //we can assume that node wants to load itself. We are doing this to minimize race-conditions overwriting each by doing so in user-template
          CONTEXT_AF.el.setAttribute('circles-user-networked', {
            gltf_head:              playerOneNode.getAttribute('circles-head-model'),
            gltf_hair:              playerOneNode.getAttribute('circles-hair-model'),
            gltf_body:              playerOneNode.getAttribute('circles-body-model'), 
            color_head:             playerOneNode.getAttribute('circles-head-color'),
            color_hair:             playerOneNode.getAttribute('circles-hair-color'),
            color_body:             playerOneNode.getAttribute('circles-body-color'),
            visiblename:            playerOneNode.getAttribute('circles-visiblename'),
            usertype:               playerOneNode.getAttribute('circles-usertype'),
            userDevice:             CIRCLES.getVRPlatform(),
            userWorld:              CIRCLES.getCirclesWorldName(),       
          });

          //set device icon here too ... I guess :/
          let avatarNode3 = CONTEXT_AF.el.querySelector('.deviceicon_front');
          let avatarNode4 = CONTEXT_AF.el.querySelector('.deviceicon_back');
          let iconPath    = CIRCLES.CONSTANTS.ICON_DEVICE_UNKNOWN;
          let vrPlatform  = CIRCLES.getVRPlatform();

          if (vrPlatform === CIRCLES.VR_PLATFORMS.HMD_WIRED || vrPlatform === CIRCLES.VR_PLATFORMS.HMD_STANDALONE) {
            iconPath = CIRCLES.CONSTANTS.ICON_DEVICE_HMD6DOF;
          }
          else if (vrPlatform === CIRCLES.VR_PLATFORMS.MOBILE_PHONE || vrPlatform === CIRCLES.VR_PLATFORMS.MOBILE_TABLET) {
            iconPath = CIRCLES.CONSTANTS.ICON_DEVICE_MOBILE;
          }
          else if (vrPlatform === CIRCLES.VR_PLATFORMS.DESKTOP) {  
            iconPath = CIRCLES.CONSTANTS.ICON_DEVICE_DESKTOP;
          }

          //set icon textures
          avatarNode3.setAttribute('material', {src: iconPath});
          avatarNode4.setAttribute('material', {src: iconPath});
        }
      }
    });


    // this.addUser();
  },
  applyMesh: function(el, world){
        const avatar = el.querySelector('.avatar');
        const hair = avatar.querySelector('.user_hair');
        const body = avatar.querySelector('.user_body');
        const head = avatar.querySelector('.user_head');
        console.log('apply');
        console.log(el);

        // if none of them are loaded wait for a trigger
        if (!hair || !body || !head) return;

        if (world){
          hair.components['circles-shader'].enable();
          body.components['circles-shader'].enable();
          head.components['circles-shader'].enable();
        } else {
          hair.components['circles-shader'].disable();
          body.components['circles-shader'].disable();
          head.components['circles-shader'].disable();

        }
  },
  update: function(oldData)  {
    const CONTEXT_AF  = this;

    if (Object.keys(CONTEXT_AF.data).length === 0) { return; } // No need to update. as nothing here yet

    // Temporary fix for ensuring we can see through double sided
    CIRCLES.getAvatarRigElement().querySelector('.avatar').setAttribute('camera', {near: 0.06}); 

    // User NAF to custom send data in broadcast https://stackoverflow.com/questions/55107053/networked-a-frame-gallery-a-sky-change-for-all-the-people-in-the-room
    //  We do this on world change, look at NAF subscribe channel in init above for receiver
    if ((oldData.userWorld !== CONTEXT_AF.data.userWorld) && (CONTEXT_AF.data.userWorld !== '')){
      

      // Have to ensure NAF is setup before we run it otherwise there is no point, the update will run again anyways
      const currClient = CIRCLES.getAvatarRigElement().getAttribute('networked').networkId;
      const localWorld = CIRCLES.getAvatarElement().components["circles-user-networked"]?.data?.userWorld;
      
      console.log(localWorld);
      console.log('In habited by');
      console.log(currClient);
        


      // Similar to the jitter calculations I saw on other components, stopping all these things from firing at once
      const jitter = Math.floor(Math.random() * (600 - 300 + 1)) + 300;
      setTimeout(() => {
        if (NAF.connection.isConnected()) {
          NAF.connection.broadcastData('change-world', {
            clientID: currClient,
            world: localWorld,
          });

          Object.values(NAF.entities.entities).forEach(e => {
            if (e.id === 'Player1') return;
            const avatar = e.querySelector('.avatar');
            const otherWorld = avatar.components['circles-user-networked']?.data?.userWorld;
            if (!otherWorld || otherWorld === '') return;
            if (avatar.querySelector('.user_hair') && avatar.querySelector('.user_body') && avatar.querySelector('.user_head')) {
              CONTEXT_AF.applyMesh(e, localWorld !== otherWorld);

            } else {
              // A loaded trigger
              avatar.addEventListener('model-loaded', () => {
                CONTEXT_AF.applyMesh(e, localWorld !== otherWorld);
              }, { once: true });
            }
          });
        }
      }, jitter);

    }

    //head model change
    if ( (oldData.gltf_head !== CONTEXT_AF.data.gltf_head) && (CONTEXT_AF.data.gltf_head !== '') ) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_head');
      avatarNode.setAttribute('gltf-model', CONTEXT_AF.data.gltf_head);
    }

    //hair model change
    if ( (oldData.gltf_hair !== CONTEXT_AF.data.gltf_hair) && (CONTEXT_AF.data.gltf_hair !== '') ) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_hair');
      avatarNode.setAttribute('gltf-model', CONTEXT_AF.data.gltf_hair);
    }

    //body model change
    if ( (oldData.gltf_body !== CONTEXT_AF.data.gltf_body) && (CONTEXT_AF.data.gltf_body !== '') ) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_body');
      avatarNode.setAttribute('gltf-model', CONTEXT_AF.data.gltf_body);
    }

    //head color change
    if ( oldData.color_head !== CONTEXT_AF.data.color_head ) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_head');
      avatarNode.setAttribute('circles-color', {color: CONTEXT_AF.data.color_head});
    }

    //hair color change
    if ( oldData.color_hair !== CONTEXT_AF.data.color_hair ) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_hair');
      avatarNode.setAttribute('circles-color', {color: CONTEXT_AF.data.color_hair});
    }

    //body color change
    if ( oldData.color_body !== CONTEXT_AF.data.color_body ) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_body');
      avatarNode.setAttribute('circles-color', {color: CONTEXT_AF.data.color_body});
    }

    //visiblename change
    if ( oldData.visiblename !== CONTEXT_AF.data.visiblename ) {
      //get/set nametag nodes
      let avatarNode1 = CONTEXT_AF.el.querySelector('.nametag_front');
      let avatarNode2 = CONTEXT_AF.el.querySelector('.nametag_back');
      avatarNode1.setAttribute('text', {value: CONTEXT_AF.data.visiblename});
      avatarNode2.setAttribute('text', {value: CONTEXT_AF.data.visiblename});
    }

            // Ensure components have been initialized to something before messing with them
    if (CONTEXT_AF.data.color_head != '' && CONTEXT_AF.data.color_hair != '' && CONTEXT_AF.data.color_body != ''){
          CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-color', {color: CONTEXT_AF.data.color_head, alpha: 1});
          CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-color', {color: CONTEXT_AF.data.color_hair, alpha: 1});
          CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-color', {color: CONTEXT_AF.data.color_body, alpha: 1});
    }


    // Enable individually body part visibility
    if ((oldData.headVisibility !== CONTEXT_AF.data.headVisibility) && (CONTEXT_AF.data.headVisibility !== '')){
      CONTEXT_AF.el.querySelector('.user_head').setAttribute('visible', String(CONTEXT_AF.data.headVisibility));
    }
    if ((oldData.bodyVisibility !== CONTEXT_AF.data.bodyVisibility) && (CONTEXT_AF.data.bodyVisibility !== '')){
      CONTEXT_AF.el.querySelector('.user_body').setAttribute('visible', String(CONTEXT_AF.data.bodyVisibility));
    }
    if ((oldData.hairVisibility !== CONTEXT_AF.data.hairVisibility) && (CONTEXT_AF.data.hairVisibility !== '')){
      CONTEXT_AF.el.querySelector('.user_hair').setAttribute('visible', String(CONTEXT_AF.data.hairVisibility));
    }


    // Player total avatar visibility
    if (oldData.userVisibility !== CONTEXT_AF.data.userVisibility && CONTEXT_AF.data.userVisibility != '') {
      if (CONTEXT_AF.data.userVisibility === 'visible' && oldData.userVisibility === 'shade' ) {
        //console.log('becoming visible');

        // Turn the components on
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('visible', "true");
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('visible', "true");
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('visible', "true");


      // Disable wireframe mode
      } else if (CONTEXT_AF.data.userVisibility === 'visible' && oldData.userVisibility === 'wireframe' ) {
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-color', { wireframe: false });
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-color', { wireframe: false });
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-color', { wireframe: false });

      } else if (CONTEXT_AF.data.userVisibility === 'visible' && oldData.userVisibility === 'shade'){
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-matte-black', 'active', false);
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-matte-black', 'active', false);
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-matte-black', 'active', false);
        
      } else if (CONTEXT_AF.data.userVisibility === 'hidden') {
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('visible', "false");
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('visible', "false");
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('visible', "false");

        // Set the shader on, the shader turning on disables the default player mesh but keeps the geometry:)
      } else if (CONTEXT_AF.data.userVisibility === 'wireframe') {
        // Turn off hidden just in case
        if (oldData.userVisibility === 'hidden') {
          CONTEXT_AF.el.querySelector('.user_head').setAttribute('visible', "true");
          CONTEXT_AF.el.querySelector('.user_hair').setAttribute('visible', "true");
          CONTEXT_AF.el.querySelector('.user_body').setAttribute('visible', "true");
        }
        // Set wireframe
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-color', { wireframe: true, color: CONTEXT_AF.data.color_head, alpha: 1 });
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-color', { wireframe: true, color: CONTEXT_AF.data.color_head, alpha: 1 });
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-color', { wireframe: true, color: CONTEXT_AF.data.color_head, alpha: 1 });
        console.log('wires framed');
      } else if (CONTEXT_AF.data.userVisibility === 'shade') {
        // Turn off hidden just in case
        if (oldData.userVisibility === 'hidden') {
          CONTEXT_AF.el.querySelector('.user_head').setAttribute('visible', "true");
          CONTEXT_AF.el.querySelector('.user_hair').setAttribute('visible', "true");
          CONTEXT_AF.el.querySelector('.user_body').setAttribute('visible', "true");
        }
        // set shade
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-matte-black', 'active', true);
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-matte-black', 'active', true);
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-matte-black', 'active', true);

      }


        // Set shade

      
    }

    CIRCLES.getCirclesSceneElement().emit(CIRCLES.EVENTS.AVATAR_COSTUME_CHANGED, CONTEXT_AF.el, true);
  },

  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
