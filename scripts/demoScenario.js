// Demo scenario for Mercury
// This file controls the automatic playback of the demo
// Implementation for dashboard.js

// Scenario timestamps (in milliseconds)
const scenarioSteps = [
    { time: 1000, action: () => updateNetworkStatus(75, 12, 'AES-256') },
    { time: 2000, action: () => updateNetworkMonitoring('00:01:00', '00:29', 5, 'Low', 0) },
    { time: 3000, action: () => updateLatency(18, 1, 2, 0.5, 97) },
    { time: 4000, action: () => updatePacketQueue('FIFO', 150, 4, 25, 0) },
    { time: 5000, action: () => logEvent("📡 Signal disruption detected", "warning") },
    { time: 6000, action: () => updateSignal(35, "Low", "red") },
    { time: 7000, action: () => updateSatellites('IRIS2', '54.341579', '-1.435360', '255000m', '25500 km/h', 'Degraded') },
    { time: 8000, action: () => updateSatellites('Galileo', '55.123456', '-1.987654', '265000m', '26000 km/h', 'Active') },
    { time: 9000, action: () => updateOperationalDashboard("Warning", 5, 3, "00:45:12", "Link issues") },
    { time: 10000, action: () => updateDroneDetails("Alert", "Falcon: Armed", "Hawk: Holding", "Raven: Listening") },
    { time: 11000, action: () => updateSystemStatus("Threat Level: Medium", "Potential Hostiles Detected") },
    { time: 12000, action: () => {
        logEvent("⚠️ Switching to backup communication channel", "warning");
        updateCommChannel("Backup Channel", "orange");
    } },
    { time: 15000, action: () => updateSignal(70, "Medium", "orange") },
    { time: 18000, action: () => logEvent("🚨 Moving object detected in forested area", "critical") },
    { time: 20000, action: () => showDecisionDialogWithProtocols() },
    
];

let scenarioTimeouts = [];

