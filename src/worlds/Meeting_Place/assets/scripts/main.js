AFRAME.registerComponent('campfire-interactive', {
    schema: {},
    init() {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');

        //have to capture all components we need to play with here
        CONTEXT_AF.fireSound    = scene.querySelector('#fireParticlesSound');
        CONTEXT_AF.fireRig      = scene.querySelector('#fireRig');
        CONTEXT_AF.campfire     = scene.querySelector('#campfire');
       // CONTEXT_AF.moonlight    = scene.querySelector('#moonlight');
        CONTEXT_AF.campfireElem = scene.querySelector('#campfire');     
        CONTEXT_AF.fireOn       = false; //at scene start is false    

        // CONTEXT_AF.link_1           = scene.querySelector('#link_1');
        // CONTEXT_AF.link_2           = scene.querySelector('#link_2');
        // CONTEXT_AF.link_3           = scene.querySelector('#link_3');
        // CONTEXT_AF.link_wardrobe    = scene.querySelector('#link_wardrobe');

        // CONTEXT_AF.salonLink.addEventListener('animationcomplete', function(event) {

        //     //console.log(event.detail);

        //     // if ( event.detail.name === 'animation__fireon' ) {

        //     // }
        //     // else if ( event.detail.name === 'animation__fireoff' ) {
        //     //     // CONTEXT_AF.salonLink.setAttribute('scale', {x:0.0, y:0.0, z:0.0});
        //     //     // CONTEXT_AF.salonLink.setAttribute('visible', false);
        //     // }
        // });

        //lets see if fire should be on already ...
        //source: https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
        CONTEXT_AF.getParams = function (url) {
            var params = {};
            var parser = document.createElement('a');
            parser.href = url;
            var query = parser.search.substring(1);
            var vars = query.split('&');
            for (var i = 0; i < vars.length; i++) {
                var pair = vars[i].split('=');
                params[pair[0]] = decodeURIComponent(pair[1]);
            }
            return params;
        };
        const params = CONTEXT_AF.getParams(window.location.href);

        //when sound is loaded call this ...
        if (params.hasOwnProperty('fire') ) {
            if (params['fire'] === 'on') {
                CONTEXT_AF.fireSound.addEventListener('sound-loaded', function(e) {
                    CONTEXT_AF.turnFireOn();
                });
            }
        }

        CONTEXT_AF.campfire.addEventListener('click', function () {
            CONTEXT_AF.fireOn = !CONTEXT_AF.fireOn;

            if ( CONTEXT_AF.fireOn === true ) {
                CONTEXT_AF.turnFireOn();
            }
            else {
                CONTEXT_AF.turnFireOff();
            }
        });
    },
    update() {},
    turnFireOn : function () {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');

        CONTEXT_AF.fireSound.components.sound.playSound();

        //CONTEXT_AF.moonlight.setAttribute('visible', false);
        CONTEXT_AF.fireRig.setAttribute('visible', true);

        // CONTEXT_AF.salonLink.setAttribute('visible', true);
        // CONTEXT_AF.theatreLink.setAttribute('visible', true);
        // CONTEXT_AF.phLink.setAttribute('visible', true);

        //raycaster interaction back on
        // CONTEXT_AF.link_1.setAttribute('class', 'interactive');
        // CONTEXT_AF.link_2.setAttribute('class', 'interactive');
        // CONTEXT_AF.link_3.setAttribute('class', 'interactive');
        // CONTEXT_AF.link_wardrobe.setAttribute('class', 'interactive');
        //scene.querySelector('[raycaster]').components.raycaster.refreshObjects(); //update raycaster

        //animate
        // CONTEXT_AF.link_1.emit('startFireAnim',{}, false);
        // CONTEXT_AF.link_2.emit('startFireAnim',{}, false);
        // CONTEXT_AF.link_3.emit('startFireAnim',{}, false);
        // CONTEXT_AF.link_wardrobe.emit('startFireAnim',{}, false);

       //CONTEXT_AF.campfireElem.setAttribute('circles-object-label',{label_text:'click fire to stop'});
    },
    turnFireOff : function () {
        const CONTEXT_AF = this;
        const scene      = document.querySelector('a-scene');

        CONTEXT_AF.fireSound.components.sound.stopSound();

       // CONTEXT_AF.moonlight.setAttribute('visible', true);
        CONTEXT_AF.fireRig.setAttribute('visible', false);

        // CONTEXT_AF.salonLink.setAttribute('visible', false);
        // CONTEXT_AF.theatreLink.setAttribute('visible', false);
        // CONTEXT_AF.phLink.setAttribute('visible', false);

        //don't want raycaster accessing when not visible
        //TODO: definiotely need to make a portal link component ...
        // CONTEXT_AF.link_1.removeAttribute("class");
        // CONTEXT_AF.link_2.removeAttribute("class");
        // CONTEXT_AF.link_3.removeAttribute("class");
        // CONTEXT_AF.link_wardrobe.removeAttribute("class");
        //scene.querySelector('[raycaster]').components.raycaster.refreshObjects();

        //animate
        // CONTEXT_AF.link_1.emit('stopFireAnim',{}, false);
        // CONTEXT_AF.link_2.emit('stopFireAnim',{}, false);
        // CONTEXT_AF.link_3.emit('stopFireAnim',{}, false);
        // CONTEXT_AF.link_wardrobe.emit('stopFireAnim',{}, false);

        //CONTEXT_AF.campfireElem.setAttribute('circles-object-label',{label_text:'click fire to start'});
    },
});

