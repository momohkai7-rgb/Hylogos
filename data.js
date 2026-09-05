// Hylogos: reference data — all 118 known elements, plus a small library of
// common molecules with idealized 3D geometry.
// Element property values are standard reference figures (IUPAC-style); for
// superheavy elements (Z 104+) melt/boil/density/radius are theoretical
// predictions — these elements have only ever existed as a handful of
// short-lived atoms. radius: empirical atomic radius in picometers
// (consensus/composite reference table).

const ELEMENTS = {
  H: { z:1, name:"Hydrogen", shells:[1], category:"nonmetal", mass:1.008, stableWeight:true, melt:-259, boil:-253, density:0.08988, densityUnit:"g/L", phase:"Gas", en:2.2, radius:25, theoretical:false, blurb:"The simplest and most abundant element in the universe — one proton, one electron, no neutrons in its common form." },
  He: { z:2, name:"Helium", shells:[2], category:"noble-gas", mass:4.003, stableWeight:true, melt:-272, boil:-269, density:0.1786, densityUnit:"g/L", phase:"Gas", en:null, radius:31, theoretical:false, blurb:"Second most abundant element in the universe; too light and unreactive to stay in Earth's atmosphere for long, so it's mined from natural gas." },
  Li: { z:3, name:"Lithium", shells:[2,1], category:"alkali", mass:6.94, stableWeight:true, melt:180, boil:1330, density:0.534, densityUnit:"g/cm³", phase:"Solid", en:0.98, radius:145, theoretical:false, blurb:"Lightest metal that exists; today mostly known for powering rechargeable batteries in phones and EVs." },
  Be: { z:4, name:"Beryllium", shells:[2,2], category:"alkaline-earth", mass:9.012, stableWeight:true, melt:1287, boil:2469, density:1.85, densityUnit:"g/cm³", phase:"Solid", en:1.57, radius:105, theoretical:false, blurb:"A light, stiff, toxic metal used in aerospace parts and X-ray equipment windows." },
  B: { z:5, name:"Boron", shells:[2,3], category:"metalloid", mass:10.81, stableWeight:true, melt:2076, boil:3927, density:2.08, densityUnit:"g/cm³", phase:"Solid", en:2.04, radius:85, theoretical:false, blurb:"Essential trace nutrient for plants; also the element in borosilicate (Pyrex) glass." },
  C: { z:6, name:"Carbon", shells:[2,4], category:"nonmetal", mass:12.011, stableWeight:true, melt:null, boil:null, density:2.267, densityUnit:"g/cm³", phase:"Solid", en:2.55, radius:70, theoretical:false, blurb:"Backbone of all known life and organic chemistry; forms diamond, graphite, and graphene depending on how its atoms bond. Sublimes rather than melting at normal pressure." },
  N: { z:7, name:"Nitrogen", shells:[2,5], category:"nonmetal", mass:14.007, stableWeight:true, melt:-210, boil:-196, density:1.251, densityUnit:"g/L", phase:"Gas", en:3.04, radius:65, theoretical:false, blurb:"Makes up about 78% of the air you're breathing right now; essential to amino acids and DNA." },
  O: { z:8, name:"Oxygen", shells:[2,6], category:"nonmetal", mass:15.999, stableWeight:true, melt:-219, boil:-183, density:1.429, densityUnit:"g/L", phase:"Gas", en:3.44, radius:60, theoretical:false, blurb:"The element you're breathing to stay alive; also the most abundant element in Earth's crust by mass." },
  F: { z:9, name:"Fluorine", shells:[2,7], category:"halogen", mass:18.998, stableWeight:true, melt:-220, boil:-188, density:1.696, densityUnit:"g/L", phase:"Gas", en:3.98, radius:50, theoretical:false, blurb:"The most reactive nonmetal on the table; added to drinking water and toothpaste to strengthen tooth enamel." },
  Ne: { z:10, name:"Neon", shells:[2,8], category:"noble-gas", mass:20.18, stableWeight:true, melt:-249, boil:-246, density:0.9002, densityUnit:"g/L", phase:"Gas", en:null, radius:38, theoretical:false, blurb:"Glows reddish-orange when electrified in a vacuum tube — the original 'neon sign' gas." },
  Na: { z:11, name:"Sodium", shells:[2,8,1], category:"alkali", mass:22.99, stableWeight:true, melt:98, boil:883, density:0.968, densityUnit:"g/cm³", phase:"Solid", en:0.93, radius:180, theoretical:false, blurb:"Explosively reactive metal on its own, but bonds with chlorine to form ordinary table salt." },
  Mg: { z:12, name:"Magnesium", shells:[2,8,2], category:"alkaline-earth", mass:24.305, stableWeight:true, melt:650, boil:1090, density:1.738, densityUnit:"g/cm³", phase:"Solid", en:1.31, radius:150, theoretical:false, blurb:"Burns with a brilliant white light; also the metal at the center of every chlorophyll molecule in green plants." },
  Al: { z:13, name:"Aluminium", shells:[2,8,3], category:"post-metal", mass:26.982, stableWeight:true, melt:660, boil:2470, density:2.7, densityUnit:"g/cm³", phase:"Solid", en:1.61, radius:125, theoretical:false, blurb:"Most abundant metal in Earth's crust; light, corrosion-resistant, and endlessly recyclable." },
  Si: { z:14, name:"Silicon", shells:[2,8,4], category:"metalloid", mass:28.085, stableWeight:true, melt:1414, boil:3265, density:2.329, densityUnit:"g/cm³", phase:"Solid", en:1.9, radius:110, theoretical:false, blurb:"Second most abundant element in Earth's crust; the semiconductor at the heart of every computer chip." },
  P: { z:15, name:"Phosphorus", shells:[2,8,5], category:"nonmetal", mass:30.974, stableWeight:true, melt:44, boil:281, density:1.823, densityUnit:"g/cm³", phase:"Solid", en:2.19, radius:100, theoretical:false, blurb:"Essential to DNA, ATP, and bones; white phosphorus glows faintly in the dark and ignites in air." },
  S: { z:16, name:"Sulfur", shells:[2,8,6], category:"nonmetal", mass:32.06, stableWeight:true, melt:115, boil:445, density:2.07, densityUnit:"g/cm³", phase:"Solid", en:2.58, radius:100, theoretical:false, blurb:"Known since antiquity as 'brimstone'; gives rotten eggs their smell as hydrogen sulfide." },
  Cl: { z:17, name:"Chlorine", shells:[2,8,7], category:"halogen", mass:35.45, stableWeight:true, melt:-102, boil:-34, density:3.2, densityUnit:"g/L", phase:"Gas", en:3.16, radius:100, theoretical:false, blurb:"A toxic yellow-green gas on its own, used to disinfect drinking water and swimming pools." },
  Ar: { z:18, name:"Argon", shells:[2,8,8], category:"noble-gas", mass:39.948, stableWeight:true, melt:-189, boil:-186, density:1.784, densityUnit:"g/L", phase:"Gas", en:null, radius:71, theoretical:false, blurb:"Makes up about 1% of Earth's atmosphere; fills incandescent light bulbs since it won't react with the hot filament." },
  K: { z:19, name:"Potassium", shells:[2,8,8,1], category:"alkali", mass:39.098, stableWeight:true, melt:64, boil:759, density:0.862, densityUnit:"g/cm³", phase:"Solid", en:0.82, radius:220, theoretical:false, blurb:"Vital nutrient for nerve and muscle function; reacts violently with water, floating and igniting." },
  Ca: { z:20, name:"Calcium", shells:[2,8,8,2], category:"alkaline-earth", mass:40.078, stableWeight:true, melt:842, boil:1484, density:1.55, densityUnit:"g/cm³", phase:"Solid", en:1, radius:180, theoretical:false, blurb:"Most abundant metal in the human body — it's what your bones and teeth are built from." },
  Sc: { z:21, name:"Scandium", shells:[2,8,9,2], category:"transition", mass:44.956, stableWeight:true, melt:1541, boil:2836, density:2.985, densityUnit:"g/cm³", phase:"Solid", en:1.36, radius:160, theoretical:false, blurb:"A rare, silvery metal mostly used in aerospace alloys and high-intensity stadium lighting." },
  Ti: { z:22, name:"Titanium", shells:[2,8,10,2], category:"transition", mass:47.867, stableWeight:true, melt:1668, boil:3287, density:4.506, densityUnit:"g/cm³", phase:"Solid", en:1.54, radius:140, theoretical:false, blurb:"As strong as steel but much lighter; used in aircraft frames, hip replacements, and white paint pigment." },
  V: { z:23, name:"Vanadium", shells:[2,8,11,2], category:"transition", mass:50.942, stableWeight:true, melt:1910, boil:3407, density:6, densityUnit:"g/cm³", phase:"Solid", en:1.63, radius:135, theoretical:false, blurb:"Strengthens steel alloys; essential in trace amounts to some marine organisms' blood." },
  Cr: { z:24, name:"Chromium", shells:[2,8,13,1], category:"transition", mass:51.996, stableWeight:true, melt:1907, boil:2671, density:7.19, densityUnit:"g/cm³", phase:"Solid", en:1.66, radius:140, theoretical:false, blurb:"Gives stainless steel its shine and rust resistance; also the source of ruby's red and emerald's green color." },
  Mn: { z:25, name:"Manganese", shells:[2,8,13,2], category:"transition", mass:54.938, stableWeight:true, melt:1246, boil:2061, density:7.21, densityUnit:"g/cm³", phase:"Solid", en:1.55, radius:140, theoretical:false, blurb:"Essential trace nutrient; alloyed into steel to make it far more resistant to wear and impact." },
  Fe: { z:26, name:"Iron", shells:[2,8,14,2], category:"transition", mass:55.845, stableWeight:true, melt:1538, boil:2861, density:7.874, densityUnit:"g/cm³", phase:"Solid", en:1.83, radius:140, theoretical:false, blurb:"The most common element on Earth by mass, mostly in the core; carries oxygen in your blood as hemoglobin." },
  Co: { z:27, name:"Cobalt", shells:[2,8,15,2], category:"transition", mass:58.933, stableWeight:true, melt:1495, boil:2927, density:8.9, densityUnit:"g/cm³", phase:"Solid", en:1.88, radius:135, theoretical:false, blurb:"Gives old-fashioned glass and ceramics their deep blue color; a key ingredient in rechargeable battery cathodes." },
  Ni: { z:28, name:"Nickel", shells:[2,8,16,2], category:"transition", mass:58.693, stableWeight:true, melt:1455, boil:2730, density:8.908, densityUnit:"g/cm³", phase:"Solid", en:1.91, radius:135, theoretical:false, blurb:"Corrosion-resistant metal used in coins, stainless steel, and rechargeable batteries." },
  Cu: { z:29, name:"Copper", shells:[2,8,18,1], category:"transition", mass:63.546, stableWeight:true, melt:1085, boil:2562, density:8.96, densityUnit:"g/cm³", phase:"Solid", en:1.9, radius:135, theoretical:false, blurb:"One of the few metals with a natural color besides silver or gold; an excellent conductor used in most electrical wiring." },
  Zn: { z:30, name:"Zinc", shells:[2,8,18,2], category:"transition", mass:65.382, stableWeight:true, melt:420, boil:907, density:7.14, densityUnit:"g/cm³", phase:"Solid", en:1.65, radius:135, theoretical:false, blurb:"Coats steel to prevent rust (galvanization); also an essential trace nutrient for immune function." },
  Ga: { z:31, name:"Gallium", shells:[2,8,18,3], category:"post-metal", mass:69.723, stableWeight:true, melt:30, boil:2400, density:5.91, densityUnit:"g/cm³", phase:"Solid", en:1.81, radius:130, theoretical:false, blurb:"Melts at just below body temperature — it will liquefy in your hand." },
  Ge: { z:32, name:"Germanium", shells:[2,8,18,4], category:"metalloid", mass:72.631, stableWeight:true, melt:938, boil:2833, density:5.323, densityUnit:"g/cm³", phase:"Solid", en:2.01, radius:125, theoretical:false, blurb:"A metalloid semiconductor that helped launch the transistor era before silicon took over." },
  As: { z:33, name:"Arsenic", shells:[2,8,18,5], category:"metalloid", mass:74.922, stableWeight:true, melt:null, boil:615, density:5.727, densityUnit:"g/cm³", phase:"Solid", en:2.18, radius:115, theoretical:false, blurb:"Notoriously poisonous, but historically used as a wood preservative; sublimes directly from solid to gas." },
  Se: { z:34, name:"Selenium", shells:[2,8,18,6], category:"nonmetal", mass:78.972, stableWeight:true, melt:221, boil:685, density:4.81, densityUnit:"g/cm³", phase:"Solid", en:2.55, radius:115, theoretical:false, blurb:"Essential trace nutrient with a narrow safe range; used in some photocopier drums for its light sensitivity." },
  Br: { z:35, name:"Bromine", shells:[2,8,18,7], category:"halogen", mass:79.904, stableWeight:true, melt:-7, boil:59, density:3.1028, densityUnit:"g/cm³", phase:"Liquid", en:2.96, radius:115, theoretical:false, blurb:"One of only two elements that are liquid at room temperature; a dense, corrosive reddish-brown liquid." },
  Kr: { z:36, name:"Krypton", shells:[2,8,18,8], category:"noble-gas", mass:83.798, stableWeight:true, melt:-157, boil:-153, density:3.749, densityUnit:"g/L", phase:"Gas", en:3, radius:88, theoretical:false, blurb:"An inert noble gas used to fill some energy-efficient fluorescent and specialty lighting." },
  Rb: { z:37, name:"Rubidium", shells:[2,8,18,8,1], category:"alkali", mass:85.468, stableWeight:true, melt:39, boil:688, density:1.532, densityUnit:"g/cm³", phase:"Solid", en:0.82, radius:235, theoretical:false, blurb:"A soft, highly reactive alkali metal; a radioactive isotope of it is used to help date very old rocks." },
  Sr: { z:38, name:"Strontium", shells:[2,8,18,8,2], category:"alkaline-earth", mass:87.621, stableWeight:true, melt:777, boil:1377, density:2.64, densityUnit:"g/cm³", phase:"Solid", en:0.95, radius:200, theoretical:false, blurb:"Gives fireworks their brilliant red color; chemically similar enough to calcium that it can substitute into bone." },
  Y: { z:39, name:"Yttrium", shells:[2,8,18,9,2], category:"transition", mass:88.906, stableWeight:true, melt:1526, boil:2930, density:4.472, densityUnit:"g/cm³", phase:"Solid", en:1.22, radius:180, theoretical:false, blurb:"A rare earth-adjacent metal used in LED phosphors and some superconducting materials." },
  Zr: { z:40, name:"Zirconium", shells:[2,8,18,10,2], category:"transition", mass:91.224, stableWeight:true, melt:1855, boil:4377, density:6.52, densityUnit:"g/cm³", phase:"Solid", en:1.33, radius:155, theoretical:false, blurb:"Highly corrosion-resistant; clads nuclear fuel rods because it barely absorbs neutrons." },
  Nb: { z:41, name:"Niobium", shells:[2,8,18,12,1], category:"transition", mass:92.906, stableWeight:true, melt:2477, boil:4744, density:8.57, densityUnit:"g/cm³", phase:"Solid", en:1.6, radius:145, theoretical:false, blurb:"Used in superconducting magnets, including those in MRI machines and particle accelerators." },
  Mo: { z:42, name:"Molybdenum", shells:[2,8,18,13,1], category:"transition", mass:95.951, stableWeight:true, melt:2623, boil:4639, density:10.28, densityUnit:"g/cm³", phase:"Solid", en:2.16, radius:145, theoretical:false, blurb:"Strengthens high-temperature steel alloys used in aircraft parts and industrial furnaces." },
  Tc: { z:43, name:"Technetium", shells:[2,8,18,13,2], category:"transition", mass:98, stableWeight:false, melt:2157, boil:4265, density:11, densityUnit:"g/cm³", phase:"Solid", en:1.9, radius:135, theoretical:false, blurb:"The lightest element with no stable isotopes at all — every atom of it is radioactive; used in medical imaging." },
  Ru: { z:44, name:"Ruthenium", shells:[2,8,18,15,1], category:"transition", mass:101.072, stableWeight:true, melt:2334, boil:4150, density:12.45, densityUnit:"g/cm³", phase:"Solid", en:2.2, radius:130, theoretical:false, blurb:"A rare, hard platinum-group metal used to harden platinum and palladium alloys for jewelry and electronics." },
  Rh: { z:45, name:"Rhodium", shells:[2,8,18,16,1], category:"transition", mass:102.906, stableWeight:true, melt:1964, boil:3695, density:12.41, densityUnit:"g/cm³", phase:"Solid", en:2.28, radius:135, theoretical:false, blurb:"One of the rarest and most reflective metals; coats catalytic converters and white gold jewelry." },
  Pd: { z:46, name:"Palladium", shells:[2,8,18,18], category:"transition", mass:106.421, stableWeight:true, melt:1555, boil:2963, density:12.023, densityUnit:"g/cm³", phase:"Solid", en:2.2, radius:140, theoretical:false, blurb:"Absorbs huge amounts of hydrogen gas; a key metal in catalytic converters and some jewelry alloys." },
  Ag: { z:47, name:"Silver", shells:[2,8,18,18,1], category:"transition", mass:107.868, stableWeight:true, melt:962, boil:2162, density:10.49, densityUnit:"g/cm³", phase:"Solid", en:1.93, radius:160, theoretical:false, blurb:"The best electrical and thermal conductor of any metal; long valued for coins, jewelry, and mirrors." },
  Cd: { z:48, name:"Cadmium", shells:[2,8,18,18,2], category:"transition", mass:112.414, stableWeight:true, melt:321, boil:767, density:8.65, densityUnit:"g/cm³", phase:"Solid", en:1.69, radius:155, theoretical:false, blurb:"Toxic heavy metal once common in rechargeable batteries and pigments, now heavily restricted." },
  In: { z:49, name:"Indium", shells:[2,8,18,18,3], category:"post-metal", mass:114.818, stableWeight:true, melt:157, boil:2072, density:7.31, densityUnit:"g/cm³", phase:"Solid", en:1.78, radius:155, theoretical:false, blurb:"A soft, malleable metal used to make the transparent conductive coatings on touchscreens." },
  Sn: { z:50, name:"Tin", shells:[2,8,18,18,4], category:"post-metal", mass:118.711, stableWeight:true, melt:232, boil:2602, density:7.365, densityUnit:"g/cm³", phase:"Solid", en:1.96, radius:145, theoretical:false, blurb:"Alloyed with copper to make bronze — one of the first metal alloys humans ever made." },
  Sb: { z:51, name:"Antimony", shells:[2,8,18,18,5], category:"metalloid", mass:121.76, stableWeight:true, melt:631, boil:1635, density:6.697, densityUnit:"g/cm³", phase:"Solid", en:2.05, radius:145, theoretical:false, blurb:"Used since antiquity as a cosmetic (kohl) and today as a flame-retardant additive." },
  Te: { z:52, name:"Tellurium", shells:[2,8,18,18,6], category:"metalloid", mass:127.603, stableWeight:true, melt:450, boil:988, density:6.24, densityUnit:"g/cm³", phase:"Solid", en:2.1, radius:140, theoretical:false, blurb:"A rare metalloid alloyed into some steels and solar panel materials; notoriously bad-smelling even in trace amounts." },
  I: { z:53, name:"Iodine", shells:[2,8,18,18,7], category:"halogen", mass:126.904, stableWeight:true, melt:114, boil:184, density:4.933, densityUnit:"g/cm³", phase:"Solid", en:2.66, radius:140, theoretical:false, blurb:"Essential nutrient for thyroid hormone production; the classic antiseptic 'tincture of iodine' is a solution of it." },
  Xe: { z:54, name:"Xenon", shells:[2,8,18,18,8], category:"noble-gas", mass:131.294, stableWeight:true, melt:-112, boil:-108, density:5.894, densityUnit:"g/L", phase:"Gas", en:2.6, radius:108, theoretical:false, blurb:"Used in high-intensity camera flashes, some car headlights, and as an efficient ion-thruster propellant for spacecraft." },
  Cs: { z:55, name:"Cesium", shells:[2,8,18,18,8,1], category:"alkali", mass:132.905, stableWeight:true, melt:29, boil:671, density:1.93, densityUnit:"g/cm³", phase:"Solid", en:0.79, radius:260, theoretical:false, blurb:"The most reactive stable metal on the table; its atomic transition literally defines the length of a second." },
  Ba: { z:56, name:"Barium", shells:[2,8,18,18,8,2], category:"alkaline-earth", mass:137.328, stableWeight:true, melt:727, boil:1845, density:3.51, densityUnit:"g/cm³", phase:"Solid", en:0.89, radius:215, theoretical:false, blurb:"Its compounds are opaque to X-rays, which is why patients drink a 'barium meal' before certain scans." },
  La: { z:57, name:"Lanthanum", shells:[2,8,18,18,9,2], category:"lanthanide", mass:138.905, stableWeight:true, melt:920, boil:3464, density:6.162, densityUnit:"g/cm³", phase:"Solid", en:1.1, radius:195, theoretical:false, blurb:"The lanthanide the whole rare-earth series is named after; used in camera lenses and hybrid car batteries." },
  Ce: { z:58, name:"Cerium", shells:[2,8,18,19,9,2], category:"lanthanide", mass:140.116, stableWeight:true, melt:795, boil:3443, density:6.77, densityUnit:"g/cm³", phase:"Solid", en:1.12, radius:185, theoretical:false, blurb:"The most abundant rare-earth element, more common in Earth's crust than copper; used in self-cleaning ovens and lighter flints." },
  Pr: { z:59, name:"Praseodymium", shells:[2,8,18,21,8,2], category:"lanthanide", mass:140.908, stableWeight:true, melt:935, boil:3130, density:6.77, densityUnit:"g/cm³", phase:"Solid", en:1.13, radius:185, theoretical:false, blurb:"Used to color glass and ceramics a rich yellow-green; a minor component of some strong magnets." },
  Nd: { z:60, name:"Neodymium", shells:[2,8,18,22,8,2], category:"lanthanide", mass:144.242, stableWeight:true, melt:1024, boil:3074, density:7.01, densityUnit:"g/cm³", phase:"Solid", en:1.14, radius:185, theoretical:false, blurb:"The metal behind today's strongest permanent magnets, found in headphones, hard drives, and wind turbines." },
  Pm: { z:61, name:"Promethium", shells:[2,8,18,23,8,2], category:"lanthanide", mass:145, stableWeight:false, melt:1042, boil:3000, density:7.26, densityUnit:"g/cm³", phase:"Solid", en:1.13, radius:185, theoretical:false, blurb:"The only lanthanide with no stable isotopes; historically used in small amounts in glow-in-the-dark watch dials." },
  Sm: { z:62, name:"Samarium", shells:[2,8,18,24,8,2], category:"lanthanide", mass:150.362, stableWeight:true, melt:1072, boil:1900, density:7.52, densityUnit:"g/cm³", phase:"Solid", en:1.17, radius:185, theoretical:false, blurb:"Used in high-temperature magnets and some of the earliest laser materials." },
  Eu: { z:63, name:"Europium", shells:[2,8,18,25,8,2], category:"lanthanide", mass:151.964, stableWeight:true, melt:826, boil:1529, density:5.264, densityUnit:"g/cm³", phase:"Solid", en:1.2, radius:185, theoretical:false, blurb:"Provides the red glow in older screen phosphors; also used as an anti-counterfeiting mark on euro banknotes." },
  Gd: { z:64, name:"Gadolinium", shells:[2,8,18,25,9,2], category:"lanthanide", mass:157.253, stableWeight:true, melt:1312, boil:3000, density:7.9, densityUnit:"g/cm³", phase:"Solid", en:1.2, radius:180, theoretical:false, blurb:"Highly magnetic; used as the contrast agent injected before many MRI scans." },
  Tb: { z:65, name:"Terbium", shells:[2,8,18,27,8,2], category:"lanthanide", mass:158.925, stableWeight:true, melt:1356, boil:3123, density:8.23, densityUnit:"g/cm³", phase:"Solid", en:1.1, radius:175, theoretical:false, blurb:"Used in solid-state devices and green phosphors for energy-efficient lighting and displays." },
  Dy: { z:66, name:"Dysprosium", shells:[2,8,18,28,8,2], category:"lanthanide", mass:162.5, stableWeight:true, melt:1407, boil:2567, density:8.54, densityUnit:"g/cm³", phase:"Solid", en:1.22, radius:175, theoretical:false, blurb:"Added to neodymium magnets to keep them working at high temperatures, as in electric motors." },
  Ho: { z:67, name:"Holmium", shells:[2,8,18,29,8,2], category:"lanthanide", mass:164.93, stableWeight:true, melt:1461, boil:2600, density:8.79, densityUnit:"g/cm³", phase:"Solid", en:1.23, radius:175, theoretical:false, blurb:"Has the highest magnetic strength of any element; used in some medical lasers and strong magnet cores." },
  Er: { z:68, name:"Erbium", shells:[2,8,18,30,8,2], category:"lanthanide", mass:167.259, stableWeight:true, melt:1529, boil:2868, density:9.066, densityUnit:"g/cm³", phase:"Solid", en:1.24, radius:175, theoretical:false, blurb:"Doped into fiber-optic cables to amplify light signals over long-distance internet and phone lines." },
  Tm: { z:69, name:"Thulium", shells:[2,8,18,31,8,2], category:"lanthanide", mass:168.934, stableWeight:true, melt:1545, boil:1950, density:9.32, densityUnit:"g/cm³", phase:"Solid", en:1.25, radius:175, theoretical:false, blurb:"The rarest naturally occurring lanthanide; used in some portable X-ray devices." },
  Yb: { z:70, name:"Ytterbium", shells:[2,8,18,32,8,2], category:"lanthanide", mass:173.045, stableWeight:true, melt:824, boil:1196, density:6.9, densityUnit:"g/cm³", phase:"Solid", en:1.1, radius:175, theoretical:false, blurb:"Used in some atomic clocks and as a calibrated stress gauge in earthquake and explosion sensors." },
  Lu: { z:71, name:"Lutetium", shells:[2,8,18,32,9,2], category:"lanthanide", mass:174.967, stableWeight:true, melt:1652, boil:3402, density:9.841, densityUnit:"g/cm³", phase:"Solid", en:1.27, radius:175, theoretical:false, blurb:"The densest and hardest lanthanide; used in trace amounts in some PET medical scanner detectors." },
  Hf: { z:72, name:"Hafnium", shells:[2,8,18,32,10,2], category:"transition", mass:178.492, stableWeight:true, melt:2233, boil:4603, density:13.31, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:155, theoretical:false, blurb:"Used in nuclear reactor control rods because it absorbs neutrons extremely well — the opposite job of zirconium next door." },
  Ta: { z:73, name:"Tantalum", shells:[2,8,18,32,11,2], category:"transition", mass:180.948, stableWeight:true, melt:3017, boil:5458, density:16.69, densityUnit:"g/cm³", phase:"Solid", en:1.5, radius:145, theoretical:false, blurb:"Highly corrosion-resistant; used in surgical implants and the tiny capacitors inside most smartphones." },
  W: { z:74, name:"Tungsten", shells:[2,8,18,32,12,2], category:"transition", mass:183.841, stableWeight:true, melt:3422, boil:5930, density:19.25, densityUnit:"g/cm³", phase:"Solid", en:2.36, radius:135, theoretical:false, blurb:"Has the highest melting point of any metal, which is why it was the classic incandescent light bulb filament." },
  Re: { z:75, name:"Rhenium", shells:[2,8,18,32,13,2], category:"transition", mass:186.207, stableWeight:true, melt:3186, boil:5596, density:21.02, densityUnit:"g/cm³", phase:"Solid", en:1.9, radius:135, theoretical:false, blurb:"One of the rarest elements in Earth's crust; alloyed into jet engine turbine blades for heat resistance." },
  Os: { z:76, name:"Osmium", shells:[2,8,18,32,14,2], category:"transition", mass:190.233, stableWeight:true, melt:3033, boil:5012, density:22.59, densityUnit:"g/cm³", phase:"Solid", en:2.2, radius:130, theoretical:false, blurb:"The densest naturally occurring element; extremely hard, used in fountain pen nib tips and some electrical contacts." },
  Ir: { z:77, name:"Iridium", shells:[2,8,18,32,15,2], category:"transition", mass:192.217, stableWeight:true, melt:2446, boil:4130, density:22.56, densityUnit:"g/cm³", phase:"Solid", en:2.2, radius:135, theoretical:false, blurb:"The most corrosion-resistant metal known; a thin layer of it marks the geological boundary from the dinosaur-ending asteroid impact." },
  Pt: { z:78, name:"Platinum", shells:[2,8,18,32,17,1], category:"transition", mass:195.085, stableWeight:true, melt:1768, boil:3825, density:21.45, densityUnit:"g/cm³", phase:"Solid", en:2.28, radius:135, theoretical:false, blurb:"Prized in jewelry for its resistance to tarnish; also the catalyst inside most car catalytic converters." },
  Au: { z:79, name:"Gold", shells:[2,8,18,32,18,1], category:"transition", mass:196.967, stableWeight:true, melt:1064, boil:2970, density:19.3, densityUnit:"g/cm³", phase:"Solid", en:2.54, radius:135, theoretical:false, blurb:"Doesn't tarnish or corrode, which is why it's been used for currency and jewelry across nearly every human civilization." },
  Hg: { z:80, name:"Mercury", shells:[2,8,18,32,18,2], category:"transition", mass:200.592, stableWeight:true, melt:-39, boil:357, density:13.534, densityUnit:"g/cm³", phase:"Liquid", en:2, radius:150, theoretical:false, blurb:"The only metal that's liquid at room temperature; once common in thermometers, now phased out for its toxicity." },
  Tl: { z:81, name:"Thallium", shells:[2,8,18,32,18,3], category:"post-metal", mass:204.38, stableWeight:true, melt:304, boil:1473, density:11.85, densityUnit:"g/cm³", phase:"Solid", en:1.62, radius:190, theoretical:false, blurb:"A highly toxic heavy metal once used as rat poison; today used in trace amounts in some electronics." },
  Pb: { z:82, name:"Lead", shells:[2,8,18,32,18,4], category:"post-metal", mass:207.21, stableWeight:true, melt:327, boil:1749, density:11.34, densityUnit:"g/cm³", phase:"Solid", en:1.87, radius:180, theoretical:false, blurb:"Dense and easy to shape; used for millennia in pipes and paint before its neurotoxicity was understood and restricted." },
  Bi: { z:83, name:"Bismuth", shells:[2,8,18,32,18,5], category:"post-metal", mass:208.98, stableWeight:true, melt:272, boil:1564, density:9.78, densityUnit:"g/cm³", phase:"Solid", en:2.02, radius:160, theoretical:false, blurb:"Surprisingly non-toxic for a heavy metal; forms rainbow-colored oxide crystals and is used in some stomach medicines." },
  Po: { z:84, name:"Polonium", shells:[2,8,18,32,18,6], category:"post-metal", mass:209, stableWeight:false, melt:254, boil:962, density:9.196, densityUnit:"g/cm³", phase:"Solid", en:2, radius:190, theoretical:false, blurb:"Extremely radioactive — a speck the size of a grain of rice can be lethal; discovered by Marie Curie." },
  At: { z:85, name:"Astatine", shells:[2,8,18,32,18,7], category:"halogen", mass:210, stableWeight:false, melt:302, boil:337, density:6.35, densityUnit:"g/cm³", phase:"Solid", en:2.2, radius:127, theoretical:false, blurb:"The rarest naturally occurring element on Earth — less than a gram exists in the planet's entire crust at any moment." },
  Rn: { z:86, name:"Radon", shells:[2,8,18,32,18,8], category:"noble-gas", mass:222, stableWeight:false, melt:-71, boil:-62, density:9.73, densityUnit:"g/L", phase:"Gas", en:2.2, radius:120, theoretical:false, blurb:"A radioactive noble gas that seeps from soil and rock; the second-leading cause of lung cancer after smoking." },
  Fr: { z:87, name:"Francium", shells:[2,8,18,32,18,8,1], category:"alkali", mass:223, stableWeight:false, melt:27, boil:677, density:1.87, densityUnit:"g/cm³", phase:"Solid", en:0.79, radius:270, theoretical:false, blurb:"The second-rarest naturally occurring element; so radioactive and short-lived that only a tiny amount may exist on Earth at once." },
  Ra: { z:88, name:"Radium", shells:[2,8,18,32,18,8,2], category:"alkaline-earth", mass:226, stableWeight:false, melt:960, boil:1737, density:5.5, densityUnit:"g/cm³", phase:"Solid", en:0.9, radius:215, theoretical:false, blurb:"Once painted onto glow-in-the-dark watch dials by hand, a practice that poisoned many factory workers before its dangers were known." },
  Ac: { z:89, name:"Actinium", shells:[2,8,18,32,18,9,2], category:"actinide", mass:227, stableWeight:false, melt:1227, boil:3227, density:10, densityUnit:"g/cm³", phase:"Solid", en:1.1, radius:195, theoretical:false, blurb:"The actinide series' namesake; intensely radioactive, reportedly glowing faintly blue from ionizing the air around it." },
  Th: { z:90, name:"Thorium", shells:[2,8,18,32,18,10,2], category:"actinide", mass:232.038, stableWeight:true, melt:1750, boil:4788, density:11.724, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:180, theoretical:false, blurb:"Mildly radioactive metal once used in gas lantern mantles; a candidate fuel for next-generation nuclear reactors." },
  Pa: { z:91, name:"Protactinium", shells:[2,8,18,32,20,9,2], category:"actinide", mass:231.036, stableWeight:true, melt:1568, boil:4027, density:15.37, densityUnit:"g/cm³", phase:"Solid", en:1.5, radius:180, theoretical:false, blurb:"One of the rarest and most expensive naturally occurring elements; has no significant uses outside research." },
  U: { z:92, name:"Uranium", shells:[2,8,18,32,21,9,2], category:"actinide", mass:238.029, stableWeight:true, melt:1132, boil:4131, density:19.1, densityUnit:"g/cm³", phase:"Solid", en:1.38, radius:175, theoretical:false, blurb:"Fuels nuclear power plants and weapons; its natural decay chain is also used to date the age of rocks." },
  Np: { z:93, name:"Neptunium", shells:[2,8,18,32,22,9,2], category:"actinide", mass:237, stableWeight:false, melt:639, boil:4174, density:20.45, densityUnit:"g/cm³", phase:"Solid", en:1.36, radius:175, theoretical:false, blurb:"The first synthetic transuranium element ever made; named after Neptune, the planet just beyond Uranus." },
  Pu: { z:94, name:"Plutonium", shells:[2,8,18,32,24,8,2], category:"actinide", mass:244, stableWeight:false, melt:639, boil:3232, density:19.816, densityUnit:"g/cm³", phase:"Solid", en:1.28, radius:175, theoretical:false, blurb:"Powers some nuclear weapons and deep-space probes; a small amount generates steady heat for decades via radioactive decay." },
  Am: { z:95, name:"Americium", shells:[2,8,18,32,25,8,2], category:"actinide", mass:243, stableWeight:false, melt:1176, boil:2607, density:12, densityUnit:"g/cm³", phase:"Solid", en:1.13, radius:175, theoretical:false, blurb:"The radioactive source inside most household ionization smoke detectors." },
  Cm: { z:96, name:"Curium", shells:[2,8,18,32,25,9,2], category:"actinide", mass:247, stableWeight:false, melt:1340, boil:3110, density:13.51, densityUnit:"g/cm³", phase:"Solid", en:1.28, radius:176, theoretical:false, blurb:"Used in miniature radioisotope power sources for a few spacecraft instruments, including Mars rover tools." },
  Bk: { z:97, name:"Berkelium", shells:[2,8,18,32,27,8,2], category:"actinide", mass:247, stableWeight:false, melt:986, boil:2627, density:14.78, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:174, theoretical:false, blurb:"A purely synthetic, intensely radioactive metal made a few atoms at a time; named after Berkeley, California." },
  Cf: { z:98, name:"Californium", shells:[2,8,18,32,28,8,2], category:"actinide", mass:251, stableWeight:false, melt:900, boil:1470, density:15.1, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:170, theoretical:false, blurb:"Its spontaneous fission makes it a useful portable neutron source for starting up nuclear reactors and scanning cargo." },
  Es: { z:99, name:"Einsteinium", shells:[2,8,18,32,29,8,2], category:"actinide", mass:252, stableWeight:false, melt:860, boil:996, density:8.84, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:186, theoretical:false, blurb:"Discovered in the debris of the first hydrogen bomb test in 1952; named after Einstein." },
  Fm: { z:100, name:"Fermium", shells:[2,8,18,32,30,8,2], category:"actinide", mass:257, stableWeight:false, melt:1527, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:205, theoretical:false, blurb:"Also first found in hydrogen bomb test debris; produced today only a few atoms at a time in labs." },
  Md: { z:101, name:"Mendelevium", shells:[2,8,18,32,31,8,2], category:"actinide", mass:258, stableWeight:false, melt:827, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:200, theoretical:false, blurb:"Named after Mendeleev, creator of the periodic table; made one atom at a time in particle accelerators." },
  No: { z:102, name:"Nobelium", shells:[2,8,18,32,32,8,2], category:"actinide", mass:259, stableWeight:false, melt:827, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:200, theoretical:false, blurb:"Named after Alfred Nobel; so unstable that its longest-lived isotope survives only a few hours." },
  Lr: { z:103, name:"Lawrencium", shells:[2,8,18,32,32,8,3], category:"actinide", mass:266, stableWeight:false, melt:1627, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, radius:200, theoretical:false, blurb:"The last member of the actinide row; purely synthetic with no known practical use beyond research." },
  Rf: { z:104, name:"Rutherfordium", shells:[2,8,18,32,32,10,2], category:"transition", mass:267, stableWeight:false, melt:2127, boil:5527, density:23.2, densityUnit:"g/cm³", phase:"Solid", en:null, radius:150, theoretical:true, blurb:"First of the 'superheavy' elements beyond the actinides; predicted to behave chemically like a heavier hafnium." },
  Db: { z:105, name:"Dubnium", shells:[2,8,18,32,32,11,2], category:"transition", mass:268, stableWeight:false, melt:null, boil:null, density:29.3, densityUnit:"g/cm³", phase:"Solid", en:null, radius:139, theoretical:true, blurb:"Named after Dubna, Russia, home to one of the labs that helped create it." },
  Sg: { z:106, name:"Seaborgium", shells:[2,8,18,32,32,12,2], category:"transition", mass:269, stableWeight:false, melt:null, boil:null, density:35, densityUnit:"g/cm³", phase:"Solid", en:null, radius:132, theoretical:true, blurb:"Named after physicist Glenn Seaborg — the only element named after someone who was alive at the time." },
  Bh: { z:107, name:"Bohrium", shells:[2,8,18,32,32,13,2], category:"transition", mass:270, stableWeight:false, melt:null, boil:null, density:37.1, densityUnit:"g/cm³", phase:"Solid", en:null, radius:128, theoretical:true, blurb:"Named after Niels Bohr; only a handful of atoms have ever been produced and detected." },
  Hs: { z:108, name:"Hassium", shells:[2,8,18,32,32,14,2], category:"transition", mass:269, stableWeight:false, melt:-147, boil:null, density:40.7, densityUnit:"g/cm³", phase:"Solid", en:null, radius:126, theoretical:true, blurb:"Named after the German state of Hesse; predicted to be a dense, hafnium-like metal." },
  Mt: { z:109, name:"Meitnerium", shells:[2,8,18,32,32,15,2], category:"transition", mass:278, stableWeight:false, melt:null, boil:null, density:37.4, densityUnit:"g/cm³", phase:"Solid", en:null, radius:128, theoretical:true, blurb:"Named in honor of physicist Lise Meitner; exists for only fractions of a second before decaying." },
  Ds: { z:110, name:"Darmstadtium", shells:[2,8,18,32,32,16,2], category:"transition", mass:281, stableWeight:false, melt:null, boil:null, density:34.8, densityUnit:"g/cm³", phase:"Solid", en:null, radius:131, theoretical:true, blurb:"Named after the city of Darmstadt, Germany, where it was first created." },
  Rg: { z:111, name:"Roentgenium", shells:[2,8,18,32,32,17,2], category:"transition", mass:282, stableWeight:false, melt:null, boil:null, density:28.7, densityUnit:"g/cm³", phase:"Solid", en:null, radius:132, theoretical:true, blurb:"Named after Wilhelm Röntgen, discoverer of X-rays; created by fusing nickel and bismuth nuclei together." },
  Cn: { z:112, name:"Copernicium", shells:[2,8,18,32,32,18,2], category:"transition", mass:285, stableWeight:false, melt:null, boil:3297, density:14.0, densityUnit:"g/cm³", phase:"Liquid", en:null, radius:145, theoretical:true, blurb:"Named after Copernicus; predicted to behave like a heavy, volatile version of mercury." },
  Nh: { z:113, name:"Nihonium", shells:[2,8,18,32,32,18,3], category:"transition", mass:286, stableWeight:false, melt:427, boil:1157, density:16, densityUnit:"g/cm³", phase:"Solid", en:null, radius:180, theoretical:true, blurb:"First element discovered in Asia; named after Japan (Nihon), where the Riken lab created it." },
  Fl: { z:114, name:"Flerovium", shells:[2,8,18,32,32,18,4], category:"post-metal", mass:289, stableWeight:false, melt:67, boil:147, density:14, densityUnit:"g/cm³", phase:"Solid", en:null, radius:180, theoretical:true, blurb:"Named after the Flerov Laboratory in Russia, where it was synthesized." },
  Mc: { z:115, name:"Moscovium", shells:[2,8,18,32,32,18,5], category:"post-metal", mass:289, stableWeight:false, melt:397, boil:1127, density:13.5, densityUnit:"g/cm³", phase:"Solid", en:null, radius:160, theoretical:true, blurb:"Named after Moscow, home of the Joint Institute for Nuclear Research where it was created." },
  Lv: { z:116, name:"Livermorium", shells:[2,8,18,32,32,18,6], category:"post-metal", mass:293, stableWeight:false, melt:436, boil:812, density:12.9, densityUnit:"g/cm³", phase:"Solid", en:null, radius:175, theoretical:true, blurb:"Named after Livermore, California, home to a US national laboratory that co-discovered it." },
  Ts: { z:117, name:"Tennessine", shells:[2,8,18,32,32,18,7], category:"halogen", mass:294, stableWeight:false, melt:450, boil:610, density:7.17, densityUnit:"g/cm³", phase:"Solid", en:null, radius:165, theoretical:true, blurb:"Named after the U.S. state of Tennessee, home to Oak Ridge National Laboratory, a co-discoverer." },
  Og: { z:118, name:"Oganesson", shells:[2,8,18,32,32,18,8], category:"noble-gas", mass:294, stableWeight:false, melt:null, boil:77, density:4.95, densityUnit:"g/cm³", phase:"Solid", en:null, radius:157, theoretical:true, blurb:"The heaviest confirmed element on the table; predicted to be a solid, not a gas, under normal conditions despite sitting in the noble-gas column." },
};

