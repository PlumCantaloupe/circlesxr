'use strict';

AFRAME.registerComponent('costume', {
        schema: {   
    },
    init: function() {
        const CONTEXT_AF = this;

        CONTEXT_AF.el.addEventListener('click', (e) => {
            const avatar        = e.detail.cursorEl.parentEl
           console.log(avatar);
            // Checking which function to run by the class associated with the costume obj
            if(CONTEXT_AF.el.classList.contains("body")){
                CONTEXT_AF.setBody(avatar, CONTEXT_AF.el.id);
            }
            else if(CONTEXT_AF.el.classList.contains("hair")){
                CONTEXT_AF.setHair(avatar, CONTEXT_AF.el.id);
            }
            else if(CONTEXT_AF.el.classList.contains("head")){
                CONTEXT_AF.setHead(avatar, CONTEXT_AF.el.id);
            }
            else if(CONTEXT_AF.el.classList.contains("color")){
                CONTEXT_AF.setColor(avatar, CONTEXT_AF.el.id);
            }
            else{
                console.log("Costume has no corresponding function");
            }   
        });
    },
    setColor: function(avatar, id){
        const CONTEXT_AF                = document.querySelector('#' + id);
        let avatarNode                  = document.querySelector(".user_body");
        avatar.components["circles-user-networked"].data.color_body = CONTEXT_AF.attributes.color.value;
        avatarNode.setAttribute("circles-color", {color: CONTEXT_AF.attributes.color.value});
    },
    reset: function(avatar){
        avatar.components["circles-user-networked"].data.color_body = avatar.components["circles-user-networked"].data.original_color_body;
        // if (avatar.classList.contains("locked")){
        //     //Do nothing
        // }
        // else{
        //     avatar.classList.add("locked");
        // }
    },
    setPermission: function(avatar){
        // Remove the "locked" permissions class from the avatar
        // avatar.classList.remove("locked");
    },
    setLocked: function(avatar){
        // if (avatar.classList.contains("locked"))
        // {
        //     console.log("Player does not have permissions");
        // }
        // else{
        //     //Pickup Obj
        //     console.log("Accepted");
        // }
    },
    setBody: function(avatar, id){
        let avatar_networtNode              = avatar.components["circles-user-networked"].data;
        let avatarNode                      = document.querySelector(".user_body");
        let costume_list                    = avatar_networtNode.costume;
        console.log("Costume List Before:" + costume_list);
        if(costume_list[2] == id)
        {
            avatar_networtNode.gltf_body     = avatar_networtNode.original_gltf_body;
            avatarNode.setAttribute("gltf-model", avatar_networtNode.original_gltf_body);
            costume_list.splice(2, 1, 'original_gltf_body');
            console.log("Costume List After:" + costume_list);
        }
        else{
            avatar_networtNode.gltf_body = "../../../../global/assets/models/gltf/body/" + id + ".glb";
            avatarNode.setAttribute("gltf-model", "../../../../global/assets/models/gltf/body/" + id + ".glb");
            costume_list.splice(2, 1, id);
            console.log("Costume List After:" + costume_list);
        }
           

    },
    setHead: function(avatar, id){
        let avatar_networtNode              = avatar.components["circles-user-networked"].data;
        let avatarNode                      = document.querySelector(".user_head");
        let costume_list                    = avatar_networtNode.costume;
        console.log("Costume List Before:" + costume_list);
        if(costume_list[1] == id)
        {
            avatar_networtNode.gltf_head     = avatar_networtNode.original_gltf_head;
            avatarNode.setAttribute("gltf-model", avatar_networtNode.original_gltf_head);
            costume_list.splice(1, 1, 'original_gltf_head');
            console.log("Costume List After:" + costume_list);
        }
        else{
            avatar_networtNode.gltf_head = "../../../../global/assets/models/gltf/head/" + id + ".glb";
            avatarNode.setAttribute("gltf-model", "../../../../global/assets/models/gltf/head/" + id + ".glb");
            costume_list.splice(1, 1, id);
            console.log("Costume List After:" + costume_list);
        }
    },
    setHair: function(avatar, id){
        let avatar_networtNode              = avatar.components["circles-user-networked"].data;
        let avatarNode                      = document.querySelector(".user_hair");
        let costume_list                    = avatar_networtNode.costume;
        console.log("Costume List Before:" + costume_list);
        if(costume_list[0] == id)
        {
            avatar_networtNode.gltf_hair     = avatar_networtNode.original_gltf_hair;
            avatarNode.setAttribute("gltf-model", avatar_networtNode.original_gltf_hair);
            costume_list.splice(0, 1, 'original_gltf_hair');
            console.log("Costume List After:" + costume_list);
        }
        else{
            avatar_networtNode.gltf_hair = "../../../../global/assets/models/gltf/hair/" + id + ".glb";
            avatarNode.setAttribute("gltf-model", "../../../../global/assets/models/gltf/hair/" + id + ".glb");
            costume_list.splice(0, 1, id);
            console.log("Costume List After:" + costume_list);
        }
    },

    

});