/* =========================================================================
   ATOM3D — Hylogos-style 3D atom viewer. 
   ALL ORIGINAL CODE RESTORED. NO DELETIONS.
========================================================================= */

const ATOM_MASS_INTERNAL = {
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

const ATOM3D_MADELUNG = [[1,0,'1s'],[2,0,'2s'],[2,1,'2p'],[3,0,'3s'],[3,1,'3p'],[4,0,'4s'],[3,2,'3d'],[4,1,'4p'],[5,0,'5s'],[4,2,'4d'],[5,1,'5p'],[6,0,'6s'],[4,3,'4f'],[5,2,'5d'],[6,1,'6p'],[7,0,'7s'],[5,3,'5f'],[6,2,'6d'],[7,1,'7p']];

function atom3dConfig(Z){
  let remaining = Z; const subshells = [];
  for (const [n,l,label] of ATOM3D_MADELUNG){
    if (remaining <= 0) break;
    const cap = 2 * (2*l + 1); const count = Math.min(cap, remaining);
    subshells.push({n,l,label,count,cap}); remaining -= count;
  }
  return subshells;
}

function atom3dAssignOrbitals(count, orbitals){
  const slots = new Array(orbitals).fill(0); let rem = count;
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
  const size = 128; const c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d'); const g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
  _atom3dGlowTex = new THREE.CanvasTexture(c); return _atom3dGlowTex;
}

function atom3dAttachGlow(mesh, color, scale, baseOpacity){
  const tex = atom3dGlowTexture();
  const innerMat = new THREE.SpriteMaterial({ map:tex, color, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:baseOpacity });
  const inner = new THREE.Sprite(innerMat); inner.scale.set(scale, scale, scale); mesh.add(inner);
  const outerMat = new THREE.SpriteMaterial({ map:tex, color, transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, opacity:baseOpacity*0.45 });
  const outer = new THREE.Sprite(outerMat); outer.scale.set(scale*2.6, scale*2.6, scale*2.6); mesh.add(outer);
  mesh.userData.glow = inner; mesh.userData.glowOuter = outer;
  mesh.userData.glowBaseScale = scale; mesh.userData.glowBaseOpacity = baseOpacity;
}

const ATOM3D_NUCLEON_R = 0.52;
const ATOM3D_PROTON_COLOR = 0xff0fc4, ATOM3D_NEUTRON_COLOR = 0xff7000;

function atom3dPackNucleus(count){
  const pts = []; let radius = 1.15;
  while (pts.length < count){
    const phi = Math.random() * Math.PI * 2; const costheta = Math.random() * 2 - 1;
    const u = Math.random(); const theta = Math.acos(costheta);
    const r = radius * Math.pow(u, 1/3);
    pts.push(new THREE.Vector3(r * Math.sin(theta) * Math.cos(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(theta)));
  }
  return pts;
}

function atom3dThreadCurve(radius, ampFraction, periods, phase){
  const pts = []; for (let i=0;i<=240;i++){
    const theta = (i/240) * Math.PI*2; const r = radius * (1 + ampFraction*Math.sin(periods*theta + phase));
    pts.push(new THREE.Vector3(Math.cos(theta)*r, Math.sin(theta)*r, ampFraction*radius*0.4*Math.sin(periods*theta + phase)));
  }
  return new THREE.CatmullRomCurve3(pts, true);
}

function atom3dBuildRing(radius, parent, glowTex, sparkles){
  const mainCurve = atom3dThreadCurve(radius, 0, 1, 0);
  const mainLayers = [{ r:0.022, op:1.0, c:0xfff4d9 }, { r:0.06, op:0.7, c:0xffb133 }, { r:0.24, op:0.12, c:0xa63c00 }];
  mainLayers.forEach(l => {
    const geo = new THREE.TubeGeometry(mainCurve, 160, l.r, 6, true);
    const mat = new THREE.MeshBasicMaterial({ color:l.c, transparent:true, opacity:l.op, blending:THREE.AdditiveBlending, depthWrite:false });
    parent.add(new THREE.Mesh(geo, mat));
  });
  for (let i=0;i<4;i++){
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color:0xfff6e0, transparent:true, blending:THREE.AdditiveBlending, opacity:0.85 }));
    sprite.scale.set(0.2,0.2,1); parent.add(sprite); sparkles.push({ sprite, curve:mainCurve, phase: Math.random(), speed: 0.2 });
  }
}

