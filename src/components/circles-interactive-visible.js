'use strict';

//raycasters still click on interactive elements with "visible:false" entities so we will control that here manually
//see here: https://github.com/aframevr/aframe/issues/3551
AFRAME.registerComponent('circles-interactive-visible', {
  // dependencies: ['circles-interactive-object'],
  schema: {type:'boolean', default:true},
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    const CONTEXT_AF = this;
    CONTEXT_AF.prepElemsForInteraction();

    //need to catch all elements ...
    CONTEXT_AF.el.addEventListener('object3dset', function(e) {
      CONTEXT_AF.prepElemsForInteraction();
    });
  },
  update: function (oldData) {  
    const CONTEXT_AF    = this;
    const data          = this.data;

    //text changes
    if ((oldData !== data)  && (data !== '')) {
      CONTEXT_AF.makeVisible(data);
    }
  },
  makeVisible: function(isVisible) {
    const CONTEXT_AF = this;
    CONTEXT_AF.el.object3D.visible = isVisible;

    if (isVisible === true) {
      if (CONTEXT_AF.el.classList.contains("interactive_toggle")) {
        CONTEXT_AF.el.classList.add('interactive');
      }
    }
    else {
      if (CONTEXT_AF.el.classList.contains("interactive")) {
        CONTEXT_AF.el.classList.remove("interactive");
      }
    }

    const descendentNodes = CONTEXT_AF.el.querySelectorAll('*');
    descendentNodes.forEach(childNode => {
      //update raycaster objects ...
      if (isVisible === true) {
        if (childNode.classList.contains("interactive_toggle")) {
          childNode.classList.add('interactive');
        }
      }
      else {
        if (childNode.classList.contains("interactive")) {
          childNode.classList.remove("interactive");
        }
      }
    });

    const raycasters = this.el.sceneEl.querySelectorAll('[raycaster]');
    raycasters.forEach(rc => {
      if (rc.components.raycaster.data) {
        rc.components.raycaster.refreshObjects();
      }
    }); 
  },
  prepElemsForInteraction() {
    const CONTEXT_AF = this;

    //need to attach "interactive_toggle" class name so we can identify later ... self
    if (CONTEXT_AF.data === true) {
      if (CONTEXT_AF.el.classList.contains("interactive")) {
        if (!CONTEXT_AF.el.classList.contains("interactive_toggle")) {
          CONTEXT_AF.el.classList.add('interactive_toggle');
        }
      }
    }
    else {
      if (CONTEXT_AF.el.classList.contains("interactive")) {
        CONTEXT_AF.el.classList.remove("interactive");
        if (!CONTEXT_AF.el.classList.contains("interactive_toggle")) {
          CONTEXT_AF.el.classList.add('interactive_toggle');
        }
      }
    }

    //need to attach "interactive_toggle" class name so we can identify later ... childNodes
    const descendentNodes = CONTEXT_AF.el.querySelectorAll('*');
    descendentNodes.forEach(childNode => {
      //update objects ...
      if (CONTEXT_AF.data === true) {
        if (childNode.classList.contains("interactive")) {
          if (!childNode.classList.contains("interactive_toggle")) {
            childNode.classList.add('interactive_toggle');
          }
        }
      }
      else {
        if (childNode.classList.contains("interactive")) {
          childNode.classList.remove("interactive");
          if (!childNode.classList.contains("interactive_toggle")) {
            childNode.classList.add('interactive_toggle');
          }
        }
      }
    });
  }
});
