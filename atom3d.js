/* =========================================================================
   ATOM3D — Hylogos-style 3D atom viewer.
   ========================================================================= */

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

function atom3dAssignOrbitals(count, orbitals){
  const slots = new Array(orbitals).fill(0);
  let rem = count;
  for (let i=0;i<orbitals && rem>0;i++){ slots[i]=1; rem--; }
  for (let i=0;i<orbitals && rem>0;i++){ slots[i]=2; rem--; }
  return slots;
}

const ATOM3D_SUP = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
const atom3dSup = n => String(n).split('').map(d=>ATOM3D_SUP[d]).join('');
const atom3dConfigString = subshells => subshells.map(s=>s.label+atom3dSup(s.count)).join(' ');

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
    const candidate = new THREE.Vector3(r * Math.sin(theta) * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(theta));
    let ok = true;
    for (let i=0;i<pts.length;i++){ if (candidate.distanceTo(pts[i]) < minDist){ ok = false; break; } }
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
  clusterGlow.scale.set(clusterRadius * 3.6, clusterRadius * 3.6, 1);
  nucleusGroup.add(clusterGlow);
  return nucleonMeshes;
}

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
  const mainLayers = [{ r:0.022, opacity:1.0, color:0xfff4d9 }, { r:0.06, opacity:0.7, color:0xffb133 }, { r:0.24, opacity:0.12, color:0xa63c00 }];
  mainLayers.forEach(layer => {
    const geo = new THREE.TubeGeometry(mainCurve, 160, layer.r, 6, true);
    const mat = new THREE.MeshBasicMaterial({ color:layer.color, transparent:true, opacity:layer.opacity, blending:THREE.AdditiveBlending, depthWrite:false });
    parent.add(new THREE.Mesh(geo, mat));
  });
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
  const spinGroups = [], sparkles = [], electronMeshes = [];
  const subshells = atom3dConfig(Z);
  const shellMap = new Map();
  subshells.forEach(sub => {
    if (!shellMap.has(sub.n)) shellMap.set(sub.n, []);
    const orbitals = 2*sub.l + 1;
    const slots = atom3dAssignOrbitals(sub.count, orbitals);
    for (let o=0;o<orbitals;o++) for (let e=0;e<slots[o];e++) shellMap.get(sub.n).push({ label:sub.label, l:sub.l, ml:o-sub.l, spin: e===0?'+1/2 ↑':'-1/2 ↓' });
  });
  const shellNs = [...shellMap.keys()].sort((a,b)=>a-b);
  const maxN = Math.max(...shellNs);
  shellNs.forEach(n => {
    const radius = 4.6 + (n-1)*2.3;
    atom3dBuildRing(radius, electronsGroup, glowTex, sparkles);
    const spinGroup = new THREE.Object3D();
    spinGroup.userData.speed = 0.3/Math.sqrt(n);
    electronsGroup.add(spinGroup);
    spinGroups.push(spinGroup);
    shellMap.get(n).forEach((d, idx) => {
      const angle = (idx/shellMap.get(n).length) * Math.PI*2;
      const mat = new THREE.MeshPhysicalMaterial({ color:0x1e6bff, emissive:0x1e6bff, emissiveIntensity:1.7, metalness:0, roughness:0.3, clearcoat:0.6 });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), mat);
      mesh.position.set(Math.cos(angle)*radius, Math.sin(angle)*radius, 0);
      mesh.userData = { kind:'electron', n, label:d.label, ml:d.ml, spin:d.spin, isValence: n===maxN, baseEmissive:1.7, color:0x1e6bff };
      atom3dAttachGlow(mesh, 0x1e6bff, 1.6, 0.5);
      spinGroup.add(mesh);
      electronMeshes.push(mesh);
    });
  });
  return { spinGroups, sparkles, electronMeshes, maxOrbitRadius: 4.6 + (maxN-1)*2.3 };
}

// RESTORED ORIGINAL ATOM VIEWER INTERACTION
function drawAtom3D(symbol, elData) {
  const host = els.threeHost;
  const width = host.clientWidth, height = host.clientHeight;
  const z = elData.z, a = ATOM_MASS[symbol] || Math.round(z * 2.05);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 500);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(width, height);
  host.appendChild(renderer.domElement);

  const atomGroup = new THREE.Object3D(); scene.add(atomGroup);
  const nucleusGroup = new THREE.Object3D(); atomGroup.add(nucleusGroup);
  const electronsGroup = new THREE.Object3D(); atomGroup.add(electronsGroup);
  const glowTex = atom3dGlowTexture();
  const nucleonMeshes = atom3dBuildNucleus({ nucleusGroup, glowTex }, z, a);
  const { spinGroups, sparkles, electronMeshes, maxOrbitRadius } = atom3dBuildElectrons({ electronsGroup, glowTex }, z);
  
  camera.position.z = maxOrbitRadius * 2.3;
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Interaction logic
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  host.addEventListener('click', (event) => {
      const rect = host.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(nucleonMeshes.concat(electronMeshes));
      if (hits.length > 0) {
          const obj = hits[0].object;
          obj.material.emissiveIntensity = 5.0;
          setTimeout(() => obj.material.emissiveIntensity = obj.userData.baseEmissive, 500);
      }
  });

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    spinGroups.forEach(g => g.rotation.z += g.userData.speed * 0.03);
    renderer.render(scene, camera);
  }
  animate();
  threeScene = { renderer };
}

