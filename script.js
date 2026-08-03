/* ===================== Cosmic backdrop (stars + black hole = search) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const VOID = "5,4,10";

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
      radius: hole.r * (2.6 + Math.random() * 1.5),
      speed: 0.15 + Math.random() * 0.13,
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

  // The black hole is centered exactly on the real search input, so it always
  // lines up with it — including through scrolling, since this runs every frame.
  function updateHolePosition() {
    const rect = searchEl.getBoundingClientRect();
    hole.cx = rect.left + rect.width / 2;
    hole.cy = rect.top + rect.height / 2;
    hole.r = rect.width / 2;
  }

  const WHITE = "255,255,255";
  const GOLD = "255,214,90";
  const ORANGE = "255,130,35";
  const MAGENTA = "255,45,130";
  const PURPLE = "175,55,225";

  // The ring is drawn as a true annulus in a "squashed circle" space: rotate,
  // then squash vertically, then draw plain circles — canvas warps both the
  // circles and any gradient defined in that space into a correctly tilted
  // ellipse for free, so color and shape are always in perfect lockstep (no
  // per-band seams to keep aligned, unlike painting nested solid shapes).
  const DISK_SQUASH = 0.42;
  const RING_INNER_MULT = 0.90; // stays well inside the void's radius so the
  const RING_OUTER_MULT = 2.4;  // two halves always overlap it with no gap

  function drawStars(t) {
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.5 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.28 + 0.4 * twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // The disk's outline is a softly undulating ring, not a sharp geometric
  // shape — every boundary below is built from sine waves, which are smooth
  // everywhere by construction, so there is nowhere for a hard corner to hide.
  const DISK_TILT = -0.47; // ~ -27 degrees

  // A gentle, organic wobble around a base radius. Only integer harmonics of
  // `angle` are used so the wave always closes perfectly at angle 0 / 2*PI —
  // fractional frequencies would leave a visible seam where the loop meets
  // itself. Only the phase drifts with time, which animates the wobble
  // without ever reintroducing that seam. The outer edge is given a larger
  // amplitude than the inner edge so the ring reads as a flowing ribbon of
  // varying width rather than a uniform-thickness tube offset in parallel.
  function ringWobble(angle, t, outer) {
    const amp = outer ? 0.07 : 0.03;
    const seed = outer ? 0 : 12;
    const n = Math.sin(3 * angle + t * 0.00018 + seed)
      + 0.55 * Math.sin(5 * angle - t * 0.00026 + seed * 1.7)
      + 0.3 * Math.sin(2 * angle + t * 0.00012 + seed * 2.3);
    return 1 + (n / 1.85) * amp;
  }

  // One continuous radial gradient carries the disk from white-hot core
  // through gold, orange, and magenta out to violet, fading to nothing well
  // before the outer edge — so the fill itself vanishes into transparency
  // rather than the shape ever needing a visible boundary line.
  function ringGradient(rInner, rOuter) {
    const g = ctx.createRadialGradient(0, 0, rInner, 0, 0, rOuter);
    g.addColorStop(0,    `rgba(${WHITE},1)`);
    g.addColorStop(0.20, `rgba(${GOLD},1)`);
    g.addColorStop(0.42, `rgba(${ORANGE},0.98)`);
    g.addColorStop(0.64, `rgba(${MAGENTA},0.92)`);
    g.addColorStop(0.84, `rgba(${PURPLE},0.75)`);
    g.addColorStop(1,    `rgba(${PURPLE},0)`);
    return g;
  }

  const RING_POINTS = 200; // dense enough that the wobble never facets

  // Traces the outer boundary, then the inner boundary, as two closed loops
  // and fills between them with the evenodd rule — the standard way to punch
  // a hole in a shape, and it doesn't care which direction either loop winds.
  function drawRingFill(t, motionRate) {
    const { r } = hole;
    const rInner = r * RING_INNER_MULT;
    const rOuter = r * RING_OUTER_MULT;
    const tw = t * motionRate;

    ctx.beginPath();
    for (let i = 0; i <= RING_POINTS; i++) {
      const a = (i / RING_POINTS) * Math.PI * 2;
      const rad = rOuter * ringWobble(a, tw, true);
      const x = rad * Math.cos(a), y = rad * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    for (let i = 0; i <= RING_POINTS; i++) {
      const a = (i / RING_POINTS) * Math.PI * 2;
      const rad = rInner * ringWobble(a, tw, false);
      const x = rad * Math.cos(a), y = rad * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();

    ctx.fillStyle = ringGradient(rInner, rOuter);
    ctx.fill("evenodd");
  }

  // Local (pre-transform) position of a point on the ring: `angle` runs all
  // the way around, `radiusFrac` is 0 at the inner edge and 1 at the outer
  // edge. Reuses ringWobble so embers sit exactly on the same wobbling
  // boundary the fill itself draws, instead of a separate idealized path.
  function ringLocalPoint(angle, radiusFrac, t) {
    const { r } = hole;
    const rInner = r * RING_INNER_MULT * ringWobble(angle, t, false);
    const rOuter = r * RING_OUTER_MULT * ringWobble(angle, t, true);
    const rad = rInner + (rOuter - rInner) * radiusFrac;
    return { x: rad * Math.cos(angle), y: rad * Math.sin(angle) };
  }

  // Manually replays the translate -> rotate -> squash stack the ring fill is
  // drawn under, so a particle's screen position lines up with the ring
  // exactly. Particles are drawn in absolute screen space rather than inside
  // that transform so squashing the ellipse never squashes the particles
  // themselves into little ovals.
  function ringToScreen(x, y) {
    const ys = y * DISK_SQUASH;
    const cos = Math.cos(DISK_TILT), sin = Math.sin(DISK_TILT);
    return { x: hole.cx + (x * cos - ys * sin), y: hole.cy + (x * sin + ys * cos) };
  }

  function lerpColor(c1, c2, f) {
    const a = c1.split(",").map(Number), b = c2.split(",").map(Number);
    return `${Math.round(a[0] + (b[0] - a[0]) * f)},${Math.round(a[1] + (b[1] - a[1]) * f)},${Math.round(a[2] + (b[2] - a[2]) * f)}`;
  }

  // Mirrors ringGradient's stops so an ember at a given radiusFrac always
  // matches the disk color surrounding it, instead of looking pasted on.
  const RING_STOPS = [[0, WHITE], [0.20, GOLD], [0.42, ORANGE], [0.64, MAGENTA], [0.84, PURPLE], [1, PURPLE]];
  function ringColorAt(frac) {
    for (let i = 0; i < RING_STOPS.length - 1; i++) {
      const [f0, c0] = RING_STOPS[i], [f1, c1] = RING_STOPS[i + 1];
      if (frac <= f1) return lerpColor(c0, c1, f1 === f0 ? 0 : (frac - f0) / (f1 - f0));
    }
    return PURPLE;
  }

  // Embers spin faster the closer they orbit to the void — real accretion
  // disks rotate this way (Keplerian shear), and here it's what makes the
  // inner rim read as energetic and the outer edge as lazy drifting, rather
  // than the whole ring turning like a solid, lifeless disc.
  const EMBER_BASE_SPEED = 0.00026;
  const EMBER_COUNT = 48;
  const FLOW_PARTICLES = Array.from({ length: EMBER_COUNT }, () => ({
    angle0: Math.random() * Math.PI * 2,
    radiusFrac: Math.random(),
    wobbleSeed: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.6 + Math.random() * 0.8,
    flickerSeed: Math.random() * Math.PI * 2,
    size: 0.5 + Math.random() * 0.6,
  }));

  function emberAngleAndFrac(p, tw) {
    const angSpeed = EMBER_BASE_SPEED / (0.32 + p.radiusFrac);
    const angle = p.angle0 + tw * angSpeed;
    const frac = Math.min(1, Math.max(0,
      p.radiusFrac + 0.045 * Math.sin(tw * 0.0009 * p.wobbleSpeed + p.wobbleSeed)
    ));
    return { angle, frac };
  }

  // Each ember is drawn at its current spot plus two fading echoes just
  // behind it in time. Fast inner embers have moved further between echoes,
  // so they read as short glowing streaks; slow outer ones barely move and
  // stay soft dots — one mechanism naturally produces both, in place of
  // separately maintaining a streak system and a dot system.
  const EMBER_TRAILS = [
    { dt: 0, alpha: 1, size: 1 },
    { dt: 60, alpha: 0.5, size: 0.82 },
    { dt: 130, alpha: 0.22, size: 0.6 },
  ];

  function drawEmbers(t, motionRate, isFar) {
    const tw = t * motionRate;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const p of FLOW_PARTICLES) {
      const { frac } = emberAngleAndFrac(p, tw);
      const col = ringColorAt(frac);
      const flicker = 0.6 + 0.4 * Math.sin(tw * 0.0021 + p.flickerSeed);
      const baseSz = hole.r * 0.05 * p.size * (0.8 + 0.35 * (1 - frac));

      for (const tr of EMBER_TRAILS) {
        const sample = emberAngleAndFrac(p, tw - tr.dt);
        const pt = ringLocalPoint(sample.angle, sample.frac, tw - tr.dt);
        if ((pt.y < 0) !== isFar) continue;
        const scr = ringToScreen(pt.x, pt.y);
        const sz = baseSz * tr.size;
        const a = tr.alpha * flicker;
        const g = ctx.createRadialGradient(scr.x, scr.y, 0, scr.x, scr.y, sz);
        g.addColorStop(0, `rgba(${col},${(0.9 * a).toFixed(3)})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(scr.x, scr.y, sz, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  // Paints one half of the ring fill, clipped by a half-plane along the
  // disk's own long axis. Calling this once on each side of the void
  // (instead of drawing the whole ring in one pass) is what makes the void
  // sit BETWEEN the two halves rather than just stamped on top: the far half
  // disappears behind it, the near half is painted after and visibly
  // overlaps it, so the void reads as a sphere the ring wraps around instead
  // of a flat cutout. Embers are drawn separately (see drawEmbers' own isFar
  // check) since they need to stay outside this squashed coordinate space.
  function paintRingHalf(t, motionRate, isFar) {
    const { r } = hole;
    ctx.save();
    ctx.translate(hole.cx, hole.cy);
    ctx.rotate(DISK_TILT);
    ctx.scale(1, DISK_SQUASH);
    ctx.beginPath();
    const BIG = r * 60;
    if (isFar) ctx.rect(-BIG, -BIG, BIG * 2, BIG);
    else ctx.rect(-BIG, 0, BIG * 2, BIG);
    ctx.clip();
    drawRingFill(t, motionRate);
    ctx.restore();
  }

  // High-energy jets along the poles, perpendicular to the disk — a cool
  // white/blue contrast against the disk's warm glow, with brighter pulses
  // travelling outward so the beams read as energy streaming out, not a
  // static shape.
  function drawJets(t, motionRate, r) {
    const len = r * 2.6;
    const baseW = r * 0.16;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const dir of [-1, 1]) {
      const beam = ctx.createLinearGradient(0, 0, 0, dir * len);
      beam.addColorStop(0,    "rgba(225,240,255,0.5)");
      beam.addColorStop(0.15, "rgba(190,220,255,0.3)");
      beam.addColorStop(0.6,  "rgba(160,200,255,0.1)");
      beam.addColorStop(1,    "rgba(160,200,255,0)");
      ctx.fillStyle = beam;
      ctx.beginPath();
      ctx.moveTo(-baseW * 0.5, 0);
      ctx.lineTo(baseW * 0.5, 0);
      ctx.lineTo(baseW * 0.12, dir * len);
      ctx.lineTo(-baseW * 0.12, dir * len);
      ctx.closePath();
      ctx.fill();

      const pulses = 3;
      for (let i = 0; i < pulses; i++) {
        const s = ((t * 0.00045 * motionRate + i / pulses) % 1 + 1) % 1;
        const py = dir * len * s;
        const pw = baseW * (0.55 - 0.4 * s);
        const pulse = ctx.createRadialGradient(0, py, 0, 0, py, pw * 1.7);
        pulse.addColorStop(0, "rgba(255,255,255,0.55)");
        pulse.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = pulse;
        ctx.beginPath();
        ctx.arc(0, py, pw * 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  function drawHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    // flow keeps running under reduced-motion too, just slower — it's the
    // "gases and matter flowing" visual, not a decorative flourish
    const motionRate = reducedMotion ? 0.35 : 1;

    // wide ambient bloom
    const glow = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 3.2);
    glow.addColorStop(0, `rgba(${ORANGE},0.24)`);
    glow.addColorStop(0.55, `rgba(${PURPLE},0.13)`);
    glow.addColorStop(1, `rgba(${PURPLE},0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 3.2, 0, Math.PI * 2);
    ctx.fill();

    // far half of the ring — painted first, so the void (below) covers the
    // part of it that passes behind the sphere. RING_INNER_MULT keeps the
    // ring comfortably inside the void's radius at every angle, so there's
    // never a gap to paper over the way the old halo stroke had to.
    paintRingHalf(t, motionRate, true);
    drawEmbers(t, motionRate, true);

    // the void itself, now sitting BETWEEN the two ring halves instead of
    // on top of both — belt-and-suspenders under the real input's own
    // background too, so there's never a gap even for a stray frame
    const voidGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    voidGrad.addColorStop(0, `rgba(${VOID},1)`);
    voidGrad.addColorStop(0.85, `rgba(${VOID},1)`);
    voidGrad.addColorStop(1, `rgba(${VOID},0)`);
    ctx.fillStyle = voidGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.99, 0, Math.PI * 2);
    ctx.fill();

    // near half of the ring — painted on top of the void, so it visibly
    // overlaps the sphere instead of the sphere just sitting on top of it.
    // Its own bright inner gradient stop is what glows against the void;
    // no separate outline is drawn over the seam.
    paintRingHalf(t, motionRate, false);
    drawEmbers(t, motionRate, false);

    // polar jets — perpendicular to the disk, drawn last as an additive
    // glow so they read as energy on top rather than occluding anything
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(DISK_TILT);
    drawJets(t, motionRate, r);
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
      // orbiting-then-falling-in is the whole point of this visual, so it
      // keeps running under reduced-motion too, just gentler.
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