// CPK-style colors per element symbol, expanded to include all transition,
// post-transition, and rare earth metals required by the 50 new alloys.
const ATOM_COLOR = {
  H: 0xf2f0ea, C: 0x2b2b2b, N: 0x3b6fd9, O: 0xe0483e,
  Na: 0x8a5fd9, Cl: 0x4fbf6b, S: 0xe8c93a, F: 0x90e050,
  Mg: 0x8aff00, Ca: 0x3dff00, K: 0x8f40d4,
  Li: 0xcc80ff, B: 0xffb5b5, P: 0xff8f00, Si: 0xe8c99a,
  Br: 0xa62929, In: 0xa67acc, W: 0x4a6b8a,
  // transition / post-transition / rare-earth metals
  Ti: 0xbfc2c7, V: 0xa6a6ab, Cr: 0x8a99c7, Mn: 0x9c7ac7,
  Fe: 0xdd7a3c, Co: 0x5b7fb5, Ni: 0x8fbf8f, Cu: 0xd2691e,
  Zn: 0x7a8ca3, Ga: 0xa0c8e0, Ge: 0x668f8f, Nb: 0x6fb5c9,
  Mo: 0x4fb8b8, Cd: 0xffd98f, Sn: 0x668090, Sb: 0xb08fd8,
  Pd: 0xb0c8d0, Ag: 0xd8dce0, Pt: 0xe0e0e6,
  Au: 0xffd700, Hg: 0xd4d8dc, Pb: 0x5a6670, Bi: 0xc89ca0,
  Nd: 0xc6a0e8, Zr: 0xa8c8c0, Al: 0xc8c8cf,
  default: 0x9a94b3,
};

