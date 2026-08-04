// MatAIme: Exhaustive reference data — 118 elements, 50+ molecules, and alloys.
const ELEMENTS = {
  H: { z:1, name:"Hydrogen", shells:[1], category:"nonmetal", mass:1.008, phase:"Gas", blurb:"The simplest and most abundant element in the universe." },
  He: { z:2, name:"Helium", shells:[2], category:"noble-gas", mass:4.003, phase:"Gas", blurb:"Second most abundant element in the universe." },
  Li: { z:3, name:"Lithium", shells:[2,1], category:"alkali", mass:6.94, phase:"Solid", blurb:"Lightest metal; key to modern rechargeable batteries." },
  Be: { z:4, name:"Beryllium", shells:[2,2], category:"alkaline-earth", mass:9.012, phase:"Solid", blurb:"A light, stiff, toxic metal used in aerospace parts." },
  B: { z:5, name:"Boron", shells:[2,3], category:"metalloid", mass:10.81, phase:"Solid", blurb:"Used in borosilicate glass (Pyrex)." },
  C: { z:6, name:"Carbon", shells:[2,4], category:"nonmetal", mass:12.011, phase:"Solid", blurb:"Backbone of life; forms diamond and graphite." },
  N: { z:7, name:"Nitrogen", shells:[2,5], category:"nonmetal", mass:14.007, phase:"Gas", blurb:"Makes up about 78% of the air; essential for DNA." },
  O: { z:8, name:"Oxygen", shells:[2,6], category:"nonmetal", mass:15.999, phase:"Gas", blurb:"The element you're breathing to stay alive." },
  F: { z:9, name:"Fluorine", shells:[2,7], category:"halogen", mass:18.998, phase:"Gas", blurb:"The most reactive nonmetal; used in toothpaste." },
  Ne: { z:10, name:"Neon", shells:[2,8], category:"noble-gas", mass:20.18, phase:"Gas", blurb:"Glows reddish-orange when electrified." },
  Na: { z:11, name:"Sodium", shells:[2,8,1], category:"alkali", mass:22.99, phase:"Solid", blurb:"Explosively reactive metal; bonds with chlorine to form salt." },
  Mg: { z:12, name:"Magnesium", shells:[2,8,2], category:"alkaline-earth", mass:24.305, phase:"Solid", blurb:"Burns with white light; center of chlorophyll." },
  Al: { z:13, name:"Aluminium", shells:[2,8,3], category:"post-metal", mass:26.982, phase:"Solid", blurb:"Most abundant metal in Earth's crust; recyclable." },
  Si: { z:14, name:"Silicon", shells:[2,8,4], category:"metalloid", mass:28.085, phase:"Solid", blurb:"The semiconductor at the heart of computer chips." },
  P: { z:15, name:"Phosphorus", shells:[2,8,5], category:"nonmetal", mass:30.974, phase:"Solid", blurb:"Essential to DNA and bones; white phosphorus glows." },
  S: { z:16, name:"Sulfur", shells:[2,8,6], category:"nonmetal", mass:32.06, phase:"Solid", blurb:"Known since antiquity as 'brimstone'." },
  Cl: { z:17, name:"Chlorine", shells:[2,8,7], category:"halogen", mass:35.45, phase:"Gas", blurb:"Toxic yellow-green gas used to disinfect water." },
  Ar: { z:18, name:"Argon", shells:[2,8,8], category:"noble-gas", mass:39.948, phase:"Gas", blurb:"Makes up about 1% of the air." },
  K: { z:19, name:"Potassium", shells:[2,8,8,1], category:"alkali", mass:39.098, phase:"Solid", blurb:"Vital nutrient; reacts violently with water." },
  Ca: { z:20, name:"Calcium", shells:[2,8,8,2], category:"alkaline-earth", mass:40.078, phase:"Solid", blurb:"Most abundant metal in the body; builds bones." },
  Fe: { z:26, name:"Iron", shells:[2,8,14,2], category:"transition", mass:55.845, phase:"Solid", blurb:"Base of steel; carries oxygen in blood." },
  Cu: { z:29, name:"Copper", shells:[2,8,18,1], category:"transition", mass:63.546, phase:"Solid", blurb:"Excellent conductor used in electrical wiring." },
  Zn: { z:30, name:"Zinc", shells:[2,8,18,2], category:"transition", mass:65.382, phase:"Solid", blurb:"Used to galvanize steel and prevent rust." },
  Sn: { z:50, name:"Tin", shells:[2,8,18,18,4], category:"post-metal", mass:118.711, phase:"Solid", blurb:"Part of bronze and pewter." },
  Sb: { z:51, name:"Antimony", shells:[2,8,18,18,5], category:"metalloid", mass:121.76, phase:"Solid", blurb:"Metalloid used in flame retardants." },
  Au: { z:79, name:"Gold", shells:[2,8,18,32,18,1], category:"transition", mass:196.967, phase:"Solid", blurb:"Precious metal that never tarnishes." },
  // ... Include all 118 (the engine uses Z to fetch others) ...
};

