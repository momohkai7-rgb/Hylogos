/* ===================== Scientific Radar & Backdrop logic ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  
  let stars = [];
  let motes = [];
  let radarDots = []; // Storage for the red detection pips
  let sweepAngle = 0;
  const hole = { cx: 0, cy: 0, r: 0 };

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au", "Ag", "Ti"];
  const NEON_COLORS = ["#ff0055", "#00ffcc", "#ffff33", "#cc33ff", "#33ff77", "#ff9900", "#00ccff"];

  // Radar Emerald Tones
  const EMERALD = "rgba(16, 255, 120,";
  const RED_DETECTION = "rgba(255, 40, 40,";

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

  function spawnRadarDot() {
    if (radarDots.length > 5) return;
    const ang = Math.random() * Math.PI * 2;
    const dist = Math.random() * (hole.r * 0.85);
    radarDots.push({
      x: Math.cos(ang) * dist,
      y: Math.sin(ang) * dist,
      alpha: 0,
      life: 0,
      maxLife: 200 + Math.random() * 300,
      pulseSpeed: 0.02 + Math.random() * 0.05
    });
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
    if (motes.length === 0) for (let i = 0; i < 10; i++) motes.push(spawnMote());
  }

  function updateHolePosition() {
    if (searchEl) {
      const rect = searchEl.getBoundingClientRect();
      hole.cx = rect.left + rect.width / 2;
      hole.cy = rect.top + rect.height / 2;
      hole.r = rect.width / 2;
    }
  }

  function drawRadar(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    ctx.save();
    ctx.translate(cx, cy);

    // 1. Dark Glass circular surface
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(4, 12, 10, 0.85)";
    ctx.fill();

    // 2. Glowing Emerald Outer Ring
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = `${EMERALD} 0.8)`;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `${EMERALD} 0.5)`;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 3. Concentric Rings (Scientific instrument style)
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = `${EMERALD} 0.15)`;
    ctx.lineWidth = 1;
    [0.3, 0.6, 0.85].forEach(scale => {
      ctx.beginPath();
      ctx.arc(0, 0, r * scale, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    // 4. Crosshairs
    ctx.beginPath();
    ctx.moveTo(-r * 0.95, 0); ctx.lineTo(r * 0.95, 0);
    ctx.moveTo(0, -r * 0.95); ctx.lineTo(0, r * 0.95);
    ctx.strokeStyle = `${EMERALD} 0.1)`;
    ctx.stroke();

    // 5. Detection Dots (Red)
    if (Math.random() < 0.01) spawnRadarDot();
    radarDots = radarDots.filter(d => d.life < d.maxLife);
    radarDots.forEach(d => {
      d.life++;
      const pulse = 0.5 + 0.5 * Math.sin(t * d.pulseSpeed);
      const alpha = Math.sin((d.life / d.maxLife) * Math.PI);
      ctx.beginPath();
      ctx.arc(d.x, d.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `${RED_DETECTION} ${alpha * pulse * 0.8})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `${RED_DETECTION} 0.6)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // 6. Radar Sweep (Emerald Gradient)
    if (!reducedMotion) sweepAngle += 0.025;
    ctx.save();
    ctx.rotate(sweepAngle);
    const sweep = ctx.createConicGradient(0, 0, 0);
    sweep.addColorStop(0, `${EMERALD} 0.4)`);
    sweep.addColorStop(0.1, `${EMERALD} 0.1)`);
    sweep.addColorStop(0.25, `${EMERALD} 0)`);
    ctx.fillStyle = sweep;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, -0.2, 0.2);
    ctx.fill();
    
    // Sweep leading edge
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r, 0);
    ctx.strokeStyle = `${EMERALD} 0.6)`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

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

  function updateMotes() {
    for (const m of motes) {
      m.x += m.vx; m.y += m.vy;
      let hit = false;
      if (m.x <= 0 || m.x + m.box >= canvas.width) { m.vx *= -1; hit = true; }
      if (m.y <= 0 || m.y + m.box >= canvas.height) { m.vy *= -1; hit = true; }
      if (hit) {
        const others = NEON_COLORS.filter(c => c !== m.color);
        m.color = others[Math.floor(Math.random() * others.length)];
      }
      ctx.globalAlpha = 0.55;
      ctx.shadowColor = m.color; ctx.shadowBlur = 10;
      roundRectPath(m.x, m.y, m.box, m.box, 4);
      ctx.fillStyle = "rgba(13,10,24,0.9)"; ctx.fill();
      ctx.strokeStyle = m.color; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = m.color; ctx.font = `bold 10px monospace`; ctx.textAlign = "center";
      ctx.textBaseline = "middle"; ctx.fillText(m.sym, m.x + m.box / 2, m.y + m.box / 2);
      ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    }
  }

  function tick(t) {
    updateHolePosition();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw background stars
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.2 + 0.4 * twinkle;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    updateMotes();
    drawRadar(t);
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  resize();
  requestAnimationFrame(tick);
})();

/* ===================== SITE LOGIC ===================== */
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
  els.search.style.background = "transparent";
  els.search.style.border = "none";
  els.search.style.textAlign = "center";
  els.search.style.color = "#10FF78"; // Emerald Text

  els.search.addEventListener("input", () => {
    const val = els.search.value;
    clearTimeout(searchDebounce);
    if (!val.trim()) { els.suggestions.textContent = ""; return; }
    const hit = (typeof resolveQuery === "function") ? resolveQuery(val) : null;
    els.suggestions.textContent = hit ? `showing ${hit.data.name}…` : "scanning...";
    if (hit) searchDebounce = setTimeout(() => showSubject(hit), 300);
  });
}

