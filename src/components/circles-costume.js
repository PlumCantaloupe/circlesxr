'use strict';

AFRAME.registerComponent('circles-costume', {
    schema: {   
        body_type:  {type: 'string',    default: '', oneOf: ['head', 'hair', 'body']},
        color:      {type: 'string',    default: ''},   //needs to be in rgb(255,255,255) format
        model:      {type: 'asset',     default: ''},
        label_text: {type: 'string',    default: ''},
        persist:    {type: 'boolean',   default: false}  //this will only work for models that are part of the Circles' constants i.e. entering an index instead of URL for asset 
    },
    init: function() {
        const CONTEXT_AF = this;
        const data = CONTEXT_AF.data;

        //create costume object component for portal
        CONTEXT_AF.costumeElem = document.createElement('a-entity');
        CONTEXT_AF.costumeElem.classList.add('costume');
        CONTEXT_AF.costumeElem.setAttribute('circles-interactive-object', {neutral_scale:1.1, hover_scale:1.15, click_scale:1.15});
        CONTEXT_AF.el.appendChild(CONTEXT_AF.costumeElem);

        //create text component for title
        CONTEXT_AF.labelElem = document.createElement('a-entity');
        CONTEXT_AF.labelElem.setAttribute('circles-object-label', {label_text:data.label_text, label_visible:true, label_offset:{x:0, y:1, z:0}, arrow_position:'down'});
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
          if (CIRCLES.MODEL_HEAD_TYPE[data.model]) {
            CONTEXT_AF.costumeElem.setAttribute("gltf-model", CIRCLES.MODEL_HEAD_TYPE[data.model]);
          }
          else {
            console.log(data.model);
            CONTEXT_AF.costumeElem.setAttribute("gltf-model", ((typeof data.model === 'string' || data.model instanceof String) ? data.model : data.model.getAttribute('src') ));
          }
      }

      if ( (oldData.label_text !== data.label_text) && (data.label_text !== '') ) {
        CONTEXT_AF.labelElem.setAttribute('circles-object-label', {label_text:data.label_text});
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

      if (data.model) {
        if (CIRCLES.MODEL_HEAD_TYPE[data.model]) {
          const modelPath = CIRCLES.MODEL_HEAD_TYPE[data.model];
          avatarNode.setAttribute("gltf-model", modelPath);
        }
        else {
          const modelPath = ((typeof data.model === 'string' || data.model instanceof String) ? data.model : data.model.getAttribute('src') );
          avatarNode.setAttribute("gltf-model", modelPath);
        }
      }

      if (data.color !== '') {
        avatarNode.setAttribute("circles-color", {color:data.color});
      }

      if (data.persist) {
        //need to set url search params somehow ....
      }
    },
});