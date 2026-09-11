// Hylogos — Atomic Fingerprint feature (data + rendering).
// Renders an element's visible emission-line spectrum as a colored barcode
// at accurate wavelength positions.
//
// Only elements with well-documented, iconic visible-spectrum emission lines
// are included in SPECTRAL_LINES below. Wavelengths are the strongest/most
// characteristic lines in the visible range (~380-750nm), sourced from
// standard NIST-style reference spectra. Relative intensity is approximate,
// for bar-height only. DO NOT add an element without verified reference
// data — elements missing from this object simply won't show a panel yet.

const SPECTRAL_LINES = {
  H: {
    lines: [
      { wl: 656.3, intensity: 1.0,  label: "Hα" },
      { wl: 486.1, intensity: 0.55, label: "Hβ" },
      { wl: 434.0, intensity: 0.3,  label: "Hγ" },
      { wl: 410.2, intensity: 0.15, label: "Hδ" },
    ],
    note: "The Balmer series — the four visible hydrogen lines that first revealed quantized electron energy levels."
  },
  He: {
    lines: [
      { wl: 706.5, intensity: 0.35 },
      { wl: 667.8, intensity: 0.4 },
      { wl: 587.6, intensity: 1.0,  label: "D3" },
      { wl: 501.6, intensity: 0.55 },
      { wl: 492.2, intensity: 0.3 },
      { wl: 471.3, intensity: 0.25 },
      { wl: 447.1, intensity: 0.6 },
      { wl: 402.6, intensity: 0.2 },
    ],
    note: "First detected in the Sun's spectrum in 1868, decades before helium was found on Earth."
  },
  Ne: {
    lines: [
      { wl: 585.2, intensity: 0.9 },
      { wl: 588.2, intensity: 0.7 },
      { wl: 614.3, intensity: 0.6 },
      { wl: 616.4, intensity: 0.65 },
      { wl: 621.7, intensity: 0.5 },
      { wl: 626.6, intensity: 0.55 },
      { wl: 633.4, intensity: 0.45 },
      { wl: 638.3, intensity: 0.5 },
      { wl: 640.2, intensity: 0.7 },
      { wl: 650.7, intensity: 0.4 },
      { wl: 659.9, intensity: 0.35 },
    ],
    note: "This dense cluster of red-orange lines is why neon signs glow that iconic warm red."
  },
  Na: {
    lines: [
      { wl: 589.0, intensity: 1.0, label: "D2" },
      { wl: 589.6, intensity: 0.9, label: "D1" },
    ],
    note: "The sodium D-lines — so close together they blur into one intense yellow line to the naked eye, the color of old street lamps."
  },
  Hg: {
    lines: [
      { wl: 404.7, intensity: 0.4 },
      { wl: 435.8, intensity: 0.8,  label: "blue" },
      { wl: 546.1, intensity: 1.0,  label: "green" },
      { wl: 577.0, intensity: 0.35 },
      { wl: 579.1, intensity: 0.4 },
      { wl: 690.7, intensity: 0.15 },
    ],
    note: "The blue-green fingerprint behind old fluorescent tubes and mercury-vapor streetlights."
  },
  Ar: {
    lines: [
      { wl: 696.5, intensity: 0.7 },
      { wl: 706.7, intensity: 0.55 },
      { wl: 714.7, intensity: 0.3 },
      { wl: 727.3, intensity: 0.45 },
      { wl: 738.4, intensity: 0.6 },
      { wl: 763.5, intensity: 0.8 },
      { wl: 772.4, intensity: 0.5 },
      { wl: 794.8, intensity: 0.4 },
      { wl: 811.5, intensity: 1.0 },
    ],
    note: "Argon's violet-lavender glow lights up plasma globes and some neon-sign blends."
  },
  Kr: {
    lines: [
      { wl: 427.4, intensity: 0.4 },
      { wl: 431.9, intensity: 0.35 },
      { wl: 445.4, intensity: 0.3 },
      { wl: 557.0, intensity: 0.5 },
      { wl: 587.1, intensity: 0.45 },
      { wl: 810.6, intensity: 1.0 },
    ],
    note: "Krypton's pale blue-white glow is used in some high-intensity photographic flash lamps."
  },
  N: {
    lines: [
      { wl: 500.5, intensity: 0.4 },
      { wl: 568.0, intensity: 0.5 },
      { wl: 648.2, intensity: 0.7 },
      { wl: 661.1, intensity: 0.65 },
      { wl: 671.1, intensity: 0.55 },
      { wl: 742.4, intensity: 1.0 },
    ],
    note: "Ionized nitrogen's red-pink lines are part of what colors the aurora and some plasma discharges."
  },
  O: {
    lines: [
      { wl: 436.8, intensity: 0.35 },
      { wl: 557.7, intensity: 1.0, label: "aurora green" },
      { wl: 630.0, intensity: 0.6, label: "aurora red" },
      { wl: 636.4, intensity: 0.4 },
    ],
    note: "The 557.7nm green line is the single biggest reason auroras glow green — emitted by atomic oxygen high in the atmosphere."
  },
  Fe: {
    lines: [
      { wl: 382.04, intensity: 0.35, label: "L" },
      { wl: 430.79, intensity: 0.55, label: "G" },
      { wl: 438.35, intensity: 0.4,  label: "e" },
      { wl: 466.81, intensity: 0.45, label: "d" },
      { wl: 495.76, intensity: 0.5,  label: "c" },
      { wl: 516.73, intensity: 0.6,  label: "b4" },
      { wl: 516.89, intensity: 0.55, label: "b3" },
      { wl: 527.04, intensity: 0.65, label: "E2" },
    ],
    note: "Iron has thousands of documented lines — these eight are the classic Fraunhofer absorption features named from the Sun's spectrum in the 1800s, long before their cause was understood. This is a small, well-spaced sample of iron's real spectrum, not the full picture."
  },
  Ca: {
    lines: [
      { wl: 422.7, intensity: 1.0, label: "resonance line" },
      { wl: 616.2, intensity: 0.3 },
      { wl: 643.9, intensity: 0.35 },
      { wl: 645.6, intensity: 0.3 },
    ],
    note: "Calcium's strong violet line and the nearby H & K absorption lines are landmarks in stellar spectroscopy."
  },
  Li: {
    lines: [
      { wl: 670.8, intensity: 1.0,  label: "resonance line" },
      { wl: 610.4, intensity: 0.3 },
      { wl: 812.6, intensity: 0.15 },
    ],
    note: "The intense red 670.8nm line is why lithium burns a vivid carmine-red in a flame test."
  },
  K: {
    lines: [
      { wl: 766.5, intensity: 1.0, label: "D2" },
      { wl: 769.9, intensity: 0.9, label: "D1" },
    ],
    note: "Potassium's doublet sits at the red edge of vision — its pale lilac flame is often masked by trace sodium contamination."
  },
  Sr: {
    lines: [
      { wl: 407.8, intensity: 1.0 },
      { wl: 421.6, intensity: 0.7 },
      { wl: 460.7, intensity: 1.0, label: "resonance line" },
      { wl: 481.2, intensity: 0.35 },
      { wl: 496.2, intensity: 0.12 },
    ],
    note: "The strong 460.7nm blue-violet line combines with red ionic lines to give strontium salts their signature crimson firework color."
  },
  Ba: {
    lines: [
      { wl: 455.4, intensity: 1.0, label: "Ba II" },
      { wl: 493.4, intensity: 0.3 },
      { wl: 553.5, intensity: 1.0, label: "Ba I" },
      { wl: 585.4, intensity: 0.2 },
      { wl: 614.2, intensity: 0.25 },
      { wl: 649.7, intensity: 0.25 },
    ],
    note: "Barium's blue-green lines are the classic ingredient behind the green shells in fireworks displays."
  },
  Rb: {
    lines: [
      { wl: 780.0, intensity: 1.0, label: "D2" },
      { wl: 794.8, intensity: 0.9, label: "D1" },
    ],
    note: "Rubidium's doublet sits at the deep-red edge of vision, giving its flame test a dim violet-red glow."
  },
  Cs: {
    lines: [
      { wl: 852.1, intensity: 1.0, label: "D2" },
      { wl: 894.3, intensity: 0.8, label: "D1" },
    ],
    note: "These near-infrared D-lines are the basis of the cesium atomic clock that defines the SI second — barely visible to the eye as a faint red glow."
  },
  Mg: {
    lines: [
      { wl: 448.1, intensity: 0.4, label: "Mg II" },
      { wl: 516.7, intensity: 0.3 },
      { wl: 517.3, intensity: 0.55, label: "Mg b" },
      { wl: 518.4, intensity: 1.0, label: "Mg b" },
    ],
    note: "The famous 'Mg b' triplet near 518nm is a standard yardstick astronomers use to measure how metal-rich a star or galaxy is."
  },
};

