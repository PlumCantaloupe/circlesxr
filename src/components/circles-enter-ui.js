'use strict';

AFRAME.registerComponent('circles-enter-ui', {
    init: function() 
    {
        //we can't play sound on some browsers until we have some user interaction
        //this means we should only start playing ambient music after this button is clicked
        console.log('scene loaded');
        document.querySelector('#loading-animation-enter').style.display='none';
        document.querySelector('#user-gesture-enter').style.display='block';
        document.querySelector('#user-gesture-enter').addEventListener('click', function() {
            //hide user-gesture overlay
            document.querySelector('#user-gesture-overlay').style.display='none';
            
            //start all ambient music
            const ambientSounds = document.querySelectorAll('.ambient-music');
            ambientSounds.forEach(function(soundEntity) {
                soundEntity.components.sound.playSound();
            });
        });

        // this.micEnabled = false;

        // document.querySelector('.a-enter-vr').style.display = 'none';

        // document.querySelector('#EnterCircles').addEventListener('click', function (event) {
        //     console.log('Clicking on Enter VR Button');
        //     console.log(document.querySelector('a-scene'));

        //     document.querySelector('#EnterCircles-UI').style.display = 'none';
        //     document.querySelector('.a-enter-vr').style.display = 'block';
        //     //document.querySelector('a-scene').setAttribute('vr-mode-ui', {enabled:true});
        // });

        // document.querySelector('#switch_mic').addEventListener('click', function (event) {
        // if (this.micEnabled === true) {
        //     try {
        //     console.log("disabling mic");
        //     navigator.mediaDevices.getUserMedia({ audio: false });
        //     //NAF.connection.adapter.enableMicrophone(false);
        //     this.micEnabled = false;
        //     } catch (e) {
        //     console.log("couldn't diable mic");
        //     }
        // }
        // else {
        //     try {
        //     console.log("enabling mic");
        //     navigator.mediaDevices.getUserMedia({ audio: true });
        //     //NAF.connection.adapter.enableMicrophone(true);
        //     this.micEnabled = true;
        //     } catch (e) {
        //     console.log("couldn't enable mic");
        //     }
        // }
        // });
    }
    });