AFRAME.registerComponent('player-gun', {
    init: function() {
        console.log("testing befoore queryselevtor attach gun");
        document.querySelector('#Player1').setAttribute('movement-controls', {enabled:false});
        document.querySelector('.avatar').setAttribute('shooter',true);
        document.querySelector('.avatar').setAttribute('key-to-shoot',true);
        
        document.querySelector('a-scene').addEventListener(CIRCLES.EVENTS.CAMERA_ATTACHED, function() {
            console.log("test within scene ca,era quere");

        

            console.log("testestes attach gun");
        }); 
        
    }

});