/*
    This component will create a variety of selection targets in the following steps:
        1 - create a target around the user
        2 - when target is clicked [data.num_targets] additional targets will be created around it with one highlighted
        3 - when highlighted target is selected, start over to step 1
*/
AFRAME.registerComponent('research-selection-tasks', {
    multiple: false,
    schema: {
        participant_height:         {type:'number',     default:1.6},
        show_labels:                {type:'boolean',    default:false},
        num_targets:                {type:'int',        default:8},     //for now this cannot be modified during run-time
        target_active:              {type:'string',     default:''},
        pointer_updatetime_ms:      {type:'number',     default:50},
        click_updown_distance_max:  {type:'number',     default:0.5}, //this dictates how much the pointer can move between mousedown and mouseup to register a clic
        visible:                    {type:'boolean',    default:true},

        //are we loading in our own script? See format example in {root}/world/Testbed/scripts/experiment_script.json
        experiment_script_url:      {type:'string',     default:''},

        //these properties only work if we do load in our own script (used for random placements et al.)
        num_select_tasks_per_look:  {type:'int',        default:3},     //number of select tasks to be presented after 1 look/find task
        targets_XY_rot:             {type:'vec2',       default:{x: 0, y: 0}},
        targets_size:               {type:'number',     default:0.2},
        targets_depth:              {type:'number',     default:5.0},
        targets_radius:             {type:'number',     default:2.5}
    },
    init() {
        const CONTEXT_COMP = this;
        CONTEXT_COMP.currNumSelectTasks = 0;        //will need this to track when a new look task is completed. See data.num_select_tasks_per_look

        //set up some constants
        CONTEXT_COMP.TARGET_TYPE = {
            LOOK        : 'LOOK',
            SELECT      : 'SELECT',
            INCORRECT   : 'INCORRECT',
            MISSED      : 'MISSED'
        };

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

        //let's keep a reference to our research manager
        CONTEXT_COMP.researchSystem = document.querySelector('a-scene').systems['research-manager'];

        CONTEXT_COMP.createTargets();

        if (CONTEXT_COMP.data.experiment_script_url === '') {
            //start somewhere
            CONTEXT_COMP.transformTargets(  CONTEXT_COMP.data.targets_XY_rot.x, 
                CONTEXT_COMP.data.targets_XY_rot.y, 
                CONTEXT_COMP.data.targets_depth, 
                CONTEXT_COMP.data.targets_size, 
                CONTEXT_COMP.data.targets_radius, 
                'FT_3'  //let's start somewhere :)
            ); 
        }
        else {
             //then we will load in our own script
             CONTEXT_COMP.researchSystem.loadExperimentScript(CONTEXT_COMP.data.experiment_script_url);
        }

        //simulate click function (we need more control here so we can track non-click of targets or errors)
        CONTEXT_COMP.mouseDownId = '';
        CONTEXT_COMP.lastPointerPos = new THREE.Vector3();
        const scene = document.querySelector('a-scene');

        scene.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, (e1) => {
            const primary_pointer   = document.querySelector('#primary_pointer');
            const raycaster         = primary_pointer.components['raycaster'];

            let getRayEndPos_f = () => {
                let newVec = new THREE.Vector3();
                if (AFRAME.utils.device.isMobileVR()) {
                    newVec = new THREE.Vector3(raycaster.data.direction.x, raycaster.data.direction.y, raycaster.data.direction.z).transformDirection(primary_pointer.object3D.matrixWorld);
                }
                else {
                    newVec = raycaster.data.direction.clone();
                }
                newVec.normalize();
                newVec.multiplyScalar(raycaster.data.far);
                newVec.add(raycaster.data.origin);

                return newVec;
            };

            primary_pointer.addEventListener('mousedown', (e2) => {
                CONTEXT_COMP.mouseDownId    = (e2.detail.intersectedEl) ? e2.detail.intersectedEl.id : '';
                CONTEXT_COMP.lastPointerPos = getRayEndPos_f();
            });

            primary_pointer.addEventListener('mouseup', (e3) => {
                const mouseUpId = (e3.detail.intersectedEl) ? e3.detail.intersectedEl.id : '';

                //check distance between last endPos (on mouseDown) and this one (mouseUp)
                //want to make sure this isn't a click registered when just dragging to look around
                CONTEXT_COMP.lastPointerPos.sub( getRayEndPos_f() );

                if (CONTEXT_COMP.mouseDownId !== mouseUpId || mouseUpId === '' && CONTEXT_COMP.lastPointerPos.length() < CONTEXT_COMP.data.click_updown_distance_max) {
                    console.log('SELECTION: No target selected');

                    const data =    {  
                        target_id:      'na',
                        target_index:   -1,    //no index for no selection :D
                        target_type:    CONTEXT_COMP.TARGET_TYPE.MISSED,
                        targets_X_rot:  CONTEXT_COMP.data.targets_XY_rot.x,
                        targets_Y_rot:  CONTEXT_COMP.data.targets_XY_rot.y,
                        targetDepth:    CONTEXT_COMP.data.targets_depth,
                        targetSize:     CONTEXT_COMP.data.targets_size,
                        fittsRadius:    CONTEXT_COMP.data.targets_radius
                    };
                    CONTEXT_COMP.sendData(CIRCLES.RESEARCH.EVENTS.SELECTION_ERROR, data);
                }
                CONTEXT_COMP.mouseDownId = '';
            });
        });

        //start experiment (TODO: will want a trigger to start this later)
        CONTEXT_COMP.sendData(CIRCLES.RESEARCH.EVENTS.EXPERIMENT_START, {});
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

        if (oldData.targets_size !== data.targets_size) {
            const targets = CONTEXT_COMP.targetContainer.querySelectorAll('.target_container');
            targets.forEach( (target) => {
                target.object3D.scale.set(data.targets_size, data.targets_size, data.targets_size);
            });
        }

        if (oldData.targets_depth !== data.targets_depth) {
            CONTEXT_COMP.targetsInnerContainer.object3D.position.set(0.0, 0.0, -data.targets_depth);
            CONTEXT_COMP.targetsOuterContainer.object3D.position.set(0.0, 0.0, -data.targets_depth);
        }

        if (oldData.targets_radius !== data.targets_radius) {
            const targets = CONTEXT_COMP.targetsOuterContainer.querySelectorAll('.target_container');
            targets.forEach( (target) => {
                const dirVec = target.object3D.userData.dirVec;
                target.object3D.position.set(dirVec.x * data.targets_radius, dirVec.y * data.targets_radius, dirVec.z * data.targets_radius);
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

        if (oldData.targets_XY_rot !== data.targets_XY_rot) {
            let pointerVec  = new THREE.Vector3(0.0, 0.0, 0.0); //moving off x-axis as default rotation of cam looks down x
            const X_VEC     = new THREE.Vector3(1.0, 0.0, 0.0);
            const Y_VEC     = new THREE.Vector3(0.0, 1.0, 0.0);

            //rotate around "imaginary sphere"
            pointerVec.applyAxisAngle(X_VEC, THREE.Math.degToRad(data.targets_XY_rot.x));
            pointerVec.applyAxisAngle(Y_VEC, THREE.Math.degToRad(data.targets_XY_rot.y));

            //now make sure all targets perpendicular to look vector. Order very important here since we are deadling with Euler angles
            CONTEXT_COMP.targetContainer.object3D.rotation.set(THREE.Math.degToRad(data.targets_XY_rot.x), THREE.Math.degToRad(data.targets_XY_rot.y), 0.0, 'YXZ');
        }

        if (oldData.visible !== data.visible) {
            CONTEXT_COMP.targetContainer.setAttribute('visible', data.visible);
        }
    },
    tick: function (time, timeDelta) {
    },
    sendData : function (type, data) {
        const CONTEXT_COMP  = this;
        CONTEXT_COMP.experimentID   = '';

        //make sure system is active
        if (!CONTEXT_COMP.researchSystem) {
            console.warn('Research System not connected.');
            return;
        }

        switch (type) {
            case CIRCLES.RESEARCH.EVENTS.EXPERIMENT_START: {
                CONTEXT_COMP.targetsInnerContainer.setAttribute('visible', true);  //show middle target

                CONTEXT_COMP.experimentID = CIRCLES.getUUID();
                console.log(CONTEXT_COMP.experimentID);
                CONTEXT_COMP.researchSystem.captureData(CIRCLES.RESEARCH.EVENTS.EXPERIMENT_START, CONTEXT_COMP.experimentID, Date.now(), data);
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.EXPERIMENT_STOP: {
                CONTEXT_COMP.researchSystem.captureData(CIRCLES.RESEARCH.EVENTS.EXPERIMENT_STOP, CONTEXT_COMP.experimentID, Date.now(), data);
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_START: {
                CONTEXT_COMP.researchSystem.captureData(CIRCLES.RESEARCH.EVENTS.SELECTION_START, CONTEXT_COMP.experimentID, Date.now(), data);
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_STOP: {
                CONTEXT_COMP.researchSystem.captureData(CIRCLES.RESEARCH.EVENTS.SELECTION_STOP, CONTEXT_COMP.experimentID, Date.now(), data);
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_ERROR: {
                CONTEXT_COMP.researchSystem.captureData(CIRCLES.RESEARCH.EVENTS.SELECTION_ERROR, CONTEXT_COMP.experimentID, Date.now(), data);
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.TRANSFORM_UPDATE: {
                CONTEXT_COMP.researchSystem.captureData(CIRCLES.RESEARCH.EVENTS.TRANSFORM_UPDATE, CONTEXT_COMP.experimentID, Date.now(), data);
            }
            break;
        }
    },
    createTargets: function() {
        const CONTEXT_COMP = this;

        //create fitt's law "spheres"
        const ANGLE_BETWEEN = THREE.Math.degToRad(360.0/CONTEXT_COMP.data.num_targets);
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
            target.setAttribute('networked', {template:'#interactive-object-template', attachTemplateToLocal:true, synchWorldTransforms:true});
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

        //add middle target (reserving this id_0 for this element as it will present the special case of look-finding/selecting )
        createTarget_f('FT_0', 0.0, 0.0, 0.0, true, CONTEXT_COMP.targetsInnerContainer);
        CONTEXT_COMP.targetsInnerContainer.setAttribute('visible', false);  //hide everything until experiment starts
        CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', false);  //hide other targets until look selected

        //add exterior targets
        for (let i = 0; i < CONTEXT_COMP.data.num_targets; i++) {
            createTarget_f('FT_' + (i+1), pointerVec.x, pointerVec.y, pointerVec.z, false, CONTEXT_COMP.targetsOuterContainer);
            pointerVec.applyAxisAngle(rotateVec, ANGLE_BETWEEN);
        }
    },
    //leftRight_deg [0, 360], leftRight_deg [0, 360], depth [number]. This will always be set relative to eye/camera position
    transformTargets : function(xRot, yRot, targetsDepth, targetsSize, targetsRadius, activeTarget_id) {
        console.log('Setting new target transforms');
        console.log('    horizontal angle: ' + xRot);
        console.log('    vertical angle: '   + yRot);
        console.log('    target depth: '     + targetsDepth);
        console.log('    target size: '      + targetsSize);
        console.log('    fitts radius: '     + targetsRadius);
        console.log('    active target: '    + activeTarget_id);

        //set depth and target size
        this.el.setAttribute('research-selection-tasks', {targets_XY_rot:{x:xRot, y:yRot}, targets_size:targetsSize, targets_depth:targetsDepth, targets_radius:targetsRadius, target_active:activeTarget_id});
    },
    fittsTargetSelect : function (e) {
        const CONTEXT_COMP = this;
        let selectedElem = e.srcElement;

        //if a look target show fitts
        if (selectedElem.id === 'FT_0') {
            //then look selected, show other targets
            console.log('SELECTION: Look Target Selected: ' + selectedElem.id + ' is active.');
            
            //Look target selected
            const data =    {  
                target_id:      selectedElem.id,
                target_index:   parseInt(selectedElem.id.split('_')[1]),    //grab index of target from id
                target_type:    CONTEXT_COMP.TARGET_TYPE.LOOK,
                targets_X_rot:  CONTEXT_COMP.data.targets_XY_rot.x,
                targets_Y_rot:  CONTEXT_COMP.data.targets_XY_rot.y,
                targetDepth:    CONTEXT_COMP.data.targets_depth,
                targetSize:     CONTEXT_COMP.data.targets_size,
                fittsRadius:    CONTEXT_COMP.data.targets_radius
            };
            CONTEXT_COMP.sendData(CIRCLES.RESEARCH.EVENTS.SELECTION_STOP,   data);
            CONTEXT_COMP.sendData(CIRCLES.RESEARCH.EVENTS.SELECTION_START,  data);

            //hide look target and show fitts circle targets
            CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', true);
            CONTEXT_COMP.targetsInnerContainer.setAttribute('visible', false);
        }
        else {
            //check if this is an active target
            if (selectedElem.object3D.userData.isActive) {
                console.log('SELECTION: Target Selected: ' + selectedElem.id + ' is active.');

                //Fitts target selected
                const data =    {  
                    target_id:      selectedElem.id,
                    target_index:   parseInt(selectedElem.id.split('_')[1]),    //grab index of target from id
                    target_type:    CONTEXT_COMP.TARGET_TYPE.SELECT,
                    targets_X_rot:  CONTEXT_COMP.data.targets_XY_rot.x,
                    targets_Y_rot:  CONTEXT_COMP.data.targets_XY_rot.y,
                    targetDepth:    CONTEXT_COMP.data.targets_depth,
                    targetSize:     CONTEXT_COMP.data.targets_size,
                    fittsRadius:    CONTEXT_COMP.data.targets_radius
                };
                CONTEXT_COMP.sendData(CIRCLES.RESEARCH.EVENTS.SELECTION_STOP,   data);
                CONTEXT_COMP.sendData(CIRCLES.RESEARCH.EVENTS.SELECTION_START,  data);

                //check if we have completed numSelect tasks yet
                if (++CONTEXT_COMP.currNumSelectTasks >= CONTEXT_COMP.data.num_select_tasks_per_look) {
                    //show new look target and hide fitts' targets
                    CONTEXT_COMP.targetsOuterContainer.setAttribute('visible', false);
                    CONTEXT_COMP.targetsInnerContainer.setAttribute('visible', true);
                    CONTEXT_COMP.currNumSelectTasks = 0;    //reset num select targets

                    //random new state
                    CONTEXT_COMP.randomTransform(-30, 30, -180, 180, 3.0, 10.0, 0.2, 0.6, 2.5, 5.0);
                }
                else {
                    //show another active target, but keep same state

                    //set random target to set as active
                    const targets       = CONTEXT_COMP.targetContainer.querySelectorAll('.fitts_target');
                    const numTargets    = targets.length;

                    //don't want same target to keep choosing until different :)
                    let randTargetStr = 'FT_' + (Math.floor(Math.random() * (numTargets - 1)) + 1);
                    while (randTargetStr === selectedElem.id ) {
                        randTargetStr = 'FT_' + (Math.floor(Math.random() * (numTargets - 1)) + 1);
                    }

                    CONTEXT_COMP.transformTargets(  CONTEXT_COMP.data.targets_XY_rot.x, 
                                                    CONTEXT_COMP.data.targets_XY_rot.y, 
                                                    CONTEXT_COMP.data.targets_depth, 
                                                    CONTEXT_COMP.data.targets_size,
                                                    CONTEXT_COMP.data.targets_radius,
                                                    randTargetStr
                                                );
                }
            }
            else {
                console.log('SELCTION: Target Selected: ' + selectedElem.id + ' is not active.');
                //record data/error

                //Incorrect fitts target selected
                const data =    {  
                    target_id:      selectedElem.id,
                    target_index:   parseInt(selectedElem.id.split('_')[1]),    //grab index of target from id
                    target_type:    CONTEXT_COMP.TARGET_TYPE.INCORRECT,
                    targets_X_rot:  CONTEXT_COMP.data.targets_XY_rot.x,
                    targets_Y_rot:  CONTEXT_COMP.data.targets_XY_rot.y,
                    targetDepth:    CONTEXT_COMP.data.targets_depth,
                    targetSize:     CONTEXT_COMP.data.targets_size,
                    fittsRadius:    CONTEXT_COMP.data.targets_radius
                };
                CONTEXT_COMP.sendData(CIRCLES.RESEARCH.EVENTS.SELECTION_ERROR, data);
            }
        }
    },
    randomTransform : function (xRot_min, xRot_max, yRot_Min, yRot_max, depth_min, depth_max, size_min, size_max, fittsRadius_min, fittsRadius_max) {
        const CONTEXT_COMP = this;

        //set random target to set as active
        const targets = CONTEXT_COMP.targetContainer.querySelectorAll('.fitts_target');
        const numTargets = targets.length;
        const randTargetStr = 'FT_' + (Math.floor(Math.random() * (numTargets - 1)) + 1);

        CONTEXT_COMP.transformTargets(  CONTEXT_COMP.getRandomNumber(xRot_min, xRot_max), 
                                        CONTEXT_COMP.getRandomNumber(yRot_Min, yRot_max), 
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