'use strict';

AFRAME.registerComponent('circles-dashed-line', {
  schema: {
    start: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    end: {type: 'vec3', default: {x: 0, y: 0, z: 0}},
    color: {type: 'color', default: '#74BEC1'},
    gapSize: {type: 'number', default: 0.1},
    dashSize: {type: 'number', default: 0.1},
    visible: {type: 'boolean', default: true}
  },

  multiple: true,

  init: function () {
    var data = this.data;

    this.numVertices = 10;
    this.numDimensions = 3;

    this.material = new THREE.LineDashedMaterial({
      color: data.color,
      gapSize: data.gapSize,
      dashSize: data.dashSize,
      visible: data.visible
    });

    this.geometry = new THREE.BufferGeometry();
    this.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(this.numVertices * this.numDimensions), this.numDimensions));

    this.line = new THREE.Line(this.geometry, this.material);
    this.line.computeLineDistances();
    this.el.setObject3D(this.attrName, this.line);
  },

  update: function (oldData) {
    var data = this.data;
    var geoNeedsUpdate = false;
    var positionArray = this.geometry.attributes.position.array;

    if (Object.keys(data).length === 0) { return; } // No need to update. as nothing here yet

    // Update geometry.
    if (!isEqualVec3(data.start, oldData.start) || !isEqualVec3(data.end, oldData.end)) {
      let dirVec = new THREE.Vector3();
      dirVec.subVectors(data.end, data.start);
      const distBetweenVerts = dirVec.length() / this.numVertices;
      dirVec.normalize();
      dirVec.multiplyScalar(distBetweenVerts);
      let startVec = new THREE.Vector3().copy(data.start);

      for (let i = 0; i < this.numVertices * this.numDimensions; i+=this.numDimensions) {
        positionArray[i + 0] = startVec.x;
        positionArray[i + 1] = startVec.y;
        positionArray[i + 2] = startVec.z;
        startVec.add(dirVec);
      }

      geoNeedsUpdate = true;
    }

    //update material properties
    if ((oldData.color !== data.color) && (data.color !== '')) {
      this.line.material.color = new THREE.Color(data.color);
    }

    if ((oldData.gapSize !== data.gapSize) && (data.gapSize !== '')) {
      this.line.material.gapSize = data.gapSize;
    }

    if ((oldData.dashSize !== data.dashSize) && (data.dashSize !== '')) {
      this.line.material.dashSize = data.dashSize;
    }

    if ((oldData.visible !== data.visible) && (data.visible !== '')) {
      this.line.material.visible = data.visible;
    }

    if (geoNeedsUpdate) {
      this.geometry.attributes.position.needsUpdate = true;
      this.line.computeLineDistances();
      this.geometry.lineDistancesNeedUpdate = true;
      this.geometry.computeBoundingSphere();
    }
  },

  remove: function () {
    this.el.removeObject3D(this.attrName, this.line);
  }
});

function isEqualVec3 (a, b) {
  if (!a || !b) { return false; }
  return (a.x === b.x && a.y === b.y && a.z === b.z);
}