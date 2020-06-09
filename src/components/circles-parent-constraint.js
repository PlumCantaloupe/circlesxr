'use strict';

AFRAME.registerComponent('circles-parent-constraint', {
  schema: {
      parent:                 {type: "selector", default:null},
      positionOn:             {type: "boolean",  default:true},
      rotationOn:             {type: "boolean",  default:true},
      scaleOn:                {type: "boolean",  default:false},
      positionOffset:         {type: "vec3"},
      rotationOffset:         {type: "vec3"},
      updateRate:             {type:'number', default:10}
  },
  multiple: false, //do not allow multiple instances of this component on this entity
  init: function() {
    this.psuedoParent         = null;
    this.positionOffset       = null;
    this.rotationOffset       = null;
    this.worldMat_Constraint  = new THREE.Matrix4();
    this.position_P           = new THREE.Vector3();
    this.position_C           = new THREE.Vector3();
    this.rotation_P           = new THREE.Quaternion();
    this.rotation_C           = new THREE.Quaternion();
    this.scale_P              = new THREE.Vector3();
    this.scale_C              = new THREE.Vector3();
    this.posMat               = new THREE.Matrix4();
    this.posMat_Off           = new THREE.Matrix4();
    this.rotMat               = new THREE.Matrix4();
    this.rotMat_Off           = new THREE.Matrix4();
    this.scaleMat             = new THREE.Matrix4();
    this.scaleMat_Off         = new THREE.Matrix4();
    this.prevTime             = 0;
  },
  update: function(oldData)  {
      const Context_AF    = this;
      const data = this.data;

      if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

      //model change
      if ( (oldData.parent !== data.parent) && data.parent !== null ) {
          //have to keep checking if everything is ready first ...
          let loopCounter = 0;
          const checkChildParentLoadStatus = () => {
              if ( data.parent.hasLoaded && Context_AF.el.hasLoaded ) {
                  Context_AF.psuedoParent = data.parent;
                  Context_AF.setupConstraint();
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

      const Context_AF    = this;
      const data = this.data;

      Context_AF.originalPos         = Context_AF.el.object3D.position.clone();
      Context_AF.originalRot         = Context_AF.el.object3D.quaternion.clone();
      Context_AF.originalSca         = Context_AF.el.object3D.scale.clone();

    //   Context_AF.el.object3D.matrixAutoUpdate = false;
    //   console.log("auto matrix update:" + Context_AF.el.object3D.matrixAutoUpdate);
  },
  tick: function(time, timeDelta) {
    if ( time - this.prevTime > this.data.updateRate ) {
      if (this.psuedoParent !== null) {
        
          this.positionOffset       = this.data.positionOffset;
          this.rotationOffset       = this.data.rotationOffset;
          this.worldMat_Constraint.identity();
          this.position_P.set(0,0,0);
          this.position_C.set(0,0,0);
          this.rotation_P.set(0,0,0,1);
          this.rotation_C.set(0,0,0,1);
          this.scale_P.set(0,0,0);
          this.scale_C.set(0,0,0);
          this.posMat.identity();
          this.posMat_Off.identity();
          this.rotMat.identity();
          this.rotMat_Off.identity();
          this.scaleMat.identity();
          this.scaleMat_Off.identity();

          //get world matrix of pseudo-parent we want to constrain to
          //this.worldMat_Constraint.copy( this.psuedoParent.object3D.matrixWorld ); 

          this.psuedoParent.object3D.getWorldPosition( this.position_P );
          this.psuedoParent.object3D.getWorldQuaternion( this.rotation_P );
          this.psuedoParent.object3D.getWorldScale( this.scale_P );

          //break down into individual transforms ... thanks for the handy function THREEjs!
          //this.worldMat_Constraint.decompose(this.position_P, this.rotation_P, this.scale_P);

          //set matrices
          this.posMat.makeTranslation(this.position_P.x, this.position_P.y, this.position_P.z );
          this.posMat_Off.makeTranslation(this.positionOffset.x, this.positionOffset.y, this.positionOffset.z);
          this.rotMat.makeRotationFromQuaternion(this.rotation_P);
          this.rotMat_Off.makeRotationFromEuler(new THREE.Euler(THREE.Math.DEG2RAD * this.rotationOffset.x, THREE.Math.DEG2RAD * this.rotationOffset.y, THREE.Math.DEG2RAD * this.rotationOffset.z, "XYZ"));
          if ( this.scale_P.length() > Number.EPSILON ) { //zero-vector will throw a bunch of errors here ...
              this.scaleMat.makeScale(this.scale_P.x, this.scale_P.y, this.scale_P.z);
          }

          //now lets create our new world matrix
          this.worldMat_Constraint.identity();
          this.worldMat_Constraint.scale( this.originalSca  ); //will maintain offset of po, rot, but need to remember scale

        //   if (this.data.rotationOn) { 
        //       this.worldMat_Constraint.premultiply( this.rotMat_Off );
        //   }
        //   if (this.data.scaleOn) {
        //       this.worldMat_Constraint.premultiply( this.scaleMat_Off );
        //   }
        //   if (this.data.positionOn) {
        //       this.worldMat_Constraint.premultiply( this.posMat_Off );
        //   }

          //set matrix copies
          if (this.data.rotationOn) { 
              this.worldMat_Constraint.premultiply( this.rotMat );
          }
          if (this.data.scaleOn) {
              this.worldMat_Constraint.premultiply( this.scaleMat );
          }
          if (this.data.positionOn) {
              this.worldMat_Constraint.premultiply( this.posMat );
          }

          //set new matrix and manually update
          this.invOriginal = new THREE.Matrix4().getInverse(this.el.object3D.matrixWorld);
          this.worldMat_Constraint.multiply( this.invOriginal ); //reset this objects matrices

          //this.worldMat_Constraint.compose( this.position_P, this.rotation_P, this.scale_P );

          this.el.object3D.applyMatrix4( this.worldMat_Constraint );
        //   this.el.object3D.matrix.set(  this.worldMat_Constraint.n11, this.worldMat_Constraint.n12, this.worldMat_Constraint.n13, this.worldMat_Constraint.n14,
        //                                 this.worldMat_Constraint.n21, this.worldMat_Constraint.n22, this.worldMat_Constraint.n23, this.worldMat_Constraint.n24,
        //                                 this.worldMat_Constraint.n31, this.worldMat_Constraint.n32, this.worldMat_Constraint.n33, this.worldMat_Constraint.n34,
        //                                 this.worldMat_Constraint.n41, this.worldMat_Constraint.n42, this.worldMat_Constraint.n43, this.worldMat_Constraint.n44 );
        //   this.el.object3D.matrix.updateMatrix();
      }

      this.prevTime = time;
    }
  },
  remove: function() {
    console.log('removing constraint');
    const Context_AF = this;
    const thisObject3D = Context_AF.el.object3D;
    
    thisObject3D.position.set(Context_AF.originalPos.x, Context_AF.originalPos.y, Context_AF.originalPos.z);
    thisObject3D.rotation.set(Context_AF.originalRot);
    thisObject3D.scale.set(Context_AF.originalSca.x, Context_AF.originalSca.y, Context_AF.originalSca.z);

    // Context_AF.el.object3D.matrixAutoUpdate = true;
    // console.log("auto matrix update:" + Context_AF.el.object3D.matrixAutoUpdate);
  }
}); 