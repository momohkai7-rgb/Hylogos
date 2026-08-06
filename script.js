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
    if (typeof drawAlloy3D === "function") {
      drawAlloy3D(hit.key, hit.data);
    }
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
   CERTIFIED SCIENTIFIC & METALLURGICAL DATABASE (IUPAC & Crystallography Registry)
   (Added cleanly on top of script (8).js)
========================================================================= */
(function() {
  const VERIFIED_REGISTRY = {
    H2O: {
      name: "Water", formula: "H₂O", type: "Compound",
      structures: [
        {
          name: "IUPAC Structural Formula", cat: "Molecular Geometry",
          bonding: "Polar Covalent (Single σ bonds)", geometry: "Bent / Angular (VSEPR AX₂E₂)",
          angles: "104.5° (Experimental VSEPR bond angle)", hybridization: "sp³ Oxygen Center",
          polarity: "Polar (1.85 D Net Dipole Moment)", coordination: "2 Hydrogen ligands bound to central Oxygen",
          notes: "The universal solvent featuring two O–H single covalent bonds and two unshared valence lone pairs on the central oxygen atom.",
          render: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;color:#10FF78;font-size:1.4rem;text-shadow:0 0 10px rgba(16,255,120,0.4)">H — O — H  ( ∠ 104.5° )</div>`
        },
        {
          name: "Lewis Electron Dot Structure", cat: "Valence Shell Configuration",
          bonding: "Shared Electron Pairs & Lone Pairs", geometry: "Tetrahedral Electron Domain Distribution",
          angles: "109.5° tetrahedral domain spacing", hybridization: "Localized valence atomic mixing",
          polarity: "Asymmetric charge distribution", coordination: "Octet compliant (8 valence electrons around Oxygen)",
          notes: "Illustrates complete valence shell octets, showing 2 shared single-bond pairs and 2 isolated non-bonding lone pairs on oxygen.",
          render: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;color:#7fd9ff;font-size:1.3rem;text-shadow:0 0 10px rgba(127,217,255,0.4)">H : O(..)(..) : H</div>`
        }
      ]
    },
    CO2: {
      name: "Carbon dioxide", formula: "CO₂", type: "Compound",
      structures: [
        {
          name: "Linear Structural Formula", cat: "Molecular Geometry",
          bonding: "Polar Covalent (Two C=O Double Bonds)", geometry: "Linear (VSEPR AX₂)",
          angles: "180.0° Perfect Linear Symmetry", hybridization: "sp Carbon Center, sp² Oxygen Centers",
          polarity: "Non-polar (Dipole moments cancel vectorially)", coordination: "2 Oxygen atoms symmetrically bound to central Carbon",
          notes: "Features a central carbon atom joined to two terminal oxygen atoms via rigid double covalent bonds.",
          render: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;color:#10FF78;font-size:1.4rem;text-shadow:0 0 10px rgba(16,255,120,0.4)">O = C = O  ( 180° )</div>`
        }
      ]
    },
    CH4: {
      name: "Methane", formula: "CH₄", type: "Compound",
      structures: [
        {
          name: "Tetrahedral Structural Formula", cat: "Organic Chemistry",
          bonding: "Non-polar Covalent (C–H Single Bonds)", geometry: "Tetrahedral (VSEPR AX₄)",
          angles: "109.5° Exact Tetrahedral Angle", hybridization: "sp³ Carbon Center",
          polarity: "Non-polar (Symmetrical charge distribution)", coordination: "4 Hydrogen atoms coordinated to central Carbon",
          notes: "The simplest alkane, featuring four equivalent C–H bonds oriented symmetrically in three-dimensional space.",
          render: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;color:#10FF78;font-size:1.3rem;text-shadow:0 0 10px rgba(16,255,120,0.4)">H₄C — Tetrahedral 109.5°</div>`
        }
      ]
    },
    C6H6: {
      name: "Benzene", formula: "C₆H₆", type: "Compound",
      structures: [
        {
          name: "Kekulé / Resonance Structure", cat: "Aromatic Hydrocarbon",
          bonding: "Delocalized Aromatic Pi-System", geometry: "Planar Regular Hexagon",
          angles: "120.0° Aromatic Ring Angle", hybridization: "sp² Carbon Ring Network",
          polarity: "Non-polar Aromatic Ring", coordination: "Each Carbon coordinated to 1 H and 2 adjacent carbons",
          notes: "Exhibits continuous cyclic delocalization of p-electrons above and below the planar carbon ring.",
          render: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;color:#10FF78;font-size:1.3rem;text-shadow:0 0 10px rgba(16,255,120,0.4)">◯ (Aromatic 𝛑-System)</div>`
        }
      ]
    },
    STEEL: {
      name: "Steel", formula: "Fe–C", type: "Alloy",
      structures: [
        {
          name: "Crystallographic Lattice System", cat: "Metallurgy / Phase Science",
          bonding: "Metallic Lattice with Interstitial C Sites", geometry: "Body-Centered Cubic ($\alpha$-Ferrite) to Face-Centered Cubic ($\gamma$-Austenite)",
          angles: "90.0° Isometric Unit Cell Angles", hybridization: "Metallic Conduction Band (Free Electron Gas)",
          polarity: "Metallic Sea (Zero Net Dipole)", coordination: "Coordination Number 8 (BCC) / 12 (FCC)",
          notes: "Iron alloy containing 0.02% to 2.14% carbon dissolved interstitially within the metallic crystal lattice.",
          render: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;color:#7fd9ff;font-size:1.2rem;text-shadow:0 0 10px rgba(127,217,255,0.4)">Fe Matrix + Interstitial C (BCC / FCC)</div>`
        },
        {
          name: "Bravais Unit Cell", cat: "Crystallography",
          bonding: "Metallic Bonding Network", geometry: "Cubic Unit Cell Volume",
          angles: "α = β = γ = 90.0°", hybridization: "d-orbital metal overlap",
          polarity: "Metallic Conduction Matrix", coordination: "Nearest-neighbor iron coordination",
          notes: "Conventional unit cell parameters defining iron's structural response to thermal quenching and carbon diffusion.",
          render: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;color:#10FF78;font-size:1.2rem;text-shadow:0 0 10px rgba(16,255,120,0.4)">a = 2.866 Å (Ferrite Unit Cell)</div>`
        }
      ]
    },
    STAINLESS_STEEL: {
      name: "Stainless steel", formula: "Fe–Cr–Ni", type: "Alloy",
      structures: [
        {
          name: "Austenitic Crystal Lattice", cat: "Metallurgy",
          bonding: "Substitutional Metallic Lattice (Cr/Ni in Fe)", geometry: "Face-Centered Cubic (FCC) Austenite Structure",
          angles: "90.0° Cubic Lattice Angles", hybridization: "Transition metal d-band overlap",
          polarity: "Metallic Electron Sea", coordination: "Coordination Number 12 (Close-packed FCC)",
          notes: "Contains minimum 10.5% Chromium which reacts with oxygen to form a passive, self-healing surface oxide film ($Cr_2O_3$).",
          render: `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:monospace;color:#7fd9ff;font-size:1.2rem;text-shadow:0 0 10px rgba(127,217,255,0.4)">FCC Lattice with Passive Cr₂O₃ Layer</div>`
        }
      ]
    }
  };

  let currentStructures = [];
  let currentIndex = 0;

  const structPanel = document.getElementById("structPanel");
  const structTitle = document.getElementById("structTitle");
  const structCounter = document.getElementById("structCounter");
  const structCanvasHost = document.getElementById("structCanvasHost");
  const structGrid = document.getElementById("structGrid");
  const structNotes = document.getElementById("structNotes");
  const prevBtn = document.getElementById("structPrev");
  const nextBtn = document.getElementById("structNext");

  if (!structPanel) return;

  function renderCurrentStructure() {
    if (!currentStructures.length) return;
    const item = currentStructures[currentIndex];

    structTitle.textContent = item.name;
    structCounter.textContent = `${currentIndex + 1} / ${currentStructures.length}`;
    
    structCanvasHost.style.opacity = '0';
    setTimeout(() => {
      structCanvasHost.innerHTML = item.render;
      structCanvasHost.style.opacity = '1';
    }, 120);

    let gridHTML = `
      <div class="struct-prop"><span class="prop-label">Category</span><span class="prop-val">${item.cat}</span></div>
      <div class="struct-prop"><span class="prop-label">Bonding / Lattice</span><span class="prop-val">${item.bonding}</span></div>
      <div class="struct-prop"><span class="prop-label">Geometry / System</span><span class="prop-val">${item.geometry}</span></div>
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

  const originalShowSubject = window.showSubject;
  window.showSubject = function(hit) {
    if (typeof originalShowSubject === 'function') {
      originalShowSubject(hit);
    }
    
    const registryKey = hit.key;
    const verifiedEntry = VERIFIED_REGISTRY[registryKey] || Object.values(VERIFIED_REGISTRY).find(v => v.formula.replace(/[^a-zA-Z0-9]/g, '') === hit.data.formula.replace(/[^a-zA-Z0-9]/g, ''));

    if (verifiedEntry && verifiedEntry.structures && verifiedEntry.structures.length > 0) {
      currentStructures = verifiedEntry.structures;
      currentIndex = 0;
      structPanel.style.display = "flex";
      renderCurrentStructure();
    } else {
      structPanel.style.display = "none";
    }
  };
})();
