'use strict';

AFRAME.registerComponent('circles-snap-turning', {
  schema: {
    snap_amount: {type:'int', default:CIRCLES.CONSTANTS.DEFAULT_SNAP_TURN_DEG},
    enabled:     {type:'boolean', default:true}     
  },

  init: function() 
  {
    const CONTEXT_AF = this;
    CONTEXT_AF.trackpadX = 0.0;
    CONTEXT_AF.trackpadY = 0.0;

    CONTEXT_AF.keyboard_detection();
    // CONTEXT_AF.trackpad_detection();
    CONTEXT_AF.joystick_detection();
    //CONTEXT_AF.touchscreen_detection(); //this detects swipes but not sure required as A-Frame already does this
  },
  //need to start cleaning up these components to properly remove/clean themselves up one day ...
  addEventListeners: function() {},
  removeEventListeners: function() {},
  remove : function() {},
  update: function(oldData) 
  {
    const CONTEXT_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

  },
  rotateBody: function(angleDeg) 
  {
    if (this.data.enabled === true) {
      this.el.object3D.rotation.y += THREE.MathUtils.degToRad(angleDeg);
    }
  },
  keyboard_detection: function () {
    const CONTEXT_AF = this;

    //keyboard controls
    document.addEventListener('keyup', (event) => {
        const keyName = event.key;
        
        if (keyName == 'e' || keyName == 'E') {
            CONTEXT_AF.rotateBody(-CONTEXT_AF.data.snap_amount);
        }

        if (keyName == 'q' || keyName == 'Q') {
            CONTEXT_AF.rotateBody(CONTEXT_AF.data.snap_amount);
        }
    }, false);
  },
  trackpad_detection: function () {
    const CONTEXT_AF = this;

    //Oculusgo / gearVR / trackpad controllers ////
    CONTEXT_AF.el.addEventListener('trackpadmoved', function(event) {
        CONTEXT_AF.trackpadX = event.detail.x;
        CONTEXT_AF.trackpadY = event.detail.y;
    });

    CONTEXT_AF.el.addEventListener('trackpadup', function(event) { 
        //check which side of trackpad is being pressed
        if (CONTEXT_AF.trackpadX > 0.0) {
            CONTEXT_AF.rotateBody(-CONTEXT_AF.data.snap_amount);
        }
        else if (CONTEXT_AF.trackpadX < 0.0) {
            CONTEXT_AF.rotateBody(CONTEXT_AF.data.snap_amount);
        }
    });
  },
  joystick_detection: function () {
    const CONTEXT_AF = this;

    //need to set timer and thresholds
    const threshold         = 0.8;      //max is 1.0 for all the way to the side
    const snapTime          = 800;     //milliseconds between "snaps" if thumbstick help down
    let canSnapLeft         = true;    //set a max time on this
    let snapLeftTimerFunc   = null;
    let canSnapRight        = true;    //set a max time on this
    let snapRightTimerFunc  = null;

    //Oculusgo / gearVR / trackpad controllers ////
    CONTEXT_AF.el.addEventListener('thumbstickmoved', function(event) {
        CONTEXT_AF.trackpadX = event.detail.x;
        CONTEXT_AF.trackpadY = event.detail.y;
        
        if (CONTEXT_AF.trackpadX > threshold) {
            if (canSnapLeft === true) {
                CONTEXT_AF.rotateBody(-CONTEXT_AF.data.snap_amount);
                canSnapLeft = false;
                snapLeftTimerFunc = setTimeout(() => { canSnapLeft = true }, snapTime);

                //clear opposite direction
                canSnapRight = true;
                clearTimeout( snapRightTimerFunc );
            }
        }
        else if (CONTEXT_AF.trackpadX < -threshold) {
            if (canSnapRight === true) {
                CONTEXT_AF.rotateBody(CONTEXT_AF.data.snap_amount);
                canSnapRight = false;
                snapRightTimerFunc = setTimeout(() => { canSnapRight = true }, snapTime);

                //clear opposite direction
                canSnapLeft = true;
                clearTimeout( snapLeftTimerFunc );
            }
        }
    });
  },
  touchscreen_detection: function () {
    const CONTEXT_AF = this;

    //http://javascriptkit.com/javatutors/touchevents2.shtml
    let touchsurface = document;
    let swipedir;
    let startX;
    let startY;
    let distX;
    let distY;
    let threshold = 150; //required min distance traveled to be considered swipe
    let restraint = 100; // maximum distance allowed at the same time in perpendicular direction
    let allowedTime = 300; // maximum time allowed to travel that distance
    let elapsedTime;
    let startTime;
    //let handleswipe = callback || function(swipedir){}
    
    touchsurface.addEventListener('touchstart', function(e){
        let touchobj = e.changedTouches[0];
        swipedir = 'none';
        startX = touchobj.pageX;
        startY = touchobj.pageY
        startTime = new Date().getTime() // record time when finger first makes contact with surface
        e.preventDefault()
    }, false)
    
    touchsurface.addEventListener('touchmove', function(e){
        e.preventDefault() // prevent scrolling when inside DIV
    }, false)
    
    touchsurface.addEventListener('touchend', function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
        distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
        elapsedTime = new Date().getTime() - startTime // get time elapsed
        if (elapsedTime <= allowedTime){ // first condition for awipe met
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
            }
        }
        CONTEXT_AF.handleTouchSwipe(swipedir)
        e.preventDefault()
    }, false);

    //USAGE:
    /*
    var el = document.getElementById('someel')
    swipedetect(el, function(swipedir){
        swipedir contains either "none", "left", "right", "top", or "down"
        if (swipedir =='left')
            alert('You just swiped left!')
    })
    */
  },
  handleTouchSwipe: function(swipeDir) {
    // console.log("SWIPE DETECTED!");
    // console.log("DIR: " + swipeDir);
  }
});