/* =========================================================================
   COMPOUNDS3D — molecule (ball-and-stick) and alloy (packed lattice) 3D
   viewers, built to match atom3d.js's visual language exactly: same glow
   system, same MeshPhysicalMaterial+clearcoat treatment, same click-to-
   inspect card, same NoToneMapping renderer setup, same cleanup lifecycle.

   Reuses atom3dGlowTexture()/atom3dAttachGlow() directly from atom3d.js —
   this file must load AFTER atom3d.js and AFTER data.js (needs ELEMENTS,
   ATOM_COLOR, ATOM_RADIUS, CATEGORY_META, MOLECULE_BLURBS).
========================================================================= */

/* ---- shared info panel (same visual language as atom3d-info) ---- */
function compound3dMakeInfoPanel(host, idSuffix) {
  const panel = document.createElement('div');
  panel.id = 'compound3d-info-' + idSuffix;
  Object.assign(panel.style, {
    position: 'absolute', right: '10px', bottom: '10px', width: '170px',
    background: 'var(--panel)', border: '1px solid var(--line)', borderRadius: '10px',
    padding: '8px 10px', fontFamily: 'var(--font-mono)', fontSize: '10.5px', lineHeight: '1.55',
    color: 'var(--text-main)', maxHeight: '46%', overflowY: 'auto', pointerEvents: 'none',
    zIndex: '2', display: 'none', opacity: '0.94'
  });
  host.appendChild(panel);
  return panel;
}
function compound3dCloseBtn() {
  return `<div class="compound3d-close" style="position:absolute;top:4px;right:6px;pointer-events:auto;cursor:pointer;color:var(--text-dim);font-size:13px;line-height:1">×</div>`;
}
function compound3dRow(label, value) {
  return `<div style="display:flex;justify-content:space-between;gap:8px;color:var(--text-dim)"><span>${label}</span><b style="color:var(--text-main);font-weight:500">${value}</b></div>`;
}

/* ---- allocate which element each lattice sphere represents. Pure
   proportional weighting would make trace elements (e.g. steel's 1.5%
   carbon) statistically invisible among 46 spheres — nothing to click,
   and the cluster reads as one flat color. Instead: every listed element
   gets a guaranteed minimum presence, and the remainder fills in
   proportionally to composition. ---- */
function compound3dAllocateComposition(elements, count) {
  const entries = Object.entries(elements);
  const total = entries.reduce((s, [, p]) => s + p, 0) || 1;
  const minEach = Math.max(1, Math.min(3, Math.floor(count / (entries.length * 2))));
  const alloc = entries.map(([sym, pct]) => ({ sym, count: Math.max(minEach, Math.round((pct / total) * count)) }));

  let sum = alloc.reduce((s, a) => s + a.count, 0);
  alloc.sort((a, b) => b.count - a.count);
  let guard = 0;
  while (sum > count && guard++ < count * 4) {
    const a = alloc[guard % alloc.length];
    if (a.count > minEach) { a.count--; sum--; }
  }
  guard = 0;
  while (sum < count && guard++ < count * 4) {
    alloc[guard % alloc.length].count++; sum++;
  }

  const bag = [];
  alloc.forEach(a => { for (let k = 0; k < a.count; k++) bag.push(a.sym); });
  for (let k = bag.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [bag[k], bag[j]] = [bag[j], bag[k]];
  }
  return bag;
}

/* ---- organic rejection-sampling packing, same technique as the nucleus
   in atom3d.js, generalized to any sphere radius/count ---- */
