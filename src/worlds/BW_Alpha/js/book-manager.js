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

        //guiding text manager
        CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];

        // Circles WebSocket and room tracking
        CONTEXT_AF.socket = null;
        CONTEXT_AF.connected = false;

        CONTEXT_AF.locations = [{position: {x: -1.873, y: 2.195, z: -19.600}, rotation: {x: 0, y: 90, z: 0}},
                                {position: {x: -10.038, y: 2.195, z: -7.128}, rotation: {x: 0, y: 180, z: 0}},
                                {position: {x: -10.511, y: 1.277, z: -3.127}, rotation: {x: 0, y: 180, z: 0}},
                                {position: {x: 12.826, y: 1.277, z: -11.427}, rotation: {x: 0, y: 0, z: 0}},
                                {position: {x: 7.302, y: 2.195, z: -21.131}, rotation: {x: 0, y: 0, z: 0}},
                                {position: {x: 3.760, y: 1.277, z: -22.586}, rotation: {x: 0, y: -90, z: 0}},
                                {position: {x: -4.598, y: 1.277, z: -29.613}, rotation: {x: 0, y: 180, z: 0}},
                                {position: {x: -7.793, y: 2.195, z: -31.725}, rotation: {x: 0, y: 0, z: 0}},
                                {position: {x: 12.836, y: 2.195, z: -34.083}, rotation: {x: 0, y: 0, z: 0}},
                                {position: {x: 12.833, y: 7.406, z: -30.496}, rotation: {x: 0, y: 180, z: 0}},
                                {position: {x: 7.317, y: 7.406, z: -28.147}, rotation: {x: 0, y: 0, z: 0}},
                                {position: {x: -10.043, y: 8.327, z: -25.887}, rotation: {x: 0, y: 180, z: 0}}
          ];
        
        CONTEXT_AF.book1 = scene.querySelector('#book1');
        CONTEXT_AF.book2 = scene.querySelector('#book2');
        CONTEXT_AF.book3 = scene.querySelector('#book3');
        CONTEXT_AF.book4 = scene.querySelector('#book4');

        CONTEXT_AF.bookRand = false;
        CONTEXT_AF.book1Placed = false;
        CONTEXT_AF.book2Placed = false;
        CONTEXT_AF.book3Placed = false;
        CONTEXT_AF.book4Placed = false;

        CONTEXT_AF.lectern1 = scene.querySelector('#lectern1');
        CONTEXT_AF.lectern2 = scene.querySelector('#lectern2');
        CONTEXT_AF.lectern3 = scene.querySelector('#lectern3');
        CONTEXT_AF.lectern4 = scene.querySelector('#lectern4');

        CONTEXT_AF.bookPlaceEventName = "bookplace_event";
        CONTEXT_AF.bookPickupEventName = "bookpickup_event";
        CONTEXT_AF.bookReleaseEventName = "bookrelease_event";
        CONTEXT_AF.bookPickupLecternEventName = "bookpicklectern_event";
        CONTEXT_AF.bookRandEventName = "bookrandom_event";
        CONTEXT_AF.bookPosUpdateEventName = "bookposition_event";
        CONTEXT_AF.bookSyncEventName = "booksync_event";
        CONTEXT_AF.bookplaceduration = 2000;
        CONTEXT_AF.loadduration = 2000;
        CONTEXT_AF.sendRate = 100;

        CONTEXT_AF.position1 = {x: 0, y: 1.3, z: -12.319};
        CONTEXT_AF.rotation1 = {x: 0, y: 0, z: 0};
        CONTEXT_AF.position2 = {x: 1.605, y: 1.3, z: -13.925};
        CONTEXT_AF.rotation2 = {x: 0, y: 90, z: 0};
        CONTEXT_AF.position3 = {x: 0, y: 1.3, z: -15.53};
        CONTEXT_AF.rotation3 = {x: 0, y: 180, z: 0};
        CONTEXT_AF.position4 = {x: -1.605, y: 1.3, z: -13.925};
        CONTEXT_AF.rotation4 = {x: 0, y: 270, z: 0};

        //CONTEXT_AF.location1 = 0;
        CONTEXT_AF.location2 = 0;
        CONTEXT_AF.location3 = 0;
        CONTEXT_AF.location4 = 0;

        //when something is picked up, its position is {x: 0, y: -0.1, z: 0.2}
        CONTEXT_AF.pickupx = 0;
        CONTEXT_AF.pickupy = 0;
        CONTEXT_AF.pickupz = 0.5;

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
                CONTEXT_AF[`book${data.book}Placed`] = true;
            });

            //when book is picked up by one person, other clients cannot take it from them
            CONTEXT_AF.socket.on(CONTEXT_AF.bookPickupEventName, (data) => {
                CONTEXT_AF[`book${data.book}`].setAttribute('circles-interactive-object', 'enabled: false;');
            });

            CONTEXT_AF.socket.on(CONTEXT_AF.bookReleaseEventName, (data) => {
                CONTEXT_AF[`book${data.book}`].setAttribute('circles-interactive-object', 'enabled: true;');
            });

            //listen for updating book positions when picked up by others
            CONTEXT_AF.socket.on(CONTEXT_AF.bookPosUpdateEventName, (data) => {
                CONTEXT_AF[`${data.id}`].setAttribute('position', data.position);
            });

            // listen for if a book gets picked up from a lectern:
            CONTEXT_AF.socket.on(CONTEXT_AF.bookPickupLecternEventName, (data) => {
                CONTEXT_AF[`book${data.book}Placed`] = false;
                CONTEXT_AF.stopMusic(data.book);
            });

            //listen for when the books get randomized
            CONTEXT_AF.socket.on(CONTEXT_AF.bookRandEventName, (data) => {
                CONTEXT_AF.location2 = data.loc2;
                CONTEXT_AF.location3 = data.loc3;
                CONTEXT_AF.location4 = data.loc4;
                CONTEXT_AF.setLocations();
            });

            //sync book locations is theyre placed when a new player joins
            CONTEXT_AF.socket.on(CONTEXT_AF.bookSyncEventName, async (data) => {
                CONTEXT_AF.bookRand = data.rand;
                for (let i = 1; i < 5; i++){
                    if(!data.placed[i - 1]){
                        CONTEXT_AF[`book${i}`].setAttribute('position', data.locations[i - 1]);
                    }
                }

                //wait until all tracks have loaded in toe sync the books placed on lecterns and play the music
                while (CONTEXT_AF.loadCount < 4) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                for (let i = 1; i < 5; i++){
                    if(data.placed[i - 1]){
                        CONTEXT_AF[`book${i}Placed`] = true;
                        CONTEXT_AF.startMusic(i);
                        console.log("start music was called for book " + i);
                    }
                }
            });
        };

        scene.addEventListener(CIRCLES.EVENTS.READY, function() {
            console.log("Circles is ready:", CIRCLES.isReady());
            //add guiding text
            CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.SEARCH_BOOKS);
            console.log('guiding text?');
            //CONTEXT_AF.playTracks();
        });

        // tthe music tracks aren't synced across clients, so start autoplaying music with 0 volume when a player joins
        document.body.addEventListener('connected', () => {
            console.log("connected event");
            CONTEXT_AF.playTracks();
        });

        //when a new user joins the room, send the positions of books if they are randoimzed and if they've been placed on lecterns or not
        document.body.addEventListener('clientConnected', (evt) => {
            console.log('Another user joined the room:', evt.detail.clientId);

            //if books positions have been randomized already emit those locations to joining clients
            if (CONTEXT_AF.bookRand){
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookRandEventName, {
                    loc2: CONTEXT_AF.location2,  loc3: CONTEXT_AF.location3, loc4: CONTEXT_AF.location4, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
                //also send if any books have been placed on lecterns or moved when new users join
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookSyncEventName, {
                    locations: [CONTEXT_AF.book1.getAttribute("position"), CONTEXT_AF.book2.getAttribute("position"), CONTEXT_AF.book3.getAttribute("position"), CONTEXT_AF.book4.getAttribute("position")],
                    placed: [CONTEXT_AF.book1Placed, CONTEXT_AF.book2Placed, CONTEXT_AF.book3Placed, CONTEXT_AF.book4Placed],
                    rand: CONTEXT_AF.bookRand,
                    room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
            }
        });

        //book pickup events
        CONTEXT_AF.book1.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.PLACE_BOOK);
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupEventName, {
                book: 1,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
            if (CONTEXT_AF.book1Placed){
                CONTEXT_AF.book1Placed = false;
                CONTEXT_AF.stopMusic(1);
                // emit to others to stop their music and change their book models
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupLecternEventName, {
                    book: 1,
                    room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
            }
            CONTEXT_AF.sendPosition(CONTEXT_AF.book1);
        });

        CONTEXT_AF.book2.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.PLACE_BOOK);
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupEventName, {
                book: 2,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupEventName, {
                book: 2,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
            if (CONTEXT_AF.book2Placed){
                CONTEXT_AF.book2Placed = false;
                CONTEXT_AF.stopMusic(2);
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupLecternEventName, {
                    book: 2,
                    room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
            }
            CONTEXT_AF.sendPosition(CONTEXT_AF.book2);
        });

        CONTEXT_AF.book3.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.PLACE_BOOK);
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupEventName, {
                book: 3,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
            if (CONTEXT_AF.book3Placed){
                CONTEXT_AF.book3Placed = false;
                CONTEXT_AF.stopMusic(3);
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupLecternEventName, {
                    book: 3,
                    room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
            }
            CONTEXT_AF.sendPosition(CONTEXT_AF.book3);
        });

        CONTEXT_AF.book4.addEventListener(CIRCLES.EVENTS.PICKUP_THIS_OBJECT, () => {
            CONTEXT_AF.guidingText.updateGuidingText(GUIDING_TEXT.PLACE_BOOK);
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupEventName, {
                book: 4,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
            if (CONTEXT_AF.book4Placed){
                CONTEXT_AF.book4Placed = false;
                CONTEXT_AF.stopMusic(4);
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPickupLecternEventName, {
                    book: 4,
                    room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
            }
            CONTEXT_AF.sendPosition(CONTEXT_AF.book4);
        });

        //book release events 
        CONTEXT_AF.book1.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            CONTEXT_AF.guidingText.hideGuidingText();
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookReleaseEventName, {
                book: 1,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
        });
        CONTEXT_AF.book2.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            CONTEXT_AF.guidingText.hideGuidingText();
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookReleaseEventName, {
                book: 2,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
        });
        CONTEXT_AF.book3.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            CONTEXT_AF.guidingText.hideGuidingText();
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookReleaseEventName, {
                book: 3,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
        });
        CONTEXT_AF.book4.addEventListener(CIRCLES.EVENTS.RELEASE_THIS_OBJECT, () => {
            CONTEXT_AF.guidingText.hideGuidingText();
            CONTEXT_AF.socket.emit(CONTEXT_AF.bookReleaseEventName, {
                book: 4,
                room: CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
            });
        });

        //lectern click events
        CONTEXT_AF.lectern1.addEventListener('click', function () {
            if(!CONTEXT_AF.bookRand){
                console.log("set book locations");
                CONTEXT_AF.randLocations();
                CONTEXT_AF.setLocations();
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookRandEventName, {
                    loc2: CONTEXT_AF.location2,  loc3: CONTEXT_AF.location3, loc4: CONTEXT_AF.location4, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
            CONTEXT_AF.bookRand = true;
            }
            
            //if holding book 1 place
            if (CONTEXT_AF.book1.getAttribute("position").x == CONTEXT_AF.pickupx && CONTEXT_AF.book1.getAttribute("position").y == CONTEXT_AF.pickupy && CONTEXT_AF.book1.getAttribute("position").z == CONTEXT_AF.pickupz){
                CONTEXT_AF.book1.emit('click');
                CONTEXT_AF.socket.emit(CONTEXT_AF.bookPlaceEventName, {
                    book: 1, room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()
                });
                CONTEXT_AF.startMusic(1);
                CONTEXT_AF.book1Placed = true; 
            }
            else{
                CONTEXT_AF.guidingText.displayError(ERROR_TEXT.INCORRECT_LECTERN);
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
                CONTEXT_AF.guidingText.displayError(ERROR_TEXT.INCORRECT_LECTERN);
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
                CONTEXT_AF.guidingText.displayError(ERROR_TEXT.INCORRECT_LECTERN);
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
                CONTEXT_AF.guidingText.displayError(ERROR_TEXT.INCORRECT_LECTERN);
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

    //create entities for the music and play the music
    playTracks: function () {
        const CONTEXT_AF = this;
        const scene = CIRCLES.getCirclesSceneElement();
        CONTEXT_AF.loadCount = 0;

        for (let i = 1; i < 5; i++){
            CONTEXT_AF[`track${i}`] = document.createElement('a-entity');
            CONTEXT_AF[`track${i}`].setAttribute('id', `track${i}`);
            CONTEXT_AF[`track${i}`].setAttribute('sound', `src:#track${i}-music; loop: true; poolsize:1; volume: 0; positional:false;`);

            CONTEXT_AF[`track${i}`].addEventListener('sound-loaded', function () {
                CONTEXT_AF[`start${i}`] = true;
                CONTEXT_AF.loadCount++;

                if (CONTEXT_AF.loadCount == 4){
                    CONTEXT_AF.track1.components.sound.playSound();
                    CONTEXT_AF.track2.components.sound.playSound();
                    CONTEXT_AF.track3.components.sound.playSound();
                    CONTEXT_AF.track4.components.sound.playSound();
                    console.log("all tracks loaded and playing");
                }
            })
            scene.appendChild(CONTEXT_AF[`track${i}`]);
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
        CONTEXT_AF.numbers = CONTEXT_AF.randNum (3, 0, 11);
        //console.log(CONTEXT_AF.numbers);
        //CONTEXT_AF.location1 = CONTEXT_AF.numbers[0];
        CONTEXT_AF.location2 = CONTEXT_AF.numbers[0];
        CONTEXT_AF.location3 = CONTEXT_AF.numbers[1];
        CONTEXT_AF.location4 = CONTEXT_AF.numbers[2];
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

        const musicParticle = document.querySelector(`#musicparticles${book}`);
        musicParticle.setAttribute('particle-system', "preset:dust; texture: /worlds/BW_Alpha/assets/textures/eighthnote.png; color: #ffbaba ; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; rotationAngle: 0.1; positionSpread: 0 1 1; maxAge:3.5; blending: 2; dragValue: 1; velocityValue: 0 0.5 0; size: 0.2; sizeSpread: -0.1; duration: infinity; particleCount: 12; enabled:true"); 

        CONTEXT_AF[`track${book}`].setAttribute('sound', `src:#track${book}-music; loop: true; poolsize:1; volume: 1; positional:false;`);
        CONTEXT_AF[`track${book}`].setAttribute('sound.volume', '1');
    },

    stopMusic: function (book){
        const CONTEXT_AF = this;

        //CONTEXT_AF[`book${book}`].setAttribute('position', {x: CONTEXT_AF.pickupx, y: CONTEXT_AF.pickupy, z: CONTEXT_AF.pickupz});
        //CONTEXT_AF[`book${book}`].setAttribute('rotation', '0 0 0');
        CONTEXT_AF[`book${book}`].setAttribute('gltf-model', `#book_model${book}`);

        const sparkle = document.querySelector(`#sparkle${book}`);

        sparkle.setAttribute('particle-system', 'preset: default; texture: /worlds/BW_Alpha/assets/textures/sparkle.png; color: #ffc178; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; positionSpread: 0 0 0; maxAge:2; blending: 2; velocityValue: 0 0 0; size: 0.05; sizeSpread: -0.3; duration:infinity');
        
        const musicParticle = document.querySelector(`#musicparticles${book}`);
        musicParticle.setAttribute('particle-system', "preset:dust; texture: /worlds/BW_Alpha/assets/textures/eighthnote.png; color: #ffbaba ; accelerationSpread: 0 0 0; accelerationValue: 0 0 0; rotationAngle: 0.1; positionSpread: 0 1 1; maxAge:3.5; blending: 2; dragValue: 1; velocityValue: 0 0.5 0; size: 0.2; sizeSpread: -0.1; duration: infinity; particleCount: 12; enabled:false");

        CONTEXT_AF[`track${book}`].setAttribute('sound', `src:#track${book}-music; loop: true; poolsize:1; volume: 0; positional:false;`);
        CONTEXT_AF[`track${book}`].setAttribute('sound.volume', '0');
        console.log("picked up book from lecterbn");
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