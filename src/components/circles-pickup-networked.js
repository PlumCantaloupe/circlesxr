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
      CONTEXT_AF.setupNetworking();
    }
    else {
      const wsReadyFunc = function() {
        CONTEXT_AF.createEventFunctions();  //will only do this once at beginning of program
        CONTEXT_AF.setupNetworking();
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
      //don't want to touch the networked component if a clone
      if (CONTEXT_AF.isClone === false) {
        if (data.networkedEnabled === true && CONTEXT_AF.listenersAttached === false) {
          if (CIRCLES.isCirclesWebsocketReady() && CONTEXT_AF.listenersAttached === false) {
            CONTEXT_AF.addEventListeners();
          }
          CONTEXT_AF.el.setAttribute('networked', {template:'#' + data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true}); //broken in NAF - persistent:true});
          CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED);
        }
        else {
          if (CIRCLES.isCirclesWebsocketReady() && CONTEXT_AF.listenersAttached === true) {
            CONTEXT_AF.removeEventListeners();
          }
          CONTEXT_AF.el.removeAttribute('networked');
          CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED);
        }
      }
    }
  },
  remove : function() {
    // if (this.isClone === false) {
    //   this.letOthersKnowsYouAreLeaving(this.el.id, this.origId, CIRCLES.getCirclesGroupName(), CIRCLES.getCirclesWorldName());
    // }
    // else {
    if (this.isClone === true) {
      const origElem = document.querySelector('#' + this.origId);
      
      //show original if owner leaves
      if (origElem.components['circles-pickup-networked'].isShowing === false) {
        document.querySelector('#' + this.origId).components['circles-pickup-networked'].showThisElement(true);
      }
    }

    if (CIRCLES.isCirclesWebsocketReady()) {
      this.removeEventListeners();
    }
  },
  // letOthersKnowsYouAreLeaving: function(id, origId, room, world) {
  //   if (this.isOwner === true && CIRCLES.isCirclesWebsocketReady()) {
  //     this.socket.emit(CIRCLES.EVENTS.OBJECT_OWNER_GONE, { id:this.el.id, origId:this.origId, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName() });
  //   }
  // },
  setupNetworking : function () {
    const CONTEXT_AF  = this;
    //const thisElem    = CONTEXT_AF.el;
    //const data        = CONTEXT_AF.data;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    if (CONTEXT_AF.listenersAttached === false) {
      CONTEXT_AF.addEventListeners();
    }

    //question for twin object state
    if (CONTEXT_AF.data.networkedEnabled === true) {
      //lete everyone know you exist!!! <3 <3 <3

      //CONTEXT_AF.triggerNetworkSync();
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
  showThisElement: function (isShowing) {
    this.isShowing = isShowing;
    this.el.setAttribute('circles-pickup-networked', {networkedEnabled:isShowing});
    this.el.setAttribute('circles-interactive-visible', isShowing);

    if (this.el.components['circles-artefact']) {
      this.el.components['circles-artefact'].removeLabelEventListener();
      if (isShowing) {
        this.el.components['circles-artefact'].addLabelEventListener();
      }
    }
  },
  createEventFunctions: function() {
    const CONTEXT_AF  = this;
    const thisElem    = CONTEXT_AF.el;
    const data        = CONTEXT_AF.data;
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
    CONTEXT_AF.answerObjectStateFunc    = null;
    CONTEXT_AF.questionObjectStateFunc  = null;
    CONTEXT_AF.objectOwnerGoneFunc      = null;

    //hacky crap
    CONTEXT_AF.hackySyncDropPositionFunc  = null;

    CONTEXT_AF.pickupObjFunc = function(e) {
      console.log('pickupObjFunc');

      if (CONTEXT_AF.data.networkedEnabled === true) {
        CONTEXT_AF.takeNetworkOwnership(thisElem);

        if (e.detail.sendNetworkEvent === true) {
          CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, { id:thisElem.id, origId:CONTEXT_AF.origId, 
                                                                      room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName() });

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
      }
    };

    CONTEXT_AF.releaseObjFunc = function(e) {
      console.log('releaseObjFunc');

      if (CONTEXT_AF.data.networkedEnabled === true) {
        if (e.detail.sendNetworkEvent === true) {
          CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, {  id:thisElem.id,
                                                                        origId:CONTEXT_AF.origId, 
                                                                        room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName() }); 
                                                                        //position:thisPos, rotation:thisRot, scale:thisSca });
        
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
      }
    };

    CONTEXT_AF.ownerGainedFunc  = function(e) {
      // if (CONTEXT_AF.data.networkedEnabled === true) {
        //console.log("object ownership gained");
      // }
    };

    CONTEXT_AF.ownerLostFunc = function(e) {
      console.log('ownerLostFunc');

      if (CONTEXT_AF.data.networkedEnabled === true) {
        //console.log("object ownership lost");
        //release artefact
        thisElem.components['circles-pickup-object'].release(false);
      }
    };

    CONTEXT_AF.pickupObjFunc_Sync = function(data) {
      console.log('pickupObjFunc_Sync');


      if (CONTEXT_AF.data.networkedEnabled === true) {
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
      }
    };

    CONTEXT_AF.releaseObjFunc_Sync = function(data) {
      console.log('releaseObjFunc_Sync');

      if (CONTEXT_AF.data.networkedEnabled === true) {
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
      }
    };

    CONTEXT_AF.answerObjectStateFunc = function(data) {
      console.log('answerObjectStateFunc');

      if (CONTEXT_AF.data.networkedEnabled === true) {
        const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
        if (isSameWorld) {

          //make sure label click works on networked elements (if artefact)
          const labelEl = document.querySelector('#' + CONTEXT_AF.origId + '_label');
          if (labelEl && CONTEXT_AF.isClone) {
            labelEl.querySelector('.label_bg').addEventListener('click', function(e) {
              if (CONTEXT_AF.data.networkedEnabled === true) {
                CONTEXT_AF.takeNetworkOwnership(thisElem);
                thisElem.components['circles-pickup-object'].pickup(true, thisElem.components['circles-pickup-object']);
              }
            });
          }

          if (CONTEXT_AF.isClone === false) {
            //get list of the "same" objects, and remove the one that is duplicate ...
            const allNetworkObjects = document.querySelectorAll('[circles-object-world]');
            let numSimilarNetObjs = 0;
            allNetworkObjects.forEach(function(netObj) {
              if (netObj.components['circles-object-world'].data.id === CONTEXT_AF.el.id) {
                numSimilarNetObjs++;
              }
            });

            //if more than one, hide this one ...
            if (numSimilarNetObjs > 1 && CONTEXT_AF.isClone === false) {
              CONTEXT_AF.showThisElement(false);
            }
            else if (numSimilarNetObjs === 1) {
              //this is the element that is hosting this object across the network
              CONTEXT_AF.isClone = false;

              //hacky send as the network dupes don't copy this over for some reason ...
              CONTEXT_AF.socket.emit('hacky_drop_position', { id:thisElem.id, origId:CONTEXT_AF.origId, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName(), 
                                                              dropRotation:{  x:CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation.x,
                                                                              y:CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation.y,
                                                                              z:CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation.z
                                                                          }});
            }
          }
        }
      }
    };

    CONTEXT_AF.questionObjectStateFunc = function(data) {
      console.log('questionObjectStateFunc', data.origId, CONTEXT_AF.origId);
      if (CONTEXT_AF.data.networkedEnabled === true && CONTEXT_AF.isClone === false) {
        const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
        const isSameElem  = (data.origId === CONTEXT_AF.origId);
        if (isSameWorld && isSameElem) {
          CONTEXT_AF.socket.emit(CIRCLES.EVENTS.ANSWER_OBJECT_STATE, {id:thisElem.id, origId:CONTEXT_AF.origId, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName(), state:'n/a'});
        }
      }
    };

    CONTEXT_AF.objectOwnerGoneFunc = function(data) {
      console.log('objectOwnerGoneFunc');
      if (CONTEXT_AF.data.networkedEnabled === true && CONTEXT_AF.isClone === false) {
        const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
        const isSameElem  = (data.origId === CONTEXT_AF.origId);
        if (isSameWorld && isSameElem) {
          //restart init sync process
          CONTEXT_AF.triggerNetworkSync();
        }
      }
    };

    CONTEXT_AF.hackySyncDropPositionFunc = function(data) {
      console.log('hackySyncDropPositionFunc');
      if (CONTEXT_AF.data.networkedEnabled === true && CONTEXT_AF.isClone === true) {
        const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
        const isSameElem  = (data.origId === CONTEXT_AF.origId);
        if (isSameWorld && isSameElem) {
          //console.log('setting for ', data.origId, CONTEXT_AF.el.components['circles-pickup-object'].data.dropRotation, data.dropRotation);
          CONTEXT_AF.el.setAttribute('circles-pickup-object', {dropRotation:data.dropRotation});
        }
      }
    };
  }, 
  addEventListeners: function() {
    const CONTEXT_AF  = this;
    CONTEXT_AF.listenersAttached = true;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    console.log('addEventListeners')

    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, CONTEXT_AF.pickupObjFunc);
    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, CONTEXT_AF.releaseObjFunc);

    CONTEXT_AF.el.addEventListener('ownership-gained', CONTEXT_AF.ownerGainedFunc);
    CONTEXT_AF.el.addEventListener('ownership-lost', CONTEXT_AF.ownerLostFunc);

    CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, CONTEXT_AF.pickupObjFunc_Sync);
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, CONTEXT_AF.releaseObjFunc_Sync);

    // CONTEXT_AF.socket.on(CIRCLES.EVENTS.ANSWER_OBJECT_STATE, CONTEXT_AF.answerObjectStateFunc);
    // CONTEXT_AF.socket.on(CIRCLES.EVENTS.QUESTION_OBJECT_STATE, CONTEXT_AF.questionObjectStateFunc);
    // CONTEXT_AF.socket.on(CIRCLES.EVENTS.OBJECT_OWNER_GONE, CONTEXT_AF.objectOwnerGoneFunc);

    CONTEXT_AF.socket.on('hacky_drop_position', CONTEXT_AF.hackySyncDropPositionFunc);
  },
  removeEventListeners: function() {
    const CONTEXT_AF  = this;
    CONTEXT_AF.listenersAttached = false;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    console.log('removeEventListeners')

    CONTEXT_AF.el.removeEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, CONTEXT_AF.pickupObjFunc);
    CONTEXT_AF.el.removeEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, CONTEXT_AF.releaseObjFunc);

    CONTEXT_AF.el.removeEventListener('ownership-gained', CONTEXT_AF.ownerGainedFunc);
    CONTEXT_AF.el.removeEventListener('ownership-lost', CONTEXT_AF.ownerLostFunc);

    CONTEXT_AF.socket.off(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, CONTEXT_AF.pickupObjFunc_Sync);
    CONTEXT_AF.socket.off(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, CONTEXT_AF.releaseObjFunc_Sync);

    // CONTEXT_AF.socket.off(CIRCLES.EVENTS.ANSWER_OBJECT_STATE, CONTEXT_AF.answerObjectStateFunc);
    // CONTEXT_AF.socket.off(CIRCLES.EVENTS.QUESTION_OBJECT_STATE, CONTEXT_AF.questionObjectStateFunc);
    // CONTEXT_AF.socket.off(CIRCLES.EVENTS.OBJECT_OWNER_GONE, CONTEXT_AF.objectOwnerGoneFunc);

    CONTEXT_AF.socket.off('hacky_drop_position', CONTEXT_AF.hackySyncDropPositionFunc);
  },
  triggerNetworkSync: function() {
    const CONTEXT_AF = this;

    //don't need clone to ask. Only want original objects asking
    if (CONTEXT_AF.isClone === true) {
      //reset all entities
      CONTEXT_AF.el.setAttribute('circles-pickup-networked', {networkedEnabled:false});
      CONTEXT_AF.el.setAttribute('circles-pickup-networked', {networkedEnabled:true});

      setTimeout(function() {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.QUESTION_OBJECT_STATE, {id:CONTEXT_AF.el.id, origId:CONTEXT_AF.origId, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
      }, THREE.MathUtils.randInt(0,2000));
    }
    
  }
});