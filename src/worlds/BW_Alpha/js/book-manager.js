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

        CONTEXT_AF.book1Placed = false;
        CONTEXT_AF.book2Placed = false;
        CONTEXT_AF.book3Placed = false;
        CONTEXT_AF.book4Placed = false;

        CONTEXT_AF.lectern1 = scene.querySelector('#lectern1');
        CONTEXT_AF.lectern2 = scene.querySelector('#lectern2');
        CONTEXT_AF.lectern3 = scene.querySelector('#lectern3');
        CONTEXT_AF.lectern4 = scene.querySelector('#lectern4');

        CONTEXT_AF.testbtn = scene.querySelector('#tempbutton');
        CONTEXT_AF.bookPlaceEventName = "bookplace_event";
        CONTEXT_AF.bookRandEventName = "bookrandom_event";
        CONTEXT_AF.bookPosUpdateEventName = "bookposition_event";
        CONTEXT_AF.bookplaceduration = 2000;
        CONTEXT_AF.sendRate = 100;

        CONTEXT_AF.track1 = scene.querySelector('#track1');
        CONTEXT_AF.position1 = {x: 0, y: 1.213, z: -12.319};
        CONTEXT_AF.rotation1 = {x: 0, y: 0, z: 0};
        CONTEXT_AF.book1c1 = {x: -0.397, y: 1.472, z: -12.603};
        CONTEXT_AF.book1c2 = {x: 0.392, y: 1.108, z: -12.079};

        CONTEXT_AF.track2 = scene.querySelector('#track2');
        CONTEXT_AF.position2 = {x: 1.605, y: 1.213, z: -13.925};
        CONTEXT_AF.rotation2 = {x: 0, y: 90, z: 0};
        CONTEXT_AF.book2c1 = {x: 1.342, y: 1.472, z: -13.532};
        CONTEXT_AF.book2c2 = {x: 1.806, y: 1.108, z: -14.321};

        CONTEXT_AF.track3 = scene.querySelector('#track3');
        CONTEXT_AF.position3 = {x: 0, y: 1.213, z: -15.53};
        CONTEXT_AF.rotation3 = {x: 0, y: 180, z: 0};
        CONTEXT_AF.book3c1 = {x: 0.397, y: 1.472, z: -15.247};
        CONTEXT_AF.book3c2 = {x: -0.392, y: 1.108, z: -15.733};

        CONTEXT_AF.track4 = scene.querySelector('#track4');
        CONTEXT_AF.position4 = {x: -1.605, y: 1.213, z: -13.925};
        CONTEXT_AF.rotation4 = {x: 0, y: 270, z: 0};
        CONTEXT_AF.book4c1 = {x: -1.342, y: 1.472, z: -14.321};
        CONTEXT_AF.book4c2 = {x: -1.806, y: 1.108, z: -13.532};

        CONTEXT_AF.location1 = 0;
        CONTEXT_AF.location2 = 0;
        CONTEXT_AF.location3 = 0;
        CONTEXT_AF.location4 = 0;

        //when something is picked up, its position is {x: 0, y: -0.1, z: 0.2}
        CONTEXT_AF.pickupx = 0;
        CONTEXT_AF.pickupy = 0;
        CONTEXT_AF.pickupz = 0;

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

            CONTEXT_AF.socket.on(CONTEXT_AF.bookPlaceEventName, (data) => {
                CONTEXT_AF.startMusic(data.book);
            });

            //listen for updating book positions when picked up by others
            CONTEXT_AF.socket.on(CONTEXT_AF.bookPosUpdateEventName, (data) => {
                CONTEXT_AF[`${data.id}`].setAttribute('position', data.position);
            });

            //listen for when the books get randomized
            CONTEXT_AF.socket.on(CONTEXT_AF.bookRandEventName, (data) => {
                CONTEXT_AF.location2 = data.loc2;
                CONTEXT_AF.location3 = data.loc3;
                CONTEXT_AF.location4 = data.loc4;
                CONTEXT_AF.setLocations();
            });
        };

        scene.addEventListener(CIRCLES.EVENTS.READY, function() {
            console.log("Circles is ready:", CIRCLES.isReady());
        });

        CONTEXT_AF.testbtn.addEventListener('click', function(){
            console.log("set book locations");
            CONTEXT_AF.randLocations();
            CONTEXT_AF.setLocations();
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookRandEventName, {
                loc2: CONTEXT_AF.location2,  loc3: CONTEXT_AF.location3, loc4: CONTEXT_AF.location4, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
        });

        //book pickup events
        CONTEXT_AF.book1.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.sendPosition(CONTEXT_AF.book1);
            if (CONTEXT_AF.book1Placed){
                CONTEXT_AF.book1Placed = false;
                CONTEXT_AF.stopMusic(1);
            }
        });

        CONTEXT_AF.book2.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.sendPosition(CONTEXT_AF.book2);
            if (CONTEXT_AF.book2Placed){
                CONTEXT_AF.book2Placed = false;
                CONTEXT_AF.stopMusic(2);
            }
        });

        CONTEXT_AF.book3.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.sendPosition(CONTEXT_AF.book3);
            if (CONTEXT_AF.book3Placed){
                CONTEXT_AF.book3Placed = false;
                CONTEXT_AF.stopMusic(3);
            }
        });

        CONTEXT_AF.book4.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.sendPosition(CONTEXT_AF.book4);
            if (CONTEXT_AF.book4Placed){
                CONTEXT_AF.book4Placed = false;
                CONTEXT_AF.stopMusic(4);
            }
        });

        //book release events 
        CONTEXT_AF.book1.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
        });
        CONTEXT_AF.book2.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
        });
        CONTEXT_AF.book3.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
        });
        CONTEXT_AF.book4.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
        });

        //lectern click events
        CONTEXT_AF.lectern1.addEventListener('click', function () {
            //if holding book 1 place\
            if (CONTEXT_AF.book1.getAttribute("position").x == CONTEXT_AF.pickupx && CONTEXT_AF.book1.getAttribute("position").y == CONTEXT_AF.pickupy && CONTEXT_AF.book1.getAttribute("position").z == CONTEXT_AF.pickupz){
                CONTEXT_AF.book1.emit('click');
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPlaceEventName, {
                    book: 1, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
                CONTEXT_AF.startMusic(1);
                CONTEXT_AF.book1Placed = true; 
            }
            else{
                console.log("u suck GUIDING TEXT place book elsewhere")
            }
        });

        CONTEXT_AF.lectern2.addEventListener('click', function () {
            //if holding book 2 place it on the lectern 2
            if (CONTEXT_AF.book2.getAttribute("position").x == CONTEXT_AF.pickupx && CONTEXT_AF.book2.getAttribute("position").y == CONTEXT_AF.pickupy && CONTEXT_AF.book2.getAttribute("position").z == CONTEXT_AF.pickupz){
                CONTEXT_AF.book2.emit('click');
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPlaceEventName, {
                    book: 2, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
                CONTEXT_AF.startMusic(2);
                CONTEXT_AF.book2Placed = true;
            }
            else{
                console.log("u suck GUIDING TEXT place book elsewhere")
            }
        });

        CONTEXT_AF.lectern3.addEventListener('click', function () {
            //if holding book 3 place it on the lectern 3
            if (CONTEXT_AF.book3.getAttribute("position").x == CONTEXT_AF.pickupx && CONTEXT_AF.book3.getAttribute("position").y == CONTEXT_AF.pickupy && CONTEXT_AF.book3.getAttribute("position").z == CONTEXT_AF.pickupz){
                CONTEXT_AF.book3.emit('click');
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPlaceEventName, {
                    book: 3, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
                CONTEXT_AF.startMusic(3);
                CONTEXT_AF.book3Placed = true;
            }
            else{
                console.log("u suck GUIDING TEXT place book elsewhere")
            }
        });

        CONTEXT_AF.lectern4.addEventListener('click', function () {
            //if holding book 4 place it on the lectern 4
            if (CONTEXT_AF.book4.getAttribute("position").x == CONTEXT_AF.pickupx && CONTEXT_AF.book4.getAttribute("position").y == CONTEXT_AF.pickupy && CONTEXT_AF.book4.getAttribute("position").z == CONTEXT_AF.pickupz){
                CONTEXT_AF.book4.emit('click');
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPlaceEventName, {
                    book: 4, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
                CONTEXT_AF.startMusic(4);
                CONTEXT_AF.book4Placed = true;
            }
            else{
                console.log("u suck GUIDING TEXT place book elsewhere")
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

        //set positions of hidden books
        //CONTEXT_AF.book1.setAttribute('position', CONTEXT_AF.locations[CONTEXT_AF.location1].position);
        //CONTEXT_AF.book1.setAttribute('rotation', CONTEXT_AF.locations[CONTEXT_AF.location1].rotation);
        CONTEXT_AF.book2.setAttribute('position', CONTEXT_AF.locations[CONTEXT_AF.location2].position);
        CONTEXT_AF.book2.setAttribute('rotation', CONTEXT_AF.locations[CONTEXT_AF.location2].rotation);
        CONTEXT_AF.book3.setAttribute('position', CONTEXT_AF.locations[CONTEXT_AF.location3].position);
        CONTEXT_AF.book3.setAttribute('rotation', CONTEXT_AF.locations[CONTEXT_AF.location3].rotation);
        CONTEXT_AF.book4.setAttribute('position', CONTEXT_AF.locations[CONTEXT_AF.location4].position);
        CONTEXT_AF.book4.setAttribute('rotation', CONTEXT_AF.locations[CONTEXT_AF.location4].rotation);
    },

    randLocations: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.numbers = CONTEXT_AF.randNum (4, 0, 11);
        //console.log(CONTEXT_AF.numbers);
        CONTEXT_AF.location1 = CONTEXT_AF.numbers[0];
        CONTEXT_AF.location2 = CONTEXT_AF.numbers[1];
        CONTEXT_AF.location3 = CONTEXT_AF.numbers[2];
        CONTEXT_AF.location4 = CONTEXT_AF.numbers[3];
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

    // start music when book is placed on a lectern
    startMusic: function (book) {
        const CONTEXT_AF = this;
        
        CONTEXT_AF[`book${book}`].setAttribute('position', CONTEXT_AF[`position${book}`]);
        CONTEXT_AF[`book${book}`].setAttribute('rotation', CONTEXT_AF[`rotation${book}`]);
        CONTEXT_AF[`book${book}`].setAttribute('gltf-model', '#openbook_model');

        const sparkle = document.querySelector(`#sparkle${book}`);

        sparkle.setAttribute('particle-system', 'preset: default; texture: /worlds/BW_Alpha/assets/textures/sparkle.png; color: #ffc178; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; positionSpread: 0 0 0; maxAge:2; blending: 2; velocityValue: 0 0 0; size: 0.05; sizeSpread: -0.3; duration:' +  CONTEXT_AF.bookplaceduration/1000 + '; particleCount: 80;');

        const position = CONTEXT_AF[`position${book}`];

        /*[`book${book}`].setAttribute('animation__descend', {
            property: 'position',
            from: {x: position.x, y: position.y + 2, z: position.z},
            to: position,
            dur: CONTEXT_AF.bookplaceduration,
            startEvents: onclick,
        });*/
        setTimeout(() => {
            CONTEXT_AF[`track${book}`].setAttribute('circles-sound', `src:#track${book}-music; autoplay: true; loop: true; type: music; poolsize:1; volume: 1`);
        }, CONTEXT_AF.bookplaceduration);

        const musicParticle = document.querySelector(`#musicparticles${book}`);
        musicParticle.setAttribute('particle-system', "preset:dust; texture: /worlds/BW_Alpha/assets/textures/eighthnote.png; color: #ffbaba ; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; rotationAngle: 0.1; positionSpread: 0 1 1; maxAge:3.5; blending: 2; dragValue: 1; velocityValue: 0 0.5 0; size: 0.2; sizeSpread: -0.1; duration: infinity; particleCount: 12; enabled:true"); 
    },

    stopMusic: function (book){
        const CONTEXT_AF = this;
        
        CONTEXT_AF[`book${book}`].setAttribute('rotation', '0 0 0');
        CONTEXT_AF[`book${book}`].setAttribute('gltf-model', '#book_model');

        const sparkle = document.querySelector(`#sparkle${book}`);

        sparkle.setAttribute('particle-system', 'preset: default; texture: /worlds/BW_Alpha/assets/textures/sparkle.png; color: #ffc178; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; positionSpread: 0 0 0; maxAge:2; blending: 2; velocityValue: 0 0 0; size: 0.05; sizeSpread: -0.3; duration:infinity');

        CONTEXT_AF[`track${book}`].setAttribute('circles-sound', `src:#track${book}-music; autoplay: true; loop: true; type: music; poolsize:1; volume: 0`);

        const musicParticle = document.querySelector(`#musicparticles${book}`);
        musicParticle.setAttribute('particle-system', "preset:dust; texture: /worlds/BW_Alpha/assets/textures/eighthnote.png; color: #ffbaba ; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; rotationAngle: 0.1; positionSpread: 0 1 1; maxAge:3.5; blending: 2; dragValue: 1; velocityValue: 0 0.5 0; size: 0.2; sizeSpread: -0.1; duration: infinity; particleCount: 12; enabled:false");
    },

    sendPosition: function (book) {
        const CONTEXT_AF = this;
        // emit the position to the server if a book is picked up
        const emitPosition = () => {
            // if book is not picked up do not send position
            if (book.getAttribute("position").x != CONTEXT_AF.pickupx && book.getAttribute("position").y != CONTEXT_AF.pickupy && book.getAttribute("position").z != CONTEXT_AF.pickupz){
                return;
            }

            let worldPos = new THREE.Vector3();
            book.object3D.getWorldPosition(worldPos);

            CONTEXT_AF.socket.emit(CONTEXT_AF.bookPosUpdateEventName, {
                id: book.getAttribute("id"),
                position: {x: worldPos.x, y: worldPos.y, z: worldPos.z},
                room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });

            setTimeout(emitPosition, 1000/CONTEXT_AF.sendRate); // repeat at the defined rate
        };
    
        emitPosition(); // call emit position
    }
});