/* ===================== Cosmic backdrop (Exact 2D Neon Black Hole) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const VOID = "5,4,10";

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au"];
  const MOTE_COUNT = 14;

  // Premium Neon Palette from reference image
  const COLORS = {
    WHITE: "255,255,255",
    GOLD: "255,214,90",
    ORANGE: "255,130,35",
    MAGENTA: "255,45,130",
    PURPLE: "175,55,225"
  };

  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return "#8b84a3";
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return meta ? meta.color : "#8b84a3";
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    const rBase = hole.r > 0 ? hole.r : 60;
    return {
      angle: Math.random() * Math.PI * 2,
      radius: rBase * (2.6 + Math.random() * 1.5),
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
    hole.cx = rect.left + rect.width / 2 || window.innerWidth / 2;
    hole.cy = rect.top + rect.height / 2 || window.innerHeight * 0.42;
    hole.r = rect.width / 2 || 70;
  }

  const DISK_TILT = -0.47; 
  const DISK_SQUASH = 0.42;

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

  /**
   * Draws a neon light arc.
   * "isFar" handles the lensing look by drawing the top half as a background wrap.
   */
  function drawNeonArc(t, rIn, rOut, isFar, alpha) {
    ctx.save();
    ctx.translate(hole.cx, hole.cy);
    ctx.rotate(DISK_TILT);

    // Clip to create the background (top) or foreground (bottom)
    ctx.beginPath();
    const clipH = hole.r * 20;
    if (isFar) ctx.rect(-clipH, -clipH, clipH * 2, clipH); 
    else ctx.rect(-clipH, 0, clipH * 2, clipH);
    ctx.clip();

    ctx.scale(1, DISK_SQUASH);

    const g = ctx.createRadialGradient(0, 0, rIn, 0, 0, rOut);
    g.addColorStop(0, `rgba(${COLORS.WHITE}, ${alpha})`);
    g.addColorStop(0.2, `rgba(${COLORS.GOLD}, ${alpha})`);
    g.addColorStop(0.4, `rgba(${COLORS.ORANGE}, ${alpha * 0.9})`);
    g.addColorStop(0.7, `rgba(${COLORS.MAGENTA}, ${alpha * 0.7})`);
    g.addColorStop(1, `rgba(${COLORS.PURPLE}, 0)`);

    ctx.fillStyle = g;
    
    // Draw the ring path with organic "plasma" wobble
    ctx.beginPath();
    const pts = 120;
    for (let i = 0; i <= pts; i++) {
      const a = (i / pts) * Math.PI * 2;
      const noise = Math.sin(a * 4 + t * 0.001) * 0.04;
      const r = rOut * (1 + noise);
      const x = r * Math.cos(a), y = r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    for (let i = pts; i >= 0; i--) {
      const a = (i / pts) * Math.PI * 2;
      const r = rIn;
      const x = r * Math.cos(a), y = r * Math.sin(a);
      ctx.lineTo(x, y);
    }
    ctx.fill();
    ctx.restore();
  }

  function drawHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;
    const time = reducedMotion ? t * 0.3 : t;

    // 1. Wide Ambient Bloom
    const bloom = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 4.5);
    bloom.addColorStop(0, `rgba(${COLORS.MAGENTA}, 0.2)`);
    bloom.addColorStop(0.6, `rgba(${COLORS.PURPLE}, 0.1)`);
    bloom.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "lighter";

    // 2. Far Background Light (The Wrap-Around Arc)
    // We draw the "halo" part behind the sphere
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(DISK_TILT + Math.PI/2);
    ctx.scale(0.8, 1.8);
    ctx.translate(-cx, -cy);
    drawNeonArc(time, r * 0.9, r * 1.5, true, 0.4);
    ctx.restore();
    
    drawNeonArc(time, r * 0.9, r * 2.8, true, 0.4);

    // 3. Central Event Horizon (The Void)
    ctx.globalCompositeOperation = "source-over";
    const vGrad = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r);
    vGrad.addColorStop(0, `rgb(${VOID})`);
    vGrad.addColorStop(0.9, `rgb(${VOID})`);
    vGrad.addColorStop(1, `rgba(${COLORS.WHITE}, 0.4)`);
    ctx.fillStyle = vGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 4. Near Foreground Light (Main Accretion Disk)
    ctx.globalCompositeOperation = "lighter";
    
    // Front halo
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(DISK_TILT + Math.PI/2);
    ctx.scale(0.8, 1.8);
    ctx.translate(-cx, -cy);
    drawNeonArc(time, r * 0.9, r * 1.5, false, 0.7);
    ctx.restore();

    drawNeonArc(time, r * 0.9, r * 2.8, false, 0.8);
    
    ctx.globalCompositeOperation = "source-over";
  }

  function roundRectPath(x, y, w, h, rad) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y); ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad); ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h); ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - rad); ctx.lineTo(x, y + rad);
    ctx.quadraticCurveTo(x, y, x + rad, y); ctx.closePath();
  }

  function drawMotes() {
    if (hole.r <= 0) return;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const m of motes) {
      const motionRate = reducedMotion ? 0.4 : 1;
      m.radius -= m.speed * motionRate;
      m.angle += 0.006 * motionRate;
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

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop(); else start();
  });

  window.addEventListener("resize", resize);
  resize();
  start();
})();