// RESTORED MAIN ATOM VIEWER (Hylogos Style)
function drawAtom3D(symbol, elData) {
  const host = document.getElementById("threeHost"); host.innerHTML = "";
  const width = host.clientWidth, height = host.clientHeight;
  const z = elData.z, a = ATOM_MASS_INTERNAL[symbol] || Math.round(z * 2.05);
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 500);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(width, height);
  host.appendChild(renderer.domElement);

  const group = new THREE.Group(); scene.add(group);
  const glowTex = atom3dGlowTexture();
  const particles = [];

  const positions = atom3dPackNucleus(z + (a-z));
  positions.forEach((p, i) => {
    const isProton = i < z; const color = isProton ? ATOM3D_PROTON_COLOR : ATOM3D_NEUTRON_COLOR;
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 18, 18), new THREE.MeshPhysicalMaterial({ color, emissive:color, emissiveIntensity:1.5, roughness:0.2, clearcoat:1.0 }));
    mesh.position.copy(p); mesh.userData = { kind: isProton ? "Proton" : "Neutron", baseEmissive: 1.5 };
    atom3dAttachGlow(mesh, color, 0.85, 0.3); group.add(mesh); particles.push(mesh);
  });

  const sparkles = []; const config = atom3dConfig(z); let maxR = 5;
  config.forEach((sub, i) => {
    const r = 4.6 + i*2.3; maxR = r; atom3dBuildRing(r, group, glowTex, sparkles);
    const spin = new THREE.Group(); group.add(spin); spin.userData.speed = 0.3 / Math.sqrt(i+1);
    for(let j=0; j<sub.count; j++){
      const ang = (j/sub.count)*Math.PI*2;
      const e = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), new THREE.MeshPhysicalMaterial({ color:0x1e6bff, emissive:0x1e6bff, emissiveIntensity:2.0, roughness:0.2, clearcoat:1.0 }));
      e.position.set(Math.cos(ang)*r, Math.sin(ang)*r, 0); e.userData = { kind: "Electron", baseEmissive: 2.0 };
      atom3dAttachGlow(e, 0x1e6bff, 1.3, 0.6); spin.add(e); particles.push(e);
    }
  });

  camera.position.z = maxR * 2.5; const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
  host.addEventListener('click', (e) => {
    const rect = host.getBoundingClientRect(); mouse.x = ((e.clientX - rect.left)/rect.width)*2-1; mouse.y = -((e.clientY - rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouse, camera); const hits = raycaster.intersectObjects(particles);
    if(hits.length > 0) {
      const obj = hits[0].object; obj.material.emissiveIntensity = 8;
      const note = document.getElementById("viewerNote");
      note.innerHTML = `<span style="color:#00ff7f; font-weight:bold;">${obj.userData.kind}</span> detected in ${elData.name}`;
      setTimeout(() => obj.material.emissiveIntensity = obj.userData.baseEmissive, 500);
    }
  });

  function animate() {
    requestAnimationFrame(animate); controls.update();
    group.children.forEach(c => { if(c.userData.speed) c.rotation.z += c.userData.speed * 0.05; });
    sparkles.forEach(s => { s.phase=(s.phase+0.005)%1; s.sprite.position.copy(s.curve.getPointAt(s.phase)); });
    renderer.render(scene, camera);
  }
  animate();
  window.threeScene = { renderer };
}

/* =========================================================================
   PREMIUM UPGRADE: COMPOUNDS & ALLOYS (GLOSSY ORBS + PLASMA FILAMENTS)
========================================================================= */

