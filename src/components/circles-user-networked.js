'use strict';

const { CIRCLES_MIC_ENABLED } = require("../core/circles_constants");

AFRAME.registerComponent('circles-user-networked', {
  schema: {
    // ... Define schema to pass properties from DOM to this component
    gltf_head:                  { type: 'asset', default: '' },
    gltf_hair:                  { type: 'asset', default: '' },
    gltf_body:                  { type: 'asset', default: '' },

    color_head:                 { type: 'string', default: '' },
    color_hair:                 { type: 'string', default: '' },
    color_body:                 { type: 'string', default: '' },

    visiblename:                {type: 'string',    default: ''},
    usertype:                   {type: 'string',    default: ''},
    userDevice:                 {type: 'string',    default: ''},
    userWorld:                  {type: 'string',    default: ''},

    // Turn this off here, we want mesh control to be on the local side, the ghostType controls what others build
    //userVisibility:             {type: 'string',    default: 'visible', oneOf: ['visible', 'hidden', 'wireframe', 'shade']},

    // Ghost type could be used to set a globally ghost type, can also change this to control ghost type ac
    ghostType:                  {type: 'string',    default: 'ghost',   oneOf: ['shade', 'wireframe', 'ghost', 'default']}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    const CONTEXT_AF      = this;
    CONTEXT_AF.isPlayer1  = false;



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
          CONTEXT_AF.el.setAttribute('circles-user-local', {
            gltf_head:              playerOneNode.getAttribute('circles-head-model'),
            gltf_hair:              playerOneNode.getAttribute('circles-hair-model'),
            gltf_body:              playerOneNode.getAttribute('circles-body-model'), 
            color_head:             playerOneNode.getAttribute('circles-head-color'),
            color_hair:             playerOneNode.getAttribute('circles-hair-color'),
            color_body:             playerOneNode.getAttribute('circles-body-color'),     
          });

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
  },
  // We want a setting just for the ghost shader so we can preserve the visibility setting for something else
  applyMesh: function (el, world) {

    // Ideally we grab their user-networked uservisibility and set it to that rather than visible
    
    if (world){
      el.querySelector('.avatar').setAttribute('circles-user-local', 'userVisibility', this.data.ghostType);
    } else {
      el.querySelector('.avatar').setAttribute('circles-user-local', 'userVisibility', 'visible');
    }
  },
  update: function(oldData)  {
    const CONTEXT_AF  = this;

    if (Object.keys(CONTEXT_AF.data).length === 0) { return; } // No need to update. as nothing here yet


    if (CONTEXT_AF.data.gltf_hair != oldData.gltf_hair || CONTEXT_AF.data.gltf_head != oldData.gltf_head || CONTEXT_AF.data.gltf_body != oldData.gltf_body
      ||CONTEXT_AF.data.color_hair != oldData.color_hair || CONTEXT_AF.data.color_head != oldData.color_head || CONTEXT_AF.data.color_body != oldData.color_body) 
      {

      // Swap around networked hair/body/head components
      if (CONTEXT_AF.data.gltf_hair != oldData.gltf_hair) {
        CONTEXT_AF.el.setAttribute('circles-user-local', 'gltf_hair', CONTEXT_AF.data.gltf_hair);
      }
      if (CONTEXT_AF.data.gltf_head != oldData.gltf_head) {
        CONTEXT_AF.el.setAttribute('circles-user-local', 'gltf_head', CONTEXT_AF.data.gltf_head);

      }
      if (CONTEXT_AF.data.gltf_body != oldData.gltf_body) {
        CONTEXT_AF.el.setAttribute('circles-user-local', 'gltf_body', CONTEXT_AF.data.gltf_body);

      }

      // Swap around networked hair/body/head colour
      if (CONTEXT_AF.data.color_hair != oldData.color_hair) {
        CONTEXT_AF.el.setAttribute('circles-user-local', 'color_hair', CONTEXT_AF.data.color_hair);

      }
      if (CONTEXT_AF.data.color_head != oldData.color_head) {
        CONTEXT_AF.el.setAttribute('circles-user-local', 'color_head', CONTEXT_AF.data.color_head);

      }
      if (CONTEXT_AF.data.color_body != oldData.color_body) {
        CONTEXT_AF.el.setAttribute('circles-user-local', 'color_body', CONTEXT_AF.data.color_body);

      }
    }

    // Temporary fix for ensuring we can see through double sided
    //  Going to rework this by hiding the local head, but might be hard due to the way mirrors work
    CIRCLES.getAvatarRigElement().querySelector('.avatar').setAttribute('camera', {near: 0.06}); 

      // Have to ensure NAF is setup before we run it otherwise there is no point, the update will run again anyways
    const currClient = CIRCLES.getAvatarRigElement().getAttribute('networked').networkId;
    const localWorld = CIRCLES.getAvatarElement().components["circles-user-networked"]?.data?.userWorld;

    Object.values(NAF.entities.entities).forEach(e => {
      if (e.id === 'Player1') return;
      const avatar = e.querySelector('.avatar');

      // Other things can be networked so we have to make sure it has an avatar
      if (!avatar) return;
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






    CIRCLES.getCirclesSceneElement().emit(CIRCLES.EVENTS.AVATAR_COSTUME_CHANGED, CONTEXT_AF.el, true);
  },
});
