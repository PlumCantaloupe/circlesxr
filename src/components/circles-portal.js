'use strict';

AFRAME.registerComponent('circles-portal', {
  schema: {
    img_src:      {type: 'asset', default:CIRCLES.CONSTANTS.DEFAULT_ENV_MAP},
    title_text:   {type: 'string', default:''},
    link_url:     {type: 'string', default:''}
  },
  init: function () {
    const CONTEXT_AF = this;
    const data = CONTEXT_AF.data;
    
    //create sphere component for portal
    CONTEXT_AF.portalElem = document.createElement('a-entity');
    CONTEXT_AF.portalElem.classList.add('portal');
    CONTEXT_AF.portalElem.setAttribute('geometry', {primitive:'sphere', radius:0.5, segmentsWidth:10, segmentsHeight:10});
    CONTEXT_AF.portalElem.setAttribute('material', {shader:'flat'});
    CONTEXT_AF.portalElem.setAttribute('circles-interactive-object', {neutral_scale:1.1, hover_scale:1.15, click_scale:1.15});
    CONTEXT_AF.el.appendChild(CONTEXT_AF.portalElem);

    //create text component for title
    CONTEXT_AF.titleElem = document.createElement('a-entity');
    CONTEXT_AF.titleElem.classList.add('title');
    CONTEXT_AF.titleElem.setAttribute('position', {x:0, y:1, z:0});
    CONTEXT_AF.titleElem.setAttribute('rotation', {x:0, y:90, z:0});
    CONTEXT_AF.titleElem.setAttribute('text', {value:data.title_text, align:'center', width:5.0});
    CONTEXT_AF.el.appendChild(CONTEXT_AF.titleElem);

    //where do we go when this ortal is clicked
    CONTEXT_AF.portalElem.addEventListener('click', (e) => {
      //goto url (but make sure we pass along the url params for group, avatar data etc.)
      //note that if a queryString is already defined in 'link_url' we will pass along the existing url params
      const urlArr = data.link_url.split('?');
      const baseUrl = ((urlArr.length > 0) ? urlArr[0] : '');

      //make sure we add all urlParams together from provided link and existing url bar
      const queryString = ((window.location.search) ? window.location.search + '&' : '?') + ((urlArr.length > 1) ? urlArr[1] : window.location.search);

      //we want to know if we have visited a world already during this session ...
      const urlParams = new URLSearchParams(queryString);
      if (!urlParams.has('visited')) {
        urlParams.append('visited', '1');
      }

      const completeURL = baseUrl + '?' + urlParams.toString();
      window.location.href = completeURL;
    });
  },
  update: function (oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.img_src !== data.img_src) && (data.img_src !== '') ) {
      let filePath = data.img_src;

      console.log(data.img_src);

      // if (data.img_src.charAt(0) === '#') {
        filePath = data.img_src.getAttribute('src');
      // }

      CONTEXT_AF.portalElem.setAttribute('material', {src:filePath});
    }

    if ( (oldData.title_text !== data.title_text) && (data.title_text !== '') ) {
      if (CONTEXT_AF.titleElem) {
        CONTEXT_AF.titleElem.setAttribute('text', {value:data.title_text});
      }
    }
  }
});