AFRAME.registerComponent('manager', {
    schema: {
      holdingOrb: {type: 'boolean', default: false},
      holdingOrbId: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.alphaVisualization = document.querySelector("#alpha-visualization");
      CONTEXT_AF.deltaVisualization = document.querySelector("#delta-visualization");
      CONTEXT_AF.gammaVisualization = document.querySelector("#gamma-visualization");
      
      CONTEXT_AF.centralOrbsVisualizationEl = document.querySelector('#central-orbs-visualization');

      // Initialize Firebase
      // fetch("https://firestore.googleapis.com/v1/projects/brainwavedata-bd008/databases/(default)/documents/deltaEmotionData", {
      //         method: "POST",
      //         headers: {
      //             'Content-type': 'application/json; charset=UTF-8'
      //         },
      //         body: JSON.stringify({
      //             fields: {
      //             id: {
      //                 stringValue: "test"
      //             },
      //             name: {
      //                 stringValue: "test"
      //             }
      //         }})
      //     }).then(body => console.log("success")).catch(console.log("there was an error adding data"));

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

    // CONTEXT_AF.addEmotionData('emotionData', {name: 'delta', emotions: [{name: "focused", votes: 0}, {name: "unsettled", votes: 0}, {name: "sad", votes: 0}, {name: "joyful", votes: 0}, {name: "peaceful", votes: 0}]});
    // CONTEXT_AF.addEmotionData('emotionData', {name: 'alpha', emotions: [{name: "focused", votes: 0}, {name: "unsettled", votes: 0}, {name: "sad", votes: 0}, {name: "joyful", votes: 0}, {name: "peaceful", votes: 0}]});
    // CONTEXT_AF.addEmotionData('emotionData', {name: 'gamma', emotions: [{name: "focused", votes: 0}, {name: "unsettled", votes: 0}, {name: "sad", votes: 0}, {name: "joyful", votes: 0}, {name: "peaceful", votes: 0}]});
    // CONTEXT_AF.addEmotionData('allEmotionData', {emotions: [{name: "focused", votes: 0}, {name: "unsettled", votes: 0}, {name: "sad", votes: 0}, {name: "joyful", votes: 0}, {name: "peaceful", votes: 0}]});

    //listen for an emotion visualizer event. If it occurs then update the corresponding visualizer
    CONTEXT_AF.socket     = null;
    CONTEXT_AF.connected  = false;
    CONTEXT_AF.campfireEventName = "campfire_event";

    CONTEXT_AF.shareEmotionEvent = "shareEmotion_event";

    CONTEXT_AF.createNetworkingSystem = function () {
        CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
        CONTEXT_AF.connected = true;
        console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

        //listen for when others turn on campfire
        CONTEXT_AF.socket.on(CONTEXT_AF.campfireEventName, function(data) {
          
          const visualizationContainer = data.visualizationContainer;
          
          switch (visualizationContainer){
            case "delta": 
              console.log("delta stuff")
              CONTEXT_AF.deltaVisualization.setAttribute('room', {orbTypeToUpdate: data.orbTypeToUpdate}); 
              break;

            case "alpha":
              console.log("alpha stuff")
              CONTEXT_AF.alphaVisualization.setAttribute('room', {orbTypeToUpdate: data.orbTypeToUpdate}); 
              break;

            case "gamma":
              console.log("gamma stuff")
              CONTEXT_AF.gammaVisualization.setAttribute('room', {orbTypeToUpdate: data.orbTypeToUpdate}); 
              break;
            
            default:
              console.log("No matching case found");
          }
        });

        // On connect, get all emotion data and set the central orb visualisation
        // Listen for other people sharing an emotion orb
        CONTEXT_AF.socket.on(CONTEXT_AF.shareEmotionEvent, async function (data) {
          CONTEXT_AF.setCentralOrbsData(await CONTEXT_AF.getAllEmotionData());
        });

    };

      //check if circle networking is ready. If not, add an went to listen for when it is ...
      if (CIRCLES.isCirclesWebsocketReady()) {
          CONTEXT_AF.createNetworkingSystem();
      }
      else {
          const wsReadyFunc = async function() {
              CONTEXT_AF.createNetworkingSystem();
              CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);

              // On connect, get all emotion data and set central orbs data
              CONTEXT_AF.setCentralOrbsData(await CONTEXT_AF.getAllEmotionData());
          };
          CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
      }
    },

    update: function () {
      // Do something when component's data is updated.
    },

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

    addEmotionData: function(collectionName, newData) {
      const CONTEXT_AF = this;
      CONTEXT_AF.db.collection(collectionName).add(newData)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
    },

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
          console.log("error getting data")
          return [docId, data];
      }
    },

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

    setCentralOrbsData: function (emotionData) {
      const CONTEXT_AF = this;

      console.log('connected and got the data');
      console.log(emotionData);

      CONTEXT_AF.centralOrbsVisualizationEl.emit('emotionupdate', {emotionData});
    },

    remove: function () {
      // Do something the component or its entity is detached.
    },

    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
    }
});