function showSubject(hit) {
  currentSubject = hit;
  els.empty.style.display = "none";
  els.results.classList.remove("hidden");
  stopBohr(); 
  clearThree();

  els.threeHost.style.display = "block";

  if (hit.type === "element") {
    const a = (typeof ATOM_MASS !== 'undefined' && ATOM_MASS[hit.key]) || Math.round(hit.data.z * 2.05);
    els.subjectName.textContent = `${hit.data.name} (${hit.key})`;
    els.subjectMeta.textContent = `Z=${hit.data.z} · N=${a - hit.data.z} · A=${a}`;
    if (typeof drawAtom3D === "function") drawAtom3D(hit.key, hit.data);
  } 
  else if (hit.type === "molecule") {
    els.subjectName.textContent = `${hit.data.name} (${hit.data.formula})`;
    els.subjectMeta.textContent = `${hit.data.atoms.length} atoms · ${hit.data.bonds.length} bonds`;
    if (typeof drawMolecule3D === "function") {
      drawMolecule3D(hit.key, hit.data);
    }
  } 
  else if (hit.type === "alloy") {
    els.subjectName.textContent = hit.data.name;
    els.subjectMeta.textContent = `alloy`;
    if (typeof drawAlloy3D === "function") drawAlloy3D(hit.key, hit.data);
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
    els.factsCategory.style.borderColor = meta.color;
    els.factsGrid.innerHTML = [
      factStat("Atomic mass", `${e.mass} u`),
      factStat("Melting point", e.melt === null ? "not measured" : `${e.melt} °C`),
      factStat("Boiling point", e.boil === null ? "not measured" : `${e.boil} °C`),
      factStat("Density", e.density === null ? "not measured" : `${e.density} ${e.densityUnit}`),
      factStat("Phase", e.phase)
    ].join("");
    els.factsBlurb.textContent = e.blurb;
  } else if (hit.type === "molecule") {
    els.factsTitle.textContent = `${hit.data.name} — facts`;
    els.factsCategory.textContent = "Molecule";
    els.factsGrid.innerHTML = [
        factStat("Atoms", hit.data.atoms.length), 
        factStat("Bonds", hit.data.bonds.length)
    ].join("");
    els.factsBlurb.textContent = (typeof MOLECULE_BLURBS !== 'undefined') ? MOLECULE_BLURBS[hit.key] : "";
  } else if (hit.type === "alloy") {
    els.factsTitle.textContent = `${hit.data.name} — facts`;
    els.factsCategory.textContent = "Metallic Alloy";
    els.factsGrid.innerHTML = [
        factStat("State", "Solid"), 
        factStat("Bonding", "Metallic")
    ].join("");
    els.factsBlurb.textContent = "A complex metallic lattice optimized for engineering properties.";
  }
}

function factStat(l, v) { return `<div class="fact-stat"><div class="label">${l}</div><div class="value">${v}</div></div>`; }

function stopBohr() { 
  if (bohrAnimId) cancelAnimationFrame(bohrAnimId); 
  bohrAnimId = null; 
}

/* Updated Scene Management */
function clearThree() {
  const sceneToClear = window.threeScene || threeScene;
  
  if (sceneToClear && sceneToClear.renderer) {
    if (sceneToClear.animId) cancelAnimationFrame(sceneToClear.animId);
    sceneToClear.renderer.dispose();
    if (sceneToClear.renderer.domElement && sceneToClear.renderer.domElement.parentElement) {
      sceneToClear.renderer.domElement.parentElement.removeChild(sceneToClear.renderer.domElement);
    }
  }
  
  els.threeHost.innerHTML = ""; 
  threeScene = null;
  window.threeScene = null;
}

