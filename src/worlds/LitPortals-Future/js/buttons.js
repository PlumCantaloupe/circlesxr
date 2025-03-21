
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
        document.body.setAttribute("current-environment", currentEnvironment);
        console.log(`Button clicked! Changing environment to: ${currentEnvironment}`);
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
    }
});
    
const shapes = ["a-box", "a-cone", "a-cylinder", "a-sphere", "a-triangle"];
let currentShapeIndex = 0;
        
// Add event listener for the blue button to spawn a shape
document.addEventListener("DOMContentLoaded", function () {
    const blueButton = document.querySelector("#blue_button .button");
    console.log("Blue button found:", blueButton);
        
    if (blueButton) {
        blueButton.addEventListener("click", function () {
            // Generate random position within specified ranges
            const randomX = Math.floor(Math.random() * 41) - 20;
            const randomY = Math.floor(Math.random() * 11);
            const randomZ = Math.floor(Math.random() * 41) - 20;
        
            // Determine the shape's color based on the environment
            let shapeColor;
            switch (currentEnvironment) { // Use the global variable
                case "starry": shapeColor = "black"; break;
                case "forest": shapeColor = "red"; break;
                case "yavapai": shapeColor = "green"; break;
                case "arches": shapeColor = "yellow"; break;
                case "contact":shapeColor = "white"; break;
                default: shapeColor = "blue"; // Default color
            }
        
            // Select the shape from the shapes array
            const shape = shapes[currentShapeIndex];
            currentShapeIndex = (currentShapeIndex + 1) % shapes.length;

            // Emit spawnShape event with shape data to server
            socket.emit("spawnShape", {
                shape: shape,
                position: `${randomX} ${randomY} ${randomZ}`,
                color: shapeColor
            });
        });
    }
});
socket.on("spawnShape", function (shapeData) {
    const { shape, position, color } = shapeData;  
    // Create the shape element based on the received data
    const newShape = document.createElement(shape);
    newShape.setAttribute("position", position);
    newShape.setAttribute("material", "color", color);
    newShape.setAttribute("scale", "1 1 1");
    newShape.setAttribute("circles-pickup-object", "pickupPosition: 0 1 -1; pickupScale: 0.5 0.5 0.5");
        
    document.querySelector("a-scene").appendChild(newShape);
});
        
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");
    
    const yellowButton = document.querySelector("#yellow_button .button");
    console.log("Yellow button found:", yellowButton);

    console.log("Test");  // This should be inside the DOMContentLoaded

    AFRAME.registerComponent("toggle-lighting", {
        init: function () {
            console.log("Test2");  // This should be inside component initialization

            const yellowButton = document.querySelector("#yellow_button .button");
            const sunLight = document.querySelector("#sunlight");
            let lightState = 0; // Start with state 0, which could represent "day" or a specific intensity.

            if (yellowButton) {
                yellowButton.addEventListener("click", () => {
                    console.log("Current lightState: ", lightState); // Debugging line
                    switch (lightState) {
                        case 0:
                            sunLight.setAttribute("light", "intensity", 0.1); // Dim light for night
                            console.log("Night light");
                            break;
                        case 1:
                            sunLight.setAttribute("light", "intensity", 2); // Slightly dim light
                            console.log("Dawn light");
                            break;
                        case 2:
                            sunLight.setAttribute("light", "intensity", 5); // Neutral light
                            console.log("Midday light");
                            break;
                        case 3:
                            sunLight.setAttribute("light", "intensity", 7); // Bright light for day
                            console.log("Bright Day light");
                            break;
                        case 4:
                            sunLight.setAttribute("light", "intensity", 10); // Very bright light
                            console.log("Extreme light");
                            break;
                        default:
                            console.log("Unknown light state");
                            break;
                    }
                
                    lightState = (lightState + 1) % 5; // Update state and loop back
                    socket.emit("changeLightState", lightState);
                });                
            }
        }
    });

    // Attach component to the scene
    document.querySelector("a-scene").setAttribute("toggle-lighting", "");
});
socket.on("updateLightState", (newLightState) => {
    console.log("Received new light state: ", newLightState); // Debugging line
    const sunLight = document.querySelector("#sunlight");

    switch (newLightState) {
        case 0: 
            sunLight.setAttribute("light", "intensity", 0.1); // Dim light for night
            break;
        case 1: 
            sunLight.setAttribute("light", "intensity", 2); // Slightly dim light
            break;
        case 2: 
            sunLight.setAttribute("light", "intensity", 5); // Neutral light
            break;
        case 3: 
            sunLight.setAttribute("light", "intensity", 7); // Bright light for day
            break;
        case 4: 
            sunLight.setAttribute("light", "intensity", 10); // Very bright light
            break;
        default: 
            console.log("Unknown light state");
            break;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded.");

    const greenButton = document.querySelector("#green_button .button");
    const lightEntity = document.querySelector("#sunlight");

    if (!greenButton || !lightEntity) {
        console.error("Green button or sunlight entity not found!");
        return;
    }else{
        console.log("hi there");
    }

    AFRAME.registerComponent("cycle-light-color", {
        init: function () {
            console.log("got in function");

            const colors = ["#FF0000", "#FF7F00", "#FFFF00", "#00FF00", "#0000FF", "#4B0082", "#9400D3"];
            let colorIndex = 0;

            greenButton.addEventListener("click", function () {
                colorIndex = (colorIndex + 1) % colors.length;
                console.log("Changing light color to:", colors[colorIndex]);

                // Update light color locally
                lightEntity.setAttribute("light", "color", colors[colorIndex]);

                // Emit event to server
                socket.emit("changeLightColor", { color: colors[colorIndex] });
            });

            // Listen for updates from server
            socket.on("updateLightColor", function (data) {
                console.log("Received color update:", data.color);
                lightEntity.setAttribute("light", "color", data.color);
            });
        }
    });

    // Attach the component
    document.querySelector("#green_button").setAttribute("cycle-light-color", "");
});


// Attach the script to the green button

document.addEventListener("DOMContentLoaded", function () {

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
});