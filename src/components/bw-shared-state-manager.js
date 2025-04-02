'use strict';

AFRAME.registerComponent('bw-shared-state-manager', {
    schema: {
      bloomAvailable: {type: 'boolean', default: false},
      bloomThreshold: { type: 'number', default: 1 },
      bloomStrength: { type: 'number', default: 0.5 },
      bloomRadius: { type: 'number', default: 1 }
    },

    init: function () {    
      const CONTEXT_AF = this;
      CONTEXT_AF.scene = document.querySelector('a-scene');
      CONTEXT_AF.guidingTextContainer = document.querySelector('#guidingTextManager');

      //get the shared states from localStorage
      const recentlyVisitedRoom = localStorage.getItem(BRAINWAVES.LS_RECENT_ROOM);
      const isTeleportPadTransparent = localStorage.getItem(BRAINWAVES.LS_TELEPORT_PAD);
      const isGuidingTextOn = localStorage.getItem(BRAINWAVES.LS_GUIDING_TEXT);
      const isBloomOn = localStorage.getItem(BRAINWAVES.LS_BLOOM);
      const worldName = CIRCLES.getCirclesWorldName();

      //store the shared states from localStorage in the component if not null
      //if the states are null then set them to the default values
      //setting the recently visited room
      if(recentlyVisitedRoom != null)
        CONTEXT_AF[BRAINWAVES.LS_RECENT_ROOM] = recentlyVisitedRoom;
      else
        CONTEXT_AF[BRAINWAVES.LS_RECENT_ROOM] = worldName;
      
      //setting the teleport pad opacity config
      if(isTeleportPadTransparent != null) 
        CONTEXT_AF[BRAINWAVES.LS_TELEPORT_PAD] = isTeleportPadTransparent === 'true' ? true : false;
      else {
        CONTEXT_AF[BRAINWAVES.LS_TELEPORT_PAD] = BRAINWAVES.DEFAULT_TELEPORT_PAD;
        localStorage.setItem(BRAINWAVES.LS_TELEPORT_PAD, BRAINWAVES.DEFAULT_TELEPORT_PAD);
      }

      //setting the guiding text config
      if(isGuidingTextOn != null)
        CONTEXT_AF[BRAINWAVES.LS_GUIDING_TEXT] = isGuidingTextOn === 'true' ? true : false;
      else {
        CONTEXT_AF[BRAINWAVES.LS_GUIDING_TEXT] = BRAINWAVES.DEFAULT_GUIDING_TEXT;
        localStorage.setItem(BRAINWAVES.LS_GUIDING_TEXT, BRAINWAVES.DEFAULT_GUIDING_TEXT);
      }

      //setting the bloom
      if(isBloomOn != null && CONTEXT_AF.data.bloomAvailable)
        CONTEXT_AF[BRAINWAVES.LS_BLOOM] = isBloomOn === 'true' ? true : false;
      else {
        CONTEXT_AF[BRAINWAVES.LS_BLOOM] = BRAINWAVES.DEFAULT_BLOOM;
        localStorage.setItem(BRAINWAVES.LS_BLOOM, BRAINWAVES.DEFAULT_BLOOM);
      }


      //set the recently visited room to the current room the user is in if it's the main hub
      if ( worldName === 'BW_Hub'){
        localStorage.setItem(BRAINWAVES.LS_RECENT_ROOM, worldName);
      }
      //if not the main hub the set the recently visited world after the user leaves the world
      else {
        document.querySelector('#Portal-Hub').addEventListener('click', function(){
          localStorage.setItem(BRAINWAVES.LS_RECENT_ROOM, worldName);
        })
      }

      //update the guiding text component
      if(CONTEXT_AF[BRAINWAVES.LS_GUIDING_TEXT])
        CONTEXT_AF.guidingTextContainer.setAttribute('bw-guiding-text', {enabled: true});

      //create teleport pad component (will need to be moved to individual game managers probs)
      CONTEXT_AF.el.setAttribute('bw-teleport-pad-manager', {isTransparent: CONTEXT_AF[BRAINWAVES.LS_TELEPORT_PAD], colour: '#5764c2'});

      //turn on bloom if the it's turned on in accessibility settings and this world has bloom
      if(CONTEXT_AF[BRAINWAVES.LS_BLOOM] && CONTEXT_AF.data.bloomAvailable){
        CONTEXT_AF.scene.setAttribute('bloom', {threshold: CONTEXT_AF.data.bloomThreshold,  
                                                strength: CONTEXT_AF.data.bloomStrength,
                                                radius: CONTEXT_AF.data.bloomRadius});
      }
    },

    //function for other components to access properties from this one
    getData: function (propertyName) {
      const CONTEXT_AF = this;
      console.log(CONTEXT_AF);
      return CONTEXT_AF[propertyName];
    },

    //function for other components to set property values for this one
    setData: function (propertyName, value) {
      const CONTEXT_AF = this;
      console.log(CONTEXT_AF);
      CONTEXT_AF[propertyName] = value;
      localStorage.setItem(propertyName, value);
    }
});
