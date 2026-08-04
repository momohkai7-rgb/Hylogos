// MatAIme: exhaustive reference data — all 118 elements, 50+ molecules, and alloys.

const ELEMENTS = {
  H: { z:1, name:"Hydrogen", shells:[1], category:"nonmetal", mass:1.008, stableWeight:true, melt:-259, boil:-253, density:0.08988, densityUnit:"g/L", phase:"Gas", en:2.2, theoretical:false, blurb:"The simplest and most abundant element in the universe." },
  He: { z:2, name:"Helium", shells:[2], category:"noble-gas", mass:4.003, stableWeight:true, melt:-272, boil:-269, density:0.1786, densityUnit:"g/L", phase:"Gas", en:null, theoretical:false, blurb:"Second most abundant element; used in balloons." },
  Li: { z:3, name:"Lithium", shells:[2,1], category:"alkali", mass:6.94, stableWeight:true, melt:180, boil:1330, density:0.534, densityUnit:"g/cm³", phase:"Solid", en:0.98, theoretical:false, blurb:"Lightest metal; used in modern batteries." },
  Be: { z:4, name:"Beryllium", shells:[2,2], category:"alkaline-earth", mass:9.012, stableWeight:true, melt:1287, boil:2469, density:1.85, densityUnit:"g/cm³", phase:"Solid", en:1.57, theoretical:false, blurb:"A light, stiff, toxic metal used in aerospace." },
  B: { z:5, name:"Boron", shells:[2,3], category:"metalloid", mass:10.81, stableWeight:true, melt:2076, boil:3927, density:2.08, densityUnit:"g/cm³", phase:"Solid", en:2.04, theoretical:false, blurb:"Used in borosilicate glass (Pyrex)." },
  C: { z:6, name:"Carbon", shells:[2,4], category:"nonmetal", mass:12.011, stableWeight:true, melt:null, boil:null, density:2.267, densityUnit:"g/cm³", phase:"Solid", en:2.55, theoretical:false, blurb:"The backbone of life; forms diamond and graphite." },
  N: { z:7, name:"Nitrogen", shells:[2,5], category:"nonmetal", mass:14.007, stableWeight:true, melt:-210, boil:-196, density:1:[2,2], category:"alkaline-earth", mass:9.012, stableWeight:true, melt:1287, boil:2469, density:1.85, densityUnit:"g/cm³", phase:"Solid", en:1.57, theoretical:false, blurb:"A light, stiff, toxic metal used in aerospace parts." },
  B: { z:5, name:"Boron", shells:[2,3], category:"metalloid", mass:10.81, stableWeight:true, melt:2076, boil:3927, density:2.08, densityUnit:"g/cm³", phase:"Solid", en:2.04, theoretical:false, blurb:"Essential trace nutrient for plants; also used in Pyrex glass." },
  C: { z:6, name:"Carbon", shells:[2,4], category:"nonmetal", mass:12.011, stableWeight:true, melt:null, boil:null, density:2.267, densityUnit:"g/cm³", phase:"Solid", en:2.55, theoretical:false, blurb:"Backbone of all known life; forms diamond and graphite." },
  N: { z:7, name:"Nitrogen", shells:[2,5], category:"nonmetal", mass:14.007, stableWeight:true, melt:-210, boil:-196, density:1.251, densityUnit:"g/L", phase:"Gas", en:3.04, theoretical:false, blurb:"Makes up about 78% of the air; essential to amino acids." },
  O: { z:8, name:"Oxygen", shells:[2,6], category:"nonmetal", mass:15.999, stableWeight:true, melt:-219, boil:-183, density:1.429, densityUnit:"g/L", phase:"Gas", en:3.44, theoretical:false, blurb:"The element you're breathing; most abundant in Earth's crust." },
  F: { z:9, name:"Fluorine", shells:[2,7], category:"halogen", mass:18.998, stableWeight:true, melt:-220, boil:-188, density:1.696, densityUnit:"g/L", phase:"Gas", en:3.98, theoretical:false, blurb:"The most reactive nonmetal; used to strengthen tooth enamel." },
  Ne: { z:10, name:"Neon", shells:[2,8], category:"noble-gas", mass:20.18, stableWeight:true, melt:-249, boil:-246, density:0.9002, densityUnit:"g/L", phase:"Gas", en:null, theoretical:false, blurb:"Glows reddish-orange when electrified; used in neon signs." },
  Na: { z:11, name:"Sodium", shells:[2,8,1], category:"alkali", mass:22.99, stableWeight:true, melt:98, boil:883, density:0.968, densityUnit:"g/cm³", phase:"Solid", en:0.93, theoretical:false, blurb:"Explosively reactive metal; bonds with chlorine to form salt." },
  Mg: { z:12, name:"Magnesium", shells:[2,8,2], category:"alkaline-earth", mass:24.305, stableWeight:true, melt:650, boil:1090, density:1.738, densityUnit:"g/cm³", phase:"Solid", en:1.31, theoretical:false, blurb:"Burns with white light; center of every chlorophyll molecule." },
  Al: { z:13, name:"Aluminium", shells:[2,8,3], category:"post-metal", mass:26.982, stableWeight:true, melt:660, boil:2470, density:2.7, densityUnit:"g/cm³", phase:"Solid", en:1.61, theoretical:false, blurb:"Most abundant metal in Earth's crust; light and recyclable." },
  Si: { z:14, name:"Silicon", shells:[2,8,4], category:"metalloid", mass.251, densityUnit:"g/L", phase:"Gas", en:3.04, theoretical:28.085, stableWeight:true, melt:1414, boil:32:false, blurb:"Makes up about 78% of the air." },
  O: { z65, density:2.329, densityUnit:"g/cm³", phase:"Solid", en:8, name:"Oxygen", shells:[2,6], category:"nonmetal", mass:15.9:1.9, theoretical:false, blurb:"Second most abundant element in crust; the heart of computer chips." },
  P: {99, stableWeight:true, melt:-219, boil:-183, density:1.429, densityUnit:"g/L", phase:"Gas", en:3.44, theoretical:false, blurb:"The element you're breathing to stay alive." },
  F: { z:9, name:"Fluorine", shells:[2,7], category:"halogen", mass:18.998, stableWeight:true, melt:-220, boil:-188, density:1.696, densityUnit:"g/L", phase:"Gas", en:3.98, theoretical:false, blurb:"Most reactive nonmetal; used in toothpaste." },
  Ne: { z:10, name:"Neon", shells:[2,8], category:"noble-gas", mass:20.18, stableWeight:true, melt:-249, boil:-246, density:0.9002, densityUnit:"g/L", phase:"Gas", en z:15, name:"Phosphorus", shells:[2,8,5], category:"nonmetal", mass:30.974, stableWeight:true, melt:44, boil:281, density:1.823, densityUnit:"g/cm³", phase:"Solid", en:2.19, theoretical:false, blurb:"Essential to DNA and bones; white phosphorus glows in the dark." },
  S: { z:16, name:"Sulfur", shells:[2,8,6], category:"nonmetal", mass:32.06, stableWeight:true, melt:115, boil:445, density:2.07, densityUnit:"g/cm³", phase:"Solid", en:2.58, theoretical:false, blurb:"Known as 'brimstone'; gives rotten eggs:null, theoretical:false, blurb:"Glows reddish-orange when electrified." },
  Na: { z:11, name:"Sodium", shells:[2,8,1], category:"alkali", mass:22.99, stableWeight:true, melt:98, boil:883, density:0.968, densityUnit:"g/cm³", phase:"Solid", en:0.93, theoretical:false, blurb:"Reactive metal; bonds with chlorine for salt." },
  Mg: { z:12, name:"Magnesium", shells:[2,8,2], category:"alkaline-earth", mass:24.305, stableWeight:true, melt:650, boil:1090, density:1.738, densityUnit:"g/cm³", phase:"Solid", en:1.31, theoretical:false, blurb:"Burns with white light; center of chlorophyll." },
  Al: { z:13, name:"Aluminium", shells:[2,8,3], category:"post-metal", mass:26.982, stableWeight:true, melt:660, boil:2470, density:2.7, densityUnit:"g/cm³", phase:"Solid", en:1.61, theoretical:false, blurb:"Most abundant metal in Earth's crust." },
  Si: { z:14, name:"Silicon", shells:[2,8,4], category:"metalloid", mass:28.085, stableWeight:true, melt:1414, boil:3265, density:2.329, densityUnit:"g/cm³", phase:"Solid", en:1.9, their smell." },
  Cl: { z:17, name:"Chlorine", shells:[2,8,7], category:"halogen", mass:35.45, stableWeight:true, melt:-102, boil:-34, density:3.2, densityUnit:"g/L", phase:"Gas", en:3.16, theoretical:false, blurb:"Toxic green gas used to disinfect swimming pools." },
  Ar: { z:18, name:"Argon", shells:[2,8,8], category:"noble-gas", mass:39.948, stableWeight:true, melt:-189, boil:-186, density:1.784, densityUnit:"g/L", phase:"Gas", en:null, theoretical:false, blurb:"Makes up about 1% of the air; fills incandescent light bulbs." },
  K: { z:19, name:"Potassium", shells:[2,8,8,1], category:"alkali", mass:39.098, stableWeight:true, melt:64, boil:759, density:0.862, densityUnit:"g/cm³", phase:"Solid", en:0.82, theoretical:false, blurb:"Vital nutrient; reacts violently with water, floating and igniting." },
  Ca: { z:20, name:"Calcium", shells:[2,8,8,2], category:"alkaline-earth", mass:40.078, stableWeight:true, melt:842, boil:1484, density:1.55, densityUnit:"g/cm³", phase:"Solid", en:1, theoretical:false, blurb:"Most abundant metal in the body; found in bones and teeth." },
  Sc: { z:21, name:"Scandium", shells:[2,8,9,2], category:"transition", mass:44.956, stableWeight:true, melt:1541, boil:2836, density:2.985, densityUnit:"g/cm³", phase:"Solid", en:1.36, theoretical:false, blurb:"Used in high-intensity stadium theoretical:false, blurb:"Semiconductor at the heart of computer chips." },
  P: { z:15, name:"Phosphorus", shells:[2,8,5], category:"nonmetal", mass:30.974, stableWeight:true, melt:44, boil:281, density:1.823, densityUnit:"g/cm³", phase:"Solid", en:2.19, theoretical:false, blurb:"Essential to DNA and bones." },
  S: { z:16, name:"Sulfur", shells:[2,8,6], category:"nonmetal", mass:32.06, stableWeight:true, melt:115, boil:445, density:2.07, densityUnit:"g/cm³", phase:"Solid", en:2.58, theoretical:false, lighting and aerospace." },
  Ti: { z:22, name:"Titanium", shells:[2,8,10,2], category:"transition", mass:47.867, stableWeight:true, melt:1668, boil:3287, density:4.506, densityUnit:"g/cm³", phase:"Solid", en:1.54, theoretical:false, blurb:"Strong as steel but lighter; used in jets and implants." },
  V: { z:23, name:"Vanadium", shells:[2,8,11,2], category:"transition", mass:50.942, stableWeight:true, melt:1910, boil:3407, density:6, densityUnit:"g/cm blurb:"Yellow solid known as brimstone." },
  Cl: { z:17, name:"Chlorine", shells:[2,8,7], category:"halogen", mass:35.45, stableWeight:true, melt:-102, boil:-34, density:3.2, densityUnit:"g/L", phase:"Gas", en:3.16, theoretical:false, blurb:"Toxic green gas used to disinfect water." },
  Ar: { z:18, name:"Argon", shells:[2,8,8], category:"noble-gas", mass:39.948, stableWeight:true, melt:-189, boil:-186, density:1.784, densityUnit:"g/L", phase:"Gas", en:null, theoretical:false, blurb:"Makes up about 1% of the air." },
  K: { z:19, name:"Potassium", shells:[2,8,8,1], category:"alkali",³", phase:"Solid", en:1.63, theoretical:false, blurb:"Strengthens steel alloys; essential in trace amounts." },
  Cr: { z:24, name:"Chromium", shells:[2,8,13,1], category:"transition", mass:51.996, stableWeight:true, melt:1907, boil:2671, density:7.19, densityUnit:"g/cm³", phase:"Solid", en:1.66, theoretical:false, blurb:"Gives stainless steel its shine; source of ruby's red color." },
  Mn: { z:25, name:"Manganese", shells:[2,8,13,2], category:"transition", mass:54.938, stableWeight:true, melt:1246, boil:2061, density:7.21, densityUnit:"g/cm³", phase:"Solid", mass:39.098, stableWeight:true, melt:64, boil:759, density:0.862, densityUnit:"g/cm³", phase:"Solid", en:0.82, theoretical:false, blurb:"Vital nutrient for nerve function." },
  Ca: { z:20, name:"Calcium", shells:[2,8,8,2], category:"alkaline-earth en:1.55, theoretical:false, blurb:"Essential trace nutrient used to make wear-resistant steel." },
  Fe: { z:26, name:"Iron", shells:[2,8,14,2], category:"", mass:40.078, stableWeight:true, melt:842, boil:1484, density:1.55, densityUnit:"g/cm³", phase:"Solid", entransition", mass:55.845, stableWeight:true, melt:1538, boil:1, theoretical:false, blurb:"Most abundant metal in the body." },
  Sc: { z:2861, density:7.874, densityUnit:"g/cm³", phase:":21, name:"Scandium", shells:[2,8,9,2], category:"transition", mass:44.956, stableWeight:true, melt:1541, boil:2836, density:2.985, densityUnit:"g/cm³", phase:"Solid",Solid", en:1.83, theoretical:false, blurb:"Base element of steel; carries oxygen in your blood." },
  Co: { z:27, name:"Cobalt", shells:[2,8, en:1.36, theoretical:false, blurb:"Rare metal used in aerospace alloys." },
  15,2], category:"transition", mass:58.933, stableWeight:true, meltTi: { z:22, name:"Titanium", shells:[2,8,10,2],:1495, boil:2927, density:8.9, densityUnit:"g/cm³", phase:"Solid", category:"transition", mass:47.867, stableWeight:true, melt:1668 en:1.88, theoretical:false, blurb:"Used in rechargeable batteries and deep blue pigments." },
, boil:3287, density:4.506, densityUnit:"g/cm³",  Ni: { z:28, name:"Nickel", shells:[2,8,16,2], phase:"Solid", en:1.54, theoretical:false, blurb:"Strong as steel but much lighter." },
  V: { category:"transition", mass:58.693, stableWeight:true, melt:1455, boil:2730, density:8.908, densityUnit:"g/cm³", z:23, name:"Vanadium", shells:[2,8,11,2], category:"transition", phase:"Solid", en:1.91, theoretical:false, blurb:"Corrosion-resistant metal used mass:50.942, stableWeight:true, melt:1910, boil:3407, density:6, densityUnit:"g/cm³", phase:"Solid", en:1. in coins and plating." },
  Cu: { z:29, name:"Copper", shells:[2,8,1863, theoretical:false, blurb:"Strengthens steel alloys." },
  Cr: { z:,1], category:"transition", mass:63.546, stableWeight:true, melt:124, name:"Chromium", shells:[2,8,13,1], category:"transition", mass085, boil:2562, density:8.96, densityUnit:"g/cm:51.996, stableWeight:true, melt:1907, boil:26³", phase:"Solid", en:1.9, theoretical:false, blurb:"Excellent conductor used in electrical71, density:7.19, densityUnit:"g/cm³", phase:"Solid", en: wiring and plumbing." },
  Zn: { z:30, name:"Zinc", shells:[2,8,11.66, theoretical:false, blurb:"Gives stainless steel its shine." },
  Mn:8,2], category:"transition", mass:65.382, stableWeight:true, melt: { z:25, name:"Manganese", shells:[2,8,13,2], category:"transition",420, boil:907, density:7.14, densityUnit:"g/cm³ mass:54.938, stableWeight:true, melt:1246, boil:2", phase:"Solid", en:1.65, theoretical:false, blurb:"Coats steel to prevent061, density:7.21, densityUnit:"g/cm³", phase:"Solid", en rust; also an essential nutrient." },
  Ga: { z:31, name:"Gallium", shells:[2,8,18,3], category:"post-metal", mass:69.723:1.55, theoretical:false, blurb:"Essential nutrient for steel toughness." },
  Fe: { z, stableWeight:true, melt:30, boil:2400, density:5.91:26, name:"Iron", shells:[2,8,14,2], category:"transition", mass, densityUnit:"g/cm³", phase:"Solid", en:1.81, theoretical:false,:55.845, stableWeight:true, melt:1538, boil:28 blurb:"Melts in your hand; used in blue LEDs." },
  Ge: { z:32, name61, density:7.874, densityUnit:"g/cm³", phase:"Solid", en:1.83, theoretical:false, blurb:"The most common element on Earth." },
  Co: { z:27:"Germanium", shells:[2,8,18,4], category:"metalloid", mass:72.631, stableWeight:true, melt:938, boil:2833, density, name:"Cobalt", shells:[2,8,15,2], category:"transition", mass:58.933, stableWeight:true, melt:1495, boil:2927:5.323, densityUnit:"g/cm³", phase:"Solid", en:2.0, density:8.9, densityUnit:"g/cm³", phase:"Solid", en:1.81, theoretical:false, blurb:"A semiconductor that helped launch the transistor era." },
  As: { z:33, name:"Arsenic", shells:[2,8,18,5], category:"metalloid", mass8, theoretical:false, blurb:"Used in blue glass and batteries." },
  Ni: { z:28, name:"Nickel:74.922, stableWeight:true, melt:null, boil:615, density", shells:[2,8,16,2], category:"transition", mass:58.693:5.727, densityUnit:"g/cm³", phase:"Solid", en:2.1, stableWeight:true, melt:1455, boil:2730, density:8.8, theoretical:false, blurb:"Notoriously poisonous; used in wood preservatives." },
  Se:908, densityUnit:"g/cm³", phase:"Solid", en:1.91, theoretical { z:34, name:"Selenium", shells:[2,8,18,6], category:"non:false, blurb:"Used in coins and stainless steel." },
  Cu: { z:29, namemetal", mass:78.972, stableWeight:true, melt:221, boil::"Copper", shells:[2,8,18,1], category:"transition", mass:63.5685, density:4.81, densityUnit:"g/cm³", phase:"Solid", en46, stableWeight:true, melt:1085, boil:2562, density::2.55, theoretical:false, blurb:"Used in light-sensitive photocopiers and glass." },
  Br8.96, densityUnit:"g/cm³", phase:"Solid", en:1.9, theoretical: { z:35, name:"Bromine", shells:[2,8,18,7], category:"halogen", mass:7:false, blurb:"Excellent conductor of electricity." },
  Zn: { z:30, name:"Zinc9.904, stableWeight:true, melt:-7, boil:59, density:3.", shells:[2,8,18,2], category:"transition", mass:65.382, stableWeight:true, melt:420, boil:907, density:7.141028, densityUnit:"g/cm³", phase:"Liquid", en:2.96,, densityUnit:"g/cm³", phase:"Solid", en:1.65, theoretical:false, theoretical:false, blurb:"One of only two elements liquid at room temperature." },
  Kr: { z:36, name:"Krypton", shells:[2,8,18,8], category:"noble-gas", mass: blurb:"Coats steel to prevent rust." },
  Ga: { z:31, name:"Gall83.798, stableWeight:true, melt:-157, boil:-153, density:3.749ium", shells:[2,8,18,3], category:"post-metal", mass:69., densityUnit:"g/L", phase:"Gas", en:3, theoretical:false, blurb:"In723, stableWeight:true, melt:30, boil:2400, density:5.91, densityUnit:"g/cm³", phase:"Solid", en:1.81, theoreticalert gas used in high-speed flash lamps." },
  Rb: { z:37, name:"Rubidium", shells:[2,8:false, blurb:"Melts just below body temperature." },
  Ge: { z:32, name,18,8,1], category:"alkali", mass:85.468, stableWeight:"Germanium", shells:[2,8,18,4], category:"metalloid", mass:72:true, melt:39, boil:688, density:1.532, densityUnit.631, stableWeight:true, melt:938, boil:2833, density:"g/cm³", phase:"Solid", en:0.82, theoretical:false, blurb:":5.323, densityUnit:"g/cm³", phase:"Solid", en:2.01, theoretical:false, blurb:"A metalloid semiconductor." },
  As: { z:33Soft, highly reactive metal used in atomic clocks." },
  Sr: { z:38, name:"Strontium", shells:[2,, name:"Arsenic", shells:[2,8,18,5], category:"metalloid", mass8,18,8,2], category:"alkaline-earth", mass:87.621:74.922, stableWeight:true, melt:null, boil:615, density, stableWeight:true, melt:777, boil:1377, density:2.6:5.727, densityUnit:"g/cm³", phase:"Solid", en:2.14, densityUnit:"g/cm³", phase:"Solid", en:0.95, theoretical:false, blurb:"Turns fireworks brilliant red; similar to calcium." },
  Y: { z:39,8, theoretical:false, blurb:"Notoriously poisonous metalloid." },
  Se: { z:34, name:"Selenium name:"Yttrium", shells:[2,8,18,9,2], category:"transition", mass", shells:[2,8,18,6], category:"nonmetal", mass:78.97:88.906, stableWeight:true, melt:1526, boil:292, stableWeight:true, melt:221, boil:685, density:4.830, density:4.472, densityUnit:"g/cm³", phase:"Solid", en1, densityUnit:"g/cm³", phase:"Solid", en:2.55, theoretical:false:1.22, theoretical:false, blurb:"Used in LED phosphors and high-temp superconductors." },
  Zr: {, blurb:"Essential trace nutrient." },
  Br: { z:35, name:"Bromine", shells:[2,8,18,7], category:"halogen", mass:79.904, z:40, name:"Zirconium", shells:[2,8,18,10,2], category:"transition", mass:91.224, stableWeight:true, melt:1855 stableWeight:true, melt:-7, boil:59, density:3.1028, densityUnit:"g/cm³",, boil:4377, density:6.52, densityUnit:"g/cm³", phase phase:"Liquid", en:2.96, theoretical:false, blurb:"Dense, corrosive red liquid." },
  Kr: {:"Solid", en:1.33, theoretical:false, blurb:"Used in nuclear fuel rods; highly rust z:36, name:"Krypton", shells:[2,8,18,8], category:"nobleproof." },
  Nb: { z:41, name:"Niobium", shells:[2,8,1-gas", mass:83.798, stableWeight:true, melt:-157, boil8,12,1], category:"transition", mass:92.906, stableWeight:true:-153, density:3.749, densityUnit:"g/L", phase:"Gas",, melt:2477, boil:4744, density:8.57, densityUnit en:3, theoretical:false, blurb:"Noble gas used in flash bulbs." },
  Rb: {:"g/cm³", phase:"Solid", en:1.6, theoretical:false, blurb:"Used z:37, name:"Rubidium", shells:[2,8,18,8,1], category:" in superconducting magnets like those in MRIs." },
  Mo: { z:42, name:"Molybdenum", shells:[2,8,alkali", mass:85.468, stableWeight:true, melt:39, boil:688, density:118,13,1], category:"transition", mass:95.951, stableWeight:.532, densityUnit:"g/cm³", phase:"Solid", en:0.82,true, melt:2623, boil:4639, density:10.28, theoretical:false, blurb:"Highly reactive alkali metal." },
  Sr: { z:38, name densityUnit:"g/cm³", phase:"Solid", en:2.16, theoretical:false, bl:"Strontium", shells:[2,8,18,8,2], category:"alkaline-earth",urb:"Strengthens steel for high-temperature jets." },
  Tc: { z:43, name mass:87.621, stableWeight:true, melt:777, boil:13:"Technetium", shells:[2,8,18,13,2], category:"transition", mass77, density:2.64, densityUnit:"g/cm³", phase:"Solid", en::98, stableWeight:false, melt:2157, boil:4265, density0.95, theoretical:false, blurb:"Turns fireworks brilliant red." },
  Y: { z:11, densityUnit:"g/cm³", phase:"Solid", en:1.9, theoretical::39, name:"Yttrium", shells:[2,8,18,9,2], categoryfalse, blurb:"Lightest element with only radioactive isotopes." },
  Ru: { z:44,:"transition", mass:88.906, stableWeight:true, melt:1526, name:"Ruthenium", shells:[2,8,18,15,1], category:"transition", mass boil:2930, density:4.472, densityUnit:"g/cm³", phase:101.072, stableWeight:true, melt:2334, boil:4150, density:12.45, densityUnit:"g/cm³", phase:"Solid",:"Solid", en:1.22, theoretical:false, blurb:"Used in high-temp superconductors." },
  Zr: { en:2.2, theoretical:false, blurb:"Rare metal used to harden platinum for jewelry." },
  Rh: { z: z:40, name:"Zirconium", shells:[2,8,18,10,2],45, name:"Rhodium", shells:[2,8,18,16,1], category category:"transition", mass:91.224, stableWeight:true, melt:1855:"transition", mass:102.906, stableWeight:true, melt:1964, boil:4377, density:6.52, densityUnit:"g/cm³", phase, boil:3695, density:12.41, densityUnit:"g/cm³",:"Solid", en:1.33, theoretical:false, blurb:"Highly corrosion-resistant." },
 phase:"Solid", en:2.28, theoretical:false, blurb:"One of the rarest and most reflective metals  Nb: { z:41, name:"Niobium", shells:[2,8,18,12,1], category:"transition", mass:92.906, stableWeight:true, melt:." },
  Pd: { z:46, name:"Palladium", shells:[2,8,18,18], category:"transition", mass:106.421, stableWeight:true,2477, boil:4744, density:8.57, densityUnit:"g/ melt:1555, boil:2963, density:12.023, densitycm³", phase:"Solid", en:1.6, theoretical:false, blurb:"Superconducting MRI magnetsUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"." },
  Mo: { z:42, name:"Molybdenum", shells:[2,8,18,13,1], category:"transition", mass:95.951, stableWeight:trueAbsorbs hydrogen; vital for catalytic converters." },
  Ag: { z:47, name:"Silver",, melt:2623, boil:4639, density:10.28, density shells:[2,8,18,18,1], category:"transition", mass:107.868, stableWeightUnit:"g/cm³", phase:"Solid", en:2.16, theoretical:false, blurb:true, melt:962, boil:2162, density:10.49,:"Used in high-temp steel alloys." },
  Tc: { z:43, name:"Technetium", shells:[2, densityUnit:"g/cm³", phase:"Solid", en:1.93, theoretical:false, blurb:"The best thermal and electrical conductor." },
  Cd: { z:48, name:"Cadmium8,18,13,2], category:"transition", mass:98, stableWeight:false, melt:2157, boil:4265, density:11, densityUnit:"g/cm³", phase:"Solid",", shells:[2,8,18,18,2], category:"transition", mass:112.414, stable en:1.9, theoretical:false, blurb:"Radioactive medical imaging metal." },
  Ru:Weight:true, melt:321, boil:767, density:8.65, densityUnit:"g/cm³", phase:"Solid", en:1.69, theoretical:false, blurb { z:44, name:"Ruthenium", shells:[2,8,18,15,1], category:"transition", mass:101.072, stableWeight:true, melt:23:"Toxic heavy metal once common in batteries." },
  In: { z:49, name:"Indium", shells:[2,834, boil:4150, density:12.45, densityUnit:"g/cm,18,18,3], category:"post-metal", mass:114.818, stableWeight:true, melt:157, boil:2072, density:7.3³", phase:"Solid", en:2.2, theoretical:false, blurb:"Rare platinum-group metal." },
  Rh: { z:45, name:"Rhodium", shells:[2,8,18,16,1, densityUnit:"g/cm³", phase:"Solid", en:1.78, theoretical:false1], category:"transition", mass:102.906, stableWeight:true, melt:1, blurb:"Soft metal used for conductive touchscreen coatings." },
  Sn: { z:50, name:"Tin", shells:[964, boil:3695, density:12.41, densityUnit:"g/2,8,18,18,4], category:"post-metal", mass:118.cm³", phase:"Solid", en:2.28, theoretical:false, blurb:"Rarest and711, stableWeight:true, melt:232, boil:2602, density: most reflective metal." },
  Pd: { z:46, name:"Palladium", shells:[2,7.365, densityUnit:"g/cm³", phase:"Solid", en:1.968,18,18], category:"transition", mass:106.421, stableWeight, theoretical:false, blurb:"Found in bronze; used to coat food cans." },
  Sb: {:true, melt:1555, boil:2963, density:12.02 z:51, name:"Antimony", shells:[2,8,18,18,5], category:"metalloid", mass:3, densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false,121.76, stableWeight:true, melt:631, boil:1635 blurb:"Absorbs massive amounts of hydrogen." },
  Ag: { z:47, name:"Silver", shells:[2,8, density:6.697, densityUnit:"g/cm³", phase:"Solid", en:2,18,18,1], category:"transition", mass:107.868, stableWeight:true, melt:962, boil:2162, density:10.49.05, theoretical:false, blurb:"Used since antiquity as cosmetic; now a fire retardant." },
  Te:, densityUnit:"g/cm³", phase:"Solid", en:1.93, theoretical:false, { z:52, name:"Tellurium", shells:[2,8,18,18,6 blurb:"The best electrical conductor." },
  Cd: { z:48, name:"Cadmium", shells:[2,], category:"metalloid", mass:127.603, stableWeight:true, melt:48,18,18,2], category:"transition", mass:112.414,50, boil:988, density:6.24, densityUnit:"g/cm³", stableWeight:true, melt:321, boil:767, density:8.65, phase:"Solid", en:2.1, theoretical:false, blurb:"Rare metalloid used in solar panels densityUnit:"g/cm³", phase:"Solid", en:1.69, theoretical:false, bl and steel." },
  I: { z:53, name:"Iodine", shells:[2,urb:"Toxic metal used in pigments." },
  In: { z:49, name:"Indium", shells:[2,8,18,18,18,7], category:"halogen", mass:126.904, stableWeight:true, melt:114, boil:184, density:4.9338,18,3], category:"post-metal", mass:114.818, stableWeight:true, melt:, densityUnit:"g/cm³", phase:"Solid", en:2.66, theoretical:false,157, boil:2072, density:7.31, densityUnit:"g/cm blurb:"Essential for thyroid health; used as antiseptic." },
  Xe: { z:54, name:"Xenon³", phase:"Solid", en:1.78, theoretical:false, blurb:"Used in touchscreen coatings." },
  Sn: { z:50, name:"Tin", shells:[2,8,18", shells:[2,8,18,18,8], category:"noble-gas", mass:131.294, stableWeight:true, melt:-112, boil:-108, density:5.8,18,4], category:"post-metal", mass:118.711, stableWeight:true, melt:94, densityUnit:"g/L", phase:"Gas", en:2.6, theoretical:false,232, boil:2602, density:7.365, densityUnit:"g/cm³", phase:"Solid", en:1.96, theoretical:false, blurb:"Part of bronze blurb:"Used in strobe lights and ion-thrusters." },
  Cs: { z:55, name:"Cesium", shells:[2,8,18,18,8,1], category:"alkali", and pewter alloys." },
  Sb: { z:51, name:"Antimony", shells:[2,8,1 mass:132.905, stableWeight:true, melt:29, boil:678,18,5], category:"metalloid", mass:121.76, stableWeight:true, melt:631, density:1.93, densityUnit:"g/cm³", phase:"Solid", en:01, boil:1635, density:6.697, densityUnit:"g/cm³", phase:"Solid.79, theoretical:false, blurb:"Most reactive stable metal; its transition defines the second." },
  Ba: { z:56, name:"Barium", shells:[2,8,18,1", en:2.05, theoretical:false, blurb:"Used as a flame retardant." },
  8,8,2], category:"alkaline-earth", mass:137.328, stableTe: { z:52, name:"Tellurium", shells:[2,8,18,18Weight:true, melt:727, boil:1845, density:3.51,,6], category:"metalloid", mass:127.603, stableWeight:true, melt densityUnit:"g/cm³", phase:"Solid", en:0.89, theoretical:false, bl:450, boil:988, density:6.24, densityUnit:"g/cm³", phase:"Solid", en:2.1, theoretical:false, blurb:"Rare metalloid used inurb:"Opaque to X-rays; used in barium meals." },
  La: { z:57, name:"Lanthanum", shells:[2,8,18,18,9,2], category:"lanthanide steel." },
  I: { z:53, name:"Iodine", shells:[2,8", mass:138.905, stableWeight:true, melt:920, boil:,18,18,7], category:"halogen", mass:126.904, stable3464, density:6.162, densityUnit:"g/cm³", phase:"SolidWeight:true, melt:114, boil:184, density:4.933, densityUnit:"g/cm³", phase:"Solid", en:2.66, theoretical:false, bl", en:1.1, theoretical:false, blurb:"First of the rare-earth lanthanide series." },
  Ce: { z:58, name:"Cerium", shells:[2,8,18,19,9urb:"Essential for thyroid health." },
  Xe: { z:54, name:"Xenon", shells:[2,8,,2], category:"lanthanide", mass:140.116, stableWeight:true,18,18,8], category:"noble-gas", mass:131.294, stableWeight:true, melt:- melt:795, boil:3443, density:6.77, densityUnit:"g112, boil:-108, density:5.894, densityUnit:"g/L/cm³", phase:"Solid", en:1.12, theoretical:false, blurb:"Most abundant", phase:"Gas", en:2.6, theoretical:false, blurb:"Used in ion-thruster propellants." },
   rare-earth metal." },
  Pr: { z:59, name:"Praseodymium", shells:[2,8,1Cs: { z:55, name:"Cesium", shells:[2,8,18,188,21,8,2], category:"lanthanide", mass:140.908,8,1], category:"alkali", mass:132.905, stableWeight:true, stableWeight:true, melt:935, boil:3130, density:6.77, densityUnit:"g/cm³", phase:"Solid", en:1.13, theoretical:false, melt:29, boil:671, density:1.93, densityUnit:"g/cm³", phase:"Solid", en:0.79, theoretical:false, blurb:"Most reactive stable, blurb:"Used to color glass yellow-green." },
  Nd: { z:60, name:"Neodymium", metal." },
  Ba: { z:56, name:"Barium", shells:[2,8,1 shells:[2,8,18,22,8,2], category:"lanthanide", mass:144.242, stableWeight:true, melt:1024, boil:308,18,8,2], category:"alkaline-earth", mass:137.3274, density:7.01, densityUnit:"g/cm³", phase:"Solid", en:8, stableWeight:true, melt:727, boil:1845, density:3.51, densityUnit:"g/cm³", phase:"Solid", en:0.89, theoretical:1.14, theoretical:false, blurb:"Behind today's strongest permanent magnets." },
  Pm: { z:61, name:"Promethium", shells:[2,8,18,23,8,2], category:"false, blurb:"Used in digestive medical scans." },
  La: { z:57, name:"Lanthanlanthanide", mass:145, stableWeight:false, melt:1042, boil:3000, density:um", shells:[2,8,18,18,9,2], category:"lanthanide", mass:138.97.26, densityUnit:"g/cm³", phase:"Solid", en:1.13,05, stableWeight:true, melt:920, boil:3464, density:6 theoretical:false, blurb:"Only radioactive lanthanide." },
  Sm: { z:62, name:"Samarium",.162, densityUnit:"g/cm³", phase:"Solid", en:1.1, theoretical shells:[2,8,18,24,8,2], category:"lanthanide", mass::false, blurb:"Namesake of the lanthanide series." },
  Ce: { z:58,150.362, stableWeight:true, melt:1072, boil:19 name:"Cerium", shells:[2,8,18,19,9,2], category:"lan00, density:7.52, densityUnit:"g/cm³", phase:"Solid", en:thanide", mass:140.116, stableWeight:true, melt:795,1.17, theoretical:false, blurb:"Used in high-temperature magnets." },
  Eu: { z boil:3443, density:6.77, densityUnit:"g/cm³", phase:":63, name:"Europium", shells:[2,8,18,25,8,Solid", en:1.12, theoretical:false, blurb:"Most abundant rare-earth metal." },2], category:"lanthanide", mass:151.964, stableWeight:true, melt
  Pr: { z:59, name:"Praseodymium", shells:[2,8,18:826, boil:1529, density:5.264, densityUnit:"g,21,8,2], category:"lanthanide", mass:140.908,/cm³", phase:"Solid", en:1.2, theoretical:false, blurb:"Provides red screen stableWeight:true, melt:935, boil:3130, density:6.77 phosphors." },
  Gd: { z:64, name:"Gadolinium", shells:[2,8, densityUnit:"g/cm³", phase:"Solid", en:1.13, theoretical:false,,18,25,9,2], category:"lanthanide", mass:157.2 blurb:"Used in strong permanent magnets." },
  Nd: { z:60, name:"Neodymium", shells:[253, stableWeight:true, melt:1312, boil:3000, density:,8,18,22,8,2], category:"lanthanide", mass:1447.9, densityUnit:"g/cm³", phase:"Solid", en:1.2, theoretical:.242, stableWeight:true, melt:1024, boil:3074,false, blurb:"Magnetic; contrast agent for MRI." },
  Tb: { z:65, name density:7.01, densityUnit:"g/cm³", phase:"Solid", en:1.1:"Terbium", shells:[2,8,18,27,8,2], category:"lanthanide", mass:158.925, stableWeight:true, melt:13564, theoretical:false, blurb:"Powerhouse behind modern magnets." },
  Pm: { z:61, name:"Prom, boil:3123, density:8.23, densityUnit:"g/cm³", phaseethium", shells:[2,8,18,23,8,2], category:"lanthanide:"Solid", en:1.1, theoretical:false, blurb:"Used in green display phosphors." },", mass:145, stableWeight:false, melt:1042, boil:300
  Dy: { z:66, name:"Dysprosium", shells:[2,8,180, density:7.26, densityUnit:"g/cm³", phase:"Solid", en:1,28,8,2], category:"lanthanide", mass:162.5, stableWeight.13, theoretical:false, blurb:"Only radioactive lanthanide." },
  Sm: { z::true, melt:1407, boil:2567, density:8.54,62, name:"Samarium", shells:[2,8,18,24,8,2], densityUnit:"g/cm³", phase:"Solid", en:1.22, theoretical:false, bl category:"lanthanide", mass:150.362, stableWeight:true, melt:1urb:"Added to magnets to handle high temps." },
  Ho: { z:67, name:"Holmium", shells072, boil:1900, density:7.52, densityUnit:"g/cm:[2,8,18,29,8,2], category:"lanthanide", mass:1³", phase:"Solid", en:1.17, theoretical:false, blurb:"Used in high-64.93, stableWeight:true, melt:1461, boil:2600temp magnets." },
  Eu: { z:63, name:"Europium", shells:[2,8,, density:8.79, densityUnit:"g/cm³", phase:"Solid", en:1.18,25,8,2], category:"lanthanide", mass:151.9623, theoretical:false, blurb:"Highest magnetic strength of any element." },
  Er: { z4, stableWeight:true, melt:826, boil:1529, density:5.:68, name:"Erbium", shells:[2,8,18,30,8,264, densityUnit:"g/cm³", phase:"Solid", en:1.2, theoretical:2], category:"lanthanide", mass:167.259, stableWeight:true, meltfalse, blurb:"Provides red screen phosphors." },
  Gd: { z:64, name:":1529, boil:2868, density:9.066, densityUnit:"g/cm³", phase:"Gadolinium", shells:[2,8,18,25,9,2], category:"lanthanideSolid", en:1.24, theoretical:false, blurb:"Used in fiber-optic amplifiers." },
  Tm: { z", mass:157.253, stableWeight:true, melt:1312, boil:69, name:"Thulium", shells:[2,8,18,31,8,:3000, density:7.9, densityUnit:"g/cm³", phase:"Solid",2], category:"lanthanide", mass:168.934, stableWeight:true, melt en:1.2, theoretical:false, blurb:"MRI contrast agent metal." },
  Tb: { z:1545, boil:1950, density:9.32, densityUnit:"g:65, name:"Terbium", shells:[2,8,18,27,8,/cm³", phase:"Solid", en:1.25, theoretical:false, blurb:"Rare metal2], category:"lanthanide", mass:158.925, stableWeight:true, melt used in portable X-ray devices." },
  Yb: { z:70, name:"Ytterbium", shells:[2,8:1356, boil:3123, density:8.23, densityUnit:"g,18,32,8,2], category:"lanthanide", mass:173.0/cm³", phase:"Solid", en:1.1, theoretical:false, blurb:"Used in green45, stableWeight:true, melt:824, boil:1196, density:6 display phosphors." },
  Dy: { z:66, name:"Dysprosium", shells:[2.9, densityUnit:"g/cm³", phase:"Solid", en:1.1, theoretical:false,8,18,28,8,2], category:"lanthanide", mass:162, blurb:"Used in atomic clocks and stress sensors." },
  Lu: { z:71, name.5, stableWeight:true, melt:1407, boil:2567, density::"Lutetium", shells:[2,8,18,32,9,2], category:"lan8.54, densityUnit:"g/cm³", phase:"Solid", en:1.22,thanide", mass:174.967, stableWeight:true, melt:1652 theoretical:false, blurb:"Used in high-heat magnets." },
  Ho: { z:67, name:"Holmium, boil:3402, density:9.841, densityUnit:"g/cm³",", shells:[2,8,18,29,8,2], category:"lanthanide", mass phase:"Solid", en:1.27, theoretical:false, blurb:"The last lanthanide element." },
  Hf: { z:164.93, stableWeight:true, melt:1461, boil:26:72, name:"Hafnium", shells:[2,8,18,32,100, density:8.79, densityUnit:"g/cm³", phase:"Solid", en:0,2], category:"transition", mass:178.492, stableWeight:true, melt1.23, theoretical:false, blurb:"Highest magnetic strength metal." },
  Er: { z:2233, boil:4603, density:13.31, densityUnit:":68, name:"Erbium", shells:[2,8,18,30,8,g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Used in2], category:"lanthanide", mass:167.259, stableWeight:true, melt nuclear control rods." },
  Ta: { z:73, name:"Tantalum", shells:[2:1529, boil:2868, density:9.066, densityUnit:",8,18,32,11,2], category:"transition", mass:180.g/cm³", phase:"Solid", en:1.24, theoretical:false, blurb:"Used948, stableWeight:true, melt:3017, boil:5458, density in fiber-optic cables." },
  Tm: { z:69, name:"Thulium", shells:[2,8,:16.69, densityUnit:"g/cm³", phase:"Solid", en:1.518,31,8,2], category:"lanthanide", mass:168.93, theoretical:false, blurb:"Used in tiny phone capacitors." },
  W: { z:74, name:"T4, stableWeight:true, melt:1545, boil:1950, density:9ungsten", shells:[2,8,18,32,12,2], category:"transition",.32, densityUnit:"g/cm³", phase:"Solid", en:1.25, theoretical mass:183.841, stableWeight:true, melt:3422, boil:5930, density::false, blurb:"Used in portable X-ray devices." },
  Yb: { z:70, name:"Ytter19.25, densityUnit:"g/cm³", phase:"Solid", en:2.36bium", shells:[2,8,18,32,8,2], category:"lanthanide, theoretical:false, blurb:"Highest melting point of any metal." },
  Re: { z:75, name:"", mass:173.045, stableWeight:true, melt:824, boil:Rhenium", shells:[2,8,18,32,13,2], category:"transition",1196, density:6.9, densityUnit:"g/cm³", phase:"Solid", en mass:186.207, stableWeight:true, melt:3186, boil::1.1, theoretical:false, blurb:"Used in high-accuracy atomic clocks." },
  Lu: { z:71,5596, density:21.02, densityUnit:"g/cm³", phase:"Solid name:"Lutetium", shells:[2,8,18,32,9,2], category:"", en:1.9, theoretical:false, blurb:"Used in jet engine turbine blades." },
  lanthanide", mass:174.967, stableWeight:true, melt:165Os: { z:76, name:"Osmium", shells:[2,8,18,322, boil:3402, density:9.841, densityUnit:"g/cm³,14,2], category:"transition", mass:190.233, stableWeight:true", phase:"Solid", en:1.27, theoretical:false, blurb:"Densest and hardest lanthan, melt:3033, boil:5012, density:22.59, densityide." },
  Hf: { z:72, name:"Hafnium", shells:[2,Unit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"8,18,32,10,2], category:"transition", mass:178.4The densest naturally occurring element." },
  Ir: { z:77, name:"Iridium", shells92, stableWeight:true, melt:2233, boil:4603, density::[2,8,18,32,15,2], category:"transition", mass:1913.31, densityUnit:"g/cm³", phase:"Solid", en:1.3,2.217, stableWeight:true, melt:2446, boil:4130 theoretical:false, blurb:"Used in nuclear control rods." },
  Ta: { z:73, name:"Tantalum", shells:[2,8,18,32,11,2], category:"transition", mass:180.948, stableWeight:true, melt:3017, boil:5458, density:16.69, densityUnit:"g/cm³", phase:"Solid, density:22.56, densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"Most corrosion-resistant metal known." },
  Pt: { z:78, name:"Platinum", shells:[2,8,18,32,17,1], category:"transition", mass:195.085, stableWeight:true, melt:17", en:1.5, theoretical:false, blurb:"Corrosion-resistant; used in phone capacitors." },
  W: { z:74, name:"Tungsten", shells:[2,8,18,32,12,2], category:"transition", mass:183.841,68, boil:3825, density:21.45, densityUnit:"g/cm³", phase:"Solid", en:2.28, theoretical:false, blurb:"Precious industrial and jewelry catalyst." },
  Au: { z:79, name:"Gold", shells:[2,8, stableWeight:true, melt:3422, boil:5930, density:19.25, densityUnit:"g/cm³", phase:"Solid", en:2.36, theoretical:18,32,18,1], category:"transition", mass:196.967, stableWeight:true, melt:1064, boil:2970, density:19.3, densityUnit:"gfalse, blurb:"Highest melting point of all metals." },
  Re: { z:75, name/cm³", phase:"Solid", en:2.54, theoretical:false, blurb:"Precious:"Rhenium", shells:[2,8,18,32,13,2], category:"transition metal that never tarnishes." },
  Hg: { z:80, name:"Mercury", shells:[2", mass:186.207, stableWeight:true, melt:3186, boil,8,18,32,18,2], category:"transition", mass:200.:5596, density:21.02, densityUnit:"g/cm³", phase:"Solid", en:1.9, theoretical:false, blurb:"Used in jet engine turbine blades." },
592, stableWeight:true, melt:-39, boil:357, density:13.534, densityUnit  Os: { z:76, name:"Osmium", shells:[2,8,18,3:"g/cm³", phase:"Liquid", en:2, theoretical:false, blurb:"Only liquid metal2,14,2], category:"transition", mass:190.233, stableWeight: at room temp." },
  Tl: { z:81, name:"Thallium", shells:[2true, melt:3033, boil:5012, density:22.59,,8,18,32,18,3], category:"post-metal", mass:204.38, stable densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurbWeight:true, melt:304, boil:1473, density:11.85:"Densest naturally occurring element." },
  Ir: { z:77, name:"Iridium", shells, densityUnit:"g/cm³", phase:"Solid", en:1.62, theoretical:false,:[2,8,18,32,15,2], category:"transition", mass:19 blurb:"Highly toxic metal historically used as poison." },
  Pb: { z:82, name:"Lead", shells:[2.217, stableWeight:true, melt:2446, boil:41302,8,18,32,18,4], category:"post-metal", mass:2, density:22.56, densityUnit:"g/cm³", phase:"Solid", en:207.21, stableWeight:true, melt:327, boil:1749,.2, theoretical:false, blurb:"Most corrosion-resistant metal." },
  Pt: { z: density:11.34, densityUnit:"g/cm³", phase:"Solid", en:1.78, name:"Platinum", shells:[2,8,18,32,17,1],87, theoretical:false, blurb:"Dense metal used in radiation shielding." },
  Bi: { z category:"transition", mass:195.085, stableWeight:true, melt:176:83, name:"Bismuth", shells:[2,8,18,32,18,8, boil:3825, density:21.45, densityUnit:"g/cm³5], category:"post-metal", mass:208.98, stableWeight:true, melt:", phase:"Solid", en:2.28, theoretical:false, blurb:"Precious metal catalyst and272, boil:1564, density:9.78, densityUnit:"g/cm jewelry." },
  Au: { z:79, name:"Gold", shells:[2,8,1³", phase:"Solid", en:2.02, theoretical:false, blurb:"Forms rainbow-colored8,32,18,1], category:"transition", mass:196.967, crystals." },
  Po: { z:84, name:"Polonium", shells:[2,8, stableWeight:true, melt:1064, boil:2970, density:19.18,32,18,6], category:"post-metal", mass:209, stable3, densityUnit:"g/cm³", phase:"Solid", en:2.54, theoretical:falseWeight:false, melt:254, boil:962, density:9.196,, blurb:"Precious noble metal that never tarnishes." },
  Hg: { z:80, name:"Mercury", shells:[2 densityUnit:"g/cm³", phase:"Solid", en:2, theoretical:false, blurb:"Ext,8,18,32,18,2], category:"transition", mass:200.remely radioactive metal." },
  At: { z:85, name:"Astatine", shells:[2,8,18,32,18,7], category:"halogen", mass:210,592, stableWeight:true, melt:-39, boil:357, density:13.534, densityUnit stableWeight:false, melt:302, boil:337, density:6.35,:"g/cm³", phase:"Liquid", en:2, theoretical:false, blurb:"Only liquid metal densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb at room temperature." },
  Tl: { z:81, name:"Thallium", shells:[2:"Rarest natural element on Earth." },
  Rn: { z:86, name:"Radon",,8,18,32,18,3], category:"post-metal", mass:204.38, stableWeight:true, melt:304, boil:1473, density shells:[2,8,18,32,18,8], category:"noble-gas", mass:222, stableWeight:11.85, densityUnit:"g/cm³", phase:"Solid", en:1.6:false, melt:-71, boil:-62, density:9.73, densityUnit:"g2, theoretical:false, blurb:"Highly toxic metal once used as poison." },
  Pb: { z/L", phase:"Gas", en:2.2, theoretical:false, blurb:"Radioactive gas from:82, name:"Lead", shells:[2,8,18,32,18,4 rocks; causes lung cancer." },
  Fr: { z:87, name:"Francium", shells:[2,], category:"post-metal", mass:207.21, stableWeight:true, melt:38,18,32,18,8,1], category:"alkali", mass:2227, boil:1749, density:11.34, densityUnit:"g/cm3, stableWeight:false, melt:27, boil:677, density:1.87³", phase:"Solid", en:1.87, theoretical:false, blurb:"Dense metal used in, densityUnit:"g/cm³", phase:"Solid", en:0.79, theoretical:false, radiation shielding." },
  Bi: { z:83, name:"Bismuth", shells:[2,8 blurb:"Highly unstable and extremely rare alkali metal." },
  Ra: { z:88, name:"Radium", shells:[2,18,32,18,5], category:"post-metal", mass:208.98, stableWeight:true, melt:272, boil:1564, density:9,8,18,32,18,8,2], category:"alkaline-earth", mass:226, stable.78, densityUnit:"g/cm³", phase:"Solid", en:2.02, theoreticalWeight:false, melt:960, boil:1737, density:5.5, densityUnit:"g/cm³", phase:"Solid", en:0.9, theoretical:false, blurb:":false, blurb:"Rainbow oxide crystals; used in medicine." },
  Po: { z:84, name:"Used for glow-in-the-dark watch dials." },
  Ac: { z:89, namePolonium", shells:[2,8,18,32,18,6], category:"post-:"Actinium", shells:[2,8,18,32,18,9,2], categorymetal", mass:209, stableWeight:false, melt:254, boil:962:"actinide", mass:227, stableWeight:false, melt:1227, boil:, density:9.196, densityUnit:"g/cm³", phase:"Solid", en:23227, density:10, densityUnit:"g/cm³", phase:"Solid", en:, theoretical:false, blurb:"Extremely radioactive metal." },
  At: { z:85,1.1, theoretical:false, blurb:"Glows blue in the dark from radioactivity." },
  Th: { z:90, name:"Thorium", shells:[2,8,18,32 name:"Astatine", shells:[2,8,18,32,18,7], category:"halogen", mass:2,18,10,2], category:"actinide", mass:232.038,10, stableWeight:false, melt:302, boil:337, density:6. stableWeight:true, melt:1750, boil:4788, density:11.35, densityUnit:"g/cm³", phase:"Solid", en:2.2, theoretical:false, blurb:"Rarest natural element on Earth." },
  Rn: { z:86, name:"724, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:Radon", shells:[2,8,18,32,18,8], category:"noble-false, blurb:"Safer nuclear fuel for next-gen reactors." },
  Pa: { z:91,gas", mass:222, stableWeight:false, melt:-71, boil:-62, density name:"Protactinium", shells:[2,8,18,32,20,9,2:9.73, densityUnit:"g/L", phase:"Gas", en:2.2, theoretical], category:"actinide", mass:231.036, stableWeight:true, melt:1:false, blurb:"Radioactive noble gas from soil." },
  Fr: { z:87, name568, boil:4027, density:15.37, densityUnit:"g/:"Francium", shells:[2,8,18,32,18,8,1], categorycm³", phase:"Solid", en:1.5, theoretical:false, blurb:"Rare and expensive radioactive:"alkali", mass:223, stableWeight:false, melt:27, boil:67 metal." },
  U: { z:92, name:"Uranium", shells:[2,87, density:1.87, densityUnit:"g/cm³", phase:"Solid", en:0,18,32,21,9,2], category:"actinide", mass:238.79, theoretical:false, blurb:"Extremely unstable alkali metal." },
  Ra: { z:88, name:".029, stableWeight:true, melt:1132, boil:4131,Radium", shells:[2,8,18,32,18,8,2], category:" density:19.1, densityUnit:"g/cm³", phase:"Solid", en:1.3alkaline-earth", mass:226, stableWeight:false, melt:960, boil:8, theoretical:false, blurb:"Heaviest natural element used for power." },
  Np: {1737, density:5.5, densityUnit:"g/cm³", phase:"Solid", en z:93, name:"Neptunium", shells:[2,8,18,32,22,9,2], category:"actinide", mass:237, stableWeight:false, melt:0.9, theoretical:false, blurb:"Famous early radioactive dial paint." },
  Ac: {:639, boil:4174, density:20.45, densityUnit:"g z:89, name:"Actinium", shells:[2,8,18,32,18,/cm³", phase:"Solid", en:1.36, theoretical:false, blurb:"First synthetic9,2], category:"actinide", mass:227, stableWeight:false, melt:12 transuranic element." },
  Pu: { z:94, name:"Plutonium", shells:[27, boil:3227, density:10, densityUnit:"g/cm³", phase2,8,18,32,24,8,2], category:"actinide", mass::"Solid", en:1.1, theoretical:false, blurb:"Glows blue in the dark from244, stableWeight:false, melt:639, boil:3232, density: radiation." },
  Th: { z:90, name:"Thorium", shells:[2,8,119.816, densityUnit:"g/cm³", phase:"Solid", en:1.28,32,18,10,2], category:"actinide", mass:232.8, theoretical:false, blurb:"Powers some deep-space probes." },
  Am: { z:038, stableWeight:true, melt:1750, boil:4788, density95, name:"Americium", shells:[2,8,18,32,25,:11.724, densityUnit:"g/cm³", phase:"Solid", en:1.8,2], category:"actinide", mass:243, stableWeight:false, melt:113, theoretical:false, blurb:"Potential future nuclear fuel source." },
  Pa: { z:91, name:"Protactin76, boil:2607, density:12, densityUnit:"g/cm³", phaseium", shells:[2,8,18,32,20,9,2], category:"actin:"Solid", en:1.13, theoretical:false, blurb:"Found in household smoke detectors." },
  Cm:ide", mass:231.036, stableWeight:true, melt:1568, { z:96, name:"Curium", shells:[2,8,18,32,2 boil:4027, density:15.37, densityUnit:"g/cm³", phase5,9,2], category:"actinide", mass:247, stableWeight:false, melt::"Solid", en:1.5, theoretical:false, blurb:"Rare and expensive radioactive metal." },
  U1340, boil:3110, density:13.51, densityUnit:"g: { z:92, name:"Uranium", shells:[2,8,18,32/cm³", phase:"Solid", en:1.28, theoretical:false, blurb:"Named after,21,9,2], category:"actinide", mass:238.029, stable Marie and Pierre Curie." },
  Bk: { z:97, name:"Berkelium", shells:[Weight:true, melt:1132, boil:4131, density:19.12,8,18,32,27,8,2], category:"actinide", mass:, densityUnit:"g/cm³", phase:"Solid", en:1.38, theoretical:false,247, stableWeight:false, melt:986, boil:2627, density: blurb:"Primary fuel for nuclear energy." },
  Np: { z:93, name:"Nept14.78, densityUnit:"g/cm³", phase:"Solid", en:1.3,unium", shells:[2,8,18,32,22,9,2], category:" theoretical:false, blurb:"Radioactive metal made at Berkeley." },
  Cf: { z:98actinide", mass:237, stableWeight:false, melt:639, boil:41, name:"Californium", shells:[2,8,18,32,28,8,74, density:20.45, densityUnit:"g/cm³", phase:"Solid", en2], category:"actinide", mass:251, stableWeight:false, melt:900,:1.36, theoretical:false, blurb:"First synthetic transuranic element." },
  Pu boil:1470, density:15.1, densityUnit:"g/cm³", phase:": { z:94, name:"Plutonium", shells:[2,8,18,32Solid", en:1.3, theoretical:false, blurb:"Strong portable neutron source." },
  Es:,24,8,2], category:"actinide", mass:244, stableWeight:false, { z:99, name:"Einsteinium", shells:[2,8,18,32,2 melt:639, boil:3232, density:19.816, densityUnit:"g/cm³", phase:"Solid", en:1.28, theoretical:false, blurb:"9,8,2], category:"actinide", mass:252, stableWeight:false, melt:860, boil:996, density:8.84, densityUnit:"g/cm³Used in space probe power sources." },
  Am: { z:95, name:"Americium", shells:[2", phase:"Solid", en:1.3, theoretical:false, blurb:"Named after Albert Einstein." },,8,18,32,25,8,2], category:"actinide", mass:2
  Fm: { z:100, name:"Fermium", shells:[2,8,43, stableWeight:false, melt:1176, boil:2607, density:18,32,30,8,2], category:"actinide", mass:257,12, densityUnit:"g/cm³", phase:"Solid", en:1.13, theoretical: stableWeight:false, melt:1527, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Heaviest element made by bombardment." },
  Md: { z:101, name:"Mendelevium", shells:[2,8,false, blurb:"Element inside most smoke detectors." },
  Cm: { z:96, name:"Curium", shells:[2,8,18,32,25,9,2], category:"actinide", mass:2418,32,31,8,2], category:"actinide", mass:258,7, stableWeight:false, melt:1340, boil:3110, density:13.51, densityUnit:"g/cm³", phase:"Solid", en:1.28, stableWeight:false, melt:827, boil:null, density:null, densityUnit:"g/ theoretical:false, blurb:"Named after Marie and Pierre Curie." },
  Bk: { z:97cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Named after Dmitri Mende, name:"Berkelium", shells:[2,8,18,32,27,8,leev." },
  No: { z:102, name:"Nobelium", shells:[22], category:"actinide", mass:247, stableWeight:false, melt:986, boil:2627, density:14.78, densityUnit:"g/cm³", phase,8,18,32,32,8,2], category:"actinide", mass:259, stableWeight:false, melt:827, boil:null, density:null, densityUnit:"Solid", en:1.3, theoretical:false, blurb:"Synthesized at UC Berkeley." },
  Cf: { z:98, name:"Californium", shells:[2,8,18,:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Named after Alfred Nobel." },
  Lr: { z:103, name:"Lawrencium", shells:[32,28,8,2], category:"actinide", mass:251, stableWeight:2,8,18,32,32,8,3], category:"actinide", mass:false, melt:900, boil:1470, density:15.1, densityUnit266, stableWeight:false, melt:1627, boil:null, density:null,:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Strong densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb neutron source metal." },
  Es: { z:99, name:"Einsteinium", shells:[2,8,18,32,29,8,2], category:"actinide", mass:252, stable:"Final member of the actinide series." },
  Rf: { z:104, name:"Rutherfordium",Weight:false, melt:860, boil:996, density:8.84, density shells:[2,8,18,32,32,10,2], category:"transition",Unit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:" mass:267, stableWeight:false, melt:2127, boil:5527Found in hydrogen bomb test debris." },
  Fm: { z:100, name:"Fermium, density:23.2, densityUnit:"g/cm³", phase:"Solid", en:null,", shells:[2,8,18,32,30,8,2], category:"actinide theoretical:true, blurb:"First of the superheavy elements." },
  Db: { z:10", mass:257, stableWeight:false, melt:1527, boil:null, density5, name:"Dubnium", shells:[2,8,18,32,32,1:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false1,2], category:"transition", mass:268, stableWeight:false, melt:null, boil:null, density:29.3, densityUnit:"g/cm³", phase:"Solid", en:, blurb:"Heaviest element made by bombardment." },
  Md: { z:101, name:"Mendelevium", shells:[2,8,18,32,31,8,2null, theoretical:true, blurb:"Named after Dubna, Russia." },
  Sg: { z:], category:"actinide", mass:258, stableWeight:false, melt:827, boil106, name:"Seaborgium", shells:[2,8,18,32,3:null, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.32,12,2], category:"transition", mass:269, stableWeight:false, melt:, theoretical:false, blurb:"Named after Dmitri Mendeleev." },
  No: { z:1null, boil:null, density:35, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true,02, name:"Nobelium", shells:[2,8,18,32,32, blurb:"Named after Glenn Seaborg." },
  Bh: { z:107, name:"B8,2], category:"actinide", mass:259, stableWeight:false, melt:82ohrium", shells:[2,8,18,32,32,13,2], category7, boil:null, density:null, densityUnit:"g/cm³", phase:"Solid", en::"transition", mass:270, stableWeight:false, melt:null, boil:null, density:37.1, densityUnit1.3, theoretical:false, blurb:"Named after Alfred Nobel." },
  Lr: { z:103, name:"Lawrencium", shells:[2,8,18,32,32,8,3], category:":"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after physicistactinide", mass:266, stableWeight:false, melt:1627, boil:null Niels Bohr." },
  Hs: { z:108, name:"Hassium", shells:[2,8,18,32,32,14,2], category:"transition", mass:26, density:null, densityUnit:"g/cm³", phase:"Solid", en:1.3, theoretical:false, blurb:"Final9, stableWeight:false, melt:-147, boil:null, density:40.7, member of the actinide series." },
  Rf: { z:104, name:"Rutherfordium", densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named shells:[2,8,18,32,32,10,2], category:"transition", mass:267, stableWeight:false, melt:2127, boil:5527 after Hesse, Germany." },
  Mt: { z:109, name:"Meitnerium", shells:[2,8,18,32,32,15,2], category:"transition",, density:23.2, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Ernest Rutherford." },
  Db: { z:105, mass:278, stableWeight:false, melt:null, boil:null, density:37.4, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb name:"Dubnium", shells:[2,8,18,32,32,11,2], category:"transition",:"Named after Lise Meitner." },
  Ds: { z:110, name:"D mass:268, stableWeight:false, melt:null, boil:null, density:29.armstadtium", shells:[2,8,18,32,32,16,2],3, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Dubna, Russia." },
  Sg: { z:106, name:"Seab category:"transition", mass:281, stableWeight:false, melt:null, boil:null, densityorgium", shells:[2,8,18,32,32,12,2], category:34.8, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Darmstadt, Germany." },
  Rg: { z:111, name:"transition", mass:269, stableWeight:false, melt:null, boil:null, density:35, densityUnit:"g:"Roentgenium", shells:[2,8,18,32,32,17,2/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Glenn T. Seaborg." },
  Bh], category:"transition", mass:282, stableWeight:false, melt:null, boil:null,: { z:107, name:"Bohrium", shells:[2,8,18,3 density:28.7, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after discovery of X-rays." },
  Cn: { z:1122,32,13,2], category:"transition", mass:270, stableWeight:false, melt:null, boil, name:"Copernicium", shells:[2,8,18,32,32,1:null, density:37.1, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after physicist Niels Bohr." },
  Hs: { z:108, name8,2], category:"transition", mass:285, stableWeight:false, melt:null, boil:"Hassium", shells:[2,8,18,32,32,14,2],:3297, density:14.0, densityUnit:"g/cm³", phase:"Liquid", en:null, theoretical:true, blurb:"Named after Copernicus." },
  Nh: { z:113, name:"Nihonium", shells:[2,8,18,32,32,18,3], category category:"transition", mass:269, stableWeight:false, melt:-147, boil:null:"transition", mass:286, stableWeight:false, melt:427, boil:11, density:407, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Hesse, Germany." },
  Mt: { z:109, name:"Meitnerium",57, density:16, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:" shells:[2,8,18,32,32,15,2], category:"transition",First discovered in Asia (Japan)." },
  Fl: { z:114, name:"Flerov mass:278, stableWeight:false, melt:null, boil:null, density:37.ium", shells:[2,8,18,32,32,18,4], category:"4, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurbpost-metal", mass:289, stableWeight:false, melt:67, boil:14:"Named after physicist Lise Meitner." },
  Ds: { z:110, name:"Darmstadtium7, density:14, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Synthetic", shells:[2,8,18,32,32,16,2], category:"transition element made in Russia." },
  Mc: { z:115, name:"Moscovium",", mass:281, stableWeight:false, melt:null, boil:null, density:34.8, densityUnit:"g shells:[2,8,18,32,32,18,5], category:"post-metal", mass:289, stableWeight:false, melt:397, boil:112/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after Darmstadt, Germany." },
  Rg: { z:111, name:"Roentgenium", shells:[2,87, density:13.5, densityUnit:"g/cm³", phase:"Solid", en:null,18,32,32,17,2], category:"transition", mass:282, theoretical:true, blurb:"Named after the Moscow region." },
  Lv: { z:116, name:"Livermorium", shells:[2,8,18,32,32,1, stableWeight:false, melt:null, boil:null, density:28.7, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after discovery of X-rays." },
  8,6], category:"post-metal", mass:293, stableWeight:false, melt:4Cn: { z:112, name:"Copernicium", shells:[2,8,1836, boil:812, density:12.9, densityUnit:"g/cm³",,32,32,18,2], category:"transition", mass:285, stableWeight phase:"Solid", en:null, theoretical:true, blurb:"Named after Livermore Laboratory." },
  Ts:false, melt:null, boil:3297, density:14.0, densityUnit:": { z:117, name:"Tennessine", shells:[2,8,18,3g/cm³", phase:"Liquid", en:null, theoretical:true, blurb:"Named after Nicolaus Copernicus." },
  Nh:2,32,18,7], category:"halogen", mass:294, stableWeight:false, melt:450 { z:113, name:"Nihonium", shells:[2,8,18,32, boil:610, density:7.17, densityUnit:"g/cm³", phase:",32,18,3], category:"transition", mass:286, stableWeight:false, melt:427Solid", en:null, theoretical:true, blurb:"Named after the state of Tennessee." },
  Og: { z:118, name:"Oganesson", shells:[2,8,18,3, boil:1157, density:16, densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"First discovered in Asia (Japan)." },
  Fl:2,32,18,8], category:"noble-gas", mass:294, stableWeight { z:114, name:"Flerovium", shells:[2,8,18,3:false, melt:null, boil:77, density:4.95, densityUnit:"g/2,32,18,4], category:"post-metal", mass:289, stableWeight:false, melt:6cm³", phase:"Solid", en:null, theoretical:true, blurb:"The final element of the Periodic7, boil:147, density:14, densityUnit:"g/cm³", phase:"Solid Table." },
};

// FULL COLOR DICTIONARY (STRINGS TO FIX BLACK SPHERES)
const", en:null, theoretical:true, blurb:"Synthetic element made in Russia." },
  Mc: { z:115 ATOM_COLOR = {
  // Noble Gases (Green)
  He: "#00ff7f", Ne: "#00ff, name:"Moscovium", shells:[2,8,18,32,32,17f", Ar: "#00ff7f", Kr: "#00ff7f", Xe: "#00ff7f", Rn: "#00ff7f", Og: "#00ff7f",8,5], category:"post-metal", mass:289, stableWeight:false, melt:397, boil:1127, density:13.5, densityUnit:"g/cm³
  // Transition Metals (Sky Blue)
  Sc: "#7fd9ff", Ti: "#7fd", phase:"Solid", en:null, theoretical:true, blurb:"Named after the Moscow region." },
9ff", V: "#7fd9ff", Cr: "#7fd9ff", Mn: "#7fd  Lv: { z:116, name:"Livermorium", shells:[2,8,189ff", Fe: "#7fd9ff", Co: "#7fd9ff",
  Ni: "#,32,32,18,6], category:"post-metal", mass:293,7fd9ff", Cu: "#7fd9ff", Zn: "#7fd9ff", Y: "# stableWeight:false, melt:436, boil:812, density:12.9,7fd9ff", Zr: "#7fd9ff", Nb: "#7fd9ff", Mo: "# densityUnit:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named7fd9ff",
  Tc: "#7fd9ff", Ru: "#7fd9ff", Rh: "#7fd9ff", after Livermore Laboratory." },
  Ts: { z:117, name:"Tennessine", shells:[ Pd: "#7fd9ff", Ag: "#7fd9ff", Cd: "#7fd9ff",2,8,18,32,32,18,7], category:"halogen", mass:294, stableWeight Hf: "#7fd9ff",
  Ta: "#7fd9ff", W: "#7fd:false, melt:450, boil:610, density:7.17, densityUnit9ff", Re: "#7fd9ff", Os: "#7fd9ff", Ir: "#7fd:"g/cm³", phase:"Solid", en:null, theoretical:true, blurb:"Named after the9ff", Pt: "#7fd9ff", Au: "#7fd9ff",
  Hg: "# state of Tennessee." },
  Og: { z:118, name:"Oganesson", shells:[7fd9ff", Rf: "#7fd9ff", Db: "#7fd9ff", Sg:2,8,18,32,32,18,8], category:"noble-gas", mass:294, "#7fd9ff", Bh: "#7fd9ff", Hs: "#7fd9ff", Mt: stableWeight:false, melt:null, boil:77, density:4.95, densityUnit:"g/cm³", phase:" "#7fd9ff",
  Ds: "#7fd9ff", Rg: "#7fd9ff",Solid", en:null, theoretical:true, blurb:"The final element of the Periodic Table." },
}; Cn: "#7fd9ff", Nh: "#7fd9ff",
  // Nonmetals (Standard)
  H: "#f2f0ea", C: "#666666", N: "#3b6fd9", O

// HARDCODED COLOR LIST FOR EVERY ELEMENT SYMBOL
// This ensures no atom ever defaults to black.
const ATOM_COLOR = {
  // Noble Gases (Neon Green)
  He: 0x00FF7F, Ne: "#e0483e", P: "#ff8000", S: "#e8c: 0x00FF7F, Ar: 0x00FF7F, Kr: 93a", Se: "#c9c3e0",
  // Alkali Metals (Orange)
  Li: "#ffb0x00FF7F, Xe: 0x00FF7F, Rn: 0x454", Na: "#ffb454", K: "#ffb454", Rb:00FF7F, Og: 0x00FF7F,
  // Transition Metals (Sky Blue)
   "#ffb454", Cs: "#ffb454", Fr: "#ffb454Sc: 0x7FD9FF, Ti: 0x7FD9FF, V: 0",
  // Alkaline Earth (Yellowish)
  Be: "#ffcf8a", Mg: "#ffx7FD9FF, Cr: 0x7FD9FF, Mn: 0x7FD9cf8a", Ca: "#ffcf8a", Sr: "#ffcf8a", Ba: "#ffFF, Fe: 0x7FD9FF, Co: 0x7FD9FF,
  cf8a", Ra: "#ffcf8a",
  // Halogens (Pink)
  F:Ni: 0x7FD9FF, Cu: 0x7FD9FF, Zn: 0 "#ff6fae", Cl: "#ff6fae", Br: "#ff6fae", I:x7FD9FF, Y: 0x7FD9FF, Zr: 0x7FD9 "#ff6fae", At: "#ff6fae", Ts: "#ff6fae",
  FF, Nb: 0x7FD9FF, Mo: 0x7FD9FF,
  // Metalloids (Teal)
  B: "#5ce1c9", Si: "#5ce1Tc: 0x7FD9FF, Ru: 0x7FD9FF, Rh: 0c9", Ge: "#5ce1c9", As: "#5ce1c9", Sb: "#x7FD9FF, Pd: 0x7FD9FF, Ag: 0x7FD95ce1c9", Te: "#5ce1c9", Po: "#5ce1c9",FF, Cd: 0x7FD9FF, Hf: 0x7FD9FF,

  // Post-Transition (Lavender)
  Al: "#b39ddb", Ga: "#b  Ta: 0x7FD9FF, W: 0x7FD9FF, Re: 39ddb", In: "#b39ddb", Sn: "#b39ddb", T0x7FD9FF, Os: 0x7FD9FF, Ir: 0x7FDl: "#b39ddb", Pb: "#b39ddb", Bi: "#b399FF, Pt: 0x7FD9FF, Au: 0x7FD9FF,
ddb",
  Fl: "#b39ddb", Mc: "#b39ddb", Lv  Hg: 0x7FD9FF, Rf: 0x7FD9FF, Db: 0x7FD9FF, Sg: 0x7FD9FF, Bh: 0x7: "#b39ddb",
  // Lanthanides & Actinides
  La: "#e8c93aFD9FF, Hs: 0x7FD9FF, Mt: 0x7FD9FF,", Ce: "#e8c93a", Pr: "#e8c93a", Nd: "#
  Ds: 0x7FD9FF, Rg: 0x7FD9FF, Cn:e8c93a", Pm: "#e8c93a", Sm: "#e8c9 0x7FD9FF, Nh: 0x7FD9FF,
  // Nonmetals (Standard Purple/Greys)3a", Eu: "#e8c93a",
  Gd: "#e8c93a", Tb: "#e8c93a", Dy: "#e8c93a", Ho: "#
  H: 0xF2F0EA, C: 0xC9C3E0, N:e8c93a", Er: "#e8c93a", Tm: "#e8c9 0x3B6FD9, O: 0xE0483E, P: 03a", Yb: "#e8c93a",
  Lu: "#e8c93xFF8000, S: 0xE8C93A, Se: 0xC9Ca", Ac: "#ff7043", Th: "#ff7043", Pa: "#ff7043", U3E0,
  // Alkali Metals (Orange)
  Li: 0xFFB454,: "#ff7043", Np: "#ff7043", Pu: "#ff70 Na: 0xFFB454, K: 0xFFB454, Rb: 0xFFB454, Cs: 0xFFB454, Fr: 0xFFB454,
  // Alkaline43",
  Am: "#ff7043", Cm: "#ff7043", Bk Earth (Yellowish)
  Be: 0xFFCF8A, Mg: 0xFFCF8A: "#ff7043", Cf: "#ff7043", Es: "#ff704, Ca: 0xFFCF8A, Sr: 0xFFCF8A, Ba: 0xFF3", Fm: "#ff7043", Md: "#ff7043",
  No:CF8A, Ra: 0xFFCF8A,
  // Halogens (Pink)
  F: 0xFF6FAE, Cl: 0xFF6FAE, Br: 0xFF6FAE, I: 0xFF6FAE, "#ff7043", Lr: "#ff7043",
  default: "#aaaaaa"
};

const ATOM_RADIUS = { H: 0.35, C: 0. At: 0xFF6FAE, Ts: 0xFF6FAE,
  // Metalloids (Teal5, default: 0.6 };

const CATEGORY_META = {
  "nonmetal":        { label: ")
  B: 0x5CE1C9, Si: 0x5CE1C9, Ge: 0x5CE1C9, As: 0x5CE1C9, SbNonmetal",               color: "#c9c3e0" },
  "noble-gas":        {: 0x5CE1C9, Te: 0x5CE1C9, Po:  label: "Noble Gas",              color: "#00ff7f" },
  "alkali":           0x5CE1C9,
  // Post-Transition (Lavender)
  Al: 0xB{ label: "Alkali Metal",           color: "#ffb454" },
  "alkaline39DDB, Ga: 0xB39DDB, In: 0xB39DDB, Sn:-earth":   { label: "Alkaline Earth Metal",   color: "#ffcf8a" }, 0xB39DDB, Tl: 0xB39DDB, Pb: 0xB
  "metalloid":        { label: "Metalloid",              color: "#5ce1c9"39DDB, Bi: 0xB39DDB,
  Fl: 0xB39 },
  "halogen":          { label: "Halogen",                color: "#ff6fae" },DDB, Mc: 0xB39DDB, Lv: 0xB39DDB,
  // Lanthanides & Actinides
  La: 0xE8C93A, Ce: 
  "post-metal":       { label: "Post-transition Metal",  color: "#b390xE8C93A, Pr: 0xE8C93A, Nd: 0xEddb" },
  "transition":       { label: "Transition Metal",       color: "#7fd9ff" },
  "lanthanide":       { label: "Lanthanide",             color: "#e8c93a" },
  "actinide":         { label: "Actinide",                color8C93A, Pm: 0xE8C93A, Sm: 0xE8C93A, Eu: 0xE8C93A,
  Gd: 0xE8C93A, Tb: 0xE8C93A, Dy: 0xE8C93: "#ff7043" },
};

const MOLECULE_BLURBS = {
  A, Ho: 0xE8C93A, Er: 0xE8C93A,H2O: "Water: Essential for life.", CO2: "Carbon Dioxide: Greenhouse gas.",
  CH Tm: 0xE8C93A, Yb: 0xE8C93A,
4: "Methane: Natural gas.", NH3: "Ammonia: Fertilizer.",
  O2: "Oxygen: Respiration.", N  Lu: 0xE8C93A, Ac: 0xFF7043, Th:2: "Nitrogen: 78% of air.",
  NACL: "Salt: Electrolyte.", 0xFF7043, Pa: 0xFF7043, U: 0xFF7 CO: "Carbon Monoxide: Poison.",
  HCL: "Hydrochloric Acid.", HF: "Hydrogen Fluoride.",
  O3:043, Np: 0xFF7043, Pu: 0xFF7043 "Ozone.", H2S: "Hydrogen Sulfide.",
  SO2: "Sulfur Dioxide.", NO,
  Am: 0xFF7043, Cm: 0xFF7043, Bk: 0xFF7043, Cf: 0xFF7043, Es: 0xFF2: "Nitrogen Dioxide.",
  N2O: "Laughing Gas.", SO3: "Sulfur Trioxide.",
  H2O2: "Hydrogen Peroxide.", C2H2: "Acetylene.",7043, Fm: 0xFF7043, Md: 0xFF7043
  C2H4: "Ethylene.", C2H6: "Ethane.",
  C3,
  No: 0xFF7043, Lr: 0xFF7043,H8: "Propane.", CH3OH: "Methanol.",
  C2H5OH: "
  default: 0xCCCCCC
};

const ATOM_RADIUS = { H: 0.35Ethanol.", CH3COOH: "Acetic Acid.",
  C6H6: "Benzene.", MGO, C: 0.5, default: 0.6 };

const MOLECULES = {
  H2O: { name: "Magnesium Oxide.",
  KCL: "Potassium Chloride.", CAO: "Quicklime.",
: "Water", formula: "H₂O", atoms: [{ el: "O", pos: [0, 0, 0] }, { el: "H", pos: [0.76, 0.  C6H12O6: "Glucose.", C8H10N4O2: "C59, 0] }, { el: "H", pos: [-0.76, 0.affeine.",
  NAHCO3: "Baking Soda.", CACO3: "Limestone.",
  C59, 0] }], bonds: [[0,1],[0,2]] },
  CO2:3H6O: "Acetone.", H2SO4: "Sulfuric Acid.",
  HNO3: { name: "Carbon dioxide", formula: "CO₂", atoms: [{ el: "C", pos: [ "Nitric Acid.", H3PO4: "Phosphoric Acid.",
  CHCL3: "Chloroform0,0,0] }, { el: "O", pos: [1.16,0,0.", SIO2: "Silica Sand.",
  C9H8O4: "Aspirin.", AGCL: "Silver Chloride.",
  MGCL2: "Magnesium Chloride.", KMNO4: "Potassium Permanganate."] }, { el: "O", pos: [-1.16,0,0] }], bonds: [[0,1],[0,2]] },
  CH4: { name: "Methane", formula: "
};

const MOLECULES = {
  H2O: { name: "Water", formula: "CH₄", atoms: [{ el: "C", pos: [0,0,0] }, { el:H₂O", atoms: [{ el: "O", pos: [0, 0, 0] }, { el: "H", pos "H", pos: [0.63,0.63,0.63] }, { el: "H", pos: [-0.63,-0.63,0.63] }, { el: "H",: [0.76, 0.59, 0] }, { el: "H", pos: [-0.76, 0.59, 0] }], bonds: [[0,1],[ pos: [-0.63,0.63,-0.63] }, { el: "H0,2]] },
  CO2: { name: "Carbon dioxide", formula: "CO₂", atoms", pos: [0.63,-0.63,-0.63] }], bonds: [[0: [{ el: "C", pos: [0,0,0] }, { el: "O", pos,1],[0,2],[0,3],[0,4]] },
  NH3: { name:: [1.16,0,0] }, { el: "O", pos: [-1.1 "Ammonia", formula: "NH₃", atoms: [{ el: "N", pos: [0,0.2,0] }, { el: "H", pos: [0.94,-0.3,0] }, { el: "H", pos: [-0.47,-0.3,0.86,0,0] }], bonds: [[0,1],[0,2]] },
  CH4: { name: "Methane", formula: "CH₄", atoms: [{ el: "C", pos: [2] }], bonds: [[0,1],[0,2]] },
  O2: { name: "Oxygen gas", formula: "O₂", atoms: [{ el: "O", pos: [0.6,0,0,0] }, { el: "H", pos: [0.6,0.6,0.6] }, { el: "H", pos: [-0.6,-0.6,0.6] }, { el:0,0] }, { el: "O", pos: [-0.6,0,0] }], bonds "H", pos: [-0.6,0.6,-0.6] }, { el: "H", pos: [0.: [[0,1]] },
  N2: { name: "Nitrogen gas", formula: "N₂", atoms: [{ el6,-0.6,-0.6] }], bonds: [[0,1],[0,2],[0,: "N", pos: [0.55,0,0] }, { el: "N", pos3],[0,4]] },
  NH3: { name: "Ammonia", formula: "NH₃: [-0.55,0,0] }], bonds: [[0,1]] },
  NACL", atoms: [{ el: "N", pos: [0,0.2,0] }, { el:: { name: "Sodium chloride", formula: "NaCl", atoms: [{ el: "Na", pos: [0.7,0,0] }, { el: "Cl", pos: [-0.7,0,0] }], bonds: [[0,1]] },
  CO: { name: "Carbon monoxide", formula: "CO", atoms: [{ el: "C", pos: [0.5,0,0] }, { "H", pos: [0.94,-0.3,0] }, { el: "H", pos: [-0.47,-0.3,0.82] }], bonds: [[0,1],[0,2]] },
  NACL: { name: "Sodium chloride", formula: "NaCl", atoms el: "O", pos: [-0.5,0,0] }], bonds: [[0,1]] },
  HCL: { name: "Hydrogen chloride", formula: "HCl", atoms: [{ el: ": [{ el: "Na", pos: [0.7,0,0] }, { el: "Cl", pos: [-0.7,0,0] }], bonds: [[0,1]] },
  CH", pos: [0.6,0,0] }, { el: "Cl", pos: [-0.6,0,0] }], bonds: [[0,1]] },
  HF: { name: "6H6: { name: "Benzene", formula: "C₆H₆", atoms: [{ el: "C", pos: [1.4,0,0] }, { el: "C", pos: [0.7,1.2,0] }, { el: "C", pos: [-0.7,Hydrogen fluoride", formula: "HF", atoms: [{ el: "H", pos: [0.4,01.2,0] }, { el: "C", pos: [-1.4,0,0] }, { el: "C", pos: [-0.7,-1.2,0] }, { el:,0] }, { el: "F", pos: [-0.4,0,0] }], bonds: [[0,1]] },
  O3: { name: "Ozone", formula: "O₃", atoms: [{ el: "O", pos: [0,0,0] }, { el: "O", "C", pos: [0.7,-1.2,0] }], bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
  SIO2: { name: "Silicon dioxide", formula: "SiO₂", atoms: [{ el: "Si", pos: [0,0,0] }, { el: "O", pos: [1.5,0 pos: [1.1,0.6,0] }, { el: "O", pos: [-1.1,0.6,0] }], bonds: [[0,1],[0,2]] },
  H2S: { name: "Hydrogen sulfide", formula: "H₂S", atoms: [{ el: "S", pos: [0,0,0] }, { el: "H", pos: [0.9,0] }, { el: "O", pos: [-1.5,0,0] }], bonds:,0.9,0] }, { el: "H", pos: [-0.9,0.9,0] }], bonds: [[0,1],[0,2]] },
  SO2: { name: [[0,1],[0,2]] },
};

// ALLOYS WITH DEFINED ATOMS
const ALLOYS = { "Sulfur dioxide", formula: "SO₂", atoms: [{ el: "S", pos: [0,0,0] }, { el: "O", pos: [1.2,0.7,0]
  STEEL: { 
    name: "Steel", composition: "Iron + Carbon", category: " }, { el: "O", pos: [-1.2,0.7,0] }], bonds: [[Ferrous Alloy", blurb: "A strong alloy of Iron and Carbon.",
    atoms: [{ el: "Fe", pos: [0,0,0] }, { el: "Fe", pos: [1.2,0,0] }, {0,1],[0,2]] },
  NO2: { name: "Nitrogen dioxide", formula: el: "Fe", pos: [0,1.2,0] }, { el: "C", pos "NO₂", atoms: [{ el: "N", pos: [0,0,0] }, { el: "O", pos: [1.1,0.4,0] }, { el: "O",: [0.6,0.6,0] }], bonds: [[0,3],[1,3],[2 pos: [-1.1,0.4,0] }], bonds: [[0,1],[0,2,3]]
  },
  BRASS: { 
    name: "Brass", composition: "Copper]] },
  N2O: { name: "Nitrous oxide", formula: "N₂O", atoms + Zinc", category: "Copper Alloy", blurb: "Copper-Zinc alloy used in musical instruments.",
    : [{ el: "N", pos: [0,0,0] }, { el: "N", posatoms: [{ el: "Cu", pos: [0,0,0] }, { el: "Zn",: [1.1,0,0] }, { el: "O", pos: [-1.2, pos: [1.2,0,0] }, { el: "Cu", pos: [0,10,0] }], bonds: [[0,1],[0,2]] },
  SO3: { name: "Sulfur.2,0] }], bonds: [[0,1],[0,2]]
  },
  BRON trioxide", formula: "SO₃", atoms: [{ el: "S", pos: [0,0,ZE: { 
    name: "Bronze", composition: "Copper + Tin", category: "Copper Alloy",0] }, { el: "O", pos: [0,1.4,0] }, { el: blurb: "Ancient alloy of Copper and Tin.",
    atoms: [{ el: "Cu", pos: [0,0,0] "O", pos: [-1.2,-0.7,0] }, { el: "O", pos }, { el: "Sn", pos: [1.2,0,0] }, { el: "Cu: [1.2,-0.7,0] }], bonds: [[0,1],[0,2],[", pos: [-1.2,0,0] }], bonds: [[0,1],[0,2]]0,3]] },
  H2O2: { name: "Hydrogen peroxide", formula: "H₂O₂", atoms: [{ el: "O", pos: [0.7,0,0] }, {
  },
  STAINLESS_STEEL: { 
    name: "Stainless Steel", composition: " el: "O", pos: [-0.7,0,0] }, { el: "H", posIron + Chromium + Nickel", category: "Ferrous Alloy",
    atoms: [{ el: "Fe", pos: [0.8,0.6,0.6] }, { el: "H", pos: [-0.8,0.: [0,0,0] }, { el: "Cr", pos: [1.4,0,0] }, { el6,-0.6] }], bonds: [[0,1],[0,2],[1,3]] },
  C2H2:: "Ni", pos: [0,1.4,0] }], bonds: [[0,1],[0 { name: "Acetylene", formula: "C₂H₂", atoms: [{ el: "C", pos,2]]
  },
  STERLING_SILVER: { 
    name: "Sterling Silver", composition: "Silver + Copper", category: "Silver Alloy",
    atoms: [{ el: "Ag", pos: [0.6,0,0] }, { el: "C", pos: [-0.6,: [0,0,0] }, { el: "Cu", pos: [1.2,0,0,0] }, { el: "H", pos: [1.6,0,0] }, { el: "H", pos: [-1.6,0,0] }], bonds: [[0,1],[0,2],[1,3]] },
  C2H4: { name: "Ethylene", formula0] }], bonds: [[0,1]]
  },
  GOLD_14K: { 
: "C₂H₄", atoms: [{ el: "C", pos: [0.7,0,    name: "14k Gold", composition: "Gold + Silver + Copper", category: "Gold Alloy",0] }, { el: "C", pos: [-0.7,0,0] }, { el: "H", pos: [1.2,0.9,0] }, { el: "H", pos
    atoms: [{ el: "Au", pos: [0,0,0] }, { el: ": [1.2,-0.9,0] }, { el: "H", pos: [-1.Ag", pos: [1.2,0,0] }, { el: "Cu", pos: [-1.2,0,0] }], bonds: [[0,1],[0,2]]
  },
  2,0.9,0] }, { el: "H", pos: [-1.2,-0.9,0] }], bonds: [[0,1],[0,2],[0,3],[1,4],[NITINOL: { name: "Nitinol", composition: "Nickel + Titanium", category: "Shape-Memory Alloy", atoms: [{el:"Ni", pos:[0,0,0]},{el:"Ti", pos:[1,0,01,5]] },
  C3H8: { name: "Propane", formula: "C₃]}], bonds:[[0,1]], blurb: "Remembers its shape when heated." },
  MAGNALIUMH₈", atoms: [{ el: "C", pos: [0,0,0] }, { el: "C", pos: [1.2,0,0] }, { el: "C", pos: [-1.2,0,0] }], bonds: [[0,1],[0,2]] },
: { name: "Magnalium", composition: "Aluminium + Magnesium", category: "Lightweight Alloy",  CH3OH: { name: "Methanol", formula: "CH₃OH", atoms: [{ el: "C", pos: [0,0,0] }, { el: "O", pos: [1. atoms: [{el:"Al", pos:[0,0,0]},{el:"Mg", pos:[1,1,0,0] }, { el: "H", pos: [-0.6,0.6,0,0]}], bonds:[[0,1]], blurb: "Used in aircraft parts." },
  DURALUMIN:0.6] }, { el: "H", pos: [-0.6,-0.6,0.6] }, { el: { name: "Duralumin", composition: "Aluminium + Copper", category: "Lightweight Alloy", atoms "H", pos: [-0.6,0,-0.6] }], bonds: [[0,1],[: [{el:"Al", pos:[0,0,0]},{el:"Cu", pos:[1,00,2],[0,3],[0,4]] },
  C2H5OH: { name: "Ethanol", formula: ",0]}], bonds:[[0,1]], blurb: "One of the earliest aluminum alloys." },
  PEWTERC₂H₅OH", atoms: [{ el: "C", pos: [0.7,0,0: { name: "Pewter", composition: "Tin + Antimony", category: "Tin Alloy", atoms] }, { el: "C", pos: [-0.7,0,0] }, { el: ": [{el:"Sn", pos:[0,0,0]},{el:"Sb", pos:[1,0O", pos: [1.5,0.5,0] }], bonds: [[0,1],[0,2]] },
  C6H6: { name: "Benzene", formula: "C₆H₆", atoms: [{ el:,0]}], bonds:[[0,1]], blurb: "Decorative objects." }
};

function resolve "C", pos: [1.4,0,0] }, { el: "C", pos: [Query(raw) {
  const q = raw.trim();
  if (!q) return null;
0.7,1.2,0] }, { el: "C", pos: [-0.7,  const key = q.toUpperCase().replace(/\s+/g, "");
  
  if (MOLECULES1.2,0] }, { el: "C", pos: [-1.4,0,0][key]) return { type: "molecule", key, data: MOLECULES[key] };
  const }, { el: "C", pos: [-0.7,-1.2,0] }, { el: alloyKey = q.toUpperCase().replace(/\s+/g, "_");
  if (ALLOYS[alloy "C", pos: [0.7,-1.2,0] }], bonds: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0]] },
  CKey]) return { type: "alloy", key: alloyKey, data: ALLOYS[alloyKey] };

  const byFormula6H12O6: { name: "Glucose", formula: "C₆H₁₂O₆", = Object.entries(MOLECULES).find(([, m]) => {
    const cleanFormula = m. atoms: [{ el: "C", pos: [0,0,0] }, { el: "C", pos: [1.5,0,0] }, { el: "O", pos: [2.1formula.replace(/[₀-₉]/g, n => "012345678,1.2,0] }, { el: "C", pos: [-0.7,1.2,0] }], bonds: [[0,1],[1,2],[0,3]] },
  C89"["₀₁₂₃₄₅₆₇₈₉".indexOf(n)]).toUpperCase();
    return cleanFormula === key || m.name.toUpperCase() === q.toUpperCase();
  H10N4O2: { name: "Caffeine", formula: "C₈H₁₀N₄O₂", atoms});
  if (byFormula) return { type: "molecule", key: byFormula[0], data:: [{ el: "C", pos: [0,0,0] }, { el: "N", pos: [1.3,0,0] }, { el: "C", pos: [1.9, byFormula[1] };

  const sym = q.charAt(0).toUpperCase() + q.slice(1.2,0] }, { el: "O", pos: [3.1,1.2,1).toLowerCase();
  if (ELEMENTS[sym]) return { type: "element", key: sym,0] }], bonds: [[0,1],[1,2],[2,3]] },
  H2SO4: { name: "Sulf data: ELEMENTS[sym] };

  const byElName = Object.entries(ELEMENTS).find(([,uric acid", formula: "H₂SO₄", atoms: [{ el: "S", pos: [0, e]) => e.name.toUpperCase() === q.toUpperCase());
  if (byElName) return {0,0] }, { el: "O", pos: [0,1.5,0] }, { type: "element", key: byElName[0], data: byElName[1] };

   el: "O", pos: [0,-1.5,0] }, { el: "O", pos: [1.5,0,0] }, { el: "O", pos: [-1.5,return null;
}
```0,0] }], bonds: [[0,1],[0,2],[0,3],[0,4]] },
  SIO2: { name: "Silicon dioxide", formula: "SiO₂", atoms: [{ el: "Si", pos: [0,0,0] }, { el: "O", pos: [1.6,0,0] }, { el: "O", pos: [-1.6,0,0] }], bonds: [[0,1],[0,2]] },
  FE2O3: { name:
