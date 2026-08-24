'use strict';


AFRAME.registerComponent('circles-user-local', {
  schema: {
    gltf_head: { type: 'asset', default: '' },
    gltf_hair: { type: 'asset', default: '' },
    gltf_body: { type: 'asset', default: '' },
    color_head: { type: 'string', default: '' },
    color_hair: { type: 'string', default: '' },
    color_body: { type: 'string', default: '' },

    headVisibility: { type: 'boolean', default: true },
    hairVisibility: { type: 'boolean', default: true },
    bodyVisibility: { type: 'boolean', default: true },
    userVisibility: { type: 'string', default: 'visible', oneOf: ['visible', 'hidden', 'wireframe', 'shade', 'ghost'] },
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function () {

  },

  // A way to reapply mesh on gltf model switch
  applyCurrentVisibility: function (avatarNode) {
    const CONTEXT_AF = this;
    switch (CONTEXT_AF.data.userVisibility) {
      case 'ghost':
        avatarNode.components['circles-shader'].enable();
        break;
      case 'wireframe':
        avatarNode.setAttribute('circles-color', { wireframe: true, color: CONTEXT_AF.data.color_head, alpha: 1 });
        break;
      case 'shade':
        avatarNode.setAttribute('circles-matte-black', 'active', true);
        break;
      case 'hidden':
        avatarNode.setAttribute('visible', 'false');
        break;
      // 'visible' needs nothing — that's the default state of a freshly loaded gltf
    }
  },


  update: function (oldData) {
    const CONTEXT_AF = this;

    if (Object.keys(CONTEXT_AF.data).length === 0) { return; } // No need to update. as nothing here yet

    //head model change
    if ((oldData.gltf_head !== CONTEXT_AF.data.gltf_head) && (CONTEXT_AF.data.gltf_head !== '')) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_head');
      avatarNode.setAttribute('gltf-model', CONTEXT_AF.data.gltf_head);
      avatarNode.addEventListener('model-loaded', function reapply() {
        CONTEXT_AF.applyCurrentVisibility(avatarNode);
      }, { once: true });

    }

    //hair model change
    if ((oldData.gltf_hair !== CONTEXT_AF.data.gltf_hair) && (CONTEXT_AF.data.gltf_hair !== '')) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_hair');
      avatarNode.setAttribute('gltf-model', CONTEXT_AF.data.gltf_hair);

      avatarNode.addEventListener('model-loaded', function reapply() {
        CONTEXT_AF.applyCurrentVisibility(avatarNode);
      }, { once: true });
    }

    //body model change
    if ((oldData.gltf_body !== CONTEXT_AF.data.gltf_body) && (CONTEXT_AF.data.gltf_body !== '')) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_body');
      avatarNode.setAttribute('gltf-model', CONTEXT_AF.data.gltf_body);

      avatarNode.addEventListener('model-loaded', function reapply() {
        CONTEXT_AF.applyCurrentVisibility(avatarNode);
      }, { once: true });
    }

    //head color change
    if (oldData.color_head !== CONTEXT_AF.data.color_head) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_head');
      avatarNode.setAttribute('circles-color', { color: CONTEXT_AF.data.color_head });
    }

    //hair color change
    if (oldData.color_hair !== CONTEXT_AF.data.color_hair) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_hair');
      avatarNode.setAttribute('circles-color', { color: CONTEXT_AF.data.color_hair });
    }

    //body color change
    if (oldData.color_body !== CONTEXT_AF.data.color_body) {
      let avatarNode = CONTEXT_AF.el.querySelector('.user_body');
      avatarNode.setAttribute('circles-color', { color: CONTEXT_AF.data.color_body });
    }

    //visiblename change
    if (oldData.visiblename !== CONTEXT_AF.data.visiblename) {
      //get/set nametag nodes
      let avatarNode1 = CONTEXT_AF.el.querySelector('.nametag_front');
      let avatarNode2 = CONTEXT_AF.el.querySelector('.nametag_back');
      avatarNode1.setAttribute('text', { value: CONTEXT_AF.data.visiblename });
      avatarNode2.setAttribute('text', { value: CONTEXT_AF.data.visiblename });
    }

    // Ensure components have been initialized to something before messing with them
    if (CONTEXT_AF.data.color_head != '' && CONTEXT_AF.data.color_hair != '' && CONTEXT_AF.data.color_body != '') {
      CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-color', { color: CONTEXT_AF.data.color_head, alpha: 1 });
      CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-color', { color: CONTEXT_AF.data.color_hair, alpha: 1 });
      CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-color', { color: CONTEXT_AF.data.color_body, alpha: 1 });
    }


    // Enable individually body part visibility
    if ((oldData.headVisibility !== CONTEXT_AF.data.headVisibility) && (CONTEXT_AF.data.headVisibility !== '')) {
      CONTEXT_AF.el.querySelector('.user_head').setAttribute('visible', String(CONTEXT_AF.data.headVisibility));
    }
    if ((oldData.bodyVisibility !== CONTEXT_AF.data.bodyVisibility) && (CONTEXT_AF.data.bodyVisibility !== '')) {
      CONTEXT_AF.el.querySelector('.user_body').setAttribute('visible', String(CONTEXT_AF.data.bodyVisibility));
    }
    if ((oldData.hairVisibility !== CONTEXT_AF.data.hairVisibility) && (CONTEXT_AF.data.hairVisibility !== '')) {
      CONTEXT_AF.el.querySelector('.user_hair').setAttribute('visible', String(CONTEXT_AF.data.hairVisibility));
    }


    // Player total avatar visibility
    if (oldData.userVisibility !== CONTEXT_AF.data.userVisibility && CONTEXT_AF.data.userVisibility != '') {


      // Any true shader switches have to be done here first, because we need to revert them to the original mesh before
      //  messing with anything else
      if (oldData.userVisibility === 'ghost') {
        CONTEXT_AF.el.querySelector('.user_body').components['circles-shader'].disable();
        CONTEXT_AF.el.querySelector('.user_head').components['circles-shader'].disable();
        CONTEXT_AF.el.querySelector('.user_hair').components['circles-shader'].disable();
      }
      if (oldData.userVisibility === 'shade') {
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-matte-black', 'active', false);
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-matte-black', 'active', false);
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-matte-black', 'active', false);
      }
      if (oldData.userVisibility == 'wireframe'){
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-color', { wireframe: false });
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-color', { wireframe: false });
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-color', { wireframe: false });
      }

      if (CONTEXT_AF.data.userVisibility === 'visible' && oldData.userVisibility === 'wireframe') {
        CONTEXT_AF.el.querySelector('.user_head').setAttribute('circles-color', { wireframe: false });
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-color', { wireframe: false });
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-color', { wireframe: false });

      } else if (CONTEXT_AF.data.userVisibility === 'visible' && oldData.userVisibility === 'shade') {
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
        CONTEXT_AF.el.querySelector('.user_hair').setAttribute('circles-color', { wireframe: true, color: CONTEXT_AF.data.color_hair, alpha: 1 });
        CONTEXT_AF.el.querySelector('.user_body').setAttribute('circles-color', { wireframe: true, color: CONTEXT_AF.data.color_body, alpha: 1 });
        //console.log('wires framed');
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

      } else if (CONTEXT_AF.data.userVisibility === 'ghost') {

        CONTEXT_AF.el.querySelector('.user_body').components['circles-shader'].enable();
        CONTEXT_AF.el.querySelector('.user_head').components['circles-shader'].enable();
        CONTEXT_AF.el.querySelector('.user_hair').components['circles-shader'].enable();
      }
    }
  },










});

