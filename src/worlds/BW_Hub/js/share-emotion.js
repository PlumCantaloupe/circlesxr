AFRAME.registerComponent('share-emotion', {
    schema: {
        
    },

    init: function () {
      const Context_AF = this;
      Context_AF.manager = document.querySelector('#manager')
      Context_AF.parent = Context_AF.el.parentNode;

      Context_AF.el.addEventListener('click', function() {
        const holdingOrb = manager.getAttribute('manager').holdingOrb;
        if(holdingOrb)
            console.log("ji")
        else
            console.log("You must pick up an orb to dispense it");
      })
    },

    update: function () {
      // Do something when component's data is updated.
    },

    remove: function () {
      // Do something the component or its entity is detached.
    },

    tick: function (time, timeDelta) {
      // Do something on every scene tick or frame.
    }
});
