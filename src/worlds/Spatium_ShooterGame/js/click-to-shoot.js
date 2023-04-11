AFRAME.registerComponent('click-to-shoot', {
  init: function () {
    var thisEl = this.el;
    document.body.onkeyup = function(e){
      if (e.key == " " || e.code == "Space" || e.keyCode == 32 ) {
        console.log("shoot has be pressed");
        thisEl.emit('shoot');
       
      }
    }
  }
}); 
