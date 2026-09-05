/* =========================================================================
   STRUCTURES-DATA — backs the "Structures" swipeable card.
   Two halves:
   1) CRYSTAL_ARCHETYPES + ALLOY_STRUCTURE_INFO — every alloy is tagged with
      its real crystal system; the 4-5 swipeable views (Crystal Structure,
      Unit Cell, Atomic Arrangement, Crystal Lattice, Phase Structure) are
      generated FROM that tag rather than hand-built per alloy, since the
      structural facts (coordination number, packing, unit cell shape)
      genuinely are shared by every alloy in the same crystal class.
   2) MOLECULE_STRUCTURES — hand-authored per molecule, since Lewis
      structures, resonance forms, and geometry are specific to each one
      and can't be derived generically.
========================================================================= */

const CRYSTAL_ARCHETYPES = {
  BCC: {
    label: "Body-Centered Cubic",
    coordinationNumber: 8,
    axisAngles: "90°, 90°, 90°",
    packing: "68% packing efficiency",
    cellDesc: "A cube with one atom at each of the 8 corners and a single atom at the body center.",
    latticeDesc: "Corner and center atoms repeat through all three axes, each corner atom shared by 8 neighboring cells.",
    arrangeDesc: "Each atom touches 8 nearest neighbors along the cube's body diagonals.",
  },
  FCC: {
    label: "Face-Centered Cubic",
    coordinationNumber: 12,
    axisAngles: "90°, 90°, 90°",
    packing: "74% packing efficiency — the densest possible sphere packing",
    cellDesc: "A cube with one atom at each of the 8 corners and one centered on each of the 6 faces.",
    latticeDesc: "Face atoms are shared between two adjacent cells, corner atoms between eight — the tightest way to stack identical spheres.",
    arrangeDesc: "Each atom touches 12 nearest neighbors, arranged in a cuboctahedral shell around it.",
  },
  HCP: {
    label: "Hexagonal Close-Packed",
    coordinationNumber: 12,
    axisAngles: "90°, 90°, 120°",
    packing: "74% packing efficiency — same density as FCC, different stacking sequence",
    cellDesc: "A hexagonal prism: atoms at the 12 outer corners, one centered on the top and bottom faces, and 3 more nestled in the mid-layer.",
    latticeDesc: "Layers stack in an ABAB pattern, each layer's atoms sitting in the hollows of the one below.",
    arrangeDesc: "Each atom touches 12 nearest neighbors — 6 in its own layer, 3 above, 3 below.",
  },
  TETRAGONAL: {
    label: "Body-Centered Tetragonal",
    coordinationNumber: 8,
    axisAngles: "90°, 90°, 90° (a = b ≠ c)",
    packing: "Lower symmetry than cubic — one axis stretched or compressed relative to the other two",
    cellDesc: "A cube stretched along one axis into a rectangular prism, with one atom at each corner and one at the body center.",
    latticeDesc: "The elongated cell repeats through space the same way a BCC lattice does, just with one axis unequal to the other two.",
    arrangeDesc: "Nearest-neighbor count and spacing shift slightly along the elongated axis compared to a true cubic cell.",
  },
};

// Two-phase / non-standard cases that don't fit a single archetype cleanly.
const CRYSTAL_SPECIAL = {
  DUPLEX: {
    label: "Duplex (two-phase)",
    coordinationNumber: "8 (ferrite) / 12 (austenite)",
    axisAngles: "90°, 90°, 90° in both phases",
    packing: "Roughly equal volume fractions of BCC and FCC grains",
    cellDesc: "Two distinct grain populations side by side — body-centered cubic ferrite and face-centered cubic austenite.",
    latticeDesc: "Ferrite and austenite grains form an interlocking two-phase microstructure rather than one uniform lattice.",
    arrangeDesc: "Each phase keeps its own native coordination — 8 for the BCC ferrite grains, 12 for the FCC austenite grains.",
  },
  SHAPE_MEMORY: {
    label: "Shape-memory dual-phase",
    coordinationNumber: "8 (austenite, B2) / variable (martensite)",
    axisAngles: "90°, 90°, 90° (austenite) → distorted, non-orthogonal (martensite)",
    packing: "Reversible — the lattice itself changes shape with temperature/stress",
    cellDesc: "A cubic B2-ordered austenite structure above the transformation temperature, collapsing into a low-symmetry monoclinic martensite structure below it.",
    latticeDesc: "The two lattices interconvert without atoms breaking bonds — a diffusionless shear transformation — which is what gives the alloy its shape memory.",
    arrangeDesc: "Coordination stays 8-fold in the cubic austenite phase; the martensite phase distorts those same neighbor relationships rather than replacing them.",
  },
  MULTIPHASE: {
    label: "Eutectic multi-phase",
    coordinationNumber: "varies by grain",
    axisAngles: "varies by grain",
    packing: "No single dominant lattice — a fine-grained mixture of each component's own crystal structure",
    cellDesc: "Scattered grains of each constituent metal's native structure, intermixed at a fine scale rather than forming one shared lattice.",
    latticeDesc: "Solidifies as a eutectic: separate, interlocking crystal grains of each metal rather than one uniform solid solution.",
    arrangeDesc: "Coordination is local to each grain, since atoms only pack according to their own metal's native structure.",
  },
  LIQUID: {
    label: "Liquid (no fixed lattice)",
    coordinationNumber: "~10-11 (short-range order only)",
    axisAngles: "n/a — no long-range order",
    packing: "No periodic lattice at room temperature",
    cellDesc: "Below its melting point the alloy does form a crystal lattice, but at room temperature it stays liquid — atoms are close-packed locally but not arranged in a repeating structure.",
    latticeDesc: "Only short-range order exists, the way it does in any liquid metal — no repeating unit cell to speak of until it's cooled below its (very low) melting point.",
    arrangeDesc: "Neighbors are still tightly packed, just constantly rearranging rather than fixed in place.",
  },
  ROCKSALT: {
    label: "Rock Salt (NaCl-type)",
    coordinationNumber: 6,
    axisAngles: "90°, 90°, 90°",
    packing: "Two interpenetrating FCC lattices — one of cations, one of anions",
    cellDesc: "A cube where cations and anions alternate: each ion sits at the center of an octahedron formed by six ions of the opposite charge.",
    latticeDesc: "The pattern repeats indefinitely in 3D — this is what 'a crystal of salt' actually looks like at the atomic scale, not a single bonded pair.",
    arrangeDesc: "Each ion touches 6 nearest neighbors, all of the opposite charge, in a perfect octahedral arrangement.",
  },
};


// Every alloy tagged with its real crystal system. `note` adds
// alloy-specific context on top of the shared archetype facts above.
const ALLOY_STRUCTURE_INFO = {
  STEEL:            { system: "BCC", note: "Room-temperature ferrite (α-iron) is BCC; heating above ~910°C converts it to FCC austenite." },
  STAINLESS_STEEL:  { system: "FCC", note: "The nickel content stabilizes the austenitic FCC phase down to room temperature, unlike plain steel." },
  BRONZE:           { system: "FCC", note: "Tin dissolves into copper's FCC lattice as a substitutional solid solution." },
  BRASS:            { system: "FCC", note: "Zinc substitutes into copper's FCC lattice up to about 35%, past which a harder secondary phase appears." },
  DURALUMIN:        { system: "FCC", note: "Copper and magnesium form fine precipitates within aluminium's FCC lattice, which is the real source of its strength." },
  TI6AL4V:          { system: "HCP", note: "Aluminium stabilizes the HCP alpha phase while vanadium stabilizes small regions of BCC beta phase — an alpha-beta titanium alloy." },
  STERLING_SILVER:  { system: "FCC", note: "Copper strengthens silver's soft FCC lattice without changing its structure." },
  WHITE_GOLD:       { system: "FCC", note: "Palladium and silver dissolve fully into gold's FCC lattice, bleaching out its yellow color." },
  ROSE_GOLD:        { system: "FCC", note: "A higher copper content than yellow gold, still within a single FCC solid solution." },
  MONEL:            { system: "FCC", note: "Nickel and copper are fully miscible in all proportions, both being FCC metals." },
  INCONEL:          { system: "FCC", note: "A nickel-based superalloy — FCC gamma matrix strengthened by fine intermetallic precipitates." },
  HASTELLOY:        { system: "FCC", note: "Molybdenum and chromium dissolve into nickel's FCC lattice, the source of its chemical resistance." },
  SOLDER:           { system: "TETRAGONAL", note: "Tin's body-centered tetragonal lattice dominates; lead forms separate FCC-rich regions within it." },
  SAC305:           { system: "TETRAGONAL", note: "Tin-based tetragonal matrix with fine Ag3Sn and Cu6Sn5 intermetallic particles for strength." },
  PEWTER:           { system: "TETRAGONAL", note: "Tin's tetragonal lattice with copper and antimony added for hardness." },
  WOODS_METAL:      { system: "MULTIPHASE", note: "A four-metal eutectic — melts around 70°C, well below any of its individual components." },
  NITINOL:          { system: "SHAPE_MEMORY", note: "The classic shape-memory alloy — swipe to Phase Structure to see both forms." },
  INVAR:            { system: "FCC", note: "The FCC lattice's magnetic behavior happens to cancel normal thermal expansion almost entirely." },
  KOVAR:            { system: "FCC", note: "Composition tuned so its thermal expansion matches borosilicate glass and alumina ceramics." },
  CUPRONICKEL:      { system: "FCC", note: "Copper and nickel are completely soluble in each other at all ratios — one continuous FCC lattice." },
  PHOSPHOR_BRONZE:  { system: "FCC", note: "A trace of phosphorus deoxidizes the melt and slightly stiffens copper's FCC lattice." },
  ALUMINIUM_BRONZE: { system: "FCC", note: "Aluminium dissolves into copper's FCC lattice, forming a tough, corrosion-resistant oxide layer at the surface." },
  BABBITT:          { system: "TETRAGONAL", note: "Soft tin matrix with harder intermetallic particles suspended in it — the particles bear load, the matrix absorbs shock." },
  GALINSTAN:        { system: "LIQUID", note: "Melts at about -19°C, making it liquid at room temperature — used as a non-toxic mercury replacement." },
  ALNICO:           { system: "BCC", note: "Iron-rich BCC matrix with needle-like nickel-aluminium precipitates that give it strong permanent magnetism." },
  NEODYMIUM_MAGNET: { system: "TETRAGONAL", note: "The Nd₂Fe₁₄B intermetallic compound's tetragonal structure gives the strongest permanent magnets commercially made." },
  ZIRCALOY:         { system: "HCP", note: "Zirconium's HCP lattice has very low neutron absorption, which is why it's used to clad nuclear fuel rods." },
  VITALLIUM:        { system: "FCC", note: "Nickel and carbon stabilize the FCC form of this cobalt-chromium alloy for cast medical implants." },
  NIMONIC:          { system: "FCC", note: "An early nickel-chromium superalloy — FCC matrix strengthened by fine precipitates." },
  MAGNOX:           { system: "HCP", note: "Magnesium's HCP lattice with a little aluminium added for strength; low neutron absorption suits it for reactor cladding." },
  M2_STEEL:         { system: "TETRAGONAL", note: "Hardened tool steel — quenching traps carbon in a distorted, body-centered tetragonal martensite lattice." },
  D2_STEEL:         { system: "TETRAGONAL", note: "High chromium content forms hard carbides within a tetragonal martensite matrix for wear resistance." },
  WASPALOY:         { system: "FCC", note: "A nickel superalloy, FCC gamma matrix strengthened by gamma-prime precipitates for jet engine use." },
  GUNMETAL:         { system: "FCC", note: "A bronze variant with zinc added; all three metals dissolve into one FCC lattice." },
  CONSTANTAN:       { system: "FCC", note: "Copper-nickel in a ratio chosen so its electrical resistance barely changes with temperature." },
  ELGILOY:          { system: "FCC", note: "A cobalt-based alloy, FCC matrix chosen for fatigue resistance in springs and medical devices." },
  WC_CO:            { system: "HCP", note: "Tungsten carbide grains (simple hexagonal, distinct from a close-packed metal lattice) held together by a softer cobalt binder." },
  HAYNES_230:       { system: "FCC", note: "A nickel-chromium-tungsten superalloy, FCC matrix built for prolonged high-temperature strength." },
  AERMET_100:       { system: "TETRAGONAL", note: "An ultra-high-strength steel — carbon trapped in tetragonal martensite by rapid quenching." },
  GLIDCOP:          { system: "FCC", note: "Copper's FCC lattice with fine aluminium-oxide particles dispersed through it, adding strength without losing conductivity." },
  MAGNALIUM:         { system: "FCC", note: "Magnesium dissolves into aluminium's FCC lattice, trading some strength for lower density." },
  GREEN_GOLD:       { system: "FCC", note: "Gold and silver are fully miscible — one continuous FCC lattice gives the alloy its greenish-yellow tone." },
  TUMBAGA:          { system: "FCC", note: "A pre-Columbian gold-copper alloy — a single FCC solid solution, easier to cast than pure gold." },
  AMALGAM:          { system: "MULTIPHASE", note: "Mercury reacting with silver and tin forms several distinct intermetallic phases (γ, γ1, γ2) rather than one lattice." },
  TERNE:            { system: "TETRAGONAL", note: "A lead-tin coating alloy — tin's tetragonal lattice with lead-rich regions dispersed through it." },
  MP35N:            { system: "FCC", note: "A cobalt-nickel-chromium-molybdenum alloy kept single-phase FCC for exceptional fatigue strength in implants." },
  RENE41:           { system: "FCC", note: "A nickel superalloy for extreme-temperature aerospace parts — FCC matrix with gamma-prime strengthening." },
  SPANGOLD:         { system: "FCC", note: "A gold-copper-aluminium alloy; higher aluminium content can form separate hard intermetallic (AuAl₂-type) regions." },
  FERRIUM_M54:      { system: "TETRAGONAL", note: "A high-strength steel engineered around a fine tetragonal martensite matrix with cobalt and nickel additions." },
  ZERON_100:        { system: "DUPLEX", note: "A duplex stainless steel by design — roughly equal ferrite and austenite for a strength-and-corrosion-resistance balance neither phase gives alone." },

  PERMALLOY:        { system: "FCC", note: "The high nickel content stabilizes an FCC solid solution — the same soft, easily-magnetized lattice that gives permalloy its exceptional magnetic permeability." },
  SUPERMALLOY:      { system: "FCC", note: "Molybdenum dissolves into permalloy's FCC nickel-iron lattice, pushing its magnetic permeability even higher." },
  SAMARIUM_COBALT:  { system: "HCP", note: "Not a simple solid solution — SmCo5 and Sm2Co17 are ordered intermetallic compounds with their own hexagonal-family crystal structures, which is exactly what locks in their powerful, heat-resistant magnetism." },
  FERRONICKEL:      { system: "BCC", note: "At 20% nickel this sits near the Fe-Ni phase boundary — closer to BCC ferrite than the FCC austenite higher-nickel alloys like Invar adopt. Mostly smelted as a bulk feedstock for stainless steelmaking, not valued for its own structure." },
  COPPER_TUNGSTEN:  { system: "MULTIPHASE", note: "Copper and tungsten don't dissolve into each other at all — this is a sintered composite, porous tungsten infiltrated with molten copper, not a true solid solution." },
  SILVER_TUNGSTEN:  { system: "MULTIPHASE", note: "Like copper-tungsten, silver and tungsten are mutually insoluble — a sintered tungsten skeleton infiltrated with silver, two distinct phases side by side." },
  PLATINUM_RHODIUM: { system: "FCC", note: "Platinum and rhodium are both FCC metals and fully miscible, forming one continuous solid solution across the whole composition range used in thermocouple wire." },
  WOOTZ_STEEL:      { system: "BCC", note: "A very high carbon content by steel standards — the carbon that doesn't dissolve into the BCC iron lattice forms cementite, and it's the pattern these carbide particles form on cooling that gives Damascus blades their legendary watery surface pattern." },
  GALFAN:           { system: "MULTIPHASE", note: "Formulated deliberately at the zinc-aluminium eutectic point, so it solidifies as a fine, interlocking two-phase mixture rather than a single lattice — that fine eutectic structure is what gives it such good corrosion resistance." },
  WHITE_BRONZE:     { system: "MULTIPHASE", note: "30% tin is far beyond what copper's FCC lattice can hold in solid solution (the limit is under 16%), so the excess forms hard copper-tin intermetallic phases throughout the alloy." },
  RED_BRASS:        { system: "FCC", note: "Zinc and tin together stay within copper's FCC solid-solution limit here, keeping this a single-phase alpha brass." },
  MANGANESE_BRONZE: { system: "DUPLEX", note: "39% zinc pushes this brass past the alpha-phase solubility limit, so it forms both FCC alpha and a harder BCC-ordered beta phase — a genuinely duplex brass, not just a name." },
  ALUMINUM_BRASS:   { system: "FCC", note: "Zinc and a touch of aluminium both stay within copper's FCC solid-solution range, keeping this a single alpha-brass phase — the aluminium's real job is forming a thin protective oxide film, not changing the lattice." },
  TOMBAC:           { system: "FCC", note: "A high-copper, low-zinc brass that stays comfortably within the FCC alpha-brass solid-solution range, which is also what gives it a warm, gold-like color." },
  ARGENTIUM_SILVER: { system: "FCC", note: "Copper and germanium both dissolve into silver's FCC lattice — the germanium's role is forming a thin protective oxide layer that resists the tarnishing ordinary sterling silver is prone to." },
  PALLADIUM_SILVER: { system: "FCC", note: "Palladium and silver are completely miscible in each other at every ratio, both being FCC metals — one continuous solid solution across the whole composition range." },
  NIOBIUM_TITANIUM: { system: "BCC", note: "Niobium and titanium form a continuous BCC solid solution across a wide composition range — this specific ratio is the standard superconducting wire alloy wound into MRI and particle-accelerator magnets." },
  BABBITT_LEAD:     { system: "MULTIPHASE", note: "Hard antimony-tin intermetallic particles are suspended through a soft lead-rich matrix — the particles carry the load, the soft matrix absorbs shock and lets the bearing conform, the same design logic as tin-based babbitt but cheaper." },
};

