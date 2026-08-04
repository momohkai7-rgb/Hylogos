/* ===================== MatAI COMPLETE DATABASE ===================== */

// 1. FULL ELEMENT LIST (1-118)
const ELEMENTS = {
  H: { z:1, name:"Hydrogen", shells:[1], category:"nonmetal", mass:1.008, melt:-259, boil:-253, density:0.08988, densityUnit:"g/L", phase:"Gas", en:2.2, blurb:"The simplest and most abundant element in the universe." },
  He: { z:2, name:"Helium", shells:[2], category:"noble-gas", mass:4.003, melt:-272, boil:-269, density:0.1786, densityUnit:"g/L", phase:"Gas", en:null, blurb:"Second most abundant element; mined from natural gas." },
  Li: { z:3, name:"Lithium", shells:[2,1], category:"alkali", mass:6.94, melt:180, boil:1330, density:0.534, densityUnit:"g/cm³", phase:"Solid", en:0.98, blurb:"Lightest metal; powers modern rechargeable batteries." },
  Be: { z:4, name:"Beryllium", shells:[2,2], category:"alkaline-earth", mass:9.012, melt:1287, boil:2469, density:1.85, densityUnit:"g/cm³", phase:"Solid", en:1.57, blurb:"A lightweight, toxic metal used in aerospace and X-ray windows." },
  B: { z:5, name:"Boron", shells:[2,3], category:"metalloid", mass:10.81, melt:2076, boil:3927, density:2.08, densityUnit:"g/cm³", phase:"Solid", en:2.04, blurb:"Used in high-strength Pyrex glass and detergents." },
  C: { z:6, name:"Carbon", shells:[2,4], category:"nonmetal", mass:12.011, melt:null, boil:null, density:2.267, densityUnit:"g/cm³", phase:"Solid", en:2.55, blurb:"The foundation of all known life and organic chemistry." },
  N: { z:7, name:"Nitrogen", shells:[2,5], category:"nonmetal", mass:14.007, melt:-210, boil:-196, density:1.251, densityUnit:"g/L", phase:"Gas", en:3.04, blurb:"Makes up 78% of the air you are breathing." },
  O: { z:8, name:"Oxygen", shells:[2,6], category:"nonmetal", mass:15.999, melt:-219, boil:-183, density:1.429, densityUnit:"g/L", phase:"Gas", en:3.44, blurb:"Most abundant element in Earth's crust; vital for life." },
  F: { z:9, name:"Fluorine", shells:[2,7], category:"halogen", mass:18.998, melt:-220, boil:-188, density:1.696, densityUnit:"g/L", phase:"Gas", en:3.98, blurb:"The most reactive nonmetal on the periodic table." },
  Ne: { z:10, name:"Neon", shells:[2,8], category:"noble-gas", mass:20.18, melt:-249, boil:-246, density:0.9002, densityUnit:"g/L", phase:"Gas", en:null, blurb:"Famous for its bright reddish-orange glow in vacuum tubes." },
  Na: { z:11, name:"Sodium", shells:[2,8,1], category:"alkali", mass:22.99, melt:98, boil:883, density:0.968, densityUnit:"g/cm³", phase:"Solid", en:0.93, blurb:"Explosively reactive; found in table salt (NaCl)." },
  Mg: { z:12, name:"Magnesium", shells:[2,8,2], category:"alkaline-earth", mass:24.305, melt:650, boil:1090, density:1.738, densityUnit:"g/cm³", phase:"Solid", en:1.31, blurb:"Burns with bright white light; used in fireworks." },
  Al: { z:13, name:"Aluminium", shells:[2,8,3], category:"post-metal", mass:26.982, melt:660, boil:2470, density:2.7, densityUnit:"g/cm³", phase:"Solid", en:1.61, blurb:"Light, recyclable, and corrosion-resistant metal." },
  Si: { z:14, name:"Silicon", shells:[2,8,4], category:"metalloid", mass:28.085, melt:1414, boil:3265, density:2.329, densityUnit:"g/cm³", phase:"Solid", en:1.9, blurb:"Primary semiconductor used in all computer chips." },
  P: { z:15, name:"Phosphorus", shells:[2,8,5], category:"nonmetal", mass:30.974, melt:44, boil:281, density:1.823, densityUnit:"g/cm³", phase:"Solid", en:2.19, blurb:"Essential for DNA and cellular energy (ATP)." },
  S: { z:16, name:"Sulfur", shells:[2,8,6], category:"nonmetal", mass:32.06, melt:115, boil:445, density:2.07, densityUnit:"g/cm³", phase:"Solid", en:2.58, blurb:"Yellow nonmetal; used to make sulfuric acid." },
  Cl: { z:17, name:"Chlorine", shells:[2,8,7], category:"halogen", mass:35.45, melt:-102, boil:-34, density:3.2, densityUnit:"g/L", phase:"Gas", en:3.16, blurb:"Toxic green gas used as a disinfectant." },
  Ar: { z:18, name:"Argon", shells:[2,8,8], category:"noble-gas", mass:39.948, melt:-189, boil:-186, density:1.784, densityUnit:"g/L", phase:"Gas", en:null, blurb:"Inert gas used in lighting and double-pane windows." },
  K: { z:19, name:"Potassium", shells:[2,8,8,1], category:"alkali", mass:39.098, melt:64, boil:759, density:0.862, densityUnit:"g/cm³", phase:"Solid", en:0.82, blurb:"Vital for nerve function; found in bananas." },
  Ca: { z:20, name:"Calcium", shells:[2,8,8,2], category:"alkaline-earth", mass:40.078, melt:842, boil:1484, density:1.55, densityUnit:"g/cm³", phase:"Solid", en:1, blurb:"The main material in bones, teeth, and shells." },
  Sc: { z:21, name:"Scandium", shells:[2,8,9,2], category:"transition", mass:44.956, melt:1541, boil:2836, density:2.985, densityUnit:"g/cm³", phase:"Solid", en:1.36, blurb:"Used in high-strength aerospace alloys." },
  Ti: { z:22, name:"Titanium", shells:[2,8,10,2], category:"transition", mass:47.867, melt:1668, boil:3287, density:4.506, densityUnit:"g/cm³", phase:"Solid", en:1.54, blurb:"Strong as steel but 45% lighter." },
  V: { z:23, name:"Vanadium", shells:[2,8,11,2], category:"transition", mass:50.942, melt:1910, boil:3407, density:6, densityUnit:"g/cm³", phase:"Solid", en:1.63, blurb:"Used to strengthen steel in tools and engines." },
  Cr: { z:24, name:"Chromium", shells:[2,8,13,1], category:"transition", mass:51.996, melt:1907, boil:2671, density:7.19, densityUnit:"g/cm³", phase:"Solid", en:1.66, blurb:"Provides the shine and rust-resistance to stainless steel." },
  Mn: { z:25, name:"Manganese", shells:[2,8,13,2], category:"transition", mass:54.938, melt:1246, boil:2061, density:7.21, densityUnit:"g/cm³", phase:"Solid", en:1.55, blurb:"Essential for steelmaking and clear glass production." },
  Fe: { z:26, name:"Iron", shells:[2,8,14,2], category:"transition", mass:55.845, melt:1538, boil:2861, density:7.874, densityUnit:"g/cm³", phase:"Solid", en:1.83, blurb:"The most common element on Earth by mass." },
  Co: { z:27, name:"Cobalt", shells:[2,8,15,2], category:"transition", mass:58.933, melt:1495, boil:2927, density:8.9, densityUnit:"g/cm³", phase:"Solid", en:1.88, blurb:"Gives ceramics a deep blue color; used in batteries." },
  Ni: { z:28, name:"Nickel", shells:[2,8,16,2], category:"transition", mass:58.693, melt:1455, boil:2730, density:8.908, densityUnit:"g/cm³", phase:"Solid", en:1.91, blurb:"Used in coins and stainless steel." },
  Cu: { z:29, name:"Copper", shells:[2,8,18,1], category:"transition", mass:63.546, melt:1085, boil:2562, density:8.96, densityUnit:"g/cm³", phase:"Solid", en:1.9, blurb:"High conductivity; one of the few colored metals." },
  Zn: { z:30, name:"Zinc", shells:[2,8,18,2], category:"transition", mass:65.382, melt:420, boil:907, density:7.14, densityUnit:"g/cm³", phase:"Solid", en:1.65, blurb:"Used to galvanize steel to prevent rusting." },
  Ga: { z:31, name:"Gallium", shells:[2,8,18,3], category:"post-metal", mass:69.723, melt:30, boil:2400, density:5.91, densityUnit:"g/cm³", phase:"Solid", en:1.81, blurb:"Melts in your hand; used in blue LEDs." },
  Ge: { z:32, name:"Germanium", shells:[2,8,18,4], category:"metalloid", mass:72.631, melt:938, boil:2833, density:5.323, densityUnit:"g/cm³", phase:"Solid", en:2.01, blurb:"The first semiconductor material used for transistors." },
  As: { z:33, name:"Arsenic", shells:[2,8,18,5], category:"metalloid", mass:74.922, melt:null, boil:615, density:5.727, densityUnit:"g/cm³", phase:"Solid", en:2.18, blurb:"Famous as a poison; also used in wood preservatives." },
  Se: { z:34, name:"Selenium", shells:[2,8,18,6], category:"nonmetal", mass:78.972, melt:221, boil:685, density:4.81, densityUnit:"g/cm³", phase:"Solid", en:2.55, blurb:"Used in glass making and light-sensitive cells." },
  Br: { z:35, name:"Bromine", shells:[2,8,18,7], category:"halogen", mass:79.904, melt:-7, boil:59, density:3.1028, densityUnit:"g/cm³", phase:"Liquid", en:2.96, blurb:"A corrosive, deep-red liquid at room temperature." },
  Kr: { z:36, name:"Krypton", shells:[2,8,18,8], category:"noble-gas", mass:83.798, melt:-157, boil:-153, density:3.749, densityUnit:"g/L", phase:"Gas", en:3, blurb:"Used in specialty lighting and flashbulbs." },
  Rb: { z:37, name:"Rubidium", shells:[2,8,18,8,1], category:"alkali", mass:85.468, melt:39, boil:688, density:1.532, densityUnit:"g/cm³", phase:"Solid", en:0.82, blurb:"Highly reactive alkali metal; used in atomic clocks." },
  Sr: { z:38, name:"Strontium", shells:[2,8,18,8,2], category:"alkaline-earth", mass:87.621, melt:777, boil:1377, density:2.64, densityUnit:"g/cm³", phase:"Solid", en:0.95, blurb:"Gives fireworks their brilliant red color." },
  Y: { z:39, name:"Yttrium", shells:[2,8,18,9,2], category:"transition", mass:88.906, melt:1526, boil:2930, density:4.472, densityUnit:"g/cm³", phase:"Solid", en:1.22, blurb:"Used in white LEDs and superconductors." },
  Zr: { z:40, name:"Zirconium", shells:[2,8,18,10,2], category:"transition", mass:91.224, melt:1855, boil:4377, density:6.52, densityUnit:"g/cm³", phase:"Solid", en:1.33, blurb:"Highly corrosion resistant; used in nuclear reactors." },
  Nb: { z:41, name:"Niobium", shells:[2,8,18,12,1], category:"transition", mass:92.906, melt:2477, boil:4744, density:8.57, densityUnit:"g/cm³", phase:"Solid", en:1.6, blurb:"Used in superconducting magnets for MRIs." },
  Mo: { z:42, name:"Molybdenum", shells:[2,8,18,13,1], category:"transition", mass:95.951, melt:2623, boil:4639, density:10.28, densityUnit:"g/cm³", phase:"Solid", en:2.16, blurb:"Used to make ultra-high strength steel." },
  Tc: { z:43, name:"Technetium", shells:[2,8,18,13,2], category:"transition", mass:98, melt:2157, boil:4265, density:11, densityUnit:"g/cm³", phase:"Solid", en:1.9, blurb:"First element to be produced artificially." },
  Ru: { z:44, name:"Ruthenium", shells:[2,8,18,15,1], category:"transition", mass:101.072, melt:2334, boil:4150, density:12.45, densityUnit:"g/cm³", phase:"Solid", en:2.2, blurb:"Platinum-group metal used in electrical contacts." },
  Rh: { z:45, name:"Rhodium", shells:[2,8,18,16,1], category:"transition", mass:102.906, melt:1964, boil:3695, density:12.41, densityUnit:"g/cm³", phase:"Solid", en:2.28, blurb:"One of the rarest and most expensive metals." },
  Pd: { z:46, name:"Palladium", shells:[2,8,18,18], category:"transition", mass:106.421, melt:1555, boil:2963, density:12.023, densityUnit:"g/cm³", phase:"Solid", en:2.2, blurb:"Absorbs 900 times its volume in hydrogen." },
  Ag: { z:47, name:"Silver", shells:[2,8,18,18,1], category:"transition", mass:107.868, melt:962, boil:2162, density:10.49, densityUnit:"g/cm³", phase:"Solid", en:1.93, blurb:"Best reflector of visible light." },
  Cd: { z:48, name:"Cadmium", shells:[2,8,18,18,2], category:"transition", mass:112.414, melt:321, boil:767, density:8.65, densityUnit:"g/cm³", phase:"Solid", en:1.69, blurb:"Toxic metal used in older rechargeable batteries." },
  In: { z:49, name:"Indium", shells:[2,8,18,18,3], category:"post-metal", mass:114.818, melt:157, boil:2072, density:7.31, densityUnit:"g/cm³", phase:"Solid", en:1.78, blurb:"Soft metal used in touchscreens (ITO)." },
  Sn: { z:50, name:"Tin", shells:[2,8,18,18,4], category:"post-metal", mass:118.711, melt:232, boil:2602, density:7.365, densityUnit:"g/cm³", phase:"Solid", en:1.96, blurb:"Used for millennia to create Bronze." },
  Sb: { z:51, name:"Antimony", shells:[2,8,18,18,5], category:"metalloid", mass:121.76, melt:631, boil:1635, density:6.697, densityUnit:"g/cm³", phase:"Solid", en:2.05, blurb:"Used in lead-acid batteries and flame retardants." },
  Te: { z:52, name:"Tellurium", shells:[2,8,18,18,6], category:"metalloid", mass:127.603, melt:450, boil:988, density:6.24, densityUnit:"g/cm³", phase:"Solid", en:2.1, blurb:"One of the rarest stable solid elements." },
  I: { z:53, name:"Iodine", shells:[2,8,18,18,7], category:"halogen", mass:126.904, melt:114, boil:184, density:4.933, densityUnit:"g/cm³", phase:"Solid", en:2.66, blurb:"Sublimes into a purple vapor; vital for thyroid health." },
  Xe: { z:54, name:"Xenon", shells:[2,8,18,18,8], category:"noble-gas", mass:131.294, melt:-112, boil:-108, density:5.894, densityUnit:"g/L", phase:"Gas", en:2.6, blurb:"Used in high-speed flash photography." },
  Cs: { z:55, name:"Cesium", shells:[2,8,18,18,8,1], category:"alkali", mass:132.905, melt:29, boil:671, density:1.93, densityUnit:"g/cm³", phase:"Solid", en:0.79, blurb:"The most reactive stable metal; used in atomic clocks." },
  Ba: { z:56, name:"Barium", shells:[2,8,18,18,8,2], category:"alkaline-earth", mass:137.328, melt:727, boil:1845, density:3.51, densityUnit:"g/cm³", phase:"Solid", en:0.89, blurb:"Used as a contrast agent in X-ray imaging." },
  La: { z:57, name:"Lanthanum", shells:[2,8,18,18,9,2], category:"lanthanide", mass:138.905, melt:920, boil:3464, density:6.162, densityUnit:"g/cm³", phase:"Solid", en:1.1, blurb:"Found in hybrid car batteries and camera lenses." },
  Ce: { z:58, name:"Cerium", shells:[2,8,18,19,9,2], category:"lanthanide", mass:140.116, melt:795, boil:3443, density:6.77, densityUnit:"g/cm³", phase:"Solid", en:1.12, blurb:"Most abundant rare-earth metal." },
  Pr: { z:59, name:"Praseodymium", shells:[2,8,18,21,8,2], category:"lanthanide", mass:140.908, melt:935, boil:3130, density:6.77, densityUnit:"g/cm³", phase:"Solid", en:1.13, blurb:"Used to make high-strength magnets." },
  Nd: { z:60, name:"Neodymium", shells:[2,8,18,22,8,2], category:"lanthanide", mass:144.242, melt:1024, boil:3074, density:7.01, densityUnit:"g/cm³", phase:"Solid", en:1.14, blurb:"Used to make the strongest permanent magnets." },
  Pm: { z:61, name:"Promethium", shells:[2,8,18,23,8,2], category:"lanthanide", mass:145, melt:1042, boil:3000, density:7.26, densityUnit:"g/cm³", phase:"Solid", en:1.13, blurb:"Used in nuclear-powered batteries." },
  Sm: { z:62, name:"Samarium", shells:[2,8,18,24,8,2], category:"lanthanide", mass:150.362, melt:1072, boil:1900, density:7.52, densityUnit:"g/cm³", phase:"Solid", en:1.17, blurb:"Used in high-temperature magnets." },
  Eu: { z:63, name:"Europium", shells:[2,8,18,25,8,2], category:"lanthanide", mass:151.964, melt:826, boil:1529, density:5.264, densityUnit:"g/cm³", phase:"Solid", en:1.2, blurb:"Makes the red color in TV and phone screens." },
  Gd: { z:64, name:"Gadolinium", shells:[2,8,18,25,9,2], category:"lanthanide", mass:157.253, melt:1312, boil:3000, density:7.9, densityUnit:"g/cm³", phase:"Solid", en:1.2, blurb:"Used as a contrast agent for MRI scans." },
  Tb: { z:65, name:"Terbium", shells:[2,8,18,27,8,2], category:"lanthanide", mass:158.925, melt:1356, boil:3123, density:8.23, densityUnit:"g/cm³", phase:"Solid", en:1.1, blurb:"Used in solid-state devices and fuel cells." },
  Dy: { z:66, name:"Dysprosium", shells:[2,8,18,28,8,2], category:"lanthanide", mass:162.5, melt:1407, boil:2567, density:8.54, densityUnit:"g/cm³", phase:"Solid", en:1.22, blurb:"Used in laser materials and hard disks." },
  Ho: { z:67, name:"Holmium", shells:[2,8,18,29,8,2], category:"lanthanide", mass:164.93, melt:1461, boil:2600, density:8.79, densityUnit:"g/cm³", phase:"Solid", en:1.23, blurb:"Has the highest magnetic strength." },
  Er: { z:68, name:"Erbium", shells:[2,8,18,30,8,2], category:"lanthanide", mass:167.259, melt:1529, boil:2868, density:9.066, densityUnit:"g/cm³", phase:"Solid", en:1.24, blurb:"Used in fiber-optic cable amplifiers." },
  Tm: { z:69, name:"Thulium", shells:[2,8,18,31,8,2], category:"lanthanide", mass:168.934, melt:1545, boil:1950, density:9.32, densityUnit:"g/cm³", phase:"Solid", en:1.25, blurb:"The rarest of the rare-earth metals." },
  Yb: { z:70, name:"Ytterbium", shells:[2,8,18,32,8,2], category:"lanthanide", mass:173.045, melt:824, boil:1196, density:6.9, densityUnit:"g/cm³", phase:"Solid", en:1.1, blurb:"Used in portable X-ray machines." },
  Lu: { z:71, name:"Lutetium", shells:[2,8,18,32,9,2], category:"lanthanide", mass:174.967, melt:1652, boil:3402, density:9.841, densityUnit:"g/cm³", phase:"Solid", en:1.27, blurb:"Densest and hardest lanthanide." },
  Hf: { z:72, name:"Hafnium", shells:[2,8,18,32,10,2], category:"transition", mass:178.492, melt:2233, boil:4603, density:13.31, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"Used in nuclear control rods." },
  Ta: { z:73, name:"Tantalum", shells:[2,8,18,32,11,2], category:"transition", mass:180.948, melt:3017, boil:5458, density:16.69, densityUnit:"g/cm³", phase:"Solid", en:1.5, blurb:"Used in tiny capacitors inside smartphones." },
  W: { z:74, name:"Tungsten", shells:[2,8,18,32,12,2], category:"transition", mass:183.841, melt:3422, boil:5930, density:19.25, densityUnit:"g/cm³", phase:"Solid", en:2.36, blurb:"Highest melting point of any metal." },
  Re: { z:75, name:"Rhenium", shells:[2,8,18,32,13,2], category:"transition", mass:186.207, melt:3186, boil:5596, density:21.02, densityUnit:"g/cm³", phase:"Solid", en:1.9, blurb:"Used in high-temperature jet engine parts." },
  Os: { z:76, name:"Osmium", shells:[2,8,18,32,14,2], category:"transition", mass:190.233, melt:3033, boil:5012, density:22.59, densityUnit:"g/cm³", phase:"Solid", en:2.2, blurb:"Densest naturally occurring element." },
  Ir: { z:77, name:"Iridium", shells:[2,8,18,32,15,2], category:"transition", mass:192.217, melt:2446, boil:4130, density:22.56, densityUnit:"g/cm³", phase:"Solid", en:2.2, blurb:"Most corrosion-resistant metal." },
  Pt: { z:78, name:"Platinum", shells:[2,8,18,32,17,1], category:"transition", mass:195.085, melt:1768, boil:3825, density:21.45, densityUnit:"g/cm³", phase:"Solid", en:2.28, blurb:"Used in jewelry and catalytic converters." },
  Au: { z:79, name:"Gold", shells:[2,8,18,32,18,1], category:"transition", mass:196.967, melt:1064, boil:2970, density:19.3, densityUnit:"g/cm³", phase:"Solid", en:2.54, blurb:"Prized noble metal that never tarnishes." },
  Hg: { z:80, name:"Mercury", shells:[2,8,18,32,18,2], category:"transition", mass:200.592, melt:-39, boil:357, density:13.534, densityUnit:"g/cm³", phase:"Liquid", en:2, blurb:"Only metal that is liquid at room temperature." },
  Tl: { z:81, name:"Thallium", shells:[2,8,18,32,18,3], category:"post-metal", mass:204.38, melt:304, boil:1473, density:11.85, densityUnit:"g/cm³", phase:"Solid", en:1.62, blurb:"Highly toxic metal once used as rat poison." },
  Pb: { z:82, name:"Lead", shells:[2,8,18,32,18,4], category:"post-metal", mass:207.21, melt:327, boil:1749, density:11.34, densityUnit:"g/cm³", phase:"Solid", en:1.87, blurb:"Dense metal used for radiation shielding." },
  Bi: { z:83, name:"Bismuth", shells:[2,8,18,32,18,5], category:"post-metal", mass:208.98, melt:272, boil:1564, density:9.78, densityUnit:"g/cm³", phase:"Solid", en:2.02, blurb:"Used in stomach medicines and cosmetics." },
  Po: { z:84, name:"Polonium", shells:[2,8,18,32,18,6], category:"post-metal", mass:209, melt:254, boil:962, density:9.196, densityUnit:"g/cm³", phase:"Solid", en:2, blurb:"Extremely radioactive metal discovered by Marie Curie." },
  At: { z:85, name:"Astatine", shells:[2,8,18,32,18,7], category:"halogen", mass:210, melt:302, boil:337, density:6.35, densityUnit:"g/cm³", phase:"Solid", en:2.2, blurb:"The rarest naturally occurring element." },
  Rn: { z:86, name:"Radon", shells:[2,8,18,32,18,8], category:"noble-gas", mass:222, melt:-71, boil:-62, density:9.73, densityUnit:"g/L", phase:"Gas", en:2.2, blurb:"Radioactive gas that can seep into houses." },
  Fr: { z:87, name:"Francium", shells:[2,8,18,32,18,8,1], category:"alkali", mass:223, melt:27, boil:677, density:1.87, densityUnit:"g/cm³", phase:"Solid", en:0.79, blurb:"The least electronegative element." },
  Ra: { z:88, name:"Radium", shells:[2,8,18,32,18,8,2], category:"alkaline-earth", mass:226, melt:960, boil:1737, density:5.5, densityUnit:"g/cm³", phase:"Solid", en:0.9, blurb:"Used to make glow-in-the-dark watch dials." },
  Ac: { z:89, name:"Actinium", shells:[2,8,18,32,18,9,2], category:"actinide", mass:227, melt:1227, boil:3227, density:10, densityUnit:"g/cm³", phase:"Solid", en:1.1, blurb:"Rare radioactive metal that glows blue." },
  Th: { z:90, name:"Thorium", shells:[2,8,18,32,18,10,2], category:"actinide", mass:232.038, melt:1750, boil:4788, density:11.724, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"Candidate fuel for next-gen nuclear reactors." },
  Pa: { z:91, name:"Protactinium", shells:[2,8,18,32,20,9,2], category:"actinide", mass:231.036, melt:1568, boil:4027, density:15.37, densityUnit:"g/cm³", phase:"Solid", en:1.5, blurb:"Very rare radioactive metal found in uranium ores." },
  U: { z:92, name:"Uranium", shells:[2,8,18,32,21,9,2], category:"actinide", mass:238.029, melt:1132, boil:4131, density:19.1, densityUnit:"g/cm³", phase:"Solid", en:1.38, blurb:"Principal fuel used in nuclear power plants." },
  Np: { z:93, name:"Neptunium", shells:[2,8,18,32,22,9,2], category:"actinide", mass:237, melt:639, boil:4174, density:20.45, densityUnit:"g/cm³", phase:"Solid", en:1.36, blurb:"Transuranic metal used in neutron detectors." },
  Pu: { z:94, name:"Plutonium", shells:[2,8,18,32,24,8,2], category:"actinide", mass:244, melt:639, boil:3232, density:19.816, densityUnit:"g/cm³", phase:"Solid", en:1.28, blurb:"Key ingredient in modern nuclear weapons." },
  Am: { z:95, name:"Americium", shells:[2,8,18,32,25,8,2], category:"actinide", mass:243, melt:1176, boil:2607, density:12, densityUnit:"g/cm³", phase:"Solid", en:1.13, blurb:"Radioactive source used in smoke detectors." },
  Cm: { z:96, name:"Curium", shells:[2,8,18,32,25,9,2], category:"actinide", mass:247, melt:1340, boil:3110, density:13.51, densityUnit:"g/cm³", phase:"Solid", en:1.28, blurb:"Alpha-emitter used to power spacecraft tools." },
  Bk: { z:97, name:"Berkelium", shells:[2,8,18,32,27,8,2], category:"actinide", mass:247, melt:986, boil:2627, density:14.78, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"Rare radioactive metal produced in labs." },
  Cf: { z:98, name:"Californium", shells:[2,8,18,32,28,8,2], category:"actinide", mass:251, melt:900, boil:1470, density:15.1, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"Strong neutron emitter used in sensors." },
  Es: { z:99, name:"Einsteinium", shells:[2,8,18,32,29,8,2], category:"actinide", mass:252, melt:860, boil:996, density:8.84, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"Discovered in debris from the first H-bomb test." },
  Fm: { z:100, name:"Fermium", shells:[2,8,18,32,30,8,2], category:"actinide", mass:257, melt:1527, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"Heaviest element that can be made by neutron bombardment." },
  Md: { z:101, name:"Mendelevium", shells:[2,8,18,32,31,8,2], category:"actinide", mass:258, melt:827, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"Named after the creator of the periodic table." },
  No: { z:102, name:"Nobelium", shells:[2,8,18,32,32,8,2], category:"actinide", mass:259, melt:827, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"Named after the founder of the Nobel Prizes." },
  Lr: { z:103, name:"Lawrencium", shells:[2,8,18,32,32,8,3], category:"actinide", mass:266, melt:1627, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, blurb:"The final element in the actinide series." },
  Rf: { z:104, name:"Rutherfordium", shells:[2,8,18,32,32,10,2], category:"transition", mass:267, melt:2127, boil:5527, density:23.2, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"The first transactinide element." },
  Db: { z:105, name:"Dubnium", shells:[2,8,18,32,32,11,2], category:"transition", mass:268, melt:null, boil:null, density:29.3, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after the research lab in Dubna, Russia." },
  Sg: { z:106, name:"Seaborgium", shells:[2,8,18,32,32,12,2], category:"transition", mass:269, melt:null, boil:null, density:35, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after nuclear chemist Glenn Seaborg." },
  Bh: { z:107, name:"Bohrium", shells:[2,8,18,32,32,13,2], category:"transition", mass:270, melt:null, boil:null, density:37.1, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after quantum physicist Niels Bohr." },
  Hs: { z:108, name:"Hassium", shells:[2,8,18,32,32,14,2], category:"transition", mass:269, melt:-147, boil:null, density:40.7, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after the German state of Hesse." },
  Mt: { z:109, name:"Meitnerium", shells:[2,8,18,32,32,15,2], category:"transition", mass:278, melt:null, boil:null, density:37.4, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after physicist Lise Meitner." },
  Ds: { z:110, name:"Darmstadtium", shells:[2,8,18,32,32,16,2], category:"transition", mass:281, melt:null, boil:null, density:34.8, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after the city of Darmstadt, Germany." },
  Rg: { z:111, name:"Roentgenium", shells:[2,8,18,32,32,17,2], category:"transition", mass:282, melt:null, boil:null, density:28.7, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after Wilhelm Roentgen, discoverer of X-rays." },
  Cn: { z:112, name:"Copernicium", shells:[2,8,18,32,32,18,2], category:"transition", mass:285, melt:null, boil:3297, density:14.0, densityUnit:"g/cm³", phase:"Liquid", en:null, blurb:"Named after astronomer Nicolaus Copernicus." },
  Nh: { z:113, name:"Nihonium", shells:[2,8,18,32,32,18,3], category:"transition", mass:286, melt:427, boil:1157, density:16, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after Japan (Nihon)." },
  Fl: { z:114, name:"Flerovium", shells:[2,8,18,32,32,18,4], category:"post-metal", mass:289, melt:67, boil:147, density:14, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after the Flerov Laboratory in Russia." },
  Mc: { z:115, name:"Moscovium", shells:[2,8,18,32,32,18,5], category:"post-metal", mass:289, melt:397, boil:1127, density:13.5, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after the Moscow region." },
  Lv: { z:116, name:"Livermorium", shells:[2,8,18,32,32,18,6], category:"post-metal", mass:293, melt:436, boil:812, density:12.9, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after Lawrence Livermore National Lab." },
  Ts: { z:117, name:"Tennessine", shells:[2,8,18,32,32,18,7], category:"halogen", mass:294, melt:450, boil:610, density:7.17, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after the state of Tennessee." },
  Og: { z:118, name:"Oganesson", shells:[2,8,18,32,32,18,8], category:"noble-gas", mass:294, melt:null, boil:77, density:4.95, densityUnit:"g/cm³", phase:"Solid", en:null, blurb:"Named after nuclear physicist Yuri Oganessian." },
};

const ATOM_COLOR = {
  H: 0xf2f0ea, C: 0x2b2b2b, N: 0x3b6fd9, O: 0xe0483e, Na: 0x8a5fd9, Cl: 0x4fbf6b, S: 0xe8c93a, 
  F: 0x90e050, Mg: 0x8aff00, Ca: 0x3dff00, K: 0x8f40d4, Fe: 0xbc4b2a, Cu: 0xb87333, Ag: 0xc0c0c0, 
  Au: 0xffd700, default: 0x9a94b3,
};

const ATOM_RADIUS = {
  H: 0.32, C: 0.5, N: 0.48, O: 0.48, Na: 0.6, Cl: 0.58, S: 0.55, F: 0.42, default: 0.5,
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
  "actinide": { label: "Actinide", color: "#ff7043" },
};

const MOLECULE_BLURBS = {
  H2O: "The universal solvent — its bent, polar shape lets it dissolve more substances than any other liquid.",
  CO2: "A greenhouse gas produced by respiration and combustion; vital for photosynthesis.",
  CH4: "The simplest hydrocarbon; main component of natural gas and a potent greenhouse gas.",
  NH3: "Pungent gas used in fertilizers, cleaning products, and refrigeration.",
  HCL: "Dissolved in water it becomes hydrochloric acid, found naturally in stomach acid.",
  HNO3: "Highly corrosive mineral acid used in fertilizers and rocket fuels.",
  H2SO4: "Used in lead-acid batteries and mineral processing; known as the king of chemicals.",
  C6H6: "A ring-shaped aromatic hydrocarbon found in crude oil and gasoline.",
  CHCL3: "Historically used as an anesthetic during surgery.",
  HF: "Used to etch glass; extremely dangerous as it penetrates skin and bone.",
  O3: "Protects Earth's surface from harmful UV radiation in the stratosphere.",
  H2S: "Smells like rotten eggs; highly toxic and flammable gas.",
  SO2: "Released by volcanoes and factories; a primary cause of acid rain.",
  NO2: "A reddish-brown air pollutant emitted primarily from car engines.",
  N2O: "Known as 'laughing gas'; used as a mild anesthetic and engine booster.",
  NAOH: "Known as lye or caustic soda; used in soap making and drain cleaners.",
  CH3OH: "Wood alcohol; used as an industrial solvent and racing fuel.",
  C2H2: "Fuel used in welding torches due to its extremely hot flame.",
  C3H8: "Propane; common fuel for heating, cooking, and portable grills.",
  C4H10: "Butane; used as a fuel in lighters and camping stoves.",
};

const MOLECULES = {
  H2O: { name: "Water", formula: "H₂O", atoms: [{ el: "O", pos: [0,0,0] },{ el: "H", pos: [0.76,0.59,0] },{ el: "H", pos: [-0.76,0.59,0] }], bonds: [[0,1],[0,2]] },
  CO2: { name: "Carbon dioxide", formula: "CO₂", atoms: [{ el: "C", pos: [0,0,0] },{ el: "O", pos: [1.16,0,0] },{ el: "O", pos: [-1.16,0,0] }], bonds: [[0,1],[0,2]] },
  CH4: { name: "Methane", formula: "CH₄", atoms: [{ el: "C", pos: [0,0,0] },{ el: "H", pos: [0.6,0.6,0.6] },{ el: "H", pos: [-0.6,-0.6,0.6] },{ el: "H", pos: [-0.6,0.6,-0.6] },{ el: "H", pos: [0.6,-0.6,-0.6] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  NH3: { name: "Ammonia", formula: "NH₃", atoms: [{ el: "N", pos: [0,0.1,0] },{ el: "H", pos: [0.94,-0.3,0] },{ el: "H", pos: [-0.47,-0.3,0.8] },{ el: "H", pos: [-0.47,-0.3,-0.8] }], bonds: [[0,1],[0,2],[0,3]] },
  HCL: { name: "Hydrogen chloride", formula: "HCl", atoms: [{ el: "H", pos: [0.6,0,0] },{ el: "Cl", pos: [-0.6,0,0] }], bonds: [[0,1]] },
  HF: { name: "Hydrogen fluoride", formula: "HF", atoms: [{ el: "H", pos: [0.4,0,0] },{ el: "F", pos: [-0.4,0,0] }], bonds: [[0,1]] },
  HNO3: { name: "Nitric Acid", formula: "HNO₃", atoms: [{ el: "N", pos: [0,0,0] },{ el: "O", pos: [0,1.2,0] },{ el: "O", pos: [1,-0.6,0] },{ el: "O", pos: [-1,-0.6,0] },{ el: "H", pos: [-1.8,0,0] }], bonds: [[0,1],[0,2],[0,3],[3,4]] },
  H2SO4: { name: "Sulfuric Acid", formula: "H₂SO₄", atoms: [{ el: "S", pos: [0,0,0] },{ el: "O", pos: [0,1.5,0] },{ el: "O", pos: [0,-1.5,0] },{ el: "O", pos: [1.3,0,0.8] },{ el: "O", pos: [-1.3,0,0.8] },{ el: "H", pos: [1.8,0.5,1.2] },{ el: "H", pos: [-1.8,0.5,1.2] }], bonds: [[0,1],[0,2],[0,3],[0,4],[3,5],[4,6]] },
  C6H6: { name: "Benzene", formula: "C₆H₆", atoms: [{ el: "C", pos: [1.4,0,0] },{ el: "C", pos: [0.7,1.2,0] },{ el: "C", pos: [-0.7,1.2,0] },{ el: "C", pos: [-1.4,0,0] },{ el: "C", pos: [-0.7,-1.2,0] },{ el: "C", pos: [0.7,-1.2,0] },{ el: "H", pos: [2.4,0,0] },{ el: "H", pos: [1.2,2.1,0] },{ el: "H", pos: [-1.2,2.1,0] },{ el: "H", pos: [-2.4,0,0] },{ el: "H", pos: [-1.2,-2.1,0] },{ el: "H", pos: [1.2,-2.1,0] }], bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]] },
  CHCL3: { name: "Chloroform", formula: "CHCl₃", atoms: [{ el: "C", pos: [0,0,0] },{ el: "H", pos: [0,1.1,0] },{ el: "Cl", pos: [1.5,-0.4,0] },{ el: "Cl", pos: [-0.7,-0.4,1.3] },{ el: "Cl", pos: [-0.7,-0.4,-1.3] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  NAOH: { name: "Sodium Hydroxide", formula: "NaOH", atoms: [{ el: "Na", pos: [-1,0,0] },{ el: "O", pos: [0.5,0,0] },{ el: "H", pos: [1.4,0,0] }], bonds: [[0,1],[1,2]] },
  CH3OH: { name: "Methanol", formula: "CH₃OH", atoms: [{ el: "C", pos: [-0.7,0,0] },{ el: "O", pos: [0.7,0,0] },{ el: "H", pos: [1.2,0.8,0] },{ el: "H", pos: [-1.1,0.5,0.8] },{ el: "H", pos: [-1.1,0.5,-0.8] },{ el: "H", pos: [-1.1,-1,0] }], bonds: [[0,1],[1,2],[0,3],[0,4],[0,5]] },
  C3H8: { name: "Propane", formula: "C₃H₈", atoms: [{ el: "C", pos: [1.3,0.9,0] },{ el: "C", pos: [0,0,0] },{ el: "C", pos: [-1.3,0.9,0] },{ el: "H", pos: [0,0,1.1] },{ el: "H", pos: [0,0,-1.1] },{ el: "H", pos: [1,0.7,1] },{ el: "H", pos: [1.5,-0.1,-0.5] },{ el: "H", pos: [0.4,1.4,-0.5] },{ el: "H", pos: [-1,0.7,1] },{ el: "H", pos: [-0.4,1.4,-0.5] },{ el: "H", pos: [-1.5,-0.1,-0.5] }], bonds: [[0,1],[1,2],[0,5],[0,6],[0,7],[1,3],[1,4],[2,8],[2,9],[2,10]] }
};

const ALLOYS = {
  STEEL: { name: "Carbon Steel", composition: [{ el: "Fe", ratio: 0.98, role: "Main Matrix" }, { el: "C", ratio: 0.02, role: "Hardener" }] },
  STAINLESS: { name: "Stainless Steel", composition: [{ el: "Fe", ratio: 0.70, role: "Base" }, { el: "Cr", ratio: 0.20, role: "Antirust" }, { el: "Ni", ratio: 0.10, role: "Strength" }] },
  BRASS: { name: "Brass", composition: [{ el: "Cu", ratio: 0.65, role: "Matrix" }, { el: "Zn", ratio: 0.35, role: "Acoustics" }] },
  BRONZE: { name: "Bronze", composition: [{ el: "Cu", ratio: 0.88, role: "Base" }, { el: "Sn", ratio: 0.12, role: "Durability" }] },
  STERLING: { name: "Sterling Silver", composition: [{ el: "Ag", ratio: 0.925, role: "Lustre" }, { el: "Cu", ratio: 0.075, role: "Hardness" }] },
  NICHROME: { name: "Nichrome", composition: [{ el: "Ni", ratio: 0.80, role: "Resistance" }, { el: "Cr", ratio: 0.20, role: "Heat" }] },
  SOLDER: { name: "Solder", composition: [{ el: "Sn", ratio: 0.60, role: "Conductivity" }, { el: "Pb", ratio: 0.40, role: "Melting" }] },
  ELECTRUM: { name: "Electrum", composition: [{ el: "Au", ratio: 0.75, role: "Precious Matrix" }, { el: "Ag", ratio: 0.25, role: "Natural Alloy Agent" }] },
  ROSEGOLD: { name: "Rose Gold", composition: [{ el: "Au", ratio: 0.75, role: "Base" }, { el: "Cu", ratio: 0.22, role: "Coloring" }, { el: "Ag", ratio: 0.03, role: "Finish" }] }
};

function resolveQuery(raw) {
  const q = raw.trim();
  if (!q) return null;
  const key = q.toUpperCase().replace(/\s+/g, "");

  // 1. Check Molecules
  if (MOLECULES[key]) return { type: "molecule", key, data: MOLECULES[key] };
  const byMoleculeName = Object.entries(MOLECULES).find(([, m]) => m.name.toUpperCase() === q.toUpperCase());
  if (byMoleculeName) return { type: "molecule", key: byMoleculeName[0], data: byMoleculeName[1] };

  // 2. Check Alloys
  if (ALLOYS[key]) return { type: "alloy", key, data: ALLOYS[key] };
  const byAlloyName = Object.entries(ALLOYS).find(([, a]) => a.name.toUpperCase() === q.toUpperCase());
  if (byAlloyName) return { type: "alloy", key: byAlloyName[0], data: byAlloyName[1] };

  // 3. Check Elements
  const sym = q[0].toUpperCase() + q.slice(1).toLowerCase();
  if (ELEMENTS[sym]) return { type: "element", key: sym, data: ELEMENTS[sym] };
  const byElName = Object.entries(ELEMENTS).find(([, e]) => e.name.toUpperCase() === q.toUpperCase());
  if (byElName) return { type: "element", key: byElName[0], data: byElName[1] };

  return null;
}
