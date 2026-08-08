/* ===================== Cosmic backdrop + orbital search ring ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  
  let stars = [];
  let motes = [];
  let particles = []; // tiny sparks that shed off each mote as it moves
  let viewW = 0, viewH = 0; // logical (CSS-pixel) canvas size, kept separate from the
                             // dpr-scaled backing store so crispness doesn't break bounds math
  const hole = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au", "Ag", "Ti"];
  // pulled straight from the site's own palette (--disk-amber, --disk-hot,
  // --photon-blue, --struct-green, and the search/scanner emerald) instead
  // of an unrelated rainbow set, so the trail/spark glow reads as the same
  // theme as the rest of the page rather than clashing with it.
  const NEON_COLORS = ["#ffb454", "#fff2d6", "#7fd9ff", "#42ffb0", "#10ff78"];

  // single neon-green scan line sweeping across the search bar — reuses
  // the same emerald as the search text itself, so it reads as one theme
  const SCAN_RGB = "16,255,120";
  const SCAN_PERIOD = 2600; // ms per left-to-right sweep

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    const size = (25 + Math.random() * 10) * 1.15;  // 15% bigger
    const speed = 0.7;                              // 30% slower
    return {
      x: Math.random() * (window.innerWidth - 60) + 30,
      y: Math.random() * (window.innerHeight - 60) + 30,
      vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8) * speed,
      vy: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8) * speed,
      sym: sym,
      color: NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)],
      box: size,
      trail: [],
    };
  }

  // one tiny spark, shed from the trailing edge of a moving mote
  function spawnSpark(m) {
    const speed = Math.hypot(m.vx, m.vy) || 0.001;
    const bx = -m.vx / speed, by = -m.vy / speed; // unit vector pointing backward
    const jitter = (Math.random() - 0.5) * 0.9;   // narrow cone around "backward"
    const cos = Math.cos(jitter), sin = Math.sin(jitter);
    const dx = bx * cos - by * sin, dy = bx * sin + by * cos;
    // start a bit outside the box already, not at its center, so a fresh
    // spark doesn't flash directly on top of the letter
    const cx = m.x + m.box / 2 + bx * (m.box * 0.68);
    const cy = m.y + m.box / 2 + by * (m.box * 0.68);
    particles.push({
      x: cx, y: cy,
      vx: dx * (0.25 + Math.random() * 0.45) + m.vx * 0.1,
      vy: dy * (0.25 + Math.random() * 0.45) + m.vy * 0.1,
      life: 0,
      maxLife: 18 + Math.random() * 16,
      size: 0.8 + Math.random() * 1.1,
      color: m.color,
    });
  }

  function updateParticles() {
    if (particles.length > 220) particles.splice(0, particles.length - 220); // hard cap, just in case
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life++;
      const t = p.life / p.maxLife;
      if (t >= 1) { particles.splice(i, 1); continue; }
      p.x += p.vx; p.y += p.vy;
      p.vx *= 0.96; p.vy *= 0.96;
      ctx.globalAlpha = (1 - t) * 0.6;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.35, p.size * (1 - t * 0.7)), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // fading, tapering streak through a mote's recent positions — the comet
  // tail. Needs to physically reach past the box's own footprint or it
  // just gets drawn over and hidden — trail length is sized so the total
  // path length comfortably clears the largest box at the current speed.
  const TAIL_LEN = 46;
  function drawTail(m) {
    const n = m.trail.length;
    if (n < 2) return;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (let i = 1; i < n; i++) {
      const t = i / n; // 0 = oldest/faintest tip, 1 = newest, right at the box
      ctx.globalAlpha = Math.min(0.85, 0.08 + t * 0.75);
      ctx.lineWidth = 1.1 + t * t * (m.box * 0.3);
      ctx.strokeStyle = m.color;
      ctx.beginPath();
      ctx.moveTo(m.trail[i - 1].x, m.trail[i - 1].y);
      ctx.lineTo(m.trail[i].x, m.trail[i].y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function resize() {
    // Draw at the screen's real pixel density, not just CSS pixels — on any
    // Retina-class display, a 1x-resolution canvas gets stretched by the
    // browser to fill the physical screen, which is what was reading as
    // "fuzzy" (small text/symbols show it worst). Capped at 2x so very
    // high-density phone screens don't push an oversized backing store.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    canvas.style.width = viewW + "px";
    canvas.style.height = viewH + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // all draw calls below stay in CSS-pixel coordinates

    const starCount = Math.floor((viewW * viewH) / 9000);
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * viewW,
      y: Math.random() * viewH,
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
      hole.left = rect.left;
      hole.right = rect.right;
      hole.top = rect.top;
      hole.bottom = rect.bottom;
      hole.width = rect.width;
      hole.height = rect.height;
    }
  }

  // layered-alpha glow stroke/dot — NOT shadowBlur, which rendered
  // inconsistently across devices earlier in this project
  function glowStroke(drawPath, rgb, coreWidth, glowWidth, alpha) {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 4; i >= 1; i--) {
      ctx.globalAlpha = alpha * (i / 4) * 0.5;
      ctx.lineWidth = coreWidth + (glowWidth * i) / 4;
      ctx.strokeStyle = `rgba(${rgb},1)`;
      drawPath();
      ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.lineWidth = coreWidth;
    ctx.strokeStyle = `rgba(${rgb},1)`;
    drawPath();
    ctx.stroke();
    ctx.restore();
  }

  function drawScanner(t) {
    const { left, top, width, height } = hole;
    if (width <= 0 || height <= 0) return;

    const pad = Math.min(8, width * 0.04);
    const x0 = left + pad, x1 = left + width - pad;
    const span = x1 - x0;
    if (span <= 0) return;

    const progress = reducedMotion ? 0.5 : ((t % SCAN_PERIOD) / SCAN_PERIOD);
    const x = x0 + span * progress;

    // fade the line out/in right at the loop point, so the reset from
    // right edge back to left edge never reads as a hard, visible cut
    const edge = 0.07;
    let fade = 1;
    if (!reducedMotion) {
      if (progress < edge) fade = progress / edge;
      else if (progress > 1 - edge) fade = (1 - progress) / edge;
    }

    ctx.save();
    roundRectPath(left, top, width, height, Math.min(width, height) / 2);
    ctx.clip();

    // very slight fading trail behind the line, in the direction it came from
    const trailLen = Math.min(70, span * 0.4);
    const trail = ctx.createLinearGradient(x - trailLen, 0, x, 0);
    trail.addColorStop(0, `rgba(${SCAN_RGB},0)`);
    trail.addColorStop(1, `rgba(${SCAN_RGB},${(0.32 * fade).toFixed(3)})`);
    ctx.fillStyle = trail;
    ctx.fillRect(x - trailLen, top, trailLen, height);

    // thin glowing scan line itself
    glowStroke(() => {
      ctx.beginPath();
      ctx.moveTo(x, top + 2);
      ctx.lineTo(x, top + height - 2);
    }, SCAN_RGB, 1.4, 8, 0.9 * fade);

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
      if (m.x <= 0 || m.x + m.box >= viewW) { m.vx *= -1; hit = true; }
      if (m.y <= 0 || m.y + m.box >= viewH) { m.vy *= -1; hit = true; }
      if (hit) {
        const others = NEON_COLORS.filter(c => c !== m.color);
        m.color = others[Math.floor(Math.random() * others.length)];
      }

      m.trail.push({ x: m.x + m.box / 2, y: m.y + m.box / 2 });
      if (m.trail.length > TAIL_LEN) m.trail.shift();
      if (Math.random() < 0.16) spawnSpark(m);
      drawTail(m);

      // dark tile behind everything
      ctx.save();
      ctx.globalAlpha = 0.55;
      roundRectPath(m.x, m.y, m.box, m.box, 4);
      ctx.fillStyle = "rgba(13,10,24,0.9)";
      ctx.fill();
      ctx.restore();

      // neon glow around the border — layered low-alpha strokes, same
      // technique as the search-bar scanner line. shadowBlur used to sit
      // on top of the glyph fillText too and soften the letters; this
      // keeps the glow on the border only, so the symbol stays sharp.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 3; i >= 1; i--) {
        ctx.globalAlpha = 0.14 * i;
        ctx.lineWidth = 1.6 + i * 2;
        ctx.strokeStyle = m.color;
        roundRectPath(m.x, m.y, m.box, m.box, 4);
        ctx.stroke();
      }
      ctx.restore();

      // crisp border line + crisp glyph, no shadow/blur on either
      ctx.save();
      ctx.strokeStyle = m.color; ctx.lineWidth = 1.6;
      roundRectPath(m.x, m.y, m.box, m.box, 4);
      ctx.stroke();
      ctx.fillStyle = m.color;
      ctx.font = `bold ${Math.round(m.box * 0.33)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(m.sym, m.x + m.box / 2, m.y + m.box / 2);
      ctx.restore();
    }
  }

  function tick(t) {
    updateHolePosition();
    ctx.clearRect(0, 0, viewW, viewH);
    // Draw background stars
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.2 + 0.4 * twinkle;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    updateParticles(); // drawn first so a mote's box+text render on top and mask any spark still tucked close behind it
    updateMotes();
    drawScanner(t);
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
    if (typeof structuresHide === "function") structuresHide();
    if (typeof discovererShow === "function") discovererShow(hit.key);
  } 
  else if (hit.type === "molecule") {
    els.subjectName.textContent = `${hit.data.name} (${hit.data.formula})`;
    els.subjectMeta.textContent = `${hit.data.atoms.length} atoms · ${hit.data.bonds.length} bonds`;
    if (typeof drawMolecule3D === "function") {
      drawMolecule3D(hit.key, hit.data);
    }
    if (typeof structuresShow === "function") structuresShow("molecule", hit.key);
    if (typeof discovererHide === "function") discovererHide();
  } 
  else if (hit.type === "alloy") {
    els.subjectName.textContent = hit.data.name;
    els.subjectMeta.textContent = `alloy`;
    if (typeof drawAlloy3D === "function") drawAlloy3D(hit.key, hit.data);
    if (typeof structuresShow === "function") structuresShow("alloy", hit.key);
    if (typeof discovererHide === "function") discovererHide();
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
