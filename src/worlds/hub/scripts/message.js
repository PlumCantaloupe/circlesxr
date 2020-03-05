AFRAME.registerComponent('message', {
        schema: {  
            message_text: {type: 'string', default: 'boo'} 

    },
    init: function() {
        const Context_AF = this;

        Context_AF.el.addEventListener('click', (e) => {
            console.log(message_text);
            console.log(this.data.message_text);
        });
    },

}); 