/* =========================================================================
   MOLECULE_STRUCTURES — one entry per molecule, each an array of
   swipeable structure "views". atoms2d/bonds2d are hand-laid-out for
   clean 2D rendering (not projected from the 3D viewer's coordinates,
   which are optimized for orbit-viewing, not textbook clarity).
   bonds2d: [atomIndexA, atomIndexB, bondOrder(1/2/3), style('plain'|'wedge'|'dash')]
========================================================================= */
const MOLECULE_STRUCTURES = {

  H2O: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"O",x:0,y:0.5},{el:"H",x:-0.85,y:-0.35},{el:"H",x:0.85,y:-0.35}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (O–H)", molecularGeometry:"Bent (angular)", bondAngles:"104.5°", hybridization:"sp³ (oxygen)", polarity:"Polar",
        notes:"Two lone pairs on oxygen compress the H–O–H angle below the ideal 109.5° tetrahedral angle." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"O",x:0,y:0.5,lp:2},{el:"H",x:-0.85,y:-0.35},{el:"H",x:0.85,y:-0.35}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent (O–H)", molecularGeometry:"Bent (angular)", bondAngles:"104.5°", hybridization:"sp³ (oxygen)", polarity:"Polar",
        notes:"Two lone pairs (shown as dot pairs) do the real work of pushing the bonding pairs together into a bent shape." } },
    { type: "condensed", name: "Condensed Formula", formula:"H₂O",
      info: { structureType:"Condensed formula", bondType:"Polar covalent (O–H)", molecularGeometry:"Bent (angular)", bondAngles:"104.5°", hybridization:"sp³ (oxygen)", polarity:"Polar",
        notes:"Shorthand that lists atoms without drawing bonds explicitly — useful when the structure is already obvious." } },
  ],

  CO2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"O",x:-1.6,y:0},{el:"C",x:0,y:0},{el:"O",x:1.6,y:0}],
      bonds2d: [[0,1,2],[1,2,2]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (C=O), nonpolar overall", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp (carbon)", polarity:"Nonpolar (bond dipoles cancel)",
        notes:"Each C=O bond is individually polar, but the linear symmetric shape cancels the dipoles — the classic example of polar bonds in a nonpolar molecule." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"O",x:-1.6,y:0,lp:2},{el:"C",x:0,y:0},{el:"O",x:1.6,y:0,lp:2}],
      bonds2d: [[0,1,2],[1,2,2]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent (C=O)", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp (carbon)", polarity:"Nonpolar",
        notes:"Carbon forms two double bonds and carries no lone pairs — its two remaining sp orbitals form pi bonds with each oxygen." } },
    { type: "condensed", name: "Condensed Formula", formula:"CO₂",
      info: { structureType:"Condensed formula", bondType:"Polar covalent (C=O)", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp (carbon)", polarity:"Nonpolar",
        notes:"CO₂'s condensed and molecular formula are identical — there's no simpler way to shorthand three atoms." } },
  ],

  CH4: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"C",x:0,y:0},{el:"H",x:0,y:1.15},{el:"H",x:1.05,y:-0.4},{el:"H",x:-1.05,y:-0.4},{el:"H",x:0,y:-1.15}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1],[0,4,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Nonpolar covalent (C–H)", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"The most symmetric arrangement possible for four identical bonding pairs — the reference shape for sp³ hybridization." } },
    { type: "wedgedash", name: "Wedge-and-Dash Formula",
      atoms2d: [{el:"C",x:0,y:0.1},{el:"H",x:-0.85,y:0.9},{el:"H",x:0.85,y:0.9},{el:"H",x:-0.6,y:-0.95},{el:"H",x:0.6,y:-0.95}],
      bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"wedge"],[0,4,1,"dash"]],
      info: { structureType:"Wedge-and-dash formula", bondType:"Nonpolar covalent (C–H)", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"The two plain bonds lie in the plane of the screen; the wedge comes toward you, the dash goes back — together they convey the true 3D tetrahedron." } },
    { type: "condensed", name: "Condensed Formula", formula:"CH₄",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent (C–H)", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Simplest possible hydrocarbon — one carbon, fully saturated with hydrogen." } },
  ],

  NH3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"N",x:0,y:0.5},{el:"H",x:-0.95,y:-0.35},{el:"H",x:0.95,y:-0.35},{el:"H",x:0,y:-1.0}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (N–H)", molecularGeometry:"Trigonal pyramidal", bondAngles:"~107°", hybridization:"sp³", polarity:"Polar",
        notes:"One lone pair on nitrogen pushes the three N–H bonds together and gives the molecule its pyramidal shape and polarity." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"N",x:0,y:0.5,lp:1},{el:"H",x:-0.95,y:-0.35},{el:"H",x:0.95,y:-0.35},{el:"H",x:0,y:-1.0}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent (N–H)", molecularGeometry:"Trigonal pyramidal", bondAngles:"~107°", hybridization:"sp³", polarity:"Polar",
        notes:"The single lone pair (dots) occupies more space than a bonding pair, which is exactly why the H–N–H angle is squeezed below 109.5°." } },
    { type: "wedgedash", name: "Wedge-and-Dash Formula",
      atoms2d: [{el:"N",x:0,y:0.5},{el:"H",x:-0.9,y:-0.25},{el:"H",x:0.9,y:-0.25},{el:"H",x:0,y:-0.55}],
      bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"wedge"]],
      info: { structureType:"Wedge-and-dash formula", bondType:"Polar covalent (N–H)", molecularGeometry:"Trigonal pyramidal", bondAngles:"~107°", hybridization:"sp³", polarity:"Polar",
        notes:"The wedge bond shows the third hydrogen tipping toward the viewer, out of the plane of the other two — the pyramidal pucker made visible." } },
    { type: "condensed", name: "Condensed Formula", formula:"NH₃",
      info: { structureType:"Condensed formula", bondType:"Polar covalent (N–H)", molecularGeometry:"Trigonal pyramidal", bondAngles:"~107°", hybridization:"sp³", polarity:"Polar",
        notes:"One nitrogen, three hydrogens, one lone pair — the basis of the entire ammonia/amine family." } },
  ],

  O2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"O",x:-0.8,y:0},{el:"O",x:0.8,y:0}],
      bonds2d: [[0,1,2]],
      info: { structureType:"Simple covalent molecule", bondType:"Nonpolar covalent (O=O)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a — only two atoms", hybridization:"Better described by molecular orbital theory than simple hybridization", polarity:"Nonpolar",
        notes:"A double bond holds the two oxygens together; O₂'s two unpaired electrons (its paramagnetism) show up clearly in molecular orbital theory but not in a simple Lewis picture." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"O",x:-0.8,y:0,lp:2},{el:"O",x:0.8,y:0,lp:2}],
      bonds2d: [[0,1,2]],
      info: { structureType:"Lewis structure", bondType:"Nonpolar covalent (O=O)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"n/a (see MO theory)", polarity:"Nonpolar",
        notes:"This simple Lewis structure pairs all electrons, but real O₂ actually has two unpaired electrons — one of the well-known limits of Lewis theory." } },
    { type: "condensed", name: "Condensed Formula", formula:"O₂",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent (O=O)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"n/a", polarity:"Nonpolar",
        notes:"The form oxygen takes as a gas — about 21% of the air around you." } },
  ],

  N2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"N",x:-0.8,y:0},{el:"N",x:0.8,y:0}],
      bonds2d: [[0,1,3]],
      info: { structureType:"Simple covalent molecule", bondType:"Nonpolar covalent (N≡N)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp", polarity:"Nonpolar",
        notes:"One of the strongest bonds in chemistry — the triple bond is why N₂ is so unreactive at room temperature despite making up 78% of the atmosphere." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"N",x:-0.8,y:0,lp:1},{el:"N",x:0.8,y:0,lp:1}],
      bonds2d: [[0,1,3]],
      info: { structureType:"Lewis structure", bondType:"Nonpolar covalent (N≡N)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp", polarity:"Nonpolar",
        notes:"Each nitrogen keeps one lone pair; the other three electron pairs form the triple bond." } },
    { type: "condensed", name: "Condensed Formula", formula:"N₂",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent (N≡N)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp", polarity:"Nonpolar",
        notes:"Breaking this bond industrially (the Haber process) is one of the most consequential reactions humans ever scaled up." } },
  ],

  NACL: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Na",x:-0.8,y:0,charge:"+"},{el:"Cl",x:0.8,y:0,charge:"–"}],
      bonds2d: [[0,1,1,"ionic"]],
      info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a (ionic bonds aren't directional)", hybridization:"n/a", polarity:"n/a (ionic, not a covalent dipole)", coordinationNumber:"6",
        notes:"Drawn here as an ion pair for simplicity, but solid NaCl isn't really a single 'molecule' — swipe to Crystal Lattice to see what it actually looks like." } },
    { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
      info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
        notes:"Each Na⁺ is surrounded by 6 Cl⁻ and each Cl⁻ by 6 Na⁺, extending indefinitely — this repeating lattice, not a bonded pair, is what table salt actually is." } },
    { type: "condensed", name: "Condensed Formula", formula:"NaCl",
      info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Represents the simplest whole-number ratio of ions (1:1), called a formula unit rather than a molecule." } },
  ],

  CO: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"C",x:-0.7,y:0},{el:"O",x:0.7,y:0}],
      bonds2d: [[0,1,3]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (C≡O)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp", polarity:"Polar (small dipole)",
        notes:"Isoelectronic with N₂ and nearly as strongly bonded. Carbon's lone pair is what makes CO such a potent ligand toward metals — and dangerously good at binding hemoglobin." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"C",x:-0.7,y:0,lp:1},{el:"O",x:0.7,y:0,lp:1}],
      bonds2d: [[0,1,3]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent (C≡O)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp", polarity:"Polar",
        notes:"Both atoms keep one lone pair even in the triple-bonded structure — a somewhat unusual electron count worth noticing." } },
    { type: "condensed", name: "Condensed Formula", formula:"CO",
      info: { structureType:"Condensed formula", bondType:"Polar covalent (C≡O)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp", polarity:"Polar",
        notes:"A product of incomplete combustion — and a molecule your body has no way to detect by smell." } },
  ],

  HCL: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"H",x:-0.7,y:0},{el:"Cl",x:0.7,y:0}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (H–Cl)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³ (chlorine)", polarity:"Polar",
        notes:"Chlorine's higher electronegativity pulls the bonding electrons toward itself, which is why HCl ionizes completely into a strong acid in water." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"H",x:-0.7,y:0},{el:"Cl",x:0.7,y:0,lp:3}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent (H–Cl)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³ (chlorine)", polarity:"Polar",
        notes:"Chlorine holds three lone pairs, leaving one electron for the single bond to hydrogen." } },
    { type: "condensed", name: "Condensed Formula", formula:"HCl",
      info: { structureType:"Condensed formula", bondType:"Polar covalent (H–Cl)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Polar",
        notes:"Dissolved in water, this becomes hydrochloric acid — including the acid your own stomach produces." } },
  ],

  HF: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"H",x:-0.7,y:0},{el:"F",x:0.7,y:0}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (H–F)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³ (fluorine)", polarity:"Highly polar",
        notes:"The most polar hydrogen halide — fluorine's extreme electronegativity also lets HF form unusually strong hydrogen bonds, even chaining into zig-zag clusters in the gas phase." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"H",x:-0.7,y:0},{el:"F",x:0.7,y:0,lp:3}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent (H–F)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Highly polar",
        notes:"Three lone pairs on fluorine, one bonding pair shared with hydrogen." } },
    { type: "condensed", name: "Condensed Formula", formula:"HF",
      info: { structureType:"Condensed formula", bondType:"Polar covalent (H–F)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Highly polar",
        notes:"Unlike the other hydrohalic acids, HF is only a weak acid in water — its strong H–F bond resists ionizing." } },
  ],

  O3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"O",x:0,y:0.6},{el:"O",x:-1.2,y:-0.3},{el:"O",x:1.2,y:-0.3}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Intermediate (partial double, ~1.5 bond order)", molecularGeometry:"Bent", bondAngles:"~117°", hybridization:"sp² (central O)", polarity:"Polar",
        notes:"Both O–O bonds are actually identical in length — shorter than a single bond, longer than a true double — because the extra electron pair is delocalized across both." } },
    { type: "resonance", name: "Resonance Structure 1 of 2",
      atoms2d: [{el:"O",x:0,y:0.6,lp:1},{el:"O",x:-1.2,y:-0.3,lp:2},{el:"O",x:1.2,y:-0.3,lp:3}],
      bonds2d: [[0,1,2],[0,2,1]],
      info: { structureType:"Resonance contributor", bondType:"Left O=O double, right O–O single", molecularGeometry:"Bent", bondAngles:"~117°", hybridization:"sp²", polarity:"Polar",
        notes:"One of two equally-valid ways to place the double bond. Neither form is the real structure on its own — the true molecule is a blend of both." } },
    { type: "resonance", name: "Resonance Structure 2 of 2",
      atoms2d: [{el:"O",x:0,y:0.6,lp:1},{el:"O",x:-1.2,y:-0.3,lp:3},{el:"O",x:1.2,y:-0.3,lp:2}],
      bonds2d: [[0,1,1],[0,2,2]],
      info: { structureType:"Resonance contributor", bondType:"Left O–O single, right O=O double", molecularGeometry:"Bent", bondAngles:"~117°", hybridization:"sp²", polarity:"Polar",
        notes:"The mirror image of the first contributor — averaging the two is what gives both bonds their actual ~1.5 bond order." } },
    { type: "condensed", name: "Condensed Formula", formula:"O₃",
      info: { structureType:"Condensed formula", bondType:"~1.5 bond order (delocalized)", molecularGeometry:"Bent", bondAngles:"~117°", hybridization:"sp²", polarity:"Polar",
        notes:"The molecule that forms the stratospheric ozone layer — and, at ground level, a harmful pollutant." } },
  ],

  H2S: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"S",x:0,y:0.5},{el:"H",x:-0.9,y:-0.35},{el:"H",x:0.9,y:-0.35}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (S–H)", molecularGeometry:"Bent", bondAngles:"~92°", hybridization:"Approximately sp³ — sulfur's larger orbitals hybridize less cleanly than oxygen's", polarity:"Polar",
        notes:"Much closer to a right angle than water's 104.5°, since sulfur's larger, more diffuse orbitals resist hybridizing as effectively as oxygen's." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"S",x:0,y:0.5,lp:2},{el:"H",x:-0.9,y:-0.35},{el:"H",x:0.9,y:-0.35}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent (S–H)", molecularGeometry:"Bent", bondAngles:"~92°", hybridization:"sp³ (nominal)", polarity:"Polar",
        notes:"Structurally water's heavier cousin — same lone-pair count, notably different bond angle." } },
    { type: "condensed", name: "Condensed Formula", formula:"H₂S",
      info: { structureType:"Condensed formula", bondType:"Polar covalent (S–H)", molecularGeometry:"Bent", bondAngles:"~92°", hybridization:"sp³", polarity:"Polar",
        notes:"The rotten-egg smell most people can detect at concentrations below one part per billion." } },
  ],

  SO2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"S",x:0,y:0.6},{el:"O",x:-1.2,y:-0.3},{el:"O",x:1.2,y:-0.3}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Intermediate (~1.5 bond order, delocalized)", molecularGeometry:"Bent", bondAngles:"~119°", hybridization:"sp² (sulfur)", polarity:"Polar",
        notes:"Structurally similar to ozone — two resonance forms average out to two equivalent S–O bonds, each with partial double-bond character." } },
    { type: "resonance", name: "Resonance Structure 1 of 2",
      atoms2d: [{el:"S",x:0,y:0.6,lp:1},{el:"O",x:-1.2,y:-0.3,lp:2},{el:"O",x:1.2,y:-0.3,lp:3}],
      bonds2d: [[0,1,2],[0,2,1]],
      info: { structureType:"Resonance contributor", bondType:"Left S=O double, right S–O single", molecularGeometry:"Bent", bondAngles:"~119°", hybridization:"sp²", polarity:"Polar",
        notes:"One of two equally-valid double-bond placements — the real molecule is a blend of both." } },
    { type: "resonance", name: "Resonance Structure 2 of 2",
      atoms2d: [{el:"S",x:0,y:0.6,lp:1},{el:"O",x:-1.2,y:-0.3,lp:3},{el:"O",x:1.2,y:-0.3,lp:2}],
      bonds2d: [[0,1,1],[0,2,2]],
      info: { structureType:"Resonance contributor", bondType:"Left S–O single, right S=O double", molecularGeometry:"Bent", bondAngles:"~119°", hybridization:"sp²", polarity:"Polar",
        notes:"The mirror form — averaging both contributors is what gives the real bonds their equal, intermediate length." } },
    { type: "condensed", name: "Condensed Formula", formula:"SO₂",
      info: { structureType:"Condensed formula", bondType:"~1.5 bond order", molecularGeometry:"Bent", bondAngles:"~119°", hybridization:"sp²", polarity:"Polar",
        notes:"A major volcanic and industrial emission, and the precursor to acid rain." } },
  ],

  NO2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"N",x:0,y:0.6},{el:"O",x:-1.2,y:-0.3},{el:"O",x:1.2,y:-0.3}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Simple covalent molecule (radical)", bondType:"Intermediate (~1.5 bond order)", molecularGeometry:"Bent", bondAngles:"~134°", hybridization:"sp²", polarity:"Polar",
        notes:"An odd-electron radical — the unpaired electron on nitrogen is why NO₂ is so reactive and why it readily pairs up into N₂O₄." } },
    { type: "resonance", name: "Resonance Structure 1 of 2",
      atoms2d: [{el:"N",x:0,y:0.6},{el:"O",x:-1.2,y:-0.3,lp:2},{el:"O",x:1.2,y:-0.3,lp:3}],
      bonds2d: [[0,1,2],[0,2,1]],
      info: { structureType:"Resonance contributor", bondType:"Left N=O double, right N–O single", molecularGeometry:"Bent", bondAngles:"~134°", hybridization:"sp²", polarity:"Polar",
        notes:"Nitrogen's unpaired electron (not shown as a full lone pair) sits on the nitrogen in this contributor." } },
    { type: "resonance", name: "Resonance Structure 2 of 2",
      atoms2d: [{el:"N",x:0,y:0.6},{el:"O",x:-1.2,y:-0.3,lp:3},{el:"O",x:1.2,y:-0.3,lp:2}],
      bonds2d: [[0,1,1],[0,2,2]],
      info: { structureType:"Resonance contributor", bondType:"Left N–O single, right N=O double", molecularGeometry:"Bent", bondAngles:"~134°", hybridization:"sp²", polarity:"Polar",
        notes:"The mirror contributor — the wider bond angle than SO₂ or ozone comes from having only one full lone-pair-equivalent repelling the bonds." } },
    { type: "condensed", name: "Condensed Formula", formula:"NO₂",
      info: { structureType:"Condensed formula", bondType:"~1.5 bond order", molecularGeometry:"Bent", bondAngles:"~134°", hybridization:"sp²", polarity:"Polar",
        notes:"The reddish-brown gas responsible for urban smog's characteristic color." } },
  ],

  N2O: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"N",x:-1.3,y:0},{el:"N",x:0,y:0},{el:"O",x:1.3,y:0}],
      bonds2d: [[0,1,2],[1,2,2]],
      info: { structureType:"Simple covalent molecule", bondType:"Delocalized double bonds (N=N=O major contributor)", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp (central N)", polarity:"Polar",
        notes:"Even though it's linear, N₂O is polar because nitrogen sits at one end and oxygen at the other — unlike CO₂'s symmetric ends." } },
    { type: "resonance", name: "Resonance Structure 1 of 2",
      atoms2d: [{el:"N",x:-1.3,y:0,lp:1},{el:"N",x:0,y:0},{el:"O",x:1.3,y:0,lp:2}],
      bonds2d: [[0,1,2],[1,2,2]],
      info: { structureType:"Resonance contributor", bondType:"N=N=O", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp", polarity:"Polar",
        notes:"The major contributor — both N–N and N–O behave as double bonds." } },
    { type: "resonance", name: "Resonance Structure 2 of 2",
      atoms2d: [{el:"N",x:-1.3,y:0,lp:1},{el:"N",x:0,y:0},{el:"O",x:1.3,y:0,lp:3}],
      bonds2d: [[0,1,3],[1,2,1]],
      info: { structureType:"Resonance contributor", bondType:"N≡N–O", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp", polarity:"Polar",
        notes:"A minor contributor with a nitrogen-nitrogen triple bond and a single N–O bond, carrying formal charges." } },
    { type: "condensed", name: "Condensed Formula", formula:"N₂O",
      info: { structureType:"Condensed formula", bondType:"Delocalized", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp", polarity:"Polar",
        notes:"Laughing gas — used both as a dental anaesthetic and, unfortunately, as a potent greenhouse gas." } },
  ],

  SO3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"S",x:0,y:0},{el:"O",x:0,y:1.35},{el:"O",x:1.17,y:-0.68},{el:"O",x:-1.17,y:-0.68}],
      bonds2d: [[0,1,2],[0,2,2],[0,3,2]],
      info: { structureType:"Simple covalent molecule", bondType:"Delocalized (expanded octet on S)", molecularGeometry:"Trigonal planar", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar",
        notes:"Perfectly symmetric, so despite three polar S=O bonds, the dipoles cancel completely." } },
    { type: "resonance", name: "Resonance Structure 1 of 3",
      atoms2d: [{el:"S",x:0,y:0},{el:"O",x:0,y:1.35,lp:2},{el:"O",x:1.17,y:-0.68,lp:3},{el:"O",x:-1.17,y:-0.68,lp:3}],
      bonds2d: [[0,1,2],[0,2,1],[0,3,1]],
      info: { structureType:"Resonance contributor", bondType:"One S=O double, two S–O single", molecularGeometry:"Trigonal planar", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar (averaged)",
        notes:"One of three equivalent minimal-octet contributors, each placing the double bond on a different oxygen." } },
    { type: "resonance", name: "Resonance Structure 2 of 3",
      atoms2d: [{el:"S",x:0,y:0},{el:"O",x:0,y:1.35,lp:3},{el:"O",x:1.17,y:-0.68,lp:2},{el:"O",x:-1.17,y:-0.68,lp:3}],
      bonds2d: [[0,1,1],[0,2,2],[0,3,1]],
      info: { structureType:"Resonance contributor", bondType:"One S=O double, two S–O single", molecularGeometry:"Trigonal planar", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar (averaged)",
        notes:"The double bond rotates to a different oxygen in each of the three equivalent contributors." } },
    { type: "resonance", name: "Resonance Structure 3 of 3",
      atoms2d: [{el:"S",x:0,y:0},{el:"O",x:0,y:1.35,lp:3},{el:"O",x:1.17,y:-0.68,lp:3},{el:"O",x:-1.17,y:-0.68,lp:2}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,2]],
      info: { structureType:"Resonance contributor", bondType:"One S=O double, two S–O single", molecularGeometry:"Trigonal planar", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar (averaged)",
        notes:"The third and final equivalent contributor — averaging all three gives each S–O bond about 1.33 bond order." } },
    { type: "condensed", name: "Condensed Formula", formula:"SO₃",
      info: { structureType:"Condensed formula", bondType:"Delocalized", molecularGeometry:"Trigonal planar", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar",
        notes:"Reacts violently with water to form sulfuric acid — a key industrial intermediate and acid-rain contributor." } },
  ],

  H2O2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"O",x:-0.5,y:0.2},{el:"O",x:0.5,y:0.2},{el:"H",x:-1.15,y:0.85},{el:"H",x:1.15,y:-0.45}],
      bonds2d: [[0,1,1],[0,2,1],[1,3,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (O–O, O–H)", molecularGeometry:"Bent, non-planar (\"open book\")", bondAngles:"~94.8° (O–O–H)", hybridization:"sp³ (both oxygens)", polarity:"Polar",
        notes:"Not a flat molecule — swipe to Wedge-and-Dash to see the twist that a flat drawing can't show." } },
    { type: "wedgedash", name: "Wedge-and-Dash Formula",
      atoms2d: [{el:"O",x:-0.5,y:0.15},{el:"O",x:0.5,y:0.15},{el:"H",x:-1.0,y:0.95},{el:"H",x:1.0,y:-0.65}],
      bonds2d: [[0,1,1,"plain"],[0,2,1,"wedge"],[1,3,1,"dash"]],
      info: { structureType:"Wedge-and-dash formula", bondType:"Polar covalent", molecularGeometry:"Non-planar (\"open book\")", bondAngles:"~90.2° dihedral angle between the two H atoms", hybridization:"sp³", polarity:"Polar",
        notes:"The two O–H bonds twist out of plane from each other like a half-open book, minimizing repulsion between the lone pairs on each oxygen." } },
    { type: "condensed", name: "Condensed Formula", formula:"H₂O₂",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Non-planar", bondAngles:"~94.8°", hybridization:"sp³", polarity:"Polar",
        notes:"The O–O single bond is unusually weak, which is exactly why hydrogen peroxide breaks down into water and oxygen so readily." } },
  ],

  C2H2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"H",x:-1.9,y:0},{el:"C",x:-0.6,y:0},{el:"C",x:0.6,y:0},{el:"H",x:1.9,y:0}],
      bonds2d: [[0,1,1],[1,2,3],[2,3,1]],
      info: { structureType:"Simple covalent molecule (alkyne)", bondType:"Nonpolar covalent (C≡C, C–H)", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp (both carbons)", polarity:"Nonpolar",
        notes:"The triple bond locks the whole molecule into a straight line — there's no way to bend around a triple bond." } },
    { type: "skeletal", name: "Skeletal Formula", skeletal:true,
      atoms2d: [{el:"H",x:-1.9,y:0,skelHide:true},{el:"C",x:-0.6,y:0},{el:"C",x:0.6,y:0},{el:"H",x:1.9,y:0,skelHide:true}],
      bonds2d: [[0,1,1],[1,2,3],[2,3,1]],
      info: { structureType:"Skeletal formula", bondType:"Nonpolar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp", polarity:"Nonpolar",
        notes:"Carbon vertices and their hydrogens go unlabeled by convention — only the triple bond mark is needed to read the structure." } },
    { type: "condensed", name: "Condensed Formula", formula:"C₂H₂",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp", polarity:"Nonpolar",
        notes:"Also called ethyne — burns hot enough (with oxygen) to cut steel in an oxyacetylene torch." } },
  ],

  C2H4: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"H",x:-1.3,y:0.85},{el:"H",x:-1.3,y:-0.85},{el:"C",x:-0.6,y:0},{el:"C",x:0.6,y:0},{el:"H",x:1.3,y:0.85},{el:"H",x:1.3,y:-0.85}],
      bonds2d: [[0,2,1],[1,2,1],[2,3,2],[3,4,1],[3,5,1]],
      info: { structureType:"Simple covalent molecule (alkene)", bondType:"Nonpolar covalent (C=C, C–H)", molecularGeometry:"Trigonal planar (at each carbon)", bondAngles:"~120°", hybridization:"sp² (both carbons)", polarity:"Nonpolar",
        notes:"The double bond forces the whole molecule flat — rotating around a C=C bond would mean breaking the pi bond, which is why cis/trans isomers exist for substituted alkenes." } },
    { type: "skeletal", name: "Skeletal Formula", skeletal:true,
      atoms2d: [{el:"H",x:-1.3,y:0.85,skelHide:true},{el:"H",x:-1.3,y:-0.85,skelHide:true},{el:"C",x:-0.6,y:0},{el:"C",x:0.6,y:0},{el:"H",x:1.3,y:0.85,skelHide:true},{el:"H",x:1.3,y:-0.85,skelHide:true}],
      bonds2d: [[0,2,1],[1,2,1],[2,3,2],[3,4,1],[3,5,1]],
      info: { structureType:"Skeletal formula", bondType:"Nonpolar covalent", molecularGeometry:"Trigonal planar", bondAngles:"~120°", hybridization:"sp²", polarity:"Nonpolar",
        notes:"Even the hydrogens on the double-bonded carbons are dropped in true skeletal notation — only the double bond and the implied carbons matter." } },
    { type: "condensed", name: "Condensed Formula", formula:"C₂H₄",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent", molecularGeometry:"Trigonal planar", bondAngles:"~120°", hybridization:"sp²", polarity:"Nonpolar",
        notes:"Also called ethylene — the highest-volume organic chemical made industrially, mostly turned into polyethylene plastic." } },
  ],

  C2H6: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"C",x:-0.6,y:0},{el:"C",x:0.6,y:0},{el:"H",x:-1.3,y:0.8},{el:"H",x:-1.3,y:-0.8},{el:"H",x:-0.6,y:1.0},{el:"H",x:1.3,y:0.8},{el:"H",x:1.3,y:-0.8},{el:"H",x:0.6,y:-1.0}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1],[0,4,1],[1,5,1],[1,6,1],[1,7,1]],
      info: { structureType:"Simple covalent molecule (alkane)", bondType:"Nonpolar covalent (C–C, C–H)", molecularGeometry:"Tetrahedral (at each carbon)", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Free rotation around the C–C single bond lets the two CH₃ groups spin relative to each other — unlike ethylene's locked-flat double bond." } },
    { type: "wedgedash", name: "Wedge-and-Dash Formula",
      atoms2d: [{el:"C",x:-0.5,y:0.1},{el:"C",x:0.5,y:0.1},{el:"H",x:-1.3,y:0.8},{el:"H",x:-1.3,y:-0.6},{el:"H",x:-0.5,y:1.0},{el:"H",x:1.3,y:0.8},{el:"H",x:1.3,y:-0.6},{el:"H",x:0.5,y:-0.9}],
      bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"wedge"],[0,4,1,"dash"],[1,5,1,"plain"],[1,6,1,"dash"],[1,7,1,"wedge"]],
      info: { structureType:"Wedge-and-dash formula", bondType:"Nonpolar covalent", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Shown here in a staggered conformation — the lowest-energy arrangement, with each hydrogen sitting between (not behind) the hydrogens on the other carbon." } },
    { type: "skeletal", name: "Skeletal Formula", skeletal:true,
      atoms2d: [{el:"C",x:-0.7,y:0},{el:"C",x:0.7,y:0}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Skeletal formula", bondType:"Nonpolar covalent", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"At just two carbons, ethane's skeletal formula is nearly minimal — a single line between two implied vertices." } },
    { type: "condensed", name: "Condensed Formula", formula:"CH₃CH₃",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"The second-simplest alkane, and the second-largest component of natural gas after methane." } },
  ],

  C3H8: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"C",x:-1.6,y:0},{el:"C",x:0,y:0.75},{el:"C",x:1.6,y:0},
        {el:"H",x:-2.3,y:0.65},{el:"H",x:-2.3,y:-0.65},{el:"H",x:-1.6,y:-1.0},
        {el:"H",x:0,y:1.75},{el:"H",x:-0.55,y:0.75},
        {el:"H",x:2.3,y:0.65},{el:"H",x:2.3,y:-0.65},{el:"H",x:1.6,y:-1.0}],
      bonds2d: [[0,1,1],[1,2,1],[0,3,1],[0,4,1],[0,5,1],[1,6,1],[1,7,1],[2,8,1],[2,9,1],[2,10,1]],
      info: { structureType:"Simple covalent molecule (alkane)", bondType:"Nonpolar covalent", molecularGeometry:"Tetrahedral (at each carbon)", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"With every carbon fully saturated with hydrogen, propane is about as unreactive as a hydrocarbon gets — which is exactly why it burns cleanly as a fuel." } },
    { type: "skeletal", name: "Skeletal Formula", skeletal:true,
      atoms2d: [{el:"C",x:-1.6,y:0},{el:"C",x:0,y:0.75},{el:"C",x:1.6,y:0}],
      bonds2d: [[0,1,1],[1,2,1]],
      info: { structureType:"Skeletal formula", bondType:"Nonpolar covalent", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Each bend in the zigzag line represents a carbon — this shorthand is how chemists actually draw larger organic molecules, since spelling out every C and H gets unwieldy fast." } },
    { type: "condensed", name: "Condensed Formula", formula:"CH₃CH₂CH₃",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Sold compressed as a liquid in tanks — the gas you smell (an odorant is added deliberately) at a barbecue grill." } },
  ],

  CH3OH: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"C",x:-0.6,y:0},{el:"O",x:0.7,y:0},{el:"H",x:-1.3,y:0.8},{el:"H",x:-1.3,y:-0.8},{el:"H",x:-0.6,y:1.0},{el:"H",x:1.35,y:0.75}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1],[0,4,1],[1,5,1]],
      info: { structureType:"Simple covalent molecule (alcohol)", bondType:"Polar covalent (C–O, O–H)", molecularGeometry:"Tetrahedral at carbon, bent at oxygen", bondAngles:"~109.5° at C, ~109° at O", hybridization:"sp³ (both C and O)", polarity:"Polar",
        notes:"The –OH group makes methanol miscible with water in any ratio, unlike the nonpolar hydrocarbon it's built from." } },
    { type: "skeletal", name: "Skeletal Formula", skeletal:true,
      atoms2d: [{el:"C",x:-0.7,y:0},{el:"O",x:0.7,y:0}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Skeletal formula", bondType:"Polar covalent", molecularGeometry:"Tetrahedral at C, bent at O", bondAngles:"~109°", hybridization:"sp³", polarity:"Polar",
        notes:"The carbon vertex stays implicit, but oxygen — a heteroatom — is always labeled explicitly in skeletal notation." } },
    { type: "condensed", name: "Condensed Formula", formula:"CH₃OH",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Tetrahedral at C, bent at O", bondAngles:"~109°", hybridization:"sp³", polarity:"Polar",
        notes:"Also called wood alcohol — toxic to drink, but a common industrial solvent and fuel additive." } },
  ],

  C2H5OH: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"C",x:-1.6,y:0},{el:"C",x:-0.3,y:0.7},{el:"O",x:1.0,y:0},
        {el:"H",x:-2.3,y:0.65},{el:"H",x:-2.3,y:-0.65},{el:"H",x:-1.6,y:-1.0},
        {el:"H",x:-0.3,y:1.7},{el:"H",x:-0.85,y:0.75},{el:"H",x:1.6,y:0.7}],
      bonds2d: [[0,1,1],[1,2,1],[0,3,1],[0,4,1],[0,5,1],[1,6,1],[1,7,1],[2,8,1]],
      info: { structureType:"Simple covalent molecule (alcohol)", bondType:"Polar covalent (C–O, O–H)", molecularGeometry:"Tetrahedral at both carbons, bent at oxygen", bondAngles:"~109.5° at C, ~109° at O", hybridization:"sp³ throughout", polarity:"Polar",
        notes:"The longer nonpolar carbon chain (vs. methanol) is fully outweighed by the –OH group, which still dominates ethanol's chemistry and lets it mix with water in any proportion." } },
    { type: "skeletal", name: "Skeletal Formula", skeletal:true,
      atoms2d: [{el:"C",x:-1.6,y:0},{el:"C",x:-0.3,y:0.7},{el:"O",x:1.0,y:0}],
      bonds2d: [[0,1,1],[1,2,1]],
      info: { structureType:"Skeletal formula", bondType:"Polar covalent", molecularGeometry:"Tetrahedral / bent at O", bondAngles:"~109°", hybridization:"sp³", polarity:"Polar",
        notes:"Two implicit carbon vertices, one explicitly-labeled oxygen — the same convention used for every alcohol." } },
    { type: "condensed", name: "Condensed Formula", formula:"CH₃CH₂OH",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Tetrahedral / bent at O", bondAngles:"~109°", hybridization:"sp³", polarity:"Polar",
        notes:"The alcohol in beer, wine, and spirits — produced biologically by yeast fermenting sugars." } },
  ],

  CH3COOH: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"C",x:-1.4,y:0},{el:"C",x:0,y:0.6},{el:"O",x:0.2,y:1.7},{el:"O",x:1.1,y:-0.1},
        {el:"H",x:-2.1,y:0.65},{el:"H",x:-2.1,y:-0.65},{el:"H",x:-1.4,y:-1.0},{el:"H",x:1.9,y:0.4}],
      bonds2d: [[0,1,1],[1,2,2],[1,3,1],[0,4,1],[0,5,1],[0,6,1],[3,7,1]],
      info: { structureType:"Simple covalent molecule (carboxylic acid)", bondType:"Polar covalent, includes one C=O", molecularGeometry:"Trigonal planar at the carbonyl carbon, tetrahedral at the methyl carbon", bondAngles:"~120° at C=O carbon, 109.5° at CH₃ carbon", hybridization:"sp² (carbonyl C), sp³ (methyl C)", polarity:"Polar",
        notes:"The carboxyl group (–COOH) is what makes this an acid — it readily donates the O–H proton, and the resulting acetate ion is resonance-stabilized." } },
    { type: "skeletal", name: "Skeletal Formula", skeletal:true,
      atoms2d: [{el:"C",x:-1.4,y:0},{el:"C",x:0,y:0.6},{el:"O",x:0.2,y:1.7},{el:"O",x:1.1,y:-0.1},{el:"H",x:1.9,y:0.4}],
      bonds2d: [[0,1,1],[1,2,2],[1,3,1],[3,4,1]],
      info: { structureType:"Skeletal formula", bondType:"Polar covalent", molecularGeometry:"Trigonal planar / tetrahedral", bondAngles:"~120° / 109.5°", hybridization:"sp² / sp³", polarity:"Polar",
        notes:"The carbonyl and hydroxyl oxygens stay labeled — only the carbon backbone is implied." } },
    { type: "condensed", name: "Condensed Formula", formula:"CH₃COOH",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal planar / tetrahedral", bondAngles:"~120° / 109.5°", hybridization:"sp² / sp³", polarity:"Polar",
        notes:"Vinegar is roughly 4-7% acetic acid dissolved in water." } },
  ],

  C6H6: [
    { type: "structural", name: "Structural Formula (Kekulé 1)",
      atoms2d: [{el:"C",x:0,y:1.2},{el:"C",x:1.04,y:0.6},{el:"C",x:1.04,y:-0.6},{el:"C",x:0,y:-1.2},{el:"C",x:-1.04,y:-0.6},{el:"C",x:-1.04,y:0.6}],
      bonds2d: [[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1]],
      info: { structureType:"Simple covalent molecule (aromatic)", bondType:"Delocalized (~1.5 bond order all around the ring)", molecularGeometry:"Planar hexagonal ring", bondAngles:"120°", hybridization:"sp² (all six carbons)", polarity:"Nonpolar",
        notes:"All six C–C bonds are actually identical — the alternating double bonds shown here are just one of two ways to draw it. Swipe to Resonance to see the other." } },
    { type: "resonance", name: "Resonance Structure 1 of 2 (Kekulé)",
      atoms2d: [{el:"C",x:0,y:1.2},{el:"C",x:1.04,y:0.6},{el:"C",x:1.04,y:-0.6},{el:"C",x:0,y:-1.2},{el:"C",x:-1.04,y:-0.6},{el:"C",x:-1.04,y:0.6}],
      bonds2d: [[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1]],
      info: { structureType:"Resonance contributor", bondType:"Alternating double/single", molecularGeometry:"Planar hexagonal ring", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar",
        notes:"One of the two classic Kekulé structures, proposed in 1865 — famously, the story goes Kekulé pictured it after dreaming of a snake biting its own tail." } },
    { type: "resonance", name: "Resonance Structure 2 of 2 (Kekulé)",
      atoms2d: [{el:"C",x:0,y:1.2},{el:"C",x:1.04,y:0.6},{el:"C",x:1.04,y:-0.6},{el:"C",x:0,y:-1.2},{el:"C",x:-1.04,y:-0.6},{el:"C",x:-1.04,y:0.6}],
      bonds2d: [[0,1,1],[1,2,2],[2,3,1],[3,4,2],[4,5,1],[5,0,2]],
      info: { structureType:"Resonance contributor", bondType:"Alternating double/single (flipped)", molecularGeometry:"Planar hexagonal ring", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar",
        notes:"The second Kekulé form — averaging both (plus the delocalized pi system neither one fully captures) gives every C–C bond its real, equal ~1.5 order." } },
    { type: "skeletal", name: "Skeletal Formula", skeletal:true,
      atoms2d: [{el:"C",x:0,y:1.2},{el:"C",x:1.04,y:0.6},{el:"C",x:1.04,y:-0.6},{el:"C",x:0,y:-1.2},{el:"C",x:-1.04,y:-0.6},{el:"C",x:-1.04,y:0.6}],
      bonds2d: [[0,1,2],[1,2,1],[2,3,2],[3,4,1],[4,5,2],[5,0,1]],
      info: { structureType:"Skeletal formula", bondType:"Delocalized", molecularGeometry:"Planar hexagonal ring", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar",
        notes:"Every vertex is an implicit CH — the bare hexagon (sometimes drawn with a circle instead of alternating lines) is organic chemistry's most recognizable shorthand." } },
    { type: "condensed", name: "Condensed Formula", formula:"C₆H₆",
      info: { structureType:"Condensed formula", bondType:"Delocalized", molecularGeometry:"Planar hexagonal ring", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar",
        notes:"The simplest aromatic hydrocarbon, and the parent structure of an enormous family of aromatic compounds." } },
  ],

  MGO: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Mg",x:-0.8,y:0,charge:"2+"},{el:"O",x:0.8,y:0,charge:"2–"}],
      bonds2d: [[0,1,1,"ionic"]],
      info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Drawn as an ion pair for simplicity — swipe to Crystal Lattice for what solid MgO actually looks like." } },
    { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
      info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
        notes:"Same rock-salt structure as NaCl, but the 2+/2– charges make the ionic attraction much stronger — which is why MgO survives to nearly 2800°C before melting." } },
    { type: "condensed", name: "Condensed Formula", formula:"MgO",
      info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Used as a refractory (heat-resistant) lining in furnaces precisely because of that extremely high melting point." } },
  ],

  KCL: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"K",x:-0.8,y:0,charge:"+"},{el:"Cl",x:0.8,y:0,charge:"–"}],
      bonds2d: [[0,1,1,"ionic"]],
      info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Drawn as an ion pair for simplicity — swipe to Crystal Lattice for the real structure." } },
    { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
      info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
        notes:"Structurally identical to NaCl — potassium's larger ionic radius just stretches the lattice spacing slightly." } },
    { type: "condensed", name: "Condensed Formula", formula:"KCl",
      info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Used medically as a potassium supplement, and as a substitute for table salt in low-sodium diets." } },
  ],

  CAO: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Ca",x:-0.8,y:0,charge:"2+"},{el:"O",x:0.8,y:0,charge:"2–"}],
      bonds2d: [[0,1,1,"ionic"]],
      info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Drawn as an ion pair for simplicity — swipe to Crystal Lattice for the real structure." } },
    { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
      info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
        notes:"Quicklime — made by heating limestone (CaCO₃) until it releases CO₂, leaving this rock-salt-structured oxide behind." } },
    { type: "condensed", name: "Condensed Formula", formula:"CaO",
      info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Reacts exothermically with water to form calcium hydroxide (slaked lime) — historically used in mortar and cement." } },
  ],

  HCN: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"H",x:-1.9,y:0},{el:"C",x:-0.6,y:0},{el:"N",x:0.9,y:0}],
      bonds2d: [[0,1,1],[1,2,3]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (C≡N), nonpolar (C–H)", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp (carbon)", polarity:"Polar",
        notes:"Extremely toxic despite its simple structure — it blocks cellular respiration by binding to the same enzyme site oxygen needs." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"H",x:-1.9,y:0},{el:"C",x:-0.6,y:0},{el:"N",x:0.9,y:0,lp:1}],
      bonds2d: [[0,1,1],[1,2,3]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent (C≡N)", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp", polarity:"Polar",
        notes:"Nitrogen keeps one lone pair; the triple bond uses the rest of carbon and nitrogen's remaining valence electrons." } },
    { type: "condensed", name: "Condensed Formula", formula:"HCN",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"sp", polarity:"Polar",
        notes:"Salts of its conjugate base (cyanide, CN⁻) are what's usually meant by 'cyanide poisoning.'" } },
  ],

  H2CO: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"O",x:0,y:1.3},{el:"C",x:0,y:0},{el:"H",x:-1.05,y:-0.65},{el:"H",x:1.05,y:-0.65}],
      bonds2d: [[1,0,2],[1,2,1],[1,3,1]],
      info: { structureType:"Simple covalent molecule (aldehyde)", bondType:"Polar covalent (C=O, C–H)", molecularGeometry:"Trigonal planar", bondAngles:"~120°", hybridization:"sp² (carbon)", polarity:"Polar",
        notes:"The simplest aldehyde — the carbonyl (C=O) group shown here is the reactive heart of thousands of larger organic molecules." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"O",x:0,y:1.3,lp:2},{el:"C",x:0,y:0},{el:"H",x:-1.05,y:-0.65},{el:"H",x:1.05,y:-0.65}],
      bonds2d: [[1,0,2],[1,2,1],[1,3,1]],
      info: { structureType:"Lewis structure", bondType:"Polar covalent", molecularGeometry:"Trigonal planar", bondAngles:"~120°", hybridization:"sp²", polarity:"Polar",
        notes:"Carbon carries no lone pairs here — all four of its bonding electrons are committed to the double bond and two C–H bonds." } },
    { type: "condensed", name: "Condensed Formula", formula:"H₂CO",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal planar", bondAngles:"~120°", hybridization:"sp²", polarity:"Polar",
        notes:"Commonly sold dissolved in water as 'formalin,' used as a preservative and disinfectant." } },
  ],

  PH3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"P",x:0,y:0.5},{el:"H",x:-0.95,y:-0.35},{el:"H",x:0.95,y:-0.35},{el:"H",x:0,y:-1.0}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Weakly polar covalent (P–H)", molecularGeometry:"Trigonal pyramidal", bondAngles:"~93.5°", hybridization:"Approximately sp³ — phosphorus's larger orbitals hybridize less cleanly than nitrogen's", polarity:"Weakly polar",
        notes:"Ammonia's heavier, much smellier cousin — its bond angle sits far closer to 90° than NH₃'s 107°, for the same reason H₂S's angle sits below H₂O's." } },
    { type: "wedgedash", name: "Wedge-and-Dash Formula",
      atoms2d: [{el:"P",x:0,y:0.5},{el:"H",x:-0.9,y:-0.25},{el:"H",x:0.9,y:-0.25},{el:"H",x:0,y:-0.55}],
      bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"wedge"]],
      info: { structureType:"Wedge-and-dash formula", bondType:"Weakly polar covalent", molecularGeometry:"Trigonal pyramidal", bondAngles:"~93.5°", hybridization:"sp³ (nominal)", polarity:"Weakly polar",
        notes:"The pyramid is much flatter (angle closer to 90°) than ammonia's, which is visible in how little the wedge bond has to tilt here." } },
    { type: "condensed", name: "Condensed Formula", formula:"PH₃",
      info: { structureType:"Condensed formula", bondType:"Weakly polar covalent", molecularGeometry:"Trigonal pyramidal", bondAngles:"~93.5°", hybridization:"sp³", polarity:"Weakly polar",
        notes:"Spontaneously flammable in air and notoriously toxic — used as a fumigant for stored grain." } },
  ],

  F2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"F",x:-0.7,y:0},{el:"F",x:0.7,y:0}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Nonpolar covalent (F–F)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"The most reactive element in the periodic table, in its most stable elemental form — the F–F bond is actually weaker than you'd expect, since the small atoms' lone pairs repel each other." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"F",x:-0.7,y:0,lp:3},{el:"F",x:0.7,y:0,lp:3}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Lewis structure", bondType:"Nonpolar covalent", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Three lone pairs crowd each tiny fluorine atom, which is exactly why the single F–F bond is comparatively weak and fluorine gas is so reactive." } },
    { type: "condensed", name: "Condensed Formula", formula:"F₂",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Too reactive to occur free in nature — always found combined with other elements as fluoride compounds." } },
  ],

  CL2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Cl",x:-0.7,y:0},{el:"Cl",x:0.7,y:0}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Nonpolar covalent (Cl–Cl)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"A pale yellow-green gas — used both to purify drinking water and, far more grimly, as one of the first chemical weapons." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"Cl",x:-0.7,y:0,lp:3},{el:"Cl",x:0.7,y:0,lp:3}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Lewis structure", bondType:"Nonpolar covalent", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Each chlorine keeps three lone pairs, sharing just one bonding pair between them." } },
    { type: "condensed", name: "Condensed Formula", formula:"Cl₂",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Industrially produced by electrolyzing brine — the same process that co-produces sodium hydroxide." } },
  ],

  BR2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Br",x:-0.7,y:0},{el:"Br",x:0.7,y:0}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Nonpolar covalent (Br–Br)", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"The only nonmetal that's liquid at room temperature — its reddish-brown fumes are the reason it's handled with real caution." } },
    { type: "lewis", name: "Lewis Structure",
      atoms2d: [{el:"Br",x:-0.7,y:0,lp:3},{el:"Br",x:0.7,y:0,lp:3}],
      bonds2d: [[0,1,1]],
      info: { structureType:"Lewis structure", bondType:"Nonpolar covalent", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Structurally identical to F₂ and Cl₂ — the halogens' family resemblance runs all the way down to the Lewis structure." } },
    { type: "condensed", name: "Condensed Formula", formula:"Br₂",
      info: { structureType:"Condensed formula", bondType:"Nonpolar covalent", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Used historically in photographic film and, diluted, as a disinfectant for water and swimming pools." } },
  ],

  SF6: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"S",x:0,y:0},{el:"F",x:0,y:1.4},{el:"F",x:0,y:-1.4},{el:"F",x:1.4,y:0},{el:"F",x:-1.4,y:0},{el:"F",x:0.75,y:0.75},{el:"F",x:-0.75,y:-0.75}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1],[0,6,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent bonds (S–F), nonpolar overall", molecularGeometry:"Octahedral", bondAngles:"90°", hybridization:"sp³d²", polarity:"Nonpolar",
        notes:"Sulfur expands past the normal octet to bond with six fluorines — the perfect symmetry cancels all six bond dipoles, and the resulting molecule is so inert it's used as an electrical insulator." } },
    { type: "condensed", name: "Condensed Formula", formula:"SF₆",
      info: { structureType:"Condensed formula", bondType:"Polar covalent, nonpolar overall", molecularGeometry:"Octahedral", bondAngles:"90°", hybridization:"sp³d²", polarity:"Nonpolar",
        notes:"One of the most potent greenhouse gases known per molecule, despite being chemically almost totally unreactive." } },
  ],

  PCL5: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"P",x:0,y:0},{el:"Cl",x:0,y:1.5},{el:"Cl",x:0,y:-1.5},{el:"Cl",x:1.3,y:0.4},{el:"Cl",x:-1.3,y:0.4},{el:"Cl",x:0,y:0.9}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1],[0,4,1],[0,5,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (P–Cl)", molecularGeometry:"Trigonal bipyramidal", bondAngles:"90° (axial-equatorial), 120° (equatorial-equatorial)", hybridization:"sp³d", polarity:"Nonpolar (symmetric)",
        notes:"Two distinct bond angles in one molecule — a hallmark of the trigonal bipyramidal shape, since the two 'axial' chlorines sit differently than the three 'equatorial' ones." } },
    { type: "condensed", name: "Condensed Formula", formula:"PCl₅",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal bipyramidal", bondAngles:"90° / 120°", hybridization:"sp³d", polarity:"Nonpolar",
        notes:"A common chlorinating agent in organic synthesis, converting –OH groups into –Cl groups." } },
  ],

  ALCL3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Al",x:0,y:0},{el:"Cl",x:0,y:1.4},{el:"Cl",x:1.2,y:-0.7},{el:"Cl",x:-1.2,y:-0.7}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1]],
      info: { structureType:"Covalent compound (monomeric gas-phase form)", bondType:"Polar covalent, with significant ionic character", molecularGeometry:"Trigonal planar", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar (symmetric monomer)",
        notes:"Shown here as the simple monomer, but real aluminium chloride usually exists as a dimer (Al₂Cl₆) at moderate temperatures, with two chlorines bridging the two aluminium atoms." } },
    { type: "condensed", name: "Condensed Formula", formula:"AlCl₃",
      info: { structureType:"Condensed formula", bondType:"Polar covalent / ionic character", molecularGeometry:"Trigonal planar (monomer)", bondAngles:"120°", hybridization:"sp²", polarity:"Nonpolar (monomer)",
        notes:"A classic Lewis acid — aluminium's empty p-orbital happily accepts an electron pair, which is exactly why it's used to catalyze Friedel-Crafts reactions." } },
  ],

  SICL4: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Si",x:0,y:0},{el:"Cl",x:0,y:1.15},{el:"Cl",x:1.05,y:-0.4},{el:"Cl",x:-1.05,y:-0.4},{el:"Cl",x:0,y:-1.15}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1],[0,4,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (Si–Cl)", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar (symmetric)",
        notes:"Reacts violently with water (releasing HCl fumes), which is exactly why it's used to lay down thin silicon-based films industrially." } },
    { type: "condensed", name: "Condensed Formula", formula:"SiCl₄",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"A key intermediate in refining silicon to the ultra-high purity semiconductors require." } },
  ],

  NO: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"N",x:-0.7,y:0},{el:"O",x:0.7,y:0}],
      bonds2d: [[0,1,2]],
      info: { structureType:"Simple covalent molecule (radical)", bondType:"Polar covalent, ~2.5 bond order", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"Best described by molecular orbital theory", polarity:"Polar",
        notes:"An odd-electron radical, like NO₂ — despite that, it's a crucial signaling molecule in your own blood vessels and nervous system." } },
    { type: "condensed", name: "Condensed Formula", formula:"NO",
      info: { structureType:"Condensed formula", bondType:"~2.5 bond order", molecularGeometry:"Linear (diatomic)", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar",
        notes:"The 1998 Nobel Prize in Medicine went to the discovery of nitric oxide's role as a signaling molecule in the cardiovascular system." } },
  ],

  H2SO4: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"S",x:0,y:0},{el:"O",x:0,y:1.3},{el:"O",x:0,y:-1.3},{el:"O",x:1.3,y:0.5},{el:"O",x:-1.3,y:0.5},{el:"H",x:1.9,y:1.1},{el:"H",x:-1.9,y:1.1}],
      bonds2d: [[0,1,2],[0,2,2],[0,3,1],[0,4,1],[3,5,1],[4,6,1]],
      info: { structureType:"Simple covalent molecule (oxoacid)", bondType:"Polar covalent (S=O, S–O, O–H)", molecularGeometry:"Tetrahedral around sulfur", bondAngles:"~109.5° at S", hybridization:"sp³ (sulfur)", polarity:"Polar",
        notes:"A tetrahedral sulfur center with two double-bonded oxygens and two hydroxyl groups — one of the highest-production-volume industrial chemicals in the world." } },
    { type: "condensed", name: "Condensed Formula", formula:"H₂SO₄",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Tetrahedral at S", bondAngles:"~109.5°", hybridization:"sp³", polarity:"Polar",
        notes:"Also the acid inside a lead-acid car battery." } },
  ],

  HNO3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"N",x:0,y:0},{el:"O",x:0,y:1.3},{el:"O",x:1.2,y:-0.6},{el:"O",x:-1.2,y:-0.6},{el:"H",x:-1.9,y:0.1}],
      bonds2d: [[0,1,2],[0,2,1],[0,3,1],[3,4,1]],
      info: { structureType:"Simple covalent molecule (oxoacid)", bondType:"Polar covalent, delocalized N–O bonds", molecularGeometry:"Trigonal planar around nitrogen", bondAngles:"~120° at N", hybridization:"sp² (nitrogen)", polarity:"Polar",
        notes:"The two N–O bonds without the hydrogen are equivalent by resonance, similar to the pattern in nitrate salts like sodium nitrate." } },
    { type: "condensed", name: "Condensed Formula", formula:"HNO₃",
      info: { structureType:"Condensed formula", bondType:"Polar covalent, delocalized", molecularGeometry:"Trigonal planar at N", bondAngles:"~120°", hybridization:"sp²", polarity:"Polar",
        notes:"One of the 'big three' industrial mineral acids, alongside sulfuric and hydrochloric acid." } },
  ],

  NAOH: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Na",x:-1.1,y:0,charge:"+"},{el:"O",x:0.3,y:0,charge:"–"},{el:"H",x:1.3,y:0.55}],
      bonds2d: [[0,1,1,"ionic"],[1,2,1]],
      info: { structureType:"Ionic compound with a covalent polyatomic ion", bondType:"Ionic (Na–O), polar covalent (O–H)", molecularGeometry:"n/a — an extended ionic solid, not a discrete molecule", bondAngles:"n/a", hybridization:"sp³ (oxygen, within the hydroxide ion)", polarity:"n/a (ionic solid)", coordinationNumber:"6",
        notes:"Na⁺ ions and covalently-bonded hydroxide (OH⁻) ions pack into a crystal lattice — drawn here simplified as a single formula unit." } },
    { type: "condensed", name: "Condensed Formula", formula:"NaOH",
      info: { structureType:"Condensed formula", bondType:"Ionic + covalent (within OH⁻)", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Common lye — used in soap-making, drain cleaner, and countless industrial processes." } },
  ],

  FE2O3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Fe",x:-1.1,y:0.5},{el:"Fe",x:1.1,y:0.5},{el:"O",x:-1.1,y:-1.0},{el:"O",x:1.1,y:-1.0},{el:"O",x:0,y:1.1}],
      bonds2d: [[0,2,1],[1,3,1],[0,4,1],[1,4,1]],
      info: { structureType:"Ionic/network compound", bondType:"Predominantly ionic, with covalent character", molecularGeometry:"n/a — an extended crystalline solid, not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Fe), 4 (O), in its corundum-type structure",
        notes:"Common rust — shown here as a small representative cluster; the real solid is an extended 3D network of Fe³⁺ and O²⁻ ions, not a bonded molecule." } },
    { type: "condensed", name: "Condensed Formula", formula:"Fe₂O₃",
      info: { structureType:"Condensed formula", bondType:"Ionic / covalent network", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Fe), 4 (O)",
        notes:"The reddish pigment in natural ochre, and the product of iron slowly reacting with oxygen and moisture." } },
  ],

  AL2O3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Al",x:-1.1,y:0.5},{el:"Al",x:1.1,y:0.5},{el:"O",x:-1.1,y:-1.0},{el:"O",x:1.1,y:-1.0},{el:"O",x:0,y:1.1}],
      bonds2d: [[0,2,1],[1,3,1],[0,4,1],[1,4,1]],
      info: { structureType:"Ionic/network compound", bondType:"Predominantly ionic, with covalent character", molecularGeometry:"n/a — an extended crystalline solid (corundum structure)", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Al), 4 (O)",
        notes:"Corundum — the mineral behind both rubies and sapphires, colored only by trace metal impurities in the same Al₂O₃ lattice." } },
    { type: "condensed", name: "Condensed Formula", formula:"Al₂O₃",
      info: { structureType:"Condensed formula", bondType:"Ionic / covalent network", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Al), 4 (O)",
        notes:"Extremely hard and chemically inert, which is why it's used as an abrasive (as sandpaper grit) and as a refractory ceramic." } },
  ],

  SIO2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Si",x:0,y:0},{el:"O",x:1.1,y:0.6},{el:"O",x:-1.1,y:0.6}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Covalent network solid", bondType:"Polar covalent (Si–O)", molecularGeometry:"n/a — an extended 3D network, not a discrete molecule", bondAngles:"~109.5° at each Si, ~144° at each bridging O", hybridization:"sp³ (silicon)", polarity:"n/a (network solid)", coordinationNumber:"4 (Si), 2 (O)",
        notes:"Quartz — every silicon sits at the center of a tetrahedron of oxygens, each oxygen bridging exactly two silicons, extending indefinitely in 3D. Shown here as one simplified corner." } },
    { type: "condensed", name: "Condensed Formula", formula:"SiO₂",
      info: { structureType:"Condensed formula", bondType:"Polar covalent network", molecularGeometry:"n/a", bondAngles:"~109.5° at Si", hybridization:"sp³", polarity:"n/a", coordinationNumber:"4 (Si)",
        notes:"The main component of sand, and the raw material glass is made from." } },
  ],

  TIO2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Ti",x:0,y:0},{el:"O",x:1.1,y:0.6},{el:"O",x:-1.1,y:0.6}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Ionic/network compound", bondType:"Predominantly ionic, with covalent character", molecularGeometry:"n/a — an extended crystalline solid (rutile structure)", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Ti), 3 (O)",
        notes:"The bright white pigment behind most white paint, sunscreen, and the white coating on the inside of pill capsules." } },
    { type: "condensed", name: "Condensed Formula", formula:"TiO₂",
      info: { structureType:"Condensed formula", bondType:"Ionic / covalent network", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Ti)",
        notes:"Also a photocatalyst — under UV light it breaks down organic dirt, which is why it's used in 'self-cleaning' glass coatings." } },
  ],

  ZNO: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Zn",x:-0.7,y:0,charge:"2+"},{el:"O",x:0.7,y:0,charge:"2–"}],
      bonds2d: [[0,1,1,"ionic"]],
      info: { structureType:"Ionic/covalent compound", bondType:"Ionic with significant covalent character", molecularGeometry:"n/a — an extended crystalline solid (wurtzite structure)", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"4",
        notes:"Drawn as an ion pair for simplicity — real ZnO forms a hexagonal wurtzite lattice (not the cubic rock-salt structure of NaCl), with each ion 4-coordinated." } },
    { type: "condensed", name: "Condensed Formula", formula:"ZnO",
      info: { structureType:"Condensed formula", bondType:"Ionic / covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"4",
        notes:"The active ingredient in mineral sunscreen and old-fashioned diaper rash cream." } },
  ],

  CUO: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Cu",x:-0.7,y:0,charge:"2+"},{el:"O",x:0.7,y:0,charge:"2–"}],
      bonds2d: [[0,1,1,"ionic"]],
      info: { structureType:"Ionic/covalent compound", bondType:"Ionic with covalent character", molecularGeometry:"n/a — an extended crystalline solid (monoclinic structure)", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"4",
        notes:"Drawn as an ion pair for simplicity — the real solid is a distorted, lower-symmetry lattice, not a simple cubic one." } },
    { type: "condensed", name: "Condensed Formula", formula:"CuO",
      info: { structureType:"Condensed formula", bondType:"Ionic / covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"4",
        notes:"A black solid used as a pigment in ceramics and glass, giving turquoise-to-black colors depending on firing conditions." } },
  ],

  AG2O: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Ag",x:-1.1,y:0,charge:"+"},{el:"Ag",x:1.1,y:0,charge:"+"},{el:"O",x:0,y:0.7,charge:"2–"}],
      bonds2d: [[0,2,1,"ionic"],[1,2,1,"ionic"]],
      info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — an extended crystalline solid", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"2 (Ag), 4 (O)",
        notes:"Each oxygen is surrounded by 4 silver ions, and each silver by 2 oxygens — a much lower coordination number than rock salt's 6:6." } },
    { type: "condensed", name: "Condensed Formula", formula:"Ag₂O",
      info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"2 (Ag)",
        notes:"Used in button-cell batteries and as a mild antiseptic." } },
  ],

  MGCL2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Cl",x:-1.1,y:0,charge:"–"},{el:"Mg",x:0,y:0,charge:"2+"},{el:"Cl",x:1.1,y:0,charge:"–"}],
      bonds2d: [[0,1,1,"ionic"],[1,2,1,"ionic"]],
      info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — an extended crystalline solid (layered structure)", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Mg), 3 (Cl)",
        notes:"One magnesium ion balances the charge of two chloride ions — the real solid forms stacked layers rather than a simple cubic lattice." } },
    { type: "condensed", name: "Condensed Formula", formula:"MgCl₂",
      info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Mg)",
        notes:"Commonly spread on roads as a de-icer, and used to make tofu (as a coagulant, called nigari)." } },
  ],

  FECL3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Fe",x:0,y:0},{el:"Cl",x:0,y:1.3},{el:"Cl",x:1.15,y:-0.65},{el:"Cl",x:-1.15,y:-0.65}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1]],
      info: { structureType:"Compound with mixed ionic/covalent character", bondType:"Polar covalent with ionic character", molecularGeometry:"Trigonal planar (as a monomer)", bondAngles:"120°", hybridization:"sp² (iron, simplified)", polarity:"Nonpolar (symmetric monomer)",
        notes:"Like AlCl₃, iron(III) chloride tends to form bridged dimers (Fe₂Cl₆) rather than staying as this simple monomer, especially in the vapor phase." } },
    { type: "condensed", name: "Condensed Formula", formula:"FeCl₃",
      info: { structureType:"Condensed formula", bondType:"Polar covalent / ionic character", molecularGeometry:"Trigonal planar (monomer)", bondAngles:"120°", hybridization:"sp² (simplified)", polarity:"Nonpolar (monomer)",
        notes:"Used to etch copper circuit boards and to clarify water and wastewater." } },
  ],

  CUCL2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Cl",x:-1.1,y:0,charge:"–"},{el:"Cu",x:0,y:0,charge:"2+"},{el:"Cl",x:1.1,y:0,charge:"–"}],
      bonds2d: [[0,1,1,"ionic"],[1,2,1,"ionic"]],
      info: { structureType:"Ionic compound with covalent character", bondType:"Ionic, with covalent character", molecularGeometry:"n/a — an extended crystalline solid (layered structure)", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Cu, distorted)",
        notes:"Its distinctive blue-green color, like most copper(II) compounds, comes from d-electron transitions within the copper ion." } },
    { type: "condensed", name: "Condensed Formula", formula:"CuCl₂",
      info: { structureType:"Condensed formula", bondType:"Ionic / covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (distorted)",
        notes:"Used as a catalyst and to add a blue-green color to fireworks and ceramic glazes." } },
  ],

  GEO2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Ge",x:0,y:0},{el:"O",x:1.1,y:0.6},{el:"O",x:-1.1,y:0.6}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Covalent network solid", bondType:"Polar covalent (Ge–O)", molecularGeometry:"n/a — an extended 3D network, structurally similar to quartz", bondAngles:"~109.5° at Ge", hybridization:"sp³ (germanium)", polarity:"n/a (network solid)", coordinationNumber:"4 (Ge)",
        notes:"Germanium's larger size than silicon lets it form both this quartz-like tetrahedral network and a denser rutile-like form under pressure." } },
    { type: "condensed", name: "Condensed Formula", formula:"GeO₂",
      info: { structureType:"Condensed formula", bondType:"Polar covalent network", molecularGeometry:"n/a", bondAngles:"~109.5°", hybridization:"sp³", polarity:"n/a", coordinationNumber:"4",
        notes:"Used to raise the refractive index of glass in fiber optics and camera lenses." } },
  ],

  SNO2: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Sn",x:0,y:0},{el:"O",x:1.1,y:0.6},{el:"O",x:-1.1,y:0.6}],
      bonds2d: [[0,1,1],[0,2,1]],
      info: { structureType:"Ionic/network compound", bondType:"Predominantly ionic, with covalent character", molecularGeometry:"n/a — an extended crystalline solid (rutile structure)", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Sn)",
        notes:"Adopts the same rutile structure as TiO₂ — a transparent, electrically conductive coating used on touchscreens and low-emissivity glass." } },
    { type: "condensed", name: "Condensed Formula", formula:"SnO₂",
      info: { structureType:"Condensed formula", bondType:"Ionic / covalent network", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
        notes:"Also the main ore of tin, cassiterite, mined since the Bronze Age." } },
  ],

  CACO3: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"Ca",x:-1.9,y:0,charge:"2+"},{el:"C",x:0,y:0},{el:"O",x:0,y:1.3},{el:"O",x:1.15,y:-0.65},{el:"O",x:-1.15,y:-0.65}],
      bonds2d: [[1,2,2],[1,3,1],[1,4,1],[4,0,1,"ionic"]],
      info: { structureType:"Ionic compound with a covalent polyatomic ion", bondType:"Ionic (Ca–O), delocalized covalent (within carbonate)", molecularGeometry:"Trigonal planar (carbonate ion)", bondAngles:"120° (within carbonate)", hybridization:"sp² (carbon)", polarity:"n/a (ionic solid)", coordinationNumber:"6 (Ca)",
        notes:"The carbonate ion's three C–O bonds are equivalent by resonance, just like nitrate's. This is limestone, chalk, and the shells of most marine creatures." } },
    { type: "condensed", name: "Condensed Formula", formula:"CaCO₃",
      info: { structureType:"Condensed formula", bondType:"Ionic + delocalized covalent", molecularGeometry:"Trigonal planar (carbonate)", bondAngles:"120°", hybridization:"sp²", polarity:"n/a", coordinationNumber:"6 (Ca)",
        notes:"Heating it drives off CO₂ and leaves behind calcium oxide (quicklime) — one of humanity's oldest chemical reactions." } },
  ],

  CF4: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"C",x:0,y:0},{el:"F",x:0,y:1.15},{el:"F",x:1.05,y:-0.4},{el:"F",x:-1.05,y:-0.4},{el:"F",x:0,y:-1.15}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1],[0,4,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (C–F)", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar (symmetric)",
        notes:"Structurally identical to methane, with each hydrogen replaced by fluorine — one of the most chemically stable, inert gases known, and an extremely potent greenhouse gas." } },
    { type: "condensed", name: "Condensed Formula", formula:"CF₄",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"sp³", polarity:"Nonpolar",
        notes:"Used in the semiconductor industry to etch silicon wafers with a plasma." } },
  ],

  N2H4: [
    { type: "structural", name: "Structural Formula",
      atoms2d: [{el:"N",x:-0.5,y:0.2},{el:"N",x:0.5,y:0.2},{el:"H",x:-1.15,y:0.85},{el:"H",x:-1.0,y:-0.55},{el:"H",x:1.15,y:0.85},{el:"H",x:1.0,y:-0.55}],
      bonds2d: [[0,1,1],[0,2,1],[0,3,1],[1,4,1],[1,5,1]],
      info: { structureType:"Simple covalent molecule", bondType:"Polar covalent (N–N, N–H)", molecularGeometry:"Non-planar (\"gauche\"), pyramidal at each nitrogen", bondAngles:"~109° at each N", hybridization:"sp³ (both nitrogens)", polarity:"Polar",
        notes:"Like hydrogen peroxide, hydrazine twists out of plane to keep its two lone pairs apart — swipe to Wedge-and-Dash to see it." } },
    { type: "wedgedash", name: "Wedge-and-Dash Formula",
      atoms2d: [{el:"N",x:-0.5,y:0.15},{el:"N",x:0.5,y:0.15},{el:"H",x:-1.1,y:0.9},{el:"H",x:-0.9,y:-0.6},{el:"H",x:1.1,y:0.9},{el:"H",x:0.9,y:-0.6}],
      bonds2d: [[0,1,1,"plain"],[0,2,1,"wedge"],[0,3,1,"dash"],[1,4,1,"dash"],[1,5,1,"wedge"]],
      info: { structureType:"Wedge-and-dash formula", bondType:"Polar covalent", molecularGeometry:"Non-planar, gauche conformation", bondAngles:"~109° at each N, ~90-95° dihedral", hybridization:"sp³", polarity:"Polar",
        notes:"The lone pairs (not shown) on each nitrogen twist away from each other, the same electron-repulsion logic behind H₂O₂'s open-book shape." } },
    { type: "condensed", name: "Condensed Formula", formula:"N₂H₄",
      info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Non-planar", bondAngles:"~109°", hybridization:"sp³", polarity:"Polar",
        notes:"A powerful rocket fuel — it reacts explosively with oxidizers like dinitrogen tetroxide, releasing enormous energy." } },
  ],
};