// Convert a wavelength (nm, ~380-900) to an approximate RGB color.
// 750-900nm is technically near-infrared (invisible to the eye) but
// rendered as a fading deep red so the bar still reads as "this end of
// the spectrum" rather than turning gray.
function wavelengthToRGBArr(wl) {
  let r=0,g=0,b=0;
  if (wl >= 380 && wl < 440) { r = -(wl-440)/(440-380); g = 0; b = 1; }
  else if (wl >= 440 && wl < 490) { r = 0; g = (wl-440)/(490-440); b = 1; }
  else if (wl >= 490 && wl < 510) { r = 0; g = 1; b = -(wl-510)/(510-490); }
  else if (wl >= 510 && wl < 580) { r = (wl-510)/(580-510); g = 1; b = 0; }
  else if (wl >= 580 && wl < 645) { r = 1; g = -(wl-645)/(645-580); b = 0; }
  else if (wl >= 645 && wl <= 900) { r = 1; g = 0; b = 0; }
  else { r=0.5; g=0.5; b=0.5; }
  // Intensity falloff near the visible edges (fades toward violet <420nm
  // and deep into near-IR >700nm, reaching a dim glow by 900nm)
  let factor = 1;
  if (wl >= 380 && wl < 420) factor = 0.3 + 0.7*(wl-380)/(420-380);
  else if (wl > 700 && wl <= 900) factor = 0.55 - 0.4*(wl-700)/(900-700);
  const gamma = 0.8;
  const toByte = c => Math.round(255 * Math.pow(Math.max(0,c*factor), gamma));
  return [toByte(r), toByte(g), toByte(b)];
}
function wavelengthToRGB(wl) {
  const [r, g, b] = wavelengthToRGBArr(wl);
  return `rgb(${r},${g},${b})`;
}

