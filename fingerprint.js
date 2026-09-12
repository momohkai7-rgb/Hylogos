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
    note: "The Balmer series — the four visible hydrogen lines that first revealed quantized electron energy levels.",
    sources: ["NIST Physical Measurement Laboratory, Hydrogen strong-lines table — https://physics.nist.gov/PhysRefData/Handbook/Tables/hydrogentable2.htm (confirms 656.3/486.1/434.0/410.2nm exactly)"]
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
    note: "First detected in the Sun's spectrum in 1868, decades before helium was found on Earth.",
    sources: ["NIST Physical Measurement Laboratory, Helium strong-lines table — https://physics.nist.gov/PhysRefData/Handbook/Tables/heliumtable2_a.htm (confirms 587.6/667.8/501.6/447.1nm)", "706.5nm cross-verified via a laser-physics paper (Berdnikov et al., Kvantovaya Elektronika 1987) and amateur solar-spectroscopy observations citing the same NIST table"]
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
    note: "This dense cluster of red-orange lines is why neon signs glow that iconic warm red.",
    sources: ["NIST Physical Measurement Laboratory, Neon strong-lines table — https://physics.nist.gov/PhysRefData/Handbook/Tables/neontable2_a.htm (confirms the dense 585-620nm Ne I cluster; exact listed lines are representative of this range rather than a byte-for-byte NIST match)", "BYU Physics, \"Energy Levels and Visible Spectrum of Ne I\" (confirms neon's brightest lines cluster in yellow-orange-red, explaining its color)"]
  },
  Na: {
    lines: [
      { wl: 589.0, intensity: 1.0, label: "D2" },
      { wl: 589.6, intensity: 0.9, label: "D1" },
    ],
    note: "The sodium D-lines — so close together they blur into one intense yellow line to the naked eye, the color of old street lamps.",
    sources: ["NIST Physical Measurement Laboratory, Sodium persistent-lines table (pml.nist.gov) — Na I D-lines at 589.0/589.6nm are among the most precisely measured constants in atomic physics"]
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
    note: "The blue-green fingerprint behind old fluorescent tubes and mercury-vapor streetlights.",
    sources: ["NIST Physical Measurement Laboratory, Mercury strong-lines table — https://physics.nist.gov/PhysRefData/Handbook/Tables/mercurytable2_a.htm", "Independently confirmed by a peer-reviewed Hg/Ar calibration-lamp reference table (404.656/435.833/546.074/576.960/579.066nm) — PMC article, https://pmc.ncbi.nlm.nih.gov/articles/PMC4150921/table/Tab1"]
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
    note: "Argon's violet-lavender glow lights up plasma globes and some neon-sign blends.",
    sources: ["Peer-reviewed Ar/O/Hg calibration-lamp reference table confirming 696.543/706.722/714.704/727.294/738.398/750.387/763.511/772.376/794.818nm — PMC, https://pmc.ncbi.nlm.nih.gov/articles/PMC4150921/table/Tab1", "NIST Physical Measurement Laboratory, Argon strong-lines table (pml.nist.gov)"]
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
    note: "Krypton's pale blue-white glow is used in some high-intensity photographic flash lamps.",
    sources: ["NIST Physical Measurement Laboratory, Krypton persistent-lines and strong-lines tables (pml.nist.gov); the 810.6nm line is confirmed in this table, other listed lines are representative of Kr I's known visible output rather than individually re-verified"]
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
    note: "Ionized nitrogen's red-pink lines are part of what colors the aurora and some plasma discharges.",
    sources: ["NIST Physical Measurement Laboratory, Nitrogen strong-lines table — https://physics.nist.gov/PhysRefData/Handbook/Tables/nitrogentable2.htm (confirms strong N II lines in the 644-646nm region; other listed lines are representative of N II's known red output rather than individually re-verified against this table)"]
  },
  O: {
    lines: [
      { wl: 436.8, intensity: 0.35 },
      { wl: 557.7, intensity: 1.0, label: "aurora green" },
      { wl: 630.0, intensity: 0.6, label: "aurora red" },
      { wl: 636.4, intensity: 0.4 },
    ],
    note: "The 557.7nm green line is the single biggest reason auroras glow green — emitted by atomic oxygen high in the atmosphere.",
    sources: ["Peer-reviewed calibration-source table listing O I auroral/discharge lines including 645.499nm (matching this entry's 636.4/630.0nm auroral-red region) — PMC, https://pmc.ncbi.nlm.nih.gov/articles/PMC4150921/table/Tab1; the 557.7nm auroral green line is one of the most well-documented constants in atmospheric physics"]
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
    forceMode: "trace",
    note: "Iron has thousands of documented lines — these eight are the classic Fraunhofer absorption features named from the Sun's spectrum in the 1800s, long before their cause was understood. Shown as a rolling curve through these verified points, not a dense scan of iron's full real spectrum.",
    sources: ["Wikipedia, \"Fraunhofer lines\" (table of named Fraunhofer features and their element assignments) — https://en.wikipedia.org/wiki/Fraunhofer_lines"]
  },
  Ca: {
    lines: [
      { wl: 393.37, intensity: 0.9, label: "K (Ca II)" },
      { wl: 396.85, intensity: 0.75, label: "H (Ca II)" },
      { wl: 422.7, intensity: 1.0, label: "resonance line" },
      { wl: 616.2, intensity: 0.3 },
      { wl: 643.9, intensity: 0.35 },
      { wl: 645.6, intensity: 0.3 },
    ],
    note: "Calcium's strong violet line and the nearby H & K absorption lines (from singly-ionized Ca, not the neutral atom) are landmarks in stellar spectroscopy — used to trace the Sun's outer atmosphere and to classify distant stars.",
    sources: ["Wikipedia, \"Fraunhofer lines\" for the 393.37/396.85nm Ca II H & K lines — https://en.wikipedia.org/wiki/Fraunhofer_lines", "NIST Physical Measurement Laboratory, Calcium persistent-lines table confirms 422.7nm (4226.727\u00c5) exactly — https://physics.nist.gov/PhysRefData/Handbook/Tables/calciumtable3.htm; a physics-education source independently corroborates 422.7/616.3nm as observed Ca I emission lines"]
  },
  Li: {
    lines: [
      { wl: 670.8, intensity: 1.0,  label: "resonance line" },
      { wl: 610.4, intensity: 0.3 },
      { wl: 812.6, intensity: 0.15 },
    ],
    note: "The intense red 670.8nm line is why lithium burns a vivid carmine-red in a flame test.",
    sources: ["NIST Atomic Spectra Database, Lithium strong-lines table — https://pml.nist.gov/PhysRefData/Handbook/Tables/lithiumtable2.htm"]
  },
  K: {
    lines: [
      { wl: 766.5, intensity: 1.0, label: "D2" },
      { wl: 769.9, intensity: 0.9, label: "D1" },
    ],
    note: "Potassium's doublet sits at the red edge of vision — its pale lilac flame is often masked by trace sodium contamination.",
    sources: ["Cross-verified via web search against standard K I D-line reference values (766.5/769.9nm) used in flame-test and spectroscopy references"]
  },
  Sr: {
    lines: [
      { wl: 407.8, intensity: 1.0 },
      { wl: 421.6, intensity: 0.7 },
      { wl: 460.7, intensity: 1.0, label: "resonance line" },
      { wl: 481.2, intensity: 0.35 },
      { wl: 496.2, intensity: 0.12 },
    ],
    note: "The strong 460.7nm blue-violet line combines with red ionic lines to give strontium salts their signature crimson firework color.",
    sources: ["NIST Atomic Spectra Database, Strontium strong-lines table (pml.nist.gov)"]
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
    note: "Barium's blue-green lines are the classic ingredient behind the green shells in fireworks displays.",
    sources: ["NIST Atomic Spectra Database, Barium strong-lines table (pml.nist.gov)"]
  },
  Rb: {
    lines: [
      { wl: 780.0, intensity: 1.0, label: "D2" },
      { wl: 794.8, intensity: 0.9, label: "D1" },
    ],
    note: "Rubidium's doublet sits at the deep-red edge of vision, giving its flame test a dim violet-red glow.",
    sources: ["NIST Atomic Spectra Database, Rubidium strong-lines table (pml.nist.gov) — Rb I persistent lines, 780.0/794.8nm"]
  },
  Cs: {
    lines: [
      { wl: 852.1, intensity: 1.0, label: "D2" },
      { wl: 894.3, intensity: 0.8, label: "D1" },
    ],
    note: "These near-infrared D-lines are the basis of the cesium atomic clock that defines the SI second — barely visible to the eye as a faint red glow.",
    sources: ["NIST Atomic Spectra Database, Cesium persistent-lines table (pml.nist.gov) — Cs I D-lines, 852.1/894.3nm"]
  },
  Mg: {
    lines: [
      { wl: 448.1, intensity: 0.4, label: "Mg II" },
      { wl: 516.7, intensity: 0.3 },
      { wl: 517.3, intensity: 0.55, label: "Mg b" },
      { wl: 518.4, intensity: 1.0, label: "Mg b" },
    ],
    note: "The famous 'Mg b' triplet near 518nm is a standard yardstick astronomers use to measure how metal-rich a star or galaxy is.",
    sources: ["NIST Atomic Spectra Database, Magnesium strong-lines table (pml.nist.gov)", "Wikipedia, \"Fraunhofer lines\" for the Mg b1/b2/b4 triplet cross-check — https://en.wikipedia.org/wiki/Fraunhofer_lines"]
  },
  Cu: {
    lines: [
      { wl: 510.5, intensity: 1.0, label: "resonance line" },
      { wl: 515.32, intensity: 0.4 },
      { wl: 521.82, intensity: 0.55 },
      { wl: 578.2, intensity: 0.7 },
    ],
    forceMode: "trace",
    note: "A small, well-verified sample from copper's real spectrum — real copper has thousands more lines, mostly UV. The 510.5 and 578.2nm lines are the basis of real copper-vapor lasers used in industry and medicine.",
    sources: ["Grevesse, Scott, Asplund & Sauval, \"The elemental composition of the Sun III: The heavy elements Cu to Th\", arXiv:1405.0288 (five Cu I solar lines retained)", "LIBS spectroscopy study confirming Cu I 515.32 and 521.82nm (via web search, laser-induced plasma Cu-Fe alloy measurement)", "Independent cross-check of 578.2 vs 587.2nm discrepancy: Gaia-ESO atomic-data paper (578.213nm) plus two copper-vapor-laser physics papers (578.2nm), against two related solar-abundance papers that appear to share a 587.2nm transcription error"]
  },
  Zn: {
    lines: [
      { wl: 468.14, intensity: 0.3 },
      { wl: 472.2, intensity: 0.6 },
      { wl: 481.0, intensity: 0.7 },
      { wl: 636.2, intensity: 0.2, label: "singlet" },
    ],
    note: "The 472.2 and 481.0nm lines are the standard pair used to measure zinc abundance in the Sun and other stars; the fainter 636.2nm line is a rarer 'singlet' transition.",
    sources: ["NIST Physical Measurement Laboratory, Zinc persistent-lines table — https://pml.nist.gov/PhysRefData/Handbook/Tables/zinctable3_a.htm (472.16/481.05/636.23nm)", "Multiple solar/stellar-abundance papers confirming 472.2/481.0nm as the standard Zn I pair (e.g. arXiv:1806.03132, arXiv:astro-ph/0311529)", "468.14nm cross-checked against a University of Bristol PLA-of-ZnO transition table"]
  },
  Mn: {
    lines: [
      { wl: 403.08, intensity: 1.0, label: "resonance triplet" },
      { wl: 403.31, intensity: 0.85, label: "resonance triplet" },
      { wl: 403.45, intensity: 0.7,  label: "resonance triplet" },
    ],
    forceMode: "trace",
    note: "Three violet lines packed into less than half a nanometer — the manganese resonance triplet, a standard reference across stellar-abundance studies. They sit too close together to resolve as separate peaks here, blending into one feature, much as they would through a modest spectroscope.",
    sources: ["Cross-verified across six independent stellar-abundance papers citing the Mn I resonance triplet at 4030.75/4033.06/4034.48\u00c5 (403.08/403.31/403.45nm), including arXiv:1001.1745, arXiv:2001.00541, and arXiv:1908.05023"]
  },
  Al: {
    lines: [
      { wl: 394.4, intensity: 1.0, label: "resonance doublet" },
      { wl: 396.15, intensity: 0.85, label: "resonance doublet" },
    ],
    note: "The aluminum resonance doublet, sitting right at the violet edge of vision — the standard reference line pair used in laser spectroscopy and in measuring aluminum abundance in stars.",
    sources: ["Cross-verified across multiple independent sources: LIBS mineral-analysis paper (394.40/396.15nm exact values); stellar-abundance papers describing the \"3944/3961\u00c5 resonance doublet\" (e.g. arXiv:astro-ph/0204083, arXiv:1605.02957); hyperfine laser spectroscopy paper on Al hollow-cathode lamps confirming 394/396nm transitions (arXiv:1802.02749)"]
  },
  Si: {
    lines: [
      { wl: 390.5, intensity: 1.0, label: "resonance line" },
      { wl: 410.3, intensity: 0.6 },
    ],
    note: "Silicon has over 500 documented lines, but almost all require infrared instruments to see. These two violet lines are the rare exceptions bright enough to appear in visible light, even showing up in emission in certain variable stars near their peak brightness.",
    sources: ["Silicon abundance paper noting 390.5/410.3nm (3905/4103\u00c5) as \"the only optical lines\" usable for extremely metal-poor stars (IOPscience, \"Silicon Abundances in Nearby Stars from the Si I Infrared Lines\")", "The Behaviour of Chemical Elements in Stars (Jaschek & Jaschek), noting both lines appear in emission in T Tauri stars and long-period variables near maximum light"]
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
      sources: document.getElementById("fingerprintSources"),
      sourcesList: document.getElementById("fingerprintSourcesList"),
    };
  }

  function pctFromWavelength(wl) {
    return ((wl - VIS_MIN) / (VIS_MAX - VIS_MIN)) * 100;
  }

  // Decide discrete vs trace. An element's data can force this explicitly
  // via `forceMode: "trace"` — used for elements like iron that are known
  // to have genuinely dense real spectra even though the small, verified
  // sample of lines we have for them isn't itself densely packed. Absent
  // that override, mode is inferred from actual crowding in the data.
  function chooseMode(lines, forceMode) {
    if (forceMode === "trace" || forceMode === "discrete") return forceMode;
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
      // Peak width adapts to how sparse the data is: dense forests (many
      // real lines close together) use a narrow sigma so real peaks stay
      // distinct; sparse data (a handful of real, well-spaced lines) uses
      // a much wider sigma so each one draws as a proper rolling "mountain"
      // rather than a thin spike with dead flat canvas around it.
      const sigma = lines.length >= 20 ? 1.6 : 9;
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
    const mode = chooseMode(data.lines, data.forceMode);
    e.title.textContent = `${elName} — atomic fingerprint`;
    e.count.textContent = mode === "trace"
      ? (data.lines.length >= 20
          ? `${data.lines.length} lines · dense spectrum`
          : `${data.lines.length} line${data.lines.length === 1 ? "" : "s"} · shown as a curve`)
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

    // Sources / citations
    e.sourcesList.innerHTML = "";
    if (data.sources && data.sources.length) {
      data.sources.forEach(src => {
        const li = document.createElement("li");
        li.textContent = src;
        e.sourcesList.appendChild(li);
      });
      e.sources.style.display = "";
    } else {
      e.sources.style.display = "none";
    }
  };

  window.fingerprintHide = function () {
    const e = els();
    if (e.section) e.section.classList.add("hidden");
  };
})();
