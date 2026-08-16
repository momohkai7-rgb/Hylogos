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

/* ===================== Search logic with Reliable Autocomplete Dropdown ===================== */
let searchDebounce = null;

if (els.search) {
  els.search.style.color = "#10FF78"; // Emerald Text

  // Create dropdown list container dynamically inside .horizon
  const horizonEl = els.search.closest(".horizon");
  const existingDropdown = horizonEl.querySelector(".search-dropdown");
  if (existingDropdown) existingDropdown.remove();

  const dropdownEl = document.createElement("div");
  dropdownEl.className = "search-dropdown";
  horizonEl.appendChild(dropdownEl);

  function getMatchingSuggestions(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    
    const matches = [];
    const maxResults = 6;

    // 1. Search Elements
    if (typeof ELEMENTS !== "undefined") {
      for (const [sym, el] of Object.entries(ELEMENTS)) {
        if (sym.toLowerCase().includes(q) || el.name.toLowerCase().includes(q)) {
          matches.push({ label: `${el.name} (${sym})`, type: 'element', queryKey: sym });
        }
      }
    }

    // 2. Search Molecules
    if (typeof MOLECULES !== "undefined") {
      for (const [key, mol] of Object.entries(MOLECULES)) {
        if (key.toLowerCase().includes(q) || mol.name.toLowerCase().includes(q) || mol.formula.toLowerCase().includes(q)) {
          matches.push({ label: `${mol.name} (${mol.formula})`, type: 'molecule', queryKey: key });
        }
      }
    }

    // 3. Search Alloys
    if (typeof ALLOYS !== "undefined") {
      for (const [key, alloy] of Object.entries(ALLOYS)) {
        if (key.toLowerCase().includes(q) || alloy.name.toLowerCase().includes(q) || alloy.formula.toLowerCase().includes(q)) {
          matches.push({ label: `${alloy.name} (${alloy.formula})`, type: 'alloy', queryKey: key });
        }
      }
    }

    // Deduplicate
    const unique = [];
    const seenLabels = new Set();
    for (const m of matches) {
      if (!seenLabels.has(m.label)) {
        seenLabels.add(m.label);
        unique.push(m);
      }
    }
    return unique.slice(0, maxResults);
  }

  function hideDropdown() {
    dropdownEl.classList.remove("visible");
  }

  function renderDropdown(items) {
    if (!items.length) {
      hideDropdown();
      return;
    }

    dropdownEl.innerHTML = "";
    items.forEach(item => {
      const div = document.createElement("div");
      div.className = "search-dropdown-item";
      div.innerHTML = `<span>${item.label}</span><span class="item-type">${item.type}</span>`;
      
      // Use mousedown to prevent blur from hiding it before click registers
      div.addEventListener("mousedown", (e) => {
        e.preventDefault();
        els.search.value = item.queryKey;
        hideDropdown();
        
        const hit = resolveQuery(item.queryKey);
        if (hit) {
          els.suggestions.textContent = `showing ${hit.data.name}…`;
          showSubject(hit);
        }
      });

      dropdownEl.appendChild(div);
    });

    dropdownEl.classList.add("visible");
  }

  els.search.addEventListener("input", () => {
    const val = els.search.value;
    clearTimeout(searchDebounce);
    
    if (!val.trim()) {
      hideDropdown();
      els.suggestions.textContent = "";
      return;
    }

    const suggestions = getMatchingSuggestions(val);
    renderDropdown(suggestions);

    const hit = (typeof resolveQuery === "function") ? resolveQuery(val) : null;
    els.suggestions.textContent = hit ? `showing ${hit.data.name}…` : "scanning...";
    
    if (hit) {
      searchDebounce = setTimeout(() => {
        showSubject(hit);
        hideDropdown();
      }, 300);
    }
  });

  els.search.addEventListener("blur", (e) => {
    if (!dropdownEl.contains(e.relatedTarget)) {
      hideDropdown();
    }
  });

  els.search.addEventListener("focus", () => {
    if (els.search.value.trim()) {
      const suggestions = getMatchingSuggestions(els.search.value);
      renderDropdown(suggestions);
    }
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
    if (typeof compound3dHideSpecsCard === "function") compound3dHideSpecsCard();
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

const ISOTOPES = {
    H:[{a:1,ab:"99.98%"},{a:2,ab:"0.02%",note:"deuterium"},{a:3,hl:"12.3 y",note:"tritium, radioactive"}],
    He:[{a:4,ab:"~100%"},{a:3,ab:"0.0001%"}],
    Li:[{a:7,ab:"92.4%"},{a:6,ab:"7.6%"}],
    Be:[{a:9,ab:"100%"}],
    B:[{a:11,ab:"80.1%"},{a:10,ab:"19.9%"}],
    C:[{a:12,ab:"98.9%"},{a:13,ab:"1.1%"},{a:14,hl:"5,730 y",note:"radiocarbon dating"}],
    N:[{a:14,ab:"99.6%"},{a:15,ab:"0.4%"}],
    O:[{a:16,ab:"99.76%"},{a:18,ab:"0.20%"},{a:17,ab:"0.04%"}],
    F:[{a:19,ab:"100%"}],
    Ne:[{a:20,ab:"90.5%"},{a:22,ab:"9.2%"},{a:21,ab:"0.3%"}],
    Na:[{a:23,ab:"100%"}],
    Mg:[{a:24,ab:"79%"},{a:26,ab:"11%"},{a:25,ab:"10%"}],
    Al:[{a:27,ab:"100%"}],
    Si:[{a:28,ab:"92.2%"},{a:29,ab:"4.7%"},{a:30,ab:"3.1%"}],
    P:[{a:31,ab:"100%"}],
    S:[{a:32,ab:"95%"},{a:34,ab:"4.2%"},{a:33,ab:"0.75%"}],
    Cl:[{a:35,ab:"75.8%"},{a:37,ab:"24.2%"}],
    Ar:[{a:40,ab:"99.6%"},{a:36,ab:"0.34%"},{a:38,ab:"0.06%"}],
    K:[{a:39,ab:"93.3%"},{a:41,ab:"6.7%"},{a:40,ab:"0.012%",hl:"1.25 billion y",note:"radioactive, K-Ar dating"}],
    Ca:[{a:40,ab:"96.9%"},{a:44,ab:"2.1%"},{a:42,ab:"0.6%"}],
    Sc:[{a:45,ab:"100%"}],
    Ti:[{a:48,ab:"73.7%"},{a:46,ab:"8.3%"},{a:47,ab:"7.4%"}],
    V:[{a:51,ab:"99.75%"},{a:50,ab:"0.25%",note:"radioactive, extremely long-lived"}],
    Cr:[{a:52,ab:"83.8%"},{a:53,ab:"9.5%"},{a:50,ab:"4.3%"}],
    Mn:[{a:55,ab:"100%"}],
    Fe:[{a:56,ab:"91.8%"},{a:54,ab:"5.8%"},{a:57,ab:"2.1%"}],
    Co:[{a:59,ab:"100%"}],
    Ni:[{a:58,ab:"68.1%"},{a:60,ab:"26.2%"},{a:62,ab:"3.6%"}],
    Cu:[{a:63,ab:"69.2%"},{a:65,ab:"30.8%"}],
    Zn:[{a:64,ab:"49.2%"},{a:66,ab:"27.7%"},{a:68,ab:"18.5%"}],
    Ga:[{a:69,ab:"60.1%"},{a:71,ab:"39.9%"}],
    Ge:[{a:74,ab:"36.7%"},{a:72,ab:"27.5%"},{a:70,ab:"20.5%"}],
    As:[{a:75,ab:"100%"}],
    Se:[{a:80,ab:"49.6%"},{a:78,ab:"23.8%"},{a:76,ab:"9.4%"}],
    Br:[{a:79,ab:"50.7%"},{a:81,ab:"49.3%"}],
    Kr:[{a:84,ab:"57%"},{a:86,ab:"17.3%"},{a:82,ab:"11.6%"}],
    Rb:[{a:85,ab:"72.2%"},{a:87,ab:"27.8%",note:"radioactive, ~49 billion y half-life"}],
    Sr:[{a:88,ab:"82.6%"},{a:86,ab:"9.9%"},{a:87,ab:"7.0%"}],
    Y:[{a:89,ab:"100%"}],
    Zr:[{a:90,ab:"51.5%"},{a:94,ab:"17.4%"},{a:92,ab:"17.1%"}],
    Nb:[{a:93,ab:"100%"}],
    Mo:[{a:98,ab:"24.1%"},{a:96,ab:"16.7%"},{a:95,ab:"15.9%"}],
    Tc:[{a:98,hl:"4.2 million y",note:"no stable isotopes"},{a:99,hl:"211,000 y",note:"used in nuclear medicine"}],
    Ru:[{a:102,ab:"31.6%"},{a:104,ab:"18.6%"},{a:101,ab:"17.1%"}],
    Rh:[{a:103,ab:"100%"}],
    Pd:[{a:106,ab:"27.3%"},{a:108,ab:"26.5%"},{a:105,ab:"22.3%"}],
    Ag:[{a:107,ab:"51.8%"},{a:109,ab:"48.2%"}],
    Cd:[{a:114,ab:"28.7%"},{a:112,ab:"24.1%"},{a:111,ab:"12.8%"}],
    In:[{a:115,ab:"95.7%",note:"technically radioactive, half-life exceeds the age of the universe"},{a:113,ab:"4.3%"}],
    Sn:[{a:120,ab:"32.6%"},{a:118,ab:"24.2%"},{a:116,ab:"14.5%",note:"tin has more stable isotopes than any other element"}],
    Sb:[{a:121,ab:"57.2%"},{a:123,ab:"42.8%"}],
    Te:[{a:130,ab:"34.1%"},{a:128,ab:"31.7%"},{a:126,ab:"18.8%"}],
    I:[{a:127,ab:"100%"}],
    Xe:[{a:132,ab:"26.9%"},{a:129,ab:"26.4%"},{a:131,ab:"21.2%"}],
    Cs:[{a:133,ab:"100%"}],
    Ba:[{a:138,ab:"71.7%"},{a:137,ab:"11.2%"},{a:136,ab:"7.9%"}],
    La:[{a:139,ab:"99.9%"},{a:138,ab:"0.09%",note:"radioactive, extremely long-lived"}],
    Ce:[{a:140,ab:"88.4%"},{a:142,ab:"11.1%"}],
    Pr:[{a:141,ab:"100%"}],
    Nd:[{a:142,ab:"27.2%"},{a:144,ab:"23.8%",note:"slightly radioactive"},{a:146,ab:"17.2%"}],
    Pm:[{a:145,hl:"17.7 y",note:"no stable isotopes"},{a:147,hl:"2.6 y"}],
    Sm:[{a:152,ab:"26.8%"},{a:154,ab:"22.8%"},{a:147,ab:"15.0%",note:"radioactive, very long-lived"}],
    Eu:[{a:153,ab:"52.2%"},{a:151,ab:"47.8%"}],
    Gd:[{a:158,ab:"24.8%"},{a:160,ab:"21.9%"},{a:156,ab:"20.5%"}],
    Tb:[{a:159,ab:"100%"}],
    Dy:[{a:164,ab:"28.3%"},{a:162,ab:"25.5%"},{a:163,ab:"24.9%"}],
    Ho:[{a:165,ab:"100%"}],
    Er:[{a:166,ab:"33.6%"},{a:168,ab:"26.8%"},{a:167,ab:"22.9%"}],
    Tm:[{a:169,ab:"100%"}],
    Yb:[{a:174,ab:"31.8%"},{a:172,ab:"21.8%"},{a:173,ab:"16.1%"}],
    Lu:[{a:175,ab:"97.4%"},{a:176,ab:"2.6%",note:"radioactive, used in dating"}],
    Hf:[{a:180,ab:"35.1%"},{a:178,ab:"27.3%"},{a:177,ab:"18.6%"}],
    Ta:[{a:181,ab:"99.99%"},{a:180,ab:"0.01%",note:"rare isomer, one of the rarest stable isotopes known"}],
    W:[{a:184,ab:"30.6%"},{a:186,ab:"28.4%"},{a:182,ab:"26.5%"}],
    Re:[{a:187,ab:"62.6%",note:"radioactive, ~41 billion y half-life"},{a:185,ab:"37.4%"}],
    Os:[{a:192,ab:"41.0%"},{a:190,ab:"26.4%"},{a:189,ab:"16.2%"}],
    Ir:[{a:193,ab:"62.7%"},{a:191,ab:"37.3%"}],
    Pt:[{a:195,ab:"33.8%"},{a:194,ab:"32.9%"},{a:196,ab:"25.2%"}],
    Au:[{a:197,ab:"100%"}],
    Hg:[{a:202,ab:"29.7%"},{a:200,ab:"23.1%"},{a:199,ab:"16.9%"}],
    Tl:[{a:205,ab:"70.5%"},{a:203,ab:"29.5%"}],
    Pb:[{a:208,ab:"52.4%"},{a:206,ab:"24.1%"},{a:207,ab:"22.1%",note:"all stable - endpoints of decay chains"}],
    Bi:[{a:209,ab:"100%",note:"technically radioactive, half-life far longer than the age of the universe"}],
    Po:[{a:209,hl:"124 y",note:"no stable isotopes"},{a:210,hl:"138 d"}],
    At:[{a:210,hl:"8.1 h",note:"no stable isotopes - one of the rarest natural elements"},{a:211,hl:"7.2 h"}],
    Rn:[{a:222,hl:"3.8 d",note:"no stable isotopes"}],
    Fr:[{a:223,hl:"22 min",note:"most stable known isotope; no stable isotopes exist"}],
    Ra:[{a:226,hl:"1,600 y"},{a:228,hl:"5.75 y"}],
    Ac:[{a:227,hl:"21.8 y"}],
    Th:[{a:232,ab:"~100%",note:"radioactive, ~14 billion y half-life - essentially primordial"}],
    Pa:[{a:231,hl:"32,760 y"}],
    U:[{a:238,ab:"99.3%",hl:"4.5 billion y"},{a:235,ab:"0.72%",hl:"700 million y",note:"fissile"}],
    Np:[{a:237,hl:"2.1 million y",note:"most stable known isotope"}],
    Pu:[{a:239,hl:"24,100 y",note:"fissile"},{a:244,hl:"80 million y",note:"most stable known isotope"}],
    Am:[{a:243,hl:"7,370 y",note:"most stable known isotope"}],
    Cm:[{a:247,hl:"15.6 million y",note:"most stable known isotope"}],
    Bk:[{a:247,hl:"1,380 y",note:"most stable known isotope"}],
    Cf:[{a:251,hl:"898 y",note:"most stable known isotope"}],
    Es:[{a:252,hl:"472 d",note:"most stable known isotope"}],
    Fm:[{a:257,hl:"100.5 d",note:"most stable known isotope"}],
    Md:[{a:258,hl:"51 d",note:"most stable known isotope"}],
    No:[{a:259,hl:"~58 min",note:"most stable known isotope"}],
    Lr:[{a:266,hl:"~11 h",note:"most stable known isotope"}],
    Rf:[{a:267,hl:"~1.3 h",note:"most stable known isotope"}],
    Db:[{a:268,hl:"~29 h",note:"most stable known isotope"}],
    Sg:[{a:269,hl:"~14 min",note:"most stable known isotope"}],
    Bh:[{a:270,hl:"~1 min",note:"most stable known isotope"}],
    Hs:[{a:269,hl:"~16 s",note:"most stable known isotope"}],
    Mt:[{a:278,hl:"~4.5 s",note:"most stable known isotope"}],
    Ds:[{a:281,hl:"~12.7 s",note:"most stable known isotope"}],
    Rg:[{a:282,hl:"~130 s",note:"most stable known isotope"}],
    Cn:[{a:285,hl:"~29 s",note:"most stable known isotope"}],
    Nh:[{a:286,hl:"~10 s",note:"most stable known isotope"}],
    Fl:[{a:289,hl:"~1.9 s",note:"most stable known isotope"}],
    Mc:[{a:290,hl:"~0.65 s",note:"most stable known isotope"}],
    Lv:[{a:293,hl:"~0.06 s",note:"most stable known isotope"}],
    Ts:[{a:294,hl:"~0.08 s",note:"most stable known isotope"}],
    Og:[{a:294,hl:"~0.0007 s",note:"most stable known isotope"}],
  };

// compact one-line isotope summary for a fact-stat value, e.g.
// "56 (91.8%), 54 (5.8%), 57 (2.1%)" or "223 (t½ 22 min)"
function isotopeSummary(sym) {
  const list = ISOTOPES[sym];
  if (!list || !list.length) return null;
  return list.map(iso => {
    const detail = iso.ab ? iso.ab : (iso.hl ? `t½ ${iso.hl}` : '');
    return `${iso.a} (${detail})`;
  }).join(', ');
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
      factStat("Phase", e.phase),
      factStat("Electronegativity", e.en == null ? "not measured" : e.en),
      factStat("Atomic radius", e.radius == null ? "not measured" : `${e.radius} pm`),
      isotopeSummary(hit.key) ? factStat("Notable isotopes", isotopeSummary(hit.key)) : ""
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
// ── data expansion batch 4: 18 molecules + 18 alloys ──

MOLECULE_BLURBS.N2O4 = "Exists in equilibrium with reddish-brown NO2 gas — the balance between them shifts visibly with temperature, a classic chemistry demonstration.";
MOLECULE_BLURBS.BCL3 = "A reactive gas that fumes in moist air; used as a catalyst and to make ultra-pure boron for semiconductors.";
MOLECULE_BLURBS.BBR3 = "A fuming, corrosive liquid used in organic chemistry to cleave certain ether bonds.";
MOLECULE_BLURBS.SBCL3 = "A fuming solid used as a catalyst and as a starting material for other antimony compounds.";
MOLECULE_BLURBS.KRF2 = "One of the very few known krypton compounds — krypton is even less reactive than xenon, so this is a genuine chemical rarity.";
MOLECULE_BLURBS.HBRO = "A weak, unstable acid formed when bromine dissolves in water; used as a mild disinfectant and bleaching agent.";
MOLECULE_BLURBS.SNCL2 = "A common reducing agent in chemistry labs, and historically used to make the deep red pigment 'Purple of Cassius.'";
MOLECULE_BLURBS.HIO3 = "A strong acid and oxidizer used in the classic 'iodine clock' chemistry demonstration.";
MOLECULE_BLURBS.CACL2 = "Highly effective at melting ice in extreme cold; also used as a drying agent and to firm up canned vegetables.";
MOLECULE_BLURBS.NAF = "Added to some public water supplies and most toothpaste to help prevent tooth decay.";
MOLECULE_BLURBS.NABR = "Once prescribed as a sedative, much like potassium bromide, before modern medications replaced it.";
MOLECULE_BLURBS.NAI = "Added to table salt in some countries to prevent iodine deficiency; also used in imaging-grade scintillation crystals.";
MOLECULE_BLURBS.MGBR2 = "Used in some pharmaceutical synthesis and as a catalyst in certain organic reactions.";
MOLECULE_BLURBS.ZNCL2 = "A key ingredient in soldering flux, helping molten solder wet and bond cleanly to metal surfaces.";
MOLECULE_BLURBS.PBCL2 = "A dense white solid once used as a pigment before its toxicity led to it being phased out.";
MOLECULE_BLURBS.CDO = "A semiconductor material used in some thin-film solar cells and specialized optical coatings.";
MOLECULE_BLURBS.C3H7OH = "A common solvent and rubbing-alcohol alternative, also used as a chemical feedstock for other propanol-based products.";
MOLECULE_BLURBS.C3H6 = "The building block of polypropylene, one of the most widely produced plastics in the world.";

MOLECULES.N2O4 = { name: "Dinitrogen tetroxide", formula: "N₂O₄", atoms: [{el:"N",pos:[0.875,0,0]},{el:"N",pos:[-0.875,0,0]},{el:"O",pos:[1.47,1.03,0]},{el:"O",pos:[1.47,-1.03,0]},{el:"O",pos:[-1.47,1.03,0]},{el:"O",pos:[-1.47,-1.03,0]}], bonds: [[0,1],[0,2],[0,3],[1,4],[1,5]] };
MOLECULES.BCL3 = { name: "Boron trichloride", formula: "BCl₃", atoms: [{el:"B",pos:[0,0,0]},{el:"Cl",pos:[0,1.75,0]},{el:"Cl",pos:[-1.516,-0.875,0]},{el:"Cl",pos:[1.516,-0.875,0]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.BBR3 = { name: "Boron tribromide", formula: "BBr₃", atoms: [{el:"B",pos:[0,0,0]},{el:"Br",pos:[0,1.89,0]},{el:"Br",pos:[-1.637,-0.945,0]},{el:"Br",pos:[1.637,-0.945,0]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.SBCL3 = { name: "Antimony trichloride", formula: "SbCl₃", atoms: [{el:"Sb",pos:[0,0,0]},{el:"Cl",pos:[2.152,0,-0.615]},{el:"Cl",pos:[-1.076,1.863,-0.615]},{el:"Cl",pos:[-1.076,-1.863,-0.615]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.KRF2 = { name: "Krypton difluoride", formula: "KrF₂", atoms: [{el:"Kr",pos:[0,0,0]},{el:"F",pos:[1.89,0,0]},{el:"F",pos:[-1.89,0,0]}], bonds: [[0,1],[0,2]] };
MOLECULES.HBRO = { name: "Hypobromous acid", formula: "HBrO", atoms: [{el:"O",pos:[0,0,0]},{el:"H",pos:[-0.833,-0.499,0]},{el:"Br",pos:[-1.83,0,0]}], bonds: [[0,1],[0,2]] };
MOLECULES.SNCL2 = { name: "Tin(II) chloride", formula: "SnCl₂", atoms: [{el:"Sn",pos:[0,0,0]},{el:"Cl",pos:[0.965,2.174,0]},{el:"Cl",pos:[-0.965,2.174,0]}], bonds: [[0,1],[0,2]] };
MOLECULES.HIO3 = { name: "Iodic acid", formula: "HIO₃", atoms: [{el:"I",pos:[0,0,0]},{el:"O",pos:[1.045,1.045,1.045]},{el:"O",pos:[1.045,-1.045,-1.045]},{el:"O",pos:[-1.097,1.097,-1.097]},{el:"H",pos:[-1.634,1.433,-1.433]}], bonds: [[0,1],[0,2],[0,3],[3,4]] };
MOLECULES.CACL2 = { name: "Calcium chloride", formula: "CaCl₂", atoms: [{el:"Ca",pos:[1.255,0,0]},{el:"Cl",pos:[-1.255,0,0]}], bonds: [[0,1]] };
MOLECULES.NAF = { name: "Sodium fluoride", formula: "NaF", atoms: [{el:"Na",pos:[1.155,0,0]},{el:"F",pos:[-1.155,0,0]}], bonds: [[0,1]] };
MOLECULES.NABR = { name: "Sodium bromide", formula: "NaBr", atoms: [{el:"Na",pos:[1.25,0,0]},{el:"Br",pos:[-1.25,0,0]}], bonds: [[0,1]] };
MOLECULES.NAI = { name: "Sodium iodide", formula: "NaI", atoms: [{el:"Na",pos:[1.355,0,0]},{el:"I",pos:[-1.355,0,0]}], bonds: [[0,1]] };
MOLECULES.MGBR2 = { name: "Magnesium bromide", formula: "MgBr₂", atoms: [{el:"Mg",pos:[1.31,0,0]},{el:"Br",pos:[-1.31,0,0]}], bonds: [[0,1]] };
MOLECULES.ZNCL2 = { name: "Zinc chloride", formula: "ZnCl₂", atoms: [{el:"Zn",pos:[1.15,0,0]},{el:"Cl",pos:[-1.15,0,0]}], bonds: [[0,1]] };
MOLECULES.PBCL2 = { name: "Lead(II) chloride", formula: "PbCl₂", atoms: [{el:"Pb",pos:[1.265,0,0]},{el:"Cl",pos:[-1.265,0,0]}], bonds: [[0,1]] };
MOLECULES.CDO = { name: "Cadmium oxide", formula: "CdO", atoms: [{el:"Cd",pos:[1.175,0,0]},{el:"O",pos:[-1.175,0,0]}], bonds: [[0,1]] };
MOLECULES.C3H7OH = { name: "1-Propanol", formula: "C₃H₇OH", atoms: [{el:"C",pos:[0,0,0]},{el:"C",pos:[0.889,0.889,0.889]},{el:"C",pos:[0.514,1.916,1.942]},{el:"O",pos:[1.541,1.842,2.968]},{el:"H",pos:[-0.63,0.63,-0.63]},{el:"H",pos:[-0.63,-0.63,0.63]},{el:"H",pos:[0.63,-0.63,-0.63]},{el:"H",pos:[0.259,0.259,1.629]},{el:"H",pos:[1.629,0.259,0.259]},{el:"H",pos:[-0.407,2.545,1.503]},{el:"H",pos:[1.253,2.309,2.433]},{el:"H",pos:[1.964,2.686,3.05]}], bonds: [[0,1],[1,2],[2,3],[0,4],[0,5],[0,6],[1,7],[1,8],[2,9],[2,10],[3,11]] };
MOLECULES.C3H6 = { name: "Propene", formula: "C₃H₆", atoms: [{el:"C",pos:[0,0,0]},{el:"C",pos:[1.34,0,0]},{el:"C",pos:[1.884,0.889,0.889]},{el:"H",pos:[-0.6,0.94,0]},{el:"H",pos:[-0.6,-0.94,0]},{el:"H",pos:[1.74,-1,0.3]},{el:"H",pos:[1.254,0.259,1.629]},{el:"H",pos:[2.513,0.259,0.259]},{el:"H",pos:[2.373,1.579,0.201]}], bonds: [[0,1],[1,2],[0,3],[0,4],[1,5],[2,6],[2,7],[2,8]] };

ALLOYS.PERMALLOY = { name:"Permalloy", formula:"Ni–Fe", blurb:"A highly magnetically permeable alloy used in transformer cores and magnetic shielding for sensitive electronics.", elements:{Ni:80,Fe:20}, properties:{density:"8.7 g/cm³", meltingPoint:"1450–1500 °C"} };
ALLOYS.SUPERMALLOY = { name:"Supermalloy", formula:"Ni–Fe–Mo", blurb:"An even more magnetically permeable cousin of permalloy, developed for the most sensitive magnetic shielding applications.", elements:{Ni:79,Fe:16,Mo:5}, properties:{density:"8.8 g/cm³", meltingPoint:"1400–1450 °C"} };
ALLOYS.SAMARIUM_COBALT = { name:"Samarium-cobalt magnet", formula:"Sm–Co", blurb:"Retains its magnetism at much higher temperatures than neodymium magnets, so it's used in jet engines and motors that run hot.", elements:{Co:66,Sm:34}, properties:{density:"8.2–8.4 g/cm³", meltingPoint:"1100 °C"} };
ALLOYS.FERRONICKEL = { name:"Ferronickel", formula:"Fe–Ni", blurb:"A bulk feedstock alloy smelted straight from nickel ore, added to molten steel as the main source of nickel for stainless steel.", elements:{Fe:80,Ni:20}, properties:{density:"8.1 g/cm³", meltingPoint:"1430–1450 °C"} };
ALLOYS.COPPER_TUNGSTEN = { name:"Copper-tungsten", formula:"Cu–W", blurb:"Combines copper's conductivity with tungsten's heat resistance — used in electrical contacts that must survive repeated arcing.", elements:{W:80,Cu:20}, properties:{density:"15.2–15.7 g/cm³", meltingPoint:">1084 °C (Cu melts; W remains solid)"} };
ALLOYS.SILVER_TUNGSTEN = { name:"Silver-tungsten", formula:"Ag–W", blurb:"Used in high-current switching contacts, where tungsten resists arc erosion and silver keeps electrical resistance low.", elements:{W:75,Ag:25}, properties:{density:"13.5–14.5 g/cm³", meltingPoint:">961 °C (Ag melts; W remains solid)"} };
ALLOYS.PLATINUM_RHODIUM = { name:"Platinum-rhodium", formula:"Pt–Rh", blurb:"The alloy pair behind Type R and Type S thermocouples, prized for stable, accurate readings at very high temperatures.", elements:{Pt:87,Rh:13}, properties:{density:"19.6–20.7 g/cm³", meltingPoint:"1850–1900 °C"} };
ALLOYS.WOOTZ_STEEL = { name:"Wootz steel", formula:"Fe–C", blurb:"An ancient high-carbon steel from India, exported for centuries and worked into the legendary patterns of Damascus blades.", elements:{Fe:98.3,C:1.7}, properties:{density:"7.7–7.8 g/cm³", tensileStrength:"~700–800 MPa"} };
ALLOYS.GALFAN = { name:"Galfan", formula:"Zn–Al", blurb:"A zinc-aluminum coating that outlasts traditional galvanizing, giving steel sheet extra corrosion resistance in harsh environments.", elements:{Zn:95,Al:5}, properties:{density:"6.6–6.7 g/cm³", meltingPoint:"380–400 °C"} };
ALLOYS.WHITE_BRONZE = { name:"White bronze", formula:"Cu–Sn–Zn", blurb:"A pale, silvery-toned bronze variant historically used for decorative castings and mirror-bright fittings.", elements:{Cu:60,Sn:30,Zn:10}, properties:{density:"8.6–8.8 g/cm³", meltingPoint:"850–950 °C"} };
ALLOYS.RED_BRASS = { name:"Red brass", formula:"Cu–Zn–Sn", blurb:"A high-copper brass with a warm reddish hue, valued for corrosion resistance in plumbing fittings and marine hardware.", elements:{Cu:85,Zn:10,Sn:5}, properties:{density:"8.7–8.8 g/cm³", tensileStrength:"260–340 MPa"} };
ALLOYS.MANGANESE_BRONZE = { name:"Manganese bronze", formula:"Cu–Zn–Mn", blurb:"Despite the name it's really a high-strength brass; used for ship propellers and heavy-duty gear blanks.", elements:{Cu:58,Zn:39,Mn:2,Fe:1}, properties:{density:"8.3–8.5 g/cm³", tensileStrength:"440–615 MPa"} };
ALLOYS.ALUMINUM_BRASS = { name:"Aluminum brass", formula:"Cu–Zn–Al", blurb:"A small addition of aluminum dramatically improves this brass's resistance to corrosion in seawater condenser tubing.", elements:{Cu:76,Zn:22,Al:2}, properties:{density:"8.33 g/cm³", tensileStrength:"400–600 MPa"} };
ALLOYS.TOMBAC = { name:"Tombac", formula:"Cu–Zn", blurb:"A high-copper brass with a gold-like color, historically used for cheap jewelry and, notably, for the 1943 Belgian franc coin.", elements:{Cu:85,Zn:15}, properties:{density:"8.7–8.8 g/cm³", meltingPoint:"1000–1030 °C"} };
ALLOYS.ARGENTIUM_SILVER = { name:"Argentium silver", formula:"Ag–Cu–Ge", blurb:"A modern sterling-silver alternative with added germanium, formulated to resist the tarnishing that plagues ordinary sterling.", elements:{Ag:93.5,Cu:5.5,Ge:1}, properties:{density:"10.4 g/cm³", meltingPoint:"890–900 °C"} };
ALLOYS.PALLADIUM_SILVER = { name:"Palladium-silver", formula:"Pd–Ag", blurb:"A biocompatible alloy used in dental crowns and bridges, chosen for its stability and resistance to tarnish in the mouth.", elements:{Ag:70,Pd:30}, properties:{density:"10.9–11.3 g/cm³", meltingPoint:"1150–1250 °C"} };
ALLOYS.NIOBIUM_TITANIUM = { name:"Niobium-titanium", formula:"Nb–Ti", blurb:"The standard superconducting wire alloy, wound into the powerful magnet coils inside MRI machines and particle accelerators.", elements:{Nb:47,Ti:53}, properties:{density:"6.5–6.7 g/cm³", meltingPoint:"~1950–2130 °C"} };
ALLOYS.BABBITT_LEAD = { name:"Lead-based babbitt", formula:"Pb–Sb–Sn", blurb:"A cheaper, softer bearing alloy than tin-based babbitt, historically common in heavy industrial and railway machinery.", elements:{Pb:80,Sb:15,Sn:5}, properties:{density:"9.7–10.1 g/cm³", meltingPoint:"240–260 °C"} };
