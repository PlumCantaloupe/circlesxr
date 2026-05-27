
    "use strict";
    AFRAME.registerComponent('polytalk', {
        schema: {
            lineIndex: {type: "number", default:1}
        },
        init: function() {
            var self = this;
            
            self.el.addEventListener('click', (e) => {
                
                if(self.el.getAttribute("sound")!=null)
                {
                    self.el.components['sound'].stopSound();
                }
                self.el.setAttribute("sound","src:#polyLine"+self.data.lineIndex+";volume:2;rolloffFactor:0.5;");
                self.el.components['sound'].playSound();
                //move through lines
                self.data.lineIndex = self.data.lineIndex + 1;
                if(self.data.lineIndex >= 8)
                {
                    //loop back to beginning
                    self.data.lineIndex = 1
                }

            });
            
        }
    });
AFRAME.registerComponent('portal', {
    schema: {
        statuePlaced: {type: "boolean", default:false},
        lightChanged: {type: "boolean", default:false}
    },
    init: function() {
        var self = this;

        //finds the gallery object
        const sky = document.querySelector("#environment");
        const gallerySky = document.querySelector("#gallerySky");

        

        self.el.addEventListener('click', (e) => {
            
            if(self.data.lightChanged == false)
            {
                self.data.lightChanged = true;
                let environmentLights = gallerySky.querySelectorAll(".environment");
                for(let i = 0; i<environmentLights.length;i++)
                {
                    if(environmentLights[i].getAttribute("light")!=null)
                    {
                        if(environmentLights[i].getAttribute("light").type == "directional")
                        {
                            if(environmentLights[i].setAttribute("light","target:#theGallery"));
                        }
                    }
                }
            }
            
            if(sky.getAttribute("visible")==false)
            {
                //when going to path
                document.querySelector("#theGallery").setAttribute("visible",false);
                document.querySelector("#thePath").setAttribute("visible",true);
                
                document.querySelector("#galleryEffect").setAttribute("circles-sound","state:pause")
                document.querySelector("#silentEffect").setAttribute("circles-sound","state:pause");
                document.querySelector("#pathEffect").setAttribute("circles-sound","state:play")

                sky.setAttribute("visible",true);
                gallerySky.setAttribute("visible",false);
                sky.setAttribute("environment","fog:0.05");
            } 
            else{
                //when going to gallery
                document.querySelector("#thePath").setAttribute("visible",false);
                document.querySelector("#theGallery").setAttribute("visible",true);
                
                sky.setAttribute("environment","fog:0.0");
                gallerySky.setAttribute("visible",true);
                sky.setAttribute("visible",false);

                document.querySelector("#pathEffect").setAttribute("circles-sound","state:pause")
                if(self.data.statuePlaced==true)
                {
                    document.querySelector("#galleryEffect").setAttribute("circles-sound","state:play");
                }
                else{
                    document.querySelector("#silentEffect").setAttribute("circles-sound","state:play");
                }
                
            } 
            

        });
        
    }
});