/* ===================== State & Variables ===================== */
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

/* ===================== Search Handling ===================== */
let searchDebounce = null;
if (els.search) {
  els.search.placeholder = "search…";
  els.search.addEventListener("input", () => {
    const val = els.search.value;
    clearTimeout(searchDebounce);
    if (!val.trim()) {
      els.suggestions.textContent = "";
      return;
    }
    const hit = (typeof resolveQuery === "function") ? resolveQuery(val) : null;
    els.suggestions.textContent = hit
      ? `showing ${hit.data.name}…`
      : "no match yet — try an element symbol/name or a small molecule formula";
    if (hit) {
      searchDebounce = setTimeout(() => showSubject(hit), 300);
    }
  });

  els.search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      clearTimeout(searchDebounce);
      const hit = (typeof resolveQuery === "function") ? resolveQuery(els.search.value) : null;
      if (hit) showSubject(hit);
    }
  });
}

function showSubject(hit) {
  currentSubject = hit;
  els.empty.style.display = "none";
  els.results.classList.remove("hidden");

  stopBohr();
  clearThree();

  if (hit.type === "element") {
    const a = (typeof ATOM_MASS !== "undefined" && ATOM_MASS[hit.key]) || Math.round(hit.data.z * 2.05);
    els.subjectName.textContent = `${hit.data.name} (${hit.key})`;
    els.subjectMeta.textContent = `Z=${hit.data.z} · N=${a - hit.data.z} · A=${a}`;
    els.bohrCanvas.style.display = "none";
    els.threeHost.style.display = "block";
    els.viewerNote.textContent =
      `3D atom model — magenta protons and orange neutrons packed in the nucleus, blue electrons circling on glowing shells. Not to true relative scale.`;
    if (typeof drawAtom3D === "function") drawAtom3D(hit.key, hit.data);
  } else {
    els.subjectName.textContent = `${hit.data.name} (${hit.data.formula})`;
    els.subjectMeta.textContent = `${hit.data.atoms.length} atoms · ${hit.data.bonds.length} bonds`;
    els.bohrCanvas.style.display = "none";
    els.threeHost.style.display = "block";
    els.viewerNote.textContent =
      `Ball-and-stick model — drag to rotate. Bond lengths and angles are idealized for shape, not to exact scale.`;
    drawMolecule(hit.data);
  }
  showFacts(hit);
}

