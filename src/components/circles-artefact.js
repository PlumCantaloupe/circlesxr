'use strict';

AFRAME.registerComponent('circles-artefact', {
  schema: {
    title:              {type:'string',   default:'No Title Set'},
    description:        {type:'string',   default:'No decription set'},
    title_back:         {type:'string',   default:''},                  //For other side of description. if left blank we will just duplicate "text_1"
    description_back:   {type:'string',   default:''},
    audio:              {type:'audio',    default:''},
    volume:             {type:'number',   default:1.0},
    inspectPosition:    {type:'vec3',     default:{x:0.0, y:0.0, z:-2.0}},
    inspectScale:       {type:'vec3',     default:{x:1.0, y:1.0, z:1.0}},
    inspectRotation:    {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    origPosition:       {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    origRotation:       {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    origScale:          {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    textRotationY:      {type:'number',   default:0.0},               
    textLookAt:         {type:'boolean',  default:false},
    
    label_text:         {type:'string',     default:'label_text'},
    label_visible:      {type:'boolean',    default:true},
    label_offset:       {type:'vec3',       default:{x:0.0, y:0.0, z:0.0}},
    description_offset: {type:'vec3',       default:{x:0.0, y:0.0, z:0.0}},
    arrow_position:     {type:'string',     default: 'up', oneOf: ['up', 'down', 'left', 'right']},
    updateRate:         {type:'number',     default:20}
  },
  init: function() {
    const CONTEXT_AF  = this;
    const data        = this.data;
    const world       = document.querySelector('[circles-manager]').components['circles-manager'].getWorld();

    if (!CONTEXT_AF.el.classList.contains('narrative')) {
      CONTEXT_AF.el.classList.add('narrative');
    }

    //add all additional elements needed for these artefacts. Note that we are using teh update function so these cannot be modified in real-time ...
    CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'highlight'});

    const currRot = CONTEXT_AF.el.object3D.rotation.clone();
    CONTEXT_AF.el.setAttribute('circles-inspect-object', {  title:data.title,                       description:data.description,       
                                                            title_back:data.title_back,             description_back:data.description_back, 
                                                            inspectPosition:data.inspectPosition,   inspectRotation:data.inspectRotation,   inspectScale:data.inspectScale,
                                                            origPosition: ((data.origPosition.x > 100000.0) ? CONTEXT_AF.el.object3D.position.clone() : data.origPosition),              
                                                            origRotation: ((data.origRotation.x > 100000.0) ? { x:THREE.MathUtils.radToDeg(currRot.x), 
                                                                                                                y:THREE.MathUtils.radToDeg(currRot.y), 
                                                                                                                z:THREE.MathUtils.radToDeg(currRot.z)
                                                                                                              } : data.origRotation),              
                                                            origScale:    ((data.origScale.x > 100000.0) ? CONTEXT_AF.el.object3D.scale.clone() : data.origScale),
                                                            textRotationY:data.textRotationY,       textLookAt:data.textLookAt,
                                                             
                                                        });
    
    //this is so we can keep track of which world this object is from so we can share objects, but turning that off for now to reduce duplicate object complexity.
    CONTEXT_AF.el.setAttribute('circles-object-world', {world:world});

    //create associated label
    const tempPos = CONTEXT_AF.el.getAttribute('position');
    CONTEXT_AF.labelEl = document.createElement('a-entity');
    CONTEXT_AF.labelEl.setAttribute('id', CONTEXT_AF.el.getAttribute('id') + '_label');
    CONTEXT_AF.labelEl.setAttribute('position', {x:tempPos.x, y:tempPos.y, z:tempPos.z});
    CONTEXT_AF.labelEl.setAttribute('circles-object-label', {
      label_text:data.label_text, label_visible:data.label_visible, label_offset:data.label_offset, arrow_position:data.arrow_position, updateRate:data.updateRate
    });
    CIRCLES.getCirclesSceneElement().appendChild(CONTEXT_AF.labelEl);

    CONTEXT_AF.labelEl.addEventListener('click', function(e) {
      CONTEXT_AF.el.click();  //also want to forward label clicks to the artefact itself
    });

    //create associated description
    CONTEXT_AF.descEl = document.createElement('a-entity');
    CONTEXT_AF.descEl.setAttribute('id', CONTEXT_AF.el.getAttribute('id') + '_description');
    CONTEXT_AF.descEl.setAttribute('position', {x:tempPos.x + data.description_offset, y:tempPos.y + data.description_offset, z:tempPos.z + data.description_offset});
    CONTEXT_AF.descEl.setAttribute('rotation', {x:0.0, y:data.textRotationY, z:0.0});
    CONTEXT_AF.descEl.setAttribute('circles-description', {
      title_text_front:       data.title,
      title_text_back:        data.title_back,
      description_text_front: data.description,
      description_text_back:  data.description_back
    });
    CIRCLES.getCirclesSceneElement().appendChild(CONTEXT_AF.descEl);

    if (data.audio) {
      CONTEXT_AF.el.setAttribute('circles-sound', {type:'artefact', src:data.audio, volume:data.volume});
    }

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
    // const CONTEXT_AF = this;
    // const data = this.data;

    // if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet
  },
  pickup : function() {
    const CONTEXT_AF = this;
    CONTEXT_AF.isPickedUp = true;
    
    //turn on networking
    CONTEXT_AF.el.setAttribute('circles-inspect-object', {networkedEnabled:true, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});

    //hide label
    CONTEXT_AF.labelEl.setAttribute('circles-object-label', {label_visible:false});

    //show description
    //

    //let others know
    CONTEXT_AF.el.emit( CIRCLES.EVENTS.INSPECT_THIS_OBJECT, null, false );
  },
  release : function() {
    const CONTEXT_AF = this;
    CONTEXT_AF.isPickedUp = false;

    //turn off networking
    CONTEXT_AF.el.setAttribute('circles-inspect-object', {networkedEnabled:false, networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});

    //show label
    CONTEXT_AF.labelEl.setAttribute('circles-object-label', {label_visible:true});

    //hide description
    //

    //send off event for others
    CONTEXT_AF.el.emit( CIRCLES.EVENTS.RELEASE_THIS_OBJECT, null, false);
  }
});