AFRAME.registerComponent('gallerypedestal', {
    schema: {
        taken: {type: "boolean", default:false},
        locked: {type: "boolean", default:false},    
        mine: {type: "boolean", default:false},  
        clientID: {type: "string", default:null},
      },
    init: function() {
        var self = this;
        //this makes the object interactive if it has the pickupable type
        if (!self.el.classList.contains('interactive')) {
        self.el.classList.add('interactive'); 
        }
        //finds the gallery object
        const gallery = document.querySelector(".gallerySet");
        const avatarCharacter = CIRCLES.getAvatarElement();
        let bodyGrp
        const networkID = CIRCLES.getAvatarRigElement().getAttribute('networked').networkId;
        
        //changes id so the gallerySet can find it
        self.el.setAttribute("id","galleryPedestal");
        //creates the cylinder spot light
        let spotLightObject;
        
        spotLightObject = document.createElement("a-cylinder");
        spotLightObject.setAttribute("visible","false");
        spotLightObject.setAttribute("id","spotLightObject");
        spotLightObject.setAttribute("color","white");
        spotLightObject.setAttribute("position","0 100 0");
        spotLightObject.setAttribute("transparent","true");
        spotLightObject.setAttribute("side","double");
        spotLightObject.setAttribute("opacity","0.0");
        spotLightObject.setAttribute("emissive","#ffffff");
        spotLightObject.setAttribute("radius","0.5");
        spotLightObject.setAttribute("height","200");
        spotLightObject.setAttribute("scale","1 1 1");
        spotLightObject.setAttribute("render-order","999");
        self.el.appendChild(spotLightObject);
        //creates the actual light
        let spotLight = document.createElement("a-light");
        spotLight.setAttribute("id","spotLight")
        spotLight.setAttribute("type","spot")
        spotLight.setAttribute("color","white")
        spotLight.setAttribute("intensity",0.0);
        spotLight.setAttribute("decay",0.0);
        spotLight.setAttribute("penumbra",0.4);
        spotLight.setAttribute("position","0 0 0");
        spotLight.setAttribute("rotation","-90 0 0");
        spotLight.setAttribute("scale","1 1 1");
        spotLight.setAttribute("angle","0.3");
        spotLight.setAttribute("castShadow",true);
        spotLightObject.appendChild(spotLight);
        
        self.el.addEventListener('click', (e) => {
            
            
            console.log("status: "+self.data.taken);
            if(self.data.mine == true && self.data.locked == false)
            {
                self.data.locked = true;
                console.log("this is my pillar");
                //updates values when you interact with a pillar
                gallery.emit("enterGallery");
                
                //only look for the body group within this local player
                bodyGrp = avatarCharacter.querySelector("#bodyGrp-"+networkID)
                //make player model appear above the pillar
                cloneBody(bodyGrp)
                self.el.setAttribute("sound","src:#placeGallery;volume:0.25");
                self.el.components['sound'].playSound();
                self.el.emit("spotlight",{fade:"off"},false);
            }          
        });
        //when the gallery lights up, the gallery music starts
        spotLight.addEventListener('animationcomplete__lightup', (e) => {

            document.querySelector("#silentEffect").setAttribute("circles-sound","state:pause");
            document.querySelector("#galleryEffect").setAttribute("circles-sound","state:play")
            document.querySelector("#endPortal").setAttribute("portal","statuePlaced:true")

            

        });
        self.el.addEventListener('spotlight', (e) => {
    
            spotLightObject.setAttribute("visible","true");
            if(e.detail.fade=="off")
            {   
                //set an animation to make the light fade
                spotLightObject.setAttribute("animation","property:opacity; from:0.3; to: 0; dur:2000");
                spotLight.setAttribute("animation__fade","property:intensity; from:5.0; to: 0; dur:2000");

                spotLight.setAttribute("animation__lightup","property:intensity; from:0.0; to: 5.0; dur:500;delay:4000");
                spotLightObject.setAttribute("animation__lightup","property:opacity; from:0; to: 0.4; dur:500;delay:4000");
                spotLightObject.setAttribute("animation__fade","property:opacity; from:0.4; to: 0.1; dur:500;delay:5000");

                let sky = document.querySelector("#gallerySky");
                let environmentLights = sky.querySelectorAll(".environment");
                for(let i = 0; i<environmentLights.length;i++)
                {
                    if(environmentLights[i].getAttribute("visible")==true)
                    {
                        environmentLights[i].setAttribute("animation","property:light.intensity; from:0.089; to: 0.5; dur:500;delay:4000");
                    }
                }
                //run an event for all other pillars to light up
                let targetPedestals = gallery.getAttribute("galleryset").lockedPedestals
                
                for(let i =0;i<targetPedestals.length;i++)
                {
                    if(targetPedestals[i].getAttribute("gallerypedestal").mine==false)
                    {
                        targetPedestals[i].emit("spotlight",{fade:"ondelay"},false);
                    }
                }
                //set a variable to true so that now when new players join turn their lights turn on.
                gallery.setAttribute("galleryset","ready:true");
            }
            else if (e.detail.fade=="ondelay"){
         
                spotLight.setAttribute("animation__lightup","property:intensity; from:0.0; to: 5.0; dur:500;delay:4000");
                spotLightObject.setAttribute("animation__lightup","property:opacity; from:0; to: 0.4; dur:500;delay:4000");
                spotLightObject.setAttribute("animation__fade","property:opacity; from:0.4; to: 0.1; dur:500;delay:5000");
            }
            else if (e.detail.fade=="on"){
                
                spotLight.setAttribute("animation__lightup","property:intensity; from:0.0; to: 5.0; dur:500;");
                spotLightObject.setAttribute("animation__lightup","property:opacity; from:0; to: 0.4; dur:500;");
                spotLightObject.setAttribute("animation__fade","property:opacity; from:0.4; to: 0.1; dur:500;");
            }  
            else {
                spotLightObject.setAttribute("opacity","0.3");
                spotLight.setAttribute("intensity","5.0");
            }       
        });
        function cloneBody(player)
        {
            //create the skeleton on the statue
            let children;
            let body = document.createElement("a-entity");
            body.setAttribute("id", "statue-"+networkID);
            body.setAttribute("position", "0 2 0");
            //first copies components connected directly to the bodyGrp such as the head, torso and hips
            children = player.querySelectorAll(".mainBody")
            for(let i = 0; i<children.length;i++)
            {
                cloneComponents(children[i],body)
            }
            //next it copies all the objects that are attached to the main parts, such as the eyes and mouth for the head. 
            children = player.querySelectorAll(".subBody")
            for(let i = 0; i<children.length;i++)
            {
                cloneComponents(children[i],body)
            }

            self.el.appendChild(body);
        }

        //used to copy the body
        function cloneComponents(childSource,parent)
        {
            let newObject;
            let piece;
            //copies the skeleton structure of the character
            newObject = document.createElement("a-entity");
            newObject.setAttribute("id", childSource.getAttribute("id"));
            newObject.setAttribute("geometry", childSource.getAttribute("geometry"));
            newObject.setAttribute("scale", childSource.getAttribute("scale"));
            newObject.setAttribute("material", childSource.getAttribute("material"));
            newObject.setAttribute("position", childSource.getAttribute("position"));
            newObject.setAttribute("rotation", childSource.getAttribute("rotation"));
            
            if(parent.querySelector("#"+childSource.parentElement.getAttribute("id")) == null)
            {
                parent.appendChild(newObject);
            }
            else
            {
                parent.querySelector("#"+childSource.parentElement.getAttribute("id")).appendChild(newObject);
            }
            //copies the actual shapes that you can see
            let pieceSource = document.querySelector("#"+childSource.getAttribute("id")+"-"+networkID)

            if(pieceSource !=null)
            {
                piece = document.createElement("a-entity");
                piece.setAttribute("id", "statue:"+pieceSource.getAttribute("id"));
                piece.setAttribute("geometry", pieceSource.getAttribute("geometry"));
                piece.setAttribute("scale", pieceSource.getAttribute("scale"));
                piece.setAttribute("material", pieceSource.getAttribute("material"));
                piece.setAttribute("position", pieceSource.getAttribute("position"));
                piece.setAttribute("rotation", pieceSource.getAttribute("rotation"));

                newObject.appendChild(piece);
                piece.setAttribute("circles-object-world","pickedup: false;");
                //piece.setAttribute("networked","persistent: true");
                piece.setAttribute("circles-networked-basic","networkEnabled:true"); 
                //piece.setAttribute("networked","persistent: true");
            }  
        }
    }
});



