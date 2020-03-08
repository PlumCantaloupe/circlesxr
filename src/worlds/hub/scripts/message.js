AFRAME.registerComponent('message', {
        schema: {  
            message_text: {type: 'string', default: 'boo'} 

    },
    init: function() {
        const Context_AF = this;
        Context_AF.el.setAttribute('circles-interactive-object');

        Context_AF.el.addEventListener('click', (e) => {
            this.createNewText();
        });
    },

    createNewText: function(){
        const Context_AF = this;
        const msg = document.querySelector('#msg');
        
       
        Context_AF.newMessage = document.createElement('a-text');
        Context_AF.newMessage.setAttribute('value', "Boo");
        Context_AF.newMessage.setAttribute('id', "msgBoo");
        Context_AF.newMessage.setAttribute('position', {x: -1, y:0.5, z:0});
        Context_AF.newMessage.setAttribute('circles-interactive-object', '');
        Context_AF.newMessage.setAttribute('geometry', {primitive: 'plane'});

        Context_AF.newMessage1 = document.createElement('a-text');
        Context_AF.newMessage1.setAttribute('value', "Foo");
        Context_AF.newMessage1.setAttribute('id', "msgFoo");
        Context_AF.newMessage1.setAttribute('position', {x: 1, y:0.5, z:0});
        Context_AF.newMessage1.setAttribute('circles-interactive-object', '');
        Context_AF.newMessage1.setAttribute('geometry', {primitive: 'plane'});


        Context_AF.newMessage2 = document.createElement('a-text');
        Context_AF.newMessage2.setAttribute('value', "Baz");
        Context_AF.newMessage2.setAttribute('id', "msgBaz");
        Context_AF.newMessage2.setAttribute('position', {x: 0, y:0.5, z:0});
        Context_AF.newMessage2.setAttribute('circles-interactive-object', '');
        Context_AF.newMessage2.setAttribute('geometry', {primitive: 'plane'});


        
        msg.appendChild(Context_AF.newMessage);
        msg.appendChild(Context_AF.newMessage1);
        msg.appendChild(Context_AF.newMessage2);

        Context_AF.newMessage.addEventListener('click', (e) => {
            console.log("text clicked" + e.detail);
            Context_AF.updateText(e);
        });
        Context_AF.newMessage1.addEventListener('click', (e) => {
            console.log("text 1 clicked" + e.detail);
            Context_AF.updateText(e);
        });

        Context_AF.newMessage2.addEventListener('click', (e) => {
            console.log("text 2 clicked" + e.detail);
            Context_AF.updateText(e);
        });
    },

    updateText: function(e){
        const Context_AF = this;
        Context_AF.textInput = document.querySelector('#input');
        let currentInput = Context_AF.textInput.getAttribute('value');
       console.log('made it');
       // Context_AF.textInput.setAttribute('value', currentInput + e.detail.)
        //document.querySelector('#input').setAttribute('value', Context_AF.message_text + '_')
      

    },

}); 