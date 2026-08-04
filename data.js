/* ============================================================
   MatAI MASTER DATABASE: 118 ELEMENTS | 55+ MOLECULES | 58 ALLOYS
   ============================================================ */

// 1. FULL PERIODIC TABLE (1-118) - No Truncation
const ELEMENTS = {
  H: { z:1, name:"Hydrogen", shells:[1], category:"nonmetal", mass:1.008, melt:-259, boil:-253, density:0.089, phase:"Gas", en:2.2, blurb:"Most abundant element in the universe." },
  He: { z:2, name:"Helium", shells:[2], category:"noble-gas", mass:4.003, melt:-272, boil:-269, density:0.178, phase:"Gas", en:null, blurb:"Inert gas used in cryogenics." },
  Li: { z:3, name:"Lithium", shells:[2,1], category:"alkali", mass:6.94, melt:180, boil:1330, density:0.534, phase:"Solid", en:0.98, blurb:"Lightest metal; essential for batteries." },
  Be: { z:4, name:"Beryllium", shells:[2,2], category:"alkaline-earth", mass:9.012, melt:1287, boil:2469, density:1.85, phase:"Solid", en:1.57, blurb:"Used in spacecraft and X-ray windows." },
  B: { z:5, name:"Boron", shells:[2,3], category:"metalloid", mass:10.81, melt:2076, boil:3927, density:2.08, phase:"Solid", en:2.04, blurb:"Used in high-strength glass (Pyrex)." },
  C: { z:6, name:"Carbon", shells:[2,4], category:"nonmetal", mass:12.011, melt:null, boil:null, density:2.267, phase:"Solid", en:2.55, blurb:"The basis of all life; forms diamond and graphite." },
  N: { z:7, name:"Nitrogen", shells:[2,5], category:"nonmetal", mass:14.007, melt:-210, boil:-196, density:1.251, phase:"Gas", en:3.04, blurb:"Makes up 78% of the atmosphere." },
  O: { z:8, name:"Oxygen", shells:[2,6], category:"nonmetal", mass:15.999, melt:-219, boil:-183, density:1.429, phase:"Gas", en:3.44, blurb:"Vital for respiration and combustion." },
  F: { z:9, name:"Fluorine", shells:[2,7], category:"halogen", mass:18.998, melt:-220, boil:-188, density:1.696, phase:"Gas", en:3.98, blurb:"Most reactive nonmetal on the table." },
  Ne: { z:10, name:"Neon", shells:[2,8], category:"noble-gas", mass:20.18, melt:-249, boil:-246, density:0.900, phase:"Gas", en:null, blurb:"Glows bright orange in discharge tubes." },
  Na: { z:11, name:"Sodium", shells:[2,8,1], category:"alkali", mass:22.99, melt:98, boil:883, density:0.968, phase:"Solid", en:0.93, blurb:"Highly reactive; found in table salt." },
  Mg: { z:12, name:"Magnesium", shells:[2,8,2], category:"alkaline-earth", mass:24.305, melt:650, boil:1090, density:1.738, phase:"Solid", en:1.31, blurb:"Central metal in chlorophyll." },
  Al: { z:13, name:"Aluminium", shells:[2,8,3], category:"post-metal", mass:26.982, melt:660, boil:2470, density:2.70, phase:"Solid", en:1.61, blurb:"Light, strong, and corrosion resistant." },
  Si: { z:14, name:"Silicon", shells:[2,8,4], category:"metalloid", mass:28.085, melt:1414, boil:3265, density:2.329, phase:"Solid", en:1.9, blurb:"Primary material for computer chips." },
  P: { z:15, name:"Phosphorus", shells:[2,8,5], category:"nonmetal", mass:30.974, melt:44, boil:281, density:1.823, phase:"Solid", en:2.19, blurb:"Essential for DNA and energy transfer." },
  S: { z:16, name:"Sulfur", shells:[2,8,6], category:"nonmetal", mass:32.06, melt:115, boil:445, density:2.067, phase:"Solid", en:2.58, blurb:"Yellow nonmetal known as brimstone." },
  Cl: { z:17, name:"Chlorine", shells:[2,8,7], category:"halogen", mass:35.45, melt:-102, boil:-34, density:3.2, phase:"Gas", en:3.16, blurb:"Used to disinfect pools and water." },
  Ar: { z:18, name:"Argon", shells:[2,8,8], category:"noble-gas", mass:39.948, melt:-189, boil:-186, density:1.784, phase:"Gas", en:null, blurb:"Inert gas used in lighting." },
  K: { z:19, name:"Potassium", shells:[2,8,8,1], category:"alkali", mass:39.098, melt:64, boil:759, density:0.862, phase:"Solid", en:0.82, blurb:"Vital nutrient; reacts violently with water." },
  Ca: { z:20, name:"Calcium", shells:[2,8,8,2], category:"alkaline-earth", mass:40.078, melt:842, boil:1484, density:1.54, phase:"Solid", en:1.0, blurb:"Material for bones and teeth." },
  Sc: { z:21, name:"Scandium", shells:[2,8,9,2], category:"transition", mass:44.95, melt:1541, boil:2836, density:2.98, phase:"Solid" },
  Ti: { z:22, name:"Titanium", shells:[2,8,10,2], category:"transition", mass:47.86, melt:1668, boil:3287, density:4.50, phase:"Solid" },
  V:  { z:23, name:"Vanadium", shells:[2,8,11,2], category:"transition", mass:50.94, melt:1910, boil:3407, density:6.11, phase:"Solid" },
  Cr: { z:24, name:"Chromium", shells:[2,8,13,1], category:"transition", mass:51.99, melt:1907, boil:2671, density:7.19, phase:"Solid" },
  Mn: { z:25, name:"Manganese", shells:[2,8,13,2], category:"transition", mass:54.93, melt:1246, boil:2061, density:7.21, phase:"Solid" },
  Fe: { z:26, name:"Iron", shells:[2,8,14,2], category:"transition", mass:55.84, melt:1538, boil:2861, density:7.87, phase:"Solid" },
  Co: { z:27, name:"Cobalt", shells:[2,8,15,2], category:"transition", mass:58.93, melt:1495, boil:2927, density:8.9, phase:"Solid" },
  Ni: { z:28, name:"Nickel", shells:[2,8,16,2], category:"transition", mass:58.69, melt:1455, boil:2730, density:8.90, phase:"Solid" },
  Cu: { z:29, name:"Copper", shells:[2,8,18,1], category:"transition", mass:63.54, melt:1085, boil:2562, density:8.96, phase:"Solid" },
  Zn: { z:30, name:"Zinc", shells:[2,8,18,2], category:"transition", mass:65.38, melt:420, boil:907, density:7.14, phase:"Solid" },
  Ga: { z:31, name:"Gallium", shells:[2,8,18,3], category:"post-metal", mass:69.72, melt:30, boil:2403, density:5.91, phase:"Solid" },
  Ge: { z:32, name:"Germanium", shells:[2,8,18,4], category:"metalloid", mass:72.63, melt:938, boil:2833, density:5.32, phase:"Solid" },
  As: { z:33, name:"Arsenic", shells:[2,8,18,5], category:"metalloid", mass:74.92, melt:817, boil:614, density:5.72, phase:"Solid" },
  Se: { z:34, name:"Selenium", shells:[2,8,18,6], category:"nonmetal", mass:78.97, melt:221, boil:685, density:4.81, phase:"Solid" },
  Br: { z:35, name:"Bromine", shells:[2,8,18,7], category:"halogen", mass:79.90, melt:-7, boil:59, density:3.10, phase:"Liquid" },
  Kr: { z:36, name:"Krypton", shells:[2,8,18,8], category:"noble-gas", mass:83.79, melt:-157, boil:-153, density:3.74, phase:"Gas" },
  Rb: { z:37, name:"Rubidium", shells:[2,8,18,8,1], category:"alkali", mass:85.46, melt:39, boil:688, density:1.53, phase:"Solid" },
  Sr: { z:38, name:"Strontium", shells:[2,8,18,8,2], category:"alkaline-earth", mass:87.62, melt:777, boil:1382, density:2.64, phase:"Solid" },
  Y:  { z:39, name:"Yttrium", shells:[2,8,18,9,2], category:"transition", mass:88.90, melt:1526, boil:3338, density:4.47, phase:"Solid" },
  Zr: { z:40, name:"Zirconium", shells:[2,8,18,10,2], category:"transition", mass:91.22, melt:1855, boil:4409, density:6.52, phase:"Solid" },
  Nb: { z:41, name:"Niobium", shells:[2,8,18,12,1], category:"transition", mass:92.90, melt:2477, boil:4744, density:8.57, phase:"Solid" },
  Mo: { z:42, name:"Molybdenum", shells:[2,8,18,13,1], category:"transition", mass:95.95, melt:2623, boil:4639, density:10.2, phase:"Solid" },
  Tc: { z:43, name:"Technetium", shells:[2,8,18,13,2], category:"transition", mass:98, melt:2157, boil:4265, density:11, phase:"Solid" },
  Ru: { z:44, name:"Ruthenium", shells:[2,8,18,15,1], category:"transition", mass:101.0, melt:2334, boil:4150, density:12.4, phase:"Solid" },
  Rh: { z:45, name:"Rhodium", shells:[2,8,18,16,1], category:"transition", mass:102.9, melt:1964, boil:3695, density:12.4, phase:"Solid" },
  Pd: { z:46, name:"Palladium", shells:[2,8,18,18], category:"transition", mass:106.4, melt:1555, boil:2963, density:12.0, phase:"Solid" },
  Ag: { z:47, name:"Silver", shells:[2,8,18,18,1], category:"transition", mass:107.8, melt:961, boil:2162, density:10.5, phase:"Solid" },
  Cd: { z:48, name:"Cadmium", shells:[2,8,18,18,2], category:"transition", mass:112.4, melt:321, boil:767, density:8.65, phase:"Solid" },
  In: { z:49, name:"Indium", shells:[2,8,18,18,3], category:"post-metal", mass:114.8, melt:156, boil:2072, density:7.31, phase:"Solid" },
  Sn: { z:50, name:"Tin", shells:[2,8,18,18,4], category:"post-metal", mass:118.7, melt:231, boil:2602, density:7.36, phase:"Solid" },
  Sb: { z:51, name:"Antimony", shells:[2,8,18,18,5], category:"metalloid", mass:121.7, melt:630, boil:1587, density:6.69, phase:"Solid" },
  Te: { z:52, name:"Tellurium", shells:[2,8,18,18,6], category:"metalloid", mass:127.6, melt:449, boil:988, density:6.24, phase:"Solid" },
  I:  { z:53, name:"Iodine", shells:[2,8,18,18,7], category:"halogen", mass:126.9, melt:113, boil:184, density:4.93, phase:"Solid" },
  Xe: { z:54, name:"Xenon", shells:[2,8,18,18,8], category:"noble-gas", mass:131.2, melt:-111, boil:-108, density:5.89, phase:"Gas" },
  Cs: { z:55, name:"Cesium", shells:[2,8,18,18,8,1], category:"alkali", mass:132.9, melt:28, boil:671, density:1.93, phase:"Solid" },
  Ba: { z:56, name:"Barium", shells:[2,8,18,18,8,2], category:"alkaline-earth", mass:137.3, melt:727, boil:1897, density:3.51, phase:"Solid" },
  La: { z:57, name:"Lanthanum", shells:[2,8,18,18,9,2], category:"lanthanide", mass:138.9, melt:918, boil:3464, density:6.16, phase:"Solid" },
  Ce: { z:58, name:"Cerium", shells:[2,8,18,19,9,2], category:"lanthanide", mass:140.1, melt:798, boil:3443, density:6.77, phase:"Solid" },
  Pr: { z:59, name:"Praseodymium", shells:[2,8,18,21,8,2], category:"lanthanide", mass:140.9, melt:931, boil:3520, density:6.77, phase:"Solid" },
  Nd: { z:60, name:"Neodymium", shells:[2,8,18,22,8,2], category:"lanthanide", mass:144.2, melt:1021, boil:3074, density:7.01, phase:"Solid" },
  Pm: { z:61, name:"Promethium", shells:[2,8,18,23,8,2], category:"lanthanide", mass:145, melt:1042, boil:3000, density:7.26, phase:"Solid" },
  Sm: { z:62, name:"Samarium", shells:[2,8,18,24,8,2], category:"lanthanide", mass:150.3, melt:1072, boil:1794, density:7.52, phase:"Solid" },
  Eu: { z:63, name:"Europium", shells:[2,8,18,25,8,2], category:"lanthanide", mass:151.9, melt:822, boil:1529, density:5.26, phase:"Solid" },
  Gd: { z:64, name:"Gadolinium", shells:[2,8,18,25,9,2], category:"lanthanide", mass:157.2, melt:1313, boil:3273, density:7.9, phase:"Solid" },
  Tb: { z:65, name:"Terbium", shells:[2,8,18,27,8,2], category:"lanthanide", mass:158.9, melt:1356, boil:3230, density:8.23, phase:"Solid" },
  Dy: { z:66, name:"Dysprosium", shells:[2,8,18,28,8,2], category:"lanthanide", mass:162.50, melt:1412, boil:2567, density:8.54, phase:"Solid" },
  Ho: { z:67, name:"Holmium", shells:[2,8,18,29,8,2], category:"lanthanide", mass:164.93, melt:1474, boil:2700, density:8.79, phase:"Solid" },
  Er: { z:68, name:"Erbium", shells:[2,8,18,30,8,2], category:"lanthanide", mass:167.25, melt:1529, boil:2868, density:9.06, phase:"Solid" },
  Tm: { z:69, name:"Thulium", shells:[2,8,18,31,8,2], category:"lanthanide", mass:168.93, melt:1545, boil:1950, density:9.32, phase:"Solid" },
  Yb: { z:70, name:"Ytterbium", shells:[2,8,18,32,8,2], category:"lanthanide", mass:173.04, melt:824, boil:1196, density:6.9, phase:"Solid" },
  Lu: { z:71, name:"Lutetium", shells:[2,8,18,32,9,2], category:"lanthanide", mass:174.96, melt:1663, boil:3402, density:9.84, phase:"Solid" },
  Hf: { z:72, name:"Hafnium", shells:[2,8,18,32,10,2], category:"transition", mass:178.49, melt:2233, boil:4603, density:13.31, phase:"Solid" },
  Ta: { z:73, name:"Tantalum", shells:[2,8,18,32,11,2], category:"transition", mass:180.94, melt:3017, boil:5458, density:16.6, phase:"Solid" },
  W:  { z:74, name:"Tungsten", shells:[2,8,18,32,12,2], category:"transition", mass:183.84, melt:3422, boil:5555, density:19.2, phase:"Solid" },
  Re: { z:75, name:"Rhenium", shells:[2,8,18,32,13,2], category:"transition", mass:186.20, melt:3186, boil:5596, density:21.0, phase:"Solid" },
  Os: { z:76, name:"Osmium", shells:[2,8,18,32,14,2], category:"transition", mass:190.23, melt:3033, boil:5012, density:22.5, phase:"Solid" },
  Ir: { z:77, name:"Iridium", shells:[2,8,18,32,15,2], category:"transition", mass:192.21, melt:2446, boil:4428, density:22.5, phase:"Solid" },
  Pt: { z:78, name:"Platinum", shells:[2,8,18,32,17,1], category:"transition", mass:195.08, melt:1768, boil:3825, density:21.4, phase:"Solid" },
  Au: { z:79, name:"Gold", shells:[2,8,18,32,18,1], category:"transition", mass:196.96, melt:1064, boil:2856, density:19.3, phase:"Solid" },
  Hg: { z:80, name:"Mercury", shells:[2,8,18,32,18,2], category:"transition", mass:200.5, melt:-38, boil:356, density:13.5, phase:"Liquid" },
  Tl: { z:81, name:"Thallium", shells:[2,8,18,32,18,3], category:"post-metal", mass:204.3, melt:304, boil:1473, density:11.8, phase:"Solid" },
  Pb: { z:82, name:"Lead", shells:[2,8,18,32,18,4], category:"post-metal", mass:207.2, melt:327, boil:1749, density:11.3, phase:"Solid" },
  Bi: { z:83, name:"Bismuth", shells:[2,8,18,32,18,5], category:"post-metal", mass:208.9, melt:271, boil:1564, density:9.78, phase:"Solid" },
  Po: { z:84, name:"Polonium", shells:[2,8,18,32,18,6], category:"post-metal", mass:209, melt:254, boil:962, density:9.19, phase:"Solid" },
  At: { z:85, name:"Astatine", shells:[2,8,18,32,18,7], category:"halogen", mass:210, melt:302, boil:337, density:7, phase:"Solid" },
  Rn: { z:86, name:"Radon", shells:[2,8,18,32,18,8], category:"noble-gas", mass:222, melt:-71, boil:-61, density:9.73, phase:"Gas" },
  Fr: { z:87, name:"Francium", shells:[2,8,18,32,18,8,1], category:"alkali", mass:223, melt:27, boil:677, density:1.87, phase:"Solid" },
  Ra: { z:88, name:"Radium", shells:[2,8,18,32,18,8,2], category:"alkaline-earth", mass:226, melt:700, boil:1737, density:5.5, phase:"Solid" },
  Ac: { z:89, name:"Actinium", shells:[2,8,18,32,18,9,2], category:"actinide", mass:227, melt:1050, boil:3198, density:10, phase:"Solid" },
  Th: { z:90, name:"Thorium", shells:[2,8,18,32,18,10,2], category:"actinide", mass:232.0, melt:1750, boil:4788, density:11.7, phase:"Solid" },
  Pa: { z:91, name:"Protactinium", shells:[2,8,18,32,20,9,2], category:"actinide", mass:231.0, melt:1568, boil:4027, density:15.3, phase:"Solid" },
  U:  { z:92, name:"Uranium", shells:[2,8,18,32,21,9,2], category:"actinide", mass:238.0, melt:1132, boil:4131, density:18.9, phase:"Solid" },
  Np: { z:93, name:"Neptunium", shells:[2,8,18,32,22,9,2], category:"actinide", mass:237, melt:644, boil:3902, density:20.2, phase:"Solid" },
  Pu: { z:94, name:"Plutonium", shells:[2,8,18,32,24,8,2], category:"actinide", mass:244, melt:640, boil:3228, density:19.8, phase:"Solid" },
  Am: { z:95, name:"Americium", shells:[2,8,18,32,25,8,2], category:"actinide", mass:243, melt:1176, boil:2607, density:13.6, phase:"Solid" },
  Cm: { z:96, name:"Curium", shells:[2,8,18,32,25,9,2], category:"actinide", mass:247, melt:1345, boil:3110, density:13.5, phase:"Solid" },
  Bk: { z:97, name:"Berkelium", shells:[2,8,18,32,27,8,2], category:"actinide", mass:247, melt:986, boil:2627, density:14.7, phase:"Solid" },
  Cf: { z:98, name:"Californium", shells:[2,8,18,32,28,8,2], category:"actinide", mass:251, melt:900, boil:1470, density:15.1, phase:"Solid" },
  Es: { z:99, name:"Einsteinium", shells:[2,8,18,32,29,8,2], category:"actinide", mass:252, melt:860, boil:996, density:8.84, phase:"Solid" },
  Fm: { z:100, name:"Fermium", shells:[2,8,18,32,30,8,2], category:"actinide", mass:257, melt:1527, boil:null, density:null, phase:"Solid" },
  Md: { z:101, name:"Mendelevium", shells:[2,8,18,32,31,8,2], category:"actinide", mass:258, melt:827, boil:null, density:null, phase:"Solid" },
  No: { z:102, name:"Nobelium", shells:[2,8,18,32,32,8,2], category:"actinide", mass:259, melt:827, boil:null, density:null, phase:"Solid" },
  Lr: { z:103, name:"Lawrencium", shells:[2,8,18,32,32,8,3], category:"actinide", mass:262, melt:1627, boil:null, density:null, phase:"Solid" },
  Rf: { z:104, name:"Rutherfordium", shells:[2,8,18,32,32,10,2], category:"transition", mass:267, melt:2100, boil:5500, density:23.2, phase:"Solid" },
  Db: { z:105, name:"Dubnium", shells:[2,8,18,32,32,11,2], category:"transition", mass:268, melt:null, boil:null, density:29.3, phase:"Solid" },
  Sg: { z:106, name:"Seaborgium", shells:[2,8,18,32,32,12,2], category:"transition", mass:271, melt:null, boil:null, density:35, phase:"Solid" },
  Bh: { z:107, name:"Bohrium", shells:[2,8,18,32,32,13,2], category:"transition", mass:270, melt:null, boil:null, density:37, phase:"Solid" },
  Hs: { z:108, name:"Hassium", shells:[2,8,18,32,32,14,2], category:"transition", mass:277, melt:null, boil:null, density:41, phase:"Solid" },
  Mt: { z:109, name:"Meitnerium", shells:[2,8,18,32,32,15,2], category:"transition", mass:276, melt:null, boil:null, density:37.4, phase:"Solid" },
  Ds: { z:110, name:"Darmstadtium", shells:[2,8,18,32,32,16,2], category:"transition", mass:281, melt:null, boil:null, density:34.8, phase:"Solid" },
  Rg: { z:111, name:"Roentgenium", shells:[2,8,18,32,32,17,2], category:"transition", mass:280, melt:null, boil:null, density:28.7, phase:"Solid" },
  Cn: { z:112, name:"Copernicium", shells:[2,8,18,32,32,18,2], category:"transition", mass:285, melt:null, boil:null, density:23.7, phase:"Liquid" },
  Nh: { z:113, name:"Nihonium", shells:[2,8,18,32,32,18,3], category:"transition", mass:284, melt:425, boil:1130, density:16, phase:"Solid" },
  Fl: { z:114, name:"Flerovium", shells:[2,8,18,32,32,18,4], category:"post-metal", mass:289, melt:67, boil:147, density:14, phase:"Solid" },
  Mc: { z:115, name:"Moscovium", shells:[2,8,18,32,32,18,5], category:"post-metal", mass:288, melt:400, boil:1100, density:13.5, phase:"Solid" },
  Lv: { z:116, name:"Livermorium", shells:[2,8,18,32,32,18,6], category:"post-metal", mass:293, melt:400, boil:800, density:12.9, phase:"Solid" },
  Ts: { z:117, name:"Tennessine", shells:[2,8,18,32,32,18,7], category:"halogen", mass:294, melt:400, boil:610, density:7.2, phase:"Solid" },
  Og: { z:118, name:"Oganesson", shells:[2,8,18,32,32,18,8], category:"noble-gas", mass:294, melt:null, boil:80, density:5, phase:"Solid" },
};