const ATOM_RADIUS = {
  H: 0.32, C: 0.5, N: 0.48, O: 0.48, Na: 0.6, Cl: 0.58, S: 0.55,
  F: 0.42, Mg: 0.62, Ca: 0.68, K: 0.72,
  Li: 0.58, B: 0.44, P: 0.52, Si: 0.56, Br: 0.56, In: 0.66,
  Ti: 0.6, V: 0.58, Cr: 0.56, Mn: 0.56, Fe: 0.56, Co: 0.54,
  Ni: 0.54, Cu: 0.54, Zn: 0.56, Ga: 0.58, Ge: 0.58, Nb: 0.62,
  Mo: 0.62, Cd: 0.62, Sn: 0.64, Sb: 0.64, Pd: 0.62, Ag: 0.64,
  W: 0.64, Pt: 0.64, Au: 0.64, Hg: 0.66, Pb: 0.68, Bi: 0.68,
  Nd: 0.7, Zr: 0.64, Al: 0.6,
  default: 0.5,
};

// Display label + accent color per element category, used by the facts panel.
const CATEGORY_META = {
  "nonmetal":        { label: "Nonmetal",               color: "#c9c3e0" },
  "noble-gas":        { label: "Noble Gas",              color: "#7fe8ff" },
  "alkali":           { label: "Alkali Metal",           color: "#ffb454" },
  "alkaline-earth":   { label: "Alkaline Earth Metal",   color: "#ffcf8a" },
  "metalloid":        { label: "Metalloid",              color: "#5ce1c9" },
  "halogen":          { label: "Halogen",                color: "#ff6fae" },
  "post-metal":       { label: "Post-transition Metal",  color: "#b39ddb" },
  "transition":       { label: "Transition Metal",       color: "#7fd9ff" },
  "lanthanide":       { label: "Lanthanide",             color: "#e8c93a" },
  "actinide":         { label: "Actinide",                color: "#ff7043" },
};

// Short blurbs for the molecule library, shown in the facts panel.
const MOLECULE_BLURBS = {
  H2O: "The universal solvent — its bent, polar shape lets it dissolve more substances than any other common liquid.",
  CO2: "Product of respiration and combustion; the main greenhouse gas driving modern climate change.",
  CH4: "The simplest hydrocarbon and main component of natural gas; also a potent greenhouse gas.",
  NH3: "Pungent gas used to make most nitrogen fertilizer on Earth via the Haber-Bosch process.",
  O2: "The gas your body burns fuel with; makes up about 21% of Earth's atmosphere.",
  N2: "Chemically inert thanks to its very strong triple bond; makes up about 78% of the air.",
  NACL: "Ordinary table salt — a reactive metal and a toxic gas combine to form something essential to life.",
  CO: "Colorless, odorless, and dangerous — binds to blood far more strongly than oxygen does.",
  HCL: "Dissolved in water it becomes hydrochloric acid, also produced naturally by your stomach to digest food.",
  HF: "A weak acid but extremely dangerous — it can penetrate skin and dissolve glass and bone.",
  O3: "Shields Earth's surface from UV radiation in the stratosphere, but a harmful pollutant at ground level.",
  H2S: "Gives rotten eggs their smell; toxic in even small concentrations despite that familiar odor.",
  SO2: "Released by burning fossil fuels and volcanoes; a major cause of acid rain.",
  NO2: "A reddish-brown pollutant gas from vehicle exhaust; contributes to smog and acid rain.",
  N2O: "Known as 'laughing gas'; used as a mild anesthetic and, oddly, as whipped-cream propellant.",
  SO3: "Reacts violently with water to form sulfuric acid — a step in industrial acid production.",
  H2O2: "A stronger oxidizer than water thanks to its extra oxygen; used as a disinfectant and bleach.",
  C2H2: "Burns extremely hot, making it the fuel of choice for oxy-acetylene welding torches.",
  C2H4: "The most produced organic compound on Earth by mass — the building block of polyethylene plastic.",
  C2H6: "A minor component of natural gas; used industrially to make ethylene.",
  C3H8: "Common fuel for grills and portable heaters, stored as a liquid under modest pressure.",
  CH3OH: "Toxic to humans in small amounts, unlike its cousin ethanol; used as antifreeze and racing fuel.",
  C2H5OH: "The alcohol in beer, wine, and spirits; also used as a fuel additive and disinfectant.",
  CH3COOH: "The active ingredient in vinegar, at around 4–8% concentration in water.",
  C6H6: "A ring-shaped aromatic hydrocarbon; once common in gasoline and industry, now handled carefully as a known carcinogen.",
  MGO: "Highly heat-resistant; used to line furnaces and kilns.",
  KCL: "Used as a common potassium fertilizer and, in a medical setting, as a heart medication.",
  CAO: "Known as 'quicklime'; reacts vigorously with water and has been used in construction since antiquity.",
};

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

  CO: {
    name: "Carbon monoxide", formula: "CO",
    atoms: [
      { el: "C", pos: [0.565,0,0] },
      { el: "O", pos: [-0.565,0,0] },
    ],
    bonds: [[0,1]],
  },
  HCL: {
    name: "Hydrogen chloride", formula: "HCl",
    atoms: [
      { el: "H", pos: [0.635,0,0] },
      { el: "Cl", pos: [-0.635,0,0] },
    ],
    bonds: [[0,1]],
  },
  HF: {
    name: "Hydrogen fluoride", formula: "HF",
    atoms: [
      { el: "H", pos: [0.46,0,0] },
      { el: "F", pos: [-0.46,0,0] },
    ],
    bonds: [[0,1]],
  },
  O3: {
    name: "Ozone", formula: "O₃",
    atoms: [
      { el: "O", pos: [0,0,0] },
      { el: "O", pos: [1.09,0.671,0] },
      { el: "O", pos: [-1.09,0.671,0] },
    ],
    bonds: [[0,1],[0,2]],
  },
  H2S: {
    name: "Hydrogen sulfide", formula: "H₂S",
    atoms: [
      { el: "S", pos: [0,0,0] },
      { el: "H", pos: [0.965,0.93,0] },
      { el: "H", pos: [-0.965,0.93,0] },
    ],
    bonds: [[0,1],[0,2]],
  },
  SO2: {
    name: "Sulfur dioxide", formula: "SO₂",
    atoms: [
      { el: "S", pos: [0,0,0] },
      { el: "O", pos: [1.232,0.726,0] },
      { el: "O", pos: [-1.232,0.726,0] },
    ],
    bonds: [[0,1],[0,2]],
  },
  NO2: {
    name: "Nitrogen dioxide", formula: "NO₂",
    atoms: [
      { el: "N", pos: [0,0,0] },
      { el: "O", pos: [1.105,0.469,0] },
      { el: "O", pos: [-1.105,0.469,0] },
    ],
    bonds: [[0,1],[0,2]],
  },
  N2O: {
    name: "Nitrous oxide", formula: "N₂O",
    atoms: [
      { el: "N", pos: [0,0,0] },
      { el: "N", pos: [1.13,0,0] },
      { el: "O", pos: [-1.19,0,0] },
    ],
    bonds: [[0,1],[0,2]],
  },
  SO3: {
    name: "Sulfur trioxide", formula: "SO₃",
    atoms: [
      { el: "S", pos: [0,0,0] },
      { el: "O", pos: [0.0,1.42,0] },
      { el: "O", pos: [-1.23,-0.71,0] },
      { el: "O", pos: [1.23,-0.71,0] },
    ],
    bonds: [[0,1],[0,2],[0,3]],
  },
  H2O2: {
    name: "Hydrogen peroxide", formula: "H₂O₂",
    atoms: [
      { el: "O", pos: [0.735,0,0] },
      { el: "O", pos: [-0.735,0,0] },
      { el: "H", pos: [0.816,0.683,0.683] },
      { el: "H", pos: [-0.816,0.683,-0.683] },
    ],
    bonds: [[0,1],[0,2],[1,3]],
  },
  C2H2: {
    name: "Acetylene", formula: "C₂H₂",
    atoms: [
      { el: "C", pos: [0.6,0,0] },
      { el: "C", pos: [-0.6,0,0] },
      { el: "H", pos: [1.66,0,0] },
      { el: "H", pos: [-1.66,0,0] },
    ],
    bonds: [[0,1],[0,2],[1,3]],
  },
  C2H4: {
    name: "Ethylene", formula: "C₂H₄",
    atoms: [
      { el: "C", pos: [0.67,0,0] },
      { el: "C", pos: [-0.67,0,0] },
      { el: "H", pos: [1.24,0.929,0] },
      { el: "H", pos: [1.24,-0.929,0] },
      { el: "H", pos: [-1.24,0.929,0] },
      { el: "H", pos: [-1.24,-0.929,0] },
    ],
    bonds: [[0,1],[0,2],[0,3],[1,4],[1,5]],
  },
  C2H6: {
    name: "Ethane", formula: "C₂H₆",
    atoms: [
      { el: "C", pos: [0,0,0] },
      { el: "C", pos: [0.889,0.889,0.889] },
      { el: "H", pos: [0.629,-0.629,-0.629] },
      { el: "H", pos: [-0.629,0.629,-0.629] },
      { el: "H", pos: [-0.629,-0.629,0.629] },
      { el: "H", pos: [0.26,1.518,1.518] },
      { el: "H", pos: [1.518,0.26,1.518] },
      { el: "H", pos: [1.518,1.518,0.26] },
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4],[1,5],[1,6],[1,7]],
  },
  C3H8: {
    name: "Propane", formula: "C₃H₈",
    atoms: [
      { el: "C", pos: [1.258,0.889,0.0] },
      { el: "C", pos: [0,0,0] },
      { el: "C", pos: [-1.258,0.889,0.0] },
      { el: "H", pos: [0.953,0.674,1.024] },
      { el: "H", pos: [1.465,-0.051,-0.512] },
      { el: "H", pos: [0.441,1.398,-0.512] },
      { el: "H", pos: [0,0,1.09] },
      { el: "H", pos: [0,0,-1.09] },
      { el: "H", pos: [-0.953,0.674,1.024] },
      { el: "H", pos: [-0.441,1.398,-0.512] },
      { el: "H", pos: [-1.465,-0.051,-0.512] },
    ],
    bonds: [[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8],[2,9],[2,10]],
  },
  CH3OH: {
    name: "Methanol", formula: "CH₃OH",
    atoms: [
      { el: "C", pos: [0,0,0] },
      { el: "O", pos: [0.826,0.826,0.826] },
      { el: "H", pos: [0.629,-0.629,-0.629] },
      { el: "H", pos: [-0.629,0.629,-0.629] },
      { el: "H", pos: [-0.629,-0.629,0.629] },
      { el: "H", pos: [0.032,0.444,0.444] },
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4],[1,5]],
  },
  C2H5OH: {
    name: "Ethanol", formula: "C₂H₅OH",
    atoms: [
      { el: "C", pos: [0,0,0] },
      { el: "C", pos: [0.889,0.889,0.889] },
      { el: "O", pos: [1.715,0.064,0.064] },
      { el: "H", pos: [0.629,-0.629,-0.629] },
      { el: "H", pos: [-0.629,0.629,-0.629] },
      { el: "H", pos: [-0.629,-0.629,0.629] },
      { el: "H", pos: [1.518,0.26,1.518] },
      { el: "H", pos: [1.518,1.518,0.26] },
      { el: "H", pos: [1.312,0.606,0.745] },
    ],
    bonds: [[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8]],
  },
  CH3COOH: {
    name: "Acetic acid", formula: "CH₃COOH",
    atoms: [
      { el: "C", pos: [0,0,0] },
      { el: "C", pos: [0.878,0.878,0.878] },
      { el: "H", pos: [0.629,-0.629,-0.629] },
      { el: "H", pos: [-0.629,0.629,-0.629] },
      { el: "H", pos: [-0.629,-0.629,0.629] },
      { el: "O", pos: [0.486,1.227,1.968] },
      { el: "O", pos: [2.103,1.27,0.437] },
      { el: "H", pos: [1.542,1.381,1.221] },
    ],
    bonds: [[0,1],[0,2],[0,3],[0,4],[1,5],[1,6],[6,7]],
  },
  C6H6: {
    name: "Benzene", formula: "C₆H₆",
    atoms: [
      { el: "C", pos: [1.4,0.0,0] },
      { el: "C", pos: [0.7,1.212,0] },
      { el: "C", pos: [-0.7,1.212,0] },
      { el: "C", pos: [-1.4,0.0,0] },
      { el: "C", pos: [-0.7,-1.212,0] },
      { el: "C", pos: [0.7,-1.212,0] },
      { el: "H", pos: [2.49,0.0,0] },
      { el: "H", pos: [1.245,2.156,0] },
      { el: "H", pos: [-1.245,2.156,0] },
      { el: "H", pos: [-2.49,0.0,0] },
      { el: "H", pos: [-1.245,-2.156,0] },
      { el: "H", pos: [1.245,-2.156,0] },
    ],
    bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11]],
  },
  MGO: {
    name: "Magnesium oxide", formula: "MgO",
    atoms: [
      { el: "Mg", pos: [0.65,0,0] },
      { el: "O", pos: [-0.65,0,0] },
    ],
    bonds: [[0,1]],
  },
  KCL: {
    name: "Potassium chloride", formula: "KCl",
    atoms: [
      { el: "K", pos: [0.75,0,0] },
      { el: "Cl", pos: [-0.75,0,0] },
    ],
    bonds: [[0,1]],
  },
  CAO: {
    name: "Calcium oxide", formula: "CaO",
    atoms: [
      { el: "Ca", pos: [0.675,0,0] },
      { el: "O", pos: [-0.675,0,0] },
    ],
    bonds: [[0,1]],
  },
};

