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
        //Context_AF.textInput = document.querySelector('#input');
        Context_AF.newMessage = document.createElement('a-text');
        Context_AF.newMessage.setAttribute('value', "Boo");
        Context_AF.newMessage.setAttribute('id', "msgBoo");
        Context_AF.newMessage.setAttribute('position', {x: -1, y:0.2, z:0});

        Context_AF.newMessage1 = document.createElement('a-text');
        Context_AF.newMessage1.setAttribute('value', "Foo");
        Context_AF.newMessage1.setAttribute('id', "msgFoo");
        Context_AF.newMessage1.setAttribute('position', {x: 1, y:0.2, z:0});

        Context_AF.newMessage2 = document.createElement('a-text');
        Context_AF.newMessage2.setAttribute('value', "Baz");
        Context_AF.newMessage2.setAttribute('id', "msgBaz");
        Context_AF.newMessage2.setAttribute('position', {x: 0, y:0.2, z:0});

        
        msg.appendChild(Context_AF.newMessage);
        msg.appendChild(Context_AF.newMessage1);
        msg.appendChild(Context_AF.newMessage2);
        
        Context_AF.textInput.addEventListener('click', (e) => {
            console.log("text clicked" + e.detail);
            Context_AF.updateText(e);
        });
    },

    updateText: function(e){
        const Context_AF = this;
        
        var code = parseInt(e.detail.code)
        switch(code) {
          case 8:
            Context_AF.message_text = Context_AF.message_text.slice(0, -1)
            break
          case 06:
            alert('submitted')
            
            document.querySelector('#input').setAttribute('value', Context_AF.message_text)
            document.querySelector('#input').setAttribute('color', 'blue')
            Context_AF.keyboardEl.parentNode.removeChild(keyboard)
            return
          default:
            Context_AF.message_text = Context_AF.message_text + e.detail.value
            break
          }
        document.querySelector('#input').setAttribute('value', Context_AF.message_text + '_')
      

    },

}); 