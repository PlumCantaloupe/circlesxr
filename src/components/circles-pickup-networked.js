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
    networkedEnabled: {type:'boolean',  default:false},
    networkedTemplate:{type:'string',   default:CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT}
  },
  init: function() {
    const CONTEXT_AF  = this;
    const data        = CONTEXT_AF.data;
    CONTEXT_AF.socket = null;

    if (CIRCLES.isCirclesWebsocketReady()) {
      console.log('b1');
      CONTEXT_AF.setupNetworking();
    }
    else {
      console.log('b2');
      const wsReadyFunc = function() {
        console.log('b3');
        CONTEXT_AF.setupNetworking();
        CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
      };
      CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
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
        CONTEXT_AF.el.setAttribute('circles-pickup-networked', {className:randomClassName});
      }
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
  // pickup : function(passedContext) {
  //   const CONTEXT_AF = (passedContext) ? passedContext : this;
  //   const data          = CONTEXT_AF.data;

  //   //turn on networking
  //   CONTEXT_AF.el.setAttribute('circles-artefact', {networkedEnabled:true, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});
  // },
  // release : function(passedContext) {
  //   const CONTEXT_AF = (passedContext) ? passedContext : this;
  //   const data = CONTEXT_AF.data;

  //   //turn off
  //   CONTEXT_AF.el.setAttribute('circles-artefact', {networkedEnabled:false, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});
  // },
  setupNetworking : function () {
    const CONTEXT_AF  = this;
    const thisElem    = CONTEXT_AF.el;
    const data        = CONTEXT_AF.data;
    CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();

    console.log(CONTEXT_AF.socket);

    // CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, function() {
    //   console.log('Circles is ready: ' + CIRCLES.isReady());

    //   //this is the camera that is now also ready, if we want to parent elements to it i.e., a user interface or 2D buttons
    //   console.log("Circles camera ID: " + CIRCLES.getMainCameraElement().id);
    // });

    //when object picked up
    thisElem.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, function() {
      if (data.networkedEnabled === true) {
        //take over networked membership
        if (thisElem.hasAttribute('networked') === true) {
          NAF.utils.getNetworkedEntity(thisElem).then((el) => {
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
        console.log('sending - network object pickup');
        CONTEXT_AF.el.setAttribute('networked', {template:'#' + data.networkedTemplate, attachTemplateToLocal:true, synchWorldTransforms:true});
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, {id:thisElem.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
      }
    });

    //when object released
    thisElem.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, function() {
      if (data.networkedEnabled === true) {
        console.log('sending - network object release');
        CONTEXT_AF.el.removeAttribute('networked');
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, {id:thisElem.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
      }
    });

    //NAF events for when someone else takes/loses control of an object
    thisElem.addEventListener('ownership-gained', function(e) {
      console.log("object ownership gained");
    });

    thisElem.addEventListener('ownership-lost', function(e) {
      console.log("object ownership lost");
    });

    CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_OBJECT_PICKUP, function(data) {
      console.log('receiving - CIRCLES.EVENTS.SYNC_ARTEFACT_PICKUP for ' + data.artefactID);
      //hide this artefact
      if (data.world === CIRCLES.getCirclesWorldName()) {
        CONTEXT_AF.el.setAttribute('circles-interactive-visible', false);
        document.querySelector('#' + data.artefactID + '_label').setAttribute('circles-interactive-visible', false);
        document.querySelector('#' + data.artefactID + '_description').setAttribute('circles-interactive-visible', true);
      }
    });

    CONTEXT_AF.socket.on(CIRCLES.EVENTS.SYNC_OBJECT_RELEASE, function(data) {
      console.log('receiving - CIRCLES.EVENTS.RELEASE_THIS_OBJECT for ' + data.artefactID);
      //show this artefact
      if (data.world === CIRCLES.getCirclesWorldName()) {
        CONTEXT_AF.el.setAttribute('circles-interactive-visible', true);
        document.querySelector('#' + data.artefactID + '_label').setAttribute('circles-interactive-visible', true);
        document.querySelector('#' + data.artefactID + '_description').setAttribute('circles-interactive-visible', false);
      }
    });

    //question for twin object state
    setTimeout(function() {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.QUESTION_OBJECT_STATE, {id:thisElem.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    }, THREE.MathUtils.randInt(0,1200));

    //answer for twin object state
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.ANSWER_OBJECT_STATE, function(data) {
      if (data.world === CIRCLES.getCirclesWorldName()) {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {campfireON:CONTEXT_AF.fireOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
      }
    });

    //if someone else requests our object data, we send it.
    CONTEXT_AF.socket.on(CIRCLES.EVENTS.QUESTION_OBJECT_STATE, function(data) {
      if (data.world === CIRCLES.getCirclesWorldName()) {
        CONTEXT_AF.socket.emit(CIRCLES.EVENTS.ANSWER_OBJECT_STATE, {id:thisElem.id, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName(), state:''});
      }
    });
  }
});