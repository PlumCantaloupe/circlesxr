AFRAME.registerComponent('campfire-interactive', {
    schema: {},
    init() {
        const Context_AF = this;
        const scene      = document.querySelector('a-scene');

        //have to capture all components we need to play with here
        Context_AF.fireSound    = scene.querySelector('#fireParticlesSound');
        Context_AF.fireRig      = scene.querySelector('#fireRig');
        Context_AF.campfire     = scene.querySelector('#campfire');
        Context_AF.moonlight    = scene.querySelector('#moonlight');
        Context_AF.campfireElem = scene.querySelector('#campfire');     
        Context_AF.fireOn       = false; //at scene start is false    

        Context_AF.salonLink    = scene.querySelector('#salonLink');
        Context_AF.theatreLink  = scene.querySelector('#theatreLink');
        Context_AF.phLink       = scene.querySelector('#provinceHouseLink'); 
        Context_AF.costumeLink  = scene.querySelector('#costumeObjLink');

        // Context_AF.salonLink.addEventListener('animationcomplete', function(event) {

        //     //console.log(event.detail);

        //     // if ( event.detail.name === 'animation__fireon' ) {

        //     // }
        //     // else if ( event.detail.name === 'animation__fireoff' ) {
        //     //     // Context_AF.salonLink.setAttribute('scale', {x:0.0, y:0.0, z:0.0});
        //     //     // Context_AF.salonLink.setAttribute('visible', false);
        //     // }
        // });

        //lets see if fire should be on already ...
        //source: https://gomakethings.com/getting-all-query-string-values-from-a-url-with-vanilla-js/
        Context_AF.getParams = function (url) {
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
        const params = Context_AF.getParams(window.location.href);

        //when sound is loaded call this ...
        if (params.hasOwnProperty('fire') ) {
            if (params['fire'] === 'on') {
                Context_AF.fireSound.addEventListener('sound-loaded', function(e) {
                    Context_AF.turnFireOn();
                });
            }
        }

        Context_AF.campfire.addEventListener('click', function () {
            Context_AF.fireOn = !Context_AF.fireOn;

            if ( Context_AF.fireOn === true ) {
                Context_AF.turnFireOn();
            }
            else {
                Context_AF.turnFireOff();
            }
        });
    },
    update() {},
    turnFireOn : function () {
        const Context_AF = this;
        const scene      = document.querySelector('a-scene');

        Context_AF.fireSound.components.sound.playSound();

        Context_AF.moonlight.setAttribute('visible', false);
        Context_AF.fireRig.setAttribute('visible', true);

        // Context_AF.salonLink.setAttribute('visible', true);
        // Context_AF.theatreLink.setAttribute('visible', true);
        // Context_AF.phLink.setAttribute('visible', true);

        //raycaster interaction back on
        Context_AF.salonLink.setAttribute('class', 'interactive');
        Context_AF.theatreLink.setAttribute('class', 'interactive');
        Context_AF.phLink.setAttribute('class', 'interactive');
        Context_AF.costumeLink.setAttribute('class', 'interactive');
        //scene.querySelector('[raycaster]').components.raycaster.refreshObjects(); //update raycaster

        //animate
        Context_AF.salonLink.emit('startFireAnim',{}, false);
        Context_AF.theatreLink.emit('startFireAnim',{}, false);
        Context_AF.phLink.emit('startFireAnim',{}, false);
        Context_AF.costumeLink.emit('startFireAnim',{}, false);


        Context_AF.campfireElem.setAttribute('circles-object-label',{label_text:'click fire to stop'});
    },
    turnFireOff : function () {
        const Context_AF = this;
        const scene      = document.querySelector('a-scene');

        Context_AF.fireSound.components.sound.stopSound();

        Context_AF.moonlight.setAttribute('visible', true);
        Context_AF.fireRig.setAttribute('visible', false);

        // Context_AF.salonLink.setAttribute('visible', false);
        // Context_AF.theatreLink.setAttribute('visible', false);
        // Context_AF.phLink.setAttribute('visible', false);

        //don't want raycaster accessing when not visible
        //TODO: definiotely need to make a portal link component ...
        Context_AF.salonLink.removeAttribute("class");
        Context_AF.theatreLink.removeAttribute("class");
        Context_AF.phLink.removeAttribute("class");
        Context_AF.costumeLink.removeAttribute("class");

        //scene.querySelector('[raycaster]').components.raycaster.refreshObjects();

        //animate
        Context_AF.salonLink.emit('stopFireAnim',{}, false);
        Context_AF.theatreLink.emit('stopFireAnim',{}, false);
        Context_AF.phLink.emit('stopFireAnim',{}, false);
        Context_AF.costumeLink.emit('stopFireAnim',{}, false);

        Context_AF.campfireElem.setAttribute('circles-object-label',{label_text:'click fire to start'});
    },
});