'use strict';

AFRAME.registerComponent('circles-snap-turning', {
  schema: {
    snap_amount:{type:'int', default:CIRCLES.CONSTANTS.DEFAULT_SNAP_TURN_DEG}
  },

  init: function() 
  {
    const Context_AF = this;
    Context_AF.trackpadX = 0.0;
    Context_AF.trackpadY = 0.0;

    Context_AF.keyboard_detection();
    Context_AF.trackpad_detection();
    Context_AF.joystick_detection();
    //Context_AF.touchscreen_detection(); //this detects swipes but niot sure required as A-Frame already does this
  },
  update: function(oldData) 
  {
    const Context_AF = this;
    const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

  },
  rotateBody: function(angleDeg) 
  {
    this.el.object3D.rotation.y += THREE.Math.degToRad(angleDeg);
  },
  keyboard_detection: function () {
    const Context_AF = this;

    //keyboard controls
    document.addEventListener('keyup', (event) => {
        const keyName = event.key;
        
        if (keyName === 'ArrowRight' || keyName == 'd' || keyName == 'D') {
            Context_AF.rotateBody(-Context_AF.data.snap_amount);
        }

        if (keyName === 'ArrowLeft' || keyName == 'a' || keyName == 'a') {
            Context_AF.rotateBody(Context_AF.data.snap_amount);
        }
    }, false);
  },
  trackpad_detection: function () {
    const Context_AF = this;

    //Oculusgo / gearVR / trackpad controllers ////
    Context_AF.el.addEventListener('trackpadmoved', function(event) {
        Context_AF.trackpadX = event.detail.x;
        Context_AF.trackpadY = event.detail.y;
    });

    Context_AF.el.addEventListener('trackpadup', function(event) { 
        //check which side of trackpad is being pressed
        if (Context_AF.trackpadX > 0.0) {
            Context_AF.rotateBody(-Context_AF.data.snap_amount);
        }
        else if (Context_AF.trackpadX < 0.0) {
            Context_AF.rotateBody(Context_AF.data.snap_amount);
        }
    });
  },
  joystick_detection: function () {
    const Context_AF = this;

    //need to set timer and thresholds
    const threshold         = 0.8;      //max is 1.0 for all the way to the side
    const snapTime          = 800;     //milliseconds between "snaps" if thumbstick help down
    let canSnapLeft         = true;    //set a max time on this
    let snapLeftTimerFunc   = null;
    let canSnapRight        = true;    //set a max time on this
    let snapRightTimerFunc  = null;

    //Oculusgo / gearVR / trackpad controllers ////
    Context_AF.el.addEventListener('thumbstickmoved', function(event) {
        Context_AF.trackpadX = event.detail.x;
        Context_AF.trackpadY = event.detail.y;
        
        if (Context_AF.trackpadX > threshold) {
            if (canSnapLeft === true) {
                Context_AF.rotateBody(-Context_AF.data.snap_amount);
                canSnapLeft = false;
                snapLeftTimerFunc = setTimeout(() => { canSnapLeft = true }, snapTime);

                //clear opposite direction
                canSnapRight = true;
                clearTimeout( snapRightTimerFunc );
            }
        }
        else if (Context_AF.trackpadX < -threshold) {
            if (canSnapRight === true) {
                Context_AF.rotateBody(Context_AF.data.snap_amount);
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
    const Context_AF = this;

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
        Context_AF.handleTouchSwipe(swipedir)
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
    console.log("SWIPE DETECTED!");
    console.log("DIR: " + swipeDir);
  }
});