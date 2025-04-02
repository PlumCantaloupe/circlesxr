
// Component updates the central orbs scale based on total emotion data retrieved from the manager component
AFRAME.registerComponent('central-orbs-visualization', {
    schema: {
        emotionData: {type: 'array', default: []},
    },
    init: function () {
        const CONTEXT_AF = this;

        // Select orbs
        CONTEXT_AF.orbPink = document.querySelector('#central-orb-pink');
        CONTEXT_AF.orbBlue = document.querySelector('#central-orb-blue');
        CONTEXT_AF.orbOrange = document.querySelector('#central-orb-orange');
        CONTEXT_AF.orbGreen = document.querySelector('#central-orb-green');
        CONTEXT_AF.orbYellow = document.querySelector('#central-orb-yellow');
        
        // Put into an array to use for easier updating 
        CONTEXT_AF.orbArr = {
            [EMOTION_ORB_COLOUR_MAP.PINK]: CONTEXT_AF.orbPink,
            [EMOTION_ORB_COLOUR_MAP.YELLOW]: CONTEXT_AF.orbYellow,
            [EMOTION_ORB_COLOUR_MAP.BLUE]: CONTEXT_AF.orbBlue,
            [EMOTION_ORB_COLOUR_MAP.GREEN]: CONTEXT_AF.orbGreen,
            [EMOTION_ORB_COLOUR_MAP.ORANGE]: CONTEXT_AF.orbOrange
        };

        CONTEXT_AF.emotionData = [
            {name: EMOTION_ORB_COLOUR_MAP.ORANGE, votes: 2},
            {name: EMOTION_ORB_COLOUR_MAP.GREEN, votes: 1},
            {name: EMOTION_ORB_COLOUR_MAP.BLUE, votes: 2},
            {name: EMOTION_ORB_COLOUR_MAP.YELLOW, votes: 3},
            {name: EMOTION_ORB_COLOUR_MAP.PINK, votes: 4}
          ];

        CONTEXT_AF.totalVoteCount = CONTEXT_AF.emotionData.reduce((totalCount, currEmotion) => totalCount += currEmotion.votes, 0);

        // Orb size constants
        CONTEXT_AF.ORB_MIN_RAD = 0.15;
        CONTEXT_AF.ORB_MAX_RAD = 0.75;
        CONTEXT_AF.MAX_SPHERE_VOL = CONTEXT_AF.sphereVolume(CONTEXT_AF.ORB_MAX_RAD);

        CONTEXT_AF.emotionPopulateEvent = 'emotionpopulate';
        CONTEXT_AF.emotionUpdateEvent = 'emotionupdate';

        CONTEXT_AF.el.addEventListener(CONTEXT_AF.emotionPopulateEvent, function (data) {
            // Scale orbs according to their voting proportion
            console.log("gotttttttttttttttttttt data inside central", data.detail)
            if(data.detail != null && data.detail != undefined && data.detail.emotionData[1].emotions) {
                CONTEXT_AF.emotionData = data.detail.emotionData[1].emotions;
                CONTEXT_AF.totalVoteCount = CONTEXT_AF.emotionData.reduce((totalCount, currEmotion) => totalCount += currEmotion.votes, 0);
                CONTEXT_AF.updateVisualization();
            }
        });

        CONTEXT_AF.el.addEventListener(CONTEXT_AF.emotionUpdateEvent, function (data) {
            const indexToScale = CONTEXT_AF.emotionData.findIndex(item => item.name=== data.detail.orbTypeToUpdate);
            if(indexToScale != -1){
                //update the number of votes for the passed in emotion
                CONTEXT_AF.emotionData[indexToScale].votes += 1;
                CONTEXT_AF.totalVoteCount = CONTEXT_AF.emotionData.reduce((totalCount, currEmotion) => totalCount += currEmotion.votes, 0);
                CONTEXT_AF.updateVisualization();
            }
        });
    },

    tick: function () {
        const CONTEXT_AF = this;
        // Yaw rotation
        CONTEXT_AF.el.object3D.rotation.y += 0.002;
    },

    updateVisualization: function () {
        const CONTEXT_AF = this;

        // Loop over each orb element, calculate the scale proportion and set the scale
        Object.keys(CONTEXT_AF.orbArr).forEach(emotionName => {
            let emotionProportion = (CONTEXT_AF.emotionData.find(emotion => emotion.name === emotionName).votes / CONTEXT_AF.totalVoteCount);
            
            if (emotionProportion < CONTEXT_AF.ORB_MIN_RAD || typeof emotionProportion !== 'number') {
                emotionProportion = CONTEXT_AF.ORB_MIN_RAD;
            }

            // Get proportion adjusted for volume instead of using linear proportion
            let volAdjProportion = CONTEXT_AF.scaleToVolProportion(emotionProportion, CONTEXT_AF.MAX_SPHERE_VOL) * CONTEXT_AF.ORB_MAX_RAD;

            // If volume-adjusted proportion is larger than max, make it the max value
            if (volAdjProportion > CONTEXT_AF.ORB_MAX_RAD) {
                volAdjProportion = CONTEXT_AF.ORB_MAX_RAD;
            } else if (volAdjProportion < CONTEXT_AF.ORB_MIN_RAD) {
                volAdjProportion = CONTEXT_AF.ORB_MIN_RAD;
            }

            // Set the orb according to the volume-adjusted proportion
            setTimeout(function(){
                CONTEXT_AF.orbArr[emotionName].setAttribute('animation', {property: 'scale',
                                                duration: 500,
                                                to: `${volAdjProportion} ${volAdjProportion} ${volAdjProportion}`})
            }, 200);
        });
    },

    scaleToVolProportion: function (proportionRad, maxVol) {
        // Compares the volume from the linear proportion to the max volume from the max scale value
        // then returns an accurate linear proportion that accounts for sphere volume proportion
        const CONTEXT_AF = this;
       
        const targetVol = CONTEXT_AF.sphereVolume(proportionRad);
        return (targetVol / maxVol) ** (1/3)
    },

    sphereVolume: function (rad) {
        // Returns volume of a sphere
        return (((4 * Math.PI) / 3) * rad) ** 3
    }
})