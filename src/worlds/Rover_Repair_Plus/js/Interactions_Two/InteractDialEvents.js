AFRAME.registerComponent('increasenumber', { // this component increases the number of a dial object
    init: function () {

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function () {

            increaseNumber(CONTEXT_AF.el.parentNode.id);
            console.log("Increased");
            console.log('increaseNumberForAll emit');
            CONTEXT_AF.el.emit('increaseNumberForAll', { DataParentID: CONTEXT_AF.el.parentNode.id }, false); // for syncing


        });

    }

});

AFRAME.registerComponent('decreasenumber', { // this component decreases the number of a dial object
    init: function () {

        const CONTEXT_AF = this;

        //add event listener to object for when it's clicked
        this.el.addEventListener('click', function () {

            decreaseNumber(CONTEXT_AF.el.parentNode.id);
            console.log("Decreased");
            console.log('decreaseNumberForAll emit');
            CONTEXT_AF.el.emit('decreaseNumberForAll', { DataParentID: CONTEXT_AF.el.parentNode.id }, false); // for syncing


        });

    }

});