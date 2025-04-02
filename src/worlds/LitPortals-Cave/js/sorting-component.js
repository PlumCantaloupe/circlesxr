AFRAME.registerComponent('sorting-collision', {

    init: function() {
        this.boundaryBoxes = document.querySelectorAll('.collisionbox'); 
        this.boxBoundary = new THREE.Box3();

        /*this.el.addEventListener('mouseup', () => {
            this.checkCollision();
        });*/

        this.el.addEventListener('releaseEventFunc', () => {
            this.checkCollision();
        });

        this.socket = io();

        this.socket.on("updateItemPosition", (data) => {
            let item = document.getElementById(data.itemId);
            if (item) {
                item.object3D.position.set(data.position.x, data.position.y, data.position.z);
                console.log(`getting ${data.itemId} position`)
            }
        })
    },

    checkCollision: function() {
        let item = this.el;
        let itemBoundary = new THREE.Box3().setFromObject(item.object3D);

        this.boundaryBoxes.forEach((box) => {
            this.boxBoundary.setFromObject(box.object3D);

            if (itemBoundary.intersectsBox(this.boxBoundary)) {
                console.log(`Collision detected between ${item.id} and ${box.id}`);

                let correctOrder = item.getAttribute("data-order");
                let goalOrder = box.getAttribute("id").split("-")[1];

                if (correctOrder == goalOrder) {
                    console.log(`✅ Item ${item.id} correctly placed in ${box.id}`);

                    // move item to goal position ONCE
                    let goalPosition = new THREE.Vector3();
                    box.object3D.getWorldPosition(goalPosition);

                    //world position to local position
                    if (item.object3D.parent) {
                        item.object3D.parent.worldToLocal(goalPosition);
                    }

                    this.socket.emit("playDing", { sound: "ding" });
                    document.querySelector("#ding").components.sound.playSound();
                    item.object3D.position.copy(goalPosition); //makes artifact reposition (have to press on artifact itself)

                    item.setAttribute("data-correct", "true");
                    this.checkItemPositions();

                    this.socket.emit("itemPlaced", {  //emit event to server
                        itemId: item.id,
                        position: { x: goalPosition.x, y: goalPosition.y, z: goalPosition.z }
                    });
                    
                } else {
                    //document.querySelector("#buzzer").components.sound.playSound(); took out bc sometimes the item will touch both boundaries which plays the ding and buzz at the same time
                    console.log(`❌ Item ${item.id} is in the wrong spot`);

                    item.setAttribute("data-correct", "false");
                }
            }
        });
    },

    checkItemPositions: function() {
        let allItems = document.querySelectorAll('.sorting_item'); // = any element with class 'sorting_item'

        let allCorrect = true;
        allItems.forEach((item) => {
            if (item.getAttribute("data-correct") !== "true") {
                allCorrect = false;
            }
        });

        console.log("Logging..."); 

        if (allCorrect) { // if all items are placed
            document.querySelector("#trumpet").components.sound.playSound();
            console.log("🎉 All items sorted correctly! Congrats.");

            this.socket.emit("sortComplete", { room: "yourRoomName" }); //tell server sorting is done
            this.resetSorting();
        }
    },

    resetSorting: function() {
        setTimeout(() => {
            document.getElementById("vaseArtifact").object3D.position.set(12.5, 2.3, -15.1);
            document.getElementById("sculptureArtifact").object3D.position.set(12.5, 2, -14.3);
            document.getElementById("figurineArtifact").object3D.position.set(12.5, 1.95, -13.3);
            document.getElementById("sculpture2Artifact").object3D.position.set(12.5, 1.75, -12.5);
    
            document.querySelectorAll('.sorting_item').forEach((item) => {
                item.setAttribute("data-correct", "false");
            });
    
            console.log("Game reset!");

            this.socket.emit("gameReset", {
                itemId: item.id,
                position: { x: goalPosition.x, y: goalPosition.y, z: goalPosition.z }
            });

        }, 10000);
    }
});
