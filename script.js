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

    hole.r = Math.min(canvas.width * 0.21, 210);
    hole.cx = canvas.width * 0.5;
    hole.cy = canvas.height * 0.33;

    motes = Array.from({ length: MOTE_COUNT }, spawnMote);
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

  /* ---- WebGL fake-gravity raymarched black hole (Interstellar-style lensing) ----
     Renders into a small offscreen canvas each frame; that image is then
     composited into the 2D backdrop below via drawImage. The ray for every
     pixel is bent step-by-step toward the hole (a cheap stand-in for real
     geodesics), so light from the far side of the disk gets pulled up and
     around the event horizon into a continuous halo — that's what produces
     the "wrapped ring" look instead of flat painted rings. Falls back to
     drawHoleFallback2D() further below if WebGL is unavailable or the
     shader fails to compile, so the page never breaks. */
  const blackHoleGL = (function initBlackHoleGL() {
    const glCanvas = document.createElement("canvas");
    const gl = glCanvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: true })
      || glCanvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false, antialias: false, preserveDrawingBuffer: true });
    if (!gl) return null;

    const VERT_SRC = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const FRAG_SRC = `
      precision highp float;
      varying vec2 vUv;
      uniform vec2 iResolution;
      uniform float iTime;

      float hash21(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise2(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash21(i);
        float b = hash21(i + vec2(1.0, 0.0));
        float c = hash21(i + vec2(0.0, 1.0));
        float d = hash21(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.55;
        for (int i = 0; i < 5; i++) {
          v += amp * noise2(p);
          p *= 2.02;
          amp *= 0.55;
        }
        return v;
      }

      void main() {
        vec2 uv = (vUv - 0.5) * 2.0;

        // camera: slow cinematic orbit, tilted above the disk plane like the reference image
        float az = iTime * 0.05 + 2.0;
        float el = 0.34;
        float camDist = 15.0;
        vec3 camPos = camDist * vec3(cos(el) * cos(az), sin(el), cos(el) * sin(az));
        vec3 forward = normalize(-camPos);
        vec3 worldUp = vec3(0.0, 1.0, 0.0);
        vec3 rightV = normalize(cross(forward, worldUp));
        vec3 upV = cross(rightV, forward);
        float fov = 0.8;
        vec3 rd = normalize(forward + uv.x * fov * rightV + uv.y * fov * upV);
        vec3 ro = camPos;

        float diskInner = 2.4;
        float diskOuter = 9.2;

        vec3 pos = ro;
        vec3 dir = rd;
        vec3 col = vec3(0.0);
        float alpha = 0.0;

        const int STEPS = 140;
        for (int i = 0; i < STEPS; i++) {
          float r = max(length(pos), 0.05);

          if (r < 1.0) {
            col = vec3(0.0);
            alpha = 1.0;
            break;
          }
          if (r > 42.0) {
            break;
          }

          float stepSize = clamp(r * 0.10, 0.035, 0.6);
          vec3 accel = -normalize(pos) * (1.55 / (r * r));
          vec3 prevPos = pos;
          dir = normalize(dir + accel * stepSize);
          pos += dir * stepSize;

          if (prevPos.y * pos.y < 0.0) {
            float tCross = prevPos.y / (prevPos.y - pos.y);
            vec3 crossPos = mix(prevPos, pos, tCross);
            float cr = length(crossPos.xz);
            if (cr > diskInner && cr < diskOuter) {
              float ang = atan(crossPos.z, crossPos.x);
              float speed = 1.35 / pow(cr, 0.55);
              float flow = ang - iTime * speed * 0.34;
              float n = fbm(vec2(flow * 2.1, cr * 0.85));
              float n2 = fbm(vec2(flow * 5.3 + 4.1, cr * 1.7 - iTime * 0.05));
              float turb = 0.55 + 0.55 * n + 0.25 * n2;

              float edgeFade = smoothstep(diskInner, diskInner + 0.55, cr)
                              * smoothstep(diskOuter, diskOuter - 2.0, cr);

              float temp = 1.0 - clamp((cr - diskInner) / (diskOuter - diskInner), 0.0, 1.0);
              vec3 coolC = vec3(0.55, 0.07, 0.02);
              vec3 midC  = vec3(1.0, 0.55, 0.12);
              vec3 hotC  = vec3(1.0, 0.97, 0.88);
              vec3 diskCol = mix(coolC, midC, smoothstep(0.0, 0.55, temp));
              diskCol = mix(diskCol, hotC, smoothstep(0.55, 1.0, temp));

              vec3 tangent = normalize(vec3(-sin(ang), 0.0, cos(ang)));
              vec3 toCam = normalize(ro - crossPos);
              float beam = clamp(dot(tangent, toCam), -1.0, 1.0);
              float doppler = 1.0 + 0.85 * beam;

              float brightness = (0.85 + 1.9 * temp) * turb * doppler * edgeFade;
              col = diskCol * brightness;
              alpha = clamp(brightness * 0.9, 0.0, 1.0);
              break;
            }
          }
        }

        gl_FragColor = vec4(col, alpha);
      }
    `;

    function compile(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("Black hole shader failed to compile:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("Black hole shader failed to link:", gl.getProgramInfoLog(program));
      return null;
    }

    const posLoc = gl.getAttribLocation(program, "aPos");
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const uRes = gl.getUniformLocation(program, "iResolution");
    const uTime = gl.getUniformLocation(program, "iTime");

    let size = 0;
    let hasRendered = false;

    function setSize(px) {
      px = Math.max(1, Math.round(px));
      if (px === size) return false;
      size = px;
      glCanvas.width = size;
      glCanvas.height = size;
      gl.viewport(0, 0, size, size);
      return true;
    }

    // skipIfUnchanged lets callers reuse last frame's pixels (cheaply, via
    // preserveDrawingBuffer) instead of re-running the shader — used when
    // prefers-reduced-motion is on, so a static hole doesn't re-raymarch
    // every frame for no visual change.
    function render(time, sizePx, skipIfUnchanged) {
      const changed = setSize(sizePx);
      if (skipIfUnchanged && hasRendered && !changed) return glCanvas;

      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(uRes, size, size);
      gl.uniform1f(uTime, time);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      hasRendered = true;
      return glCanvas;
    }

    return { render };
  })();

  function drawHole(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    if (!blackHoleGL) { drawHoleFallback2D(t); return; }

    // soft ambient bloom bleeding into the starfield, drawn behind the
    // raymarched image so the square render target has no visible edge
    const bloom = ctx.createRadialGradient(cx, cy, r * 1.3, cx, cy, r * 4.8);
    bloom.addColorStop(0,    "rgba(255,190,110,0.22)");
    bloom.addColorStop(0.45, "rgba(255,130,40,0.10)");
    bloom.addColorStop(1,    "rgba(255,130,40,0)");
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 4.8, 0, Math.PI * 2);
    ctx.fill();

    // Keep the disk turning even with prefers-reduced-motion on — freezing
    // it entirely is what made this read as a still image instead of a
    // simulation. Reduced-motion users get a gentler pace, not a full stop.
    const glTime = t * (reducedMotion ? 0.00013 : 0.00035);
    const size = Math.max(64, Math.min(680, r * 6.2));
    const frame = blackHoleGL.render(glTime, size, false);
    if (!frame) { drawHoleFallback2D(t); return; }

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(frame, cx - size / 2, cy - size / 2, size, size);
    ctx.restore();
  }

  // Original flat 2D rendering, kept as a safety-net fallback for browsers
  // without WebGL support (or if shader compilation fails for any reason).
  function drawHoleFallback2D(t) {
    const { cx, cy, r } = hole;
    if (r <= 0) return;

    // core rotation keeps running in reduced-motion (just slower) — it's
    // the whole point of the viewer, not a decorative flourish
    const motionRate = reducedMotion ? 0.4 : 1;
    const spin = t * 0.00028 * motionRate;      // halo rotation
    const spinOuter = t * 0.00018 * motionRate;  // outer disk rotates slower (differential rotation)
    const hasConic = typeof ctx.createConicGradient === "function";

    // conic gradient = true 360° angular colour, so the ring can stay bright
    // at every angle instead of the old left/right-only linear gradient.
    // Falls back to a flat mid-tone colour on ancient browsers.
    function angularStroke(stops, rotation, fallback) {
      if (!hasConic) return fallback;
      const g = ctx.createConicGradient(rotation, cx, cy);
      stops.forEach(([pos, col]) => g.addColorStop(pos, col));
      return g;
    }

    function ring(rx, ry, lw, stops, rotation) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = angularStroke(stops, rotation, stops[Math.floor(stops.length / 2)][1]);
      ctx.lineWidth = lw;
      ctx.beginPath();
      ctx.ellipse(0, 0, Math.max(rx, 0.1), Math.max(ry, 0.1), 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // ── 1. Wide diffuse bloom — brighter & more saturated ────────────────
    const bloom = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 5);
    bloom.addColorStop(0,    `rgba(255,205,120,0.34)`);
    bloom.addColorStop(0.25, `rgba(255,150,50,0.18)`);
    bloom.addColorStop(0.6,  `rgba(230,90,15,0.08)`);
    bloom.addColorStop(1,    `rgba(230,90,15,0)`);
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 5, 0, Math.PI * 2);
    ctx.fill();

    // ── 2. Outer disk wings — the physically-thin disk seen edge-on, ─────
    // flattened way out. Colour profile sampled from a real Gargantua-style
    // render (dark rust edge -> gold -> white-hot -> gold -> rust).
    const wingStops = [
      [0.00, "rgba(129,22,2,0)"],
      [0.10, "rgba(190,51,2,0.55)"],
      [0.24, "rgba(247,157,0,0.85)"],
      [0.37, "rgba(255,222,110,0.95)"],
      [0.50, "rgba(255,250,235,1)"],
      [0.63, "rgba(255,222,110,0.95)"],
      [0.76, "rgba(247,157,0,0.85)"],
      [0.90, "rgba(190,51,2,0.55)"],
      [1.00, "rgba(129,22,2,0)"],
    ];
    ring(r * 2.15, r * 0.46, r * 0.30, wingStops, spinOuter);
    ring(r * 1.85, r * 0.32, r * 0.20, wingStops, spinOuter + 0.4);

    // ── 3. Round inner halo — this is what makes it read as a full ring ──
    // wrapped around the sphere (gravitational lensing bends the far side
    // of the disk up/over and down/under), instead of two dim wings.
    const haloOuter = [
      [0.00, "rgba(180,43,1,0.65)"], [0.5, "rgba(216,75,3,0.9)"], [1.00, "rgba(180,43,1,0.65)"],
    ];
    const haloMid = [
      [0.00, "rgba(251,122,5,0.85)"], [0.5, "rgba(255,157,0,1)"], [1.00, "rgba(251,122,5,0.85)"],
    ];
    const haloBright = [
      [0.00, "rgba(255,212,65,0.9)"], [0.5, "rgba(255,246,232,1)"], [1.00, "rgba(255,212,65,0.9)"],
    ];
    const haloCore = [
      [0.00, "rgba(255,246,150,0.95)"], [0.5, "rgba(255,255,250,1)"], [1.00, "rgba(255,246,150,0.95)"],
    ];
    ring(r * 1.42, r * 1.24, r * 0.30, haloOuter,  spin * 0.7);

    // bridge layer — closes the gap between the round halo and the flat
    // wings so there's no dark seam between the two structures
    const haloBridge = [
      [0.00, "rgba(160,38,2,0.4)"], [0.5, "rgba(200,60,3,0.6)"], [1.00, "rgba(160,38,2,0.4)"],
    ];
    ring(r * 1.68, r * 1.40, r * 0.30, haloBridge, spin * 0.6);

    ring(r * 1.24, r * 1.08, r * 0.22, haloMid,    spin);
    ring(r * 1.08, r * 0.95, r * 0.15, haloBright, spin * 1.15);
    ring(r * 0.95, r * 0.84, r * 0.08, haloCore,   spin * 1.3);

    // ── 4. Turbulence — small bright flecks orbiting within the halo so ──
    // the disk reads as flowing plasma rather than a smooth painted band.
    if (!reducedMotion) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalCompositeOperation = "lighter";
      const FLECKS = 22;
      for (let i = 0; i < FLECKS; i++) {
        const seed = i * 12.9898;
        const speed = 0.00016 + (i % 5) * 0.00003;
        const a = seed + t * speed;
        const rx = r * (0.9 + 0.5 * ((i * 37) % 10) / 10);
        const ry = rx * 0.82;
        const x = Math.cos(a) * rx;
        const y = Math.sin(a) * ry;
        const flicker = 0.4 + 0.6 * Math.abs(Math.sin(seed + t * 0.002));
        const s = r * (0.05 + 0.05 * flicker);
        const g = ctx.createRadialGradient(x, y, 0, x, y, s);
        g.addColorStop(0, `rgba(255,244,214,${0.55 * flicker})`);
        g.addColorStop(1, `rgba(255,244,214,0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // ── 5. Photon-sphere rim — crisp bright edge right at the horizon ────
    const photon = ctx.createRadialGradient(cx, cy, r * 0.78, cx, cy, r * 0.92);
    photon.addColorStop(0,   `rgba(255,250,235,0)`);
    photon.addColorStop(0.7, `rgba(255,244,214,0.55)`);
    photon.addColorStop(1,   `rgba(255,244,214,0)`);
    ctx.fillStyle = photon;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.92, 0, Math.PI * 2);
    ctx.fill();

    // ── 6. Event horizon — absolute black, small enough that the round ───
    // halo above fully surrounds it at every angle.
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
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
      const y = hole.cy + Math.sin(m.angle) * m.radius * 0.34;
      const fadeIn = Math.max(0, Math.min(1, (hole.r * 4.5 - m.radius) / (hole.r * 1.3)));
      const fadeOut = Math.max(0, Math.min(1, (m.radius - hole.r * 0.65) / (hole.r * 0.45)));
      const alpha = Math.max(0, Math.min(1, fadeIn * fadeOut));
      if (alpha <= 0.03) continue;

      ctx.globalAlpha = alpha;
      const s = m.box;
      roundRectPath(x - s / 2, y - s / 2, s, s, 3);
      ctx.fillStyle = `rgba(${VOID2},0.9)`;
      ctx.fill();
      ctx.strokeStyle = m.color;
      ctx.lineWidth = 1.3;
      ctx.stroke();

      ctx.fillStyle = m.color;
      ctx.font = "700 9px var(--font-mono), monospace";
      ctx.fillText(m.symbol, x, y + 0.5);
    }
    ctx.globalAlpha = 1;
  }

  function tick(t) {
    ctx.fillStyle = `rgb(5,4,10)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
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
