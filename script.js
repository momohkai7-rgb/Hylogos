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
  const PURPLE = "175,55,225";

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

  // The disk's silhouette is a true lens/vesica shape — built from two large
  // overlapping circles, the way you'd construct it with a compass — which
  // gives genuinely sharp pointed tips, unlike a curve that just tapers a
  // radius (that can only ever round off, never truly come to a point).
  // Not animated: a real disk's outline doesn't spin like a coin from a fixed
  // viewing angle, only the material in it flows (the traveling dashes below).
  const DISK_TILT = -0.47; // ~ -27 degrees

  // Convert "how far the tips reach" (T) and "how thick through the middle" (w)
  // into the two-circle geometry that produces exactly that lens.
  function lensParams(T, w) {
    const R = (w + (T * T) / w) / 2;
    const D = ((T * T) / w - w) / 2;
    return { R, D };
  }

  function lensPath(T, w) {
    const { R, D } = lensParams(T, w);
    const theta1 = Math.asin(Math.min(0.999, D / R));
    ctx.beginPath();
    ctx.arc(0, -D, R, theta1, Math.PI - theta1, false);
    ctx.arc(0, D, R, Math.PI + theta1, Math.PI * 2 - theta1, false);
    ctx.closePath();
  }

  function lensBoundaryPoint(T, w, s) {
    const { R, D } = lensParams(T, w);
    const theta1 = Math.asin(Math.min(0.999, D / R));
    const span = Math.PI - 2 * theta1;
    if (s < 0.5) {
      const theta = theta1 + (s / 0.5) * span;
      return { x: R * Math.cos(theta), y: -D + R * Math.sin(theta) };
    }
    const theta = (Math.PI + theta1) + ((s - 0.5) / 0.5) * span;
    return { x: R * Math.cos(theta), y: D + R * Math.sin(theta) };
  }

  // Each color is its own solid lens, nested smallest-to-largest — this
  // guarantees correct banding at every point along the shape (a single
  // gradient measured from the center badly mismatches a non-circular
  // shape, which is what made an earlier version look like a plain ellipse).
  const DISK_BANDS = [
    { T: 2.6,  w: 0.58, color: PURPLE },
    { T: 2.15, w: 0.46, color: ORANGE },
    { T: 1.75, w: 0.36, color: GOLD },
    { T: 1.35, w: 0.28, color: WHITE },
  ];

  function drawDiskBands() {
    const { r } = hole;
    for (const b of DISK_BANDS) {
      ctx.fillStyle = `rgb(${b.color})`;
      lensPath(r * b.T, r * b.w);
      ctx.fill();
    }
  }

  // Small light-streaks traveling along the disk's fixed path — this is
  // what actually reads as "spinning," since the silhouette itself is static.
  function drawDashes(t, motionRate) {
    const { r } = hole;
    const speed = t * 0.00013 * motionRate;
    const count = 6;
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth = r * 0.032;
    ctx.lineCap = "round";
    for (let i = 0; i < count; i++) {
      const s = ((speed + i / count) % 1 + 1) % 1;
      const p = lensBoundaryPoint(r * 1.95, r * 0.41, s);
      const p2 = lensBoundaryPoint(r * 1.95, r * 0.41, (s + 0.012) % 1);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  }

  // Fine embers riding at several depths within the disk, each following
  // its own band's boundary continuously — this is the actual "gas and
  // matter flowing" texture; the dashes alone only hint at rotation, this
  // is what makes the material itself look like it's coursing around.
  const FLOW_PARTICLES = Array.from({ length: 40 }, (_, i) => ({
    band: i % DISK_BANDS.length,
    phase: Math.random(),
    speedMul: 0.7 + Math.random() * 0.7,
    size: 0.4 + Math.random() * 0.5,
  }));

  function drawFlowParticles(t, motionRate) {
    const { r } = hole;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    for (const p of FLOW_PARTICLES) {
      const band = DISK_BANDS[p.band];
      const s = ((t * 0.00017 * motionRate * p.speedMul + p.phase) % 1 + 1) % 1;
      const pt = lensBoundaryPoint(r * band.T * 0.95, r * band.w * 0.95, s);
      const sz = r * 0.055 * p.size;
      const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, sz);
      g.addColorStop(0, `rgba(${WHITE},0.85)`);
      g.addColorStop(1, `rgba(${WHITE},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, sz, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  // Paints one half of the disk — bands, dashes, and flow particles —
  // clipped by a half-plane along the disk's own long axis. Calling this
  // once on each side of the void (instead of drawing the whole disk in
  // one pass) is what makes the void sit BETWEEN the two halves rather
  // than just stamped on top: the far half disappears behind it, the near
  // half is painted after and visibly overlaps it, so the void finally
  // reads as a sphere the disk wraps around instead of a flat cutout.
  function paintDiskHalf(t, motionRate, upperHalf) {
    const { r } = hole;
    ctx.save();
    ctx.beginPath();
    const BIG = r * 40;
    if (upperHalf) ctx.rect(-BIG, -BIG, BIG * 2, BIG);
    else ctx.rect(-BIG, 0, BIG * 2, BIG);
    ctx.clip();
    drawDiskBands();
    drawDashes(t, motionRate);
    drawFlowParticles(t, motionRate);
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

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(DISK_TILT);

    // thin halo hugging the void at every angle — the vesica shape alone is
    // too thin at its waist to reach all the way round, so this fills that in
    ctx.strokeStyle = `rgba(${PURPLE},0.8)`;
    ctx.lineWidth = r * 0.22;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.15, r * 1.15 * 0.86, 0, 0, Math.PI * 2);
    ctx.stroke();

    // far half of the disk — painted first, so the void (below) covers
    // the part of it that passes behind the sphere
    paintDiskHalf(t, motionRate, true);
    ctx.restore();

    // the void itself, now sitting BETWEEN the two disk halves instead of
    // on top of both — belt-and-suspenders under the real input's own
    // background too, so there's never a gap even for a stray frame
    const voidGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    voidGrad.addColorStop(0, `rgba(${VOID},1)`);
    voidGrad.addColorStop(0.9, `rgba(${VOID},1)`);
    voidGrad.addColorStop(1, `rgba(${VOID},0)`);
    ctx.fillStyle = voidGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.99, 0, Math.PI * 2);
    ctx.fill();

    // near half of the disk — painted on top of the void, so it visibly
    // overlaps the sphere instead of the sphere just sitting on top of it
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(DISK_TILT);
    paintDiskHalf(t, motionRate, false);

    // crisp bright purple rim right at the void's edge, on top of everything
    ctx.strokeStyle = `rgba(${PURPLE},1)`;
    ctx.lineWidth = r * 0.05;
    ctx.beginPath();
    ctx.ellipse(0, 0, r * 1.05, r * 1.05, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

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
