//for when we want an object in the scene that is not duplicated on other clients and can be interacted with by other players

'use strict';

AFRAME.registerComponent('circles-networked-basic', {
  schema: {
    className:          {type:'string',   default:''},    //We will randomly generate one if need be. The class we will use to synch with the networked version
    visibleOtherWorlds: {type:'boolean',  default:false},
    networkedEnabled:   {type:'boolean',  default:true},
    networkedTemplate:  {type:'string',   default:CIRCLES.NETWORKED_TEMPLATES.BASIC_OBJECT}
  },
  init: function() {
    const CONTEXT_AF      = this;
    const data            = CONTEXT_AF.data;
    CONTEXT_AF.socket     = null;
    CONTEXT_AF.isShowing  = true;
    CONTEXT_AF.listenersAttached = false;

    //we will track this so that if a hosting client disappears we can set new data here to synch new hosting client
    CONTEXT_AF.lastKnowObjectData = null;

    //CONTEXT_AF.el.setAttribute('circles-interactive-visible', false);   //hide on init, then show later

    let regex = /(naf)/i;
    CONTEXT_AF.isClone  = regex.test(CONTEXT_AF.el.id); //if false, this entity is the sole networked object of all duplicates

    if (CIRCLES.isCirclesWebsocketReady()) {
      CONTEXT_AF.createEventFunctions();    //will only do this once at beginning of program
    }
    else {
      const wsReadyFunc = function() {
        CONTEXT_AF.createEventFunctions();  //will only do this once at beginning of program
        CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
      };
      CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
    }

    //this is so we can keep track of which world this object is from so we can share objects, but turning that off for now to reduce duplicate object complexity.
    if (CONTEXT_AF.isClone === false) {
      CONTEXT_AF.el.setAttribute('circles-object-world', {});
    }
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
        CONTEXT_AF.el.setAttribute('circles-networked-basic', {className:randomClassName});
      }
    }

    if ( (oldData.networkedEnabled !== data.networkedEnabled) && (data.networkedEnabled !== '') ) {
      CONTEXT_AF.enableNetworking(data.networkedEnabled, !CONTEXT_AF.isClone);
    }

    if ( (oldData.visibleOtherWorlds !== data.visibleOtherWorlds) && (data.visibleOtherWorlds !== '') ) {}
  },
  remove : function() {
    if(CIRCLES.isCirclesWebsocketReady() === true) {
      //let everyone know (maybe helpful in future)
      CIRCLES.getCirclesWebsocket().emit(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED, this.getNetworkDataObject());
    }

    if (CIRCLES.isCirclesWebsocketReady()) {
      this.removeEventListeners();
    }
  },
  createEventFunctions: function() {
    const CONTEXT_AF  = this;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    //NAf events
    CONTEXT_AF.ownerGainedFunc  = null;
    CONTEXT_AF.ownerLostFunc    = null;

    //circles networking events
    CONTEXT_AF.networkAttachedFunc      = null;
    CONTEXT_AF.networkDetachedFunc      = null;

    CONTEXT_AF.ownerGainedFunc  = function(e) {
      //console.log('ownerGainedFunc', CONTEXT_AF.el.id);
    };

    CONTEXT_AF.ownerLostFunc = function(e) {
      //console.log('ownerLostFunc', CONTEXT_AF.el.id);
    };

    CONTEXT_AF.captureNewHostingObjectData = function(elem) {
      //console.log('captureNewHostingObjectData', elem);
      if (elem) {
        CONTEXT_AF.lastKnowObjectData = { position:           {x:elem.object3D.position.x, y:elem.object3D.position.y, z:elem.object3D.position.z},
                                          rotation:           {x:elem.object3D.rotation.x, y:elem.object3D.rotation.y, z:elem.object3D.rotation.z},
                                          scale:              {x:elem.object3D.scale.x, y:elem.object3D.scale.y, z:elem.object3D.scale.z},
                                          circlesObjectWorld: elem.getAttribute('circles-object-world')
                                        };
      }
    }

    CONTEXT_AF.networkAttachedFunc = function(data) {
      //console.log('networkAttachedFunc', CONTEXT_AF.el.id);

      const isSameWorld = (data.origWorld === CIRCLES.getCirclesWorldName());
      const isSameElem  = (data.origId === CONTEXT_AF.el.components['circles-object-world'].data.id);
      if (isSameWorld && isSameElem) {
        if (CONTEXT_AF.isClone === true) {
          //make sure label click works on networked elements (if artefact)
          const labelEl = document.querySelector('#' + CONTEXT_AF.el.components['circles-object-world'].data.id + '_label');
          if (labelEl) {
            labelEl.querySelector('.label_bg').addEventListener('click', CONTEXT_AF.clickLabelFunc);
          }
        }
      }
    };

    CONTEXT_AF.networkDetachedFunc = function(data) {
      //console.log('networkDetachedFunc', CONTEXT_AF.el.id);

      // const isSameWorld = (data.origWorld === CIRCLES.getCirclesWorldName());
      // const isSameElem  = (data.origId === CONTEXT_AF.el.components['circles-object-world'].data.id);
      // if (isSameWorld && isSameElem) {
      //   CONTEXT_AF.initSyncObjects();
      // }
    };

    //need this be always listening so that "hidden" objects can come back
    if (CONTEXT_AF.isClone === false) {
      document.body.addEventListener('clientConnected', function(e) {
        //console.log('NAF clientConnected', e.detail.clientId);
      });
  
      document.body.addEventListener('clientDisconnected', function(e) {
        //console.log('NAF clientDisconnected', e.detail.clientId);
      });
  
      document.body.addEventListener('entityCreated', function(e) {
        //console.log('NAF entityCreated', e.detail.el);

        if (!e.detail.el.components['circles-object-world']) {
          return;
        }

        if (e.detail.el.components['circles-object-world'].data.id === CONTEXT_AF.el.components['circles-object-world'].data.id) {
          CONTEXT_AF.initSyncObjects();
        }
      });
  
      document.body.addEventListener('entityRemoved', function(e) {
        //console.log('NAF entityRemoved', e.detail.networkId);
        CONTEXT_AF.initSyncObjects();
      });
    }

    //if object from a different world we don't want to see this (if component option set)
    const isSameWorld = (CONTEXT_AF.el.components['circles-object-world'].data.world === CIRCLES.getCirclesWorldName());
    if (isSameWorld === false && CONTEXT_AF.data.visibleOtherWorlds === false) {
      CONTEXT_AF.showThisElement(false, false);
    }
  }, 
  addEventListeners: function() {
    //console.log('addEventListeners');

    const CONTEXT_AF  = this;
    CONTEXT_AF.listenersAttached = true;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    CONTEXT_AF.el.addEventListener('ownership-gained', CONTEXT_AF.ownerGainedFunc);
    CONTEXT_AF.el.addEventListener('ownership-lost', CONTEXT_AF.ownerLostFunc);

    CONTEXT_AF.socket.on(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, CONTEXT_AF.networkAttachedFunc);
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED, CONTEXT_AF.networkDetachedFunc);
  },
  removeEventListeners: function() {
    //console.log('removeEventListeners');

    const CONTEXT_AF  = this;
    CONTEXT_AF.listenersAttached = false;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    CONTEXT_AF.el.removeEventListener('ownership-gained', CONTEXT_AF.ownerGainedFunc);
    CONTEXT_AF.el.removeEventListener('ownership-lost', CONTEXT_AF.ownerLostFunc);

    CONTEXT_AF.socket.off(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, CONTEXT_AF.networkAttachedFunc);
    CONTEXT_AF.socket.off(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED, CONTEXT_AF.networkDetachedFunc);
  },
  getNetworkDataObject: function() {
    const networkId_ = (this.el.hasAttribute('networked')) ? this.el.components['networked'].data.networkId : '';
    return {id:this.el.id, origId:this.el.components['circles-object-world'].data.id, networkId:networkId_, room:CIRCLES.getCirclesGroupName(), origWorld:this.el.components['circles-object-world'].data.world, world:CIRCLES.getCirclesWorldName()};
  },
  initSyncObjects: function() {
    //console.log('initSyncObjects');

    const CONTEXT_AF = this;

    //if there already exists "the same element" then hide this and turn off networking (if this is not a clone)
    //get list of the "same" objects, and remove the one that is duplicate ...
    let numSimilarNetObjs = 0;
    let oldestTime = Number.MAX_SAFE_INTEGER;
    let currAgeMS = 0;
    let oldestElem = null;
    let isSameWorld = false;
    let isSameElem  = false;
    const allNetworkObjects = document.querySelectorAll('[circles-networked-basic]');

    //console.log(allNetworkObjects);

    allNetworkObjects.forEach(function(netObj) {
      isSameWorld = (netObj.components['circles-object-world'].data.world === CIRCLES.getCirclesWorldName());
      isSameElem  = (netObj.components['circles-object-world'].data.id === CONTEXT_AF.el.components['circles-object-world'].data.id);

      if (isSameWorld && isSameElem) {
        currAgeMS = netObj.components['circles-object-world'].data.timeCreated; 
        if (currAgeMS < oldestTime) {
          oldestTime = currAgeMS;
          oldestElem = netObj;
        }    

        // if (netObj.components['circles-object-world'].data.id === CONTEXT_AF.el.components['circles-object-world'].data.id && netObj.components['circles-networked-basic'].isShowing === true) {
          //console.log(CONTEXT_AF.el.id, CONTEXT_AF.el.components['circles-object-world'].data.id, netObj.id, netObj.components['circles-object-world'].data.id, netObj.components['circles-networked-basic'].isShowing);
          numSimilarNetObjs++;
        // }
      }
    });

    if (oldestElem) {
      //if 0 elements that means that a remote owner disappeared and we must bring the other one to fruition
      if (oldestElem.id === CONTEXT_AF.el.id) {
        console.log('I am the original', CONTEXT_AF.el.id, oldestTime);
        //am owner
        if (CONTEXT_AF.isShowing === false) {
          //you are now the host/owner of this networked object
          CONTEXT_AF.showThisElement(true, true);

          if (CONTEXT_AF.lastKnowObjectData) {
            //determine last state and set this new one to a similar one
            if (CONTEXT_AF.lastKnowObjectData.circlesObjectWorld.pickedup === true) {
              //this isn't the pickup component
            }
            else {
              //set world coordinates
              CONTEXT_AF.el.object3D.position.set(CONTEXT_AF.lastKnowObjectData.position.x, CONTEXT_AF.lastKnowObjectData.position.y, CONTEXT_AF.lastKnowObjectData.position.z);
              CONTEXT_AF.el.object3D.rotation.set(CONTEXT_AF.lastKnowObjectData.rotation.x, CONTEXT_AF.lastKnowObjectData.rotation.y, CONTEXT_AF.lastKnowObjectData.rotation.z);
              CONTEXT_AF.el.object3D.scale.set(CONTEXT_AF.lastKnowObjectData.scale.x, CONTEXT_AF.lastKnowObjectData.scale.y, CONTEXT_AF.lastKnowObjectData.scale.z);
            }
          }
        }
      }
      //if more than one, hide this one, if it is the oldest ...
      else {
        if (CONTEXT_AF.isShowing === true) {
          CONTEXT_AF.showThisElement(false, true);
        }
      }
    }
  },
  enableNetworking: function(enable, alertNetwork) {
    //console.log('enableNetworking', this.el.id, enable, alertNetwork);

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
      //console.log('networkReadyFunc');
      if (enable === true) {
        if (alertNetwork === true) {
          CIRCLES.getCirclesWebsocket().emit(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, CONTEXT_AF.getNetworkDataObject() );
        }
        if (CONTEXT_AF.listenersAttached === false) {
          CONTEXT_AF.addEventListeners();
        }
      }
      else {
        if (alertNetwork === true) {
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
    //console.log('showThisElement', this.el.id, isShowing, alertNetwork);
    
    this.isShowing = isShowing;

    this.enableNetworking(isShowing, alertNetwork);
    // this.el.setAttribute('circles-networked-basic', {networkedEnabled:isShowing});
    this.el.setAttribute('circles-interactive-visible', isShowing);

    if (this.el.components['circles-artefact']) {
      this.el.components['circles-artefact'].removeLabelEventListener();
      if (isShowing) {
        this.el.components['circles-artefact'].addLabelEventListener();
      }
    }
  }
});