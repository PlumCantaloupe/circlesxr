//System: Will control data collection and communication with server
AFRAME.registerSystem('research-manager', {
    init() {
        //called on 
        console.log('research-manager: system starting up.');
        const CONTEXT_COMP  = this;
        const scene         = document.querySelector('a-scene');

        CONTEXT_COMP.connected              = false;
        CONTEXT_COMP.experimentInProgess    = false;
        CONTEXT_COMP.trialInProgess         = false;

        scene.addEventListener(CIRCLES.EVENTS.NAF_CONNECTED, function (event) {
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

        // const dateStr   = new Date().today.toISOString().substring(0, 10);

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

        xhr.addEventListener("loadstart",           handleXHREvent);
        xhr.addEventListener("progress",            handleXHREvent);
        xhr.addEventListener("error",               handleXHREvent);

        //want to be explicitely aware of any malformed urls
        xhr.addEventListener("readystatechange", (e) => { 
            switch(xhr.status) {
                case 404: {
                    console.error('Experiment Script Load Status: ' + xhr.status + ' - url not found.'); 
                }
                break;
            }
        });

        xhr.addEventListener("loadend", (e) => {
            handleXHREvent(e);
        });

        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.send();
    },
});

//Component: will capture events and pass data to system
AFRAME.registerComponent('research-manager', {
    multiple: false,
    schema: {
        // capture_data:   {type:'boolean', default:true},
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
    tick: function (time, timeDelta) {
        
    }
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