// AFRAME.registerComponent('chair-maker', {
//     schema: {
//         chairblock:{type:'int', default:'3'},
//         chairnumber:{type:'int', default:'20'}
//     },
//     init() {
//         const CONTEXT_AF = this;
//         const scene      = document.querySelector('a-scene');
//         CONTEXT_AF.createNewChair();
//     },
//     update(){},
//     createNewChair : function() {
//         const CONTEXT_AF = this;
//         let scene = CONTEXT_AF.el.sceneEl;
//         x = 0;
//         y = 0;
//         ry = 160;
//         px = 3.0;
//         pz = 3.0;
//         while(x < 1)  {
//             console.log(x);
//             //while(y<10)
//             //{   
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:-0.314, y:0, z:-8.330});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:178.947, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:5.046, y:0, z:-6.897});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:140.306, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:-5.465, y:0, z:-6.362});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:-145.016, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:-6.383, y:0, z:-17.342});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:-164.220, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:13.155, y:0, z:-13.543});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:134.123, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:-4.387, y:0, z:-12.382});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:-159.990, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:4.118, y:0, z:-12.189});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:164.059, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:-10.293, y:0, z:-7.786});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:-150.459, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:9.836, y:0, z:-7.801});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:122.744, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:-12.570, y:0, z:-13.562});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:-144.211, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;  
//                 console.log('Starting x: '+px);
//                 console.log('Starting z: '+pz);
//                 CONTEXT_AF.newchair = document.createElement('a-entity');
//                 CONTEXT_AF.newchair.setAttribute('id','chair0'+x+y);
//                 CONTEXT_AF.newchair.setAttribute('gltf-model', '/worlds/Meeting_Place/assets/models/objects/meetingobjects/meeting-chair/meeting-chair.glb');
//                 CONTEXT_AF.newchair.setAttribute('position',{x:4.044, y:0, z:-17.967});
//                 CONTEXT_AF.newchair.setAttribute('scale',{x:0.4, y:0.4, z:0.4});
//                 CONTEXT_AF.newchair.setAttribute('rotation',{x:0, y:167.769, z:0});
//                 scene.appendChild(CONTEXT_AF.newchair);
//                 y++;    

//                 //ry = ry+ 20; 
//                 //px = px + 1.898; 
//                 //pz = pz + 1.16;
//                 //console.log('ending x: '+ px);
//                 //console.log('ending z: '+ pz);
//             //}
//             // ry = 160;
//             // px = px-2;
//             // if(x == 1 || x == 2)
//             // {
//             //     if(x==1){
//             //         pz = -4;
//             //     }
//             //     else{
//             //         pz= 4;
//             //     }
                
//             // }
//             // px = 3.0;
//              x++;
//         }
//     },
// });
