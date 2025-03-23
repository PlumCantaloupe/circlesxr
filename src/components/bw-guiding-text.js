AFRAME.registerComponent('bw-guiding-text', {
    schema: {
        content: {type: 'string'},
        state: {type: 'string', default: BRAINWAVES.GUIDING_TEXT.GUIDING_STATE},
        show: {type: 'boolean', default: false},
        enabled: {type: 'boolean', default: false},
    },

    init: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.text = '';
        CONTEXT_AF.timedText = '';

      // Do something when component first attached.
    },

    update: function (oldData) {
      // Do something when component's data is updated.
    },

    //function will display text for 3 seconds 
    displayTimedText: function(content, state) {
        const CONTEXT_AF = this;
        CONTEXT_AF.el.innerText = content

        //after a 3 seconds of displaying the timed text, display the constant text if it needs to be displayed
        setTimeout(function(){

        }, BRAINWAVES.GUIDING_TEXT.TIMER_MS)
        
    }
});