AFRAME.registerComponent('galleryset', {
    schema: {
        ready: {type: "boolean", default:false},
        pedestals: {type:'array'},
        openPedestals: {type:'array'},
        lockedPedestals: {type:'array'},
        openIDArray:{type:'array'},
        lockedIDArray:{type:'array'},
        clientIDArray:{type:'array'},
      },
    init: function() {
    var self = this;
    self.el.setAttribute("class","gallerySet");
        
        // needs to network the changes
    
        self.socket     = null;
        self.connected  = false;
        self.galleryEventName = "gallery_update";
        

        self.createNetworkingSystem = function () {
            
            
            self.socket = CIRCLES.getCirclesWebsocket();
            self.connected = true;
            console.warn("messaging system connected at socket: " + self.socket.id + " in room:" + CIRCLES.getCirclesGroupName() + ' in world:' + CIRCLES.getCirclesWorldName());

            //when a user enters the gallery they are assigned their random pillar, this updates the list of available pillars so it needs to update the list.
            self.el.addEventListener('enterGallery', function () {
                updatePedestals();
                console.log("sending connection")
                self.socket.emit(self.galleryEventName, {updatedArray:self.data.openIDArray,lockedArray:self.data.lockedIDArray,clientArray:self.data.clientIDArray,room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            });
            
            
            //listen for when another player enters the gallery
            self.socket.on(self.galleryEventName, function(data) {
                self.data.openIDArray = data.updatedArray;
                self.data.lockedIDArray = data.lockedArray;
                self.data.clientIDArray = data.clientArray;
                syncPedestals();
                updatePedestals();
            });
            

            //request other user's state so we can sync up. Asking over a random time to try and minimize users loading and asking at the same time ...
            setTimeout(function() {
                self.socket.emit(CIRCLES.EVENTS.REQUEST_DATA_SYNC, {room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
            }, THREE.MathUtils.randInt(0,1200));

            //if someone else requests our sync data, we send it.
            self.socket.on(CIRCLES.EVENTS.REQUEST_DATA_SYNC, function(data) {
                //if the same world as the one requesting

                if (data.world === CIRCLES.getCirclesWorldName()) {
                    self.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, {updatedArray:self.data.openIDArray,lockedArray:self.data.lockedIDArray,clientArray:self.data.clientIDArray,room:CIRCLES.getCirclesGroupName(), world:CIRCLES.getCirclesWorldName()});
                }
            }); 

            //receiving sync data from others (assuming all others is the same for now)
            self.socket.on(CIRCLES.EVENTS.RECEIVE_DATA_SYNC, function(data) {
                //make sure we are receiving data for this world
                if (data.world === CIRCLES.getCirclesWorldName()) {

                    self.data.openIDArray = data.updatedArray;
                    self.data.lockedIDArray = data.lockedArray;
                    self.data.clientIDArray = data.clientArray;

                    console.log("syncing arrays on start and periodically")
                    syncPedestals();
                    updatePedestals();

                }
            });
        };

        //check if circle networking is ready. If not, add an event to listen for when it is ...
        if (CIRCLES.isCirclesWebsocketReady()) {
            self.createNetworkingSystem();
            networkReady();
        }
        else {
            const wsReadyFunc = function() {
                self.createNetworkingSystem();
                networkReady();
                self.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            self.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }

        //this all runs when Circles is ready.
        function networkReady() {
            //sets the list of all the pedestals
            self.data.pedestals = document.querySelectorAll("#galleryPedestal");
            //after which it looks to the network to find which pedestals actually are still open to be used
            updatePedestals();
            
        };

        //when another player alters the gallery update local values
        function syncPedestals(){
            console.log("syncing data from other users");
            let newStatues = [];
            for(let i = 0; i < self.data.pedestals.length;i++)
            {   
                //if the clientID is not null, meaning that the pedestal is being used 
                if(self.data.clientIDArray[i]!=null)
                {
                    self.data.pedestals[i].setAttribute("gallerypedestal","clientID:"+self.data.clientIDArray[i])
                }
                let checked = false;
                for(let y = 0; y < self.data.openIDArray.length;y++)
                {
                    if(i == self.data.openIDArray[y])
                    {
                        self.data.pedestals[i].setAttribute("gallerypedestal","taken:false;locked:false;mine:false");
                        checked = true;
                    }
                }
                if(checked == false)
                {
                    //if it is taken, it will check if the pillar is also locked.
                    for(let y = 0; y < self.data.lockedIDArray.length;y++)
                    {
                        if(i == self.data.lockedIDArray[y])
                        {
                            //if it is a new pedestal added to the list and the gallery set is ready, meaning the local player has entered the gallery already
                            if(self.data.pedestals[i].getAttribute("gallerypedestal").locked==false && self.data.ready == true)
                            {   
                                self.data.pedestals[i].emit("spotlight",{fade:"on"},false);
                            }
                            
                            self.data.pedestals[i].setAttribute("gallerypedestal","locked:true");
                        }
                    }   
                    self.data.pedestals[i].setAttribute("gallerypedestal","taken:true");
                }
            }
        }

        function updatePedestals() {
        
            self.data.openIDArray = [];
            self.data.lockedIDArray = [];
            self.data.clientIDArray = [];
            for(let i = 0; i < self.data.pedestals.length; i++)
                {
                    //if the pedestal has an assigned player then assign it in the same index as the pillar
                    if(self.data.pedestals[i].getAttribute("gallerypedestal").clientID!=null)
                    {

                        self.data.clientIDArray[i]=self.data.pedestals[i].getAttribute("gallerypedestal").clientID;
                        
                    }
                    //if it has no player set it to null
                    else
                    {
                        self.data.clientIDArray[i]=null
                    }

                    if(self.data.pedestals[i].getAttribute("gallerypedestal").taken == false)
                    {
                        //this pedestal is open
                        self.data.pedestals[i].setAttribute("id","galleryPedestalOpen");
                        self.data.openIDArray.push(i);
                        if(self.data.pedestals[i].getAttribute("gallerypedestal").mine == false)
                        {
                            self.data.pedestals[i].setAttribute("material","color:green");
                        }
                        
                    }
                    //otherwise it is closed.
                    else
                    {
                        self.data.pedestals[i].setAttribute("id","galleryPedestal");
                        if(self.data.pedestals[i].getAttribute("material").color!="blue")
                        {
                            self.data.pedestals[i].setAttribute("material","color:purple");
                        }
                        //if taken and locked, push it's value to an array
                        if(self.data.pedestals[i].getAttribute("gallerypedestal").locked == true)
                        {
                            self.data.lockedIDArray.push(i);
                            self.data.pedestals[i].setAttribute("id","galleryPedestalLocked");
                            if(self.data.pedestals[i].getAttribute("gallerypedestal").mine == false)
                            {
                                self.data.pedestals[i].setAttribute("material","color:red");
                            }
                        }
                        
                        
                        
                    }
                }
                
            self.data.openPedestals = document.querySelectorAll("#galleryPedestalOpen");
            self.data.lockedPedestals = document.querySelectorAll("#galleryPedestalLocked");
            
        }
        
        self.el.addEventListener('pickPedestal', function () {
            let arrayID;
            //if there are no open pedestals
            if(self.data.openPedestals.length == 0)
            {   
                /*
                if(self.data.lockedPedestals.length == 0)
                {
                    console.warn("GALLERY IS FULL OF TEMP LOCKS, RESET SERVER TO CLEAR.")
                }
                console.log("no pedestals left")
                //first check to see if there are any that are open but 
                arrayID = (Math.floor(Math.random() * self.data.lockedPedestals.length));

                //finds the statue and deletes it, if it exists. 
                if(document.querySelector(self.data.lockedPedestals[arrayID].getAttribute("gallerypedestal").clientID)!=null)
                    document.querySelector(self.data.lockedPedestals[arrayID].getAttribute("gallerypedestal").clientID).destroy();

                //sets the pedestal to open
                self.data.lockedPedestals[arrayID].setAttribute("gallerypedestal","mine:false; taken:false; locked:false");
                //should move it from taken to open.
                self.el.emit('enterGallery');
                */
                console.warn("Sorry the gallery is full, disconnect all users and restart to clear it.")
            }
            
            //if there are open pedestals
            if(self.data.openPedestals.length >0)
            { 
                arrayID = (Math.floor(Math.random() * self.data.openPedestals.length));

                //creates a light on the selected pedestal
                self.data.openPedestals[arrayID].emit("spotlight",{fade:"none"},false);
                self.data.openPedestals[arrayID].querySelector("#spotLightObject").setAttribute("opacity","0.3");
                self.data.openPedestals[arrayID].querySelector("#spotLight").setAttribute("intensity","5.0");
                self.data.openPedestals[arrayID].setAttribute("gallerypedestal","mine:true; taken:true; clientID:"+String(NAF.clientId));
                self.data.openPedestals[arrayID].setAttribute("material","color:blue");
            }
            //after the random pillar has been picked, we need to update it on the other end. 
            self.el.emit('enterGallery');
        })
    }
});






  

