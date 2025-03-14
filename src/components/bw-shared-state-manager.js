'use strict';

AFRAME.registerComponent('bw-shared-state-manager', {
    schema: {
      currWorld: {type: 'string'}
    },

    init: function () {    
      const Context_AF = this;

      //get the shared states from localStorage
      const recentlyVisitedRoom = localStorage.getItem(BRAINWAVES.LS_RECENT_ROOM);
      const isTeleportPadTransparent = localStorage.getItem(BRAINWAVES.LS_TELEPORT_PAD);
      const isGuidingTextOn = localStorage.getItem(BRAINWAVES.LS_GUIDING_TEXT);

      

      //store the shared states from localStorage in the component if not null
      //if the sates are null then set them to the default values
      //setting the recently visited room
      if(recentlyVisitedRoom != null)
        Context_AF[BRAINWAVES.LS_RECENT_ROOM] = recentlyVisitedRoom;
      else
        Context_AF[BRAINWAVES.LS_RECENT_ROOM] = Context_AF.data.currWorld;
      
      //setting the teleport pad opacity config
      if(isTeleportPadTransparent != null) 
        Context_AF[BRAINWAVES.LS_TELEPORT_PAD] = isTeleportPadTransparent === 'true' ? true : false;
      else {
        Context_AF[BRAINWAVES.LS_TELEPORT_PAD] = BRAINWAVES.DEFAULT_TELEPORT_PAD;
        localStorage.setItem(BRAINWAVES.LS_TELEPORT_PAD, BRAINWAVES.DEFAULT_TELEPORT_PAD);
      }

      //setting the guiding text config
      if(isGuidingTextOn != null)
        Context_AF[BRAINWAVES.LS_GUIDING_TEXT] = isGuidingTextOn === 'true' ? true : false;
      else {
        Context_AF[BRAINWAVES.LS_GUIDING_TEXT] = BRAINWAVES.DEFAULT_GUIDING_TEXT;
        localStorage.setItem(BRAINWAVES.LS_GUIDING_TEXT, BRAINWAVES.DEFAULT_GUIDING_TEXT);
      }

      //set the recently visited room to the current room the user is in
      localStorage.setItem(BRAINWAVES.LS_RECENT_ROOM, Context_AF.data.currWorld);


      //create teleport pad component (will need to be moved to individual game managers probs)
      Context_AF.el.setAttribute('bw-teleport-pad-manager', {isTransparent: Context_AF[BRAINWAVES.LS_TELEPORT_PAD], colour: '#5764c2'});
    },

    //function for other components to access properties from this one
    getData: function (propertyName) {
      const Context_AF = this;
      console.log(Context_AF);
      return Context_AF[propertyName];
    },

    //function for other components to set property values for this one
    setData: function (propertyName, value) {
      const Context_AF = this;
      console.log(Context_AF);
      Context_AF[propertyName] = value;
      localStorage.setItem(propertyName, value);
    }
});
