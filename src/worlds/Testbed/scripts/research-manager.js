//System: Will control data collection and communication with server
AFRAME.registerSystem('research-manager', {
    init() {
        //called on 
        console.log('research-manager: system starting up.');
        const CONTEXT_COMP  = this;

        CONTEXT_COMP.connected              = false;
        CONTEXT_COMP.experimentInProgess    = false;
        CONTEXT_COMP.trialInProgess         = false;
        CONTEXT_COMP.trialData              = null;

        const player1 = document.querySelector('#Player1');
        player1.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function (event) {
            const avatarCam = document.querySelector('.avatar');
            CONTEXT_COMP.userType = avatarCam.components["circles-user-networked"].data.usertype;    

            console.log(CIRCLES.USER_TYPE.PARTICIPANT);

            if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.RESEARCHER) {
                //do not attach experiment; but we will control it
                CONTEXT_COMP.createResearcherControls(avatarCam);
            }
            else if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.PARTICIPANT) {
                //attach experiment
                CONTEXT_COMP.el.setAttribute('research-selection-tasks', '');
            }
            else {
                console.warn('unexpected usertype [' + CONTEXT_COMP.userType + '] for this world. Expecting userType [researcher] or [participant].');
            }
        });

        CONTEXT_COMP.el.sceneEl.addEventListener(CIRCLES.EVENTS.NAF_CONNECTED, function (event) {
            console.log("research-manager: system connected ...");
            CONTEXT_COMP.socket = NAF.connection.adapter.socket;
            CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENTS.CONNECTED, {message:'ciao! research system connecting.'});
            CONTEXT_COMP.connected = true;
        });
    },
    tick: function (time, timeDelta) {},
    getNewExperimentID : function() {
        return CIRCLES.getUUID();
    },
    captureData: function(type, experiment_id, timeStamp, data) {
        console.warn('RESEARCH DATA CAPTURE:  type[' + type + '], experiment id[' + experiment_id + '], timeStamp[' + new Date(timeStamp).toISOString()  + ']');

        switch (type) {
            case CIRCLES.RESEARCH.EVENTS.EXPERIMENT_START: {

            }
            break;
            case CIRCLES.RESEARCH.EVENTS.EXPERIMENT_STOP: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_START: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_STOP: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.SELECTION_ERROR: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENTS.TRANSFORM_UPDATE: {
                
            }
            break;
        }

        //this is where we will send data to server via sockets
        //CONTEXT_COMP.socket.emit(data.type, data);
    },
    loadExperimentScript : function (url) {
        const CONTEXT_COMP = this;
        
        let xhr = new XMLHttpRequest();

        function handleXHREvent(e) {
            console.log('Experiment Script Load Status, ' + e.type + ': ' + e.loaded + ' bytes transferred. Status: ' + xhr.status);
        }

        xhr.addEventListener("loadstart",   handleXHREvent);
        xhr.addEventListener("loadend",     handleXHREvent);
        xhr.addEventListener("progress",    handleXHREvent);
        xhr.addEventListener("error",       handleXHREvent);

        //want to be explicitely aware of any malformed urls
        xhr.addEventListener("readystatechange", (e) => { 
            switch(xhr.status) {
                case 200: {
                    if (xhr.readyState == XMLHttpRequest.DONE) {
                        CONTEXT_COMP.trialData = xhr.response;
                        console.log(CONTEXT_COMP.trialData);
                    }
                }
                break;
                case 404: {
                    console.error('Experiment Script Load Status: ' + xhr.status + ' - url not found.'); 
                }
                break;
            }
        });

        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.send();
    },
    createResearcherControls : function(avatarCam) {
        const CONTEXT_COMP = this;

        //create "researcher panel"
        let researchControls = document.createElement('a-entity');
        researchControls.setAttribute('id', 'research_controls');
        researchControls.setAttribute('visible', true);
        researchControls.setAttribute('position', {x:0.5, y:0.5, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        researchControls.setAttribute('rotation', {x:0, y:0, z:0});
        avatarCam.appendChild(researchControls);

        let buttonElem  = null;

        //hide/show research controls button
        let buttonElem_hide = null;
        let buttonElem_show = null;

        buttonElem_hide = CONTEXT_COMP.createBasicButton('research_hide', 'hide', 0.2, 0.07, 8);
        buttonElem_hide.setAttribute('circles-interactive-visible', true);
        buttonElem_hide.setAttribute('position', {x:0.65, y:0.61, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        buttonElem_hide.addEventListener('click', (e) => { 
          console.log('click - ' + e.srcElement.id); 
          buttonElem_hide.setAttribute('circles-interactive-visible', false);
          buttonElem_show.setAttribute('circles-interactive-visible', true);
          
          researchControls.querySelectorAll('.button').forEach( (button) => {
            button.setAttribute('circles-interactive-visible', false);
          });
        });
        avatarCam.appendChild(buttonElem_hide);

        buttonElem_show = CONTEXT_COMP.createBasicButton('research_show', 'show', 0.2, 0.07, 8);
        buttonElem_show.setAttribute('circles-interactive-visible', false);
        buttonElem_show.setAttribute('position', {x:0.65, y:0.61, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        buttonElem_show.addEventListener('click', (e) => { 
          console.log('click - ' + e.srcElement.id); 
          buttonElem_hide.setAttribute('circles-interactive-visible', true);
          buttonElem_show.setAttribute('circles-interactive-visible', false);

          researchControls.querySelectorAll('.button').forEach( (button) => {
            button.setAttribute('circles-interactive-visible', true);
          });
        });
        avatarCam.appendChild(buttonElem_show);

        //start experiment
        buttonElem = CONTEXT_COMP.createBasicButton('start_experiment', 'start experiment', 0.5, 0.1, 24);
        buttonElem.setAttribute('position', {x:0.0, y:0.0, z:0.0});
        buttonElem.addEventListener('click', (e) => { 
          console.log('click - ' + e.srcElement.id); 
        });
        researchControls.appendChild(buttonElem);

        //stop experiment
        buttonElem = CONTEXT_COMP.createBasicButton('stop_experiment', 'stop experiment', 0.5, 0.1, 24);
        buttonElem.setAttribute('position', {x:0.0, y:-0.11, z:0.0});
        buttonElem.addEventListener('click', (e) => { 
          console.log('click - ' + e.srcElement.id); 
        });
        researchControls.appendChild(buttonElem);

        //visual state - normal
        buttonElem = CONTEXT_COMP.createBasicButton('vs_normal', 'visual state - normal', 0.5, 0.1, 24);
        buttonElem.setAttribute('position', {x:0.0, y:-0.3, z:0.0});
        buttonElem.addEventListener('click', (e) => { 
          console.log('click - ' + e.srcElement.id); 
        });
        researchControls.appendChild(buttonElem);

        //visual state - ghost
        buttonElem = CONTEXT_COMP.createBasicButton('vs_ghost', 'visual state - ghost', 0.5, 0.1, 24);
        buttonElem.setAttribute('position', {x:0.0, y:-0.41, z:0.0});
        buttonElem.addEventListener('click', (e) => { 
          console.log('click - ' + e.srcElement.id); 
        });
        researchControls.appendChild(buttonElem);

        //visual state - invisible
        buttonElem = CONTEXT_COMP.createBasicButton('vs_invisible', 'visual state - invisible', 0.5, 0.1, 24);
        buttonElem.setAttribute('position', {x:0.0, y:-0.52, z:0.0});
        buttonElem.addEventListener('click', (e) => { 
          console.log('click - ' + e.srcElement.id);
        });
        researchControls.appendChild(buttonElem);
   },
   createBasicButton : function(id, text, width, height, wrapCount) {
    let buttonElem = document.createElement('a-entity');

    buttonElem.setAttribute('id', id);
    buttonElem.setAttribute('class', 'interactive button');
    buttonElem.setAttribute('geometry', {primitive:'plane', width:width, height:height});
    buttonElem.setAttribute('material', {color:'rgb(255,255,255)', shader:'flat', opacity:0.8, transparent:true});
    buttonElem.setAttribute('text', {color:'#000000', align:'center', font:'roboto', wrapCount:wrapCount, value:text});

    buttonElem.addEventListener('mouseenter', function (e) { e.target.object3D.scale.set(1.03,1.03, 1.03); });
    buttonElem.addEventListener('mouseleave', function (e) { e.target.object3D.scale.set(1.00,1.00, 1.00); });

    return buttonElem;

    // let buttonElem = document.createElement('a-entity');		     
    // buttonElem.setAttribute('id', id);    

    // let bgElem = document.createElement('a-entity');	
    // bgElem.setAttribute('id', id + '_bg');   	     
    // bgElem.setAttribute('class', 'interactive bg');		    
    // bgElem.setAttribute('geometry', {primitive:'plane', width:width, height:height});		
    // bgElem.setAttribute('material', {color:'rgb(255,255,255)', shader:'flat', opacity:0.8, transparent:true});		   
    // bgElem.addEventListener('mouseenter', function (e) { e.target.setAttribute('scale',{x:1.03, y:1.03, z:1.03}); });		  
    // bgElem.addEventListener('mouseleave', function (e) { e.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });		
    // buttonElem.appendChild(bgElem);		

    // let textElem = document.createElement('a-entity');
    // textElem.setAttribute('id', id + '_text');  		
    // textElem.setAttribute('position', {x:0.0, y:0.0, z:0.01});		
    // textElem.setAttribute('text', { color:'#000000', align:'center', font:'roboto', width:width * 2.0, value:text });		
    // buttonElem.appendChild(textElem);		

    // return buttonElem;
  }
});

//Component: will capture events and pass data to system
AFRAME.registerComponent('research-manager', {
    multiple: false,
    schema: {
        exp_script_url:      {type:'string',     default:'/world/Testbed/scripts/experiment_script.json'},
    },
    init() {
        //called on 
        console.log('research-manager: system starting up.');
        const CONTEXT_COMP  = this;
        const scene         = document.querySelector('a-scene');

        CONTEXT_COMP.connected              = false;

        scene.addEventListener(CIRCLES.EVENTS.NAF_CONNECTED, function (event) {
            console.log("research-manager: component connected ...");
            CONTEXT_COMP.socket = NAF.connection.adapter.socket;
            CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENTS.CONNECTED, {message:'ciao! research system connecting.'});
            CONTEXT_COMP.connected = true;
        });
    },
    tick: function (time, timeDelta) {}
});

// //component default functions
// AFRAME.registerComponent('some-name', {
//     schema: {},
//     init() {
//         //called after aframe initialized and this component is setup
//     },
//     update: function (oldData) {
//         //called whenever schema properties are changed
//     },
//     updateSchema: function(data) {
//         //called on evey update (when properties change)
//     },
//     tick: function (time, timeDelta) {
//         //called on every scene render frame
//     },
//     tick: function (time, timeDelta, camera) {
//         //called after every render frame (i.e. after tick)
//     },
//     pause: function () {
//         //called when scene or entity pauses
//     },
//     play: function () {
//         //called when scene or entity plays/resumes
//     },
//     remove: function() {
//         //called when component is removed from entity
//     }
// });