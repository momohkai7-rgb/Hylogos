/* ===================== Cosmic backdrop (Exact High-Fidelity Black Hole) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const VOID_RGB = "4, 2, 12"; // Deep space black

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au"];
  const MOTE_COUNT = 14;

  // Exact Palette from the reference image
  const COLORS = {
    WHITE: "255, 255, 255",
    CORE: "255, 235, 100",
    ORANGE: "255, 130, 30",
    PINK: "255, 40, 150",
    MAGENTA: "200, 20, 230",
    PURPLE: "80, 10, 160",
    GLOW: "140, 40, 255"
  };

  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return "#8b84a3";
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return meta ? meta.color : "#8b84a3";
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    const baseR = hole.r > 0 ? hole.r : 60;
    return {
      angle: Math.random() * Math.PI * 2,
      radius: baseR * (2.8 + Math.random() * 1.5),
      speed: 0.12 + Math.random() * 0.1,
      symbol: sym,
      color: moteColor(sym),
      box: 15 + Math.random() * 5,
    };
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const starCount = Math.floor((canvas.width * canvas.height) / 10000);
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.1 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.005,
    }));
    updateHolePosition();
    if (motes.length === 0) motes = Array.from({ length: MOTE_COUNT }, spawnMote);
  }

  function updateHolePosition() {
    if (!searchEl) return;
    const rect = searchEl.getBoundingClientRect();
    hole.cx = rect.left + rect.width / 2 || window.innerWidth / 2;
    hole.cy = rect.top + rect.height / 2 || window.innerHeight / 2;
    hole.r = rect.width / 2 || 70;
  }

  const DISK_TILT = -0.42; 

  /**
   * The Warp Function: Simulates gravitational lensing.
   * As particles go "behind" the hole, they are pulled upward or downward
   * to create the wrap-around effect seen in the reference.
   */
  function getWarpedPoint(angle, dist, t) {
    const squash = 0.32;
    const lensingStrength = 0.85;
    
    let x = Math.cos(angle) * dist;
    let y = Math.sin(angle) * dist * squash;

    // Gravitational lensing logic: pull points toward the poles when they are behind
    const isBehind = Math.sin(angle) < 0;
    if (isBehind) {
      const pull = Math.pow(Math.abs(Math.sin(angle)), 1.2) * (hole.r * lensingStrength);
      y -= pull; // Warps the back of the disk upward
    }

    // Add organic turbulence
    const noise = Math.sin(angle * 6 + t * 0.002) * (dist * 0.03);
    x += Math.cos(angle) * noise;
    y += Math.sin(angle) * noise;

    // Rotate the entire coordinate system by DISK_TILT
    const cosT = Math.cos(DISK_TILT), sinT = Math.sin(DISK_TILT);
    return {
      x: hole.cx + (x * cosT - y * sinT),
      y: hole.cy + (x * sinT + y * cosT),
      isFar: isBehind
    };
  }

  function drawDisk(t, isFarLayer) {
    const segments = 240;
    const ringSteps = 6;
    
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (let j = 0; j < ringSteps; j++) {
      const rInner = hole.r * (0.95 + j * 0.2);
      const rOuter = rInner + (hole.r * 0.4);
      const alpha = 0.15 - (j * 0.02);
      
      // Determine color based on distance from hole
      let color = COLORS.MAGENTA;
      if (j === 0) color = COLORS.WHITE;
      else if (j === 1) color = COLORS.CORE;
      else if (j === 2) color = COLORS.ORANGE;
      else if (j === 3) color = COLORS.PINK;

      ctx.beginPath();
      for (let i = 0; i <= segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        const p = getWarpedPoint(a, rOuter, t);
        
        // Only draw the requested depth layer
        if (p.isFar !== isFarLayer) {
            ctx.moveTo(p.x, p.y);
            continue;
        }
        
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }

      ctx.strokeStyle = `rgba(${color}, ${alpha})`;
      ctx.lineWidth = hole.r * 0.4;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    ctx.restore();
  }

  // High speed plasma streaks
  const STREAKS = Array.from({ length: 50 }, () => ({
    angle: Math.random() * Math.PI * 2,
    dist: 1.1 + Math.random() * 2.5,
    speed: 0.003 + Math.random() * 0.008,
    size: 1 + Math.random() * 3,
    color: Math.random() > 0.5 ? COLORS.WHITE : COLORS.ORANGE
  }));

  function drawPlasma(t, isFarLayer) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    STREAKS.forEach(s => {
      const a = s.angle + t * s.speed;
      const p = getWarpedPoint(a, hole.r * s.dist, t);
      if (p.isFar !== isFarLayer) return;

      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, s.size * 4);
      grad.addColorStop(0, `rgba(${s.color}, 0.8)`);
      grad.addColorStop(1, `rgba(${COLORS.PURPLE}, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, s.size * 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    const time = reducedMotion ? t * 0.2 : t;

    // 1. Wide Background Bloom
    const bloom = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 6);
    bloom.addColorStop(0, `rgba(${COLORS.MAGENTA}, 0.12)`);
    bloom.addColorStop(0.5, `rgba(${COLORS.PURPLE}, 0.04)`);
    bloom.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Far Side Disk (Background)
    drawDisk(time, true);
    drawPlasma(time, true);

    // 3. Central Void (The Shadow)
    // Photon ring edge (bright white circle)
    ctx.shadowBlur = 15;
    ctx.shadowColor = `rgba(${COLORS.WHITE}, 0.8)`;
    ctx.fillStyle = `rgb(${VOID_RGB})`;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 4. Near Side Disk (Foreground - wraps over the void)
    drawDisk(time, false);
    drawPlasma(time, false);

    // 5. Polar Energy Pulse
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(DISK_TILT);
    ctx.globalCompositeOperation = "lighter";
    const jet = ctx.createLinearGradient(0, -r, 0, -r * 4);
    jet.addColorStop(0, `rgba(${COLORS.WHITE}, 0.2)`);
    jet.addColorStop(1, `rgba(${COLORS.GLOW}, 0)`);
    ctx.fillStyle = jet;
    for(let d of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-r * 0.1, 0); ctx.lineTo(r * 0.1, 0); ctx.lineTo(0, d * r * 4);
        ctx.fill();
    }
    ctx.restore();
  }

  function roundRectPath(x, y, w, h, rad) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad);
    ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y);
    ctx.closePath();
  }

  function drawMotes() {
    if (hole.r <= 0) return;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const m of motes) {
      const motionRate = reducedMotion ? 0.4 : 1;
      const pull = 1 + (hole.r * 2.2 - m.radius) / (hole.r * 4);
      m.radius -= m.speed * Math.max(pull, 0.3) * motionRate;
      m.angle += 0.006 * (hole.r * 3 / Math.max(m.radius, hole.r * 0.4)) * motionRate;
      if (m.radius < hole.r * 1.55) Object.assign(m, spawnMote());
      const x = hole.cx + Math.cos(m.angle) * m.radius;
      const y = hole.cy + Math.sin(m.angle) * m.radius * 0.4;
      const alpha = Math.max(0, Math.min(1, (hole.r * 4 - m.radius) / (hole.r * 1.2)));
      if (alpha <= 0.03) continue;

      ctx.globalAlpha = alpha;
      const s = m.box;
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 9;
      roundRectPath(x - s / 2, y - s / 2, s, s, 3);
      ctx.fillStyle = "rgba(13,10,24,0.92)";
      ctx.fill();
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.shadowBlur = 12;
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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  window.addEventListener("resize", resize);
  resize();
  start();
})();

/* ===================== Rest of your site logic ===================== */
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

if (els.search) {
  els.search.placeholder = "search…";
  els.search.addEventListener("input", () => {
    const val = els.search.value;
    if (!val.trim()) { els.suggestions.textContent = ""; return; }
    const hit = resolveQuery(val);
    els.suggestions.textContent = hit ? `showing ${hit.data.name}…` : "searching...";
    if (hit) showSubject(hit);
  });
}

function showSubject(hit) {
  currentSubject = hit;
  els.empty.style.display = "none";
  els.results.classList.remove("hidden");
  stopBohr();
  clearThree();
  if (hit.type === "element") {
    els.subjectName.textContent = `${hit.data.name} (${hit.key})`;
    els.threeHost.style.display = "block";
    drawAtom3D(hit.key, hit.data);
  } else {
    els.subjectName.textContent = `${hit.data.name} (${hit.data.formula})`;
    els.threeHost.style.display = "block";
    drawMolecule(hit.data);
  }
  showFacts(hit);
}

function showFacts(hit) {
  els.factsSection.classList.remove("hidden");
  els.factsTitle.textContent = `${hit.data.name} — facts`;
  els.factsBlurb.textContent = hit.data.blurb || "Information about this material.";
}

function stopBohr() { if (bohrAnimId) cancelAnimationFrame(bohrAnimId); bohrAnimId = null; }
function clearThree() { if (threeScene && threeScene.renderer) { threeScene.renderer.dispose(); els.threeHost.innerHTML = ""; } }

function drawMolecule(mol) {
  const host = els.threeHost;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(host.clientWidth, host.clientHeight);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.z = 5;
  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const group = new THREE.Group();
  scene.add(group);
  function animate() { group.rotation.y += 0.01; renderer.render(scene, camera); requestAnimationFrame(animate); }
  animate();
  threeScene = { renderer };
}
