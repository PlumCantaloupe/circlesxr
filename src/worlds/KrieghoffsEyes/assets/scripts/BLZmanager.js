AFRAME.registerComponent('blz-manager', {
    init: function () {
        this.sledParts = [];
        this.logs = [];
        this.sledPartsPlaced = 0;
        this.scene = this.el.sceneEl;
        this.pedestal = null;

        this.cabin = document.querySelector("#Cabin");

        //track task completion
        this.taksCompleted = 0;
        this.totalTasks = 2;


        // Wait for the green painting click event
        this.el.addEventListener('blz-painting-clicked', () => {
            console.log("BLZ painting click heard");
            this.startSledTask();
        });

        this.el.addEventListener('blz-complete', () =>{
          this.taksCompleted++;  

          console.log("summoning portal: " + this.taksCompleted);
          //makesure we complete all the task fist before spawining portal
          if(this.totalTasks === this.taksCompleted) {
            this.spawnPortal();
          }
        });

        this.el.addEventListener('return-clicked', () => {
            this.blzWorld = document.querySelector('blzWorld');
            this.environment = document.querySelector('#environment');
            blzWorld.setAttribute('visible', 'false');
            this.cabin.setAttribute('visible', 'true');
            this.environment.setAttribute('position', '0 -2.265 0');
            this.environment.setAttribute('environment', {
                preset: 'checkerboard',
                seed: 123,
                fog: 0.06,
                lightPosition: '-4.160 1 0',
                skyType: 'gradient',
                skyColor: '#0f0c14',
                horizonColor: '#000000',
                lighting: 'none',
                dressing: 'none'
            });

            console.log(this.environment);
        });
    },

    startSledTask: function () {
        console.log('Blizzard task');
        this.spawnParts();
        this.spawnLogs();
        this.spawnPedestal();
        this.spawnAxe();
        this.spawnAxeTarget();
        this.cabin.setAttribute('visible', 'false');
    },
   
    spawnParts: function () {
        const blzWorld = document.querySelector('#blzWorld');
        const positions = [
            { x: -45, y: 0, z: 0 },
            { x: -45, y: 0, z: 1 },
            { x: -45, y: 0, z: 2 },
            { x: -45, y: 0, z: 3 }
        ];

        const rotations = [
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 },
            { x: 0, y: 0, z: 0 }
        ];

        positions.forEach((pos, index) => {
            let sledPart = document.createElement('a-entity');
            sledPart.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
            // sledPart.setAttribute('geometry', 'primitive: cylinder; height: 1; radius: 0.2'); // Fixed typo
            sledPart.setAttribute('id', `sledPart${index}`);
            sledPart.setAttribute('gltf-model', `#logModel`);
            sledPart.setAttribute('material', 'color: brown'); // Material needs to be separate
            //sledPart.setAttribute('class', 'interactable-log');
            sledPart.setAttribute('part-highlight', '');
            sledPart.setAttribute('class', 'interactive');
            //sledPart.setAttribute('circles-interactive-object', '');
            //sledPart.setAttribute('circles-pickup-networked', '');
            //sledPart.setAttribute('static-body', '');

            sledPart.addEventListener('partSelected', () => {
                console.log("removed part");
                sledPart.parentNode.remove(sledPart);
            });
            
            sledPart.setAttribute('scale', '1 1 1'); // Scale down by half in all directions
            const rot = rotations[index];
            sledPart.setAttribute('rotation', `${rot.x} ${rot.y} ${rot.z}`);

            blzWorld.appendChild(sledPart);
            this.sledParts.push(sledPart);
        });

    },

    spawnLogs: function () {
      const blzWorld = document.querySelector('#blzWorld');
      const positions = [
          { x: -45, y: 0.4, z: -2 },
          { x: -45, y: 0.5, z: -2 },
          { x: -45, y: 0.6, z: -2 },
          { x: -45, y: 0.7, z: -2 }
      ];

      const rotations = [
          { x: 0, y: 90, z: 0 },
          { x: 0, y: 90, z: 0 },
          { x: 0, y: 90, z: 0 },
          { x: 0, y: 90, z: 0 }
      ];

      positions.forEach((pos, index) => {
          let log = document.createElement('a-entity');
          log.setAttribute('position', `${pos.x} ${pos.y} ${pos.z}`);
          // sledPart.setAttribute('geometry', 'primitive: cylinder; height: 1; radius: 0.2'); // Fixed typo
          log.setAttribute('id', `log${index}`);
          log.setAttribute('gltf-model', `#logModel`);
          log.setAttribute('material', 'color: brown'); // Material needs to be separate
          log.setAttribute('class', 'can-be-chopped');
          //log.setAttribute('part-highlight', '');
          //log.setAttribute('class', 'interactive');
          //sledPart.setAttribute('circles-interactive-object', '');
          //sledPart.setAttribute('circles-pickup-networked', '');
          log.setAttribute('dynamic-body', 'mass: 0');

          //chopping check
          this.chopAllowed = false;
          this.chopCounter = 0;
          //since the target was touched, we can now chop the log
          log.addEventListener('choppingPrepared', () => {
            this.chopAllowed = true;
            console.log("before collide with log: " + this.chopAllowed);
          });

          //if we collied with the log and we're in the choping state, remove the log
          log.addEventListener('collide', (event) => {
            console.log("After collied with log: " + this.chopAllowed);
            console.log("Axe collided with log!", event.detail.body.el);

            const axe = event.detail.body.el;
            if (!axe || axe.id !== 'axe') return;

            if (this.chopAllowed === true) {
              console.log("log chopped!");
              log.removeAttribute('static-body');
              
              //wait for physics to get removed first before removing the element
              setTimeout(() => {
                if (log.parentNode) {
                    log.parentNode.removeChild(log);
                  }
                }, 0);
                
                
              //reset the chopping state
              this.chopAllowed = false;
              
              //increment counter
              this.chopCounter++;
              console.log('chop counter: ' + this.chopCounter);
                
              //reset the target color
              let axetarget = document.querySelector('#axeTarget');
              axetarget.setAttribute('material', 'color: red');

              //for some reason the array didn't srink in size as the logs got removed,
              //so we have a coutner to count up to the origianl lenght of the array
              console.log("array length: " + this.logs.length);

              if(this.logs.length === this.chopCounter) {
                const gameManager = document.querySelector('#GameManager');
                // check if all logs have been chopped
                console.log("all chopped! blz-complete was called");
                if (gameManager) {
                  gameManager.emit('blz-complete');
                }
              }

            } else {
              console.log("you're not allowed to chop");
            } 

          });

          
          log.setAttribute('scale', '1 1 1'); // Scale down by half in all directions
          const rot = rotations[index];
          log.setAttribute('rotation', `${rot.x} ${rot.y} ${rot.z}`);

          blzWorld.appendChild(log);
          this.logs.push(log);
      });

  },

    spawnAxe: function () {
      console.log("Axe Spawned");
      const blzWorld = document.querySelector('#blzWorld');
      this.axe = document.createElement('a-entity');
      this.axe.setAttribute('id', 'axe');
      this.axe.setAttribute('geometry', 'primitive: cylinder; height: 0.75; radius: 0.05');
      this.axe.setAttribute('class', 'interactable-axe');
      this.axe.setAttribute('circles-artefact', {
        inspectPosition:      '0.0 0.5 0.0',
        inspectScale:         '1 1 1',
        inspectRotation:      '-30 0 0',
        textRotationY:        '90',
        descrption_offset:    '0 1 0',
        description_on:       true,
        desc_arrow_position:  'down',
        label_text:           'Axe',
        label_offset:         '0 1 0',
        label_on:             true,
        label_arrow_position: 'down',
        title:                '1800s Single Bit Axe',
        description:          'These axes where meant for felling and slitting wood - use this axe to clear the way',
        title_back:           'Some Title',
        description_back:     'Some description text.',
        //audio:                #some-snd; 
        //volume:               0.4
      });
      this.axe.setAttribute('position', '-45 1 -1');
      //for collision
      this.axe.setAttribute('static-body', '');
      //we're trying raycaster to detct collision - cuz 
      blzWorld.appendChild(this.axe);
    },

    spawnAxeTarget: function () {
      const blzWorld = document.querySelector('#blzWorld');
      this.axeTarget = document.createElement('a-entity');
      this.axeTarget.setAttribute('id', 'axeTarget');
      this.axeTarget.setAttribute('geometry', 'primitive: sphere; radius: 0.25');
      this.axeTarget.setAttribute('material', 'opacity: 0.5; transparent: true; color: #ff0000;');
      this.axeTarget.setAttribute('position', '-45 2 -2');
      //for collision detection with axe
      this.axeTarget.setAttribute('axe-target-trigger', '');
      //be user to have mass = 0 so it doesn't fly away - by default it's 5
      this.axeTarget.setAttribute('dynamic-body', 'mass: 0');

      //if the target was touched send message to logs they can be chopped
      this.axeTarget.addEventListener('targetTouched', () =>  {
        
        // Select all elements with the class 'can-be-chopped'
        const canBeChopped = document.querySelectorAll('.can-be-chopped');

        // Loop through each element and perform an action
        canBeChopped.forEach((element) => {
          console.log(element); // Logs each element with the class
          console.log("choppingPrepared got emitted");
          element.emit('choppingPrepared'); //let logs know they can be chopped
        });
      });

      blzWorld.appendChild(this.axeTarget);
    },

    spawnPedestal: function () {
        const blzWorld = document.querySelector('#blzWorld');
        //this.pedestal = document.createElement('a-box');
        //try a-entiy instead of a-box
        this.pedestal = document.createElement('a-entity'); 
        this.pedestal.setAttribute('id', 'sledPedestal');
        this.pedestal.setAttribute('geometry', {primitive: 'box', width: 3, height: 0.3, depth: 3});
        this.pedestal.setAttribute('position', '-60 0 0');
        // this.pedestal.setAttribute('width', '3');
        // this.pedestal.setAttribute('height', '0.3');
        // this.pedestal.setAttribute('depth', '3');
        this.pedestal.setAttribute('material', 'color: red');
        this.pedestal.setAttribute('sled-pedestal-trigger', '');
    
        let sled = document.createElement('a-entity');
        sled.setAttribute('position', `-60 0.3 0`);

        sled.setAttribute('id', `sled`);
        sled.setAttribute('visible', 'false');
        sled.setAttribute('gltf-model', `#Raft4`);
        sled.setAttribute('material', 'color: brown'); // Material needs to be separate
        
        sled.setAttribute('scale', '0.5 0.5 0.5'); // Scale down by half in all directions
        sled.setAttribute('rotation', '0 90 0');
        
        // Make it a physics trigger
        this.pedestal.setAttribute('dynamic-body', 'mass: 0;'); // A-Frame physics component
    
        blzWorld.appendChild(this.pedestal);
        blzWorld.appendChild(sled);

    },
    
    spawnPortal: function () {
        // Create the a-box element
        const blzWorld = document.querySelector('#blzWorld');
        let greenPaint = document.createElement('a-box');
        greenPaint.setAttribute('position', '-60 1.3 -3');
        greenPaint.setAttribute('scale', '1 1.3 0.071');
        greenPaint.setAttribute('rotation', '-15 90 0');
        greenPaint.setAttribute('color', '#940000');
        greenPaint.setAttribute('id', 'greenPaint_return');
        greenPaint.setAttribute('class', 'interactive');
        greenPaint.setAttribute('circles-interactive-object', 'type:highlight');
        greenPaint.setAttribute('environemntProp', 'preset: checkerboard; seed: 123; fog: 0.06; lightPosition: -4.160 1 0; skyType: gradient; skyColor: #0f0c14; horizonColor: #000000 lighting: none; dressing: none;');
        greenPaint.setAttribute('painting-highlight', '');
        greenPaint.setAttribute('material', 'color:#ffffff; src: #RIA; shader: standard; transparent: true; emissive: #ffffff; emissiveIntensity: 0;');

        // Create the a-entity element
        let painting1 = document.createElement('a-entity');
        painting1.setAttribute('id', 'painting1_return');
        painting1.setAttribute('scale', '20 20 20');
        painting1.setAttribute('gltf-model', '#painting_gltf');
        painting1.setAttribute('position', '-60 0 -3');
        painting1.setAttribute('rotation', '0 0 0');

        let voteCounter = document.createElement('a-entity');
        voteCounter.setAttribute('id', 'voteCounter_greenPaint_return');
        voteCounter.setAttribute('position', '-60 2.7 -3');
        voteCounter.setAttribute('rotation', '0 0 0');
        voteCounter.setAttribute('text', 'value: Votes: 0; align: center; color: white; width: 4');
    

        // Append elements to the scene
        blzWorld.appendChild(greenPaint);
        blzWorld.appendChild(painting1);
    }
    
});

