//component is responsible for dispensing an emotion orb from a emotion dispenser
AFRAME.registerComponent('dispense-emotion', {
    schema: {
        orbColour: {type: 'color'},
        enabled: {type: 'boolean', default: true},
        emotion: {type: 'string'}
    },

    init: function () {
      const CONTEXT_AF = this;
      CONTEXT_AF.guidingText = document.querySelector('[bw-guiding-text]').components['bw-guiding-text'];

      CONTEXT_AF.el.addEventListener('click', function() {
        //dispose a ball if the slot is empty
        if(CONTEXT_AF.data.enabled) {
            CONTEXT_AF.createOrb();
            CONTEXT_AF.el.setAttribute('dispense-emotion', {enabled: false})
        }
        //display error text if the slot is filled
        else
            CONTEXT_AF.guidingText.displayError(ERROR_TEXT.DISPOSE_ONE_TYPE_PART1 + CONTEXT_AF.data.emotion + ERROR_TEXT.DISPOSE_ONE_TYPE_PART2);
      })
    },

    //function creates an orb and positions it in the dispenser slot
    createOrb: function () {
        const CONTEXT_AF = this;
        CONTEXT_AF.parent = CONTEXT_AF.el.parentNode;

        //create orb and append to the parent container
        const orbEl = document.createElement('a-entity');

        orbEl.setAttribute('geometry', {primitive: 'sphere',
                                        radius: EMOTION_ORB_INFO.RADIUS});
        orbEl.object3D.position.set(EMOTION_ORB_INFO.X_POS, EMOTION_ORB_INFO.Y_POS, EMOTION_ORB_INFO.Z_POS);
        orbEl.setAttribute('material', {color: CONTEXT_AF.data.orbColour});
        orbEl.setAttribute('emotion-pick-up', {animate:true});
        orbEl.setAttribute('circles-interactive-object', {type: 'outline'});
        orbEl.setAttribute('id', CONTEXT_AF.data.emotion);

        CONTEXT_AF.parent.appendChild(orbEl);
    }
});
