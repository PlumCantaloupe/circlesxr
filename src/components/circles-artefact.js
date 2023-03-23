'use strict';

AFRAME.registerComponent('circles-artefact', {
  schema: {
    title:              {type:'string',   default:'No Title Set'},
    description:        {type:'string',   default:'No decription set'},
    title_back:         {type:'string',   default:''},                  //For other side of description. if left blank we will just duplicate "text_1"
    description_back:   {type:'string',   default:''},
    description_on:     {type:'boolean',  default:true},
    description_offset: {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    audio:              {type:'audio',    default:''},
    volume:             {type:'number',   default:1.0},

    inspectPosition:    {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    inspectScale:       {type:'vec3',     default:{x:1.0, y:1.0, z:1.0}},
    inspectRotation:    {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    origPosition:       {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    origRotation:       {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    origScale:          {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},

    textRotationY:      {type:'number',   default:0.0},               
    descriptionLookAt:  {type:'boolean',  default:false},
    labelLookAt:        {type:'boolean',  default:true},
    constrainYAxis:     {type:'boolean',  default:true},
    updateRate:         {type:'number',   default:200},   //in ms
    smoothingOn:        {type:'boolean',  default:true},
    smoothingAlpha:     {type:'float',    default:0.05},
    
    label_text:         {type:'string',   default:'label_text'},
    label_on:           {type:'boolean',  default:true},
    label_offset:       {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    arrow_position:     {type:'string',   default: 'up', oneOf: ['up', 'down', 'left', 'right']},

    networkedEnabled: {type:'boolean',  default:false},
    networkedTemplate:{type:'string',   default:CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT}
  },
  init: function() {
    const CONTEXT_AF  = this;
    const data        = this.data;
    const world       = document.querySelector('[circles-manager]').components['circles-manager'].getWorld();

    //need to save this for later (before it is moved)
    CONTEXT_AF.origPos = CONTEXT_AF.el.object3D.position.clone();
    CONTEXT_AF.origRot = CONTEXT_AF.el.object3D.rotation.clone();
    CONTEXT_AF.origRot.x = THREE.MathUtils.radToDeg(CONTEXT_AF.origRot.x);    //convert
    CONTEXT_AF.origRot.y = THREE.MathUtils.radToDeg(CONTEXT_AF.origRot.y);
    CONTEXT_AF.origRot.z = THREE.MathUtils.radToDeg(CONTEXT_AF.origRot.z);
    CONTEXT_AF.origSca = CONTEXT_AF.el.object3D.scale.clone();


    if (!CONTEXT_AF.el.classList.contains('narrative')) {
      CONTEXT_AF.el.classList.add('narrative');
    }

    //add all additional elements needed for these artefacts. Note that we are using the update function so these cannot be modified in real-time ...
    CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'highlight'});

    CONTEXT_AF.el.setAttribute('circles-pickup-object', {animate:true});
    
    //this is so we can keep track of which world this object is from so we can share objects, but turning that off for now to reduce duplicate object complexity.
    CONTEXT_AF.el.setAttribute('circles-object-world', {world:world});

    //create associated label
    const tempPos = CONTEXT_AF.el.getAttribute('position');
    CONTEXT_AF.labelEl = document.createElement('a-entity');
    CONTEXT_AF.labelEl.setAttribute('id', CONTEXT_AF.el.getAttribute('id') + '_label');
    CONTEXT_AF.labelEl.setAttribute('visible', data.label_on);
    CONTEXT_AF.labelEl.setAttribute('position', {x:tempPos.x, y:tempPos.y, z:tempPos.z});
    CONTEXT_AF.labelEl.setAttribute('circles-label', {  text:           data.label_text, 
                                                        offset:         data.label_offset, 
                                                        arrow_position: data.arrow_position, 
                                                        lookAtCamera:   data.labelLookAt,
                                                        constrainYAxis: data.constrainYAxis, 
                                                        updateRate:     data.updateRate, 
                                                        smoothingOn:    data.smoothingOn, 
                                                        smoothingAlpha: data.smoothingAlpha });
    CIRCLES.getCirclesSceneElement().appendChild(CONTEXT_AF.labelEl);

    CONTEXT_AF.labelEl.addEventListener('click', function(e) {
      CONTEXT_AF.el.click();  //also want to forward label clicks to the artefact itself
    });

    //create associated description
    CONTEXT_AF.descEl = document.createElement('a-entity');
    CONTEXT_AF.descEl.setAttribute('id', CONTEXT_AF.el.getAttribute('id') + '_description');
    CONTEXT_AF.descEl.setAttribute('visible', false);
    CONTEXT_AF.descEl.setAttribute('position', {x:tempPos.x + data.description_offset, y:tempPos.y + data.description_offset, z:tempPos.z + data.description_offset});
    CONTEXT_AF.descEl.setAttribute('rotation', {x:0.0, y:data.textRotationY, z:0.0});
    CONTEXT_AF.descEl.setAttribute('circles-description', { title_text_front:       data.title,
                                                            title_text_back:        data.title_back,
                                                            description_text_front: data.description,
                                                            description_text_back:  data.description_back,
                                                            lookAtCamera:           data.descriptionLookAt,
                                                            constrainYAxis:         data.constrainYAxis, 
                                                            updateRate:             data.updateRate, 
                                                            smoothingOn:            data.smoothingOn, 
                                                            smoothingAlpha:         data.smoothingAlpha });
    CIRCLES.getCirclesSceneElement().appendChild(CONTEXT_AF.descEl);

    if (data.audio) {
      CONTEXT_AF.el.setAttribute('circles-sound', {type:'artefact', src:data.audio, volume:data.volume});
    }

    //Network stuff
    const ownership_gained_Func = (e) => {
      console.log("ownership-gained");
      CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, CONTEXT_AF.el, true );
    };

    const ownership_lost_Func = (e) => {
      console.log("ownership-lost");
      CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, CONTEXT_AF.el, true );
    };

    const ownership_changed_Func = (e) => {
      console.log("ownership-changed");
      CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_CHANGED, CONTEXT_AF.el, true );
    };

    let eventsAttached = false;
    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, function (event) {
      if (eventsAttached === false) {
        eventsAttached = true;
        NAF.utils.getNetworkedEntity(CONTEXT_AF.el).then((el) => {
          el.addEventListener('ownership-gained', ownership_gained_Func);
          el.addEventListener('ownership-lost', ownership_lost_Func);
          el.addEventListener('ownership-changed', ownership_changed_Func);
        });
      }
    });

    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED, function (event) {
        eventsAttached = false;
        NAF.utils.getNetworkedEntity(CONTEXT_AF.el).then((el) => {
          el.removeEventListener('ownership-gained', ownership_gained_Func);
          el.removeEventListener('ownership-lost', ownership_lost_Func);
          el.removeEventListener('ownership-changed', ownership_changed_Func);
        });
    });

    if (CONTEXT_AF.el.hasAttribute('networked') === true) {
      if (eventsAttached === false) {
        eventsAttached = true;
        NAF.utils.getNetworkedEntity(CONTEXT_AF.el).then((el) => {
          el.addEventListener('ownership-gained', ownership_gained_Func);
          el.addEventListener('ownership-lost', ownership_lost_Func);
          el.addEventListener('ownership-changed', ownership_changed_Func);
        });
      }
    }
    
    //send click event to manager
    CONTEXT_AF.el.addEventListener('click', (e) => {
      CONTEXT_AF.el.emit( CIRCLES.EVENTS.SELECT_THIS_OBJECT, this, true );

      //take over networked membership
      if (CONTEXT_AF.el.hasAttribute('networked') === true) {
        NAF.utils.getNetworkedEntity(CONTEXT_AF.el).then((el) => {
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
    });

    //need to make sure we don't have duplicate artefacts ... and that we trigger descriptions for all ...
    // CONTEXT_AF.socket     = null;
    //     CONTEXT_AF.connected  = false;
    //     CONTEXT_AF.campfireEventName = "campfire_event";
    //     CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function (data) {
    //         CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
    //         CONTEXT_AF.connected = true;
    //         console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

    //         CONTEXT_AF.campfire.addEventListener('click', function () {
    //             CONTEXT_AF.fireOn = !CONTEXT_AF.fireOn;
    //             CONTEXT_AF.turnFire(CONTEXT_AF.fireOn );
    //             CONTEXT_AF.socket.emit(CONTEXT_AF.campfireEventName, {campfireOn:CONTEXT_AF.fireOn , room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    //         });

    //         //listen for when others turn on campfire
    //         CONTEXT_AF.socket.on(CONTEXT_AF.campfireEventName, function(data) {
    //             CONTEXT_AF.turnFire(data.campfireOn);
    //             CONTEXT_AF.fireOn = data.campfireOn;
    //         });

    //         //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
    //         setTimeout(function() {
    //             CONTEXT_AF.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    //         }, THREE.MathUtils.randInt(0,1200));

    //         //if someone else requests our sync data, we send it.
    //         CONTEXT_AF.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
    //             CONTEXT_AF.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {campfireON:CONTEXT_AF.fireOn, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
    //         });

    //         //receiving sync data from others (assuming all others is the same for now)
    //         CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
    //             //make sure we are receiving data for this world
    //             if (data.world === CIRCLES.getCirclesWorldName()) {
    //                 CONTEXT_AF.turnFire(data.campfireON );
    //                 CONTEXT_AF.fireOn = data.campfireON;
    //             }
    //         });
    //     });
  },
  //!!TODO should probably make this component dynamic ...
  update : function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

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

    // const currRot = CONTEXT_AF.el.object3D.rotation.clone();
    // CONTEXT_AF.el.setAttribute('circles-pickup-object', { pickupPosition:data.inspectPosition, pickupRotation:data.inspectRotation, pickupScale:data.inspectScale,
    //                                                       dropPosition:((data.origPosition.x > 100000.0) ? CONTEXT_AF.el.object3D.position.clone() : data.origPosition),              
    //                                                       dropRotation:((data.origRotation.x > 100000.0) ? {  x:THREE.MathUtils.radToDeg(currRot.x), 
    //                                                                                                           y:THREE.MathUtils.radToDeg(currRot.y), 
    //                                                                                                           z:THREE.MathUtils.radToDeg(currRot.z)
    //                                                                                                         } : data.origRotation),              
    //                                                       dropScale:((data.origScale.x > 100000.0) ? CONTEXT_AF.el.object3D.scale.clone() : data.origScale),
    //                                                       animate:true
    //                                                     });

    if ( (oldData.inspectPosition !== data.inspectPosition) && (data.inspectPosition !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {pickupPosition: data.inspectPosition });
    }

    if ( (oldData.inspectRotation !== data.inspectRotation) && (data.inspectRotation !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {pickupRotation: data.inspectRotation });
    }

    if ( (oldData.inspectScale !== data.inspectScale) && (data.inspectScale !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {pickupScale: data.inspectScale });
    }

    if ( (oldData.origPosition !== data.origPosition) && (data.origPosition !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {dropPosition:((data.origPosition.x > 100000.0) ? CONTEXT_AF.origPos : data.origPosition)});
    }

    if ( (oldData.origRotation !== data.origRotation) && (data.origRotation !== '') ) {
      const currRot = CONTEXT_AF.el.object3D.rotation.clone();
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {dropRotation:((data.origRotation.x > 100000.0) ? CONTEXT_AF.origRot : data.origRotation)});
    }

    if ( (oldData.origScale !== data.origScale) && (data.origScale !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {dropScale:((data.origScale.x > 100000.0) ? CONTEXT_AF.origSca : data.origScale)});
    }
  },
  pickup : function() {
    const CONTEXT_AF = this;
    CONTEXT_AF.isPickedUp = true;
    
    //turn on networking
    CONTEXT_AF.el.setAttribute('circles-artefact', {networkedEnabled:true, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});

    //hide label
    if (CONTEXT_AF.data.label_on === true) {
      CONTEXT_AF.labelEl.setAttribute('visible', false);
    }

    //show description
    if (CONTEXT_AF.data.description_on === true) {
      CONTEXT_AF.descEl.setAttribute('visible', true);
    }

    //let others know
    CONTEXT_AF.el.emit( CIRCLES.EVENTS.INSPECT_THIS_OBJECT, null, false );
  },
  release : function() {
    const CONTEXT_AF = this;
    CONTEXT_AF.isPickedUp = false;

    const stopNetworking = function() {
      CONTEXT_AF.el.setAttribute('circles-artefact', {networkedEnabled:false, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});
      CONTEXT_AF.el.removeEventListener('animationcomplete__cpo_position', stopNetworking);
    };

    //turn off networking. If there is animation, wait until the animation is complete
    if (CONTEXT_AF.el.hasAttribute('animation__cpo_position')) {
      CONTEXT_AF.el.addEventListener('animationcomplete__cpo_position', stopNetworking);
    }
    else {
      CONTEXT_AF.el.setAttribute('circles-artefact', {networkedEnabled:false, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});
    }

    //show label
    if (CONTEXT_AF.data.label_on === true) {
      CONTEXT_AF.labelEl.setAttribute('visible', true);
    }

    //hide description
    if (CONTEXT_AF.data.description_on === true) {
      CONTEXT_AF.descEl.setAttribute('visible', false);
    }

    //send off event for others
    CONTEXT_AF.el.emit( CIRCLES.EVENTS.RELEASE_THIS_OBJECT, null, false);
  }
});