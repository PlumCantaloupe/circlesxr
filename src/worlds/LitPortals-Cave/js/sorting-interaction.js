AFRAME.registerComponent('sorting-collision', {

    init: function() {
        this.sortingItem = document.querySelectorAll('.sorting_item'); //sortingItem = any element with class 'sorting_item'
        this.boundaryBox = document.querySelectorAll('.collisionbox'); //^ ^
        
        //bounding boxes
        this.itemBoundary = new THREE.Box3();
        this.boxBoundary = new THREE.Box3();
    },

    tick: function() { //check every frame for collision
        this.sortingItem.forEach((item) => {
            this.itemBoundary.setFromObject(item.object3D); //update boundary for each item

            this.boundaryBox.forEach((box) => {
                this.boxBoundary.setFromObject(box.object3D); 

                if (this.itemBoundary.intersectsBox(this.boxBoundary)) {
                    console.log('collision detected')
                    item.setAttribute('position', '8 1 1');
                }
            });
        });
    }
});