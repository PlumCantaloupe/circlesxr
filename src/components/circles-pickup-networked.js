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
    className:        {type:'string',   default:''},    //We will randomly generate one if need be. The class we will use to synch with the networked version
    networkedEnabled: {type:'boolean',  default:true},
    networkedTemplate:{type:'string',   default:CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT}
  },
  init: function() {
    const CONTEXT_AF      = this;
    const data            = CONTEXT_AF.data;
    CONTEXT_AF.socket     = null;
    CONTEXT_AF.isShowing  = true;
    CONTEXT_AF.listenersAttached = false;

    let regex = /(naf)/i;
    CONTEXT_AF.isClone  = regex.test(CONTEXT_AF.el.id); //if false, this entity is the sole networked object of all duplicates

    if (CIRCLES.isCirclesWebsocketReady()) {
      CONTEXT_AF.createEventFunctions();    //will only do this once at beginning of program
      // if (CONTEXT_AF.isClone === false) {
      //   CONTEXT_AF.initSyncObjects();
      // }
    }
    else {
      const wsReadyFunc = function() {
        CONTEXT_AF.createEventFunctions();  //will only do this once at beginning of program
        // if (CONTEXT_AF.isClone === false) {
        //   CONTEXT_AF.initSyncObjects();
        // }
        CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
      };
      CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
    }

    //this is so we can keep track of which world this object is from so we can share objects, but turning that off for now to reduce duplicate object complexity.
    if (CONTEXT_AF.isClone === false) {
      CONTEXT_AF.el.setAttribute('circles-object-world', {});
    }

    CONTEXT_AF.origId = CONTEXT_AF.el.components['circles-object-world'].data.id
  },
  update : function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    if ( oldData.className !== data.className ) {
      //autogenerate
      if (data.className === '') {
        const randomClassName = CIRCLES.UTILS.generateRandomString(5);
        CONTEXT_AF.el.classList.add(randomClassName);
        CONTEXT_AF.el.setAttribute('circles-pickup-networked', {className:randomClassName});
      }
    }

    if ( (oldData.networkedEnabled !== data.networkedEnabled) && (data.networkedEnabled !== '') ) {
      console.log('update data.networkedEnabled', CONTEXT_AF.el.id, data.networkedEnabled);
      CONTEXT_AF.enableNetworking(data.networkedEnabled, !CONTEXT_AF.isClone);

      // if (CONTEXT_AF.isClone === true && data.networkedEnabled === true) {
      //   CONTEXT_AF.initSyncObjects();
      // }
    }
  },
  remove : function() {
    if(CIRCLES.isCirclesWebsocketReady() === true) {
      //let everyone know (maybe helpful in future)
      CIRCLES.getCirclesWebsocket().emit(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED, {id:this.el.id, origId:this.origId, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }
      
    // if (this.isClone === true) {
    //   const origElem = document.querySelector('#' + this.origId);
    //   //show original if owner leaves
    //   if (origElem.components['circles-pickup-networked'].isShowing === false) {
    //     document.querySelector('#' + this.origId).components['circles-pickup-networked'].showThisElement(true, false);
    //   }
    // }

    if (CIRCLES.isCirclesWebsocketReady()) {
      this.removeEventListeners();
    }
  },
  takeNetworkOwnership : function(elem) {
    //take over networked membership
    if (elem.hasAttribute('networked') === true) {
      NAF.utils.getNetworkedEntity(elem).then((el) => {
        //console.log("is this mine?");
        if (!NAF.utils.isMine(el)) {
          //console.log("No but ... ");
          NAF.utils.takeOwnership(el);
          //console.log("it is mine now");
        } 
        else {
          //console.log("Yes, it is mine already");
        }
      });
    }
  },
  createEventFunctions: function() {
    const CONTEXT_AF  = this;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    //internal events
    CONTEXT_AF.pickupObjFunc  = null;
    CONTEXT_AF.releaseObjFunc = null;

    //NAf events
    CONTEXT_AF.ownerGainedFunc  = null;
    CONTEXT_AF.ownerLostFunc    = null;

    //circles networking events
    CONTEXT_AF.pickupObjFunc_Sync       = null;
    CONTEXT_AF.releaseObjFunc_Sync      = null;
    CONTEXT_AF.networkAttachedFunc      = null;
    CONTEXT_AF.networkDetachedFunc      = null;

    //click func
    CONTEXT_AF.clickLabelFunc           = null;

    //hacky crap
    CONTEXT_AF.hackySyncDropPositionFunc  = null;

    CONTEXT_AF.pickupObjFunc = function(e) {
      console.log('pickupObjFunc', CONTEXT_AF.el.id);

      CONTEXT_AF.takeNetworkOwnership(CONTEXT_AF.el);

      if (e.detail.sendNetworkEvent === true) {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, CONTEXT_AF.getNetworkDataObject());

        //if artefact ...
        if (CONTEXT_AF.isClone === true) {
          //we don't synch circles-artefact, as messy to synch label/descr creation, so even basic clisk we need to account for
          if (document.querySelector('#' + CONTEXT_AF.origId + '_label')) {
            document.querySelector('#' + CONTEXT_AF.origId + '_label').setAttribute('circles-interactive-visible', false);
          }
          if (document.querySelector('#' + CONTEXT_AF.origId + '_description')) {
            document.querySelector('#' + CONTEXT_AF.origId + '_description').setAttribute('circles-interactive-visible', true);
          }
        }
      }
    };

    CONTEXT_AF.releaseObjFunc = function(e) {
      console.log('releaseObjFunc', CONTEXT_AF.el.id);

      if (e.detail.sendNetworkEvent === true) {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, CONTEXT_AF.getNetworkDataObject());
      
        //if artefact ...
        if (CONTEXT_AF.isClone === true) {
          //we don't synch circles-artefact, as messy to synch label/descr creation, so even basic clisk we need to account for
          if (document.querySelector('#' + CONTEXT_AF.origId + '_label')) {
            document.querySelector('#' + CONTEXT_AF.origId + '_label').setAttribute('circles-interactive-visible', true);
          }
          if (document.querySelector('#' + CONTEXT_AF.origId + '_description')) {
            document.querySelector('#' + CONTEXT_AF.origId + '_description').setAttribute('circles-interactive-visible', false);
          }
        }
      }
    };

    CONTEXT_AF.ownerGainedFunc  = function(e) {
      console.log('ownerGainedFunc', CONTEXT_AF.el.id);
      // if (CONTEXT_AF.data.networkedEnabled === true) {
        //console.log("object ownership gained");
      // }
    };

    CONTEXT_AF.ownerLostFunc = function(e) {
      console.log('ownerLostFunc', CONTEXT_AF.el.id);

        //console.log("object ownership lost");
        //release artefact
      CONTEXT_AF.el.components['circles-pickup-object'].release(false);
    };

    CONTEXT_AF.pickupObjFunc_Sync = function(data) {
      console.log('pickupObjFunc_Sync', CONTEXT_AF.el.id);

        const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
        const isSameElem  = (data.origId === CONTEXT_AF.origId);

        // console.log('receiving - CIRCLES.EVENTS.SYNC_ARTEFACT_PICKUP for ', data.id, data.origId, data.origId, 
        //                                                                     CONTEXT_AF.origId, CONTEXT_AF.origId, data.world, CIRCLES.getCirclesWorldName(), 
        //                                                                     CONTEXT_AF.isClone, isSameWorld, isSameElem);

        if (isSameWorld && isSameElem) {
          //if artefact ...
          if (document.querySelector('#' + data.origId + '_label')) {
            document.querySelector('#' + data.origId + '_label').setAttribute('circles-interactive-visible', false);
          }
          if (document.querySelector('#' + data.origId + '_description')) {
            document.querySelector('#' + data.origId + '_description').setAttribute('circles-interactive-visible', true);
          }
        }
    };

    CONTEXT_AF.releaseObjFunc_Sync = function(data) {
      console.log('releaseObjFunc_Sync', CONTEXT_AF.el.id);

      const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
      const isSameElem  = (data.origId === CONTEXT_AF.origId);

      // console.log('receiving - CIRCLES.EVENTS.RELEASE_THIS_OBJECT for ', data.id, data.origId, data.origId, CONTEXT_AF.origId, CONTEXT_AF.origId, data.world, CIRCLES.getCirclesWorldName(), CONTEXT_AF.isClone, isSameWorld, isSameElem);

      if (isSameWorld && isSameElem) {
        if (document.querySelector('#' + data.origId + '_label')) {
          document.querySelector('#' + data.origId + '_label').setAttribute('circles-interactive-visible', true);
        }
        if (document.querySelector('#' + data.origId + '_description')) {
          document.querySelector('#' + data.origId + '_description').setAttribute('circles-interactive-visible', false);
        }
      }
    };

    CONTEXT_AF.clickLabelFunc = function(e) {
      CONTEXT_AF.takeNetworkOwnership(CONTEXT_AF.el);
      CONTEXT_AF.el.components['circles-pickup-object'].pickup(true, CONTEXT_AF.el.components['circles-pickup-object']);
    };

    CONTEXT_AF.networkAttachedFunc = function(data) {
      console.log('networkAttachedFunc', CONTEXT_AF.el.id);

      const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
      const isSameElem  = (data.origId === CONTEXT_AF.origId);
      if (isSameWorld && isSameElem) {

        //if message from a remote clone, ignore
        // if (data.id !== data.origId) {
        //   console.log(CONTEXT_AF.el.id, data.id, data.origId);
        //   return;
        // }

        if (CONTEXT_AF.isClone === true) {
          //make sure label click works on networked elements (if artefact)
          const labelEl = document.querySelector('#' + CONTEXT_AF.origId + '_label');
          if (labelEl) {
            labelEl.querySelector('.label_bg').addEventListener('click', CONTEXT_AF.clickLabelFunc);
          }
        }
        else {
          //CONTEXT_AF.initSyncObjects();
        }
      }
    };

    CONTEXT_AF.networkDetachedFunc = function(data) {
      console.log('networkDetachedFunc', CONTEXT_AF.el.id);

      const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
      const isSameElem  = (data.origId === CONTEXT_AF.origId);
      if (isSameWorld && isSameElem) {
        //console.log('setting for ', data.origId, CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation, data.dropRotation);
        CONTEXT_AF.initSyncObjects();
      }
    };

    CONTEXT_AF.hackySyncDropPositionFunc = function(data) {
      console.log('hackySyncDropPositionFunc', CONTEXT_AF.el.id);
      if (CONTEXT_AF.isClone === true) {
        const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
        const isSameElem  = (data.origId === CONTEXT_AF.origId);
        if (isSameWorld && isSameElem) {
          //console.log('setting for ', data.origId, CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation, data.dropRotation);
          CONTEXT_AF.el.setAttribute('circles-pickup-object', {dropRotation:data.dropRotation});
        }
      }
    };

    //need this be always listening so that "hidden" objects can come back
    if (CONTEXT_AF.isClone === false) {
      document.body.addEventListener('clientConnected', function(e) {
        console.log('NAF clientConnected', e.detail.clientId);
      });
  
      document.body.addEventListener('clientDisconnected', function(e) {
        console.log('NAF clientDisconnected', e.detail.clientId);
      });
  
      document.body.addEventListener('entityCreated', function(e) {
        console.log('NAF entityCreated', e.detail.el.getAttribute('circles-object-world'));
  
        if (CONTEXT_AF.isClone === false) {
          CONTEXT_AF.initSyncObjects();
        }
      });
  
      document.body.addEventListener('entityRemoved', function(e) {
        console.log('NAF entityRemoved', e.detail.networkId);

        if (CONTEXT_AF.isClone === false) {
          CONTEXT_AF.initSyncObjects();
        }
      });
    }
  }, 
  addEventListeners: function() {
    const CONTEXT_AF  = this;
    CONTEXT_AF.listenersAttached = true;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    console.log('addEventListeners', CONTEXT_AF.el.id);

    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, CONTEXT_AF.pickupObjFunc);
    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, CONTEXT_AF.releaseObjFunc);

    CONTEXT_AF.el.addEventListener('ownership-gained', CONTEXT_AF.ownerGainedFunc);
    CONTEXT_AF.el.addEventListener('ownership-lost', CONTEXT_AF.ownerLostFunc);

    CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, CONTEXT_AF.pickupObjFunc_Sync);
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, CONTEXT_AF.releaseObjFunc_Sync);

    CONTEXT_AF.socket.on(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, CONTEXT_AF.networkAttachedFunc);
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED, CONTEXT_AF.networkDetachedFunc);

    CONTEXT_AF.socket.on('hacky_drop_position', CONTEXT_AF.hackySyncDropPositionFunc);
  },
  removeEventListeners: function() {
    const CONTEXT_AF  = this;
    CONTEXT_AF.listenersAttached = false;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    console.log('removeEventListeners', this.el.id);

    CONTEXT_AF.el.removeEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, CONTEXT_AF.pickupObjFunc);
    CONTEXT_AF.el.removeEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, CONTEXT_AF.releaseObjFunc);

    CONTEXT_AF.el.removeEventListener('ownership-gained', CONTEXT_AF.ownerGainedFunc);
    CONTEXT_AF.el.removeEventListener('ownership-lost', CONTEXT_AF.ownerLostFunc);

    CONTEXT_AF.socket.off(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, CONTEXT_AF.pickupObjFunc_Sync);
    CONTEXT_AF.socket.off(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, CONTEXT_AF.releaseObjFunc_Sync);

    CONTEXT_AF.socket.off(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, CONTEXT_AF.networkAttachedFunc);
    CONTEXT_AF.socket.off(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED, CONTEXT_AF.networkDetachedFunc);

    CONTEXT_AF.socket.off('hacky_drop_position', CONTEXT_AF.hackySyncDropPositionFunc);
  },
  getNetworkDataObject: function() {
    return {id:this.el.id, origId:this.origId, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()};
  },
  initSyncObjects: function() {
    const CONTEXT_AF = this;

    console.log('initSyncObjects', this.el.id);
    //if there already exists "the same element" then hide this and turn off networking (if this is not a clone)
    //get list of the "same" objects, and remove the one that is duplicate ...
    let numSimilarNetObjs = 0;
    let oldestTime = 0;
    let currAgeMS = 0;
    let oldestElem = null;
    let isSameWorld = false;
    let isSameElem  = false;
    const allNetworkObjects = document.querySelectorAll('[circles-pickup-networked]');
    allNetworkObjects.forEach(function(netObj) {
      console.log(CONTEXT_AF.el.id, CONTEXT_AF.origId, netObj.id, netObj.components['circles-object-world'].data.id, netObj.components['circles-pickup-networked'].isShowing);

      isSameWorld = (netObj.components['circles-object-world'].data.world === CIRCLES.getCirclesWorldName());
      isSameElem  = (netObj.components['circles-object-world'].data.id === CONTEXT_AF.origId);

      console.log(isSameWorld, isSameElem);

      if (isSameWorld && isSameElem) {
        currAgeMS = netObj.components['circles-object-world'].data.timeCreated; 
        if (currAgeMS > oldestTime) {
          oldestTime = currAgeMS;
          oldestElem = netObj;
        }    

        if (netObj.components['circles-object-world'].data.id === CONTEXT_AF.origId && netObj.components['circles-pickup-networked'].isShowing === true) {
        //if (netObj.components['circles-object-world'].data.id === CONTEXT_AF.origId) {
          numSimilarNetObjs++;
        }
      }
    });

    //if more than one, hide this one, if it is the oldest ...
    if (oldestElem) {
      console.log(oldestElem, oldestTime, numSimilarNetObjs);

      if (numSimilarNetObjs > 1) {
        if (CONTEXT_AF.isShowing === true && oldestElem.id === CONTEXT_AF.el.id) {
          console.log('HIDE element');
          CONTEXT_AF.showThisElement(false, true);
        }
      }
      else if (numSimilarNetObjs === 0 && oldestElem.id === CONTEXT_AF.el.id) {
        //am owner
        console.log('THIS OWNER, who dat');
        if (CONTEXT_AF.isShowing === false) {
          console.log('OWNER, SHOW element');
          CONTEXT_AF.showThisElement(true, true);
        }
  
        //if the only one send a message to the dupes
        //hacky send as the network dupes don't copy this over for some reason ...
        let netObj = CONTEXT_AF.getNetworkDataObject();
        netObj.dropRotation = { x:CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation.x,
                                y:CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation.y,
                                z:CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation.z
                              };
        CONTEXT_AF.socket.emit('hacky_drop_position', netObj);
      }
    }
    
    // else if (numSimilarNetObjs === 0) {
    //   console.log('ZZZZZZZZZZZZZZZZZ');
    //   if (CONTEXT_AF.isShowing === false) {
    //     console.log('ZZZ, SHOW element');
    //     CONTEXT_AF.showThisElement(true, true);
    //   }
    // }
  },
  enableNetworking: function(enable, alertNetwork) {
    console.log('enableNetworking', this.el.id, enable, alertNetwork);

    const CONTEXT_AF = this;

    //don't want to touch the networked component if a clone
    if (CONTEXT_AF.isClone === false) {
      if (enable === true) {
        if (CONTEXT_AF.listenersAttached === false) {
          CONTEXT_AF.el.setAttribute('networked', {template:'#' + CONTEXT_AF.data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true}); //broken in NAF - persistent:true});
        }
      }
      else {
        CONTEXT_AF.el.removeAttribute('networked');
      }
    }

    //need everyone to send this message
    const networkReadyFunc = function() {
      if (enable === true) {
        if (alertNetwork === true) {
          console.log('sending event');
          CIRCLES.getCirclesWebsocket().emit(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, CONTEXT_AF.getNetworkDataObject() );
        }
        if (CONTEXT_AF.listenersAttached === false) {
          CONTEXT_AF.addEventListeners();
        }
      }
      else {
        if (alertNetwork === true) {
          console.log('sending event');
          CIRCLES.getCirclesWebsocket().emit(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, CONTEXT_AF.getNetworkDataObject() );
        }
        CONTEXT_AF.removeEventListeners();
      }
      CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, networkReadyFunc);
    };

    if (CIRCLES.isCirclesWebsocketReady()) {
      networkReadyFunc();
    }
    else {
      CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, networkReadyFunc);
    }

    CONTEXT_AF.data.networkedEnabled = enable;
  },
  showThisElement: function (isShowing, alertNetwork) {
    console.log('showThisElement', this.el.id, isShowing, alertNetwork);
    
    this.isShowing = isShowing;

    this.enableNetworking(isShowing, alertNetwork);
    // this.el.setAttribute('circles-pickup-networked', {networkedEnabled:isShowing});
    this.el.setAttribute('circles-interactive-visible', isShowing);

    if (this.el.components['circles-artefact']) {
      this.el.components['circles-artefact'].removeLabelEventListener();
      if (isShowing) {
        this.el.components['circles-artefact'].addLabelEventListener();
      }
    }
  },
});