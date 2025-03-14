AFRAME.registerComponent('pedestal-trigger', {
    init: function () {
        this.logsPlaced = 0;
        this.maxLogs = 4;
        this.el = document.querySelector("#raftPedestal");
        console.log(this.el);

        this.el.addEventListener('collide', (event) => {
            let log = event.detail.body.el; // Get the colliding object
            console.log(log);

            if (log.classList.contains('interactable-log')) {
                this.placeLog(log);
            }
        });
    },

    placeLog: function (log) {
        log.parentNode.removeChild(log); // Remove log from scene
        this.logsPlaced++;

        console.log(`Logs placed: ${this.logsPlaced}/4`);

        if (this.logsPlaced === this.maxLogs) {
            console.log("Raft is complete!");
        }
    }
});