ALLOY_STRUCTURE_INFO.YELLOW_GOLD = { system: "FCC", note: "Gold's face-centered cubic lattice readily dissolves silver and copper atoms in solid solution, keeping the alloy soft and workable." };
ALLOY_STRUCTURE_INFO.ELECTRUM = { system: "FCC", note: "Gold and silver share the same FCC structure and atomic size, so they mix seamlessly across almost any ratio." };
ALLOY_STRUCTURE_INFO.NICHROME = { system: "FCC", note: "Chromium dissolves into nickel's FCC lattice; a thin, tightly-adherent chromium oxide layer forms at the surface and protects it from further oxidation, even white-hot." };
ALLOY_STRUCTURE_INFO.CHROMEL = { system: "FCC", note: "A nickel-chromium solid solution tuned for a stable, predictable thermoelectric voltage rather than for strength." };
ALLOY_STRUCTURE_INFO.ALUMEL = { system: "FCC", note: "Small amounts of aluminium, manganese, and silicon dissolve into nickel's FCC lattice without disrupting its predictable electrical behavior." };
ALLOY_STRUCTURE_INFO.MUMETAL = { system: "FCC", note: "A nickel-iron-based FCC solid solution whose crystal structure gives it an unusually easy path for magnetic domains to align and redirect fields." };
ALLOY_STRUCTURE_INFO.FERROCHROME = { system: "BCC", note: "Iron and chromium are both body-centered cubic, so they form a continuous BCC solid solution across a wide composition range." };
ALLOY_STRUCTURE_INFO.SILICON_BRONZE = { system: "FCC", note: "Silicon dissolves into copper's FCC lattice, strengthening it while keeping the alloy highly weldable." };
ALLOY_STRUCTURE_INFO.BELL_METAL = { system: "FCC", note: "A tin-rich bronze; the higher tin content stiffens copper's FCC lattice enough to ring with a clear, sustained tone." };
ALLOY_STRUCTURE_INFO.SPECULUM_METAL = { system: "FCC", note: "A very tin-rich, brittle bronze — the high tin content that gives it a bright, polishable surface also makes it prone to cracking." };
ALLOY_STRUCTURE_INFO.NICKEL_SILVER = { system: "FCC", note: "Nickel and zinc both dissolve into copper's FCC lattice; the nickel is what shifts the color from coppery to silvery-white." };
ALLOY_STRUCTURE_INFO.TYPE_METAL = { system: "MULTIPHASE", note: "Lead, antimony, and tin form several distinct intermetallic phases; the antimony-rich phase is what makes the alloy expand slightly as it solidifies, sharpening cast letterforms." };
ALLOY_STRUCTURE_INFO.ZAMAK = { system: "HCP", note: "Zinc's hexagonal lattice hosts a small amount of dissolved aluminium and copper, which raise its strength for die-casting." };
ALLOY_STRUCTURE_INFO.AZ31_MAGNESIUM = { system: "HCP", note: "Magnesium's hexagonal structure has few easy slip directions, which is why this alloy is strong for its weight but must be worked carefully to avoid cracking." };
ALLOY_STRUCTURE_INFO.BERYLLIUM_COPPER = { system: "FCC", note: "A small amount of beryllium dissolved in copper's FCC lattice can be aged to precipitate fine particles that dramatically boost strength." };
ALLOY_STRUCTURE_INFO.TUNGSTEN_HEAVY_ALLOY = { system: "BCC", note: "Tungsten's dense body-centered cubic lattice makes up the bulk of the alloy, with nickel and iron acting as a binder holding the tungsten grains together." };
ALLOY_STRUCTURE_INFO.PLATINUM_IRIDIUM = { system: "FCC", note: "Iridium dissolves into platinum's FCC lattice, and the resulting alloy resists the slow creep and wear that pure platinum alone would suffer over time." };
ALLOY_STRUCTURE_INFO.FIELDS_METAL = { system: "MULTIPHASE", note: "A bismuth-indium-tin eutectic — the three elements form a fine mixture of phases that melts at an unusually sharp, low temperature." };
ALLOY_STRUCTURE_INFO.ROSES_METAL = { system: "MULTIPHASE", note: "A bismuth-lead-tin eutectic whose multiple intermetallic phases give it a sharp, low melting point rather than a wide mushy range." };
ALLOY_STRUCTURE_INFO.GALVALUME = { system: "MULTIPHASE", note: "A zinc-aluminium-silicon coating that solidifies into interlocking aluminium-rich and zinc-rich regions, combining both metals' protective strengths." };
ALLOY_STRUCTURE_INFO.HADFIELD_STEEL = { system: "FCC", note: "Manganese stabilizes iron's face-centered cubic austenite phase down to room temperature — the same phase that lets the surface work-harden dramatically on impact." };
ALLOY_STRUCTURE_INFO.MARAGING_STEEL = { system: "BCC", note: "Forms a carbon-free, body-centered martensite on cooling, which is then aged to precipitate strengthening particles without the brittleness of ordinary hardened steel." };
ALLOY_STRUCTURE_INFO.WEATHERING_STEEL = { system: "BCC", note: "An ordinary body-centered cubic ferritic steel; its small copper, chromium, and nickel additions shape the rust layer into a dense, protective patina instead of flaking away." };
ALLOY_STRUCTURE_INFO.DAMASCUS_STEEL = { system: "BCC", note: "Alternating bands of body-centered ferrite and hard iron carbide, folded and forge-welded together, are what produce its famous surface pattern." };
ALLOY_STRUCTURE_INFO.BILLON = { system: "FCC", note: "Silver and copper share the same FCC structure but don't mix at all ratios; billon sits on the copper-rich end of that solid-solution range." };
ALLOY_STRUCTURE_INFO.SHAKUDO = { system: "FCC", note: "A small amount of gold dissolved in copper's FCC lattice; a chemical patina treatment then colors the surface a deep blue-black." };
ALLOY_STRUCTURE_INFO.COBALT_CHROME = { system: "MULTIPHASE", note: "Typically solidifies as a mixture of cobalt's usual hexagonal phase and a face-centered cubic phase, which together give it both hardness and toughness." };
ALLOY_STRUCTURE_INFO.SOLDER_INDIUM = { system: "TETRAGONAL", note: "Indium's own body-centered tetragonal structure carries through into this soft, very low-melting solder alloy." };
ALLOY_STRUCTURE_INFO.OSMIRIDIUM = { system: "HCP", note: "Dominated by osmium's dense hexagonal lattice — one of the reasons this alloy is so hard and wear-resistant despite being a simple two-metal mix." };

