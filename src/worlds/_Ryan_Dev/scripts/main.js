AFRAME.registerComponent("physx-body-from-model", {
  schema: {
    type: 'string',
    default: ''
  },
  init () {
    const details = this.data;
    this.onLoad = function () {
      this.setAttribute('physx-body', details);
      this.removeAttribute('physx-body-from-model');
    }
    this.el.addEventListener('object3dset', this.onLoad);
  },
  remove () {
    this.el.removeEventListener('object3dset', this.onLoad);
  }
});

AFRAME.registerComponent("toggle-physics", {
  events: {
    pickup: function() {
      this.el.addState('grabbed');
    },
    putdown: function(e) {
      this.el.removeState('grabbed');
      if (e.detail.frame && e.detail.inputSource) {
        const referenceSpace = this.el.sceneEl.renderer.xr.getReferenceSpace();
        const pose = e.detail.frame.getPose(e.detail.inputSource.gripSpace, referenceSpace);
        if (pose && pose.angularVelocity) {
          this.el.components['physx-body'].rigidBody.setAngularVelocity(pose.angularVelocity, true);
        }
        if (pose && pose.linearVelocity) {
          this.el.components['physx-body'].rigidBody.setLinearVelocity(pose.linearVelocity, true);
        }
      }
    }
  }
});

window.addEventListener("DOMContentLoaded", function() {
  const sceneEl = document.querySelector("a-scene");
  const arContainerEl = document.getElementById("my-ar-objects");
  const cameraRig = document.getElementById("cameraRig");
});