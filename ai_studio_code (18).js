/* ===================== Scientific Radar & Backdrop logic ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  
  let stars = [];
  let motes = [];
  let radarDots = [];
  let sweepAngle = 0;
  const hole = { cx: 0, cy: 0, r: 0 };

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au", "Ag", "Ti"];
  const NEON_COLORS = ["#ff0055", "#00ffcc", "#ffff33", "#cc33ff", "#33ff77", "#ff9900", "#00ccff"];
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
      sym: sym, color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)], box: size,
    };
  }

  function resize() {
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2, phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.02 + 0.005,
    }));
    if (motes.length === 0) for (let i = 0; i < 10; i++) motes.push(spawnMote());
  }

  function tick(t) {
    if (searchEl) {
      const rect = searchEl.getBoundingClientRect();
      hole.cx = rect.left + rect.width / 2; hole.cy = rect.top + rect.height / 2; hole.r = rect.width / 2;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.2 + 0.4 * twinkle;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    // Simple Mote draw
    motes.forEach(m => {
        m.x += m.vx; m.y += m.vy;
        if (m.x <= 0 || m.x + m.box >= canvas.width) m.vx *= -1;
        if (m.y <= 0 || m.y + m.box >= canvas.height) m.vy *= -1;
        ctx.strokeStyle = m.color; ctx.strokeRect(m.x, m.y, m.box, m.box);
    });
    requestAnimationFrame(tick);
  }
  window.addEventListener("resize", resize); resize(); requestAnimationFrame(tick);
})();

/* ===================== SITE LOGIC ===================== */
var threeScene = null; // Use var for global scope accessibility

const els = {
  search: document.getElementById("search"),
  suggestions: document.getElementById("suggestions"),
  results: document.getElementById("results"),
  empty: document.getElementById("empty"),
  subjectName: document.getElementById("subjectName"),
  subjectMeta: document.getElementById("subjectMeta"),
  threeHost: document.getElementById("threeHost"),
  factsSection: document.getElementById("factsSection"),
  factsTitle: document.getElementById("factsTitle"),
  factsCategory: document.getElementById("factsCategory"),
  factsGrid: document.getElementById("factsGrid"),
  factsBlurb: document.getElementById("factsBlurb"),
  chatLog: document.getElementById("chatLog"),
  chatForm: document.getElementById("chatForm"),
  chatInput: document.getElementById("chatInput"),
};

/* ===================== Search logic ===================== */
if (els.search) {
  els.search.addEventListener("input", () => {
    const val = els.search.value.trim();
    if (!val) { els.suggestions.textContent = ""; return; }
    const hit = (typeof resolveQuery === "function") ? resolveQuery(val) : null;
    if (hit) showSubject(hit);
  });
}

function clearThree() {
  if (window.threeScene) {
    if (window.threeScene.animId) cancelAnimationFrame(window.threeScene.animId);
    if (window.threeScene.renderer) {
        window.threeScene.renderer.dispose();
        if (window.threeScene.renderer.domElement.parentNode) {
            window.threeScene.renderer.domElement.parentNode.removeChild(window.threeScene.renderer.domElement);
        }
    }
  }
  els.threeHost.innerHTML = "";
  window.threeScene = null;
}

function showSubject(hit) {
  els.empty.style.display = "none";
  els.results.classList.remove("hidden");
  clearThree();

  if (hit.type === "element") {
    const a = (typeof ATOM_MASS !== 'undefined' && ATOM_MASS[hit.key]) || Math.round(hit.data.z * 2);
    els.subjectName.textContent = hit.data.name;
    els.subjectMeta.textContent = `Z=${hit.data.z} · Mass=${hit.data.mass}`;
    if (typeof drawAtom3D === "function") drawAtom3D(hit.key, hit.data);
  } 
  else if (hit.type === "molecule") {
    els.subjectName.textContent = hit.data.name;
    els.subjectMeta.textContent = hit.data.formula;
    if (typeof drawCompound3D === "function") drawCompound3D(hit.data);
  } 
  else if (hit.type === "alloy") {
    els.subjectName.textContent = hit.data.name;
    els.subjectMeta.textContent = "Alloy Structure";
    if (typeof drawAlloy3D === "function") drawAlloy3D(hit.data);
  }
  showFacts(hit);
}

function factStat(l, v) { return `<div class="fact-stat"><div class="label">${l}</div><div class="value">${v}</div></div>`; }

function showFacts(hit) {
  els.factsSection.classList.remove("hidden");
  const d = hit.data;
  if (hit.type === "element") {
    els.factsTitle.textContent = "Properties";
    els.factsCategory.textContent = d.category;
    els.factsGrid.innerHTML = [
      factStat("Melt", d.melt + "°C"), factStat("Boil", d.boil + "°C"),
      factStat("Density", d.density), factStat("EN", d.en)
    ].join("");
    els.factsBlurb.textContent = d.blurb;
  } else {
    els.factsTitle.textContent = "Details";
    els.factsCategory.textContent = hit.type;
    els.factsGrid.innerHTML = factStat("Type", "3D Visualization");
    els.factsBlurb.textContent = "High-fidelity structural model.";
  }
}

// Chat logic simplified for fix
if (els.chatForm) {
  els.chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = els.chatInput.value;
    if(!msg) return;
    const div = document.createElement("div");
    div.className = "chat-msg user"; div.textContent = msg;
    els.chatLog.appendChild(div);
    els.chatInput.value = "";
  });
}