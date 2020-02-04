'use strict';

AFRAME.registerComponent('circles-artefact', {
  schema: {
    title:              {type:'string',   default:'No Title Set'},
    description:        {type:'string',   default:'No decription set'},
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
    updateRate:         {type:'number',     default:200},

    object_world:       {type:'string',     default:''}     //use __WORLDNAME__ unless you want to control synching in some other fashion
  },
  init: function() {
    const Context_AF = this;
    const data = this.data;

    console.log("HAHHAHAHAHAHAH");

    //add all additional elements needed for these artefacts. Note that we are using teh update function so these cannot be modified in real-time ...
    //Context_AF.el.classList.add('interactive');
    Context_AF.el.setAttribute('circles-interactive-object', '');

    Context_AF.el.setAttribute('circles-inspect-object', {  title:data.title,                       description:data.description,       inspectScale:data.inspectScale,
                                                            inspectRotation:data.inspectRotation,   origPos:data.origPos,               origRot:data.origRot,
                                                            origScale:data.origScale,               textRotationY:data.textRotationY,   textLookAt:data.textLookAt  
                                                        });

    Context_AF.el.setAttribute('circles-object-label', {    label_text:data.label_text,             label_visible:data.label_visible,   label_offset:data.label_offset, 
                                                            arrow_position:data.arrow_position,     updateRate:data.updateRate
                                                        });
    
    Context_AF.el.setAttribute('networked', {template:'#interactive-object-template', attachTemplateToLocal:true});
    Context_AF.el.setAttribute('circles-object-world', {object_world:data.object_world});
  },
//   update : function(oldData) {
//     const Context_AF = this;
//     const data = this.data;

//     if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

//     if ( (oldData.label_text !== data.label_text) && (data.label_text !== '') ) {
//         Context_AF.labelText.setAttribute('text', {value:data.label_text});
//     }
//   }
});