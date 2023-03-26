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
    const CONTEXT_AF    = this;
    const data          = CONTEXT_AF.data;
    CONTEXT_AF.socket   = null;

    console.log('circles-pickup-networked init');


    let regex = /(naf)/i;
    CONTEXT_AF.isClone  = regex.test(CONTEXT_AF.el.id);

    console.log(CONTEXT_AF.el.id);
    console.log(CONTEXT_AF.isClone);

    if (CIRCLES.isCirclesWebsocketReady()) {
      console.log('setupNetworking');
      CONTEXT_AF.setupNetworking();
    }
    else {
      const wsReadyFunc = function() {
        CONTEXT_AF.setupNetworking();
        CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        console.log('setupNetworking wsReadyFunc');
      };
      console.log('setupNetworking addEventListener');
      CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
    }

    //this is so we can keep track of which world this object is from so we can share objects, but turning that off for now to reduce duplicate object complexity.
    CONTEXT_AF.el.setAttribute('circles-object-world', {});
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

    // if ( (oldData.networkedTemplate !== data.networkedTemplate) && (data.networkedTemplate !== '') ) {
    //   if (data.networkedEnabled === true && (CONTEXT_AF.el.getAttribute('networked').template !== '#' + data.networkedTemplate)) {
    //     if (CONTEXT_AF.isClone === false) {
    //       CONTEXT_AF.el.removeAttribute('networked');
    //       CONTEXT_AF.el.setAttribute('networked', {template:'#' + data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true});
    //     }
    //   }
    // }

    if ( (oldData.networkedEnabled !== data.networkedEnabled) && (data.networkedEnabled !== '') ) {
      //don't want to touch the networked component if a clone
      if (CONTEXT_AF.isClone === false) {
        if (data.networkedEnabled === true) {
          CONTEXT_AF.el.setAttribute('networked', {template:'#' + data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true, persistent:true});
          CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED);
        }
        else {
          CONTEXT_AF.el.removeAttribute('networked');
          CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED);
        }
      }
    }
  },
  remove : function() {
    //this.el.removeEventListener('click', this.clickFunc);
  },
  setupNetworking : function () {
    const CONTEXT_AF  = this;
    const thisElem    = CONTEXT_AF.el;
    const data        = CONTEXT_AF.data;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    //only add networked component if not a network copy (which already has it)
    // if (CONTEXT_AF.isClone === false) {
    //   CONTEXT_AF.el.setAttribute('networked', {template:'#' + data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true});
    // }

    //when object picked up
    thisElem.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, function() {
      console.log('CIRCLES.EVENTS.PICKUP_THIS_OBJECT');

      CONTEXT_AF.takeNetworkOwnership(thisElem);
      console.log('sending - network object pickup');

      // if (CONTEXT_AF.isClone === false) {
      //CONTEXT_AF.el.setAttribute('networked', {template:'#' + data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true});
      CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, { id:thisElem.id, 
                                                                  origId:thisElem.components['circles-object-world'].data.id, 
                                                                  room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName() });
      // }
    });

    //when object released
    thisElem.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, function() {
      console.log('CIRCLES.EVENTS.RELEASE_THIS_OBJECT');

      // if (CONTEXT_AF.isClone === true) {
      //   console.log('remove clone RELEASE_THIS_OBJECT');
      //   CONTEXT_AF.el.remove();
      //   return;
      // }

      console.log('sending - network object release');
      //CONTEXT_AF.el.removeAttribute('networked');

      const thisPos = {x:CONTEXT_AF.el.object3D.position.x, y:CONTEXT_AF.el.object3D.position.y, z:CONTEXT_AF.el.object3D.position.z};
      const thisRot = {x:CONTEXT_AF.el.object3D.rotation.x, y:CONTEXT_AF.el.object3D.rotation.y, z:CONTEXT_AF.el.object3D.rotation.z};
      const thisSca = {x:CONTEXT_AF.el.object3D.scale.x, y:CONTEXT_AF.el.object3D.scale.y, z:CONTEXT_AF.el.object3D.scale.z};

      CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, {  id:thisElem.id,
                                                                    origId:thisElem.components['circles-object-world'].data.id, 
                                                                    room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName(), 
                                                                    position:thisPos, rotation:thisRot, scale:thisSca });
    });

    //NAF events for when someone else takes/loses control of an object
    thisElem.addEventListener('ownership-gained', function(e) {
      console.log("object ownership gained");
    });

    thisElem.addEventListener('ownership-lost', function(e) {
      console.log("object ownership lost");
      //release artefact
      //thisElem.components['circles-pickup-object'].clickFunc();
    });

    CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, function(data) {
      //console.log('receiving - CIRCLES.EVENTS.SYNC_ARTEFACT_PICKUP', data.id, data.origId, CONTEXT_AF.el.id, CONTEXT_AF.isClone);
      //hide this artefact
      const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
      const isSameElem  = (data.origId === CONTEXT_AF.el.components['circles-object-world'].data.id);

      console.log('receiving - CIRCLES.EVENTS.SYNC_ARTEFACT_PICKUP for ', data.id, data.origId, CONTEXT_AF.el.id, CONTEXT_AF.el.components['circles-object-world'].data.id, CONTEXT_AF.isClone, isSameWorld, isSameElem);
      if (isSameWorld && isSameElem) {
        // if (data.id === data.networkId && data.id === CONTEXT_AF.el) {
        //   CONTEXT_AF.takeNetworkOwnership(CONTEXT_AF.el);
        // }

        //CONTEXT_AF.el.setAttribute('circles-interactive-visible', false);

        //if artefact ...
        if (document.querySelector('#' + data.origId + '_label')) {
          document.querySelector('#' + data.origId + '_label').setAttribute('circles-interactive-visible', false);
        }
        if (document.querySelector('#' + data.origId + '_description')) {
          document.querySelector('#' + data.origId + '_description').setAttribute('circles-interactive-visible', true);
        }
      }
    });

    CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, function(data) {
      //console.log('receiving - CIRCLES.EVENTS.RELEASE_THIS_OBJECT for ', data.id, data.origId, CONTEXT_AF.el.id, CONTEXT_AF.isClone, isSameWorld, isSameElem);
      //show this artefact
      const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
      const isSameElem  = (data.origId === CONTEXT_AF.el.components['circles-object-world'].data.id);

      console.log('receiving - CIRCLES.EVENTS.RELEASE_THIS_OBJECT for ', data.id, data.origId, CONTEXT_AF.el.id, CONTEXT_AF.el.components['circles-object-world'].data.id, CONTEXT_AF.isClone, isSameWorld, isSameElem);

      // if (CONTEXT_AF.isClone === true) {
      //   console.log('remove clone');
      //   CONTEXT_AF.el.remove();
      //   return;
      // }

      if (isSameWorld && isSameElem) {
        //CONTEXT_AF.el.setAttribute('circles-interactive-visible', true);

        //match transforms
        CONTEXT_AF.el.object3D.position.set(data.position.x, data.position.y, data.position.z);
        CONTEXT_AF.el.object3D.rotation.set(data.rotation.x, data.rotation.y, data.rotation.z);
        CONTEXT_AF.el.object3D.scale.set(data.scale.x, data.scale.y, data.scale.z);

        //if artefact ...
        if (document.querySelector('#' + data.origId + '_label')) {
          document.querySelector('#' + data.origId + '_label').setAttribute('circles-interactive-visible', true);
        }

        if (document.querySelector('#' + data.origId + '_description')) {
          document.querySelector('#' + data.origId + '_description').setAttribute('circles-interactive-visible', false);
        }
      }
    });

    //question for twin object state
    setTimeout(function() {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.QUESTION_OBJECT_STATE, {id:thisElem.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }, THREE.MathUtils.randInt(0,1200));

    //answer for twin object state
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.ANSWER_OBJECT_STATE, function(data) {
      const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
      if (isSameWorld) {
        console.log('receiving CIRCLES.EVENTS.ANSWER_OBJECT_STATE: ', data);

        //get list of the "same" objects, and remove the one that is duplicate ...
        //const selectStr = '[circles-object-world*=' + CONTEXT_AF.el.components['circles-object-world'].data.id  + ']';
        //console.log(selectStr);
        //console.log(CONTEXT_AF.el.getAttribute('circles-object-world'));
        const allNetworkObjects = document.querySelectorAll('[circles-object-world]');
        let numSimilarNetObjs = 0;
        allNetworkObjects.forEach(function(netObj) {
          console.log(netObj.components['circles-object-world'].data.id);
          if (netObj.components['circles-object-world'].data.id === CONTEXT_AF.el.id) {
            numSimilarNetObjs++;
          }
        });

        console.log('numSimilarNetObjs', numSimilarNetObjs);

        //if more than one, remove this one ...
        if (numSimilarNetObjs > 1 && CONTEXT_AF.isClone === false) {
          console.log('removing ' + CONTEXT_AF.el.id);
          CONTEXT_AF.el.remove();
        }
      }
    });

    //if someone else requests our object data, we send it.
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.QUESTION_OBJECT_STATE, function(data) {
      const isSameWorld = (data.world === CIRCLES.getCirclesWorldName());
      if (isSameWorld) {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.ANSWER_OBJECT_STATE, {id:thisElem.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName(), state:'n/a'});
      }
    });
  },
  takeNetworkOwnership : function(elem) {
    //take over networked membership
    console.log('takeNetworkOwnership');
    if (elem.hasAttribute('networked') === true) {
      NAF.utils.getNetworkedEntity(elem).then((el) => {
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
  }
});