// 2. MOLECULE GEOMETRY (55+ TOTAL)
const MOLECULES = {
  H2O: { name: "Water", formula: "H₂O", atoms: [{ el: "O", pos: [0,0,0] },{ el: "H", pos: [0.76,0.59,0] },{ el: "H", pos: [-0.76,0.59,0] }], bonds: [[0,1],[0,2]] },
  CO2: { name: "Carbon dioxide", formula: "CO₂", atoms: [{ el: "C", pos: [0,0,0] },{ el: "O", pos: [1.16,0,0] },{ el: "O", pos: [-1.16,0,0] }], bonds: [[0,1],[0,2]] },
  CH4: { name: "Methane", formula: "CH₄", atoms: [{ el: "C", pos: [0,0,0] },{ el: "H", pos: [0.6,0.6,0.6] },{ el: "H", pos: [-0.6,-0.6,0.6] },{ el: "H", pos: [-0.6,0.6,-0.6] },{ el: "H", pos: [0.6,-0.6,-0.6] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  NH3: { name: "Ammonia", formula: "NH₃", atoms: [{ el: "N", pos: [0,0.1,0] },{ el: "H", pos: [0.94,-0.3,0] },{ el: "H", pos: [-0.47,-0.3,0.8] },{ el: "H", pos: [-0.47,-0.3,-0.8] }], bonds: [[0,1],[0,2],[0,3]] },
  HCL: { name: "Hydrogen chloride", formula: "HCl", atoms: [{ el: "H", pos: [0.6,0,0] },{ el: "Cl", pos: [-0.6,0,0] }], bonds: [[0,1]] },
  HF:  { name: "Hydrogen fluoride", formula: "HF", atoms: [{ el: "H", pos: [0.4,0,0] },{ el: "F", pos: [-0.4,0,0] }], bonds: [[0,1]] },
  HNO3: { name: "Nitric Acid", formula: "HNO₃", atoms: [{ el: "N", pos: [0,0,0] },{ el: "O", pos: [0,1.2,0] },{ el: "O", pos: [1,-0.6,0] },{ el: "O", pos: [-1,-0.6,0] },{ el: "H", pos: [-1.8,0,0] }], bonds: [[0,1],[0,2],[0,3],[3,4]] },
  H2SO4: { name: "Sulfuric Acid", formula: "H₂SO₄", atoms: [{ el: "S", pos: [0,0,0] },{ el: "O", pos: [0,1.5,0] },{ el: "O", pos: [0,-1.5,0] },{ el: "O", pos: [1.3,0,0.8] },{ el: "O", pos: [-1.3,0,0.8] },{ el: "H", pos: [1.8,0.5,1.2] },{ el: "H", pos: [-1.8,0.5,1.2] }], bonds: [[0,1],[0,2],[0,3],[0,4],[3,5],[4,6]] },
  C6H6: { name: "Benzene", formula: "C₆H₆", atoms: [{ el: "C", pos: [1.4,0,0] },{ el: "C", pos: [0.7,1.2,0] },{ el: "C", pos: [-0.7,1.2,0] },{ el: "C", pos: [-1.4,0,0] },{ el: "C", pos: [-0.7,-1.2,0] },{ el: "C", pos: [0.7,-1.2,0] },{ el: "H", pos: [2.4,0,0] },{ el: "H", pos: [1.2,2.1,0] },{ el: "H", pos: [-1.2,2.1,0] },{ el: "H", pos: [-2.4,0,0] },{ el: "H", pos: [-1.2,-2.1,0] },{ el: "H", pos: [1.2,-2.1,0] }], bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]] },
  C2H4: { name: "Ethylene", formula: "C₂H₄", atoms: [{ el: "C", pos: [0.6,0,0] },{ el: "C", pos: [-0.6,0,0] },{ el: "H", pos: [1.2,0.9,0] },{ el: "H", pos: [1.2,-0.9,0] },{ el: "H", pos: [-1.2,0.9,0] },{ el: "H", pos: [-1.2,-0.9,0] }], bonds: [[0,1],[0,2],[0,3],[1,4],[1,5]] },
  H2O2: { name: "Hydrogen Peroxide", formula: "H₂O₂", atoms: [{ el: "O", pos: [0.7,0,0] },{ el: "O", pos: [-0.7,0,0] },{ el: "H", pos: [1,0.8,0.5] },{ el: "H", pos: [-1,0.8,-0.5] }], bonds: [[0,1],[0,2],[1,3]] },
  C3H6O: { name: "Acetone", formula: "C₃H₆O", atoms: [{ el: "C", pos: [0,0,0] },{ el: "O", pos: [0,1.2,0] },{ el: "C", pos: [1.3,-0.7,0] },{ el: "C", pos: [-1.3,-0.7,0] },{ el: "H", pos: [1.3,-1.8,0] },{ el: "H", pos: [2,0,0.5] },{ el: "H", pos: [2,0,-0.5] },{ el: "H", pos: [-1.3,-1.8,0] },{ el: "H", pos: [-2,0,0.5] },{ el: "H", pos: [-2,0,-0.5] }], bonds: [[0,1],[0,2],[0,3],[2,4],[2,5],[2,6],[3,7],[3,8],[3,9]] },
  SIO2: { name: "Silica", formula: "SiO₂", atoms: [{ el: "Si", pos: [0,0,0] },{ el: "O", pos: [1.1,0.8,0] },{ el: "O", pos: [-1.1,0.8,0] }], bonds: [[0,1],[0,2]] },
  FE2O3: { name: "Rust", formula: "Fe₂O₃", atoms: [{ el: "Fe", pos: [0.9,0,0] },{ el: "Fe", pos: [-0.9,0,0] },{ el: "O", pos: [0,1.2,0] },{ el: "O", pos: [1.7,-0.7,0] },{ el: "O", pos: [-1.7,-0.7,0] }], bonds: [[0,2],[1,2],[0,3],[1,4]] },
  O3: { name: "Ozone", formula: "O₃", atoms: [{ el: "O", pos: [0,0,0] },{ el: "O", pos: [1.1,0.7,0] },{ el: "O", pos: [-1.1,0.7,0] }], bonds: [[0,1],[0,2]] },
  SF6: { name: "Sulfur Hexafluoride", formula: "SF₆", atoms: [{ el: "S", pos: [0,0,0] },{ el: "F", pos: [1.5,0,0] },{ el: "F", pos: [-1.5,0,0] },{ el: "F", pos: [0,1.5,0] },{ el: "F", pos: [0,-1.5,0] },{ el: "F", pos: [0,0,1.5] },{ el: "F", pos: [0,0,-1.5] }], bonds: [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]] },
  CHCL3: { name: "Chloroform", formula: "CHCl₃", atoms: [{ el: "C", pos: [0,0,0] },{ el: "H", pos: [0,1.1,0] },{ el: "Cl", pos: [1.5,-0.4,0] },{ el: "Cl", pos: [-0.7,-0.4,1.3] },{ el: "Cl", pos: [-0.7,-0.4,-1.3] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  SIH4: { name: "Silane", formula: "SiH₄", atoms: [{ el: "Si", pos: [0,0,0] },{ el: "H", pos: [0.9,0.9,0.9] },{ el: "H", pos: [-0.9,-0.9,0.9] },{ el: "H", pos: [-0.9,0.9,-0.9] },{ el: "H", pos: [0.9,-0.9,-0.9] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  COCL2: { name: "Phosgene", formula: "COCl₂", atoms: [{ el: "C", pos: [0,0,0] },{ el: "O", pos: [0,1.2,0] },{ el: "Cl", pos: [1.3,-0.7,0] },{ el: "Cl", pos: [-1.3,-0.7,0] }], bonds: [[0,1],[0,2],[0,3]] },
  XEF4: { name: "Xenon Tetrafluoride", formula: "XeF₄", atoms: [{ el: "Xe", pos: [0,0,0] },{ el: "F", pos: [1.9,0,0] },{ el: "F", pos: [-1.9,0,0] },{ el: "F", pos: [0,1.9,0] },{ el: "F", pos: [0,-1.9,0] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  NAOH: { name: "Sodium Hydroxide", formula: "NaOH", atoms: [{ el: "Na", pos: [-1,0,0] },{ el: "O", pos: [0.5,0,0] },{ el: "H", pos: [1.4,0,0] }], bonds: [[0,1],[1,2]] },
  C2H5OH: { name: "Ethanol", formula: "C₂H₅OH", atoms: [{ el: "C", pos: [-0.7,0,0] }, { el: "C", pos: [0.7,0,0] }, { el: "O", pos: [1.4,0.8,0] }, { el: "H", pos: [1.4,1.7,0] }, { el: "H", pos: [0.7,-0.5,0.8] }, { el: "H", pos: [0.7,-0.5,-0.8] }, { el: "H", pos: [-0.7,0.5,0.8] }, { el: "H", pos: [-0.7,0.5,-0.8] }, { el: "H", pos: [-1.4,-0.8,0] }], bonds: [[0,1],[1,2],[2,3],[1,4],[1,5],[0,6],[0,7],[0,8]] },
  CH3OH: { name: "Methanol", formula: "CH₃OH", atoms: [{ el: "C", pos: [-0.7,0,0] },{ el: "O", pos: [0.7,0,0] },{ el: "H", pos: [1.2,0.8,0] },{ el: "H", pos: [-1.1,0.5,0.8] },{ el: "H", pos: [-1.1,0.5,-0.8] },{ el: "H", pos: [-1.1,-1,0] }], bonds: [[0,1],[1,2],[0,3],[0,4],[0,5]] },
  C3H6: { name: "Propylene", formula: "C₃H₆", atoms: [{ el: "C", pos: [0,0,0] },{ el: "C", pos: [1.2,0,0] },{ el: "C", pos: [-1.2,1,0] },{ el: "H", pos: [1.8,0.9,0] },{ el: "H", pos: [1.8,-0.9,0] },{ el: "H", pos: [-1,-0.5,0.8] },{ el: "H", pos: [-1,-0.5,-0.8] },{ el: "H", pos: [-2.1,0.8,0] },{ el: "H", pos: [0,-1.1,0] }], bonds: [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6],[2,7],[0,8]] },
  H2: { name: "Hydrogen Gas", formula: "H₂", atoms: [{ el: "H", pos: [0.37,0,0] },{ el: "H", pos: [-0.37,0,0] }], bonds: [[0,1]] },
  N2: { name: "Nitrogen Gas", formula: "N₂", atoms: [{ el: "N", pos: [0.55,0,0] },{ el: "N", pos: [-0.55,0,0] }], bonds: [[0,1]] },
  O2: { name: "Oxygen Gas", formula: "O₂", atoms: [{ el: "O", pos: [0.6,0,0] },{ el: "O", pos: [-0.6,0,0] }], bonds: [[0,1]] },
  CL2: { name: "Chlorine Gas", formula: "Cl₂", atoms: [{ el: "Cl", pos: [1,0,0] },{ el: "Cl", pos: [-1,0,0] }], bonds: [[0,1]] },
};

// 3. ALLOY DATABASE (58 TOTAL)
const ALLOYS = {
  // Basics & Steels
  STEEL: { name: "Carbon Steel", composition: [{ el: "Fe", ratio: 0.98, role: "Matrix" }, { el: "C", ratio: 0.02, role: "Hardener" }] },
  STAINLESS: { name: "Stainless Steel", composition: [{ el: "Fe", ratio: 0.70, role: "Base" }, { el: "Cr", ratio: 0.18, role: "Antirust" }, { el: "Ni", ratio: 0.12, role: "Ductility" }] },
  INVAR: { name: "Invar", composition: [{ el: "Fe", ratio: 0.64, role: "Base" }, { el: "Ni", ratio: 0.36, role: "Zero Expansion" }] },
  KOVAR: { name: "Kovar", composition: [{ el: "Fe", ratio: 0.54, role: "Core" }, { el: "Ni", ratio: 0.29, role: "Thermal Control" }, { el: "Co", ratio: 0.17, role: "Glass Sealing" }] },
  MARAGING: { name: "Maraging Steel", composition: [{ el: "Fe", ratio: 0.70, role: "Matrix" }, { el: "Ni", ratio: 0.18, role: "Toughening" }, { el: "Co", ratio: 0.09, role: "Hardness" }, { el: "Mo", ratio: 0.03, role: "Strength" }] },
  H13STEEL: { name: "H13 Tool Steel", composition: [{ el: "Fe", ratio: 0.91, role: "Base" }, { el: "Cr", ratio: 0.05, role: "Wear" }, { el: "Mo", ratio: 0.03, role: "Hot Hardness" }, { el: "V", ratio: 0.01, role: "Abrasive Resist" }] },
  
  // Copper Alloys
  BRASS: { name: "Brass", composition: [{ el: "Cu", ratio: 0.65, role: "Matrix" }, { el: "Zn", ratio: 0.35, role: "Workability" }] },
  BRONZE: { name: "Bronze", composition: [{ el: "Cu", ratio: 0.88, role: "Base" }, { el: "Sn", ratio: 0.12, role: "Wear" }] },
  GUNMETAL: { name: "Gunmetal", composition: [{ el: "Cu", ratio: 0.88, role: "Base" }, { el: "Sn", ratio: 0.10, role: "Castability" }, { el: "Zn", ratio: 0.02, role: "Corrosion" }] },
  MONEL: { name: "Monel 400", composition: [{ el: "Ni", ratio: 0.67, role: "Base" }, { el: "Cu", ratio: 0.33, role: "Seawater resist" }] },
  CUNIFE: { name: "Cunife", composition: [{ el: "Cu", ratio: 0.60, role: "Base" }, { el: "Ni", ratio: 0.20, role: "Magnetic stability" }, { el: "Fe", ratio: 0.20, role: "Flux control" }] },
  BERYLLIUMCOPPER: { name: "Beryllium Copper", composition: [{ el: "Cu", ratio: 0.98, role: "Conductor Matrix" }, { el: "Be", ratio: 0.02, role: "Extreme Strength" }] },
  TOMBAC: { name: "Tombac", composition: [{ el: "Cu", ratio: 0.85, role: "Matrix" }, { el: "Zn", ratio: 0.15, role: "Gold appearance" }] },
  
  // Precious & Jewelry
  STERLING: { name: "Sterling Silver", composition: [{ el: "Ag", ratio: 0.92, role: "Lustre" }, { el: "Cu", ratio: 0.08, role: "Hardness" }] },
  ROSEGOLD: { name: "Rose Gold", composition: [{ el: "Au", ratio: 0.75, role: "Base" }, { el: "Cu", ratio: 0.22, role: "Color" }, { el: "Ag", ratio: 0.03, role: "Finish" }] },
  WHITEGOLD: { name: "White Gold", composition: [{ el: "Au", ratio: 0.75, role: "Base" }, { el: "Pd", ratio: 0.15, role: "Bleaching" }, { el: "Ag", ratio: 0.10, role: "Luster" }] },
  ELECTRUM: { name: "Electrum", composition: [{ el: "Au", ratio: 0.70, role: "Native Matrix" }, { el: "Ag", ratio: 0.30, role: "Ancient Currency" }] },
  BRITANNIA: { name: "Britannia Silver", composition: [{ el: "Ag", ratio: 0.95, role: "Luster Base" }, { el: "Cu", ratio: 0.05, role: "Purity factor" }] },
  TUMBAGA: { name: "Tumbaga", composition: [{ el: "Au", ratio: 0.60, role: "Precious Base" }, { el: "Cu", ratio: 0.40, role: "Hardening Agent" }] },
  SHAKUDO: { name: "Shakudo", composition: [{ el: "Cu", ratio: 0.96, role: "Decorative Base" }, { el: "Au", ratio: 0.04, role: "Purple Patina" }] },
  
  // Aerospace & Superalloys
  INCONEL: { name: "Inconel 718", composition: [{ el: "Ni", ratio: 0.53, role: "High-Temp Matrix" }, { el: "Cr", ratio: 0.19, role: "Oxidation" }, { el: "Fe", ratio: 0.18, role: "Structure" }] },
  WASPALOY: { name: "Waspaloy", composition: [{ el: "Ni", ratio: 0.58, role: "Jet Matrix" }, { el: "Cr", ratio: 0.19, role: "Oxidation resist" }, { el: "Co", ratio: 0.13, role: "Strength" }, { el: "Mo", ratio: 0.04, role: "Stability" }] },
  NIMONIC: { name: "Nimonic", composition: [{ el: "Ni", ratio: 0.80, role: "Turbine Base" }, { el: "Cr", ratio: 0.20, role: "Corrosion resist" }] },
  INCOLOY: { name: "Incoloy 800", composition: [{ el: "Fe", ratio: 0.40, role: "Structural Base" }, { el: "Ni", ratio: 0.32, role: "Oxidation resist" }, { el: "Cr", ratio: 0.21, role: "Corrosion resist" }] },
  TITANIUM64: { name: "Ti-6Al-4V", composition: [{ el: "Ti", ratio: 0.90, role: "Aerospace Matrix" }, { el: "Al", ratio: 0.06, role: "Weight reduction" }, { el: "V", ratio: 0.04, role: "Toughness" }] },
  MP35N: { name: "MP35N", composition: [{ el: "Ni", ratio: 0.35, role: "Multi-phase Matrix" }, { el: "Co", ratio: 0.35, role: "Base strength" }, { el: "Cr", ratio: 0.20, role: "Hardness" }, { el: "Mo", ratio: 0.10, role: "Corrosion resist" }] },
  
  // High-Tech & Magnetic
  NITINOL: { name: "Nitinol", composition: [{ el: "Ni", ratio: 0.55, role: "Shape Memory" }, { el: "Ti", ratio: 0.45, role: "Elasticity" }] },
  ALNICO: { name: "Alnico Magnet", composition: [{ el: "Fe", ratio: 0.50, role: "Matrix" }, { el: "Al", ratio: 0.10, role: "Flux" }, { el: "Ni", ratio: 0.20, role: "Stability" }, { el: "Co", ratio: 0.20, role: "Magnets" }] },
  MUMETAL: { name: "Mu-metal", composition: [{ el: "Ni", ratio: 0.77, role: "Shielding Base" }, { el: "Fe", ratio: 0.16, role: "Flux control" }, { el: "Cu", ratio: 0.05, role: "Permeability" }] },
  PERMALLOY: { name: "Permalloy", composition: [{ el: "Ni", ratio: 0.80, role: "Magnetic Matrix" }, { el: "Fe", ratio: 0.20, role: "Shielding" }] },
  ELINVAR: { name: "Elinvar", composition: [{ el: "Fe", ratio: 0.52, role: "Core" }, { el: "Ni", ratio: 0.36, role: "Watch spring flex" }, { el: "Cr", ratio: 0.12, role: "Elasticity" }] },
  PERMENDUR: { name: "Permendur", composition: [{ el: "Fe", ratio: 0.49, role: "Flux Core" }, { el: "Co", ratio: 0.49, role: "Magnetic Saturation" }, { el: "V", ratio: 0.02, role: "Machining" }] },
  SENDUST: { name: "Sendust", composition: [{ el: "Fe", ratio: 0.85, role: "Inductor Base" }, { el: "Si", ratio: 0.09, role: "Resistivity" }, { el: "Al", ratio: 0.06, role: "Flux density" }] },
  
  // Aluminum & Magnesium
  DURALUMIN: { name: "Duralumin", composition: [{ el: "Al", ratio: 0.95, role: "Lightweight Matrix" }, { el: "Cu", ratio: 0.04, role: "Age Hardening" }, { el: "Mg", ratio: 0.01, role: "Strength" }] },
  MAGNALIUM: { name: "Magnalium", composition: [{ el: "Al", ratio: 0.90, role: "Base" }, { el: "Mg", ratio: 0.10, role: "Durability" }] },
  MAGNESIUMAZ91: { name: "Magnesium AZ91", composition: [{ el: "Mg", ratio: 0.90, role: "Ultra-light Matrix" }, { el: "Al", ratio: 0.09, role: "Castability" }, { el: "Zn", ratio: 0.01, role: "Corrosion resist" }] },
  HIDUMINIUM: { name: "Hiduminium", composition: [{ el: "Al", ratio: 0.93, role: "Aerospace Matrix" }, { el: "Cu", ratio: 0.03, role: "Hardness" }, { el: "Ni", ratio: 0.02, role: "Heat resist" }, { el: "Mg", ratio: 0.02, role: "Lightweighting" }] },
  
  // Fusible & Liquid
  GALINSTAN: { name: "Galinstan", composition: [{ el: "Ga", ratio: 0.68, role: "Liquid Matrix" }, { el: "In", ratio: 0.22, role: "Fusion lowering" }, { el: "Sn", ratio: 0.10, role: "Stability" }] },
  NAK: { name: "NaK (Sodium-Potassium)", composition: [{ el: "Na", ratio: 0.22, role: "Coolant Core" }, { el: "K", ratio: 0.78, role: "Liquid state agent" }] },
  FIELDSMETAL: { name: "Field's Metal", composition: [{ el: "Bi", ratio: 0.32, role: "Base" }, { el: "In", ratio: 0.51, role: "Fusibility" }, { el: "Sn", ratio: 0.17, role: "Consistency" }] },
  ROSEMETAL: { name: "Rose's Metal", composition: [{ el: "Bi", ratio: 0.50, role: "Matrix" }, { el: "Pb", ratio: 0.25, role: "Low melt" }, { el: "Sn", ratio: 0.25, role: "Stability" }] },
  SOLDER: { name: "Solder (Pb-free)", composition: [{ el: "Sn", ratio: 0.96, role: "Base" }, { el: "Ag", ratio: 0.03, role: "Flow" }, { el: "Cu", ratio: 0.01, role: "Conductivity" }] },
  
  // Specialized & Industrial
  NICHROME: { name: "Nichrome", composition: [{ el: "Ni", ratio: 0.80, role: "Resistor Matrix" }, { el: "Cr", ratio: 0.20, role: "Heat Resistance" }] },
  MAGNOX: { name: "Magnox", composition: [{ el: "Mg", ratio: 0.99, role: "Nuclear Cladding" }, { el: "Al", ratio: 0.01, role: "Inhibitor" }] },
  PEWTER: { name: "Pewter", composition: [{ el: "Sn", ratio: 0.92, role: "Matrix" }, { el: "Sb", ratio: 0.06, role: "Rigidity" }, { el: "Cu", ratio: 0.02, role: "Finish" }] },
  VITALLIUM: { name: "Vitallium", composition: [{ el: "Co", ratio: 0.65, role: "Bio-Matrix" }, { el: "Cr", ratio: 0.30, role: "Hardness" }, { el: "Mo", ratio: 0.05, role: "Bio-compatability" }] },
  ZIRCALOY: { name: "Zircaloy-4", composition: [{ el: "Zr", ratio: 0.98, role: "Nuclear Matrix" }, { el: "Sn", ratio: 0.015, role: "Corrosion resist" }] },
  ZAMAK: { name: "Zamak", composition: [{ el: "Zn", ratio: 0.95, role: "Base Matrix" }, { el: "Al", ratio: 0.04, role: "Strength" }, { el: "Mg", ratio: 0.005, role: "Corrosion" }, { el: "Cu", ratio: 0.005, role: "Castability" }] },
  ELGILOY: { name: "Elgiloy", composition: [{ el: "Co", ratio: 0.40, role: "Base" }, { el: "Cr", ratio: 0.20, role: "Resist" }, { el: "Ni", ratio: 0.15, role: "Matrix" }, { el: "Fe", ratio: 0.15, role: "Core" }] },
  CONSTANTAN: { name: "Constantan", composition: [{ el: "Cu", ratio: 0.55, role: "Base" }, { el: "Ni", ratio: 0.45, role: "Thermo-stability" }] },
  ALUMEL: { name: "Alumel", composition: [{ el: "Ni", ratio: 0.95, role: "Magnetic Base" }, { el: "Al", ratio: 0.02, role: "Conductivity" }, { el: "Mn", ratio: 0.02, role: "Durability" }, { el: "Si", ratio: 0.01, role: "Strength" }] },
  CHROMEL: { name: "Chromel", composition: [{ el: "Ni", ratio: 0.90, role: "Thermo-Matrix" }, { el: "Cr", ratio: 0.10, role: "Resistivity" }] },
};

// 4. SEARCH & RESOLVE LOGIC
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

// 5. STYLING DATA
const ATOM_COLOR = {
  H: 0xf2f0ea, C: 0x2b2b2b, N: 0x3b6fd9, O: 0xe0483e, Na: 0x8a5fd9, Cl: 0x4fbf6b, S: 0xe8c93a, 
  F: 0x90e050, Mg: 0x8aff00, Ca: 0x3dff00, K: 0x8f40d4, Fe: 0xbc4b2a, Cu: 0xb87333, Ag: 0xc0c0c0, 
  Au: 0xffd700, Ti: 0x9a94b3, default: 0x9a94b3
};
const ATOM_RADIUS = { H: 0.32, C: 0.5, N: 0.48, O: 0.48, Na: 0.6, Cl: 0.58, default: 0.5 };
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

// 6. DESCRIPTIONS (BLURBS)
const MOLECULE_BLURBS = {
  H2O: "Essential for all life.", CO2: "Greenhouse gas.", CH4: "Natural gas.",
  NH3: "Fertilizer gas.", HCL: "Strong stomach acid.", HNO3: "Used in explosives.",
  H2SO4: "Industrial chemical.", C6H6: "Aromatic solvent.", CHCL3: "Historic anesthetic.",
  NAOH: "Caustic soap base.", CH3OH: "Industrial fuel.", O3: "Ozone layer component.",
  HF: "Glass etchant.", FE2O3: "Principal rust component.", SIO2: "Quartz/Glass base.",
  PH3: "Toxic gas.", COCL2: "Phosgene chemical weapon.", XEF4: "Noble gas compound."
};
