'use strict';

AFRAME.registerComponent('circles-matte-black', {
    schema: {
        active: { type: 'boolean', default: false },
    },

    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.matteMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.FrontSide
        });
        CONTEXT_AF.el.addEventListener('model-loaded', function loader(){
            const mesh = CONTEXT_AF.el.getObject3D('mesh');

            mesh.traverse(node => {
                if (node.isMesh) {
                    node.userData.originalData = node.material;
                    node.userData.matteblack = CONTEXT_AF.matteMaterial;
                }
            });
            if (CONTEXT_AF.data.active) this.apply();
        });
    },


    update(oldData) {
        const CONTEXT_AF = this;

        if(oldData.active === CONTEXT_AF.data.active || oldData.active === '') return;

        if (CONTEXT_AF.data.active) {
            CONTEXT_AF.enable();
        } else {
            CONTEXT_AF.disable();
        }
    },

    enable: function () {
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            if (!node.isMesh) return;
            if (!node.userData.matteblack) return;
            node.material = node.userData.matteblack;
            node.material.needsUpdate = true;
        });
    },

    disable: function () {
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            if (!node.isMesh) return
            if (!node.userData.originalData) return;
            node.material = node.userData.originalData;
            node.material.needsUpdate = true;

        });
    },

});