AFRAME.registerComponent('sled-pedestal-trigger', {
    init: function () {
      this.sledPartsPlaced = 0;
      this.maxParts = 4;
  
      // Ensure that the elements are available
      this.el = document.querySelector("#sledPedestal");
      
      document.querySelector("#sledPedestal");

      this.sled = document.querySelector('#sled');
      const gameManager = document.querySelector('#GameManager');
  
        // Debug: Check if the elements are found
        console.log("sledPedestal found:", this.el);
        console.log("sled found:", this.sled);

      if (!this.el || !this.sled) {
        console.log("sledPedestal or sled element not found!");
        return; // Exit if the required elements are not found
      } else {
        console.log("sledPedestal and sled element ARE found!");
      }
  
      
      // Listen for the 'partSelected' event
      this.el.addEventListener('partSelected', () => {
        this.sledPartsPlaced++;
        console.log("part was added " + this.sledPartsPlaced);
  
        // Update the sled visibility and model
        this.sled.setAttribute('visible', 'true');
        this.sled.setAttribute('gltf-model', `#Raft${this.sledPartsPlaced}`);
  
        // Check if all parts are placed
        if (this.sledPartsPlaced === this.maxParts) {
          console.log("Sled is complete!");
          this.el.setAttribute('material', 'color: green');
          if (gameManager) {
            console.log("blz-complete was sent");
            gameManager.emit('blz-complete');
          }
        }
      });
    }
  });