ALLOY_STRUCTURE_INFO.PERMALLOY = { system: "FCC", note: "Nickel and iron form a continuous FCC solid solution at this composition, which is what gives it such an easy path for magnetic domains to realign." };
ALLOY_STRUCTURE_INFO.SUPERMALLOY = { system: "FCC", note: "Adding molybdenum to permalloy's FCC nickel-iron lattice further smooths the way magnetic domains move through it." };
ALLOY_STRUCTURE_INFO.SAMARIUM_COBALT = { system: "HCP", note: "The Sm-Co intermetallic compound has a hexagonal crystal structure whose strong internal magnetic anisotropy is what makes it such a powerful, heat-resistant magnet." };
ALLOY_STRUCTURE_INFO.FERRONICKEL = { system: "BCC", note: "At this nickel content the alloy stays in iron's body-centered cubic ferrite phase, which is why it's added to molten steel as a nickel source rather than used alone." };
ALLOY_STRUCTURE_INFO.COPPER_TUNGSTEN = { system: "MULTIPHASE", note: "Not a true solid solution — this is a composite of solid tungsten grains with copper infiltrated into the pores between them." };
ALLOY_STRUCTURE_INFO.SILVER_TUNGSTEN = { system: "MULTIPHASE", note: "Like copper-tungsten, this is a composite: a solid tungsten skeleton infiltrated with silver, not a single blended lattice." };
ALLOY_STRUCTURE_INFO.PLATINUM_RHODIUM = { system: "FCC", note: "Rhodium dissolves into platinum's FCC lattice; the resulting alloy resists oxidation and creep even when held at very high temperatures for years." };
ALLOY_STRUCTURE_INFO.WOOTZ_STEEL = { system: "BCC", note: "A high-carbon steel whose slow, controlled cooling lets bands of hard iron carbide form within the body-centered ferrite, producing its famous surface pattern." };
ALLOY_STRUCTURE_INFO.GALFAN = { system: "MULTIPHASE", note: "Sits near a zinc-aluminium eutectic point, solidifying into a fine interlocking mixture of zinc-rich and aluminium-rich phases." };
ALLOY_STRUCTURE_INFO.WHITE_BRONZE = { system: "FCC", note: "Tin and zinc both dissolve into copper's FCC lattice; the higher tin content is what lightens the alloy's color toward silvery-white." };
ALLOY_STRUCTURE_INFO.RED_BRASS = { system: "FCC", note: "A copper-rich FCC solid solution — less zinc than ordinary brass, which is what keeps its color warm and reddish." };
ALLOY_STRUCTURE_INFO.MANGANESE_BRONZE = { system: "FCC", note: "A high-zinc brass strengthened by small manganese and iron additions dissolved into copper's FCC lattice." };
ALLOY_STRUCTURE_INFO.ALUMINUM_BRASS = { system: "FCC", note: "A small amount of aluminium in copper's FCC lattice forms a thin, self-healing oxide film that resists seawater corrosion." };
ALLOY_STRUCTURE_INFO.TOMBAC = { system: "FCC", note: "A very copper-rich brass; at this low zinc content the alloy stays a single FCC solid solution with a warm golden color." };
ALLOY_STRUCTURE_INFO.ARGENTIUM_SILVER = { system: "FCC", note: "Germanium dissolved in silver's FCC lattice forms a thin, self-healing oxide layer at the surface that resists ordinary tarnishing." };
ALLOY_STRUCTURE_INFO.PALLADIUM_SILVER = { system: "FCC", note: "Palladium and silver are both FCC and fully miscible, forming a single solid solution across this composition." };
ALLOY_STRUCTURE_INFO.NIOBIUM_TITANIUM = { system: "BCC", note: "Niobium and titanium form a continuous body-centered cubic solid solution, which becomes superconducting when cooled near absolute zero." };
ALLOY_STRUCTURE_INFO.BABBITT_LEAD = { system: "MULTIPHASE", note: "Hard antimony-tin intermetallic crystals are dispersed through a soft lead matrix, letting the bearing surface wear in smoothly against a shaft." };
MOLECULE_STRUCTURES.KBR = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"K",x:-0.8,y:0,charge:"+"},{el:"Br",x:0.8,y:0,charge:"–"}],
    bonds2d: [[0,1,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a (ionic bonds aren't directional)", hybridization:"n/a", polarity:"n/a (ionic, not a covalent dipole)", coordinationNumber:"6",
      notes:"Drawn here as an ion pair for simplicity — swipe to Crystal Lattice to see the real repeating structure." } },
  { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
    info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
      notes:"Same rock-salt arrangement as table salt — each K⁺ surrounded by 6 Br⁻ and vice versa, extending indefinitely." } },
  { type: "condensed", name: "Condensed Formula", formula:"KBr",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"The simplest whole-number ratio of ions (1:1), called a formula unit rather than a molecule." } },
];

