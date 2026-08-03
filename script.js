/* ===================== Cosmic backdrop (stars + black hole) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const AMBER = "255,180,84";
  const HOT = "255,242,214";
  const BLUE = "127,217,255";
  const VOID = "5,4,10";
  const VOID2 = "13,10,24";

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au"];
  const MOTE_COUNT = 14;
  const MOTE_ORBIT_SQUASH = 0.3; // vertical squash of the mote orbit path, kept a bit flatter than the disk's own tilt so symbols read as riding along its near surface

  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return "#8b84a3";
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return meta ? meta.color : "#8b84a3";
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    return {
      angle: Math.random() * Math.PI * 2,
      radius: hole.r * (2.5 + Math.random() * 2.0),
      speed: 0.16 + Math.random() * 0.14,
      symbol: sym,
      color: moteColor(sym),
      box: 22 + Math.random() * 7, // bumped up from the original 15–20 so the symbols actually read at a glance
    };
  }

  /* ---- 3D accretion disk (three.js) ----
     A real WebGL scene — a shader-lit ring for the disk plus a solid
     sphere for the event horizon, with a thin fresnel "photon ring"
     hugging its edge — rendered to an offscreen canvas and composited
     onto the 2D backdrop canvas every frame. Keeping it offscreen means
     the stars and the glowing element badges below still draw as cheap,
     crisp 2D canvas work on top, and a WebGL hiccup here can't take the
     rest of the page down with it (see the try/catch below). */
  const HOLE_TILT = 1.05;          // radians off face-on — wide, open ellipse like the reference shot
  const HOLE_INNER_R = 1.05;       // sphere-radius units
  const HOLE_DISK_OUTER_R = 3.4;
  const HOLE_BLOOM_OUTER_R = 7.5;
  const HOLE_FOV = 32;             // degrees — calibration FOV for the offscreen camera

  const DISK_VERT = `
    varying vec3 vPos;
    void main() {
      vPos = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const DISK_FRAG = `
    precision highp float;
    varying vec3 vPos;
    uniform float uTime;
    uniform float uInnerR;
    uniform float uDiskOuterR;
    uniform float uBloomOuterR;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float amp = 0.55;
      for (int i = 0; i < 4; i++) {
        v += amp * noise(p);
        p *= 2.05;
        amp *= 0.5;
      }
      return v;
    }

    void main() {
      float radius = length(vPos.xy);
      if (radius < uInnerR || radius > uBloomOuterR) discard;

      float uDisk = clamp((radius - uInnerR) / (uDiskOuterR - uInnerR), 0.0, 1.0);
      float theta = atan(vPos.y, vPos.x);

      // Keplerian-style differential rotation: inner material sweeps faster than outer
      float rot = uTime * 0.5 / (0.45 + 0.75 * uDisk);
      float angle = theta + rot;

      // woven filament bands — two overlaid harmonics so it reads as fibrous, not banded
      float fil = sin(angle * 16.0 + uDisk * 22.0) * 0.5 + 0.5;
      fil += 0.6 * (sin(angle * 6.0 - uDisk * 10.0 + 2.1) * 0.5 + 0.5);
      fil *= 0.62;

      float turb = fbm(vec2(angle * 2.4, uDisk * 5.0 - uTime * 0.06));
      float weave = clamp(0.35 + fil * 0.65, 0.0, 1.4) * mix(0.75, 1.25, turb);

      // one-sided brightening along the bottom limb — cheap stand-in for Doppler beaming
      vec2 dir = normalize(vPos.xy);
      float beam = smoothstep(-1.0, 1.0, -dir.y * 0.85 - dir.x * 0.15);
      float brightness = weave * mix(0.55, 1.75, beam);

      // white-hot inner -> gold mid -> deep rust outer
      vec3 hot = vec3(1.0, 0.97, 0.9);
      vec3 mid = vec3(1.0, 0.56, 0.14);
      vec3 cool = vec3(0.5, 0.07, 0.02);
      vec3 base = uDisk < 0.5 ? mix(hot, mid, uDisk / 0.5) : mix(mid, cool, (uDisk - 0.5) / 0.5);
      vec3 color = base * brightness;

      // solid through the main disk body, then a soft bloom tail beyond it
      float bodyAlpha = smoothstep(0.0, 0.06, uDisk) * (1.0 - smoothstep(0.82, 1.0, uDisk));
      float bloomT = clamp((radius - uDiskOuterR) / (uBloomOuterR - uDiskOuterR), 0.0, 1.0);
      float bloomAlpha = (1.0 - bloomT) * (1.0 - bloomT) * 0.35;
      float alpha = max(bodyAlpha * clamp(brightness, 0.15, 1.0), bloomAlpha);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const RIM_VERT = `
    precision highp float;
    varying vec3 vNormalV;
    varying vec3 vViewDirV;
    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vNormalV = normalize(normalMatrix * normal);
      vViewDirV = normalize(-mvPosition.xyz);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const RIM_FRAG = `
    precision highp float;
    varying vec3 vNormalV;
    varying vec3 vViewDirV;
    uniform vec3 uColor;
    uniform float uTime;
    void main() {
      float rim = 1.0 - max(dot(normalize(vNormalV), normalize(vViewDirV)), 0.0);
      float intensity = pow(rim, 4.0);
      float bias = clamp(0.55 - vNormalV.y * 0.5, 0.0, 1.3); // brighter along the bottom limb, echoing the disk's beaming
      intensity *= bias;
      intensity *= 0.85 + 0.15 * sin(uTime * 1.7);
      gl_FragColor = vec4(uColor, clamp(intensity, 0.0, 1.0) * 0.9);
    }
  `;

  function createBlackHole3D() {
    const api = { canvas: null, resize() {}, render() {} };
    if (typeof THREE === "undefined") return api;

    try {
      const glCanvas = document.createElement("canvas");
      const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, alpha: true });
      renderer.setPixelRatio(1);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(HOLE_FOV, 1, 0.1, 100);
      const group = new THREE.Group();
      scene.add(group);

      const sphereMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 48),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
      );
      group.add(sphereMesh);

      const rimMat = new THREE.ShaderMaterial({
        uniforms: { uColor: { value: new THREE.Color(0xfff4d6) }, uTime: { value: 0 } },
        vertexShader: RIM_VERT,
        fragmentShader: RIM_FRAG,
        transparent: true,
        depthWrite: false,
      });
      const rimMesh = new THREE.Mesh(new THREE.SphereGeometry(1.045, 64, 48), rimMat);
      rimMesh.renderOrder = 2;
      group.add(rimMesh);

      const diskMat = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uInnerR: { value: HOLE_INNER_R },
          uDiskOuterR: { value: HOLE_DISK_OUTER_R },
          uBloomOuterR: { value: HOLE_BLOOM_OUTER_R },
        },
        vertexShader: DISK_VERT,
        fragmentShader: DISK_FRAG,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const diskMesh = new THREE.Mesh(
        new THREE.RingGeometry(HOLE_INNER_R, HOLE_BLOOM_OUTER_R, 128, 4),
        diskMat
      );
      diskMesh.rotation.x = HOLE_TILT;
      diskMesh.renderOrder = 1;
      group.add(diskMesh);

      let pixelsPerUnit = 1;

      function resize(pxWidth, pxHeight, holeState) {
        if (pxWidth <= 0 || pxHeight <= 0) return;
        glCanvas.width = pxWidth;
        glCanvas.height = pxHeight;
        renderer.setSize(pxWidth, pxHeight, false);
        camera.aspect = pxWidth / pxHeight;

        const r = Math.max(holeState.r, 1);
        const fovRad = (HOLE_FOV * Math.PI) / 180;
        const d = (pxHeight / 2) / (r * Math.tan(fovRad / 2));
        camera.position.set(0, 0, d);
        camera.updateProjectionMatrix();
        pixelsPerUnit = r;

        group.position.set(
          (holeState.cx - pxWidth / 2) / pixelsPerUnit,
          -(holeState.cy - pxHeight / 2) / pixelsPerUnit,
          0
        );
      }

      function render(t) {
        const time = t * 0.001 * (reducedMotion ? 0.4 : 1);
        diskMat.uniforms.uTime.value = time;
        rimMat.uniforms.uTime.value = time;
        renderer.render(scene, camera);
      }

      api.canvas = glCanvas;
      api.resize = resize;
      api.render = render;
    } catch (err) {
      console.warn("Black hole 3D scene failed to start; showing the backdrop without it.", err);
    }

    return api;
  }

  const blackHole3D = createBlackHole3D();

  function drawFallbackHole() {
    // only used if WebGL is unavailable/fails — a plain glow so the backdrop never goes empty
    const { cx, cy, r } = hole;
    if (r <= 0) return;
    const g = ctx.createRadialGradient(cx, cy, r * 0.4, cx, cy, r * 2.2);
    g.addColorStop(0, "rgba(255,205,120,0.35)");
    g.addColorStop(0.5, "rgba(255,120,40,0.18)");
    g.addColorStop(1, "rgba(255,120,40,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
    ctx.fill();
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

    hole.r = Math.min(canvas.width * 0.21, 210);
    hole.cx = canvas.width * 0.5;
    hole.cy = canvas.height * 0.33;

    motes = Array.from({ length: MOTE_COUNT }, spawnMote);
    blackHole3D.resize(canvas.width, canvas.height, hole);
  }

  function drawStars(t) {
    ctx.fillStyle = "#e8e4f0";
    for (const s of stars) {
      const twinkle = reducedMotion ? 0.55 : Math.abs(Math.sin(s.phase + t * s.speed));
      ctx.globalAlpha = 0.35 + 0.5 * twinkle;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
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
      // orbiting-then-falling-in is the actual point of this visual, so it
      // keeps running under reduced-motion too, just gentler — only the
      // flickery bits (star twinkle, turbulence flecks) get fully muted.
      const motionRate = reducedMotion ? 0.4 : 1;
      const pull = 1 + (hole.r * 2.2 - m.radius) / (hole.r * 4);
      m.radius -= m.speed * Math.max(pull, 0.3) * motionRate;
      m.angle += 0.006 * (hole.r * 3 / Math.max(m.radius, hole.r * 0.4)) * motionRate;
      if (m.radius < hole.r * 0.7) Object.assign(m, spawnMote());
      const x = hole.cx + Math.cos(m.angle) * m.radius;
      const y = hole.cy + Math.sin(m.angle) * m.radius * MOTE_ORBIT_SQUASH;
      const fadeIn = Math.max(0, Math.min(1, (hole.r * 4.5 - m.radius) / (hole.r * 1.3)));
      const fadeOut = Math.max(0, Math.min(1, (m.radius - hole.r * 0.65) / (hole.r * 0.45)));
      const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut));
      if (alpha <= 0.03) continue;

      ctx.globalAlpha = alpha;
      const s = m.box;
      const fontSize = Math.max(10, Math.round(s * 0.5));

      roundRectPath(x - s / 2, y - s / 2, s, s, 4);
      ctx.fillStyle = `rgba(${VOID2},0.88)`;
      ctx.fill();

      // neon glow: a blurred colored halo behind a crisp bright core
      ctx.save();
      ctx.shadowColor = m.color;
      ctx.shadowBlur = 12;
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 1.4;
      roundRectPath(x - s / 2, y - s / 2, s, s, 4);
      ctx.stroke();

      ctx.font = `800 ${fontSize}px var(--font-mono), monospace`;
      ctx.shadowBlur = 16;
      ctx.fillStyle = m.color;
      ctx.fillText(m.symbol, x, y + 0.5);
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fefefe";
      ctx.fillText(m.symbol, x, y + 0.5);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function tick(t) {
    ctx.fillStyle = `rgb(5,4,10)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawStars(t);
    blackHole3D.render(t);
    if (blackHole3D.canvas) {
      ctx.drawImage(blackHole3D.canvas, 0, 0, canvas.width, canvas.height);
    } else {
      drawFallbackHole();
    }
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
