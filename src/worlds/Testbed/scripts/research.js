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
    schema: {
        participant_height:     {type:'number',     default:1.6},
        include_find_target:    {type:'boolean',    default:true},
        show_labels:            {type:'boolean',    default:false},
        target_size:            {type:'number',     default:0.2},
        target_depth:           {type:'number',     default:5.0}    
    },
    init() {
        const CONTEXT_COMP = this;

        CONTEXT_COMP.targetContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetContainer.setAttribute('id', 'target_container');
        CONTEXT_COMP.el.appendChild(CONTEXT_COMP.targetContainer);

        CONTEXT_COMP.targetsInnerContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetsInnerContainer.setAttribute('id', 'targets_inner_container');
        CONTEXT_COMP.targetContainer.appendChild(CONTEXT_COMP.targetsInnerContainer);

        CONTEXT_COMP.targetsOuterContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetsOuterContainer.setAttribute('id', 'targets_outer_container');
        CONTEXT_COMP.targetContainer.appendChild(CONTEXT_COMP.targetsOuterContainer);

        CONTEXT_COMP.createTargets();
        CONTEXT_COMP.moveTargets(0, 0, CONTEXT_COMP.data.target_depth);
    },
    update: function (oldData) {
        const CONTEXT_COMP  = this;
        const data          = CONTEXT_COMP.data;

        if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

        //highlight color change
        if (oldData.show_labels !== data.show_labels) {
            //CONTEXT_COMP.targetsLabelContainer.setAttribute('visible', data.show_labels);
        }

        if (oldData.target_size !== data.target_size) {
            const targets = CONTEXT_COMP.targetContainer.querySelectorAll('.target_containert');
            targets.forEach( (target) => {
                target.object3D.scale.set(data.target_size, data.target_size, data.target_size);
            });
        }

        if (oldData.target_depth !== data.target_depth) {
            //CONTEXT_COMP.targetsLabelContainer.setAttribute('visible', data.show_labels);
            
        }
    },
    tick: function (time, timeDelta) {
    },
    createTargets: function() {
        const CONTEXT_COMP = this;

        //create fitt's law "spheres"
        const NUM_TARGETS   = 8;
        const ANGLE_BETWEEN = THREE.Math.degToRad(360.0/NUM_TARGETS);
        const ARC_RADIUS    = 2.0;
        const TARGET_GEO    = {primitive:'sphere', radius:1.0, segmentsWidth:20, segmentsHeight:20};
        const TARGET_MAT    = {transparent:false, color:'rgb(57, 187, 130)', emissive:'rgb(7, 137, 80)', shader:'flat'};

        let pointerVec  = new THREE.Vector3(0.0, ARC_RADIUS, 0.0);
        const rotateVec = new THREE.Vector3(0.0, 0.0, 1.0);
        const createTarget_f = (x_pos, y_pos, z_pos, unique_id, parentElem) => {
            //create target
            let targetConta = document.createElement('a-entity');
            targetConta.setAttribute('class', 'target_containert');
            targetConta.setAttribute('position', {x:x_pos, y:y_pos, z:z_pos});
            parentElem.appendChild(targetConta);

            let target = document.createElement('a-entity');
            target.setAttribute('id',       unique_id);
            target.setAttribute('class',    'interactive fitts_target');
            target.setAttribute('geometry', TARGET_GEO);
            target.setAttribute('material', TARGET_MAT);
            target.setAttribute('position', {x:0.0, y:0.0, z:0.0});
            target.setAttribute('circles-interactive-object', {hovered_scale:1.2, clicked_scale:1.2, neutral_scale:1.0});
            targetConta.appendChild(target);

            //connect to click listener for selection detection
            target.addEventListener('click', CONTEXT_COMP.fittsTargetSelect.bind(CONTEXT_COMP))

            //create label
            let label = document.createElement('a-entity');
            label.setAttribute('class', 'label');
            label.setAttribute('text', {value:unique_id, font:'roboto', width:TARGET_GEO.radius * 20.0, color:'#FFFFFF', align:'center'});
            label.setAttribute('position', {x:0.0, y:0.0 + (TARGET_GEO.radius * 2.0), z:0.0});
            targetConta.appendChild(label);
        };


        if (CONTEXT_COMP.data.include_find_target === true) {
            //add middle target (reserving this id_0 for this element as it will present the special case of look-finding/selecting )
            createTarget_f(0.0, 0.0, 0.0, 'FT_0', CONTEXT_COMP.targetsInnerContainer);

            //hide other targets until look selected
            CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', false);
        }

        //add exterior targets
        for (let i = 0; i < NUM_TARGETS; i++) {
            createTarget_f(pointerVec.x, pointerVec.y, pointerVec.z, 'FT_' + (i+1), CONTEXT_COMP.targetsOuterContainer);
            pointerVec.applyAxisAngle(rotateVec, ANGLE_BETWEEN);
        }
    },
    //leftRight_deg [0, 360], leftRight_deg [0, 360], depth [number]. This will always be set relative to eye/camera position
    moveTargets : function(leftRight_deg, upDown_deg, depth) {
        const CONTEXT_COMP = this;

        let pointerVec  = new THREE.Vector3(0.0, 0.0, 0.0); //moving off x-axis as default rotation of cam looks down x
        const X_VEC     = new THREE.Vector3(1.0, 0.0, 0.0);
        const Y_VEC     = new THREE.Vector3(0.0, 1.0, 0.0);

        //rotate around "imaginary sphere"
        pointerVec.applyAxisAngle(X_VEC, THREE.Math.degToRad(upDown_deg));
        pointerVec.applyAxisAngle(Y_VEC, THREE.Math.degToRad(leftRight_deg));

        //place target container at appropriate coordinates on "sphere surrounding user" relative to head position
        CONTEXT_COMP.targetContainer.object3D.position.set(0.0, CONTEXT_COMP.data.participant_height, 0.0);
        CONTEXT_COMP.targetsInnerContainer.object3D.position.set(0.0, 0.0, -depth);
        CONTEXT_COMP.targetsOuterContainer.object3D.position.set(0.0, 0.0, -depth);

        //now make sure all targets perpendicular to look vector. Order very important here since we are deadling with Euler angles
        CONTEXT_COMP.targetContainer.object3D.rotation.set(THREE.Math.degToRad(upDown_deg), THREE.Math.degToRad(leftRight_deg), 0.0, 'YXZ');
    },
    fittsTargetSelect : function (e) {
        const CONTEXT_COMP = this;
        let selectedElem = e.srcElement;

        console.log('target Selected: ' + selectedElem.id);

        //if a look target show fitts
        if (CONTEXT_COMP.data.include_find_target === true) {
            if (selectedElem.id === 'FT_0') {
                //then look selected, show other targets
                CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', true);
                CONTEXT_COMP.targetsInnerContainer.setAttribute('visible', false);
                
                //TODO: record data
            }
            else {
                CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', false);
                CONTEXT_COMP.targetsInnerContainer.setAttribute('visible', true);

                //TODO: record data
                //TODO: move to next state
                //angles important here else we get soem strange results. Should probably use quats but only working with two axes ...
                CONTEXT_COMP.moveTargets(CONTEXT_COMP.getRandomIntInclusive(-180, 180), CONTEXT_COMP.getRandomIntInclusive(-50, 50), CONTEXT_COMP.data.target_depth);

            }
        }
        else {
            //TODO: move to next state
            //TODO: record data
        }
    },
    getRandomIntInclusive: function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
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