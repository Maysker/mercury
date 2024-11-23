// Load custom drone icon from the assets folder
const droneIcon = L.icon({
  iconUrl: 'assets/drone-icon.png', // Relative path to the drone icon
  iconSize: [30, 30], // Adjust size as needed
  iconAnchor: [15, 15], // Anchor the icon to the center
  popupAnchor: [0, -15] // Position of the popup relative to the icon
});

// Initialization of mission data
let elapsedTime = 21 * 60; // Initial mission time in seconds (21 minutes)
let distance = 12.5; // Distance traveled in kilometers
let currentSpeed = 22; // Current speed in km/h
let batteryLeft = 95; // Remaining battery time in minutes
let nextUpdate = 60; // Time until next update in minutes

// Getting HTML elements
const elapsedTimeEl = document.getElementById('elapsed-time');
const distanceEl = document.getElementById('distance');
const speedEl = document.getElementById('current-speed');
const batteryLeftEl = document.getElementById('battery-left');
const nextUpdateEl = document.getElementById('next-update');

// Function to update mission data
function updateMissionData() {
  // Increment mission time
  elapsedTime++;
  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  // Update timer display
  elapsedTimeEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Update distance traveled
  distance += currentSpeed / 3600; // Increment based on current speed (in km/s)
  distanceEl.textContent = `${distance.toFixed(1)} KM`;

  // Update remaining battery time
  if (batteryLeft > 0) {
    batteryLeft -= 1 / 60; // Decrease battery time by 1 minute every 60 seconds
  }
  batteryLeftEl.textContent = `${Math.max(0, Math.round(batteryLeft))} MINS`;

  // Update time until next update
  if (nextUpdate > 0) {
    nextUpdate -= 1 / 60; // Decrease time until next update
  }
  nextUpdateEl.textContent = `${Math.max(0, Math.round(nextUpdate))} MINS`;
}

// Start updating data every second
setInterval(updateMissionData, 1000);

// Initialization of drone data
const drones = [
  { id: 'Drone 1', angle: 0, offset: 0.003, coords: [50.007, 5.22], status: 'Active', marker: null },
  { id: 'Drone 2', angle: 0, offset: 0.005, coords: [50.007, 5.22], status: 'Lost Connection', marker: null },
  { id: 'Drone 3', angle: 0, offset: 0.007, coords: [50.007, 5.22], status: 'Low Battery', marker: null },
];

// Patrol parameters
const patrolRadius = 0.01; // Approx. 1 km in latitude/longitude
const center = [50.007, 5.22]; // Center of the circular patrol

// Initialize map
const map = L.map('map').setView(center, 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

// Add markers for drones with the custom drone icon
drones.forEach(drone => {
  drone.marker = L.marker(drone.coords, { icon: droneIcon })  // Use the custom icon
    .addTo(map)
    .bindPopup(`${drone.id} - ${drone.status}`);
});

// Function to move drones in circular patrol with a small offset for group behavior
function moveDroneInCircle(drone) {
  drone.angle += 0.001; // Adjust speed of rotation
  if (drone.angle >= 2 * Math.PI) drone.angle = 0; // Reset angle after full circle

  // Calculate new coordinates with a very small offset for group appearance
  const lat = center[0] + patrolRadius * Math.sin(drone.angle) + drone.offset;
  const lng = center[1] + patrolRadius * Math.cos(drone.angle) + drone.offset;

  // Update drone position
  drone.marker.setLatLng([lat, lng]);
}

// Update drone positions smoothly every 100ms
setInterval(() => {
  drones.forEach(drone => moveDroneInCircle(drone));
}, 100); // Smooth animation
