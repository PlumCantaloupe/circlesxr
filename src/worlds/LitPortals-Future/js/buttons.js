
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
    "#bush_flowers", "#bunny", "#bird", "#bush", "#deer"
];

const archesModels = [
    "#dolphin", "#fish", "#fox", "#jelly_pink", "#jelly_blue"
];

const buildings = [
    "#building1Model", "#building2Model", "#building3Model", "#building4Model", 
    "#building5Model", "#building6Model", "#building7Model", "#building8Model"
];

let currentBuildingIndex = 0;
let currentForestIndex = 0;
let currentShapeIndex = 0; // 🔹 Added this

document.addEventListener("DOMContentLoaded", function () {
    const blueButton = document.querySelector("#blue_button .button");
    console.log("Blue button found:", blueButton);
    
    if (blueButton) {
        blueButton.addEventListener("click", function () {
            // Generate random position within specified ranges
            const randomX = Math.floor(Math.random() * 41) - 20;
            const randomY = 0;
            const randomZ = Math.floor(Math.random() * 41) - 20;
            
            if (currentEnvironment === "contact") {
                console.log("Mars");
                const buildingModel = buildings[currentBuildingIndex];
                currentBuildingIndex = (currentBuildingIndex + 1) % buildings.length;
                
                const buildingId = `building-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

                socket.emit("spawnBuilding", {
                    buildingId: buildingId, 
                    model: buildingModel,
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
            } else {
                let modelArray;
                console.log('HERE ');

                switch (currentEnvironment) {
                    
                    case "arches": 
                        modelArray = archesModels; 
                        break;
                    default: 
                        modelArray = shapes || []; // Ensure it is always defined
                        break;
                }
                // Prevent errors if modelArray is empty
                if (modelArray.length === 0) {
                    console.warn("No models available for environment:", currentEnvironment);
                    return;
                }

                const model = modelArray[currentShapeIndex];
                const modelId = model.startsWith("#") ? model.substring(1) : model; // Remove '#'
                
                socket.emit("spawnShape", {
                    shapeId: `shape-${Date.now()}-${Math.floor(Math.random() * 1000)}`,  
                    shape: modelId,  // Now it correctly removes '#'
                    position: `${randomX} ${randomY} ${randomZ}`
                });

                currentShapeIndex = (currentShapeIndex + 1) % modelArray.length; // 🔹 Added this
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
let oldPosition = { x: 0, y: 0, z: 0 }; // Default initial value

function updateShapePositions() {
    for (let shape of shapesArray) {
        const shapeId = shape.getAttribute("id");
        const newPosition = shape.getAttribute("position");

        if (!newPosition) continue; // Ensure newPosition is valid

        // Convert newPosition to an object
        const newPosObj = {
            x: parseFloat(newPosition.x) || 0,
            y: parseFloat(newPosition.y) || 0,
            z: parseFloat(newPosition.z) || 0
        };

        // Retrieve the previously stored position
        const oldPosition = shapePositions[shapeId];

        // Ensure oldPosition exists, otherwise initialize it
        if (!oldPosition) {
            shapePositions[shapeId] = newPosObj;
            continue;
        }

        // Only emit if the position has actually changed
        if (oldPosition.x !== newPosObj.x || oldPosition.y !== newPosObj.y || oldPosition.z !== newPosObj.z) {
            shapePositions[shapeId] = newPosObj;
            console.log("New Position:", newPosObj);

            // Emit only when movement is detected
            socket.emit("updateShapePosition", { shapeId, position: newPosObj });
        }
    }

    // Use a small delay to prevent excessive calls
    setTimeout(() => requestAnimationFrame(updateShapePositions), 100);
}

// Start the loop with a delay
setTimeout(() => requestAnimationFrame(updateShapePositions), 100);

// Listen for shape spawn event from server
socket.on("spawnShape", function (shapeData) {
    const { shapeId, shape, position, color } = shapeData;  
    // Create the shape element based on the received data
    const newShape = document.createElement(shape);
    newShape.setAttribute("id", shapeId); 
    newShape.setAttribute("position", position);
    newShape.setAttribute("material", "color", color);
    newShape.setAttribute("scale", "1 1 1");
    newShape.setAttribute("circles-pickup-object", "pickupPosition: 0 1 -1; pickupScale: 0.5 0.5 0.5");

    // Add the shape to the scene
    document.querySelector("a-scene").appendChild(newShape);

    // Add the shape to the shapes array for tracking
    shapesArray.push(newShape);

    // Store the initial position of the shape
    shapePositions[shapeId] = position;
});

socket.on("spawnBuilding", function (buildingData) {
    const { buildingId, model, position } = buildingData;
    
    // Create an entity for the building
    const newBuilding = document.createElement("a-entity");
    newBuilding.setAttribute("id", buildingId);
    newBuilding.setAttribute("gltf-model", model);
    newBuilding.setAttribute("position", position);
    const randomScale = (Math.random() * 20 + 10).toFixed(2);
    newBuilding.setAttribute("scale", `${randomScale} ${randomScale} ${randomScale}`);
    newBuilding.setAttribute("circles-pickup-object", "pickupPosition: 0 0 -10; pickupScale: 25 25 25");
    
    // Add the building to the scene
    document.querySelector("a-scene").appendChild(newBuilding);
});

socket.on("spawnModel", function (buildingData) {
    const { buildingId, model, position } = buildingData;
    
    // Create an entity for the building
    const newBuilding = document.createElement("a-entity");
    newBuilding.setAttribute("id", buildingId);
    newBuilding.setAttribute("gltf-model", model);
    newBuilding.setAttribute("position", position);
    const randomScale = (Math.random() * 2 + 2).toFixed(2);
    newBuilding.setAttribute("scale", `${randomScale} ${randomScale} ${randomScale}`);
    newBuilding.setAttribute("circles-pickup-object", "pickupPosition: 0 0 -3; pickupScale: 4 4 4");
    
    // Add the building to the scene
    document.querySelector("a-scene").appendChild(newBuilding);
});

// Listen for updates from the server and update shape positions
socket.on("updateShapePosition", function (data) {
    const { shapeId, position } = data;
    const shape = document.getElementById(shapeId);

    if (shape) {
        shape.setAttribute("position", position);
    }
});