// Look up a search term against molecules first, then elements.
function resolveQuery(raw) {
  const q = raw.trim();
  if (!q) return null;
  const key = q.toUpperCase().replace(/[\s\-]/g, "_").replace(/[^A-Z0-9_]/g, "");
  const keyPlain = q.toUpperCase().replace(/\s+/g, "");

  // Check alloys first by key, then by name
  if (typeof ALLOYS !== "undefined") {
    if (ALLOYS[key]) return { type: "alloy", key, data: ALLOYS[key] };
    if (ALLOYS[keyPlain]) return { type: "alloy", key: keyPlain, data: ALLOYS[keyPlain] };
    const byAlloyName = Object.entries(ALLOYS).find(([, a]) => a.name.toUpperCase() === q.toUpperCase());
    if (byAlloyName) return { type: "alloy", key: byAlloyName[0], data: byAlloyName[1] };
  }

  if (MOLECULES[keyPlain]) return { type: "molecule", key: keyPlain, data: MOLECULES[keyPlain] };

  const byFormula = Object.entries(MOLECULES).find(([, m]) =>
    m.formula.replace(/[₀-₉]/g, n => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(n)]).toUpperCase() === keyPlain
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

// ── 50 new molecules ──────────────────────────────────────────────────────────
MOLECULES.HCN    = { name:"Hydrogen cyanide",      formula:"HCN",    atoms:[{el:"H",pos:[1.065,0,0]},{el:"C",pos:[0,0,0]},{el:"N",pos:[-1.156,0,0]}], bonds:[[0,1],[1,2]] };
MOLECULES.H2CO   = { name:"Formaldehyde",           formula:"H₂CO",  atoms:[{el:"C",pos:[0,0,0]},{el:"O",pos:[0,1.208,0]},{el:"H",pos:[0.94,-0.545,0]},{el:"H",pos:[-0.94,-0.545,0]}], bonds:[[0,1],[0,2],[0,3]] };
MOLECULES.PH3    = { name:"Phosphine",              formula:"PH₃",   atoms:[{el:"P",pos:[0,0.14,0]},{el:"H",pos:[0.982,-0.37,0]},{el:"H",pos:[-0.491,-0.37,0.85]},{el:"H",pos:[-0.491,-0.37,-0.85]}], bonds:[[0,1],[0,2],[0,3]] };
MOLECULES.F2     = { name:"Fluorine gas",           formula:"F₂",    atoms:[{el:"F",pos:[0.71,0,0]},{el:"F",pos:[-0.71,0,0]}], bonds:[[0,1]] };
MOLECULES.CL2    = { name:"Chlorine gas",           formula:"Cl₂",   atoms:[{el:"Cl",pos:[0.995,0,0]},{el:"Cl",pos:[-0.995,0,0]}], bonds:[[0,1]] };
MOLECULES.BR2    = { name:"Bromine",                formula:"Br₂",   atoms:[{el:"Br",pos:[1.14,0,0]},{el:"Br",pos:[-1.14,0,0]}], bonds:[[0,1]] };
MOLECULES.SF6    = { name:"Sulfur hexafluoride",    formula:"SF₆",   atoms:[{el:"S",pos:[0,0,0]},{el:"F",pos:[1.56,0,0]},{el:"F",pos:[-1.56,0,0]},{el:"F",pos:[0,1.56,0]},{el:"F",pos:[0,-1.56,0]},{el:"F",pos:[0,0,1.56]},{el:"F",pos:[0,0,-1.56]}], bonds:[[0,1],[0,2],[0,3],[0,4],[0,5],[0,6]] };
MOLECULES.PCL5   = { name:"Phosphorus pentachloride",formula:"PCl₅", atoms:[{el:"P",pos:[0,0,0]},{el:"Cl",pos:[2.02,0,0]},{el:"Cl",pos:[-2.02,0,0]},{el:"Cl",pos:[0,0,2.02]},{el:"Cl",pos:[1.01,0,-1.75]},{el:"Cl",pos:[-1.01,0,-1.75]}], bonds:[[0,1],[0,2],[0,3],[0,4],[0,5]] };
MOLECULES.ALCL3  = { name:"Aluminium chloride",     formula:"AlCl₃", atoms:[{el:"Al",pos:[0,0,0]},{el:"Cl",pos:[2.06,0,0]},{el:"Cl",pos:[-1.03,1.785,0]},{el:"Cl",pos:[-1.03,-1.785,0]}], bonds:[[0,1],[0,2],[0,3]] };
MOLECULES.SICL4  = { name:"Silicon tetrachloride",  formula:"SiCl₄", atoms:[{el:"Si",pos:[0,0,0]},{el:"Cl",pos:[1.02,1.02,1.02]},{el:"Cl",pos:[-1.02,-1.02,1.02]},{el:"Cl",pos:[-1.02,1.02,-1.02]},{el:"Cl",pos:[1.02,-1.02,-1.02]}], bonds:[[0,1],[0,2],[0,3],[0,4]] };
MOLECULES.NO     = { name:"Nitric oxide",           formula:"NO",    atoms:[{el:"N",pos:[0.548,0,0]},{el:"O",pos:[-0.548,0,0]}], bonds:[[0,1]] };
MOLECULES.H2SO4  = { name:"Sulfuric acid",          formula:"H₂SO₄", atoms:[{el:"S",pos:[0,0,0]},{el:"O",pos:[0,1.44,0]},{el:"O",pos:[0,-1.44,0]},{el:"O",pos:[1.44,0,0]},{el:"O",pos:[-1.44,0,0]},{el:"H",pos:[1.9,0.7,0]},{el:"H",pos:[-1.9,0.7,0]}], bonds:[[0,1],[0,2],[0,3],[0,4],[3,5],[4,6]] };
MOLECULES.HNO3   = { name:"Nitric acid",            formula:"HNO₃",  atoms:[{el:"N",pos:[0,0,0]},{el:"O",pos:[1.22,0,0]},{el:"O",pos:[-0.61,1.06,0]},{el:"O",pos:[-0.61,-1.06,0]},{el:"H",pos:[-1.56,-1.06,0]}], bonds:[[0,1],[0,2],[0,3],[3,4]] };
MOLECULES.NAOH   = { name:"Sodium hydroxide",       formula:"NaOH",  atoms:[{el:"Na",pos:[0.9,0,0]},{el:"O",pos:[-0.45,0,0]},{el:"H",pos:[-1.42,0,0]}], bonds:[[0,1],[1,2]] };
MOLECULES.FE2O3  = { name:"Iron(III) oxide",        formula:"Fe₂O₃", atoms:[{el:"Fe",pos:[1.3,0.75,0]},{el:"Fe",pos:[-1.3,0.75,0]},{el:"O",pos:[0,0,0]},{el:"O",pos:[1.3,-0.9,0]},{el:"O",pos:[-1.3,-0.9,0]}], bonds:[[0,2],[1,2],[0,3],[1,4]] };
MOLECULES.AL2O3  = { name:"Aluminium oxide",        formula:"Al₂O₃", atoms:[{el:"Al",pos:[1.3,0.75,0]},{el:"Al",pos:[-1.3,0.75,0]},{el:"O",pos:[0,0,0]},{el:"O",pos:[1.3,-0.9,0]},{el:"O",pos:[-1.3,-0.9,0]}], bonds:[[0,2],[1,2],[0,3],[1,4]] };
MOLECULES.SIO2   = { name:"Silicon dioxide",        formula:"SiO₂",  atoms:[{el:"Si",pos:[0,0,0]},{el:"O",pos:[1.61,0,0]},{el:"O",pos:[-1.61,0,0]}], bonds:[[0,1],[0,2]] };
MOLECULES.TIO2   = { name:"Titanium dioxide",       formula:"TiO₂",  atoms:[{el:"Ti",pos:[0,0,0]},{el:"O",pos:[1.95,0,0]},{el:"O",pos:[-1.95,0,0]}], bonds:[[0,1],[0,2]] };
MOLECULES.ZNO    = { name:"Zinc oxide",             formula:"ZnO",   atoms:[{el:"Zn",pos:[0.9,0,0]},{el:"O",pos:[-0.9,0,0]}], bonds:[[0,1]] };
MOLECULES.CUO    = { name:"Copper(II) oxide",       formula:"CuO",   atoms:[{el:"Cu",pos:[0.85,0,0]},{el:"O",pos:[-0.85,0,0]}], bonds:[[0,1]] };
MOLECULES.AG2O   = { name:"Silver oxide",           formula:"Ag₂O",  atoms:[{el:"Ag",pos:[2.04,0,0]},{el:"Ag",pos:[-2.04,0,0]},{el:"O",pos:[0,0,0]}], bonds:[[0,2],[1,2]] };
MOLECULES.MGCL2  = { name:"Magnesium chloride",     formula:"MgCl₂", atoms:[{el:"Mg",pos:[0,0,0]},{el:"Cl",pos:[2.18,0,0]},{el:"Cl",pos:[-2.18,0,0]}], bonds:[[0,1],[0,2]] };
MOLECULES.FECL3  = { name:"Iron(III) chloride",     formula:"FeCl₃", atoms:[{el:"Fe",pos:[0,0,0]},{el:"Cl",pos:[2.07,0,0]},{el:"Cl",pos:[-1.035,1.793,0]},{el:"Cl",pos:[-1.035,-1.793,0]}], bonds:[[0,1],[0,2],[0,3]] };
MOLECULES.CUCL2  = { name:"Copper(II) chloride",    formula:"CuCl₂", atoms:[{el:"Cu",pos:[0,0,0]},{el:"Cl",pos:[2.26,0,0]},{el:"Cl",pos:[-2.26,0,0]}], bonds:[[0,1],[0,2]] };
MOLECULES.GEO2   = { name:"Germanium dioxide",      formula:"GeO₂",  atoms:[{el:"Ge",pos:[0,0,0]},{el:"O",pos:[1.74,0,0]},{el:"O",pos:[-1.74,0,0]}], bonds:[[0,1],[0,2]] };
MOLECULES.SNO2   = { name:"Tin(IV) oxide",          formula:"SnO₂",  atoms:[{el:"Sn",pos:[0,0,0]},{el:"O",pos:[2.06,0,0]},{el:"O",pos:[-2.06,0,0]}], bonds:[[0,1],[0,2]] };
MOLECULES.CACO3  = { name:"Calcium carbonate",      formula:"CaCO₃", atoms:[{el:"Ca",pos:[2.9,0,0]},{el:"C",pos:[0,0,0]},{el:"O",pos:[0,1.29,0]},{el:"O",pos:[1.115,-0.645,0]},{el:"O",pos:[-1.115,-0.645,0]}], bonds:[[0,3],[1,2],[1,3],[1,4]] };
MOLECULES.CF4    = { name:"Carbon tetrafluoride",   formula:"CF₄",   atoms:[{el:"C",pos:[0,0,0]},{el:"F",pos:[0.783,0.783,0.783]},{el:"F",pos:[-0.783,-0.783,0.783]},{el:"F",pos:[-0.783,0.783,-0.783]},{el:"F",pos:[0.783,-0.783,-0.783]}], bonds:[[0,1],[0,2],[0,3],[0,4]] };
MOLECULES.N2H4   = { name:"Hydrazine",              formula:"N₂H₄",  atoms:[{el:"N",pos:[0.7,0,0]},{el:"N",pos:[-0.7,0,0]},{el:"H",pos:[1.15,0.94,0.38]},{el:"H",pos:[1.15,-0.94,0.38]},{el:"H",pos:[-1.15,0.94,0.38]},{el:"H",pos:[-1.15,-0.94,0.38]}], bonds:[[0,1],[0,2],[0,3],[1,4],[1,5]] };
MOLECULES.C4H10  = { name:"Butane",                 formula:"C₄H₁₀", atoms:[{el:"C",pos:[-1.95,0,0]},{el:"C",pos:[-0.65,0,0]},{el:"C",pos:[0.65,0,0]},{el:"C",pos:[1.95,0,0]},{el:"H",pos:[-2.59,0.54,0.54]},{el:"H",pos:[-2.59,0.54,-0.54]},{el:"H",pos:[-2.59,-0.54,0]},{el:"H",pos:[-0.65,0.54,0.54]},{el:"H",pos:[-0.65,-0.54,0.54]},{el:"H",pos:[0.65,0.54,0.54]},{el:"H",pos:[0.65,-0.54,0.54]},{el:"H",pos:[2.59,0.54,0.54]},{el:"H",pos:[2.59,0.54,-0.54]},{el:"H",pos:[2.59,-0.54,0]}], bonds:[[0,1],[1,2],[2,3],[0,4],[0,5],[0,6],[1,7],[1,8],[2,9],[2,10],[3,11],[3,12],[3,13]] };
MOLECULES.C5H12  = { name:"Pentane",                formula:"C₅H₁₂", atoms:[{el:"C",pos:[-2.58,0,0]},{el:"C",pos:[-1.29,0,0]},{el:"C",pos:[0,0,0]},{el:"C",pos:[1.29,0,0]},{el:"C",pos:[2.58,0,0]},{el:"H",pos:[-3.22,0.54,0.54]},{el:"H",pos:[-3.22,-0.54,0.54]},{el:"H",pos:[-3.22,0,-1]},{el:"H",pos:[-1.29,0.54,0.54]},{el:"H",pos:[-1.29,-0.54,0.54]},{el:"H",pos:[0,0.54,0.54]},{el:"H",pos:[0,-0.54,0.54]},{el:"H",pos:[1.29,0.54,0.54]},{el:"H",pos:[1.29,-0.54,0.54]},{el:"H",pos:[3.22,0.54,0.54]},{el:"H",pos:[3.22,-0.54,0.54]},{el:"H",pos:[3.22,0,-1]}], bonds:[[0,1],[1,2],[2,3],[3,4],[0,5],[0,6],[0,7],[1,8],[1,9],[2,10],[2,11],[3,12],[3,13],[4,14],[4,15],[4,16]] };
MOLECULES.C3H6O  = { name:"Acetone",                formula:"C₃H₆O", atoms:[{el:"C",pos:[0,0,0]},{el:"C",pos:[1.52,0,0]},{el:"C",pos:[-1.52,0,0]},{el:"O",pos:[1.52,1.22,0]},{el:"H",pos:[2.15,-0.54,0.54]},{el:"H",pos:[2.15,-0.54,-0.54]},{el:"H",pos:[2.15,0.54,0]},{el:"H",pos:[-2.15,-0.54,0.54]},{el:"H",pos:[-2.15,-0.54,-0.54]},{el:"H",pos:[-2.15,0.54,0]}], bonds:[[0,1],[0,2],[1,3],[1,4],[1,5],[1,6],[2,7],[2,8],[2,9]] };
MOLECULES.C2H4O  = { name:"Acetaldehyde",           formula:"C₂H₄O", atoms:[{el:"C",pos:[0,0,0]},{el:"C",pos:[0.891,0.891,0.891]},{el:"O",pos:[0.891,0.891,2.099]},{el:"H",pos:[0.629,-0.629,-0.629]},{el:"H",pos:[-0.629,0.629,-0.629]},{el:"H",pos:[-0.629,-0.629,0.629]},{el:"H",pos:[1.518,0.26,0.26]}], bonds:[[0,1],[1,2],[0,3],[0,4],[0,5],[1,6]] };
MOLECULES.C7H8   = { name:"Toluene",                formula:"C₇H₈",  atoms:[{el:"C",pos:[1.4,0,0]},{el:"C",pos:[0.7,1.212,0]},{el:"C",pos:[-0.7,1.212,0]},{el:"C",pos:[-1.4,0,0]},{el:"C",pos:[-0.7,-1.212,0]},{el:"C",pos:[0.7,-1.212,0]},{el:"C",pos:[2.9,0,0]},{el:"H",pos:[1.245,2.156,0]},{el:"H",pos:[-1.245,2.156,0]},{el:"H",pos:[-2.49,0,0]},{el:"H",pos:[-1.245,-2.156,0]},{el:"H",pos:[1.245,-2.156,0]},{el:"H",pos:[3.29,0.54,0.54]},{el:"H",pos:[3.29,-0.54,0.54]},{el:"H",pos:[3.29,0,-1.0]}], bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[1,7],[2,8],[3,9],[4,10],[5,11],[6,12],[6,13],[6,14]] };
MOLECULES.C6H5OH = { name:"Phenol",                 formula:"C₆H₅OH",atoms:[{el:"C",pos:[1.4,0,0]},{el:"C",pos:[0.7,1.212,0]},{el:"C",pos:[-0.7,1.212,0]},{el:"C",pos:[-1.4,0,0]},{el:"C",pos:[-0.7,-1.212,0]},{el:"C",pos:[0.7,-1.212,0]},{el:"O",pos:[2.75,0,0]},{el:"H",pos:[3.2,0.7,0]},{el:"H",pos:[1.245,2.156,0]},{el:"H",pos:[-1.245,2.156,0]},{el:"H",pos:[-2.49,0,0]},{el:"H",pos:[-1.245,-2.156,0]},{el:"H",pos:[1.245,-2.156,0]}], bonds:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[6,7],[1,8],[2,9],[3,10],[4,11],[5,12]] };
MOLECULES.HCOOH  = { name:"Formic acid",            formula:"HCOOH", atoms:[{el:"C",pos:[0,0,0]},{el:"O",pos:[1.2,0,0]},{el:"O",pos:[-0.6,1.04,0]},{el:"H",pos:[0,1.68,0]},{el:"H",pos:[-1.09,-0.54,0]}], bonds:[[0,1],[0,2],[2,3],[0,4]] };
MOLECULES.C2H6O  = { name:"Dimethyl ether",         formula:"C₂H₆O", atoms:[{el:"O",pos:[0,0,0]},{el:"C",pos:[1.41,0.46,0]},{el:"C",pos:[-1.41,0.46,0]},{el:"H",pos:[2.1,-0.38,0]},{el:"H",pos:[1.6,1.09,0.89]},{el:"H",pos:[1.6,1.09,-0.89]},{el:"H",pos:[-2.1,-0.38,0]},{el:"H",pos:[-1.6,1.09,0.89]},{el:"H",pos:[-1.6,1.09,-0.89]}], bonds:[[0,1],[0,2],[1,3],[1,4],[1,5],[2,6],[2,7],[2,8]] };
MOLECULES.NACO3  = { name:"Sodium carbonate",       formula:"Na₂CO₃",atoms:[{el:"C",pos:[0,0,0]},{el:"O",pos:[0,1.3,0]},{el:"O",pos:[1.125,-0.65,0]},{el:"O",pos:[-1.125,-0.65,0]},{el:"Na",pos:[2.4,-0.65,0]},{el:"Na",pos:[-2.4,-0.65,0]}], bonds:[[0,1],[0,2],[0,3],[2,4],[3,5]] };
MOLECULES.NANO3  = { name:"Sodium nitrate",         formula:"NaNO₃", atoms:[{el:"N",pos:[0,0,0]},{el:"O",pos:[0,1.24,0]},{el:"O",pos:[1.074,-0.62,0]},{el:"O",pos:[-1.074,-0.62,0]},{el:"Na",pos:[2.4,-0.62,0]}], bonds:[[0,1],[0,2],[0,3],[2,4]] };
MOLECULES.CASO4  = { name:"Calcium sulfate",        formula:"CaSO₄", atoms:[{el:"Ca",pos:[2.0,0,0]},{el:"S",pos:[0,0,0]},{el:"O",pos:[0,1.44,0]},{el:"O",pos:[0,-1.44,0]},{el:"O",pos:[1.0,0,0]},{el:"O",pos:[-1.0,0,0]}], bonds:[[0,4],[1,2],[1,3],[1,4],[1,5]] };
MOLECULES.HCLO4  = { name:"Perchloric acid",        formula:"HClO₄", atoms:[{el:"Cl",pos:[0,0,0]},{el:"O",pos:[0,1.41,0]},{el:"O",pos:[1.22,-0.71,0]},{el:"O",pos:[-1.22,-0.71,0]},{el:"O",pos:[0,0,1.41]},{el:"H",pos:[0,0,2.38]}], bonds:[[0,1],[0,2],[0,3],[0,4],[4,5]] };
MOLECULES.KHCO3  = { name:"Potassium bicarbonate",  formula:"KHCO₃", atoms:[{el:"C",pos:[0,0,0]},{el:"O",pos:[0,1.25,0]},{el:"O",pos:[1.08,-0.625,0]},{el:"O",pos:[-1.08,-0.625,0]},{el:"H",pos:[-1.98,-0.1,0]},{el:"K",pos:[2.55,-0.625,0]}], bonds:[[0,1],[0,2],[0,3],[3,4],[2,5]] };
MOLECULES.CLCN   = { name:"Cyanogen chloride",      formula:"ClCN",  atoms:[{el:"Cl",pos:[1.63,0,0]},{el:"C",pos:[0,0,0]},{el:"N",pos:[-1.16,0,0]}], bonds:[[0,1],[1,2]] };
MOLECULES.AUCL3  = { name:"Gold(III) chloride",     formula:"AuCl₃", atoms:[{el:"Au",pos:[0,0,0]},{el:"Cl",pos:[2.24,0,0]},{el:"Cl",pos:[-1.12,1.94,0]},{el:"Cl",pos:[-1.12,-1.94,0]}], bonds:[[0,1],[0,2],[0,3]] };
MOLECULES.PTCL4  = { name:"Platinum(IV) chloride",  formula:"PtCl₄", atoms:[{el:"Pt",pos:[0,0,0]},{el:"Cl",pos:[2.32,0,0]},{el:"Cl",pos:[-2.32,0,0]},{el:"Cl",pos:[0,2.32,0]},{el:"Cl",pos:[0,-2.32,0]}], bonds:[[0,1],[0,2],[0,3],[0,4]] };
MOLECULES.PBSO4  = { name:"Lead(II) sulfate",       formula:"PbSO₄", atoms:[{el:"Pb",pos:[3.0,0,0]},{el:"S",pos:[0,0,0]},{el:"O",pos:[0,1.44,0]},{el:"O",pos:[0,-1.44,0]},{el:"O",pos:[1.44,0,0]},{el:"O",pos:[-1.44,0,0]}], bonds:[[0,4],[1,2],[1,3],[1,4],[1,5]] };
MOLECULES.CUSO4  = { name:"Copper(II) sulfate",     formula:"CuSO₄", atoms:[{el:"Cu",pos:[3.0,0,0]},{el:"S",pos:[0,0,0]},{el:"O",pos:[0,1.44,0]},{el:"O",pos:[0,-1.44,0]},{el:"O",pos:[1.44,0,0]},{el:"O",pos:[-1.44,0,0]}], bonds:[[0,4],[1,2],[1,3],[1,4],[1,5]] };
MOLECULES.FES    = { name:"Iron(II) sulfide",       formula:"FeS",   atoms:[{el:"Fe",pos:[1.0,0,0]},{el:"S",pos:[-1.0,0,0]}], bonds:[[0,1]] };
MOLECULES.LIBR   = { name:"Lithium bromide",        formula:"LiBr",  atoms:[{el:"Li",pos:[1.0,0,0]},{el:"Br",pos:[-1.0,0,0]}], bonds:[[0,1]] };
MOLECULES.N2H4   = { name:"Hydrazine",              formula:"N₂H₄",  atoms:[{el:"N",pos:[0.7,0,0]},{el:"N",pos:[-0.7,0,0]},{el:"H",pos:[1.15,0.94,0.38]},{el:"H",pos:[1.15,-0.94,0.38]},{el:"H",pos:[-1.15,0.94,0.38]},{el:"H",pos:[-1.15,-0.94,0.38]}], bonds:[[0,1],[0,2],[0,3],[1,4],[1,5]] };

