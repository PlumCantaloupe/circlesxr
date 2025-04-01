AFRAME.registerComponent('info-panel', {
  init: function () {
    this.titleEl = document.querySelector('#panelTitle');
    this.panelImg = document.querySelector('#panelImg');
    this.descriptionEl = document.querySelector('#panelDescription');
    this.panelPositions = {
      redPaint: { x: 0.83307, y: 1.31338, z: -4.2279 },
      greenPaint: { x: -2.5964, y: 1.33563, z: -4.01162 },
      redPaint_return: { x: -0.644, y: 3.046, z: -18.630 }
    };

    this.panelRotation = {
      redPaint: { x:-15.487622160181282, y:-38.13320605493194, z:0.3472124238492789},
      greenPaint: { x: -15.513978218757302, y: 42.626914042142985, z: 0.9035544429213082 },
      redPaint_return: { x: -15.487622160181282, y: -38.13320605493194, z: 0.3472124238492789 }
    }

    this.paintingInfo = {
      redPaint: { title: 'Raft in Autumn', description: '"Decription."' },
      greenPaint: { title: 'The Blizzard', description: '"Decription."' },
      bluePaint: { title: 'Blue Painting', description: 'A blue painting.' },
      redPaint_return: { title: 'Red Painting', description: 'A red painting.' }
    };
    
    this.paintingImages = {
      redPaint: '#RIA',
      redPaint_gray: '#RIA_gray',
      greenPaint: '#blizzard',
      greenPaint_gray: '#blizzard_gray',
      redPaint_return: '#RIA' 
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

    
    var imageSrc = "";
    switch (paintingId) {
      case "redPaint":
        imageSrc = gameState.RIAdone ? this.paintingImages.redPaint : this.paintingImages.redPaint_gray;
        break;
      case "greenPaint":
        imageSrc = gameState.blizzardDone ? this.paintingImages.greenPaint : this.paintingImages.greenPaint_gray;
        break;
      default:
        imageSrc = this.paintingImages[paintingId] || "";
        break;
    }

    
    if (imageSrc) {
      this.panelImg.setAttribute('material', 'src', imageSrc);
    }
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