function showAccessRequestDialog(teamName, onApprove) {
  const dialog = document.createElement("div");
  dialog.className = "access-request-dialog";

  dialog.innerHTML = `
    <div class="dialog-content">
      <h3 style="color: #ffffff;">Access Request</h3>
    <p style="margin-bottom: 15px;">The following unit requests full tactical access:</p>

    <div style="background-color: #222; padding: 12px; border-radius: 6px; margin-bottom: 20px;">
      <p><strong>Unit:</strong> Alpha Team (SFG)</p>
      <p><strong>Commander:</strong> Lt. Thomas Varga</p>
      <p><strong>Request ID:</strong> #OPS-329A</p>
      <p><strong>Clearance Level:</strong> TACTICAL / RED</p>
    </div>

    <div style="display: flex; justify-content: center; gap: 10px;">
      <button id="grant-access-btn" class="btn-primary">Grant Access</button>
      <button id="deny-access-btn" class="btn-danger">Deny</button>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById("grant-access-btn").addEventListener("click", () => {
    dialog.remove();
    if (typeof onApprove === "function") onApprove();
  });
}


function runPostDecisionSequence() {
  setTimeout(() => logEvent("🏛 ACOS Operations (MOD BE) has joined the incident command channel", "info"), 1000);
  setTimeout(() => logEvent("🌐 NATO Joint Task Force HQ is monitoring the threat feed", "info"), 3000);
  setTimeout(() => {
    showAccessRequestDialog("Alpha Team", () => {
      logEvent("✅ Access granted to Alpha Team", "info");

      setTimeout(() => logEvent("🚁 Air Unit Bravo connected to mission feed", "info"), 3000);

      setTimeout(() => {
        logEvent("💥 Target neutralized by Alpha Team", "critical");

        // Сome back to First list 
        clearInterval(autoSwitch);
        window.videoSources = [...window.initialVideoSources];
        currentVideoIndex = 0;
        bindVideoButtons(window.videoSources);
        startAutoSwitching(window.videoSources);
        changeVideo(currentVideoIndex);
      }, 4000);

      setTimeout(() => logEvent("🛡️ Zone secured. No secondary threats detected", "info"), 6000);
    });
  }, 5000);
}



function startDemoScenario() {
    resetScenario();
    const btn = document.getElementById("start-demo");
    if (btn) {
        btn.textContent = "Demo Running...";
        btn.style.backgroundColor = "#d9534f";
        btn.disabled = true;
    }
    scenarioSteps.forEach(step => {
        const timeout = setTimeout(step.action, step.time);
        scenarioTimeouts.push(timeout);
    });
}

function resetScenario() {
    scenarioTimeouts.forEach(clearTimeout);
    scenarioTimeouts = [];
}

function updateSignal(quality, label, color) {
    const el = document.getElementById("signal-quality");
    el.textContent = `Signal Quality: ${quality}%`;
    el.style.color = color;
}

function logEvent(message, level = "info") {
    const logList = document.querySelector(".event-log");
    if (!logList) return;
    const li = document.createElement("li");
    li.className = level;
    li.innerHTML = `<span class="time">T+${formatTime()}</span> ${message}`;
    logList.appendChild(li);
    logList.scrollTop = logList.scrollHeight;
}

function formatTime() {
    const now = new Date();
    return now.toLocaleTimeString();
}

function showDecisionDialogWithProtocols() {
  const dialog = document.createElement("div");
  dialog.className = "decision-dialog expanded";

  dialog.innerHTML = `
    <h3 style="color: #ff6666;">Threat Detected</h3>
    <video src="assets/videos/drone4.mp4" autoplay loop muted></video>
    <div class="threat-info" style="display: flex; gap: 30px;">
      <!-- Left: Object list with embedded radius selector -->
      <div style="flex: 1;">
        <p style="margin-bottom: 5px;">
          <strong>Objects within radius (km):</strong>
          <label for="radius" style="margin-left: 10px;"></label>
          <select id="radius" style="margin-left: 5px;">
            <option value="5">5</option>
            <option value="10" selected>10</option>
            <option value="20">20</option>
          </select>
        </p>

        <div style="margin-top: 10px; font-size: 14px; line-height: 1.6;">
          <div style="margin-bottom: 6px;"><strong>Critical Infrastructure</strong></div>
          <ul style="margin: 0 0 10px 15px; padding: 0;">
            <li>Military Factory — 4.2 km</li>
            <li>Power Plant — 6.8 km</li>
            <li>Water Intake Zone — 7.9 km</li>
            <li>Communication Hub — 9.1 km</li>
          </ul>

          <div style="margin-bottom: 6px;"><strong>Transportation Nodes</strong></div>
          <ul style="margin: 0 0 10px 15px; padding: 0;">
            <li>Highway N89 Exit — 2.1 km</li>
            <li>Transinne Rail Station — 4.5 km</li>
          </ul>

          <div style="margin-bottom: 6px;"><strong>Civilian Presence / Events</strong></div>
          <ul style="margin: 0 0 10px 15px; padding: 0;">
            <li>Public Market — 3.7 km</li>
            <li>Regional Fairgrounds — 5.2 km</li>
          </ul>
        </div>
      </div>

      <!-- Right: AI analysis -->
      <div style="flex: 1;">
        <p><strong>Intelligence Analysis (AI-Assisted):</strong></p>
        <div class="ai-analysis" style="background-color: #0d1117; padding: 10px; border-radius: 8px; border: 1px solid #30363d;">
          <p><strong>Assessment:</strong> Based on aggregated intel sources and real-time intercepts, this incident may represent a diversionary maneuver.</p>
          <p><strong>Probable primary targets:</strong></p>
          <ul>
            <li>Nuclear Facility (not visible, 18 km away)</li>
            <li>Hazardous Waste Storage (classified location)</li>
          </ul>
          <p><strong>Recommended Actions:</strong></p>
          <ul>
            <li>Notify CBRN Agency immediately</li>
            <li>Include all nuclear-related assets within extended perimeter</li>
          </ul>
        </div>
      </div>
    </div>

    <p><strong>Choose an action:</strong></p>
    <div class="action-buttons">
      <button id="observe-btn">Continue Observation</button>
      <button id="attack-btn">Engage (FALCON)</button>
      <select id="protocol-select">
        <option value="">Apply Protocol</option>
        <option value="shield">SHIELD</option>
        <option value="ghost">GHOST</option>
        <option value="falcon">FALCON</option>
        <option value="add">➕ Add Custom</option>
      </select>
    </div>

    <div class="notify-section" style="display: flex; gap: 30px;">
      <div style="flex: 1;">
        <p><strong>Notify (Military Forces):</strong></p>
        <ul class="notify-list">
          <li><input type="checkbox" checked>Quick Reaction Forces —
              <select>
                <option>Full Access</option>
                <option>Video + Coordinates</option>
                <option>Coordinates Only</option>
              </select> — QRF ETA: 4 min
          </li>
          <li><input type="checkbox">NATO Base —
              <select>
                <option>Full Access</option>
                <option>Video + Coordinates</option>
                <option>Coordinates Only</option>
              </select> — QRF ETA: 8 min
          </li>
          <li><input type="checkbox">Air Base —
              <select>
                <option>Full Access</option>
                <option>Video + Coordinates</option>
                <option>Coordinates Only</option>
              </select> — QRF ETA: 10 min
          </li>
          <li><input type="checkbox">Military Unit —
              <select>
                <option>Full Access</option>
                <option>Video + Coordinates</option>
                <option>Coordinates Only</option>
              </select> — QRF ETA: 6 min
          </li>
          <li><input type="checkbox">Police —
              <select>
                <option>Full Access</option>
                <option>Video + Coordinates</option>
                <option>Coordinates Only</option>
              </select> — QRF ETA: 10 min
          </li>
        </ul>
      </div>
      <div style="flex: 1;">
        <p><strong>Notify (Civil Authorities):</strong></p>
        <ul class="notify-list">
          <li><input type="checkbox"> 🏛 City Hall —
              <select>
                <option>General Notice</option>
              </select>
          </li>
          <li><input type="checkbox"> 🚑 Emergency Services —
              <select>
                <option>Coordinates Only</option>
              </select>
          </li>
          <li><input type="checkbox"> 🏥 Hospital —
              <select>
                <option>Coordinates Only</option>
              </select>
          </li>
          <li><input type="checkbox"> 🏫 School District —
              <select>
                <option>General Notice</option>
              </select>
          </li>
          <li><input type="checkbox"> ☣️ CBRN Agency —
              <select>
                <option>Coordinates Only</option>
              </select>
          </li>
        </ul>
        <div class="notify-actions" style="display: flex; justify-content: flex-end; margin-top: 15px;">
          <button id="dispatch-notifications" class="btn-primary">
            Dispatch Notifications
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(dialog);

  document.getElementById("observe-btn").addEventListener("click", () => chooseAction('observe'));
  document.getElementById("attack-btn").addEventListener("click", () => chooseAction('attack'));
  document.getElementById("protocol-select").addEventListener("change", (e) => chooseProtocol(e.target.value));
}

