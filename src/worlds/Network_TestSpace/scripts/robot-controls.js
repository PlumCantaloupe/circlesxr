
AFRAME.registerComponent('robot-controls', {
    schema: {
        rotationIncrementRad:   {type:'number', default:0.03},  //radians
        rotationIntervalMS:     {type:'number', default:20},    //ms (how fast this moves on button press)
    },
    init() {
        const CONTEXT_AF = this;
        CONTEXT_AF.rotateShoulder_OverBack_Amt  = 0.0;
        CONTEXT_AF.rotateShoulder_LeftRight_Amt = 0.0;
        CONTEXT_AF.rotateElbow_OverBack_Amt     = 0.0;
        CONTEXT_AF.rotateElbow_LeftRight_Amt    = 0.0;

        //jointType:    ['shoulder', 'elbow']
        //rotType:      ['overback', 'leftright']
        CONTEXT_AF.rotateElem = function(jointType, rotType, angRad) {
            if (rotType === CONTEXT_AF.ROT_TYPE.OVER_BACK) {
                if (jointType === CONTEXT_AF.JOINT_TYPE.SHOULDER) {
                    CONTEXT_AF.rotateShoulder_OverBack_Amt = angRad;
                }
                else if (jointType === CONTEXT_AF.JOINT_TYPE.ELBOW) {
                    CONTEXT_AF.rotateElbow_OverBack_Amt = angRad;
                }
            }
            else if (rotType === CONTEXT_AF.ROT_TYPE.LEFT_RIGHT) {
                if (jointType === CONTEXT_AF.JOINT_TYPE.SHOULDER) {
                    CONTEXT_AF.rotateShoulder_LeftRight_Amt = angRad;
                }
                else if (jointType === CONTEXT_AF.JOINT_TYPE.ELBOW) {
                    CONTEXT_AF.rotateElbow_LeftRight_Amt = angRad;
                }
            }
        }

        CONTEXT_AF.robot_arm = document.querySelector('#robot_arm');
        CONTEXT_AF.robotShoulder_leftright  = robot_arm.querySelector('.pivot.shoulder.left.right');
        CONTEXT_AF.robotShoulder_overback   = robot_arm.querySelector('.pivot.shoulder.over.back');
        CONTEXT_AF.robotElbow_leftright     = robot_arm.querySelector('.pivot.elbow.left.right');
        CONTEXT_AF.robotElbow_overback      = robot_arm.querySelector('.pivot.elbow.over.back');

        //get elem refs
        CONTEXT_AF.robot_controls = document.querySelector('#robot_controls');
        CONTEXT_AF.shoulderControls = {
            overButton:     CONTEXT_AF.robot_controls.querySelector('.shoulder > .over'),
            backButton:     CONTEXT_AF.robot_controls.querySelector('.shoulder > .back'),
            leftButton:     CONTEXT_AF.robot_controls.querySelector('.shoulder > .left'),
            rightButton:    CONTEXT_AF.robot_controls.querySelector('.shoulder > .right')
        };
        CONTEXT_AF.elbowControls = {
            overButton:     CONTEXT_AF.robot_controls.querySelector('.elbow > .over'),
            backButton:     CONTEXT_AF.robot_controls.querySelector('.elbow > .back'),
            leftButton:     CONTEXT_AF.robot_controls.querySelector('.elbow > .left'),
            rightButton:    CONTEXT_AF.robot_controls.querySelector('.elbow > .right')
        };

        CONTEXT_AF.shoulderDisplayElem  = CONTEXT_AF.robot_controls.querySelector('.display_shoulder');
        CONTEXT_AF.elbowDisplayElem     = CONTEXT_AF.robot_controls.querySelector('.display_elbow');

        CONTEXT_AF.ROT_TYPE = {
            OVER_BACK:  'overback',
            LEFT_RIGHT: 'leftright',
        };

        CONTEXT_AF.JOINT_TYPE = {
            SHOULDER:   'shoulder',
            ELBOW:      'elbow',
        };

        //animate shoulder
        CONTEXT_AF.shoulderControls.overButton.addEventListener('mousedown', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.OVER_BACK, CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.shoulderControls.overButton.addEventListener('mouseup', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.OVER_BACK, 0.0); });
        
        CONTEXT_AF.shoulderControls.backButton.addEventListener('mousedown', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.OVER_BACK, -CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.shoulderControls.backButton.addEventListener('mouseup', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.OVER_BACK, 0.0); });
        
        CONTEXT_AF.shoulderControls.leftButton.addEventListener('mousedown', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, -CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.shoulderControls.leftButton.addEventListener('mouseup', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, 0.0); });
        
        CONTEXT_AF.shoulderControls.rightButton.addEventListener('mousedown', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.shoulderControls.rightButton.addEventListener('mouseup', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, 0.0); });

        //animate elbow
        CONTEXT_AF.elbowControls.overButton.addEventListener('mousedown', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.OVER_BACK, CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.elbowControls.overButton.addEventListener('mouseup', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.OVER_BACK, 0.0); });
        
        CONTEXT_AF.elbowControls.backButton.addEventListener('mousedown', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.OVER_BACK, -CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.elbowControls.backButton.addEventListener('mouseup', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.OVER_BACK, 0.0); });
        
        CONTEXT_AF.elbowControls.leftButton.addEventListener('mousedown', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, -CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.elbowControls.leftButton.addEventListener('mouseup', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, 0.0); });
        
        CONTEXT_AF.elbowControls.rightButton.addEventListener('mousedown', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.elbowControls.rightButton.addEventListener('mouseup', function() { CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, 0.0); });
    },
    update(oldData) {
        const CONTEXT_AF = this;
        const data = this.data;

        if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

        if ( (oldData.rotationIntervalMS !== data.rotationIntervalMS) && (data.rotationIntervalMS !== '') ) {
            // Set up the tick throttling.
            CONTEXT_AF.tick = AFRAME.utils.throttleTick(CONTEXT_AF.tick, data.rotationIntervalMS, CONTEXT_AF);
        }
    },
    // remove() {},
    tick(time, timeDelta) {
        //adjust rotation
        this.robotShoulder_leftright.object3D.rotation.y  += this.rotateShoulder_LeftRight_Amt;
        this.robotShoulder_overback.object3D.rotation.x   += this.rotateShoulder_OverBack_Amt;
        this.robotElbow_leftright.object3D.rotation.y     += this.rotateElbow_LeftRight_Amt;
        this.robotElbow_overback.object3D.rotation.x      += this.rotateElbow_OverBack_Amt;

        //adjust displays
        //Elbow\n\nX-Rot:00\nY-Rot:00
        if (this.shoulderDisplayElem) {
            this.shoulderDisplayElem.setAttribute( 'text', {value:'Shoulder\n\nX-Rot: ' + Math.floor(THREE.MathUtils.radToDeg(this.robotShoulder_overback.object3D.rotation.x)) + 
                                                                            '\nY-Rot: ' + Math.floor(THREE.MathUtils.radToDeg(this.robotShoulder_leftright.object3D.rotation.y))});
        }

        if (this.elbowDisplayElem) {
            this.elbowDisplayElem.setAttribute( 'text', {value:'Elbow\n\nX-Rot: ' + Math.floor(THREE.MathUtils.radToDeg(this.robotElbow_overback.object3D.rotation.x)) + 
                                                                      '\nY-Rot: ' + Math.floor(THREE.MathUtils.radToDeg(this.robotElbow_leftright.object3D.rotation.y))});
        }

    },
});