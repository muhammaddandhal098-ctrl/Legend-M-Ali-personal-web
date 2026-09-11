document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("projectsGrid")) loadProjects();
  checkNotice();
});

// 1. Fetch & Display Projects from Vercel API
async function loadProjects() {
  try {
    const res = await fetch('/api/projects');
    const projects = await res.json();
    const grid = document.getElementById("projectsGrid");
    grid.innerHTML = "";

    projects.forEach(p => {
      grid.innerHTML += `
        <div style="background:rgba(15,23,42,0.6); padding:1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.1)">
          <span style="color:#38bdf8; font-size:0.75rem; font-weight:bold; text-transform:uppercase;">[${p.category}]</span>
          <h3 style="margin-top:0.3rem; margin-bottom:0.4rem;">${p.title}</h3>
          <p style="color:#94a3b8; font-size:0.85rem;">${p.description}</p>
        </div>
      `;
    });
  } catch (e) {
    console.error("Error loading projects:", e);
  }
}

// 2. Add New Project
async function saveProject(e) {
  e.preventDefault();
  const title = document.getElementById("pTitle").value;
  const category = document.getElementById("pCategory").value;
  const description = document.getElementById("pDesc").value;

  const res = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, category, description })
  });

  if (res.ok) {
    document.getElementById("pTitle").value = "";
    document.getElementById("pCategory").value = "";
    document.getElementById("pDesc").value = "";
    loadProjects();
    alert("Project saved successfully!");
  }
}

// 3. Push Notifications System
function requestNotification() {
  if ('Notification' in window) {
    Notification.requestPermission().then(p => {
      if (p === 'granted') {
        new Notification("Legend M Ali Hub", {
          body: "System alerts and background notifications are active!"
        });
      } else {
        alert("Notification permission denied.");
      }
    });
  }
}

// 4. Voice Recorder Setup
let mediaRecorder, audioChunks = [];
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/mp3' });
      document.getElementById("audioPlayback").src = URL.createObjectURL(audioBlob);
    };
    mediaRecorder.start();
    document.getElementById("startRecBtn").disabled = true;
    document.getElementById("stopRecBtn").disabled = false;
  } catch (err) {
    alert("Microphone access denied or not supported.");
  }
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
    document.getElementById("startRecBtn").disabled = false;
    document.getElementById("stopRecBtn").disabled = true;
  }
}

// 5. Check Server Broadcast Notice
async function checkNotice() {
  try {
    const res = await fetch('/api/notice');
    const data = await res.json();
    if (data && data.message) {
      document.getElementById("notice-text").innerText = data.message;
      document.getElementById("notice-card").style.display = "block";
    }
  } catch (e) {}
}
