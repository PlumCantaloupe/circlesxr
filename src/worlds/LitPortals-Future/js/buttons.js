
let currentEnvironment = "starry"; // Default environment
const socket = io(); // Connect to WebSocket server
console.log("Socket connected:", socket.id);

AFRAME.registerComponent("change-environment", {
    init: function () {
      const envEntity = document.querySelector("[environment]");
      const redButton = document.querySelector("#red_button .button");
      
      const environments = ["starry", "forest", "yavapai", "arches", "contact"];
      let currentIndex = 0;
  
      console.log("change-environment component initialized.");
  
      redButton.addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % environments.length;
        currentEnvironment = environments[currentIndex]; // Update global variable
        envEntity.setAttribute("environment", `preset: ${currentEnvironment}`);
  
        // Store the current environment preset
        document.body.setAttribute("current-environment", currentEnvironment);
  
        console.log(`Button clicked! Changing environment to: ${currentEnvironment}`);
  
        // Emit event to server
        socket.emit("changeEnvironment", currentEnvironment);
      });
  
      // Initialize with the first environment
      document.body.setAttribute("current-environment", environments[currentIndex]);
  
      // Listen for environment changes from server
      socket.on("updateEnvironment", function (newEnvironment) {
        console.log(`Received environment update from server: ${newEnvironment}`);
        envEntity.setAttribute("environment", `preset: ${newEnvironment}`);
        document.body.setAttribute("current-environment", newEnvironment);
      });
  
      // Check if socket is connected
      socket.on("connect", function () {
        console.log("Connected to WebSocket server with ID:", socket.id);
      });
  
      socket.on("disconnect", function () {
        console.log("Disconnected from WebSocket server.");
      });
    }
  });
  

// Add event listener to blue button to spawn a shape at a random position
const shapes = ["a-box", "a-cone", "a-cylinder", "a-sphere", "a-triangle"];
let currentShapeIndex = 0;

const blueButton = document.querySelector("#blue_button .button");
blueButton.addEventListener("click", function () {
  // Generate random position within specified ranges
  const randomX = Math.floor(Math.random() * 41) - 20;
  const randomY = Math.floor(Math.random() * 11);
  const randomZ = Math.floor(Math.random() * 41) - 20;

  // Determine the shape's color based on the environment
  let shapeColor;
  switch (currentEnvironment) { // Use the global variable instead
      case "starry":
          shapeColor = "black";
          break;
      case "forest":
          shapeColor = "red";
          break;
      case "yavapai":
          shapeColor = "green";
          break;
      case "arches":
          shapeColor = "yellow";
          break;
      case "contact":
          shapeColor = "white";
          break;
      default:
          shapeColor = "blue"; // Default color
  }

  // Select the shape from the shapes array
  const shape = document.createElement(shapes[currentShapeIndex]);
  shape.setAttribute("position", `${randomX} ${randomY} ${randomZ}`);
  shape.setAttribute("material", "color", shapeColor); // Corrected setting color
  shape.setAttribute("scale", "1 1 1");
  shape.setAttribute("circles-pickup-object", "pickupPosition: 0 1 -1; pickupScale: 0.5 0.5 0.5");
  //shape.setAttribute('circles-pickup-networked', `networkId:shape-${Date.now()}`);
  currentShapeIndex = (currentShapeIndex + 1) % shapes.length;

  // Add the shape to the scene
  document.querySelector("a-scene").appendChild(shape);
});

AFRAME.registerComponent("toggle-lighting", {
init: function () {
const sunLight = document.querySelector("#sunlight");
const yellowButton = document.querySelector("#yellow_button .button");

let isDay = true; // Start with day lighting

yellowButton.addEventListener("click", function () {
if (isDay) {
  // Switch to night lighting
  sunLight.setAttribute("light", "intensity", 0.1); // Dim light for night
} else {
  // Switch to day lighting
  sunLight.setAttribute("light", "intensity", 7); // Brighter light
}
isDay = !isDay; // Toggle state
});
}
});

// Attach component to the scene
document.querySelector("a-scene").setAttribute("toggle-lighting", "");


AFRAME.registerComponent("cycle-light-color", {
init: function () {
  const greenButton = document.querySelector("#green_button .button");
  const lightEntity = document.querySelector("#sunlight");

  // Define the seven colors for the light
  const colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];
  let colorIndex = 0;

  greenButton.addEventListener("click", function () {
      colorIndex = (colorIndex + 1) % colors.length;
      lightEntity.setAttribute("light", "color", colors[colorIndex]);
  });
}
});

// Attach the script to the green button
document.querySelector("#green_button").setAttribute("cycle-light-color", "");


AFRAME.registerComponent('change-music', {
    schema: {type: 'string'},  // The new music track ID

    init: function () {

  // Define songs
  const songs = ["#hybrid", "#breeze", "#eternity", "#peace", "#exploration"];
  let songIndex = 0;
  let bgMusic = document.querySelector('#bg-music');

      this.el.addEventListener('click', () => {
        
        songIndex= (songIndex + 1)% songs.length;
        bgMusic.setAttribute("circles-sound", "src", songs[songIndex] );
        console.log('red button clicked, playing: ' + songs[songIndex]);

        
        // bgMusic.setAttribute('src', `#${this.data}`);
        bgMusic.components.sound.stopSound();
        bgMusic.components.sound.playSound();
      });
    }
  });