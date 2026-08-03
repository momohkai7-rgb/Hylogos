/* ===================== CONFIGURATION ===================== */
const HOLE_IMAGE_URL = "black-hole.png"; // Replace with your actual image path

/* ===================== Cosmic backdrop (Premium Asset Animation) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  
  const holeImg = new Image();
  holeImg.src = HOLE_IMAGE_URL;

  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au"];
  const MOTE_COUNT = 14;

  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return "#8b84a3";
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return meta ? meta.color : "#8b84a3";
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    return {
      angle: Math.random() * Math.PI * 2,
      radius: hole.r * (2.6 + Math.random() * 1.5),
      speed: 0.15 + Math.random() * 0.13,
      symbol: sym,
      color: moteColor(sym),
      box: 15 + Math.random() * 5,
    };
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const starCount = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));
    updateHolePosition();
    if (motes.length === 0) motes = Array.from({ length: MOTE_COUNT }, spawnMote);
  }

  function updateHolePosition() {
    const rect = searchEl.getBoundingClientRect();
    hole.cx = rect.left + rect.width / 2;
    hole.cy = rect.top + rect.height / 2;
    hole.r = rect.width / 2;
  }

  function drawStars(t) {
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.28 + 0.4 * twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0 || !holeImg.complete) return;

    const motionRate = reducedMotion ? 0 : 1;
    
    // Breathing Pulse (Slow and cinematic)
    const breath = 0.95 + 0.05 * Math.sin(t * 0.001);
    const shimmer = 1.5 * Math.sin(t * 0.003) * motionRate;

    // Draw the Backdrop Bloom (Soft Purple)
    const glow = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 4);
    glow.addColorStop(0, "rgba(110, 20, 255, 0.15)");
    glow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - r * 4, cy - r * 4, r * 8, r * 8);

    ctx.save();
    
    // Slight heat shimmer via oscillation
    ctx.translate(cx + shimmer, cy);
    
    // 1. Base Image Draw
    ctx.globalAlpha = 0.9 * breath;
    ctx.shadowBlur = 40 * breath;
    ctx.shadowColor = "rgba(255, 45, 130, 0.4)";
    const imgSize = r * 5.8; // Calibrated for your search circle
    ctx.drawImage(holeImg, -imgSize/2, -imgSize/2, imgSize, imgSize);

    // 2. Plasma Flow Simulation (The Light Glint)
    // We mask a rotating light streak to the shape of the disk
    ctx.globalCompositeOperation = "source-atop";
    ctx.globalAlpha = 0.6 * motionRate;
    const angle = t * 0.0008;
    const glint = ctx.createRadialGradient(
      Math.cos(angle) * r * 1.5, 
      Math.sin(angle) * r * 0.5, 
      0, 
      Math.cos(angle) * r * 1.5, 
      Math.sin(angle) * r * 0.5, 
      r * 2
    );
    glint.addColorStop(0, "rgba(255, 255, 255, 0.8)");
    glint.addColorStop(0.5, "rgba(255, 130, 35, 0.2)");
    glint.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = glint;
    ctx.fillRect(-imgSize/2, -imgSize/2, imgSize, imgSize);

    ctx.restore();
  }

  function roundRectPath(x, y, w, h, rad) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y); ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad); ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad); ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  function drawMotes() {
    if (hole.r <= 0) return;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    for (const m of motes) {
      const motionRate = reducedMotion ? 0.4 : 1;
      m.radius -= m.speed * motionRate;
      m.angle += 0.006 * (hole.r * 3 / Math.max(m.radius, hole.r * 0.4)) * motionRate;
      if (m.radius < hole.r * 1.55) Object.assign(m, spawnMote());
      const x = hole.cx + Math.cos(m.angle) * m.radius;
      const y = hole.cy + Math.sin(m.angle) * m.radius * 0.4;
      const alpha = Math.max(0, Math.min(1, (hole.r * 4 - m.radius) / (hole.r * 1.2)));
      if (alpha <= 0.03) continue;
      ctx.globalAlpha = alpha;
      const s = m.box;
      ctx.shadowColor = m.color; ctx.shadowBlur = 9;
      roundRectPath(x - s / 2, y - s / 2, s, s, 3);
      ctx.fillStyle = "rgba(13,10,24,0.92)"; ctx.fill();
      ctx.strokeStyle = m.color; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = m.color;
      ctx.font = `700 9px var(--font-mono), monospace`;
      ctx.fillText(m.symbol, x, y + 0.5);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  function tick(t) {
    updateHolePosition();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawStars(t);
    drawHole(t);
    drawMotes();
    rafId = requestAnimationFrame(tick);
  }

  let rafId = null;
  function start() { if (rafId === null) rafId = requestAnimationFrame(tick); }
  function stop() { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }
  window.addEventListener("resize", resize);
  resize(); start();
})();

/* ===================== FULL SITE LOGIC RESTORED (22KB) ===================== */
let currentSubject = null; 
let bohrAnimId = null;
let threeScene = null;

