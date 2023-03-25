//for when we want an object in the scene that is not duplicated on other clients and can be interacted with by other players
//it works:
// - by making the object networked when "picked up"
// - hiding the local object when another object is networked
// - transferring ownership when other players interact with it
// - removing networking component when "released"
// - showing local object again

'use strict';

AFRAME.registerComponent('circles-pickup-networked', {
  schema: {
    className:        {type: "string",  default:''},    //We will randomly generate one if need be. The class we will use to synch with the networked 
    networkedEnabled: {type:'boolean',  default:false},
    networkedTemplate:{type:'string',   default:CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT}
  },
  init: function() {
    const CONTEXT_AF          = this;
    const data                = CONTEXT_AF.data;

    //if class is '', generate random ...
  },
  update : function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( (oldData.className !== data.className) && (data.className !== '') ) {
      //autogenerate
    }

    if ( (oldData.networkedEnabled !== data.networkedEnabled) && (data.networkedEnabled !== '') ) {
      if (data.networkedEnabled === true) {
        CONTEXT_AF.el.setAttribute('networked', {template:'#' + data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true});
        CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED);
      }
      else {
        CONTEXT_AF.el.removeAttribute('networked');
        CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED);
      }
    }

    if ( (oldData.networkedTemplate !== data.networkedTemplate) && (data.networkedTemplate !== '') ) {
      if (data.networkedEnabled === true && (CONTEXT_AF.el.getAttribute('networked').template !== '#' + data.networkedTemplate)) {
        CONTEXT_AF.el.removeAttribute('networked');
        CONTEXT_AF.el.setAttribute('networked', {template:'#' + data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true});
      }
    }
  },
  remove : function() {
    //this.el.removeEventListener('click', this.clickFunc);
  },
  pickup : function(passedContext) {
    const CONTEXT_AF = (passedContext) ? passedContext : this;
    const data          = CONTEXT_AF.data;

    //turn on networking
    CONTEXT_AF.el.setAttribute('circles-artefact', {networkedEnabled:true, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});
  },
  release : function(passedContext) {
    const CONTEXT_AF = (passedContext) ? passedContext : this;
    const data = CONTEXT_AF.data;

    //turn off
    CONTEXT_AF.el.setAttribute('circles-artefact', {networkedEnabled:false, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});
  },
  setupNetworking : function () {
    const CONTEXT_AF = (passedContext) ? passedContext : this;
    const data          = CONTEXT_AF.data;

    artefact.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, function() {
      console.log('sending - CIRCLES.EVENTS.SYNC_ARTEFACT_PICKUP');
      //take over networked membership
      if (artefact.hasAttribute('networked') === true) {
        NAF.utils.getNetworkedEntity(artefact).then((el) => {
          console.log("is this mine?");
          if (!NAF.utils.isMine(el)) {
            console.log("No but ... ");
            NAF.utils.takeOwnership(el);
            console.log("it is mine now");
          } 
          else {
            console.log("Yes, it is mine already");
          }
        });
      }
      CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_ARTEFACT_PICKUP, {artefactID:artefact.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    });

    artefact.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, function() {
      console.log('sending - CIRCLES.EVENTS.RELEASE_THIS_OBJECT');
      CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_ARTEFACT_RELEASE, {artefactID:artefact.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    });

    //NAF events for when someone else takes/loses control of an object
    const ownership_gained_func = (e) => {
      console.log("artefact ownership gained");
      
    };

    const ownership_lost_func = (e) => {
      console.log("artefact ownership lost");
      
    };

    artefact.addEventListener(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, function (event) {
        artefact.addEventListener('ownership-gained', ownership_gained_func);
        artefact.addEventListener('ownership-lost', ownership_lost_func);
        //NAF.utils.getNetworkedEntity(CONTEXT_AF.el).then((el) => {
        //el.addEventListener('ownership-changed', ownership_changed_Func);
        //});
    });

    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED, function (event) {
      artefact.removeEventListener('ownership-gained', ownership_gained_func);
      artefact.removeEventListener('ownership-lost', ownership_lost_func);
    });

    // artefact.addEventListener(CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, function() {
    //   console.log('receiving - CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED');
    //   //CONTEXT_AF.socket.emit(CONTEXT_AF.campfireEventName, {campfireOn:CONTEXT_AF.fireOn , room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    // });

    // artefact.addEventListener(CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, function() {
    //   console.log('receiving - CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST');
    //   //CONTEXT_AF.socket.emit(CONTEXT_AF.campfireEventName, {campfireOn:CONTEXT_AF.fireOn , room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    // });
  // });

  CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_ARTEFACT_PICKUP, function(data) {
    console.log('receiving - CIRCLES.EVENTS.SYNC_ARTEFACT_PICKUP for ' + data.artefactID);
    //hide this artefact
    if (data.world === CIRCLES.getCirclesWorldName()) {
      document.querySelector('#' + data.artefactID).setAttribute('circles-interactive-visible', false);
      document.querySelector('#' + data.artefactID + '_label').setAttribute('circles-interactive-visible', false);
      document.querySelector('#' + data.artefactID + '_description').setAttribute('circles-interactive-visible', true);
    }
  });

  CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_ARTEFACT_RELEASE, function(data) {
    console.log('receiving - CIRCLES.EVENTS.RELEASE_THIS_OBJECT for ' + data.artefactID);
    //show this artefact
    if (data.world === CIRCLES.getCirclesWorldName()) {
      document.querySelector('#' + data.artefactID).setAttribute('circles-interactive-visible', true);
      document.querySelector('#' + data.artefactID + '_label').setAttribute('circles-interactive-visible', true);
      document.querySelector('#' + data.artefactID + '_description').setAttribute('circles-interactive-visible', false);
    }
  });

  //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
  setTimeout(function() {
      CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
  }, THREE.MathUtils.randInt(0,1200));

  //if someone else requests our sync data, we send it.
  CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
    //if the same world as the one requesting
    if (data.world === CIRCLES.getCirclesWorldName()) {
      CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {campfireON:CONTEXT_AF.fireOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }
  });

  //receiving sync data from others (assuming all others is the same for now)
  CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
      //make sure we are receiving data for this world
      if (data.world === CIRCLES.getCirclesWorldName()) {
          
      }
  });
  }
});