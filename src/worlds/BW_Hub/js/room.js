AFRAME.registerComponent('room', {
  //this will have to be switched over to a variable in CONTEXT_AF
    schema: {
        orbTypeToUpdate: {type: 'string'},
        roomName: {type: 'string'}
    },

    init: async function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.prefix = CONTEXT_AF.el.id;

      //getting the cylinder data visualizations associated with this dispenser
      CONTEXT_AF.focused = document.querySelector(`#${CONTEXT_AF.prefix}-red`);
      CONTEXT_AF.joyful = document.querySelector(`#${CONTEXT_AF.prefix}-yellow`);
      CONTEXT_AF.sad = document.querySelector(`#${CONTEXT_AF.prefix}-blue`);
      CONTEXT_AF.unsettled = document.querySelector(`#${CONTEXT_AF.prefix}-green`);
      CONTEXT_AF.peaceful = document.querySelector(`#${CONTEXT_AF.prefix}-pink`);

      CONTEXT_AF.sharedStateManager = document.querySelector('[manager]').components['manager'];
      //get data based on the passed in visualizationID

      try {
        const data = await CONTEXT_AF.sharedStateManager.getEmotionData(CONTEXT_AF.data.roomName);
        CONTEXT_AF.emotionData = await data[1].emotions;

      
          //getting person emotion data from db
          // CONTEXT_AF.emotionData = [
          //   {color: 'red', value: 2},
          //   {color: 'yellow', value: 0},
          //   {color: 'blue', value: 2},
          //   {color: 'green', value: 3},
          //   {color: 'pink', value: 4}
          // ]
      
          CONTEXT_AF.maxValue = 0;
          for(let i=0; i<CONTEXT_AF.emotionData.length; i++){
            CONTEXT_AF.maxValue += CONTEXT_AF.emotionData[i].votes;
          }


          CONTEXT_AF.singleUnit = CYLINDER_Y_SIZE / CONTEXT_AF.maxValue;
      
          //set the default scales for the cylinder after the component has been initialized
          let totalScale = 0;
          CONTEXT_AF.emotionData.forEach(element => {
            let scaleY = CONTEXT_AF.singleUnit * element.votes;
            //if the scale is too small we should set it to minimum height
            if (scaleY < 0.01 && element.votes != 0) 
            scaleY = 0.01;
            
            CONTEXT_AF[element.name].object3D.scale.y = scaleY;
            // //position the cylinder
            CONTEXT_AF[element.name].object3D.position.y= totalScale;
            totalScale += scaleY
          });
      } catch (error) {
        console.log(error)
      }
      
  

    },

    update: function() {
        const CONTEXT_AF = this;
        //make sure a valid orb has been inputted
        if(CONTEXT_AF.data.orbTypeToUpdate != '' && CONTEXT_AF[CONTEXT_AF.data.orbTypeToUpdate] !== undefined) {
          console.log("lets update the orbs")
          CONTEXT_AF.updateCylinders(CONTEXT_AF.data.orbTypeToUpdate);
          CONTEXT_AF.el.setAttribute('room', {orbTypeToUpdate: ''});
        }
    },
  
    updateCylinders: function(sharedOrbColour){
        const CONTEXT_AF = this;
        
        const indexToScale = CONTEXT_AF.emotionData.findIndex(item => item.name===sharedOrbColour);
        CONTEXT_AF.emotionData[indexToScale].votes += 1;
        CONTEXT_AF.maxValue += 1;
        CONTEXT_AF.singleUnit = CYLINDER_Y_SIZE / CONTEXT_AF.maxValue;
        
        let newPos = 0;
        //need to update the scale and position of each cylinder based on the new data 
        for(let i=0; i<CONTEXT_AF.emotionData.length; i++){
            const currEl = CONTEXT_AF[CONTEXT_AF.emotionData[i].name];
            const newScaleY = CONTEXT_AF.singleUnit * CONTEXT_AF.emotionData[i].votes;
    
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
