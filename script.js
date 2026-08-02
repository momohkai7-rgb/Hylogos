/* ===================== Cosmic backdrop (stars + black hole) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const AMBER = "255,180,84";
  const HOT = "255,242,214";
  const BLUE = "127,217,255";
  const VOID = "5,4,10";
  const VOID2 = "13,10,24";

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
      radius: hole.r * (2.5 + Math.random() * 2.0),
      speed: 0.16 + Math.random() * 0.14,
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

    hole.r = Math.min(canvas.width * 0.21, 210);
    hole.cx = canvas.width * 0.5;
    hole.cy = canvas.height * 0.33;

    motes = Array.from({ length: MOTE_COUNT }, spawnMote);
  }

  function drawStars(t) {
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.55 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.35 + 0.5 * twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    // ── Outer diffuse bloom (wide warm glow around entire system) ──────────
    const bloom = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 4.2);
    bloom.addColorStop(0,    `rgba(255,160,60,0.22)`);
    bloom.addColorStop(0.25, `rgba(255,130,40,0.12)`);
    bloom.addColorStop(0.6,  `rgba(200,80,10,0.05)`);
    bloom.addColorStop(1,    `rgba(200,80,10,0)`);
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 4.2, 0, Math.PI * 2);
    ctx.fill();

    // ── Accretion disk — drawn as layered flat ellipses, NOT rotating ─────
    // The disk is static. We draw it in segments using arc sweeps so we can
    // apply asymmetric brightness (left side = approaching = brighter).
    // Bottom half will be occluded by the void circle drawn after.
    const diskRx = r * 2.1;   // disk semi-major (horizontal)
    const diskRy = r * 0.38;  // disk semi-minor (vertical, flat perspective)

    // Helper: draw one ellipse stroke with a left/right brightness gradient
    function diskRing(rx, ry, lineW, innerAlpha, outerAlpha, colorInner, colorOuter) {
      ctx.save();
      ctx.translate(cx, cy);
      // Clip to only the part of the disk that should be visible.
      // We'll handle occlusion by drawing void on top later.
      const grad = ctx.createLinearGradient(-rx, 0, rx, 0);
      // Left side (approaching, Doppler-boosted): hot white-orange
      grad.addColorStop(0,    `rgba(${colorOuter},0)`);
      grad.addColorStop(0.05, `rgba(${colorOuter},${outerAlpha * 0.5})`);
      grad.addColorStop(0.22, `rgba(${colorInner},${innerAlpha})`);
      grad.addColorStop(0.42, `rgba(255,255,220,${innerAlpha * 0.85})`);
      // Center top (the part bending over the hole) — brightest point
      grad.addColorStop(0.5,  `rgba(255,245,200,${innerAlpha})`);
      // Right side (receding, dimmer)
      grad.addColorStop(0.65, `rgba(${colorInner},${innerAlpha * 0.55})`);
      grad.addColorStop(0.85, `rgba(${colorOuter},${outerAlpha * 0.35})`);
      grad.addColorStop(1,    `rgba(${colorOuter},0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = lineW;
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Layer 1 — thick outer disk body (warm amber/orange)
    diskRing(diskRx,        diskRy,        r * 0.38, 0.92, 0.55, "255,165,55", "200,90,15");
    // Layer 2 — mid disk, slightly smaller
    diskRing(diskRx * 0.82, diskRy * 0.82, r * 0.22, 0.85, 0.45, "255,200,100","220,110,20");
    // Layer 3 — hot inner edge (bright, white-hot)
    diskRing(diskRx * 0.62, diskRy * 0.62, r * 0.10, 0.95, 0.50, "255,240,180","255,180,60");
    // Layer 4 — photon ring filament (thin, bluish-white)
    diskRing(diskRx * 0.50, diskRy * 0.50, r * 0.028,0.90, 0.40, "220,235,255","180,210,255");

    // ── Gravitational lensing arc (ghost disk bent over the top) ──────────
    // In real BH images, the disk wraps over the top as a thin bright arc.
    ctx.save();
    ctx.translate(cx, cy);
    // Only draw the TOP half of a tighter, thinner ellipse
    ctx.beginPath();
    ctx.ellipse(0, -r * 0.12, diskRx * 0.52, diskRy * 0.48, 0, Math.PI, Math.PI * 2);
    const lensGrad = ctx.createLinearGradient(-diskRx * 0.52, 0, diskRx * 0.52, 0);
    lensGrad.addColorStop(0,    `rgba(255,180,80,0)`);
    lensGrad.addColorStop(0.15, `rgba(255,220,140,0.55)`);
    lensGrad.addColorStop(0.5,  `rgba(255,250,220,0.80)`);
    lensGrad.addColorStop(0.85, `rgba(255,200,100,0.45)`);
    lensGrad.addColorStop(1,    `rgba(255,180,80,0)`);
    ctx.strokeStyle = lensGrad;
    ctx.lineWidth = r * 0.045;
    ctx.stroke();
    ctx.restore();

    // ── Event horizon — pitch black circle, occludes bottom half of disk ──
    // We draw a slightly larger circle with a soft fringe first for the
    // photon sphere glow right at the edge.
    const photonGlow = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r * 1.08);
    photonGlow.addColorStop(0,   `rgba(255,200,100,0.18)`);
    photonGlow.addColorStop(0.5, `rgba(255,160,50,0.07)`);
    photonGlow.addColorStop(1,   `rgba(255,160,50,0)`);
    ctx.fillStyle = photonGlow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 1.08, 0, Math.PI * 2);
    ctx.fill();

    // Hard void fill — perfectly black, covers bottom half of disk
    ctx.fillStyle = `rgb(5,4,10)`;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.98, 0, Math.PI * 2);
    ctx.fill();
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
      if (!reducedMotion) {
        const pull = 1 + (hole.r * 2.2 - m.radius) / (hole.r * 4);
        m.radius -= m.speed * Math.max(pull, 0.3);
        m.angle += 0.006 * (hole.r * 3 / Math.max(m.radius, hole.r * 0.4));
        if (m.radius < hole.r * 0.7) Object.assign(m, spawnMote());
      }
      const x = hole.cx + Math.cos(m.angle) * m.radius;
      const y = hole.cy + Math.sin(m.angle) * m.radius * 0.34;
      const fadeIn = Math.max(0, Math.min(1, (hole.r * 4.5 - m.radius) / (hole.r * 1.3)));
      const fadeOut = Math.max(0, Math.min(1, (m.radius - hole.r * 0.65) / (hole.r * 0.45)));
      const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut));
      if (alpha <= 0.03) continue;

      ctx.globalAlpha = alpha;
      const s = m.box;
      roundRectPath(x - s / 2, y - s / 2, s, s, 3);
      ctx.fillStyle = `rgba(${VOID2},0.9)`;
      ctx.fill();
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 1.3;
      ctx.stroke();

      ctx.fillStyle = m.color;
      ctx.font = "700 9px var(--font-mono), monospace";
      ctx.fillText(m.symbol, x, y + 0.5);
    }
    ctx.globalAlpha = 1;
  }

  function tick(t) {
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
