//component is responsible for dispensing an emotion orb from a emotion dispenser
AFRAME.registerComponent('dispense-emotion', {
    schema: {
        orbColour: {type: 'color'},
        enabled: {type: 'boolean', default: true}
    },

    init: function () {
      const Context_AF = this;

      Context_AF.el.addEventListener('click', function() {
        //dispose a ball if the slot is empty
        if(Context_AF.data.enabled) {
            Context_AF.createOrb();
            Context_AF.el.setAttribute('dispense-emotion', {enabled: false})
        }
        //display error text if the slot is filled
        else
            console.log("filled slot");
      })
    },

    //function creates an orb and positions it in the dispenser slot
    createOrb: function () {
        const Context_AF = this;
        Context_AF.parent = Context_AF.el.parentNode;

        //create orb and append to the parent container
        const orbEl = document.createElement('a-entity');

        orbEl.setAttribute('geometry', {primitive: 'sphere',
                                        radius: EMOTION_ORB_INFO.RADIUS});
        orbEl.object3D.position.set(EMOTION_ORB_INFO.X_POS, EMOTION_ORB_INFO.Y_POS, EMOTION_ORB_INFO.Z_POS);
        orbEl.setAttribute('material', {color: Context_AF.data.orbColour});
        orbEl.setAttribute('emotion-pick-up', {});
        orbEl.setAttribute('id', 'orb');

        Context_AF.parent.appendChild(orbEl);
    }
});
