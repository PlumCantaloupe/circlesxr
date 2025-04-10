AFRAME.registerComponent('bw-guiding-text', {
    schema: {
        content: {type: 'string'},
        show: {type: 'boolean', default: false},
        enabled: {type: 'boolean', default: false},
    },

    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.guidingText = document.querySelector('#textGuiding');
        CONTEXT_AF.showText = false;
        CONTEXT_AF.errorText = document.querySelector('#textError');
        CONTEXT_AF.displayingError = false;
        CONTEXT_AF.oneTimeTextShown = false;

        //if using a headset then adjust the guiding text position
        CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, (e) => {
          if (AFRAME.utils.device.isMobileVR()) {
            CONTEXT_AF.guidingText.object3D.position.set(0, 0.35, -1.5);
            CONTEXT_AF.guidingText.setAttribute('geometry', {height: '0.18', width: '1.3'});
            CONTEXT_AF.guidingText.setAttribute('text', {width: '1'});
  
            CONTEXT_AF.errorText.object3D.position.set(0, 0.35, -1.5);
            CONTEXT_AF.errorText.setAttribute('geometry', {height: '0.190', width: '1.3'});
            CONTEXT_AF.errorText.setAttribute('text', {width: '1'});
          }
        });
        

        //parent the text to the camera when circles has loaded
        CIRCLES.getCirclesSceneElement().addEventListener(CIRCLES.EVENTS.READY, (e) => {
          CONTEXT_AF.camera = CIRCLES.getMainCameraElement();    
          CONTEXT_AF.guidingText.object3D.parent = CONTEXT_AF.camera.object3D;
          CONTEXT_AF.errorText.object3D.parent = CONTEXT_AF.camera.object3D;
        });
    },

    update: function (oldData) {
      const CONTEXT_AF = this;
      const data = CONTEXT_AF.data;

    
      //hide text if guiding text has been disabled
      if(!data.enabled && data.enabled != oldData.enabled){
        CONTEXT_AF.guidingText.object3D.visible = false;
        CONTEXT_AF.showText = false;
      }
    },

    //updates and shows one time text
    showOneTimeText: function(content) {
      const CONTEXT_AF = this;

      if(!CONTEXT_AF.oneTimeTextShown){
        CONTEXT_AF.oneTimeTextShown = true;
        CONTEXT_AF.updateGuidingText(content);
      }
    },

    hideGuidingText: function() {
      const CONTEXT_AF = this;
      
      CONTEXT_AF.showText = false;
      CONTEXT_AF.guidingText.object3D.visible = false;
    },

    updateGuidingText: function(content) {
      const CONTEXT_AF = this;
      CONTEXT_AF.guidingText.setAttribute('text', {value:content});
      CONTEXT_AF.showText = true;
      if(!CONTEXT_AF.displayingError && CONTEXT_AF.data.enabled){
        CONTEXT_AF.guidingText.object3D.visible = true;
      }
    },

    displayError: function(content) {
      const CONTEXT_AF = this;
      CONTEXT_AF.guidingText.object3D.visible = false;
      CONTEXT_AF.errorText.setAttribute('text', {value:content});
      CONTEXT_AF.errorText.object3D.visible = true;
        //after a 3 seconds of displaying the timed text, display the constant text if it needs to be displayed
        setTimeout(function(){
          CONTEXT_AF.displayingError = false;
          //if there is guiding text to continue displaying, then display it
          CONTEXT_AF.errorText.object3D.visible = false;
          if(CONTEXT_AF.showText && CONTEXT_AF.data.enabled) {
            CONTEXT_AF.guidingText.object3D.visible = true;
          }
        }, BRAINWAVES.GUIDING_TEXT.TIMER_MS)
    }
    
});
