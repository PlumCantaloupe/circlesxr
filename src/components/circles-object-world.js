'use strict';

AFRAME.registerComponent('circles-object-world', {
schema: {
    world:      {type: 'string', default:''},
    pickedup:   {type: 'bool', default:false}
    },
  init: function() {
    const CONTEXT_AF    = this;

    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.INSPECT_THIS_OBJECT, function (evt) {
        console.log("Event: CIRCLES.EVENTS.INSPECT_THIS_OBJECT");
        CONTEXT_AF.el.setAttribute('circles-object-world', {pickedup:true}); //want visible in all worlds so we can "share" what we are lookinhg at
    });

    CONTEXT_AF.el.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, function (evt) {
        console.log("Event: CIRCLES.EVENTS.RELEASE_THIS_OBJECT");
        CONTEXT_AF.el.setAttribute('circles-object-world', {pickedup:false});
    });
  },
  update: function(oldData) {
    const CONTEXT_AF    = this;
    const data          = this.data;
    const world         = data.world; //refers to world the object originates from
    const pickedUp      = data.pickedup; //refers to world the object originates from
    const curr_world    = document.querySelector('[circles-manager]').components['circles-manager'].getWorld(); //world we are curently within

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    //model change
    if ( (oldData.pickedup !== data.pickedup) && (data.pickedup !== '') ) {
        if ( pickedUp === true ) {
            if ( curr_world !== world ) {
                CONTEXT_AF.el.setAttribute('visible', true);
            }
        }
        else {
            if ( curr_world !== world ) {
                CONTEXT_AF.el.setAttribute('visible', false);
            }
        }
    }
  }
});