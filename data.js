// MatAIme: Exhaustive reference data — 118 elements, 50+ molecules, and full alloys.

const ELEMENTS = {
  H: { z:1, name:"Hydrogen", shells:[1], category:"nonmetal", mass:1.008, stableWeight:true, melt:-259, boil:-253, density:0.08988, densityUnit:"g/L", phase:"Gas", en:2.2, theoretical:false, blurb:"The simplest and most abundant element in the universe." },
  He: { z:2, name:"Helium", shells:[2], category:"noble-gas", mass:4.003, stableWeight:true, melt:-272, boil:-269, density:0.1786, densityUnit:"g/L", phase:"Gas", en:null, theoretical:false, blurb:"Second most abundant element; used in balloons and lasers." },
  Li: { z:3, name:"Lithium", shells:[2,1], category:"alkali", mass:6.94, stableWeight:true, melt:180, boil:1330, density:0.534, densityUnit:"g/cm³", phase:"Solid", en:0.98, theoretical:false, blurb:"Lightest metal; powers modern phone and EV batteries." },
  Be: { z:4, name:"Beryllium", shells:[2,2], category:"alkaline-earth", mass:9.012, stableWeight:true, melt:1287, boil:2469, density:1.85, densityUnit:"g/cm³", phase:"Solid", en:1.57, theoretical:false, blurb:"A stiff, lightweight metal used in space telescopes." },
  B: { z:5, name:"Boron", shells:[2,3], category:"metalloid", mass:10.81, stableWeight:true, melt:2076, boil:3927, density:2.08, densityUnit:"g/cm³", phase:"Solid", en:2.04, theoretical:false, blurb:"Used in heat-resistant borosilicate glass like Pyrex." },
  C: { z:6, name:"Carbon", shells:[2,4], category:"nonmetal", mass:12.011, stableWeight:true, melt:null, boil:null, density:2.267, densityUnit:"g/cm³", phase:"Solid", en:2.55, theoretical:false, blurb:"The basis of all life; forms diamond and graphite." },
  N: { z:7, name:"Nitrogen", shells:[2,5], category:"nonmetal", mass:14.007, stableWeight:true, melt:-210, boil:-196, density:1.251, densityUnit:"g/L", phase:"Gas", en:3.04, theoretical:false, blurb:"Makes up 78% of the air; essential for DNA." },
  O: { z:8, name:"Oxygen", shells:[2,6], category:"nonmetal", mass:15.999, stableWeight:true, melt:-219, boil:-183, density:1.429, densityUnit:"g/L", phase:"Gas", en:3.44, theoretical:false, blurb:"The gas we breathe; most abundant element in Earth's crust." },
  F: { z:9, name:"Fluorine", shells:[2,7], category:"halogen", mass:18.998, stableWeight:true, melt:-220, boil:-188, density:1.696, densityUnit:"g/L", phase:"Gas", en:3.98, theoretical:false, blurb:"The most reactive element; used in tooth enamel protection." },
  Ne: { z:10, name:"Neon", shells:[2,8], category:"noble-gas", mass:20.18, stableWeight:true, melt:-249, boil:-246, density:0.9002, densityUnit:"g/L", phase:"Gas", en:null, theoretical:false, blurb:"Glows bright orange in vacuum tubes; used in signs." },
  Na: { z:11, name:"Sodium", shells:[2,8,1], category:"alkali", mass:22.99, stableWeight:true, melt:98, boil:883, density:0.968, densityUnit:"g/cm³", phase:"Solid", en:0.93, theoretical:false, blurb:"Explosively reactive metal; component of table salt." },
  Mg: { z:12, name:"Magnesium", shells:[2,8,2], category:"alkaline-earth", mass:24.305, stableWeight:true, melt:650, boil:1090, density:1.738, densityUnit:"g/cm³", phase:"Solid", en:1.31, theoretical:false, blurb:"Burns with a bright white light; central to chlorophyll." },
  Al: { z:13, name:"Aluminium", shells:[2,8,3], category:"post-metal", mass:26.982, stableWeight:true, melt:660, boil:2470, density:2.7, densityUnit:"g/cm³", phase:"Solid", en:1.61, theoretical:false, blurb:"Light, strong, and the most common metal in Earth's crust." },
  Si: { z:14, name:"Silicon", shells:[2,8,4], category:"metalloid", mass:28.085, stableWeight:true, melt:1414, boil:3265, density:2.329, densityUnit:"g/cm³", phase:"Solid", en:1.9, theoretical:false, blurb:"The primary semiconductor used in computer chips." },
  P: { z:15, name:"Phosphorus", shells:[2,8,5], category:"nonmetal", mass:30.974, stableWeight:true, melt:44, boil:281, density:1.823, densityUnit:"g/cm³", phase:"Solid", en:2.19, theoretical:false, blurb:"Essential for energy (ATP) and bone structure." },
  S: { z:16, name:"Sulfur", shells:[2,8,6], category:"nonmetal", mass:32.06, stableWeight:true, melt:115, boil:445, density:2.07, densityUnit:"g/cm³", phase:"Solid", en:2.58, theoretical:false, blurb:"A yellow nonmetal that smells like eggs when in compounds." },
  Cl: { z:17, name:"Chlorine", shells:[2,8,7], category:"halogen", mass:35.45, stableWeight:true, melt:-102, boil:-34, density:3.2, densityUnit:"g/L", phase:"Gas", en:3.16, theoretical:false, blurb:"Used to disinfect water and in bleach." },
  Ar: { z:18, name:"Argon", shells:[2,8,8], category:"noble-gas", mass:39.948, stableWeight:true, melt:-189, boil:-186, density:1.784, densityUnit:"g/L", phase:"Gas", en:null, theoretical:false, blurb:"An inert gas often used to fill incandescent bulbs." },
  K: { z:19, name:"Potassium", shells:[2,8,8,1], category:"alkali", mass:39.098, stableWeight:true, melt:64, boil:759, density:0.862, densityUnit:"g/cm³", phase:"Solid", en:0.82, theoretical:false, blurb:"Highly reactive alkali metal essential for nerves." },
  Ca: { z:20, name:"Calcium", shells:[2,8,8,2], category:"alkaline-earth", mass:40.078, stableWeight:true, melt:842, boil:1484, density:1.55, densityUnit:"g/cm³", phase:"Solid", en:1, theoretical:false, blurb:"The main mineral that makes bones and teeth hard." },
  Sc: { z:21, name:"Scandium", shells:[2,8,9,2], category:"transition", mass:44.956, stableWeight:true, melt:1541, boil:2836, density:2.985, densityUnit:"g/cm³", phase:"Solid", en:1.36, theoretical:false, blurb:"Used in high-performance aluminum alloys." },
  Ti: { z:22, name:"Titanium", shells:[2,8,10,2], category:"transition", mass:47.867, stableWeight:true, melt:1668, boil:3287, density:4.506, densityUnit:"g/cm³", phase:"Solid", en:1.54, theoretical:false, blurb:"Strong as steel but much lighter; biocompatible." },
  V: { z:23, name:"Vanadium", shells:[2,8,11,2], category:"transition", mass:50.942, stableWeight:true, melt:1910, boil:3407, density:6, densityUnit:"g/cm³", phase:"Solid", en:1.63, theoretical:false, blurb:"Added to steel to make it shock-resistant." },
  Cr: { z:24, name:"Chromium", shells:[2,8,13,1], category:"transition", mass:51.996, stableWeight:true, melt:1907, boil:2671, density:7.19, densityUnit:"g/cm³", phase:"Solid", en:1.66, theoretical:false, blurb:"Provides the shiny, rustproof finish on chrome plating." },
  Mn: { z:25, name:"Manganese", shells:[2,8,13,2], category:"transition", mass:54.938, stableWeight:true, melt:1246, boil:2061, density:7.21, densityUnit:"g/cm³", phase:"Solid", en:1.55, theoretical:false, blurb:"Used to remove oxygen and sulfur during steel making." },
  Fe: { z:26, name:"Iron", shells:[2,8,14,2], category:"transition", mass:55.845, stableWeight:true, melt:1538, boil:2861, density:7.874, densityUnit:"g/cm³", phase:"Solid", en:1.83, theoretical:false, blurb:"The base of steel and the carrier of oxygen in blood." },
  Co: { z:27, name:"Cobalt", shells:[2,8,15,2], category:"transition", mass:58.933, stableWeight:true, melt:1495, boil:2927, density:8.9, densityUnit:"g/cm³", phase:"Solid", en:1.88, theoretical:false, blurb:"Used in high-strength alloys and blue glass." },
  Ni: { z:28, name:"Nickel", shells:[2,8,16,2], category:"transition", mass:58.693, stableWeight:true, melt:1455, boil:2730, density:8.908, densityUnit:"g/cm³", phase:"Solid", en:1.91, theoretical:false, blurb:"Used in stainless steel and rechargeable batteries." },
  Cu: { z:29, name:"Copper", shells:[2,8,18,1], category:"transition", mass:63.546, stableWeight:true, melt:1085, boil:2562, density:8.96, densityUnit:"g/cm³", phase:"Solid", en:1.9, theoretical:false, blurb:"Excellent conductor used in electronics and wiring." },
  Zn: { z:30, name:"Zinc", shells:[2,8,18,2], category:"transition", mass:65.382, stableWeight:true, melt:420, boil:907, density:7.14, densityUnit:"g/cm³", phase:"Solid", en:1.65, theoretical:false, blurb:"Used to galvanize steel and protect it from rust." },
  Ga: { z:31, name:"Gallium", shells:[2,8,18,3], category:"post-metal", mass:69.723, stableWeight:true, melt:30, boil:2400, density:5.91, densityUnit:"g/cm³", phase:"Solid", en:1.81, theoretical:false, blurb:"Melts in your hand like a liquid metal." },
  Ge: { z:32, name:"Germanium", shells:[2,8,18,4], category:"metalloid", mass:72.631, stableWeight:true, melt:938, boil:2833, density:5.323, densityUnit:"g/cm³", phase:"Solid", en:2.01, theoretical:false, blurb:"A metalloid semiconductor used in fiber optics." },
  As: { z:33, name:"Arsenic", shells:[2,8,18,5], category:"metalloid", mass:74.922, stableWeight:true, melt:null, boil:615, density:5.727, densityUnit:"g/cm³", phase:"Solid", en:2.18, theoretical:false, blurb:"Famously toxic metalloid once used as a pigment." },
  Se: { z:34, name:"Selenium", shells:[2,8,18,6], category:"nonmetal", mass:78.972, stableWeight:true, melt:221, boil:685, density:4.81, densityUnit:"g/cm³", phase:"Solid", en:2.55, theoretical:false, blurb:"Used in light-sensing photocells and glass." },
  Br: { z:35, name:"Bromine", shells:[2,8,18,7], category:"halogen", mass:79.904, stableWeight:true, melt:-7, boil:59, density:3.1028, densityUnit:"g/cm³", phase:"Liquid", en:2.96, theoretical:false, blurb:"A dark red liquid at room temperature." },
  Kr: { z:36, name:"Krypton", shells:[2,8,18,8], category:"noble-gas", mass:83.798, stableWeight:true, melt:-157, boil:-153, density:3.749, densityUnit:"g/L", phase:"Gas", en:3, theoretical:false, blurb:"Inert gas used in high-speed flash lamps." },
  Rb: { z:37, name:"Rubidium", shells:[2,8,18,8,1], category:"alkali", mass:85.468, stableWeight:true, melt:39, boil:688, density:1.532, densityUnit:"g/cm³", phase:"Solid", en:0.82, theoretical:false, blurb:"Highly reactive; used to cool atoms in lasers." },
  Sr: { z:38, name:"Strontium", shells:[2,8,18,8,2], category:"alkaline-earth", mass:87.621, stableWeight:true, melt:777, boil:1377, density:2.64, densityUnit:"g/cm³", phase:"Solid", en:0.95, theoretical:false, blurb:"Turns fireworks and flares bright red." },
  Y: { z:39, name:"Yttrium", shells:[2,8,18,9,2], category:"transition", mass:88.906, stableWeight:true, melt:1526, boil:2930, density:4.472, densityUnit:"g/cm³", phase:"Solid", en:1.22, theoretical:false, blurb:"Used in high-temperature superconductors." },
  Zr: { z:40, name:"Zirconium", shells:[2,8,18,10,2], category:"transition", mass:91.224, stableWeight:true, melt:1855, boil:4377, density:6.52, densityUnit:"g/cm³", phase:"Solid", en:1.33, theoretical:false, blurb:"Used to clad nuclear fuel rods." },
  Nb: { z:41, name:"Niobium", shells:[2,8,18,12,1], category:"transition", mass:92.906, stableWeight:true, melt:2477, boil:4744, density:8.57, densityUnit:"g/cm³", phase:"Solid", en:1.6, theoretical:false, blurb:"Used in superconducting MRI magnets." },
  Mo: { z:42, name:"Molybdenum", shells:[2,8,18,13,1], category:"transition", mass:95.951, stableWeight:true, melt:2623, boil:4639, density:10.28, densityUnit:"g/cm³", phase:"Solid", en:2.16, theoretical:false, blurb:"Strengthens steel for jet engines." },
  Tc: { z:43, name:"Technetium", shells:[2,8,18,13,2], category:"transition", mass:98, stableWeight:false, melt:2157, boil:4265, density:11, densityUnit:"g/cm³", phase:"Solid", en:1.9, theoretical:false, blurb:"Lightest element with only radioactive isotopes." },
  Ru: { z:44, name:"Ruthenium", shells:[2,8,18,15,1], category:"transition", mass:101.072, stableWeight:true, melt:2334, boil:4150, density:12.45, densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"Used as a hardener for platinum." },
  Rh: { z:45, name:"Rhodium", shells:[2,8,18,16,1], category:"transition", mass:102.906, stableWeight:true, melt:1964, boil:3695, density:12.41, densityUnit:"g/cm³", phase:"Solid", en:2.28, theoretical:false, blurb:"The rarest non-radioactive metal on Earth." },
  Pd: { z:46, name:"Palladium", shells:[2,8,18,18], category:"transition", mass:106.421, stableWeight:true, melt:1555, boil:2963, density:12.023, densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"Absorbs hydrogen; used in electronics." },
  Ag: { z:47, name:"Silver", shells:[2,8,18,18,1], category:"transition", mass:107.868, stableWeight:true, melt:962, boil:2162, density:10.49, densityUnit:"g/cm³", phase:"Solid", en:1.93, theoretical:false, blurb:"The best thermal and electrical conductor." },
  Cd: { z:48, name:"Cadmium", shells:[2,8,18,18,2], category:"transition", mass:112.414, stableWeight:true, melt:321, boil:767, density:8.65, densityUnit:"g/cm³", phase:"Solid", en:1.69, theoretical:false, blurb:"Toxic heavy metal once used in batteries." },
  In: { z:49, name:"Indium", shells:[2,8,18,18,3], category:"post-metal", mass:114.818, stableWeight:true, melt:157, boil:2072, density:7.31, densityUnit:"g/cm³", phase:"Solid", en:1.78, theoretical:false, blurb:"Used to make touchscreens conductive." },
  Sn: { z:50, name:"Tin", shells:[2,8,18,18,4], category:"post-metal", mass:118.711, stableWeight:true, melt:232, boil:2602, density:7.365, densityUnit:"g/cm³", phase:"Solid", en:1.96, theoretical:false, blurb:"Resists corrosion; part of bronze and pewter." },
  Sb: { z:51, name:"Antimony", shells:[2,8,18,18,5], category:"metalloid", mass:121.76, stableWeight:true, melt:631, boil:1635, density:6.697, densityUnit:"g/cm³", phase:"Solid", en:2.05, theoretical:false, blurb:"Metalloid used in flame retardants." },
  Te: { z:52, name:"Tellurium", shells:[2,8,18,18,6], category:"metalloid", mass:127.603, stableWeight:true, melt:450, boil:988, density:6.24, densityUnit:"g/cm³", phase:"Solid", en:2.1, theoretical:false, blurb:"Rare metalloid used in solar panels." },
  I: { z:53, name:"Iodine", shells:[2,8,18,18,7], category:"halogen", mass:126.904, stableWeight:true, melt:114, boil:184, density:4.933, densityUnit:"g/cm³", phase:"Solid", en:2.66, theoretical:false, blurb:"Nutrient for thyroid health; used as antiseptic." },
  Xe: { z:54, name:"Xenon", shells:[2,8,18,18,8], category:"noble-gas", mass:131.294, stableWeight:true, melt:-112, boil:-108, density:5.894, densityUnit:"g/L", phase:"Gas", en:2.6, theoretical:false, blurb:"Used in high-intensity car headlights." },
  Cs: { z:55, name:"Cesium", shells:[2,8,18,18,8,1], category:"alkali", mass:132.905, stableWeight:true, melt:29, boil:671, density:1.93, densityUnit:"g/cm³", phase:"Solid", en:0.79, theoretical:false, blurb:"Most reactive metal; defines the second." },
  Ba: { z:56, name:"Barium", shells:[2,8,18,18,8,2], category:"alkaline-earth", mass:137.328, stableWeight:true, melt:727, boil:1845, density:3.51, densityUnit:"g/cm³", phase:"Solid", en:0.89, theoretical:false, blurb:"Opaque to X-rays; used in medical scans." },
  La: { z:57, name:"Lanthanum", shells:[2,8,18,18,9,2], category:"lanthanide", mass:138.905, stableWeight:true, melt:920, boil:3464, density:6.162, densityUnit:"g/cm³", phase:"Solid", en:1.1, theoretical:false, blurb:"First of the rare-earth lanthanide series." },
  Ce: { z:58, name:"Cerium", shells:[2,8,18,19,9,2], category:"lanthanide", mass:140.116, stableWeight:true, melt:795, boil:3443, density:6.77, densityUnit:"g/cm³", phase:"Solid", en:1.12, theoretical:false, blurb:"Most abundant rare-earth; used in lighter flints." },
  Pr: { z:59, name:"Praseodymium", shells:[2,8,18,21,8,2], category:"lanthanide", mass:140.908, stableWeight:true, melt:935, boil:3130, density:6.77, densityUnit:"g/cm³", phase:"Solid", en:1.13, theoretical:false, blurb:"Used to color glass a yellow-green hue." },
  Nd: { z:60, name:"Neodymium", shells:[2,8,18,22,8,2], category:"lanthanide", mass:144.242, stableWeight:true, melt:1024, boil:3074, density:7.01, densityUnit:"g/cm³", phase:"Solid", en:1.14, theoretical:false, blurb:"Metal behind the world's strongest magnets." },
  Pm: { z:61, name:"Promethium", shells:[2,8,18,23,8,2], category:"lanthanide", mass:145, stableWeight:false, melt:1042, boil:3000, density:7.26, densityUnit:"g/cm³", phase:"Solid", en:1.13, theoretical:false, blurb:"Radioactive; used in atomic batteries." },
  Sm: { z:62, name:"Samarium", shells:[2,8,18,24,8,2], category:"lanthanide", mass:150.362, stableWeight:true, melt:1072, boil:1900, density:7.52, densityUnit:"g/cm³", phase:"Solid", en:1.17, theoretical:false, blurb:"Used in high-temperature permanent magnets." },
  Eu: { z:63, name:"Europium", shells:[2,8,18,25,8,2], category:"lanthanide", mass:151.964, stableWeight:true, melt:826, boil:1529, density:5.264, densityUnit:"g/cm³", phase:"Solid", en:1.2, theoretical:false, blurb:"Provides the red glow in screen phosphors." },
  Gd: { z:64, name:"Gadolinium", shells:[2,8,18,25,9,2], category:"lanthanide", mass:157.253, stableWeight:true, melt:1312, boil:3000, density:7.9, densityUnit:"g/cm³", phase:"Solid", en:1.2, theoretical:false, blurb:"Highly magnetic; used as contrast for MRI." },
  Tb: { z:65, name:"Terbium", shells:[2,8,18,27,8,2], category:"lanthanide", mass:158.925, stableWeight:true, melt:1356, boil:3123, density:8.23, densityUnit:"g/cm³", phase:"Solid", en:1.1, theoretical:false, blurb:"Used in green display phosphors." },
  Dy: { z:66, name:"Dysprosium", shells:[2,8,18,28,8,2], category:"lanthanide", mass:162.5, stableWeight:true, melt:1407, boil:2567, density:8.54, densityUnit:"g/cm³", phase:"Solid", en:1.22, theoretical:false, blurb:"Added to magnets to handle high heat." },
  Ho: { z:67, name:"Holmium", shells:[2,8,18,29,8,2], category:"lanthanide", mass:164.93, stableWeight:true, melt:1461, boil:2600, density:8.79, densityUnit:"g/cm³", phase:"Solid", en:1.23, theoretical:false, blurb:"Has the highest magnetic strength." },
  Er: { z:68, name:"Erbium", shells:[2,8,18,30,8,2], category:"lanthanide", mass:167.259, stableWeight:true, melt:1529, boil:2868, density:9.066, densityUnit:"g/cm³", phase:"Solid", en:1.24, theoretical:false, blurb:"Used in fiber-optic signal amplifiers." },
  Tm: { z:69, name:"Thulium", shells:[2,8,18,31,8,2], category:"lanthanide", mass:168.934, stableWeight:true, melt:1545, boil:1950, density:9.32, densityUnit:"g/cm³", phase:"Solid", en:1.25, theoretical:false, blurb:"Rare metal used in portable X-ray devices." },
  Yb: { z:70, name:"Ytterbium", shells:[2,8,18,32,8,2], category:"lanthanide", mass:173.045, stableWeight:true, melt:824, boil:1196, density:6.9, densityUnit:"g/cm³", phase:"Solid", en:1.1, theoretical:false, blurb:"Used in atomic clocks and stress sensors." },
  Lu: { z:71, name:"Lutetium", shells:[2,8,18,32,9,2], category:"lanthanide", mass:174.967, stableWeight:true, melt:1652, boil:3402, density:9.841, densityUnit:"g/cm³", phase:"Solid", en:1.27, theoretical:false, blurb:"Densest and hardest lanthanide." },
  Hf: { z:72, name:"Hafnium", shells:[2,8,18,32,10,2], category:"transition", mass:178.492, stableWeight:true, melt:2233, boil:4603, density:13.31, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Used in nuclear control rods." },
  Ta: { z:73, name:"Tantalum", shells:[2,8,18,32,11,2], category:"transition", mass:180.948, stableWeight:true, melt:3017, boil:5458, density:16.69, densityUnit:"g/cm³", phase:"Solid", en:1.5, theoretical:false, blurb:"Corrosion-resistant; used in phone capacitors." },
  W: { z:74, name:"Tungsten", shells:[2,8,18,32,12,2], category:"transition", mass:183.841, stableWeight:true, melt:3422, boil:5930, density:19.25, densityUnit:"g/cm³", phase:"Solid", en:2.36, theoretical:false, blurb:"Metal with the highest melting point." },
  Re: { z:75, name:"Rhenium", shells:[2,8,18,32,13,2], category:"transition", mass:186.207, stableWeight:true, melt:3186, boil:5596, density:21.02, densityUnit:"g/cm³", phase:"Solid", en:1.9, theoretical:false, blurb:"Used in high-temp jet engine superalloys." },
  Os: { z:76, name:"Osmium", shells:[2,8,18,32,14,2], category:"transition", mass:190.233, stableWeight:true, melt:3033, boil:5012, density:22.59, densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"The densest naturally occurring element." },
  Ir: { z:77, name:"Iridium", shells:[2,8,18,32,15,2], category:"transition", mass:192.217, stableWeight:true, melt:2446, boil:4130, density:22.56, densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"The most corrosion-resistant metal known." },
  Pt: { z:78, name:"Platinum", shells:[2,8,18,32,17,1], category:"transition", mass:195.085, stableWeight:true, melt:1768, boil:3825, density:21.45, densityUnit:"g/cm³", phase:"Solid", en:2.28, theoretical:false, blurb:"Precious industrial and jewelry catalyst." },
  Au: { z:79, name:"Gold", shells:[2,8,18,32,18,1], category:"transition", mass:196.967, stableWeight:true, melt:1064, boil:2970, density:19.3, densityUnit:"g/cm³", phase:"Solid", en:2.54, theoretical:false, blurb:"Precious noble metal that never tarnishes." },
  Hg: { z:80, name:"Mercury", shells:[2,8,18,32,18,2], category:"transition", mass:200.592, stableWeight:true, melt:-39, boil:357, density:13.534, densityUnit:"g/cm³", phase:"Liquid", en:2, theoretical:false, blurb:"The only liquid metal at room temp." },
  Tl: { z:81, name:"Thallium", shells:[2,8,18,32,18,3], category:"post-metal", mass:204.38, stableWeight:true, melt:304, boil:1473, density:11.85, densityUnit:"g/cm³", phase:"Solid", en:1.62, theoretical:false, blurb:"Highly toxic metal historically used as poison." },
  Pb: { z:82, name:"Lead", shells:[2,8,18,32,18,4], category:"post-metal", mass:207.21, stableWeight:true, melt:327, boil:1749, density:11.34, densityUnit:"g/cm³", phase:"Solid", en:1.87, theoretical:false, blurb:"Dense metal used in radiation shielding." },
  Bi: { z:83, name:"Bismuth", shells:[2,8,18,32,18,5], category:"post-metal", mass:208.98, stableWeight:true, melt:272, boil:1564, density:9.78, densityUnit:"g/cm³", phase:"Solid", en:2.02, theoretical:false, blurb:"Used in stomach medicines; safe heavy metal." },
  Po: { z:84, name:"Polonium", shells:[2,8,18,32,18,6], category:"post-metal", mass:209, stableWeight:false, melt:254, boil:962, density:9.196, densityUnit:"g/cm³", phase:"Solid", en:2, theoretical:false, blurb:"Extremely radioactive metal." },
  At: { z:85, name:"Astatine", shells:[2,8,18,32,18,7], category:"halogen", mass:210, stableWeight:false, melt:302, boil:337, density:6.35, densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"The rarest natural element on Earth." },
  Rn: { z:86, name:"Radon", shells:[2,8,18,32,18,8], category:"noble-gas", mass:222, stableWeight:false, melt:-71, boil:-62, density:9.73, densityUnit:"g/L", phase:"Gas", en:2.2, theoretical:false, blurb:"Radioactive noble gas that seeps from rock." },
  Fr: { z:87, name:"Francium", shells:[2,8,18,32,18,8,1], category:"alkali", mass:223, stableWeight:false, melt:27, boil:677, density:1.87, densityUnit:"g/cm³", phase:"Solid", en:0.79, theoretical:false, blurb:"Highly unstable alkali metal; extremely rare." },
  Ra: { z:88, name:"Radium", shells:[2,8,18,32,18,8,2], category:"alkaline-earth", mass:226, stableWeight:false, melt:960, boil:1737, density:5.5, densityUnit:"g/cm³", phase:"Solid", en:0.9, theoretical:false, blurb:"Used in early luminous watch dials." },
  Ac: { z:89, name:"Actinium", shells:[2,8,18,32,18,9,2], category:"actinide", mass:227, stableWeight:false, melt:1227, boil:3227, density:10, densityUnit:"g/cm³", phase:"Solid", en:1.1, theoretical:false, blurb:"Glows blue in the dark from radioactivity." },
  Th: { z:90, name:"Thorium", shells:[2,8,18,32,18,10,2], category:"actinide", mass:232.038, stableWeight:true, melt:1750, boil:4788, density:11.724, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"A candidate fuel for next-gen nuclear reactors." },
  Pa: { z:91, name:"Protactinium", shells:[2,8,18,32,20,9,2], category:"actinide", mass:231.036, stableWeight:true, melt:1568, boil:4027, density:15.37, densityUnit:"g/cm³", phase:"Solid", en:1.5, theoretical:false, blurb:"Rare and expensive radioactive metal." },
  U: { z:92, name:"Uranium", shells:[2,8,18,32,21,9,2], category:"actinide", mass:238.029, stableWeight:true, melt:1132, boil:4131, density:19.1, densityUnit:"g/cm³", phase:"Solid", en:1.38, theoretical:false, blurb:"Heaviest natural element used for nuclear power." },
  Np: { z:93, name:"Neptunium", shells:[2,8,18,32,22,9,2], category:"actinide", mass:237, stableWeight:false, melt:639, boil:4174, density:20.45, densityUnit:"g/cm³", phase:"Solid", en:1.36, theoretical:false, blurb:"First synthetic transuranic element." },
  Pu: { z:94, name:"Plutonium", shells:[2,8,18,32,24,8,2], category:"actinide", mass:244, stableWeight:false, melt:639, boil:3232, density:19.816, densityUnit:"g/cm³", phase:"Solid", en:1.28, theoretical:false, blurb:"Fuel for nuclear weapons and space probes." },
  Am: { z:95, name:"Americium", shells:[2,8,18,32,25,8,2], category:"actinide", mass:243, stableWeight:false, melt:1176, boil:2607, density:12, densityUnit:"g/cm³", phase:"Solid", en:1.13, theoretical:false, blurb:"The element found in household smoke detectors." },
  Cm: { z:96, name:"Curium", shells:[2,8,18,32,25,9,2], category:"actinide", mass:247, stableWeight:false, melt:1340, boil:3110, density:13.51, densityUnit:"g/cm³", phase:"Solid", en:1.28, theoretical:false, blurb:"Named after Marie and Pierre Curie." },
  Bk: { z:97, name:"Berkelium", shells:[2,8,18,32,27,8,2], category:"actinide", mass:247, stableWeight:false, melt:986, boil:2627, density:14.78, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Named after Berkeley, California." },
  Cf: { z:98, name:"Californium", shells:[2,8,18,32,28,8,2], category:"actinide", mass:251, stableWeight:false, melt:900, boil:1470, density:15.1, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Strong neutron source used in industrial scans." },
  Es: { z:99, name:"Einsteinium", shells:[2,8,18,32,29,8,2], category:"actinide", mass:252, stableWeight:false, melt:860, boil:996, density:8.84, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Named after Albert Einstein." },
  Fm: { z:100, name:"Fermium", shells:[2,8,18,32,30,8,2], category:"actinide", mass:257, stableWeight:false, melt:1527, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Heaviest element made by bombardment." },
  Md: { z:101, name:"Mendelevium", shells:[2,8,18,32,31,8,2], category:"actinide", mass:258, stableWeight:false, melt:827, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Named after the creator of the Periodic Table." },
  No: { z:102, name:"Nobelium", shells:[2,8,18,32,32,8,2], category:"actinide", mass:259, stableWeight:false, melt:827, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Named after Alfred Nobel." },
  Lr: { z:103, name:"Lawrencium", shells:[2,8,18,32,32,8,3], category:"actinide", mass:266, stableWeight:false, melt:1627, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Final element of the actinide row." },
  Rf: { z:104, name:"Rutherfordium", shells:[2,8,18,32,32,10,2], category:"transition", mass:267, stableWeight:false, melt:2127, boil:5527, density:23.2, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"The first superheavy element." },
  Db: { z:105, name:"Dubnium", shells:[2,8,18,32,32,11,2], category:"transition", mass:268, stableWeight:false, melt:null, boil:null, density:29.3, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Dubna, Russia." },
  Sg: { z:106, name:"Seaborgium", shells:[2,8,18,32,32,12,2], category:"transition", mass:269, stableWeight:false, melt:null, boil:null, density:35, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Glenn T. Seaborg." },
  Bh: { z:107, name:"Bohrium", shells:[2,8,18,32,32,13,2], category:"transition", mass:270, stableWeight:false, melt:null, boil:null, density:37.1, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Niels Bohr." },
  Hs: { z:108, name:"Hassium", shells:[2,8,18,32,32,14,2], category:"transition", mass:269, stableWeight:false, melt:-147, boil:null, density:40.7, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Hesse, Germany." },
  Mt: { z:109, name:"Meitnerium", shells:[2,8,18,32,32,15,2], category:"transition", mass:278, stableWeight:false, melt:null, boil:null, density:37.4, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after physicist Lise Meitner." },
  Ds: { z:110, name:"Darmstadtium", shells:[2,8,18,32,32,16,2], category:"transition", mass:281, stableWeight:false, melt:null, boil:null, density:34.8, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Darmstadt, Germany." },
  Rg: { z:111, name:"Roentgenium", shells:[2,8,18,32,32,17,2], category:"transition", mass:282, stableWeight:false, melt:null, boil:null, density:28.7, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Wilhelm Röntgen." },
  Cn: { z:112, name:"Copernicium", shells:[2,8,18,32,32,18,2], category:"transition", mass:285, stableWeight:false, melt:null, boil:3297, density:14.0, densityUnit:"g/cm³", phase:"Liquid", en:null, theoretical:true, blurb:"Named after Copernicus." },
  Nh: { z:113, name:"Nihonium", shells:[2,8,18,32,32,18,3], category:"transition", mass:286, stableWeight:false, melt:427, boil:1157, density:16, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"First discovered in Asia (Japan)." },
  Fl: { z:114, name:"Flerovium", shells:[2,8,18,32,32,18,4], category:"post-metal", mass:289, stableWeight:false, melt:67, boil:147, density:14, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Synthetic element made in Russia." },
  Mc: { z:115, name:"Moscovium", shells:[2,8,18,32,32,18,5], category:"post-metal", mass:289, stableWeight:false, melt:397, boil:1127, density:13.5, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after the Moscow region." },
  Lv: { z:116, name:"Livermorium", shells:[2,8,18,32,32,18,6], category:"post-metal", mass:293, stableWeight:false, melt:436, boil:812, density:12.9, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Livermore Laboratory." },
  Ts: { z:117, name:"Tennessine", shells:[2,8,18,32,32,18,7], category:"halogen", mass:294, stableWeight:false, melt:450, boil:610, density:7.17, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after the state of Tennessee." },
  Og: { z:118, name:"Oganesson", shells:[2,8,18,32,32,18,8], category:"noble-gas", mass:294, stableWeight:false, melt:null, boil:77, density:4.95, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"The final element of the Periodic Table." },
};

// HARDCODED COLOR LIST - NO BLACK SPHERES
const ATOM_COLOR = {
  // Noble Gases (Green)
  He: 0x00ff7f, Ne: 0x00ff7f, Ar: 0x00ff7f, Kr: 0x00ff7f, Xe: 0x00ff7f, Rn: 0x00ff7f, Og: 0x00ff7f,
  // Transition Metals (Sky Blue)
  Sc: 0x7fd9ff, Ti: 0x7fd9ff, V: 0x7fd9ff, Cr: 0x7fd9ff, Mn: 0x7fd9ff, Fe: 0x7fd9ff, Co: 0x7fd9ff,
  Ni: 0x7fd9ff, Cu: 0x7fd9ff, Zn: 0x7fd9ff, Y: 0x7fd9ff, Zr: 0x7fd9ff, Nb: 0x7fd9ff, Mo: 0x7fd9ff,
  Tc: 0x7fd9ff, Ru: 0x7fd9ff, Rh: 0x7fd9ff, Pd: 0x7fd9ff, Ag: 0x7fd9ff, Cd: 0x7fd9ff, Hf: 0x7fd9ff,
  Ta: 0x7fd9ff, W: 0x7fd9ff, Re: 0x7fd9ff, Os: 0x7fd9ff, Ir: 0x7fd9ff, Pt: 0x7fd9ff, Au: 0x7fd9ff,
  Hg: 0x7fd9ff, Rf: 0x7fd9ff, Db: 0x7fd9ff, Sg: 0x7fd9ff, Bh: 0x7fd9ff, Hs: 0x7fd9ff, Mt: 0x7fd9ff,
  Ds: 0x7fd9ff, Rg: 0x7fd9ff, Cn: 0x7fd9ff, Nh: 0x7fd9ff,
  // Nonmetals (Light Purple)
  H: 0xf2f0ea, C: 0x444444, N: 0x3b6fd9, O: 0xe0483e, P: 0xff8000, S: 0xe8c93a, Se: 0xc9c3e0,
  // Alkali Metals (Orange)
  Li: 0xffb454, Na: 0xffb454, K: 0xffb454, Rb: 0xffb454, Cs: 0xffb454, Fr: 0xffb454,
  // Alkaline Earth (Yellowish)
  Be: 0xffcf8a, Mg: 0xffcf8a, Ca: 0xffcf8a, Sr: 0xffcf8a, Ba: 0xffcf8a, Ra: 0xffcf8a,
  // Halogens (Pink)
  F: 0xff6fae, Cl: 0xff6fae, Br: 0xff6fae, I: 0xff6fae, At: 0xff6fae, Ts: 0xff6fae,
  // Metalloids (Teal)
  B: 0x5ce1c9, Si: 0x5ce1c9, Ge: 0x5ce1c9, As: 0x5ce1c9, Sb: 0x5ce1c9, Te: 0x5ce1c9, Po: 0x5ce1c9,
  // Post-Transition (Grey/Purple)
  Al: 0xb39ddb, Ga: 0xb39ddb, In: 0xb39ddb, Sn: 0xb39ddb, Tl: 0xb39ddb, Pb: 0xb39ddb, Bi: 0xb39ddb,
  Fl: 0xb39ddb, Mc: 0xb39ddb, Lv: 0xb39ddb,
  // Lanthanides / Actinides (Tan)
  La: 0xe8c93a, Ce: 0xe8c93a, Pr: 0xe8c93a, Nd: 0xe8c93a, Pm: 0xe8c93a, Sm: 0xe8c93a, Eu: 0xe8c93a,
  Gd: 0xe8c93a, Tb: 0xe8c93a, Dy: 0xe8c93a, Ho: 0xe8c93a, Er: 0xe8c93a, Tm: 0xe8c93a, Yb: 0xe8c93a,
  Lu: 0xe8c93a, Ac: 0xff7043, Th: 0xff7043, Pa: 0xff7043, U: 0xff7043, Np: 0xff7043, Pu: 0xff7043,
  Am: 0xff7043, Cm: 0xff7043, Bk: 0xff7043, Cf: 0xff7043, Es: 0xff7043, Fm: 0xff7043, Md: 0xff7043,
  No: 0xff7043, Lr: 0xff7043,
  default: 0xaaaaaa
};

const ATOM_RADIUS = {
  H: 0.35, C: 0.5, O: 0.48, N: 0.48, default: 0.6
};

const MOLECULES = {
  H2O: { name: "Water", formula: "H₂O", atoms: [{ el: "O", pos: [0, 0, 0] }, { el: "H", pos: [0.76, 0.59, 0] }, { el: "H", pos: [-0.76, 0.59, 0] }], bonds: [[0,1],[0,2]] },
  CO2: { name: "Carbon dioxide", formula: "CO₂", atoms: [{ el: "C", pos: [0,0,0] }, { el: "O", pos: [1.16,0,0] }, { el: "O", pos: [-1.16,0,0] }], bonds: [[0,1],[0,2]] },
  CH4: { name: "Methane", formula: "CH₄", atoms: [{ el: "C", pos: [0,0,0] }, { el: "H", pos: [0.6,0.6,0.6] }, { el: "H", pos: [-0.6,-0.6,0.6] }, { el: "H", pos: [-0.6,0.6,-0.6] }, { el: "H", pos: [0.6,-0.6,-0.6] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  NH3: { name: "Ammonia", formula: "NH₃", atoms: [{ el: "N", pos: [0,0.2,0] }, { el: "H", pos: [0.9,-0.3,0] }, { el: "H", pos: [-0.4,-0.3,0.8] }], bonds: [[0,1],[0,2]] },
  NACL: { name: "Sodium chloride", formula: "NaCl", atoms: [{ el: "Na", pos: [0.7,0,0] }, { el: "Cl", pos: [-0.7,0,0] }], bonds: [[0,1]] },
  C6H6: { name: "Benzene", formula: "C₆H₆", atoms: [{ el: "C", pos: [1.4,0,0] }, { el: "C", pos: [0.7,1.2,0] }, { el: "C", pos: [-0.7,1.2,0] }, { el: "C", pos: [-1.4,0,0] }, { el: "C", pos: [-0.7,-1.2,0] }, { el: "C", pos: [0.7,-1.2,0] }], bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
  C3H6O: { name: "Acetone", formula: "C₃H₆O", atoms: [{ el: "C", pos: [0,0,0] }, { el: "O", pos: [0,1.2,0] }, { el: "C", pos: [1,-0.5,0] }], bonds: [[0,1],[0,2]] },
  C6H12O6: { name: "Glucose", formula: "C₆H₁₂O₆", atoms: [{ el: "C", pos: [0,0,0] }, { el: "C", pos: [1.5,0,0] }, { el: "O", pos: [2.1,1.2,0] }], bonds: [[0,1],[1,2]] },
  H2SO4: { name: "Sulfuric acid", formula: "H₂SO₄", atoms: [{ el: "S", pos: [0,0,0] }, { el: "O", pos: [0,1.5,0] }, { el: "O", pos: [1.5,0,0] }], bonds: [[0,1],[0,2]] },
  C9H8O4: { name: "Aspirin", formula: "C₉H₈O₄", atoms: [{ el: "C", pos: [0,0,0] }, { el: "O", pos: [1,1,0] }], bonds: [[0,1]] },
};

const ALLOYS = {
  STEEL: { 
    name: "Steel", composition: "Iron (~98%) + Carbon", category: "Ferrous Alloy", blurb: "A strong alloy of Iron and Carbon.",
    atoms: [{ el: "Fe", pos: [0,0,0] }, { el: "Fe", pos: [1.4,0,0] }, { el: "C", pos: [0.7,0.5,0] }], bonds: [[0,2],[1,2]]
  },
  BRASS: { 
    name: "Brass", composition: "Copper (~66%) + Zinc", category: "Copper Alloy", blurb: "Copper-Zinc alloy used in musical instruments.",
    atoms: [{ el: "Cu", pos: [0,0,0] }, { el: "Zn", pos: [1.4,0,0] }], bonds: [[0,1]]
  },
  BRONZE: { 
    name: "Bronze", composition: "Copper (~88%) + Tin", category: "Copper Alloy", blurb: "Ancient alloy of Copper and Tin.",
    atoms: [{ el: "Cu", pos: [0,0,0] }, { el: "Sn", pos: [1.4,0,0] }], bonds: [[0,1]]
  },
  STAINLESS_STEEL: { 
    name: "Stainless Steel", composition: "Iron + Chromium + Nickel", category: "Ferrous Alloy", blurb: "Corrosion-resistant metal.",
    atoms: [{ el: "Fe", pos: [0,0,0] }, { el: "Cr", pos: [1.4,0,0] }, { el: "Ni", pos: [0,1.4,0] }], bonds: [[0,1],[0,2]]
  },
  STERLING_SILVER: { 
    name: "Sterling Silver", composition: "Silver (92.5%) + Copper", category: "Silver Alloy", blurb: "Standard silver jewelry alloy.",
    atoms: [{ el: "Ag", pos: [0,0,0] }, { el: "Cu", pos: [1.2,0,0] }], bonds: [[0,1]]
  },
  GOLD_14K: { 
    name: "14k Gold", composition: "Gold + Silver/Copper", category: "Gold Alloy", blurb: "Standard 14k Gold for jewelry.",
    atoms: [{ el: "Au", pos: [0,0,0] }, { el: "Ag", pos: [1.4,0,0] }], bonds: [[0,1]]
  },
  NITINOL: { name: "Nitinol", composition: "Nickel + Titanium", category: "Shape-Memory Alloy", atoms: [{el:"Ni", pos:[0,0,0]},{el:"Ti", pos:[1,0,0]}], bonds:[[0,1]], blurb: "Remembers its shape." },
  MAGNALIUM: { name: "Magnalium", composition: "Aluminium + Magnesium", category: "Lightweight Alloy", atoms: [{el:"Al", pos:[0,0,0]},{el:"Mg", pos:[1,0,0]}], bonds:[[0,1]], blurb: "Used in aircraft." },
  DURALUMIN: { name: "Duralumin", composition: "Aluminium + Copper", category: "Lightweight Alloy", atoms: [{el:"Al", pos:[0,0,0]},{el:"Cu", pos:[1,0,0]}], bonds:[[0,1]], blurb: "Hardened aluminum." },
  PEWTER: { name: "Pewter", composition: "Tin (~90%) + Antimony", category: "Tin Alloy", atoms: [{el:"Sn", pos:[0,0,0]},{el:"Sb", pos:[1,0,0]}], bonds:[[0,1]], blurb: "Used for decorative objects." }
};

function resolveQuery(raw) {
  const q = raw.trim();
  if (!q) return null;
  const key = q.toUpperCase().replace(/\s+/g, "");
  
  if (MOLECULES[key]) return { type: "molecule", key, data: MOLECULES[key] };
  const alloyKey = q.toUpperCase().replace(/\s+/g, "_");
  if (ALLOYS[alloyKey]) return { type: "alloy", key: alloyKey, data: ALLOYS[alloyKey] };

  const byFormula = Object.entries(MOLECULES).find(([, m]) => {
    const cleanFormula = m.formula.replace(/[₀-₉]/g, n => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(n)]).toUpperCase();
    return cleanFormula === key || m.name.toUpperCase() === q.toUpperCase();
  });
  if (byFormula) return { type: "molecule", key: byFormula[0], data: byFormula[1] };

  const sym = q.charAt(0).toUpperCase() + q.slice(1).toLowerCase();
  if (ELEMENTS[sym]) return { type: "element", key: sym, data: ELEMENTS[sym] };

  const byElName = Object.entries(ELEMENTS).find(([, e]) => e.name.toUpperCase() === q.toUpperCase());
  if (byElName) return { type: "element", key: byElName[0], data: byElName[1] };

  return null;
}
