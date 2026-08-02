/* ===================== Cosmic backdrop (stars + black hole = search) ===================== */
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

  // The black hole is centered exactly on the real search input, so it always
  // lines up with it — including through scrolling, since this runs every frame.
  // Position hole in center of viewport, sized appropriately
  function updateHolePosition() {
    const rect = searchEl.getBoundingClientRect();
    hole.cx = rect.left + rect.width / 2;
    hole.cy = rect.top + rect.height / 2;
    hole.r = Math.max(rect.width / 2, Math.min(canvas.width * 0.22, 220));
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

  // ── Black hole drawing ─────────────────────────────────────────────────────
  // The disk SHAPE is static (like Kurzgesagt / Interstellar).
  // The texture INSIDE the disk flows using animated gradient stops — this
  // makes it look like the material is swirling without rotating the shape.
  // We draw: back disk → motes → void → front disk → photon ring
  // so motes disappear behind the void naturally.

  function drawBlackHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    // Disk geometry: wide lens shape tapering to sharp side-points
    const RX = r * 2.5;   // half-width of disk
    const RY = r * 0.48;  // half-height (flat perspective)

    // Animated offset — moves the color bands inside the disk to simulate flow
    const flow = reducedMotion ? 0 : (t * 0.00014) % 1;

    // ── 1. Outer bloom / nebula glow ────────────────────────────────────
    const bloom = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r * 4.2);
    bloom.addColorStop(0,    "rgba(255,130,20,0.30)");
    bloom.addColorStop(0.18, "rgba(255,90,5,0.18)");
    bloom.addColorStop(0.45, "rgba(160,30,220,0.10)");
    bloom.addColorStop(1,    "rgba(80,0,120,0)");
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 4.2, 0, Math.PI * 2);
    ctx.fill();

    // ── 2. Back half of disk (drawn first, behind void and motes) ───────
    _diskHalf(cx, cy, RX, RY, r, flow, false);
  }

  function drawBlackHoleTop(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;
    const RX = r * 2.5;
    const RY = r * 0.48;
    const flow = reducedMotion ? 0 : (t * 0.00014) % 1;

    // ── 3. Event horizon (void) ──────────────────────────────────────────
    ctx.fillStyle = "rgb(5,4,10)";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.97, 0, Math.PI * 2);
    ctx.fill();

    // ── 4. Front half of disk (top arc, over the void) ───────────────────
    _diskHalf(cx, cy, RX, RY, r, flow, true);

    // ── 5. Photon ring — bright rim right at horizon edge ────────────────
    // This is the thin glowing line you see in every BH illustration.
    ctx.save();
    ctx.translate(cx, cy);
    const rim = ctx.createLinearGradient(-RX * 0.55, 0, RX * 0.55, 0);
    rim.addColorStop(0,    "rgba(180,60,255,0)");
    rim.addColorStop(0.15, "rgba(200,80,255,0.85)");
    rim.addColorStop(0.40, "rgba(255,160,40,1)");
    rim.addColorStop(0.50, "rgba(255,255,220,1)");
    rim.addColorStop(0.60, "rgba(255,160,40,1)");
    rim.addColorStop(0.85, "rgba(200,80,255,0.85)");
    rim.addColorStop(1,    "rgba(180,60,255,0)");
    ctx.strokeStyle = rim;
    ctx.lineWidth = r * 0.05;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.01, r * 1.01 * (RY / RX) * 1.1, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  // Draw top or bottom half of the accretion disk.
  // The gradient is animated via `flow` offset so colors stream through it.
  function _diskHalf(cx, cy, RX, RY, r, flow, top) {
    ctx.save();
    ctx.translate(cx, cy);

    // Clip to the correct half
    ctx.beginPath();
    if (top) {
      ctx.rect(-RX * 1.2, -RY * 5, RX * 2.4, RY * 5);
    } else {
      ctx.rect(-RX * 1.2, 0,       RX * 2.4, RY * 5);
    }
    ctx.clip();

    // The flow offset shifts the gradient stops so colors move left→right
    // across the disk, simulating material swirling around the hole.
    const f = flow; // 0..1 cycling

    // Layer A — widest, faintest outer glow (purple → orange → white → orange → purple)
    function makeGrad(x0, x1, stops) {
      const g = ctx.createLinearGradient(x0, 0, x1, 0);
      stops.forEach(([p, c]) => g.addColorStop(Math.min(1, Math.max(0, p)), c));
      return g;
    }

    // Shift the bright peak across the disk with `f`
    const peak = 0.25 + f * 0.5; // oscillates left↔right

    ctx.strokeStyle = makeGrad(-RX, RX, [
      [0,          "rgba(100,0,180,0)"],
      [0.05,       "rgba(150,40,220,0.45)"],
      [peak - 0.2, "rgba(200,80,10,0.55)"],
      [peak,       "rgba(255,220,80,0.90)"],
      [peak + 0.2, "rgba(200,80,10,0.55)"],
      [0.95,       "rgba(150,40,220,0.45)"],
      [1,          "rgba(100,0,180,0)"],
    ]);
    ctx.lineWidth = r * 0.70;
    ctx.beginPath();
    ctx.ellipse(0, 0, RX, RY, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Layer B — tighter, brighter mid-band
    const peak2 = 0.2 + ((f + 0.35) % 1) * 0.6;
    ctx.strokeStyle = makeGrad(-RX * 0.88, RX * 0.88, [
      [0,           "rgba(140,30,220,0)"],
      [0.08,        "rgba(180,50,255,0.65)"],
      [peak2 - 0.18,"rgba(255,120,20,0.80)"],
      [peak2,       "rgba(255,240,160,1)"],
      [peak2 + 0.18,"rgba(255,120,20,0.80)"],
      [0.92,        "rgba(180,50,255,0.65)"],
      [1,           "rgba(140,30,220,0)"],
    ]);
    ctx.lineWidth = r * 0.32;
    ctx.beginPath();
    ctx.ellipse(0, 0, RX * 0.82, RY * 0.82, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Layer C — bright inner core, always white-hot center
    ctx.strokeStyle = makeGrad(-RX * 0.60, RX * 0.60, [
      [0,    "rgba(200,80,255,0)"],
      [0.12, "rgba(255,140,30,0.90)"],
      [0.50, "rgba(255,255,230,1)"],
      [0.88, "rgba(255,140,30,0.90)"],
      [1,    "rgba(200,80,255,0)"],
    ]);
    ctx.lineWidth = r * 0.15;
    ctx.beginPath();
    ctx.ellipse(0, 0, RX * 0.58, RY * 0.58, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Layer D — thin hot filament
    ctx.strokeStyle = makeGrad(-RX * 0.46, RX * 0.46, [
      [0,    "rgba(220,160,255,0)"],
      [0.20, "rgba(255,200,80,0.90)"],
      [0.50, "rgba(255,255,255,1)"],
      [0.80, "rgba(255,200,80,0.90)"],
      [1,    "rgba(220,160,255,0)"],
    ]);
    ctx.lineWidth = r * 0.040;
    ctx.beginPath();
    ctx.ellipse(0, 0, RX * 0.44, RY * 0.44, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // ── Motes (element tiles spiralling in) ────────────────────────────────────
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
      if (!reducedMotion) {
        // Accelerate as they spiral inward
        const pull = 1 + Math.max(0, (hole.r * 3.5 - m.radius) / (hole.r * 2.5));
        m.radius -= m.speed * pull * 0.55;
        m.angle  += 0.005 * (hole.r * 3 / Math.max(m.radius, hole.r * 0.5));
        if (m.radius < hole.r * 1.3) Object.assign(m, spawnMote());
      }
      const x = hole.cx + Math.cos(m.angle) * m.radius;
      const y = hole.cy + Math.sin(m.angle) * m.radius * 0.45;

      // Fade in from outer edge, fade out well before the void
      const fadeIn  = Math.min(1, (m.radius - hole.r * 2.5) / (hole.r * 0.8));
      const fadeOut = Math.min(1, (m.radius - hole.r * 1.3)  / (hole.r * 1.1));
      const alpha   = Math.max(0, Math.min(fadeIn, fadeOut));
      if (alpha <= 0.01) continue;

      ctx.globalAlpha = alpha;
      const s = m.box;
      ctx.shadowColor = m.color;
      ctx.shadowBlur  = 9;
      roundRectPath(x - s / 2, y - s / 2, s, s, 3);
      ctx.fillStyle   = "rgba(13,10,24,0.92)";
      ctx.fill();
      ctx.strokeStyle = m.color;
      ctx.lineWidth   = 1.6;
      ctx.stroke();
      ctx.shadowBlur  = 12;
      ctx.fillStyle   = m.color;
      ctx.font        = "700 9px var(--font-mono), monospace";
      ctx.fillText(m.symbol, x, y + 0.5);
      ctx.shadowBlur  = 0;
    }
    ctx.globalAlpha = 1;
  }

  // ── Main loop ──────────────────────────────────────────────────────────────
  function tick(t) {
    updateHolePosition();
    ctx.fillStyle = "rgb(5,4,10)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars(t);
    drawBlackHole(t);   // bloom + back disk half
    drawMotes();        // motes fade out before they hit the void
    drawBlackHoleTop(t); // void + front disk half + photon ring on top
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

/* ===================== State ===================== */
let currentSubject = null; // { type, key, data }
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

/* ===================== Search handling ===================== */
let searchDebounce = null;

els.search.placeholder = "search…";

els.search.addEventListener("input", () => {
  const val = els.search.value;
  clearTimeout(searchDebounce);
  if (!val.trim()) {
    els.suggestions.textContent = "";
    return;
  }
  const hit = resolveQuery(val);
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
    const hit = resolveQuery(els.search.value);
    if (hit) showSubject(hit);
  }
});

function showSubject(hit) {
  currentSubject = hit;
  els.empty.style.display = "none";
  els.results.classList.remove("hidden");

  stopBohr();
  clearThree();

  if (hit.type === "element") {
    const a = ATOM_MASS[hit.key] || Math.round(hit.data.z * 2.05);
    els.subjectName.textContent = `${hit.data.name} (${hit.key})`;
    els.subjectMeta.textContent = `Z=${hit.data.z} · N=${a - hit.data.z} · A=${a}`;
    els.bohrCanvas.style.display = "none";
    els.threeHost.style.display = "block";
    els.viewerNote.textContent =
      `3D atom model — magenta protons and orange neutrons packed in the nucleus, blue electrons circling on glowing shells. Drag to rotate, pinch/scroll to zoom, tap a particle to inspect it. Not to true relative scale.`;
    drawAtom3D(hit.key, hit.data);
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

/* ===================== Facts panel ===================== */
function factStat(label, value, muted) {
  return `<div class="fact-stat"><div class="label">${label}</div><div class="value${muted ? " muted" : ""}">${value}</div></div>`;
}

function showFacts(hit) {
  els.factsSection.classList.remove("hidden");

  if (hit.type === "element") {
    const e = hit.data;
    const meta = CATEGORY_META[e.category] || { label: e.category, color: "var(--text-dim)" };
    els.factsTitle.textContent = `${e.name} — facts`;
    els.factsCategory.textContent = meta.label;
    els.factsCategory.style.borderColor = meta.color;
    els.factsCategory.style.color = meta.color;

    const massStr = e.stableWeight ? `${e.mass} u` : `[${e.mass}] u`;
    const meltStr = e.melt === null ? "not measured" : `${e.melt} °C${e.theoretical ? " (predicted)" : ""}`;
    const boilStr = e.boil === null ? "not measured" : `${e.boil} °C${e.theoretical ? " (predicted)" : ""}`;
    const densStr = e.density === null ? "not measured" : `${e.density} ${e.densityUnit}${e.theoretical ? " (predicted)" : ""}`;
    const enStr = e.en === null ? "not established" : e.en;

    els.factsGrid.innerHTML = [
      factStat("Atomic mass", massStr, !e.stableWeight),
      factStat("Melting point", meltStr, e.melt === null),
      factStat("Boiling point", boilStr, e.boil === null),
      factStat("Density", densStr, e.density === null),
      factStat("Electronegativity", enStr, e.en === null),
      factStat("Phase at room temp", e.phase),
    ].join("");
    els.factsBlurb.textContent = e.blurb;
  } else {
    const m = hit.data;
    let molarMass = 0;
    m.atoms.forEach(a => { molarMass += (ELEMENTS[a.el] && ELEMENTS[a.el].mass) || 0; });

    els.factsTitle.textContent = `${m.name} — facts`;
    els.factsCategory.textContent = "Molecule";
    els.factsCategory.style.borderColor = "var(--line)";
    els.factsCategory.style.color = "var(--text-dim)";

    els.factsGrid.innerHTML = [
      factStat("Molar mass", `${molarMass.toFixed(2)} g/mol`),
      factStat("Atoms", m.atoms.length),
      factStat("Bonds", m.bonds.length),
    ].join("");
    els.factsBlurb.textContent = MOLECULE_BLURBS[hit.key] || "";
  }
}

/* ===================== Bohr model (canvas) ===================== */
function stopBohr() {
  if (bohrAnimId) cancelAnimationFrame(bohrAnimId);
  bohrAnimId = null;
}

function drawBohr(el) {
  const canvas = els.bohrCanvas;
  const ctx = canvas.getContext("2d");
  const host = canvas.parentElement;

  function size() {
    canvas.width = host.clientWidth;
    canvas.height = host.clientHeight;
  }
  size();

  const cx = () => canvas.width / 2;
  const cy = () => canvas.height / 2;
  const maxShell = el.shells.length;
  const gap = () => Math.min(canvas.width, canvas.height) / (maxShell * 2.6);

  function frame(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // nucleus
    const nucR = 10;
    const grad = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), nucR * 2);
    grad.addColorStop(0, "#fff2d6");
    grad.addColorStop(1, "#ffb454");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx(), cy(), nucR, 0, Math.PI * 2);
    ctx.fill();

    el.shells.forEach((count, i) => {
      const r = gap() * (i + 1.6);
      ctx.strokeStyle = "rgba(232,228,240,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx(), cy(), r, 0, Math.PI * 2);
      ctx.stroke();

      const speed = 0.0006 / (i * 0.4 + 1);
      for (let e = 0; e < count; e++) {
        const angle = (e / count) * Math.PI * 2 + t * speed * (i % 2 === 0 ? 1 : -1);
        const ex = cx() + r * Math.cos(angle);
        const ey = cy() + r * Math.sin(angle);
        ctx.fillStyle = "#7fd9ff";
        ctx.beginPath();
        ctx.arc(ex, ey, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    bohrAnimId = requestAnimationFrame(frame);
  }
  bohrAnimId = requestAnimationFrame(frame);

  window.addEventListener("resize", size);
}

/* ===================== Ball-and-stick (three.js) ===================== */
function clearThree() {
  if (threeScene && threeScene.renderer) {
    threeScene.renderer.dispose();
    if (threeScene.renderer.domElement.parentElement) {
      threeScene.renderer.domElement.parentElement.removeChild(threeScene.renderer.domElement);
    }
    cancelAnimationFrame(threeScene.animId);
  }
  els.threeHost.innerHTML = "";
  threeScene = null;
}

function drawMolecule(mol) {
  const host = els.threeHost;
  const width = host.clientWidth || 400;
  const height = host.clientHeight || 340;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 5.5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  host.appendChild(renderer.domElement);

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const key = new THREE.PointLight(0xfff2d6, 1.1);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.PointLight(0x7fd9ff, 0.6);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  const group = new THREE.Group();
  const sphereGeo = {};
  mol.atoms.forEach((atom) => {
    const r = ATOM_RADIUS[atom.el] ?? ATOM_RADIUS.default;
    if (!sphereGeo[r]) sphereGeo[r] = new THREE.SphereGeometry(r, 24, 24);
    const mat = new THREE.MeshStandardMaterial({
      color: ATOM_COLOR[atom.el] ?? ATOM_COLOR.default,
      roughness: 0.4,
      metalness: 0.1,
    });
    const mesh = new THREE.Mesh(sphereGeo[r], mat);
    mesh.position.set(...atom.pos);
    group.add(mesh);
  });

  mol.bonds.forEach(([a, b]) => {
    const pa = new THREE.Vector3(...mol.atoms[a].pos);
    const pb = new THREE.Vector3(...mol.atoms[b].pos);
    const dir = new THREE.Vector3().subVectors(pb, pa);
    const len = dir.length();
    const mid = new THREE.Vector3().addVectors(pa, pb).multiplyScalar(0.5);

    const geo = new THREE.CylinderGeometry(0.09, 0.09, len, 12);
    const mat = new THREE.MeshStandardMaterial({ color: 0xcfc9df, roughness: 0.5 });
    const cyl = new THREE.Mesh(geo, mat);
    cyl.position.copy(mid);
    cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    group.add(cyl);
  });

  scene.add(group);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = true;
  controls.minDistance = 2.5;
  controls.maxDistance = 10;

  let animId;
  function animate() {
    group.rotation.y += 0.0025;
    controls.update();
    renderer.render(scene, camera);
    animId = requestAnimationFrame(animate);
  }
  animate();

  threeScene = { renderer, animId: animId, get animId() { return animId; } };
  threeScene.animId = animId;

  function onResize() {
    const w = host.clientWidth, h = host.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);
}

/* ===================== Chat ===================== */
els.chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = els.chatInput.value.trim();
  if (!msg) return;
  els.chatInput.value = "";
  appendChat("user", msg);

  const pending = appendChat("ai", "Thinking…", true);

  try {
    const subjectLabel = currentSubject
      ? (currentSubject.type === "element"
          ? `${currentSubject.data.name} (element, Z=${currentSubject.data.z})`
          : `${currentSubject.data.name} (${currentSubject.data.formula})`)
      : "no subject selected yet";

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, subject: subjectLabel }),
    });
    const data = await res.json();
    pending.textContent = data.reply || "Something went wrong on the server side — try again in a moment.";
    pending.classList.remove("pending");
  } catch (err) {
    pending.textContent = "Couldn't reach the AI backend. Check that the API route is deployed correctly.";
    pending.classList.remove("pending");
  }
});

function appendChat(role, text, pending = false) {
  const div = document.createElement("div");
  div.className = `chat-msg ${role}` + (pending ? " pending" : "");
  div.textContent = text;
  els.chatLog.appendChild(div);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
  return div;
}
