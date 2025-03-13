AFRAME.registerComponent('room', {
  //this will have to be switched over to a variable in Context_AF
    schema: {
        orbTypeToUpdate: {type: 'string'},
    },

    init: function () {
      const Context_AF = this;
      Context_AF.prefix = Context_AF.el.id;

      //getting the cylinder data visualizations associated with this dispenser
      Context_AF.red = document.querySelector(`#${Context_AF.prefix}-red`);
      Context_AF.yellow = document.querySelector(`#${Context_AF.prefix}-yellow`);
      Context_AF.blue = document.querySelector(`#${Context_AF.prefix}-blue`);
      Context_AF.green = document.querySelector(`#${Context_AF.prefix}-green`);
      Context_AF.pink = document.querySelector(`#${Context_AF.prefix}-pink`);
      
      //getting person emotion data from db
      Context_AF.cylinders = [
        {color: 'red', value: 2},
        {color: 'yellow', value: 0},
        {color: 'blue', value: 2},
        {color: 'green', value: 3},
        {color: 'pink', value: 4}
      ]
  
      Context_AF.maxValue = 0;
      for(let i=0; i<Context_AF.cylinders.length; i++){
        Context_AF.maxValue += Context_AF.cylinders[i].value;
      }


      Context_AF.singleUnit = CYLINDER_Y_SIZE / Context_AF.maxValue;
  
      //set the default scales for the cylinder after the component has been initialized
      let totalScale = 0;
      Context_AF.cylinders.forEach(element => {
        let scaleY = Context_AF.singleUnit * element.value;
        //if the scale is too small we should set it to minimum height
        if (scaleY < 0.01 && element.value != 0) 
        scaleY = 0.01;
        
        Context_AF[element.color].object3D.scale.y = scaleY;
        // //position the cylinder
        Context_AF[element.color].object3D.position.y= totalScale;
        totalScale += scaleY
      });
  
      //listen for websocket
    //   Context_AF.socket.on(DELTA_VISUALIZATION_EVENT, function(data) {
    //     console.log("data visualization event received");
    // });

    //   Context_AF.el.addEventListener('', function() {

    //   })
    },

    update: function() {
        const Context_AF = this;
        //make sure a valid orb has been inputted
        if(Context_AF.data.orbTypeToUpdate != '' && Context_AF[Context_AF.data.orbTypeToUpdate] !== undefined) {
          console.log("lets update the orbs")
          Context_AF.updateCylinders(Context_AF.data.orbTypeToUpdate);
          Context_AF.el.setAttribute('room', {orbTypeToUpdate: ''});
        }
    },
  
    updateCylinders: function(sharedOrbColour){
        const Context_AF = this;
        
        const indexToScale = Context_AF.cylinders.findIndex(item => item.color===sharedOrbColour);
        Context_AF.cylinders[indexToScale].value += 1;
        Context_AF.maxValue += 1;
        Context_AF.singleUnit = CYLINDER_Y_SIZE / Context_AF.maxValue;
        
        let newPos = 0;
        //need to update the scale and position of each cylinder based on the new data 
        for(let i=0; i<Context_AF.cylinders.length; i++){
            const currEl = Context_AF[Context_AF.cylinders[i].color];
            const newScaleY = Context_AF.singleUnit * Context_AF.cylinders[i].value;
    
            //animate scale
            currEl.setAttribute('animation', {property: 'scale',
                                                            dur: 300,
                                                            to: `1 ${newScaleY} 1`});
    
            //animate position
            currEl.setAttribute('animation__1', {property: 'position',
                dur: 300,
                to: `0 ${newPos} 0`});
    
            //add the current cylinder scale to the total position
            newPos += newScaleY;
        }
    }
});
