/*
    This component will create a variety of selection targets in the following steps:
        1 - create a target around the user
        2 - when target is clicked 13 additional targets will be created around it with one highlighted
        3 - when highlighted target is selected, start over to step 1
*/
AFRAME.registerComponent('fitts-explore', {
    multiple: false,
    schema: {
        participant_height:     {type:'number',     default:1.6},
        include_find_target:    {type:'boolean',    default:true},
        show_labels:            {type:'boolean',    default:false},
        target_size:            {type:'number',     default:0.2},
        target_depth:           {type:'number',     default:5.0},
        fitts_radius:           {type:'number',     default:2.5},
        target_active:          {type:'string',     default:''},
        pointer_updatetime:     {type:'number',     default:'50'},
    },
    init() {
        const CONTEXT_COMP = this;
        CONTEXT_COMP.researchSystem = document.querySelector('a-scene').systems['research-manager'];

        CONTEXT_COMP.inactiveMatProps   = {transparent:false, color:'rgb(57, 187, 130)', shader:'flat'};
        CONTEXT_COMP.activeMatProps     = {transparent:false, color:'rgb(224, 148, 25)', shader:'flat'};

        CONTEXT_COMP.targetContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetContainer.setAttribute('id', 'target_container');
        CONTEXT_COMP.targetContainer.object3D.position.set(0.0, CONTEXT_COMP.data.participant_height, 0.0); //want it set at a "eye height"
        CONTEXT_COMP.el.appendChild(CONTEXT_COMP.targetContainer);

        CONTEXT_COMP.targetsInnerContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetsInnerContainer.setAttribute('id', 'targets_inner_container');
        CONTEXT_COMP.targetContainer.appendChild(CONTEXT_COMP.targetsInnerContainer);

        CONTEXT_COMP.targetsOuterContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetsOuterContainer.setAttribute('id', 'targets_outer_container');
        CONTEXT_COMP.targetContainer.appendChild(CONTEXT_COMP.targetsOuterContainer);

        //create box that we will detect "wrong clicks" on
        // CONTEXT_COMP.errorBox = document.createElement('a-entity');
        // CONTEXT_COMP.errorBox.setAttribute('id', 'error_box');
        // CONTEXT_COMP.errorBox.setAttribute('class', 'interactive');
        // CONTEXT_COMP.errorBox.setAttribute('geometry', {primitive:'box', width:20, height:20, depth:30});
        // CONTEXT_COMP.errorBox.setAttribute('material', {shader:'flat', color:'#00FF00', side:'back', transparent:false});
        // CONTEXT_COMP.el.sceneEl.appendChild(CONTEXT_COMP.errorBox);

        // CONTEXT_COMP.errorBox.addEventListener('click', (e) => {
        //     console.log('SELECTION: No target selected');
        // });

        CONTEXT_COMP.createTargets();
        CONTEXT_COMP.transformTargets(0, 0, CONTEXT_COMP.data.target_depth, CONTEXT_COMP.data.target_size, 2.5, 'FT_3'); //let's start somewhere :)

        //simulate click function (we need more control here so we can track non-click of targets or errors)
        CONTEXT_COMP.mouseDownId = '';
        CONTEXT_COMP.lastPointerPos = new THREE.Vector3();
        const scene = document.querySelector('a-scene');
        scene.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, (e1) => {
            const primary_pointer   = document.querySelector('#primary_pointer');
            const raycaster         = primary_pointer.components['raycaster'];
            let dirVec              = new THREE.Vector3();

            primary_pointer.addEventListener('mousedown', (e2) => {
                console.log(e2);
                CONTEXT_COMP.mouseDownId    = (e2.detail.intersectedEl) ? e2.detail.intersectedEl.id : '';

                //set last "click" position
                CONTEXT_COMP.lastPointerPos.copy(raycaster.data.direction);
                CONTEXT_COMP.lastPointerPos.normalize();
                CONTEXT_COMP.lastPointerPos.multiplyScalar(raycaster.data.far);
                CONTEXT_COMP.lastPointerPos.add(raycaster.data.origin);

                console.log(CONTEXT_COMP.lastPointerPos);

                let temp = document.createElement('a-entity');
                temp.setAttribute('geometry', {primitive:'sphere', radius:0.5});
                temp.setAttribute('material', {color:'#FF0000'});
                temp.setAttribute('position', CONTEXT_COMP.lastPointerPos);
                CONTEXT_COMP.el.sceneEl.appendChild(temp);
            });

            primary_pointer.addEventListener('mouseup', (e3) => {
                const mouseUpId = (e3.detail.intersectedEl) ? e3.detail.intersectedEl.id : '';
                if (CONTEXT_COMP.mouseDownId !== mouseUpId || mouseUpId === '') {
                    console.log(e3);
                    console.log('SELECTION: No target selected');
                }
                CONTEXT_COMP.mouseDownId = '';
            });
        });
    },
    update: function (oldData) {
        const CONTEXT_COMP  = this;
        const data          = CONTEXT_COMP.data;

        if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

        //highlight color change
        if (oldData.show_labels !== data.show_labels) {
            const targets = CONTEXT_COMP.targetContainer.querySelectorAll('.label');
            targets.forEach( (target) => {
                target.setAttribute('visible', data.show_labels);
            });
        }

        if (oldData.target_size !== data.target_size) {
            const targets = CONTEXT_COMP.targetContainer.querySelectorAll('.target_container');
            targets.forEach( (target) => {
                target.object3D.scale.set(data.target_size, data.target_size, data.target_size);
            });
        }

        if (oldData.target_depth !== data.target_depth) {
            CONTEXT_COMP.targetsInnerContainer.object3D.position.set(0.0, 0.0, -data.target_depth);
            CONTEXT_COMP.targetsOuterContainer.object3D.position.set(0.0, 0.0, -data.target_depth);
        }

        if (oldData.fitts_radius !== data.fitts_radius) {
            const targets = CONTEXT_COMP.targetsOuterContainer.querySelectorAll('.target_container');
            targets.forEach( (target) => {
                const dirVec = target.object3D.userData.dirVec;
                target.object3D.position.set(dirVec.x * data.fitts_radius, dirVec.y * data.fitts_radius, dirVec.z * data.fitts_radius);
            });
        }

        if (oldData.target_active !== data.target_active) {
            const targets = CONTEXT_COMP.targetsOuterContainer.querySelectorAll('.fitts_target');
            targets.forEach( (target) => {
                target.setAttribute('material', CONTEXT_COMP.inactiveMatProps);
                target.object3D.userData.isActive = false;

                //set active target 
                if (target.id === data.target_active) {
                    console.log('setting active target: ' + target.id);
                    target.setAttribute('material', CONTEXT_COMP.activeMatProps);
                    target.object3D.userData.isActive = true;
                }
            });
        }

        if (oldData.pointer_updatetime !== data.pointer_updatetime) {
            const primary_pointer = document.querySelector('#primary_pointer');

            if (primary_pointer) {
                primary_pointer.setAttribute('raycaster', {interval:data.pointer_updatetime});
            }
            else {
                const scene = document.querySelector('a-scene');

                console.log(primary_pointer);
                const setFunc = (e) => {
                    const pointer = document.querySelector('#primary_pointer');
                    console.log(pointer);
                    pointer.setAttribute('raycaster', {interval:data.pointer_updatetime});
                    scene.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, setFunc );
                };

                scene.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, setFunc );
            }
        }
    },
    tick: function (time, timeDelta) {
    },
    createTargets: function() {
        const CONTEXT_COMP = this;

        //create fitt's law "spheres"
        const NUM_TARGETS   = 8;
        const ANGLE_BETWEEN = THREE.Math.degToRad(360.0/NUM_TARGETS);
        const TARGET_GEO    = {primitive:'sphere', radius:1.0, segmentsWidth:20, segmentsHeight:20};

        let pointerVec  = new THREE.Vector3(0.0, 1.0, 0.0); //we only want normalized direction here so we can adjust "radius" of each element later
        const rotateVec = new THREE.Vector3(0.0, 0.0, 1.0);
        const createTarget_f = (unique_id, x_pos, y_pos, z_pos, isActive, parentElem) => {
            //create target
            let targetConta = document.createElement('a-entity');
            targetConta.setAttribute('class', 'target_container');
            parentElem.appendChild(targetConta);

            let target = document.createElement('a-entity');
            target.setAttribute('id',       unique_id);
            target.setAttribute('class',    'interactive fitts_target');
            target.setAttribute('geometry', TARGET_GEO);
            target.setAttribute('material', (isActive) ? CONTEXT_COMP.activeMatProps : CONTEXT_COMP.inactiveMatProps);
            target.setAttribute('position', {x:0.0, y:0.0, z:0.0});
            target.setAttribute('circles-interactive-object', {hovered_scale:1.2, clicked_scale:1.3, neutral_scale:1.0});
            targetConta.appendChild(target);

            //save direction vector so we can adjust later
            let dirVec = new THREE.Vector3(x_pos, y_pos, z_pos);
            dirVec.normalize(); //shoudl be length 1 already but just in case :))))
            targetConta.object3D.userData.dirVec    = dirVec; //save it here so we can check it out later
            target.object3D.userData.isActive       = isActive;

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
            createTarget_f('FT_0', 0.0, 0.0, 0.0, true, CONTEXT_COMP.targetsInnerContainer);

            //hide other targets until look selected
            CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', false);
        }

        //add exterior targets
        for (let i = 0; i < NUM_TARGETS; i++) {
            createTarget_f('FT_' + (i+1), pointerVec.x, pointerVec.y, pointerVec.z, false, CONTEXT_COMP.targetsOuterContainer);
            pointerVec.applyAxisAngle(rotateVec, ANGLE_BETWEEN);
        }
    },
    //leftRight_deg [0, 360], leftRight_deg [0, 360], depth [number]. This will always be set relative to eye/camera position
    transformTargets : function(hori_angle, vert_angle, targetDepth, targetSize, fittsRadius, activeTarget_id) {
        console.log('Setting new target transforms');
        console.log('    horizontal angle: ' + hori_angle);
        console.log('    vertical angle: '   + vert_angle);
        console.log('    target depth: '     + targetDepth);
        console.log('    target size: '      + targetSize);
        console.log('    fitts radius: '     + fittsRadius);
        console.log('    active target: '    + activeTarget_id);

        const CONTEXT_COMP = this;

        let pointerVec  = new THREE.Vector3(0.0, 0.0, 0.0); //moving off x-axis as default rotation of cam looks down x
        const X_VEC     = new THREE.Vector3(1.0, 0.0, 0.0);
        const Y_VEC     = new THREE.Vector3(0.0, 1.0, 0.0);

        //rotate around "imaginary sphere"
        pointerVec.applyAxisAngle(X_VEC, THREE.Math.degToRad(vert_angle));
        pointerVec.applyAxisAngle(Y_VEC, THREE.Math.degToRad(hori_angle));

        //now make sure all targets perpendicular to look vector. Order very important here since we are deadling with Euler angles
        CONTEXT_COMP.targetContainer.object3D.rotation.set(THREE.Math.degToRad(vert_angle), THREE.Math.degToRad(hori_angle), 0.0, 'YXZ');

        //set depth and target size
        CONTEXT_COMP.el.setAttribute('fitts-explore', {target_size:targetSize, target_depth:targetDepth, fitts_radius:fittsRadius, target_active:activeTarget_id});

        //send data to research system
        const data =    {  
                            experiment_id:      '',
                            experiment_date:    '',
                            type:               CIRCLES.RESEARCH.EVENTS.SELECTION_START,
                            time:               Date.now(),
                            target_id:          activeTarget_id,
                            hori_angle:         hori_angle,
                            vert_angle:         vert_angle,
                            targetDepth:        targetDepth,
                            targetSize:         targetSize,
                            fittsRadius:        fittsRadius
                        };
        CONTEXT_COMP.researchSystem.sendData(data);
    },
    fittsTargetSelect : function (e) {
        const CONTEXT_COMP = this;
        let selectedElem = e.srcElement;

        //if a look target show fitts
        if (CONTEXT_COMP.data.include_find_target === true) {
            if (selectedElem.id === 'FT_0') {
                //then look selected, show other targets
                console.log('SELECTION: Look Target Selected: ' + selectedElem.id + ' is active.');
                CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', true);
                CONTEXT_COMP.targetsInnerContainer.setAttribute('visible', false);
                
                //TODO: record data
            }
            else {
                //check if this is an active target
                if (selectedElem.object3D.userData.isActive) {
                    console.log('SELECTION: Target Selected: ' + selectedElem.id + ' is active.');
                    CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', false);
                    CONTEXT_COMP.targetsInnerContainer.setAttribute('visible', true);

                    //TODO: record data
                    //TODO: move to next state
                    CONTEXT_COMP.randomTransform(-180, 180, -50, 50, 3.0, 10.0, 0.2, 0.6, 2.5, 5.0);
                }
                else {
                    console.log('SELCTION: Target Selected: ' + selectedElem.id + ' is not active.');
                    //record data/error
                }
            }
        }
        else {
            //TODO: move to next state
            //TODO: record data
        }
    },
    randomTransform : function (horiAngle_Min, horiAngle_max, vertAngle_min, vertAngle_max, depth_min, depth_max, size_min, size_max, fittsRadius_min, fittsRadius_max) {
        const CONTEXT_COMP = this;

        //set random target to set as active
        const targets = CONTEXT_COMP.targetContainer.querySelectorAll('.fitts_target');
        const numTargets = targets.length;
        const randTargetStr = 'FT_' + (Math.floor(Math.random() * (numTargets - 1)) + 1);

        CONTEXT_COMP.transformTargets(  CONTEXT_COMP.getRandomNumber(horiAngle_Min, horiAngle_max), 
                                        CONTEXT_COMP.getRandomNumber(vertAngle_min, vertAngle_max), 
                                        CONTEXT_COMP.getRandomNumber(depth_min, depth_max), 
                                        CONTEXT_COMP.getRandomNumber(size_min, size_max),
                                        CONTEXT_COMP.getRandomNumber(fittsRadius_min, fittsRadius_max),
                                        randTargetStr
                                    );
    },
    getRandomNumber: function (min, max) {
        return Math.random() * (max - min) + min; //The maximum is inclusive and the minimum is inclusive 
    }
});

