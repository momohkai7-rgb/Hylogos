/* =========================================================================
   DISCOVERER-DATA — backs the "Discovered By" card, shown only for
   elements (hidden for molecules/alloys).

   Three modes per element:
   - 'ancient'  : known since antiquity, no individual discoverer — no card
                  content beyond a short note, no photo.
   - 'solo'     : one credited discoverer — full portrait + bio card.
   - 'pair'     : two credited discoverers — swipeable between two
                  portrait+bio cards.
   - 'many'     : three or more people (or a lab/team), typically 20th
                  century — no photos (impractical to source reliably for
                  large teams), just a compact name+nationality+profession
                  list plus one shared discovery paragraph.

   Portraits are referenced via Wikimedia's Special:FilePath redirect,
   which resolves a Commons filename directly to the image — this doesn't
   require knowing the hashed upload path. Filenames were identified via
   search since this sandbox can't fetch wikipedia.org/wikimedia.org
   directly (cache-only restriction) — worth spot-checking a few on the
   live site since I couldn't personally verify the final rendered image.
========================================================================= */

function discovererPortraitUrl(filename) {
  return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + filename;
}

const DISCOVERERS = {
  marie_curie: {
    name: "Marie Curie", nationality: "Polish-French", profession: "Physicist & chemist",
    born: "7 November 1867", died: "4 July 1934",
    portrait: discovererPortraitUrl("Marie_Curie_1903.jpg"),
    bio: "Working with almost no funding in a converted shed, Curie processed tons of pitchblende ore alongside her husband Pierre and isolated two new elements in 1898 — polonium, named for her native Poland, and radium. She remains the only person ever to win Nobel Prizes in two different sciences (physics and chemistry)."
  },
  cavendish: {
    name: "Henry Cavendish", nationality: "British", profession: "Natural philosopher & chemist",
    born: "10 October 1731", died: "24 February 1810",
    portrait: discovererPortraitUrl("Henry_Cavendish,_Chemist._1731-1810.jpg"),
    bio: "An intensely private aristocrat who rarely published, Cavendish identified hydrogen as a distinct substance in 1766 by reacting metals with acids, calling it \"inflammable air.\" He later used it to help determine water's composition and, separately, to weigh the Earth."
  },
  rutherford_daniel: {
    name: "Daniel Rutherford", nationality: "Scottish", profession: "Physician & chemist",
    born: "3 November 1749", died: "15 November 1819",
    portrait: discovererPortraitUrl("Rutherford_Daniel.jpg"),
    bio: "As a medical student in Edinburgh, Rutherford isolated nitrogen in 1772 by removing oxygen and carbon dioxide from air and showing what remained couldn't support combustion or life — his doctoral thesis on the subject named it \"noxious air.\""
  },
  priestley: {
    name: "Joseph Priestley", nationality: "English", profession: "Theologian & natural philosopher",
    born: "24 March 1733", died: "6 February 1804",
    portrait: discovererPortraitUrl("Portrait_of_Joseph_Priestley.jpg"),
    bio: "Priestley generated oxygen in 1774 by focusing sunlight on mercuric oxide and noted how vigorously it supported flame and breathing. He published first and is usually named alongside Scheele, though Priestley himself never abandoned the phlogiston theory it helped overturn."
  },
  scheele: {
    name: "Carl Wilhelm Scheele", nationality: "Swedish (German-born)", profession: "Pharmaceutical chemist",
    born: "9 December 1742", died: "21 May 1786",
    portrait: discovererPortraitUrl("Carl_Wilhelm_Scheele_from_Familj-Journalen_1874.png"),
    bio: "Working alone in a small pharmacy lab, Scheele produced oxygen around 1771–72 — earlier than Priestley — but his book describing it wasn't published until 1777. He also discovered chlorine in 1774 while investigating manganese ore, though he mistakenly thought it was a compound rather than an element."
  },
  davy: {
    name: "Sir Humphry Davy", nationality: "English", profession: "Chemist",
    born: "17 December 1778", died: "29 May 1829",
    portrait: discovererPortraitUrl("Sir_Humphry_Davy,_Bt_by_Sir_Thomas_Lawrence.jpg"),
    bio: "Using the recently-invented voltaic pile, Davy isolated an extraordinary run of reactive metals by electrolysis in 1807–1808 — potassium, sodium, calcium, strontium, barium, and magnesium — simply by passing current through their molten compounds, a technique no one had applied at that scale before. He also isolated boron in 1808, within weeks of two French chemists doing the same independently."
  },
  dorn: {
    name: "Friedrich Ernst Dorn", nationality: "German", profession: "Physicist",
    born: "27 July 1848", died: "16 June 1916",
    portrait: null,
    bio: "While studying radium's decay in 1900, Dorn noticed the samples kept emitting a radioactive gas even when sealed away from anything else — radon, the first noble gas found to be radioactive, and proof that radioactive elements could transmute into entirely different substances."
  },
  albertus_magnus: {
    name: "Albertus Magnus", nationality: "German", profession: "Friar, philosopher & alchemist",
    born: "c. 1200", died: "15 November 1280",
    portrait: null,
    bio: "A medieval Dominican friar and one of the most influential scholars of his age, Albertus is traditionally credited with isolating arsenic around 1250 by heating orpiment with soap — making it, alongside phosphorus centuries later, one of the very few elements with a discoverer known from before the age of modern chemistry. No genuine portrait survives from his lifetime."
  },
  berzelius: {
    name: "Jöns Jacob Berzelius", nationality: "Swedish", profession: "Chemist",
    born: "20 August 1779", died: "7 August 1848",
    portrait: discovererPortraitUrl("J_J_Berzelius.jpg"),
    bio: "One of the most prolific element-discoverers in history, Berzelius identified cerium (1803, with Wilhelm Hisinger), selenium (1817), silicon (1824), and thorium (1828) from his Stockholm laboratory, while also developing the system of chemical symbols still used today."
  },
  seaborg: {
    name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist",
    born: "19 April 1912", died: "25 February 1999",
    portrait: discovererPortraitUrl("Glenn_Seaborg_-_1964.jpg"),
    bio: "Leading a rotating cast of collaborators at Berkeley through the 1940s and 50s, Seaborg helped identify plutonium, americium, curium, berkelium, californium, and mendelevium via particle bombardment — reshaping the periodic table's bottom row and sharing the 1951 Nobel Prize in Chemistry for it."
  },
  ramsay: {
    name: "Sir William Ramsay", nationality: "Scottish", profession: "Chemist",
    born: "2 October 1852", died: "23 July 1916",
    portrait: discovererPortraitUrl("Sir_William_Ramsay.jpg"),
    bio: "After isolating argon with Lord Rayleigh in 1894, Ramsay reasoned a whole undiscovered family of gases must exist and went looking — finding helium terrestrially in 1895, then neon, krypton, and xenon in 1898 with Morris Travers, by fractionally distilling liquid air. He won the 1904 Nobel Prize in Chemistry for it."
  },
  cronstedt: {
    name: "Axel Fredrik Cronstedt", nationality: "Swedish", profession: "Mineralogist & chemist",
    born: "23 December 1722", died: "19 August 1765",
    portrait: discovererPortraitUrl("Axel_Fredrik_Cronstedt.JPG"),
    bio: "A mining-bureau mineralogist working with ore samples, Cronstedt isolated nickel in 1751 from kupfernickel ('devil's copper') — ore that miners had long cursed for looking like copper but refusing to yield any. He's also considered a founder of modern mineralogy for advocating chemical, not just visual, mineral classification."
  },
  ulloa: {
    name: "Antonio de Ulloa", nationality: "Spanish", profession: "Naval officer & astronomer",
    born: "12 January 1716", died: "3 July 1795",
    portrait: discovererPortraitUrl("Almirante_Antonio_de_Ulloa.jpg"),
    bio: "While surveying South America for a Spanish-French geodesic expedition in the 1730s, Ulloa published the first detailed European scientific description of platinum, found alongside gold in Colombian rivers — though indigenous South Americans had already been working the metal for centuries before Europeans took note."
  },
  marggraf: {
    name: "Andreas Sigismund Marggraf", nationality: "German", profession: "Chemist",
    born: "3 March 1709", died: "7 August 1782",
    portrait: null,
    bio: "A pioneer of analytical chemistry in Berlin, Marggraf isolated pure metallic zinc in 1746 by heating calamine with charcoal in a closed vessel — impure zinc had been smelted in India and China for centuries, but Marggraf was first to produce and describe the pure metal in the West."
  },
  geoffroy_bismuth: {
    name: "Claude François Geoffroy", nationality: "French", profession: "Chemist",
    born: "1729", died: "18 June 1753",
    portrait: null,
    bio: "Working in Paris, Geoffroy proved in 1753 that bismuth was a genuinely distinct metal rather than a variant of lead, tin, or antimony as it had long been assumed to be — a conclusion he reached and published only shortly before his own death at just 24."
  },
  brand: {
    name: "Hennig Brand", nationality: "German", profession: "Alchemist",
    born: "c. 1630", died: "c. 1710",
    portrait: null,
    bio: "Searching for the mythical philosopher's stone by boiling down and heating enormous quantities of urine, Brand accidentally isolated a glowing white waxy substance in 1669 — phosphorus, the first element discovered by a known individual rather than known since antiquity. No portrait of Brand survives; the famous painting of his discovery was made over a century after his death."
  },
  brandt: {
    name: "Georg Brandt", nationality: "Swedish", profession: "Chemist & mineralogist",
    born: "26 June 1694", died: "29 April 1768",
    portrait: null,
    bio: "Brandt proved in 1735 that the blue color long seen in certain glasses and glazes came from a previously-unrecognized metal, not from bismuth as everyone assumed — cobalt, the first metal identified since antiquity by a known individual. No contemporary portrait of Brandt is known to survive."
  },
  gahn: {
    name: "Johan Gottlieb Gahn", nationality: "Swedish", profession: "Chemist & mineralogist",
    born: "19 August 1745", died: "8 December 1818",
    portrait: discovererPortraitUrl("Johan_Gottlieb_Gahn_by_Lorens_Pasch.jpg"),
    bio: "Notoriously reluctant to publish his own findings, Gahn isolated manganese metal in 1774 by reducing manganese dioxide with carbon, freely sharing the discovery with his close friends Scheele and Bergman rather than claiming credit loudly himself. He and Scheele also discovered that bone contains phosphorus."
  },
  hjelm: {
    name: "Peter Jacob Hjelm", nationality: "Swedish", profession: "Chemist",
    born: "2 October 1746", died: "7 October 1813",
    portrait: null,
    bio: "Four years after Scheele identified molybdenum's characteristic oxide but couldn't isolate the metal itself, Hjelm succeeded in 1781 by reducing molybdic acid with carbon in an oxygen-free atmosphere, producing a near-pure dark metal powder."
  },
  muller_reichenstein: {
    name: "Franz-Joseph Müller von Reichenstein", nationality: "Austrian", profession: "Mineralogist & mining engineer",
    born: "1740 or 1742 (disputed)", died: "12 October 1825",
    portrait: null,
    bio: "While analyzing gold ore in Transylvania in 1782, Müller isolated a substance he suspected was a new element but couldn't fully confirm — his work went unnoticed for over a decade until Martin Klaproth requested a sample, verified it, and named it tellurium in 1798. (The portrait long associated with Müller — even printed on a commemorative stamp — has since been identified as his son instead.)"
  },
  courtois: {
    name: "Bernard Courtois", nationality: "French", profession: "Chemist",
    born: "8 February 1777", died: "27 September 1838",
    portrait: null,
    bio: "While processing seaweed ash for saltpeter during the Napoleonic Wars in 1811, Courtois added too much acid and watched a violet vapor rise off the mixture, condensing into dark crystals — iodine. He died a year before photography was invented, so despite what some sites claim, no genuine portrait or photo of him survives."
  },
  stromeyer: {
    name: "Friedrich Stromeyer", nationality: "German", profession: "Chemist & physician",
    born: "2 August 1776", died: "18 August 1835",
    portrait: discovererPortraitUrl("Friedrich_Stromeyer.jpg"),
    bio: "As a professor also responsible for inspecting local apothecary supplies, Stromeyer noticed in 1817 that some zinc carbonate samples turned yellow when heated rather than staying white — tracing the impurity down revealed cadmium, a new element hiding inside what everyone assumed was simple zinc ore."
  },
  balard: {
    name: "Antoine Jérôme Balard", nationality: "French", profession: "Chemist",
    born: "30 September 1802", died: "30 April 1876",
    portrait: discovererPortraitUrl("Antoine_Jerome_Balard.jpg"),
    bio: "Working with seawater residues in Montpellier, Balard isolated bromine in 1826 and correctly identified it as a new element related to chlorine and iodine. German chemist Carl Löwig had actually prepared the same substance a year earlier but published later — both are now credited as co-discoverers."
  },
  crookes: {
    name: "Sir William Crookes", nationality: "English", profession: "Chemist & physicist",
    born: "17 June 1832", died: "4 April 1919",
    portrait: discovererPortraitUrl("Portrait_of_William_Crookes_(1832-1919),_Chemist_and_Physicist_(2550746151).jpg"),
    bio: "While examining the residue from sulfuric acid production using flame spectroscopy in 1861, Crookes spotted an unfamiliar bright green spectral line — thallium. He later became a pioneer of vacuum-tube physics, and the 'Crookes tube' he invented helped pave the way toward the discovery of X-rays and the electron."
  },
  moissan: {
    name: "Henri Moissan", nationality: "French", profession: "Chemist & pharmacist",
    born: "28 September 1852", died: "20 February 1907",
    portrait: discovererPortraitUrl("PSM_V70_D480_Henri_Moissan.png"),
    bio: "Fluorine had resisted isolation for decades — several earlier chemists were seriously injured or killed trying — before Moissan finally succeeded in 1886 by electrolyzing potassium fluoride dissolved in hydrofluoric acid inside a platinum apparatus. It won him the 1906 Nobel Prize in Chemistry."
  },
  boisbaudran: {
    name: "Paul-Émile Lecoq de Boisbaudran", nationality: "French", profession: "Chemist (self-taught)",
    born: "18 April 1838", died: "28 May 1912",
    portrait: null,
    bio: "An entirely self-taught chemist, Boisbaudran became a master of spectroscopy and used it to identify three new elements from his own private laboratory: gallium in 1875 — the first of Mendeleev's predicted-but-undiscovered elements to actually turn up — followed by samarium (1879) and dysprosium (1886)."
  },
  winkler: {
    name: "Clemens Winkler", nationality: "German", profession: "Chemist",
    born: "26 December 1838", died: "8 October 1904",
    portrait: null,
    bio: "While analyzing a newly-found silver mineral called argyrodite in 1886, Winkler found roughly 7% of its mass was unaccounted for by any known element — the missing piece turned out to be germanium, the third of Mendeleev's predicted elements to be confirmed, and Winkler named it for his homeland."
  },
  nilson: {
    name: "Lars Fredrik Nilson", nationality: "Swedish", profession: "Chemist",
    born: "27 May 1840", died: "14 May 1899",
    portrait: null,
    bio: "While separating rare-earth minerals at Uppsala in 1879, Nilson isolated scandium — later shown to be the missing 'eka-boron' Mendeleev had predicted a decade earlier. He later turned his attention to agricultural chemistry, introducing sugar beet farming to Sweden."
  },
  oersted: {
    name: "Hans Christian Ørsted", nationality: "Danish", profession: "Physicist & chemist",
    born: "14 August 1777", died: "9 March 1851",
    portrait: null,
    bio: "Already famous for discovering that electric currents generate magnetic fields, Ørsted produced impure aluminium metal in 1825 — but didn't think much of the result himself, and the achievement went largely unrecognized for a century until historians revisited his notes."
  },
  debierne: {
    name: "André-Louis Debierne", nationality: "French", profession: "Chemist",
    born: "14 July 1874", died: "31 August 1949",
    portrait: null,
    bio: "A close friend and collaborator of Pierre and Marie Curie, Debierne discovered actinium in 1899 while continuing the couple's work processing pitchblende ore. After Pierre's death he stayed on as Marie's research partner, and the two later produced visible metallic radium together in 1911."
  },
  gadolin: {
    name: "Johan Gadolin", nationality: "Finnish", profession: "Chemist, physicist & mineralogist",
    born: "5 June 1760", died: "15 August 1852",
    portrait: null,
    bio: "Analyzing a black mineral from a Swedish quarry in 1794, Gadolin identified a previously unknown 'earth' that was later confirmed to contain yttrium — the first rare-earth element found, and the discovery that opened up the entire lanthanide corner of the periodic table. The element gadolinium was later named in his honor."
  },
  cleve: {
    name: "Per Teodor Cleve", nationality: "Swedish", profession: "Chemist, biologist & oceanographer",
    born: "10 February 1840", died: "18 June 1905",
    portrait: null,
    bio: "While purifying a sample of erbium oxide in 1879, Cleve realized it wasn't pure at all — separating out a brown substance he named holmium (after Stockholm) and a green one he named thulium (after a mythical name for Scandinavia), both in the same year."
  },
  marignac: {
    name: "Jean Charles Galissard de Marignac", nationality: "Swiss", profession: "Chemist",
    born: "24 April 1817", died: "15 April 1894",
    portrait: null,
    bio: "A meticulous measurer of atomic weights, Marignac extracted ytterbium from what everyone assumed was pure erbium oxide in 1878, then found gadolinium two years later while analyzing samarskite ore — his precision work on rare earths later hinted at the very existence of isotopes."
  },
  demarcay: {
    name: "Eugène-Anatole Demarçay", nationality: "French", profession: "Chemist",
    born: "1 January 1852", died: "5 March 1903",
    portrait: null,
    bio: "Suspecting since 1896 that samples of 'pure' samarium were secretly contaminated, Demarçay built a specialized high-temperature spark spectroscope to prove it, finally isolating europium in 1901. He'd also helped Marie and Pierre Curie confirm radium's existence three years earlier, spotting its telltale spectral line."
  },
  urbain: {
    name: "Georges Urbain", nationality: "French", profession: "Chemist",
    born: "12 April 1872", died: "5 November 1938",
    portrait: null,
    bio: "After years spent separating and characterizing rare earths, Urbain isolated lutetium from ytterbium ore in 1907 — the last stable rare earth to be discovered. American chemist Charles James found the same element independently around the same time, and priority between them is still debated."
  },
  perey: {
    name: "Marguerite Perey", nationality: "French", profession: "Laboratory technician & later physicist",
    born: "19 October 1909", died: "13 May 1975",
    portrait: null,
    bio: "Working as a lab technician for Marie Curie's old research group, Perey noticed unexplained radioactive decay products in a purified actinium sample in 1939 — francium, the last element found in nature rather than made artificially. She later became the first woman elected to the French Académie des Sciences, though tragically died of cancer likely caused by decades of radiation exposure."
  },
  wollaston: {
    name: "William Hyde Wollaston", nationality: "English", profession: "Chemist & physicist",
    born: "6 August 1766", died: "22 December 1828",
    portrait: null,
    bio: "While developing a process to purify platinum ore into workable metal with his partner Smithson Tennant, Wollaston noticed leftover residues contained two more new metals — palladium in 1802, named for a newly-discovered asteroid, and rhodium in 1804, named for the rose color of one of its compounds."
  },
  tennant: {
    name: "Smithson Tennant", nationality: "English", profession: "Chemist",
    born: "1761", died: "1815",
    portrait: null,
    bio: "While Wollaston worked the soluble part of their platinum ore residue, Tennant tackled the insoluble black powder left behind — extracting both iridium and osmium from it in 1804. No portrait of Tennant is known to survive, unusually for someone this well-documented."
  },
  auer_welsbach: {
    name: "Carl Auer von Welsbach", nationality: "Austrian", profession: "Chemist & inventor",
    born: "1 September 1858", died: "4 August 1929",
    portrait: discovererPortraitUrl("Auer_von_Welsbach.jpg"),
    bio: "The element 'didymium' had sat unquestioned in chemistry for decades before Auer von Welsbach used fractional crystallization in 1885 to split it into two genuinely distinct elements — green-salted praseodymium and pink-salted neodymium. He also invented the gas mantle that made gaslight dramatically brighter, funding his later research."
  },
  bunsen: {
    name: "Robert Bunsen", nationality: "German", profession: "Chemist",
    born: "30 March 1811", died: "16 August 1899",
    portrait: null,
    bio: "Having just built the first practical flame spectroscope with Gustav Kirchhoff, Bunsen processed 40 tons of mineral water down to just 50 grams of salt to confirm caesium in 1860, then found rubidium the following year the same way — both named for the colors of their telltale spectral lines."
  },
  kirchhoff: {
    name: "Gustav Kirchhoff", nationality: "German", profession: "Physicist",
    born: "12 March 1824", died: "17 October 1887",
    portrait: null,
    bio: "Working alongside Bunsen, Kirchhoff helped invent spectral analysis itself and used it to identify caesium (1860) and rubidium (1861) — a technique so powerful it let him identify 30 elements in the Sun's own light without ever leaving Earth."
  },
  sefstrom: {
    name: "Nils Gabriel Sefström", nationality: "Swedish", profession: "Chemist & metallurgist",
    born: "2 June 1787", died: "30 November 1845",
    portrait: null,
    bio: "While investigating why certain steel batches turned brittle in 1830, Sefström traced the cause to a previously unrecognized metal — vanadium, named for a Norse goddess. Mexican mineralogist Andrés Manuel del Río had actually found the same element in 1801 but was talked out of the claim; Sefström's independent rediscovery is what stuck."
  },
  ekeberg: {
    name: "Anders Gustaf Ekeberg", nationality: "Swedish", profession: "Chemist",
    born: "16 January 1767", died: "11 February 1813",
    portrait: null,
    bio: "Analyzing minerals from the same Ytterby quarry that yielded several other new elements, Ekeberg isolated tantalum in 1802 — naming it for the Greek myth of Tantalus, since the metal stubbornly refused to dissolve in acid no matter what he tried. He worked partially deaf and blind in one eye after a lab explosion."
  },
  mosander: {
    name: "Carl Gustaf Mosander", nationality: "Swedish", profession: "Chemist",
    born: "10 September 1797", died: "15 October 1858",
    portrait: null,
    bio: "A reluctant publisher who preferred announcing discoveries orally at meetings, Mosander found lanthanum hiding inside cerium oxide in 1839, then split yttria into two more new components in 1843 — terbium and erbium. He'd trained directly under Berzelius and eventually succeeded him as professor of chemistry."
  },
  vauquelin: {
    name: "Nicolas-Louis Vauquelin", nationality: "French", profession: "Chemist & pharmacist",
    born: "16 May 1763", died: "14 November 1829",
    portrait: null,
    bio: "A former peasant's son turned leading analytical chemist, Vauquelin found chromium in a Siberian lead ore in 1797, then beryllium oxide inside beryl and emerald crystals the following year — the pure beryllium metal itself wasn't isolated until decades later, by Wöhler and Bussy independently in 1828."
  },
  hatchett: {
    name: "Charles Hatchett", nationality: "English", profession: "Mineralogist & analytical chemist",
    born: "2 January 1765", died: "10 March 1847",
    portrait: null,
    bio: "A self-taught chemist and son of a royal coachbuilder, Hatchett examined a century-old American mineral sample from the British Museum's collection in 1801 and found it contained an unknown metal, which he named columbium — only renamed niobium decades later once its relationship to tantalum was untangled."
  },
  klaproth: {
    name: "Martin Heinrich Klaproth", nationality: "German", profession: "Apothecary & chemist",
    born: "1 December 1743", died: "1 January 1817",
    portrait: null,
    bio: "The leading analytical chemist of his era, Klaproth identified uranium in pitchblende ore and zirconium in a Ceylon gemstone in the very same year, 1789 — naming uranium after the recently-discovered planet Uranus. He also independently rediscovered and named titanium in 1795, unaware William Gregor had already found it four years earlier."
  },
  gregor: {
    name: "William Gregor", nationality: "English", profession: "Clergyman & mineralogist",
    born: "25 December 1761", died: "11 June 1817",
    portrait: null,
    bio: "A country parson with a serious side interest in mineralogy, Gregor identified an unfamiliar metallic oxide in black sand from his own Cornwall parish in 1791, proposing the name 'menachanite' — but his find went largely unnoticed until Klaproth independently rediscovered the same element and gave it the name that stuck."
  },
  pierre_curie: {
    name: "Pierre Curie", nationality: "French", profession: "Physicist & chemist",
    born: "15 May 1859", died: "19 April 1906",
    portrait: discovererPortraitUrl("Pierre_Curie_by_Dujardin_c1906.jpg"),
    bio: "Already an accomplished physicist known for discovering piezoelectricity, Pierre set aside his own research to help his wife Marie process tons of pitchblende ore, isolating polonium and radium alongside her in 1898. The couple shared half the 1903 Nobel Prize in Physics — the first married couple to win one together — before Pierre was killed in a street accident just three years later."
  },
  arfwedson: {
    name: "Johan August Arfwedson", nationality: "Swedish", profession: "Chemist",
    born: "12 January 1792", died: "28 October 1841",
    portrait: discovererPortraitUrl("Berzelius_Reseanteckningar_Johan_Arfwedson.png"),
    bio: "Working in Berzelius's own private laboratory, the 25-year-old Arfwedson noticed in 1817 that a mineral called petalite contained an alkali metal lighter than any known — lithium. Berzelius, generous with credit, announced the find himself but named Arfwedson as the actual discoverer."
  },
};

