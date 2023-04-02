
AFRAME.registerComponent('robot-controls', {
    schema: {
        movementTimeMS:         {type:'number', default:500},   //ms
        rotationIncrementDeg:   {type:'number', default:30},   //deg
    },
    init() {
        const CONTEXT_AF = this;
        const DATA = CONTEXT_AF.data;

        CONTEXT_AF.robot_arm = document.querySelector('#robot_arm');
        CONTEXT_AF.robotShoulder_leftright  = robot_arm.querySelector('.pivot.shoulder.leftright');
        CONTEXT_AF.robotShoulder_overback   = robot_arm.querySelector('.pivot.shoulder.overback');
        CONTEXT_AF.robotElbow_leftright     = robot_arm.querySelector('.pivot.elbow.leftright');
        CONTEXT_AF.robotElbow_overback      = robot_arm.querySelector('.pivot.elbow.overback');

        //get elem refs
        CONTEXT_AF.robot_controls = CONTEXT_AF.el;
        CONTEXT_AF.shoulderControls = {
            overButton:     CONTEXT_AF.el.querySelector('.shoulder_controls > .over_button'),
            backButton:     CONTEXT_AF.el.querySelector('.shoulder_controls > .back_button'),
            leftButton:     CONTEXT_AF.el.querySelector('.shoulder_controls > .left_button'),
            rightButton:    CONTEXT_AF.el.querySelector('.shoulder_controls > .right_button')
        };
        CONTEXT_AF.elbowControls = {
            overButton:     CONTEXT_AF.el.querySelector('.elbow_controls > .over_button'),
            backButton:     CONTEXT_AF.el.querySelector('.elbow_controls > .back_button'),
            leftButton:     CONTEXT_AF.el.querySelector('.elbow_controls > .left_button'),
            rightButton:    CONTEXT_AF.el.querySelector('.elbow_controls > .right_button')
        };

        const allRobotPivots    = CONTEXT_AF.robot_arm.querySelectorAll('.pivot');
        const allControlButtons = CONTEXT_AF.robot_controls.querySelectorAll('.button');

        //make sure button doesn't work until animation is complete
        CONTEXT_AF.animInProgress = false;

        CONTEXT_AF.animBeginFunc = function(e) {
            console.log('animationbegin', e.detail);
            CONTEXT_AF.animInProgress = true;
        };

        CONTEXT_AF.animEndFunc = function(e) {
            console.log('animationcomplete', e.detail);
            CONTEXT_AF.animInProgress = false;
        };

        CONTEXT_AF.ROT_TYPE = {
            OVER_BACK:  'overback',
            LEFT_RIGHT: 'leftright',
        };

        //add listeners to all pivots
        allRobotPivots.array.forEach(p => {
            p.addEventListener('animationbegin', CONTEXT_AF.animBeginFunc);
            p.addEventListener('animationcomplete', CONTEXT_AF.animEndFunc);
        });

        //add listeners to all buttons
        allControlButtons.array.forEach(b => {
            if (b.classList.contains('shoulder')) {

            }
            else if (b.classList.contains('elbow')) {

            }
        });

        //jointType:    ['shoulder', 'elbow']
        //rotType:      ['overback', 'leftright']
        CONTEXT_AF.rotateElem = function(elem, rotType, toDeg) {
            console.log('click', elem.id);
            if (CONTEXT_AF.animInProgress === false) {
                console.log('moving');
                let rotAmt = null;
                if (rotType === CONTEXT_AF.ROT_TYPE.OVER_BACK) {
                    rotAmt = {x:THREE.MathUtils.radToDeg(elem.object3D.rotation.x) + toDeg, y:0, z:0};
                }
                else {
                    rotAmt = {x:0, y:THREE.MathUtils.radToDeg(elem.object3D.rotation.y) + toDeg, z:0};
                }
                elem.setAttribute('animation__robot',   {   property:'rotation', 
                                                            dur:CONTEXT_AF.data.movementTimeMS, 
                                                            to:rotAmt,
                                                            easing:'linear'
                                                        });
            }
            else {
                console.log('not moving');
            }
        }

        //animate
        CONTEXT_AF.shoulderControls.overButton.addEventListener('click', function() {
            CONTEXT_AF.rotateElem(CONTEXT_AF.robotShoulder_overback, CONTEXT_AF.ROT_TYPE.OVER_BACK, CONTEXT_AF.data.rotationIncrementDeg);
        });
        CONTEXT_AF.shoulderControls.backButton.addEventListener('click', function() {
            CONTEXT_AF.rotateElem(CONTEXT_AF.robotShoulder_overback, CONTEXT_AF.ROT_TYPE.OVER_BACK, -CONTEXT_AF.data.rotationIncrementDeg);
        });
        CONTEXT_AF.shoulderControls.leftButton.addEventListener('click', function() {
            CONTEXT_AF.rotateElem(CONTEXT_AF.robotShoulder_leftright, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, -CONTEXT_AF.data.rotationIncrementDeg);
        });
        CONTEXT_AF.shoulderControls.rightButton.addEventListener('click', function() {
            CONTEXT_AF.rotateElem(CONTEXT_AF.robotShoulder_leftright, CONTEXT_AF.ROT_TYPE.LEFT_RIGHT, CONTEXT_AF.data.rotationIncrementDeg);
        });
    },
    update() {
        const CONTEXT_AF = this;
        const data = this.data;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet
    },
    remove() {},
    tick(time, timeDelta) {},
});