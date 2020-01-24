'use strict';

import { NativeBuffer } from "mongoose";

AFRAME.registerComponent('circles-user-networked', {
  //dependencies: ['networked'],
  schema: {
    // ... Define schema to pass properties from DOM to this component
    gltf_head:                  {type: 'asset',     default: ''},
    gltf_hair:                  {type: 'asset',     default: ''},
    gltf_body:                  {type: 'asset',     default: ''},

    original_gltf_head:         {type: 'asset',     default: ''},
    original_gltf_hair:         {type: 'asset',     default: ''},
    original_gltf_body:         {type: 'asset',     default: ''},

    color_head:                 {type: 'string',    default: ''}, 
    color_hair:                 {type: 'string',    default: ''},
    color_body:                 {type: 'string',    default: ''},
    
    original_color_head:        {type: 'string',    default: ''}, 
    original_color_hair:        {type: 'string',    default: ''},
    original_color_body:        {type: 'string',    default: ''},      

    username:                   {type: 'string',    default: ''},
    networked_data:             {type: 'string',    default: ''},
    costume:                    {type: 'array',    default: ['', '', '']},
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    const Context_AF      = this;
    Context_AF.isPlayer1  = false;

    Context_AF.el.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function(e) {
      const playerOneNode       = document.querySelector('#player1');
      const playerOneAvatarNode = playerOneNode.querySelector('.avatar');
      const thisNode            = Context_AF.el;
      const eventNode           = e.detail.element;

      //lets only move forward to event node is the same as this one
      if ( thisNode.isSameNode(eventNode) === true ) {
        Context_AF.isPlayer1 = thisNode.isSameNode(playerOneAvatarNode); //now make sure this is the player1 node

        if (Context_AF.isPlayer1 === true) {
          //we can assume that node wants to load itself. We are doing this to minimize race-conditions overwriting each by doing so in user-template
          Context_AF.el.setAttribute('circles-user-networked', {
            gltf_head:              playerOneNode.getAttribute('circles-head-model'),
            gltf_hair:              playerOneNode.getAttribute('circles-hair-model'),
            gltf_body:              playerOneNode.getAttribute('circles-body-model'),
            original_gltf_head:     playerOneNode.getAttribute('circles-head-model'),        
            original_gltf_hair:     playerOneNode.getAttribute('circles-hair-model'),  
            original_gltf_body:     playerOneNode.getAttribute('circles-body-model'),    
            color_head:             playerOneNode.getAttribute('circles-head-color'),
            color_hair:             playerOneNode.getAttribute('circles-hair-color'),
            color_body:             playerOneNode.getAttribute('circles-body-color'),
            original_color_head:    playerOneNode.getAttribute('circles-head-color'),       
            original_color_hair:    playerOneNode.getAttribute('circles-hair-color'), 
            original_color_body:    playerOneNode.getAttribute('circles-body-color'),  
            username:               playerOneNode.getAttribute('circles-username')
          });

          //set device icon here too ... I guess :/
          let avatarNode3 = Context_AF.el.querySelector('.deviceicon_front');
          let avatarNode4 = Context_AF.el.querySelector('.deviceicon_back');
          let iconPath    = CIRCLES.CONSTANTS.ICON_DEVICE_UNKNOWN;

          if (AFRAME.utils.device.isMobile()) {
            iconPath = CIRCLES.CONSTANTS.ICON_DEVICE_MOBILE;
          }
          else if (AFRAME.utils.device.isMobileVR()) {
            iconPath = CIRCLES.CONSTANTS.ICON_DEVICE_HMD3DOF;
          }
          else if (AFRAME.utils.device.isTablet()) {
            iconPath = CIRCLES.CONSTANTS.ICON_DEVICE_MOBILE;
          }
          else {
            //desktop and desktop HMD
            if (AFRAME.utils.device.checkHeadsetConnected()) {
              iconPath = CIRCLES.CONSTANTS.ICON_DEVICE_HMD6DOF;
            }
            else {
              iconPath = CIRCLES.CONSTANTS.ICON_DEVICE_DESKTOP;
            }
          }

          //set icon textures
          avatarNode3.setAttribute('material', {src: iconPath});
          avatarNode4.setAttribute('material', {src: iconPath});
        }
      }
    });

    // this.addUser();
  },
  update: function(oldData)  {
    let Context_AF  = this;

    if (Object.keys(Context_AF.data).length === 0) { return; } // No need to update. as nothing here yet

    //head model change
    if ( (oldData.gltf_head !== Context_AF.data.gltf_head) && (Context_AF.data.gltf_head !== '') ) {
      let avatarNode = Context_AF.el.querySelector('.user_head');
      avatarNode.setAttribute('gltf-model', Context_AF.data.gltf_head);
    }

    //hair model change
    if ( (oldData.gltf_hair !== Context_AF.data.gltf_hair) && (Context_AF.data.gltf_hair !== '') ) {
      let avatarNode = Context_AF.el.querySelector('.user_hair');
      avatarNode.setAttribute('gltf-model', Context_AF.data.gltf_hair);
    }

    //body model change
    if ( (oldData.gltf_body !== Context_AF.data.gltf_body) && (Context_AF.data.gltf_body !== '') ) {
      let avatarNode = Context_AF.el.querySelector('.user_body');
      avatarNode.setAttribute('gltf-model', Context_AF.data.gltf_body);
    }

    //head color change
    if ( oldData.color_head !== Context_AF.data.color_head ) {
      let avatarNode = Context_AF.el.querySelector('.user_head');
      avatarNode.setAttribute('circles-color', {color: Context_AF.data.color_head});
    }

    //hair color change
    if ( oldData.color_hair !== Context_AF.data.color_hair ) {
      let avatarNode = Context_AF.el.querySelector('.user_hair');
      avatarNode.setAttribute('circles-color', {color: Context_AF.data.color_hair});
    }

    //body color change
    if ( oldData.color_body !== Context_AF.data.color_body ) {
      let avatarNode = Context_AF.el.querySelector('.user_body');
      avatarNode.setAttribute('circles-color', {color: Context_AF.data.color_body});
      avatarNode.emit(CIRCLES.EVENTS.AVATAR_COSTUME_CHANGED, Context_AF.el, true);
    }

    //username change
    if ( oldData.username !== Context_AF.data.username ) {
      //get/set nametag nodes
      let avatarNode1 = Context_AF.el.querySelector('.nametag_front');
      let avatarNode2 = Context_AF.el.querySelector('.nametag_back');
      avatarNode1.setAttribute('text', {value: Context_AF.data.username});
      avatarNode2.setAttribute('text', {value: Context_AF.data.username});
    }
  },
  // tick: function(time, timeDelta) {},
  // tock: function(time, timeDelta) {},
  // remove: function() {},
  // pause: function() {},
  // play: function() {},
  // updateScheme: function(data) {}
});
