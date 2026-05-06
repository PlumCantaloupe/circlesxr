//component that sets the spawn-point and guide-text based on recently visited rooms
AFRAME.registerComponent('spawn-point', {
    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.sharedStateManager = document.querySelector('[bw-shared-state-manager]').components['bw-shared-state-manager'];
        CONTEXT_AF.room = CONTEXT_AF.sharedStateManager.getData(BRAINWAVES.LS_RECENT_ROOM);
        CONTEXT_AF.roomShortName = CONTEXT_AF.sharedStateManager.getRoom();

        CONTEXT_AF.scene = CONTEXT_AF.el.sceneEl;

        CONTEXT_AF.gamma = document.querySelector('#gammaSpawn');
        CONTEXT_AF.alpha = document.querySelector('#alphaSpawn');
        CONTEXT_AF.delta = document.querySelector('#deltaSpawn');
        CONTEXT_AF.hub = document.querySelector('#mainSpawn');

        //set spawn point based on the recently visited room
        switch (CONTEXT_AF.room)
        {
            case 'BW_Hub':
                CONTEXT_AF.hub.setAttribute('circles-spawnpoint', {});
                break;
            case 'BW_Alpha':
                CONTEXT_AF.alpha.setAttribute('circles-spawnpoint', {});
                break;
            case 'BW_Delta':
                CONTEXT_AF.delta.setAttribute('circles-spawnpoint', {});
                break;
            case 'BW_Gamma':
                CONTEXT_AF.gamma.setAttribute('circles-spawnpoint', {});
                break;
            default:
                CONTEXT_AF.hub.setAttribute('circles-spawnpoint', {});
                break;
        }

        //when ready rotate the player so they face the control panel
        CONTEXT_AF.scene.addEventListener(CIRCLES.EVENTS.READY, function () {
            CONTEXT_AF.avatarRig = CIRCLES.getAvatarRigElement();
            CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];

            if(CONTEXT_AF.room === 'BW_Hub') {
                CONTEXT_AF.avatarRig.object3D.rotation.y = THREE.MathUtils.degToRad(277);
            }

            //display guiding text to guide the users
            if(CONTEXT_AF.room != 'BW_Hub')
                CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.GET_EMOTION + CONTEXT_AF.roomShortName);

        })
        
    },

});
