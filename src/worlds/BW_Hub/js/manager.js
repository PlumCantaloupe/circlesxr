//component manages the experience state and database calls
AFRAME.registerComponent('manager', {
    schema: {
      holdingOrb: {type: 'boolean', default: false},
      holdingOrbId: {type: 'string'},
      holdingOrbEmotion: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;

      CONTEXT_AF.alphaVisualizationInfo = document.querySelector("#alpha-visualization-info");
      CONTEXT_AF.deltaVisualizationInfo = document.querySelector("#delta-visualization-info");
      CONTEXT_AF.gammaVisualizationInfo = document.querySelector("#gamma-visualization-info");
      
      CONTEXT_AF.centralOrbsVisualizationEl = document.querySelector('#central-orbs-visualization');

      const firebaseConfig = {
        apiKey: "AIzaSyD9r1vjo4Evh2pTNl_eeD2ldVtnXVEL3sM",
        authDomain: "brainwavedata-bd008.firebaseapp.com",
        projectId: "brainwavedata-bd008",
        storageBucket: "brainwavedata-bd008.firebasestorage.app",
        messagingSenderId: "507503529623",
        appId: "1:507503529623:web:55600bbd04196645ff23d2"
      };
      
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
  
    // Initialize Cloud Firestore and get a reference to the service
    CONTEXT_AF.db = firebase.firestore();

    //listen for an emotion visualizer event. If it occurs then update the corresponding visualizer
    CONTEXT_AF.socket     = null;
    CONTEXT_AF.connected  = false;

    CONTEXT_AF.shareEmotionEventName = "shareEmotion_event";

    CONTEXT_AF.createNetworkingSystem = function () {
        CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
        CONTEXT_AF.connected = true;
        console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

        //listen for when others share an emotion 
        CONTEXT_AF.socket.on(CONTEXT_AF.shareEmotionEventName, function(data) {
          
          //update central visualization to reflect other users sharing an emotion
          CONTEXT_AF.centralOrbsVisualizationEl.emit(EMOTION_UPDATE_EVENT, {orbTypeToUpdate: data.orbTypeToUpdate});
          
          const visualizationContainer = data.visualizationContainer;

          //update tank visualization to reflect other users sharing an emotion
          switch (visualizationContainer){
            case ROOM_VISUALIZATION_NAMES.DELTA: 
              CONTEXT_AF.deltaVisualizationInfo.emit(EMOTION_UPDATE_EVENT, {roomName: ROOM_VISUALIZATION_NAMES.DELTA, orbTypeToUpdate: data.orbTypeToUpdate});
              break;

            case ROOM_VISUALIZATION_NAMES.ALPHA:
              CONTEXT_AF.alphaVisualizationInfo.emit(EMOTION_UPDATE_EVENT, {roomName: ROOM_VISUALIZATION_NAMES.ALPHA, orbTypeToUpdate: data.orbTypeToUpdate});
              break;

            case ROOM_VISUALIZATION_NAMES.GAMMA:
              CONTEXT_AF.gammaVisualizationInfo.emit(EMOTION_UPDATE_EVENT, {roomName: ROOM_VISUALIZATION_NAMES.GAMMA, orbTypeToUpdate: data.orbTypeToUpdate});
              break;
            
            default:
              console.log("No matching case found");
          }
        });
    };

    // Update central orb and visualization info text when user shares an emotion
    CONTEXT_AF.el.addEventListener(CONTEXT_AF.shareEmotionEventName, function (data) {

      CONTEXT_AF.centralOrbsVisualizationEl.emit(EMOTION_UPDATE_EVENT, {orbTypeToUpdate: data.detail.orbTypeToUpdate});

      const visualizationContainer = data.detail.visualizationContainer;
      switch (visualizationContainer){
          case ROOM_VISUALIZATION_NAMES.DELTA: 
            CONTEXT_AF.deltaVisualizationInfo.emit(EMOTION_UPDATE_EVENT, {roomName: ROOM_VISUALIZATION_NAMES.DELTA, orbTypeToUpdate: data.detail.orbTypeToUpdate});
            break;

          case ROOM_VISUALIZATION_NAMES.ALPHA:
            CONTEXT_AF.alphaVisualizationInfo.emit(EMOTION_UPDATE_EVENT, {roomName: ROOM_VISUALIZATION_NAMES.ALPHA, orbTypeToUpdate: data.detail.orbTypeToUpdate});
            break;

          case ROOM_VISUALIZATION_NAMES.GAMMA:
            CONTEXT_AF.gammaVisualizationInfo.emit(EMOTION_UPDATE_EVENT, {roomName: ROOM_VISUALIZATION_NAMES.GAMMA, orbTypeToUpdate: data.detail.orbTypeToUpdate});
            break;
          
          default:
            console.log("No matching case found");
        }
      });

      //check if circles networking is ready. If not, add an went to listen for when it is ...
      if (CIRCLES.isCirclesWebsocketReady()) {
          CONTEXT_AF.createNetworkingSystem();
      }
      else {
          const wsReadyFunc = async function() {
            CONTEXT_AF.createNetworkingSystem();
            CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
          
            try {
              // On connect, get all emotion data and set central orbs data
              CONTEXT_AF.setCentralOrbsData(await CONTEXT_AF.getAllEmotionData());
              CONTEXT_AF.setVisualizationInfoData(await CONTEXT_AF.getEmotionData(ROOM_VISUALIZATION_NAMES.DELTA), CONTEXT_AF.deltaVisualizationInfo);
              CONTEXT_AF.setVisualizationInfoData(await CONTEXT_AF.getEmotionData(ROOM_VISUALIZATION_NAMES.ALPHA), CONTEXT_AF.alphaVisualizationInfo);
              CONTEXT_AF.setVisualizationInfoData(await CONTEXT_AF.getEmotionData(ROOM_VISUALIZATION_NAMES.GAMMA), CONTEXT_AF.gammaVisualizationInfo);
            } catch (error) {
              console.log("could not get data", error);
            }
          };
          CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
      }
    },

    //update emotion data -- in the future this can be replaced with a POST request API call if the database is on the server
    updateEmotionData: async function(roomName, emotionName) {
      const CONTEXT_AF = this;

      try {
        //get recent data
        const recentEmotionData = await CONTEXT_AF.getEmotionData(roomName);
        const recentAllEmotionData = await CONTEXT_AF.getAllEmotionData();

        //update vote count by one for the emotion
        const updatedEmotionData = {...recentEmotionData[1], emotions: recentEmotionData[1].emotions.map(emotion => {
          if (emotion.name === emotionName)
            return {...emotion, votes: emotion.votes + 1};
          else
            return emotion;
          })
        };

        const updatedAllEmotionData = {emotions: recentAllEmotionData[1].emotions.map(emotion => {
          if (emotion.name === emotionName)
            return {...emotion, votes: emotion.votes + 1};
          else
            return emotion;
          })
        };

        //get document id for the room
        const documentEmotionName = recentEmotionData[0];
        const documentAllEmotionName = recentAllEmotionData[0];

        //update individual emotion data
        await CONTEXT_AF.db.collection('emotionData').doc(documentEmotionName).update(updatedEmotionData);

        await CONTEXT_AF.db.collection('allEmotionData').doc(documentAllEmotionName).update(updatedAllEmotionData);

      } catch(error) {
        console.log(error)
      }
      
      
    },

    //get emotion from the database -- in the future this can be replaced with a GET request API call if the database is on the server
    getEmotionData: async function(roomName) {
      const CONTEXT_AF = this;

      let data = {};
      let docId = '';

      try {
          const collection = await CONTEXT_AF.db.collection('emotionData').where('name', '==', roomName).get();
          await collection.forEach(document => {data = document.data();
            docId = document.id
          });
          return [docId, data];
      } catch (error) {
          return [docId, data];
      }
    },

    //get all emotion from the database -- in the future this can be replaced with a GET request API call if the database is on the server
    getAllEmotionData: async function() {
      const CONTEXT_AF = this;

      let data = {};
      let docId = '';
      try {
        const collection = await CONTEXT_AF.db.collection('allEmotionData').get();
        await collection.forEach(document => {data = document.data();
          docId = document.id
        });
        return [docId, data];
      } catch (error) {
          console.log("error getting data")
          return [docId, data];
      }
    },

    //populate the central visualization with database data 
    setCentralOrbsData: function (emotionData) {
      const CONTEXT_AF = this;
      CONTEXT_AF.centralOrbsVisualizationEl.emit('emotionpopulate', {emotionData});
    },

    //populate the emotion tanks with database data
    setVisualizationInfoData: function (emotionData, visualizationInfo) {
      visualizationInfo.emit('emotionpopulate', emotionData[1].emotions);
    }
});
