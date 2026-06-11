'use strict';

AFRAME.registerComponent('circles-costume-change', {
    schema: {   
        body_type:      {type: 'string',    default: '', oneOf: ['head', 'hair', 'body']},
        color:          {type: 'string',    default: ''},   //needs to be in rgb(255,255,255) format
        model:          {type: 'asset',     default: ''},
        label_text:     {type: 'string',    default: ''},
        label_visible:  {type: 'boolean',   default: true}
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

      const avatarNode        = CIRCLES.getAvatarElement();
      const modelType         = 'gltf_' + data.body_type;
      const colorType         = 'color_'+ data.body_type;
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
          avatarNode.setAttribute('circles-user-networked', modelType, modelEnum[modelIndex]);

        }
        else {
          const modelPath = ((typeof data.model === 'string' || data.model instanceof String) ? data.model : data.model.getAttribute('src') );
          avatarNode.setAttribute('circles-user-networked', modelType, modelPath);
        }
      }

      if (data.color !== '') {
        avatarNode.setAttribute("circles-user-networked", colorType, data.color);
      }
    },
});