document.addEventListener("click", (e) => {
  if (e.target && e.target.id === "dispatch-notifications") {
    const selected = document.querySelectorAll('.notify-list input[type="checkbox"]:checked');
    const count = selected.length;

    if (count > 0) {
      logEvent(`🛰️ Notifications dispatched to ${count} recipients.`, "info");

      const btn = document.getElementById("dispatch-notifications");
      btn.textContent = "✅ Sent";
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = "🚀 Dispatch Notifications";
        btn.disabled = false;
      }, 3000);
    }
  }
});



function chooseProtocol(value) {
    if (!value) return;
    logEvent(`🧭 Protocol selected: ${value.toUpperCase()}`, "info");
}

function chooseAction(option) {
  // Remove dialog box and protocol
  const dialog = document.querySelector(".decision-dialog");
  if (dialog) dialog.remove();

  const protocol = document.querySelector(".protocol-list");
  if (protocol) protocol.remove();

  // Switch to tactical videos
  clearInterval(autoSwitch);
  window.videoSources = [...window.tacticalVideoSources];
  currentVideoIndex = 0;

  // Binding buttons to the new trio
  bindVideoButtons(window.videoSources);

  // Start autoshift
  startAutoSwitching(window.videoSources);

  // Show first video immediately
  changeVideo(currentVideoIndex);

  // Actions for the selected option
  if (option === 'observe') {
    logEvent("🔍 Decision: continue observation", "info");
    setTimeout(() => logEvent("🛰 Recon and area isolation activated", "info"), 3000);
    setTimeout(() => notifyUnits(), 7000);
  } else if (option === 'attack') {
    logEvent("⚔️ Decision: execute FALCON protocol", "warning");
    setTimeout(() => logEvent("📑 Executing FALCON protocol procedures...", "info"), 3000);
  }
   runPostDecisionSequence();
}


function notifyUnits() {
    logEvent("📡 Quick reaction forces notified: ETA 4 min.", "info");
    const timer = document.getElementById("next-update");
    if (timer) timer.textContent = "ETA: 04:00";
}

