'use strict';

AFRAME.registerComponent('circles-matte-black', {
    schema: {
        active: { type: 'boolean', default: false },
    },

    init: function () {
        const CONTEXT_AF = this;
        this.shaderReady = false;

        CONTEXT_AF.el.addEventListener('model-loaded', function loader() {
            const mesh = CONTEXT_AF.el.getObject3D('mesh');


            mesh.traverse(node => {
                if (node.isMesh) {
                    node.userData.originalData = node.material;
                    const matteMaterial = new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        side: THREE.FrontSide
                    });

                    matteMaterial.renderOrder = 1;
                    matteMaterial.needsUpdate = true;

                    node.userData.matteblack = matteMaterial;
                    node.material.needsUpdate = true;
                }
            });
            CONTEXT_AF.shaderReady = true;
            CONTEXT_AF.el.emit('shader-ready');
        });
    },


    update(oldData) {
        const CONTEXT_AF = this;

        if(oldData.active === CONTEXT_AF.data.active) return;

        if (CONTEXT_AF.data.active) {
            CONTEXT_AF.enable();
        } else {
            CONTEXT_AF.disable();
        }
    },

    enable: function () {
        if (!this.shaderReady) {
            this.el.addEventListener('shader-ready', () => this.enable(), { once: true });
            return;
        }
        const mesh = this.el.getObject3D('mesh');
        if (!mesh) return;
        mesh.traverse(node => {
            console.log('Setting shader matte black');
            if (!node.isMesh) return;
            if (!node.userData.matteblack) return;
            node.material = node.userData.matteblack;
            node.material.needsUpdate = true;
        });
    },

    disable: function () {
        if (!this.shaderReady) {
            this.el.addEventListener('shader-ready', () => this.disable(), { once: true });
            return;
        }

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