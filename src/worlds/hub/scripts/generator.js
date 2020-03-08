AFRAME.registerComponent('generator', {
    schema: {  
        message_number: {type: 'number', default: 0},
        message_position: {type: 'number', default: 0.5},
            
    },
    init: function() {
        const Context_AF = this;

        Context_AF.el.addEventListener('click', (e) => {
            console.log("Generator clicked");

            this.createNewMessage();
           
        });
    },

    createNewMessage: function(){
        const Context_AF = this;
        let yPos = Context_AF.message_position + (Context_AF.message_number * .5);
        const scene = document.querySelector('a-scene');

        console.log("Creating new message");
        Context_AF.newMessage = document.createElement('a-entity');
        Context_AF.newMessage.setAttribute('id', "msg"); 
        Context_AF.newMessage.setAttribute('class', "interactive");
        Context_AF.newMessage.setAttribute('message', '');
        Context_AF.newMessage.setAttribute('circles-interactive-object', '');
        Context_AF.newMessage.setAttribute('circles-inspect-object', 'inspectScale:1 1 1; textRotationY:0.0; textLookAt:false;;');
        Context_AF.newMessage.setAttribute('geometry', {primitive: "box", width: 0.2, depth: 0.05, height: 0.1});
        Context_AF.newMessage.setAttribute('position', {x: -1, y:1.17, z:4.36});
        Context_AF.newMessage.setAttribute("material", {color: '#fff'});
        Context_AF.newMessage.setAttribute("circles-object-label", {label_visible: false});

        
        //console.log(Context_AF.newMessage);
        scene.appendChild(Context_AF.newMessage);

        Context_AF.messageText = document.createElement('a-text');
        Context_AF.messageText.setAttribute('value', "Message");
        Context_AF.messageText.setAttribute('id', "input");
       // Context_AF.messageText.setAttribute('width', "input");
        Context_AF.newMessage.appendChild(Context_AF.messageText);
 

        Context_AF.message_number = Context_AF.message_number += 1;
    },

});