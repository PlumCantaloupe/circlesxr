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
    const Context_AF = this;
    const data = this.data;
    Context_AF.highlight_object = null;

    Context_AF.el.addEventListener(CIRCLES.EVENTS.OBJECT_HIGHLIGHT_LOADED, (e) => {
        Context_AF.highlight_object = e.target;
    });

    if (data.origPos.x > 10000) {
      Context_AF.el.setAttribute('circles-inspect-object', {origPos:{x:Context_AF.el.object3D.position.x, y:Context_AF.el.object3D.position.y, z:Context_AF.el.object3D.position.z}}); //save it so network syncs this
    }

    if (data.origRot.x > 10000) {
      Context_AF.el.setAttribute('circles-inspect-object', {origRot:{x:Context_AF.el.object3D.rotation.x, y:Context_AF.el.object3D.rotation.y, z:Context_AF.el.object3D.rotation.z}}); //save it so network syncs this
    }

    if (data.origScale.x > 10000) {
      Context_AF.el.setAttribute('circles-inspect-object', {origScale:{x:Context_AF.el.object3D.scale.x, y:Context_AF.el.object3D.scale.y, z:Context_AF.el.object3D.scale.z}}); //save it so network syncs this
    }

    let eventsAttached = false;
    Context_AF.el.addEventListener(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED, function (event) {
      // console.log('WHWHWHWHWHWHWHHW');
      // console.log("this");
      // console.log(Context_AF.el.components);
      // console.log(Context_AF.el.components['networked']);
      // console.log(Context_AF.el.components['circles-inspect-object']);
      // console.log( 'networked' in Context_AF.el.components );
      // console.log( Context_AF.el.components.hasOwnProperty('networked') );

      if (eventsAttached === false) {
        eventsAttached = true;
        NAF.utils.getNetworkedEntity(Context_AF.el).then((el) => {

          console.log("adding events");
  
          el.addEventListener('ownership-gained', (e) => {
            console.log("ownership-gained");
            Context_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, Context_AF.el, true );
          });
  
          el.addEventListener('ownership-lost', (e) => {
            //Context_AF.el.removeAttribute('circles-parent-constraint');
            console.log("ownership-lost");
            Context_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, Context_AF.el, true );
          });
  
          el.addEventListener('ownership-changed', (e) => {
            console.log("ownership-changed");
            Context_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_CHANGED, Context_AF.el, true );
          });
        });
      }
    });

    if (Context_AF.el.hasAttribute('networked') === true) {
      if (eventsAttached === false) {
        eventsAttached = true;
        NAF.utils.getNetworkedEntity(Context_AF.el).then((el) => {

          console.log("adding events");
  
          el.addEventListener('ownership-gained', (e) => {
            console.log("ownership-gained");
            Context_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, Context_AF.el, true );
          });
  
          el.addEventListener('ownership-lost', (e) => {
            //Context_AF.el.removeAttribute('circles-parent-constraint');
            console.log("ownership-lost");
            Context_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, Context_AF.el, true );
          });
  
          el.addEventListener('ownership-changed', (e) => {
            console.log("ownership-changed");
            Context_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_CHANGED, Context_AF.el, true );
          });
        });
      }
    }
    

    //send click event to manager
    Context_AF.el.addEventListener('click', (e) => {
        //Context_AF.toggleInspection(evt);
        // const eventObject = {
        //                       inspectObject:Context_AF.el,
        //                       inspectHighlight:Context_AF.highlight_object, 
        //                       title:data.title, 
        //                       description:data.description,
        //                       inspectScale:data.inspectScale,
        //                       inspectRotation:data.inspectRotation,
        //                       textRotationY:data.textRotationY,
        //                       textLookAt:data.textLookAt,
        //                       origPos:Context_AF.origPos,
        //                       origRot:Context_AF.origRot,
        //                       origScale:Context_AF.origScale
        //                     };
        // const avatar = e.detail.cursorEl.parentEl
        // if (!avatar.classList.contains("locked"))
        // {
          Context_AF.el.emit( CIRCLES.EVENTS.SELECT_THIS_OBJECT, this, true );
        // }
     });
  },
  update : function(oldData) 
  {}
});