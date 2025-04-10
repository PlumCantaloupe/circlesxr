AFRAME.registerComponent('accessibility-controls', {
    init: function () {
        const OPAQUE = "opaque";
        const TRANSPARENT = "transparent";
        const COLOUR = "#5764c2";
        const CONTEXT_AF = this;
        CONTEXT_AF.contentArr = INSTRUCTIONS;
        CONTEXT_AF.currScreen = 0;

        CONTEXT_AF.scene = document.querySelector('a-scene');
        CONTEXT_AF.infoInstructions = document.querySelector('#infoInstructionsButton');
        CONTEXT_AF.mobileInstructions = document.querySelector('#mobileInstructions');
        CONTEXT_AF.desktopInstructions = document.querySelector('#desktopInstructions');
        CONTEXT_AF.headsetInstructions = document.querySelector('#headsetInstructions');

        CONTEXT_AF.opaqueTeleportPadSetting = document.querySelector('#opaqueTeleportPadSetting');
        CONTEXT_AF.transparentTeleportPadSetting = document.querySelector('#transparentTeleportPadSetting');

        CONTEXT_AF.bloomOnSetting = document.querySelector('#bloomOnSetting');
        CONTEXT_AF.bloomOffSetting = document.querySelector('#bloomOffSetting');

        CONTEXT_AF.guidingTextOnSetting = document.querySelector('#guidingTextOnSetting');
        CONTEXT_AF.guidingTextOffSetting = document.querySelector('#guidingTextOffSetting');

        CONTEXT_AF.guidingTextManager = document.querySelector('#guidingTextManager');

        //buttons to alternate between screens
        CONTEXT_AF.nextScreen = document.querySelector('#nextScreen');
        CONTEXT_AF.prevScreen = document.querySelector('#prevScreen');

        //screen content
        CONTEXT_AF.screenText = document.querySelector('#screenText');
        CONTEXT_AF.screenText2 = document.querySelector('#screenText2');
        CONTEXT_AF.screenGraphics = document.querySelector('#screenGraphics');

        CONTEXT_AF.sharedStateManager = document.querySelector('[bw-shared-state-manager]').components['bw-shared-state-manager'];

        //add event listener to listen for when component has been init
        const teleportSet = CONTEXT_AF.sharedStateManager.getData(BRAINWAVES.LS_TELEPORT_PAD);
        if(teleportSet)
            CONTEXT_AF.toggleButton(CONTEXT_AF.transparentTeleportPadSetting, CONTEXT_AF.opaqueTeleportPadSetting);
        else
            CONTEXT_AF.toggleButton(CONTEXT_AF.opaqueTeleportPadSetting, CONTEXT_AF.transparentTeleportPadSetting);

        //set initial glow
        const bloomSet = CONTEXT_AF.sharedStateManager.getData(BRAINWAVES.LS_BLOOM);
        if(bloomSet)
            CONTEXT_AF.toggleButton(CONTEXT_AF.bloomOnSetting, CONTEXT_AF.bloomOffSetting);
        else
            CONTEXT_AF.toggleButton(CONTEXT_AF.bloomOffSetting, CONTEXT_AF.bloomOnSetting);

        //set initial guiding text
        const guidingTextSet = CONTEXT_AF.sharedStateManager.getData(BRAINWAVES.LS_GUIDING_TEXT);
        if(guidingTextSet)
            CONTEXT_AF.toggleButton(CONTEXT_AF.guidingTextOnSetting, CONTEXT_AF.guidingTextOffSetting);
        else
            CONTEXT_AF.toggleButton(CONTEXT_AF.guidingTextOffSetting, CONTEXT_AF.guidingTextOnSetting);


        //if this is a headset then display the VR instructions
        if (AFRAME.utils.device.isMobileVR()) {
            CONTEXT_AF.contentArr = HEADSET_INSTRUCTIONS;
        }
        //if mobile
        else if (AFRAME.utils.device.isMobile()) {
            CONTEXT_AF.contentArr = MOBILE_INSTRUCTIONS;
        }
        //if desktop
        else {
            CONTEXT_AF.contentArr = DESKTOP_INSTRUCTIONS;
        }
        CONTEXT_AF.updateScreenContent(CONTEXT_AF.currScreen);

        //listen when to go to the next screen
        CONTEXT_AF.nextScreen.addEventListener('click', function() {
            //increment screen
            if (CONTEXT_AF.currScreen < CONTEXT_AF.contentArr.length - 1) {
                CONTEXT_AF.currScreen += 1;

                //if this is the second screen then show the previous button
                if (CONTEXT_AF.currScreen === 1) {
                    CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'true');
                }
                //if this is the last screen then hide the next button
                if (CONTEXT_AF.currScreen === CONTEXT_AF.contentArr.length - 1) {
                    CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'false');
                }
            }
            CONTEXT_AF.updateScreenContent(CONTEXT_AF.currScreen);
        });

        //listen when to go to the previous screen
        CONTEXT_AF.prevScreen.addEventListener('click', function() {
            //increment screen
            if (CONTEXT_AF.currScreen > 0) {
                CONTEXT_AF.currScreen -= 1;

                //if this is the first screen then hide the prev button
                if (CONTEXT_AF.currScreen === 0) {
                    CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
                } 
                //if this is the second last screen then show the next button
                if (CONTEXT_AF.currScreen === CONTEXT_AF.contentArr.length - 2) {
                    CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'true');
                }
            }

            if (CONTEXT_AF.contentArr === INSTRUCTIONS && CONTEXT_AF.currScreen === 0) {
                CONTEXT_AF.displayFirstInfoScreen();
            }
            else {
                CONTEXT_AF.updateScreenContent(CONTEXT_AF.currScreen);
            }
        });

        CONTEXT_AF.infoInstructions.addEventListener('click', function() {
            CONTEXT_AF.contentArr = INSTRUCTIONS;
            CONTEXT_AF.currScreen = 0;
            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'true');
            CONTEXT_AF.displayFirstInfoScreen();
        });

        CONTEXT_AF.mobileInstructions.addEventListener('click', function() {
            CONTEXT_AF.contentArr = MOBILE_INSTRUCTIONS;
            CONTEXT_AF.currScreen = 0;
            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'true');
            CONTEXT_AF.updateScreenContent(CONTEXT_AF.currScreen);
        });

        CONTEXT_AF.desktopInstructions.addEventListener('click', function() {
            CONTEXT_AF.contentArr = DESKTOP_INSTRUCTIONS;
            CONTEXT_AF.currScreen = 0;
            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'true');
            CONTEXT_AF.updateScreenContent(CONTEXT_AF.currScreen);
        });

        CONTEXT_AF.headsetInstructions.addEventListener('click', function() {
            CONTEXT_AF.contentArr = HEADSET_INSTRUCTIONS;
            CONTEXT_AF.currScreen = 0;
            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'true');
            CONTEXT_AF.updateScreenContent(CONTEXT_AF.currScreen);
        });

        CONTEXT_AF.opaqueTeleportPadSetting.addEventListener('click', function() {
            CONTEXT_AF.toggleButton(CONTEXT_AF.opaqueTeleportPadSetting, CONTEXT_AF.transparentTeleportPadSetting);

            CONTEXT_AF.sharedStateManager.setData(BRAINWAVES.LS_TELEPORT_PAD, false);
            CONTEXT_AF.el.setAttribute('bw-teleport-pad-manager', {isTransparent: false});

            CONTEXT_AF.displayToggleInfoScreen(TELEPORT_PAD_INFO.OPAQUE);

            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'false');
        })

        CONTEXT_AF.transparentTeleportPadSetting.addEventListener('click', function() {
            CONTEXT_AF.toggleButton(CONTEXT_AF.transparentTeleportPadSetting, CONTEXT_AF.opaqueTeleportPadSetting);
        
            CONTEXT_AF.sharedStateManager.setData(BRAINWAVES.LS_TELEPORT_PAD, true);
            CONTEXT_AF.el.setAttribute('bw-teleport-pad-manager', {isTransparent: true});

            CONTEXT_AF.displayToggleInfoScreen(TELEPORT_PAD_INFO.TRANSPARENT);

            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'false');
        })

        //bloom toggle event listeners
        CONTEXT_AF.bloomOnSetting.addEventListener('click', function(){
            CONTEXT_AF.toggleButton(CONTEXT_AF.bloomOnSetting, CONTEXT_AF.bloomOffSetting);

            CONTEXT_AF.scene.setAttribute('bloom', {threshold: 1,  
                                                    strength: 0.3,
                                                    radius: 0.1});
            CONTEXT_AF.sharedStateManager.setData(BRAINWAVES.LS_BLOOM, true);

            CONTEXT_AF.displayToggleInfoScreen(BLOOM_INFO.ON);

            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.text
        })

        CONTEXT_AF.bloomOffSetting.addEventListener('click', function(){
            CONTEXT_AF.toggleButton(CONTEXT_AF.bloomOffSetting, CONTEXT_AF.bloomOnSetting);

            CONTEXT_AF.scene.removeAttribute('bloom');
            CONTEXT_AF.sharedStateManager.setData(BRAINWAVES.LS_BLOOM, false);

            CONTEXT_AF.displayToggleInfoScreen(BLOOM_INFO.OFF);

            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'false');
        })

        //guiding text toggle event listeners 
        CONTEXT_AF.guidingTextOnSetting.addEventListener('click', function(){
            CONTEXT_AF.toggleButton(CONTEXT_AF.guidingTextOnSetting, CONTEXT_AF.guidingTextOffSetting);

            CONTEXT_AF.guidingTextManager.setAttribute('bw-guiding-text', {enabled: true});
            CONTEXT_AF.sharedStateManager.setData(BRAINWAVES.LS_GUIDING_TEXT, true);

            CONTEXT_AF.displayToggleInfoScreen(GUIDING_TEXT_INFO.ON);

            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'false');
        })

        CONTEXT_AF.guidingTextOffSetting.addEventListener('click', function(){
            CONTEXT_AF.toggleButton(CONTEXT_AF.guidingTextOffSetting, CONTEXT_AF.guidingTextOnSetting);

            CONTEXT_AF.guidingTextManager.setAttribute('bw-guiding-text', {enabled: false});
            CONTEXT_AF.sharedStateManager.setData(BRAINWAVES.LS_GUIDING_TEXT, false);

            CONTEXT_AF.displayToggleInfoScreen(GUIDING_TEXT_INFO.OFF);

            CONTEXT_AF.prevScreen.setAttribute('circles-interactive-visible', 'false');
            CONTEXT_AF.nextScreen.setAttribute('circles-interactive-visible', 'false');
        })
    },

    //function sets the toggle button states
    toggleButton: function(select, deselect) {
        select.removeAttribute('animation__mouseleave');
        select.removeAttribute('animation__mouseenter');
        select.removeAttribute('circles-interactive-object');
        select.setAttribute('material', {color: COLOURS.SELECTED_TOGGLE});
        deselect.object3D.position.y = -0.02;
        
        
        deselect.setAttribute('material', {color: COLOURS.DESELECTED_TOGGLE});
        deselect.setAttribute('circles-interactive-object', {});
        deselect.setAttribute('animation__mouseleave', {property: 'components.material.material.color',
                                                        type: 'color',
                                                        to: COLOURS.DESELECTED_TOGGLE,
                                                        startEvents: 'mouseleave',
                                                        dur: 200});
        deselect.setAttribute('animation__mouseenter', {property: 'components.material.material.color',
                                                        type: 'color',
                                                        to: '#474747',
                                                        startEvents: 'mouseenter',
                                                        dur: 200});
        deselect.object3D.position.y = 0;
    },

    //this and next function can be combined into one-----------------

    //function to display the toggle screen info
    displayToggleInfoScreen: function(content) {
        const CONTEXT_AF = this;
        CONTEXT_AF.textScreenContent(CONTEXT_AF.screenText, content.text, 0.151);
        CONTEXT_AF.screenText2.setAttribute('circles-interactive-visible', 'true');
        CONTEXT_AF.textScreenContent(CONTEXT_AF.screenText2, content.text2,-0.116);
        CONTEXT_AF.screenGraphics.setAttribute('circles-interactive-visible', 'false');
    },

    //function to display the first info text screen
    displayFirstInfoScreen: function() {
        const CONTEXT_AF = this;
        CONTEXT_AF.textScreenContent(CONTEXT_AF.screenText, CONTEXT_AF.contentArr[0].text, 0.151);
        CONTEXT_AF.screenText2.setAttribute('circles-interactive-visible', 'true');
        CONTEXT_AF.textScreenContent(CONTEXT_AF.screenText2, CONTEXT_AF.contentArr[0].text2,-0.116);
        CONTEXT_AF.screenGraphics.setAttribute('circles-interactive-visible', 'false');
    },

    //function updates the screen content based on a passed in screen number
    updateScreenContent: function(screenNum) {
        const CONTEXT_AF = this;

        CONTEXT_AF.screenText2.setAttribute('circles-interactive-visible', 'false');
        CONTEXT_AF.textScreenContent(CONTEXT_AF.screenText, CONTEXT_AF.contentArr[screenNum].text, 0.520);
        CONTEXT_AF.screenGraphics.setAttribute('material', {src: CONTEXT_AF.contentArr[screenNum].name});
        CONTEXT_AF.screenGraphics.setAttribute('circles-interactive-visible', 'true');
    },

    textScreenContent: function(textEl, text,positionY) {
        const CONTEXT_AF = this;
        textEl.setAttribute('text', {value: text});
        textEl.object3D.position.y = positionY;
    }
});