function compound3dPackSpheres(count, sphereR, overlapFactor) {
  let s = 47;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const minDist = sphereR * (overlapFactor || 1.55);
  const pts = [];
  let radius = sphereR * 1.2;
  let stall = 0;
  while (pts.length < count) {
    const u = rnd(), v = rnd();
    const theta = Math.acos(2 * u - 1), phi = 2 * Math.PI * v;
    const rr = radius * Math.cbrt(rnd());
    const candidate = new THREE.Vector3(
      rr * Math.sin(theta) * Math.cos(phi),
      rr * Math.sin(theta) * Math.sin(phi),
      rr * Math.cos(theta)
    );
    let ok = true;
    for (let i = 0; i < pts.length; i++) {
      if (candidate.distanceTo(pts[i]) < minDist) { ok = false; break; }
    }
    if (ok) { pts.push(candidate); stall = 0; }
    else if (++stall > 80) { radius *= 1.025; stall = 0; }
  }
  const centroid = pts.reduce((a, p) => a.add(p), new THREE.Vector3()).multiplyScalar(1 / pts.length);
  pts.forEach(p => p.sub(centroid));
  return pts;
}

/* ---- shared scene/renderer scaffold — mirrors drawAtom3D's setup ---- */
function compound3dInitScene(host) {
  const width = host.clientWidth || 400;
  const height = host.clientHeight || 340;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x000000, 0.012);

  const camera = new THREE.PerspectiveCamera(42, width / height, 0.05, 500);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(width, height);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.NoToneMapping; // keeps emissive colors saturated, matches atom3d
  host.appendChild(renderer.domElement);

  renderer.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    console.warn('compound3d: WebGL context lost, will rebuild on restore');
  }, false);
  renderer.domElement.addEventListener('webglcontextrestored', () => {
    if (typeof currentSubject !== 'undefined' && currentSubject) showSubject(currentSubject);
  }, false);

  scene.add(new THREE.AmbientLight(0xffffff, 0.10));
  const keyLight = new THREE.DirectionalLight(0xffffff, 0.4);
  keyLight.position.set(-7, 9, 10); scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xffffff, 0.14);
  fillLight.position.set(8, -3, -6); scene.add(fillLight);
  const rimLight = new THREE.PointLight(0xffa64d, 0.35, 60);
  rimLight.position.set(6, 3, -10); scene.add(rimLight);

  return { scene, camera, renderer, glowTex: atom3dGlowTexture() };
}

/* ---- glowing bond: bright core cylinder + additive-blended outer layers,
   plus traveling spark particles that flow along it ---- */
