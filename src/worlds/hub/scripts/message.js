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
        const container = document.querySelector('a-scene');
        Context_AF.textInput = document.querySelector('#input');
        // Context_AF.keyboardEl = document.createElement("a-entity");
        // Context_AF.keyboardEl.setAttribute("id", 'keyboard');
        // Context_AF.keyboardEl.setAttribute('position', {x: -1, y:1.17, z:4.0});
        // Context_AF.keyboardEl.setAttribute("components", 'keyboard');
        // Context_AF.keyboardEl.setAttribute('scale', '1 1 1');
        // Context_AF.keyboardEl.setAttribute("rotation", '0 180 0');
        // container.appendChild(Context_AF.keyboardEl);
        
        // Context_AF.textInput = document.createElement("a-text");
        // Context_AF.textInput.setAttribute("id", 'input');
        // Context_AF.textInput.setAttribute('position', {x: -1, y:1.25, z:4});
        // Context_AF.textInput.setAttribute('color', '#fff');
        // Context_AF.textInput.setAttribute('scale', '0.5 0.5 0.5');
        // Context_AF.textInput.setAttribute('rotation', '0 180 0');
        // container.appendChild(Context_AF.textInput);

        Context_AF.textInput.addEventListener('click', (e) => {
            console.log("text clicked");
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