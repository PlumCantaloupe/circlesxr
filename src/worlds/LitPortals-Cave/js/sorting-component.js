AFRAME.registerComponent('sorting-collision', {

    init: function() {
        //this.sortingItems = document.querySelectorAll('.sorting_item'); //sortingItems = any element with class 'sorting_item'
        this.boundaryBoxes = document.querySelectorAll('.collisionbox'); //^ ^
        this.allItems = {};

        //bounding boxes
        //this.itemBoundary = new THREE.Box3();
        this.boxBoundary = new THREE.Box3();

        this.el.addEventListener('mouseup', () => {
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
                    this.allItems[item.id] = true; //all items are correctly placed
                    //this.checkItemPositions();
                    
                } else {
                    //document.querySelector("#buzzer").components.sound.playSound();
                    console.log(`❌ Item ${item.id} is in the wrong spot`);
                    delete this.allItems[item.id];
                }
            }
        });
    },

    checkItemPositions: function() {
        console.log("Current placed items:", Object.keys(this.allItems)); 
        console.log("Number of placed items:", Object.keys(this.allItems).length); 

        if (Object.keys(this.allItems).length === 4) { // if all items are placed
            console.log("🎉 All items sorted correctly! Congrats.");
        }
    }
});
