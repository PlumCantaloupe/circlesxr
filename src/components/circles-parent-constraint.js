'use strict';

AFRAME.registerComponent('circles-parent-constraint', {
  schema: {
      parent:                 {type: "selector", default:null},
      positionOn:             {type: "boolean",  default:true},
      rotationOn:             {type: "boolean",  default:true},
      positionOffset:         {type: "vec3"},
      rotationOffset:         {type: "vec3"},
      updateRate:             {type:'number',    default:100},
      smoothingOn:            {type: "boolean",  default:true},
      smoothingAlpha:         {type: "float",  default:0.1}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    this.psuedoParent         = null;
    this.worldMat_Constraint  = new THREE.Matrix4();
    this.position_E           = new THREE.Vector3();
    this.rotation_E           = new THREE.Quaternion();
    this.scale_E              = new THREE.Vector3();
    this.posMat               = new THREE.Matrix4();
    this.posMat_Off           = new THREE.Matrix4();
    this.rotMat               = new THREE.Matrix4();
    this.rotMat_Off           = new THREE.Matrix4();
    this.scaleMat             = new THREE.Matrix4();
    this.prevTime             = 0;
    this.firstTickRun         = false;
  },
  update: function(oldData)  {
      const CONTEXT_AF    = this;
      const data = this.data;

      if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

      //model change
      if ( (oldData.parent !== data.parent) && data.parent !== null ) {
          //have to keep checking if "parent" is loaded first ...
          let loopCounter = 0;
          const checkChildParentLoadStatus = () => {
              if ( data.parent.hasLoaded && CONTEXT_AF.el.hasLoaded ) {
                  CONTEXT_AF.psuedoParent = data.parent;
                  CONTEXT_AF.setupConstraint();
                  clearInterval(constraintLoop);
              }

              if (++loopCounter > 20) {
                  console.log( "Warning! : problems setting parentConstraint" );
                  clearInterval(constraintLoop);
              }
          };
          const constraintLoop = setInterval(checkChildParentLoadStatus, 100);
      }
  },
  setupConstraint: function () {
      console.log('setting up constraint');

      const CONTEXT_AF    = this;
      const data = this.data;

      CONTEXT_AF.originalPos         = CONTEXT_AF.el.object3D.position.clone();
      CONTEXT_AF.originalRot         = CONTEXT_AF.el.object3D.quaternion.clone();

      //see camera weirdness below
      CONTEXT_AF.isCamera = ('camera' in this.psuedoParent.components);
      CONTEXT_AF.camRig = this.el.sceneEl.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
  },
  tick: function(time, timeDelta) {
     if ( (time - this.prevTime > this.data.updateRate) || (this.firstTickRun === false) ) {
      if (this.psuedoParent !== null) {
          this.position_E.set(0,0,0);
          this.rotation_E.set(0,0,0,1);
          this.scale_E.set(1,1,1);
          this.worldMat_Constraint.identity();
          this.posMat.identity();
          this.posMat_Off.identity();
          this.rotMat.identity();
          this.rotMat_Off.identity();

          //if camera need to handle differently as Oculus browser does not report world matrices properly
          //note this weirdness also appearts to apply to any child of camera
          if (this.isCamera) {
            //this is so messed up. Matrix math doesn't work but adding independently (w/o matrices) does ...???
            this.position_E.addVectors(this.camRig.object3D.position, this.psuedoParent.object3D.position);
            this.rotation_E.multiplyQuaternions(this.camRig.object3D.quaternion, this.psuedoParent.object3D.quaternion);
          }
          else {
            this.psuedoParent.object3D.updateMatrixWorld(true);
		        this.psuedoParent.object3D.matrixWorld.decompose( this.position_E, this.rotation_E, this.scale_E );
          }

          //set matrices
          this.posMat.makeTranslation(this.position_E.x, this.position_E.y, this.position_E.z );
          this.posMat_Off.makeTranslation(this.data.positionOffset.x, this.data.positionOffset.y, this.data.positionOffset.z);
          this.rotMat.makeRotationFromQuaternion(this.rotation_E);
          this.rotMat_Off.makeRotationFromEuler(new THREE.Euler(THREE.MathUtils.DEG2RAD * this.data.rotationOffset.x, THREE.MathUtils.DEG2RAD * this.data.rotationOffset.y, THREE.MathUtils.DEG2RAD * this.data.rotationOffset.z, "XYZ"));

          //set the offsets first
          if (this.data.rotationOn) { 
              this.worldMat_Constraint.premultiply( this.rotMat_Off );
          }
          if (this.data.positionOn) {
              this.worldMat_Constraint.premultiply( this.posMat_Off );
          }

          //set matrix copies
          if (this.data.rotationOn) { 
              this.worldMat_Constraint.premultiply( this.rotMat );
          }
          if (this.data.positionOn) {
              this.worldMat_Constraint.premultiply( this.posMat );
          }

          //set new matrix and update
          this.worldMat_Constraint.decompose( this.position_E, this.rotation_E, this.scale_E );

          if ((this.data.smoothingOn === false) || (this.firstTickRun === false)) {
            console.log('RUNNING');
            this.el.object3D.position.set(this.position_E.x, this.position_E.y, this.position_E.z);
            this.el.object3D.quaternion.set(this.rotation_E.x, this.rotation_E.y, this.rotation_E.z, this.rotation_E.w);
            this.firstTickRun = true;
          }
      }

      this.prevTime = time;
    }

    if ( (this.data.smoothingOn === true) && (this.firstTickRun === true)) {
        this.el.object3D.position.lerp(this.position_E, this.data.smoothingAlpha);
        this.el.object3D.quaternion.slerp(this.rotation_E, this.data.smoothingAlpha);
    }
  },
  remove: function() {
    const CONTEXT_AF = this;
    const thisObject3D = CONTEXT_AF.el.object3D;
    
    thisObject3D.position.set(CONTEXT_AF.originalPos.x, CONTEXT_AF.originalPos.y, CONTEXT_AF.originalPos.z);
    thisObject3D.quaternion.set(this.originalRot.x, this.originalRot.y, this.originalRot.z, this.originalRot.w);
  }
}); 