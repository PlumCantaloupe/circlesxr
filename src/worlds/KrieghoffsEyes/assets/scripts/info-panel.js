AFRAME.registerComponent('info-panel', {
  init: function () {
    this.titleEl = document.querySelector('#panelTitle');
    this.descriptionEl = document.querySelector('#panelDescription');
    this.panelPositions = {
      redPaint: { x: 0.83307, y: 1.31338, z: -4.2279 },
      greenPaint: { x: -1.06558, y: 1.33932, z: -5.072 },
      bluePaint: { x: -2.86388, y: 1.33563, z: -4.2867 }
    };

    this.panelRotation = {
      redPaint: { x:-15.487622160181282, y:-38.13320605493194, z:0.3472124238492789},
      greenPaint: { x: -15.103740437443632, y: 6.330037720605334, z: 0.4125296124941928 },
      bluePaint: { x: -15.513978218757302, y: 42.626914042142985, z: 0.9035544429213082 }
    }

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
    var panelRotation = this.panelRotation[paintingId];

    if (!info) { return; }

    this.currentPaintingId = paintingId;

    this.el.setAttribute('position', panelPosition);
    this.el.setAttribute('rotation', panelRotation);
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
