AFRAME.registerComponent('sorting-collision', {

    init: function() {
        //this.sortingItems = document.querySelectorAll('.sorting_item'); //sortingItems = any element with class 'sorting_item'
        this.boundaryBoxes = document.querySelectorAll('.collisionbox'); //^ ^

        //bounding boxes
        //this.itemBoundary = new THREE.Box3();
        this.boxBoundary = new THREE.Box3();

        /*this.el.addEventListener('mouseup', () => {
            this.checkCollision();
        });*/

        this.el.addEventListener('releaseEventFunc', () => {
            this.checkCollision();
        });
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

                    document.querySelector("#ding").components.sound.playSound();
                    item.object3D.position.copy(goalPosition); //makes artifact reposition (have to press on artifact itself)

                    item.setAttribute("data-correct", "true");
                    this.checkItemPositions();
                    
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
        }
    }
});