//System: Will control data collection and communication with server
AFRAME.registerSystem('research-manager', {
    init() {
        //called on 
        console.log('Starting research-system!');
        const CONTEXT_COMP  = this;
        const scene         = document.querySelector('a-scene');

        CONTEXT_COMP.connected = false;

        scene.addEventListener(CIRCLES.EVENTS.NAF_CONNECTED, function (event) {
            console.log("research-manager: socket connected ....");
            CONTEXT_COMP.socket = NAF.connection.adapter.socket;
            CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENTS.CONNECTED, {message:'ciao! research system connecting.'});
            CONTEXT_COMP.connected = true;
        });
    },
    tick: function (time, timeDelta) {}, 
    sendData: function(data) {
        switch (data.type) {
            case CIRCLES.RESEARCH.EVENTS.EXPERIMENT_START: {

            }
            break;
            case CIRCLES.RESEARCH.EVENTS.EXPERIMENT_STOP: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.TRIAL_START: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.TRIAL_STOP: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_START: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_STOP: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_ERROR: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.TRANSFORM_UPDATE: {
                
            }
            break;
        }

        //this is where we will send data to server via sockets
        //CONTEXT_COMP.socket.emit(data.type, data);
    }
});

//Component: will capture events and pass data to system
// AFRAME.registerComponent('research-manager', {
//     multiple: false,
//     schema: {
//         capture_data:   {type:'boolean', default:true},
//     },
//     init() {
//         //called on 
//         console.log('Starting research-component!');
//         const Context_AF = this;
//     },
//     tick: function (time, timeDelta) {
        
//     }
// });

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