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
        const CONTEXT_COMP = this;

        CONTEXT_COMP.targetContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetContainer.setAttribute('id', 'target_container');
        CONTEXT_COMP.el.appendChild(CONTEXT_COMP.targetContainer);

        CONTEXT_COMP.targetsOuterContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetsOuterContainer.setAttribute('id', 'targets_outer_container');
        CONTEXT_COMP.targetContainer.appendChild(CONTEXT_COMP.targetsOuterContainer);

        CONTEXT_COMP.createTargets();

        CONTEXT_COMP.moveTargets(0, 0, 5.0);
    },
    update: function (oldData) {
        //called 
    },
    tick: function (time, timeDelta) {
    },
    createTargets: function() {
        const CONTEXT_COMP = this;

        //create fitt's law "spheres"
        const NUM_TARGETS   = 8;
        const ANGLE_BETWEEN = THREE.Math.degToRad(360.0/NUM_TARGETS);
        const ARC_RADIUS    = 2.0;
        const TARGET_GEO    = {primitive:'sphere', radius:0.2, segmentsWidth:20, segmentsHeight:20};
        const TARGET_MAT    = {transparent:false, color:'rgb(57, 187, 130)', emissive:'rgb(7, 137, 80)', shader:'flat'};

        let pointerVec  = new THREE.Vector3(0.0, ARC_RADIUS, 0.0);
        const rotateVec = new THREE.Vector3(1.0, 0.0, 0.0);
        const createTarget_f = (x_pos, y_pos, z_pos, unique_id, parentElem) => {
            let target = document.createElement('a-entity');
            target.setAttribute('id', unique_id);
            target.setAttribute('class', 'interactive fitts_target');
            target.setAttribute('geometry', TARGET_GEO);
            target.setAttribute('material', TARGET_MAT);
            target.setAttribute('position', {x:x_pos, y:y_pos, z:z_pos});
            target.setAttribute('circles-interactive-object', {hovered_scale:1.2, clicked_scale:1.2, neutral_scale:1.0});
            parentElem.appendChild(target);
        };

        //add middle target
        createTarget_f(0.0, 0.0, 0.0, 'target_selection_0', CONTEXT_COMP.targetContainer);

        //add exterior targets
        for (let i = 0; i < NUM_TARGETS; i++) {
            createTarget_f(pointerVec.x, pointerVec.y, pointerVec.z, 'target_selection_' + (i+1), CONTEXT_COMP.targetsOuterContainer);
            pointerVec.applyAxisAngle(rotateVec, ANGLE_BETWEEN);
        }
    },
    //x_deg [0, 360], y_deg [0, 360], depth [number]. This will always be set relative to eye/camera position
    moveTargets : function(x_deg, y_deg, depth) {
        const CONTEXT_COMP = this;

        let pointerVec  = new THREE.Vector3(depth, 0.0, 0.0); //moving off x-axis as default rotation of cam looks down x
        const X_VEC     = new THREE.Vector3(1.0, 0.0, 0.0);
        const Y_VEC     = new THREE.Vector3(0.0, 1.0, 0.0);
        CONTEXT_COMP.targetContainer.object3D.position.set(5.0, 0.0, 0.0);
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