MOLECULE_STRUCTURES.KI = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"K",x:-0.8,y:0,charge:"+"},{el:"I",x:0.8,y:0,charge:"–"}],
    bonds2d: [[0,1,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a (ionic bonds aren't directional)", hybridization:"n/a", polarity:"n/a (ionic, not a covalent dipole)", coordinationNumber:"6",
      notes:"Drawn here as an ion pair for simplicity — swipe to Crystal Lattice to see the real repeating structure." } },
  { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
    info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
      notes:"Each K⁺ is surrounded by 6 I⁻ and each I⁻ by 6 K⁺, the same pattern as ordinary table salt." } },
  { type: "condensed", name: "Condensed Formula", formula:"KI",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"The simplest whole-number ratio of ions (1:1), called a formula unit rather than a molecule." } },
];

MOLECULE_STRUCTURES.NIO = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Ni",x:-0.8,y:0,charge:"2+"},{el:"O",x:0.8,y:0,charge:"2–"}],
    bonds2d: [[0,1,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"Drawn here as an ion pair for simplicity — swipe to Crystal Lattice to see the real repeating structure." } },
  { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
    info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
      notes:"NiO adopts the same rock-salt structure as NaCl, with Ni²⁺ and O²⁻ each surrounded by 6 opposite ions." } },
  { type: "condensed", name: "Condensed Formula", formula:"NiO",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"The simplest whole-number ratio of ions (1:1), called a formula unit rather than a molecule." } },
];

