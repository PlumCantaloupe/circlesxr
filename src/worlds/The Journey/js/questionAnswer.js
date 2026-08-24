

//disables and enables questions when they are clicked on
    "use strict";
    AFRAME.registerComponent('playermovement', {
        schema: {
            playerLocked: {type: "boolean", default:true},  
            },
        
    });
    AFRAME.registerComponent('startbutton', {
        schema: {
            enabled: {type: "boolean", default:false},  
            questionSet: {type: "string", default:'#question1'},  
          },
        init: function() {
        var self = this;
        //this makes the object interactive if it has the pickupable type
        if (!self.el.classList.contains('interactive')) {
        self.el.classList.add('interactive'); 
        }
        
        self.el.addEventListener('click', (e) => {
            
            if(self.data.enabled == true)
            {
                self.data.enabled = false;
                self.el.emit('startQuestion',null,false);
                
                startQuestion(self.data.questionSet);
            }          
        });
        }
    });

    function disableQuestion(questionSet,currentID){
        let question = document.querySelector(questionSet)
        let pillarNum = question.getAttribute("questionset").choicePillars.length;
        let pillarArray = question.getAttribute("questionset").choicePillars;
        for(let i = 0; i < pillarNum; i++)
        {
            //if not the pillar that called this function
            if(i!=currentID)
            {
                //disables the choicePillar
                pillarArray[i].setAttribute("choicepillar","enabled:false")
                //sets an animation
                pillarArray[i].emit('endQuestion',null,false);
            }
        }
    }
    //disables the text of the question
    function endQuestion(object)
    {
        let question = document.querySelector(object.parentElement.getAttribute("choicepillar").questionSet);
        let questionText = document.querySelector("#"+question.getAttribute("questionset").questionDisplay);
        questionText.setAttribute("visible",false);
        //question.setAttribute("circles-sound","state:stop");
        object.parentElement.emit('endQuestion',null,false);
        
        let nextQuestion = document.querySelector("#question"+(question.getAttribute("questionset").questionNum+1));
        
        //if the current question that is ending is this number do something (play an animation for Gea)
        if(question.getAttribute("questionset").questionNum==1)
        { 
            document.querySelector("#Gea").emit('endQuestion1',false);
        }
        //if there is another question then enable it
        if(nextQuestion != null)
        {
            
            let nextQuestionButton = document.querySelector("#"+nextQuestion.getAttribute("questionset").startButton);
            nextQuestionButton.emit('prepQuestion',null,false);
            nextQuestionButton.setAttribute("startbutton","enabled:true");
        }
        else
        {
            //should enable the teleporter to the next area.
            document.querySelector(".gallerySet").emit('pickPedestal');
            document.querySelector("#endPortal").setAttribute("visible","true");
            document.querySelector("#endPortal").setAttribute("animation","property:scale; from:0 0 0; to: 8 8 8; dur:2000");
            //starts portal sound effects
            document.querySelector("#endPortal").setAttribute("sound","src:#portalHum;volume:10;rolloffFactor:2;loop:true");
            document.querySelector("#endPortal").components['sound'].playSound();

            document.querySelector("#galleryPortal").setAttribute("sound","src:#portalHum;volume:10;rolloffFactor:2;loop:true");
            document.querySelector("#galleryPortal").components['sound'].playSound();
            //fill out creation info board in the gallery
            document.querySelector("#infoBoard").emit('fillboard');
        }
        
        
    }

    //function called by start buttons to enable a new question
    function startQuestion(questionSet){
        let question = document.querySelector(questionSet)
        let questionText = document.querySelector("#"+question.getAttribute("questionset").questionDisplay);
        questionText.setAttribute("visible",true);
        let pillarNum = question.getAttribute("questionset").choicePillars.length;
        let pillarArray = question.getAttribute("questionset").choicePillars;

        question.setAttribute("sound","maxDistance:10.00")
        question.setAttribute("sound","rolloffFactor:0.5")
        question.setAttribute("circles-sound","state:play")
        
        for(let i = 0; i < pillarNum; i++)
        {
            
            //sets an animation
            pillarArray[i].emit('startQuestion',null,false);

            //enables the choicePillar
            pillarArray[i].setAttribute("choicepillar","enabled:true")

        }
    }




  

