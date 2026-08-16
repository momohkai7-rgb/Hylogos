/* ===================== Hylogos Advanced Cheat Sheet Module ===================== */
(function cheatSheetModule() {
  const els = {
    toggle: document.getElementById("cheatSheetToggle"),
    overlay: document.getElementById("cheatSheetOverlay"),
    close: document.getElementById("cheatSheetClose"),
    courseSelect: document.getElementById("csCourseSelect"),
    contentHost: document.getElementById("csContentHost"),
  };

  if (!els.toggle || !els.overlay) return;

  // Comprehensive course data matching your precise outline
  const COURSES = {
    "materials-fundamentals": {
      title: "Materials Science Fundamentals",
      items: [
        { name: "Atomic Packing Factor (APF)", formula: "APF = (Volume of atoms in unit cell) / (Total unit cell volume)", desc: "Fraction of space filled by atoms. Simple Cubic = 0.52, BCC = 0.68, FCC = 0.74." },
        { name: "Density of Crystal Unit Cell", formula: "ρ = (Z · M) / (N_A · V_c)", desc: "Z = atoms/cell, M = molar mass, N_A = Avogadro's number, V_c = unit cell volume." },
        { name: "Pilling-Bedworth Ratio (Oxidation Volume)", formula: "PBR = V_oxide / V_metal", desc: "Predicts protective oxide scale formation. PBR > 1 indicates compressive stress." }
      ]
    },
    "crystallography": {
      title: "Crystallography & Crystal Structures",
      items: [
        { name: "Bragg's Law of Diffraction", formula: "nλ = 2d_{hkl}sin(θ)", desc: "Condition for constructive interference of X-rays scattered from crystal planes." },
        { name: "Interplanar Spacing (Cubic)", formula: "d_{hkl} = a / √(h² + k² + l²)", desc: "Calculates distance between parallel lattice planes defined by Miller indices (hkl)." },
        { name: "Weiss Zone Law", formula: "hu + kv + lw = 0", desc: "Condition for a lattice direction [uvw] to lie within a crystal plane (hkl)." }
      ]
    },
    "phase-diagrams": {
      title: "Phase Diagrams",
      items: [
        { name: "Gibbs Phase Rule", formula: "F = C - P + 2", desc: "F = degrees of freedom, C = components, P = phases in thermodynamic equilibrium." },
        { name: "The Lever Rule", formula: "fraction of α = (W_c - W_β) / (W_α - W_β)", desc: "Calculates weight fractions of co-existing phases in a two-phase alloy region." }
      ]
    },
    "thermodynamics": {
      title: "Thermodynamics",
      items: [
        { name: "First Law of Thermodynamics", formula: "ΔU = q + w", desc: "Change in internal energy equals heat added to system plus work done on system." },
        { name: "Gibbs Free Energy", formula: "ΔG = ΔH - TΔS", desc: "Criteria for spontaneity: ΔG < 0 is spontaneous at constant temperature and pressure." },
        { name: "Clausius-Clapeyron Equation", formula: "dP/dT = ΔH_vap / (T · ΔV)", desc: "Describes phase boundaries on a pressure-temperature phase diagram." }
      ]
    },
    "kinetics": {
      title: "Kinetics",
      items: [
        { name: "Arrhenius Equation", formula: "k = k₀ · exp(-E_a / RT)", desc: "Temperature dependence of reaction rates and thermal activation processes." },
        { name: "First-Order Rate Law", formula: "ln[A]_t = -kt + ln[A]₀", desc: "Concentration decay over time for radioactive decay or unimolecular reactions." }
      ]
    },
    "diffusion": {
      title: "Diffusion",
      items: [
        { name: "Fick's First Law (Steady State)", formula: "J = -D · (dC/dx)", desc: "Diffusion flux J is proportional to concentration gradient dC/dx. D is diffusion coefficient." },
        { name: "Fick's Second Law (Non-Steady State)", formula: "∂C/∂t = D · (∂²C/∂x²)", desc: "Concentration changes over time within a diffusion volume." },
        { name: "Temperature Dependence of Diffusion", formula: "D = D₀ · exp(-Q_d / RT)", desc: "Activation energy Q_d dictates how fast atoms jump across lattice vacancies." }
      ]
    },
    "mechanical-properties": {
      title: "Mechanical Properties",
      items: [
        { name: "Hooke's Law (Elasticity)", formula: "σ = E · ε", desc: "Stress σ is proportional to strain ε. E is Young's Modulus." },
        { name: "Hall-Petch Equation (Grain Size Strengthening)", formula: "σ_y = σ₀ + k_y / √d", desc: "Yield strength increases as grain size d decreases." },
        { name: "Hollomon Strain Hardening", formula: "σ = K · εⁿ", desc: "Plastic deformation behavior past yield point. n is strain-hardening exponent." }
      ]
    },
    "thermal-properties": {
      title: "Thermal Properties",
      items: [
        { name: "Thermal Expansion", formula: "ΔL / L₀ = α_L · ΔT", desc: "Linear expansion of materials with temperature change. α_L is expansion coefficient." },
        { name: "Fourier's Law of Heat Conduction", formula: "q = -k_th · (dT/dx)", desc: "Heat flux q driven by thermal conductivity k_th and temperature gradient." }
      ]
    },
    "electrical-properties": {
      title: "Electrical Properties",
      items: [
        { name: "Ohm's Law (Microscopic Form)", formula: "J = σ · E", desc: "Current density J equals electrical conductivity σ times electric field E." },
        { name: "Drude Conductivity Model", formula: "σ = (n · e² · τ) / m", desc: "n = electron density, e = charge, τ = relaxation time, m = electron mass." }
      ]
    },
    "magnetic-properties": {
      title: "Magnetic Properties",
      items: [
        { name: "Magnetic Induction", formula: "B = μ₀ · (H + M) = μ · H", desc: "B = magnetic flux density, H = magnetic field strength, M = magnetization, μ = permeability." },
        { name: "Curie-Weiss Law", formula: "χ = C / (T - T_c)", desc: "Magnetic susceptibility χ above the Curie temperature T_c for ferromagnets." }
      ]
    },
    "electronic-materials": {
      title: "Electronic Materials",
      items: [
        { name: "Fermi-Dirac Distribution", formula: "f(E) = 1 / (exp((E - E_F) / k_B T) + 1)", desc: "Probability that an electronic energy state E is occupied at temperature T." },
        { name: "Mass Action Law (Semiconductors)", formula: "n · p = n_i²", desc: "Product of electron concentration n and hole concentration p equals intrinsic carrier density squared." }
      ]
    },
    "metallurgy": {
      title: "Metallurgy & Alloy Systems",
      items: [
        { name: "Carbon Equivalency (Weldability)", formula: "CE = C + (Mn+Si)/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15", desc: "Estimates hardenability and cold-cracking susceptibility of structural steels." },
        { name: "Hume-Rothery Rules", formula: "Substitution Solid Solution Conditions", desc: "Must have similar atomic radius (<15%), crystal structure, electronegativity, and valence." }
      ]
    },
    "polymers": {
      title: "Polymers",
      items: [
        { name: "Number-Average Molecular Weight", formula: "M_n = Σ(N_i · M_i) / Σ(N_i)", desc: "Sum of chain weights divided by total number of polymer chains." },
        { name: "Degree of Polymerization (DP)", formula: "DP = M_n / M_repeat", desc: "Average number of repeat mer units in a polymer chain." }
      ]
    },
    "ceramics": {
      title: "Ceramics",
      items: [
        { name: "Griffith Fracture Theory", formula: "σ_f = √(2 · E · γ_s / (π · a))", desc: "Fracture stress σ_f for brittle ceramics containing a microcrack of length 2a." },
        { name: "Ionic Radii Ratio Rule", formula: "r_c / r_a", desc: "Predicts coordination number and crystal geometry based on cation/anion radius ratios." }
      ]
    },
    "composites": {
      title: "Composites",
      items: [
        { name: "Rule of Mixtures (Isostrain / Longitudinal)", formula: "E_c = V_f · E_f + V_m · E_m", desc: "Elastic modulus of a fiber composite loaded parallel to fibers. V = volume fraction." },
        { name: "Inverse Rule of Mixtures (Transverse)", formula: "E_c = (E_f · E_m) / (V_m · E_f + V_f · E_m)", desc: "Elastic modulus when load is applied perpendicular to fibers." }
      ]
    },
    "nanomaterials": {
      title: "Nanomaterials",
      items: [
        { name: "Surface-to-Volume Ratio", formula: "SA : V ∝ 1 / r", desc: "As particle radius r shrinks to nanoscale, surface atom percentage increases dramatically." },
        { name: "Quantum Confinement Energy Shift", formula: "ΔE ∝ ℏ² / (2m* · L²)", desc: "Bandgap expansion in quantum dots when particle size L approaches exciton Bohr radius." }
      ]
    },
    "corrosion": {
      title: "Corrosion",
      items: [
        { name: "Faraday's Law of Corrosion Rate", formula: "CR = (K · W) / (d · A · t)", desc: "Calculates corrosion penetration rate based on weight loss W, density d, and area A." },
        { name: "Nernst Potential for Corrosion Cell", formula: "E_corr = E° - (RT/nF)ln(activity)", desc: "Electrode potential governing oxidation/reduction reaction rates at metal surfaces." }
      ]
    },
    "surface-science": {
      title: "Surface Science",
      items: [
        { name: "Langmuir Adsorption Isotherm", formula: "θ = (K · P) / (1 + K · P)", desc: "Fraction of surface coverage θ as a function of gas pressure P and adsorption constant K." },
        { name: "Young's Contact Angle Equation", formula: "γ_sv = γ_sl + γ_lv · cos(θ_c)", desc: "Wetting equilibrium balancing solid-vapor, solid-liquid, and liquid-vapor surface tensions." }
      ]
    },
    "characterization": {
      title: "Materials Characterization (XRD, Spectroscopy)",
      items: [
        { name: "Scherrer Equation (Nanocrystal Size)", formula: "D = (K · λ) / (β · cos(θ))", desc: "Estimates crystal grain size D from XRD peak broadening β. K ≈ 0.9." },
        { name: "Energy Dispersive X-ray (EDX/EDS)", formula: "E = hν = E_core - E_shell", desc: "Characteristic X-ray emission energies identifying specific atomic species." }
      ]
    },
    "processing": {
      title: "Materials Processing & Heat Treatment",
      items: [
        { name: "CCT & TTT Diagrams", formula: "Diffusion-controlled vs Diffusionless Transformation", desc: "Maps transformation products (pearlite, bainite, martensite) during cooling schedules." },
        { name: "Carburizing Diffusion Depth", formula: "x(t) = 4 · √(D · t)", desc: "Approximate case-hardening diffusion depth over time t in steel processing." }
      ]
    },
    "biomaterials": {
      title: "Biomaterials",
      items: [
        { name: "Bioactivity Index", formula: "0.85 · t_0.5bb", desc: "Time required for hydroxyapatite bond formation on implant surfaces in simulated body fluid." }
      ]
    },
    "semiconductors": {
      title: "Semiconductors & Energy",
      items: [
        { name: "Built-in Potential (p-n Junction)", formula: "V_bi = (k_B T / q) · ln(N_A · N_D / n_i²)", desc: "Electrostatic potential barrier across an unbiased p-n junction diode." },
        { name: "Shockley-Queisser Limit", formula: "Efficiency Limit ≈ 33.7%", desc: "Maximum theoretical solar cell conversion efficiency for a single p-n junction under blackbody sunlight." }
      ]
    },
    "physics-math": {
      title: "Physics, Mathematics & Constants",
      items: [
        { name: "Ideal Gas Law", formula: "P · V = n · R · T", desc: "R = 8.314 J/(mol·K) or 0.0821 L·atm/(mol·K)." },
        { name: "Avogadro's Number", formula: "N_A = 6.022 × 10²³ mol⁻¹", desc: "Number of constituent particles in one mole of a substance." },
        { name: "Planck's Energy Relation", formula: "E = h · ν = (h · c) / λ", desc: "h = 6.626 × 10⁻³⁴ J·s, c = speed of light." }
      ]
    }
  };

  function renderCourse(courseKey) {
    const course = COURSES[courseKey];
    if (!course) {
      els.contentHost.innerHTML = `<p class="cs-empty">Select a course from the menu above to view its laws and formulas.</p>`;
      return;
    }

    let html = `<h3 class="cs-course-title">${course.title}</h3><div class="cs-cards-grid">`;
    course.items.forEach(item => {
      html += `
        <div class="cs-card">
          <div class="cs-card-name">${escapeHtml(item.name)}</div>
          <div class="cs-card-formula mono">${escapeHtml(item.formula)}</div>
          <div class="cs-card-desc">${escapeHtml(item.desc)}</div>
        </div>
      `;
    });
    html += `</div>`;
    els.contentHost.innerHTML = html;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Populate course select dropdown
  function initDropdown() {
    let opts = `<option value="">-- Choose a Materials Science / Chemistry Course --</option>`;
    for (const [key, val] of Object.entries(COURSES)) {
      opts += `<option value="${key}">${val.title}</option>`;
    }
    els.courseSelect.innerHTML = opts;
    els.courseSelect.addEventListener("change", (e) => {
      renderCourse(e.target.value);
    });
  }

  function openCheatSheet() {
    els.overlay.classList.remove("hidden");
    els.overlay.setAttribute("aria-hidden", "false");
  }

  function closeCheatSheet() {
    els.overlay.classList.add("hidden");
    els.overlay.setAttribute("aria-hidden", "true");
  }

  els.toggle.addEventListener("click", openCheatSheet);
  els.close.addEventListener("click", closeCheatSheet);
  els.overlay.addEventListener("click", e => { if (e.target === els.overlay) closeCheatSheet(); });

  initDropdown();
  renderCourse(""); // default empty state
})();