MOLECULE_STRUCTURES.NAF = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Na",x:-0.8,y:0,charge:"+"},{el:"F",x:0.8,y:0,charge:"–"}],
    bonds2d: [[0,1,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"Drawn here as an ion pair for simplicity — swipe to Crystal Lattice to see the real repeating structure." } },
  { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
    info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
      notes:"The same rock-salt structure as NaCl, just with fluoride instead of chloride." } },
  { type: "condensed", name: "Condensed Formula", formula:"NaF",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"The simplest whole-number ratio of ions (1:1), called a formula unit rather than a molecule." } },
];

MOLECULE_STRUCTURES.NABR = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Na",x:-0.8,y:0,charge:"+"},{el:"Br",x:0.8,y:0,charge:"–"}],
    bonds2d: [[0,1,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"Drawn here as an ion pair for simplicity — swipe to Crystal Lattice to see the real repeating structure." } },
  { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
    info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
      notes:"The same rock-salt structure as NaCl, just with bromide instead of chloride." } },
  { type: "condensed", name: "Condensed Formula", formula:"NaBr",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"The simplest whole-number ratio of ions (1:1), called a formula unit rather than a molecule." } },
];

MOLECULE_STRUCTURES.NAI = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Na",x:-0.8,y:0,charge:"+"},{el:"I",x:0.8,y:0,charge:"–"}],
    bonds2d: [[0,1,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"Drawn here as an ion pair for simplicity — swipe to Crystal Lattice to see the real repeating structure." } },
  { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
    info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
      notes:"The same rock-salt structure as NaCl, just with iodide instead of chloride." } },
  { type: "condensed", name: "Condensed Formula", formula:"NaI",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"The simplest whole-number ratio of ions (1:1), called a formula unit rather than a molecule." } },
];

MOLECULE_STRUCTURES.CDO = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Cd",x:-0.8,y:0,charge:"2+"},{el:"O",x:0.8,y:0,charge:"2–"}],
    bonds2d: [[0,1,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"Drawn here as an ion pair for simplicity — swipe to Crystal Lattice to see the real repeating structure." } },
  { type: "structural", name: "Crystal Lattice", crystalSystem:"ROCKSALT",
    info: { structureType:"Ionic crystal", bondType:"Ionic", molecularGeometry:"Rock salt (cubic)", bondAngles:"90°, 90°, 90°", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:6",
      notes:"CdO adopts the same rock-salt structure as NaCl, with Cd²⁺ and O²⁻ each surrounded by 6 opposite ions." } },
  { type: "condensed", name: "Condensed Formula", formula:"CdO",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"The simplest whole-number ratio of ions (1:1), called a formula unit rather than a molecule." } },
];
MOLECULE_STRUCTURES.CAF2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"F",x:-1.1,y:0,charge:"–"},{el:"Ca",x:0,y:0,charge:"2+"},{el:"F",x:1.1,y:0,charge:"–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a (ionic bonds aren't directional)", hybridization:"n/a", polarity:"n/a", coordinationNumber:"8 (Ca²⁺), 4 (F⁻)",
      notes:"Real CaF2 forms the fluorite structure, not rock salt — each Ca²⁺ is surrounded by 8 F⁻ ions, and each F⁻ by 4 Ca²⁺, reflecting the 1:2 ratio." } },
  { type: "condensed", name: "Condensed Formula", formula:"CaF₂",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"8:4",
      notes:"Two fluoride ions balance the 2+ charge on each calcium ion." } },
];

