// MatAI reference data — first 36 elements (simplified teaching Bohr shells)
// and a small library of common molecules with idealized 3D geometry.

const ELEMENTS = {
  H:  { z: 1,  name: "Hydrogen",  shells: [1],          category: "nonmetal" },
  He: { z: 2,  name: "Helium",    shells: [2],          category: "noble-gas" },
  Li: { z: 3,  name: "Lithium",   shells: [2,1],        category: "alkali" },
  Be: { z: 4,  name: "Beryllium", shells: [2,2],        category: "alkaline-earth" },
  B:  { z: 5,  name: "Boron",     shells: [2,3],        category: "metalloid" },
  C:  { z: 6,  name: "Carbon",    shells: [2,4],        category: "nonmetal" },
  N:  { z: 7,  name: "Nitrogen",  shells: [2,5],        category: "nonmetal" },
  O:  { z: 8,  name: "Oxygen",    shells: [2,6],        category: "nonmetal" },
  F:  { z: 9,  name: "Fluorine",  shells: [2,7],        category: "halogen" },
  Ne: { z: 10, name: "Neon",      shells: [2,8],        category: "noble-gas" },
  Na: { z: 11, name: "Sodium",    shells: [2,8,1],      category: "alkali" },
  Mg: { z: 12, name: "Magnesium", shells: [2,8,2],      category: "alkaline-earth" },
  Al: { z: 13, name: "Aluminium", shells: [2,8,3],      category: "post-metal" },
  Si: { z: 14, name: "Silicon",   shells: [2,8,4],      category: "metalloid" },
  P:  { z: 15, name: "Phosphorus",shells: [2,8,5],      category: "nonmetal" },
  S:  { z: 16, name: "Sulfur",    shells: [2,8,6],      category: "nonmetal" },
  Cl: { z: 17, name: "Chlorine",  shells: [2,8,7],      category: "halogen" },
  Ar: { z: 18, name: "Argon",     shells: [2,8,8],      category: "noble-gas" },
  K:  { z: 19, name: "Potassium", shells: [2,8,8,1],    category: "alkali" },
  Ca: { z: 20, name: "Calcium",   shells: [2,8,8,2],    category: "alkaline-earth" },
  Sc: { z: 21, name: "Scandium",  shells: [2,8,9,2],    category: "transition" },
  Ti: { z: 22, name: "Titanium",  shells: [2,8,10,2],   category: "transition" },
  V:  { z: 23, name: "Vanadium",  shells: [2,8,11,2],   category: "transition" },
  Cr: { z: 24, name: "Chromium",  shells: [2,8,13,1],   category: "transition" },
  Mn: { z: 25, name: "Manganese", shells: [2,8,13,2],   category: "transition" },
  Fe: { z: 26, name: "Iron",      shells: [2,8,14,2],   category: "transition" },
  Co: { z: 27, name: "Cobalt",    shells: [2,8,15,2],   category: "transition" },
  Ni: { z: 28, name: "Nickel",    shells: [2,8,16,2],   category: "transition" },
  Cu: { z: 29, name: "Copper",    shells: [2,8,18,1],   category: "transition" },
  Zn: { z: 30, name: "Zinc",      shells: [2,8,18,2],   category: "transition" },
  Ga: { z: 31, name: "Gallium",   shells: [2,8,18,3],   category: "post-metal" },
  Ge: { z: 32, name: "Germanium", shells: [2,8,18,4],   category: "metalloid" },
  As: { z: 33, name: "Arsenic",   shells: [2,8,18,5],   category: "metalloid" },
  Se: { z: 34, name: "Selenium",  shells: [2,8,18,6],   category: "nonmetal" },
  Br: { z: 35, name: "Bromine",   shells: [2,8,18,7],   category: "halogen" },
  Kr: { z: 36, name: "Krypton",   shells: [2,8,18,8],   category: "noble-gas" },
};

