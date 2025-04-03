AFRAME.registerComponent('visualization-info', {
    schema: {
        //orbTypeToUpdate: {type: 'string'},
        roomName: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;

      //getting the cylinder data visualizations associated with this dispenser
      CONTEXT_AF.focused = document.querySelector(`#${CONTEXT_AF.data.roomName}-visualization-red`);
      CONTEXT_AF.joyful = document.querySelector(`#${CONTEXT_AF.data.roomName}-visualization-yellow`);
      CONTEXT_AF.sad = document.querySelector(`#${CONTEXT_AF.data.roomName}-visualization-blue`);
      CONTEXT_AF.unsettled = document.querySelector(`#${CONTEXT_AF.data.roomName}-visualization-green`);
      CONTEXT_AF.peaceful = document.querySelector(`#${CONTEXT_AF.data.roomName}-visualization-pink`);

      CONTEXT_AF.infoButton = document.querySelector(`#${CONTEXT_AF.data.roomName}-info-button`);
      CONTEXT_AF.infoContainer = document.querySelector(`#${CONTEXT_AF.data.roomName}-visualization-info`);

      CONTEXT_AF.displayingInfo = false;
      CONTEXT_AF.emotionPopulateEvent = 'emotionpopulate';
      CONTEXT_AF.emotionUpdateEvent = 'emotionupdate';
      CONTEXT_AF.maxValue = 0;
      CONTEXT_AF.singleUnit = 0;

      //set default hardcoded data. this is needed in case database connection fails.
      switch (CONTEXT_AF.data.roomName) {
        case ROOM_VISUALIZATION_NAMES.DELTA:
          CONTEXT_AF.emotionData = DEFAULT_DELTA_VISUALIZATION_DATA;
          break;
        case ROOM_VISUALIZATION_NAMES.ALPHA:
          CONTEXT_AF.emotionData = DEFAULT_ALPHA_VISUALIZATION_DATA;
          break;
        case ROOM_VISUALIZATION_NAMES.GAMMA:
          CONTEXT_AF.emotionData = DEFAULT_GAMMA_VISUALIZATION_DATA;
          break;
        default:
          break;
      }
      CONTEXT_AF.initCylinders();
      CONTEXT_AF.updateInfoText();


      //listening for event to populate the visualization with real database data
      CONTEXT_AF.el.addEventListener(CONTEXT_AF.emotionPopulateEvent, function (data) {
        console.log("gotttttttttttttttttttt data inside vinfo", data.detail)
        if(data.detail != null && data.detail != undefined && data.detail.length === 5) {
          CONTEXT_AF.emotionData = data.detail;

          //init visualization
          CONTEXT_AF.initCylinders();

          //update text
          CONTEXT_AF.updateInfoText();
        }
      });

      //listening for event to increment visualization data and update the visuals
      CONTEXT_AF.el.addEventListener(CONTEXT_AF.emotionUpdateEvent, function (data) {
        console.log("lets update the orbs")
        //check if the update is for this room
        if (data.detail.roomName === CONTEXT_AF.data.roomName) {
          const indexToScale = CONTEXT_AF.emotionData.findIndex(item => item.name === data.detail.orbTypeToUpdate);
          if(indexToScale != -1) {
            CONTEXT_AF.emotionData[indexToScale].votes += 1;
            
            //update visualization
            CONTEXT_AF.updateCylinders(data.detail.orbTypeToUpdate);
          
            //update text
            CONTEXT_AF.updateInfoText();
          }
        }
      });

      //event listener for when the visualization data has been updated
      //display a label with this 
      CONTEXT_AF.infoButton.addEventListener('click', function() {
        if (CONTEXT_AF.displayingInfo) {
          CONTEXT_AF.displayingInfo = false;
          CONTEXT_AF.infoContainer.setAttribute('circles-description', {description_text_front: CONTEXT_AF.infoText});
          CONTEXT_AF.infoContainer.setAttribute('circles-interactive-visible', 'false');
        }
        else {
          CONTEXT_AF.displayingInfo = true;
          CONTEXT_AF.infoContainer.setAttribute('circles-interactive-visible', 'true');
          CONTEXT_AF.infoContainer.setAttribute('circles-description', {description_text_front: CONTEXT_AF.infoText});
        }
      })

    },

  //   update: function() {
  //     const CONTEXT_AF = this;
  //     //make sure a valid orb has been inputted
  //     if(CONTEXT_AF.data.orbTypeToUpdate != '') {
  //       console.log("lets update the orbs")

  //       //increment value
  //       const indexToScale = CONTEXT_AF.emotionData.findIndex(item => item.name===CONTEXT_AF.data.orbTypeToUpdate);
  //       if(indexToScale != -1) {
  //         CONTEXT_AF.emotionData[indexToScale].votes += 1;

  //         //update text
  //         CONTEXT_AF.infoText = "";
  //         for(let i = 0; i < CONTEXT_AF.emotionData.length; i++) {
  //           // (${CONTEXT_AF.emotionData[i].color})
  //           CONTEXT_AF.infoText += `\n ${CONTEXT_AF.emotionData[i].name}: ${CONTEXT_AF.emotionData[i].votes} people`;
  //         }

  //         CONTEXT_AF.infoContainer.setAttribute('circles-description', {description_text_front: CONTEXT_AF.infoText});

  //       }
  //     }
  // },

  //update the text content
  updateInfoText: function() {
    const CONTEXT_AF = this;

    CONTEXT_AF.infoText = "";
    for(let i = CONTEXT_AF.emotionData.length-1; i > -1; i--) {
      // (${CONTEXT_AF.emotionData[i].color})
      CONTEXT_AF.infoText += `\n ${CONTEXT_AF.emotionData[i].name}: ${CONTEXT_AF.emotionData[i].votes} people`;
    }
    CONTEXT_AF.infoContainer.setAttribute('circles-description', {description_text_front: CONTEXT_AF.infoText});
  },

  initCylinders: function() {
    const CONTEXT_AF = this;

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
        if (scaleY < 0.01 && element.votes != 0){
          scaleY = 0.01;
        }
          
        CONTEXT_AF[element.name].object3D.scale.y = scaleY;
        // //position the cylinder
        CONTEXT_AF[element.name].object3D.position.y= totalScale;
        totalScale += scaleY
    });

  },

  //update the tank/dispenser visualization
  updateCylinders: function(sharedOrbColour){
        const CONTEXT_AF = this;
        
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
