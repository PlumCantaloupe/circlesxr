AFRAME.registerComponent('visualization-info', {
    schema: {
        visualizationID: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.info = document.querySelector(`#${CONTEXT_AF.data.visualizationID}-info`);
      

      CONTEXT_AF.cylinders = [
        {emotion: 'emotion1', color: 'red', value: 2},
        {emotion: 'emotion2', color: 'yellow', value: 0},
        {emotion: 'emotion3', color: 'blue', value: 2},
        {emotion: 'emotion4', color: 'green', value: 3},
        {emotion: 'emotion5', color: 'pink', value: 4}
      ]

      CONTEXT_AF.infoText = "";
      //populate display text with data
      for(let i = 0; i < CONTEXT_AF.cylinders.length; i++) {
        CONTEXT_AF.infoText += `\n ${CONTEXT_AF.cylinders[i].emotion} (${CONTEXT_AF.cylinders[i].color}): ${CONTEXT_AF.cylinders[i].value} people`;
      }

      console.log(CONTEXT_AF.infoText )

      //event listener for when the visualization data has been updated

      //display a label with this 
      CONTEXT_AF.el.addEventListener('mouseenter', function() {
        CONTEXT_AF.info.setAttribute('circles-description', {description_text_front: CONTEXT_AF.infoText});
        CONTEXT_AF.info.setAttribute('circles-interactive-visible', 'true');
      })

      //display a label with this 
      CONTEXT_AF.el.addEventListener('mouseleave', function() {
        CONTEXT_AF.info.setAttribute('circles-interactive-visible', 'false');
      })
    },

    update: function () {
      // Do something when component's data is updated.
    },

    remove: function () {
      // Do something the component or its entity is detached.
    },

    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
    }
});
