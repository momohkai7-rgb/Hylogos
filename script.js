/* ===================== Cosmic backdrop ===================== */
(function backdrop() {
  const canvas  = document.getElementById("starfield");
  const ctx     = canvas.getContext("2d");
  const searchEl = document.getElementById("search");

  let stars = [], motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined")
    ? Object.keys(ELEMENTS) : ["H","He","C","O","Fe","Au","Na","Si","Cu","Ar"];
  const MOTE_COUNT = 14;

  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return "#8b84a3";
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return meta ? meta.color : "#8b84a3";
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    return {
      angle:  Math.random() * Math.PI * 2,
      radius: hole.r * (2.8 + Math.random() * 1.6),
      speed:  0.12 + Math.random() * 0.10,
      symbol: sym,
      color:  moteColor(sym),
      box:    15 + Math.random() * 5,
    };
  }

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    const n = Math.floor(canvas.width * canvas.height / 9000);
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));
    updateHole();
    if (!motes.length) motes = Array.from({ length: MOTE_COUNT }, spawnMote);
  }

  function updateHole() {
    const rect = searchEl.getBoundingClientRect();
    hole.cx = rect.left + rect.width  / 2;
    hole.cy = rect.top  + rect.height / 2;
    hole.r  = Math.max(rect.width / 2, Math.min(canvas.width * 0.20, 200));
  }

  /* ── Stars ──────────────────────────────────────────────────────────── */
  function drawStars(t) {
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const tw = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.25 + 0.45 * tw;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  /* ── Black hole ─────────────────────────────────────────────────────────
     Flat neon "poster" style, matching the reference art: a tilted glowing
     ring, white-hot at the inner edge through gold and orange out to
     magenta-purple at the rim, a solid black event horizon on top, and a
     bright thin streak where the near edge of the disk crosses in front of
     the sphere. The ring's own shape stays still (a rigid spin would fight
     the flat "poster" look), but a soft rotating light-sweep plus a few
     drifting glow clumps circulate around it continuously, so the gas
     visibly flows instead of just sitting there like a still image.
  ─────────────────────────────────────────────────────────────────────── */

  const RING_TILT = -20 * Math.PI / 180;

  function drawBlackHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    // flow keeps running under reduced-motion too, just slower — this IS
    // the "energy and gases flowing" visual, not a decorative flourish
    const motionRate = reducedMotion ? 0.35 : 1;
    const flowRot = t * 0.00028 * motionRate;
    const drift   = flowRot * 0.8;
    const breathe = 0.5 + 0.5 * Math.sin(t * 0.00035 * motionRate);

    const outerR = r * 2.9;
    const innerR = r * 1.02;   // event horizon sits just inside the ring's bright inner edge
    const squash = 0.46;       // perspective foreshortening of the tilted ring

    /* 1 ── Wide ambient bloom — the soft magenta/orange haze around everything */
    const bloomR = outerR * 1.6;
    const bloom = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, bloomR);
    bloom.addColorStop(0,    "rgba(255,150,60,0.28)");
    bloom.addColorStop(0.35, "rgba(230,60,140,0.15)");
    bloom.addColorStop(0.7,  "rgba(120,20,180,0.08)");
    bloom.addColorStop(1,    "rgba(60,0,90,0)");
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy, bloomR, 0, Math.PI * 2);
    ctx.fill();

    /* 2 ── The ring: a tilted, squashed circle filled with a radial
       gradient — white-hot inner edge fading through gold, orange, red
       and out to magenta. Its centre is covered by the event horizon
       drawn later, so the ring "wraps" around the sphere for free. */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(RING_TILT);
    ctx.scale(1, squash);

    const frac = innerR / outerR;

    const ring = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR);
    ring.addColorStop(0,                         "rgba(255,250,235,1)");
    ring.addColorStop(frac,                       "rgba(255,250,235,1)");
    ring.addColorStop(Math.min(1, frac + 0.09),   "rgba(255,214,140,1)");
    ring.addColorStop(Math.min(1, frac + 0.20),   "rgba(255,160,60,1)");
    ring.addColorStop(Math.min(1, frac + 0.32),   "rgba(255,100,40,0.98)");
    ring.addColorStop(Math.min(1, frac + 0.44),   "rgba(210,55,70,0.85)");
    ring.addColorStop(Math.min(1, frac + 0.56),   "rgba(150,35,130,0.6)");
    ring.addColorStop(1,                          "rgba(70,10,80,0)");

    ctx.fillStyle = ring;
    ctx.beginPath();
    ctx.arc(0, 0, outerR, 0, Math.PI * 2);
    ctx.fill();

    /* 2b ── Rotating light-sweep — soft bright bands wrapping around the
       ring so the gas reads as flowing, not a static painted band. */
    if (ctx.createConicGradient) {
      const sweep = ctx.createConicGradient(flowRot, 0, 0);
      sweep.addColorStop(0.00, "rgba(255,255,255,0.22)");
      sweep.addColorStop(0.09, "rgba(255,255,255,0)");
      sweep.addColorStop(0.33, "rgba(255,255,255,0.16)");
      sweep.addColorStop(0.42, "rgba(255,255,255,0)");
      sweep.addColorStop(0.63, "rgba(255,255,255,0.20)");
      sweep.addColorStop(0.73, "rgba(255,255,255,0)");
      sweep.addColorStop(1.00, "rgba(255,255,255,0.22)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = sweep;
      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }
    ctx.restore();

    /* 3 ── Soft glow clumps drifting around the ring — extra sparkle
       riding along on top of the light-sweep. */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(RING_TILT);
    ctx.globalCompositeOperation = "lighter";
    const CLUMPS = 6;
    for (let i = 0; i < CLUMPS; i++) {
      const a   = drift * (0.4 + 0.15 * (i % 3)) + (i / CLUMPS) * Math.PI * 2;
      const rad = outerR * (0.55 + 0.3 * ((i * 37) % 5) / 5);
      const px  = Math.cos(a) * rad;
      const py  = Math.sin(a) * rad * squash;
      const cR  = r * (0.55 + 0.3 * ((i * 53) % 4) / 4);
      const g = ctx.createRadialGradient(px, py, 0, px, py, cR);
      g.addColorStop(0, "rgba(255,225,180,0.4)");
      g.addColorStop(1, "rgba(255,225,180,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(px, py, cR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();

    /* 4 ── Event horizon — solid black circle on top of the ring */
    ctx.fillStyle = "rgb(5,4,10)";
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fill();

    /* 5 ── Crisp bright white rim right at the horizon's edge */
    const rim = ctx.createRadialGradient(cx, cy, innerR * 0.9, cx, cy, innerR * 1.18);
    rim.addColorStop(0,    "rgba(255,250,235,0)");
    rim.addColorStop(0.55, "rgba(255,250,235,0.9)");
    rim.addColorStop(1,    "rgba(255,250,235,0)");
    ctx.fillStyle = rim;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR * 1.18, 0, Math.PI * 2);
    ctx.fill();

    /* 6 ── Bright streak — the near edge of the disk slicing in front of
       the sphere, matching the reference image */
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(RING_TILT);
    const streakW = innerR * 2.3;
    const streakH = r * 0.11 * (1 + 0.2 * breathe);
    const streak = ctx.createLinearGradient(-streakW / 2, 0, streakW / 2, 0);
    streak.addColorStop(0,    "rgba(255,245,255,0)");
    streak.addColorStop(0.18, "rgba(255,250,255,0.65)");
    streak.addColorStop(0.5,  "rgba(255,255,255,0.95)");
    streak.addColorStop(0.82, "rgba(255,250,255,0.65)");
    streak.addColorStop(1,    "rgba(255,245,255,0)");
    ctx.fillStyle = streak;
    ctx.beginPath();
    ctx.ellipse(0, 0, streakW / 2, streakH / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }


  /* ── Motes ──────────────────────────────────────────────────────────── */
  function roundRect(x, y, w, h, rad) {
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
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    for (const m of motes) {
      // orbiting-then-falling-in is the whole point of this visual, so it
      // keeps running under reduced-motion too, just gentler.
      const motionRate = reducedMotion ? 0.4 : 1;
      const pull = 1 + Math.max(0, (hole.r * 3.5 - m.radius) / (hole.r * 2.5));
      m.radius -= m.speed * pull * 0.5 * motionRate;
      m.angle  += 0.005 * (hole.r * 3 / Math.max(m.radius, hole.r * 0.5)) * motionRate;
      if (m.radius < hole.r * 1.2) Object.assign(m, spawnMote());
      const x = hole.cx + Math.cos(m.angle) * m.radius;
      const y = hole.cy + Math.sin(m.angle) * m.radius * 0.45;

      const fadeIn  = Math.min(1, (m.radius - hole.r * 2.6) / (hole.r * 0.8));
      const fadeOut = Math.min(1, (m.radius - hole.r * 1.2)  / (hole.r * 1.2));
      const alpha   = Math.max(0, Math.min(fadeIn, fadeOut));
      if (alpha < 0.01) continue;

      ctx.globalAlpha = alpha;
      const s = m.box;
      ctx.shadowColor = m.color; ctx.shadowBlur = 9;
      roundRect(x - s/2, y - s/2, s, s, 3);
      ctx.fillStyle   = "rgba(13,10,24,0.92)"; ctx.fill();
      ctx.strokeStyle = m.color; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.shadowBlur  = 12;
      ctx.fillStyle   = m.color;
      ctx.font        = "700 9px var(--font-mono),monospace";
      ctx.fillText(m.symbol, x, y + 0.5);
      ctx.shadowBlur  = 0;
    }
    ctx.globalAlpha = 1;
  }

  /* ── Main loop ──────────────────────────────────────────────────────── */
  function tick(t) {
    updateHole();
    ctx.fillStyle = "rgb(5,4,10)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars(t);
    drawBlackHole(t);
    drawMotes();
    rafId = requestAnimationFrame(tick);
  }

  let rafId = null;
  function start() { if (!rafId) rafId = requestAnimationFrame(tick); }
  function stop()  { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
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
