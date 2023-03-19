'use strict';

AFRAME.registerComponent('circles-inspect-object', {
  schema: {
    title:            {type:'string',   default:'No Title Set'},
    description:      {type:'string',   default:'No decription set'},
    title_back:       {type:'string',   default:''},                  //For other side of description. if left blank we will just duplicate "text_1"
    description_back: {type:'string',   default:''},
    inspectPosition:  {type:'vec3',     default:{x:0.0, y:0.0, z:-2.0}},
    inspectRotation:  {type:'vec3',     default:{x:0.0, y:0.0, z:0.0}},
    inspectScale:     {type:'vec3',     default:{x:1.0, y:1.0, z:1.0}},
    origPosition:     {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    origRotation:     {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    origScale:        {type:'vec3',     default:{x:100001.0, y:0.0, z:0.0}},
    textRotationY:    {type:'number',   default:0.0},                 //rotation of textual info
    textLookAt:       {type:'boolean',  default:false},               //will we do a look at to rotate to where user is at first?
    networkedEnabled: {type:'boolean',  default:false},
  },
  init: function() {
    const CONTEXT_AF = this;
    const data = this.data;

    CONTEXT_AF.el.setAttribute('circles-pickup-object', {animate:true});

    //want to set to whatever their initial position is when initialized, if none set.
    if (data.origPosition.x > 100000.0) {
      CONTEXT_AF.el.setAttribute('circles-inspect-object', {origPosition: CONTEXT_AF.el.object3D.position.clone()});
    }
    if (data.origRotation.x > 100000.0) {
      const currRot = CONTEXT_AF.el.object3D.rotation.clone();
      CONTEXT_AF.el.setAttribute('circles-inspect-object', {origRotation: {x:THREE.MathUtils.radToDeg(currRot.x), y:THREE.MathUtils.radToDeg(currRot.y), z:THREE.MathUtils.radToDeg(currRot.z)}});
    }
    if (data.origScale.x > 100000.0) {
      CONTEXT_AF.el.setAttribute('circles-inspect-object', {origScale: CONTEXT_AF.el.object3D.scale.clone()});
    }

    const ownership_gained_Func = (e) => {
      //console.log("ownership-gained");
      CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_GAINED, CONTEXT_AF.el, true );
    };

    const ownership_lost_Func = (e) => {
      //console.log("ownership-lost");
      CONTEXT_AF.el.emit( CIRCLES.EVENTS.OBJECT_OWNERSHIP_LOST, CONTEXT_AF.el, true );
    };

    const ownership_changed_Func = (e) => {
      //console.log("ownership-changed");
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
          //console.log("is this mine?");
          if (!NAF.utils.isMine(el)) {
            //console.log("No but ... ")
            NAF.utils.takeOwnership(el);
            //console.log("it is mine now");
          } 
          else {
            //console.log("Yes, it is mine already");
          }
        });
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
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {dropPosition: data.origPosition });
    }

    if ( (oldData.origRotation !== data.origRotation) && (data.origRotation !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {dropRotation: data.origRotation });
    }

    if ( (oldData.origScale !== data.origScale) && (data.origScale !== '') ) {
      CONTEXT_AF.el.setAttribute('circles-pickup-object', {dropScale: data.origScale });
    }

    if ( (oldData.networkedEnabled !== data.networkedEnabled) && (data.networkedEnabled !== '') ) {
      if (data.networkedEnabled === true) {
        CONTEXT_AF.el.setAttribute('networked', {template:'#interactive-object-template', attachTemplateToLocal:true, synchWorldTransforms:true});
        CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_ATTACHED);
      }
      else {
        CONTEXT_AF.el.removeAttribute('networked');
        CONTEXT_AF.el.emit(CIRCLES.EVENTS.OBJECT_NETWORKED_DETACHED);
      }
    }
  },
  getOrigScaleThree : function() {
    return new THREE.Vector3(this.data.origScale.x, this.data.origScale.y, this.data.origScale.z);
  }
});