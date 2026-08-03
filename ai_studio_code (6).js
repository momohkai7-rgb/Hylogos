/* ===================== Cosmic backdrop (Exact Reference-Style Black Hole) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const VOID_RGB = "2, 0, 8"; // Deep space black

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au"];
  const MOTE_COUNT = 14;

  // Exact Palette from the reference guide
  const COLORS = {
    WHITE: "255, 255, 255",
    YELLOW: "255, 214, 0",   // #FFD600
    ORANGE: "255, 106, 0",   // #FF6A00
    PINK: "255, 46, 176",    // #FF2EB0
    MAGENTA: "176, 0, 255",  // #B000FF
    PURPLE: "75, 0, 255"     // #4B00FF
  };

  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return "#8b84a3";
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return meta ? meta.color : "#8b84a3";
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    const rBase = hole.r > 0 ? hole.r : 75;
    return {
      angle: Math.random() * Math.PI * 2,
      radius: rBase * (2.8 + Math.random() * 1.5),
      speed: 0.15 + Math.random() * 0.12,
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
    if (searchEl) {
      const rect = searchEl.getBoundingClientRect();
      hole.cx = rect.left + rect.width / 2;
      hole.cy = rect.top + rect.height / 2;
      hole.r = rect.width / 2;
    }
    // Fallback if search isn't yet positioned on page load
    if (!hole.cx || hole.cx === 0) {
      hole.cx = window.innerWidth / 2;
      hole.cy = window.innerHeight * 0.42;
      hole.r = 75;
    }
  }

  const TILT = -0.42; 
  const SQUASH = 0.35;

  // Lensing Math: Projects coordinates into 2D space with a wrap-around warp
  function project(a, dist, isFar, t) {
    const sinA = Math.sin(a);
    let x = Math.cos(a) * dist;
    let y = sinA * dist * SQUASH;

    if (isFar) {
      // Create the vertical lensing "bow" effect from the reference
      const pull = Math.pow(Math.abs(sinA), 1.5) * (hole.r * 1.0);
      y -= (sinA < 0 ? 1 : -1) * pull;
    }

    // High-contrast plasma turbulence
    const noise = Math.sin(a * 4 + t * 0.0018) * (hole.r * 0.06);
    x += noise; y += noise;

    const c = Math.cos(TILT), s = Math.sin(TILT);
    return { x: hole.cx + (x * c - y * s), y: hole.cy + (x * s + y * c) };
  }

  function drawDisk(t, isFar) {
    const steps = 240; // High detail paths for crisp layers
    const layers = 6;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    for (let l = 0; l < layers; l++) {
      const rIn = hole.r * (0.95 + l * 0.25);
      const rOut = rIn + (hole.r * 0.5);
      const alpha = (0.24 - l * 0.04) * (isFar ? 0.7 : 1);

      let col = COLORS.PURPLE;
      if (l === 0) col = COLORS.WHITE;
      else if (l === 1) col = COLORS.YELLOW;
      else if (l === 2) col = COLORS.ORANGE;
      else if (l === 3) col = COLORS.PINK;
      else if (l === 4) col = COLORS.MAGENTA;

      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        if ((Math.sin(a) < 0) !== isFar) continue;
        const p = project(a, rOut, isFar, t);
        if (ctx.getPathStackSize === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
      }
      
      // Intense neon bloom
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(${col}, ${alpha})`;
      ctx.strokeStyle = `rgba(${col}, ${alpha})`;
      ctx.lineWidth = hole.r * 0.6;
      ctx.lineCap = "round";
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;
    const time = reducedMotion ? t * 0.2 : t;

    // 1. Dramatic Neon Atmospheric Bloom
    const bloom = ctx.createRadialGradient(cx, cy, r, cx, cy, r * 6);
    bloom.addColorStop(0, `rgba(${COLORS.PURPLE}, 0.3)`);
    bloom.addColorStop(0.5, `rgba(${COLORS.BLUE}, 0.1)`);
    bloom.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Far lensing arcs (The part of the disk wrapping behind)
    drawDisk(time, true);

    // 3. Central Event Horizon (Solid black void with photon rim)
    ctx.globalCompositeOperation = "source-over";
    const voidGrad = ctx.createRadialGradient(cx, cy, r * 0.88, cx, cy, r);
    voidGrad.addColorStop(0, `rgb(${VOID_RGB})`);
    voidGrad.addColorStop(0.92, `rgb(${VOID_RGB})`);
    voidGrad.addColorStop(0.96, `rgba(${COLORS.WHITE}, 0.9)`); // Brilliant white plasma rim
    voidGrad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = voidGrad;
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();

    // 4. Near lensing arcs (The foreground part of the disk)
    ctx.globalCompositeOperation = "lighter";
    drawDisk(time, false);
    
    // 5. Polar Energy Streams
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(TILT);
    const jet = ctx.createLinearGradient(0, -r, 0, -r * 5);
    jet.addColorStop(0, `rgba(${COLORS.WHITE}, 0.4)`);
    jet.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = jet;
    for(let d of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(-r*0.1, 0); ctx.lineTo(r*0.1, 0); ctx.lineTo(0, d*r*5); ctx.fill();
    }
    ctx.restore();
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
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
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
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.28 + 0.4 * twinkle;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#e8e4f0"; ctx.fill();
    }
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

/* ===================== FULL SITE LOGIC RESTORED (Specs, Search, 3D) ===================== */
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
    const a = (typeof ATOM_MASS !== 'undefined' && ATOM_MASS[hit.key]) || Math.round(hit.data.z * 2.05);
    els.subjectName.textContent = `${hit.data.name} (${hit.key})`;
    els.subjectMeta.textContent = `Z=${hit.data.z} · N=${a - hit.data.z} · A=${a}`;
    els.bohrCanvas.style.display = "none";
    els.threeHost.style.display = "block";
    els.viewerNote.textContent =
      `3D atom model — magenta protons and orange neutrons packed in the nucleus, blue electrons circling on glowing shells. Drag to rotate, pinch/scroll to zoom, tap a particle to inspect it. Not to true relative scale.`;
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

