
AFRAME.registerComponent('robot-controls', {
    schema: {
        rotationIncrementRad:   {type:'number', default:0.03},  //radians
        rotationIntervalMS:     {type:'number', default:20},    //ms (how fast this moves on button press)
    },
    init() {
        const CONTEXT_AF = this;
        CONTEXT_AF.connected = false;
        CONTEXT_AF.controlsNetworkEventName = 'controls-network-event-name';
        CONTEXT_AF.isMouseDown              = false;

        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            //listen for when others turn on campfire
            CONTEXT_AF.socket.on(CONTEXT_AF.controlsNetworkEventName, function(data) {
                //capture new rotations
                //shoulderOverBackAmt, shoulderLeftRightAmt, elbowOverBackAmt, elbowLeftRightAmt, room, world
                CONTEXT_AF.updateRobotParts(data.shoulderOverBackAmt, data.shoulderLeftRightAmt, data.elbowOverBackAmt, data.elbowLeftRightAmt, true);
            });
        };

        //check if circle networking is ready. If not, add an eent to listen for when it is ...
        if (CIRCLES.isCirclesWebsocketReady()) {
            CONTEXT_AF.createNetworkingSystem();
        }
        else {
            const wsReadyFunc = function() {
                CONTEXT_AF.createNetworkingSystem();
                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }

        CONTEXT_AF.createButtonAndRobotConnections();
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
        this.updateRobotParts(this.rotateShoulder_OverBack_Amt, this.rotateShoulder_LeftRight_Amt, this.rotateElbow_OverBack_Amt, this.rotateElbow_LeftRight_Amt, true);

        // we will send event over network that buttons are being pressed so that everything synchs up (and both clients can move the robot arm)
        // this event will not be sent to itself so this will only go to the "other" client to synch. We still want to move the "invisible" networked parts
        // so if one client drops we are still at the same spot
        if (this.connected === true && this.isMouseDown === true) { //don't want this firing unless mouse is pressed
            this.socket.emit(this.controlsNetworkEventName, {   shoulderOverBackAmt:    this.rotateShoulder_OverBack_Amt,
                                                                shoulderLeftRightAmt:   this.rotateShoulder_LeftRight_Amt,
                                                                elbowOverBackAmt:       this.rotateElbow_OverBack_Amt,
                                                                elbowLeftRightAmt:      this.rotateElbow_LeftRight_Amt,
                                                                room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                                                            });
        }
    },
    updateRobotParts: function(shoulderOverBackAmt, shoulderLeftRightAmt, elbowOverBackAmt, elbowLeftRightAmt, updateDisplays) {
        //adjust rotation
        this.robotShoulder_overback.object3D.rotation.x   += shoulderOverBackAmt;
        this.robotShoulder_leftright.object3D.rotation.y  += shoulderLeftRightAmt;
        this.robotElbow_overback.object3D.rotation.x      += elbowOverBackAmt;
        this.robotElbow_leftright.object3D.rotation.y     += elbowLeftRightAmt;

        //adjust displays
        //Elbow\n\nX-Rot:00\nY-Rot:00
        if (updateDisplays === true) {
            if (this.shoulderDisplayElem) {
                this.shoulderDisplayElem.setAttribute( 'text', {value:'Shoulder\n\nX-Rot: ' + Math.floor(THREE.MathUtils.radToDeg(this.robotShoulder_overback.object3D.rotation.x)) + 
                                                                                '\nY-Rot: ' + Math.floor(THREE.MathUtils.radToDeg(this.robotShoulder_leftright.object3D.rotation.y))});
            }
    
            if (this.elbowDisplayElem) {
                this.elbowDisplayElem.setAttribute( 'text', {value:'Elbow\n\nX-Rot: ' + Math.floor(THREE.MathUtils.radToDeg(this.robotElbow_overback.object3D.rotation.x)) + 
                                                                          '\nY-Rot: ' + Math.floor(THREE.MathUtils.radToDeg(this.robotElbow_leftright.object3D.rotation.y))});
            }
        }
    },
    createButtonAndRobotConnections: function() {
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

        CONTEXT_AF.shoulderDisplayElem  = CONTEXT_AF.robot_controls.querySelector('#display_shoulder');
        CONTEXT_AF.elbowDisplayElem     = CONTEXT_AF.robot_controls.querySelector('#display_elbow');

        CONTEXT_AF.ROT_TYPE = {
            OVER_BACK:  'overback',
            LEFT_RIGHT: 'leftright',
        };

        CONTEXT_AF.JOINT_TYPE = {
            SHOULDER:   'shoulder',
            ELBOW:      'elbow',
        };

        //animate shoulder
        CONTEXT_AF.shoulderControls.overButton.addEventListener('mousedown', function() { CONTEXT_AF.isMouseDown = true; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.OVER_BACK, CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.shoulderControls.overButton.addEventListener('mouseup', function() { CONTEXT_AF.isMouseDown = false; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.OVER_BACK, 0.0); });
        
        CONTEXT_AF.shoulderControls.backButton.addEventListener('mousedown', function() { CONTEXT_AF.isMouseDown = true; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.OVER_BACK, -CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.shoulderControls.backButton.addEventListener('mouseup', function() { CONTEXT_AF.isMouseDown = false; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.OVER_BACK, 0.0); });
        
        CONTEXT_AF.shoulderControls.leftButton.addEventListener('mousedown', function() { CONTEXT_AF.isMouseDown = true; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, -CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.shoulderControls.leftButton.addEventListener('mouseup', function() { CONTEXT_AF.isMouseDown = false; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, 0.0); });
        
        CONTEXT_AF.shoulderControls.rightButton.addEventListener('mousedown', function() { CONTEXT_AF.isMouseDown = true; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.shoulderControls.rightButton.addEventListener('mouseup', function() { CONTEXT_AF.isMouseDown = false; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.SHOULDER, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, 0.0); });

        //animate elbow
        CONTEXT_AF.elbowControls.overButton.addEventListener('mousedown', function() { CONTEXT_AF.isMouseDown = true; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.OVER_BACK, CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.elbowControls.overButton.addEventListener('mouseup', function() { CONTEXT_AF.isMouseDown = false; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.OVER_BACK, 0.0); });
        
        CONTEXT_AF.elbowControls.backButton.addEventListener('mousedown', function() { CONTEXT_AF.isMouseDown = true; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.OVER_BACK, -CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.elbowControls.backButton.addEventListener('mouseup', function() { CONTEXT_AF.isMouseDown = false; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.OVER_BACK, 0.0); });
        
        CONTEXT_AF.elbowControls.leftButton.addEventListener('mousedown', function() { CONTEXT_AF.isMouseDown = true; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, -CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.elbowControls.leftButton.addEventListener('mouseup', function() { CONTEXT_AF.isMouseDown = false; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, 0.0); });
        
        CONTEXT_AF.elbowControls.rightButton.addEventListener('mousedown', function() { CONTEXT_AF.isMouseDown = true; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, CONTEXT_AF.data.rotationIncrementRad); });
        CONTEXT_AF.elbowControls.rightButton.addEventListener('mouseup', function() { CONTEXT_AF.isMouseDown = false; CONTEXT_AF.rotateElem(CONTEXT_AF.JOINT_TYPE.ELBOW, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, 0.0); });
    }
});