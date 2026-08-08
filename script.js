/* ===================== Cosmic backdrop + orbital search ring ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  
  let stars = [];
  let motes = [];
  let viewW = 0, viewH = 0; // logical (CSS-pixel) canvas size, kept separate from the
                             // dpr-scaled backing store so crispness doesn't break bounds math
  const hole = { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 };

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au", "Ag", "Ti"];
  // fallback only for the rare case CATEGORY_META hasn't loaded yet
  const FALLBACK_COLOR = "#39ff14";

  // single neon-green scan line sweeping across the search bar — reuses
  // the same emerald as the search text itself, so it reads as one theme
  const SCAN_RGB = "16,255,120";
  const SCAN_PERIOD = 2600; // ms per left-to-right sweep

  // Real periodic-table category color, not a random pick — ties the ambient
  // background to actual chemistry instead of arbitrary neon shades.
  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return FALLBACK_COLOR;
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return jitterColor(meta ? meta.color : FALLBACK_COLOR);
  }

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  }

  function rgbToHex(r, g, b) {
    const c = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
    return `#${c(r)}${c(g)}${c(b)}`;
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s; const l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        default: h = (r - g) / d + 4;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [r * 255, g * 255, b * 255];
  }

  // A category's color is a single fixed swatch, so every mote of that
  // category would otherwise be visually identical — this nudges hue,
  // saturation, and lightness a bit differently each time, so the same
  // category still reads as a clear family of shades rather than one flat
  // repeated color, giving more overall variety on screen without losing
  // the tie to real chemistry.
  function jitterColor(hex) {
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    const h2 = (h + (Math.random() * 36 - 18) + 360) % 360;
    const s2 = Math.min(100, Math.max(40, s + (Math.random() * 16 - 8)));
    const l2 = Math.min(75, Math.max(30, l + (Math.random() * 20 - 10)));
    const [nr, ng, nb] = hslToRgb(h2, s2, l2);
    return rgbToHex(nr, ng, nb);
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    const size = 20 + Math.random() * 28; // 20-48px — clearly distinct sizes without tiny/huge extremes
    const speed = 0.7;
    return {
      x: Math.random() * (window.innerWidth - 60) + 30,
      y: Math.random() * (window.innerHeight - 60) + 30,
      vx: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8) * speed,
      vy: (Math.random() > 0.5 ? 1 : -1) * (1.2 + Math.random() * 0.8) * speed,
      sym: sym,
      color: moteColor(sym),
      box: size,
      trail: [],
      trailCounter: 0,
      pulseStart: 0,
      pulseDuration: 0,
    };
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
    if (motes.length === 0) for (let i = 0; i < 14; i++) motes.push(spawnMote());
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

  function moveMotes() {
    for (const m of motes) {
      // sample trail history every 3rd frame — a trail built from every
      // single frame at this drift speed is too short to read; sampling
      // less often lets it span real distance without a huge history array
      m.trailCounter = (m.trailCounter || 0) + 1;
      if (m.trailCounter % 3 === 0) {
        m.trail.push({ x: m.x + m.box / 2, y: m.y + m.box / 2 });
        if (m.trail.length > 9) m.trail.shift();
      }

      m.x += m.vx; m.y += m.vy;
      let hit = false;
      if (m.x <= 0 || m.x + m.box >= viewW) { m.vx *= -1; hit = true; }
      if (m.y <= 0 || m.y + m.box >= viewH) { m.vy *= -1; hit = true; }
      if (hit) { m.pulseStart = performance.now(); m.pulseDuration = 350; } // quick flash, not a full search-pulse
    }
  }

  // same bounce-and-recolor treatment as hitting the screen edge, but
  // triggered by two motes' tiles overlapping instead. Whichever axis has
  // the shallower overlap is the one they just crossed, so that's the
  // axis that gets reflected; both tiles are also nudged apart along it
  // so they don't stay overlapped and keep re-triggering next frame.
  function resolveMoteCollisions() {
    for (let i = 0; i < motes.length; i++) {
      const a = motes[i];
      for (let j = i + 1; j < motes.length; j++) {
        const b = motes[j];
        if (a.x >= b.x + b.box || a.x + a.box <= b.x ||
            a.y >= b.y + b.box || a.y + a.box <= b.y) continue; // no overlap

        const overlapX = Math.min(a.x + a.box, b.x + b.box) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.y + a.box, b.y + b.box) - Math.max(a.y, b.y);
        const aLeft = (a.x + a.box / 2) < (b.x + b.box / 2);
        const aAbove = (a.y + a.box / 2) < (b.y + b.box / 2);

        if (overlapX < overlapY) {
          const push = overlapX / 2 + 0.5;
          a.x += aLeft ? -push : push;
          b.x += aLeft ? push : -push;
          a.vx = (aLeft ? -1 : 1) * Math.abs(a.vx || 1);
          b.vx = (aLeft ? 1 : -1) * Math.abs(b.vx || 1);
        } else {
          const push = overlapY / 2 + 0.5;
          a.y += aAbove ? -push : push;
          b.y += aAbove ? push : -push;
          a.vy = (aAbove ? -1 : 1) * Math.abs(a.vy || 1);
          b.vy = (aAbove ? 1 : -1) * Math.abs(b.vy || 1);
        }
        a.pulseStart = performance.now(); a.pulseDuration = 350;
        b.pulseStart = performance.now(); b.pulseDuration = 350;
      }
    }
  }

  // Fading trail behind each tile as it drifts — same layered-alpha
  // technique as the scanner line, just walked along the tile's recent path
  // instead of a fixed line, so it reads as smooth drift rather than
  // teleporting frame to frame.
  function drawTrails() {
    for (const m of motes) {
      if (m.trail.length < 2) continue;
      const rgb = hexToRgb(m.color).join(",");
      const cx = m.x + m.box / 2, cy = m.y + m.box / 2;
      const pts = [...m.trail, { x: cx, y: cy }];
      for (let i = 0; i < pts.length - 1; i++) {
        const segAlpha = 0.22 * (i / (pts.length - 1)); // oldest end near-zero, fades in toward the tile
        glowStroke(() => {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[i + 1].x, pts[i + 1].y);
        }, rgb, 1, 4, segAlpha);
      }
    }
  }

  // Connecting line between two tiles drifting close together, like a bond
  // forming — brightens as they approach, and cuts off cleanly the moment
  // their tiles are close enough to actually touch, rather than lingering
  // as a fading line after they've already collided.
  const BOND_DIST = 140;
  function drawBonds() {
    for (let i = 0; i < motes.length; i++) {
      const a = motes[i];
      const ax = a.x + a.box / 2, ay = a.y + a.box / 2;
      for (let j = i + 1; j < motes.length; j++) {
        const b = motes[j];
        const bx = b.x + b.box / 2, by = b.y + b.box / 2;
        const dist = Math.hypot(ax - bx, ay - by);
        if (dist >= BOND_DIST) continue;

        // once they're close enough to actually touch, the bond is gone —
        // not just faint
        const touchDist = (a.box + b.box) / 2 + 4;
        if (dist <= touchDist) continue;

        // eased rather than linear, so the bond reads as visible well
        // before the last few pixels of approach, not just right at contact
        const strength = (BOND_DIST - dist) / (BOND_DIST - touchDist);
        const eased = Math.pow(strength, 0.6);

        const grad = ctx.createLinearGradient(ax, ay, bx, by);
        grad.addColorStop(0, a.color);
        grad.addColorStop(1, b.color);

        ctx.save();
        ctx.globalCompositeOperation = "lighter";
        ctx.strokeStyle = grad;
        ctx.lineCap = "round";

        // soft outer glow, then a crisp inner line — same two-layer idea
        // as the tiles' own glow, kept to just two passes so it stays
        // readable rather than turning into a bright blown-out beam
        ctx.globalAlpha = 0.26 * eased;
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();

        ctx.globalAlpha = 0.75 * eased;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();

        ctx.restore();
      }
    }
  }

  function drawMotes() {
    for (const m of motes) {
      // draw at rounded coordinates, not the raw float position — the
      // physics (m.x/m.y) stay smooth sub-pixel floats, but rendering
      // text and thin strokes at a constantly-shifting fractional pixel
      // offset is what was making the letters look like they were
      // twinkling. Snapping just the drawing position fixes that while
      // motion itself stays perfectly smooth.
      const dx = Math.round(m.x), dy = Math.round(m.y);

      // 1 right when a pulse starts, decaying to 0 over its duration —
      // drives both the bounce-flash and the search tie-in below
      let pulseBoost = 0;
      if (m.pulseDuration > 0) {
        const elapsed = performance.now() - m.pulseStart;
        pulseBoost = Math.max(0, 1 - elapsed / m.pulseDuration);
      }

      // soft ambient glow behind the tile — a gentle "radioactive" bloom,
      // scaled back so it reads as a background detail, not a spotlight.
      // Pulses brighter and wider briefly on impact or when searched.
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const hx = dx + m.box / 2, hy = dy + m.box / 2;
      const haloR = m.box * (1.15 + pulseBoost * 0.9);
      const halo = ctx.createRadialGradient(hx, hy, 0, hx, hy, haloR);
      halo.addColorStop(0, m.color);
      halo.addColorStop(0.4, m.color);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalAlpha = 0.22 + pulseBoost * 0.55;
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(hx, hy, haloR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // dark tile behind everything
      ctx.save();
      ctx.globalAlpha = 0.55;
      roundRectPath(dx, dy, m.box, m.box, 4);
      ctx.fillStyle = "rgba(13,10,24,0.9)";
      ctx.fill();
      ctx.restore();

      // neon glow around the border — thinner, tighter layers than before,
      // so the edge reads as a fine glowing line, not a thick colored band
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 3; i >= 1; i--) {
        ctx.globalAlpha = (0.11 * i) + pulseBoost * 0.18;
        ctx.lineWidth = 1 + i * 1.4;
        ctx.strokeStyle = m.color;
        roundRectPath(dx, dy, m.box, m.box, 4);
        ctx.stroke();
      }
      ctx.restore();

      // crisp border line + crisp glyph — thin stroke, alpha explicitly
      // pinned to 1 (belt-and-suspenders against any future alpha leak),
      // no shadow/blur on either
      ctx.save();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = m.color; ctx.lineWidth = 1;
      roundRectPath(dx, dy, m.box, m.box, 4);
      ctx.stroke();
      ctx.fillStyle = m.color;
      ctx.font = `bold ${Math.round(m.box * 0.33)}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(m.sym, dx + m.box / 2, dy + m.box / 2);
      ctx.restore();
    }
  }

  // Called from the site logic below whenever an element is searched — ties
  // the ambient background to what's actually happening on the site. If no
  // current tile already represents that element, one is repurposed so the
  // effect is always visible rather than a rare coincidence.
  window.pulseElementMote = function (sym) {
    if (!sym || motes.length === 0) return;
    let target = motes.find(m => m.sym === sym);
    if (!target) {
      target = motes[Math.floor(Math.random() * motes.length)];
      target.sym = sym;
      target.color = moteColor(sym);
      target.trail = [];
    }
    target.pulseStart = performance.now();
    target.pulseDuration = 1400;
  };

  function updateMotes() {
    moveMotes();
    resolveMoteCollisions();
    drawTrails();
    drawBonds();
    drawMotes();
  }

  function tick(t) {
    updateHolePosition();
    ctx.clearRect(0, 0, viewW, viewH);
    // Draw background stars
    ctx.save();
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.2 + 0.4 * twinkle;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore(); // undo the per-star alpha so it can't leak into what's drawn next
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
    if (typeof window.pulseElementMote === "function") window.pulseElementMote(hit.key);
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