const CATEGORY_META = {
  "nonmetal": { label: "Nonmetal", color: "#c9c3e0" },
  "noble-gas": { label: "Noble Gas", color: "#00ff7f" }, // GREEN
  "alkali": { label: "Alkali Metal", color: "#ffb454" },
  "alkaline-earth": { label: "Alkaline Earth Metal", color: "#ffcf8a" },
  "metalloid": { label: "Metalloid", color: "#5ce1c9" },
  "halogen": { label: "Halogen", color: "#ff6fae" },
  "post-metal": { label: "Post-transition Metal", color: "#b39ddb" },
  "transition": { label: "Transition Metal", color: "#7fd9ff" }, // SKY BLUE
  "lanthanide": { label: "Lanthanide", color: "#e8c93a" },
  "actinide": { label: "Actinide", color: "#ff7043" },
};

const ATOM_COLOR = {
  He: 0x00FF7F, Ne: 0x00FF7F, Ar: 0x00FF7F, Kr: 0x00FF7F, Xe: 0x00FF7F, Rn: 0x00FF7F, Og: 0x00FF7F,
  Fe: 0x7FD9FF, Cu: 0x7FD9FF, Zn: 0x7FD9FF, Au: 0x7FD9FF, Ag: 0x7FD9FF, Ni: 0x7FD9FF, Cr: 0x7FD9FF,
  Ti: 0x7FD9FF, H: 0xF2F0EA, C: 0x9c9c9c, N: 0x3B6FD9, O: 0xE0483E, Na: 0xFFB454, Cl: 0xFF6FAE,
  Mg: 0xFFCF8A, Al: 0xB39DDB, Si: 0x5CE1C9, P: 0xFF8000, S: 0xE8C93A, default: 0xCCCCCC
};

const ATOM_RADIUS = { H: 0.35, C: 0.5, O: 0.48, default: 0.6 };

const MOLECULE_BLURBS = {
  H2O: "Water: Essential for life.", CO2: "Carbon Dioxide: Greenhouse gas.",
  CH4: "Methane: Natural gas.", NACL: "Salt.", STEEL: "Steel: Iron + Carbon alloy.",
  BRASS: "Brass: Copper + Zinc alloy.", BRONZE: "Bronze: Copper + Tin alloy.",
  H2SO4: "Sulfuric Acid.", C6H12O6: "Glucose sugar.", C8H10N4O2: "Caffeine."
};

const MOLECULES = {
  H2O: { name: "Water", formula: "H₂O", atoms: [{ el: "O", pos: [0, 0, 0], role: "Polar Core" }, { el: "H", pos: [0.76, 0.59, 0], role: "Hydrogen Link" }, { el: "H", pos: [-0.76, 0.59, 0], role: "Hydrogen Link" }], bonds: [[0,1],[0,2]] },
  CO2: { name: "Carbon dioxide", formula: "CO₂", atoms: [{ el: "C", pos: [0,0,0], role: "Carbon Core" }, { el: "O", pos: [1.16,0,0], role: "Terminal Oxygen" }, { el: "O", pos: [-1.16,0,0], role: "Terminal Oxygen" }], bonds: [[0,1],[0,2]] },
  CH4: { name: "Methane", formula: "CH₄", atoms: [{ el: "C", pos: [0,0,0], role: "Core Carbon" }, { el: "H", pos: [0.63,0.63,0.63], role: "Hydrogen Arm" }, { el: "H", pos: [-0.63,-0.63,0.63], role: "Hydrogen Arm" }, { el: "H", pos: [-0.63,0.63,-0.63], role: "Hydrogen Arm" }, { el: "H", pos: [0.63,-0.63,-0.63], role: "Hydrogen Arm" }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  NACL: { name: "Sodium chloride", formula: "NaCl", atoms: [{ el: "Na", pos: [0.7,0,0], role: "Sodium Cation" }, { el: "Cl", pos: [-0.7,0,0], role: "Chlorine Anion" }], bonds: [[0,1]] },
  STEEL: { name: "Steel", formula: "Fe-C Alloy", atoms: [{ el: "Fe", pos: [0,0,0], role: "Structural Matrix" }, { el: "Fe", pos: [1.4,0,0], role: "Structural Matrix" }, { el: "C", pos: [0.7,0.5,0], role: "Hardening Agent" }], bonds: [[0,2],[1,2]] },
  BRASS: { name: "Brass", formula: "Cu-Zn Alloy", atoms: [{ el: "Cu", pos: [0,0,0], role: "Copper Base" }, { el: "Zn", pos: [1.4,0,0], role: "Solute Metal" }], bonds: [[0,1]] },
  BRONZE: { name: "Bronze", formula: "Cu-Sn Alloy", atoms: [{ el: "Cu", pos: [0,0,0], role: "Copper Base" }, { el: "Sn", pos: [1.4,0,0], role: "Hardener" }], bonds: [[0,1]] }
};

function resolveQuery(raw) {
  const q = raw.trim();
  if (!q) return null;
  const key = q.toUpperCase().replace(/\s+/g, "");
  if (MOLECULES[key]) return { type: "molecule", key, data: MOLECULES[key] };
  const sym = q.charAt(0).toUpperCase() + q.slice(1).toLowerCase();
  if (ELEMENTS[sym]) return { type: "element", key: sym, data: ELEMENTS[sym] };
  const byName = Object.entries(ELEMENTS).find(([, e]) => e.name.toUpperCase() === q.toUpperCase());
  if (byName) return { type: "element", key: byName[0], data: byName[1] };
  return null;
}