// ── 50 alloys ─────────────────────────────────────────────────────────────────
const ALLOYS = {
  STEEL:            { name:"Steel",                  formula:"Fe–C",        blurb:"Iron with 0.02–2.14% carbon. The world's most-used structural metal — beams, rails, pipelines, tools.", elements:{Fe:98.5,C:1.5},             properties:{density:"7.75–8.05 g/cm³", meltingPoint:"1370–1510 °C", tensileStrength:"400–2500 MPa"} },
  STAINLESS_STEEL:  { name:"Stainless steel",        formula:"Fe–Cr–Ni",    blurb:"≥10.5% chromium forms a passive oxide layer resisting corrosion. Used in cutlery, medical tools, and architecture.", elements:{Fe:70,Cr:18,Ni:10,Mo:2},   properties:{density:"7.75–8.1 g/cm³", tensileStrength:"515–1380 MPa"} },
  BRONZE:           { name:"Bronze",                 formula:"Cu–Sn",       blurb:"One of humanity's first alloys (Bronze Age). Hard, corrosion-resistant; used in bearings, sculptures, and bells.", elements:{Cu:88,Sn:12},              properties:{density:"8.7–8.9 g/cm³", meltingPoint:"950 °C", tensileStrength:"200–800 MPa"} },
  BRASS:            { name:"Brass",                  formula:"Cu–Zn",       blurb:"Copper-zinc alloy — yellow, machinable, antibacterial. Plumbing fittings, musical instruments, decorative hardware.", elements:{Cu:70,Zn:30},              properties:{density:"8.4–8.7 g/cm³", meltingPoint:"900–940 °C"} },
  DURALUMIN:        { name:"Duralumin",              formula:"Al–Cu",       blurb:"High strength-to-weight aluminium alloy — backbone of early aircraft. Still used in aerospace structures.", elements:{Al:93.5,Cu:4,Mg:1.5,Mn:1},  properties:{density:"2.79 g/cm³", meltingPoint:"640–655 °C", tensileStrength:"470 MPa"} },
  TI6AL4V:          { name:"Ti-6Al-4V",              formula:"Ti–Al–V",     blurb:"The workhorse titanium alloy. High strength-to-weight, biocompatible, heat-resistant. Jet engines, implants, spacecraft.", elements:{Ti:90,Al:6,V:4},           properties:{density:"4.43 g/cm³", tensileStrength:"950 MPa"} },
  STERLING_SILVER:  { name:"Sterling silver",        formula:"Ag–Cu",       blurb:"92.5% silver — the standard for silverware and jewelry. Pure silver is too soft for practical use.", elements:{Ag:92.5,Cu:7.5},           properties:{density:"10.36 g/cm³", meltingPoint:"893 °C"} },
  WHITE_GOLD:       { name:"White gold",             formula:"Au–Pd",       blurb:"Gold alloyed with palladium produces a silver-white color. Standard in jewelry as a cheaper alternative to platinum.", elements:{Au:75,Pd:15,Ag:10},        properties:{density:"15.0–17.8 g/cm³"} },
  ROSE_GOLD:        { name:"Rose gold",              formula:"Au–Cu",       blurb:"Gold with copper produces a warm pinkish hue. Popular in jewelry and watch cases.", elements:{Au:75,Cu:22.25,Ag:2.75},   properties:{density:"~15.5 g/cm³", meltingPoint:"~930 °C"} },
  MONEL:            { name:"Monel",                  formula:"Ni–Cu",       blurb:"~67% nickel with copper — exceptionally corrosion-resistant in seawater. Marine hardware, valves, pump shafts.", elements:{Ni:67,Cu:23,Fe:8,Mn:2},    properties:{density:"8.80 g/cm³", tensileStrength:"550–1000 MPa"} },
  INCONEL:          { name:"Inconel 718",            formula:"Ni–Cr–Fe",    blurb:"Nickel superalloy retaining strength at extreme temperatures. Jet engines, gas turbines, rocket motors.", elements:{Ni:52,Cr:19,Fe:18,Nb:5,Mo:3}, properties:{density:"8.19 g/cm³", tensileStrength:"1240 MPa"} },
  HASTELLOY:        { name:"Hastelloy C-276",        formula:"Ni–Mo–Cr",    blurb:"Outstanding resistance to oxidising and reducing chemicals. Chemical reactors, flue gas scrubbers.", elements:{Ni:57,Mo:16,Cr:15,W:4,Fe:6}, properties:{density:"8.89 g/cm³", tensileStrength:"790 MPa"} },
  SOLDER:           { name:"Tin-lead solder",        formula:"Sn–Pb",       blurb:"Eutectic 60/40 solder melts at 183 °C. The classic material for electronics before RoHS pushed lead-free alternatives.", elements:{Sn:60,Pb:40},              properties:{density:"8.42 g/cm³", meltingPoint:"183 °C"} },
  SAC305:           { name:"Lead-free solder",       formula:"Sn–Ag–Cu",    blurb:"SAC305 — dominant RoHS-compliant solder with 3% silver, 0.5% copper in tin. Non-toxic, higher melt point.", elements:{Sn:96.5,Ag:3,Cu:0.5},      properties:{density:"7.40 g/cm³", meltingPoint:"217–220 °C"} },
  PEWTER:           { name:"Pewter",                 formula:"Sn–Cu–Sb",    blurb:"Modern pewter is ≥91% tin. Decorative objects, tankards, and figurines.", elements:{Sn:92,Cu:6,Sb:2},           properties:{density:"7.26 g/cm³", meltingPoint:"170–230 °C"} },
  WOODS_METAL:      { name:"Wood's metal",           formula:"Bi–Pb–Sn–Cd", blurb:"Fusible alloy melting at 70 °C. Used in fire-suppression sprinkler heads that release water when a room overheats.", elements:{Bi:50,Pb:26.7,Sn:13.3,Cd:10}, properties:{meltingPoint:"70 °C", density:"9.4 g/cm³"} },
  NITINOL:          { name:"Nitinol",                formula:"Ni–Ti",       blurb:"Shape-memory alloy — deformed at low temperature, returns to original shape when heated. Stents, orthodontic wires.", elements:{Ni:55,Ti:45},              properties:{density:"6.45 g/cm³", tensileStrength:"750–960 MPa"} },
  INVAR:            { name:"Invar",                  formula:"Fe–Ni",       blurb:"36% nickel in iron — near-zero thermal expansion. Used in precision clocks, laser frames, and surveying instruments.", elements:{Fe:64,Ni:36},              properties:{density:"8.05 g/cm³", tensileStrength:"490 MPa"} },
  KOVAR:            { name:"Kovar",                  formula:"Fe–Ni–Co",    blurb:"Matched to borosilicate glass expansion — used for glass-to-metal seals in vacuum tubes and microwave packages.", elements:{Fe:54,Ni:29,Co:17},        properties:{density:"8.36 g/cm³", meltingPoint:"1450 °C"} },
  CUPRONICKEL:      { name:"Cupronickel",            formula:"Cu–Ni",       blurb:"75% copper, 25% nickel. Highly corrosion-resistant in seawater. Ship hulls, heat exchangers, and circulating coins.", elements:{Cu:75,Ni:25},              properties:{density:"8.94 g/cm³", tensileStrength:"380 MPa"} },
  PHOSPHOR_BRONZE:  { name:"Phosphor bronze",        formula:"Cu–Sn–P",     blurb:"Phosphorus improves wear resistance and stiffness. Springs, electrical contacts, boat propellers.", elements:{Cu:94.8,Sn:5,P:0.2},       properties:{density:"8.80 g/cm³", tensileStrength:"370–900 MPa"} },
  ALUMINIUM_BRONZE: { name:"Aluminium bronze",       formula:"Cu–Al",       blurb:"Copper with 5–11% aluminium. Exceptional strength and corrosion resistance. Marine propellers, bearings, hydraulic valves.", elements:{Cu:91,Al:9},               properties:{density:"7.6 g/cm³", tensileStrength:"500–900 MPa"} },
  BABBITT:          { name:"Babbitt metal",          formula:"Sn–Sb–Cu",    blurb:"Soft white bearing metal — embeds abrasive particles rather than scoring a shaft. Classic bearing alloy since 1839.", elements:{Sn:89,Sb:9,Cu:2},          properties:{density:"7.34 g/cm³", meltingPoint:"240–354 °C"} },
  GALINSTAN:        { name:"Galinstan",              formula:"Ga–In–Sn",    blurb:"Gallium-indium-tin liquid metal, liquid at −19 °C. Non-toxic mercury replacement in thermometers and thermal interfaces.", elements:{Ga:68.5,In:21.5,Sn:10},    properties:{meltingPoint:"−19 °C", density:"6.44 g/cm³"} },
  ALNICO:           { name:"Alnico",                 formula:"Al–Ni–Co",    blurb:"One of the strongest permanent magnets before rare-earth types. Guitar pickups, early loudspeakers, meters.", elements:{Fe:50,Ni:25,Al:12,Co:6,Cu:6,Ti:1}, properties:{density:"6.9 g/cm³"} },
  NEODYMIUM_MAGNET: { name:"Neodymium magnet",       formula:"Nd₂Fe₁₄B",   blurb:"Strongest permanent magnet known — a gram can lift over a kilogram. Electric motors, hard drives, MRI machines.", elements:{Nd:26.7,Fe:72.3,B:1},      properties:{density:"7.4 g/cm³", maxEnergyProduct:"200–440 kJ/m³"} },
  ZIRCALOY:         { name:"Zircaloy-4",             formula:"Zr–Sn–Fe–Cr", blurb:"Low neutron absorption makes it the standard cladding for uranium fuel rods in nuclear reactors.", elements:{Zr:98.23,Sn:1.45,Fe:0.21,Cr:0.1}, properties:{density:"6.56 g/cm³", meltingPoint:"1850 °C"} },
  VITALLIUM:        { name:"Vitallium",              formula:"Co–Cr–Mo",    blurb:"Biocompatible, wear-resistant cobalt alloy. Hip replacements, knee implants, dental prosthetics.", elements:{Co:65,Cr:28,Mo:6,Ni:1},    properties:{density:"8.3 g/cm³", tensileStrength:"650–1000 MPa"} },
  NIMONIC:          { name:"Nimonic 80A",            formula:"Ni–Cr",       blurb:"Continuous service up to 815 °C. Gas turbine blades, high-temperature fasteners.", elements:{Ni:76,Cr:19.5,Ti:2.4,Al:1.4}, properties:{density:"8.19 g/cm³", tensileStrength:"1250 MPa"} },
  MAGNOX:           { name:"Magnox",                 formula:"Mg–Al",       blurb:"Magnesium with ~0.8% aluminium — low neutron absorption. Used as fuel cladding in early British nuclear reactors.", elements:{Mg:99.2,Al:0.8},           properties:{density:"1.74 g/cm³", meltingPoint:"645 °C"} },
  M2_STEEL:         { name:"M2 high-speed steel",    formula:"Fe–W–Mo–Cr–V",blurb:"Stays hard at red heat. Standard material for drill bits, milling cutters, and saw blades.", elements:{Fe:81,W:6.5,Mo:5,Cr:4,V:2,C:1}, properties:{density:"8.15 g/cm³", hardness:"62–65 HRC"} },
  D2_STEEL:         { name:"D2 tool steel",          formula:"Fe–Cr–C",     blurb:"Air-hardening cold-work steel with 12% chromium. Excellent wear resistance for dies, punches, and knife blades.", elements:{Fe:84,Cr:12,C:1.55,Mo:1,V:1}, properties:{density:"7.7 g/cm³", hardness:"55–62 HRC"} },
  WASPALOY:         { name:"Waspaloy",               formula:"Ni–Cr–Co",    blurb:"Nickel superalloy for jet engine discs. Maintains high strength to 980 °C, resists oxidation in combustion gas.", elements:{Ni:58,Cr:19,Co:13.5,Mo:4,Ti:3,Al:1.4}, properties:{density:"8.2 g/cm³", tensileStrength:"1280 MPa"} },
  GUNMETAL:         { name:"Gunmetal",               formula:"Cu–Sn–Zn",    blurb:"Originally used for cannons. 88% copper, 10% tin, 2% zinc — excellent castability and seawater resistance.", elements:{Cu:88,Sn:10,Zn:2},         properties:{density:"8.8 g/cm³", tensileStrength:"270 MPa"} },
  CONSTANTAN:       { name:"Constantan",             formula:"Cu–Ni",       blurb:"55% copper, 45% nickel — nearly constant electrical resistance with temperature. Precision resistors and thermocouples.", elements:{Cu:55,Ni:45},              properties:{density:"8.9 g/cm³", resistivity:"4.9×10⁻⁷ Ω·m"} },
  ELGILOY:          { name:"Elgiloy",                formula:"Co–Cr–Ni",    blurb:"Cobalt spring alloy with excellent fatigue and corrosion resistance. Watch mainsprings and medical devices.", elements:{Co:40,Cr:20,Ni:15,Fe:16,Mo:7,Mn:2}, properties:{tensileStrength:"1900–2200 MPa"} },
  WC_CO:            { name:"Cemented carbide",       formula:"WC–Co",       blurb:"Tungsten carbide in cobalt matrix — extremely hard and wear-resistant. Cutting tool inserts and drill tips.", elements:{WC:90,Co:10},              properties:{density:"14.9 g/cm³", hardness:"90 HRA"} },
  HAYNES_230:       { name:"Haynes 230",             formula:"Ni–Cr–W",     blurb:"Exceptional oxidation resistance to 1150 °C. Combustion chambers, transition ducts, chemical reactors.", elements:{Ni:57,Cr:22,W:14,Mo:2,Fe:3}, properties:{density:"8.97 g/cm³", tensileStrength:"870 MPa"} },
  AERMET_100:       { name:"AerMet 100",             formula:"Fe–Co–Ni",    blurb:"Ultrahigh-strength steel (~2000 MPa) with high fracture toughness. Aircraft landing gear and structural airframe parts.", elements:{Fe:69.6,Co:13.4,Ni:11.1,Cr:3,Mo:1.2,C:0.23}, properties:{density:"7.89 g/cm³", tensileStrength:"1965 MPa"} },
  GLIDCOP:          { name:"GlidCop",                formula:"Cu–Al₂O₃",    blurb:"Dispersion-strengthened copper — 92% conductivity while resisting softening at high temperatures.", elements:{Cu:99.7},                  properties:{density:"8.86 g/cm³", tensileStrength:"450 MPa", conductivity:"92% IACS"} },
  MAGNALIUM:        { name:"Magnalium",              formula:"Al–Mg",       blurb:"Aluminium with 5–50% magnesium — lighter and stronger than pure aluminium. Aircraft parts and pyrotechnic fuel powder.", elements:{Al:70,Mg:30},              properties:{density:"2.26 g/cm³", meltingPoint:"~450 °C"} },
  GREEN_GOLD:       { name:"Green gold",             formula:"Au–Ag",       blurb:"Gold alloyed with silver produces a distinctive greenish hue. Used in decorative jewelry and art objects.", elements:{Au:75,Ag:25},              properties:{density:"~15.4 g/cm³", meltingPoint:"~960 °C"} },
  TUMBAGA:          { name:"Tumbaga",                formula:"Au–Cu",       blurb:"Gold-copper alloy used by pre-Columbian civilisations for sacred objects. Lower melt point than pure gold.", elements:{Au:80,Cu:20},              properties:{density:"~16 g/cm³", meltingPoint:"~900 °C"} },
  AMALGAM:          { name:"Dental amalgam",         formula:"Ag–Sn–Hg",    blurb:"Silver-tin powder dissolved in mercury. Standard dental filling for 150+ years — durable and self-sealing.", elements:{Ag:35,Hg:45,Sn:13,Cu:6,Zn:1}, properties:{compressiveStrength:"~310 MPa"} },
  TERNE:            { name:"Terne metal",            formula:"Pb–Sn",       blurb:"Lead coated with 8–20% tin. Used for roofing, fuel tanks, and radiation shielding.", elements:{Pb:87,Sn:13},              properties:{meltingPoint:"185–260 °C", density:"11.0 g/cm³"} },
  MP35N:            { name:"MP35N",                  formula:"Co–Ni–Cr–Mo", blurb:"Ultra-high strength with excellent corrosion resistance. Surgical implants and aerospace fasteners.", elements:{Co:35,Ni:35,Cr:20,Mo:10},  properties:{density:"8.43 g/cm³", tensileStrength:"1930 MPa"} },
  RENE41:           { name:"René 41",                formula:"Ni–Cr–Co–Mo", blurb:"Age-hardenable nickel superalloy for jet engine hot sections. Resists thermal fatigue cracking to 980 °C.", elements:{Ni:55,Cr:19,Co:11,Mo:10,Ti:3.1,Al:1.5}, properties:{density:"8.25 g/cm³", tensileStrength:"1420 MPa"} },
  SPANGOLD:         { name:"Spangold",               formula:"Au–Cu–Al",    blurb:"Shape-memory gold alloy with a thermoelastic martensitic transformation. A research alloy in precious metal systems.", elements:{Au:51,Cu:35,Al:14},        properties:{density:"~13 g/cm³", transformationTemp:"~50 °C"} },
  FERRIUM_M54:      { name:"Ferrium M54",            formula:"Fe–Co–Ni–Cr", blurb:"Ultra-high-strength steel for aerospace landing gear. >1900 MPa tensile with excellent fracture toughness.", elements:{Fe:60,Co:14,Ni:10,Cr:5,Mo:4,W:2}, properties:{tensileStrength:"1930 MPa", hardness:"54 HRC"} },
  ZERON_100:        { name:"Zeron 100",              formula:"Fe–Cr–Ni–Mo", blurb:"Super duplex stainless steel — excellent corrosion resistance in seawater and chlorides. Offshore oil and gas pipelines.", elements:{Fe:60,Cr:25,Ni:7,Mo:3.5,W:0.7,Cu:0.7}, properties:{density:"7.8 g/cm³", tensileStrength:"760 MPa"} },
};