/* ===================== Facts panel ===================== */
function factStat(label, value, muted) {
  return `<div class="fact-stat"><div class="label">${label}</div><div class="value${muted ? " muted" : ""}">${value}</div></div>`;
}

function showFacts(hit) {
  els.factsSection.classList.remove("hidden");

  if (hit.type === "element") {
    const e = hit.data;
    const meta = (typeof CATEGORY_META !== 'undefined' && CATEGORY_META[e.category]) || { label: e.category, color: "var(--text-dim)" };
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
    m.atoms.forEach(a => { molarMass += (typeof ELEMENTS !== 'undefined' && ELEMENTS[a.el] && ELEMENTS[a.el].mass) || 0; });

    els.factsTitle.textContent = `${m.name} — facts`;
    els.factsCategory.textContent = "Molecule";
    els.factsCategory.style.borderColor = "var(--line)";
    els.factsCategory.style.color = "var(--text-dim)";

    els.factsGrid.innerHTML = [
      factStat("Molar mass", `${molarMass.toFixed(2)} g/mol`),
      factStat("Atoms", m.atoms.length),
      factStat("Bonds", m.bonds.length),
    ].join("");
    els.factsBlurb.textContent = (typeof MOLECULE_BLURBS !== 'undefined' && MOLECULE_BLURBS[hit.key]) || "";
  }
}

/* ===================== Bohr model (canvas) ===================== */
function stopBohr() { if (bohrAnimId) cancelAnimationFrame(bohrAnimId); bohrAnimId = null; }

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
  scene.add(new THREE.AmbientLight(0xffffff, 0.75));

  const group = new THREE.Group();
  mol.atoms.forEach((atom) => {
    const r = (typeof ATOM_RADIUS !== 'undefined' && ATOM_RADIUS[atom.el]) || 0.3;
    const geo = new THREE.SphereGeometry(r, 20, 20);
    const mat = new THREE.MeshStandardMaterial({ color: (typeof ATOM_COLOR !== 'undefined' && ATOM_COLOR[atom.el]) || 0xcccccc });
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
}

function appendChat(role, text, pending = false) {
  const div = document.createElement("div");
  div.className = `chat-msg ${role}` + (pending ? " pending" : "");
  div.textContent = text;
  els.chatLog.appendChild(div);
  els.chatLog.scrollTop = els.chatLog.scrollHeight;
  return div;
}