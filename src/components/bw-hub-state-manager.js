'use strict';

AFRAME.registerComponent('bw-hub-state-manager', {
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
      if(recentlyVisitedRoom != null)
        Context_AF[BRAINWAVES.LS_RECENT_ROOM] = recentlyVisitedRoom;
      if(isTeleportPadTransparent != null)
        Context_AF[BRAINWAVES.LS_TELEPORT_PAD] = Boolean(isTeleportPadTransparent);
      if(isGuidingTextOn != null)
        Context_AF[BRAINWAVES.LS_GUIDING_TEXT] = Boolean(isGuidingTextOn);

      //set the recently visited room to the current room the user is in
      localStorage.setItem(BRAINWAVES.LS_RECENT_ROOM, currWorld);
    },

    //function for other components to access properties from this one
    getData: function (propertyName) {
      const Context_AF = this;
      return Context_AF[propertyName];
    },

    //function for other components to set property values for this one
    setData: function (propertyName, value) {
      const Context_AF = this;
      Context_AF[propertyName] = value;
      localStorage.setItem(BRAINWAVES.LS_RECENT_ROOM, currWorld);
    }
});
