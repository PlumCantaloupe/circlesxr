'use strict';

AFRAME.registerComponent('circles-artefact', {
  schema: {
    title:              {type:'string',   default:'No Title Set'},
    description:        {type:'string',   default:'No decription set'},
    audio:              {type:'audio',    default:''},
    volume:             {type:'number',   default:1.0},
    inspectScale:       {type:'vec3',     default:{x:1.0, y:1.0, z:1.0}},
    inspectRotation:    {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    origPos:            {type:'vec3',     default:{x:10001.0, y:0.0, z:0.0}},
    origRot:            {type:'vec3',     default:{x:10001.0, y:0.0, z:0.0}},
    origScale:          {type:'vec3',     default:{x:10001.0, y:0.0, z:0.0}},
    textRotationY:      {type:'number',   default:0.0},               
    textLookAt:         {type:'boolean',  default:false},
    
    label_text:         {type:'string',     default:'label_text'},
    label_visible:      {type:'boolean',    default:true},
    label_offset:       {type:'vec3'},
    arrow_position:     {type:'string',     default: 'up', oneOf: ['up', 'down', 'left', 'right']},
    updateRate:         {type:'number',     default:200}
  },
  init: function() {
    const CONTEXT_AF  = this;
    const data        = this.data;
    const world       = document.querySelector('[circles-manager]').components['circles-manager'].getWorld();

    if (!CONTEXT_AF.el.classList.contains('narrative')) {
      CONTEXT_AF.el.classList.add('narrative');
    }

    //add all additional elements needed for these artefacts. Note that we are using teh update function so these cannot be modified in real-time ...
    CONTEXT_AF.el.setAttribute('circles-interactive-object', {type:'scale'});

    CONTEXT_AF.el.setAttribute('circles-inspect-object', {  title:data.title,                       description:data.description,       inspectScale:data.inspectScale,
                                                            inspectRotation:data.inspectRotation,   origPos:data.origPos,               origRot:data.origRot,
                                                            origScale:data.origScale,               textRotationY:data.textRotationY,   textLookAt:data.textLookAt  
                                                        });

    CONTEXT_AF.el.setAttribute('circles-object-label', {    label_text:data.label_text,             label_visible:data.label_visible,   label_offset:data.label_offset, 
                                                            arrow_position:data.arrow_position,     updateRate:data.updateRate
                                                        });
    
    CONTEXT_AF.el.setAttribute('circles-object-world', {world:world});

    if (data.audio) {
      CONTEXT_AF.el.setAttribute('circles-sound', {type:'artefact', src:data.audio, volume:data.volume});
    }

    CONTEXT_AF.el.setAttribute('networked', {template:'#interactive-object-template', attachTemplateToLocal:true});
    CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED);
  },
  //!!TODO should probably make this component dynamic ...
  // update : function(oldData) {
  //   const CONTEXT_AF = this;
  //   const data = this.data;

  //   if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

  //   if ( (oldData.label_text !== data.label_text) && (data.label_text !== '') ) {
  //       CONTEXT_AF.labelText.setAttribute('text', {value:data.label_text});
  //   }
  // }
});