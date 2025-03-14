AFRAME.registerComponent('accessibility-controls', {
    init: function () {
        const OPAQUE = "opaque";
        const TRANSPARENT = "transparent";
        const COLOUR = "#5764c2";
        const CONTEXT_AF = this;
        CONTEXT_AF.mobileInstructions = document.querySelector('#mobileInstructions');
        CONTEXT_AF.desktopInstructions = document.querySelector('#desktopInstructions');
        CONTEXT_AF.headsetInstructions = document.querySelector('#headsetInstructions');

        CONTEXT_AF.opaqueTeleportPadSetting = document.querySelector('#opaqueTeleportPadSetting');
        CONTEXT_AF.transparentTeleportPadSetting = document.querySelector('#transparentTeleportPadSetting');

        CONTEXT_AF.title = document.querySelector('#screenText');

        CONTEXT_AF.sharedStateManager = document.querySelector('[bw-shared-state-manager]').components['bw-shared-state-manager'];

        //add event listener to listen for when component has been init
        CONTEXT_AF.teleportSet = CONTEXT_AF.sharedStateManager.getData(BRAINWAVES.LS_TELEPORT_PAD);
        //cretae telport pad opcaity manager
        //CONTEXT_AF.el.setAttribute('bw-teleport-pad-manager', {isTransparent: CONTEXT_AF.teleportSet, colour: COLOUR});


        CONTEXT_AF.mobileInstructions.addEventListener('click', function() {
            CONTEXT_AF.title.setAttribute('text', {value: 'Mobile Instructions'});
        })

        CONTEXT_AF.desktopInstructions.addEventListener('click', function() {
            CONTEXT_AF.title.setAttribute('text', {value: 'Desktop Instructions'});
        })

        CONTEXT_AF.headsetInstructions.addEventListener('click', function() {
            CONTEXT_AF.title.setAttribute('text', {value: 'Headset Instructions'});
        })

        CONTEXT_AF.opaqueTeleportPadSetting.addEventListener('click', function() {
            CONTEXT_AF.teleportSet = false;
            CONTEXT_AF.sharedStateManager.setData(BRAINWAVES.LS_TELEPORT_PAD, false);
            CONTEXT_AF.el.setAttribute('bw-teleport-pad-manager', {isTransparent: false});
        })

        CONTEXT_AF.transparentTeleportPadSetting.addEventListener('click', function() {
            CONTEXT_AF.teleportSet = true;
            CONTEXT_AF.sharedStateManager.setData(BRAINWAVES.LS_TELEPORT_PAD, true);
            CONTEXT_AF.el.setAttribute('bw-teleport-pad-manager', {isTransparent: true});
        })
    },
});
