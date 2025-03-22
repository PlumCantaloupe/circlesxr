AFRAME.registerComponent('spawn-point', {


    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.sharedStateManager = document.querySelector('[bw-shared-state-manager]').components['bw-shared-state-manager'];
        CONTEXT_AF.room = CONTEXT_AF.sharedStateManager.getData(BRAINWAVES.LS_RECENT_ROOM);
        

        CONTEXT_AF.gamma = document.querySelector('#gammaSpawn')
        CONTEXT_AF.alpha = document.querySelector('#alphaSpawn')
        CONTEXT_AF.delta = document.querySelector('#deltaSpawn')
        CONTEXT_AF.hub = document.querySelector('#mainSpawn')

        console.log(CONTEXT_AF[CONTEXT_AF.room]);

        //set spawn 
        switch (CONTEXT_AF.room)
        {
            case 'hub':
                CONTEXT_AF.hub.setAttribute('circles-spawnpoint', {});
                break;
            case 'alpha':
                CONTEXT_AF.alpha.setAttribute('circles-spawnpoint', {});
                break;
            case 'delta':
                CONTEXT_AF.delta.setAttribute('circles-spawnpoint', {});
                break;
            case 'gamma':
                CONTEXT_AF.gamma.setAttribute('circles-spawnpoint', {});
                break;
            default:
                CONTEXT_AF.hub.setAttribute('circles-spawnpoint', {});
                break;
        }
        
    },

});