function updateCommChannel(label, color) {
    const el = document.getElementById("comm-channel");
    if (el) {
        el.textContent = `Comm Channel: ${label}`;
        el.style.color = color;
    }
}

function updateNetworkStatus(signal, dataRate, encryption) {
    document.getElementById("signal-quality").textContent = `Signal Quality: ${signal}%`;
    document.getElementById("data-rate").textContent = `Data Rate: ${dataRate} Mbps`;
    document.getElementById("encryption").textContent = `Encryption: ${encryption}`;
}

function updateNetworkMonitoring(lastCheck, nextScan, active, threat, recoveries) {
    document.getElementById("last-check").textContent = `Last Check: ${lastCheck}`;
    document.getElementById("next-scan").textContent = `Next Scan: ${nextScan}`;
    document.getElementById("active-connections").textContent = `Active Connections: ${active}`;
    document.getElementById("threat-level").textContent = `Threat Level: ${threat}`;
    document.getElementById("recoveries").textContent = `Recoveries: ${recoveries}`;
}

function updateLatency(avg, total, spikes, loss, recovery) {
    document.getElementById("average-latency").textContent = `Average Latency: ${avg} ms`;
    document.getElementById("total-errors").textContent = `Total Errors: ${total}`;
    document.getElementById("latency-spikes").textContent = `Latency Spikes: ${spikes}`;
    document.getElementById("packet-loss").textContent = `Packet Loss: ${loss}%`;
    document.getElementById("error-recovery").textContent = `Error Recovery: ${recovery}%`;
}

function updatePacketQueue(type, total, queue, avgLatency, txErrors) {
    document.getElementById("queue-type").textContent = `Active Queue Type: ${type}`;
    document.getElementById("total-packets").textContent = `Total Packets: ${total}`;
    document.getElementById("packets-in-queue").textContent = `Packets in Queue: ${queue}`;
    document.getElementById("queue-average-latency").textContent = `Average Latency: ${avgLatency} ms`;
    document.getElementById("transmission-errors").textContent = `Transmission Errors: ${txErrors}`;
}

function updateSatellites(system, lat, lng, alt, velocity, status) {
    const prefix = system === "IRIS2" ? "satellite" : "galileo";
    document.getElementById(`${prefix}-lat`).textContent = `Lat: ${lat}`;
    document.getElementById(`${prefix}-long`).textContent = `Long: ${lng}`;
    document.getElementById(`${prefix}-alt`).textContent = `Alt: ${alt}`;
    document.getElementById(`${prefix}-velocity`).textContent = `Velocity: ${velocity}`;
    document.getElementById(`${prefix}-status`).textContent = `Status: ${status}`;
}

function updateOperationalDashboard(status, connections, devices, duration, notes) {
    document.getElementById("system-status").textContent = status;
    document.getElementById("active-connections").textContent = connections;
    document.getElementById("engaged-devices").textContent = devices;
    document.getElementById("session-duration").textContent = duration;
    document.getElementById("notifications").textContent = notes;
}

function updateDroneDetails(groupStatus, falcon, hawk, raven) {
  const infoCards = document.querySelectorAll(".mini-card");
  if (!infoCards || infoCards.length < 2) {
    console.error("❌ Drone detail cards not found");
    return;
  }

  const generalInfoList = infoCards[0].querySelector("ul");
  const fleetList = infoCards[1].querySelectorAll("li");

  if (generalInfoList) {
    generalInfoList.innerHTML = `
      <li><strong>Group:</strong> Recon Team</li>
      <li><strong>Status:</strong> ${groupStatus}</li>
      <li><strong>Mode:</strong> Reconnaissance</li>
      <li><strong>Connection:</strong> IRIS2, Galileo</li>
    `;
  }

  document.getElementById("falcon-strike").textContent = falcon;
  document.getElementById("hawk-recon").textContent = hawk;
  document.getElementById("raven-commun").textContent = raven;
}

function updateSystemStatus(systemStatus, note) {
    document.getElementById("system-status").textContent = systemStatus;
    document.getElementById("notifications").textContent = note;
}

document.addEventListener("DOMContentLoaded", () => {
    const testBtn = document.getElementById("start-demo");
    if (testBtn) {
        testBtn.addEventListener("click", () => {
            console.log("✅ Demo scenario started");
            startDemoScenario();
        });
    } else {
        console.error("❌ Demo button not found.");
    }
});