/* ===================== Facts Panel ===================== */
function factStat(label, value, muted) {
  return `<div class="fact-stat"><div class="label">${label}</div><div class="value${muted ? " muted" : ""}">${value}</div></div>`;
}

function showFacts(hit) {
  els.factsSection.classList.remove("hidden");
  if (hit.type === "element") {
    const e = hit.data;
    const meta = (typeof CATEGORY_META !== "undefined" && CATEGORY_META[e.category]) || { label: e.category, color: "var(--text-dim)" };
    els.factsTitle.textContent = `${e.name} — facts`;
    els.factsCategory.textContent = meta.label;
    els.factsCategory.style.borderColor = meta.color;
    els.factsCategory.style.color = meta.color;

    const massStr = e.stableWeight ? `${e.mass} u` : `[${e.mass}] u`;
    els.factsGrid.innerHTML = [
      factStat("Atomic mass", massStr, !e.stableWeight),
      factStat("Phase at room temp", e.phase),
    ].join("");
    els.factsBlurb.textContent = e.blurb;
  } else {
    const m = hit.data;
    els.factsTitle.textContent = `${m.name} — facts`;
    els.factsCategory.textContent = "Molecule";
    els.factsGrid.innerHTML = [
      factStat("Atoms", m.atoms.length),
      factStat("Bonds", m.bonds.length),
    ].join("");
    els.factsBlurb.textContent = (typeof MOLECULE_BLURBS !== "undefined" && MOLECULE_BLURBS[hit.key]) || "";
  }
}

/* ===================== Bohr Model (Canvas) ===================== */
function stopBohr() { if (bohrAnimId) cancelAnimationFrame(bohrAnimId); bohrAnimId = null; }

/* ===================== Ball-and-Stick (Three.js) ===================== */
function clearThree() {
  if (threeScene && threeScene.renderer) {
    threeScene.renderer.dispose();
    if (threeScene.renderer.domElement.parentElement) {
      threeScene.renderer.domElement.parentElement.removeChild(threeScene.renderer.domElement);
    }
    if (threeScene.animId) cancelAnimationFrame(threeScene.animId);
  }
  els.threeHost.innerHTML = "";
  threeScene = null;
}

function drawMolecule(mol) {
  const host = els.threeHost;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(host.clientWidth, host.clientHeight);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5);
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const group = new THREE.Group();
  mol.atoms.forEach((atom) => {
    const r = (typeof ATOM_RADIUS !== "undefined" && ATOM_RADIUS[atom.el]) || 0.3;
    const geo = new THREE.SphereGeometry(r, 20, 20);
    const mat = new THREE.MeshStandardMaterial({ color: (typeof ATOM_COLOR !== "undefined" && ATOM_COLOR[atom.el]) || 0xcccccc });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...atom.pos);
    group.add(mesh);
  });
  scene.add(group);

  function animate() {
    group.rotation.y += 0.005;
    renderer.render(scene, camera);
    threeScene.animId = requestAnimationFrame(animate);
  }
  threeScene = { renderer };
  animate();

  window.addEventListener("resize", () => {
    renderer.setSize(host.clientWidth, host.clientHeight);
    camera.aspect = host.clientWidth / host.clientHeight;
    camera.updateProjectionMatrix();
  });
}

/* ===================== Chat ===================== */
if (els.chatForm) {
  els.chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = els.chatInput.value.trim();
    if (!msg) return;
    els.chatInput.value = "";
    appendChat("user", msg);
    const pending = appendChat("ai", "Thinking…", true);
    
    setTimeout(() => {
        pending.textContent = "AI systems initialized. Search an element to begin exploring material properties.";
        pending.classList.remove("pending");
    }, 1200);
  });
}

function appendChat(role, text, pending = false) {
  const div = document.createElement("div");
  div.className = `chat-msg ${role}` + (pending ? " pending" : "");
  div.textContent = text;
  els.chatLog.appendChild(div);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
  return div;
}
