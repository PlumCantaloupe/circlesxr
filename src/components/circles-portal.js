'use strict';

AFRAME.registerComponent('circles-portal', {
  schema: {
    img_src:              {type:'asset', default:CIRCLES.CONSTANTS.DEFAULT_ENV_MAP},
    title_text:           {type:'string', default:''},
    link_url:             {type:'string', default:''},
    useDefaultModel:      {type:'boolean', default:true}
  },
  init: function () {
    const CONTEXT_AF = this;
    const data = CONTEXT_AF.data;

    CONTEXT_AF.portalElem = document.createElement('a-entity');
    CONTEXT_AF.portalElem.classList.add('portal');
    CONTEXT_AF.el.appendChild(CONTEXT_AF.portalElem);

    //create text component for title
    CONTEXT_AF.titleElem = document.createElement('a-entity');
    CONTEXT_AF.titleElem.classList.add('title');
    CONTEXT_AF.titleElem.setAttribute('position', {x:0, y:1, z:0});
    CONTEXT_AF.titleElem.setAttribute('rotation', {x:0, y:90, z:0});
    CONTEXT_AF.titleElem.setAttribute('text', {value:data.title_text, align:'center', width:5.0});
    CONTEXT_AF.el.appendChild(CONTEXT_AF.titleElem);

    //where do we go when this portal is clicked
    CONTEXT_AF.portalElem.addEventListener('click', (e) => {
      //goto url (but make sure we pass along the url params for group, avatar data etc.)
      //note that if a queryString is already defined in 'link_url' we will pass along the existing url params
      const urlArr = data.link_url.split('?');
      const baseUrl = ((urlArr.length > 0) ? urlArr[0] : '');

      //make sure we add all urlParams together from provided link and existing url bar
      const queryString = ((window.location.search) ? window.location.search + '&' : '?') + ((urlArr.length > 1) ? urlArr[1] : window.location.search);

      //we want to know the last world they visisted (could be useful for some world logic :)
      const params_orig = new URLSearchParams(window.location.search);
      const params_new  = new URLSearchParams(((urlArr.length > 1) ? urlArr[1] : ''));
      for (let [key, val] of params_new.entries()) {
        if (!params_new.has(key)) {
          params_orig.append(key, val);
        }
        else {
          params_orig.set(key, val);
        }
      }

      //check for window.newURLSearchParams. If so we have to combine these new params with existing ones
      if (window.newURLSearchParams) {
        for (let [key, val] of window.newURLSearchParams.entries()) {
          if (!window.newURLSearchParams.has(key)) {
            params_orig.append(key, val);
          }
          else {
            params_orig.set(key, val);
          }
        }
      }

      //add last_route
      if (!params_orig.has('last_route')) {
        params_orig.append('last_route', window.location.pathname);
      }
      else {
        params_orig.set('last_route', window.location.pathname);
      }

      if (!params_orig.has('dressed')) {
        if (window.location.pathname.match(/wardrobe/i)) {
          params_orig.append('dressed', 'true');
        }
      }

      const completeURL = baseUrl + '?' + params_orig.toString();
      window.location.href = completeURL;
    });
  },
  update: function (oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.img_src !== data.img_src) && (data.img_src !== '') ) {
      CONTEXT_AF.setImg(data.img_src);
    }

    if ( (oldData.title_text !== data.title_text) && (data.title_text !== '') ) {
      if (CONTEXT_AF.titleElem) {
        CONTEXT_AF.titleElem.setAttribute('text', {value:data.title_text});
      }
    }

    if ( (oldData.useDefaultModel !== data.useDefaultModel) && (data.useDefaultModel !== '') ) {
      CONTEXT_AF.setDefaultModel(data.useDefaultModel);
    }
  },
  setDefaultModel : function(useDefaultModel) {
    const CONTEXT_AF = this;
    const data = CONTEXT_AF.data;
    
    if (useDefaultModel) {
      //create sphere component for portal
      CONTEXT_AF.portalElem.setAttribute('geometry', {primitive:'sphere', radius:0.5, segmentsWidth:10, segmentsHeight:10});
      CONTEXT_AF.portalElem.setAttribute('material', {shader:'flat'});
      CONTEXT_AF.setImg(data.img_src);
      CONTEXT_AF.portalElem.setAttribute('circles-interactive-object', {type:'outline', neutral_scale:1.1, hover_scale:1.15, click_scale:1.15});
    }
    else {
      CONTEXT_AF.portalElem.setAttribute('circles-interactive-object', {type:'none'});
      CONTEXT_AF.portalElem.removeAttribute('geometry');
      CONTEXT_AF.portalElem.removeAttribute('material');
    }
  },
  setImg : function(imgSrc) {
    const CONTEXT_AF = this;

    if (imgSrc) {
      let filePath = ((typeof imgSrc === 'string' || imgSrc instanceof String) ? imgSrc : imgSrc.getAttribute('src'));

      CONTEXT_AF.portalElem.setAttribute('material', {src:filePath});
    }
    else {
      console.log('[circles-portal]: invalid circles-portal "img_src" value')
    }
  }
});