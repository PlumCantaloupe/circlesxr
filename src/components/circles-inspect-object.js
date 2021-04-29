'use strict';

AFRAME.registerComponent('circles-inspect-object', {
  schema: {
    title:            {type:'string',   default:'No Title Set'},
    description:      {type:'string',   default:'No decription set'},
    inspectScale:     {type:'vec3',     default:{x:1.0, y:1.0, z:1.0}},
    inspectRotation:  {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    origPos:          {type:'vec3',     default:{x:10001.0, y:0.0, z:0.0}},
    origRot:          {type:'vec3',     default:{x:10001.0, y:0.0, z:0.0}},
    origScale:        {type:'vec3',     default:{x:10001.0, y:0.0, z:0.0}},
    textRotationY:    {type:'number',   default:0.0},                 //rotation of textual info
    textLookAt:       {type:'boolean',  default:false}               //will we do a look at to rotate to where user is at first?
  },
  init: function() {
    const CONTEXT_AF = this;
    const data = this.data;

    if (data.origPos.x > 10000) {
      CONTEXT_AF.el.setAttribute('circles-inspect-object', {origPos:{x:CONTEXT_AF.el.object3D.position.x, y:CONTEXT_AF.el.object3D.position.y, z:CONTEXT_AF.el.object3D.position.z}}); //save it so network syncs this
    }

    if (data.origRot.x > 10000) {
      CONTEXT_AF.el.setAttribute('circles-inspect-object', {origRot:{x:CONTEXT_AF.el.object3D.rotation.x, y:CONTEXT_AF.el.object3D.rotation.y, z:CONTEXT_AF.el.object3D.rotation.z}}); //save it so network syncs this
    }

    if (data.origScale.x > 10000) {
      CONTEXT_AF.el.setAttribute('circles-inspect-object', {origScale:{x:CONTEXT_AF.el.object3D.scale.x, y:CONTEXT_AF.el.object3D.scale.y, z:CONTEXT_AF.el.object3D.scale.z}}); //save it so network syncs this
    }

    let eventsAttached = false;
    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, function (event) {
      if (eventsAttached === false) {
        eventsAttached = true;
        NAF.utils.getNetworkedEntity(CONTEXT_AF.el).then((el) => {

          console.log("adding events");
  
          el.addEventListener('ownership-gained', (e) => {
            console.log("ownership-gained");
            CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, CONTEXT_AF.el, true );
          });
  
          el.addEventListener('ownership-lost', (e) => {
            console.log("ownership-lost");
            CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, CONTEXT_AF.el, true );
          });
  
          el.addEventListener('ownership-changed', (e) => {
            console.log("ownership-changed");
            CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_CHANGED, CONTEXT_AF.el, true );
          });
        });
      }
    });

    if (CONTEXT_AF.el.hasAttribute('networked') === true) {
      if (eventsAttached === false) {
        eventsAttached = true;
        NAF.utils.getNetworkedEntity(CONTEXT_AF.el).then((el) => {

          el.addEventListener('ownership-gained', (e) => {
            CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, CONTEXT_AF.el, true );
          });
  
          el.addEventListener('ownership-lost', (e) => {
            CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, CONTEXT_AF.el, true );
          });
  
          el.addEventListener('ownership-changed', (e) => {
            CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_CHANGED, CONTEXT_AF.el, true );
          });
        });
      }
    }
    

    //send click event to manager
    CONTEXT_AF.el.addEventListener('click', (e) => {
      CONTEXT_AF.el.emit( CIRCLES.EVENTS.SELECT_THIS_OBJECT, this, true );
     });
  },
  update : function(oldData) 
  {}
});