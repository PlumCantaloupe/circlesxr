const socket = io(); // Connect to WebSocket server
console.log("Socket connected:", socket.id);

// Function to emit fire toggle event
function toggleFire() {
    console.log("Fire toggle button clicked");

    socket.emit('fireToggled', { room: "main", state: true });
    console.log("Emitted 'fireToggled' event to server");
}

// Listen for fire updates from the server
socket.on('fireToggled', (data) => {
    console.log("Received 'fireToggled' event from server:", data);

    const fireRig = document.getElementById('fireRig');
    const fireSound = document.getElementById('fireParticlesSound');

    if (fireRig && fireSound) {
        fireRig.setAttribute('visible', 'true');
        console.log("Fire rig set to visible from server event");

        fireSound.components.sound.playSound();
        console.log("Fire sound played from server event");
    } else {
        console.error("Fire rig or sound element not found on event trigger");
    }
});
