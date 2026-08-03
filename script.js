/* ===================== Cosmic backdrop (High-Fidelity Black Hole) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const VOID_COLOR = "5, 2, 10"; // Deep space black

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au"];
  const MOTE_COUNT = 14;

  // Premium Neon Palette from your reference image
  const COLORS = {
    WHITE: "255, 255, 255",
    CORE: "255, 240, 150",
    ORANGE: "255, 140, 40",
    PINK: "255, 50, 160",
    MAGENTA: "200, 30, 230",
    PURPLE: "100, 20, 180",
    GLOW: "130, 50, 255"
  };

  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return "#8b84a3";
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return meta ? meta.color : "#8b84a3";
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    return {
      angle: Math.random() * Math.PI * 2,
      radius: (hole.r || 60) * (2.8 + Math.random() * 1.5),
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
    // Default to center of screen if search bar isn't positioned yet
    hole.cx = rect.left + rect.width / 2 || window.innerWidth / 2;
    hole.cy = rect.top + rect.height / 2 || window.innerHeight / 2;
    hole.r = rect.width / 2 || 70; 
  }

  const DISK_TILT = -0.45; 
  const DISK_SQUASH = 0.38;

  function drawStars(t) {
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.2 + 0.5 * twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function createDiskGradient(rIn, rOut, alpha = 1) {
    const g = ctx.createRadialGradient(0, 0, rIn, 0, 0, rOut);
    g.addColorStop(0, `rgba(${COLORS.WHITE}, ${alpha})`);
    g.addColorStop(0.15, `rgba(${COLORS.CORE}, ${alpha * 0.9})`);
    g.addColorStop(0.35, `rgba(${COLORS.ORANGE}, ${alpha * 0.8})`);
    g.addColorStop(0.6, `rgba(${COLORS.PINK}, ${alpha * 0.7})`);
    g.addColorStop(0.85, `rgba(${COLORS.MAGENTA}, ${alpha * 0.4})`);
    g.addColorStop(1, `rgba(${COLORS.PURPLE}, 0)`);
    return g;
  }

  // Animates the flowing "plasma" edges of the disk
  function drawPlasmaRing(t, rIn, rOut, alpha) {
    const points = 120;
    ctx.beginPath();
    // Outer edge with wave turbulence
    for (let i = 0; i <= points; i++) {
      const a = (i / points) * Math.PI * 2;
      const noise = Math.sin(a * 4 + t * 0.001) * 0.05 + Math.sin(a * 8 - t * 0.002) * 0.03;
      const r = rOut * (1 + noise);
      const x = r * Math.cos(a), y = r * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    // Inner edge (closing the path for evenodd fill)
    for (let i = points; i >= 0; i--) {
      const a = (i / points) * Math.PI * 2;
      const r = rIn;
      const x = r * Math.cos(a), y = r * Math.sin(a);
      ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = createDiskGradient(rIn, rOut, alpha);
    ctx.fill();
  }

  function renderDiskLayer(t, isFar) {
    const { r } = hole;
    ctx.save();
    ctx.translate(hole.cx, hole.cy);
    ctx.rotate(DISK_TILT);
    
    // Split rendering into far (behind) and near (in front)
    ctx.beginPath();
    const clipH = r * 10;
    if (isFar) ctx.rect(-clipH, -clipH, clipH * 2, clipH); // Top half (background)
    else ctx.rect(-clipH, 0, clipH * 2, clipH); // Bottom half (foreground)
    ctx.clip();

    ctx.scale(1, DISK_SQUASH);

    // Layer 1: The Lensed "Halo" (The vertical wrap)
    ctx.save();
    ctx.rotate(Math.PI / 2);
    ctx.scale(1, 2.5); // Stretch vertically for lensing effect
    drawPlasmaRing(t, r * 0.9, r * 1.8, 0.4);
    ctx.restore();

    // Layer 2: Main horizontal Accretion Disk
    drawPlasmaRing(t, r * 0.95, r * 3.2, 0.7);

    ctx.restore();
  }

  function drawHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    const time = reducedMotion ? t * 0.2 : t;

    // 1. Ambient Bloom
    const bloom = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 4.5);
    bloom.addColorStop(0, `rgba(${COLORS.MAGENTA}, 0.2)`);
    bloom.addColorStop(0.5, `rgba(${COLORS.PURPLE}, 0.08)`);
    bloom.addColorStop(1, `rgba(0,0,0,0)`);
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Far side of Disk (renders behind sphere)
    renderDiskLayer(time, true);

    // 3. The Core "Void"
    // Cohesive design: The edge of the black hole is a white "Photon Ring"
    const voidGrad = ctx.createRadialGradient(cx, cy, r * 0.8, cx, cy, r);
    voidGrad.addColorStop(0, `rgba(${VOID_COLOR}, 1)`);
    voidGrad.addColorStop(0.92, `rgba(${VOID_COLOR}, 1)`);
    voidGrad.addColorStop(0.95, `rgba(${COLORS.WHITE}, 0.9)`); // Luminous edge
    voidGrad.addColorStop(1, `rgba(${COLORS.WHITE}, 0)`);
    ctx.fillStyle = voidGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    // 4. Near side of Disk (renders on top of sphere)
    renderDiskLayer(time, false);

    // 5. Polar Energy Jets
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(DISK_TILT);
    ctx.globalCompositeOperation = "lighter";
    const jet = ctx.createLinearGradient(0, -r, 0, -r * 3.5);
    jet.addColorStop(0, `rgba(${COLORS.WHITE}, 0.4)`);
    jet.addColorStop(0.5, `rgba(${COLORS.GLOW}, 0.1)`);
    jet.addColorStop(1, `rgba(${COLORS.GLOW}, 0)`);
    ctx.fillStyle = jet;
    for(let dir of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-r * 0.08, 0); ctx.lineTo(r * 0.08, 0); ctx.lineTo(0, dir * r * 3.5);
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
      const fadeIn = Math.max(0, Math.min(1, (hole.r * 4 - m.radius) / (hole.r * 1.2)));
      const fadeOut = Math.max(0, Math.min(1, (m.radius - hole.r * 1.6) / (hole.r * 0.55)));
      const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut));
      const shrink = Math.max(0.2, Math.min(1, (m.radius - hole.r * 1.6) / (hole.r * 0.9)));
      if (alpha <= 0.03) continue;

      ctx.globalAlpha = alpha;
      const s = m.box * shrink;
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
      ctx.font = `700 ${(9 * shrink).toFixed(1)}px var(--font-mono), monospace`;
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

/* ===================== State ===================== */
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

/* ===================== Search handling ===================== */
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
}

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
      roughness: 0.4, metalness: 0.1,
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

  if (typeof THREE.OrbitControls !== "undefined") {
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = true;
    controls.minDistance = 2.5;
    controls.maxDistance = 10;
  }

  let animId;
  function animate() {
    group.rotation.y += 0.0025;
    renderer.render(scene, camera);
    animId = requestAnimationFrame(animate);
  }
  animate();
  threeScene = { renderer, animId: animId };

  function onResize() {
    const w = host.clientWidth, h = host.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);
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
      pending.textContent = "Couldn't reach the AI backend.";
      pending.classList.remove("pending");
    }
  });
}

function appendChat(role, text, pending = false) {
  if (!els.chatLog) return;
  const div = document.createElement("div");
  div.className = `chat-msg ${role}` + (pending ? " pending" : "");
  div.textContent = text;
  els.chatLog.appendChild(div);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
  return div;
}
