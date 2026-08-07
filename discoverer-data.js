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
    bio: "Using the recently-invented voltaic pile, Davy isolated an extraordinary run of reactive metals by electrolysis in 1807–1808 — potassium, sodium, calcium, strontium, barium, and magnesium — simply by passing current through their molten compounds, a technique no one had applied at that scale before."
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

  /* ---- pair, one or both portraits still pending further search ---- */
  O:  { mode: 'pair', ids: ['scheele', 'priestley'], year: "1771–1774", location: "Sweden and England", note: "Independently discovered; priority is genuinely disputed." },
  He: { mode: 'pending' },
  W:  { mode: 'pending' },
  Cs: { mode: 'pending' },
  Rb: { mode: 'pending' },
  In: { mode: 'pending' },
  Po: { mode: 'pending' },
  Ra: { mode: 'pending' },
  Hf: { mode: 'pending' },
  Np: { mode: 'pending' },
  Tc: { mode: 'pending' },
  Ar: { mode: 'pending' },
  Ne: { mode: 'pending' },
  Kr: { mode: 'pending' },
  Xe: { mode: 'pending' },

  /* ---- solo, portrait not yet sourced ---- */
  P:  { mode: 'pending' }, As: { mode: 'pending' }, Zn: { mode: 'pending' },
  Bi: { mode: 'pending' }, Pt: { mode: 'pending' }, Mn: { mode: 'pending' },
  Mo: { mode: 'pending' }, Te: { mode: 'pending' }, Ni: { mode: 'pending' },
  Co: { mode: 'pending' }, Y:  { mode: 'pending' }, I:  { mode: 'pending' },
  Cd: { mode: 'pending' }, Li: { mode: 'pending' }, Al: { mode: 'pending' },
  Br: { mode: 'pending' }, Tl: { mode: 'pending' }, F:  { mode: 'pending' },
  Ga: { mode: 'pending' }, Sm: { mode: 'pending' }, Dy: { mode: 'pending' },
  Ge: { mode: 'pending' }, Sc: { mode: 'pending' }, Tm: { mode: 'pending' },
  Ho: { mode: 'pending' }, Gd: { mode: 'pending' }, Yb: { mode: 'pending' },
  Ac: { mode: 'pending' }, Eu: { mode: 'pending' }, Lu: { mode: 'pending' },
  Rn: { mode: 'pending' }, Fr: { mode: 'pending' }, Pd: { mode: 'pending' },
  Rh: { mode: 'pending' }, Ir: { mode: 'pending' }, Os: { mode: 'pending' },
  Pr: { mode: 'pending' }, Nd: { mode: 'pending' }, B:  { mode: 'pending' },
  Zr: { mode: 'pending' }, Nb: { mode: 'pending' }, Ru: { mode: 'pending' },
  Ta: { mode: 'pending' }, La: { mode: 'pending' }, Pm: { mode: 'pending' },
  Tb: { mode: 'pending' }, Er: { mode: 'pending' }, U:  { mode: 'pending' },
  Be: { mode: 'pending' }, Ti: { mode: 'pending' }, V:  { mode: 'pending' },
  Cr: { mode: 'pending' },

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
  Og: { mode: 'many', year: 2002, location: "Dubna, Russia",
    people: [
      { name: "Yuri Oganessian", nationality: "Russian (Armenian descent)", profession: "Nuclear physicist" },
      { name: "and colleagues at JINR Dubna & Lawrence Livermore", nationality: "Russian & American", profession: "Nuclear physicists" },
    ],
    paragraph: "The heaviest element on the periodic table, oganesson is named after Yuri Oganessian himself — one of only two elements ever named for a living person at the time of naming. As of 2026 he's still an active nuclear physicist at Dubna, now in his nineties." },
};
