//System: Will control data collection and communication with server
AFRAME.registerSystem('research-manager', {
    init() {
        //called on 
        console.log('research-manager: system starting up.');
        const CONTEXT_COMP  = this;

        CONTEXT_COMP.researchManagerEl = document.querySelector('#research_manager');

        CONTEXT_COMP.connected              = false;
        CONTEXT_COMP.experimentInProgess    = false;
        CONTEXT_COMP.trialInProgess         = false;
        CONTEXT_COMP.player1AvatarLoaded    = false;
        CONTEXT_COMP.expScript              = null;
        CONTEXT_COMP.researchUsers          = [];
        CONTEXT_COMP.experimentID           = CONTEXT_COMP.getNewExperimentID();

        const player1 = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
        player1.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function (event) {
            const avatarCam = document.querySelector('.avatar');
            CONTEXT_COMP.userType = avatarCam.components["circles-user-networked"].data.usertype;    

            if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.RESEARCHER) {
                //do not attach experiment; but we will control it
                CONTEXT_COMP.createResearcherView(avatarCam);
            }
            else if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.PARTICIPANT) {
                //attach experiment
                CONTEXT_COMP.createParticipantView(avatarCam);
                CONTEXT_COMP.researchManagerEl.setAttribute('research-selection-tasks', '');
            }
            else {
                console.warn('unexpected usertype [' + CONTEXT_COMP.userType + '] for this world. Expecting userType [researcher] or [participant].');
            }

            CONTEXT_COMP.player1AvatarLoaded = true;

            //believe in (add) yourself
            CONTEXT_COMP.addResearchUser(player1.id, avatarCam.components['circles-user-networked'].data.usertype);
            //CONTEXT_COMP.researchUsers.push({'Player1', user_type:CONTEXT_COMP.userType});
        });

        CONTEXT_COMP.el.addEventListener(CIRCLES.EVENTS.WS_RESEARCH_CONNECTED, function (event) {
            CONTEXT_COMP.socket = CIRCLES.getCirclesResearchWebsocket();
            CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, {event_type:CIRCLES.RESEARCH.EVENT_TYPE.CONNECTED, room:CIRCLES.getCirclesGroupName()});
            CONTEXT_COMP.connected = true;
            CONTEXT_COMP.addResearchEventListeners();
            console.warn("research-manager: messaging system connected at socket: " + CONTEXT_COMP.socket.id);
        });

        //might want these to track number of entities and whether we have the right one
        //can do a query on [networked] entities with the avatar child and chack [circles-networked-user] for additional properties i.e. what userType.
        document.body.addEventListener('entityCreated', function (e) {
          if (e.detail.el.id === 'Player1') {
            return; //don't want to add self as we add it in avatar loaded event call above
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
          //may want to add logic later to make sure there is at least one researcher and participant
          console.warn('Research user connected, user_type:' + data.user_type + ' user_id:' + data.user_id);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_PREPARE: {
          CONTEXT_COMP.setResearchState(CIRCLES.RESEARCH.RESEARCH_STATE.PREPARED);
          if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.RESEARCHER) {}
          else if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.PARTICIPANT) {
            //no new trial yet so will do nothing
            CONTEXT_COMP.researchManagerEl.setAttribute('research-selection-tasks', {targets:[0,1,2,3,4,5,6,7,8]});
          }
          else {
              console.warn('unexpected usertype [' + CONTEXT_COMP.userType + '] for this world. Expecting userType [researcher] or [participant].');
          }
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_START: {
          CONTEXT_COMP.setResearchState(CIRCLES.RESEARCH.RESEARCH_STATE.STARTED);
          if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.RESEARCHER) {}
          else if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.PARTICIPANT) {
            const compData = {  target_active:    'FT_' + data.target_active,
                                targets_XY_rot:   {x:data.targets_x_rot, y:data.targets_y_rot},
                                targets_width:    data.targets_width,
                                targets_depth:    data.targets_depth,
                                targets_radius:   data.targets_radius,
                                targets:          data.targets
                              };
            CONTEXT_COMP.researchManagerEl.setAttribute('research-selection-tasks', compData);

            //send start timer
            const eData = CIRCLES.RESEARCH.createExpData();
            eData.event_type     = CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_START;
            eData.exp_id         = CONTEXT_COMP.experimentID;
            eData.user_id        = CONTEXT_COMP.socket.id;
            eData.user_type      = CONTEXT_COMP.userType;
            CONTEXT_COMP.sendSelectExpData(eData);
          }
          else {
              console.warn('unexpected usertype [' + CONTEXT_COMP.userType + '] for this world. Expecting userType [researcher] or [participant].');
          }
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP: {
          CONTEXT_COMP.setResearchState(CIRCLES.RESEARCH.RESEARCH_STATE.STOPPED);
          if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.RESEARCHER) {
            //make download link visible
            CONTEXT_COMP.buttonElem_download.setAttribute('href', data.and.downloadURL);
            console.log(data);
            console.log(CONTEXT_COMP.buttonElem_download);
            CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_download, true);  //show download button
          }
          else if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.PARTICIPANT) {
            CONTEXT_COMP.researchManagerEl.setAttribute('research-selection-tasks', {targets:[]});
          }
          else {
              console.warn('unexpected usertype [' + CONTEXT_COMP.userType + '] for this world. Expecting userType [researcher] or [participant].');
          }
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.NEW_TRIAL: {
          if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.RESEARCHER) {}
          else if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.PARTICIPANT) {

            const compData = {  target_active:    'FT_' + data.target_active,
                                targets_XY_rot:   {x:data.targets_x_rot, y:data.targets_y_rot},
                                targets_width:    data.targets_width,
                                targets_depth:    data.targets_depth,
                                targets_radius:   data.targets_radius,
                                targets:          data.targets
                              };
            CONTEXT_COMP.researchManagerEl.setAttribute('research-selection-tasks', compData);

            //send start timer
            const eData = CIRCLES.RESEARCH.createExpData();
            eData.event_type      = CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_START;
            eData.exp_id          = CONTEXT_COMP.experimentID;
            eData.user_id         = CONTEXT_COMP.socket.id;
            eData.user_type       = CONTEXT_COMP.userType;
            eData.target_active   = data.target_active;
            eData.targets_x_rot   = data.targets_x_rot;
            eData.targets_y_rot   = data.targets_y_rot;
            eData.targets_depth   = data.targets_depth;
            eData.targets_width   = data.targets_width;
            eData.targets_radius  = data.targets_radius;
            CONTEXT_COMP.sendSelectExpData(eData);
          }
          else {
              console.warn('unexpected usertype [' + CONTEXT_COMP.userType + '] for this world. Expecting userType [researcher] or [participant].');
          }
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.TRANSFORM_UPDATE: {
          //will add logic later
        }
        break;
        // case CIRCLES.RESEARCH.EVENT_TYPE.DOWNLOAD_READY: {
        //   if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.RESEARCHER) {
        //     //show download button for downloading csv experiment data
        //   }
        // }
        break;
      }
    },
    sendSelectExpData : function(data) {
      CONTEXT_COMP = this;
      console.warn('RESEARCH DATA CAPTURE:  type[' + data.event_type + '], experiment id[' + data.exp_id + '], timeStamp[' + new Date().toISOString()  + ']');

      switch (data.event_type) {
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_PREPARE: {
          CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_START: {
          CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP: {
          CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_START: {
          CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_STOP: {
          CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.SELECTION_ERROR: {
          CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, data);
        }
        break;
        case CIRCLES.RESEARCH.EVENT_TYPE.TRANSFORM_UPDATE: {
          // CONTEXT_COMP.socket.emit(CIRCLES.RESEARCH.EVENT_FROM_CLIENT, data);
        }
        break;
      }
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
                        CONTEXT_COMP.expScript = xhr.response;
                        console.log(CONTEXT_COMP.expScript);
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
    createParticipantView : function(avatarCam) {
        const CONTEXT_COMP = this;

        //create "researcher panel"
        let view = document.createElement('a-entity');
        view.setAttribute('id', 'participant_view');
        view.setAttribute('visible', true);
        view.setAttribute('position', {x:0.5, y:0.5, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        view.setAttribute('rotation', {x:0, y:0, z:0});
        avatarCam.appendChild(view);

        //stopped experiment
        CONTEXT_COMP.labelElem_stopped = CONTEXT_COMP.createBasicLabel('experiment_stopped', 'STOPPED', 0.3, 0.1, 12, 'rgb(245, 64, 88)', 'rgb(0,0,0)');
        CONTEXT_COMP.labelElem_stopped.setAttribute('position', {x:0.5, y:0.5, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        avatarCam.appendChild(CONTEXT_COMP.labelElem_stopped);

        //stop experiment
        CONTEXT_COMP.labelElem_running = CONTEXT_COMP.createBasicLabel('experiment_running', 'RUNNING', 0.3, 0.1, 12, 'rgb(64, 245, 67)', 'rgb(0,0,0)');
        CONTEXT_COMP.labelElem_running.setAttribute('position', {x:0.5, y:0.5, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        avatarCam.appendChild(CONTEXT_COMP.labelElem_running);

        //set initial research state
        CONTEXT_COMP.setResearchState(CIRCLES.RESEARCH.RESEARCH_STATE.STOPPED);

    },
    createResearcherView : function(avatarCam) {
        const CONTEXT_COMP = this;

        //create "researcher panel"
        let view = document.createElement('a-entity');
        view.setAttribute('id', 'research_view');
        view.setAttribute('visible', true);
        view.setAttribute('position', {x:0.5, y:0.5, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        view.setAttribute('rotation', {x:0, y:0, z:0});
        avatarCam.appendChild(view);

        let buttonElem  = null;

        //hide/show research controls button
        let buttonElem_hide = null;
        let buttonElem_show = null;

        // const button_hide_clicked = () => {

        // };

        buttonElem_hide = CONTEXT_COMP.createBasicButton('research_hide', 'hide', 0.2, 0.07, 8, 'rgb(255, 255, 255)', 'rgb(0,0,0)', false);
        buttonElem_hide.setAttribute('position', {x:0.65, y:0.61, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        buttonElem_hide.addEventListener('click', (e) => { 
          CONTEXT_COMP.showResearchElem(buttonElem_hide, false);
          CONTEXT_COMP.showResearchElem(buttonElem_show, true);
          
          view.querySelectorAll('.button').forEach( (button) => {
            if (button.classList.contains('auto-visible')) {
              CONTEXT_COMP.showResearchElem(button, false);
            }
          });
        });
        avatarCam.appendChild(buttonElem_hide);

        buttonElem_show = CONTEXT_COMP.createBasicButton('research_show', 'show', 0.2, 0.07, 8, 'rgb(255, 255, 255)', 'rgb(0,0,0)', false);
        buttonElem_show.setAttribute('position', {x:0.65, y:0.61, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        buttonElem_show.addEventListener('click', (e) => { 
          CONTEXT_COMP.showResearchElem(buttonElem_hide, true);
          CONTEXT_COMP.showResearchElem(buttonElem_show, false);
          
          view.querySelectorAll('.button').forEach( (button) => {
            if (button.classList.contains('auto-visible')) {
              CONTEXT_COMP.showResearchElem(button, true);
            }
          });
        });
        avatarCam.appendChild(buttonElem_show);

        //hide/show these buttons accordingly
        CONTEXT_COMP.showResearchElem(buttonElem_hide, true);
        CONTEXT_COMP.showResearchElem(buttonElem_show, false);

        //toggle controls
        CONTEXT_COMP.buttonElem_prep   = null;
        CONTEXT_COMP.buttonElem_start  = null;
        CONTEXT_COMP.buttonElem_stop   = null;

        //prepare experiment
        CONTEXT_COMP.buttonElem_prep = CONTEXT_COMP.createBasicButton('prepare_experiment', 'prepare experiment', 0.5, 0.1, 24, 'rgb(245, 215, 66)', 'rgb(0,0,0)', true);
        CONTEXT_COMP.buttonElem_prep.setAttribute('position', {x:0.5, y:0.5, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        CONTEXT_COMP.buttonElem_prep.addEventListener('click', (e) => { 
          const data = CIRCLES.RESEARCH.createExpData(CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_PREPARE, CONTEXT_COMP.experimentID, CONTEXT_COMP.socket.id, CONTEXT_COMP.userType);
          data.and = CONTEXT_COMP.expScript;
          CONTEXT_COMP.sendSelectExpData(data);
        });
        avatarCam.appendChild(CONTEXT_COMP.buttonElem_prep);

        //start experiment
        CONTEXT_COMP.buttonElem_start = CONTEXT_COMP.createBasicButton('start_experiment', 'start experiment', 0.5, 0.1, 24, 'rgb(64, 245, 67)', 'rgb(0,0,0)', true);
        CONTEXT_COMP.buttonElem_start.setAttribute('position', {x:0.5, y:0.5, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        CONTEXT_COMP.buttonElem_start.addEventListener('click', (e) => { 
          const data = CIRCLES.RESEARCH.createExpData(CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_START, CONTEXT_COMP.experimentID, CONTEXT_COMP.socket.id, CONTEXT_COMP.userType);
          CONTEXT_COMP.sendSelectExpData(data);
        });
        avatarCam.appendChild(CONTEXT_COMP.buttonElem_start);

        //stop experiment
        CONTEXT_COMP.buttonElem_stop = CONTEXT_COMP.createBasicButton('stop_experiment', 'stop experiment', 0.5, 0.1, 24, 'rgb(245, 64, 88)', 'rgb(0,0,0)', true);
        CONTEXT_COMP.buttonElem_stop.setAttribute('position', {x:0.5, y:0.5, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        CONTEXT_COMP.buttonElem_stop.addEventListener('click', (e) => {
          const data = CIRCLES.RESEARCH.createExpData(CIRCLES.RESEARCH.EVENT_TYPE.EXPERIMENT_STOP, CONTEXT_COMP.experimentID, CONTEXT_COMP.socket.id, CONTEXT_COMP.userType);
          CONTEXT_COMP.sendSelectExpData(data);
        });
        avatarCam.appendChild(CONTEXT_COMP.buttonElem_stop);

        //not using for now
        //visual state - normal
        CONTEXT_COMP.button_show = CONTEXT_COMP.createBasicButton('vs_normal', 'visual state - normal', 0.5, 0.1, 24, 'rgb(255, 255, 255)', 'rgb(0,0,0)', true);
        CONTEXT_COMP.button_show.setAttribute('position', {x:0.5, y:0.37, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        CONTEXT_COMP.button_show.addEventListener('click', (e) => { 
          let avatarNodes = document.querySelector('#Player1Cam').querySelectorAll('.avatar_node');
          avatarNodes.forEach(function(node) {
            node.setAttribute('visible', true);
          });

          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.button_show, false);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.button_hide, true);
        });
        avatarCam.appendChild(CONTEXT_COMP.button_show);

        //visual state - invisible
        CONTEXT_COMP.button_hide = CONTEXT_COMP.createBasicButton('vs_invisible', 'visual state - invisible', 0.5, 0.1, 24, 'rgb(255, 255, 255)', 'rgb(0,0,0)', true);
        CONTEXT_COMP.button_hide.setAttribute('position', {x:0.5, y:0.37, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        CONTEXT_COMP.button_hide.addEventListener('click', (e) => { 
          let avatarNodes = document.querySelector('#Player1Cam').querySelectorAll('.avatar_node');
          avatarNodes.forEach(function(node) {
            node.setAttribute('visible', false);
          });

          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.button_show, true);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.button_hide, false);
        });
        avatarCam.appendChild(CONTEXT_COMP.button_hide);

        //init state
        CONTEXT_COMP.showResearchElem(CONTEXT_COMP.button_show, false);
        CONTEXT_COMP.showResearchElem(CONTEXT_COMP.button_hide, true);

        //button for downloading research data later
        CONTEXT_COMP.buttonElem_download = CONTEXT_COMP.createBasicButton('download', 'download experiment data', 0.5, 0.1, 24, 'rgb(255, 255, 255)', 'rgb(0,0,0)', false);
        CONTEXT_COMP.buttonElem_download.setAttribute('position', {x:0.5, y:0.24, z:CIRCLES.CONSTANTS.CONTROLS_OFFSET_Z});
        CONTEXT_COMP.buttonElem_download.addEventListener('click', (e) => { 
          //will open a new tab and file. Most browsers will automatically download this. Don't think this will work on headset
          //but a researcher will likely be using a desktop for testing ...
          window.open(CONTEXT_COMP.buttonElem_download.getAttribute('href'));
        });
        avatarCam.appendChild(CONTEXT_COMP.buttonElem_download);
        CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_download, false);  //hide download button

        //set initial research state
        CONTEXT_COMP.setResearchState(CIRCLES.RESEARCH.RESEARCH_STATE.STOPPED);
   },
   showResearchElem : function(elem, isVisible) {
    const bgElem = elem.querySelector('.bg');
    //only want to adjust interactive visibility  elem is interactive to begin with ...
    console.log(bgElem.classList);
    if (bgElem.classList.contains('not_interactive') === true) {
      bgElem.setAttribute('visible', isVisible);
    }
    else {
      bgElem.setAttribute('circles-interactive-visible', isVisible);
    }
    elem.querySelector('.text').setAttribute('visible', isVisible);
   },
   setResearchState : function(state) {
    const CONTEXT_COMP = this;

    console.log("switching: " + state);

    if (CONTEXT_COMP.userType === CIRCLES.USER_TYPE.RESEARCHER) {
      switch (state) {
        case CIRCLES.RESEARCH.RESEARCH_STATE.STOPPED: {
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_prep,     true);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_start,    false);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_stop,     false);
        }
        break;
        case CIRCLES.RESEARCH.RESEARCH_STATE.PREPARED: {
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_prep,     false);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_start,    true);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_stop,     false);
        }
        break;
        case CIRCLES.RESEARCH.RESEARCH_STATE.STARTED: {
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_prep,     false);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_start,    false);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_stop,     true);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.buttonElem_download, false);
        }
        break;
      }
    }
    else {
      //everyone else
      switch (state) {
        case CIRCLES.RESEARCH.RESEARCH_STATE.STOPPED: {
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.labelElem_stopped, true);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.labelElem_running, false);
        }
        break;
        case CIRCLES.RESEARCH.RESEARCH_STATE.PREPARED: {
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.labelElem_stopped, true);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.labelElem_running, false);
        }
        break;
        case CIRCLES.RESEARCH.RESEARCH_STATE.STARTED: {
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.labelElem_stopped, false);
          CONTEXT_COMP.showResearchElem(CONTEXT_COMP.labelElem_running, true);
        }
        break;
      }
    }
   },
   createBasicButton : function(id, text, width, height, wrapCount, bgCol='rgb(255,255,255)', textCol='rgb(0,0,0)', autoVisible=true) {
    const visClass = (autoVisible) ? 'auto-visible' : ''; //if auto-visible we will control ourselves manually

    let buttonElem = document.createElement('a-entity');		     
    buttonElem.setAttribute('id', id);
    buttonElem.setAttribute('class', 'button ' + visClass);

    let bgElem = document.createElement('a-entity');	
    bgElem.setAttribute('id', id + '_bg');   	     
    bgElem.setAttribute('class', 'interactive bg');
    bgElem.setAttribute('circles-interactive-visible', true);   
    bgElem.setAttribute('geometry', {primitive:'plane', width:width, height:height});		
    bgElem.setAttribute('material', {color:bgCol, shader:'flat', opacity:0.6, transparent:true});		   
    bgElem.addEventListener('mouseenter', function (e) { e.target.setAttribute('scale',{x:1.03, y:1.03, z:1.03}); });		  
    bgElem.addEventListener('mouseleave', function (e) { e.target.setAttribute('scale',{x:1.0, y:1.0, z:1.0}); });		
    buttonElem.appendChild(bgElem);		

    let textElem = document.createElement('a-entity');
    textElem.setAttribute('id', id + '_text');  
    textElem.setAttribute('class', 'text not_interactive');
    textElem.setAttribute('visible', true); 	
    textElem.setAttribute('position', {x:0.0, y:0.0, z:0.01});		
    textElem.setAttribute('text', {color:textCol, align:'center', font:'roboto', width:width, height:height, wrapCount:wrapCount, value:text});	
    buttonElem.appendChild(textElem);		

    return buttonElem;
  },
  createBasicLabel : function(id, text, width, height, wrapCount, bgCol='rgb(255,255,255)', textCol='rgb(0,0,0)') {
    let labelElem = document.createElement('a-entity');		     
    labelElem.setAttribute('id', id);
    labelElem.setAttribute('class', 'label');

    let bgElem = document.createElement('a-entity');	
    bgElem.setAttribute('id', id + '_bg');   	     
    bgElem.setAttribute('class', 'bg not_interactive');
    bgElem.setAttribute('geometry', {primitive:'plane', width:width, height:height});		
    bgElem.setAttribute('material', {color:bgCol, shader:'flat', opacity:0.5, transparent:true});		   	
    labelElem.appendChild(bgElem);		

    let textElem = document.createElement('a-entity');
    textElem.setAttribute('id', id + '_text');  
    textElem.setAttribute('class', 'text not_interactive');
    textElem.setAttribute('visible', true); 	
    textElem.setAttribute('position', {x:0.0, y:0.0, z:0.01});		
    textElem.setAttribute('text', {color:textCol, align:'center', font:'roboto', width:width, height:height, wrapCount:wrapCount, value:text});	
    labelElem.appendChild(textElem);		

    return labelElem;
  }
});

AFRAME.registerComponent('research-manager', {
  multiple: false,
    schema: {
        experiment_script_url: {type:'string', default:'/worlds/Testbed/scripts/experiment_script.json'}
    },
  init: function () {
    const CONTEXT_COMP = this;

    const player1 = document.querySelector('#' + CIRCLES.CONSTANTS.PRIMARY_USER_ID);
    player1.addEventListener(CIRCLES.EVENTS.AVATAR_LOADED, function (event) {
        const avatarCam = document.querySelector('.avatar');
        const userType = avatarCam.components["circles-user-networked"].data.usertype; 

        if (userType === CIRCLES.USER_TYPE.RESEARCHER) {
          CONTEXT_COMP.system.loadExperimentScript(CONTEXT_COMP.data.experiment_script_url);
        }
    });
  },
  remove: function () {}
});