AFRAME.registerComponent('custom-button', {
    schema: {
        button_color_hover: {type:'color', default:'rgb(255, 0, 0)'},
    },

    init: function () {
      // Do something when component first attached.
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