/* =========================================================================
   PREMIUM UPGRADE: COMPOUNDS & ALLOYS (GLOWING ORBS & PLASMA FILAMENTS)
   ========================================================================= */

// Info Panel for Compounds
const infoPanel = document.createElement('div');
infoPanel.style.cssText = "position:absolute; background:rgba(10,15,25,0.95); color:#fff; padding:12px; border:1px solid #00ff7f; border-radius:8px; font-family:'Space Grotesk', sans-serif; pointer-events:none; display:none; z-index:10000; font-size:13px; box-shadow:0 0 20px rgba(0,255,127,0.3);";
document.body.appendChild(infoPanel);

function drawPremiumStructure(data) {
    const host = document.getElementById("threeHost");
    host.innerHTML = ""; 
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, host.clientWidth / host.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.clientWidth, host.clientHeight);
    host.appendChild(renderer.domElement);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const p1 = new THREE.PointLight(0xffffff, 1.2); p1.position.set(10,10,10); scene.add(p1);

    const atomMeshes = [];
    const bondMeshes = [];
    const glowTex = atom3dGlowTexture();

    data.atoms.forEach((a) => {
        const color = ATOM_COLOR[a.el] || 0xcccccc;
        const mat = new THREE.MeshPhysicalMaterial({ 
            color: color, emissive: color, emissiveIntensity: 0.5,
            metalness: 0.2, roughness: 0.05, clearcoat: 1.0
        });
        const mesh = new THREE.Mesh(new THREE.SphereGeometry(ATOM_RADIUS[a.el]||0.5, 32, 32), mat);
        mesh.position.set(a.pos[0]*2, a.pos[1]*2, a.pos[2]*2);
        
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: color, transparent: true, blending: THREE.AdditiveBlending, opacity: 0.8 }));
        sprite.scale.set(2, 2, 1);
        mesh.add(sprite);

        mesh.userData = { symbol: a.el, name: ELEMENTS[a.el]?.name || a.el, role: a.role || "Component", z: ELEMENTS[a.el]?.z || "?" };
        mainGroup.add(mesh);
        atomMeshes.push(mesh);
    });

    if(data.bonds) {
        data.bonds.forEach(b => {
            const start = atomMeshes[b[0]].position;
            const end = atomMeshes[b[1]].position;
            const dist = start.distanceTo(end);
            const bondGroup = new THREE.Group();
            const core = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, dist, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, dist, 12), new THREE.MeshStandardMaterial({ color: 0x00ff7f, emissive: 0x00ff7f, emissiveIntensity: 4, transparent: true, opacity: 0.5 }));
            bondGroup.add(core); bondGroup.add(shell);
            bondGroup.position.copy(start).lerp(end, 0.5);
            bondGroup.lookAt(end); bondGroup.rotateX(Math.PI / 2);
            mainGroup.add(bondGroup);
            bondMeshes.push(shell);
        });
    }

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hovered = null;

    host.addEventListener('pointermove', (e) => {
        const rect = host.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(atomMeshes);
        if (hits.length > 0) {
            const obj = hits[0].object;
            infoPanel.style.display = "block";
            infoPanel.style.left = (e.clientX + 15) + "px";
            infoPanel.style.top = (e.clientY + 15) + "px";
            infoPanel.innerHTML = `<b>${obj.userData.name}</b> [${obj.userData.symbol}]<br>Atomic Number: ${obj.userData.z}<br>Role: ${obj.userData.role}`;
        } else { infoPanel.style.display = "none"; }
    });

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    camera.position.z = 10;

    function animate(t) {
        requestAnimationFrame(animate);
        controls.update();
        mainGroup.rotation.y += 0.002;
        bondMeshes.forEach(m => { m.material.emissiveIntensity = 3 + Math.sin(t * 0.005) * 2; });
        renderer.render(scene, camera);
    }
    animate(0);
    threeScene = { renderer };
}

window.drawCompound3D = function(data) { drawPremiumStructure(data); };
window.drawAlloy3D = function(data) { drawPremiumStructure(data); };