function compound3dBuildBond(group, pa, pb, glowColor) {
  const dir = new THREE.Vector3().subVectors(pb, pa);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(pa, pb).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());

  const layers = [
    { r: 0.045, opacity: 1,    color: 0xfff4d9, physical: true },
    { r: 0.075, opacity: 0.55, color: glowColor },
    { r: 0.13,  opacity: 0.22, color: glowColor },
  ];
  const meshes = [];
  layers.forEach(layer => {
    const geo = new THREE.CylinderGeometry(layer.r, layer.r, len, 12, 1, true);
    const mat = layer.physical
      ? new THREE.MeshPhysicalMaterial({ color: layer.color, emissive: layer.color, emissiveIntensity: 0.9, metalness: 0, roughness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.3 })
      : new THREE.MeshBasicMaterial({ color: layer.color, transparent: true, opacity: layer.opacity, blending: THREE.AdditiveBlending, depthWrite: false });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(mid);
    mesh.quaternion.copy(quat);
    group.add(mesh);
    meshes.push(mesh);
  });

  const sparkleTex = atom3dGlowTexture();
  const sparkles = [];
  const sparkleCount = 2 + (Math.random() < 0.5 ? 1 : 0);
  for (let i = 0; i < sparkleCount; i++) {
    const sc = 0.055 + Math.random() * 0.04;
    const mat = new THREE.SpriteMaterial({ map: sparkleTex, color: 0xfff6e0, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(sc, sc, sc);
    group.add(sprite);
    sparkles.push({ sprite, pa, pb, phase: Math.random(), speed: 0.35 + Math.random() * 0.3 });
  }

  return { meshes, sparkles };
}

/* =========================================================================
   MOLECULES — ball-and-stick viewer
========================================================================= */
window.drawCompound3D = function (key, mol) {
  const host = els.threeHost;
  host.innerHTML = '';
  const { scene, camera, renderer, glowTex } = compound3dInitScene(host);

  const molGroup = new THREE.Object3D();
  scene.add(molGroup);

  const SCALE = 1.9;
  const atomMeshes = [];
  let maxExtent = 2;

  mol.atoms.forEach((a, i) => {
    const color = ATOM_COLOR[a.el] ?? ATOM_COLOR.default;
    const radius = (ATOM_RADIUS[a.el] ?? ATOM_RADIUS.default) * 0.62;
    const mat = new THREE.MeshPhysicalMaterial({
      color, emissive: color, emissiveIntensity: 1.1,
      metalness: 0.05, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.2
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 28, 28), mat);
    mesh.position.set(a.pos[0] * SCALE, a.pos[1] * SCALE, a.pos[2] * SCALE);
    maxExtent = Math.max(maxExtent, mesh.position.length());
    const elData = ELEMENTS[a.el];
    mesh.userData = { kind: 'atom', el: a.el, index: i, baseEmissive: 1.1, color, elData };
    atom3dAttachGlow(mesh, color, radius * 3.4, 0.4);
    molGroup.add(mesh);
    atomMeshes.push(mesh);
  });

  const bondMeshes = [];
  const bondSparkles = [];
  mol.bonds.forEach(([ia, ib]) => {
    const pa = atomMeshes[ia].position, pb = atomMeshes[ib].position;
    const ca = ATOM_COLOR[mol.atoms[ia].el] ?? ATOM_COLOR.default;
    const cb = ATOM_COLOR[mol.atoms[ib].el] ?? ATOM_COLOR.default;
    const blend = new THREE.Color(ca).lerp(new THREE.Color(cb), 0.5).getHex();
    const { meshes, sparkles } = compound3dBuildBond(molGroup, pa, pb, blend);
    bondSparkles.push(...sparkles);
    const dist = pa.distanceTo(pb) / SCALE;
    const bondData = {
      kind: 'bond', elA: mol.atoms[ia].el, elB: mol.atoms[ib].el,
      length: dist, baseEmissive: 0.9,
      glowLayers: [meshes[1], meshes[2]].map(m => ({ mesh: m, baseOpacity: m.material.opacity }))
    };
    meshes.forEach(m => { m.userData = bondData; });
    bondMeshes.push(meshes[0]);
  });

  const camDistance = Math.max(4, maxExtent * 2.6);
  camera.position.set(0, 0, camDistance);
  camera.lookAt(0, 0, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = true;
  controls.minDistance = Math.max(1.5, maxExtent * 0.6);
  controls.maxDistance = maxExtent * 6;
  controls.target.set(0, 0, 0);

  const infoPanel = compound3dMakeInfoPanel(host, 'mol');
  function showOverview() {
    const blurb = (typeof MOLECULE_BLURBS !== 'undefined' && MOLECULE_BLURBS[key]) || '';
    infoPanel.innerHTML = `
      <div style="font-family:var(--font-display);font-weight:600;font-size:13px;margin-bottom:2px">${mol.name}</div>
      <div style="color:var(--text-dim);font-size:10px;margin-bottom:6px">tap an atom or bond to inspect it</div>
      ${compound3dRow('Formula', mol.formula)}
      ${compound3dRow('Atoms', mol.atoms.length)}
      ${compound3dRow('Bonds', mol.bonds.length)}
      ${blurb ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--line);color:var(--text-dim)">${blurb}</div>` : ''}`;
    infoPanel.style.display = 'block';
  }
  showOverview();

  let selected = null;
  function clearSelection() {
    if (selected) {
      const d = selected.userData;
      if (d.kind === 'atom') {
        const g = d.glowRef, go = d.glowOuterRef;
        if (g) { g.scale.set(d.glowBaseScale, d.glowBaseScale, d.glowBaseScale); g.material.opacity = d.glowBaseOpacity; }
        if (go) { go.scale.set(d.glowOuterBaseScale, d.glowOuterBaseScale, d.glowOuterBaseScale); go.material.opacity = d.glowOuterBaseOpacity; }
        selected.scale.set(1, 1, 1);
      } else if (d.glowLayers) {
        d.glowLayers.forEach(gl => { gl.mesh.material.opacity = gl.baseOpacity; });
      }
      if (selected.material) selected.material.emissiveIntensity = d.baseEmissive;
    }
    selected = null;
    showOverview();
  }
  function selectMesh(m) {
    selected = m;
    const d = m.userData;
    if (d.kind === 'atom') {
      m.scale.set(1.3, 1.3, 1.3);
      m.material.emissiveIntensity = d.baseEmissive * 1.4;
      const g = m.userData.glow, go = m.userData.glowOuter;
      if (g) {
        d.glowRef = g; d.glowBaseScale = m.userData.glowBaseScale; d.glowBaseOpacity = m.userData.glowBaseOpacity;
        g.scale.set(d.glowBaseScale * 2, d.glowBaseScale * 2, d.glowBaseScale * 2);
        g.material.opacity = 0.95;
      }
      if (go) {
        d.glowOuterRef = go; d.glowOuterBaseScale = m.userData.glowOuterBaseScale; d.glowOuterBaseOpacity = m.userData.glowOuterBaseOpacity;
        go.scale.set(d.glowOuterBaseScale * 1.5, d.glowOuterBaseScale * 1.5, d.glowOuterBaseScale * 1.5);
        go.material.opacity = 0.5;
      }
      const el = d.elData, cat = el && CATEGORY_META[el.category];
      const elName = el ? el.name : ELEMENTS[d.el]?.name || d.el;
      const elEn = el && el.en != null ? compound3dRow('Electronegativity', el.en) : '';
      infoPanel.innerHTML = `
        ${compound3dCloseBtn()}
        <div style="font-family:var(--font-display);font-weight:600;font-size:12.5px">${elName} (${d.el})</div>
        <div style="color:var(--text-dim);font-size:9.5px;margin-bottom:6px">part of ${mol.name}</div>
        ${cat ? compound3dRow('Category', cat.label) : ''}
        ${elEn}`;
    } else {
      m.material.emissiveIntensity = d.baseEmissive * 1.6;
      if (d.glowLayers) d.glowLayers.forEach(gl => { gl.mesh.material.opacity = Math.min(1, gl.baseOpacity * 1.9); });
      infoPanel.innerHTML = `
        ${compound3dCloseBtn()}
        <div style="font-family:var(--font-display);font-weight:600;font-size:12.5px">Bond · ${d.elA}–${d.elB}</div>
        <div style="color:var(--text-dim);font-size:9.5px;margin-bottom:6px">part of ${mol.name}</div>
        ${compound3dRow('Length', d.length.toFixed(2) + ' Å (idealized)')}`;
    }
    infoPanel.style.display = 'block';
    const closeBtn = infoPanel.querySelector('.compound3d-close');
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); clearSelection(); });
  }

  let mouseDownPos = null;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  renderer.domElement.addEventListener('mousedown', e => { mouseDownPos = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('mouseup', e => {
    if (!mouseDownPos) return;
    const dx = Math.abs(e.clientX - mouseDownPos.x), dy = Math.abs(e.clientY - mouseDownPos.y);
    mouseDownPos = null;
    if (dx > 5 || dy > 5) return;
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    scene.updateMatrixWorld(true);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(atomMeshes.concat(bondMeshes));
    if (selected) clearSelection();
    if (hits.length) selectMesh(hits[0].object);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sparkleClock = 0;
  let animId;
  function animate(t) {
    animId = requestAnimationFrame(animate);
    try {
      controls.update();
      if (!reducedMotion) {
        if (!selected) molGroup.rotation.y += 0.0022;
        sparkleClock += 0.006;
        bondSparkles.forEach(s => {
          const u = ((sparkleClock * s.speed + s.phase) % 1 + 1) % 1;
          s.sprite.position.lerpVectors(s.pa, s.pb, u);
        });
      }
      if (selected && selected.userData.kind === 'atom' && selected.userData.glowRef) {
        const pulse = 1 + Math.sin((t || 0) * 0.005) * 0.15;
        selected.userData.glowRef.material.opacity = 0.85 * pulse;
      }
      renderer.render(scene, camera);
    } catch (err) { console.error('compound3d render error:', err); }
  }
  animate();
  threeScene = { renderer, get animId() { return animId; } };

  function onResize() {
    const w = host.clientWidth, h = host.clientHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
};

/* =========================================================================
   ALLOYS — packed metallic lattice viewer
========================================================================= */
window.drawAlloy3D = function (key, alloy) {
  const host = els.threeHost;
  host.innerHTML = '';
  const { scene, camera, renderer, glowTex } = compound3dInitScene(host);

  const latticeGroup = new THREE.Object3D();
  scene.add(latticeGroup);

  const SPHERE_R = 0.5;
  const COUNT = 46;
  const positions = compound3dPackSpheres(COUNT, SPHERE_R, 1.5);
  const bag = compound3dAllocateComposition(alloy.elements, COUNT);

  const atomMeshes = [];
  positions.forEach((pos, i) => {
    const sym = bag[i];
    const color = ATOM_COLOR[sym] ?? ATOM_COLOR.default;
    const mat = new THREE.MeshPhysicalMaterial({
      color, emissive: color, emissiveIntensity: 0.55,
      metalness: 0.75, roughness: 0.22, clearcoat: 0.9, clearcoatRoughness: 0.1
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(SPHERE_R, 24, 24), mat);
    mesh.position.copy(pos);
    const elData = ELEMENTS[sym];
    mesh.userData = { kind: 'alloyAtom', el: sym, baseEmissive: 0.55, color, elData, pct: alloy.elements[sym] };
    atom3dAttachGlow(mesh, color, SPHERE_R * 2.6, 0.22);
    latticeGroup.add(mesh);
    atomMeshes.push(mesh);
  });

  const seaCount = 60;
  const seaPts = [];
  const clusterR = Math.max(...positions.map(p => p.length())) + SPHERE_R;
  for (let i = 0; i < seaCount; i++) {
    const mat = new THREE.SpriteMaterial({ map: glowTex, color: 0xbfe8ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.35 });
    const sprite = new THREE.Sprite(mat);
    const sc = 0.05 + Math.random() * 0.06;
    sprite.scale.set(sc, sc, sc);
    latticeGroup.add(sprite);
    seaPts.push({
      sprite,
      center: new THREE.Vector3((Math.random() - 0.5) * clusterR * 1.6, (Math.random() - 0.5) * clusterR * 1.6, (Math.random() - 0.5) * clusterR * 1.6),
      radius: 0.4 + Math.random() * 0.8,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2
    });
  }

  const camDistance = Math.max(5, clusterR * 2.5);
  camera.position.set(0, 0, camDistance);
  camera.lookAt(0, 0, 0);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = true;
  controls.minDistance = clusterR * 0.7;
  controls.maxDistance = clusterR * 6;
  controls.target.set(0, 0, 0);

  const infoPanel = compound3dMakeInfoPanel(host, 'alloy');
  function showOverview() {
    const propRows = alloy.properties
      ? Object.entries(alloy.properties).map(([k, v]) => compound3dRow(k, v)).join('')
      : '';
    const compRows = Object.entries(alloy.elements)
      .sort((a, b) => b[1] - a[1])
      .map(([sym, pct]) => compound3dRow((ELEMENTS[sym] ? ELEMENTS[sym].name : sym), pct + '%'))
      .join('');
    infoPanel.innerHTML = `
      <div style="font-family:var(--font-display);font-weight:600;font-size:13px;margin-bottom:2px">${alloy.name}</div>
      <div style="color:var(--text-dim);font-size:10px;margin-bottom:6px">tap a sphere to inspect it</div>
      ${compRows}
      ${propRows ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--line)">${propRows}</div>` : ''}
      ${alloy.blurb ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid var(--line);color:var(--text-dim)">${alloy.blurb}</div>` : ''}`;
    infoPanel.style.display = 'block';
  }
  showOverview();

  let selected = null;
  function clearSelection() {
    if (selected) {
      const d = selected.userData;
      const g = d.glowRef, go = d.glowOuterRef;
      if (g) { g.scale.set(d.glowBaseScale, d.glowBaseScale, d.glowBaseScale); g.material.opacity = d.glowBaseOpacity; }
      if (go) { go.scale.set(d.glowOuterBaseScale, d.glowOuterBaseScale, d.glowOuterBaseScale); go.material.opacity = d.glowOuterBaseOpacity; }
      selected.scale.set(1, 1, 1);
      selected.material.emissiveIntensity = d.baseEmissive;
    }
    selected = null;
    showOverview();
  }
  function selectMesh(m) {
    selected = m;
    const d = m.userData;
    m.scale.set(1.3, 1.3, 1.3);
    m.material.emissiveIntensity = d.baseEmissive * 2.2;
    const g = m.userData.glow, go = m.userData.glowOuter;
    if (g) {
      d.glowRef = g; d.glowBaseScale = m.userData.glowBaseScale; d.glowBaseOpacity = m.userData.glowBaseOpacity;
      g.scale.set(d.glowBaseScale * 2.2, d.glowBaseScale * 2.2, d.glowBaseScale * 2.2);
      g.material.opacity = 0.9;
    }
    if (go) {
      d.glowOuterRef = go; d.glowOuterBaseScale = m.userData.glowOuterBaseScale; d.glowOuterBaseOpacity = m.userData.glowOuterBaseOpacity;
      go.scale.set(d.glowOuterBaseScale * 1.6, d.glowOuterBaseScale * 1.6, d.glowOuterBaseScale * 1.6);
      go.material.opacity = 0.5;
    }
    const el = d.elData, cat = el && CATEGORY_META[el.category];
    const elName = el ? el.name : ELEMENTS[d.el]?.name || d.el;
    infoPanel.innerHTML = `
      ${compound3dCloseBtn()}
      <div style="font-family:var(--font-display);font-weight:600;font-size:12.5px">${elName} (${d.el})</div>
      <div style="color:var(--text-dim);font-size:9.5px;margin-bottom:6px">in this ${alloy.name} lattice</div>
      ${compound3dRow('Composition', d.pct + '%')}
      ${cat ? compound3dRow('Category', cat.label) : ''}`;
    infoPanel.style.display = 'block';
    const closeBtn = infoPanel.querySelector('.compound3d-close');
    if (closeBtn) closeBtn.addEventListener('click', (e) => { e.stopPropagation(); clearSelection(); });
  }

  let mouseDownPos = null;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  renderer.domElement.addEventListener('mousedown', e => { mouseDownPos = { x: e.clientX, y: e.clientY }; });
  renderer.domElement.addEventListener('mouseup', e => {
    if (!mouseDownPos) return;
    const dx = Math.abs(e.clientX - mouseDownPos.x), dy = Math.abs(e.clientY - mouseDownPos.y);
    mouseDownPos = null;
    if (dx > 5 || dy > 5) return;
    const rect = renderer.domElement.getBoundingClientRect();
    ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    scene.updateMatrixWorld(true);
    raycaster.setFromCamera(ndc, camera);
    const hits = raycaster.intersectObjects(atomMeshes);
    if (selected) clearSelection();
    if (hits.length) selectMesh(hits[0].object);
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let clock = 0;
  let animId;
  function animate(t) {
    animId = requestAnimationFrame(animate);
    try {
      controls.update();
      if (!reducedMotion) {
        if (!selected) latticeGroup.rotation.y += 0.0016;
        clock += 0.008;
        seaPts.forEach(p => {
          const a = clock * p.speed + p.phase;
          const offset = new THREE.Vector3(Math.cos(a), Math.sin(a * 0.7), Math.sin(a)).multiplyScalar(p.radius);
          p.sprite.position.copy(p.center).add(offset);
        });
      }
      if (selected && selected.userData.glowRef) {
        const pulse = 1 + Math.sin((t || 0) * 0.005) * 0.15;
        selected.userData.glowRef.material.opacity = 0.8 * pulse;
      }
      renderer.render(scene, camera);
    } catch (err) { console.error('compound3d alloy render error:', err); }
  }
  animate();
  threeScene = { renderer, get animId() { return animId; } };

  function onResize() {
    const w = host.clientWidth, h = host.clientHeight;
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);
};
