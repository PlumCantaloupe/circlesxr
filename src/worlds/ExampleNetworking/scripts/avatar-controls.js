AFRAME.registerComponent('avatar-controls', {
    schema: {},
    init: function() {
        CONTEXT_AF = this;
        CONTEXT_AF.createAvatarControls();
    },


    createAvatarControls: function(){
        CONTEXT_AF = this;

        CONTEXT_AF.avatar_controls = document.querySelector('#avatar_controls');

        console.log(CONTEXT_AF.avatar_controls);

        CONTEXT_AF.self_controls = CONTEXT_AF.avatar_controls.querySelector('.change_self');
        CONTEXT_AF.other_controls = CONTEXT_AF.avatar_controls.querySelector('.change_others');

        console.log(CONTEXT_AF.self_controls.querySelector('.change.self.ghost'));

        //document.querySelector('#avatar_controls .change_self').querySelector('.change.self.ghost');

        CONTEXT_AF.self_controls.querySelector('.change.self.ghost').addEventListener('click', () => CONTEXT_AF.changeSelf('ghost'));
        CONTEXT_AF.self_controls.querySelector('.change.self.matte').addEventListener('click', () => CONTEXT_AF.changeSelf('shade'));
        CONTEXT_AF.self_controls.querySelector('.change.self.wireframe').addEventListener('click', () => CONTEXT_AF.changeSelf('wireframe'));
        CONTEXT_AF.self_controls.querySelector('.change.self.normal').addEventListener('click', () => CONTEXT_AF.changeSelf('visible'));

        CONTEXT_AF.other_controls.querySelector('.change.other.ghost').addEventListener('click', () => CONTEXT_AF.changeOther('ghost'));
        CONTEXT_AF.other_controls.querySelector('.change.other.matte').addEventListener('click', () => CONTEXT_AF.changeOther('shade'));
        CONTEXT_AF.other_controls.querySelector('.change.other.wireframe').addEventListener('click', () => CONTEXT_AF.changeOther('wireframe'));
        CONTEXT_AF.other_controls.querySelector('.change.other.normal').addEventListener('click', () => CONTEXT_AF.changeOther('visible'));

    },

    changeSelf: function(type){
        const avaElem = CIRCLES.getAvatarElement();
        avaElem.setAttribute('circles-user-local', "userVisibility", type);
    },


    changeOther: function(type){
        const avaElem = CIRCLES.getAvatarElement();
        avaElem.setAttribute('circles-user-networked', "ghostType", type);

    }

});