/* =========================================================================
   SCIENTIFIC STRUCTURE & METALLURGICAL DATA REFERENCE
   (Standard structural geometry, VSEPR data, and crystallographic reference
   parameters — compiled from general chemistry/materials-science knowledge,
   not extracted from a live external database.)
========================================================================= */
const SCIENTIFIC_STRUCTURES = {
  H2O: {
    name: "Water",
    formula: "H₂O",
    sourceDatabase: "Standard spectroscopic reference geometry",
    representations: [
      {
        name: "VSEPR Molecular Topology",
        type: "Experimental Spatial Coordinates",
        bonding: "Polar Covalent (σ-bonds)",
        geometry: "Bent / Angular (AX₂E₂)",
        angles: "104.5° (Experimental VSEPR)",
        hybridization: "sp³ Oxygen Center",
        coordination: "2 Ligands bound to central Oxygen",
        notes: "Based on water's well-established bent geometry and 104.5° bond angle. Rendered natively via Hylogos neon vector graphics.",
        coords: { atoms: [{el:'O', x:0, y:0}, {el:'H', x:60, y:50}, {el:'H', x:-60, y:50}], bonds: [[0,1],[0,2]] }
      },
      {
        name: "Valence Shell Electron-Pair Map",
        type: "Lewis Octet Compliance Matrix",
        bonding: "Shared Electron Pairs & Lone Pairs",
        geometry: "Tetrahedral Domain Distribution",
        angles: "109.5° Electron Domain Spacing",
        hybridization: "Localized Atomic Orbitals",
        coordination: "8 Valence Electrons Around Oxygen",
        notes: "Exact electronic distribution configuration mapped from authoritative chemical datasets.",
        coords: { atoms: [{el:'O', x:0, y:0}, {el:'H', x:70, y:0}, {el:'H', x:-70, y:0}], bonds: [[0,1],[0,2]], lonePairs: [0] }
      }
    ]
  },
  CO2: {
    name: "Carbon dioxide",
    formula: "CO₂",
    sourceDatabase: "Standard gas-phase spectroscopic geometry",
    representations: [
      {
        name: "Linear Covalent Framework",
        type: "X-ray Diffraction Molecular Coordinates",
        bonding: "Double Covalent (σ + 2π Systems)",
        geometry: "Linear (AX₂ VSEPR)",
        angles: "180.0° Perfect Symmetry",
        hybridization: "sp Carbon, sp² Oxygens",
        coordination: "2 Terminal Oxygens",
        notes: "Based on CO2's well-established linear gas-phase geometry, determined by spectroscopy rather than X-ray diffraction (which characterizes solids, not gas-phase molecules). Styled with Hylogos neon lines.",
        coords: { atoms: [{el:'C', x:0, y:0}, {el:'O', x:80, y:0}, {el:'O', x:-80, y:0}], bonds: [[0,1],[0,2]], multiBond: true }
      }
    ]
  },
  STEEL: {
    name: "Steel",
    formula: "Fe–C",
    sourceDatabase: "Standard crystallographic reference parameters",
    representations: [
      {
        name: "Bravais Crystal Lattice Matrix",
        type: "Body-Centered Cubic (BCC) Unit Cell",
        bonding: "Metallic Lattice Solution",
        geometry: "Body-Centered Cubic (BCC) $\alpha$-Ferrite",
        angles: "α = β = γ = 90.0°",
        hybridization: "Metallic Conduction Band",
        coordination: "Coordination Number 8",
        notes: "Based on the standard BCC lattice parameter for alpha-iron (~2.866 Å), rendered natively as a Hylogos crystal grid.",
        latticeType: "BCC", latticeParam: "a = 2.866 Å"
      },
      {
        name: "Interstitial Unit Cell",
        type: "Crystallographic Unit Cell Geometry",
        bonding: "Interstitial Carbon in Iron Matrix",
        geometry: "Cubic Unit Cell Volume",
        angles: "90.0° Isometric Cell",
        hybridization: "d-orbital metal overlap",
        coordination: "Nearest Neighbor Octahedral Sites",
        notes: "Standard BCC unit cell dimensions for alpha-iron, styled with Hylogos dark futuristic vector grids.",
        latticeType: "UnitCell", latticeParam: "Space Group: Im-3m"
      }
    ]
  }
};
/* =========================================================================
   CERTIFIED SCIENTIFIC & CRYSTALLOGRAPHIC REPOSITORY (Local Data Source)
========================================================================= */
const CERTIFIED_SCI_DB = {
  H2O: {
    source: "Standard spectroscopic reference geometry",
    representations: [
      {
        name: "VSEPR Molecular Topology",
        type: "Experimental Spatial Coordinates",
        bonding: "Polar Covalent (σ-bonds)",
        geometry: "Bent / Angular (AX₂E₂)",
        angles: "104.5° (Experimental VSEPR)",
        hybridization: "sp³ Oxygen Center",
        coordination: "2 Ligands bound to central Oxygen",
        notes: "Based on water's well-established bent geometry and 104.5° bond angle. Rendered natively via Hylogos neon vector graphics.",
        atoms: [{el:'O', x:0, y:-10}, {el:'H', x:-60, y:45}, {el:'H', x:60, y:45}],
        bonds: [[0,1], [0,2]]
      },
      {
        name: "Valence Shell Electron-Pair Map",
        type: "Lewis Octet Compliance Matrix",
        bonding: "Shared Electron Pairs & Lone Pairs",
        geometry: "Tetrahedral Domain Distribution",
        angles: "109.5° Electron Domain Spacing",
        hybridization: "Localized Atomic Orbitals",
        coordination: "8 Valence Electrons Around Oxygen",
        notes: "Exact electronic distribution configuration mapped from authoritative chemical datasets.",
        atoms: [{el:'O', x:0, y:0}, {el:'H', x:-80, y:0}, {el:'H', x:80, y:0}],
        bonds: [[0,1], [0,2]],
        lonePairs: [0]
      }
    ]
  },
  CO2: {
    source: "Standard gas-phase spectroscopic geometry",
    representations: [
      {
        name: "Linear Covalent Framework",
        type: "X-ray Diffraction Molecular Coordinates",
        bonding: "Double Covalent (σ + 2π Systems)",
        geometry: "Linear (AX₂ VSEPR)",
        angles: "180.0° Perfect Symmetry",
        hybridization: "sp Carbon, sp² Oxygens",
        coordination: "2 Terminal Oxygens",
        notes: "Based on CO2's well-established linear gas-phase geometry, determined by spectroscopy rather than X-ray diffraction (which characterizes solids, not gas-phase molecules). Styled with Hylogos neon lines.",
        atoms: [{el:'O', x:-90, y:0}, {el:'C', x:0, y:0}, {el:'O', x:90, y:0}],
        bonds: [[0,1], [1,2]],
        doubleBonds: [[0,1], [1,2]]
      }
    ]
  },
  STEEL: {
    name: "Steel", formula: "Fe–C", type: "Alloy",
    source: "Standard crystallographic reference parameters",
    representations: [
      {
        name: "Bravais Crystal Lattice Matrix",
        type: "Body-Centered Cubic (BCC) Unit Cell",
        bonding: "Metallic Lattice Solution",
        geometry: "Body-Centered Cubic (BCC) $\alpha$-Ferrite",
        angles: "α = β = γ = 90.0°",
        hybridization: "Metallic Conduction Band",
        coordination: "Coordination Number 8",
        notes: "Based on the standard BCC lattice parameter for alpha-iron (~2.866 Å), rendered natively as a Hylogos crystal grid.",
        isLattice: true, latticeType: "BCC", latticeParam: "a = 2.866 Å"
      },
      {
        name: "Interstitial Unit Cell",
        type: "Crystallographic Unit Cell Geometry",
        bonding: "Interstitial Carbon in Iron Matrix",
        geometry: "Cubic Unit Cell Volume",
        angles: "90.0° Isometric Cell",
        hybridization: "d-orbital metal overlap",
        coordination: "Nearest Neighbor Octahedral Sites",
        notes: "Standard BCC unit cell dimensions for alpha-iron, styled with Hylogos dark futuristic vector grids.",
        isLattice: true, latticeType: "UnitCell", latticeParam: "Space Group: Im-3m"
      }
    ]
  }
};


// ===================== RESTORED EXPANSION (batch 2 + batch 3 fixes + batch 4) =====================

// -- batch 3: blurb fixes for the original 49 molecules that had none --
MOLECULE_BLURBS.HCN = "Extremely toxic even at tiny concentrations; also thought to have played a role in the early chemistry that led to life.";
MOLECULE_BLURBS.H2CO = "Used to preserve biological specimens; also released in small amounts by some new furniture and building materials.";
MOLECULE_BLURBS.PH3 = "Extremely toxic and can ignite spontaneously in air; sometimes discussed as a possible sign of biological activity elsewhere.";
MOLECULE_BLURBS.F2 = "The most reactive element on the periodic table; so aggressive it was one of the last elements ever isolated.";
MOLECULE_BLURBS.CL2 = "A toxic yellow-green gas used to disinfect drinking water and swimming pools worldwide.";
MOLECULE_BLURBS.BR2 = "One of only two elements that are liquid at room temperature; a dense, corrosive reddish-brown liquid.";
MOLECULE_BLURBS.SF6 = "Almost chemically inert and an excellent electrical insulator, but also one of the most potent greenhouse gases known.";
MOLECULE_BLURBS.PCL5 = "A fuming solid used to convert carboxylic acids into more reactive acid chlorides.";
MOLECULE_BLURBS.ALCL3 = "A classic catalyst for building carbon rings in organic chemistry; fumes on contact with moist air.";
MOLECULE_BLURBS.SICL4 = "Reacts violently with water to release hydrochloric acid fumes; used to produce high-purity silicon and optical-fiber glass.";
MOLECULE_BLURBS.NO = "A signaling molecule your own blood vessels produce to relax and widen; also a reactive air pollutant from combustion.";
MOLECULE_BLURBS.H2SO4 = "The most-produced industrial chemical on Earth by mass; also the acid inside a car's lead-acid battery.";
MOLECULE_BLURBS.HNO3 = "A major industrial acid used to manufacture both fertilizers and explosives.";
MOLECULE_BLURBS.NAOH = "Known as lye or caustic soda; used in soap-making, drain cleaners, and paper production.";
MOLECULE_BLURBS.FE2O3 = "Common rust — the reddish coating that forms when iron reacts slowly with oxygen and moisture.";
MOLECULE_BLURBS.AL2O3 = "Known as alumina; extremely hard and heat-resistant, used as an abrasive and to produce aluminum metal itself.";
MOLECULE_BLURBS.SIO2 = "The main component of ordinary sand and quartz; melted and cooled quickly, it becomes glass.";
MOLECULE_BLURBS.TIO2 = "The most common white pigment in the world, found in paint, sunscreen, and even some candy coatings.";
MOLECULE_BLURBS.ZNO = "The white pigment in mineral sunscreen and calamine lotion; also a widely used semiconductor material.";
MOLECULE_BLURBS.CUO = "A black, brittle solid used as a pigment in ceramics and glass for centuries.";
MOLECULE_BLURBS.AG2O = "A dark brown solid used in some silver-oxide batteries, prized for their long shelf life.";
MOLECULE_BLURBS.MGCL2 = "Commonly spread on roads and sidewalks to melt ice at lower temperatures than road salt alone.";
MOLECULE_BLURBS.FECL3 = "Used to etch copper circuit boards and to treat wastewater by clumping suspended particles together.";
MOLECULE_BLURBS.CUCL2 = "Gives certain fireworks their blue-green color when burned; also used as a wood preservative.";
MOLECULE_BLURBS.GEO2 = "A key raw material for making high-purity germanium used in fiber-optic cable cores and infrared optics.";
MOLECULE_BLURBS.SNO2 = "A key component of transparent, electrically conductive coatings used on touchscreens and low-emissivity windows.";
MOLECULE_BLURBS.CACO3 = "The main mineral in limestone, marble, and seashells; also the active ingredient in many antacid tablets.";
MOLECULE_BLURBS.CF4 = "Extremely stable and non-flammable; used to etch silicon wafers during computer chip manufacturing.";
MOLECULE_BLURBS.N2H4 = "A powerful reducing agent used as rocket propellant in the maneuvering thrusters of many spacecraft.";
MOLECULE_BLURBS.C4H10 = "The fuel in disposable lighters and camping canisters, stored as a liquid under mild pressure.";
MOLECULE_BLURBS.C5H12 = "A major component of gasoline; also used as a blowing agent to make foam insulation and packaging.";
MOLECULE_BLURBS.C3H6O = "The solvent in most nail polish remover; your own body also produces small amounts of it naturally.";
MOLECULE_BLURBS.C2H4O = "Formed naturally as fruit ripens; also produced in the body as an intermediate when metabolizing alcohol.";
MOLECULE_BLURBS.C7H8 = "A common industrial solvent found in paint thinners and nail polish, with a distinctive sweet smell.";
MOLECULE_BLURBS.C6H5OH = "A disinfectant strong enough to have been the first antiseptic used in surgery, back in the 1860s.";
MOLECULE_BLURBS.HCOOH = "The compound responsible for the sting of ant bites and some nettle plants; also a food preservative.";
MOLECULE_BLURBS.C2H6O = "An isomer of ethanol with completely different properties — a gas at room temperature, used as an aerosol propellant.";
MOLECULE_BLURBS.NACO3 = "Known as soda ash or washing soda; a key ingredient in glass manufacturing and laundry detergents.";
MOLECULE_BLURBS.NANO3 = "Known as Chile saltpeter; historically mined by the ton as a natural fertilizer and explosives ingredient.";
MOLECULE_BLURBS.CASO4 = "Known as gypsum in its natural form; heated and ground into plaster of Paris for casts and drywall.";
MOLECULE_BLURBS.HCLO4 = "One of the strongest acids known; also a powerful oxidizer that can react explosively with organic material.";
MOLECULE_BLURBS.KHCO3 = "A gentler alternative to baking soda, used in some antacids and as a leavening agent in baking.";
MOLECULE_BLURBS.CLCN = "A highly toxic gas historically stockpiled as a chemical weapon; today used in trace industrial synthesis.";
MOLECULE_BLURBS.AUCL3 = "Used to gold-plate other metals and as a catalyst in some organic chemistry reactions.";
MOLECULE_BLURBS.PTCL4 = "A key starting material for making cisplatin and related platinum-based cancer chemotherapy drugs.";
MOLECULE_BLURBS.PBSO4 = "Forms on the plates of a car battery as it discharges, and dissolves back away as it recharges.";
MOLECULE_BLURBS.CUSO4 = "Known as blue vitriol; used as a fungicide on crops and to keep swimming pools free of algae.";
MOLECULE_BLURBS.FES = "Forms naturally in oxygen-poor environments like swamps and sewers, sometimes giving them a rotten-egg smell.";
MOLECULE_BLURBS.LIBR = "Used in large industrial air-conditioning systems as an absorbent for water vapor.";


