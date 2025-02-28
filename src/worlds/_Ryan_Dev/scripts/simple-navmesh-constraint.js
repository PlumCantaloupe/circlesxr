/* global AFRAME, THREE */

AFRAME.registerComponent('simple-navmesh-constraint', {
  schema: {
    enabled: {
      default: true
    },
    navmesh: {
      default: ''
    },
    fall: {
      default: 0.5
    },
    height: {
      default: 1.6
    },
    exclude: {
      default: ''
    },
    xzOrigin: {
      default: ''
    }
  },

  init: function () {
    this.onSceneUpdated = this.onSceneUpdated.bind(this);

    this.el.sceneEl.addEventListener('child-attached', this.onSceneUpdated);
    this.el.sceneEl.addEventListener('child-detached', this.onSceneUpdated);

    this.objects = [];
    this.excludes = [];
  },

  remove: function () {
    this.el.sceneEl.removeEventListener('child-attached', this.onSceneUpdated);
    this.el.sceneEl.removeEventListener('child-detached', this.onSceneUpdated);
  },

  onSceneUpdated: function (evt) {
    // We already have an update on the way
    if (this.entitiesChanged) { return; }

    // Don't bother updating if the entity is not relevant to us
    if (evt.detail.el.matches(this.data.navmesh) || evt.detail.el.matches(this.data.exclude)) {
      this.entitiesChanged = true;
    }
  },

  updateNavmeshEntities: function () {
    this.objects.length = 0;
    this.excludes.length = 0;

    if (this.data.navmesh.length > 0) {
      for (const navmesh of document.querySelectorAll(this.data.navmesh)) {
	this.objects.push(navmesh.object3D);
      }
    }

    if (this.objects.length === 0) {
      console.warn('simple-navmesh-constraint: Did not match any elements');
    } else if (this.data.exclude.length > 0) {
      for (const excluded of document.querySelectorAll(this.data.exclude)) {
        this.objects.push(excluded.object3D);
        this.excludes.push(excluded);
      }
    }

    this.entitiesChanged = false;
  },

  update: function () {
    this.lastPosition = null;
    this.xzOrigin = this.data.xzOrigin ? this.el.querySelector(this.data.xzOrigin) : this.el;

    this.updateNavmeshEntities();
  },

  tick: (function () {
    const nextPosition = new THREE.Vector3();
    const tempVec = new THREE.Vector3();
    const scanPattern = [
      [0,1], // Default the next location
      [0,0.5], // Check that the path to that location was fine
      [30,0.4], // A little to the side shorter range
      [-30,0.4], // A little to the side shorter range
      [60,0.2], // Moderately to the side short range
      [-60,0.2], // Moderately to the side short range
      [80,0.06], // Perpendicular very short range
      [-80,0.06], // Perpendicular very short range
    ];
    const down = new THREE.Vector3(0,-1,0);
    const raycaster = new THREE.Raycaster();
    const gravity = -1;
    const maxYVelocity = 0.5;
    const results = [];
    let yVel = 0;
    let firstTry = true;
    
    return function tick(time, delta) {
      if (this.data.enabled === false) return;
      if (this.entitiesChanged) {
	this.updateNavmeshEntities();
      }
      if (this.lastPosition === null) {
        firstTry = true;
        this.lastPosition = new THREE.Vector3();
        this.xzOrigin.object3D.getWorldPosition(this.lastPosition);
        if (this.data.xzOrigin) this.lastPosition.y -= this.xzOrigin.object3D.position.y;
      }
      
      const el = this.el;
      if (this.objects.length === 0) return;

      this.xzOrigin.object3D.getWorldPosition(nextPosition);
      if (this.data.xzOrigin) nextPosition.y -= this.xzOrigin.object3D.position.y;
      if (nextPosition.distanceTo(this.lastPosition) <= 0.01) return;
      
      let didHit = false;
      // So that it does not get stuck it takes as few samples around the user and finds the most appropriate
      scanPatternLoop:
      for (const [angle, distance] of scanPattern) {
        tempVec.subVectors(nextPosition, this.lastPosition);
        tempVec.applyAxisAngle(down, angle*Math.PI/180);
        tempVec.multiplyScalar(distance);
        tempVec.add(this.lastPosition);
        tempVec.y += maxYVelocity;
        tempVec.y -= this.data.height;
        raycaster.set(tempVec, down);
        raycaster.far = this.data.fall > 0 ? this.data.fall + maxYVelocity : Infinity;
        raycaster.intersectObjects(this.objects, true, results);
        
        if (results.length) {
          // If it hit something we want to avoid then ignore it and stop looking
          for (const result of results) {
            if(this.excludes.includes(result.object.el)) {
              results.splice(0);
              continue scanPatternLoop;
            }
          }
          const hitPos = results[0].point;
          results.splice(0);
          hitPos.y += this.data.height;
          if (nextPosition.y - (hitPos.y - yVel*2) > 0.01) {
            yVel += Math.max(gravity * delta * 0.001, -maxYVelocity);
            hitPos.y = nextPosition.y + yVel;
          } else {
            yVel = 0;
          }
          tempVec.copy(hitPos);
          this.xzOrigin.object3D.parent.worldToLocal(tempVec);
          tempVec.sub(this.xzOrigin.object3D.position);
          if (this.data.xzOrigin) tempVec.y += this.xzOrigin.object3D.position.y;
          this.el.object3D.position.add(tempVec);
          
          this.lastPosition.copy(hitPos);
          didHit = true;
          break;
        }
        
      }
      
      if (didHit) {
        firstTry = false;
      }
      
      if (!firstTry && !didHit) {
        this.el.object3D.position.copy(this.lastPosition);
        this.el.object3D.parent.worldToLocal(this.el.object3D.position);
      }
    }
  }())
});
