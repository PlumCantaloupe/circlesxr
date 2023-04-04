'use strict';

AFRAME.registerComponent('circles-costume', {
    schema: {   
        body_type:      {type: 'string',    default: '', oneOf: ['head', 'hair', 'body']},
        color:          {type: 'string',    default: ''},   //needs to be in rgb(255,255,255) format
        model:          {type: 'asset',     default: ''},
        label_text:     {type: 'string',    default: ''},
        label_visible:  {type: 'boolean',   default: true},
        persist:        {type: 'boolean',   default: false}  //this will only work for models that are part of the Circles' constants i.e. entering an index instead of URL for asset 
    },
    init: function() {
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;

        //create costume object component for portal
        CONTEXT_AF.costumeElem = document.createElement('a-entity');
        CONTEXT_AF.costumeElem.classList.add('costume');
        CONTEXT_AF.costumeElem.setAttribute('circles-interactive-object', {type:'scale', neutral_scale:1.1, hover_scale:1.15, click_scale:1.15});
        CONTEXT_AF.el.appendChild(CONTEXT_AF.costumeElem);

        //create text component for title
        CONTEXT_AF.labelElem = document.createElement('a-entity');
        CONTEXT_AF.labelElem.setAttribute('visible', false);
        CONTEXT_AF.labelElem.setAttribute('circles-label', {text:data.label_text, offset:{x:0, y:1, z:0}, arrow_position:'down'});
        CONTEXT_AF.el.appendChild(CONTEXT_AF.labelElem);

        CONTEXT_AF.costumeElem.addEventListener('click', (e) => {
          CONTEXT_AF.applyChanges(); 
        });

        //set params we will edit and pass later in the portal component
        if (!window.newURLSearchParams) {
          window.newURLSearchParams = new URLSearchParams((window.location.search) ? window.location.search : '');
        }
    },
    update: function(oldData)  {
      const CONTEXT_AF  = this;
      const data = CONTEXT_AF.data;
  
      if (Object.keys(CONTEXT_AF.data).length === 0) { return; } // No need to update. as nothing here yet

      if ( (oldData.body_type !== data.body_type) && (data.body_type !== '') ) {
        if (!((data.body_type !== 'head') || (data.body_type !== 'hair') || (data.body_type !== 'body'))) {
          console.warn('no appropriate body part chosen for costume.');
        }
      }

      if ( (oldData.color !== data.color) && (data.color !== '') ) {
        CONTEXT_AF.costumeElem.setAttribute("circles-color", {color:data.color});

        if (data.persist) {
          window.newURLSearchParams.set(data.body_type + '_col', data.color);
        }
      }

      if ( (oldData.model !== data.model) && (data.model !== '') ) {

        let modelEnum = null;
        let modelIndex = data.body_type + '_' + data.model;
        if (data.body_type === 'head') {
          modelEnum = CIRCLES.MODEL_HEAD_TYPE;
        }
        else if (data.body_type === 'hair') {
          modelEnum = CIRCLES.MODEL_HAIR_TYPE;
        }
        else if (data.body_type === 'body') {
          modelEnum = CIRCLES.MODEL_BODY_TYPE;
        }

          if (modelEnum[modelIndex]) {
            CONTEXT_AF.costumeElem.setAttribute("gltf-model", modelEnum[modelIndex]);

            //can only persist if a built-in model i.e. set using index
            if (data.persist) {
              window.newURLSearchParams.set(data.body_type, data.model);
            }
          }
          else {
            CONTEXT_AF.costumeElem.setAttribute("gltf-model", ((typeof data.model === 'string' || data.model instanceof String) ? data.model : data.model.getAttribute('src') ));
          }
      }

      if ( (oldData.label_text !== data.label_text) && (data.label_text !== '') ) {
        CONTEXT_AF.labelElem.setAttribute('circles-label', {text:data.label_text});
      }

      if ( (oldData.label_visible !== data.label_visible) && (data.label_visible !== '') ) {
        CONTEXT_AF.labelElem.setAttribute('visible', data.label_visible);
      }
    },
    applyChanges: function(){
      const CONTEXT_AF = this;
      const data = CONTEXT_AF.data;

      if (!((data.body_type !== 'head') || (data.body_type !== 'hair') || (data.body_type !== 'body'))) {
        console.warn('no appropriate body part chosen for costume.');
        return;
      }

      const avatar        = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
      const avatarNode    = avatar.querySelector('.user_' + data.body_type);
      let modelEnum = null;
        let modelIndex = data.body_type + '_' + data.model;
        if (data.body_type === 'head') {
          modelEnum = CIRCLES.MODEL_HEAD_TYPE;
        }
        else if (data.body_type === 'hair') {
          modelEnum = CIRCLES.MODEL_HAIR_TYPE;
        }
        else if (data.body_type === 'body') {
          modelEnum = CIRCLES.MODEL_BODY_TYPE;
        }

      if (data.model) {
        if (modelEnum[modelIndex]) {
          avatarNode.setAttribute("gltf-model", modelEnum[modelIndex]);

          //only works with built in models for now
          //will check for window.newURLSearchParams in circles-portal.js
          if (data.persist) {
            //need to set url search params somehow ....
            if (window.newURLSearchParams.has(data.body_type)) {
              window.newURLSearchParams.set(data.body_type, data.model);
            }
            else {
              window.newURLSearchParams.append(data.body_type, data.model);
            }
          }
        }
        else {
          const modelPath = ((typeof data.model === 'string' || data.model instanceof String) ? data.model : data.model.getAttribute('src') );
          avatarNode.setAttribute("gltf-model", modelPath);
        }
      }

      if (data.color !== '') {
        avatarNode.setAttribute("circles-color", {color:data.color});

        if (data.persist) {
          //need to set url search params somehow ....
          if (window.newURLSearchParams.has(data.body_type + '_col')) {
            window.newURLSearchParams.set(data.body_type + '_col', data.color);
          }
          else {
            window.newURLSearchParams.append(data.body_type + '_col', data.color);
          }
        }
      }
    },
});