/* ===================== Hylogos Comprehensive Master Cheat Sheet ===================== */
(function cheatSheetModule() {
  const els = {
    toggle: document.getElementById("cheatSheetToggle"),
    overlay: document.getElementById("cheatSheetOverlay"),
    close: document.getElementById("cheatSheetClose"),
    contentHost: document.getElementById("csContentHost"),
  };

  if (!els.toggle || !els.overlay) return;

  // Massive master database covering all requested subjects exhaustively
  const CHEAT_SHEET_DATA = [
    {
      category: "🔥 1. Foundations, Constants & Basic Chemistry",
      items: [
        { name: "Avogadro's Number", formula: "N_A = 6.02214076 × 10²³ mol⁻¹", desc: "Number of constituent particles (atoms, molecules, ions) in one mole." },
        { name: "Ideal Gas Constant", formula: "R = 8.31446 J/(mol·K) = 0.08206 (L·atm)/(mol·K)", desc: "Relates pressure, volume, temperature, and substance amount in ideal gases." },
        { name: "Boltzmann Constant", formula: "k_B = 1.380649 × 10⁻²³ J/K", desc: "Relates average relative kinetic energy of particles in a gas with thermodynamic temperature." },
        { name: "Planck's Constant", formula: "h = 6.62607015 × 10⁻³⁴ J·s", desc: "Relates photon energy to its frequency (E = hν)." },
        { name: "Speed of Light in Vacuum", formula: "c = 2.99792458 × 10⁸ m/s", desc: "Universal physical constant important in spectroscopy and relativistic energy equations." },
        { name: "Faraday Constant", formula: "F = 96,485 C/mol", desc: "Magnitude of electric charge per mole of electrons." },
        { name: "Electron Mass", formula: "m_e = 9.1093837 × 10⁻³¹ kg", desc: "Rest mass of a single electron." },
        { name: "Proton Mass", formula: "m_p = 1.6726219 × 10⁻²⁷ kg", desc: "Rest mass of a single proton." },
        { name: "Molar Mass Definition", formula: "M = m / n", desc: "Mass (m) of a sample divided by the amount of substance in moles (n)." },
        { name: "Number of Moles (Particles)", formula: "n = N / N_A", desc: "Number of particles (N) divided by Avogadro's number." },
        { name: "Number of Moles (Gas at STP)", formula: "n = V / V_m", desc: "Volume (V) divided by molar volume of a gas at STP (V_m = 22.414 L/mol)." },
        { name: "Molarity (Concentration)", formula: "C = n / V_solution", desc: "Moles of solute per liter of solution (mol/L)." },
        { name: "Molality", formula: "b = n_solute / m_solvent (kg)", desc: "Moles of solute per kilogram of pure solvent (mol/kg)." },
        { name: "Mass Percentage", formula: "Mass % = (m_element / m_total) × 100%", desc: "Proportion of a component's mass relative to total compound mass." },
        { name: "Mole Fraction", formula: "χ_i = n_i / Σ(n_total)", desc: "Moles of a specific component divided by total moles of all components." },
        { name: "Dilution Law", formula: "C₁V₁ = C₂V₂", desc: "Conservation of moles when diluting a concentrated stock solution." },
        { name: "Empirical to Molecular Formula", formula: "Molecular Formula = n × (Empirical Formula)", desc: "Where n = (Molar Mass of Compound) / (Mass of Empirical Formula)." }
      ]
    },
    {
      category: "🧪 2. General Chemistry & Stoichiometry",
      items: [
        { name: "Ideal Gas Law", formula: "P · V = n · R · T", desc: "Pressure (P), Volume (V), Moles (n), Gas Constant (R), Temperature (T in Kelvin)." },
        { name: "Boyle's Law", formula: "P₁V₁ = P₂V₂", desc: "Pressure and volume are inversely proportional at constant temperature." },
        { name: "Charles's Law", formula: "V₁ / T₁ = V₂ / T₂", desc: "Volume and temperature are directly proportional at constant pressure." },
        { name: "Gay-Lussac's Law", formula: "P₁ / T₁ = P₂ / T₂", desc: "Pressure and temperature are directly proportional at constant volume." },
        { name: "Dalton's Law of Partial Pressures", formula: "P_total = P₁ + P₂ + P₃ + ... = Σ(χ_i · P_total)", desc: "Total pressure exerted by a gas mixture equals the sum of partial pressures." },
        { name: "Graham's Law of Effusion", formula: "Rate₁ / Rate₂ = √(M₂ / M₁)", desc: "Rate of gas effusion is inversely proportional to the square root of its molar mass." },
        { name: "Combined Gas Law", formula: "(P₁V₁) / T₁ = (P₂V₂) / T₂", desc: "Relates pressure, volume, and temperature changes for a fixed gas mass." },
        { name: "Van der Waals Real Gas Equation", formula: "(P + a(n/V)²)(V - nb) = nRT", desc: "Adjusts ideal gas law for molecular volume (b) and intermolecular attractions (a)." }
      ]
    },
    {
      category: "💧 3. Analytical Chemistry & Solutions",
      items: [
        { name: "pH and pOH Definitions", formula: "pH = -log[H⁺], pOH = -log[OH⁻]", desc: "Logarithmic scale for acidity and basicity in aqueous solutions." },
        { name: "Ion Product of Water", formula: "K_w = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (at 25°C)", desc: "Equilibrium constant for the self-ionization of water." },
        { name: "Acid Dissociation Constant (Ka)", formula: "K_a = ([H⁺][A⁻]) / [HA], pK_a = -log(K_a)", desc: "Strength of an acid in solution." },
        { name: "Henderson-Hasselbalch Equation", formula: "pH = pK_a + log([A⁻] / [HA])", desc: "Calculates pH of buffer solutions composed of weak acids and conjugate bases." },
        { name: "Beer-Lambert Law", formula: "A = ε · b · c", desc: "Absorbance (A) equals molar absorptivity (ε) × path length (b) × concentration (c)." },
        { name: "Titration Equivalence Point", formula: "n_a · M_a · V_a = n_b · M_b · V_b", desc: "Stoichiometric neutralization relation between acid and base reactants." },
        { name: "Solubility Product Constant (Ksp)", formula: "K_sp = [Mⁿ⁺]ᵐ[Xᵐ⁻]ⁿ", desc: "Equilibrium constant indicating the solubility of ionic compounds in water." }
      ]
    },
    {
      category: "⚡ 4. Electrochemistry & Thermodynamics",
      items: [
        { name: "First Law of Thermodynamics", formula: "ΔU = q + w", desc: "Internal energy change equals heat added plus work done." },
        { name: "Enthalpy Definition", formula: "H = U + P · V", desc: "Heat content of a system at constant pressure." },
        { name: "Gibbs Free Energy Change", formula: "ΔG = ΔH - T · ΔS", desc: "Determines thermodynamic spontaneity (ΔG < 0 is spontaneous)." },
        { name: "Standard Gibbs Free Energy & Equilibrium", formula: "ΔG° = -R · T · ln(K)", desc: "Links equilibrium constant K directly to standard free energy." },
        { name: "Nernst Equation", formula: "E = E° - ((RT) / (nF)) · ln(Q)", desc: "Calculates cell potential under non-standard conditions." },
        { name: "Gibbs Free Energy & Cell Potential", formula: "ΔG° = -n · F · E°", desc: "Relates thermodynamic driving force to electrochemical cell voltage." },
        { name: "Arrhenius Reaction Rate Equation", formula: "k = A · exp(-E_a / (RT))", desc: "Temperature dependency of reaction rate constants." },
        { name: "Clausius-Clapeyron Equation", formula: "ln(P₂ / P₁) = -(ΔH_vap / R) · (1/T₂ - 1/T₁)", desc: "Relates vapor pressure changes across temperatures." }
      ]
    },
    {
      category: "💎 5. Crystallography & Crystal Structures",
      items: [
        { name: "Bragg's Law of X-ray Diffraction", formula: "n · λ = 2d_{hkl} · sin(θ)", desc: "Condition for constructive interference from lattice planes." },
        { name: "Interplanar Spacing (Cubic System)", formula: "d_{hkl} = a / √(h² + k² + l²)", desc: "Calculates spacing between planes identified by Miller indices (hkl)." },
        { name: "Interplanar Spacing (Tetragonal)", formula: "1/d² = (h² + k²) / a² + l² / c²", desc: "Plane spacing formula for tetragonal crystal systems." },
        { name: "Interplanar Spacing (Hexagonal)", formula: "1/d² = (4/3)·((h² + hk + k²) / a²) + l² / c²", desc: "Plane spacing formula for hexagonal crystal systems." },
        { name: "Unit Cell Density Formula", formula: "ρ = (Z · M) / (N_A · V_c)", desc: "Calculates macroscopic density from unit cell geometry." },
        { name: "Atomic Packing Factor (APF)", formula: "APF = (Volume of Atoms in Cell) / (Total Unit Cell Volume)", desc: "SC = 0.52, BCC = 0.68, FCC / HCP = 0.74." },
        { name: "Weiss Zone Law", formula: "h·u + k·v + l·w = 0", desc: "Condition for direction [uvw] to lie within crystal plane (hkl)." }
      ]
    },
    {
      category: "🔬 6. Solid State Physics & Electronic Materials",
      items: [
        { name: "Fermi-Dirac Distribution Function", formula: "f(E) = 1 / (exp((E - E_F) / (k_B T)) + 1)", desc: "Probability that an electron energy state is occupied at temperature T." },
        { name: "Density of States (3D Electron Gas)", formula: "g(E) = (V / 2π²) · (2m / ℏ²)^(3/2) · E^(1/2)", desc: "Number of electron states per unit energy interval per unit volume." },
        { name: "Drude Electrical Conductivity", formula: "σ = (n · e² · τ) / m", desc: "Calculates conductivity from carrier density (n), charge (e), and relaxation time (τ)." },
        { name: "Mass Action Law (Semiconductors)", formula: "n · p = n_i²", desc: "Product of electron (n) and hole (p) concentrations in thermal equilibrium." },
        { name: "Built-in Potential (p-n Junction)", formula: "V_bi = (k_B T / q) · ln(N_A · N_D / n_i²)", desc: "Electrostatic potential barrier across an unbiased junction diode." },
        { name: "Bandgap Energy Relation", formula: "E_g = h · c / λ_cutoff", desc: "Photon energy threshold required to excite electrons across the semiconductor bandgap." }
      ]
    },
    {
      category: "⚙️ 7. Materials Science, Metallurgy & Mechanical Properties",
      items: [
        { name: "Hooke's Law (Elastic Stress-Strain)", formula: "σ = E · ε", desc: "Stress (σ) equals Young's Modulus (E) times elastic strain (ε)." },
        { name: "Hall-Petch Grain Size Strengthening", formula: "σ_y = σ₀ + k_y / √d", desc: "Yield strength increases as grain diameter (d) decreases." },
        { name: "Hollomon Strain Hardening Equation", formula: "σ = K · εⁿ", desc: "True stress-strain relationship during plastic deformation." },
        { name: "Fick's First Law of Diffusion", formula: "J = -D · (dC / dx)", desc: "Steady-state mass flux driven by concentration gradient." },
        { name: "Fick's Second Law of Diffusion", formula: "∂C / ∂t = D · (∂²C / ∂x²)", desc: "Non-steady state diffusion over time (t)." },
        { name: "Diffusion Coefficient Temperature Dependence", formula: "D = D₀ · exp(-Q_d / (RT))", desc: "Arrhenius relation for vacancy-mediated atomic diffusion." },
        { name: "Griffith's Brittle Fracture Criterion", formula: "σ_f = √(2 · E · γ_s / (π · a))", desc: "Critical stress to propagate a crack of length 2a in brittle solids." },
        { name: "Pilling-Bedworth Ratio (Oxidation)", formula: "PBR = V_oxide / V_metal", desc: "Ratio of oxide volume to consumed metal volume; PBR > 1 forms protective scale." },
        { name: "Rule of Mixtures (Composite Modulus)", formula: "E_c = V_f · E_f + V_m · E_m", desc: "Longitudinal elastic modulus for fiber-reinforced composites." }
      ]
    },
    {
      category: "🧪 8. Organic Chemistry & Kinetics",
      items: [
        { name: "First-Order Integrated Rate Law", formula: "ln([A]_t / [A]₀) = -k · t", desc: "Relates reactant concentration drop over time for first-order reactions." },
        { name: "Radioactive Half-Life", formula: "t_{1/2} = 0.693 / k", desc: "Time required for half of a radioactive or reactant quantity to decay." },
        { name: "Second-Order Integrated Rate Law", formula: "1 / [A]_t = k · t + (1 / [A]₀)", desc: "Concentration relation for second-order kinetics." },
        { name: "Index of Hydrogen Deficiency (IHD / Degree of Unsaturation)", formula: "IHD = C + 1 - (H / 2) + (N / 2)", desc: "Determines number of rings or double bonds from an organic molecular formula." },
        { name: "Arrhenius Activation Energy", formula: "ln(k₂ / k₁) = -(E_a / R) · (1/T₂ - 1/T₁)", desc: "Calculates activation energy comparing reaction rates at two different temperatures." }
      ]
    }
  ];

  function renderCheatSheet() {
    let html = "";
    CHEAT_SHEET_DATA.forEach(section => {
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
    renderCheatSheet(); // render full sheet contents on open
  }

  function closeCheatSheet() {
    els.overlay.classList.add("hidden");
    els.overlay.setAttribute("aria-hidden", "true");
  }

  els.toggle.addEventListener("click", openCheatSheet);
  els.close.addEventListener("click", closeCheatSheet);
  els.overlay.addEventListener("click", e => { if (e.target === els.overlay) closeCheatSheet(); });
})();
