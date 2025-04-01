AFRAME.registerComponent('visualization-info', {
    schema: {
        visualizationID: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.infoButton = document.querySelector(`#${CONTEXT_AF.data.visualizationID}-info-button`);
      CONTEXT_AF.displayingInfo = false;
      CONTEXT_AF.emotionUpdateEvent = 'emotionupdate';
      CONTEXT_AF.cylinders = [
        {name: 'emotion1', votes: 2},
        {name: 'emotion2', votes: 0},
        {name: 'emotion3', votes: 2},
        {name: 'emotion4', votes: 3},
        {name: 'emotion5', votes: 4}
      ]

      CONTEXT_AF.el.addEventListener(CONTEXT_AF.emotionUpdateEvent, function (data) {
        console.log("gotttttttttttttttttttt data", data.detail)
        CONTEXT_AF.cylinders = data.detail;
        
        CONTEXT_AF.infoText = "";
        for(let i = 0; i < CONTEXT_AF.cylinders.length; i++) {
          // (${CONTEXT_AF.cylinders[i].color})
          CONTEXT_AF.infoText += `\n ${CONTEXT_AF.cylinders[i].name}: ${CONTEXT_AF.cylinders[i].votes} people`;
        }
        CONTEXT_AF.el.setAttribute('circles-description', {description_text_front: CONTEXT_AF.infoText});
    });

    // CONTEXT_AF.cylinders = [
    //   {name: 'emotion1', votes: 2},
    //   {name: 'emotion2', color: 'yellow', value: 0},
    //   {name: 'emotion3', color: 'blue', value: 2},
    //   {name: 'emotion4', color: 'green', value: 3},
    //   {name: 'emotion5', color: 'pink', value: 4}
    // ]
      

      CONTEXT_AF.infoText = "";
      //populate display text with data
      for(let i = 0; i < CONTEXT_AF.cylinders.length; i++) {
        // (${CONTEXT_AF.cylinders[i].color})
        CONTEXT_AF.infoText += `\n ${CONTEXT_AF.cylinders[i].name}: ${CONTEXT_AF.cylinders[i].votes} people`;
      }

      console.log(CONTEXT_AF.infoText )

      //event listener for when the visualization data has been updated

      //display a label with this 
      CONTEXT_AF.infoButton.addEventListener('click', function() {
        if (CONTEXT_AF.displayingInfo) {
          CONTEXT_AF.displayingInfo = false;
          CONTEXT_AF.el.setAttribute('circles-description', {description_text_front: CONTEXT_AF.infoText});
          CONTEXT_AF.el.setAttribute('circles-interactive-visible', 'false');
        }
        else {
          CONTEXT_AF.displayingInfo = true;
          CONTEXT_AF.el.setAttribute('circles-interactive-visible', 'true');
          CONTEXT_AF.el.setAttribute('circles-description', {description_text_front: CONTEXT_AF.infoText});
        }
      })

    },
});
