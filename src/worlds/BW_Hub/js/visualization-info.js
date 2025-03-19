AFRAME.registerComponent('visualization-info', {
    schema: {
        visualizationID: {type: 'string'}
    },

    init: function () {
      const Context_AF = this;
      Context_AF.info = document.querySelector(`#${Context_AF.data.visualizationID}-info`);
      //get data based on the passed in visualizationID

      Context_AF.cylinders = [
        {emotion: 'emotion1', color: 'red', value: 2},
        {emotion: 'emotion2', color: 'yellow', value: 0},
        {emotion: 'emotion3', color: 'blue', value: 2},
        {emotion: 'emotion4', color: 'green', value: 3},
        {emotion: 'emotion5', color: 'pink', value: 4}
      ]

      Context_AF.infoText = "";
      //populate display text with data
      for(let i = 0; i < Context_AF.cylinders.length; i++) {
        Context_AF.infoText += `\n ${Context_AF.cylinders[i].emotion} (${Context_AF.cylinders[i].color}): ${Context_AF.cylinders[i].value} people`;
      }

      console.log(Context_AF.infoText )

      //event listener for when the visualization data has been updated

      //display a label with this 
      Context_AF.el.addEventListener('mouseenter', function() {
        Context_AF.info.setAttribute('circles-description', {title_text_front: "Stats",
                                                             description_text_front: Context_AF.infoText,
                                                             offset: '-1.4 1.2 0',
                                                             arrow_position: 'right'});

      })

      //display a label with this 
      Context_AF.el.addEventListener('mouseleave', function() {
        console.log("removeeeeeee")
        Context_AF.info.removeAttribute('circles-description');
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
