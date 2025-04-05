AFRAME.registerComponent('spawn-point', {


    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.sharedStateManager = document.querySelector('[bw-shared-state-manager]').components['bw-shared-state-manager'];
        CONTEXT_AF.room = CONTEXT_AF.sharedStateManager.getData(BRAINWAVES.LS_RECENT_ROOM);
        CONTEXT_AF.roomShortName = CONTEXT_AF.sharedStateManager.getRoom();
        CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];

        CONTEXT_AF.gamma = document.querySelector('#gammaSpawn')
        CONTEXT_AF.alpha = document.querySelector('#alphaSpawn')
        CONTEXT_AF.delta = document.querySelector('#deltaSpawn')
        CONTEXT_AF.hub = document.querySelector('#mainSpawn')
        
        console.log(CONTEXT_AF[CONTEXT_AF.room]);

        //display guiding text
        if(CONTEXT_AF.room != 'BW_Hub')
            CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.GET_EMOTION + CONTEXT_AF.roomShortName);

        //set spawn 
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
        
    },

});