// ─── Rendering ──────────────────────────────────────────────────────────────
// Self-contained module, mirrors structures.js's show/hide pattern.
//
// Two display modes, chosen automatically per element:
//  - "discrete": individual glowing bars, for sparse/simple spectra (Na, Ca...)
//  - "trace":    a continuous intensity curve, for dense spectra (Fe, and any
//                future transition-metal / lanthanide data) where individual
//                bars would overlap into an unreadable smear. Each line
//                contributes a small Gaussian peak; peaks are summed into one
//                curve — the same technique real spectrometers use to render
//                spectra too dense to resolve into separate lines.

(function () {
  const VIS_MIN = 380, VIS_MAX = 900;

  function els() {
    return {
      section: document.getElementById("fingerprintSection"),
      title: document.getElementById("fingerprintTitle"),
      count: document.getElementById("fingerprintCount"),
      barcode: document.getElementById("fingerprintBarcode"),
      ruler: document.getElementById("fingerprintRuler"),
      note: document.getElementById("fingerprintNote"),
      tooltip: document.getElementById("fingerprintTooltip"),
    };
  }

  function pctFromWavelength(wl) {
    return ((wl - VIS_MIN) / (VIS_MAX - VIS_MIN)) * 100;
  }

  // Decide discrete vs trace based on genuine crowding, not just line
  // count or a single coincidentally-close pair. A handful of well-spaced
  // lines (like iron's 8 Fraunhofer lines, ~20nm apart on average) should
  // stay as clean discrete bars even if two of them happen to sit close —
  // trace mode is for spectra that are actually dense throughout.
  function chooseMode(lines) {
    if (lines.length < 4) return "discrete";
    const sorted = [...lines].sort((a, b) => a.wl - b.wl);
    const gaps = [];
    for (let i = 1; i < sorted.length; i++) gaps.push(sorted[i].wl - sorted[i - 1].wl);
    const tightGaps = gaps.filter(g => g < 4).length;
    // Trace mode only once a real majority of neighboring lines are tightly
    // packed, or there are simply too many lines for bars to stay legible.
    if (lines.length > 20) return "trace";
    if (gaps.length > 0 && tightGaps / gaps.length > 0.5 && lines.length >= 8) return "trace";
    return "discrete";
  }

  function renderDiscrete(host, tooltip, lines) {
    host.innerHTML = "";
    lines.forEach(line => {
      const bar = document.createElement("div");
      bar.className = "fp-line";
      const leftPct = pctFromWavelength(line.wl);
      bar.style.left = `${leftPct}%`;
      bar.style.height = `${Math.max(18, line.intensity * 100)}%`;
      const color = wavelengthToRGB(line.wl);
      bar.style.background = color;
      bar.style.boxShadow = `0 0 10px ${color}, 0 0 22px ${color}`;

      bar.addEventListener("mouseenter", () => {
        tooltip.textContent = line.label
          ? `${line.wl.toFixed(1)} nm · ${line.label}`
          : `${line.wl.toFixed(1)} nm`;
        tooltip.style.left = `${leftPct}%`;
        tooltip.classList.add("visible");
      });
      bar.addEventListener("mouseleave", () => {
        tooltip.classList.remove("visible");
      });

      host.appendChild(bar);
    });
  }

  function renderTrace(host, lines) {
    host.innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.className = "fp-trace-canvas";
    host.appendChild(canvas);

    // Layout must be settled before reading clientWidth/Height, otherwise
    // they can read 0 and silently draw nothing.
    requestAnimationFrame(() => {
      const w = canvas.clientWidth || host.clientWidth || 660;
      const h = canvas.clientHeight || host.clientHeight || 150;
      const dpr = window.devicePixelRatio || 1;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      const ctx = canvas.getContext("2d");
      ctx.scale(dpr, dpr);

      const N = 400;
      const sigma = 1.6;
      const intensityAt = new Array(N).fill(0);

      lines.forEach(l => {
        const centerBin = ((l.wl - VIS_MIN) / (VIS_MAX - VIS_MIN)) * N;
        const spread = Math.ceil(sigma * 4);
        const loBin = Math.max(0, Math.floor(centerBin - spread));
        const hiBin = Math.min(N - 1, Math.ceil(centerBin + spread));
        for (let b = loBin; b <= hiBin; b++) {
          const d = b - centerBin;
          intensityAt[b] += l.intensity * Math.exp(-(d * d) / (2 * sigma * sigma));
        }
      });

      const maxI = Math.max(...intensityAt, 0.001);

      for (let b = 0; b < N; b++) {
        const wl = VIS_MIN + (b / N) * (VIS_MAX - VIS_MIN);
        const norm = Math.min(1, intensityAt[b] / maxI);
        const barH = norm * (h - 10);
        const x = (b / N) * w;
        const [r, g, bch] = wavelengthToRGBArr(wl);
        const grad = ctx.createLinearGradient(0, h, 0, h - barH);
        grad.addColorStop(0, `rgba(${r},${g},${bch},${0.15 + norm * 0.55})`);
        grad.addColorStop(1, `rgba(${r},${g},${bch},${0.5 + norm * 0.5})`);
        ctx.fillStyle = grad;
        ctx.fillRect(x, h - barH, w / N + 0.5, barH);
      }

      ctx.beginPath();
      for (let b = 0; b < N; b++) {
        const norm = Math.min(1, intensityAt[b] / maxI);
        const x = (b / N) * w;
        const y = h - norm * (h - 10);
        if (b === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.55)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }

  window.fingerprintShow = function (symbol) {
    const e = els();
    if (!e.section) return;
    const data = (typeof SPECTRAL_LINES !== "undefined") ? SPECTRAL_LINES[symbol] : null;

    if (!data || !data.lines || !data.lines.length) {
      e.section.classList.add("hidden");
      return;
    }

    e.section.classList.remove("hidden");
    const elName = (typeof ELEMENTS !== "undefined" && ELEMENTS[symbol]) ? ELEMENTS[symbol].name : symbol;
    const mode = chooseMode(data.lines);
    e.title.textContent = `${elName} — atomic fingerprint`;
    e.count.textContent = mode === "trace"
      ? `${data.lines.length} lines · dense spectrum`
      : `${data.lines.length} line${data.lines.length === 1 ? "" : "s"}`;

    e.tooltip.classList.remove("visible");
    if (mode === "discrete") {
      renderDiscrete(e.barcode, e.tooltip, data.lines);
    } else {
      renderTrace(e.barcode, data.lines);
    }

    // Ruler ticks every 50nm
    e.ruler.innerHTML = "";
    for (let wl = 400; wl <= 900; wl += 50) {
      const tick = document.createElement("span");
      tick.className = "fp-tick";
      tick.style.left = `${pctFromWavelength(wl)}%`;
      tick.textContent = wl;
      e.ruler.appendChild(tick);
    }

    e.note.textContent = data.note || "";
  };

  window.fingerprintHide = function () {
    const e = els();
    if (e.section) e.section.classList.add("hidden");
  };
})();
