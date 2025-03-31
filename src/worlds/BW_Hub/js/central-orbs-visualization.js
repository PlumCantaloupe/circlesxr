// Map of emotions to orb colours
const EMOTION_ORB_COLOUR_MAP = {
    PINK: 'peaceful',
    YELLOW: 'joyful',
    BLUE: 'sad',
    GREEN: 'unsettled',
    ORANGE: 'focused'
}

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

        // Orb size constants
        CONTEXT_AF.ORB_MIN_RAD = 0.15;
        CONTEXT_AF.ORB_MAX_RAD = 0.75;

        const MAX_SPHERE_VOL = CONTEXT_AF.sphereVolume(CONTEXT_AF.ORB_MAX_RAD);

        CONTEXT_AF.emotionUpdateEvent = 'emotionupdate';

        CONTEXT_AF.el.addEventListener(CONTEXT_AF.emotionUpdateEvent, function () {
            const emotionData = [
                {
                    name: EMOTION_ORB_COLOUR_MAP.PINK,
                    votes: 1
                },
                {
                    name: EMOTION_ORB_COLOUR_MAP.YELLOW,
                    votes: 0
                },                
                {
                    name: EMOTION_ORB_COLOUR_MAP.BLUE,
                    votes: 0
                },                
                {
                    name: EMOTION_ORB_COLOUR_MAP.GREEN,
                    votes: 0
                },                
                {
                    name: EMOTION_ORB_COLOUR_MAP.ORANGE,
                    votes: 0
                }
            ];
            // Scale orbs according to their voting proportion
            // const emotionData = data.detail.emotionData[1].emotions;
            const totalVoteCount = emotionData.reduce((totalCount, currEmotion) => totalCount += currEmotion.votes, 0);

            // Loop over each orb element, calculate the scale proportion and set the scale
            Object.keys(CONTEXT_AF.orbArr).forEach(emotionName => {
                let emotionProportion = (emotionData.find(emotion => emotion.name === emotionName).votes / totalVoteCount);
                
                if (emotionProportion < CONTEXT_AF.ORB_MIN_RAD || typeof emotionProportion !== 'number') {
                    emotionProportion = CONTEXT_AF.ORB_MIN_RAD;
                }

                // Get proportion adjusted for volume instead of using linear proportion
                let volAdjProportion = CONTEXT_AF.scaleToVolProportion(emotionProportion, MAX_SPHERE_VOL) * CONTEXT_AF.ORB_MAX_RAD;

                // If volume-adjusted proportion is larger than max, make it the max value
                if (volAdjProportion > CONTEXT_AF.ORB_MAX_RAD) {
                    volAdjProportion = CONTEXT_AF.ORB_MAX_RAD;
                } else if (volAdjProportion < CONTEXT_AF.ORB_MIN_RAD) {
                    volAdjProportion = CONTEXT_AF.ORB_MIN_RAD;
                }

                // Set the orb according to the volume-adjusted proportion
                CONTEXT_AF.orbArr[emotionName].object3D.scale.set(volAdjProportion, volAdjProportion, volAdjProportion);
            });
        });
    },
    tick: function () {
        const CONTEXT_AF = this;
        // Yaw rotation
        CONTEXT_AF.el.object3D.rotation.y += 0.005;
    },
    scaleToVolProportion: function (proportionRad, maxVol) {
        // Compares the volume from the linear proportion to the max volume from the max scale value
        // then returns an accurate linear proportion that accounts for sphere volume proportion
        const CONTEXT_AF = this;
       
        const targetVol = CONTEXT_AF.sphereVolume(proportionRad);
        console.log(targetVol, maxVol);
        console.log((targetVol / maxVol) ** (1/3));
        return (targetVol / maxVol) ** (1/3)
    },
    sphereVolume: function (rad) {
        // Returns volume of a sphere
        return (((4 * Math.PI) / 3) * rad) ** 3
    }
})