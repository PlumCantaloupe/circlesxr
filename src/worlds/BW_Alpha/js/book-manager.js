//save location arrays with postion and rotation

//randomize four numbers function
// store each number in a seperate variable

//place books at postion function
AFRAME.registerComponent('book-manager', {
    schema: {
    },

    init() {
        const CONTEXT_AF = this;
        const scene = CIRCLES.getCirclesSceneElement();

        // Circles WebSocket and room tracking
        CONTEXT_AF.socket = null;
        CONTEXT_AF.connected = false;

        CONTEXT_AF.locations = [{position: {x: -1.412, y: 2.910, z: -19.445}, rotation: {x: 0, y: -90, z: 0} },
                                {position: {x: -9.907, y: 1.970, z: -7.057}, rotation: {x: 0, y: 0, z: 0} },
                                {position: {x: -10.665, y: 1.033, z: -3.122}, rotation: {x: 0, y: 180, z: 0} },
                                {position: {x: 12.682, y: 1.033, z: -11.106}, rotation: {x: 0, y: 180, z: 0} },
                                {position: {x: 7.169, y: 1.970, z: -21.054}, rotation: {x: 0, y: 180, z: 0} },
                                {position: {x: 3.759, y: 1.033, z: -22.745}, rotation: {x: 0, y: 90, z: 0} },
                                {position: {x: -4.449, y: 1.033, z: -29.742}, rotation: {x: 0, y: 0, z: 0} },
                                {position: {x: -7.946, y: 1.970, z: -31.651}, rotation: {x: 0, y: 180, z: 0} },
                                {position: {x: 12.682, y: 1.970, z: -34.084}, rotation: {x: 0, y: 180, z: 0} },
                                {position: {x: 12.682, y: 7.183, z: -30.863}, rotation: {x: 0, y: 180, z: 0} },
                                {position: {x: 4.450, y: 7.183, z: -28.073}, rotation: {x: 0, y: 180, z: 0} },
                                {position: {x: -9.887, y: 8.121, z: -25.981}, rotation: {x: 0, y: 0, z: 0} }
        ];
        
        CONTEXT_AF.book1 = scene.querySelector('#book1');
        CONTEXT_AF.book2 = scene.querySelector('#book2');
        CONTEXT_AF.book3 = scene.querySelector('#book3');
        CONTEXT_AF.book4 = scene.querySelector('#book4');
        CONTEXT_AF.testbtn = scene.querySelector('#tempbutton');


        CONTEXT_AF.track1 = scene.querySelector('#track1');
        CONTEXT_AF.position1 = {x: 0, y: 1.213, z: -12.319};
        CONTEXT_AF.rotation1 = {x: 0, y: 0, z: 0};
        CONTEXT_AF.book1c1 = {x: -0.397, y: 1.472, z: -12.603};
        CONTEXT_AF.book1c2 = {x: 0.392, y: 1.108, z: -12.079};

        CONTEXT_AF.track2 = scene.querySelector('#track2');
        CONTEXT_AF.position2 = {x: 1.639, y: 1.213, z: -13.925};
        CONTEXT_AF.rotation2 = {x: 0, y: 90, z: 0};
        CONTEXT_AF.book2c1 = {x: 1.367, y: 1.472, z: -13.528};
        CONTEXT_AF.book2c2 = {x: 1.847, y: 1.108, z: -14.317};

        CONTEXT_AF.track3 = scene.querySelector('#track3');
        CONTEXT_AF.position3 = {x: 0, y: 1.213, z: -15.53};
        CONTEXT_AF.rotation3 = {x: 0, y: 180, z: 0};
        CONTEXT_AF.book3c1 = {x: 0.397, y: 1.472, z: -15.247};
        CONTEXT_AF.book3c2 = {x: -0.392, y: 1.108, z: -15.733};

        CONTEXT_AF.track4 = scene.querySelector('#track4');
        CONTEXT_AF.position4 = {x: -1.639, y: 1.213, z: -13.925};
        CONTEXT_AF.rotation4 = {x: 0, y: 270, z: 0};
        CONTEXT_AF.book4c1 = {x: -1.367, y: 1.472, z: -14.317};
        CONTEXT_AF.book4c2 = {x: -1.847, y: 1.108, z: -13.528};

        CONTEXT_AF.location1 = 0;
        CONTEXT_AF.location2 = 0;
        CONTEXT_AF.location3 = 0;
        CONTEXT_AF.location4 = 0;

        // Setup WebSocket & Event Listeners
        CONTEXT_AF.createNetworkingSystem = function () {
            CONTEXT_AF.socket = CIRCLES.getCirclesWebsocket();
            CONTEXT_AF.connected = true;
            console.warn("messaging system connected at socket: " + CONTEXT_AF.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            CONTEXT_AF.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {
                }
            });
        };

        scene.addEventListener(CIRCLES.EVENTS.READY, function() {
            console.log("Circles is ready:", CIRCLES.isReady());
        });

        CONTEXT_AF.testbtn.addEventListener('click', function(){
            console.log("set book locations");
            CONTEXT_AF.setLocations();
        });

        CONTEXT_AF.book1.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            console.log(CONTEXT_AF.book1.getAttribute('position'));
            if(CONTEXT_AF.betweenPos(CONTEXT_AF.book1.getAttribute('position'), CONTEXT_AF.book1c1, CONTEXT_AF.book1c2)){
                //emit to others
                //dont need to emit position or rotation i think idk (only host can place book rn idk why)
                CONTEXT_AF.book1.setAttribute('position', CONTEXT_AF.position1);
                CONTEXT_AF.book1.setAttribute('rotation', CONTEXT_AF.rotation1);
                CONTEXT_AF.book1.setAttribute('gltf-model', '#openbook_model');
                CONTEXT_AF.startMusic(1);
            }
        });

        CONTEXT_AF.book2.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            console.log(CONTEXT_AF.book1.getAttribute('position'));
            if(CONTEXT_AF.betweenPos(CONTEXT_AF.book2.getAttribute('position'), CONTEXT_AF.book2c1, CONTEXT_AF.book2c2)){
                //emit to others
                CONTEXT_AF.book2.setAttribute('position', CONTEXT_AF.position2);
                CONTEXT_AF.book2.setAttribute('rotation', CONTEXT_AF.rotation2);
                CONTEXT_AF.book2.setAttribute('gltf-model', '#openbook_model');
                CONTEXT_AF.startMusic(2);
            }
        });

        CONTEXT_AF.book3.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            console.log(CONTEXT_AF.book3.getAttribute('position'));
            if(CONTEXT_AF.betweenPos(CONTEXT_AF.book3.getAttribute('position'), CONTEXT_AF.book3c1, CONTEXT_AF.book3c2)){
                //emit to others
                CONTEXT_AF.book3.setAttribute('position', CONTEXT_AF.position3);
                CONTEXT_AF.book3.setAttribute('rotation', CONTEXT_AF.rotation3);
                CONTEXT_AF.book3.setAttribute('gltf-model', '#openbook_model');
                CONTEXT_AF.startMusic(3);
            }
        });

        CONTEXT_AF.book4.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            console.log(CONTEXT_AF.book4.getAttribute('position'));
            if(CONTEXT_AF.betweenPos(CONTEXT_AF.book4.getAttribute('position'), CONTEXT_AF.book4c1, CONTEXT_AF.book4c2)){
                //emit to others
                CONTEXT_AF.book4.setAttribute('position', CONTEXT_AF.position4);
                CONTEXT_AF.book4.setAttribute('rotation', CONTEXT_AF.rotation4);
                CONTEXT_AF.book4.setAttribute('gltf-model', '#openbook_model');
                CONTEXT_AF.startMusic(4);
            }
        });

        if (CIRCLES.isCirclesWebsocketReady()) {
            CONTEXT_AF.createNetworkingSystem();
        } else {
            const wsReadyFunc = function() {
                CONTEXT_AF.createNetworkingSystem();
                CONTEXT_AF.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            CONTEXT_AF.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }
    },


    // set locations of books
    setLocations: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.numbers = CONTEXT_AF.randNum (4, 0, 11);

        CONTEXT_AF.location1 = CONTEXT_AF.numbers[0];
        CONTEXT_AF.location2 = CONTEXT_AF.numbers[1];
        CONTEXT_AF.location3 = CONTEXT_AF.numbers[2];
        CONTEXT_AF.location4 = CONTEXT_AF.numbers[3];

        //set positions of hidden books
        CONTEXT_AF.book1.setAttribute('position', CONTEXT_AF.locations[CONTEXT_AF.location1].position);
        CONTEXT_AF.book1.setAttribute('rotation', CONTEXT_AF.locations[CONTEXT_AF.location1].rotation);
        CONTEXT_AF.book2.setAttribute('position', CONTEXT_AF.locations[CONTEXT_AF.location2].position);
        CONTEXT_AF.book2.setAttribute('rotation', CONTEXT_AF.locations[CONTEXT_AF.location2].rotation);
        CONTEXT_AF.book3.setAttribute('position', CONTEXT_AF.locations[CONTEXT_AF.location3].position);
        CONTEXT_AF.book3.setAttribute('rotation', CONTEXT_AF.locations[CONTEXT_AF.location3].rotation);
        CONTEXT_AF.book4.setAttribute('position', CONTEXT_AF.locations[CONTEXT_AF.location4].position);
        CONTEXT_AF.book4.setAttribute('rotation', CONTEXT_AF.locations[CONTEXT_AF.location4].rotation);

        console.log(CONTEXT_AF.numbers);
    },

    randNum: function (quantity, min, max) {
        //randomize quantity amount of unique numbers betwee min and max
        const numbers = []
            while(numbers.length < quantity){
                var currNum = Math.floor(Math.random() * max) + min
                if(numbers.indexOf(currNum) === -1){
                    numbers.push(currNum);
                }
            }
        return(numbers);
    },

    betweenPos: function (position, c1, c2){
        //assign the coordinates of the corners to min and max values
        const minX = Math.min(c1.x, c2.x);
        const maxX = Math.max(c1.x, c2.x);
        const minY = Math.min(c1.y, c2.y);
        const maxY = Math.max(c1.y, c2.y);
        const minZ = Math.min(c1.z, c2.z);
        const maxZ = Math.max(c1.z, c2.z);

        return (position.x >= minX && position.x <= maxX && 
            position.y >= minY && position.y <= maxY &&
            position.z >= minZ && position.z <= maxZ);
    },

    // set locations of books
    startMusic: function (book) {
        const CONTEXT_AF = this;
        
        CONTEXT_AF[`track${book}`].setAttribute('circles-sound', `src:#track${book}-music; autoplay: true; loop: true; type: music; poolsize:1; volume: 1`);
    },
});