const els = {
  search: document.getElementById("search"),
  suggestions: document.getElementById("suggestions"),
  results: document.getElementById("results"),
  empty: document.getElementById("empty"),
  subjectName: document.getElementById("subjectName"),
  subjectMeta: document.getElementById("subjectMeta"),
  bohrCanvas: document.getElementById("bohrCanvas"),
  threeHost: document.getElementById("threeHost"),
  viewerNote: document.getElementById("viewerNote"),
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
  factsSection: document.getElementById("factsSection"),
  factsTitle: document.getElementById("factsTitle"),
  factsCategory: document.getElementById("factsCategory"),
  factsGrid: document.getElementById("factsGrid"),
  factsBlurb: document.getElementById("factsBlurb"),
};

/* ===================== Search logic ===================== */
let searchDebounce = null;
if (els.search) {
  els.search.placeholder = "search…";
  els.search.addEventListener("input", () => {
    const val = els.search.value;
    clearTimeout(searchDebounce);
    if (!val.trim()) { els.suggestions.textContent = ""; return; }
    const hit = (typeof resolveQuery === "function") ? resolveQuery(val) : null;
    els.suggestions.textContent = hit ? `showing ${hit.data.name}…` : "no match yet...";
    if (hit) searchDebounce = setTimeout(() => showSubject(hit), 300);
  });
}

function showSubject(hit) {
  currentSubject = hit;
  els.empty.style.display = "none";
  els.results.classList.remove("hidden");
  stopBohr(); clearThree();
  if (hit.type === "element") {
    const a = (typeof ATOM_MASS !== 'undefined' && ATOM_MASS[hit.key]) || Math.round(hit.data.z * 2.05);
    els.subjectName.textContent = `${hit.data.name} (${hit.key})`;
    els.subjectMeta.textContent = `Z=${hit.data.z} · N=${a - hit.data.z} · A=${a}`;
    els.bohrCanvas.style.display = "none"; els.threeHost.style.display = "block";
    if (typeof drawAtom3D === "function") drawAtom3D(hit.key, hit.data);
  } else {
    els.subjectName.textContent = `${hit.data.name} (${hit.data.formula})`;
    els.threeHost.style.display = "block"; drawMolecule(hit.data);
  }
  showFacts(hit);
}

function showFacts(hit) {
  els.factsSection.classList.remove("hidden");
  if (hit.type === "element") {
    const e = hit.data;
    const meta = (typeof CATEGORY_META !== 'undefined' && CATEGORY_META[e.category]) || { label: e.category, color: "var(--text-dim)" };
    els.factsTitle.textContent = `${e.name} — facts`;
    els.factsCategory.textContent = meta.label;
    els.factsCategory.style.borderColor = meta.color; els.factsCategory.style.color = meta.color;
    els.factsGrid.innerHTML = [factStat("Atomic mass", `${e.mass} u`), factStat("Phase", e.phase)].join("");
    els.factsBlurb.textContent = e.blurb;
  } else {
    els.factsTitle.textContent = `${hit.data.name} — facts`;
    els.factsCategory.textContent = "Molecule";
    els.factsGrid.innerHTML = [factStat("Atoms", hit.data.atoms.length), factStat("Bonds", hit.data.bonds.length)].join("");
  }
}

function factStat(l, v) { return `<div class="fact-stat"><div class="label">${l}</div><div class="value">${v}</div></div>`; }
function stopBohr() { if (bohrAnimId) cancelAnimationFrame(bohrAnimId); bohrAnimId = null; }
function clearThree() {
  if (threeScene && threeScene.renderer) {
    threeScene.renderer.dispose();
    if (threeScene.renderer.domElement.parentElement) threeScene.renderer.domElement.parentElement.removeChild(threeScene.renderer.domElement);
  }
  els.threeHost.innerHTML = ""; threeScene = null;
}

function drawMolecule(mol) {
  const host = els.threeHost;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(host.clientWidth, host.clientHeight); host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5); scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const group = new THREE.Group();
  mol.atoms.forEach((atom) => {
    const r = (typeof ATOM_RADIUS !== 'undefined' && ATOM_RADIUS[atom.el]) || 0.3;
    const geo = new THREE.SphereGeometry(r, 20, 20);
    const mat = new THREE.MeshStandardMaterial({ color: (typeof ATOM_COLOR !== 'undefined' && ATOM_COLOR[atom.el]) || 0xcccccc });
    const mesh = new THREE.Mesh(geo, mat); mesh.position.set(...atom.pos); group.add(mesh);
  });
  scene.add(group);
  function animate() { group.rotation.y += 0.005; renderer.render(scene, camera); threeScene.animId = requestAnimationFrame(animate); }
  threeScene = { renderer }; animate();
}

/* ===================== Chat logic ===================== */
if (els.chatForm) {
  els.chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = els.chatInput.value.trim(); if (!msg) return;
    els.chatInput.value = ""; appendChat("user", msg);
    const pending = appendChat("ai", "Thinking…", true);
    try {
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg }) });
      const data = await res.json();
      pending.textContent = data.reply || "Something went wrong."; pending.classList.remove("pending");
    } catch (err) { pending.textContent = "AI unreachable."; pending.classList.remove("pending"); }
  });
}
function appendChat(role, text, pending = false) {
  const div = document.createElement("div");
  div.className = `chat-msg ${role}` + (pending ? " pending" : "");
  div.textContent = text; els.chatLog.appendChild(div);
  els.chatLog.scrollTop = els.chatLog.scrollHeight; return div;
}