MOLECULE_STRUCTURES.MGF2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"F",x:-1.1,y:0,charge:"–"},{el:"Mg",x:0,y:0,charge:"2+"},{el:"F",x:1.1,y:0,charge:"–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Mg²⁺), 3 (F⁻)",
      notes:"Real MgF2 adopts the rutile structure (the same arrangement as TiO2), with each Mg²⁺ surrounded by 6 F⁻." } },
  { type: "condensed", name: "Condensed Formula", formula:"MgF₂",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:3",
      notes:"Two fluoride ions balance the 2+ charge on each magnesium ion." } },
];

MOLECULE_STRUCTURES.ALF3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"F",x:0,y:1.1,charge:"–"},{el:"Al",x:0,y:0,charge:"3+"},{el:"F",x:-0.95,y:-0.55,charge:"–"},{el:"F",x:0.95,y:-0.55,charge:"–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"],[1,3,1,"ionic"]],
    info: { structureType:"Ionic/network compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Al³⁺)",
      notes:"In the solid, each Al³⁺ is actually surrounded by 6 F⁻ in a corner-sharing octahedral network, rather than existing as separate AlF3 units." } },
  { type: "condensed", name: "Condensed Formula", formula:"AlF₃",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6",
      notes:"Three fluoride ions balance the 3+ charge on each aluminium ion." } },
];

MOLECULE_STRUCTURES.FECL2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Cl",x:-1.1,y:0,charge:"–"},{el:"Fe",x:0,y:0,charge:"2+"},{el:"Cl",x:1.1,y:0,charge:"–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Fe²⁺), 3 (Cl⁻)",
      notes:"Real FeCl2 forms a layered CdCl2-type structure, with sheets of edge-sharing FeCl6 octahedra stacked on top of each other." } },
  { type: "condensed", name: "Condensed Formula", formula:"FeCl₂",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:3",
      notes:"Two chloride ions balance the 2+ charge on each iron(II) ion." } },
];

MOLECULE_STRUCTURES.MNO2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"O",x:-1.1,y:0,charge:"2–"},{el:"Mn",x:0,y:0,charge:"4+"},{el:"O",x:1.1,y:0,charge:"2–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic (with covalent character)", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Mn⁴⁺), 3 (O²⁻)",
      notes:"Real MnO2 adopts the rutile structure, the active material inside ordinary alkaline batteries." } },
  { type: "condensed", name: "Condensed Formula", formula:"MnO₂",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:3",
      notes:"Two oxide ions balance the 4+ charge on each manganese ion." } },
];

MOLECULE_STRUCTURES.CACL2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Cl",x:-1.1,y:0,charge:"–"},{el:"Ca",x:0,y:0,charge:"2+"},{el:"Cl",x:1.1,y:0,charge:"–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6–8 (Ca²⁺)",
      notes:"Real CaCl2 forms a distorted rutile-type structure, distinct from the simple cubic rock-salt arrangement of NaCl." } },
  { type: "condensed", name: "Condensed Formula", formula:"CaCl₂",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6–8",
      notes:"Two chloride ions balance the 2+ charge on each calcium ion." } },
];

MOLECULE_STRUCTURES.MGBR2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Br",x:-1.1,y:0,charge:"–"},{el:"Mg",x:0,y:0,charge:"2+"},{el:"Br",x:1.1,y:0,charge:"–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6 (Mg²⁺), 3 (Br⁻)",
      notes:"Real MgBr2 forms a layered CdI2-type structure, similar in spirit to FeCl2's layered arrangement." } },
  { type: "condensed", name: "Condensed Formula", formula:"MgBr₂",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"6:3",
      notes:"Two bromide ions balance the 2+ charge on each magnesium ion." } },
];

MOLECULE_STRUCTURES.ZNCL2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Cl",x:-1.1,y:0,charge:"–"},{el:"Zn",x:0,y:0,charge:"2+"},{el:"Cl",x:1.1,y:0,charge:"–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"]],
    info: { structureType:"Ionic/covalent compound", bondType:"Ionic (with significant covalent character)", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"4 (Zn²⁺, tetrahedral in most polymorphs)",
      notes:"ZnCl2 has several different solid forms; most feature zinc in a tetrahedral coordination rather than the octahedral environment typical of many ionic salts." } },
  { type: "condensed", name: "Condensed Formula", formula:"ZnCl₂",
    info: { structureType:"Condensed formula", bondType:"Ionic/covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"4",
      notes:"Two chloride ions balance the 2+ charge on each zinc ion." } },
];

MOLECULE_STRUCTURES.PBCL2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Cl",x:-1.1,y:0,charge:"–"},{el:"Pb",x:0,y:0,charge:"2+"},{el:"Cl",x:1.1,y:0,charge:"–"}],
    bonds2d: [[1,0,1,"ionic"],[1,2,1,"ionic"]],
    info: { structureType:"Ionic compound", bondType:"Ionic", molecularGeometry:"n/a — not a discrete molecule", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"9 (Pb²⁺)",
      notes:"Real PbCl2 adopts the cotunnite structure, an unusually high 9-coordinate arrangement for the lead ion." } },
  { type: "condensed", name: "Condensed Formula", formula:"PbCl₂",
    info: { structureType:"Condensed formula", bondType:"Ionic", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"n/a", coordinationNumber:"9",
      notes:"Two chloride ions balance the 2+ charge on each lead(II) ion." } },
];
MOLECULE_STRUCTURES.HBR = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"H",x:-0.7,y:0},{el:"Br",x:0.7,y:0}], bonds2d: [[0,1,1,"plain"]],
    info: { structureType:"Diatomic molecule", bondType:"Polar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"s (H), p (Br)", polarity:"Polar", coordinationNumber:"1",
      notes:"A strong acid in water; the H-Br bond is polar due to bromine's higher electronegativity." } },
  { type: "condensed", name: "Condensed Formula", formula:"HBr",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"1", notes:"A single covalent bond between hydrogen and bromine." } },
];
MOLECULE_STRUCTURES.HI = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"H",x:-0.7,y:0},{el:"I",x:0.7,y:0}], bonds2d: [[0,1,1,"plain"]],
    info: { structureType:"Diatomic molecule", bondType:"Polar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"s (H), p (I)", polarity:"Polar (weakly, due to iodine's lower electronegativity)", coordinationNumber:"1",
      notes:"The strongest of the common hydrohalic acids in water, since the H-I bond is the weakest and breaks apart most readily." } },
  { type: "condensed", name: "Condensed Formula", formula:"HI",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"1", notes:"A single covalent bond between hydrogen and iodine." } },
];
MOLECULE_STRUCTURES.ICL = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"I",x:-0.8,y:0},{el:"Cl",x:0.8,y:0}], bonds2d: [[0,1,1,"plain"]],
    info: { structureType:"Interhalogen molecule", bondType:"Polar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"p (I), p (Cl)", polarity:"Polar", coordinationNumber:"1",
      notes:"A compound between two different halogens; acts as a milder, more selective source of 'positive iodine' than iodine itself." } },
  { type: "condensed", name: "Condensed Formula", formula:"ICl",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"1", notes:"A single covalent bond between two different halogen atoms." } },
];
MOLECULE_STRUCTURES.KRF2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"F",x:-1.3,y:0},{el:"Kr",x:0,y:0},{el:"F",x:1.3,y:0}], bonds2d: [[1,0,1,"plain"],[1,2,1,"plain"]],
    info: { structureType:"Noble-gas compound", bondType:"Covalent (3-center-4-electron bonding)", molecularGeometry:"Linear (AX2)", bondAngles:"180°", hybridization:"sp³d (Kr)", polarity:"Nonpolar", coordinationNumber:"2",
      notes:"One of only a handful of known krypton compounds — genuine proof that even 'inert' noble gases can bond under the right conditions." } },
  { type: "condensed", name: "Condensed Formula", formula:"KrF₂",
    info: { structureType:"Condensed formula", bondType:"Covalent", molecularGeometry:"Linear", bondAngles:"180°", hybridization:"n/a", polarity:"Nonpolar", coordinationNumber:"2", notes:"Two fluorine atoms bonded to a central krypton atom." } },
];
MOLECULE_STRUCTURES.HCLO = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"H",x:-0.9,y:0.6},{el:"O",x:0,y:0},{el:"Cl",x:1.1,y:-0.3}], bonds2d: [[0,1,1,"plain"],[1,2,1,"plain"]],
    info: { structureType:"Small molecule (oxoacid)", bondType:"Polar covalent", molecularGeometry:"Bent at oxygen", bondAngles:"~103°", hybridization:"sp³ (O)", polarity:"Polar", coordinationNumber:"2 (O)",
      notes:"The active disinfecting molecule in chlorinated pool water and bleach solutions — your own white blood cells make it too." } },
  { type: "condensed", name: "Condensed Formula", formula:"HClO",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Bent", bondAngles:"~103°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"2", notes:"Hydrogen and chlorine both bonded to a central oxygen." } },
];
MOLECULE_STRUCTURES.HBRO = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"H",x:-0.9,y:0.6},{el:"O",x:0,y:0},{el:"Br",x:1.2,y:-0.3}], bonds2d: [[0,1,1,"plain"],[1,2,1,"plain"]],
    info: { structureType:"Small molecule (oxoacid)", bondType:"Polar covalent", molecularGeometry:"Bent at oxygen", bondAngles:"~103°", hybridization:"sp³ (O)", polarity:"Polar", coordinationNumber:"2 (O)",
      notes:"A weak, unstable acid formed when bromine dissolves in water; used as a mild disinfectant and bleaching agent." } },
  { type: "condensed", name: "Condensed Formula", formula:"HBrO",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Bent", bondAngles:"~103°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"2", notes:"Hydrogen and bromine both bonded to a central oxygen." } },
];
MOLECULE_STRUCTURES.PF3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"P",x:0,y:0.2},{el:"F",x:0,y:1.3},{el:"F",x:-1.1,y:-0.5},{el:"F",x:1.1,y:-0.5}], bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal (AX3E)", bondAngles:"~97.8°", hybridization:"sp³ (P)", polarity:"Polar", coordinationNumber:"3",
      notes:"Highly toxic in a similar way to carbon monoxide, since it also binds strongly to blood hemoglobin." } },
  { type: "condensed", name: "Condensed Formula", formula:"PF₃",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal", bondAngles:"~97.8°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"3", notes:"Three fluorine atoms bonded to a central phosphorus, with one lone pair." } },
];
MOLECULE_STRUCTURES.PCL3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"P",x:0,y:0.2},{el:"Cl",x:0,y:1.4},{el:"Cl",x:-1.2,y:-0.5},{el:"Cl",x:1.2,y:-0.5}], bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal (AX3E)", bondAngles:"~100.3°", hybridization:"sp³ (P)", polarity:"Polar", coordinationNumber:"3",
      notes:"A key industrial intermediate used to manufacture pesticides and flame retardants." } },
  { type: "condensed", name: "Condensed Formula", formula:"PCl₃",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal", bondAngles:"~100.3°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"3", notes:"Three chlorine atoms bonded to a central phosphorus, with one lone pair." } },
];
MOLECULE_STRUCTURES.SBCL3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Sb",x:0,y:0.2},{el:"Cl",x:0,y:1.5},{el:"Cl",x:-1.3,y:-0.5},{el:"Cl",x:1.3,y:-0.5}], bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal (AX3E)", bondAngles:"~97.2°", hybridization:"sp³ (Sb)", polarity:"Polar", coordinationNumber:"3",
      notes:"A fuming solid used as a catalyst and as a starting material for other antimony compounds." } },
  { type: "condensed", name: "Condensed Formula", formula:"SbCl₃",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal", bondAngles:"~97.2°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"3", notes:"Three chlorine atoms bonded to a central antimony, with one lone pair." } },
];
MOLECULE_STRUCTURES.XEO3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Xe",x:0,y:0.2},{el:"O",x:0,y:1.4},{el:"O",x:-1.2,y:-0.5},{el:"O",x:1.2,y:-0.5}], bonds2d: [[0,1,2,"plain"],[0,2,2,"plain"],[0,3,2,"plain"]],
    info: { structureType:"Noble-gas oxide", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal (AX3E)", bondAngles:"~103°", hybridization:"sp³ (Xe)", polarity:"Polar", coordinationNumber:"3",
      notes:"A dangerously explosive solid — one of the few noble-gas compounds unstable enough to detonate." } },
  { type: "condensed", name: "Condensed Formula", formula:"XeO₃",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal", bondAngles:"~103°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"3", notes:"Three oxygen atoms bonded to a central xenon, with one lone pair." } },
];
MOLECULE_STRUCTURES.SIF4 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Si",x:0,y:0},{el:"F",x:0,y:1.3},{el:"F",x:0,y:-1.3},{el:"F",x:-1.2,y:0.4},{el:"F",x:1.2,y:-0.4}], bonds2d: [[0,1,1,"wedge"],[0,2,1,"dash"],[0,3,1,"plain"],[0,4,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Tetrahedral (AX4)", bondAngles:"109.5°", hybridization:"sp³ (Si)", polarity:"Nonpolar (symmetric)", coordinationNumber:"4",
      notes:"Released when hydrofluoric acid reacts with glass or sand; used industrially to make high-purity silicon." } },
  { type: "condensed", name: "Condensed Formula", formula:"SiF₄",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Tetrahedral", bondAngles:"109.5°", hybridization:"n/a", polarity:"Nonpolar", coordinationNumber:"4", notes:"Four fluorine atoms bonded symmetrically to a central silicon." } },
];
MOLECULE_STRUCTURES.CLF3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"F",x:-1.4,y:0},{el:"Cl",x:0,y:0},{el:"F",x:1.4,y:0},{el:"F",x:0,y:1.2}], bonds2d: [[1,0,1,"plain"],[1,2,1,"plain"],[1,3,1,"plain"]],
    info: { structureType:"Interhalogen molecule", bondType:"Polar covalent", molecularGeometry:"T-shaped (AX3E2)", bondAngles:"~87.5°", hybridization:"sp³d (Cl)", polarity:"Polar", coordinationNumber:"3",
      notes:"So reactive it can ignite sand, asbestos, and glass on contact; used to clean chemical vapor deposition chambers." } },
  { type: "condensed", name: "Condensed Formula", formula:"ClF₃",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"T-shaped", bondAngles:"~87.5°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"3", notes:"Three fluorine atoms bonded to a central chlorine, with two lone pairs." } },
];
MOLECULE_STRUCTURES.IF5 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"I",x:0,y:0},{el:"F",x:0,y:1.3},{el:"F",x:1.1,y:0.3},{el:"F",x:0.6,y:-1},{el:"F",x:-0.6,y:-1},{el:"F",x:-1.1,y:0.3}], bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"plain"],[0,4,1,"plain"],[0,5,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Square pyramidal (AX5E)", bondAngles:"~90° (F-I-F within base), ~81° to apex", hybridization:"sp³d² (I)", polarity:"Polar", coordinationNumber:"5",
      notes:"A powerful fluorinating agent used in organic synthesis to selectively introduce fluorine atoms." } },
  { type: "condensed", name: "Condensed Formula", formula:"IF₅",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Square pyramidal", bondAngles:"~90°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"5", notes:"Five fluorine atoms bonded to a central iodine, with one lone pair." } },
];
MOLECULE_STRUCTURES.PF5 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"P",x:0,y:0},{el:"F",x:0,y:1.3},{el:"F",x:0,y:-1.3},{el:"F",x:1.2,y:0.4},{el:"F",x:-0.6,y:1.0},{el:"F",x:-0.6,y:-1.0}], bonds2d: [[0,1,1,"wedge"],[0,2,1,"dash"],[0,3,1,"plain"],[0,4,1,"plain"],[0,5,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Trigonal bipyramidal (AX5)", bondAngles:"90° (axial-equatorial), 120° (equatorial-equatorial)", hybridization:"sp³d (P)", polarity:"Nonpolar (symmetric)", coordinationNumber:"5",
      notes:"A strong Lewis acid used as a catalyst and, notably, as a dopant to make conductive polymers." } },
  { type: "condensed", name: "Condensed Formula", formula:"PF₅",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal bipyramidal", bondAngles:"90°, 120°", hybridization:"n/a", polarity:"Nonpolar", coordinationNumber:"5", notes:"Five fluorine atoms bonded symmetrically to a central phosphorus." } },
];
MOLECULE_STRUCTURES.N2O4 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"N",x:-0.7,y:0},{el:"N",x:0.7,y:0},{el:"O",x:-1.3,y:1},{el:"O",x:-1.3,y:-1},{el:"O",x:1.3,y:1},{el:"O",x:1.3,y:-1}],
    bonds2d: [[0,1,1,"plain"],[0,2,2,"plain"],[0,3,2,"plain"],[1,4,2,"plain"],[1,5,2,"plain"]],
    info: { structureType:"Small molecule", bondType:"Covalent (weak N-N single bond)", molecularGeometry:"Planar, two trigonal-planar N centers", bondAngles:"~120° at each N", hybridization:"sp² (N)", polarity:"Nonpolar (symmetric overall)", coordinationNumber:"3 (each N)",
      notes:"Exists in equilibrium with reddish-brown NO2 gas — the balance between them shifts visibly with temperature, a classic chemistry demonstration." } },
  { type: "condensed", name: "Condensed Formula", formula:"N₂O₄",
    info: { structureType:"Condensed formula", bondType:"Covalent", molecularGeometry:"Planar", bondAngles:"~120°", hybridization:"n/a", polarity:"Nonpolar", coordinationNumber:"3", notes:"Two NO2 units joined by a single, unusually weak N-N bond." } },
];
MOLECULE_STRUCTURES.BCL3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"B",x:0,y:0},{el:"Cl",x:0,y:1.3},{el:"Cl",x:-1.15,y:-0.65},{el:"Cl",x:1.15,y:-0.65}], bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Trigonal planar (AX3)", bondAngles:"120°", hybridization:"sp² (B)", polarity:"Nonpolar (symmetric)", coordinationNumber:"3",
      notes:"A reactive gas that fumes in moist air; used as a catalyst and to make ultra-pure boron for semiconductors." } },
  { type: "condensed", name: "Condensed Formula", formula:"BCl₃",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal planar", bondAngles:"120°", hybridization:"n/a", polarity:"Nonpolar", coordinationNumber:"3", notes:"Three chlorine atoms bonded symmetrically to a central boron, with no lone pair." } },
];
MOLECULE_STRUCTURES.BBR3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"B",x:0,y:0},{el:"Br",x:0,y:1.4},{el:"Br",x:-1.25,y:-0.7},{el:"Br",x:1.25,y:-0.7}], bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Trigonal planar (AX3)", bondAngles:"120°", hybridization:"sp² (B)", polarity:"Nonpolar (symmetric)", coordinationNumber:"3",
      notes:"A fuming, corrosive liquid used in organic chemistry to cleave certain ether bonds." } },
  { type: "condensed", name: "Condensed Formula", formula:"BBr₃",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal planar", bondAngles:"120°", hybridization:"n/a", polarity:"Nonpolar", coordinationNumber:"3", notes:"Three bromine atoms bonded symmetrically to a central boron, with no lone pair." } },
];
MOLECULE_STRUCTURES.HIO3 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"I",x:0,y:0},{el:"O",x:0.8,y:0.9},{el:"O",x:0.8,y:-0.9},{el:"O",x:-1.2,y:0},{el:"H",x:-2.1,y:0.5}],
    bonds2d: [[0,1,2,"plain"],[0,2,2,"plain"],[0,3,1,"plain"],[3,4,1,"plain"]],
    info: { structureType:"Oxoacid", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal (AX3E, at I)", bondAngles:"~100°", hybridization:"sp³ (I)", polarity:"Polar", coordinationNumber:"3",
      notes:"A strong acid and oxidizer used in the classic 'iodine clock' chemistry demonstration." } },
  { type: "condensed", name: "Condensed Formula", formula:"HIO₃",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Trigonal pyramidal", bondAngles:"~100°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"3", notes:"Two double-bonded oxygens and one -OH group attached to a central iodine." } },
];
MOLECULE_STRUCTURES.SNCL2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"Sn",x:0,y:0},{el:"Cl",x:-1,y:-1},{el:"Cl",x:1,y:-1}], bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"]],
    info: { structureType:"Small molecule", bondType:"Polar covalent", molecularGeometry:"Bent (AX2E)", bondAngles:"~95°", hybridization:"sp² (Sn)", polarity:"Polar", coordinationNumber:"2",
      notes:"A common reducing agent in chemistry labs, and historically used to make the deep red pigment 'Purple of Cassius.'" } },
  { type: "condensed", name: "Condensed Formula", formula:"SnCl₂",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"Bent", bondAngles:"~95°", hybridization:"n/a", polarity:"Polar", coordinationNumber:"2", notes:"Two chlorine atoms bonded to tin, with a lone pair giving the molecule its bent shape." } },
];
MOLECULE_STRUCTURES.N2O5 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"N",x:-1,y:0},{el:"O",x:0,y:0.6},{el:"N",x:1,y:0},{el:"O",x:-1.7,y:0.8},{el:"O",x:-1.7,y:-0.8},{el:"O",x:1.7,y:0.8},{el:"O",x:1.7,y:-0.8}],
    bonds2d: [[0,1,1,"plain"],[1,2,1,"plain"],[0,3,2,"plain"],[0,4,1,"plain"],[2,5,2,"plain"],[2,6,1,"plain"]],
    info: { structureType:"Small molecule (acid anhydride)", bondType:"Covalent", molecularGeometry:"Trigonal planar at each N, bent at the bridging O", bondAngles:"~120° (N), ~112° (bridging O)", hybridization:"sp² (N), sp³ (bridging O)", polarity:"Polar overall (asymmetric)", coordinationNumber:"3 (each N)",
      notes:"The anhydride of nitric acid — two NO2 groups joined through a shared oxygen. A key nighttime reservoir molecule in atmospheric chemistry." } },
  { type: "condensed", name: "Condensed Formula", formula:"N₂O₅",
    info: { structureType:"Condensed formula", bondType:"Covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"3", notes:"Two nitro groups bridged by a single oxygen atom." } },
];

MOLECULE_STRUCTURES.CH3NH2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"H",x:-1.6,y:0.6},{el:"H",x:-1.6,y:-0.6},{el:"H",x:-0.8,y:1.3},{el:"C",x:-0.7,y:0},{el:"N",x:0.7,y:0},{el:"H",x:1.3,y:0.8},{el:"H",x:1.3,y:-0.8}],
    bonds2d: [[0,3,1,"plain"],[1,3,1,"plain"],[2,3,1,"plain"],[3,4,1,"plain"],[4,5,1,"plain"],[4,6,1,"plain"]],
    info: { structureType:"Organic molecule (amine)", bondType:"Polar covalent (C-N, N-H)", molecularGeometry:"Tetrahedral (C), trigonal pyramidal (N)", bondAngles:"109.5° (C), ~107° (N)", hybridization:"sp³ (C and N)", polarity:"Polar", coordinationNumber:"4 (C), 3 (N)",
      notes:"A fishy-smelling gas released by decaying organisms; also used to manufacture pesticides and pharmaceuticals." } },
  { type: "skeletal", name: "Skeletal Formula",
    atoms2d: [{el:"",x:-0.7,y:0,vertex:true},{el:"N",x:0.7,y:0,label:"NH₂"}],
    bonds2d: [[0,1,1,"plain"]],
    info: { structureType:"Skeletal formula", bondType:"Polar covalent", molecularGeometry:"n/a (simplified)", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a",
      notes:"Carbon and its attached hydrogens are implied by the vertex; only the amine group is labeled explicitly." } },
  { type: "condensed", name: "Condensed Formula", formula:"CH₃NH₂",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a", notes:"A methyl group attached to an amine group." } },
];

