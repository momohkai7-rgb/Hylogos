/* =========================================================================
   HYLOGOS ULTIMATE MASTER MATERIALS SCIENCE & CHEMISTRY CHEAT SHEET
   Exhaustive Academic Reference Architecture
   ========================================================================= */
(function masterCheatSheetModule() {
  const els = {
    toggle: document.getElementById("cheatSheetToggle"),
    overlay: document.getElementById("cheatSheetOverlay"),
    close: document.getElementById("cheatSheetClose"),
    contentHost: document.getElementById("csContentHost"),
  };

  if (!els.toggle || !els.overlay) return;

  const EXHAUSTIVE_CHEAT_SHEET = [
    {
      category: "1. Mathematics, Physics & Units Foundations",
      items: [
        { name: "Avogadro's Number", formula: "N_A = 6.02214076 × 10²³ mol⁻¹", desc: "Number of elementary entities in one mole of a substance." },
        { name: "Ideal Gas Constant", formula: "R = 8.314462618 J/(mol·K)", desc: "Universal gas constant linking energy, temperature, and moles." },
        { name: "Boltzmann Constant", formula: "k_B = 1.380649 × 10⁻²³ J/K", desc: "Relates thermodynamic temperature to microscopic kinetic energy." },
        { name: "Planck's Constant", formula: "h = 6.62607015 × 10⁻³⁴ J·s", desc: "Quantizes energy packets (photons) in quantum mechanics." },
        { name: "Speed of Light in Vacuum", formula: "c = 2.99792458 × 10⁸ m/s", desc: "Fundamental physical invariant constraint." },
        { name: "Faraday Constant", formula: "F = 96,485.33212 C/mol", desc: "Total electric charge carried by one mole of electrons." },
        { name: "Elementary Charge", formula: "e = 1.602176634 × 10⁻¹⁹ C", desc: "Charge of a single proton or negative charge of an electron." },
        { name: "Electron Rest Mass", formula: "m_e = 9.1093837 × 10⁻³¹ kg", desc: "Mass invariant of an electron at rest." },
        { name: "Proton Rest Mass", formula: "m_p = 1.6726219 × 10⁻²⁷ kg", desc: "Mass invariant of a proton at rest." },
        { name: "Neutron Rest Mass", formula: "m_n = 1.6749275 × 10⁻²⁷ kg", desc: "Mass invariant of a neutron at rest." },
        { name: "Permittivity of Free Space", formula: "ε₀ = 8.854187817 × 10⁻¹² F/m", desc: "Electric field constant in a classical vacuum." },
        { name: "Permeability of Free Space", formula: "μ₀ = 4π × 10⁻⁷ H/m", desc: "Magnetic field constant in a classical vacuum." },
        { name: "Taylor Series Expansion (General)", formula: "f(x) = Σ [fⁿ(a)/n!] · (x - a)ⁿ", desc: "Approximating smooth functions as infinite polynomial sums." },
        { name: "Gaussian Integral Identity", formula: "∫ exp(-ax²) dx = √(π / a)", desc: "Fundamental integral solving distributions in statistical mechanics." },
        { name: "Stokes' Theorem (Vector Calculus)", formula: "∮_C F · dr = ∬_S (∇ × F) · dA", desc: "Relates surface curl flux to a closed line contour integral." },
        { name: "Divergence Theorem (Gauss's Law)", formula: "∭_V (∇ · F) dV = ∮_S F · n dA", desc: "Relates volume divergence to net outward flux through a boundary surface." }
      ]
    },
    {
      category: "2. Materials Science Fundamentals & Crystallography",
      items: [
        { name: "Atomic Packing Factor (APF)", formula: "APF = (V_atoms / V_cell)", desc: "Fraction of space filled by hard-sphere atoms. SC=0.52, BCC=0.68, FCC/HCP=0.74." },
        { name: "Theoretical Density", formula: "ρ = (Z · M) / (N_A · V_c)", desc: "Z = formula units per cell, M = molar mass, V_c = unit cell volume." },
        { name: "Bragg's Law of X-ray Diffraction", formula: "n · λ = 2d_{hkl} · sin(θ)", desc: "Condition for constructive interference of scattered X-rays from lattice planes." },
        { name: "Interplanar Spacing (Cubic System)", formula: "d_{hkl} = a / √(h² + k² + l²)", desc: "Calculates distance between adjacent parallel planes with Miller indices (hkl)." },
        { name: "Interplanar Spacing (Tetragonal)", formula: "1/d² = (h² + k²) / a² + l² / c²", desc: "Plane spacing geometry for tetragonal crystal structures." },
        { name: "Interplanar Spacing (Orthorhombic)", formula: "1/d² = h²/a² + k²/b² + l²/c²", desc: "Plane spacing geometry for orthorhombic crystal structures." },
        { name: "Interplanar Spacing (Hexagonal)", formula: "1/d² = (4/3)[(h² + hk + k²) / a²] + l²/c²", desc: "Plane spacing geometry for hexagonal systems." },
        { name: "Weiss Zone Law", formula: "h·u + k·v + l·w = 0", desc: "Condition for a crystallographic direction [uvw] to lie within plane (hkl)." },
        { name: "Interplanar Angle (Cubic Systems)", formula: "cos(ϕ) = (h₁h₂ + k₁k₂ + l₁l₂) / [√(h₁²+k₁²+l₁²) · √(h₂²+k₂²+l₂²)]", desc: "Computes spatial angle ϕ between two lattice planes." },
        { name: "Burgers Vector Magnitude (FCC/BCC)", formula: "b = (a/2)·⟨110⟩ (FCC) or (a/2)·⟨111⟩ (BCC)", desc: "Magnitude and direction of lattice distortion caused by a dislocation." },
        { name: "Resolved Shear Stress (Schmid's Law)", formula: "τ_R = σ · cos(ϕ) · cos(λ)", desc: "Resolved shear stress on a slip system under uniaxial tension σ." },
        { name: "Pilling-Bedworth Ratio", formula: "PBR = (V_oxide) / (V_metal)", desc: "Ratio of oxide volume to parent metal volume; determines oxidation protective scales." }
      ]
    },
    {
      category: "3. Thermodynamics & Phase Diagrams",
      items: [
        { name: "First Law of Thermodynamics", formula: "ΔU = q + w", desc: "Conservation of energy in closed thermodynamic systems." },
        { name: "Enthalpy Definition", formula: "H = U + P · V", desc: "Total heat content tracked at constant pressure." },
        { name: "Entropy & Microstates", formula: "S = k_B · ln(W)", desc: "Boltzmann equation linking macroscopic entropy to microscopic probability." },
        { name: "Gibbs Free Energy", formula: "ΔG = ΔH - T · ΔS", desc: "Primary criterion for chemical and phase equilibrium stability." },
        { name: "Gibbs Phase Rule", formula: "F = C - P + 2", desc: "Degrees of freedom (F), chemical components (C), and phases (P)." },
        { name: "Condensed Phase Rule", formula: "F' = C - P + 1", desc: "Applied when system pressure is fixed constant." },
        { name: "The Lever Rule", formula: "f_α = (W_alloy - W_β) / (W_α - W_β)", desc: "Calculates phase fractions from tie-lines on binary phase diagrams." },
        { name: "Clausius-Clapeyron Equation", formula: "dP / dT = ΔH_vap / (T · ΔV)", desc: "Slope of coexistence curves on phase boundary plots." },
        { name: "Van 't Hoff Equation", formula: "d(ln K) / dT = ΔH° / (R · T²)", desc: "Temperature dependence of chemical equilibrium constants." },
        { name: "Chemical Potential Definition", formula: "μ_i = (∂G / ∂n_i)_{T,P,n_j}", desc: "Partial molar Gibbs free energy of component i." }
      ]
    },
    {
      category: "4. Kinetics, Diffusion & Processing",
      items: [
        { name: "Arrhenius Rate Equation", formula: "k = k₀ · exp(-E_a / (RT))", desc: "Thermal activation energy dependence of reaction and diffusion rates." },
        { name: "Fick's First Law (Steady State)", formula: "J = -D · (∂C / ∂x)", desc: "Diffusion flux driven proportionally by local concentration gradient." },
        { name: "Fick's Second Law (Transient)", formula: "∂C / ∂t = D · (∂²C / ∂x²)", desc: "Non-steady state mass accumulation over time and space." },
        { name: "Diffusion Coefficient Temperature Dependence", formula: "D = D₀ · exp(-Q_d / (RT))", desc: "Arrhenius relation for vacancy-mediated diffusion jumps." },
        { name: "Diffusion Penetration Depth", formula: "x_diffusion ≈ 4 · √(D · t)", desc: "Characteristic diffusion penetration scale over time interval t." },
        { name: "Zero-Order Rate Law", formula: "[A]_t = -k·t + [A]₀", desc: "Reaction rate is completely independent of reactant concentration." },
        { name: "First-Order Rate Law", formula: "ln([A]_t / [A]₀) = -k·t", desc: "Exponential decay kinetics." },
        { name: "Second-Order Rate Law", formula: "1 / [A]_t = k·t + (1 / [A]₀)", desc: "Bimolecular reaction kinetics." },
        { name: "Johnson-Mehl-Avrami-Kolmogorov (JMAK)", formula: "X(t) = 1 - exp(-k · tⁿ)", desc: "Phase transformation kinetics modeling nucleation and growth over time." }
      ]
    },
    {
      category: "5. Solid State Physics & Electronic Materials",
      items: [
        { name: "Fermi-Dirac Distribution", formula: "f(E) = 1 / [exp((E - E_F) / (k_B T)) + 1]", desc: "Probability of fermion state occupation at temperature T." },
        { name: "Density of States (3D Free Electrons)", formula: "g(E) = (V / 2π²) · (2m / ℏ²)^(3/2) · E^(1/2)", desc: "Number of quantum states per unit energy interval." },
        { name: "Drude Model Conductivity", formula: "σ = (n · e² · τ) / m", desc: "Electrical conductivity from electron density (n) and relaxation time (τ)." },
        { name: "Ohm's Law (Microscopic Form)", formula: "J = σ · E", desc: "Current density vector linked to electric field via conductivity tensor." },
        { name: "Intrinsic Carrier Concentration", formula: "n_i² = N_c · N_v · exp(-E_g / (k_B T))", desc: "Thermal carrier generation product in pure semiconductors." },
        { name: "Mass Action Law (Semiconductors)", formula: "n · p = n_i²", desc: "Equilibrium product of free electrons (n) and holes (p)." },
        { name: "Built-in Potential (p-n Junction)", formula: "V_bi = (k_B T / q) · ln(N_A · N_D / n_i²)", desc: "Electrostatic potential barrier across an unbiased junction." },
        { name: "Depletion Width (p-n Junction)", formula: "W = √[ (2ε_s / q) · (N_A + N_D)/(N_A N_D) · V_bi ]", desc: "Width of space-charge region in semiconductor diodes." }
      ]
    },
    {
      category: "6. Mechanical Properties of Materials",
      items: [
        { name: "Hooke's Law (1D Elasticity)", formula: "σ = E · ε", desc: "Normal stress proportional to elastic strain via Young's Modulus E." },
        { name: "Shear Stress-Strain Relation", formula: "τ = G · γ", desc: "Shear stress proportional to shear strain via Shear Modulus G." },
        { name: "Poisson's Ratio", formula: "ν = -ε_transverse / ε_axial", desc: "Lateral contraction relative to longitudinal stretching." },
        { name: "Isotropic Elastic Constants Relation", formula: "E = 2G(1 + ν) = 3K(1 - 2ν)", desc: "Interlinking expressions between E, G, Bulk Modulus K, and Poisson's ratio ν." },
        { name: "Hall-Petch Grain Size Strengthening", formula: "σ_y = σ₀ + k_y / √d", desc: "Yield strength scaling relative to grain boundary diameter d." },
        { name: "Hollomon Strain Hardening", formula: "σ = K · εⁿ", desc: "True stress-strain power law in plastic deformation regimes." },
        { name: "Griffith's Brittle Fracture Criterion", formula: "σ_f = √(2 · E · γ_s / (π · a))", desc: "Critical fracture stress for an internal sharp crack of length 2a." },
        { name: "Stress Intensity Factor (Mode I)", formula: "K_I = Y · σ · √(π · a)", desc: "Stress field severity near crack tips; Y is geometry factor." },
        { name: "Paris' Law (Fatigue Crack Growth)", formula: "da / dN = C · (ΔK)ᵐ", desc: "Fatigue crack propagation rate per load cycle N." }
      ]
    },
    {
      category: "7. Thermal, Electrical & Magnetic Properties",
      items: [
        { name: "Linear Thermal Expansion", formula: "ΔL / L₀ = α_L · ΔT", desc: "Dimensional expansion scaling with temperature change." },
        { name: "Fourier's Law of Heat Conduction", formula: "q = -k_{th} · (dT / dx)", desc: "Heat flux driven by thermal conductivity tensor k_{th}." },
        { name: "Wiedemann-Franz Law", formula: "k_{th} / (σ · T) = L", desc: "Proportionality ratio of thermal to electrical conductivity in metals." },
        { name: "Magnetic Field Induction", formula: "B = μ₀ · (H + M) = μ · H", desc: "Magnetic flux density (B), field strength (H), magnetization (M)." },
        { name: "Magnetic Susceptibility", formula: "χ_m = M / H", desc: "Material magnetization response ratio to external magnetic fields." },
        { name: "Curie-Weiss Law", formula: "χ_m = C / (T - T_c)", desc: "Susceptibility divergence above ferromagnetic Curie temperature T_c." }
      ]
    },
    {
      category: "8. Metallurgy, Polymers, Ceramics & Composites",
      items: [
        { name: "Carbon Equivalency (Weldability Index)", formula: "CE = C + (Mn+Si)/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15", desc: "Predicts hardenability and cold-cracking tendency in structural steels." },
        { name: "Number-Average Molecular Weight (Polymers)", formula: "M_n = Σ(N_i · M_i) / Σ(N_i)", desc: "Statistical average molecular weight based on chain molecule counts." },
        { name: "Weight-Average Molecular Weight", formula: "M_w = Σ(W_i · M_i) / Σ(W_i)", desc: "Statistical average molecular weight weighted by mass fractions." },
        { name: "Degree of Polymerization", formula: "DP = M_n / M_repeat", desc: "Average count of repeat monomer units in polymer chains." },
        { name: "Rule of Mixtures (Composite Axial Modulus)", formula: "E_c = V_f · E_f + V_m · E_m", desc: "Upper-bound stiffness parallel to continuous reinforcing fibers." },
        { name: "Inverse Rule of Mixtures (Transverse Modulus)", formula: "E_c = (E_f · E_m) / (V_m · E_f + V_f · E_m)", desc: "Lower-bound stiffness transverse to fiber orientation." },
        { name: "Ionic Radii Ratio Rules (Ceramics)", formula: "ρ_c / ρ_a bounds coordination geometry", desc: "Predicts stable cation-anion coordination numbers in ionic crystals." }
      ]
    },
    {
      category: "9. Nanomaterials, Corrosion & Characterization",
      items: [
        { name: "Surface-to-Volume Ratio", formula: "SA : V = 3 / r (for spheres)", desc: "Fractional scaling shift as structures shrink down to nanoscale." },
        { name: "Scherrer Equation (XRD Grain Size)", formula: "D = (K · λ) / (β · cos(θ))", desc: "Crystallite domain size estimation from X-ray peak broadening." },
        { name: "Faraday's Law of Corrosion Mass Loss", formula: "m = (I · t · M) / (z · F)", desc: "Corrosion mass loss rate driven by oxidation current over time." },
        { name: "Pitting Resistance Equivalent Number (PREN)", formula: "PREN = %Cr + 3.3(%Mo) + 16(%N)", desc: "Alloy ranking index for localized pitting corrosion resistance." },
        { name: "Energy Dispersive X-ray Spectroscopy (EDS)", formula: "E = h·ν = E_core - E_shell", desc: "Characteristic X-ray emission fingerprinting elemental structures." }
      ]
    }
  ];

  function renderCheatSheet() {
    let html = "";
    EXHAUSTIVE_CHEAT_SHEET.forEach(section => {
      html += `
        <div class="cs-category-block">
          <h3 class="cs-category-title">${escapeHtml(section.category)}</h3>
          <div class="cs-cards-grid">
      `;
      section.items.forEach(item => {
        html += `
          <div class="cs-card">
            <div class="cs-card-name">${escapeHtml(item.name)}</div>
            <div class="cs-card-formula mono">${escapeHtml(item.formula)}</div>
            <div class="cs-card-desc">${escapeHtml(item.desc)}</div>
          </div>
        `;
      });
      html += `</div></div>`;
    });
    els.contentHost.innerHTML = html;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function openCheatSheet() {
    els.overlay.classList.remove("hidden");
    els.overlay.setAttribute("aria-hidden", "false");
    renderCheatSheet();
  }

  function closeCheatSheet() {
    els.overlay.classList.add("hidden");
    els.overlay.setAttribute("aria-hidden", "true");
  }

  els.toggle.addEventListener("click", openCheatSheet);
  els.close.addEventListener("click", closeCheatSheet);
  els.overlay.addEventListener("click", e => { if (e.target === els.overlay) closeCheatSheet(); });
})();
