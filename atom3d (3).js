/* =========================================================================
   ATOM3D — Hylogos-style 3D atom viewer, wired into MatAI's own
   threeHost/clearThree/threeScene lifecycle (same pattern as drawMolecule).
   Uses the THREE + OrbitControls already loaded in index.html — no
   second three.js build is loaded, so nothing here can conflict with the
   molecule viewer's r147 build.
========================================================================= */

/* ---- mass numbers (A) for all 118 elements, keyed by symbol ----
   Only needed for neutron counts — data.js doesn't have these yet.
   Swap in exact isotope data once the main database is expanded. */
const ATOM_MASS = {
  H:1,He:4,Li:7,Be:9,B:11,C:12,N:14,O:16,F:19,Ne:20,Na:23,Mg:24,Al:27,Si:28,P:31,S:32,
  Cl:35,Ar:40,K:39,Ca:40,Sc:45,Ti:48,V:51,Cr:52,Mn:55,Fe:56,Co:59,Ni:59,Cu:64,Zn:65,
  Ga:70,Ge:73,As:75,Se:79,Br:80,Kr:84,Rb:85,Sr:88,Y:89,Zr:91,Nb:93,Mo:96,Tc:98,Ru:101,
  Rh:103,Pd:106,Ag:108,Cd:112,In:115,Sn:119,Sb:122,Te:128,I:127,Xe:131,Cs:133,Ba:137,
  La:139,Ce:140,Pr:141,Nd:144,Pm:145,Sm:150,Eu:152,Gd:157,Tb:159,Dy:163,Ho:165,Er:167,
  Tm:169,Yb:173,Lu:175,Hf:178,Ta:181,W:184,Re:186,Os:190,Ir:192,Pt:195,Au:197,Hg:201,
  Tl:204,Pb:207,Bi:209,Po:209,At:210,Rn:222,Fr:223,Ra:226,Ac:227,Th:232,Pa:231,U:238,
  Np:237,Pu:244,Am:243,Cm:247,Bk:247,Cf:251,Es:252,Fm:257,Md:258,No:259,Lr:266,Rf:267,
  Db:268,Sg:269,Bh:270,Hs:269,Mt:278,Ds:281,Rg:282,Cn:285,Nh:286,Fl:289,Mc:290,Lv:293,
  Ts:294,Og:294
};

/* ---- electron configuration engine (Aufbau/Madelung + Hund's rule) ----
   Works for any Z, so it doesn't matter how many elements data.js knows
   about yet — this covers the full range as the database grows. */
const ATOM3D_MADELUNG = [
  [1,0,'1s'],[2,0,'2s'],[2,1,'2p'],[3,0,'3s'],[3,1,'3p'],[4,0,'4s'],[3,2,'3d'],[4,1,'4p'],
  [5,0,'5s'],[4,2,'4d'],[5,1,'5p'],[6,0,'6s'],[4,3,'4f'],[5,2,'5d'],[6,1,'6p'],
  [7,0,'7s'],[5,3,'5f'],[6,2,'6d'],[7,1,'7p']
];
function atom3dConfig(Z){
  let remaining = Z;
  const subshells = [];
  for (const [n,l,label] of ATOM3D_MADELUNG){
    if (remaining <= 0) break;
    const cap = 2 * (2*l + 1);
    const count = Math.min(cap, remaining);
    subshells.push({n,l,label,count,cap});
    remaining -= count;
  }
  return subshells;
}
function atom3dAssignOrbitals(count, orbitals){ // Hund's rule: singly first, then pair
  const slots = new Array(orbitals).fill(0);
  let rem = count;
  for (let i=0;i<orbitals && rem>0;i++){ slots[i]=1; rem--; }
  for (let i=0;i<orbitals && rem>0;i++){ slots[i]=2; rem--; }
  return slots;
}
const ATOM3D_SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const atom3dSup = n => String(n).split('').map(d=>ATOM3D_SUP[d]).join('');
const atom3dConfigString = subshells => subshells.map(s=>s.label+atom3dSup(s.count)).join(' ');

