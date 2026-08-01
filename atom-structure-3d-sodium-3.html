<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Hylogos — 3D Atom Structure</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r127/three.min.js"></script>
<style>
  :root{
    --bg:#020204; --panel:#0d1424ee; --line:#1b2436;
    --proton:#ff2ecc; --neutron:#ff9a33; --electron:#3a6bff; --gold:#ffb84d;
    --ink:#e8ecf4; --ink-dim:#8b96ab;
  }
  *{box-sizing:border-box;}
  html,body{ margin:0; height:100%; overflow:hidden; background:#000; color:var(--ink); font-family:'IBM Plex Mono',monospace; }
  #canvas-holder{ position:fixed; inset:0; }
  canvas{ display:block; touch-action:none; }

  .hud{ position:fixed; inset:0; pointer-events:none; display:flex; flex-direction:column; }
  .hud > *{ pointer-events:auto; }

  header{ padding:20px 20px 8px; display:flex; align-items:flex-start; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .title-block .eyebrow{ font-size:11px; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); margin:0 0 6px; }
  .title-block h1{ font-family:'Space Grotesk',sans-serif; font-weight:700; font-size:clamp(20px,3.4vw,30px); margin:0; letter-spacing:.02em; }
  .title-block h1 span{ color:var(--ink-dim); font-weight:500; font-size:0.7em; }
  .atomic-num{ font-size:12px; color:var(--ink-dim); margin:4px 0 10px; }
  .count-legend{ display:flex; flex-direction:column; gap:6px; margin-bottom:10px; }
  .count-legend .row{ display:flex; align-items:center; gap:9px; font-size:13px; color:#f0f2f7; }
  .count-legend .dot{ width:15px; height:15px; border-radius:50%; border:2.5px solid currentColor; background:transparent; box-shadow:0 0 9px currentColor; }
  .hint{ font-size:11px; color:var(--ink-dim); margin-top:2px; max-width:340px; line-height:1.5; }

  .controls{ display:flex; flex-direction:column; align-items:flex-end; gap:8px; }
  select{
    background:var(--panel); color:var(--ink); border:1px solid var(--line); border-radius:8px;
    padding:8px 10px; font-family:'IBM Plex Mono',monospace; font-size:12px; max-width:220px;
  }
  .note{ font-size:10px; color:var(--ink-dim); max-width:220px; text-align:right; line-height:1.4; }
  .iconbtn{
    background:var(--panel); border:1px solid var(--line); color:var(--ink); border-radius:8px;
    padding:7px 11px; font-size:11px; cursor:pointer; font-family:'IBM Plex Mono',monospace;
  }
  .iconbtn:hover{ border-color:#33415c; }

  .info-panel{
    position:absolute; right:18px; bottom:18px; width:260px;
    background:var(--panel); border:1px solid var(--line); border-radius:12px; padding:14px 16px;
    font-size:12px; line-height:1.7; max-height:46vh; overflow-y:auto;
  }
  .info-panel .t-title{ font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:15px; margin-bottom:2px; }
  .info-panel .t-sub{ color:var(--ink-dim); font-size:11px; margin-bottom:8px; }
  .info-panel .row{ display:flex; justify-content:space-between; gap:10px; color:var(--ink-dim); }
  .info-panel .row b{ color:var(--ink); font-weight:500; }
  .info-panel .config{ margin-top:8px; padding-top:8px; border-top:1px solid var(--line); word-break:break-word; color:var(--ink); }
  .tag{ display:inline-block; font-size:10px; letter-spacing:.05em; padding:2px 7px; border-radius:5px; margin-top:8px; background:#ffb84d26; color:var(--gold); }

  ::-webkit-scrollbar{ width:6px; } ::-webkit-scrollbar-thumb{ background:#243146; border-radius:3px; }
</style>
</head>
<body>
<div id="canvas-holder"></div>

<div class="hud">
  <header>
    <div class="title-block">
      <p class="eyebrow">Hylogos · Atomic Structure</p>
      <h1 id="title">SODIUM <span>(Na)</span></h1>
      <p class="atomic-num" id="atomic-num">Atomic number: 11</p>
      <div class="count-legend">
        <div class="row"><i class="dot" style="color:#ff158f"></i>Protons (<span id="proton-count">11</span>)</div>
        <div class="row"><i class="dot" style="color:#ff6a12"></i>Neutrons (<span id="neutron-count">12</span>)</div>
        <div class="row"><i class="dot" style="color:#1a56ff"></i>Electrons (<span id="electron-count">11</span>)</div>
      </div>
      <p class="hint">Drag to rotate · scroll or pinch to zoom · click a proton, neutron or electron to inspect it.</p>
    </div>
    <div class="controls">
      <select id="element-select"></select>
      <button class="iconbtn" id="motion-toggle">⏸ pause motion</button>
      <p class="note">Mass numbers use common/most-stable isotopes — swap in exact values once your database is populated.</p>
    </div>
  </header>
</div>

<div class="info-panel" id="info-panel"></div>

<script>
/* =========================================================
   DATA — all 118 elements. massNumber ≈ common isotope / Z.
========================================================= */
const ELEMENTS = [
[1,'H','Hydrogen',1],[2,'He','Helium',4],[3,'Li','Lithium',7],[4,'Be','Beryllium',9],
[5,'B','Boron',11],[6,'C','Carbon',12],[7,'N','Nitrogen',14],[8,'O','Oxygen',16],
[9,'F','Fluorine',19],[10,'Ne','Neon',20],[11,'Na','Sodium',23],[12,'Mg','Magnesium',24],
[13,'Al','Aluminium',27],[14,'Si','Silicon',28],[15,'P','Phosphorus',31],[16,'S','Sulfur',32],
[17,'Cl','Chlorine',35],[18,'Ar','Argon',40],[19,'K','Potassium',39],[20,'Ca','Calcium',40],
[21,'Sc','Scandium',45],[22,'Ti','Titanium',48],[23,'V','Vanadium',51],[24,'Cr','Chromium',52],
[25,'Mn','Manganese',55],[26,'Fe','Iron',56],[27,'Co','Cobalt',59],[28,'Ni','Nickel',59],
[29,'Cu','Copper',64],[30,'Zn','Zinc',65],[31,'Ga','Gallium',70],[32,'Ge','Germanium',73],
[33,'As','Arsenic',75],[34,'Se','Selenium',79],[35,'Br','Bromine',80],[36,'Kr','Krypton',84],
[37,'Rb','Rubidium',85],[38,'Sr','Strontium',88],[39,'Y','Yttrium',89],[40,'Zr','Zirconium',91],
[41,'Nb','Niobium',93],[42,'Mo','Molybdenum',96],[43,'Tc','Technetium',98],[44,'Ru','Ruthenium',101],
[45,'Rh','Rhodium',103],[46,'Pd','Palladium',106],[47,'Ag','Silver',108],[48,'Cd','Cadmium',112],
[49,'In','Indium',115],[50,'Sn','Tin',119],[51,'Sb','Antimony',122],[52,'Te','Tellurium',128],
[53,'I','Iodine',127],[54,'Xe','Xenon',131],[55,'Cs','Caesium',133],[56,'Ba','Barium',137],
[57,'La','Lanthanum',139],[58,'Ce','Cerium',140],[59,'Pr','Praseodymium',141],[60,'Nd','Neodymium',144],
[61,'Pm','Promethium',145],[62,'Sm','Samarium',150],[63,'Eu','Europium',152],[64,'Gd','Gadolinium',157],
[65,'Tb','Terbium',159],[66,'Dy','Dysprosium',163],[67,'Ho','Holmium',165],[68,'Er','Erbium',167],
[69,'Tm','Thulium',169],[70,'Yb','Ytterbium',173],[71,'Lu','Lutetium',175],[72,'Hf','Hafnium',178],
[73,'Ta','Tantalum',181],[74,'W','Tungsten',184],[75,'Re','Rhenium',186],[76,'Os','Osmium',190],
[77,'Ir','Iridium',192],[78,'Pt','Platinum',195],[79,'Au','Gold',197],[80,'Hg','Mercury',201],
[81,'Tl','Thallium',204],[82,'Pb','Lead',207],[83,'Bi','Bismuth',209],[84,'Po','Polonium',209],
[85,'At','Astatine',210],[86,'Rn','Radon',222],[87,'Fr','Francium',223],[88,'Ra','Radium',226],
[89,'Ac','Actinium',227],[90,'Th','Thorium',232],[91,'Pa','Protactinium',231],[92,'U','Uranium',238],
[93,'Np','Neptunium',237],[94,'Pu','Plutonium',244],[95,'Am','Americium',243],[96,'Cm','Curium',247],
[97,'Bk','Berkelium',247],[98,'Cf','Californium',251],[99,'Es','Einsteinium',252],[100,'Fm','Fermium',257],
[101,'Md','Mendelevium',258],[102,'No','Nobelium',259],[103,'Lr','Lawrencium',266],[104,'Rf','Rutherfordium',267],
[105,'Db','Dubnium',268],[106,'Sg','Seaborgium',269],[107,'Bh','Bohrium',270],[108,'Hs','Hassium',269],
[109,'Mt','Meitnerium',278],[110,'Ds','Darmstadtium',281],[111,'Rg','Roentgenium',282],[112,'Cn','Copernicium',285],
[113,'Nh','Nihonium',286],[114,'Fl','Flerovium',289],[115,'Mc','Moscovium',290],[116,'Lv','Livermorium',293],
[117,'Ts','Tennessine',294],[118,'Og','Oganesson',294]
].map(([z,symbol,name,a])=>({z,symbol,name,a}));

/* =========================================================
   ELECTRON CONFIGURATION ENGINE — works for any Z (1–118)
========================================================= */
const MADELUNG_ORDER = [
  [1,0,'1s'],[2,0,'2s'],[2,1,'2p'],[3,0,'3s'],[3,1,'3p'],[4,0,'4s'],[3,2,'3d'],[4,1,'4p'],
  [5,0,'5s'],[4,2,'4d'],[5,1,'5p'],[6,0,'6s'],[4,3,'4f'],[5,2,'5d'],[6,1,'6p'],
  [7,0,'7s'],[5,3,'5f'],[6,2,'6d'],[7,1,'7p']
];
const SUBSHELL_CLASS = {0:'s',1:'p',2:'d',3:'f'};

function getElectronConfig(Z){
  let remaining = Z;
  const subshells = [];
  for (const [n,l,label] of MADELUNG_ORDER){
    if (remaining <= 0) break;
    const cap = 2 * (2*l + 1);
    const count = Math.min(cap, remaining);
    subshells.push({n,l,label,count,cap});
    remaining -= count;
  }
  return subshells;
}
function assignOrbitals(count, orbitals){ // Hund's rule: fill singly first, then pair
  const slots = new Array(orbitals).fill(0);
  let rem = count;
  for (let i=0;i<orbitals && rem>0;i++){ slots[i]=1; rem--; }
  for (let i=0;i<orbitals && rem>0;i++){ slots[i]=2; rem--; }
  return slots;
}
const SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const toSup = n => String(n).split('').map(d=>SUP[d]).join('');
const configString = subshells => subshells.map(s=>s.label+toSup(s.count)).join(' ');

/* =========================================================
   THREE.JS SETUP — flat, straight-on composition
========================================================= */
const holder = document.getElementById('canvas-holder');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.FogExp2(0x000000, 0.01);

const camera = new THREE.PerspectiveCamera(42, innerWidth/innerHeight, 0.1, 500);
let camDistance = 26;
camera.position.set(0, 0, camDistance);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({ antialias:true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.NoToneMapping; // ACES was crushing/greying out the saturated emissive colors — raw output keeps them punchy
holder.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 0.08));
const keyLight = new THREE.DirectionalLight(0xffffff, 0.35);
keyLight.position.set(-7,9,10); scene.add(keyLight);
const fillLight = new THREE.DirectionalLight(0xffffff, 0.1);
fillLight.position.set(8,-3,-6); scene.add(fillLight);
const rimLight = new THREE.PointLight(0xffa64d, 0.3, 60);
rimLight.position.set(6,3,-10); scene.add(rimLight);

const atomGroup = new THREE.Object3D();
scene.add(atomGroup);
const nucleusGroup = new THREE.Object3D(); atomGroup.add(nucleusGroup);
const electronsGroup = new THREE.Object3D(); atomGroup.add(electronsGroup);

/* =========================================================
   SHARED GLOW SPRITE TEXTURE + HELPER
   Every particle gets its own permanent soft neon halo;
   selecting a particle simply grows/brightens its own halo.
========================================================= */
function makeGlowTexture(){
  const size = 128;
  const c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
  return new THREE.CanvasTexture(c);
}
const glowTexture = makeGlowTexture();
function attachGlow(mesh, color, scale, baseOpacity){
  // inner: tight, bright halo hugging the sphere
  const innerMat = new THREE.SpriteMaterial({
    map:glowTexture, color, transparent:true,
    blending:THREE.AdditiveBlending, depthWrite:false, opacity:baseOpacity
  });
  const inner = new THREE.Sprite(innerMat);
  inner.scale.set(scale, scale, scale);
  mesh.add(inner);

  // outer: big, soft haze that actually bleeds into the black background
  const outerMat = new THREE.SpriteMaterial({
    map:glowTexture, color, transparent:true,
    blending:THREE.AdditiveBlending, depthWrite:false, opacity:baseOpacity*0.45
  });
  const outer = new THREE.Sprite(outerMat);
  const outerScale = scale*2.6;
  outer.scale.set(outerScale, outerScale, outerScale);
  mesh.add(outer);

  mesh.userData.glow = inner;
  mesh.userData.glowOuter = outer;
  mesh.userData.glowBaseScale = scale;
  mesh.userData.glowBaseOpacity = baseOpacity;
  mesh.userData.glowOuterBaseScale = outerScale;
  mesh.userData.glowOuterBaseOpacity = baseOpacity*0.45;
}

/* =========================================================
   NUCLEUS — packed 3D cluster, vivid magenta protons / warm orange neutrons
========================================================= */
const NUCLEON_R = 0.52;
const NUCLEON_SPACING = NUCLEON_R * 2.05;
const PROTON_COLOR = 0xff0fc4, NEUTRON_COLOR = 0xff7000; // sampled from reference image's own nucleus pixels
const PROTON_BASE_EMISSIVE = 1.6, NEUTRON_BASE_EMISSIVE = 1.5;
const protonMat = () => new THREE.MeshPhysicalMaterial({ color:PROTON_COLOR, emissive:PROTON_COLOR, emissiveIntensity:PROTON_BASE_EMISSIVE, metalness:0, roughness:0.35, clearcoat:0.6, clearcoatRoughness:0.25 });
const neutronMat = () => new THREE.MeshPhysicalMaterial({ color:NEUTRON_COLOR, emissive:NEUTRON_COLOR, emissiveIntensity:NEUTRON_BASE_EMISSIVE, metalness:0, roughness:0.35, clearcoat:0.6, clearcoatRoughness:0.25 });
const nucleonGeo = new THREE.SphereGeometry(NUCLEON_R, 24, 24);

function seededShuffle(arr, seed){
  let s = seed;
  const rnd = () => { s = (s*9301+49297) % 233280; return s/233280; };
  const a = arr.slice();
  for (let i=a.length-1;i>0;i--){ const j = Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function seededRandom(seed){
  let s = seed;
  return () => { s = (s*9301+49297) % 233280; return s/233280; };
}
// Organic random sphere-packing: drop nucleons one at a time into a slowly
// growing ball, rejecting positions that overlap too much with existing
// ones. Produces a round, grape-cluster look instead of a cubic lattice.
function packNucleus(count){
  const rnd = seededRandom(13);
  const minDist = NUCLEON_R * 1.5; // heavier overlap so spheres fuse into one dense, compact ball
  const pts = [];
  let radius = NUCLEON_R * 1.15;
  let stall = 0;
  while (pts.length < count){
    const u = rnd(), v = rnd();
    const theta = Math.acos(2*u - 1), phi = 2*Math.PI*v;
    const r = radius * Math.cbrt(rnd());
    const candidate = new THREE.Vector3(
      r * Math.sin(theta) * Math.cos(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(theta)
    );
    let ok = true;
    for (let i=0;i<pts.length;i++){
      if (candidate.distanceTo(pts[i]) < minDist){ ok = false; break; }
    }
    if (ok){ pts.push(candidate); stall = 0; }
    else if (++stall > 80){ radius *= 1.025; stall = 0; }
  }
  // recenter on centroid so the cluster sits exactly at the origin
  const centroid = pts.reduce((a,p)=>a.add(p), new THREE.Vector3()).multiplyScalar(1/pts.length);
  pts.forEach(p => p.sub(centroid));
  return pts;
}

let nucleonMeshes = [];
function buildNucleus(Z, A){
  nucleusGroup.clear();
  nucleonMeshes = [];
  const N = A - Z;
  const total = Z + N;
  const positions = packNucleus(total);
  let kinds = new Array(Z).fill('proton').concat(new Array(Math.max(N,0)).fill('neutron'));
  kinds = seededShuffle(kinds, 7);
  kinds.forEach((kind, i) => {
    const color = kind==='proton' ? PROTON_COLOR : NEUTRON_COLOR;
    const mesh = new THREE.Mesh(nucleonGeo, kind==='proton' ? protonMat() : neutronMat());
    mesh.position.copy(positions[i]);
    mesh.userData = {
      kind, index:i,
      baseEmissive: kind==='proton' ? PROTON_BASE_EMISSIVE : NEUTRON_BASE_EMISSIVE,
      color
    };
    attachGlow(mesh, color, NUCLEON_R*1.6, 0.2);
    nucleusGroup.add(mesh);
    nucleonMeshes.push(mesh);
  });

  // one soft shared halo behind the whole cluster (reads as a gentle
  // magenta/orange bloom around the nucleus, like the reference image,
  // instead of dozens of overlapping per-sphere glows washing out to white)
  const clusterRadius = Math.max(...positions.map(p=>p.length())) + NUCLEON_R;
  const clusterMat = new THREE.SpriteMaterial({
    map: glowTexture, color: 0xff2a4d, transparent: true,
    blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.4
  });
  const clusterGlow = new THREE.Sprite(clusterMat);
  const clusterScale = clusterRadius * 3.6;
  clusterGlow.scale.set(clusterScale, clusterScale, clusterScale);
  clusterGlow.renderOrder = -1;
  nucleusGroup.add(clusterGlow);
}

/* =========================================================
   ELECTRONS — classic flat Bohr shells (2-8-1 style), all in
   one shared plane so the default view shows perfect circles.
   Subshell detail (s/p/d/f, ml, spin) is preserved per-electron
   for the info panel even though shells render as one ring.
========================================================= */
const ELECTRON_R = 0.32;
const ELECTRON_COLOR = 0x1e6bff; // sampled from reference image's electron pixels
const ELECTRON_BASE_EMISSIVE = 1.7;
const electronGeo = new THREE.SphereGeometry(ELECTRON_R, 20, 20);
const BASE_RADIUS = 4.6, SHELL_STEP = 2.3;

let electronMeshes = [];
let spinGroups = [];
let sparkles = [];
let maxOrbitRadius = 6;

function makeThreadCurve(radius, ampFraction, periods, phase){
  // a circle with a very fine sinusoidal wobble — used to weave a second
  // thin strand around the main circle for that entwined "string" look
  const pts = [];
  const segments = 240;
  for (let i=0;i<=segments;i++){
    const theta = (i/segments) * Math.PI*2;
    const r = radius * (1 + ampFraction*Math.sin(periods*theta + phase));
    pts.push(new THREE.Vector3(Math.cos(theta)*r, Math.sin(theta)*r, ampFraction*radius*0.4*Math.sin(periods*theta + phase)));
  }
  return new THREE.CatmullRomCurve3(pts, true);
}

function buildRingVisual(radius, parent){
  const mainCurve = makeThreadCurve(radius, 0, 1, 0); // perfect circle backbone
  const twinCurve  = makeThreadCurve(radius, 0.014, 5, Math.random()*Math.PI*2); // fine woven twin strand

  // crisp bright core + soft halo for the primary thread — thicker and
  // glowier than before, with a wide bloom that bleeds well into the black
  const mainLayers = [
    { r:0.02,  opacity:1.0,  color:0xfff4d9 },
    { r:0.045, opacity:0.9,  color:0xffb133 },
    { r:0.09,  opacity:0.55, color:0xff7a02 },
    { r:0.16,  opacity:0.3,  color:0xe85600 },
    { r:0.28,  opacity:0.14, color:0xc44a00 },
    { r:0.44,  opacity:0.06, color:0xa63c00 }, // wide ambient bloom bleeding into the black
  ];
  mainLayers.forEach(layer => {
    const geo = new THREE.TubeGeometry(mainCurve, 240, layer.r, 8, true);
    const mat = new THREE.MeshBasicMaterial({ color:layer.color, transparent:true, opacity:layer.opacity, blending:THREE.AdditiveBlending, depthWrite:false });
    parent.add(new THREE.Mesh(geo, mat));
  });

  // thicker, more visible twin strand woven around the main thread
  const twinLayers = [
    { r:0.013, opacity:0.9,  color:0xffe3a8 },
    { r:0.032, opacity:0.5,  color:0xff9a2e },
    { r:0.06,  opacity:0.22, color:0xe85600 },
  ];
  twinLayers.forEach(layer => {
    const geo = new THREE.TubeGeometry(twinCurve, 240, layer.r, 6, true);
    const mat = new THREE.MeshBasicMaterial({ color:layer.color, transparent:true, opacity:layer.opacity, blending:THREE.AdditiveBlending, depthWrite:false });
    parent.add(new THREE.Mesh(geo, mat));
  });

  // dust/embers flying off the thread — a dense skin hugging the ring plus
  // a sparser outer scatter of particles drifting further away from it
  const emberCount = Math.max(90, Math.round(radius*30));
  for (let i=0;i<emberCount;i++){
    const theta = Math.random()*Math.PI*2;
    const flyingOff = Math.random() < 0.35;
    const spread = flyingOff
      ? (Math.random()*Math.random()) * radius*0.55 * (Math.random()<0.5?-1:1) // occasional particles thrown further out
      : (Math.random()+Math.random()+Math.random()-1.5) * radius*0.09;
    const r = radius + spread;
    const z = (Math.random()-0.5) * radius*0.1;
    const big = Math.random() < 0.14;
    const size = big ? (0.15+Math.random()*0.18) : (0.02+Math.random()*0.08);
    const opacity = big ? (0.6+Math.random()*0.35) : (0.18+Math.random()*0.5);
    const roll = Math.random();
    const color = roll < 0.45 ? 0xfff2c9 : (roll < 0.8 ? 0xffb84d : 0xff8a1a);
    const mat = new THREE.SpriteMaterial({ map:glowTexture, color, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(size,size,size);
    sprite.position.set(Math.cos(theta)*r, Math.sin(theta)*r, z);
    parent.add(sprite);
  }

  // a handful of brighter glints drifting along the thread for a touch of motion
  for (let i=0;i<7;i++){
    const sc = 0.14 + Math.random()*0.12;
    const mat = new THREE.SpriteMaterial({ map:glowTexture, color:0xfff6e0, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.85 });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(sc,sc,sc);
    parent.add(sprite);
    sparkles.push({ sprite, curve:mainCurve, phase: Math.random(), speed: 0.18 + Math.random()*0.22 });
  }
}

function buildElectrons(Z){
  electronsGroup.clear();
  electronMeshes = [];
  spinGroups = [];
  sparkles = [];
  maxOrbitRadius = 6;
  const subshells = getElectronConfig(Z);

  const shellMap = new Map();
  subshells.forEach(sub => {
    if (!shellMap.has(sub.n)) shellMap.set(sub.n, []);
    const orbitals = 2*sub.l + 1;
    const slots = assignOrbitals(sub.count, orbitals);
    for (let o=0;o<orbitals;o++){
      for (let e=0;e<slots[o];e++){
        shellMap.get(sub.n).push({ label:sub.label, l:sub.l, ml:o-sub.l, spin: e===0?'+1/2 ↑':'-1/2 ↓' });
      }
    }
  });

  const shellNs = [...shellMap.keys()].sort((a,b)=>a-b);
  const maxN = Math.max(...shellNs);

  shellNs.forEach(n => {
    const info = shellMap.get(n);
    const count = info.length;
    const radius = BASE_RADIUS + (n-1)*SHELL_STEP;
    maxOrbitRadius = Math.max(maxOrbitRadius, radius);
    buildRingVisual(radius, electronsGroup);

    const spinGroup = new THREE.Object3D();
    spinGroup.rotation.z = Math.random()*Math.PI*2;
    spinGroup.userData.speed = 0.3/Math.sqrt(n);
    electronsGroup.add(spinGroup);
    spinGroups.push(spinGroup);

    info.forEach((d, idx) => {
      const angle = (idx/count) * Math.PI*2;
      const mat = new THREE.MeshPhysicalMaterial({ color:ELECTRON_COLOR, emissive:ELECTRON_COLOR, emissiveIntensity:ELECTRON_BASE_EMISSIVE, metalness:0, roughness:0.3, clearcoat:0.6, clearcoatRoughness:0.25 });
      const mesh = new THREE.Mesh(electronGeo, mat);
      mesh.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
      mesh.userData = {
        kind:'electron', n, label:d.label, l:d.l, ml:d.ml, spin:d.spin,
        isValence: n===maxN, baseEmissive:ELECTRON_BASE_EMISSIVE, color:ELECTRON_COLOR
      };
      attachGlow(mesh, ELECTRON_COLOR, ELECTRON_R*5.2, 0.5);
      spinGroup.add(mesh);
      electronMeshes.push(mesh);
    });
  });
}

function buildAtom(elData){
  const { z, a, symbol, name } = elData;
  buildNucleus(z, a);
  buildElectrons(z);
  document.getElementById('title').innerHTML = `${name.toUpperCase()} <span>(${symbol})</span>`;
  document.getElementById('atomic-num').textContent = `Atomic number: ${z}`;
  document.getElementById('proton-count').textContent = z;
  document.getElementById('neutron-count').textContent = a - z;
  document.getElementById('electron-count').textContent = z;
  showOverview(elData);
  camDistance = maxOrbitRadius * 2.3;
  camera.position.set(0, 0, camDistance);
  camera.lookAt(0,0,0);
  selected = null;
}

/* =========================================================
   INFO PANEL
========================================================= */
const infoPanel = document.getElementById('info-panel');
function showOverview(elData){
  const { z, a, symbol, name } = elData;
  const cfg = getElectronConfig(z);
  infoPanel.innerHTML = `
    <div class="t-title">${name} (${symbol})</div>
    <div class="t-sub">Overview — click any particle to inspect it</div>
    <div class="row"><span>Protons (Z)</span><b>${z}</b></div>
    <div class="row"><span>Neutrons (N)</span><b>${a-z}</b></div>
    <div class="row"><span>Mass number (A)</span><b>${a}</b></div>
    <div class="config">${configString(cfg)}</div>`;
}
function showNucleon(m){
  const kind = m.userData.kind;
  infoPanel.innerHTML = `
    <div class="t-title">${kind==='proton'?'Proton':'Neutron'}</div>
    <div class="t-sub">Part of the ${current.name} nucleus</div>
    <div class="row"><span>Charge</span><b>${kind==='proton'?'+1':'0'}</b></div>
    <div class="row"><span>Protons (Z)</span><b>${current.z}</b></div>
    <div class="row"><span>Neutrons (N)</span><b>${current.a-current.z}</b></div>
    <span class="tag">${kind}</span>`;
}
function showElectron(m){
  const d = m.userData;
  infoPanel.innerHTML = `
    <div class="t-title">Electron · ${d.label}</div>
    <div class="t-sub">${current.name} (${current.symbol})</div>
    <div class="row"><span>Shell</span><b>n = ${d.n}</b></div>
    <div class="row"><span>Subshell</span><b>${d.label}</b></div>
    <div class="row"><span>mₗ</span><b>${d.ml}</b></div>
    <div class="row"><span>Spin</span><b>${d.spin}</b></div>
    <span class="tag">${d.label} electron${d.isValence ? ' · valence shell' : ''}</span>`;
}

/* =========================================================
   ELEMENT SELECTOR
========================================================= */
let current = ELEMENTS.find(e=>e.symbol==='Na');
const select = document.getElementById('element-select');
ELEMENTS.forEach(e => {
  const opt = document.createElement('option');
  opt.value = e.symbol;
  opt.textContent = `${e.z} · ${e.symbol} — ${e.name}`;
  if (e.symbol === 'Na') opt.selected = true;
  select.appendChild(opt);
});
select.addEventListener('change', () => {
  current = ELEMENTS.find(e=>e.symbol===select.value);
  buildAtom(current);
});

/* =========================================================
   INTERACTION — drag to rotate, wheel/pinch to zoom, click to select
   Each particle already carries its own permanent glow sprite;
   selecting it just grows/brightens that same sprite.
========================================================= */
let selected = null;
function clearSelection(){
  if (selected){
    const g = selected.userData.glow, go = selected.userData.glowOuter;
    g.scale.set(selected.userData.glowBaseScale, selected.userData.glowBaseScale, selected.userData.glowBaseScale);
    g.material.opacity = selected.userData.glowBaseOpacity;
    go.scale.set(selected.userData.glowOuterBaseScale, selected.userData.glowOuterBaseScale, selected.userData.glowOuterBaseScale);
    go.material.opacity = selected.userData.glowOuterBaseOpacity;
    selected.material.emissiveIntensity = selected.userData.baseEmissive;
    selected.scale.set(1,1,1);
  }
  selected = null;
}
function selectMesh(m){
  clearSelection();
  selected = m;
  const isElectron = m.userData.kind === 'electron';
  const s = isElectron ? 1.4 : 1.25;
  m.scale.set(s,s,s);
  m.material.emissiveIntensity = isElectron ? 1.0 : 0.85;
  const g = m.userData.glow, go = m.userData.glowOuter;
  g.scale.set(m.userData.glowBaseScale*2.1, m.userData.glowBaseScale*2.1, m.userData.glowBaseScale*2.1);
  g.material.opacity = 0.95;
  go.scale.set(m.userData.glowOuterBaseScale*1.6, m.userData.glowOuterBaseScale*1.6, m.userData.glowOuterBaseScale*1.6);
  go.material.opacity = 0.55;
  if (isElectron) showElectron(m); else showNucleon(m);
}

const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
let dragging = false, downPos = {x:0,y:0}, lastPos = {x:0,y:0}, moved = false;
let rotX = 0, rotY = 0;

renderer.domElement.addEventListener('pointerdown', e => {
  dragging = true; moved = false;
  downPos = { x:e.clientX, y:e.clientY };
  lastPos = { x:e.clientX, y:e.clientY };
});
window.addEventListener('pointermove', e => {
  if (!dragging) return;
  const dx = e.clientX - lastPos.x, dy = e.clientY - lastPos.y;
  if (Math.abs(e.clientX-downPos.x) > 4 || Math.abs(e.clientY-downPos.y) > 4) moved = true;
  rotY += dx * 0.006;
  rotX += dy * 0.006;
  rotX = Math.max(-1.3, Math.min(1.3, rotX));
  lastPos = { x:e.clientX, y:e.clientY };
});
window.addEventListener('pointerup', e => {
  if (dragging && !moved){
    ndc.x = (e.clientX/innerWidth)*2 - 1;
    ndc.y = -(e.clientY/innerHeight)*2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(nucleonMeshes.concat(electronMeshes));
    if (hits.length) selectMesh(hits[0].object); else clearSelection();
  }
  dragging = false;
});
renderer.domElement.addEventListener('wheel', e => {
  e.preventDefault();
  camDistance = Math.max(6, Math.min(60, camDistance + e.deltaY*0.02));
}, { passive:false });

let pinchStart = null;
renderer.domElement.addEventListener('touchstart', e => {
  if (e.touches.length===2){
    const dx=e.touches[0].clientX-e.touches[1].clientX, dy=e.touches[0].clientY-e.touches[1].clientY;
    pinchStart = { dist: Math.hypot(dx,dy), camDistance };
  }
}, { passive:true });
renderer.domElement.addEventListener('touchmove', e => {
  if (e.touches.length===2 && pinchStart){
    const dx=e.touches[0].clientX-e.touches[1].clientX, dy=e.touches[0].clientY-e.touches[1].clientY;
    const dist = Math.hypot(dx,dy);
    camDistance = Math.max(6, Math.min(60, pinchStart.camDistance * (pinchStart.dist/dist)));
  }
}, { passive:true });

renderer.domElement.addEventListener('dblclick', () => {
  rotX = 0; rotY = 0; camDistance = maxOrbitRadius * 2.3;
});

/* =========================================================
   MOTION TOGGLE / REDUCED MOTION / VISIBILITY
========================================================= */
let paused = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionBtn = document.getElementById('motion-toggle');
motionBtn.textContent = paused ? '▶ resume motion' : '⏸ pause motion';
motionBtn.addEventListener('click', () => {
  paused = !paused;
  motionBtn.textContent = paused ? '▶ resume motion' : '⏸ pause motion';
});
let tabHidden = false;
document.addEventListener('visibilitychange', () => { tabHidden = document.hidden; });

/* =========================================================
   RESIZE + RENDER LOOP
========================================================= */
window.addEventListener('resize', () => {
  camera.aspect = innerWidth/innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

let sparkleClock = 0;
function animate(t){
  requestAnimationFrame(animate);
  atomGroup.rotation.x += (rotX - atomGroup.rotation.x) * 0.12;
  atomGroup.rotation.y += (rotY - atomGroup.rotation.y) * 0.12;
  camera.position.set(0, 0, camDistance);
  camera.lookAt(0,0,0);

  if (!paused && !tabHidden){
    spinGroups.forEach(g => g.rotation.z += g.userData.speed * 0.03);
    sparkleClock += 0.006;
    sparkles.forEach(s => {
      const u = ((sparkleClock*s.speed + s.phase) % 1 + 1) % 1;
      const pt = s.curve.getPointAt(u);
      s.sprite.position.set(pt.x, pt.y, 0);
    });
  }
  if (selected){
    const pulse = 1 + Math.sin((t||0)*0.005)*0.15;
    selected.userData.glow.material.opacity = 0.85*pulse;
  }
  renderer.render(scene, camera);
}

buildAtom(current);
animate();
</script>
</body>
</html>
