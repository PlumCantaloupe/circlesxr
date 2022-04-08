
AFRAME.registerComponent('tilt-turn', {
    schema: {
        criticalAngle: { type: "number", default: 14 },
        turnScale: { type: "number", default: 0.0025 },
        maxTurn: { type: "number", default: 16 }
    },
    init: function () {
        var tiltturn = document.querySelector("[camera]").components["tilt-turn"];
        if (!AFRAME.utils.device.isMobile()) {
            return;
        }
        console.log("tilt-turn: init.");
        // if there is no look-controls, put it in.
        if (this.el.components["look-controls"] === undefined) {
            this.el.setAttribute("look-controls", "true");
        }
    },
    update: function() {
    },
    tick: function () {
        //console.log("tt"); 
        if (!AFRAME.utils.device.isMobile()) {
            return;
        }
        var tiltturn = document.querySelector("[camera]").components["tilt-turn"];
        if (!tiltturn.isPlaying) {
            return;
            console.log("tilt-turn isn't playing.")
        }
        var cam = this.el;
        var camrot = cam.getAttribute("rotation");
        var x = camrot.x;
        var y = camrot.y;
        //var z = camrot.z;
        if (x < -75 || x > 75) {
            // the headset is looking down or up - don't spin
            //console.log("headset out of range. x:", x);
            return;
        }
        var lc = this.el.components["look-controls"];
        var z = THREE.Math.radToDeg(lc.hmdEuler._z);
        var turnScale = this.data.turnScale; // .003;
        var maxTurn = this.data.maxTurn; // 16;
        var criticalAngle = this.data.criticalAngle; // 14;
        var thisTurn = 0;
        var yo = lc.yawObject;
        //console.log("z:", z);
        if (z < (criticalAngle * -1)) {
            //console.log("turning right");
            // z is less than -25, e.g. -30
            thisTurn = z + criticalAngle;
            if (thisTurn < (maxTurn * -1)) {
                thisTurn = (maxTurn * -1);
            }
            thisTurn *= turnScale;
            yo.rotation._y += thisTurn;
            yo.rotation.y += thisTurn;
        } else if (z > criticalAngle) {
            //console.log("turning left");
            // z is more than 25, e.g. 30
            thisTurn = z - criticalAngle;
            if (thisTurn > maxTurn) {
                thisTurn = maxTurn;
            }
            thisTurn *= turnScale;
            yo.rotation._y += thisTurn;
            yo.rotation.y += thisTurn;
        }

    },
    pause: function () {
        // we get isPlaying automatically from A-Frame
    },
    play: function () {
        // we get isPlaying automatically from A-Frame
    },
    remove: function () {
        this.el.setAttribute("look-controls", "false");
    }
});