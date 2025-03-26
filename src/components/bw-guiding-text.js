AFRAME.registerComponent('bw-guiding-text', {
    schema: {
        content: {type: 'string'},
        show: {type: 'boolean', default: false},
        enabled: {type: 'boolean', default: false},
    },

    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.textEl = document.querySelector('#guidingText');
        CONTEXT_AF.showText = false;
        CONTEXT_AF.errorEl = document.querySelector('#errorText');
        CONTEXT_AF.displayingError = false;
    },

    update: function (oldData) {
      const CONTEXT_AF = this;
      const data = CONTEXT_AF.data;

    
      //hide text if guiding text has been disabled
      if(!data.enabled && data.enabled != oldData.enabled){
        CONTEXT_AF.textEl.style.display = BRAINWAVES.GUIDING_TEXT.HIDDEN;
        CONTEXT_AF.showText = false;
      }
    },

    hideGuidingText: function() {
      const CONTEXT_AF = this;
      
      CONTEXT_AF.showText = false;
      CONTEXT_AF.textEl.style.display = BRAINWAVES.GUIDING_TEXT.HIDDEN;
    },

    updateGuidingText: function(content) {
      const CONTEXT_AF = this;
      CONTEXT_AF.textEl.innerText = content;
      CONTEXT_AF.showText = true;
      if(!CONTEXT_AF.displayingError && CONTEXT_AF.data.enabled)
        CONTEXT_AF.textEl.style.display = BRAINWAVES.GUIDING_TEXT.SHOW;
    },

    displayError: function(content) {
      const CONTEXT_AF = this;
      CONTEXT_AF.errorEl.innerText = content;
      CONTEXT_AF.errorEl.style.display = BRAINWAVES.GUIDING_TEXT.SHOW;
        //after a 3 seconds of displaying the timed text, display the constant text if it needs to be displayed
        setTimeout(function(){
          CONTEXT_AF.displayingError = false;
          //if there is guiding text to continue displaying, then display it
          CONTEXT_AF.errorEl.style.display = BRAINWAVES.GUIDING_TEXT.HIDDEN;
          if(CONTEXT_AF.showText && CONTEXT_AF.data.enabled) {
            CONTEXT_AF.textEl.style.display = BRAINWAVES.GUIDING_TEXT.SHOW;
          }
        }, BRAINWAVES.GUIDING_TEXT.TIMER_MS)
    }
    
});
