
const EMOTION_ORB_INFO = {
    RADIUS: 0.07,
    X_POS: 0,
    Y_POS: 0.59,
    Z_POS: 2.13,
};

const CYLINDER_Y_SIZE = 1;

const DELTA_VISUALIZATION_EVENT = 'updateDeltaVisualization';

const ROOM_VISUALIZATION_NAMES = {
    DELTA: 'delta',
    ALPHA: 'alpha',
    GAMMA: 'gamma'
}

const EMOTION_ORB_COLOUR_MAP = {
    PINK: 'peaceful',
    YELLOW: 'joyful',
    BLUE: 'sad',
    GREEN: 'unsettled',
    ORANGE: 'focused'
}

const DEFAULT_CENTRAL_ORB_DATA = [
    {name: EMOTION_ORB_COLOUR_MAP.ORANGE, votes: 3},
    {name: EMOTION_ORB_COLOUR_MAP.GREEN, votes: 2},
    {name: EMOTION_ORB_COLOUR_MAP.BLUE, votes: 2},
    {name: EMOTION_ORB_COLOUR_MAP.YELLOW, votes: 8},
    {name: EMOTION_ORB_COLOUR_MAP.PINK, votes: 11}
  ];

const DEFAULT_DELTA_VISUALIZATION_DATA = [
    {name: EMOTION_ORB_COLOUR_MAP.ORANGE, votes: 2},
    {name: EMOTION_ORB_COLOUR_MAP.GREEN, votes: 0},
    {name: EMOTION_ORB_COLOUR_MAP.BLUE, votes: 0},
    {name: EMOTION_ORB_COLOUR_MAP.YELLOW, votes: 2},
    {name: EMOTION_ORB_COLOUR_MAP.PINK, votes: 4}
];

const DEFAULT_ALPHA_VISUALIZATION_DATA = [
    {name: EMOTION_ORB_COLOUR_MAP.ORANGE, votes: 0},
    {name: EMOTION_ORB_COLOUR_MAP.GREEN, votes: 1},
    {name: EMOTION_ORB_COLOUR_MAP.BLUE, votes: 2},
    {name: EMOTION_ORB_COLOUR_MAP.YELLOW, votes: 3},
    {name: EMOTION_ORB_COLOUR_MAP.PINK, votes: 5}
];

const DEFAULT_GAMMA_VISUALIZATION_DATA = [
    {name: EMOTION_ORB_COLOUR_MAP.ORANGE, votes: 1},
    {name: EMOTION_ORB_COLOUR_MAP.GREEN, votes: 1},
    {name: EMOTION_ORB_COLOUR_MAP.BLUE, votes: 0},
    {name: EMOTION_ORB_COLOUR_MAP.YELLOW, votes: 3},
    {name: EMOTION_ORB_COLOUR_MAP.PINK, votes: 2}
];

const EMOTION_ORB_COLOUR_VALUES = {
    [EMOTION_ORB_COLOUR_MAP.PINK]: {
        color: '#aa139d',
        emissive: '#fe62b5',
        emissiveIntensity: 2.1
    },
    [EMOTION_ORB_COLOUR_MAP.BLUE]: {
        color: '#2a54cf',
        emissive: '#52bdff',
        emissiveIntensity: 2.2
    },
    [EMOTION_ORB_COLOUR_MAP.ORANGE]: {
        color: '#c20000',
        emissive: '#fe5c34',
        emissiveIntensity: 2.470
    },
    [EMOTION_ORB_COLOUR_MAP.GREEN]: {
        color: '#3e952d',
        emissive: '#64ff61',
        emissiveIntensity: 0.86
    },
    [EMOTION_ORB_COLOUR_MAP.YELLOW]: {
        color: '#c79200',
        emissive: '#f0d342',
        emissiveIntensity: 1.08
    }
}

//guiding/error text constants
const GUIDING_TEXT = {
    GET_EMOTION: 'Select an emotion in the middle of the room that resonated with you during your visit to ',
    SHARE_EMOTION_PART1: 'Share your emotion near a tunnel entrance',
    SHARE_EMOTION_PART2: 'Share your emotion near the '
}

const ERROR_TEXT = {
    DISPOSE_ONE_TYPE_PART1: 'Only one ',
    DISPOSE_ONE_TYPE_PART2: ' orb can be dispensed at a time',
    PICK_UP_ONE: 'Cannot pick up two emotion orbs at once'
}

// const CONTENT_TYPES = {
//     INSTRUCTIONS: {name: 'instructions'},
//     MOBILE_INSTRUCTIONS: 'mobileInstructions',
//     DESKTOP_INSTRUCTIONS: 'desktopInstructions',
//     HEADSET_INSTRUCTIONS: 'headsetInstructions',
//     OTHER: 'other',
// }

const COLOURS = {
    SELECTED_TOGGLE: '#6fe260',
    DESELECTED_TOGGLE: '#7d7d7d'
}

//toggle teleport pad info
const TELEPORT_PAD_INFO = {
    OPAQUE: {text: 'Opaque teleport pads selected', text2: 'Opaque teleport pads are easy to see and are a good alternative to avoid motion sickness.'},
    TRANSPARENT: {text: 'Transparent teleport pads selected', text2: 'Transparent teleport pads prioritize visuals over accessibility, making them harder to see.'},
}

//toggle teleport pad info
const BLOOM_INFO = {
    ON: {text: 'Glow is turned on', text2: 'Turned on glow prioritizes visuals over performance. Using glow on mobile devices is discouraged.'},
    OFF: {text: 'Glow is turned off', text2: 'Turned off glow prioritizes performance over visuals.'},
}

//toggle text info
const GUIDING_TEXT_INFO = {
    ON: {text: 'Guiding text is turned on', text2: 'Guiding text will be displayed throughout the main hub and brain wave worlds to help you navigate the experience.'},
    OFF: {text: 'Guiding text is turned off', text2: 'No guiding text will be displayed throughout your experience.'},
}

//instructions
const INSTRUCTIONS = [
    {name:'empty', text: 'About Echoes of the Mind: Brain waves visualized', text2: "Welcome to Echoes of The Mind, a virtual art gallery exploring the visualization of brain waves through interpretive audio and interactive environments."},
    {name:'#instructions_1', text: 'About Echoes of the Mind'},
    {name:'#instructions_2', text: 'About Echoes of the Mind'},
    {name:'#instructions_3', text: 'About Echoes of the Mind'},
    {name:'#instructions_4', text: 'About Echoes of the Mind'},
    {name:'#instructions_5', text: 'About Echoes of the Mind'}
];

//mobile instructions 
const MOBILE_INSTRUCTIONS = [
    {name:'#mobileInstructions_1', text: 'Mobile Instructions'},
    {name:'#mobileInstructions_2', text: 'Mobile Instructions'},
    {name:'#mobileInstructions_3', text: 'Mobile Instructions'},
];

const DESKTOP_INSTRUCTIONS = [
    {name:'#desktopInstructions_1', text: 'Desktop Instructions'},
    {name:'#desktopInstructions_2', text: 'Desktop Instructions'},
    {name:'#desktopInstructions_3', text: 'Desktop Instructions'},
];

const HEADSET_INSTRUCTIONS = [
    {name:'#headsetInstructions_1', text: 'Headset Instructions'},
    {name:'#headsetInstructions_2', text: 'Headset Instructions'},
    {name:'#headsetInstructions_3', text: 'Headset Instructions'},
];
