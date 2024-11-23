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

// Initialization of drone data on the map
const drones = [
  { id: 'Drone 1', coords: [51.505, -0.09], status: 'Active' },
  { id: 'Drone 2', coords: [51.515, -0.1], status: 'Lost Connection' },
  { id: 'Drone 3', coords: [51.495, -0.08], status: 'Low Battery' },
];

const map = L.map('map').setView([51.505, -0.09], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

drones.forEach((drone) => {
  const marker = L.marker(drone.coords).addTo(map);
  marker.bindPopup(`<b>${drone.id}</b><br>Status: ${drone.status}`);
});

// Initialization of satellite maps
function initializeSatelliteMap(mapId) {
  const map = L.map(mapId).setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);
  return map;
}

const iris2Map = initializeSatelliteMap('map-iris2');
const galileoMap = initializeSatelliteMap('map-galileo');

// Markers and trajectories for satellites
function initializeSatellite(map, color) {
  const marker = L.circleMarker([0, 0], { color, radius: 8 }).addTo(map);
  const trajectory = L.polyline([], { color }).addTo(map);
  const data = { lat: 0, long: 0 };
  return { marker, trajectory, data };
}

const iris2 = initializeSatellite(iris2Map, 'yellow');
const galileo = initializeSatellite(galileoMap, 'blue');

// Function to update satellites
function updateSatellite({ map, marker, trajectory, data }, latId, longId, velocityId) {
  // Change coordinates
  data.lat += (Math.random() - 0.5) * 1; // Generate random displacement
  data.long += (Math.random() - 0.5) * 1;

  // Restrict coordinates
  data.lat = Math.max(-90, Math.min(90, data.lat));
  data.long = Math.max(-180, Math.min(180, data.long));

  // Add point to trajectory
  trajectory.addLatLng([data.lat, data.long]);

  // Update marker position
  marker.setLatLng([data.lat, data.long]);

  // Center the map (optional)
  map.panTo([data.lat, data.long]);

  // Update the interface
  document.getElementById(latId).textContent = data.lat.toFixed(6);
  document.getElementById(longId).textContent = data.long.toFixed(6);
  document.getElementById(velocityId).textContent = (Math.random() * 10 + 7).toFixed(2) + ' km/s'; // Simulated speed
}

// Update satellites every 2 seconds
setInterval(() => {
  updateSatellite(iris2, 'iris2-lat', 'iris2-long', 'iris2-velocity');
  updateSatellite(galileo, 'galileo-lat', 'galileo-long', 'galileo-velocity');
}, 2000);

// Event log
const events = [
  { time: 'T+00:00', message: 'System initialized successfully.', type: 'info' },
  { time: 'T+00:10', message: 'All drones active and ready.', type: 'info' },
  { time: 'T+00:20', message: 'Connection to IRIS2 established.', type: 'info' },
  { time: 'T+00:25', message: 'Mission standing by for operator command.', type: 'info' },
];

const eventLog = document.querySelector('.event-log');

function addEvent(event) {
  const li = document.createElement('li');
  li.classList.add(event.type);
  li.innerHTML = `<span class="time">${event.time}</span> ${event.message}`;
  eventLog.appendChild(li);
}

events.forEach(addEvent);

// Add a new event after 5 seconds
setTimeout(() => {
  addEvent({ time: 'T+00:30', message: 'System check completed. All systems go.', type: 'info' });
}, 5000);

// Initialization of network data
let lastCheckTime = 0; // Last check time in seconds
let nextScanTime = 30; // Timer until next scan (in seconds)
let activeConnections = 5; // Number of active connections
let threatLevel = 'Low'; // Threat level
let recoveries = 0; // Number of recoveries

// Getting HTML elements
const lastCheckEl = document.getElementById('last-check');
const nextScanEl = document.getElementById('next-scan');
const activeConnectionsEl = document.getElementById('active-connections');
const threatLevelEl = document.getElementById('threat-level');
const recoveriesEl = document.getElementById('recoveries');

// Function to update monitoring data
function updateNetworkMonitoring() {
  // Update last check time
  lastCheckTime += 10;
  const hours = Math.floor(lastCheckTime / 3600);
  const minutes = Math.floor((lastCheckTime % 3600) / 60);
  const seconds = lastCheckTime % 60;
  lastCheckEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Timer until next scan
  if (nextScanTime > 0) {
    nextScanTime--;
  } else {
    nextScanTime = 30; // Scanning occurs every 30 seconds
    // Simulate scan result
    if (Math.random() > 0.9) {
      threatLevel = 'High';
      threatLevelEl.dataset.level = 'high';
    } else if (Math.random() > 0.7) {
      threatLevel = 'Medium';
      threatLevelEl.dataset.level = 'medium';
    } else {
      threatLevel = 'Low';
      threatLevelEl.dataset.level = 'low';
    }

    // Simulate recovery
    if (Math.random() > 0.8) {
      recoveries++;
    }
  }
  nextScanEl.textContent = `${String(Math.floor(nextScanTime / 60)).padStart(2, '0')}:${String(nextScanTime % 60).padStart(2, '0')}`;

  // Update other parameters
  activeConnectionsEl.textContent = activeConnections;
  threatLevelEl.textContent = threatLevel;
  recoveriesEl.textContent = recoveries;
}

// Start updating monitoring data every 10 seconds
setInterval(updateNetworkMonitoring, 10000);

// List of local video files (optimized versions)
const videoSources = ["drone1-720p.mp4", "drone2-720p.mp4", "drone4-720p.mp4"];

// Control elements
const videoPlayer = document.getElementById("video-player");
const videoSource = document.getElementById("video-source");
const buttons = document.querySelectorAll(".video-controls button");

// Current video index
let currentVideoIndex = 0;

// Flag to prevent overloading
let isSwitching = false;

// Function to change video
function changeVideo(index) {
  if (isSwitching) return; // Prevent reloading

  isSwitching = true;

  currentVideoIndex = index; // Set current index
  videoSource.src = videoSources[currentVideoIndex]; // Update video source
  videoPlayer.load(); // Reload video
  videoPlayer.play(); // Play video

  // Remove flag after video loads
  videoPlayer.onloadeddata = () => {
    isSwitching = false;
  };
}

// Automatic video switching every 4 seconds
let autoSwitch = setInterval(() => {
  let nextIndex = (currentVideoIndex + 1) % videoSources.length;
  changeVideo(nextIndex);
}, 4000);

// Event handlers for manual source selection
buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    clearInterval(autoSwitch); // Stop automatic switching
    changeVideo(index); // Change to selected video
  });
})
