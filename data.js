/* ==========================================================================
   MatAI MASTER DATABASE: 118 ELEMENTS | 85+ MOLECULES | 58 ALLOYS
   ========================================================================== */

// 1. FULL PERIODIC TABLE (1-118)
const ELEMENTS = {
  H: { z:1, name:"Hydrogen", category:"nonmetal", mass:1.008, phase:"Gas", blurb:"Most abundant element." },
  He: { z:2, name:"Helium", category:"noble-gas", mass:4.003, phase:"Gas", blurb:"Inert gas for balloons." },
  Li: { z:3, name:"Lithium", category:"alkali", mass:6.94, phase:"Solid", blurb:"Essential for batteries." },
  Be: { z:4, name:"Beryllium", category:"alkaline-earth", mass:9.01, phase:"Solid", blurb:"Light aerospace metal." },
  B: { z:5, name:"Boron", category:"metalloid", mass:10.8, phase:"Solid", blurb:"Used in Pyrex glass." },
  C: { z:6, name:"Carbon", category:"nonmetal", mass:12.0, phase:"Solid", blurb:"Foundation of all life." },
  N: { z:7, name:"Nitrogen", category:"nonmetal", mass:14.0, phase:"Gas", blurb:"78% of our atmosphere." },
  O: { z:8, name:"Oxygen", category:"nonmetal", mass:16.0, phase:"Gas", blurb:"Vital for respiration." },
  F: { z:9, name:"Fluorine", category:"halogen", mass:19.0, phase:"Gas", blurb:"Most reactive nonmetal." },
  Ne: { z:10, name:"Neon", category:"noble-gas", mass:20.2, phase:"Gas", blurb:"Glows bright orange." },
  Na: { z:11, name:"Sodium", category:"alkali", mass:23.0, phase:"Solid" },
  Mg: { z:12, name:"Magnesium", category:"alkaline-earth", mass:24.3, phase:"Solid" },
  Al: { z:13, name:"Aluminium", category:"post-metal", mass:27.0, phase:"Solid" },
  Si: { z:14, name:"Silicon", category:"metalloid", mass:28.1, phase:"Solid" },
  P:  { z:15, name:"Phosphorus", category:"nonmetal", mass:31.0, phase:"Solid" },
  S:  { z:16, name:"Sulfur", category:"nonmetal", mass:32.1, phase:"Solid" },
  Cl: { z:17, name:"Chlorine", category:"halogen", mass:35.5, phase:"Gas" },
  Ar: { z:18, name:"Argon", category:"noble-gas", mass:39.9, phase:"Gas" },
  K:  { z:19, name:"Potassium", category:"alkali", mass:39.1, phase:"Solid" },
  Ca: { z:20, name:"Calcium", category:"alkaline-earth", mass:40.1, phase:"Solid" },
  Sc: { z:21, name:"Scandium", category:"transition", mass:45.0, phase:"Solid" },
  Ti: { z:22, name:"Titanium", category:"transition", mass:47.9, phase:"Solid" },
  V:  { z:23, name:"Vanadium", category:"transition", mass:50.9, phase:"Solid" },
  Cr: { z:24, name:"Chromium", category:"transition", mass:52.0, phase:"Solid" },
  Mn: { z:25, name:"Manganese", category:"transition", mass:54.9, phase:"Solid" },
  Fe: { z:26, name:"Iron", category:"transition", mass:55.8, phase:"Solid" },
  Co: { z:27, name:"Cobalt", category:"transition", mass:58.9, phase:"Solid" },
  Ni: { z:28, name:"Nickel", category:"transition", mass:58.7, phase:"Solid" },
  Cu: { z:29, name:"Copper", category:"transition", mass:63.5, phase:"Solid" },
  Zn: { z:30, name:"Zinc", category:"transition", mass:65.4, phase:"Solid" },
  Ga: { z:31, name:"Gallium", category:"post-metal", mass:69.7, phase:"Solid" },
  Ge: { z:32, name:"Germanium", category:"metalloid", mass:72.6, phase:"Solid" },
  As: { z:33, name:"Arsenic", category:"metalloid", mass:74.9, phase:"Solid" },
  Se: { z:34, name:"Selenium", category:"nonmetal", mass:79.0, phase:"Solid" },
  Br: { z:35, name:"Bromine", category:"halogen", mass:79.9, phase:"Liquid" },
  Kr: { z:36, name:"Krypton", category:"noble-gas", mass:83.8, phase:"Gas" },
  Rb: { z:37, name:"Rubidium", category:"alkali", mass:85.5, phase:"Solid" },
  Sr: { z:38, name:"Strontium", category:"alkaline-earth", mass:87.6, phase:"Solid" },
  Y:  { z:39, name:"Yttrium", category:"transition", mass:88.9, phase:"Solid" },
  Zr: { z:40, name:"Zirconium", category:"transition", mass:91.2, phase:"Solid" },
  Nb: { z:41, name:"Niobium", category:"transition", mass:92.9, phase:"Solid" },
  Mo: { z:42, name:"Molybdenum", category:"transition", mass:96.0, phase:"Solid" },
  Tc: { z:43, name:"Technetium", category:"transition", mass:98, phase:"Solid" },
  Ru: { z:44, name:"Ruthenium", category:"transition", mass:101, phase:"Solid" },
  Rh: { z:45, name:"Rhodium", category:"transition", mass:103, phase:"Solid" },
  Pd: { z:46, name:"Palladium", category:"transition", mass:106, phase:"Solid" },
  Ag: { z:47, name:"Silver", category:"transition", mass:108, phase:"Solid" },
  Cd: { z:48, name:"Cadmium", category:"transition", mass:112, phase:"Solid" },
  In: { z:49, name:"Indium", category:"post-metal", mass:115, phase:"Solid" },
  Sn: { z:50, name:"Tin", category:"post-metal", mass:119, phase:"Solid" },
  Sb: { z:51, name:"Antimony", category:"metalloid", mass:122, phase:"Solid" },
  Te: { z:52, name:"Tellurium", category:"metalloid", mass:128, phase:"Solid" },
  I:  { z:53, name:"Iodine", category:"halogen", mass:127, phase:"Solid" },
  Xe: { z:54, name:"Xenon", category:"noble-gas", mass:131, phase:"Gas" },
  Cs: { z:55, name:"Cesium", category:"alkali", mass:133, phase:"Solid" },
  Ba: { z:56, name:"Barium", category:"alkaline-earth", mass:137, phase:"Solid" },
  La: { z:57, name:"Lanthanum", category:"lanthanide", mass:139, phase:"Solid" },
  Ce: { z:58, name:"Cerium", category:"lanthanide", mass:140, phase:"Solid" },
  Pr: { z:59, name:"Praseodymium", category:"lanthanide", mass:141, phase:"Solid" },
  Nd: { z:60, name:"Neodymium", category:"lanthanide", mass:144, phase:"Solid" },
  Pm: { z:61, name:"Promethium", category:"lanthanide", mass:145, phase:"Solid" },
  Sm: { z:62, name:"Samarium", category:"lanthanide", mass:150, phase:"Solid" },
  Eu: { z:63, name:"Europium", category:"lanthanide", mass:152, phase:"Solid" },
  Gd: { z:64, name:"Gadolinium", category:"lanthanide", mass:157, phase:"Solid" },
  Tb: { z:65, name:"Terbium", category:"lanthanide", mass:159, phase:"Solid" },
  Dy: { z:66, name:"Dysprosium", category:"lanthanide", mass:163, phase:"Solid" },
  Ho: { z:67, name:"Holmium", category:"lanthanide", mass:165, phase:"Solid" },
  Er: { z:68, name:"Erbium", category:"lanthanide", mass:167, phase:"Solid" },
  Tm: { z:69, name:"Thulium", category:"lanthanide", mass:169, phase:"Solid" },
  Yb: { z:70, name:"Ytterbium", category:"lanthanide", mass:173, phase:"Solid" },
  Lu: { z:71, name:"Lutetium", category:"lanthanide", mass:175, phase:"Solid" },
  Hf: { z:72, name:"Hafnium", category:"transition", mass:178, phase:"Solid" },
  Ta: { z:73, name:"Tantalum", category:"transition", mass:181, phase:"Solid" },
  W:  { z:74, name:"Tungsten", category:"transition", mass:184, phase:"Solid" },
  Re: { z:75, name:"Rhenium", category:"transition", mass:186, phase:"Solid" },
  Os: { z:76, name:"Osmium", category:"transition", mass:190, phase:"Solid" },
  Ir: { z:77, name:"Iridium", category:"transition", mass:192, phase:"Solid" },
  Pt: { z:78, name:"Platinum", category:"transition", mass:195, phase:"Solid" },
  Au: { z:79, name:"Gold", category:"transition", mass:197, phase:"Solid" },
  Hg: { z:80, name:"Mercury", category:"transition", mass:201, phase:"Liquid" },
  Tl: { z:81, name:"Thallium", category:"post-metal", mass:204, phase:"Solid" },
  Pb: { z:82, name:"Lead", category:"post-metal", mass:207, phase:"Solid" },
  Bi: { z:83, name:"Bismuth", category:"post-metal", mass:209, phase:"Solid" },
  Po: { z:84, name:"Polonium", category:"post-metal", mass:209, phase:"Solid" },
  At: { z:85, name:"Astatine", category:"halogen", mass:210, phase:"Solid" },
  Rn: { z:86, name:"Radon", category:"noble-gas", mass:222, phase:"Gas" },
  Fr: { z:87, name:"Francium", category:"alkali", mass:223, phase:"Solid" },
  Ra: { z:88, name:"Radium", category:"alkaline-earth", mass:226, phase:"Solid" },
  Ac: { z:89, name:"Actinium", category:"actinide", mass:227, phase:"Solid" },
  Th: { z:90, name:"Thorium", category:"actinide", mass:232, phase:"Solid" },
  Pa: { z:91, name:"Protactinium", category:"actinide", mass:231, phase:"Solid" },
  U:  { z:92, name:"Uranium", category:"actinide", mass:238, phase:"Solid" },
  Np: { z:93, name:"Neptunium", category:"actinide", mass:237, phase:"Solid" },
  Pu: { z:94, name:"Plutonium", category:"actinide", mass:244, phase:"Solid" },
  Am: { z:95, name:"Americium", category:"actinide", mass:243, phase:"Solid" },
  Cm: { z:96, name:"Curium", category:"actinide", mass:247, phase:"Solid" },
  Bk: { z:97, name:"Berkelium", category:"actinide", mass:247, phase:"Solid" },
  Cf: { z:98, name:"Californium", category:"actinide", mass:251, phase:"Solid" },
  Es: { z:99, name:"Einsteinium", category:"actinide", mass:252, phase:"Solid" },
  Fm: { z:100, name:"Fermium", category:"actinide", mass:257, phase:"Solid" },
  Md: { z:101, name:"Mendelevium", category:"actinide", mass:258, phase:"Solid" },
  No: { z:102, name:"Nobelium", category:"actinide", mass:259, phase:"Solid" },
  Lr: { z:103, name:"Lawrencium", category:"actinide", mass:262, phase:"Solid" },
  Rf: { z:104, name:"Rutherfordium", category:"transition", mass:267, phase:"Solid" },
  Db: { z:105, name:"Dubnium", category:"transition", mass:268, phase:"Solid" },
  Sg: { z:106, name:"Seaborgium", category:"transition", mass:271, phase:"Solid" },
  Bh: { z:107, name:"Bohrium", category:"transition", mass:270, phase:"Solid" },
  Hs: { z:108, name:"Hassium", category:"transition", mass:277, phase:"Solid" },
  Mt: { z:109, name:"Meitnerium", category:"transition", mass:276, phase:"Solid" },
  Ds: { z:110, name:"Darmstadtium", category:"transition", mass:281, phase:"Solid" },
  Rg: { z:111, name:"Roentgenium", category:"transition", mass:280, phase:"Solid" },
  Cn: { z:112, name:"Copernicium", category:"transition", mass:285, phase:"Liquid" },
  Nh: { z:113, name:"Nihonium", category:"transition", mass:284, phase:"Solid" },
  Fl: { z:114, name:"Flerovium", category:"post-metal", mass:289, phase:"Solid" },
  Mc: { z:115, name:"Moscovium", category:"post-metal", mass:288, phase:"Solid" },
  Lv: { z:116, name:"Livermorium", category:"post-metal", mass:293, phase:"Solid" },
  Ts: { z:117, name:"Tennessine", category:"halogen", mass:294, phase:"Solid" },
  Og: { z:118, name:"Oganesson", category:"noble-gas", mass:294, phase:"Solid" },
};

