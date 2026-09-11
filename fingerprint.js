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
      { wl: 495.76, intensity: 0.5 },
      { wl: 516.75, intensity: 0.4 },
      { wl: 526.95, intensity: 0.45 },
      { wl: 532.80, intensity: 0.55 },
      { wl: 561.61, intensity: 0.35 },
    ],
    note: "Iron produces thousands of spectral lines — this forest of them is a key tool for measuring the composition of stars, including our Sun."
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
};

// Convert a visible wavelength (nm, ~380-750) to an approximate RGB color
// for rendering the barcode bar itself.
function wavelengthToRGB(wl) {
  let r=0,g=0,b=0;
  if (wl >= 380 && wl < 440) { r = -(wl-440)/(440-380); g = 0; b = 1; }
  else if (wl >= 440 && wl < 490) { r = 0; g = (wl-440)/(490-440); b = 1; }
  else if (wl >= 490 && wl < 510) { r = 0; g = 1; b = -(wl-510)/(510-490); }
  else if (wl >= 510 && wl < 580) { r = (wl-510)/(580-510); g = 1; b = 0; }
  else if (wl >= 580 && wl < 645) { r = 1; g = -(wl-645)/(645-580); b = 0; }
  else if (wl >= 645 && wl <= 750) { r = 1; g = 0; b = 0; }
  else { r=0.5; g=0.5; b=0.5; }
  // Intensity falloff near the visible edges
  let factor = 1;
  if (wl >= 380 && wl < 420) factor = 0.3 + 0.7*(wl-380)/(420-380);
  else if (wl > 700 && wl <= 750) factor = 0.3 + 0.7*(750-wl)/(750-700);
  const gamma = 0.8;
  const toByte = c => Math.round(255 * Math.pow(Math.max(0,c*factor), gamma));
  return `rgb(${toByte(r)},${toByte(g)},${toByte(b)})`;
}

// ─── Rendering ──────────────────────────────────────────────────────────────
// Self-contained module, mirrors structures.js's show/hide pattern.

(function () {
  const VIS_MIN = 380, VIS_MAX = 750;

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
    e.title.textContent = `${elName} — atomic fingerprint`;
    e.count.textContent = `${data.lines.length} line${data.lines.length === 1 ? "" : "s"}`;

    // Barcode bars
    e.barcode.innerHTML = "";
    data.lines.forEach(line => {
      const bar = document.createElement("div");
      bar.className = "fp-line";
      const leftPct = pctFromWavelength(line.wl);
      bar.style.left = `${leftPct}%`;
      bar.style.height = `${Math.max(18, line.intensity * 100)}%`;
      const color = (typeof wavelengthToRGB === "function") ? wavelengthToRGB(line.wl) : "#fff";
      bar.style.background = color;
      bar.style.boxShadow = `0 0 10px ${color}, 0 0 22px ${color}`;
      bar.dataset.wl = line.wl.toFixed(1);
      bar.dataset.label = line.label || "";

      bar.addEventListener("mouseenter", () => {
        e.tooltip.textContent = line.label
          ? `${line.wl.toFixed(1)} nm · ${line.label}`
          : `${line.wl.toFixed(1)} nm`;
        e.tooltip.style.left = `${leftPct}%`;
        e.tooltip.classList.add("visible");
      });
      bar.addEventListener("mouseleave", () => {
        e.tooltip.classList.remove("visible");
      });

      e.barcode.appendChild(bar);
    });

    // Ruler ticks every 50nm
    e.ruler.innerHTML = "";
    for (let wl = 400; wl <= 700; wl += 50) {
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
