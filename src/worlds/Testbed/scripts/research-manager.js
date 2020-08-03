//System: Will control data collection and communication with server
AFRAME.registerSystem('research-manager', {
    init() {
        //called on 
        console.log('research-manager: system starting up.');
        const CONTEXT_COMP  = this;

        CONTEXT_COMP.connected              = false;
        CONTEXT_COMP.experimentInProgess    = false;
        CONTEXT_COMP.trialInProgess         = false;
        CONTEXT_COMP.player1AvatarLoaded    = false;
        CONTEXT_COMP.trialData              = null;
        CONTEXT_COMP.researchUsers          = [];

        const player1 = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);

        console.log('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);

        player1.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function (event) {
            const avatarCam = document.querySelector('.avatar');
            CONTEXT_COMP.userType = avatarCam.components["circles-user-networked"].data.usertype;    

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

            CONTEXT_COMP.player1AvatarLoaded = true;

            //believe in (add) yourself
            CONTEXT_COMP.addResearchUser(player1.id, avatarCam.components['circles-user-networked'].data.usertype);
            //CONTEXT_COMP.researchUsers.push({'Player1', user_type:CONTEXT_COMP.userType});
        });

        CONTEXT_COMP.el.sceneEl.addEventListener(CIRCLES.EVENTS.NAF_CONNECTED, function (event) {
            console.log("research-manager: messaging system connected ...");
            CONTEXT_COMP.socket = NAF.connection.adapter.socket;
            CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, {event_type:CIRCLES.RESEARCH.EVENT_TYPE.CONNECTED});
            CONTEXT_COMP.connected = true;
            CONTEXT_COMP.addResearchEventListeners();
        });

        //might want these to track number of entities and whether we have the right one
        //can do a query on [networked] entities with the avatar child and chack [circles-networked-user] for additional properties i.e. what userType.
        document.body.addEventListener('entityCreated', function (e) {
          console.log('research-manager - entityCreated, id:', e.detail.el.id);
          //if a user component we can safely assume this is a user and not an artefact

          if (e.detail.el.id === 'Player1') {
            //don't want to add self
            return;
          }

          const addFunc = (e1) => {
            const avatar = e.detail.el.querySelector('.avatar');
            if (avatar) {
              CONTEXT_COMP.addResearchUser(e.detail.el.id, avatar.components['circles-user-networked'].data.usertype);
            }
            e.detail.el.removeEventListener('loaded', addFunc);
          };

          e.detail.el.addEventListener('loaded', addFunc);
        });

        document.body.addEventListener('entityRemoved', function (e) {
          console.log('research-manager - entityRemoved, id:', e.detail.networkId );
          CONTEXT_COMP.removeResearchUser('naf-' + e.detail.networkId); //'naf' prefix missing when this event called for some reason ...
        });
    },
    getNewExperimentID : function() {
        return CIRCLES.getUUID();
    },
    addResearchUser: function(id, type) {
      this.researchUsers.push({user_id:id, user_type:type});
    },
    removeResearchUser: function(id) {
      const CONTEXT_COMP = this;
      //find index
      for (let i = 0; i < CONTEXT_COMP.researchUsers.length; i++) {
        if (CONTEXT_COMP.researchUsers[i].user_id === id) {
          index = i;
          CONTEXT_COMP.researchUsers.splice(i, 1);
          
          return;
        }
      }

      console.log(CONTEXT_COMP.researchUsers);
    },
    addResearchEventListeners: function() {
      const CONTEXT_COMP = this;
      CONTEXT_COMP.socket.on(CIRCLES.RESEARCH.EVENT_FROM_SERVER, CONTEXT_COMP.handleResearchEventHandlers.bind(CONTEXT_COMP));
    },
    removeResearchEventListeners: function() {
      const CONTEXT_COMP = this;
      CONTEXT_COMP.socket.off(CIRCLES.RESEARCH.EVENT_FROM_SERVER, CONTEXT_COMP.handleResearchEventHandlers.bind(CONTEXT_COMP));
    },
    handleResearchEventHandlers: function (data) {
      const CONTEXT_COMP = this;
      console.log('CIRCLES RESEARCH EVENT: '+ data.event_type);

      switch (data.event_type) {
        case CIRCLES.RESEARCH.EVENT_TYPE.CONNECTED: {
            console.log('Research system connected');
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_START: {

        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP: {

        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.TRIAL_START: {

        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.TRIAL_STOP: {

        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_START: {

        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_STOP: {

        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_ERROR: {

        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.TRANSFORM_UPDATE: {

        }
        break;
      }
    },
    sendData: function(data) {
        console.warn('RESEARCH DATA CAPTURE:  type[' + data.event_type + '], experiment id[' + data.exp_id + '], timeStamp[' + new Date(data.timestamp).toISOString()  + ']');

        switch (data.event_type) {
            case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_START: {

            }
            break;
            case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_START: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_STOP: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_ERROR: {
                
            }
            break;
            case CIRCLES.RESEARCH.EVENT_TYPE.TRANSFORM_UPDATE: {
                
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

AFRAME.registerComponent('research-manager', {
  init: function () {},
  remove: function () {}
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