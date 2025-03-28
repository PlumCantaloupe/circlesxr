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
        num_targets:                {type:'int',        default:8},     //for now this cannot be modified during run-time
        pointer_updatetime_ms:      {type:'number',     default:50},
        click_updown_distance_max:  {type:'number',     default:0.5}, //distance allowed between mouseDown and mouseUp for a click
        show_labels:                {type:'boolean',    default:false},
        target_active:              {type:'string',     default:''},
        targets_XY_rot:             {type:'vec2',       default:{x: 0, y: 0}},
        targets_width:              {type:'number',     default:0.2},
        targets_depth:              {type:'number',     default:10.0},
        targets_radius:             {type:'number',     default:4.0},
        targets:                    {type:'array',      default:[0]},
        // visible_look_target:        {type:'boolean',    default:false},
        // visible_select_target:      {type:'boolean',    default:false}
    },
    init() {
        const CONTEXT_COMP = this;
        
        CONTEXT_COMP.SELECT_TARGET_CLASS    = 'select-target';
        CONTEXT_COMP.LOOK_TARGET_CLASS      = 'look-target';
        CONTEXT_COMP.FITTS_TARGET_CLASS     = 'fitts-target';
        CONTEXT_COMP.TARGET_CONTAINER_CLASS = 'target_container';

        CONTEXT_COMP.TARGET_ID_PREFIX       = 'FT_'

        CONTEXT_COMP.inactiveMatProps   = {transparent:false, color:'rgb(57, 187, 130)', shader:'flat'};
        CONTEXT_COMP.activeMatProps     = {transparent:false, color:'rgb(224, 148, 25)', shader:'flat'};

        CONTEXT_COMP.targetContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetContainer.setAttribute('id', 'targets_container');
        CONTEXT_COMP.targetContainer.object3D.position.set(0.0, CONTEXT_COMP.data.participant_height, 0.0); //want it set at a "eye height"
        CONTEXT_COMP.el.appendChild(CONTEXT_COMP.targetContainer);

        //so we can move forwards/backwards then rotate targets (parent) container around origin pivot point
        CONTEXT_COMP.targetsInnerContainer = document.createElement('a-entity');
        CONTEXT_COMP.targetsInnerContainer.setAttribute('id', 'targets_inner_container');
        CONTEXT_COMP.targetContainer.appendChild(CONTEXT_COMP.targetsInnerContainer);

        //let's keep a reference to our research manager
        CONTEXT_COMP.researchSystem = document.querySelector('a-scene').systems['research-manager'];

        CONTEXT_COMP.createTargets();

        //simulate click function (we need more control here so we can track non-click of targets or errors)
        CONTEXT_COMP.mouseDownId = '';
        CONTEXT_COMP.lastPointerPos = new THREE.Vector3();
        const scene = document.querySelector('a-scene');

        if (document.querySelector('#primary_pointer')) {
            CONTEXT_COMP.createChecksForNullSelection();
        }
        else {
            scene.addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, CONTEXT_COMP.createChecksForNullSelection.bind(CONTEXT_COMP));
        }
    },
    update: function (oldData) {
        const CONTEXT_COMP  = this;
        const data          = CONTEXT_COMP.data;

        if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

        //highlight color change
        if (oldData.show_labels !== data.show_labels) {
            const targets = CONTEXT_COMP.targetsInnerContainer.querySelectorAll('.label');
            targets.forEach( (target) => {
                target.setAttribute('visible', data.show_labels);
            });
        }

        if (oldData.target_active !== data.target_active) {
            const targets = CONTEXT_COMP.targetsInnerContainer.querySelectorAll('.' + CONTEXT_COMP.FITTS_TARGET_CLASS);
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
                const setFunc = (e) => {
                    const pointer = document.querySelector('#primary_pointer');
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
            pointerVec.applyAxisAngle(X_VEC, THREE.MathUtils.degToRad(data.targets_XY_rot.x));
            pointerVec.applyAxisAngle(Y_VEC, THREE.MathUtils.degToRad(data.targets_XY_rot.y));

            //now make sure all targets perpendicular to look vector. Order very important here since we are deadling with Euler angles
            CONTEXT_COMP.targetContainer.object3D.rotation.set(THREE.MathUtils.degToRad(data.targets_XY_rot.x), THREE.MathUtils.degToRad(data.targets_XY_rot.y), 0.0, 'YXZ');
        }

        if (oldData.targets_width !== data.targets_width) {
            const targets = CONTEXT_COMP.targetsInnerContainer.querySelectorAll('.' + CONTEXT_COMP.TARGET_CONTAINER_CLASS);
            targets.forEach( (target) => {
                target.object3D.scale.set(data.targets_width, data.targets_width, data.targets_width);
            });
        }

        if (oldData.targets_depth !== data.targets_depth) {
            CONTEXT_COMP.targetsInnerContainer.object3D.position.set(0.0, 0.0, -data.targets_depth);
        }

        if (oldData.targets_radius !== data.targets_radius) {
            const targets = CONTEXT_COMP.targetsInnerContainer.querySelectorAll('.' + CONTEXT_COMP.TARGET_CONTAINER_CLASS);
            targets.forEach( (target) => {
                const dirVec = target.object3D.userData.dirVec;
                target.object3D.position.set(dirVec.x * data.targets_radius, dirVec.y * data.targets_radius, dirVec.z * data.targets_radius);
            });
        }

        // if (oldData.visible_look_target !== data.visible_look_target) {
        //     CONTEXT_COMP.setTargetsVisibility(CONTEXT_COMP.LOOK_TARGET_CLASS, data.visible_look_target);
        // }

        // if (oldData.visible_select_target !== data.visible_select_target) {
        //     CONTEXT_COMP.setTargetsVisibility(CONTEXT_COMP.SELECT_TARGET_CLASS, data.visible_select_target);
        // }

        if (oldData.targets !== data.targets) {
            const targets = this.targetsInnerContainer.querySelectorAll('.' + CONTEXT_COMP.FITTS_TARGET_CLASS);
            targets.forEach( (target) => {
                target.setAttribute('circles-interactive-visible', false);

                for (let i = 0; i < data.targets.length; i++) {
                    if ('FT_' + data.targets[i] === target.id) {
                        target.setAttribute('circles-interactive-visible', true);
                        break;
                    }
                }
            });
        }
    },
    tick: function (time, timeDelta) {},
    createChecksForNullSelection : function () {
        const CONTEXT_COMP      = this;
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

                const data = CIRCLES.RESEARCH.createExpData();
                data.event_type     = CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_ERROR;
                data.exp_id         = CONTEXT_COMP.researchSystem.experimentID;
                data.user_id        = CONTEXT_COMP.researchSystem.socket.id;
                data.user_type      = CONTEXT_COMP.researchSystem.userType;

                CONTEXT_COMP.researchSystem.sendSelectExpData(data);
            }
            CONTEXT_COMP.mouseDownId = '';
        });

        CONTEXT_COMP.el.sceneEl.removeEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, CONTEXT_COMP.createChecksForNullSelection.bind(CONTEXT_COMP));
    },
    // setTargetsVisibility: function(className, isVisible) {
    //     const targets = this.targetsInnerContainer.querySelectorAll('.' + className);
    //     targets.forEach( (elem) => {
    //         elem.setAttribute('circles-interactive-visible', isVisible);
    //     });
    // },
    createTargets: function() {
        const CONTEXT_COMP = this;

        //create fitt's law "spheres"
        const ANGLE_BETWEEN = THREE.MathUtils.degToRad(360.0/CONTEXT_COMP.data.num_targets);
        const TARGET_GEO    = {primitive:'sphere', radius:1.0, segmentsWidth:20, segmentsHeight:20};

        let pointerVec  = new THREE.Vector3(0.0, 1.0, 0.0); //we only want normalized direction here so we can adjust "radius" of each element later
        const rotateVec = new THREE.Vector3(0.0, 0.0, 1.0);
        const createTarget_f = (unique_id, x_pos, y_pos, z_pos, className) => {
            //create target container to hold target and label
            let targetConta = document.createElement('a-entity');
            targetConta.setAttribute('class', CONTEXT_COMP.TARGET_CONTAINER_CLASS);
            CONTEXT_COMP.targetsInnerContainer.appendChild(targetConta);

            let target = document.createElement('a-entity');
            target.setAttribute('id',       unique_id);
            target.setAttribute('class',    CONTEXT_COMP.FITTS_TARGET_CLASS + ' ' + className);
            target.setAttribute('geometry', TARGET_GEO);
            target.setAttribute('material', CONTEXT_COMP.inactiveMatProps);
            target.setAttribute('position', {x:0.0, y:0.0, z:0.0});
            target.setAttribute('circles-interactive-object', {type:'outline', hover_scale:1.2, click_scale:1.3, neutral_scale:1.0});
            target.setAttribute('circles-interactive-visible', true);
            target.setAttribute('networked', {template:'#' + CIRCLES.NETWORKED_TEMPLATES.INTERACTIVE_OBJECT, attachTemplateToLocal:true, synchWorldTransforms:true});
            targetConta.appendChild(target);

            //save direction vector so we can adjust later
            let dirVec = new THREE.Vector3(x_pos, y_pos, z_pos);
            dirVec.normalize(); //shoudl be length 1 already but just in case :))))
            targetConta.object3D.userData.dirVec    = dirVec; //save it here so we can check it out later
            target.object3D.userData.isActive       = false;

            //connect to click listener for selection detection
            target.addEventListener('click', CONTEXT_COMP.fittsTargetSelect.bind(CONTEXT_COMP))

            //create label
            let label = document.createElement('a-entity');
            label.setAttribute('class', 'label');
            label.setAttribute('text', {value:unique_id, font:'roboto', width:TARGET_GEO.radius * 20.0, color:'#FFFFFF', align:'center'});
            label.setAttribute('position', {x:0.0, y:0.0 + (TARGET_GEO.radius * 2.0), z:0.0});
            label.setAttribute('networked', {template:'#' + CIRCLES.NETWORKED_TEMPLATES.TEXT, attachTemplateToLocal:true, synchWorldTransforms:true});
            targetConta.appendChild(label);
        };

        //add middle target (reserving this id_0 for this element as it will present the special case of look-finding/selecting )
        createTarget_f(CONTEXT_COMP.TARGET_ID_PREFIX + '0', 0.0, 0.0, 0.0, CONTEXT_COMP.LOOK_TARGET_CLASS);

        //add exterior targets
        for (let i = 0; i < CONTEXT_COMP.data.num_targets; i++) {

            //create id that follows "side-to-side" structure of https://www.yorku.ca/mack/interaccion2017.html
            //i.e. clockwise for 8 targets will be 1, 3, 5, 7, 2, 4, 6, 8 ...
             let ft_i = (i < CONTEXT_COMP.data.num_targets/2) ?  (i * 2) + 1 : (i - CONTEXT_COMP.data.num_targets/2) * 2 + 2;

            createTarget_f(CONTEXT_COMP.TARGET_ID_PREFIX + ft_i, pointerVec.x, pointerVec.y, pointerVec.z, 'select-target');
            pointerVec.applyAxisAngle(rotateVec, -ANGLE_BETWEEN);
        }
//!!
    },
    fittsTargetSelect : function (e) {
        const CONTEXT_COMP = this;
        let selectedElem = e.srcElement;

        console.log('SELECTION: Target Selected:' + selectedElem.id + ' active:' + selectedElem.object3D.userData.isActive);

        //check if this is an active target
        if (selectedElem.object3D.userData.isActive) {
            //Fitts target selected
            const data = CIRCLES.RESEARCH.createExpData();
            data.event_type     = CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_STOP;
            data.exp_id         = CONTEXT_COMP.researchSystem.experimentID;
            data.user_id        = CONTEXT_COMP.researchSystem.socket.id;
            data.user_type      = CONTEXT_COMP.researchSystem.userType;

            CONTEXT_COMP.researchSystem.sendSelectExpData(data);
        }
        else {
            //Incorrect fitts target selected
            const data = CIRCLES.RESEARCH.createExpData();
            data.event_type     = CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_ERROR;
            data.exp_id         = CONTEXT_COMP.researchSystem.experimentID;
            data.user_id        = CONTEXT_COMP.researchSystem.socket.id;
            data.user_type      = CONTEXT_COMP.researchSystem.userType;

            CONTEXT_COMP.researchSystem.sendSelectExpData(data);
        }
    }
});