/* ---- ancient elements: known since antiquity, no individual discoverer ---- */
const ANCIENT_NOTE = "Known and used since antiquity — worked, smelted, or mined long before the idea of a chemical element existed, so there's no individual discovery to credit.";

const ELEMENT_DISCOVERY = {
  C:  { mode: 'ancient' }, S:  { mode: 'ancient' }, Fe: { mode: 'ancient' },
  Cu: { mode: 'ancient' }, Ag: { mode: 'ancient' }, Sn: { mode: 'ancient' },
  Sb: { mode: 'ancient' }, Au: { mode: 'ancient' }, Hg: { mode: 'ancient' },
  Pb: { mode: 'ancient' },

  /* ---- solo, confirmed portraits ---- */
  H:  { mode: 'solo', id: 'cavendish', year: 1766, location: "London, England" },
  N:  { mode: 'solo', id: 'rutherford_daniel', year: 1772, location: "Edinburgh, Scotland" },
  Se: { mode: 'solo', id: 'berzelius', year: 1817, location: "Stockholm, Sweden" },
  Si: { mode: 'solo', id: 'berzelius', year: 1824, location: "Stockholm, Sweden" },
  Th: { mode: 'solo', id: 'berzelius', year: 1828, location: "Stockholm, Sweden" },
  Ce: { mode: 'solo', id: 'berzelius', year: 1803, location: "Stockholm, Sweden" },
  Cl: { mode: 'solo', id: 'scheele', year: 1774, location: "Uppsala, Sweden" },
  K:  { mode: 'solo', id: 'davy', year: 1807, location: "London, England" },
  Na: { mode: 'solo', id: 'davy', year: 1807, location: "London, England" },
  Ca: { mode: 'solo', id: 'davy', year: 1808, location: "London, England" },
  Sr: { mode: 'solo', id: 'davy', year: 1808, location: "London, England" },
  Ba: { mode: 'solo', id: 'davy', year: 1808, location: "London, England" },
  Mg: { mode: 'solo', id: 'davy', year: 1808, location: "London, England" },
  B:  { mode: 'solo', id: 'davy', year: 1808, location: "London, England" },
  Rn: { mode: 'solo', id: 'dorn', year: 1900, location: "Halle, Germany" },
  As: { mode: 'solo', id: 'albertus_magnus', year: "c. 1250", location: "Cologne, Germany" },

  /* ---- pair, one or both portraits still pending further search ---- */
  O:  { mode: 'pair', ids: ['scheele', 'priestley'], year: "1771–1774", location: "Sweden and England", note: "Independently discovered; priority is genuinely disputed." },
  Cs: { mode: 'pair', ids: ['bunsen', 'kirchhoff'], year: 1860, location: "Heidelberg, Germany" },
  Rb: { mode: 'pair', ids: ['bunsen', 'kirchhoff'], year: 1861, location: "Heidelberg, Germany" },
  V:  { mode: 'solo', id: 'sefstrom', year: 1830, location: "Falun, Sweden" },
  Ta: { mode: 'solo', id: 'ekeberg', year: 1802, location: "Uppsala, Sweden" },
  La: { mode: 'solo', id: 'mosander', year: 1839, location: "Stockholm, Sweden" },
  Tb: { mode: 'solo', id: 'mosander', year: 1843, location: "Stockholm, Sweden" },
  Er: { mode: 'solo', id: 'mosander', year: 1843, location: "Stockholm, Sweden" },
  Be: { mode: 'solo', id: 'vauquelin', year: 1798, location: "Paris, France" },
  Cr: { mode: 'solo', id: 'vauquelin', year: 1797, location: "Paris, France" },
  Nb: { mode: 'solo', id: 'hatchett', year: 1801, location: "London, England" },
  U:  { mode: 'solo', id: 'klaproth', year: 1789, location: "Berlin, Germany" },
  Zr: { mode: 'solo', id: 'klaproth', year: 1789, location: "Berlin, Germany" },
  Ti: { mode: 'pair', ids: ['gregor', 'klaproth'], year: "1791 / 1795", location: "Cornwall, England / Berlin, Germany", note: "Gregor found it first but it went unnoticed; Klaproth independently rediscovered and named it four years later." },
  He: { mode: 'pending' },
  W:  { mode: 'pending' },
  In: { mode: 'pending' },
  Po: { mode: 'pair', ids: ['marie_curie', 'pierre_curie'], year: 1898, location: "Paris, France" },
  Ra: { mode: 'pair', ids: ['marie_curie', 'pierre_curie'], year: 1898, location: "Paris, France" },
  Hf: { mode: 'pending' },
  Np: { mode: 'pending' },
  Tc: { mode: 'pending' },
  Ar: { mode: 'pending' },
  Ne: { mode: 'pending' },
  Kr: { mode: 'pending' },
  Xe: { mode: 'pending' },

  Ni: { mode: 'solo', id: 'cronstedt', year: 1751, location: "Sweden" },
  Pt: { mode: 'solo', id: 'ulloa', year: 1735, location: "Colombia (South America)" },
  Zn: { mode: 'solo', id: 'marggraf', year: 1746, location: "Berlin, Germany" },
  Bi: { mode: 'solo', id: 'geoffroy_bismuth', year: 1753, location: "Paris, France" },
  P:  { mode: 'solo', id: 'brand', year: 1669, location: "Hamburg, Germany" },
  Co: { mode: 'solo', id: 'brandt', year: 1735, location: "Sweden" },
  Mn: { mode: 'solo', id: 'gahn', year: 1774, location: "Sweden" },
  Mo: { mode: 'solo', id: 'hjelm', year: 1781, location: "Sweden" },
  Te: { mode: 'solo', id: 'muller_reichenstein', year: 1782, location: "Transylvania (modern Romania)" },
  I:  { mode: 'solo', id: 'courtois', year: 1811, location: "Paris, France" },
  Li: { mode: 'solo', id: 'arfwedson', year: 1817, location: "Stockholm, Sweden" },
  Cd: { mode: 'solo', id: 'stromeyer', year: 1817, location: "Göttingen, Germany" },
  Br: { mode: 'solo', id: 'balard', year: 1826, location: "Montpellier, France" },
  Tl: { mode: 'solo', id: 'crookes', year: 1861, location: "London, England" },
  F:  { mode: 'solo', id: 'moissan', year: 1886, location: "Paris, France" },
  Ga: { mode: 'solo', id: 'boisbaudran', year: 1875, location: "Paris, France" },
  Sm: { mode: 'solo', id: 'boisbaudran', year: 1879, location: "Paris, France" },
  Dy: { mode: 'solo', id: 'boisbaudran', year: 1886, location: "Paris, France" },
  Ge: { mode: 'solo', id: 'winkler', year: 1886, location: "Freiberg, Germany" },
  Sc: { mode: 'solo', id: 'nilson', year: 1879, location: "Uppsala, Sweden" },
  Al: { mode: 'solo', id: 'oersted', year: 1825, location: "Copenhagen, Denmark" },
  Ac: { mode: 'solo', id: 'debierne', year: 1899, location: "Paris, France" },
  Y:  { mode: 'solo', id: 'gadolin', year: 1794, location: "Turku, Finland" },
  Ho: { mode: 'solo', id: 'cleve', year: 1879, location: "Uppsala, Sweden" },
  Tm: { mode: 'solo', id: 'cleve', year: 1879, location: "Uppsala, Sweden" },
  Yb: { mode: 'solo', id: 'marignac', year: 1878, location: "Geneva, Switzerland" },
  Gd: { mode: 'solo', id: 'marignac', year: 1880, location: "Geneva, Switzerland" },
  Eu: { mode: 'solo', id: 'demarcay', year: 1901, location: "Paris, France" },
  Lu: { mode: 'solo', id: 'urbain', year: 1907, location: "Paris, France" },
  Fr: { mode: 'solo', id: 'perey', year: 1939, location: "Paris, France" },
  Pd: { mode: 'solo', id: 'wollaston', year: 1802, location: "London, England" },
  Rh: { mode: 'solo', id: 'wollaston', year: 1804, location: "London, England" },
  Ir: { mode: 'solo', id: 'tennant', year: 1804, location: "London, England" },
  Os: { mode: 'solo', id: 'tennant', year: 1804, location: "London, England" },
  Pr: { mode: 'solo', id: 'auer_welsbach', year: 1885, location: "Vienna, Austria" },
  Nd: { mode: 'solo', id: 'auer_welsbach', year: 1885, location: "Vienna, Austria" },

  /* ---- solo, portrait not yet sourced ---- */
  Ru: { mode: 'pending' },

  /* ---- many (3+ people / lab-credited) — fully populated, no photos ---- */
  Re: { mode: 'many', year: 1925, location: "Berlin, Germany",
    people: [
      { name: "Walter Noddack", nationality: "German", profession: "Physical chemist" },
      { name: "Ida Noddack", nationality: "German", profession: "Chemist & physicist" },
      { name: "Otto Berg", nationality: "German", profession: "Physicist" },
    ],
    paragraph: "The team spent years X-ray-analyzing platinum ore samples before identifying rhenium's characteristic spectral lines in 1925 — the last naturally-occurring stable element to be found. Ida Noddack later became the first person to publish the idea of nuclear fission, years before it was confirmed." },
  At: { mode: 'many', year: 1940, location: "Berkeley, California, USA",
    people: [
      { name: "Dale R. Corson", nationality: "American", profession: "Physicist" },
      { name: "Kenneth Ross MacKenzie", nationality: "American", profession: "Physicist" },
      { name: "Emilio Segrè", nationality: "Italian-American", profession: "Physicist" },
    ],
    paragraph: "The team bombarded bismuth with alpha particles in a cyclotron to synthesize astatine — element 85 had been searched for and falsely 'discovered' several times before this 1940 synthesis finally held up." },
  Pu: { mode: 'many', year: "1940–41", location: "Berkeley, California, USA",
    people: [
      { name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist" },
      { name: "Edwin McMillan", nationality: "American", profession: "Physicist" },
      { name: "Joseph W. Kennedy", nationality: "American", profession: "Chemist" },
      { name: "Arthur Wahl", nationality: "American", profession: "Chemist" },
    ],
    paragraph: "Bombarding uranium with deuterons in Berkeley's cyclotron, the team produced plutonium in early 1941 — the discovery was kept secret during WWII once its fissile potential for the Manhattan Project became clear." },
  Am: { mode: 'many', year: 1944, location: "Chicago & Berkeley, USA",
    people: [
      { name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist" },
      { name: "Ralph A. James", nationality: "American", profession: "Chemist" },
      { name: "Leon O. Morgan", nationality: "American", profession: "Chemist" },
      { name: "Albert Ghiorso", nationality: "American", profession: "Physicist" },
    ],
    paragraph: "Produced by neutron-bombarding plutonium at the wartime Metallurgical Laboratory in Chicago, americium's discovery was withheld from publication until 1945 for wartime secrecy — Seaborg first announced it, fittingly, on a children's radio quiz show." },
  Cm: { mode: 'many', year: 1944, location: "Berkeley, California, USA",
    people: [
      { name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist" },
      { name: "Ralph A. James", nationality: "American", profession: "Chemist" },
      { name: "Albert Ghiorso", nationality: "American", profession: "Physicist" },
    ],
    paragraph: "Made by bombarding plutonium with alpha particles just months before americium, curium was named for Marie and Pierre Curie — continuing the tradition of honoring pioneering radioactivity researchers." },
  Bk: { mode: 'many', year: 1949, location: "Berkeley, California, USA",
    people: [
      { name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist" },
      { name: "Stanley G. Thompson", nationality: "American", profession: "Chemist" },
      { name: "Albert Ghiorso", nationality: "American", profession: "Physicist" },
    ],
    paragraph: "Synthesized by bombarding americium with alpha particles and named directly after Berkeley, California, where nearly all of this era's new elements were made." },
  Cf: { mode: 'many', year: 1950, location: "Berkeley, California, USA",
    people: [
      { name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist" },
      { name: "Stanley G. Thompson", nationality: "American", profession: "Chemist" },
      { name: "Kenneth Street Jr.", nationality: "American", profession: "Chemist" },
      { name: "Albert Ghiorso", nationality: "American", profession: "Physicist" },
    ],
    paragraph: "Made from only a few thousand atoms by bombarding curium with alpha particles, californium was identified before the team even had a weighable sample — its properties were predicted from chemistry, not measured directly, at first." },
  Es: { mode: 'many', year: 1952, location: "Enewetak Atoll debris, analyzed in Berkeley & Los Alamos, USA",
    people: [
      { name: "Albert Ghiorso", nationality: "American", profession: "Physicist" },
      { name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist" },
      { name: "and colleagues", nationality: "American", profession: "Nuclear chemists & physicists" },
    ],
    paragraph: "Found in debris from the first hydrogen bomb test (Ivy Mike, 1952) — the intense neutron flux fused uranium atoms together far faster than any lab reaction could. Kept classified until 1955." },
  Fm: { mode: 'many', year: 1952, location: "Enewetak Atoll debris, analyzed in Berkeley & Los Alamos, USA",
    people: [
      { name: "Albert Ghiorso", nationality: "American", profession: "Physicist" },
      { name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist" },
      { name: "and colleagues", nationality: "American", profession: "Nuclear chemists & physicists" },
    ],
    paragraph: "Discovered in the same 1952 Ivy Mike test debris as einsteinium, fermium was also kept classified for three years before the discovery could be published." },
  Md: { mode: 'many', year: 1955, location: "Berkeley, California, USA",
    people: [
      { name: "Albert Ghiorso", nationality: "American", profession: "Physicist" },
      { name: "Bernard Harvey", nationality: "American", profession: "Chemist" },
      { name: "Gregory Choppin", nationality: "American", profession: "Chemist" },
      { name: "Stanley Thompson", nationality: "American", profession: "Chemist" },
      { name: "Glenn T. Seaborg", nationality: "American", profession: "Nuclear chemist" },
    ],
    paragraph: "Made one atom at a time by bombarding einsteinium, mendelevium was identified from just 17 atoms total — a landmark demonstration that single-atom chemistry was even possible to study." },
  No: { mode: 'many', year: "1958–1966 (disputed)", location: "Stockholm, Sweden / Berkeley, USA / Dubna, USSR",
    people: [
      { name: "Multiple competing teams", nationality: "Swedish, American & Soviet", profession: "Nuclear physicists & chemists" },
    ],
    paragraph: "Nobelium's discovery is genuinely contested — an initial 1957 Swedish claim was later retracted, Berkeley claimed it in 1958, and a Dubna (Soviet) team's results were eventually credited by IUPAC after years of dispute, part of what's informally called the 'Transfermium Wars.'" },
  Lr: { mode: 'many', year: 1961, location: "Berkeley, California, USA",
    people: [
      { name: "Albert Ghiorso", nationality: "American", profession: "Physicist" },
      { name: "Torbjørn Sikkeland", nationality: "Norwegian-American", profession: "Physicist" },
      { name: "Almon Larsh", nationality: "American", profession: "Physicist" },
      { name: "Robert Latimer", nationality: "American", profession: "Physicist" },
    ],
    paragraph: "The last actinide, lawrencium closed out the row named for Ernest O. Lawrence, inventor of the cyclotron these Berkeley teams relied on for nearly every element from plutonium onward. A rival Dubna claim followed in 1965." },
  Pa: { mode: 'many', year: "1913–1918", location: "Germany",
    people: [
      { name: "Kasimir Fajans", nationality: "Polish-German", profession: "Physical chemist" },
      { name: "Oswald Helmuth Göhring", nationality: "German", profession: "Physicist" },
      { name: "Otto Hahn", nationality: "German", profession: "Chemist" },
      { name: "Lise Meitner", nationality: "Austrian-Swedish", profession: "Physicist" },
    ],
    paragraph: "Fajans and Göhring found a short-lived isotope in 1913; Hahn and Meitner independently isolated the much longer-lived isotope that actually occurs naturally in 1917–18, which is the one that gave protactinium its lasting name." },
  Rf: { mode: 'many', year: "1964 / 1969 (disputed)", location: "Dubna, USSR & Berkeley, California, USA",
    people: [{ name: "Georgy Flerov's team (Dubna) and Albert Ghiorso's team (Berkeley)", nationality: "Soviet & American", profession: "Nuclear physicists" }],
    paragraph: "Both a Soviet team at Dubna and an American team at Berkeley claimed rutherfordium within a few years of each other; the naming dispute that followed ran for decades before IUPAC settled it in 1997." },
  Db: { mode: 'many', year: "1968 / 1970 (disputed)", location: "Dubna, USSR & Berkeley, California, USA",
    people: [{ name: "Teams at Dubna and Berkeley", nationality: "Soviet & American", profession: "Nuclear physicists" }],
    paragraph: "Like rutherfordium just before it, dubnium was independently claimed by both Soviet and American teams, part of the same long Cold War-era priority dispute over the first several superheavy elements." },
  Sg: { mode: 'many', year: 1974, location: "Berkeley, California, USA",
    people: [{ name: "Albert Ghiorso's team", nationality: "American", profession: "Nuclear physicists" }],
    paragraph: "Named directly for Glenn Seaborg while he was still alive — controversial at the time, since element names traditionally honored the deceased, but ultimately adopted anyway given his outsized contribution to the periodic table's bottom rows." },
  Bh: { mode: 'many', year: 1981, location: "Darmstadt, West Germany",
    people: [{ name: "Peter Armbruster & Gottfried Münzenberg's team", nationality: "German", profession: "Nuclear physicists" }],
    paragraph: "Made at the GSI Helmholtz Centre by fusing bismuth and chromium nuclei together — the first of a run of new elements the Darmstadt lab would produce through the 1980s and 90s using this heavy-ion fusion technique." },
  Hs: { mode: 'many', year: 1984, location: "Darmstadt, West Germany",
    people: [{ name: "Peter Armbruster & Gottfried Münzenberg's team", nationality: "German", profession: "Nuclear physicists" }],
    paragraph: "Named for Hesse, the German state Darmstadt sits in — produced via the same fused heavy-ion collision technique the GSI lab used for its whole run of element discoveries." },
  Mt: { mode: 'many', year: 1982, location: "Darmstadt, West Germany",
    people: [{ name: "Peter Armbruster & Gottfried Münzenberg's team", nationality: "German", profession: "Nuclear physicists" }],
    paragraph: "Identified from a single decay chain of just one atom, meitnerium honors Lise Meitner — one of very few elements named for a woman scientist based on her own work rather than a shared or symbolic naming." },
  Ds: { mode: 'many', year: 1994, location: "Darmstadt, Germany",
    people: [{ name: "Sigurd Hofmann's team", nationality: "German", profession: "Nuclear physicists" }],
    paragraph: "Produced by fusing nickel and lead nuclei, darmstadtium — named for the city itself — was the last element GSI Darmstadt's team found using this particular fusion approach before pushing on to even heavier targets." },
  Rg: { mode: 'many', year: 1994, location: "Darmstadt, Germany",
    people: [{ name: "Sigurd Hofmann's team", nationality: "German", profession: "Nuclear physicists" }],
    paragraph: "Made just weeks after darmstadtium by the same GSI team, roentgenium honors Wilhelm Röntgen, discoverer of X-rays and the first-ever Nobel physics laureate." },
  Cn: { mode: 'many', year: 1996, location: "Darmstadt, Germany",
    people: [{ name: "Sigurd Hofmann's team", nationality: "German", profession: "Nuclear physicists" }],
    paragraph: "Named for Nicolaus Copernicus on the 537th anniversary of his birth, copernicium was formally confirmed years after its initial 1996 synthesis once enough decay-chain data had accumulated." },
  Nh: { mode: 'many', year: 2004, location: "Wako, Japan",
    people: [{ name: "Kosuke Morita's team", nationality: "Japanese", profession: "Nuclear physicists" }],
    paragraph: "The first element discovered in Asia, nihonium was made at RIKEN by fusing zinc and bismuth nuclei — its name comes from 'Nihon,' one of the Japanese words for Japan." },
  Fl: { mode: 'many', year: 1998, location: "Dubna, Russia",
    people: [{ name: "Yuri Oganessian's team", nationality: "Russian (with US collaborators)", profession: "Nuclear physicists" }],
    paragraph: "Produced at Dubna's heavy-ion accelerator with collaboration from Lawrence Livermore in the US, flerovium is named for Georgy Flerov, founder of Dubna's nuclear reactions laboratory." },
  Mc: { mode: 'many', year: 2003, location: "Dubna, Russia",
    people: [{ name: "Yuri Oganessian's team", nationality: "Russian & American", profession: "Nuclear physicists" }],
    paragraph: "A joint Dubna–Oak Ridge–Vanderbilt effort, moscovium is named for the Moscow region where Dubna is located." },
  Lv: { mode: 'many', year: 2000, location: "Dubna, Russia",
    people: [{ name: "Yuri Oganessian's team", nationality: "Russian & American", profession: "Nuclear physicists" }],
    paragraph: "Made via a Dubna–Livermore collaboration and named for Lawrence Livermore National Laboratory, one of the few elements named for a research institution rather than a place, person, or mythology." },
  Ts: { mode: 'many', year: 2010, location: "Dubna, Russia",
    people: [{ name: "Yuri Oganessian's team", nationality: "Russian & American", profession: "Nuclear physicists" }],
    paragraph: "A Dubna–Oak Ridge–Vanderbilt collaboration, tennessine is named for the state of Tennessee, home to Oak Ridge National Laboratory and Vanderbilt University, both central to the discovery." },
  Pm: { mode: 'many', year: 1945, location: "Oak Ridge, Tennessee, USA",
    people: [
      { name: "Jacob A. Marinsky", nationality: "American", profession: "Chemist" },
      { name: "Lawrence E. Glendenin", nationality: "American", profession: "Chemist" },
      { name: "Charles D. Coryell", nationality: "American", profession: "Chemist" },
    ],
    paragraph: "The last rare earth to be found, promethium was separated from uranium fission byproducts at Oak Ridge in 1945 during Manhattan Project-era research — fittingly named for Prometheus, who stole fire for humanity, since the element's discovery came wrapped in the same nuclear technology as the atomic bomb." },

  Og: { mode: 'many', year: 2002, location: "Dubna, Russia",
    people: [
      { name: "Yuri Oganessian", nationality: "Russian (Armenian descent)", profession: "Nuclear physicist" },
      { name: "and colleagues at JINR Dubna & Lawrence Livermore", nationality: "Russian & American", profession: "Nuclear physicists" },
    ],
    paragraph: "The heaviest element on the periodic table, oganesson is named after Yuri Oganessian himself — one of only two elements ever named for a living person at the time of naming. As of 2026 he's still an active nuclear physicist at Dubna, now in his nineties." },
};