//check if the target was touched and change color
AFRAME.registerComponent('axe-target-trigger', {
    init: function () {
        this.axeTarget = document.querySelector("#axeTarget");

        this.axeTarget.addEventListener('collide', (event) => {
          console.log("Collision detected!", event.detail.body.el);
          const axe = event.detail.body.el;
          if (!axe || axe.id !== 'axe') return;
          
          this.axeTarget.setAttribute('color', 'green');
          
          this.axeTarget.setAttribute('material', 'color: #00ff00');
          this.axeTarget.emit('targetTouched');
      });
        
    }
});

//load the Blizard Enviroment model
AFRAME.registerComponent('blz-lazy-load-environment', {
    init: function () {
      const scene = document.querySelector('a-scene');
      
      const blzWorld = document.querySelector('#blzWorld');
      scene.addEventListener('loaded', () => {

        //Blizzard set up
        const blzEnv = document.createElement('a-entity');
        //adding cylinder for testing - replace with gltf
        blzEnv.setAttribute('geometry', 'primitive: cylinder; height: 1; radius: 0.2');
        blzEnv.setAttribute('position', '-42 1 0');
        blzEnv.setAttribute('visible', 'false');
        blzEnv.setAttribute('id', 'blzEnv');
        blzWorld.appendChild(blzEnv);
  
      });
      
     
      const gameManager = document.querySelector('#GameManager');
      if (gameManager) {
        gameManager.addEventListener('blz-painting-clicked', () => {
            const blzEnv = document.querySelector('#blzEnv');
            if (blzEnv) {
              blzEnv.setAttribute('visible', 'true');
            }
        })
      }
    }
  });

  AFRAME.registerComponent('part-highlight', {
    init: function () {
      let el = this.el;
      let sledPedestal = document.querySelector('#sledPedestal');
  
      // Set a material on the GLTF model
      el.setAttribute('material', '#ffffff');
  
      // Highlight the model on mouseenter and restore on mouseleave
      el.addEventListener('mouseenter', function () {
        el.setAttribute('circles-material-extend-fresnel', 'fresnelColor: #ffffff');
      });
      el.addEventListener('mouseleave', function () {
        el.setAttribute('circles-material-extend-fresnel', 'fresnelColor: #000000');
      });
  
      // Emit the 'partSelected' event on click
      el.addEventListener('click', () => {
        console.log(`Emitting partSelected for: ${el.id}`); // Log the emission
        el.emit('partSelected', { id: el.id });
        sledPedestal.emit('partSelected');
      });
    }
  });
  