// CPK-style colors per element symbol, used for the ball-and-stick viewer.
const ATOM_COLOR = {
  H: 0xf2f0ea, C: 0x2b2b2b, N: 0x3b6fd9, O: 0xe0483e,
  Na: 0x8a5fd9, Cl: 0x4fbf6b, S: 0xe8c93a, default: 0x9a94b3,
};
const ATOM_RADIUS = { H: 0.32, C: 0.5, N: 0.48, O: 0.48, Na: 0.6, Cl: 0.58, S: 0.55, default: 0.5 };

// Idealized geometry, in angstrom-ish units — shape-accurate, not to exact scale.
const MOLECULES = {
  H2O: {
    name: "Water", formula: "H₂O",
    atoms: [
      { el: "O", pos: [0, 0, 0] },
      { el: "H", pos: [0.76, 0.59, 0] },
      { el: "H", pos: [-0.76, 0.59, 0] },
    ],
    bonds: [[0,1],[0,2]],
  },
  CO2: {
    name: "Carbon dioxide", formula: "CO₂",
    atoms: [
      { el: "C", pos: [0,0,0] },
      { el: "O", pos: [1.16,0,0] },
      { el: "O", pos: [-1.16,0,0] },
    ],
    bonds: [[0,1],[0,2]],
  },
  CH4: {
    name: "Methane", formula: "CH₄",
    atoms: [
      { el: "C", pos: [0,0,0] },
      { el: "H", pos: [0.63,0.63,0.63] },
      { el: "H", pos: [-0.63,-0.63,0.63] },
      { el: "H", pos: [-0.63,0.63,-0.63] },
      { el: "H", pos: [0.63,-0.63,-0.63] },
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4]],
  },
  NH3: {
    name: "Ammonia", formula: "NH₃",
    atoms: [
      { el: "N", pos: [0,0.2,0] },
      { el: "H", pos: [0.94,-0.3,0] },
      { el: "H", pos: [-0.47,-0.3,0.82] },
      { el: "H", pos: [-0.47,-0.3,-0.82] },
    ],
    bonds: [[0,1],[0,2],[0,3]],
  },
  O2: {
    name: "Oxygen gas", formula: "O₂",
    atoms: [ { el: "O", pos: [0.6,0,0] }, { el: "O", pos: [-0.6,0,0] } ],
    bonds: [[0,1]],
  },
  N2: {
    name: "Nitrogen gas", formula: "N₂",
    atoms: [ { el: "N", pos: [0.55,0,0] }, { el: "N", pos: [-0.55,0,0] } ],
    bonds: [[0,1]],
  },
  NACL: {
    name: "Sodium chloride (ion pair)", formula: "NaCl",
    atoms: [ { el: "Na", pos: [0.7,0,0] }, { el: "Cl", pos: [-0.7,0,0] } ],
    bonds: [[0,1]],
  },
};

// Look up a search term against molecules first, then elements.
function resolveQuery(raw) {
  const q = raw.trim();
  if (!q) return null;
  const key = q.toUpperCase().replace(/\s+/g, "");
  if (MOLECULES[key]) return { type: "molecule", key, data: MOLECULES[key] };

  const byFormula = Object.entries(MOLECULES).find(([, m]) =>
    m.formula.replace(/[₀-₉]/g, n => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(n)]).toUpperCase() === key
  );
  if (byFormula) return { type: "molecule", key: byFormula[0], data: byFormula[1] };

  const byName = Object.entries(MOLECULES).find(([, m]) => m.name.toUpperCase() === q.toUpperCase());
  if (byName) return { type: "molecule", key: byName[0], data: byName[1] };

  const sym = q[0].toUpperCase() + q.slice(1).toLowerCase();
  if (ELEMENTS[sym]) return { type: "element", key: sym, data: ELEMENTS[sym] };

  const byElName = Object.entries(ELEMENTS).find(([, e]) => e.name.toUpperCase() === q.toUpperCase());
  if (byElName) return { type: "element", key: byElName[0], data: byElName[1] };

  return null;
}
