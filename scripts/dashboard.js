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

window.initialVideoSources = [
  "assets/videos/drone1.mp4",
  "assets/videos/drone2.mp4",
  "assets/videos/drone3.mp4"
];

window.tacticalVideoSources = [
  "assets/videos/drone4.mp4",
  "assets/videos/drone5.mp4",
  "assets/videos/drone6.mp4"
];


window.videoSources = [...window.initialVideoSources];

const videoPlayer = document.getElementById("video-player");
const videoSource = document.getElementById("video-source");
const buttons = document.querySelectorAll(".video-controls button");

let currentVideoIndex = 0;
let isSwitching = false;
let autoSwitch = null;


function changeVideo(index) {
  if (isSwitching) return;

  isSwitching = true;
  videoPlayer.style.visibility = "hidden";

  currentVideoIndex = index;
  videoSource.src = window.videoSources[currentVideoIndex];
  videoPlayer.load();

  videoPlayer.oncanplay = () => {
    videoPlayer.style.visibility = "visible";
    videoPlayer.play();
    isSwitching = false;
  };
}


function changeVideoByPath(path) {
  if (isSwitching) return;

  isSwitching = true;
  videoPlayer.style.visibility = "hidden";

  videoSource.src = path;
  videoPlayer.load();

  videoPlayer.oncanplay = () => {
    videoPlayer.style.visibility = "visible";
    videoPlayer.play();
    isSwitching = false;
  };
}


function bindVideoButtons(sourceArray) {
  buttons.forEach((button, index) => {
    button.onclick = () => {
      clearInterval(autoSwitch);
      currentVideoIndex = index;
      const selectedPath = sourceArray[index];
      if (selectedPath) {
        changeVideoByPath(selectedPath);
      } else {
        console.warn(`No video for Source ${index + 1}`);
      }
    };
  });
}


function startAutoSwitching(sourceArray) {
  clearInterval(autoSwitch);
  autoSwitch = setInterval(() => {
    currentVideoIndex = (currentVideoIndex + 1) % sourceArray.length;
    changeVideoByPath(sourceArray[currentVideoIndex]);
  }, 4000);
}


bindVideoButtons(window.videoSources);
startAutoSwitching(window.videoSources);


document.getElementById('start-demo')?.addEventListener('click', () => {
  if (typeof runDemoScenario === 'function') {
    runDemoScenario();
  } else {
    console.warn('Demo scenario not available.');
  }
});

function openFullscreenVideo() {
  const modal = document.createElement("div");
  modal.id = "video-modal";
  modal.style.position = "fixed";
  modal.style.top = "0";
  modal.style.left = "0";
  modal.style.width = "100vw";
  modal.style.height = "100vh";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
  modal.style.zIndex = "9999";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";
  modal.style.justifyContent = "center";

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✖";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "20px";
  closeBtn.style.right = "30px";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.color = "white";
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = () => document.body.removeChild(modal);

  const fullscreenVideo = document.createElement("video");
  fullscreenVideo.src = videoSource.src;
  fullscreenVideo.autoplay = true;
  fullscreenVideo.loop = true;
  fullscreenVideo.muted = true;
  fullscreenVideo.style.maxWidth = "90vw";
  fullscreenVideo.style.maxHeight = "80vh";
  fullscreenVideo.style.objectFit = "contain";
  fullscreenVideo.style.borderRadius = "12px";

  const buttonBar = document.createElement("div");
  buttonBar.style.display = "flex";
  buttonBar.style.gap = "10px";
  buttonBar.style.marginTop = "15px";

  const sourceNames = ["Source 1", "Source 2", "Source 3"];
  const activeSet = window.videoSources || window.tacticalVideoSources;

  sourceNames.forEach((label, index) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.style.padding = "6px 12px";
    btn.style.fontSize = "14px";
    btn.style.background = "#007bff";
    btn.style.color = "#fff";
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";

    btn.onclick = () => {
      const path = activeSet[index];
      if (path) {
        fullscreenVideo.src = path;
        fullscreenVideo.load();
        fullscreenVideo.play();
      }
    };

    buttonBar.appendChild(btn);
  });

  modal.appendChild(closeBtn);
  modal.appendChild(fullscreenVideo);
  modal.appendChild(buttonBar);
  document.body.appendChild(modal);
}


videoPlayer.addEventListener("click", openFullscreenVideo);
