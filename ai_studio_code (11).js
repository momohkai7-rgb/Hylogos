/* ===================== Cosmic backdrop (DVD-Style Bouncing Elements) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let motes = [];

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au", "Ag", "He", "Li", "Ti"];
  
  // Palette for the DVD-style color swap
  const NEON_COLORS = ["#ff0055", "#00ffcc", "#ffff33", "#cc33ff", "#33ff77", "#ff9900", "#00ccff"];

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    const size = 25 + Math.random() * 10;
    return {
      x: Math.random() * (window.innerWidth - 60) + 30,
      y: Math.random() * (window.innerHeight - 60) + 30,
      vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8),
      vy: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8),
      sym: sym,
      color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      box: size,
    };
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Background Twinkle Stars
    const starCount = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));

    if (motes.length === 0) {
      for (let i = 0; i < 12; i++) motes.push(spawnMote());
    }
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

  function updateMotes() {
    for (const m of motes) {
      m.x += m.vx;
      m.y += m.vy;

      let hit = false;

      // Bounce horizontal
      if (m.x <= 0 || m.x + m.box >= canvas.width) {
        m.vx *= -1;
        hit = true;
      }
      // Bounce vertical
      if (m.y <= 0 || m.y + m.box >= canvas.height) {
        m.vy *= -1;
        hit = true;
      }

      // Change color on every bounce (DVD Style)
      if (hit) {
        const others = NEON_COLORS.filter(c => c !== m.color);
        m.color = others[Math.floor(Math.random() * others.length)];
      }

      // Draw the element icon
      ctx.globalAlpha = 0.7;
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 10;
      
      roundRectPath(m.x, m.y, m.box, m.box, 4);
      ctx.fillStyle = "rgba(13,10,24,0.85)";
      ctx.fill();
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = m.color;
      ctx.font = `bold 11px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(m.sym, m.x + m.box / 2, m.y + m.box / 2);
      
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  function tick(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background stars
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.2 + 0.4 * twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    updateMotes();
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
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
    if (!val.trim()) { els.suggestions.textContent = ""; return; }
    const hit = (typeof resolveQuery === "function") ? resolveQuery(val) : null;
    els.suggestions.textContent = hit ? `showing ${hit.data.name}…` : "searching...";
    if (hit) searchDebounce = setTimeout(() => showSubject(hit), 300);
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
  stopBohr(); clearThree();

  if (hit.type === "element") {
    const a = (typeof ATOM_MASS !== 'undefined' && ATOM_MASS[hit.key]) || Math.round(hit.data.z * 2.05);
    els.subjectName.textContent = `${hit.data.name} (${hit.key})`;
    els.subjectMeta.textContent = `Z=${hit.data.z} · N=${a - hit.data.z} · A=${a}`;
    els.bohrCanvas.style.display = "none";
    els.threeHost.style.display = "block";
    els.viewerNote.textContent = `3D atom model — magenta protons and orange neutrons packed in the nucleus, blue electrons circling on glowing shells. Tap a particle to inspect.`;
    if (typeof drawAtom3D === "function") drawAtom3D(hit.key, hit.data);
  } else {
    els.subjectName.textContent = `${hit.data.name} (${hit.data.formula})`;
    els.subjectMeta.textContent = `${hit.data.atoms.length} atoms · ${hit.data.bonds.length} bonds`;
    els.bohrCanvas.style.display = "none";
    els.threeHost.style.display = "block";
    els.viewerNote.textContent = `Ball-and-stick model — drag to rotate. Bond lengths and angles are idealized for shape, not to exact scale.`;
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
    const meltStr = e.melt === null ? "not measured" : `${e.melt} °C`;
    const boilStr = e.boil === null ? "not measured" : `${e.boil} °C`;
    const densStr = e.density === null ? "not measured" : `${e.density} ${e.densityUnit}`;
    els.factsGrid.innerHTML = [
      factStat("Atomic mass", massStr, !e.stableWeight),
      factStat("Melting point", meltStr, e.melt === null),
      factStat("Boiling point", boilStr, e.boil === null),
      factStat("Density", densStr, e.density === null),
      factStat("Electronegativity", e.en === null ? "not established" : e.en, e.en === null),
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

/* ===================== Bohr model & 3D Molecule ===================== */
function stopBohr() { if (bohrAnimId) cancelAnimationFrame(bohrAnimId); bohrAnimId = null; }
function clearThree() {
  if (threeScene && threeScene.renderer) {
    threeScene.renderer.dispose();
    if (threeScene.renderer.domElement.parentElement) threeScene.renderer.domElement.parentElement.removeChild(threeScene.renderer.domElement);
    if (threeScene.animId) cancelAnimationFrame(threeScene.animId);
  }
  els.threeHost.innerHTML = ""; threeScene = null;
}

function drawMolecule(mol) {
  const host = els.threeHost;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(host.clientWidth, host.clientHeight); host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 5.5); scene.add(new THREE.AmbientLight(0xffffff, 0.75));
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

/* ===================== Chat ===================== */
if (els.chatForm) {
  els.chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = els.chatInput.value.trim();
    if (!msg) return;
    els.chatInput.value = ""; appendChat("user", msg);
    const pending = appendChat("ai", "Thinking…", true);
    try {
      const subjectLabel = currentSubject ? (currentSubject.type === "element" ? `${currentSubject.data.name} (element)` : `${currentSubject.data.name} (molecule)`) : "no subject";
      const res = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: msg, subject: subjectLabel }) });
      const data = await res.json();
      pending.textContent = data.reply || "Something went wrong on the server side — try again in a moment.";
      pending.classList.remove("pending");
    } catch (err) {
      pending.textContent = "Couldn't reach the AI backend."; pending.classList.remove("pending");
    }
  });
}

function appendChat(role, text, pending = false) {
  const div = document.createElement("div");
  div.className = `chat-msg ${role}` + (pending ? " pending" : "");
  div.textContent = text; els.chatLog.appendChild(div);
  els.chatLog.scrollTop = els.chatLog.scrollHeight; return div;
}