MOLECULE_STRUCTURES.C2H5NH2 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"C",x:-1.4,y:0},{el:"C",x:0,y:0.4},{el:"N",x:1.3,y:-0.2},{el:"H",x:1.9,y:0.5},{el:"H",x:1.9,y:-0.9}],
    bonds2d: [[0,1,1,"plain"],[1,2,1,"plain"],[2,3,1,"plain"],[2,4,1,"plain"]],
    info: { structureType:"Organic molecule (amine)", bondType:"Polar covalent", molecularGeometry:"Tetrahedral (C), trigonal pyramidal (N)", bondAngles:"109.5° (C), ~107° (N)", hybridization:"sp³ (C, N)", polarity:"Polar", coordinationNumber:"4 (C), 3 (N)",
      notes:"A building block in pharmaceutical and pesticide synthesis, with a strong ammonia-like odor." } },
  { type: "skeletal", name: "Skeletal Formula",
    atoms2d: [{el:"",x:-1.2,y:0,vertex:true},{el:"",x:0,y:0.5,vertex:true},{el:"N",x:1.2,y:0,label:"NH₂"}],
    bonds2d: [[0,1,1,"plain"],[1,2,1,"plain"]],
    info: { structureType:"Skeletal formula", bondType:"Polar covalent", molecularGeometry:"n/a (simplified)", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a",
      notes:"The two-carbon chain is implied by vertices and line ends; only the amine group is labeled." } },
  { type: "condensed", name: "Condensed Formula", formula:"C₂H₅NH₂",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a", notes:"An ethyl group attached to an amine group." } },
];

MOLECULE_STRUCTURES.CH3CN = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"H",x:-1.7,y:0.6},{el:"H",x:-1.7,y:-0.6},{el:"H",x:-0.9,y:1.3},{el:"C",x:-0.8,y:0},{el:"C",x:0.5,y:0},{el:"N",x:1.7,y:0}],
    bonds2d: [[0,3,1,"plain"],[1,3,1,"plain"],[2,3,1,"plain"],[3,4,1,"plain"],[4,5,3,"plain"]],
    info: { structureType:"Organic molecule (nitrile)", bondType:"Polar covalent (C≡N triple bond)", molecularGeometry:"Tetrahedral (CH3), linear (C≡N)", bondAngles:"109.5° (CH3), 180° (nitrile)", hybridization:"sp³ (CH3 carbon), sp (nitrile carbon)", polarity:"Polar", coordinationNumber:"4, 2",
      notes:"A common solvent in chemistry labs and HPLC analysis, prized for dissolving both polar and nonpolar compounds." } },
  { type: "skeletal", name: "Skeletal Formula",
    atoms2d: [{el:"",x:-0.7,y:0,vertex:true},{el:"",x:0.5,y:0,vertex:true},{el:"N",x:1.7,y:0}],
    bonds2d: [[0,1,1,"plain"],[1,2,3,"plain"]],
    info: { structureType:"Skeletal formula", bondType:"Polar covalent", molecularGeometry:"n/a (simplified)", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a",
      notes:"The methyl carbon is an implied vertex; the triple bond to nitrogen is drawn explicitly since it's the defining feature." } },
  { type: "condensed", name: "Condensed Formula", formula:"CH₃CN",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a", notes:"A methyl group attached to a nitrile (C≡N) group." } },
];

MOLECULE_STRUCTURES.GLYCINE = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"N",x:-1.6,y:0.4},{el:"H",x:-2.3,y:1},{el:"H",x:-2.3,y:-0.2},{el:"C",x:-0.5,y:0},{el:"H",x:-0.5,y:1.1},{el:"H",x:-0.5,y:-1.1},{el:"C",x:0.7,y:0.5},{el:"O",x:0.7,y:1.7},{el:"O",x:1.8,y:-0.1},{el:"H",x:2.6,y:0.5}],
    bonds2d: [[0,1,1,"plain"],[0,2,1,"plain"],[0,3,1,"plain"],[3,4,1,"plain"],[3,5,1,"plain"],[3,6,1,"plain"],[6,7,2,"plain"],[6,8,1,"plain"],[8,9,1,"plain"]],
    info: { structureType:"Organic molecule (amino acid)", bondType:"Polar covalent", molecularGeometry:"Tetrahedral (alpha C), trigonal planar (carboxyl C)", bondAngles:"109.5° / 120°", hybridization:"sp³ (alpha C), sp² (carboxyl C)", polarity:"Polar", coordinationNumber:"4 / 3",
      notes:"The simplest amino acid and the only one that isn't chiral; a building block of proteins throughout the body." } },
  { type: "skeletal", name: "Skeletal Formula",
    atoms2d: [{el:"N",x:-1.6,y:0.4,label:"H₂N"},{el:"",x:-0.5,y:0,vertex:true},{el:"",x:0.7,y:0.5,vertex:true},{el:"O",x:0.7,y:1.7,label:"O"},{el:"O",x:1.8,y:-0.1,label:"OH"}],
    bonds2d: [[0,1,1,"plain"],[1,2,1,"plain"],[2,3,2,"plain"],[2,4,1,"plain"]],
    info: { structureType:"Skeletal formula", bondType:"Polar covalent", molecularGeometry:"n/a (simplified)", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a",
      notes:"The central carbon is an implied vertex; the amine and carboxylic acid functional groups are labeled since they define the molecule's chemistry." } },
  { type: "condensed", name: "Condensed Formula", formula:"NH₂CH₂COOH",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a", notes:"An amine group and a carboxylic acid group both attached to a central carbon." } },
];

MOLECULE_STRUCTURES.PYRIDINE = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"N",x:0,y:1.2},{el:"C",x:1.04,y:0.6},{el:"C",x:1.04,y:-0.6},{el:"C",x:0,y:-1.2},{el:"C",x:-1.04,y:-0.6},{el:"C",x:-1.04,y:0.6}],
    bonds2d: [[0,1,1,"plain"],[1,2,2,"plain"],[2,3,1,"plain"],[3,4,2,"plain"],[4,5,1,"plain"],[5,0,2,"plain"]],
    info: { structureType:"Aromatic heterocycle", bondType:"Aromatic (delocalized pi system)", molecularGeometry:"Planar hexagonal ring", bondAngles:"~120°", hybridization:"sp² (all ring atoms)", polarity:"Polar (nitrogen's lone pair sits in-plane, not delocalized)", coordinationNumber:"2–3 (ring atoms)",
      notes:"A foul-smelling aromatic solvent; its ring structure appears throughout biology, including in vitamin B3 (niacin)." } },
  { type: "resonance", name: "Resonance Structures",
    variants: [
      { atoms2d: [{el:"N",x:0,y:1.2},{el:"C",x:1.04,y:0.6},{el:"C",x:1.04,y:-0.6},{el:"C",x:0,y:-1.2},{el:"C",x:-1.04,y:-0.6},{el:"C",x:-1.04,y:0.6}],
        bonds2d: [[0,1,1,"plain"],[1,2,2,"plain"],[2,3,1,"plain"],[3,4,2,"plain"],[4,5,1,"plain"],[5,0,2,"plain"]] },
      { atoms2d: [{el:"N",x:0,y:1.2},{el:"C",x:1.04,y:0.6},{el:"C",x:1.04,y:-0.6},{el:"C",x:0,y:-1.2},{el:"C",x:-1.04,y:-0.6},{el:"C",x:-1.04,y:0.6}],
        bonds2d: [[0,1,2,"plain"],[1,2,1,"plain"],[2,3,2,"plain"],[3,4,1,"plain"],[4,5,2,"plain"],[5,0,1,"plain"]] },
    ],
    info: { structureType:"Resonance structures", bondType:"Aromatic (delocalized pi system)", molecularGeometry:"Planar hexagonal ring", bondAngles:"~120°", hybridization:"sp²", polarity:"Polar", coordinationNumber:"2–3",
      notes:"Like benzene, the true structure is a blend of these two alternating-bond patterns, not either one alone — the pi electrons are spread evenly around the ring." } },
  { type: "condensed", name: "Condensed Formula", formula:"C₅H₅N",
    info: { structureType:"Condensed formula", bondType:"Aromatic", molecularGeometry:"Planar hexagonal ring", bondAngles:"~120°", hybridization:"sp²", polarity:"Polar", coordinationNumber:"n/a", notes:"A six-membered aromatic ring with one carbon replaced by nitrogen." } },
];

MOLECULE_STRUCTURES.C3H7OH = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"C",x:-2,y:0},{el:"C",x:-0.7,y:0.5},{el:"C",x:0.6,y:0},{el:"O",x:1.9,y:0.5},{el:"H",x:2.6,y:0}],
    bonds2d: [[0,1,1,"plain"],[1,2,1,"plain"],[2,3,1,"plain"],[3,4,1,"plain"]],
    info: { structureType:"Organic molecule (alcohol)", bondType:"Polar covalent (C-O, O-H)", molecularGeometry:"Tetrahedral at each carbon", bondAngles:"109.5°", hybridization:"sp³ (C, O)", polarity:"Polar", coordinationNumber:"4",
      notes:"A common solvent and rubbing-alcohol alternative, also used as a chemical feedstock for other propanol-based products." } },
  { type: "skeletal", name: "Skeletal Formula",
    atoms2d: [{el:"",x:-2,y:0,vertex:true},{el:"",x:-0.7,y:0.5,vertex:true},{el:"",x:0.6,y:0,vertex:true},{el:"O",x:1.9,y:0.5,label:"OH"}],
    bonds2d: [[0,1,1,"plain"],[1,2,1,"plain"],[2,3,1,"plain"]],
    info: { structureType:"Skeletal formula", bondType:"Polar covalent", molecularGeometry:"n/a (simplified)", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a",
      notes:"The three-carbon zigzag chain is implied by vertices; only the hydroxyl group is labeled." } },
  { type: "condensed", name: "Condensed Formula", formula:"CH₃CH₂CH₂OH",
    info: { structureType:"Condensed formula", bondType:"Polar covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"Polar", coordinationNumber:"n/a", notes:"A straight three-carbon chain ending in a hydroxyl group." } },
];

MOLECULE_STRUCTURES.C3H6 = [
  { type: "structural", name: "Structural Formula",
    atoms2d: [{el:"C",x:-1.4,y:0},{el:"C",x:0,y:0},{el:"C",x:1.2,y:0.6},{el:"H",x:-2,y:0.9},{el:"H",x:-2,y:-0.9},{el:"H",x:0.2,y:-1.1}],
    bonds2d: [[0,1,2,"plain"],[1,2,1,"plain"],[0,3,1,"plain"],[0,4,1,"plain"],[1,5,1,"plain"]],
    info: { structureType:"Organic molecule (alkene)", bondType:"Covalent (C=C double bond)", molecularGeometry:"Trigonal planar (double-bond carbons), tetrahedral (methyl)", bondAngles:"120° / 109.5°", hybridization:"sp² (C1, C2), sp³ (C3)", polarity:"Nonpolar", coordinationNumber:"3, 3, 4",
      notes:"The building block of polypropylene, one of the most widely produced plastics in the world." } },
  { type: "skeletal", name: "Skeletal Formula",
    atoms2d: [{el:"",x:-1.4,y:0,vertex:true},{el:"",x:0,y:0,vertex:true},{el:"",x:1.2,y:0.6,vertex:true}],
    bonds2d: [[0,1,2,"plain"],[1,2,1,"plain"]],
    info: { structureType:"Skeletal formula", bondType:"Covalent", molecularGeometry:"n/a (simplified)", bondAngles:"n/a", hybridization:"n/a", polarity:"Nonpolar", coordinationNumber:"n/a",
      notes:"All carbons and hydrogens are implied; only the double bond is drawn explicitly since it's the reactive site." } },
  { type: "condensed", name: "Condensed Formula", formula:"CH₂=CHCH₃",
    info: { structureType:"Condensed formula", bondType:"Covalent", molecularGeometry:"n/a", bondAngles:"n/a", hybridization:"n/a", polarity:"Nonpolar", coordinationNumber:"n/a", notes:"A three-carbon chain with a double bond between the first two carbons." } },
];