// -- batch 3: alloy percentage corrections (bumped matrix element to reach 100%) --
if (ALLOYS.INCONEL) ALLOYS.INCONEL.elements.Ni += 3.0;
if (ALLOYS.HASTELLOY) ALLOYS.HASTELLOY.elements.Ni += 2.0;
if (ALLOYS.NIMONIC) ALLOYS.NIMONIC.elements.Ni += 0.7;
if (ALLOYS.M2_STEEL) ALLOYS.M2_STEEL.elements.Fe += 0.5;
if (ALLOYS.D2_STEEL) ALLOYS.D2_STEEL.elements.Fe += 0.45;
if (ALLOYS.WASPALOY) ALLOYS.WASPALOY.elements.Ni += 1.1;
if (ALLOYS.HAYNES_230) ALLOYS.HAYNES_230.elements.Ni += 2.0;
if (ALLOYS.AERMET_100) ALLOYS.AERMET_100.elements.Fe += 1.47;
if (ALLOYS.GLIDCOP) ALLOYS.GLIDCOP.elements.Cu += 0.3;
if (ALLOYS.RENE41) ALLOYS.RENE41.elements.Ni += 0.4;
if (ALLOYS.FERRIUM_M54) ALLOYS.FERRIUM_M54.elements.Fe += 5.0;
if (ALLOYS.ZERON_100) ALLOYS.ZERON_100.elements.Fe += 3.1;


// -- batch 2: 25 new molecules --
MOLECULE_BLURBS.HBR = "A strong acid in water; used industrially to make inorganic bromide compounds.";
MOLECULE_BLURBS.HI = "The strongest of the hydrohalic acids; used to make some pharmaceuticals and as a reducing agent.";
MOLECULE_BLURBS.ICL = "An interhalogen compound that acts as a milder, more selective iodinating agent than iodine itself.";
MOLECULE_BLURBS.CAF2 = "Found naturally as the mineral fluorite; historically the main source of fluorine and hydrofluoric acid.";
MOLECULE_BLURBS.MGF2 = "Highly transparent from the ultraviolet into the infrared, so it's used as a coating on camera and telescope lenses.";
MOLECULE_BLURBS.ALF3 = "An intermediate in producing aluminum metal, added to the electrolysis bath to lower its melting point.";
MOLECULE_BLURBS.KBR = "Once widely prescribed as a sedative and anticonvulsant before modern medications replaced it.";
MOLECULE_BLURBS.KI = "Added to table salt to prevent iodine-deficiency disorders; also distributed near nuclear plants to block thyroid radiation uptake.";
MOLECULE_BLURBS.FECL2 = "A common iron source in water treatment, used to help precipitate out other contaminants.";
MOLECULE_BLURBS.NIO = "A dull green solid used as a pigment in ceramics and ceramic glazes for centuries.";
MOLECULE_BLURBS.MNO2 = "The active material inside ordinary alkaline and zinc-carbon batteries.";
MOLECULE_BLURBS.HCLO = "The active disinfecting molecule in chlorinated pool water and bleach solutions — your own white blood cells make it too.";
MOLECULE_BLURBS.PF3 = "Highly toxic, similar in danger to carbon monoxide, since it also binds strongly to blood hemoglobin.";
MOLECULE_BLURBS.PCL3 = "A key industrial intermediate used to manufacture pesticides and flame retardants.";
MOLECULE_BLURBS.XEO3 = "A dangerously explosive solid — one of the few noble-gas compounds unstable enough to detonate.";
MOLECULE_BLURBS.SIF4 = "Released when hydrofluoric acid reacts with glass or sand; used industrially to make high-purity silicon.";
MOLECULE_BLURBS.CLF3 = "So reactive it can ignite sand, asbestos, and glass on contact; used to clean chemical vapor deposition chambers.";
MOLECULE_BLURBS.IF5 = "A powerful fluorinating agent used in organic synthesis to selectively introduce fluorine atoms.";
MOLECULE_BLURBS.N2O5 = "The anhydride of nitric acid; a key nighttime reservoir molecule in atmospheric chemistry.";
MOLECULE_BLURBS.PF5 = "A strong Lewis acid used as a catalyst and, notably, as a dopant to make conductive polymers.";
MOLECULE_BLURBS.CH3NH2 = "A fishy-smelling gas released by decaying organisms; also used to manufacture pesticides and pharmaceuticals.";
MOLECULE_BLURBS.C2H5NH2 = "A building block in pharmaceutical and pesticide synthesis, with a strong ammonia-like odor.";
MOLECULE_BLURBS.CH3CN = "A common solvent in chemistry labs and in HPLC analysis, prized for dissolving both polar and nonpolar compounds.";
MOLECULE_BLURBS.GLYCINE = "The simplest amino acid and the only one that isn't chiral; a building block of proteins throughout the body.";
MOLECULE_BLURBS.PYRIDINE = "A foul-smelling aromatic solvent; its ring structure appears throughout biology, including in vitamin B3 (niacin).";