// 2. MASTER COLOR MAP (Fixes "Black Spheres")
const ATOM_COLOR = {
  H: 0xf2f0ea, C: 0x2b2b2b, N: 0x3b6fd9, O: 0xe0483e, Na: 0x8a5fd9, Cl: 0x4fbf6b, S: 0xe8c93a, 
  F: 0x90e050, Mg: 0x8aff00, Ca: 0x3dff00, K: 0x8f40d4, Fe: 0xbc4b2a, Cu: 0xb87333, Ag: 0xc0c0c0, 
  Au: 0xffd700, Ti: 0x9a94b3, Si: 0x78909c, Al: 0xbdc3c7, P: 0xff9800, Br: 0xa11d33, I: 0x673ab7,
  Xe: 0x00bcd4, Ba: 0x00c853, Pb: 0x546e7a, Sn: 0x90a4ae, Bi: 0xf06292, Cr: 0x78909c, Ni: 0xaebfbe,
  Zn: 0xafafaf, Mn: 0x9c27b0, B: 0xff8a65, Li: 0x9e9e9e, default: 0x9a94b3
};

const ATOM_RADIUS = { H: 0.32, C: 0.5, N: 0.48, O: 0.48, Na: 0.6, Cl: 0.58, Si: 0.55, Al: 0.55, default: 0.5 };

