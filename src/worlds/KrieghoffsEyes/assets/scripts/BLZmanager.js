AFRAME.registerComponent('blz-manager', {
    init: function () {
        this.sledParts = [];
        this.sledPartsPlaced = 0;
        this.scene = this.el.sceneEl;
        this.pedestal = null;

        this.cabin = document.querySelector("#Cabin");


        // Wait for the green painting click event
        this.el.addEventListener('blz-painting-clicked', () => {
            console.log("BLZ painting click heard");
            this.startSledTask();
        });

        this.el.addEventListener('blz-complete', () =>{
            this.spawnPortal();
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
        this.spawnLogs();
        this.spawnPedestal();
        this.cabin.setAttribute('visible', 'false');
    },
   
    spawnLogs: function () {
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
            sledPart.setAttribute('class', 'interactable-log');
            sledPart.setAttribute('part-highlight', '');
            sledPart.setAttribute('class', 'interactive');
            //sledPart.setAttribute('circles-interactive-object', '');
            //sledPart.setAttribute('circles-pickup-networked', '');
            //sledPart.setAttribute('static-body', '');

            sledPart.addEventListener('partSelected', () => {
                console.log("remove interactivity on part");
                sledPart.removeAttribute('class', 'interactive');
            });
            
            sledPart.setAttribute('scale', '1 1 1'); // Scale down by half in all directions
            const rot = rotations[index];
            sledPart.setAttribute('rotation', `${rot.x} ${rot.y} ${rot.z}`);

            blzWorld.appendChild(sledPart);
            this.sledParts.push(sledPart);
        });
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
      
      //try to add the event listener directly on pedestal
      document.querySelector("#sledPedestal").addEventListener('partSelected', () => { 
        console.log("Part selected event received!");
      });

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
    //   this.el.addEventListener('partSelected', (event) => {
    //     this.sledPartsPlaced++;
    //     console.log("part was added " + this.sledPartsPlaced);
  
    //     // Update the sled visibility and model
    //     this.sled.setAttribute('visible', 'true');
    //     this.sled.setAttribute('gltf-model', `#Raft${this.sledPartsPlaced}`);
  
    //     // Check if all parts are placed
    //     if (this.sledPartsPlaced === this.maxParts) {
    //       console.log("Sled is complete!");
    //       this.el.setAttribute('color', 'green');
    //       if (gameManager) {
    //         gameManager.emit('blz-complete');
    //       }
    //     }
    //   });
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
      });
    }
  });
  