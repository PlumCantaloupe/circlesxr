AFRAME.registerComponent('generator', {
    schema: {  
        message_number: {type: 'number', default: 0}
            
    },
    init: function() {
        const Context_AF = this;
        console.log(Context_AF);
        console.log(Context_AF.el);
        Context_AF.el.addEventListener('click', (e) => {
            console.log("Generator clicked");

            createNewMessage();
           
        });
    },

    createNewMessage: function(){
        newMessage = document.createElement('a-entity');
        newMessage.setAttribute('id', "msg" + String(message_number));
        newMessage.setAttribute('message');


        message_number = message_number += 1;
    },

});