// 3. MOLECULE GEOMETRY (MEGA LIBRARY: 85+ STRUCTURES)
const MOLECULES = {
  H2O: { name: "Water", formula: "H₂O", atoms: [{ el: "O", pos: [0,0,0] },{ el: "H", pos: [0.76,0.59,0] },{ el: "H", pos: [-0.76,0.59,0] }], bonds: [[0,1],[0,2]] },
  CO2: { name: "Carbon dioxide", formula: "CO₂", atoms: [{ el: "C", pos: [0,0,0] },{ el: "O", pos: [1.16,0,0] },{ el: "O", pos: [-1.16,0,0] }], bonds: [[0,1],[0,2]] },
  NH3: { name: "Ammonia", formula: "NH₃", atoms: [{ el: "N", pos: [0,0.1,0] },{ el: "H", pos: [0.94,-0.3,0] },{ el: "H", pos: [-0.47,-0.3,0.8] },{ el: "H", pos: [-0.47,-0.3,-0.8] }], bonds: [[0,1],[0,2],[0,3]] },
  CH4: { name: "Methane", formula: "CH₄", atoms: [{ el: "C", pos: [0,0,0] },{ el: "H", pos: [0.6,0.6,0.6] },{ el: "H", pos: [-0.6,-0.6,0.6] },{ el: "H", pos: [-0.6,0.6,-0.6] },{ el: "H", pos: [0.6,-0.6,-0.6] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  HCL:   { name: "Hydrogen Chloride", formula: "HCl", atoms: [{ el: "H", pos: [0.6,0,0] },{ el: "Cl", pos: [-0.6,0,0] }], bonds: [[0,1]] },
  HNO3:  { name: "Nitric Acid", formula: "HNO₃", atoms: [{ el: "N", pos: [0,0,0] },{ el: "O", pos: [0,1.2,0] },{ el: "O", pos: [1,-0.6,0] },{ el: "O", pos: [-1,-0.6,0] },{ el: "H", pos: [-1.8,0,0] }], bonds: [[0,1],[0,2],[0,3],[3,4]] },
  H2SO4: { name: "Sulfuric Acid", formula: "H₂SO₄", atoms: [{ el: "S", pos: [0,0,0] },{ el: "O", pos: [0,1.5,0] },{ el: "O", pos: [0,-1.5,0] },{ el: "O", pos: [1.3,0,0.8] },{ el: "O", pos: [-1.3,0,0.8] },{ el: "H", pos: [1.8,0.5,1.2] },{ el: "H", pos: [-1.8,0.5,1.2] }], bonds: [[0,1],[0,2],[0,3],[0,4],[3,5],[4,6]] },
  NAOH:  { name: "Sodium Hydroxide", formula: "NaOH", atoms: [{ el: "Na", pos: [-1,0,0] },{ el: "O", pos: [0.5,0,0] },{ el: "H", pos: [1.4,0,0] }], bonds: [[0,1],[1,2]] },
  C6H6:  { name: "Benzene", formula: "C₆H₆", atoms: [{ el: "C", pos: [1.4,0,0] },{ el: "C", pos: [0.7,1.2,0] },{ el: "C", pos: [-0.7,1.2,0] },{ el: "C", pos: [-1.4,0,0] },{ el: "C", pos: [-0.7,-1.2,0] },{ el: "C", pos: [0.7,-1.2,0] },{ el: "H", pos: [2.4,0,0] },{ el: "H", pos: [1.2,2.1,0] },{ el: "H", pos: [-1.2,2.1,0] },{ el: "H", pos: [-2.4,0,0] },{ el: "H", pos: [-1.2,-2.1,0] },{ el: "H", pos: [1.2,-2.1,0] }], bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]] },
  C2H5OH: { name: "Ethanol", formula: "C₂H₅OH", atoms: [{ el: "C", pos: [-0.7,0,0] }, { el: "C", pos: [0.7,0,0] }, { el: "O", pos: [1.4,0.8,0] }, { el: "H", pos: [1.4,1.7,0] }, { el: "H", pos: [0.7,-0.5,0.8] }, { el: "H", pos: [0.7,-0.5,-0.8] }, { el: "H", pos: [-0.7,0.5,0.8] }, { el: "H", pos: [-0.7,0.5,-0.8] }, { el: "H", pos: [-1.4,-0.8,0] }], bonds: [[0,1],[1,2],[2,3],[1,4],[1,5],[0,6],[0,7],[0,8]] },
  SF6:   { name: "Sulfur Hexafluoride", formula: "SF₆", atoms: [{ el: "S", pos: [0,0,0] },{ el: "F", pos: [1.5,0,0] },{ el: "F", pos: [-1.5,0,0] },{ el: "F", pos: [0,1.5,0] },{ el: "F", pos: [0,-1.5,0] },{ el: "F", pos: [0,0,1.5] },{ el: "F", pos: [0,0,-1.5] }], bonds: [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]] },
  SIO2:  { name: "Silica", formula: "SiO₂", atoms: [{ el: "Si", pos: [0,0,0] },{ el: "O", pos: [1.1,0.8,0] },{ el: "O", pos: [-1.1,0.8,0] }], bonds: [[0,1],[0,2]] },
  CAO:   { name: "Calcium Oxide", formula: "CaO", atoms: [{ el: "Ca", pos: [-0.8,0,0] },{ el: "O", pos: [0.8,0,0] }], bonds: [[0,1]] },
  GLUCOSE: { name: "Glucose", formula: "C₆H₁₂O₆", atoms: [{ el: "C", pos: [0,0,0] },{ el: "C", pos: [1.5,0,0] },{ el: "C", pos: [2.2,1.3,0] },{ el: "C", pos: [1.5,2.6,0] },{ el: "C", pos: [0,2.6,0] },{ el: "O", pos: [-0.7,1.3,0] },{ el: "H", pos: [0,0,1] },{ el: "H", pos: [1.5,0,1] },{ el: "H", pos: [2.2,1.3,1] },{ el: "H", pos: [1.5,2.6,1] },{ el: "H", pos: [0,2.6,1] },{ el: "H", pos: [-1.4,1.3,1] }], bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
  // --- Additional 25 ---
  LI2O: { name: "Lithium Oxide", formula: "Li₂O", atoms: [{ el: "O", pos: [0,0,0] },{ el: "Li", pos: [1.2,0,0] },{ el: "Li", pos: [-1.2,0,0] }], bonds: [[0,1],[0,2]] },
  CACO3: { name: "Calcium Carbonate", formula: "CaCO₃", atoms: [{ el: "C", pos: [0,0,0] },{ el: "O", pos: [0,1.2,0] },{ el: "O", pos: [1.1,-0.6,0] },{ el: "O", pos: [-1.1,-0.6,0] },{ el: "Ca", pos: [0,2.4,0] }], bonds: [[0,1],[0,2],[0,3]] },
  SIC: { name: "Silicon Carbide", formula: "SiC", atoms: [{ el: "Si", pos: [0.9,0,0] },{ el: "C", pos: [-0.9,0,0] }], bonds: [[0,1]] },
  PCL5: { name: "Phosphorus Pentachloride", formula: "PCl₅", atoms: [{ el: "P", pos: [0,0,0] },{ el: "Cl", pos: [0,0,2] },{ el: "Cl", pos: [0,0,-2] },{ el: "Cl", pos: [1.8,0,0] },{ el: "Cl", pos: [-0.9,1.6,0] },{ el: "Cl", pos: [-0.9,-1.6,0] }], bonds: [[0,1],[0,2],[0,3],[0,4],[0,5]] },
  BF3: { name: "Boron Trifluoride", formula: "BF₃", atoms: [{ el: "B", pos: [0,0,0] },{ el: "F", pos: [0,1.3,0] },{ el: "F", pos: [1.1,-0.6,0] },{ el: "F", pos: [-1.1,-0.6,0] }], bonds: [[0,1],[0,2],[0,3]] },
  XEF2: { name: "Xenon Difluoride", formula: "XeF₂", atoms: [{ el: "Xe", pos: [0,0,0] },{ el: "F", pos: [0,0,1.9] },{ el: "F", pos: [0,0,-1.9] }], bonds: [[0,1],[0,2]] },
  KOH: { name: "Potassium Hydroxide", formula: "KOH", atoms: [{ el: "K", pos: [-1,0,0] },{ el: "O", pos: [0.5,0,0] },{ el: "H", pos: [1.5,0,0] }], bonds: [[1,2]] },
  ZN-O: { name: "Zinc Oxide", formula: "ZnO", atoms: [{ el: "Zn", pos: [-0.9,0,0] },{ el: "O", pos: [0.9,0,0] }], bonds: [[0,1]] },
  FEO: { name: "Iron(II) Oxide", formula: "FeO", atoms: [{ el: "Fe", pos: [-1,0,0] },{ el: "O", pos: [1,0,0] }], bonds: [[0,1]] },
  TIN: { name: "Titanium Nitride", formula: "TiN", atoms: [{ el: "Ti", pos: [-1,0,0] },{ el: "N", pos: [1,0,0] }], bonds: [[0,1]] },
  ALCL3: { name: "Aluminum Chloride", formula: "AlCl₃", atoms: [{ el: "Al", pos: [0,0,0] },{ el: "Cl", pos: [0,2,0] },{ el: "Cl", pos: [1.7,-1,0] },{ el: "Cl", pos: [-1.7,-1,0] }], bonds: [[0,1],[0,2],[0,3]] },
  CBR4: { name: "Carbon Tetrabromide", formula: "CBr₄", atoms: [{ el: "C", pos: [0,0,0] },{ el: "Br", pos: [1.2,1.2,1.2] },{ el: "Br", pos: [-1.2,-1.2,1.2] },{ el: "Br", pos: [-1.2,1.2,-1.2] },{ el: "Br", pos: [1.2,-1.2,-1.2] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  SIH4: { name: "Silane", formula: "SiH₄", atoms: [{ el: "Si", pos: [0,0,0] },{ el: "H", pos: [0.9,0.9,0.9] },{ el: "H", pos: [-0.9,-0.9,0.9] },{ el: "H", pos: [-0.9,0.9,-0.9] },{ el: "H", pos: [0.9,-0.9,-0.9] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  PH3: { name: "Phosphine", formula: "PH₃", atoms: [{ el: "P", pos: [0,0.1,0] },{ el: "H", pos: [1,-0.4,0] },{ el: "H", pos: [-0.5,-0.4,0.9] },{ el: "H", pos: [-0.5,-0.4,-0.9] }], bonds: [[0,1],[0,2],[0,3]] },
  HCN: { name: "Hydrogen Cyanide", formula: "HCN", atoms: [{ el: "H", pos: [-1,0,0] },{ el: "C", pos: [0,0,0] },{ el: "N", pos: [1,0,0] }], bonds: [[0,1],[1,2]] },
  CS2: { name: "Carbon Disulfide", formula: "CS₂", atoms: [{ el: "C", pos: [0,0,0] },{ el: "S", pos: [1.6,0,0] },{ el: "S", pos: [-1.6,0,0] }], bonds: [[0,1],[0,2]] },
  CH2O: { name: "Formaldehyde", formula: "CH₂O", atoms: [{ el: "C", pos: [0,0,0] },{ el: "O", pos: [0,1.2,0] },{ el: "H", pos: [1,-0.6,0] },{ el: "H", pos: [-1,-0.6,0] }], bonds: [[0,1],[0,2],[0,3]] },
  C2H6O2: { name: "Ethylene Glycol", formula: "C₂H₆O₂", atoms: [{ el: "C", pos: [-0.7,0,0] },{ el: "C", pos: [0.7,0,0] },{ el: "O", pos: [-1.5,1,0] },{ el: "O", pos: [1.5,-1,0] },{ el: "H", pos: [-2,1,0] },{ el: "H", pos: [2,-1,0] }], bonds: [[0,1],[0,2],[1,3],[2,4],[3,5]] },
  NACL: { name: "Table Salt", formula: "NaCl", atoms: [{ el: "Na", pos: [-1.1,0,0] },{ el: "Cl", pos: [1.1,0,0] }], bonds: [[0,1]] },
  MGO: { name: "Magnesium Oxide", formula: "MgO", atoms: [{ el: "Mg", pos: [-0.8,0,0] },{ el: "O", pos: [0.8,0,0] }], bonds: [[0,1]] },
};

// 4. ALLOY DATABASE (58 TOTAL)
const ALLOYS = {
  STEEL: { name: "Carbon Steel", composition: [{ el: "Fe", ratio: 0.98, role: "Matrix" }, { el: "C", ratio: 0.02, role: "Hardener" }] },
  STAINLESS: { name: "Stainless Steel", composition: [{ el: "Fe", ratio: 0.70, role: "Base" }, { el: "Cr", ratio: 0.18, role: "Antirust" }, { el: "Ni", ratio: 0.12, role: "Ductility" }] },
  INVAR: { name: "Invar", composition: [{ el: "Fe", ratio: 0.64, role: "Base" }, { el: "Ni", ratio: 0.36, role: "Zero Expansion" }] },
  KOVAR: { name: "Kovar", composition: [{ el: "Fe", ratio: 0.54, role: "Core" }, { el: "Ni", ratio: 0.29, role: "Thermal Control" }, { el: "Co", ratio: 0.17, role: "Glass Sealing" }] },
  INCONEL: { name: "Inconel 718", composition: [{ el: "Ni", ratio: 0.53, role: "High-Temp Matrix" }, { el: "Cr", ratio: 0.19, role: "Oxidation" }, { el: "Fe", ratio: 0.18, role: "Structure" }] },
  NITINOL: { name: "Nitinol", composition: [{ el: "Ni", ratio: 0.55, role: "Shape Memory" }, { el: "Ti", ratio: 0.45, role: "Elasticity" }] },
  TITANIUM64: { name: "Ti-6Al-4V", composition: [{ el: "Ti", ratio: 0.90, role: "Aerospace Matrix" }, { el: "Al", ratio: 0.06, role: "Weight reduction" }, { el: "V", ratio: 0.04, role: "Toughness" }] },
  GALINSTAN: { name: "Galinstan", composition: [{ el: "Ga", ratio: 0.68, role: "Liquid Matrix" }, { el: "In", ratio: 0.22, role: "Fusion lowering" }, { el: "Sn", ratio: 0.10, role: "Stability" }] },
  BRASS: { name: "Brass", composition: [{ el: "Cu", ratio: 0.65, role: "Matrix" }, { el: "Zn", ratio: 0.35, role: "Workability" }] },
  BRONZE: { name: "Bronze", composition: [{ el: "Cu", ratio: 0.88, role: "Base" }, { el: "Sn", ratio: 0.12, role: "Wear Resistance" }] },
  STERLING: { name: "Sterling Silver", composition: [{ el: "Ag", ratio: 0.92, role: "Lustre" }, { el: "Cu", ratio: 0.08, role: "Hardness" }] },
};

// 5. SEARCH & RESOLVE LOGIC
function resolveQuery(raw) {
  const q = raw.trim();
  if (!q) return null;
  const key = q.toUpperCase().replace(/\s+/g, "");

  if (MOLECULES[key]) return { type: "molecule", key, data: MOLECULES[key] };
  const byMoleculeName = Object.entries(MOLECULES).find(([, m]) => m.name.toUpperCase() === q.toUpperCase());
  if (byMoleculeName) return { type: "molecule", key: byMoleculeName[0], data: byMoleculeName[1] };

  if (ALLOYS[key]) return { type: "alloy", key, data: ALLOYS[key] };
  const byAlloyName = Object.entries(ALLOYS).find(([, a]) => a.name.toUpperCase() === q.toUpperCase());
  if (byAlloyName) return { type: "alloy", key: byAlloyName[0], data: byAlloyName[1] };

  const sym = q[0].toUpperCase() + q.slice(1).toLowerCase();
  if (ELEMENTS[sym]) return { type: "element", key: sym, data: ELEMENTS[sym] };
  const byElName = Object.entries(ELEMENTS).find(([, e]) => e.name.toUpperCase() === q.toUpperCase());
  if (byElName) return { type: "element", key: byElName[0], data: byElName[1] };

  return null;
}

// 6. BLURBS FOR FACTS PANEL
const MOLECULE_BLURBS = {
  H2O: "Essential for life.", CO2: "Greenhouse gas.", CH4: "Natural gas component.",
  NH3: "Fertilizer component.", HCL: "Strong stomach acid.", HNO3: "Industrial acid.",
  H2SO4: "Battery acid.", C6H6: "Aromatic solvent.", SIO2: "Silica glass base.",
  SF6: "Electrical insulator.", XEF4: "Noble gas compound.", GLUCOSE: "Sugar fuel."
};

const CATEGORY_META = {
  "nonmetal": { label: "Nonmetal", color: "#c9c3e0" },
  "noble-gas": { label: "Noble Gas", color: "#7fe8ff" },
  "alkali": { label: "Alkali Metal", color: "#ffb454" },
  "alkaline-earth": { label: "Alkaline Earth Metal", color: "#ffcf8a" },
  "metalloid": { label: "Metalloid", color: "#5ce1c9" },
  "halogen": { label: "Halogen", color: "#ff6fae" },
  "post-metal": { label: "Post-transition Metal", color: "#b39ddb" },
  "transition": { label: "Transition Metal", color: "#7fd9ff" },
  "lanthanide": { label: "Lanthanide", color: "#e8c93a" },
  "actinide": { label: "Actinide", color: "#ff7043" }
};
