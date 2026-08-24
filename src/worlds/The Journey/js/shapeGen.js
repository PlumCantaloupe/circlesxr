

//randomnly select from the locations in different cases, to place an object
//Onced placed on the character the object is networked and other players can see it. 

//Access the Player Avatar, edit the character and replace its shapes with new ones.
//skeleton is being set up within the Circles Avatar, 
//create a skeleton of nested possible shape locations.
    "use strict";
    let networkID;

    //these are objects that are able to be picked up and attached to the body
    AFRAME.registerComponent('pickupable', {
        schema: {
            enabled: {type: "boolean", default:true},  
            locationID: {type: "string", default:'torso'},
            pillarID: {type: "number", default:0},  
          },
        init: function() {
        
        var self = this;
        self.player = document.querySelector('.avatar');  //this is our player/camera
        self.pickedUp = false;
        //this makes the object interactive if it has the pickupable type
        if (!self.el.classList.contains('interactive')) {
        self.el.classList.add('interactive'); 
        }
          
        self.el.addEventListener('click', (e) => {
            e.stopPropagation();
            //once already in the players hand, if clicked on again attach it to the body
            if (self.pickedUp == true) {

                
                //attach to body
                //the pickupable value is disabled so it cannot be 
                //interacted with anymore after being attached to the body.

                let currentQuestionNum = document.querySelector(self.el.parentElement.getAttribute("choicepillar").questionSet).getAttribute("questionset").questionNum
                //if it's question 5 or 10 then keep the player movement disabled until Gea is done speaking
                if(currentQuestionNum == 5)
                {
                    playerLock(true);
                    document.querySelector("#playerMover").setAttribute("playermovement","playerLocked:true");
                    //get gea to animate
                    document.querySelector("#Gea").emit('endQuestion5',false);
                }
                else if (currentQuestionNum == 10)
                {
                    playerLock(true);
                    document.querySelector("#playerMover").setAttribute("playermovement","playerLocked:true");
                    //get gea to animate
                    document.querySelector("#Gea").emit('endQuestion10',false);
                }
                else{
                    playerLock(false);
                    document.querySelector("#playerMover").setAttribute("playermovement","playerLocked:false");
                }
                self.data.enabled = false;
                
                addBodyPart(self.data.locationID,self,self.el.getAttribute("geometry").primitive);
                self.el.setAttribute("sound","src:#equipShape;volume:0.5");
                self.el.components['sound'].playSound()
                
                
                
            }
            else {
                //pick-up object into players hand
                endQuestion(self.el);
                self.player.object3D.attach(self.el.object3D);
                self.el.setAttribute("position","0 -0.5 -2");
                self.el.setAttribute("rotation","0 0 0");
                self.pickedUp = true;
                self.el.setAttribute("sound","src:#pickUpShape;volume:0.5");
                self.el.components['sound'].playSound()
                document.querySelector("#playerMover").setAttribute("playermovement","playerLocked:true");
                playerLock(true);
            }
        });

            //some visualuzation of interactivity as hover effects
            self.el.addEventListener('mouseenter', (e) => {
                //only show hover animation when pickupable is enabled
                if(self.data.enabled == true)
                {
                    
                    self.el.setAttribute('scale', ((self.el.getAttribute('scale').x)*1.2)+" "+((self.el.getAttribute('scale').y)*1.2)+" "+((self.el.getAttribute('scale').z)*1.2));
                }
            });
                
            self.el.addEventListener('mouseleave', (e) => {
                if(self.data.enabled == true)
                {
                   self.el.setAttribute('scale', ((self.el.getAttribute('scale').x)/1.2)+" "+((self.el.getAttribute('scale').y)/1.2)+" "+((self.el.getAttribute('scale').z)/1.2));
                }
            });
        }
    });

    
    //these hold information about the entire question, such as the text of the question, 
    //which question number it is, what body part it affects and more.
    AFRAME.registerComponent('questionset', {
        schema: {
            locationID: {type:'string', default: 'torso' },
            questionNum: {type:'number', default: 0 },
            question: {type:'string', default:'placeholder question here:'},
            questionDisplay: {type:'string'},
            pillarSpacing: {type:'number', default: 2 },
            choicePillars: {type:'array'},
            startButton: {type:'string'},
            shapeSet: {type:'string',default:'full'},
            playerAnswer: {type:'string',default:'answer'},
          },
        init: function() 
        {
            var self = this;
            self.data.questionDisplay = "questionDisplay"+self.data.questionNum;
            let question = document.createElement("a-text");
            question.setAttribute("visible",false)
            question.setAttribute("color","white")
            question.setAttribute("value",self.data.question)
            question.setAttribute("id",self.data.questionDisplay)
            question.setAttribute("align","center");
            question.setAttribute("position","0 3 0");
            question.setAttribute("side","double");
            question.setAttribute("scale","2 2 2");
            self.el.appendChild(question);
            let questionBack = document.createElement("a-plane");
            questionBack.setAttribute("color","black");
            questionBack.setAttribute("transparent","true");
            questionBack.setAttribute("opacity","0.6");
            let backingWidth = question.getAttribute("value").length*0.12;
            if(backingWidth>5.5)
            {
                backingWidth = 5.5;
            }
            questionBack.setAttribute("width",backingWidth);
            questionBack.setAttribute("height","0.5");
            question.appendChild(questionBack);
            
            //sets data for the start buttons for questions
            let startButton = self.el.querySelector(".startButton");
            startButton.setAttribute("startbutton","questionSet:#question"+self.data.questionNum);
            startButton.setAttribute("id","startButton"+self.data.questionNum)
            self.data.startButton = startButton.getAttribute("id");
            if(startButton.getAttribute("startbutton").enabled==true)
            {
                startButton.setAttribute("position","0 1 2");
            }
            else{
                startButton.setAttribute("position","0 -1.2 2");
            }
            
            startButton.setAttribute("animation__rise","property:position; from:0 -1.2 2; to: 0 1 2; startEvents:prepQuestion; dur:700");
            startButton.setAttribute("animation__fall","property:position; from:0 1 2; to:0 -1.2 2; startEvents:startQuestion; dur:700")
            
            
            self.data.choicePillars = self.el.querySelectorAll(".choicePillar");
            //evenly spaces out the answer pillars in a line. 
            for(let i = 0; i < self.data.choicePillars.length; i++)
            {   
                //returns a value between 2 and 4 as the pillar model is named either 2, 3 or 4
                let pillarIndex = Math.floor(Math.random() * 3)+2

                self.data.choicePillars[i].setAttribute("gltf-model","#pillar"+pillarIndex);
                let midPoint = 0;
                let upperMidPoint = 0;
                let pillarPosition;
                let pillarPositionZ;
                //even number
                if(self.data.choicePillars.length%2 == 0)
                {
                    midPoint = Math.round(self.data.choicePillars.length/2);
                    upperMidPoint = midPoint+1;
                    if(i+1<midPoint)
                    {
                        pillarPosition = (self.data.pillarSpacing*Math.abs(midPoint-(i+1))+self.data.pillarSpacing/2)*-1;
                        pillarPositionZ = (Math.abs(midPoint-(i+1)))
                        
                    }
                    else if((i+1)>upperMidPoint)
                    {
                        pillarPosition = (self.data.pillarSpacing*Math.abs(upperMidPoint-(i+1))+self.data.pillarSpacing/2);
                        pillarPositionZ = (Math.abs(upperMidPoint-(i+1)))
                    }
                    else if(i+1 == midPoint )
                    {
                        pillarPosition = self.data.pillarSpacing/2*-1;
                        pillarPositionZ = 0
                    }
                    else if(i+1 == upperMidPoint)
                    {
                        pillarPosition = self.data.pillarSpacing/2;
                        pillarPositionZ = 0
                    }

                }
                //odd number of pillars
                else
                {
                    midPoint = Math.round(self.data.choicePillars.length/2);

                    if(i+1<midPoint)
                    {
                        pillarPosition = self.data.pillarSpacing*Math.abs(midPoint-(i+1))*-1;
                        pillarPositionZ = (Math.abs(midPoint-(i+1)))
                    }
                    else if(i+1>midPoint)
                    {
                        pillarPosition = self.data.pillarSpacing*Math.abs(midPoint-(i+1));
                        pillarPositionZ = (Math.abs(midPoint-(i+1)))
                    }
                    else{
                        pillarPosition = self.data.pillarSpacing*Math.abs(midPoint-(i+1))*-1;
                    }
                }

                self.data.choicePillars[i].setAttribute("position",pillarPosition+" -1.2 "+pillarPositionZ);
                //assign the question set as a reference to each of the pillars, that way when a question is answered it can tell the rest of the questions to sink away.
                self.data.choicePillars[i].setAttribute("choicePillar","questionSet:#question"+self.data.questionNum+"; locationID:"+self.data.locationID+"; shapeSet:"+self.data.shapeSet+"; answerIndex:"+i);
                self.data.choicePillars[i].setAttribute("animation__rise","property:position; from:"+pillarPosition+" -1.2 "+pillarPositionZ+"; to:"+pillarPosition+" 0.1 "+pillarPositionZ+"; startEvents:startQuestion; dur:700");
                self.data.choicePillars[i].setAttribute("animation__fall","property:position; from:"+pillarPosition+" 0.1 "+pillarPositionZ+"; to:"+pillarPosition+" -1.2 "+pillarPositionZ+"; startEvents:endQuestion; dur:700");
                
                self.data.choicePillars[i].setAttribute("sound","on:endQuestion;src:#pillarMovement;volume:0.2")

                
            }   
        }
    });
    AFRAME.registerComponent('choicepillar', {
        schema: {
            enabled: {type: 'boolean', default:false}, 
            //what shape will it be
            shape: {type:'string',default:'random'},
            //what shapes can it choose from if random
            shapeSet: {type:'string',default:'full'},
            //the network id of the player so it knows who to assign the piece to
            userNetworkID: {type:'string'},
            //default size for when it's floating in the world, no matter the body part
            size: {type:'number',default:0.5},
            //where on the player will it go
            locationID: {type:"string"},
            //hex colours
            colour: {type:'string',default:'random'},
            //colour has been set?
            colourSet: {type: 'boolean', default:false}, 
            //can be between 0 and 1.0
            metalness: {type:'number',default:0},
            //can be between 0 and 1.0
            roughness: {type:'number',default:0.5},
            //can be between 0 and 1.0
            opacity: {type:'number',default:1},
            //can be between 0 and 1.0
            emissiveIntensity:{type:'number',default:0},
            //keeps track of what question answer it is
            answerIndex: {type: 'number',default:0},
            //keeps track of what set of questions it is a part of.
            questionSet: {type: 'string'},
            //displayed answer to the question
            answer: {type:'string',default:'answer'},
          },
        init: function() {
            var self = this;
            //this makes the object interactive
            if (!self.el.classList.contains('interactive')) {
            self.el.classList.add('interactive'); 
            }
            //create the question answers above the answer pillars
            let questionAnswer = document.createElement("a-text");
            questionAnswer.setAttribute("value",self.data.answer)
            questionAnswer.setAttribute("color","white")
            questionAnswer.setAttribute("align","center");
            questionAnswer.setAttribute("position","0 1.1 0");
            self.el.appendChild(questionAnswer);
            let questionBack = document.createElement("a-plane");
            questionBack.setAttribute("color","black");
            questionBack.setAttribute("transparent","true");
            questionBack.setAttribute("opacity","0.6");
            let backingWidth = questionAnswer.getAttribute("value").length*0.1+0.4;
            questionBack.setAttribute("width",backingWidth);
            questionBack.setAttribute("height","0.3");
            questionAnswer.appendChild(questionBack);

            //creates shapes to use
            self.el.addEventListener('click', (e) => {
                //spawns an object based on a set of parameters
                if(self.data.enabled == true)
                {
                    
                    
                    //disables the current pillar
                    self.data.enabled = false;
                    //disables and all others pillars and makes them drop into the ground 
                    disableQuestion(self.data.questionSet,self.data.answerIndex);

                    //stores the user's answer to a question
                    let question = document.querySelector(self.data.questionSet);
                    question.getAttribute("questionset").playerAnswer = self.data.answer;

                    self.data.userNetworkID = networkID;
                    //saturation is always 60
                    let saturation = 60;
                        //lightness is always 100
                    let lightness = 100;
                    let hue;
                    //random value
                    if(self.data.colour == "random")
                    {
                        //hsl colour complete range of 360 degrees
                        hue = (Math.floor(Math.random() * 361))
                    }
                    else if(self.data.colour == "red")
                    {
                        hue = 360-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "pink")
                    {
                        hue = 330-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "magenta")
                    {
                        hue = 300-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "purple")
                    {
                        hue = 270-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "indigo")
                    {
                        hue = 240-(Math.floor(Math.random() * 21));  
                    }
                    else if(self.data.colour == "blue")
                    {
                        hue = 210-(Math.floor(Math.random() * 21));  
                    }
                    else if(self.data.colour == "cyan")
                    {
                        hue = 180-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "mint")
                    {
                        hue = 150-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "green")
                    {
                        hue = 120-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "lime")
                    {
                        hue = 90-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "yellow")
                    {
                        hue = 60-(Math.floor(Math.random() * 21));
                    }
                    else if(self.data.colour == "orange")
                    {
                        hue = 30-(Math.floor(Math.random() * 21));
                    }
                    else{
                        self.data.colourSet = true;
                    }
                    
                    if(self.data.colourSet == false)
                    {
                        //convert colour from hsb to rgb and then rgb to hexadecimal to be used in AFRAME
                        let colour = hsbToRgb(hue,saturation,lightness)
                        self.data.colour =  "#"+componentToHex(colour[0])+componentToHex(colour[1])+componentToHex(colour[2]);
                        colour
                    }
                    
                    /*
                    if(self.data.opacity == -1)
                    {
                        self.data.opacity = (Math.floor(Math.random() * 60)+41)/100;
                    }
                    */

                    if(self.data.metalness == -1)
                        {
                            self.data.metalness = (Math.floor(Math.random() * 2));
                            
                        }
                    if(self.data.metalness == 1)
                    {
                        if(self.data.roughness == -1)
                        {
                            self.data.roughness = (Math.floor(Math.random() * 50)+51)/100;
                        }
                    }
                    else 
                    {
                        if(self.data.roughness == -1)
                        {
                            self.data.roughness = (Math.floor(Math.random() * 100)+1)/100;
                        }
                    }
                    if(self.data.emissiveIntensity == -1)
                    {
                        self.data.emissiveIntensity = (Math.floor(Math.random() * 100)+1)/100;
                    }
                    
                    if(self.data.shape == "random")
                    {
                        let shapeRandom = 0;
                        //shape sets allow the question to generate certain cets of objects only
                        if(self.data.shapeSet=="full"||self.data.shapeSet=="noCone")
                        {
                            if(self.data.shapeSet=="noCone")
                            {
                                shapeRandom = (Math.floor(Math.random() * 7)+1);
                            }
                            else{
                                shapeRandom = (Math.floor(Math.random() * 8)+1);
                            }
                            
                            if(shapeRandom == 1)
                            {
                                self.data.shape = "box"
                            }
                            else if(shapeRandom == 2)
                            {
                                self.data.shape = "cylinder"
                            }
                            else if(shapeRandom == 3)
                            {
                                self.data.shape = "sphere"
                            }
                            else if(shapeRandom == 4)
                            {
                                self.data.shape = "torus"
                            }
                            else if(shapeRandom == 5)
                            {
                                self.data.shape = "icosahedron"
                            }
                            else if(shapeRandom == 6)
                            {
                                self.data.shape = "dodecahedron"
                            }
                            else if(shapeRandom == 7)
                            {
                                self.data.shape = "octahedron"
                            }
                            else if(shapeRandom == 8)
                            {
                                self.data.shape = "cone"
                            }
                        }
                        else if(self.data.shapeSet == "basics")
                        {
                            shapeRandom = (Math.floor(Math.random() * 3)+1);
                            if(shapeRandom == 1)
                            {
                                self.data.shape = "box"
                            }
                            else if(shapeRandom == 2)
                            {
                                self.data.shape = "cylinder"
                            }
                            else if(shapeRandom == 3)
                            {
                                self.data.shape = "sphere"
                            }
                        }
                    }

                    let newObject = document.createElement("a-entity");
                    newObject.setAttribute("geometry", "primitive:"+self.data.shape);
                

                    if(self.data.shape == "box")
                    {   
                        //could be 0 or 1
                        let random = (Math.floor(Math.random() * 2));

                        //1 to 1.25
                        let randomDistance = (Math.random() * 0.25)+1;
                        //cube
                        if(random == 0)
                        {
                            newObject.setAttribute("geometry", "height:"+self.data.size+"; width:"+self.data.size+"; depth:"+self.data.size);
                
                        }
                        //rectangle
                        else if (random==1)
                        {
                            newObject.setAttribute("geometry", "height:"+self.data.size*randomDistance+"; width:"+self.data.size+"; depth:"+self.data.size);
                        }
                        
                    }
                    else if(self.data.shape == "cylinder")
                    {   
                        let shape = (Math.floor(Math.random() * 2));
                        let randomDistance = (Math.random() * 0.25)+1;
                        //normal cylinder is 0
                        newObject.setAttribute("geometry", "height:"+self.data.size*randomDistance+"; radius:"+(self.data.size/2));
                        //oval cylinder is 1
                        if(shape == 1)
                        {
                            newObject.setAttribute("scale", ((Math.random() * 0.25)+1)+"1 1");
                        }
                    }
                    else if(self.data.shape == "sphere")
                    {
                        let shape = (Math.floor(Math.random() * 2));
                        //normal sphere is 0
                        newObject.setAttribute("geometry", "radius:"+(self.data.size/2));
                        //oval/egg is 1
                        if(shape == 1)
                        {
                            newObject.setAttribute("scale", "1 "+((Math.random() * 0.5)+1)+" 1");
                        }
    
                    }
                    else if(self.data.shape == "torus")
                    {

                        let radiusTubular = ((Math.random() * 1)+1);
                        let shape = (Math.floor(Math.random() * 2));
                        //normal torus is 0
                        newObject.setAttribute("geometry", "radius-tubular:"+((self.data.size/3)*(radiusTubular/6))+"; radius:"+((self.data.size/3)));
                        //oval torus is 1
                        if(shape == 1)
                        {
                            newObject.setAttribute("scale", "1 "+((Math.random() * 0.75)+1)+" 1");
                        }

                    }
                    else if(self.data.shape == "cone")
                    {
                        let height = ((Math.random() * 0.25)+1);
                        let radius = ((Math.random() * 1)+2);
                        newObject.setAttribute("geometry", "height:"+self.data.size*height+"; radius-bottom:"+((self.data.size/2)*(radius/2)));
                    }
                    else if(self.data.shape == "octahedron")
                    {   
                        newObject.setAttribute("geometry","radius:"+(self.data.size/1.5));
                    
                        newObject.setAttribute("scale", "1 "+((Math.random() * 0.5)+1)+" 1");
                    }
                    else if(self.data.shape == "dodecahedron")
                    {   
                        newObject.setAttribute("geometry","radius:"+(self.data.size/1.5));
                    }
                    else if(self.data.shape == "icosahedron")
                    {   
                        newObject.setAttribute("geometry","radius:"+(self.data.size/1.5));
                    }
                    //error message if none of the correct shapes were entered 
                    else{
                        console.error("ERROR INVALID SHAPE");
                    }
                    
                    newObject.setAttribute("id", self.data.locationID+"-"+self.data.userNetworkID);
                    newObject.setAttribute("material","color: "+self.data.colour+"; roughness: "+self.data.roughness+"; metalness: "+self.data.metalness+"; transparent: true; opacity: "+self.data.opacity+"; emissive: "+self.data.colour+"; emissiveIntensity: "+self.data.emissiveIntensity);
                    newObject.setAttribute("position", "0 1.8 0" );
                    console.log("intended body part:"+ self.data.locationID);
                    newObject.setAttribute("pickupable","enabled:true; locationID:"+ self.data.locationID);
                    //attach object to scene
                    self.el.appendChild(newObject);
                }
            });    
        }
    });


    function initiateNetworkID(userNetworkID) {
        //passes the network id here for later
        networkID = userNetworkID;
    }
    




  