const premiumPanel = document.createElement('div');
premiumPanel.style.cssText = "position:absolute; background:rgba(0,0,0,0.9); color:#fff; padding:12px; border:1px solid #00ff7f; border-radius:8px; display:none; pointer-events:none; z-index:9999; font-family:monospace; box-shadow:0 0 15px #00ff7f;";
document.body.appendChild(premiumPanel);

function drawPremiumStructure(data) {
  const host = document.getElementById("threeHost"); host.innerHTML = "";
  const width = host.clientWidth, height = host.clientHeight;
  const scene = new THREE.Scene(); const camera = new THREE.PerspectiveCamera(40, width/height, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(window.devicePixelRatio); renderer.setSize(width, height); host.appendChild(renderer.domElement);

  const mainGroup = new THREE.Group(); scene.add(mainGroup);
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const l = new THREE.PointLight(0xffffff, 1.5); l.position.set(10,10,10); scene.add(l);

  const atomMeshes = []; const bondMeshes = []; const glowTex = atom3dGlowTexture();

  data.atoms.forEach(a => {
    const color = ATOM_COLOR[a.el] || 0xcccccc;
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), new THREE.MeshPhysicalMaterial({ color, emissive:color, emissiveIntensity:0.5, clearcoat:1.0, roughness:0.1 }));
    mesh.position.set(a.pos[0]*2, a.pos[1]*2, a.pos[2]*2);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map:glowTex, color, transparent:true, blending:THREE.AdditiveBlending, opacity:0.8 }));
    sprite.scale.set(2.5,2.5,1); mesh.add(sprite);
    mesh.userData = { name: ELEMENTS[a.el]?.name || a.el, sym: a.el, role: a.role || "Atom", z: ELEMENTS[a.el]?.z || "?" };
    mainGroup.add(mesh); atomMeshes.push(mesh);
  });

  if(data.bonds) {
    data.bonds.forEach(b => {
      const start = atomMeshes[b[0]].position, end = atomMeshes[b[1]].position;
      const dist = start.distanceTo(end); const bGroup = new THREE.Group();
      const shell = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, dist, 12), new THREE.MeshStandardMaterial({ color:0x00ff7f, emissive:0x00ff7f, emissiveIntensity:4, transparent:true, opacity:0.5 }));
      bGroup.add(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, dist, 8), new THREE.MeshBasicMaterial({color:0xffffff})));
      bGroup.add(shell); bGroup.position.copy(start).lerp(end, 0.5); bGroup.lookAt(end); bGroup.rotateX(Math.PI/2);
      mainGroup.add(bGroup); bondMeshes.push(shell);
    });
  }

  const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2();
  host.addEventListener('click', (e) => {
    const rect = host.getBoundingClientRect(); mouse.x = ((e.clientX - rect.left)/rect.width)*2-1; mouse.y = -((e.clientY - rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(mouse, camera); const hits = raycaster.intersectObjects(atomMeshes);
    if(hits.length > 0) {
      const o = hits[0].object; o.material.emissiveIntensity = 8;
      premiumPanel.style.display = "block"; premiumPanel.style.left = (e.clientX + 10) + "px"; premiumPanel.style.top = (e.clientY + 10) + "px";
      premiumPanel.innerHTML = `<b style="color:#00ff7f; font-size:16px;">${o.userData.name}</b> [${o.userData.sym}]<br>Z: ${o.userData.z}<br>Role: ${o.userData.role}`;
      setTimeout(() => o.material.emissiveIntensity = 0.5, 400);
    } else { premiumPanel.style.display = "none"; }
  });

  camera.position.z = 10; new THREE.OrbitControls(camera, renderer.domElement);
  function animate(t) {
    requestAnimationFrame(animate); mainGroup.rotation.y += 0.002;
    bondMeshes.forEach(m => { m.material.emissiveIntensity = 3 + Math.sin(t*0.005)*2; });
    renderer.render(scene, camera);
  }
  animate(0);
}

window.drawCompound3D = function(data) { drawPremiumStructure(data); };
window.drawAlloy3D = function(data) { drawPremiumStructure(data); };
