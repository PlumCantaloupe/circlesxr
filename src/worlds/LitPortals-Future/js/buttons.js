
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
const forestModels = [
    "#bush_flowers", "#bunny", "#bird", "#bush", "#deer",  "#fox" ];

const archesModels = [
    "#dolphin", "#fish", "#jelly_pink", "#jelly_blue", "#shark" ];

const contactModels = [
    "#building1Model", "#building2Model", "#building3Model", "#building4Model", 
    "#building5Model", "#building6Model", "#building7Model", "#building8Model" ];

const marsModels = [
    "#RED_rock1", "#RED_rock2", "#RED_rock3", "#mars", "#alien", "#robot" ];    

let currentContactIndex = 0;
let currentForestIndex = 0;
let currentArchesIndex = 0;
let currentMarsIndex = 0;

document.addEventListener("DOMContentLoaded", function () {
    const blueButton = document.querySelector("#blue_button .button");
    console.log("Blue button found:", blueButton);
    
    if (blueButton) {
        blueButton.addEventListener("click", function () {
            // Generate random position within specified ranges
            const randomX = Math.floor(Math.random() * 41) - 20;
            const randomY = 1;
            const randomZ = Math.floor(Math.random() * 41) - 20;
            
            if (currentEnvironment === "contact") {
                console.log("80s");
                const contactModel = contactModels[currentContactIndex];
                currentContactIndex = (currentContactIndex + 1) % contactModels.length;
                
                const contactId = `contactModel-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                socket.emit("spawnBuilding", {
                    contactId: contactId, 
                    model: contactModel,
                    position: `${randomX} ${randomY} ${randomZ}`
                });
            } else if (currentEnvironment === "forest") {
                console.log("forest");
                const forestModel = forestModels[currentForestIndex];
                currentForestIndex = (currentForestIndex + 1) % forestModels.length;
                
                const forestId = `forestModels-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                socket.emit("spawnModel", {
                    forestId: forestId, 
                    model: forestModel,
                    position: `${randomX} ${randomY} ${randomZ}`
                });

            } else if (currentEnvironment === "arches") {
                console.log("arches");
                const archesModel = archesModels[currentArchesIndex];
                currentArchesIndex = (currentArchesIndex + 1) % archesModels.length;
                
                const archesId = `archesModels-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                socket.emit("spawnModel", {
                    archesId: archesId, 
                    model: archesModel,
                    position: `${randomX} ${randomY} ${randomZ}`
                });
            } else if (currentEnvironment === "yavapai") {
                console.log("yavapai");
                const marsModel = marsModels[currentMarsIndex];
                currentMarsIndex = (currentMarsIndex + 1) % marsModels.length;
                
                const mardsId = `marsModels-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                socket.emit("spawnModel", {
                    mardsId: mardsId, 
                    model: marsModel,
                    position: `${randomX} ${randomY} ${randomZ}`
                });
            } 
        });
    }
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

let shapesArray = []; // Store references to all spawned shapes
let shapePositions = {}; // Store the positions of each shape

function updateShapePositions() {
    console.log("Checking spawned models...");

    shapesArray.forEach(id => {
        let shape = document.getElementById(id);
        if (shape) {
            let newPosition = shape.getAttribute("position");

            // Get the last known position
            let oldPosition = shapePositions[id];

            // If the position has changed, log a message
            if (!oldPosition || newPosition.x !== oldPosition.x || newPosition.y !== oldPosition.y || newPosition.z !== oldPosition.z) {
                console.log(`Model ID: ${id} has moved! New position:`, newPosition);

                socket.emit("modelMoved", { id, newPosition });

                // Update the stored position
                shapePositions[id] = { ...newPosition };
            }
        }
    });
    // Continue updating positions every 100ms
    setTimeout(() => requestAnimationFrame(updateShapePositions), 1000);
}
// Start the loop
setTimeout(() => requestAnimationFrame(updateShapePositions), 1000);

socket.on("spawnBuilding", function (buildingData) {
    const { contactId, model, position } = buildingData;
    
    const newBuilding = document.createElement("a-entity");
    newBuilding.setAttribute("id", contactId);
    newBuilding.setAttribute("gltf-model", model);
    newBuilding.setAttribute("position", position);
    
    const randomScale = (Math.random() * 20 + 10).toFixed(2);
    newBuilding.setAttribute("scale", `${randomScale} ${randomScale} ${randomScale}`);
    newBuilding.setAttribute("circles-pickup-object", "pickupPosition: 0 0 -10; pickupScale: 25 25 25");

    document.querySelector("a-scene").appendChild(newBuilding);
    
    // Store the ID of the spawned model
    shapesArray.push(contactId);
});

socket.on("spawnModel", function (shapeData) {
    const { forestId, model, position } = shapeData;

    const newShape = document.createElement("a-entity");
    newShape.setAttribute("id", forestId);
    newShape.setAttribute("gltf-model", model);
    newShape.setAttribute("position", position);

    const randomScale = (Math.random() * 2 + 2).toFixed(2);
    newShape.setAttribute("scale", `${randomScale} ${randomScale} ${randomScale}`);
    newShape.setAttribute("circles-pickup-object", "pickupPosition: 0 1 -3; pickupScale: 2 2 2");

    document.querySelector("a-scene").appendChild(newShape);
    
    // Store the ID of the spawned model
    shapesArray.push(forestId);
});


socket.on("modelMoved", function (data) {
    const { id, newPosition } = data;

    let shape = document.getElementById(id);
    if (shape) {
        // Assign the received position to the shape
        shape.setAttribute("position", `${newPosition.x} ${newPosition.y} ${newPosition.z}`);
        console.log(`Updated position for shape ${id} from server:`, newPosition);
    } else {
        console.log(`Shape with ID ${id} not found.`);
    }
});