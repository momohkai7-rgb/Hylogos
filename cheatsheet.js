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
        { name: "Avogadro's Number", formula: "N_A = 6.02214076 × 10²³ mol⁻¹ (exact, SI-defined)", desc: "Number of elementary entities in one mole of a substance." },
        { name: "Ideal Gas Constant", formula: "R = N_A·k_B = 8.31446261815324 J/(mol·K) (exact)", desc: "Universal gas constant linking energy, temperature, and moles; exact since both N_A and k_B are SI-defined." },
        { name: "Boltzmann Constant", formula: "k_B = 1.380649 × 10⁻²³ J/K (exact, SI-defined)", desc: "Relates thermodynamic temperature to microscopic kinetic energy." },
        { name: "Planck's Constant", formula: "h = 6.62607015 × 10⁻³⁴ J·s (exact, SI-defined)", desc: "Quantizes energy packets (photons) in quantum mechanics." },
        { name: "Speed of Light in Vacuum", formula: "c = 299 792 458 m/s (exact, SI-defined)", desc: "Fundamental physical invariant constraint." },
        { name: "Faraday Constant", formula: "F = N_A·e = 96 485.33212 C/mol (exact)", desc: "Total electric charge carried by one mole of electrons." },
        { name: "Elementary Charge", formula: "e = 1.602176634 × 10⁻¹⁹ C (exact, SI-defined)", desc: "Charge of a single proton or negative charge of an electron." },
        { name: "Electron Rest Mass", formula: "m_e = 9.1093837139(28) × 10⁻³¹ kg", desc: "Mass invariant of an electron at rest. CODATA 2022 recommended value." },
        { name: "Proton Rest Mass", formula: "m_p = 1.67262192595(52) × 10⁻²⁷ kg", desc: "Mass invariant of a proton at rest. CODATA 2022 recommended value." },
        { name: "Neutron Rest Mass", formula: "m_n = 1.67492749804(95) × 10⁻²⁷ kg", desc: "Mass invariant of a neutron at rest. CODATA 2022 recommended value." },
        { name: "Vacuum Electric Permittivity", formula: "ε₀ = 8.8541878188(14) × 10⁻¹² F/m", desc: "No longer an exact defining constant since the 2019 SI redefinition — now a measured quantity derived from α, h, e, c." },
        { name: "Vacuum Magnetic Permeability", formula: "μ₀ = 1.25663706127(20) × 10⁻⁶ N/A²", desc: "Was exactly 4π×10⁻⁷ H/m before 2019; now measured, and differs from that value starting at the 10th significant figure." },
        { name: "Taylor Series Expansion (General)", formula: "f(x) = Σ [fⁿ(a)/n!] · (x - a)ⁿ", desc: "Approximating smooth functions as infinite polynomial sums." },
        { name: "Gaussian Integral Identity", formula: "∫ exp(-ax²) dx = √(π / a)", desc: "Fundamental integral solving distributions in statistical mechanics." },
        { name: "Stokes' Theorem (Vector Calculus)", formula: "∮_C F · dr = ∬_S (∇ × F) · dA", desc: "Relates surface curl flux to a closed line contour integral." },
        { name: "Divergence Theorem (Gauss's Law)", formula: "∭_V (∇ · F) dV = ∮_S F · n dA", desc: "Relates volume divergence to net outward flux through a boundary surface." },
        { name: "Newtonian Gravitational Constant", formula: "G = 6.67430(15) × 10⁻¹¹ m³ kg⁻¹ s⁻²", desc: "Coupling constant in Newton's law of universal gravitation; the least precisely known fundamental constant (~2×10⁻⁵ relative uncertainty)." },
        { name: "Standard Gravity", formula: "g = 9.80665 m/s² (exact, conventional value)", desc: "Internationally defined standard acceleration due to gravity, not a measured physical constant." },
        { name: "Atomic Mass Unit", formula: "1 u = 1.66053906892(52) × 10⁻²⁷ kg", desc: "Reference mass unit, 1/12 the mass of a carbon-12 atom. CODATA 2022 recommended value." },
        { name: "Stefan-Boltzmann Constant", formula: "σ = π²k_B⁴/(60ℏ³c²) = 5.670374419... × 10⁻⁸ W/(m²·K⁴) (exact)", desc: "Links total radiated power per area of a black body to T⁴; exact since derived entirely from exact constants." },
        { name: "Wien's Displacement Law", formula: "λ_max · T = b = 2.897771955... × 10⁻³ m·K (exact)", desc: "Peak black-body emission wavelength scales inversely with temperature." },
        { name: "Rydberg Constant", formula: "R_∞ = 10 973 731.568157(12) m⁻¹", desc: "Sets the scale of atomic transition energies and spectral line positions. CODATA 2022 recommended value." },
        { name: "Bohr Radius", formula: "a₀ = 5.29177210544(82) × 10⁻¹¹ m", desc: "Most probable electron-nucleus distance in the ground-state hydrogen atom. CODATA 2022 recommended value." },
        { name: "Reduced Planck's Constant", formula: "ℏ = h / 2π = 1.054571817... × 10⁻³⁴ J·s (exact)", desc: "Angular-frequency form of Planck's constant, used throughout quantum mechanics." },
        { name: "Coulomb's Constant", formula: "k_e = 1/(4πε₀) ≈ 8.9875517862 × 10⁹ N·m²/C²", desc: "Proportionality constant in Coulomb's law; now technically a measured (not exact) quantity since ε₀ is measured." },
        { name: "Fine-Structure Constant", formula: "α = 7.2973525643(11) × 10⁻³; α⁻¹ = 137.035999177(21)", desc: "Dimensionless electromagnetic coupling strength. CODATA 2022 value — shifted from the 2018 value (α⁻¹ = 137.035999084) after new atom-interferometry measurements." },
        { name: "Molar Volume of Ideal Gas (STP)", formula: "V_m = 22.413969... L/mol (T = 273.15 K, p = 101.325 kPa)", desc: "Volume occupied by one mole of ideal gas at standard temperature and pressure; exact since derived from R." },
        { name: "Electronvolt", formula: "1 eV = 1.602176634 × 10⁻¹⁹ J (exact)", desc: "Energy gained by an electron accelerated through 1 volt; standard atomic/particle-scale energy unit." },
        { name: "Standard Atmosphere", formula: "1 atm = 101,325 Pa (exact, defined)", desc: "Reference pressure unit used in STP conventions and vapor-pressure tables." },
        { name: "Bohr Magneton", formula: "μ_B = 9.2740100783 × 10⁻²⁴ J/T", desc: "Natural unit of magnetic moment for an electron's orbital or spin angular momentum." },
      ]
    },
    {
      category: "2. Classical Mechanics",
      items: [
        { name: "Newton's Second Law", formula: "F = ma", desc: "Net force on an object equals its mass times acceleration — the foundation of classical dynamics." },
        { name: "Newton's Law of Universal Gravitation", formula: "F = G·m₁m₂ / r²", desc: "Attractive force between two masses, decreasing with the square of their separation." },
        { name: "Kinematic Equation (Velocity)", formula: "v = v₀ + at", desc: "Velocity after time t under constant acceleration a, starting from initial velocity v₀." },
        { name: "Kinematic Equation (Position)", formula: "x = x₀ + v₀t + (1/2)at²", desc: "Position after time t under constant acceleration, starting from position x₀ and velocity v₀." },
        { name: "Kinematic Equation (Velocity-Position)", formula: "v² = v₀² + 2a(x - x₀)", desc: "Relates velocity directly to displacement under constant acceleration, without needing time." },
        { name: "Kinetic Energy", formula: "KE = (1/2)mv²", desc: "Energy an object possesses due to its motion." },
        { name: "Gravitational Potential Energy", formula: "PE = mgh", desc: "Energy stored due to an object's height h in a uniform gravitational field g." },
        { name: "Work-Energy Theorem", formula: "W = ΔKE", desc: "Net work done on an object equals its change in kinetic energy." },
        { name: "Conservation of Linear Momentum", formula: "m₁v₁ + m₂v₂ = m₁v₁′ + m₂v₂′", desc: "Total momentum of an isolated system is unchanged before and after a collision or interaction." },
        { name: "Impulse-Momentum Theorem", formula: "J = FΔt = Δp", desc: "Impulse delivered to an object equals its change in momentum." },
        { name: "Centripetal Force", formula: "F_c = mv² / r", desc: "Net inward force required to keep an object moving in a circular path of radius r." },
        { name: "Angular Momentum (Rotating Body)", formula: "L = Iω", desc: "Rotational analog of linear momentum; I = moment of inertia, ω = angular velocity." },
        { name: "Torque", formula: "τ = rF·sin(θ)", desc: "Rotational analog of force; the turning effect of F applied at radius r and angle θ." },
        { name: "Power (Mechanical)", formula: "P = W / t = Fv", desc: "Rate of doing work, or equivalently force times velocity in the direction of motion." },
        { name: "Kinetic Friction Force", formula: "f_k = μ_k·N", desc: "Resistive force opposing relative sliding, proportional to the normal force N." },
        { name: "Escape Velocity", formula: "v_esc = √(2GM / r)", desc: "Minimum speed needed to escape a gravitating body's pull from distance r, ignoring drag." },
        { name: "Kepler's Third Law (Circular Orbit)", formula: "T² = 4π²r³ / (GM)", desc: "Orbital period squared is proportional to orbital radius cubed, for a body orbiting mass M." },
        { name: "Moment of Inertia (Solid Sphere)", formula: "I = (2/5)MR²", desc: "Rotational inertia of a uniform solid sphere about an axis through its center." },
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
        { name: "Chemical Potential Definition", formula: "μ_i = (∂G / ∂n_i)_{T,P,n_j}", desc: "Partial molar Gibbs free energy of component i." },
        { name: "Helmholtz Free Energy", formula: "A = U - T · S", desc: "Maximum extractable work from a closed system at constant temperature and volume." },
        { name: "Clausius Inequality", formula: "dS ≥ δq / T", desc: "General statement of the second law; equality holds only for reversible processes." },
        { name: "Raoult's Law (Ideal Solutions)", formula: "P_i = x_i · P_i*", desc: "Partial vapor pressure of a component scales with its mole fraction in an ideal mixture." },
        { name: "Henry's Law (Dilute Solutions)", formula: "P_i = k_H · x_i", desc: "Partial pressure of a dilute solute is proportional to its mole fraction." },
        { name: "Regular Solution Model", formula: "ΔH_mix = Ω · x_A · x_B", desc: "Enthalpy of mixing via the interaction parameter Ω; underlies many binary phase diagrams." },
        { name: "Gibbs-Duhem Equation", formula: "Σ x_i · dμ_i = 0 (const. T, P)", desc: "Constrains how chemical potentials of components in a mixture vary together." },
        { name: "Kirchhoff's Law of Thermochemistry", formula: "d(ΔH) / dT = ΔC_p", desc: "Describes how reaction enthalpy shifts with temperature via heat capacity differences." },
        { name: "Specific Heat Capacity", formula: "Q = mcΔT", desc: "Heat required to change a mass m's temperature by ΔT, via its specific heat c." },
        { name: "Latent Heat", formula: "Q = mL", desc: "Heat absorbed or released during a phase change at constant temperature, via latent heat L." },
        { name: "Carnot Efficiency", formula: "η_Carnot = 1 - T_C / T_H", desc: "Maximum possible efficiency of a heat engine operating between hot and cold reservoirs T_H and T_C." },
        { name: "Adiabatic Process (Ideal Gas)", formula: "PV^γ = constant", desc: "Pressure-volume relationship for a gas that exchanges no heat with its surroundings; γ = C_p/C_v." },
        { name: "Coefficient of Performance (Refrigerator)", formula: "COP = Q_C / W", desc: "Ratio of heat removed from the cold reservoir to work input, for a refrigerator or heat pump." },
      ]
    },
    {
      category: "4. Electromagnetism",
      items: [
        { name: "Coulomb's Law", formula: "F = k_e·q₁q₂ / r²", desc: "Electrostatic force between two point charges, decreasing with the square of their separation." },
        { name: "Electric Field (Point Charge)", formula: "E = k_e·Q / r²", desc: "Field strength at distance r from a point charge Q." },
        { name: "Electric Potential (Point Charge)", formula: "V = k_e·Q / r", desc: "Electric potential energy per unit charge at distance r from a point charge Q." },
        { name: "Gauss's Law", formula: "∮ E · dA = Q_enc / ε₀", desc: "Total electric flux through a closed surface is proportional to the enclosed charge." },
        { name: "Capacitance", formula: "C = Q / V", desc: "Charge stored per unit voltage across a capacitor." },
        { name: "Parallel-Plate Capacitor", formula: "C = ε₀A / d", desc: "Capacitance of two parallel plates of area A separated by distance d in vacuum." },
        { name: "Ampère's Law", formula: "∮ B · dl = μ₀I_enc", desc: "Relates the magnetic field circulating around a closed loop to the current passing through it." },
        { name: "Faraday's Law of Induction", formula: "EMF = -dΦ_B / dt", desc: "A changing magnetic flux through a circuit induces an electromotive force." },
        { name: "Lorentz Force", formula: "F = qE + qv × B", desc: "Total force on a charged particle from combined electric and magnetic fields." },
        { name: "Force on a Current-Carrying Wire", formula: "F = BIL·sin(θ)", desc: "Magnetic force on a straight wire of length L carrying current I in field B." },
        { name: "RC Circuit Time Constant", formula: "τ = RC", desc: "Time for a charging/discharging RC circuit to reach ~63% of its final value." },
        { name: "RL Circuit Time Constant", formula: "τ = L / R", desc: "Time for current in an RL circuit to reach ~63% of its final value." },
        { name: "Biot-Savart Law", formula: "dB = (μ₀ / 4π)·(I·dl × r̂) / r²", desc: "Magnetic field contribution from a small current element, the magnetic analog of Coulomb's law." },
        { name: "Magnetic Field of a Long Straight Wire", formula: "B = μ₀I / (2πr)", desc: "Field strength at perpendicular distance r from an infinite straight current-carrying wire." },
        { name: "Magnetic Field Inside a Solenoid", formula: "B = μ₀nI", desc: "Uniform field inside a long solenoid with n turns per unit length carrying current I." },
        { name: "Energy Stored in a Capacitor", formula: "U = (1/2)CV²", desc: "Electrical potential energy stored in a charged capacitor." },
        { name: "Energy Stored in an Inductor", formula: "U = (1/2)LI²", desc: "Magnetic energy stored in an inductor carrying current I." },
        { name: "Resonant Frequency (LC Circuit)", formula: "f = 1 / (2π√(LC))", desc: "Natural oscillation frequency of an inductor-capacitor circuit." },
      ]
    },
    {
      category: "5. Fluid Mechanics & Dynamics",
      items: [
        { name: "Newton's Law of Viscosity", formula: "τ = η · (dv/dy)", desc: "Shear stress in a Newtonian fluid is proportional to the local velocity gradient (shear rate)." },
        { name: "Reynolds Number", formula: "Re = ρ · v · D / η", desc: "Ratio of inertial to viscous forces; predicts laminar vs. turbulent flow regime." },
        { name: "Power-Law (Ostwald-de Waele) Fluid Model", formula: "τ = K · (dv/dy)ⁿ", desc: "Describes shear-thinning or shear-thickening non-Newtonian fluids via consistency index K and flow index n." },
        { name: "Bingham Plastic Model", formula: "τ = τ₀ + η_pl · (dv/dy), for τ > τ₀", desc: "Fluid that behaves as a rigid body below a yield stress τ₀ and flows like a viscous fluid above it." },
        { name: "Casson Model (Chocolate/Suspension Rheology)", formula: "√τ = √τ₀ + √(η_ca · γ̇)", desc: "The ICA-standard model for characterizing molten chocolate viscosity and yield stress during QC testing." },
        { name: "Stokes' Law (Particle Settling Velocity)", formula: "v = 2r²(ρ_p - ρ_f)g / (9η)", desc: "Terminal settling velocity of a small sphere falling through a viscous fluid under gravity." },
        { name: "Bernoulli's Equation", formula: "P + (1/2)ρv² + ρgh = constant", desc: "Energy conservation along a streamline for an ideal, incompressible, non-viscous flow." },
        { name: "Continuity Equation", formula: "A₁v₁ = A₂v₂", desc: "Volumetric flow rate is conserved along a pipe or streamtube of varying cross-section." },
        { name: "Hydrostatic Pressure", formula: "P = ρgh", desc: "Pressure at depth h in a static fluid due to the weight of fluid above." },
        { name: "Archimedes' Principle (Buoyant Force)", formula: "F_b = ρ_fluid·g·V_displaced", desc: "Upward buoyant force equals the weight of fluid displaced by a submerged or floating object." },
        { name: "Drag Force", formula: "F_d = (1/2)C_d·ρ·v²·A", desc: "Resistive force on an object moving through a fluid, via its drag coefficient C_d and frontal area A." },
        { name: "Poiseuille's Law (Laminar Pipe Flow)", formula: "Q = πΔPr⁴ / (8ηL)", desc: "Volumetric flow rate through a cylindrical pipe under laminar flow, strongly dependent on radius." },
        { name: "Torricelli's Law (Efflux Velocity)", formula: "v = √(2gh)", desc: "Exit speed of fluid draining from an orifice at depth h below the free surface." },
        { name: "Darcy-Weisbach Equation", formula: "ΔP = f·(L / D)·(ρv² / 2)", desc: "Frictional pressure drop along a pipe of length L and diameter D, via the dimensionless friction factor f." },
        { name: "Mach Number", formula: "M = v / v_sound", desc: "Ratio of flow speed to the local speed of sound; M > 1 marks supersonic flow." },
        { name: "Froude Number", formula: "Fr = v / √(gL)", desc: "Ratio of inertial to gravitational forces in flow with a free surface, e.g. open channels and ship hulls." },
        { name: "Laplace Pressure", formula: "ΔP = 2γ / r", desc: "Excess pressure inside a spherical liquid droplet or bubble surface due to surface tension γ." },
      ]
    },
    {
      category: "6. Waves & Oscillations",
      items: [
        { name: "Simple Harmonic Motion (Position)", formula: "x(t) = A·cos(ωt + φ)", desc: "Position of an oscillator over time; A = amplitude, ω = angular frequency, φ = phase." },
        { name: "Angular Frequency (Mass-Spring System)", formula: "ω = √(k / m)", desc: "Natural oscillation frequency of a mass m on a spring of stiffness k." },
        { name: "Period of a Simple Pendulum", formula: "T = 2π√(L / g)", desc: "Oscillation period of a pendulum of length L, valid for small swing angles." },
        { name: "Wave Speed", formula: "v = f·λ", desc: "Relates a wave's propagation speed to its frequency and wavelength." },
        { name: "Damped Harmonic Oscillator", formula: "x(t) = A·exp(-γt)·cos(ω′t + φ)", desc: "Oscillation amplitude decays exponentially over time due to a damping term γ." },
        { name: "Doppler Effect", formula: "f′ = f·(v ± v_o) / (v ∓ v_s)", desc: "Observed frequency shifts when source and observer are in relative motion; signs depend on direction of approach or recession." },
        { name: "Speed of Sound in a Gas", formula: "v = √(γRT / M)", desc: "Sound speed in an ideal gas; γ = heat capacity ratio, M = molar mass." },
        { name: "Sound Intensity Level", formula: "β (dB) = 10·log₁₀(I / I₀)", desc: "Logarithmic decibel scale for sound intensity, referenced to I₀ = 10⁻¹² W/m² (threshold of hearing)." },
        { name: "Beat Frequency", formula: "f_beat = |f₁ - f₂|", desc: "Rate of loudness pulsing heard when two close but distinct frequencies overlap." },
        { name: "Quality Factor (Resonance)", formula: "Q = ω₀ / Δω", desc: "Sharpness of a resonance peak — higher Q means a narrower bandwidth Δω around resonant frequency ω₀." },
      ]
    },
    {
      category: "7. Optics & Photonic Materials",
      items: [
        { name: "Snell's Law of Refraction", formula: "n₁ · sin(θ₁) = n₂ · sin(θ₂)", desc: "Governs how light bends when crossing an interface between two media of different refractive index." },
        { name: "Refractive Index", formula: "n = c / v", desc: "Ratio of light's speed in vacuum to its speed within a material; sets how strongly the material bends light." },
        { name: "Brewster's Angle", formula: "tan(θ_B) = n₂ / n₁", desc: "Angle of incidence at which reflected light becomes fully polarized." },
        { name: "Malus's Law", formula: "I = I₀ · cos²(θ)", desc: "Intensity of polarized light transmitted through a polarizer at angle θ to the light's polarization axis." },
        { name: "Diffraction Grating Equation", formula: "d · sin(θ) = m · λ", desc: "Predicts the angles at which constructive interference produces diffraction orders m from a grating of spacing d." },
        { name: "Tauc Relation (Optical Bandgap)", formula: "(αhν)ⁿ = A(hν - E_g)", desc: "Extracts a semiconductor or thin film's optical bandgap E_g from absorption coefficient data (n=2 direct, n=1/2 indirect transitions)." },
        { name: "Thin Lens Equation", formula: "1/f = 1/d_o + 1/d_i", desc: "Relates focal length to object and image distances for a thin lens." },
        { name: "Lensmaker's Equation", formula: "1/f = (n - 1)·[1/R₁ - 1/R₂]", desc: "Predicts a thin lens's focal length from its refractive index and surface curvatures." },
        { name: "Magnification (Thin Lens)", formula: "m = -d_i / d_o", desc: "Ratio of image height to object height; sign indicates upright (+) or inverted (-) image." },
        { name: "Critical Angle (Total Internal Reflection)", formula: "θ_c = sin⁻¹(n₂ / n₁)", desc: "Angle of incidence beyond which light is entirely reflected at an interface, going from denser to less dense medium." },
        { name: "Numerical Aperture", formula: "NA = n·sin(θ)", desc: "Measures a lens or fiber's light-gathering ability and resolving power." },
      ]
    },
    {
      category: "8. Quantum Mechanics & Atomic Structure",
      items: [
        { name: "de Broglie Wavelength", formula: "λ = h / p", desc: "Wave-particle duality relation between a particle's momentum and its associated wavelength." },
        { name: "Heisenberg Uncertainty Principle", formula: "Δx · Δp ≥ ℏ / 2", desc: "Fundamental limit on simultaneously knowing a particle's position and momentum precisely." },
        { name: "Photoelectric Effect", formula: "E_k = hν - Φ", desc: "Kinetic energy of an emitted electron equals photon energy minus the material's work function Φ." },
        { name: "Bohr Model Energy Levels", formula: "E_n = -13.6 eV · (Z² / n²)", desc: "Quantized electron energy levels for hydrogen-like atoms of atomic number Z." },
        { name: "Bohr Radius of nth Orbit", formula: "r_n = n² · a₀ / Z", desc: "Radius of the nth electron orbit in the Bohr model for a hydrogen-like atom." },
        { name: "Schrödinger Equation (Time-Independent, 1D)", formula: "-ℏ²/(2m) · d²ψ/dx² + V(x)ψ = Eψ", desc: "Governs the stationary-state wavefunctions and allowed energies of a quantum system." },
        { name: "Rydberg Formula (Spectral Lines)", formula: "1/λ = R_H · (1/n₁² - 1/n₂²)", desc: "Predicts the wavelengths of spectral lines emitted or absorbed by hydrogen." },
        { name: "Pauli Exclusion Principle", formula: "No two fermions share an identical set of quantum numbers", desc: "Governs electron configuration and underlies the structure of the periodic table." },
        { name: "Compton Scattering", formula: "Δλ = (h / m_e c) · (1 - cos θ)", desc: "Wavelength shift of a photon scattered by a free electron, demonstrating light's particle nature." },
        { name: "Zeeman Effect", formula: "ΔE = m_l · g · μ_B · B", desc: "Splitting of atomic energy levels in an external magnetic field, used to probe electronic structure." },
        { name: "Particle in a 1D Box (Energy Levels)", formula: "E_n = n²h² / (8mL²)", desc: "Quantized energy levels of a particle confined to an infinite square well of width L." },
        { name: "Planck's Law (Blackbody Spectral Radiance)", formula: "B(λ,T) = (2hc² / λ⁵) · 1/[exp(hc/λk_BT) - 1]", desc: "Spectral energy distribution radiated by an ideal blackbody at temperature T." },
        { name: "Quantum Harmonic Oscillator Energy", formula: "E_n = (n + 1/2)ℏω", desc: "Quantized energy levels of a quantum mechanical oscillator, evenly spaced by ℏω." },
      ]
    },
    {
      category: "9. General & Physical Chemistry",
      items: [
        { name: "Molarity", formula: "M = mol solute / L solution", desc: "Most common concentration unit, defined as moles of solute per liter of total solution." },
        { name: "Molality", formula: "m = mol solute / kg solvent", desc: "Temperature-independent concentration unit based on solvent mass rather than solution volume." },
        { name: "Dilution Equation", formula: "M₁V₁ = M₂V₂", desc: "Conserves moles of solute when a solution is diluted from concentration/volume 1 to 2." },
        { name: "Ideal Gas Law", formula: "PV = nRT", desc: "Relates pressure, volume, moles, and temperature for an ideal gas." },
        { name: "Combined Gas Law", formula: "P₁V₁/T₁ = P₂V₂/T₂", desc: "Tracks a fixed amount of gas through simultaneous changes in pressure, volume, and temperature." },
        { name: "Dalton's Law of Partial Pressures", formula: "P_total = ΣPᵢ", desc: "Total pressure of a gas mixture equals the sum of each component's partial pressure." },
        { name: "Graham's Law of Effusion", formula: "rate₁/rate₂ = √(M₂/M₁)", desc: "Lighter gas molecules effuse through a small opening faster than heavier ones." },
        { name: "Percent Yield", formula: "%Yield = (actual / theoretical) × 100", desc: "Compares the experimentally obtained product amount to the maximum stoichiometrically possible." },
        { name: "Empirical-to-Molecular Formula Relation", formula: "Molecular formula = (empirical formula)ₙ, n = M_molecular / M_empirical", desc: "Scales up a compound's simplest whole-number ratio formula to its true molecular formula." },
        { name: "Boyle's Law", formula: "P₁V₁ = P₂V₂", desc: "At constant temperature, gas pressure and volume are inversely proportional." },
        { name: "Charles's Law", formula: "V₁/T₁ = V₂/T₂", desc: "At constant pressure, gas volume is directly proportional to absolute temperature." },
        { name: "Density", formula: "ρ = m / V", desc: "Mass per unit volume of a substance." },
        { name: "Mole Fraction", formula: "x_i = n_i / n_total", desc: "Fraction of total moles in a mixture contributed by component i." },
      ]
    },
    {
      category: "10. Acid-Base & Aqueous Equilibrium",
      items: [
        { name: "pH Definition", formula: "pH = -log[H⁺]", desc: "Logarithmic measure of hydrogen ion concentration; lower pH means more acidic." },
        { name: "pOH Definition", formula: "pOH = -log[OH⁻]", desc: "Logarithmic measure of hydroxide ion concentration, complementary to pH." },
        { name: "Water Autoionization Constant", formula: "K_w = [H⁺][OH⁻] = 1.0 × 10⁻¹⁴ (25 °C); pH + pOH = 14", desc: "Fixed product of hydrogen and hydroxide ion concentrations in pure water at room temperature." },
        { name: "Henderson-Hasselbalch Equation", formula: "pH = pKₐ + log([A⁻]/[HA])", desc: "Calculates buffer solution pH from the ratio of conjugate base to weak acid concentrations." },
        { name: "Acid Dissociation Constant", formula: "Kₐ = [H⁺][A⁻] / [HA]", desc: "Equilibrium constant quantifying how completely a weak acid ionizes in water." },
        { name: "Solubility Product Constant", formula: "K_sp = [Aⁿ⁺]ᵃ[Bᵐ⁻]ᵇ", desc: "Equilibrium constant governing the maximum ion concentrations in a saturated sparingly-soluble salt solution." },
        { name: "General Equilibrium Constant", formula: "K = [C]ᶜ[D]ᵈ / ([A]ᵃ[B]ᵇ)  for aA + bB ⇌ cC + dD", desc: "Ratio of product to reactant concentrations (raised to stoichiometric coefficients) at equilibrium." },
        { name: "Base Dissociation Constant", formula: "K_b = [BH⁺][OH⁻] / [B]", desc: "Equilibrium constant quantifying how completely a weak base ionizes in water." },
        { name: "Ka-Kb Relationship", formula: "K_a · K_b = K_w", desc: "Links the acid and base dissociation constants of a conjugate acid-base pair to water's autoionization constant." },
        { name: "Percent Ionization", formula: "%ionization = ([H⁺] / [HA]₀) × 100", desc: "Fraction of a weak acid's initial concentration that has dissociated at equilibrium." },
      ]
    },
    {
      category: "11. Colligative Properties & Coordination Chemistry",
      items: [
        { name: "Freezing Point Depression", formula: "ΔT_f = i · K_f · m", desc: "Solute particles lower a solvent's freezing point proportionally to molality and van 't Hoff factor i." },
        { name: "Boiling Point Elevation", formula: "ΔT_b = i · K_b · m", desc: "Solute particles raise a solvent's boiling point proportionally to molality and van 't Hoff factor i." },
        { name: "Osmotic Pressure", formula: "Π = i · M · R · T", desc: "Pressure required to stop osmotic solvent flow across a semipermeable membrane." },
        { name: "Crystal Field Splitting Energy", formula: "Δ_o = E(eg) - E(t2g)", desc: "Energy gap between d-orbital sets in an octahedral transition-metal complex, set by ligand field strength." },
        { name: "Spin-Only Magnetic Moment", formula: "μ_S = √[n(n + 2)] μ_B", desc: "Predicts a transition-metal complex's magnetic moment from its number of unpaired d-electrons n." },
        { name: "Van 't Hoff Factor", formula: "i = (moles of particles in solution) / (moles of solute dissolved)", desc: "Accounts for solute dissociation when applying colligative property formulas — i=1 for non-electrolytes, higher for salts." },
        { name: "Tetrahedral Crystal Field Splitting", formula: "Δ_t = (4/9)Δ_o", desc: "Tetrahedral ligand field splitting is smaller than octahedral splitting for the same metal and ligands." },
      ]
    },
    {
      category: "12. Electrochemistry & Corrosion Kinetics",
      items: [
        { name: "Nernst Equation", formula: "E = E° - (RT / nF) · ln(Q)", desc: "Relates electrode/cell potential to standard potential, temperature, and reaction quotient Q." },
        { name: "Standard Cell Potential", formula: "E°_cell = E°_cathode - E°_anode", desc: "Overall driving voltage of a galvanic cell from its two standard half-cell potentials." },
        { name: "Faraday's Laws of Electrolysis", formula: "m = (Q · M) / (nF) = (I · t · M) / (nF)", desc: "Mass of substance deposited or dissolved at an electrode is proportional to charge passed." },
        { name: "Tafel Equation", formula: "η = β · log(i / i₀)", desc: "Relates overpotential η to current density on a single electrode reaction near equilibrium." },
        { name: "Butler-Volmer Equation", formula: "i = i₀ · [exp(αnFη/RT) - exp(-(1-α)nFη/RT)]", desc: "General kinetic model for net electrode current as a function of overpotential in both directions." },
        { name: "Stern-Geary Equation (Linear Polarization Resistance)", formula: "i_corr = B / R_p, where B = (β_a·β_c) / [2.303(β_a+β_c)]", desc: "Estimates corrosion current density from polarization resistance without destructive weight-loss testing." },
        { name: "Molar Conductivity", formula: "Λ_m = κ / c", desc: "Solution conductivity normalized by concentration, used to compare electrolytes' ion-transport ability." },
        { name: "Kohlrausch's Law", formula: "Λ_m° = λ₊° + λ₋°", desc: "At infinite dilution, molar conductivity is the sum of independent ionic contributions from cation and anion." },
      ]
    },
    {
      category: "13. Mechanical Properties of Materials",
      items: [
        { name: "Hooke's Law (1D Elasticity)", formula: "σ = E · ε", desc: "Normal stress proportional to elastic strain via Young's Modulus E." },
        { name: "Shear Stress-Strain Relation", formula: "τ = G · γ", desc: "Shear stress proportional to shear strain via Shear Modulus G." },
        { name: "Poisson's Ratio", formula: "ν = -ε_transverse / ε_axial", desc: "Lateral contraction relative to longitudinal stretching." },
        { name: "Isotropic Elastic Constants Relation", formula: "E = 2G(1 + ν) = 3K(1 - 2ν)", desc: "Interlinking expressions between E, G, Bulk Modulus K, and Poisson's ratio ν." },
        { name: "Hall-Petch Grain Size Strengthening", formula: "σ_y = σ₀ + k_y / √d", desc: "Yield strength scaling relative to grain boundary diameter d." },
        { name: "Hollomon Strain Hardening", formula: "σ = K · εⁿ", desc: "True stress-strain power law in plastic deformation regimes." },
        { name: "Griffith's Brittle Fracture Criterion", formula: "σ_f = √(2 · E · γ_s / (π · a))", desc: "Critical fracture stress for an internal sharp crack of length 2a." },
        { name: "Stress Intensity Factor (Mode I)", formula: "K_I = Y · σ · √(π · a)", desc: "Stress field severity near crack tips; Y is geometry factor." },
        { name: "Paris' Law (Fatigue Crack Growth)", formula: "da / dN = C · (ΔK)ᵐ", desc: "Fatigue crack propagation rate per load cycle N." },
        { name: "True Stress-Strain Conversion", formula: "σ_true = σ_eng(1 + ε_eng); ε_true = ln(1 + ε_eng)", desc: "Converts engineering stress-strain values to true values (valid up to necking)." },
        { name: "Modulus of Resilience", formula: "U_r = σ_y² / (2E)", desc: "Elastic strain energy a material absorbs per unit volume up to yielding." },
        { name: "Norton's Power-Law Creep", formula: "ε̇_ss = A · σⁿ · exp(-Q / RT)", desc: "Steady-state creep strain rate as a function of stress and temperature." },
        { name: "Larson-Miller Parameter", formula: "LMP = T · (C + log t_r)", desc: "Correlates temperature and rupture time for extrapolating long-term creep life; C ≈ 20 for many metals." },
        { name: "Miner's Rule (Cumulative Fatigue Damage)", formula: "Σ (n_i / N_i) = 1", desc: "Linear damage accumulation model for components under variable-amplitude fatigue loading." },
        { name: "Basquin's Law (Stress-Life Fatigue)", formula: "Δσ/2 = σ_f' · (2N_f)^b", desc: "Relates cyclic stress amplitude to fatigue life in the high-cycle regime." },
        { name: "Vickers Hardness Number", formula: "HV = 1.854·F / d²", desc: "Standard indentation hardness from applied load F (kgf) and mean diagonal length d (mm) of a diamond pyramid indent." },
        { name: "Ductility (Percent Elongation)", formula: "%EL = [(L_f - L₀) / L₀] × 100", desc: "Permanent tensile elongation at fracture, relative to the original gauge length L₀." },
      ]
    },
    {
      category: "14. Structural Mechanics & Stability",
      items: [
        { name: "Euler's Critical Buckling Load", formula: "P_cr = π²EI / (KL)²", desc: "Load at which a slender column buckles; K is the effective-length factor set by the column's end conditions." },
        { name: "Second Moment of Area (Rectangular Section)", formula: "I = bh³ / 12", desc: "Cross-sectional stiffness term about the centroidal axis; b = width, h = height." },
        { name: "Flexural (Bending) Stress", formula: "σ = My / I", desc: "Bending stress at distance y from the neutral axis under bending moment M." },
        { name: "Beam Deflection (Simply Supported, Center Load)", formula: "δ_max = PL³ / (48EI)", desc: "Maximum deflection at midspan of a simply supported beam under a central point load P." },
        { name: "Torsional Shear Stress", formula: "τ = Tr / J", desc: "Shear stress at radius r in a shaft under torque T; J is the polar second moment of area." },
        { name: "Radius of Gyration", formula: "r = √(I / A)", desc: "Effective distance over which a cross-section's area is concentrated for bending/buckling purposes." },
        { name: "Slenderness Ratio", formula: "λ = KL / r", desc: "Column geometry parameter that determines whether failure is by buckling (high λ) or yielding (low λ)." },
        { name: "Von Mises Stress", formula: "σ_v = √{[(σ₁-σ₂)² + (σ₂-σ₃)² + (σ₃-σ₁)²] / 2}", desc: "Equivalent uniaxial stress used to predict yielding under complex, multiaxial loading." },
        { name: "Principal Stresses (2D)", formula: "σ_1,2 = (σx+σy)/2 ± √[((σx-σy)/2)² + τxy²]", desc: "Maximum and minimum normal stresses at a point under plane stress, found via Mohr's circle." },
      ]
    },
    {
      category: "15. Viscoelasticity & Polymer Dynamics",
      items: [
        { name: "Maxwell Model (Stress Relaxation)", formula: "σ(t) = σ₀ · exp(-t / τ)", desc: "Stress decay over time in a viscoelastic solid held at constant strain; spring and dashpot in series." },
        { name: "Relaxation Time", formula: "τ = η / E", desc: "Characteristic timescale over which viscoelastic stress relaxes, set by viscosity and stiffness." },
        { name: "Kelvin-Voigt Model (Creep Compliance)", formula: "ε(t) = (σ₀ / E) · [1 - exp(-t / τ)]", desc: "Strain growth over time under constant stress; spring and dashpot in parallel." },
        { name: "Complex Modulus (Dynamic Mechanical Analysis)", formula: "E* = E′ + iE″", desc: "Splits a viscoelastic material's response to oscillatory load into elastic (storage, E′) and viscous (loss, E″) parts." },
        { name: "Loss Tangent", formula: "tan δ = E″ / E′", desc: "Ratio of energy dissipated to energy stored per oscillation cycle — a standard DMA damping metric." },
        { name: "WLF Equation (Time-Temperature Superposition)", formula: "log(a_T) = -C₁(T - T_ref) / [C₂ + (T - T_ref)]", desc: "Predicts how polymer relaxation timescales shift with temperature; universal constants C₁≈17.4, C₂≈51.6 K when T_ref = T_g." },
        { name: "Deborah Number", formula: "De = τ_relaxation / τ_observation", desc: "Ratio of a material's relaxation time to the observation timescale; high De means solid-like behavior." },
      ]
    },
    {
      category: "16. Solid State Physics & Electronic Materials",
      items: [
        { name: "Fermi-Dirac Distribution", formula: "f(E) = 1 / [exp((E - E_F) / (k_B T)) + 1]", desc: "Probability of fermion state occupation at temperature T." },
        { name: "Density of States (3D Free Electrons)", formula: "g(E) = (V / 2π²) · (2m / ℏ²)^(3/2) · E^(1/2)", desc: "Number of quantum states per unit energy interval." },
        { name: "Drude Model Conductivity", formula: "σ = (n · e² · τ) / m", desc: "Electrical conductivity from electron density (n) and relaxation time (τ)." },
        { name: "Ohm's Law (Microscopic Form)", formula: "J = σ · E", desc: "Current density vector linked to electric field via conductivity tensor." },
        { name: "Intrinsic Carrier Concentration", formula: "n_i² = N_c · N_v · exp(-E_g / (k_B T))", desc: "Thermal carrier generation product in pure semiconductors." },
        { name: "Mass Action Law (Semiconductors)", formula: "n · p = n_i²", desc: "Equilibrium product of free electrons (n) and holes (p)." },
        { name: "Built-in Potential (p-n Junction)", formula: "V_bi = (k_B T / q) · ln(N_A · N_D / n_i²)", desc: "Electrostatic potential barrier across an unbiased junction." },
        { name: "Depletion Width (p-n Junction)", formula: "W = √[ (2ε_s / q) · (N_A + N_D)/(N_A N_D) · V_bi ]", desc: "Width of space-charge region in semiconductor diodes." },
        { name: "Hall Voltage", formula: "V_H = I · B / (n · e · t)", desc: "Transverse voltage generated by charge carriers moving through a magnetic field." },
        { name: "Hall Coefficient", formula: "R_H = 1 / (n · e)", desc: "Material-specific constant linking Hall field to current density and magnetic field." },
        { name: "Varshni Equation (Bandgap vs. Temperature)", formula: "E_g(T) = E_g(0) - αT² / (T + β)", desc: "Empirical model for how semiconductor bandgap narrows with rising temperature." },
        { name: "Effective Mass (Electron in a Band)", formula: "m* = ℏ² / (d²E/dk²)", desc: "Curvature of the energy-momentum band structure sets the electron's apparent inertial mass." },
        { name: "Debye T³ Law (Low-T Heat Capacity)", formula: "C_v = (12π⁴/5) · N k_B · (T/θ_D)³", desc: "Lattice heat capacity of a solid at low temperature, governed by the Debye temperature θ_D." },
        { name: "Einstein Relation (Diffusivity-Mobility)", formula: "D = μ · k_B T / q", desc: "Links a charge carrier's diffusion coefficient to its drift mobility." },
        { name: "Piezoelectric Effect", formula: "D = d · σ (direct); ε = d · E (converse)", desc: "Electric displacement generated by applied stress, or strain generated by applied field." },
        { name: "Seebeck Effect", formula: "ΔV = S · ΔT", desc: "Thermoelectric voltage generated across a material subjected to a temperature gradient." },
        { name: "Thermoelectric Figure of Merit", formula: "ZT = S² · σ · T / κ", desc: "Combines Seebeck coefficient, electrical conductivity, and thermal conductivity to rate thermoelectric performance." },
        { name: "Photon Energy", formula: "E = hc / λ", desc: "Energy of a photon in terms of its wavelength — the basic light-matter energy relation." },
        { name: "Fermi Velocity", formula: "v_F = ℏk_F / m", desc: "Speed of electrons at the Fermi surface, set by the Fermi wavevector k_F." },
      ]
    },
    {
      category: "17. Superconductivity",
      items: [
        { name: "BCS Energy Gap-Tc Relation", formula: "Δ(0) = 1.764 · k_B · T_c", desc: "Weak-coupling BCS theory result linking the zero-temperature superconducting energy gap to the critical temperature." },
        { name: "London Penetration Depth", formula: "λ_L = √(m / (μ₀ · n_s · e²))", desc: "Depth to which an external magnetic field penetrates a superconductor before being screened out (Meissner effect)." },
        { name: "Critical Magnetic Field (Type I)", formula: "H_c(T) = H_c(0) · [1 - (T/T_c)²]", desc: "Empirical parabolic law for the field above which superconductivity is destroyed at a given temperature." },
        { name: "Upper Critical Field (Type II)", formula: "H_c2 = Φ₀ / (2π · ξ²)", desc: "Field at which a type-II superconductor fully transitions to the normal state; ξ = coherence length, Φ₀ = flux quantum." },
        { name: "Josephson Current-Phase Relation", formula: "I = I_c·sin(δ)", desc: "Supercurrent through a Josephson junction as a function of the phase difference δ across it." },
      ]
    },
    {
      category: "18. Energy Storage & Semiconductor Devices",
      items: [
        { name: "Shockley Diode Equation", formula: "I = I₀ · [exp(qV / kT) - 1]", desc: "Current-voltage relationship of an ideal p-n junction diode." },
        { name: "Theoretical Specific Capacity (Battery Electrode)", formula: "Q_th = nF / (3.6M)  [mAh/g]", desc: "Maximum charge storable per gram of active material; n = electrons transferred, M = molar mass." },
        { name: "C-Rate", formula: "C-rate = I / Q_nominal", desc: "Charge/discharge current normalized to the cell's rated capacity — a C-rate of 1C fully charges/discharges in one hour." },
        { name: "Coulombic Efficiency", formula: "CE % = (Q_discharge / Q_charge) × 100", desc: "Fraction of charge recovered on discharge relative to charge put in — a key battery-cycling health metric." },
        { name: "MOSFET Saturation Drain Current", formula: "I_D = (1/2) · μ_nC_ox · (W/L) · (V_GS - V_th)²", desc: "Drain current of a MOSFET operating in saturation, as a function of gate overdrive voltage." },
        { name: "Solar Cell Fill Factor", formula: "FF = (V_mp·I_mp) / (V_oc·I_sc)", desc: "Measures how 'square' a solar cell's I-V curve is — higher FF means better power conversion." },
        { name: "Solar Cell Efficiency", formula: "η = (V_oc·I_sc·FF) / P_in", desc: "Fraction of incident solar power converted to electrical power output." },
      ]
    },
    {
      category: "19. Thermal, Electrical & Magnetic Properties",
      items: [
        { name: "Linear Thermal Expansion", formula: "ΔL / L₀ = α_L · ΔT", desc: "Dimensional expansion scaling with temperature change." },
        { name: "Fourier's Law of Heat Conduction", formula: "q = -k_{th} · (dT / dx)", desc: "Heat flux driven by thermal conductivity tensor k_{th}." },
        { name: "Wiedemann-Franz Law", formula: "k_{th} / (σ · T) = L", desc: "Proportionality ratio of thermal to electrical conductivity in metals." },
        { name: "Magnetic Field Induction", formula: "B = μ₀ · (H + M) = μ · H", desc: "Magnetic flux density (B), field strength (H), magnetization (M)." },
        { name: "Magnetic Susceptibility", formula: "χ_m = M / H", desc: "Material magnetization response ratio to external magnetic fields." },
        { name: "Curie-Weiss Law", formula: "χ_m = C / (T - T_c)", desc: "Susceptibility divergence above ferromagnetic Curie temperature T_c." },
        { name: "Thermal Diffusivity", formula: "α = k_{th} / (ρ · c_p)", desc: "Rate at which a temperature disturbance propagates through a material." },
        { name: "Biot Number", formula: "Bi = h · L_c / k_{th}", desc: "Compares internal conduction resistance to surface convection resistance during heat transfer." },
        { name: "Fourier Number (Heat Transfer)", formula: "Fo = α · t / L_c²", desc: "Dimensionless time controlling transient heat conduction problems." },
        { name: "Peltier Effect", formula: "Q = Π · I", desc: "Heat absorbed or released at a junction of dissimilar conductors carrying current I." },
        { name: "Dielectric Polarization", formula: "P = ε₀ · χ_e · E", desc: "Induced polarization density of a dielectric under an applied electric field." },
        { name: "Electromagnetic Skin Depth", formula: "δ = √(2ρ / (ω · μ))", desc: "Depth at which induced current density falls to 1/e of its surface value; relevant to eddy-current NDT." },
        { name: "Thermal Shock Resistance Parameter", formula: "R = σ_f(1 - ν) / (Eα)", desc: "Predicts a brittle material's resistance to fracture from rapid temperature change; higher R is more resistant." },
        { name: "Electrical Resistance", formula: "R = ρL / A", desc: "Resistance of a conductor from its resistivity, length, and cross-sectional area." },
      ]
    },
    {
      category: "20. Materials Science Fundamentals & Crystallography",
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
        { name: "Pilling-Bedworth Ratio", formula: "PBR = (V_oxide) / (V_metal)", desc: "Ratio of oxide volume to parent metal volume; determines oxidation protective scales." },
        { name: "Miller-Bravais Index Conversion", formula: "i = -(h + k)", desc: "Derives the redundant third index in the 4-index hexagonal (hkil) notation." },
        { name: "Linear Density (Crystallographic)", formula: "LD = (atoms centered on direction) / (length of direction vector)", desc: "Number of atoms per unit length along a specific crystallographic direction." },
        { name: "Planar Density (Crystallographic)", formula: "PD = (atoms centered on plane) / (area of that plane)", desc: "Number of atoms per unit area on a specific crystallographic plane." },
        { name: "Reciprocal Lattice Vector", formula: "b₁ = 2π (a₂ × a₃) / [a₁ · (a₂ × a₃)]", desc: "Defines the reciprocal-space basis vectors used in diffraction theory (physics convention)." },
        { name: "Structure Factor (X-ray Diffraction)", formula: "F_hkl = Σⱼ fⱼ · exp[2πi(hxⱼ + kyⱼ + lzⱼ)]", desc: "Sums atomic scattering contributions to predict diffraction peak intensities." },
        { name: "Vegard's Law", formula: "a_alloy(x) = (1 - x)·a_A + x·a_B", desc: "Predicts the lattice parameter of a solid solution as a linear function of composition." },
        { name: "Goldschmidt Tolerance Factor", formula: "t = (r_A + r_X) / [√2·(r_B + r_X)]", desc: "Predicts perovskite (ABX₃) structural stability from ionic radii; t near 1 favors the ideal cubic structure." },
      ]
    },
    {
      category: "21. Kinetics, Diffusion & Processing",
      items: [
        { name: "Arrhenius Rate Equation", formula: "k = k₀ · exp(-E_a / (RT))", desc: "Thermal activation energy dependence of reaction and diffusion rates." },
        { name: "Fick's First Law (Steady State)", formula: "J = -D · (∂C / ∂x)", desc: "Diffusion flux driven proportionally by local concentration gradient." },
        { name: "Fick's Second Law (Transient)", formula: "∂C / ∂t = D · (∂²C / ∂x²)", desc: "Non-steady state mass accumulation over time and space." },
        { name: "Diffusion Coefficient Temperature Dependence", formula: "D = D₀ · exp(-Q_d / (RT))", desc: "Arrhenius relation for vacancy-mediated diffusion jumps." },
        { name: "Diffusion Penetration Depth", formula: "x_diffusion ≈ 4 · √(D · t)", desc: "Characteristic diffusion penetration scale over time interval t." },
        { name: "Zero-Order Rate Law", formula: "[A]_t = -k·t + [A]₀", desc: "Reaction rate is completely independent of reactant concentration." },
        { name: "First-Order Rate Law", formula: "ln([A]_t / [A]₀) = -k·t", desc: "Exponential decay kinetics." },
        { name: "Second-Order Rate Law", formula: "1 / [A]_t = k·t + (1 / [A]₀)", desc: "Bimolecular reaction kinetics." },
        { name: "Johnson-Mehl-Avrami-Kolmogorov (JMAK)", formula: "X(t) = 1 - exp(-k · tⁿ)", desc: "Phase transformation kinetics modeling nucleation and growth over time." },
        { name: "Diffusion Profile (Semi-Infinite Solid)", formula: "(C_x - C_0)/(C_s - C_0) = 1 - erf[x / (2√(Dt))]", desc: "Solution to Fick's second law used for carburizing, doping, and coating depth profiles." },
        { name: "Homogeneous Nucleation Rate", formula: "I = I₀ · exp(-ΔG* / (k_B T))", desc: "Rate at which stable nuclei form per unit volume per unit time." },
        { name: "Critical Nucleus Radius", formula: "r* = -2γ / ΔG_v", desc: "Minimum radius a nucleus must reach to grow spontaneously; γ = surface energy." },
        { name: "Critical Free Energy Barrier", formula: "ΔG* = 16πγ³ / (3ΔG_v²)", desc: "Activation energy barrier for homogeneous nucleation to overcome." },
        { name: "Ostwald Ripening (LSW Coarsening)", formula: "r³ - r₀³ = k · t", desc: "Average particle/grain radius grows with the cube root of time via diffusion-controlled coarsening." },
        { name: "Half-Life (First-Order Kinetics)", formula: "t₁/₂ = ln(2) / k", desc: "Time for a reactant concentration to fall to half its initial value." },
        { name: "Grain Growth Kinetics", formula: "dⁿ - d₀ⁿ = Kt", desc: "Average grain size grows with time during annealing, following a power-law rate constant K." },
      ]
    },
    {
      category: "22. Metallurgy, Polymers, Ceramics & Composites",
      items: [
        { name: "Carbon Equivalency (Weldability Index)", formula: "CE = C + (Mn+Si)/6 + (Cr+Mo+V)/5 + (Ni+Cu)/15", desc: "Predicts hardenability and cold-cracking tendency in structural steels." },
        { name: "Number-Average Molecular Weight (Polymers)", formula: "M_n = Σ(N_i · M_i) / Σ(N_i)", desc: "Statistical average molecular weight based on chain molecule counts." },
        { name: "Weight-Average Molecular Weight", formula: "M_w = Σ(W_i · M_i) / Σ(W_i)", desc: "Statistical average molecular weight weighted by mass fractions." },
        { name: "Degree of Polymerization", formula: "DP = M_n / M_repeat", desc: "Average count of repeat monomer units in polymer chains." },
        { name: "Rule of Mixtures (Composite Axial Modulus)", formula: "E_c = V_f · E_f + V_m · E_m", desc: "Upper-bound stiffness parallel to continuous reinforcing fibers." },
        { name: "Inverse Rule of Mixtures (Transverse Modulus)", formula: "E_c = (E_f · E_m) / (V_m · E_f + V_f · E_m)", desc: "Lower-bound stiffness transverse to fiber orientation." },
        { name: "Ionic Radii Ratio Rules (Ceramics)", formula: "ρ_c / ρ_a bounds coordination geometry", desc: "Predicts stable cation-anion coordination numbers in ionic crystals." },
        { name: "Fox Equation (Copolymer/Blend Tg)", formula: "1 / T_g = w₁/T_g1 + w₂/T_g2", desc: "Predicts the glass transition temperature of a miscible polymer blend from its components." },
        { name: "Halpin-Tsai Equation (Composite Modulus)", formula: "E_c/E_m = (1+ξηV_f)/(1-ηV_f), η=[(E_f/E_m)-1]/[(E_f/E_m)+ξ]", desc: "More realistic transverse-modulus prediction for fiber composites than the simple rule of mixtures." },
        { name: "Weibull Failure Probability (Ceramics)", formula: "P_f = 1 - exp[-(σ/σ₀)^m]", desc: "Statistical model for brittle fracture probability; m is the Weibull modulus (flaw-population scatter)." },
        { name: "Degree of Crystallinity (Polymers)", formula: "%X_c = [ρ_c(ρ_s - ρ_a)] / [ρ_s(ρ_c - ρ_a)] × 100", desc: "Estimates crystalline fraction of a semicrystalline polymer from bulk, crystalline, and amorphous densities." },
        { name: "Thermal Expansion Mismatch Stress", formula: "σ = E·Δα·ΔT / (1 - ν)", desc: "Biaxial residual stress generated when bonded materials with different CTEs are heated or cooled, e.g. thin films or coatings." },
        { name: "Orowan Strengthening", formula: "Δτ = Gb / L", desc: "Strength increase from dislocations bowing between precipitates spaced a distance L apart." },
      ]
    },
    {
      category: "23. Casting, Solidification & Welding Metallurgy",
      items: [
        { name: "Chvorinov's Rule", formula: "t_s = B · (V / A)ⁿ  (n ≈ 2)", desc: "Solidification time scales with the square of the volume-to-surface-area ratio of the casting." },
        { name: "Secondary Dendrite Arm Spacing", formula: "λ₂ = a · (CR)^(-n)", desc: "Finer dendritic microstructure forms at higher cooling rates (CR); a and n are alloy-specific constants." },
        { name: "Constitutional Supercooling Criterion", formula: "G / R < ΔT₀ / D", desc: "Simplified onset condition for unstable (dendritic/cellular) rather than planar solidification fronts." },
        { name: "Welding Heat Input", formula: "HI = (V · I) / S", desc: "Energy delivered per unit length of weld from arc voltage V, current I, and travel speed S." },
        { name: "Scheil Equation (Non-Equilibrium Solidification)", formula: "C_s = k·C₀·(1 - f_s)^(k-1)", desc: "Predicts solute concentration in the solid as solidification progresses, assuming no diffusion back into the solid." },
      ]
    },
    {
      category: "24. Nanomaterials, Corrosion & Characterization",
      items: [
        { name: "Surface-to-Volume Ratio", formula: "SA : V = 3 / r (for spheres)", desc: "Fractional scaling shift as structures shrink down to nanoscale." },
        { name: "Scherrer Equation (XRD Grain Size)", formula: "D = (K · λ) / (β · cos(θ))", desc: "Crystallite domain size estimation from X-ray peak broadening." },
        { name: "Faraday's Law of Corrosion Mass Loss", formula: "m = (I · t · M) / (z · F)", desc: "Corrosion mass loss rate driven by oxidation current over time." },
        { name: "Pitting Resistance Equivalent Number (PREN)", formula: "PREN = %Cr + 3.3(%Mo) + 16(%N)", desc: "Alloy ranking index for localized pitting corrosion resistance." },
        { name: "Energy Dispersive X-ray Spectroscopy (EDS)", formula: "E = h·ν = E_core - E_shell", desc: "Characteristic X-ray emission fingerprinting elemental structures." },
        { name: "BET Surface Area Equation", formula: "1/[V(P₀/P - 1)] = 1/(V_mC) + [(C-1)/(V_mC)]·(P/P₀)", desc: "Determines specific surface area of a powder or porous solid from gas-adsorption isotherm data." },
        { name: "Zeta Potential (Smoluchowski Equation)", formula: "μ_e = ε · ζ / η", desc: "Relates a nanoparticle's electrophoretic mobility to its surface zeta potential and the medium's viscosity." },
        { name: "Corrosion Rate (Weight-Loss Method)", formula: "CR (mpy) = (534 · W) / (D · A · T)", desc: "ASTM G1 standard formula: W = weight loss (mg), D = density (g/cm³), A = area (in²), T = exposure time (h)." },
        { name: "Stokes-Einstein Equation", formula: "D = k_B T / (6πηr)", desc: "Relates a nanoparticle's diffusion coefficient to its hydrodynamic radius; underlies dynamic light scattering (DLS) particle sizing." },
        { name: "Young's Equation (Contact Angle / Wetting)", formula: "γ_SV = γ_SL + γ_LV · cos(θ)", desc: "Balances interfacial tensions at a solid-liquid-vapor contact line to predict wetting angle θ." },
        { name: "Kelvin Equation (Curvature Effect)", formula: "ln(P/P₀) = 2γV_m / (rRT)", desc: "Vapor pressure or solubility increases for small particles of radius r due to surface curvature." },
        { name: "Gibbs-Thomson Effect (Melting Point Depression)", formula: "T_m(r) = T_m(∞) · [1 - 2γ_sl / (ΔH_f · ρ_s · r)]", desc: "Nanoscale particles melt at a lower temperature than the bulk material as radius r decreases." },
        { name: "Brus Equation (Quantum Dot Bandgap)", formula: "E_g(QD) ≈ E_g(bulk) + h² / (8R²)·[1/m_e* + 1/m_h*]", desc: "Predicts how a semiconductor nanocrystal's bandgap increases as its radius R shrinks (quantum confinement)." },
      ]
    },
    {
      category: "25. Analytical Chemistry, Spectroscopy & QC Metrics",
      items: [
        { name: "Beer-Lambert Law", formula: "A = ε · c · l", desc: "Absorbance is proportional to molar absorptivity, concentration, and path length — the basis of AAS, UV-Vis, and colorimetric QC assays." },
        { name: "Absorbance-Transmittance Relation", formula: "A = -log₁₀(T), T = I / I₀", desc: "Converts measured light transmittance to absorbance for spectrophotometric analysis." },
        { name: "Wavenumber-Wavelength-Frequency Relation", formula: "ṽ (cm⁻¹) = 1/λ(cm) = ν / c", desc: "Standard unit conversion used throughout infrared (FTIR) spectroscopy." },
        { name: "Resolving Power (Spectroscopy)", formula: "R = λ / Δλ", desc: "Ability of a spectrometer or diffraction grating to distinguish two closely spaced wavelengths." },
        { name: "Limit of Detection (LOD)", formula: "LOD = 3σ_blank / slope", desc: "Smallest analyte concentration reliably distinguishable from a blank, based on calibration curve slope and blank noise." },
        { name: "Limit of Quantification (LOQ)", formula: "LOQ = 10σ_blank / slope", desc: "Smallest analyte concentration that can be quantified with acceptable precision and accuracy." },
        { name: "Relative Standard Deviation (Precision)", formula: "RSD % = (SD / mean) × 100", desc: "Standard QC/method-validation metric expressing measurement precision as a percentage." },
        { name: "Percent Recovery (Method Validation)", formula: "%Recovery = (measured value / expected value) × 100", desc: "Assesses analytical accuracy by comparing a spiked or certified sample's measured result to its known value." },
        { name: "NMR Chemical Shift", formula: "δ (ppm) = [(ν_sample - ν_reference) / ν_reference] × 10⁶", desc: "Standardized, field-independent way of reporting nuclear resonance frequencies relative to a reference compound." },
        { name: "Chromatographic Resolution", formula: "R_s = 2(t_R2 - t_R1) / (w₁ + w₂)", desc: "Quantifies how well two adjacent peaks are separated in a chromatogram." },
        { name: "Retention Factor", formula: "k = (t_R - t_M) / t_M", desc: "Measures how strongly a compound is retained by the stationary phase relative to the mobile phase transit time." },
      ]
    },
    {
      category: "26. Statistical Process Control & Metrology",
      items: [
        { name: "Process Capability Index (Cp)", formula: "Cp = (USL - LSL) / (6σ)", desc: "Compares the width of a process's natural spread to the width of its specification tolerance." },
        { name: "Process Capability Index (Cpk)", formula: "Cpk = min[(USL - μ)/(3σ), (μ - LSL)/(3σ)]", desc: "Like Cp, but also accounts for how centered the process mean μ is within the tolerance band." },
        { name: "Control Chart Limits (X-bar / R Chart)", formula: "UCL, LCL = X̿ ± A₂ · R̄", desc: "Upper/lower control limits for subgroup means, built from the grand average and mean range using constant A₂." },
        { name: "Standard Error of the Mean", formula: "SEM = σ / √n", desc: "Expected spread of sample means around the true population mean for a sample size n." },
        { name: "Combined Measurement Uncertainty", formula: "u_c = √(Σ uᵢ²)", desc: "Root-sum-of-squares combination of independent uncertainty sources, per GUM metrology guidelines." },
        { name: "Z-Score (Standard Score)", formula: "Z = (x - μ) / σ", desc: "Number of standard deviations a measurement lies from the process or population mean." },
        { name: "Defects Per Million Opportunities (DPMO)", formula: "DPMO = (defects / (units × opportunities)) × 10⁶", desc: "Normalizes defect counts for Six Sigma-style quality benchmarking across different processes." },
        { name: "Confidence Interval (Sample Mean)", formula: "CI = x̄ ± t·(s / √n)", desc: "Range likely to contain the true population mean, using the t-distribution for a sample of size n." },
        { name: "t-Statistic", formula: "t = (x̄ - μ) / (s / √n)", desc: "Standardized difference between a sample mean and a hypothesized population mean, used in hypothesis testing." },
      ]
    }
  ];

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  // Renders a formula string as HTML, turning UNAMBIGUOUS single-level
  // fractions (either "(...)/(...)"" or a single clean token on each side,
  // e.g. "h/p" or "π²k_B⁴/(60ℏ³c²)") into a real stacked <num>/<den> span.
  // Anything that isn't cleanly resolvable (e.g. "I · B / (n · e · t)", where
  // the numerator is actually "I · B" but a naive scan would only grab "B")
  // is deliberately left as plain escaped text rather than risk rendering a
  // mathematically wrong fraction.
  function prettifyFormula(str) {
    const BOUNDARY = new Set([" ", "+", "-", "=", "·", "×", ",", "(", ")", "[", "]", "≥", "≤", "≈", "√", "/", "\n", "\t"]);
    const isBoundary = ch => ch === undefined || BOUNDARY.has(ch);

    function parenBack(s, end) {
      if (s[end - 1] !== ")") return null;
      let depth = 0, i = end - 1;
      for (; i >= 0; i--) { if (s[i] === ")") depth++; else if (s[i] === "(") { depth--; if (!depth) break; } }
      return i < 0 ? null : { start: i, end, inner: s.slice(i + 1, end - 1) };
    }
    function parenFwd(s, start) {
      if (s[start] !== "(") return null;
      let depth = 0, i = start;
      for (; i < s.length; i++) { if (s[i] === "(") depth++; else if (s[i] === ")") { depth--; if (!depth) break; } }
      return i >= s.length ? null : { start, end: i + 1, inner: s.slice(start + 1, i) };
    }
    function tokenBack(s, end) {
      let i = end;
      while (i > 0 && !isBoundary(s[i - 1])) i--;
      return i === end ? null : { start: i, end, inner: s.slice(i, end) };
    }
    function tokenFwd(s, start) {
      let i = start;
      while (i < s.length && !isBoundary(s[i])) i++;
      return i === start ? null : { start, end: i, inner: s.slice(start, i) };
    }
    // If the resolved numerator is immediately preceded by a multiplication
    // sign, it's actually only PART of a larger numerator (e.g. "I · B / x"
    // — grabbing just "B" would be wrong) — bail out on this fraction.
    // Also bail if it's preceded by a plain multi-letter WORD with just a
    // space between (e.g. "measured value / expected value", "mol solute /
    // L solution") — these are natural-language phrases, not single terms,
    // and grabbing only "value" or "solute" would misrepresent them.
    function precededByMultiplyOrWord(s, idx) {
      let k = idx;
      while (k > 0 && s[k - 1] === " ") k--;
      if (k > 0 && (s[k - 1] === "·" || s[k - 1] === "×")) return true;
      if (k === idx) return false; // no space skipped — nothing further to check
      let w = k;
      while (w > 0 && /[A-Za-z]/.test(s[w - 1])) w--;
      return (k - w) >= 3; // a run of 3+ plain letters reads as an English word
    }

    // Letters, Greek, or the prefix operators Σ/Π/∫/√ — used to detect a
    // function/operator name sitting directly against a paren group, e.g.
    // "ln(", "d(", "∂(", "Σ(" — which paren-matching alone would otherwise
    // orphan (grabbing only the "(...)" and stranding "ln"/"d"/"Σ" outside
    // the fraction it's actually part of). Superscript modifier letters
    // (as in "fⁿ(a)") count too, so an exponent-labeled function name gets
    // absorbed the same way.
    const SUPERSCRIPT_LETTERS = new Set(["ᵃ","ᵇ","ᶜ","ᵈ","ᵉ","ᶠ","ᵍ","ʰ","ⁱ","ʲ","ᵏ","ˡ","ᵐ","ⁿ","ᵒ","ᵖ","ʳ","ˢ","ᵗ","ᵘ","ᵛ","ʷ","ˣ","ʸ","ᶻ"]);
    const isPrefixChar = ch => ch !== undefined && (/[A-Za-zΔ∂α-ωΑ-Ω_]/.test(ch) || ch === "Σ" || ch === "Π" || ch === "∫" || ch === "√" || SUPERSCRIPT_LETTERS.has(ch));
    // A resolved operand that's just ONE stray superscript letter (e.g. the
    // "ᵈ" in "[C]ᶜ[D]ᵈ / (...)", where the token scan stops right after
    // "]") isn't a real standalone term — it's a fragment of "[D]ᵈ" that
    // bracket-boundary scanning can't reattach. Safer to skip than show it.
    const isStraySuperscriptLetter = inner => inner.length === 1 && SUPERSCRIPT_LETTERS.has(inner);

    // A trailing exponent directly after a closing paren — e.g. the "²" in
    // "(KL)²" — belongs to that paren group. Without absorbing it, a
    // denominator like "(KL)²" would resolve to just "KL" with the "²"
    // left dangling outside the fraction, visually reading as if the whole
    // fraction were squared rather than just the denominator.
    const SUPERSCRIPT_RUN_AT_START = /^[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱ⁺⁻]+/;
    const SUPERSCRIPT_RUN_AT_END = /[⁰¹²³⁴⁵⁶⁷⁸⁹ⁿⁱ⁺⁻]+$/;

    function resolveNumerator(s, numEnd) {
      const supMatch = s.slice(0, numEnd).match(SUPERSCRIPT_RUN_AT_END);
      const suffix = supMatch ? supMatch[0] : "";
      const coreEnd = numEnd - suffix.length;

      if (s[coreEnd - 1] !== ")") {
        const t = tokenBack(s, coreEnd);
        if (!t) return null;
        return suffix ? { start: t.start, end: numEnd, inner: t.inner + suffix } : t;
      }
      const base = parenBack(s, coreEnd);
      if (!base) return null;
      let k = base.start;
      while (k > 0 && isPrefixChar(s[k - 1])) k--;
      const prefix = k < base.start ? s.slice(k, base.start) : "";
      if (!prefix && !suffix) return base; // common case: strip redundant parens as before
      return { start: k, end: numEnd, inner: `${prefix}(${base.inner})${suffix}` };
    }
    function resolveDenominator(s, denStart) {
      function withTrailingSuperscript(base) {
        const supMatch = s.slice(base.end).match(SUPERSCRIPT_RUN_AT_START);
        if (!supMatch) return { base, suffix: "" };
        return { base: { start: base.start, end: base.end + supMatch[0].length, inner: base.inner }, suffix: supMatch[0] };
      }
      if (s[denStart] === "(") {
        const g = parenFwd(s, denStart);
        if (!g) return null;
        const { base, suffix } = withTrailingSuperscript(g);
        return suffix ? { start: base.start, end: base.end, inner: `(${g.inner})${suffix}` } : g;
      }
      let k = denStart;
      while (k < s.length && isPrefixChar(s[k])) k++;
      if (k > denStart && s[k] === "(") {
        const group = parenFwd(s, k);
        if (group) {
          const { base, suffix } = withTrailingSuperscript(group);
          const prefix = s.slice(denStart, k);
          return { start: denStart, end: base.end, inner: `${prefix}(${group.inner})${suffix}` };
        }
      }
      return tokenFwd(s, denStart);
    }

    const segments = [];
    let cursor = 0, i = 0;
    while (i < str.length) {
      if (str[i] === "/") {
        let numEnd = i;
        while (numEnd > 0 && str[numEnd - 1] === " ") numEnd--;
        let denStart = i + 1;
        while (denStart < str.length && str[denStart] === " ") denStart++;

        const num = resolveNumerator(str, numEnd);
        const den = resolveDenominator(str, denStart);

        // Compact subscript notation like "t₁/₂" (meaning the single symbol
        // t_{1/2}, i.e. half-life) isn't a real division — a denominator
        // that's purely subscript digit characters is the tell.
        const isBareSubscript = den && /^[₀₁₂₃₄₅₆₇₈₉]+$/.test(den.inner);

        if (num && den && !isBareSubscript && !isStraySuperscriptLetter(num.inner) && !isStraySuperscriptLetter(den.inner) && num.start >= cursor && !precededByMultiplyOrWord(str, num.start)) {
          if (num.start > cursor) segments.push({ type: "text", text: str.slice(cursor, num.start) });
          segments.push({ type: "frac", num: num.inner, den: den.inner });
          cursor = den.end;
          i = den.end;
          continue;
        }
      }
      i++;
    }
    if (cursor < str.length) segments.push({ type: "text", text: str.slice(cursor) });

    return segments.map(seg => seg.type === "text"
      ? escapeHtml(seg.text)
      : `<span class="frac"><span class="frac-num">${escapeHtml(seg.num)}</span><span class="frac-den">${escapeHtml(seg.den)}</span></span>`
    ).join("");
  }

  function renderCheatSheet() {
    let html = `
      <div class="cs-toolbar">
        <button type="button" data-cs-action="expand-all">Expand all</button>
        <button type="button" data-cs-action="collapse-all">Collapse all</button>
      </div>
    `;
    EXHAUSTIVE_CHEAT_SHEET.forEach(section => {
      html += `
        <div class="cs-category-block">
          <button type="button" class="cs-category-header" aria-expanded="false">
            <span class="cs-category-title-text">${escapeHtml(section.category)}<span class="cs-category-count">${section.items.length}</span></span>
            <span class="cs-category-chevron">▸</span>
          </button>
          <div class="cs-category-items">
      `;
      section.items.forEach(item => {
        html += `
            <div class="cs-item">
              <div class="cs-item-name">${escapeHtml(item.name)}</div>
              <div class="cs-item-formula mono">${prettifyFormula(item.formula)}</div>
              <div class="cs-item-desc">${escapeHtml(item.desc)}</div>
            </div>
        `;
      });
      html += `</div></div>`;
    });
    els.contentHost.innerHTML = html;
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

  // Event delegation: category headers and the expand/collapse-all toolbar
  // are rebuilt on every open, so this listener is attached once to the
  // stable contentHost rather than re-attached per render.
  els.contentHost.addEventListener("click", (e) => {
    const header = e.target.closest(".cs-category-header");
    if (header) {
      const block = header.closest(".cs-category-block");
      const isOpen = block.classList.toggle("open");
      header.setAttribute("aria-expanded", isOpen ? "true" : "false");
      return;
    }
    const actionBtn = e.target.closest("[data-cs-action]");
    if (actionBtn) {
      const shouldOpen = actionBtn.dataset.csAction === "expand-all";
      els.contentHost.querySelectorAll(".cs-category-block").forEach(block => {
        block.classList.toggle("open", shouldOpen);
        const h = block.querySelector(".cs-category-header");
        if (h) h.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
      });
    }
  });

  els.toggle.addEventListener("click", openCheatSheet);
  els.close.addEventListener("click", closeCheatSheet);
  els.overlay.addEventListener("click", e => { if (e.target === els.overlay) closeCheatSheet(); });
})();