/* ---- shared glow texture (built once, reused by every sprite) ---- */
let _atom3dGlowTex = null;
function atom3dGlowTexture(){
  if (_atom3dGlowTex) return _atom3dGlowTex;
  const size = 128;
  const c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
  _atom3dGlowTex = new THREE.CanvasTexture(c);
  return _atom3dGlowTex;
}
function atom3dAttachGlow(mesh, color, scale, baseOpacity){
  const tex = atom3dGlowTexture();
  const innerMat = new THREE.SpriteMaterial({ map:tex, color, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:baseOpacity });
  const inner = new THREE.Sprite(innerMat);
  inner.scale.set(scale, scale, scale);
  mesh.add(inner);

  const outerMat = new THREE.SpriteMaterial({ map:tex, color, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:baseOpacity*0.45 });
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

/* ---- nucleus: organic rejection-sampling packing (grape-cluster look) ---- */
const ATOM3D_NUCLEON_R = 0.52;
const ATOM3D_PROTON_COLOR = 0xff0fc4, ATOM3D_NEUTRON_COLOR = 0xff7000;
const ATOM3D_PROTON_EMISSIVE = 1.6, ATOM3D_NEUTRON_EMISSIVE = 1.5;

function atom3dSeededShuffle(arr, seed){
  let s = seed;
  const rnd = () => { s = (s*9301+49297) % 233280; return s/233280; };
  const a = arr.slice();
  for (let i=a.length-1;i>0;i--){ const j = Math.floor(rnd()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}
function atom3dSeededRandom(seed){
  let s = seed;
  return () => { s = (s*9301+49297) % 233280; return s/233280; };
}
function atom3dPackNucleus(count){
  const rnd = atom3dSeededRandom(13);
  const minDist = ATOM3D_NUCLEON_R * 1.5;
  const pts = [];
  let radius = ATOM3D_NUCLEON_R * 1.15;
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
  const centroid = pts.reduce((a,p)=>a.add(p), new THREE.Vector3()).multiplyScalar(1/pts.length);
  pts.forEach(p => p.sub(centroid));
  return pts;
}

function atom3dBuildNucleus(ctx, Z, A){
  const { nucleusGroup, glowTex } = ctx;
  const nucleonGeo = new THREE.SphereGeometry(ATOM3D_NUCLEON_R, 18, 18);
  const N = A - Z;
  const total = Z + N;
  const positions = atom3dPackNucleus(total);
  let kinds = new Array(Z).fill('proton').concat(new Array(Math.max(N,0)).fill('neutron'));
  kinds = atom3dSeededShuffle(kinds, 7);

  const nucleonMeshes = [];
  kinds.forEach((kind, i) => {
    const color = kind==='proton' ? ATOM3D_PROTON_COLOR : ATOM3D_NEUTRON_COLOR;
    const emissive = kind==='proton' ? ATOM3D_PROTON_EMISSIVE : ATOM3D_NEUTRON_EMISSIVE;
    const mat = new THREE.MeshPhysicalMaterial({ color, emissive:color, emissiveIntensity:emissive, metalness:0, roughness:0.35, clearcoat:0.6, clearcoatRoughness:0.25 });
    const mesh = new THREE.Mesh(nucleonGeo, mat);
    mesh.position.copy(positions[i]);
    mesh.userData = { kind, index:i, baseEmissive:emissive, color };
    atom3dAttachGlow(mesh, color, ATOM3D_NUCLEON_R*1.6, 0.2);
    nucleusGroup.add(mesh);
    nucleonMeshes.push(mesh);
  });

  const clusterRadius = Math.max(...positions.map(p=>p.length())) + ATOM3D_NUCLEON_R;
  const clusterMat = new THREE.SpriteMaterial({ map:glowTex, color:0xff2a4d, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.4 });
  const clusterGlow = new THREE.Sprite(clusterMat);
  const clusterScale = clusterRadius * 3.6;
  clusterGlow.scale.set(clusterScale, clusterScale, clusterScale);
  clusterGlow.renderOrder = -1;
  nucleusGroup.add(clusterGlow);

  return nucleonMeshes;
}

/* ---- electron shells: flat concentric "woven neon thread" rings ---- */
const ATOM3D_ELECTRON_R = 0.32;
const ATOM3D_ELECTRON_COLOR = 0x1e6bff;
const ATOM3D_ELECTRON_EMISSIVE = 1.7;
const ATOM3D_BASE_RADIUS = 4.6, ATOM3D_SHELL_STEP = 2.3;

function atom3dThreadCurve(radius, ampFraction, periods, phase){
  const pts = [];
  const segments = 240;
  for (let i=0;i<=segments;i++){
    const theta = (i/segments) * Math.PI*2;
    const r = radius * (1 + ampFraction*Math.sin(periods*theta + phase));
    pts.push(new THREE.Vector3(Math.cos(theta)*r, Math.sin(theta)*r, ampFraction*radius*0.4*Math.sin(periods*theta + phase)));
  }
  return new THREE.CatmullRomCurve3(pts, true);
}

function atom3dBuildRing(radius, parent, glowTex, sparkles){
  const mainCurve = atom3dThreadCurve(radius, 0, 1, 0);
  const twinCurve  = atom3dThreadCurve(radius, 0.014, 5, Math.random()*Math.PI*2);

  const mainLayers = [
    { r:0.022, opacity:1.0,  color:0xfff4d9 },
    { r:0.06,  opacity:0.7,  color:0xffb133 },
    { r:0.13,  opacity:0.32, color:0xe85600 },
    { r:0.24,  opacity:0.12, color:0xa63c00 },
  ];
  mainLayers.forEach(layer => {
    const geo = new THREE.TubeGeometry(mainCurve, 160, layer.r, 6, true);
    const mat = new THREE.MeshBasicMaterial({ color:layer.color, transparent:true, opacity:layer.opacity, blending:THREE.AdditiveBlending, depthWrite:false });
    parent.add(new THREE.Mesh(geo, mat));
  });

  const twinLayers = [
    { r:0.015, opacity:0.8, color:0xffe3a8 },
    { r:0.04,  opacity:0.35, color:0xe85600 },
  ];
  twinLayers.forEach(layer => {
    const geo = new THREE.TubeGeometry(twinCurve, 160, layer.r, 5, true);
    const mat = new THREE.MeshBasicMaterial({ color:layer.color, transparent:true, opacity:layer.opacity, blending:THREE.AdditiveBlending, depthWrite:false });
    parent.add(new THREE.Mesh(geo, mat));
  });

  const emberCount = Math.min(45, Math.max(18, Math.round(radius*5)));
  for (let i=0;i<emberCount;i++){
    const theta = Math.random()*Math.PI*2;
    const flyingOff = Math.random() < 0.35;
    const spread = flyingOff
      ? (Math.random()*Math.random()) * radius*0.55 * (Math.random()<0.5?-1:1)
      : (Math.random()+Math.random()+Math.random()-1.5) * radius*0.09;
    const r = radius + spread;
    const z = (Math.random()-0.5) * radius*0.1;
    const big = Math.random() < 0.14;
    const size = big ? (0.15+Math.random()*0.18) : (0.02+Math.random()*0.08);
    const opacity = big ? (0.6+Math.random()*0.35) : (0.18+Math.random()*0.5);
    const roll = Math.random();
    const color = roll < 0.45 ? 0xfff2c9 : (roll < 0.8 ? 0xffb84d : 0xff8a1a);
    const mat = new THREE.SpriteMaterial({ map:glowTex, color, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(size,size,size);
    sprite.position.set(Math.cos(theta)*r, Math.sin(theta)*r, z);
    parent.add(sprite);
  }

  for (let i=0;i<4;i++){
    const sc = 0.14 + Math.random()*0.12;
    const mat = new THREE.SpriteMaterial({ map:glowTex, color:0xfff6e0, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:0.85 });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(sc,sc,sc);
    parent.add(sprite);
    sparkles.push({ sprite, curve:mainCurve, phase: Math.random(), speed: 0.18 + Math.random()*0.22 });
  }
}

function atom3dBuildElectrons(ctx, Z){
  const { electronsGroup, glowTex } = ctx;
  const electronGeo = new THREE.SphereGeometry(ATOM3D_ELECTRON_R, 16, 16);
  const spinGroups = [], sparkles = [], electronMeshes = [];
  let maxOrbitRadius = 6;

  const subshells = atom3dConfig(Z);
  const shellMap = new Map();
  subshells.forEach(sub => {
    if (!shellMap.has(sub.n)) shellMap.set(sub.n, []);
    const orbitals = 2*sub.l + 1;
    const slots = atom3dAssignOrbitals(sub.count, orbitals);
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
    const radius = ATOM3D_BASE_RADIUS + (n-1)*ATOM3D_SHELL_STEP;
    maxOrbitRadius = Math.max(maxOrbitRadius, radius);
    atom3dBuildRing(radius, electronsGroup, glowTex, sparkles);

    const spinGroup = new THREE.Object3D();
    spinGroup.rotation.z = Math.random()*Math.PI*2;
    spinGroup.userData.speed = 0.3/Math.sqrt(n);
    electronsGroup.add(spinGroup);
    spinGroups.push(spinGroup);

    info.forEach((d, idx) => {
      const angle = (idx/count) * Math.PI*2;
      const mat = new THREE.MeshPhysicalMaterial({ color:ATOM3D_ELECTRON_COLOR, emissive:ATOM3D_ELECTRON_COLOR, emissiveIntensity:ATOM3D_ELECTRON_EMISSIVE, metalness:0, roughness:0.3, clearcoat:0.6, clearcoatRoughness:0.25 });
      const mesh = new THREE.Mesh(electronGeo, mat);
      mesh.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
      mesh.userData = {
        kind:'electron', n, label:d.label, l:d.l, ml:d.ml, spin:d.spin,
        isValence: n===maxN, baseEmissive:ATOM3D_ELECTRON_EMISSIVE, color:ATOM3D_ELECTRON_COLOR
      };
      atom3dAttachGlow(mesh, ATOM3D_ELECTRON_COLOR, ATOM3D_ELECTRON_R*5.2, 0.5);
      spinGroup.add(mesh);
      electronMeshes.push(mesh);
    });
  });

  return { spinGroups, sparkles, electronMeshes, maxOrbitRadius };
}

/* ---- info panel (click a particle to inspect it) ---- */
function atom3dMakeInfoPanel(host){
  const panel = document.createElement('div');
  panel.id = 'atom3d-info';
  Object.assign(panel.style, {
    position:'absolute', right:'10px', bottom:'10px', width:'150px',
    background:'var(--panel)', border:'1px solid var(--line)', borderRadius:'10px',
    padding:'8px 10px', fontFamily:'var(--font-mono)', fontSize:'10.5px', lineHeight:'1.55',
    color:'var(--text-main)', maxHeight:'42%', overflowY:'auto', pointerEvents:'none',
    zIndex:'2', display:'none', opacity:'0.94'
  });
  host.appendChild(panel);
  return panel;
}
function atom3dCloseBtn(){
  return `<div class="atom3d-close" style="position:absolute;top:4px;right:6px;pointer-events:auto;cursor:pointer;color:var(--text-dim);font-size:13px;line-height:1">×</div>`;
}
function atom3dRow(label, value){
  return `<div style="display:flex;justify-content:space-between;gap:8px;color:var(--text-dim)"><span>${label}</span><b style="color:var(--text-main);font-weight:500">${value}</b></div>`;
}
function atom3dShowOverview(panel, symbol, name, z, a){
  const cfg = atom3dConfig(z);
  panel.innerHTML = `
    <div style="font-family:var(--font-display);font-weight:600;font-size:13px;margin-bottom:2px">${name} (${symbol})</div>
    <div style="color:var(--text-dim);font-size:10px;margin-bottom:6px">tap a particle to inspect it</div>
    ${atom3dRow('Protons (Z)', z)}
    ${atom3dRow('Neutrons (N)', a-z)}
    ${atom3dRow('Mass number (A)', a)}
    <div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--line)">${atom3dConfigString(cfg)}</div>`;
}
function atom3dShowNucleon(panel, m, name){
  const kind = m.userData.kind;
  panel.innerHTML = `
    ${atom3dCloseBtn()}
    <div style="font-family:var(--font-display);font-weight:600;font-size:12.5px">${kind==='proton'?'Proton':'Neutron'}</div>
    <div style="color:var(--text-dim);font-size:9.5px;margin-bottom:6px">part of the ${name} nucleus</div>
    ${atom3dRow('Charge', kind==='proton'?'+1':'0')}`;
}
function atom3dShowElectron(panel, m, symbol, name){
  const d = m.userData;
  panel.innerHTML = `
    ${atom3dCloseBtn()}
    <div style="font-family:var(--font-display);font-weight:600;font-size:12.5px">Electron · ${d.label}</div>
    <div style="color:var(--text-dim);font-size:9.5px;margin-bottom:6px">${name} (${symbol})</div>
    ${atom3dRow('Shell', 'n = ' + d.n)}
    ${atom3dRow('Subshell', d.label)}
    ${atom3dRow('mₗ', d.ml)}
    ${atom3dRow('Spin', d.spin)}
    ${d.isValence ? '<div style="margin-top:4px;font-size:9.5px;color:#ffb84d">valence shell</div>' : ''}`;
}

/* =========================================================================
   MAIN ENTRY POINT — call this instead of drawBohr() for element results.
   Mirrors drawMolecule()'s lifecycle exactly so the existing clearThree()
   cleanup in script.js works for atoms too, with no changes needed there.
========================================================================= */
function drawAtom3D(symbol, elData) {
  const host = els.threeHost;
  const width = host.clientWidth || 400;
  const height = host.clientHeight || 340;
  const name = elData.name, z = elData.z;
  const a = ATOM_MASS[symbol] || Math.round(z * 2.05); // fallback estimate if a symbol isn't in the table yet

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.01);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 500);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(width, height);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping; // keeps the saturated emissive colors punchy
  host.appendChild(renderer.domElement);

  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.warn('atom3d: WebGL context lost, will rebuild on restore');
  }, false);
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    if (typeof currentSubject !== 'undefined' && currentSubject) {
      showSubject(currentSubject);
    }
  }, false);

  scene.add(new THREE.AmbientLight(0xffffff, 0.08));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.35);
  keyLight.position.set(-7,9,10); scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.1);
  fillLight.position.set(8,-3,-6); scene.add(fillLight);
  const rimLight = new THREE.PointLight(0xffa64d, 0.3, 60);
  rimLight.position.set(6,3,-10); scene.add(rimLight);

  const atomGroup = new THREE.Object3D(); scene.add(atomGroup);
  const nucleusGroup = new THREE.Object3D(); atomGroup.add(nucleusGroup);
  const electronsGroup = new THREE.Object3D(); atomGroup.add(electronsGroup);
  const glowTex = atom3dGlowTexture();
  const ctx = { nucleusGroup, electronsGroup, glowTex };

  const nucleonMeshes = atom3dBuildNucleus(ctx, z, a);
  const { spinGroups, sparkles, electronMeshes, maxOrbitRadius } = atom3dBuildElectrons(ctx, z);

  const camDistance = maxOrbitRadius * 2.3;
  camera.position.set(0, 0, camDistance);
  camera.lookAt(0, 0, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = true;
  controls.minDistance = maxOrbitRadius * 0.5;
  controls.maxDistance = maxOrbitRadius * 5;
  controls.target.set(0, 0, 0);

  // click-to-select (OrbitControls owns drag-to-rotate; this just tells a
  // real click from the end of a drag before raycasting)
  const infoPanel = atom3dMakeInfoPanel(host);

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
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
    infoPanel.style.display = 'none';
    infoPanel.innerHTML = '';
  }
  function selectMesh(m){
    if (selected) clearSelection();
    selected = m;
    const isElectron = m.userData.kind === 'electron';
    const s = isElectron ? 1.4 : 1.25;
    m.scale.set(s,s,s);
    m.material.emissiveIntensity = m.userData.baseEmissive * 1.35;
    const g = m.userData.glow, go = m.userData.glowOuter;
    g.scale.set(m.userData.glowBaseScale*2.1, m.userData.glowBaseScale*2.1, m.userData.glowBaseScale*2.1);
    g.material.opacity = 0.95;
    go.scale.set(m.userData.glowOuterBaseScale*1.6, m.userData.glowOuterBaseScale*1.6, m.userData.glowOuterBaseScale*1.6);
    go.material.opacity = 0.55;
    infoPanel.style.display = 'block';
    if (isElectron) atom3dShowElectron(infoPanel, m, symbol, name);
    else atom3dShowNucleon(infoPanel, m, name);
    const closeBtn = infoPanel.querySelector('.atom3d-close');
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); clearSelection(); });
  }

  // OrbitControls internally calls setPointerCapture() on pointerdown, which
  // captures ALL subsequent pointer events to itself until pointerup. Adding
  // our own pointer/click listeners on the same element causes its internal
  // `pointers[]` array to desync — the drag state never clears, freezing
  // rotation after any particle click.
  // Mouse events are NOT subject to pointer capture, so they stay clean.
  let mouseDownPos = null;
  renderer.domElement.addEventListener('mousedown', e => {
    mouseDownPos = { x: e.clientX, y: e.clientY };
  });
  renderer.domElement.addEventListener('mouseup', e => {
    if (!mouseDownPos) return;
    const dx = Math.abs(e.clientX - mouseDownPos.x);
    const dy = Math.abs(e.clientY - mouseDownPos.y);
    mouseDownPos = null;
    if (dx > 5 || dy > 5) return; // drag, not a click — skip raycasting
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(nucleonMeshes.concat(electronMeshes));
    if (hits.length) selectMesh(hits[0].object);
    else clearSelection();
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sparkleClock = 0;
  let animId;
  function animate(t) {
    try {
      controls.update();
      if (!reducedMotion){
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
    } catch (err) {
      console.error('atom3d render error (recovered):', err);
    }
    animId = requestAnimationFrame(animate);
  }
  animate();

  // Use a getter so clearThree() always reads the latest animId, not a
  // stale copy from the moment drawAtom3D first ran.
  threeScene = { renderer, get animId() { return animId; } };

  function onResize() {
    const w = host.clientWidth, h = host.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
}