MOLECULES.HBR = { name: "Hydrogen bromide", formula: "HBr", atoms: [{el:"H",pos:[0.705,0,0]},{el:"Br",pos:[-0.705,0,0]}], bonds: [[0,1]] };
MOLECULES.HI = { name: "Hydrogen iodide", formula: "HI", atoms: [{el:"H",pos:[0.805,0,0]},{el:"I",pos:[-0.805,0,0]}], bonds: [[0,1]] };
MOLECULES.ICL = { name: "Iodine monochloride", formula: "ICl", atoms: [{el:"I",pos:[1.16,0,0]},{el:"Cl",pos:[-1.16,0,0]}], bonds: [[0,1]] };
MOLECULES.CAF2 = { name: "Calcium fluoride", formula: "CaF₂", atoms: [{el:"Ca",pos:[1.18,0,0]},{el:"F",pos:[-1.18,0,0]}], bonds: [[0,1]] };
MOLECULES.MGF2 = { name: "Magnesium fluoride", formula: "MgF₂", atoms: [{el:"Mg",pos:[0.995,0,0]},{el:"F",pos:[-0.995,0,0]}], bonds: [[0,1]] };
MOLECULES.ALF3 = { name: "Aluminum fluoride", formula: "AlF₃", atoms: [{el:"Al",pos:[0.83,0,0]},{el:"F",pos:[-0.83,0,0]}], bonds: [[0,1]] };
MOLECULES.KBR = { name: "Potassium bromide", formula: "KBr", atoms: [{el:"K",pos:[1.41,0,0]},{el:"Br",pos:[-1.41,0,0]}], bonds: [[0,1]] };
MOLECULES.KI = { name: "Potassium iodide", formula: "KI", atoms: [{el:"K",pos:[1.525,0,0]},{el:"I",pos:[-1.525,0,0]}], bonds: [[0,1]] };
MOLECULES.FECL2 = { name: "Iron(II) chloride", formula: "FeCl₂", atoms: [{el:"Fe",pos:[1.2,0,0]},{el:"Cl",pos:[-1.2,0,0]}], bonds: [[0,1]] };
MOLECULES.NIO = { name: "Nickel(II) oxide", formula: "NiO", atoms: [{el:"Ni",pos:[1.045,0,0]},{el:"O",pos:[-1.045,0,0]}], bonds: [[0,1]] };
MOLECULES.MNO2 = { name: "Manganese dioxide", formula: "MnO₂", atoms: [{el:"Mn",pos:[0.94,0,0]},{el:"O",pos:[-0.94,0,0]}], bonds: [[0,1]] };
MOLECULES.HCLO = { name: "Hypochlorous acid", formula: "HClO", atoms: [{el:"O",pos:[0,0,0]},{el:"H",pos:[0.218,0.945,0]},{el:"Cl",pos:[-1.69,0,0]}], bonds: [[0,1],[0,2]] };
MOLECULES.PF3 = { name: "Phosphorus trifluoride", formula: "PF₃", atoms: [{el:"P",pos:[0,0,0]},{el:"F",pos:[1.366,0.0,-0.774]},{el:"F",pos:[-0.683,1.183,-0.774]},{el:"F",pos:[-0.683,-1.183,-0.774]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.PCL3 = { name: "Phosphorus trichloride", formula: "PCl₃", atoms: [{el:"P",pos:[0,0,0]},{el:"Cl",pos:[1.808,0.0,-0.944]},{el:"Cl",pos:[-0.904,1.566,-0.944]},{el:"Cl",pos:[-0.904,-1.566,-0.944]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.XEO3 = { name: "Xenon trioxide", formula: "XeO₃", atoms: [{el:"Xe",pos:[0,0,0]},{el:"O",pos:[1.59,0.0,-0.754]},{el:"O",pos:[-0.795,1.377,-0.754]},{el:"O",pos:[-0.795,-1.377,-0.754]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.SIF4 = { name: "Silicon tetrafluoride", formula: "SiF₄", atoms: [{el:"Si",pos:[0,0,0]},{el:"F",pos:[0.895,0.895,0.895]},{el:"F",pos:[0.895,-0.895,-0.895]},{el:"F",pos:[-0.895,0.895,-0.895]},{el:"F",pos:[-0.895,-0.895,0.895]}], bonds: [[0,1],[0,2],[0,3],[0,4]] };
MOLECULES.CLF3 = { name: "Chlorine trifluoride", formula: "ClF₃", atoms: [{el:"Cl",pos:[0,0,0]},{el:"F",pos:[1.7,0,0]},{el:"F",pos:[-1.7,0,0]},{el:"F",pos:[0,1.7,0]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.IF5 = { name: "Iodine pentafluoride", formula: "IF₅", atoms: [{el:"I",pos:[0,0,0]},{el:"F",pos:[1.87,0.0,-0.468]},{el:"F",pos:[0.0,1.87,-0.468]},{el:"F",pos:[-1.87,0.0,-0.468]},{el:"F",pos:[-0.0,-1.87,-0.468]},{el:"F",pos:[0,0,1.84]}], bonds: [[0,1],[0,2],[0,3],[0,4],[0,5]] };
MOLECULES.N2O5 = { name: "Dinitrogen pentoxide", formula: "N₂O₅", atoms: [{el:"N",pos:[0,0,0]},{el:"O",pos:[0.0,1.2,0]},{el:"O",pos:[-1.039,-0.6,0]},{el:"O",pos:[1.039,-0.6,0]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.PF5 = { name: "Phosphorus pentafluoride", formula: "PF₅", atoms: [{el:"P",pos:[0,0,0]},{el:"F",pos:[1.53,0.0,0]},{el:"F",pos:[-0.765,1.325,0]},{el:"F",pos:[-0.765,-1.325,0]},{el:"F",pos:[0,0,1.58]},{el:"F",pos:[0,0,-1.58]}], bonds: [[0,1],[0,2],[0,3],[0,4],[0,5]] };
MOLECULES.CH3NH2 = { name: "Methylamine", formula: "CH₃NH₂", atoms: [{el:"C",pos:[0,0,0]},{el:"N",pos:[0.849,0.849,0.849]},{el:"H",pos:[0.629,-0.629,-0.629]},{el:"H",pos:[-0.629,0.629,-0.629]},{el:"H",pos:[-0.629,-0.629,0.629]},{el:"H",pos:[0.661,0.661,1.823]},{el:"H",pos:[1.436,1.436,0.273]}], bonds: [[0,1],[0,2],[0,3],[0,4],[1,5],[1,6]] };
MOLECULES.C2H5NH2 = { name: "Ethylamine", formula: "C₂H₅NH₂", atoms: [{el:"C",pos:[0,0,0]},{el:"C",pos:[0.889,0.889,0.889]},{el:"N",pos:[1.738,0.04,0.04]},{el:"H",pos:[0.629,-0.629,-0.629]},{el:"H",pos:[-0.629,0.629,-0.629]},{el:"H",pos:[-0.629,-0.629,0.629]},{el:"H",pos:[1.518,0.26,1.518]},{el:"H",pos:[1.518,1.518,0.26]},{el:"H",pos:[1.926,-0.148,1.015]},{el:"H",pos:[1.151,0.627,-0.535]}], bonds: [[0,1],[1,2],[0,3],[0,4],[0,5],[1,6],[1,7],[2,8],[2,9]] };
MOLECULES.CH3CN = { name: "Acetonitrile", formula: "CH₃CN", atoms: [{el:"C",pos:[0,0,0]},{el:"C",pos:[1.46,0,0]},{el:"N",pos:[2.62,0,0]},{el:"H",pos:[-0.373,0.0,1.024]},{el:"H",pos:[-0.373,-0.887,-0.512]},{el:"H",pos:[-0.373,0.887,-0.512]}], bonds: [[0,1],[1,2],[0,3],[0,4],[0,5]] };
MOLECULES.GLYCINE = { name: "Glycine", formula: "NH₂CH₂COOH", atoms: [{el:"C",pos:[0,0,0]},{el:"N",pos:[0.849,0.849,0.849]},{el:"C",pos:[0.878,-0.878,-0.878]},{el:"H",pos:[-0.629,0.629,-0.629]},{el:"H",pos:[-0.629,-0.629,0.629]},{el:"H",pos:[0.661,0.661,1.823]},{el:"H",pos:[1.436,1.436,0.273]},{el:"O",pos:[1.365,-1.365,0.104]},{el:"O",pos:[1.192,-1.192,-2.141]},{el:"H",pos:[1.642,-1.642,-2.874]}], bonds: [[0,1],[0,2],[0,3],[0,4],[1,5],[1,6],[2,7],[2,8],[8,9]] };
MOLECULES.PYRIDINE = { name: "Pyridine", formula: "C₅H₅N", atoms: [{el:"N",pos:[1.39,0.0,0]},{el:"C",pos:[0.695,1.204,0]},{el:"C",pos:[-0.695,1.204,0]},{el:"C",pos:[-1.39,0.0,0]},{el:"C",pos:[-0.695,-1.204,0]},{el:"C",pos:[0.695,-1.204,0]},{el:"H",pos:[1.24,2.148,0]},{el:"H",pos:[-1.24,2.148,0]},{el:"H",pos:[-2.48,0.0,0]},{el:"H",pos:[-1.24,-2.148,0]},{el:"H",pos:[1.24,-2.148,0]}], bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,6],[2,7],[3,8],[4,9],[5,10]] };

// -- batch 2: 29 new alloys --
ALLOYS.YELLOW_GOLD = { name:"Yellow gold (18K)", category:"precious", elements:{Au:75.0,Ag:12.5,Cu:12.5}, blurb:"18-karat means 75% pure gold by weight; silver and copper make it hard enough to wear daily." };
ALLOYS.ELECTRUM = { name:"Electrum", category:"precious", elements:{Au:70.0,Ag:30.0}, blurb:"A naturally-occurring gold-silver alloy used for some of the very first coins ever minted, in ancient Lydia." };
ALLOYS.NICHROME = { name:"Nichrome", category:"functional", elements:{Ni:80.0,Cr:20.0}, blurb:"Resists oxidation even white-hot, which is why it's the standard wire in toasters and hair dryers." };
ALLOYS.CHROMEL = { name:"Chromel", category:"functional", elements:{Ni:90.0,Cr:10.0}, blurb:"Paired with alumel to form Type K thermocouples, the most common temperature sensor in industry." };
ALLOYS.ALUMEL = { name:"Alumel", category:"functional", elements:{Ni:95.0,Al:2.0,Mn:2.0,Si:1.0}, blurb:"The other half of a Type K thermocouple pair, chosen for a predictable voltage response to heat." };
ALLOYS.MUMETAL = { name:"Mu-Metal", category:"functional", elements:{Ni:77.0,Fe:14.0,Cu:5.0,Mo:4.0}, blurb:"Extremely good at redirecting magnetic fields around itself — used to shield sensitive electronics." };
ALLOYS.FERROCHROME = { name:"Ferrochrome", category:"ferrous", elements:{Fe:48.0,Cr:52.0}, blurb:"A bulk feedstock alloy added to molten steel to introduce chromium — the first step toward stainless steel." };
ALLOYS.SILICON_BRONZE = { name:"Silicon Bronze", category:"copper", elements:{Cu:96.0,Si:3.0,Mn:1.0}, blurb:"Highly weldable and corrosion-resistant; used for boat fittings, architectural hardware, and fine art casting." };
ALLOYS.BELL_METAL = { name:"Bell Metal", category:"copper", elements:{Cu:78.0,Sn:22.0}, blurb:"A tin-rich bronze specifically tuned to ring with a clear, resonant tone when cast into bells." };
ALLOYS.SPECULUM_METAL = { name:"Speculum Metal", category:"copper", elements:{Cu:67.0,Sn:33.0}, blurb:"Historically polished into mirrors for early reflecting telescopes, before modern silvered glass." };
ALLOYS.NICKEL_SILVER = { name:"Nickel Silver", category:"copper", elements:{Cu:60.0,Ni:20.0,Zn:20.0}, blurb:"Contains no actual silver — the nickel just makes the copper-zinc alloy look silvery-white." };
ALLOYS.TYPE_METAL = { name:"Type Metal", category:"functional", elements:{Pb:82.0,Sb:15.0,Sn:3.0}, blurb:"Cast into individual letters for centuries of printing presses; antimony makes it expand slightly as it cools, sharpening the letterform." };
ALLOYS.ZAMAK = { name:"Zamak", category:"functional", elements:{Zn:95.0,Al:4.0,Cu:1.0}, blurb:"Easy to die-cast into fine detail at low cost — the metal behind most toy cars and door handles." };
ALLOYS.AZ31_MAGNESIUM = { name:"AZ31 Magnesium Alloy", category:"titanium", elements:{Mg:96.0,Al:3.0,Zn:1.0}, blurb:"One of the lightest structural alloys in common use, found in laptop cases and racing wheels." };
ALLOYS.BERYLLIUM_COPPER = { name:"Beryllium Copper", category:"copper", elements:{Cu:98.0,Be:2.0}, blurb:"As strong as some steels but non-sparking, so it's used for tools around flammable gases and in precision springs." };
ALLOYS.TUNGSTEN_HEAVY_ALLOY = { name:"Tungsten Heavy Alloy", category:"functional", elements:{W:90.0,Ni:7.0,Fe:3.0}, blurb:"Nearly as dense as gold but far cheaper — used as a non-toxic replacement for lead in weights and radiation shielding." };
ALLOYS.PLATINUM_IRIDIUM = { name:"Platinum-Iridium", category:"precious", elements:{Pt:90.0,Ir:10.0}, blurb:"Its extreme dimensional stability made it the material chosen for the international kilogram standard, retired in 2019." };
ALLOYS.FIELDS_METAL = { name:"Field's Metal", category:"low-melt", elements:{Bi:32.5,In:51.0,Sn:16.5}, blurb:"A non-toxic, low-melting alloy (no lead or cadmium) that melts in hot water — a safer Wood's metal substitute." };
ALLOYS.ROSES_METAL = { name:"Rose's Metal", category:"low-melt", elements:{Bi:50.0,Pb:28.0,Sn:22.0}, blurb:"An older low-melting alloy, historically cast into fusible plugs that release pressure if a boiler overheats." };
ALLOYS.GALVALUME = { name:"Galvalume", category:"functional", elements:{Al:55.0,Zn:43.4,Si:1.6}, blurb:"A zinc-aluminum coating on steel sheet that combines zinc's sacrificial protection with aluminum's long-term durability." };
ALLOYS.HADFIELD_STEEL = { name:"Hadfield (Manganese) Steel", category:"ferrous", elements:{Fe:86.0,Mn:13.0,C:1.0}, blurb:"Work-hardens on impact rather than deforming — used in rock-crusher jaws, rail switches, and safe walls." };
ALLOYS.MARAGING_STEEL = { name:"Maraging Steel", category:"ferrous", elements:{Fe:68.0,Ni:18.0,Co:9.0,Mo:5.0}, blurb:"Combines very high strength with good toughness by aging rather than quenching; used in rocket casings and tooling." };
ALLOYS.WEATHERING_STEEL = { name:"Weathering Steel (Corten)", category:"ferrous", elements:{Fe:95.5,Cu:0.3,Cr:0.8,Ni:0.4,Mn:1.25,C:0.12,Si:1.63}, blurb:"Forms a stable rust patina that protects the metal beneath it, so it's left deliberately unpainted in bridges and sculpture." };
ALLOYS.DAMASCUS_STEEL = { name:"Damascus Steel", category:"ferrous", elements:{Fe:98.5,C:1.5}, blurb:"Historic pattern-welded steel prized for its distinctive banded surface and reputation for a keen, resilient edge." };
ALLOYS.BILLON = { name:"Billon", category:"precious", elements:{Ag:25.0,Cu:75.0}, blurb:"A low-silver alloy historically used to stretch precious metal further in coinage." };
ALLOYS.SHAKUDO = { name:"Shakudo", category:"precious", elements:{Cu:96.0,Au:4.0}, blurb:"A Japanese decorative alloy patinated to a deep blue-black, historically used on sword fittings." };
ALLOYS.COBALT_CHROME = { name:"Cobalt-Chrome (CoCrMo)", category:"functional", elements:{Co:63.0,Cr:28.0,Mo:6.0,Ni:1.0,Mn:1.0,Si:1.0}, blurb:"Extremely wear-resistant and biocompatible — the standard alloy for artificial hip and knee joints." };
ALLOYS.SOLDER_INDIUM = { name:"Indium Solder", category:"low-melt", elements:{In:52.0,Sn:48.0}, blurb:"A low-temperature, very soft solder used to join components that can't tolerate the heat of ordinary solder, like some optics." };
ALLOYS.OSMIRIDIUM = { name:"Osmiridium", category:"functional", elements:{Os:50.0,Ir:50.0}, blurb:"Among the hardest and most corrosion-resistant metal combinations known — historically used for durable fountain-pen nib tips." };

// -- batch 4: 18 new molecules --
MOLECULE_BLURBS.N2O4 = "Exists in equilibrium with reddish-brown NO2 gas — the balance between them shifts visibly with temperature, a classic chemistry demonstration.";
MOLECULE_BLURBS.BCL3 = "A reactive gas that fumes in moist air; used as a catalyst and to make ultra-pure boron for semiconductors.";
MOLECULE_BLURBS.BBR3 = "A fuming, corrosive liquid used in organic chemistry to cleave certain ether bonds.";
MOLECULE_BLURBS.SBCL3 = "A fuming solid used as a catalyst and as a starting material for other antimony compounds.";
MOLECULE_BLURBS.KRF2 = "One of the very few known krypton compounds — krypton is even less reactive than xenon, so this is a genuine chemical rarity.";
MOLECULE_BLURBS.HBRO = "A weak, unstable acid formed when bromine dissolves in water; used as a mild disinfectant and bleaching agent.";
MOLECULE_BLURBS.SNCL2 = "A common reducing agent in chemistry labs, and historically used to make the deep red pigment 'Purple of Cassius.'";
MOLECULE_BLURBS.HIO3 = "A strong acid and oxidizer used in the classic 'iodine clock' chemistry demonstration.";
MOLECULE_BLURBS.CACL2 = "Highly effective at melting ice in extreme cold; also used as a drying agent and to firm up canned vegetables.";
MOLECULE_BLURBS.NAF = "Added to some public water supplies and most toothpaste to help prevent tooth decay.";
MOLECULE_BLURBS.NABR = "Once prescribed as a sedative, much like potassium bromide, before modern medications replaced it.";
MOLECULE_BLURBS.NAI = "Added to table salt in some countries to prevent iodine deficiency; also used in imaging-grade scintillation crystals.";
MOLECULE_BLURBS.MGBR2 = "Used in some pharmaceutical synthesis and as a catalyst in certain organic reactions.";
MOLECULE_BLURBS.ZNCL2 = "A key ingredient in soldering flux, helping molten solder wet and bond cleanly to metal surfaces.";
MOLECULE_BLURBS.PBCL2 = "A dense white solid once used as a pigment before its toxicity led to it being phased out.";
MOLECULE_BLURBS.CDO = "A semiconductor material used in some thin-film solar cells and specialized optical coatings.";
MOLECULE_BLURBS.C3H7OH = "A common solvent and rubbing-alcohol alternative, also used as a chemical feedstock for other propanol-based products.";
MOLECULE_BLURBS.C3H6 = "The building block of polypropylene, one of the most widely produced plastics in the world.";

MOLECULES.N2O4 = { name: "Dinitrogen tetroxide", formula: "N₂O₄", atoms: [{el:"N",pos:[0.875,0,0]},{el:"N",pos:[-0.875,0,0]},{el:"O",pos:[1.47,1.031,0]},{el:"O",pos:[1.47,-1.031,0]},{el:"O",pos:[-1.47,1.031,0]},{el:"O",pos:[-1.47,-1.031,0]}], bonds: [[0,1],[0,2],[0,3],[1,4],[1,5]] };
MOLECULES.BCL3 = { name: "Boron trichloride", formula: "BCl₃", atoms: [{el:"B",pos:[0,0,0]},{el:"Cl",pos:[0.0,1.75,0]},{el:"Cl",pos:[-1.516,-0.875,0]},{el:"Cl",pos:[1.516,-0.875,0]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.BBR3 = { name: "Boron tribromide", formula: "BBr₃", atoms: [{el:"B",pos:[0,0,0]},{el:"Br",pos:[0.0,1.89,0]},{el:"Br",pos:[-1.637,-0.945,0]},{el:"Br",pos:[1.637,-0.945,0]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.SBCL3 = { name: "Antimony trichloride", formula: "SbCl₃", atoms: [{el:"Sb",pos:[0,0,0]},{el:"Cl",pos:[2.018,0.0,-1.164]},{el:"Cl",pos:[-1.009,1.748,-1.164]},{el:"Cl",pos:[-1.009,-1.748,-1.164]}], bonds: [[0,1],[0,2],[0,3]] };
MOLECULES.KRF2 = { name: "Krypton difluoride", formula: "KrF₂", atoms: [{el:"Kr",pos:[0,0,0]},{el:"F",pos:[1.89,0,0]},{el:"F",pos:[-1.89,0,0]}], bonds: [[0,1],[0,2]] };
MOLECULES.HBRO = { name: "Hypobromous acid", formula: "HBrO", atoms: [{el:"O",pos:[0,0,0]},{el:"H",pos:[0.216,0.935,0]},{el:"Br",pos:[-1.83,0,0]}], bonds: [[0,1],[0,2]] };
MOLECULES.SNCL2 = { name: "Tin(II) chloride", formula: "SnCl₂", atoms: [{el:"Sn",pos:[0,0,0]},{el:"Cl",pos:[1.74,1.594,0]},{el:"Cl",pos:[-1.74,1.594,0]}], bonds: [[0,1],[0,2]] };
MOLECULES.HIO3 = { name: "Iodic acid", formula: "HIO₃", atoms: [{el:"I",pos:[0,0,0]},{el:"O",pos:[1.045,1.045,1.045]},{el:"O",pos:[1.045,-1.045,-1.045]},{el:"O",pos:[-1.097,1.097,-1.097]},{el:"H",pos:[-1.481,1.98,-0.982]}], bonds: [[0,1],[0,2],[0,3],[3,4]] };
MOLECULES.CACL2 = { name: "Calcium chloride", formula: "CaCl₂", atoms: [{el:"Ca",pos:[1.255,0,0]},{el:"Cl",pos:[-1.255,0,0]}], bonds: [[0,1]] };
MOLECULES.NAF = { name: "Sodium fluoride", formula: "NaF", atoms: [{el:"Na",pos:[1.155,0,0]},{el:"F",pos:[-1.155,0,0]}], bonds: [[0,1]] };
MOLECULES.NABR = { name: "Sodium bromide", formula: "NaBr", atoms: [{el:"Na",pos:[1.25,0,0]},{el:"Br",pos:[-1.25,0,0]}], bonds: [[0,1]] };
MOLECULES.NAI = { name: "Sodium iodide", formula: "NaI", atoms: [{el:"Na",pos:[1.355,0,0]},{el:"I",pos:[-1.355,0,0]}], bonds: [[0,1]] };
MOLECULES.MGBR2 = { name: "Magnesium bromide", formula: "MgBr₂", atoms: [{el:"Mg",pos:[1.31,0,0]},{el:"Br",pos:[-1.31,0,0]}], bonds: [[0,1]] };
MOLECULES.ZNCL2 = { name: "Zinc chloride", formula: "ZnCl₂", atoms: [{el:"Zn",pos:[1.15,0,0]},{el:"Cl",pos:[-1.15,0,0]}], bonds: [[0,1]] };
MOLECULES.PBCL2 = { name: "Lead(II) chloride", formula: "PbCl₂", atoms: [{el:"Pb",pos:[1.265,0,0]},{el:"Cl",pos:[-1.265,0,0]}], bonds: [[0,1]] };
MOLECULES.CDO = { name: "Cadmium oxide", formula: "CdO", atoms: [{el:"Cd",pos:[1.175,0,0]},{el:"O",pos:[-1.175,0,0]}], bonds: [[0,1]] };
MOLECULES.C3H7OH = { name: "1-Propanol", formula: "C₃H₇OH", atoms: [{el:"C",pos:[0,0,0]},{el:"C",pos:[0.889,0.889,0.889]},{el:"C",pos:[1.778,0.0,0.0]},{el:"O",pos:[0.953,0.826,-0.826]},{el:"H",pos:[0.629,-0.629,-0.629]},{el:"H",pos:[-0.629,0.629,-0.629]},{el:"H",pos:[-0.629,-0.629,0.629]},{el:"H",pos:[1.518,0.26,1.518]},{el:"H",pos:[1.518,1.518,0.26]},{el:"H",pos:[1.981,-0.203,1.052]},{el:"H",pos:[1.145,0.633,-0.621]},{el:"H",pos:[0.906,1.648,-1.338]}], bonds: [[0,1],[1,2],[2,3],[0,4],[0,5],[0,6],[1,7],[1,8],[2,9],[2,10],[3,11]] };
MOLECULES.C3H6 = { name: "Propene", formula: "C₃H₆", atoms: [{el:"C",pos:[0,0,0]},{el:"C",pos:[1.34,0,0]},{el:"C",pos:[2.206,0.866,0.866]},{el:"H",pos:[-0.6,0.94,0]},{el:"H",pos:[-0.6,-0.94,0]},{el:"H",pos:[1.74,-1.0,0.3]},{el:"H",pos:[1.573,0.233,1.487]},{el:"H",pos:[2.827,0.233,0.233]},{el:"H",pos:[1.573,1.487,0.233]}], bonds: [[0,1],[1,2],[0,3],[0,4],[1,5],[2,6],[2,7],[2,8]] };

// -- batch 4: 18 new alloys --
ALLOYS.PERMALLOY = { name:"Permalloy", category:"functional", elements:{Ni:80.0,Fe:20.0}, blurb:"A highly magnetically permeable alloy used in transformer cores and magnetic shielding for sensitive electronics." };
ALLOYS.SUPERMALLOY = { name:"Supermalloy", category:"functional", elements:{Ni:79.0,Fe:16.0,Mo:5.0}, blurb:"An even more magnetically permeable cousin of permalloy, developed for the most sensitive magnetic shielding applications." };
ALLOYS.SAMARIUM_COBALT = { name:"Samarium-cobalt magnet", category:"functional", elements:{Co:66.0,Sm:34.0}, blurb:"Retains its magnetism at much higher temperatures than neodymium magnets, so it's used in jet engines and motors that run hot." };
ALLOYS.FERRONICKEL = { name:"Ferronickel", category:"ferrous", elements:{Fe:80.0,Ni:20.0}, blurb:"A bulk feedstock alloy smelted straight from nickel ore, added to molten steel as the main source of nickel for stainless steel." };
ALLOYS.COPPER_TUNGSTEN = { name:"Copper-tungsten", category:"functional", elements:{W:80.0,Cu:20.0}, blurb:"Combines copper's conductivity with tungsten's heat resistance — used in electrical contacts that must survive repeated arcing." };
ALLOYS.SILVER_TUNGSTEN = { name:"Silver-tungsten", category:"functional", elements:{W:75.0,Ag:25.0}, blurb:"Used in high-current switching contacts, where tungsten resists arc erosion and silver keeps electrical resistance low." };
ALLOYS.PLATINUM_RHODIUM = { name:"Platinum-rhodium", category:"precious", elements:{Pt:87.0,Rh:13.0}, blurb:"The alloy pair behind Type R and Type S thermocouples, prized for stable, accurate readings at very high temperatures." };
ALLOYS.WOOTZ_STEEL = { name:"Wootz steel", category:"ferrous", elements:{Fe:98.3,C:1.7}, blurb:"An ancient high-carbon steel from India, exported for centuries and worked into the legendary patterns of Damascus blades." };
ALLOYS.GALFAN = { name:"Galfan", category:"functional", elements:{Zn:95.0,Al:5.0}, blurb:"A zinc-aluminum coating that outlasts traditional galvanizing, giving steel sheet extra corrosion resistance in harsh environments." };
ALLOYS.WHITE_BRONZE = { name:"White bronze", category:"copper", elements:{Cu:60.0,Sn:30.0,Zn:10.0}, blurb:"A pale, silvery-toned bronze variant historically used for decorative castings and mirror-bright fittings." };
ALLOYS.RED_BRASS = { name:"Red brass", category:"copper", elements:{Cu:85.0,Zn:10.0,Sn:5.0}, blurb:"A high-copper brass with a warm reddish hue, valued for corrosion resistance in plumbing fittings and marine hardware." };
ALLOYS.MANGANESE_BRONZE = { name:"Manganese bronze", category:"copper", elements:{Cu:58.0,Zn:39.0,Mn:2.0,Fe:1.0}, blurb:"Despite the name it's really a high-strength brass; used for ship propellers and heavy-duty gear blanks." };
ALLOYS.ALUMINUM_BRASS = { name:"Aluminum brass", category:"copper", elements:{Cu:76.0,Zn:22.0,Al:2.0}, blurb:"A small addition of aluminum dramatically improves this brass's resistance to corrosion in seawater condenser tubing." };
ALLOYS.TOMBAC = { name:"Tombac", category:"copper", elements:{Cu:85.0,Zn:15.0}, blurb:"A high-copper brass with a gold-like color, historically used for cheap jewelry and, notably, for the 1943 Belgian franc coin." };
ALLOYS.ARGENTIUM_SILVER = { name:"Argentium silver", category:"precious", elements:{Ag:93.5,Cu:5.5,Ge:1.0}, blurb:"A modern sterling-silver alternative with added germanium, formulated to resist the tarnishing that plagues ordinary sterling." };
ALLOYS.PALLADIUM_SILVER = { name:"Palladium-silver", category:"precious", elements:{Ag:70.0,Pd:30.0}, blurb:"A biocompatible alloy used in dental crowns and bridges, chosen for its stability and resistance to tarnish in the mouth." };
ALLOYS.NIOBIUM_TITANIUM = { name:"Niobium-titanium", category:"titanium", elements:{Nb:47.0,Ti:53.0}, blurb:"The standard superconducting wire alloy, wound into the powerful magnet coils inside MRI machines and particle accelerators." };
ALLOYS.BABBITT_LEAD = { name:"Lead-based babbitt", category:"low-melt", elements:{Pb:80.0,Sb:15.0,Sn:5.0}, blurb:"A cheaper, softer bearing alloy than tin-based babbitt, historically common in heavy industrial and railway machinery." };
