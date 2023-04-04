'use strict';

AFRAME.registerComponent('circles-artefact', {
  schema: {
    title:                {type:'string',   default:'no_title_set'},
    description:          {type:'string',   default:'no_decription_set'},
    title_back:           {type:'string',   default:''},                  //For other side of description. if left blank we will just duplicate "text_1"
    description_back:     {type:'string',   default:''},
    description_on:       {type:'boolean',  default:true},
    description_offset:   {type:'vec3',     default:{x:0.0, y:1.22, z:0.0}},
    desc_arrow_position:  {type:'string',   default: 'down', oneOf: ['up', 'down', 'left', 'right']},
    audio:                {type:'audio',    default:''},
    volume:               {type:'number',   default:1.0},

    inspectPosition:      {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    inspectScale:         {type:'vec3',     default:{x:1.0, y:1.0, z:1.0}},
    inspectRotation:      {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    origPosition:         {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    origRotation:         {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    origScale:            {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},

    textRotationY:        {type:'number',   default:0.0},               
    descriptionLookAt:    {type:'boolean',  default:false},
    labelLookAt:          {type:'boolean',  default:true},
    constrainYAxis:       {type:'boolean',  default:true},
    updateRate:           {type:'number',   default:200},   //in ms
    smoothingOn:          {type:'boolean',  default:true},
    smoothingAlpha:       {type:'float',    default:0.05},
    
    label_text:           {type:'string',   default:'label_text'},
    label_on:             {type:'boolean',  default:true},
    label_offset:         {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    label_arrow_position: {type:'string',   default: 'down', oneOf: ['up', 'down', 'left', 'right']},

    // networkedEnabled: {type:'boolean',  default:false},
    // networkedTemplate:{type:'string',   default:CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT}
  },
  init: function() {
    const CONTEXT_AF  = this;
    const data        = this.data;

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

    if (!CONTEXT_AF.el.classList.contains('circles_artefact')) {
      CONTEXT_AF.el.classList.add('circles_artefact');
    }

    //add all additional elements needed for these artefacts. Note that we are using the update function so these cannot be modified in real-time ...
    CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'highlight'});

    CONTEXT_AF.el.setAttribute('circles-pickup-object', {animate:true});

    //networking is a bit buggy so let's not force it for now ...
    //CONTEXT_AF.el.setAttribute('circles-pickup-networked', {networkedTemplate:CIRCLES.NETWORKED_TEMPLATES.ARTEFACT});
    
    //this is so we can keep track of which world this object is from so we can share objects, but turning that off for now to reduce duplicate object complexity.
    //CONTEXT_AF.el.setAttribute('circles-object-world', {world:world});

    //create associated label
    const tempPos = CONTEXT_AF.el.getAttribute('position');
    CONTEXT_AF.labelEl = document.createElement('a-entity');
    CONTEXT_AF.labelEl.setAttribute('id', CONTEXT_AF.el.getAttribute('id') + '_label');
    CONTEXT_AF.labelEl.setAttribute('circles-interactive-visible', data.label_on);
    CONTEXT_AF.labelEl.setAttribute('position', {x:tempPos.x, y:tempPos.y, z:tempPos.z});
    CONTEXT_AF.labelEl.setAttribute('circles-label', {  text:           data.label_text, 
                                                        offset:         data.label_offset, 
                                                        arrow_position: data.label_arrow_position, 
                                                        lookAtCamera:   data.labelLookAt,
                                                        constrainYAxis: data.constrainYAxis, 
                                                        updateRate:     data.updateRate, 
                                                        smoothingOn:    data.smoothingOn, 
                                                        smoothingAlpha: data.smoothingAlpha });
    CONTEXT_AF.el.parentNode.appendChild(CONTEXT_AF.labelEl);

    CONTEXT_AF.addLabelEventListener();

    //create associated description
    CONTEXT_AF.descEl = document.createElement('a-entity');
    CONTEXT_AF.descEl.setAttribute('id', CONTEXT_AF.el.getAttribute('id') + '_description');
    CONTEXT_AF.descEl.setAttribute('visible', false);
    CONTEXT_AF.descEl.setAttribute('position', {x:tempPos.x, y:tempPos.y, z:tempPos.z});
    CONTEXT_AF.descEl.setAttribute('rotation', {x:0.0, y:data.textRotationY, z:0.0});
    CONTEXT_AF.descEl.setAttribute('circles-description', { title_text_front:       data.title,
                                                            title_text_back:        data.title_back,
                                                            description_text_front: data.description,
                                                            description_text_back:  data.description_back,
                                                            offset:                 data.description_offset,
                                                            arrow_position:         data.desc_arrow_position, 
                                                            lookAtCamera:           data.descriptionLookAt,
                                                            constrainYAxis:         data.constrainYAxis, 
                                                            updateRate:             data.updateRate, 
                                                            smoothingOn:            data.smoothingOn, 
                                                            smoothingAlpha:         data.smoothingAlpha });
    CONTEXT_AF.el.parentNode.appendChild(CONTEXT_AF.descEl);

    if (data.audio) {
      CONTEXT_AF.el.setAttribute('circles-sound', {type:'artefact', src:data.audio, volume:data.volume});
    }

    //send click event to manager
    // CONTEXT_AF.el.addEventListener('click', (e) => {
    //   CONTEXT_AF.el.emit( CIRCLES.EVENTS.SELECT_THIS_OBJECT, this, true );
    // });

    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, (e) => {
      if (e.detail.sendNetworkEvent === true) {
        CONTEXT_AF.pickup(CONTEXT_AF);
      }
    });

    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, (e) => {
      if (e.detail.sendNetworkEvent === true) {
        CONTEXT_AF.release(CONTEXT_AF);
      }
    });
  },
  update : function(oldData) {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

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
  pickup : function(passedContext) {
    const CONTEXT_AF = (passedContext) ? passedContext : this;

    //hide label
    if (CONTEXT_AF.data.label_on === true) {
      CONTEXT_AF.labelEl.setAttribute('circles-interactive-visible', false);
    }

    //show description
    if (CONTEXT_AF.data.description_on === true) {
      CONTEXT_AF.descEl.setAttribute('circles-interactive-visible', true);
    }
  },
  release : function(passedContext) {
    const CONTEXT_AF = (passedContext) ? passedContext : this;

    //show label
    if (CONTEXT_AF.data.label_on === true) {
      CONTEXT_AF.labelEl.setAttribute('circles-interactive-visible', true);
    }

    //hide description
    if (CONTEXT_AF.data.description_on === true) {
      CONTEXT_AF.descEl.setAttribute('circles-interactive-visible', false);
    }
  },
  addLabelEventListener: function() {
    this.labelEl.addEventListener('click', this.labelClickFunc);
  },
  removeLabelEventListener: function() {
    this.labelEl.removeEventListener('click', this.labelClickFunc);
  },
  labelClickFunc: function(e) {
    let elementID = e.currentTarget.id;  //copy string
    elementID = '#' + elementID.replace(/_label/g, '');
    document.querySelector(elementID).click();  //also want to forward label clicks to the artefact itself
  }
});