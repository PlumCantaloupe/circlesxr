AFRAME.registerComponent('bw-guiding-text', {
    schema: {
        content: {type: 'string'},
        error: {type: 'boolean', default: false},
        timed: {type: 'boolean', default: false},
        show: {type: 'boolean', default: false},
        enabled: {type: 'boolean', default: false},
    },

    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.textEl = document.querySelector('#guidingText');
        CONTEXT_AF.prevContent = '';
        CONTEXT_AF.currContent = '';
    },

    update: function (oldData) {
      const CONTEXT_AF = this;
      const data = CONTEXT_AF.data;

      //display guiding text
      if( (data.show) && (data.content != oldData.content && data.content != '') ) {
        CONTEXT_AF.textEl.styles.display = BRAINWAVES.GUIDING_TEXT.SHOW;
        CONTEXT_AF.updateContent(data.content);
      }

      //hide guiding text
      if(!data.show && data.show != oldData.show)
        CONTEXT_AF.textEl.styles.display = BRAINWAVES.GUIDING_TEXT.HIDDEN;

      //hide text if guiding text has been disabled
      if(!data.enabled)
        CONTEXT_AF.el.setAttribute('bw-guiding-text', {show: false});
    },

    updateContent: function(content) {
      const CONTEXT_AF = this;
        CONTEXT_AF.textEl.innerText = content;
        CONTEXT_AF.prevContent = CONTEXT_AF.currContent;
        CONTEXT_AF.currContent = content;

        if(CONTEXT_AF.data.error) 
          CONTEXT_AF.textEl.styles.backgroundColor = 'red';
        else 
          CONTEXT_AF.textEl.styles.backgroundColor = 'default';

        //call timer
        if(CONTEXT_AF.data.timed)
          CONTEXT_AF.displayTimedText();
    },

    //function will display text for 3 seconds 
    displayTimedText: function() {
      const CONTEXT_AF = this;
        //after a 3 seconds of displaying the timed text, display the constant text if it needs to be displayed
        setTimeout(function(){
          //if there is guiding text to continue displaying, then display it
          if(show) {
            CONTEXT_AF.updateContent(CONTEXT_AF.prevContent)
          }
        }, BRAINWAVES.GUIDING_TEXT.TIMER_MS)
    }
});
