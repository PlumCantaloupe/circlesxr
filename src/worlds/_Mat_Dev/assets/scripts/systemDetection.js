
AFRAME.registerComponent("mat-user-device", {
    init: function(){
        let textEntity = document.getElementById("displayText");
        if (AFRAME.utils.device.isMobile()) {
            window.matPlayer.system.Portable = true;
            textEntity.setAttribute("value", "user Portable");
            console.log("user Portable");
        }
        else if (AFRAME.utils.device.checkHeadsetConnected()) {
            window.matPlayer.system.Headset = true;
            textEntity.setAttribute("value", "user VR");
            console.log("user VR");
        }
        else{
            window.matPlayer.system.Desktop = true;
            textEntity.setAttribute("value", "user Computer");
            console.log("user Computer");
        }
    }
})