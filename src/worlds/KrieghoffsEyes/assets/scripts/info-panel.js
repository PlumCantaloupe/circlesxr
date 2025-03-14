AFRAME.registerComponent('info-panel', {
  init: function () {
    this.titleEl = document.querySelector('#panelTitle');
    this.descriptionEl = document.querySelector('#panelDescription');
    this.panelPositions = {
      redPaint: { x: 3.893, y: 1.805, z: -8.242 },
      greenPaint: { x: 0.045, y: 1.805, z: -8.242 },
      bluePaint: { x: -3.816, y: 1.805, z: -8.242 }
    };

    this.paintingInfo = {
      redPaint: { title: 'Red Painting', description: 'A red painting.' },
      greenPaint: { title: 'Green Painting', description: 'A green painting.' },
      bluePaint: { title: 'Blue Painting', description: 'A blue painting.' }
    };

    this.currentPaintingId = null;

    // Generate a persistent voter ID per session
    if (!window.myVoterId) {
      window.myVoterId = 'voter_' + Math.random().toString(36).substr(2, 9);
    }

    // Listen for painting selection events
    this.el.sceneEl.addEventListener('paintingSelected', this.onPaintingSelected.bind(this));

    // Listen for vote button clicks
    var voteButton = this.el.querySelector('#button');
    if (voteButton) {
      voteButton.addEventListener('click', this.onVote.bind(this));
    }

    this.el.setAttribute('visible', false);
  },

  onPaintingSelected: function (evt) {
    var paintingId = evt.detail.id;
    var info = this.paintingInfo[paintingId];
    var panelPosition = this.panelPositions[paintingId];

    if (!info) { return; }

    this.currentPaintingId = paintingId;

    this.el.setAttribute('position', panelPosition);
    this.el.object3D.scale.set(1, 1, 1);
    this.el.setAttribute('visible', true);

    this.titleEl.setAttribute('text', 'value', info.title);
    this.descriptionEl.setAttribute('text', 'value', info.description);
  },

  onVote: function () {
    if (!this.currentPaintingId) {
      console.log("No painting selected for voting!");
      return;
    }
    var socket = CIRCLES.getCirclesWebsocket();
    var playerId = window.myVoterId; // Unique Voter ID

    // Emit vote event 
    socket.emit('vote_event', {
      voterId: playerId,
      painting: this.currentPaintingId,
      room: CIRCLES.getCirclesGroupName(),
      world: CIRCLES.getCirclesWorldName()
    });
    console.log("Vote sent for painting: " + this.currentPaintingId + " by: " + playerId);

    //update vote count
    var votingListenerEl = document.querySelector('[voting-listener]');
    if (votingListenerEl && votingListenerEl.components['voting-listener']) {
      votingListenerEl.components['voting-listener'].addVote({
        voterId: playerId,
        painting: this.currentPaintingId,
        local: true
      });
    }

    // Hide the panel after voting.
    this.hidePanel();
  },

  hidePanel: function () {
    this.el.object3D.scale.set(0.001, 0.001, 0.001);
    this.el.setAttribute('visible', false);
  }
});
