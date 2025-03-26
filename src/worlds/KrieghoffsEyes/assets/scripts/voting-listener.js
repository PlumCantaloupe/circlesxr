AFRAME.registerComponent('voting-listener', {
  init: function () {
    const riaManager = document.querySelector("#GameManager");
    // const cabin = document.querySelector("#Cabin");
    var self = this;
    // Array to store voterId, painting
    this.votes = [];
    this.totalVotes = { redPaint: 0, greenPaint: 0, bluePaint: 0, redPaint_return: 0, greenPaint_return: 0 };

    // Update totalVotes
    this.updateTotalVotes = function () {
      self.totalVotes = { redPaint: 0, greenPaint: 0, bluePaint: 0, redPaint_return: 0, greenPaint_return: 0 };
      self.votes.forEach(function (vote) {
        var p = vote.painting;
        self.totalVotes[p] = (self.totalVotes[p] || 0) + 1;
      });
      return self.totalVotes;
    };

    // Update the vote counters
    this.updateCounters = function () {
      var totalVotes = self.updateTotalVotes();
      for (var paint in totalVotes) {
        var counterEl = document.querySelector("#voteCounter_" + paint);
        if (counterEl) {
          counterEl.setAttribute("text", "value", "Votes: " + totalVotes[paint]);
        }
      }
      console.log("Visual counters updated:", totalVotes);
    };

   
    this.checkVotingComplete = function (socket) {
      var totalPlayers = CIRCLES.getNAFAvatarElements().length;
      var votesReceived = self.votes.length;
      console.log("Votes received: " + votesReceived + " / " + totalPlayers);

     
      if (votesReceived === totalPlayers) {
        var totalVotes = self.updateTotalVotes();
        var winner = null;
        var maxVotes = 0;
        for (var key in totalVotes) {
          if (totalVotes[key] > maxVotes) {
            maxVotes = totalVotes[key];
            winner = key;
          }
        }
        console.log("Voting complete! Winner:", winner);
        socket.emit("votingComplete", {
          winner: winner,
          voteCounts: totalVotes,
          room: CIRCLES.getCirclesGroupName(),
          world: CIRCLES.getCirclesWorldName()
        });

        
        if (totalPlayers === 1) {
          var winningEntity = document.querySelector("#" + winner);
          if (winningEntity) {
            
            winningEntity.setAttribute("material", "emissive", "#FFFF00");

            var checkpointTarget = "#checkpoint_" + winner.replace("Paint", "");
            winningEntity.setAttribute("circles-sendpoint", "target:" + checkpointTarget + ";");

            // Only activate RIAmanager if the red painting is clicked
            if (winner === "redPaint") {
              riaManager.emit('ria-painting-clicked');  // Trigger ria-manager
            } 
            if (winner === "greenPaint") {
              riaManager.emit('blz-painting-clicked'); // GameManager sends signal that blz-painting was clicked 
            }

          if (winner === "redPaint_return") {
            console.log("RIA return clicked emitted");
            riaManager.emit('return-clicked');
        }
        if (winner === "greenPaint_return") {
          riaManager.emit('return-clicked');
        } 
          winningEntity.emit('click');

          const painting = document.querySelector("#"+ winner);
          const newEnvironment = painting.getAttribute("environemntProp");
          if (newEnvironment) {
            console.log("New environment set from: " + winner);
          environment.setAttribute("environment", newEnvironment);
          }
        }
        }

        setTimeout(function () {
          self.votes = [];
          self.updateCounters();
        }, 3000);
      }
    };

    
    this.addVote = function (vote) {
      self.votes.push(vote);
      self.updateCounters();
      if (self.socket) {
        self.checkVotingComplete(self.socket);
      }
    };

    function setupVotingListeners(socket) {
      self.socket = socket; 
      socket.on("vote_event", function (data) {
        if (
          data.room === CIRCLES.getCirclesGroupName() &&
          data.world === CIRCLES.getCirclesWorldName()
        ) {
          
          if (data.voterId === window.myVoterId) {
            var alreadyExists = self.votes.some(function (v) {
              return v.voterId === data.voterId && v.painting === data.painting && v.local;
            });
            if (alreadyExists) {
              return;
            }
          }
          
          self.addVote({ voterId: data.voterId, painting: data.painting });
        }
      });

      socket.on("votingComplete", function (data) {
        if (
          data.room === CIRCLES.getCirclesGroupName() &&
          data.world === CIRCLES.getCirclesWorldName()
        ) {
          console.log("Voting complete event received. Winner:", data.winner);
          
          var winningEntity = document.querySelector("#" + data.winner);
          if (winningEntity) {
            
            winningEntity.setAttribute("material", "emissive", "#FFFF00");

             var checkpointTarget = "#checkpoint_" + data.winner.replace("Paint", "");
            winningEntity.setAttribute("circles-sendpoint", "target:" + checkpointTarget + ";");

            // Only activate RIAmanager if the red painting is clicked
            if (data.winner === "redPaint") {
              riaManager.emit('painting-clicked');  // Trigger ria-manager
            }
            if (data.winner === "greenPaint") {
              riaManager.emit('painting-clicked'); // GameManager sends signal that blz-painting was clicked 
            }

            winningEntity.emit('click');

            const painting = document.querySelector("#"+ data.winner);
            const newEnvironment = painting.getAttribute("environemntProp");
            if (newEnvironment) {
            environment.setAttribute("environment", newEnvironment);
            }
          }
        }
      });
    }

    var socket = CIRCLES.getCirclesWebsocket();
    if (socket) {
      setupVotingListeners(socket);
    } else {
      this.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, function wsReady() {
        socket = CIRCLES.getCirclesWebsocket();
        if (socket) {
          setupVotingListeners(socket);
          self.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReady);
        }
      });
    }
  }
});