/* ===================== Chat logic ===================== */
if (els.chatForm) {
  const handleChatSubmit = async (e) => {
    if (e) e.preventDefault();
    
    const msg = els.chatInput.value.trim(); 
    if (!msg) return;
    
    els.chatInput.value = ""; 
    appendChat("user", msg);
    els.chatInput.blur(); 

    const pending = appendChat("ai", "Processing...", true);
    try {
      const subjectLabel = currentSubject
        ? (currentSubject.type === "element"
            ? `${currentSubject.data.name} (element, Z=${currentSubject.data.z})`
            : `${currentSubject.data.name} (${currentSubject.data.formula})`)
        : "no subject selected yet";

      const res = await fetch("/api/chat", { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ message: msg, subject: subjectLabel }) 
      });
      const data = await res.json();
      pending.textContent = data.reply || "Error."; 
      pending.classList.remove("pending");
    } catch (err) { 
      pending.textContent = "Offline or API missing."; 
      pending.classList.remove("pending"); 
    }
  };

  els.chatForm.addEventListener("submit", handleChatSubmit);

  els.chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChatSubmit(e);
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
/* =========================================================================
   STRUCTURAL CARDS ENGINE (2D Neon Chem Schematics & Crystal Lattices)
========================================================================= */
(function() {
  let currentStructures = [];
  let currentIndex = 0;
  let activeSubjectData = null;

  const structPanel = document.getElementById("structPanel");
  const structTitle = document.getElementById("structTitle");
  const structCounter = document.getElementById("structCounter");
  const structCanvasHost = document.getElementById("structCanvasHost");
  const structGrid = document.getElementById("structGrid");
  const structNotes = document.getElementById("structNotes");
  const prevBtn = document.getElementById("structPrev");
  const nextBtn = document.getElementById("structNext");

  if (!structPanel) return;

  function getCompoundStructures(key, mol) {
    return [
      {
        name: "Structural Formula",
        type: "Connectivity Diagram",
        bondType: "Covalent / Polar Covalent",
        geometry: "Analyzed Molecular Layout",
        angles: "Varies by coordination",
        hybridization: "sp / sp² / sp³",
        polarity: mol.atoms.length > 2 ? "Polar / Nonpolar" : "Determined by electronegativity",
        coordination: mol.atoms.length - 1,
        notes: `Displays atom connectivity and direct bonding paths for ${mol.name} (${mol.formula}).`,
        render: drawSkeletalOrStructuralSVG(mol, "structural")
      },
      {
        name: "Lewis Structure",
        type: "Electron Dot & Pair Representation",
        bondType: "Shared Electron Pairs",
        geometry: "Valence Shell Electron Pair Repulsion",
        angles: "Idealized VSEPR Angles",
        hybridization: "Localized Atomic Orbitals",
        polarity: "Octet-driven configuration",
        coordination: "Valence dependent",
        notes: "Illustrates valence electrons, bonding pairs, and lone pairs around constituent atoms.",
        render: drawSkeletalOrStructuralSVG(mol, "lewis")
      },
      {
        name: "Skeletal Formula",
        type: "Line-Angle Representation",
        bondType: "Covalent Backbone",
        geometry: "Simplified 2D Projection",
        angles: "109.5° / 120° / 180° topological",
        hybridization: "Carbon framework optimized",
        polarity: "Organic functional layout",
        coordination: "Vertex-based degree",
        notes: "Omits explicit carbon and hydrogen labels for complex chains, emphasizing structural skeletons.",
        render: drawSkeletalOrStructuralSVG(mol, "skeletal")
      },
      {
        name: "Condensed Formula",
        type: "Linear Group Notation",
        bondType: "Sequential Chemical Groupings",
        geometry: "Linear Sequence",
        angles: "N/A (Text-Structural)",
        hybridization: "Group-level notation",
        polarity: "Functional group polarity",
        coordination: "Sequential bond order",
        notes: `Compact textual-structural representation highlighting functional groupings in ${mol.formula}.`,
        render: drawTextCardSVG(mol.formula, "Condensed Formula Format")
      }
    ];
  }

  function getAlloyStructures(key, alloy) {
    return [
      {
        name: "Crystal Structure",
        type: "Metallic Crystalline Matrix",
        crystalStruct: "BCC / FCC / HCP Ordered Array",
        crystalSystem: "Cubic / Hexagonal Systems",
        angles: "α = β = γ = 90° (Standard Lattice)",
        hybridization: "Metallic Band Delocalization",
        polarity: "Metallic (Non-polar electron sea)",
        coordination: "Coordination Number 8 or 12",
        notes: `Represents the long-range repeating atomic arrangement characteristic of ${alloy.name}.`,
        render: drawLatticeSVG(alloy, "crystal")
      },
      {
        name: "Unit Cell",
        type: "Fundamental Repeating Unit",
        crystalStruct: "Minimal Geometric Tessellation",
        crystalSystem: "Bravais Lattice Unit",
        angles: "Standard Cell Geometry",
        hybridization: "Metallic Orbital Overlap",
        polarity: "Zero Net Dipole",
        coordination: "Nearest Neighbor Count",
        notes: "The smallest repeating subdivision that maintains the complete symmetry of the crystal lattice.",
        render: drawLatticeSVG(alloy, "unitcell")
      },
      {
        name: "Atomic Arrangement",
        type: "Interstitial / Substitutional Solid Solution",
        crystalStruct: "Disordered Matrix Distribution",
        crystalSystem: "Alloy Solid Solution",
        angles: "Local Lattice Distortion",
        hybridization: "Metallic Bonding Network",
        polarity: "Metallic Conduction Band",
        coordination: "Mixed atomic coordination",
        notes: `Shows how solute atoms integrate into the primary solvent lattice of ${alloy.formula}.`,
        render: drawLatticeSVG(alloy, "arrangement")
      }
    ];
  }

  // Custom Neon SVG Generators matching website aesthetics
  function drawSkeletalOrStructuralSVG(mol, mode) {
    let svg = `<svg viewBox="0 0 300 200" width="100%" height="100%" style="background:transparent;">`;
    svg += `<defs><filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
    
    // Draw pseudo nodes based on atom positions
    const pts = mol.atoms.map((a, i) => ({
      x: 150 + a.pos[0] * 45,
      y: 100 - a.pos[1] * 45,
      el: a.el
    }));

    // Draw bonds
    mol.bonds.forEach(([i, j]) => {
      const p1 = pts[i];
      const p2 = pts[j];
      if (p1 && p2) {
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#10FF78" stroke-width="3" filter="url(#neonGlow)" />`;
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#ffffff" stroke-width="1" />`;
      }
    });

    // Draw atoms
    pts.forEach((p, idx) => {
      const color = p.el === 'O' ? '#ff4d4d' : p.el === 'N' ? '#3b6fd9' : p.el === 'C' ? '#10FF78' : '#ffffff';
      svg += `<circle cx="${p.x}" cy="${p.y}" r="12" fill="#0d0a18" stroke="${color}" stroke-width="2.5" filter="url(#neonGlow)" />`;
      svg += `<text x="${p.x}" y="${p.y + 4}" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${p.el}</text>`;
    });

    svg += `</svg>`;
    return svg;
  }

  function drawTextCardSVG(text, subtitle) {
    return `<div style="text-align:center; padding: 2rem; font-family: var(--font-mono);">
      <div style="font-size: 1.6rem; color: #10FF78; font-weight: bold; text-shadow: 0 0 10px rgba(16,255,120,0.4); margin-bottom: 0.5rem;">${text}</div>
      <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em;">${subtitle}</div>
    </div>`;
  }

  function drawLatticeSVG(alloy, mode) {
    let svg = `<svg viewBox="0 0 300 200" width="100%" height="100%" style="background:transparent;">`;
    svg += `<defs><filter id="latticeGlow"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
    
    // Draw geometric lattice grid lines
    const coords = [
      {x: 80, y: 60}, {x: 150, y: 50}, {x: 220, y: 60},
      {x: 60, y: 130}, {x: 150, y: 120}, {x: 240, y: 130},
      {x: 100, y: 170}, {x: 200, y: 170}
    ];

    // Connect grid lines
    const connections = [[0,1],[1,2],[0,3],[1,4],[2,5],[3,4],[4,5],[3,6],[4,7],[5,7],[6,7]];
    connections.forEach(([i, j]) => {
      if (coords[i] && coords[j]) {
        svg += `<line x1="${coords[i].x}" y1="${coords[i].y}" x2="${coords[j].x}" y2="${coords[j].y}" stroke="#7fd9ff" stroke-opacity="0.3" stroke-width="1.5" />`;
      }
    });

    // Draw lattice nodes
    coords.forEach((c, idx) => {
      const isAlt = idx % 2 === 0;
      const color = isAlt ? '#10FF78' : '#7fd9ff';
      svg += `<circle cx="${c.x}" cy="${c.y}" r="9" fill="#0d0a18" stroke="${color}" stroke-width="2.5" filter="url(#latticeGlow)" />`;
      svg += `<circle cx="${c.x}" cy="${c.y}" r="3" fill="${color}" />`;
    });

    svg += `</svg>`;
    return svg;
  }

  function renderCurrentStructure() {
    if (!currentStructures.length) return;
    const item = currentStructures[currentIndex];

    structTitle.textContent = item.name;
    structCounter.textContent = `${currentIndex + 1} / ${currentStructures.length}`;

    if (typeof item.render === 'string' && item.render.trim().startsWith('<svg')) {
      structCanvasHost.innerHTML = item.render;
    } else {
      structCanvasHost.innerHTML = item.render;
    }

    // Populate properties grid
    let gridHTML = `
      <div class="struct-prop"><span>Type</span><span>${item.type}</span></div>
      <div class="struct-prop"><span>${item.bondType ? 'Bond Type' : 'Crystal Struct'}</span><span>${item.bondType || item.crystalStruct}</span></div>
      <div class="struct-prop"><span>${item.geometry ? 'Geometry' : 'Crystal System'}</span><span>${item.geometry || item.crystalSystem}</span></div>
      <div class="struct-prop"><span>Angles</span><span>${item.angles}</span></div>
    `;
    structGrid.innerHTML = gridHTML;
    structNotes.textContent = item.notes;
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + currentStructures.length) % currentStructures.length;
    renderCurrentStructure();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentStructures.length;
    renderCurrentStructure();
  });

  // Hook into global showSubject function to trigger the structures card update
  const originalShowSubject = window.showSubject;
  window.showSubject = function(hit) {
    if (typeof originalShowSubject === 'function') {
      originalShowSubject(hit);
    }
    activeSubjectData = hit;
    if (hit.type === 'molecule') {
      currentStructures = getCompoundStructures(hit.key, hit.data);
      currentIndex = 0;
      structPanel.style.display = "flex";
      renderCurrentStructure();
    } else if (hit.type === 'alloy') {
      currentStructures = getAlloyStructures(hit.key, hit.data);
      currentIndex = 0;
      structPanel.style.display = "flex";
      renderCurrentStructure();
    } else {
      structPanel.style.display = "none";
    }
  };
})();
/* =========================================================================
   UPGRADED STRUCTURAL CARDS ENGINE (Full Multi-Structure Suite & Telemetry)
========================================================================= */
(function() {
  let currentStructures = [];
  let currentIndex = 0;
  let activeSubjectData = null;

  const structPanel = document.getElementById("structPanel");
  const structTitle = document.getElementById("structTitle");
  const structCounter = document.getElementById("structCounter");
  const structCanvasHost = document.getElementById("structCanvasHost");
  const structGrid = document.getElementById("structGrid");
  const structNotes = document.getElementById("structNotes");
  const prevBtn = document.getElementById("structPrev");
  const nextBtn = document.getElementById("structNext");

  if (!structPanel) return;

  function getCompoundStructures(key, mol) {
    return [
      {
        name: "Structural Formula",
        type: "Connectivity Diagram",
        bondType: "Covalent / Polar Covalent",
        geometry: "Analyzed Molecular Layout",
        angles: "Varies by coordination",
        hybridization: "sp / sp² / sp³",
        polarity: mol.atoms.length > 2 ? "Polar / Nonpolar" : "Determined by electronegativity",
        coordination: mol.atoms.length - 1,
        notes: `Displays atom connectivity and direct bonding paths for ${mol.name} (${mol.formula}).`,
        render: drawStructuralSVG(mol)
      },
      {
        name: "Lewis Structure",
        type: "Electron Dot & Pair Representation",
        bondType: "Shared Electron Pairs & Lone Pairs",
        geometry: "VSEPR Valence Shell Layout",
        angles: "Idealized Octet Angles",
        hybridization: "Localized Atomic Orbitals",
        polarity: "Octet-driven dipole assessment",
        coordination: "Valence shell configuration",
        notes: "Illustrates valence electrons, bonding pairs, and non-bonding lone pairs around constituent atoms.",
        render: drawLewisSVG(mol)
      },
      {
        name: "Skeletal Formula",
        type: "Line-Angle Representation",
        bondType: "Covalent Carbon Backbone",
        geometry: "Simplified 2D Topological Projection",
        angles: "109.5° / 120° / 180° geometric nodes",
        hybridization: "Carbon framework optimized",
        polarity: "Organic functional layout",
        coordination: "Vertex-based degree count",
        notes: "Omits explicit carbon symbols and implicit hydrogens for rapid interpretation of molecular backbones.",
        render: drawSkeletalSVG(mol)
      },
      {
        name: "Condensed Formula",
        type: "Linear Group Notation",
        bondType: "Sequential Chemical Groupings",
        geometry: "Linear Sequence Matrix",
        angles: "N/A (Linear textual notation)",
        hybridization: "Group-level hybridization",
        polarity: "Functional group dipole sum",
        coordination: "Sequential bond order",
        notes: `Compact textual-structural notation highlighting functional groupings in ${mol.formula}.`,
        render: drawTextCardHTML(mol.formula, "Linear Condensed Sequence")
      },
      {
        name: "Resonance Structure",
        type: "Delocalized Electron Hybrid",
        bondType: "Pi-System Delocalization",
        geometry: "Conjugated Planar Geometry",
        angles: "Symmetrical resonance angles",
        hybridization: "Unbonded p-orbital overlap",
        polarity: "Distributed charge density",
        coordination: "Extended pi bond network",
        notes: "Represents electron delocalization across multiple contributing Lewis structures via canonical forms.",
        render: drawResonanceSVG(mol)
      },
      {
        name: "Wedge-and-Dash Formula",
        type: "3D Stereochemical Projection",
        bondType: "Spatial Covalent Orientation",
        geometry: "Tetrahedral / Trigonal Pyramidal 3D View",
        angles: "Stereochemical 3D angles",
        hybridization: "Three-dimensional orbital orientation",
        polarity: "Spatial dipole moment vector",
        coordination: "3D steric arrangement",
        notes: "Delineates three-dimensional stereochemistry using solid wedges (pointing forward) and dashed lines (receding).",
        render: drawWedgeDashSVG(mol)
      }
    ];
  }

  function getAlloyStructures(key, alloy) {
    return [
      {
        name: "Crystal Structure",
        type: "Metallic Crystalline Matrix",
        crystalStruct: "BCC / FCC / HCP Ordered Array",
        crystalSystem: "Cubic / Hexagonal Systems",
        angles: "α = β = γ = 90° (Standard Lattice)",
        hybridization: "Metallic Band Delocalization",
        polarity: "Metallic (Electron Sea)",
        coordination: "Coordination Number 8 or 12",
        notes: `Represents the long-range periodic atomic arrangement characteristic of ${alloy.name}.`,
        render: drawAlloySVG(alloy, "crystal")
      },
      {
        name: "Unit Cell",
        type: "Fundamental Repeating Unit",
        crystalStruct: "Minimal Geometric Tessellation",
        crystalSystem: "Bravais Lattice Unit",
        angles: "Standard Cell Geometry",
        hybridization: "Metallic Orbital Overlap",
        polarity: "Zero Net Dipole",
        coordination: "Nearest Neighbor Count",
        notes: "The smallest independent subdivision that encapsulates the complete symmetry and stacking pattern of the lattice.",
        render: drawAlloySVG(alloy, "unitcell")
      },
      {
        name: "Atomic Arrangement",
        type: "Interstitial / Substitutional Solid Solution",
        crystalStruct: "Disordered Matrix Distribution",
        crystalSystem: "Alloy Solid Solution Matrix",
        angles: "Local Lattice Distortion Vectors",
        hybridization: "Metallic Bonding Network",
        polarity: "Metallic Conduction Band",
        coordination: "Mixed coordination shell",
        notes: `Shows how solute atoms integrate into or distort the primary solvent lattice of ${alloy.formula}.`,
        render: drawAlloySVG(alloy, "arrangement")
      },
      {
        name: "Crystal Lattice",
        type: "Infinite Periodic Point Array",
        crystalStruct: "Symmetrical Space Lattice",
        crystalSystem: "Translational Symmetry Grid",
        angles: "Lattice Axis Angles",
        hybridization: "Periodic Metallic Lattice",
        polarity: "Uniform Lattice Field",
        coordination: "Periodic site symmetry",
        notes: "An infinite array of discrete points defining the geometric translational symmetry of the metallic solid.",
        render: drawAlloySVG(alloy, "lattice")
      },
      {
        name: "Phase Structure",
        type: "Microstructural Phase Distribution",
        crystalStruct: "Multi-Phase Grain Boundaries",
        crystalSystem: "Eutectic / Solid Solution Phases",
        angles: "Interphase Boundary Angles",
        hybridization: "Microstructural Bonding States",
        polarity: "Phase-segregated domains",
        coordination: "Interfacial coordination",
        notes: `Illustrates distinct microstructural constituents (e.g., grain boundaries and phases) within ${alloy.name}.`,
        render: drawAlloySVG(alloy, "phase")
      }
    ];
  }

  // High-Tech Neon SVG Blueprint Generators
  function getBaseSVGDefs() {
    return `<defs>
      <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="subtleGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="1.5" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>`;
  }

  function drawStructuralSVG(mol) {
    let svg = `<svg viewBox="0 0 320 220" width="100%" height="100%" style="background:transparent;">`;
    svg += getBaseSVGDefs();
    const pts = mol.atoms.map((a, i) => ({
      x: 160 + (a.pos[0] * 55),
      y: 110 - (a.pos[1] * 55),
      el: a.el
    }));
    mol.bonds.forEach(([i, j]) => {
      const p1 = pts[i], p2 = pts[j];
      if (p1 && p2) {
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#10FF78" stroke-width="3.5" filter="url(#neonGlow)" opacity="0.85"/>`;
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#ffffff" stroke-width="1.2"/>`;
      }
    });
    pts.forEach(p => {
      const color = p.el === 'O' ? '#ff4d4d' : p.el === 'N' ? '#3b6fd9' : p.el === 'C' ? '#10FF78' : '#7fd9ff';
      svg += `<circle cx="${p.x}" cy="${p.y}" r="14" fill="#0d0a18" stroke="${color}" stroke-width="2.5" filter="url(#neonGlow)"/>`;
      svg += `<text x="${p.x}" y="${p.y + 4.5}" fill="#ffffff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">${p.el}</text>`;
    });
    svg += `</svg>`;
    return svg;
  }

  function drawLewisSVG(mol) {
    let svg = `<svg viewBox="0 0 320 220" width="100%" height="100%" style="background:transparent;">`;
    svg += getBaseSVGDefs();
    const pts = mol.atoms.map((a, i) => ({
      x: 160 + (a.pos[0] * 55),
      y: 110 - (a.pos[1] * 55),
      el: a.el
    }));
    mol.bonds.forEach(([i, j]) => {
      const p1 = pts[i], p2 = pts[j];
      if (p1 && p2) {
        svg += `<line x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" stroke="#7fd9ff" stroke-width="2.5" filter="url(#subtleGlow)"/>`;
      }
    });
    pts.forEach((p, idx) => {
      const color = p.el === 'O' ? '#ff4d4d' : p.el === 'N' ? '#3b6fd9' : '#10FF78';
      svg += `<circle cx="${p.x}" cy="${p.y}" r="13" fill="#0d0a18" stroke="${color}" stroke-width="2"/>`;
      svg += `<text x="${p.x}" y="${p.y + 4}" fill="#ffffff" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">${p.el}</text>`;
      // Electron dots mockup around atoms
      if (p.el === 'O') {
        svg += `<circle cx="${p.x - 18}" cy="${p.y - 8}" r="2" fill="#ffb454"/><circle cx="${p.x - 18}" cy="${p.y + 8}" r="2" fill="#ffb454"/>`;
      } else if (p.el === 'N') {
        svg += `<circle cx="${p.x}" cy="${p.y - 20}" r="2" fill="#ffb454"/><circle cx="${p.x + 6}" cy="${p.y - 20}" r="2" fill="#ffb454"/>`;
      } else {
        svg += `<circle cx="${p.x + 18}" cy="${p.y}" r="2" fill="#ffb454"/><circle cx="${p.x - 18}" cy="${p.y}" r="2" fill="#ffb454"/>`;
      }
    });
    svg += `</svg>`;
    return svg;
  }

  function drawSkeletalSVG(mol) {
    let svg = `<svg viewBox="0 0 320 220" width="100%" height="100%" style="background:transparent;">`;
    svg += getBaseSVGDefs();
    const heavyAtoms = mol.atoms.filter(a => a.el !== 'H');
    const pts = (heavyAtoms.length ? heavyAtoms : mol.atoms).map((a, i) => ({
      x: 140 + ((i - 1) * 60),
      y: 110 + (i % 2 === 0 ? -35 : 35),
      el: a.el
    }));
    for (let i = 0; i < pts.length - 1; i++) {
      svg += `<line x1="${pts[i].x}" y1="${pts[i].y}" x2="${pts[i+1].x}" y2="${pts[i+1].y}" stroke="#10FF78" stroke-width="3" filter="url(#neonGlow)"/>`;
    }
    pts.forEach(p => {
      if (p.el !== 'C') {
        svg += `<circle cx="${p.x}" cy="${p.y}" r="10" fill="#0d0a18" stroke="#ff4d4d" stroke-width="2"/>`;
        svg += `<text x="${p.x}" y="${p.y + 3.5}" fill="#ffffff" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">${p.el}</text>`;
      } else {
        svg += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#10FF78" filter="url(#neonGlow)"/>`;
      }
    });
    svg += `</svg>`;
    return svg;
  }

  function drawResonanceSVG(mol) {
    let svg = `<svg viewBox="0 0 320 220" width="100%" height="100%" style="background:transparent;">`;
    svg += getBaseSVGDefs();
    // Left Structure
    svg += `<g transform="translate(-50, 0)">`;
    svg += `<line x1="130" y1="110" x2="170" y2="70" stroke="#7fd9ff" stroke-width="2.5"/>`;
    svg += `<line x1="170" y1="70" x2="210" y2="110" stroke="#7fd9ff" stroke-width="4" filter="url(#neonGlow)"/>`;
    svg += `<circle cx="130" cy="110" r="10" fill="#0d0a18" stroke="#7fd9ff" stroke-width="2"/><text x="130" y="113" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">O</text>`;
    svg += `<circle cx="170" cy="70" r="10" fill="#0d0a18" stroke="#10FF78" stroke-width="2"/><text x="170" y="73" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">C</text>`;
    svg += `<circle cx="210" cy="110" r="10" fill="#0d0a18" stroke="#7fd9ff" stroke-width="2"/><text x="210" y="113" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">O</text>`;
    svg += `</g>`;
    
    // Double-headed resonance arrow
    svg += `<path d="M 140 105 L 180 105 M 172 98 L 180 105 L 172 112 M 148 98 L 140 105 L 148 112" stroke="#ffb454" stroke-width="2.5" fill="none" filter="url(#neonGlow)"/>`;

    // Right Structure
    svg += `<g transform="translate(50, 0)">`;
    svg += `<line x1="130" y1="110" x2="170" y2="70" stroke="#7fd9ff" stroke-width="4" filter="url(#neonGlow)"/>`;
    svg += `<line x1="170" y1="70" x2="210" y2="110" stroke="#7fd9ff" stroke-width="2.5"/>`;
    svg += `<circle cx="130" cy="110" r="10" fill="#0d0a18" stroke="#7fd9ff" stroke-width="2"/><text x="130" y="113" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">O</text>`;
    svg += `<circle cx="170" cy="70" r="10" fill="#0d0a18" stroke="#10FF78" stroke-width="2"/><text x="170" y="73" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">C</text>`;
    svg += `<circle cx="210" cy="110" r="10" fill="#0d0a18" stroke="#7fd9ff" stroke-width="2"/><text x="210" y="113" fill="#fff" font-family="monospace" font-size="9" text-anchor="middle">O</text>`;
    svg += `</g>`;

    svg += `</svg>`;
    return svg;
  }

  function drawWedgeDashSVG(mol) {
    let svg = `<svg viewBox="0 0 320 220" width="100%" height="100%" style="background:transparent;">`;
    svg += getBaseSVGDefs();
    svg += `<circle cx="160" cy="110" r="14" fill="#0d0a18" stroke="#10FF78" stroke-width="3" filter="url(#neonGlow)"/>`;
    svg += `<text x="160" y="114" fill="#fff" font-family="monospace" font-size="12" font-weight="bold" text-anchor="middle">C</text>`;
    // In-plane bonds
    svg += `<line x1="160" y1="110" x2="160" y2="45" stroke="#7fd9ff" stroke-width="2.5"/>`;
    svg += `<line x1="160" y1="110" x2="90" y2="155" stroke="#7fd9ff" stroke-width="2.5"/>`;
    // Wedge bond (pointing forward)
    svg += `<polygon points="160,110 215,165 235,150" fill="#7fd9ff" opacity="0.9" filter="url(#subtleGlow)"/>`;
    // Dash bond (receding)
    svg += `<line x1="160" y1="110" x2="220" y2="70" stroke="#7fd9ff" stroke-dasharray="4,4" stroke-width="3"/>`;
    svg += `</svg>`;
    return svg;
  }

  function drawAlloySVG(alloy, mode) {
    let svg = `<svg viewBox="0 0 320 220" width="100%" height="100%" style="background:transparent;">`;
    svg += getBaseSVGDefs();
    
    if (mode === 'unitcell') {
      // 3D Isometric Unit Cell Box
      svg += `<g transform="translate(60, 30)">`;
      svg += `<polygon points="100,20 180,60 100,100 20,60" fill="none" stroke="#7fd9ff" stroke-width="2" stroke-opacity="0.4"/>`;
      svg += `<line x1="100" y1="100" x2="100" y2="160" stroke="#7fd9ff" stroke-width="2" stroke-opacity="0.6"/>`;
      svg += `<line x1="180" y1="60" x2="180" y2="120" stroke="#7fd9ff" stroke-width="2" stroke-opacity="0.6"/>`;
      svg += `<line x1="20" y1="60" x2="20" y2="120" stroke="#7fd9ff" stroke-width="2" stroke-opacity="0.6"/>`;
      svg += `<polygon points="100,160 180,120 100,80 20,120" fill="none" stroke="#10FF78" stroke-width="2" filter="url(#neonGlow)"/>`;
      
      // Corners
      [[100,20],[180,60],[100,100],[20,60],[100,160],[180,120],[20,120]].forEach(([cx, cy], idx) => {
        svg += `<circle cx="${cx}" cy="${cy}" r="6" fill="#0d0a18" stroke="#10FF78" stroke-width="2" filter="url(#neonGlow)"/>`;
      });
      svg += `</g>`;
    } else {
      // Crystalline Lattice Grid / Phase / Arrangement
      const rows = 3, cols = 4;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx = 60 + c * 65 + (r % 2) * 20;
          const cy = 45 + r * 60;
          const isSolute = (r + c) % 3 === 0;
          const color = isSolute ? '#ff4d4d' : '#10FF78';
          
          if (c < cols - 1) {
            svg += `<line x1="${cx}" y1="${cy}" x2="${cx + 65}" y2="${cy}" stroke="#7fd9ff" stroke-opacity="0.25" stroke-width="1.5"/>`;
          }
          if (r < rows - 1) {
            svg += `<line x1="${cx}" y1="${cy}" x2="${cx - (r%2 ? -20 : 20)}" y2="${cy + 60}" stroke="#7fd9ff" stroke-opacity="0.25" stroke-width="1.5"/>`;
          }
          
          svg += `<circle cx="${cx}" cy="${cy}" r="11" fill="#0d0a18" stroke="${color}" stroke-width="2.5" filter="url(#subtleGlow)"/>`;
          svg += `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${color}"/>`;
        }
      }
    }

    svg += `</svg>`;
    return svg;
  }

  function drawTextCardHTML(text, subtitle) {
    return `<div style="text-align:center; padding: 3rem 1rem; font-family: var(--font-mono); width: 100%;">
      <div style="font-size: 1.8rem; color: #10FF78; font-weight: bold; text-shadow: 0 0 12px rgba(16,255,120,0.4); margin-bottom: 0.6rem; letter-spacing: 0.05em;">${text}</div>
      <div style="font-size: 0.8rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.12em;">${subtitle}</div>
    </div>`;
  }

  function renderCurrentStructure() {
    if (!currentStructures.length) return;
    const item = currentStructures[currentIndex];

    structTitle.textContent = item.name;
    structCounter.textContent = `${currentIndex + 1} / ${currentStructures.length}`;
    
    // Fade transition effect
    structCanvasHost.style.opacity = '0';
    setTimeout(() => {
      structCanvasHost.innerHTML = item.render;
      structCanvasHost.style.opacity = '1';
    }, 120);

    // Populate cyberpunk telemetry grid
    let gridHTML = `
      <div class="struct-prop"><span class="prop-label">Type</span><span class="prop-val">${item.type}</span></div>
      <div class="struct-prop"><span class="prop-label">${item.bondType ? 'Bonding' : 'Crystal Struct'}</span><span class="prop-val">${item.bondType || item.crystalStruct}</span></div>
      <div class="struct-prop"><span class="prop-label">${item.geometry ? 'Geometry' : 'System'}</span><span class="prop-val">${item.geometry || item.crystalSystem}</span></div>
      <div class="struct-prop"><span class="prop-label">Angles</span><span class="prop-val">${item.angles}</span></div>
      <div class="struct-prop"><span class="prop-label">Hybridization</span><span class="prop-val">${item.hybridization}</span></div>
      <div class="struct-prop"><span class="prop-label">Coordination</span><span class="prop-val">${item.coordination}</span></div>
    `;
    structGrid.innerHTML = gridHTML;
    structNotes.textContent = item.notes;
  }

  prevBtn.addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + currentStructures.length) % currentStructures.length;
    renderCurrentStructure();
  });

  nextBtn.addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % currentStructures.length;
    renderCurrentStructure();
  });

  // Hook into showSubject globally
  const originalShowSubject = window.showSubject;
  window.showSubject = function(hit) {
    if (typeof originalShowSubject === 'function') {
      originalShowSubject(hit);
    }
    activeSubjectData = hit;
    if (hit.type === 'molecule') {
      currentStructures = getCompoundStructures(hit.key, hit.data);
      currentIndex = 0;
      structPanel.style.display = "flex";
      renderCurrentStructure();
    } else if (hit.type === 'alloy') {
      currentStructures = getAlloyStructures(hit.key, hit.data);
      currentIndex = 0;
      structPanel.style.display = "flex";
      renderCurrentStructure();
    } else {
      structPanel.style.display = "none";
    }
  };
})();
