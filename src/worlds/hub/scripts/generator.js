AFRAME.registerComponent('generator', {
    schema: {  
        message_number: {type: 'number', default: 0}
            
    },
    init: function() {
        const Context_AF = this;
       
        Context_AF.el.addEventListener('click', (e) => {
            console.log("Generator clicked");

            createNewMessage();
           
        });
    },

    createNewMessage: function(){
        newMessage = document.createElement('a-entity');
        newMessage.setAttribute('id', "msg" + String(Context_AF.message_number));
        newMessage.setAttribute('message');
        newMessage.setAttribute('geometry', {primitive: box});
        newMessage.setAttribute('position', "4.2 0 1.5");


        Context_AF.message_number = Context_AF.message_number += 1;
    },

});