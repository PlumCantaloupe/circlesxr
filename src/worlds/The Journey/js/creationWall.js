
"use strict";
AFRAME.registerComponent('creationwall', {
    init: function() {
        var self = this;
        
        self.el.addEventListener('fillboard', function () {
            
            //loop through each question to fill out information about your Questions and Answers
            for(let i=1;i<11;i++)
            {
                let currentQuestion = document.querySelector("#question"+i)
                let currentBoardSlot = document.querySelector("#questionAnswer"+i)
                //assigns the text value on the information board
                currentBoardSlot.querySelector("#question").setAttribute("text","value:"+currentQuestion.getAttribute("questionset").question);
                currentBoardSlot.querySelector("#answer").setAttribute("text","value:"+currentQuestion.getAttribute("questionset").playerAnswer);

                //add some extra text to the following questions that aren't present in their answers by default
                if(i==5)
                {
                    currentBoardSlot.querySelector("#answer").setAttribute("text","value:The "+currentQuestion.getAttribute("questionset").playerAnswer);
                }
                if(i==7)
                {
                    currentBoardSlot.querySelector("#question").setAttribute("text","value: Which is worse? Failing or never trying?")
                }

            }
        });
       
    }
});
