/*
    This component will be in charge of collecting and sending data to server to be saved to file
*/
AFRAME.registerComponent('data-collection', {
    schema: {},
    init() {
        const Context_AF = this;
        const scene      = document.querySelector('a-scene');

        scene.addEventListener(CIRCLES.EVENTS.NAF_CONNECTED, function (event) {
            console.log( "NAF.connection.adapter connected ...." );
            NAF.connection.adapter.socket.emit('dataTest', {testData:'it works!!'});
        });
    },
    update() {}
});

/*
    This component will create a variety of selection targets in the following steps:
        1 - create a target around the user
        2 - when target is clicked 13 additional targets will be created around it with one highlighted
        3 - when highlighted target is selected, start over to step 1
*/
AFRAME.registerComponent('fitts-explore', {
    schema: {},
    init() {
        //called on 
        const Context_AF = this;
        const scene      = document.querySelector('a-scene');

        Context_AF.createTargets();
    },
    update: function (oldData) {
        //called 
    },
    tick: function (time, timeDelta) {
    },
    createTargets: function() {
        const CONTEXT_AF = this;

        //create fitt's law "spheres"
        const NUM_TARGETS   = 8;
        const ANGLE_BETWEEN = THREE.Math.degToRad(360.0/NUM_TARGETS);
        const ARC_RADIUS    = 4.0;
        const TARGET_GEO    = {primitive:'sphere', radius:0.5, segmentsWidth:20, segmentsHeight:20};
        const TARGET_MAT    = {transparent:false, color:'rgb(57, 187, 130)', emissive:'rgb(7, 137, 80)'};

        let pointerVec  = new THREE.Vector3(ARC_RADIUS, 0.0, 0.0);
        const rotateVec = new THREE.Vector3(0.0, 1.0, 0.0);

        for (let i = 0; i < NUM_TARGETS; i++) {
            let target = document.createElement('a-entity');
            target.setAttribute('id', 'target_' + i);
            target.setAttribute('class', 'interactive fitts_target');
            target.setAttribute('geometry', TARGET_GEO);
            target.setAttribute('material', TARGET_MAT);
            target.setAttribute('position', {x:pointerVec.x, y:pointerVec.y, z:pointerVec.z});
            target.setAttribute('circles-interactive-object', {});
            CONTEXT_AF.el.appendChild(target);

            console.log(pointerVec);
            pointerVec.applyAxisAngle(rotateVec, ANGLE_BETWEEN);
        }
    }
});

AFRAME.registerSystem('research-manager', {
    init() {
        //called on 
        console.log('Starting research-system!');
    },
    tick: function (time, timeDelta) {
        
    }
});

// //component default functions
// AFRAME.registerComponent('some-name', {
//     schema: {},
//     init() {
//         //called after aframe initialized and this component is setup
//     },
//     update: function (oldData) {
//         //called whenever schema properties are changed
//     },
//     updateSchema: function(data) {
//         //called on evey update (when properties change)
//     },
//     tick: function (time, timeDelta) {
//         //called on every scene render frame
//     },
//     tick: function (time, timeDelta, camera) {
//         //called after every render frame (i.e. after tick)
//     },
//     pause: function () {
//         //called when scene or entity pauses
//     },
//     play: function () {
//         //called when scene or entity plays/resumes
//     },
//     remove: function() {
//         //called when component is removed from entity
//     }
// });