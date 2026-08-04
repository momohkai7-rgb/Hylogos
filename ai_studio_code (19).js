/* =========================================================================
   ATOM3D — PREMIUM ENGINE
========================================================================= */

// mass numbers
const ATOM_MASS = { H:1,He:4,Li:7,Be:9,B:11,C:12,N:14,O:16,F:19,Ne:20,Na:23,Mg:24,Al:27,Si:28,P:31,S:32,Cl:35,Ar:40,K:39,Ca:40,Fe:56,Cu:64,Au:197,Ag:108 };

function atom3dInitScene(host) {
  while(host.firstChild) host.removeChild(host.firstChild);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 1000);
  camera.position.z = 10;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(host.clientWidth, host.clientHeight);
  host.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 1); light.position.set(5, 5, 5);
  scene.add(light);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.threeScene = { renderer, animId: null };
  return { scene, camera, renderer, controls };
}

function atom3dAttachGlow(m, c, s, o) {
  const canvas = document.createElement('canvas'); canvas.width = 64; canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, '#fff'); g.addColorStop(0.3, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'transparent');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, color: c, transparent: true, blending: THREE.AdditiveBlending, opacity: o });
  const sp = new THREE.Sprite(mat); sp.scale.set(s, s, s); m.add(sp);
}

function drawAtom3D(symbol, elData) {
  const { scene, camera, renderer, controls } = atom3dInitScene(document.getElementById('threeHost'));
  const group = new THREE.Group(); scene.add(group);
  const z = elData.z; const a = ATOM_MASS[symbol] || z * 2;
  
  // Nucleus
  for(let i=0; i<a; i++) {
    const color = i < z ? 0xff0fc4 : 0xff7000;
    const m = new THREE.Mesh(new THREE.SphereGeometry(0.4, 12, 12), new THREE.MeshPhongMaterial({color}));
    m.position.set((Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5, (Math.random()-0.5)*1.5);
    group.add(m);
  }

  function anim() {
    controls.update(); group.rotation.y += 0.005;
    renderer.render(scene, camera);
    window.threeScene.animId = requestAnimationFrame(anim);
  }
  anim();
}

function drawCompound3D(molData) {
  const { scene, camera, renderer, controls } = atom3dInitScene(document.getElementById('threeHost'));
  const group = new THREE.Group(); scene.add(group);

  molData.atoms.forEach(atom => {
    const color = (typeof ATOM_COLOR !== 'undefined' ? ATOM_COLOR[atom.el] : 0xcccccc) || 0xcccccc;
    const radius = (typeof ATOM_RADIUS !== 'undefined' ? ATOM_RADIUS[atom.el] : 0.5) || 0.5;
    const m = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), new THREE.MeshPhysicalMaterial({ color, emissive: color, emissiveIntensity: 0.4 }));
    m.position.set(...atom.pos);
    atom3dAttachGlow(m, color, radius * 4, 0.5);
    group.add(m);
  });

  molData.bonds.forEach(pair => {
    const start = new THREE.Vector3(...molData.atoms[pair[0]].pos);
    const end = new THREE.Vector3(...molData.atoms[pair[1]].pos);
    const dist = start.distanceTo(end);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, dist, 12), new THREE.MeshPhongMaterial({ color: 0x7fd9ff }));
    mesh.position.copy(start).lerp(end, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
    group.add(mesh);
  });

  function anim() {
    controls.update(); group.rotation.y += 0.005;
    renderer.render(scene, camera);
    window.threeScene.animId = requestAnimationFrame(anim);
  }
  anim();
}

function drawAlloy3D(alloyData) {
  const { scene, camera, renderer, controls } = atom3dInitScene(document.getElementById('threeHost'));
  const group = new THREE.Group(); scene.add(group);
  for (let x=-1; x<=1; x++) {
    for (let y=-1; y<=1; y++) {
      for (let z=-1; z<=1; z++) {
        const mat = new THREE.MeshPhysicalMaterial({ color: Math.random() > 0.2 ? 0x888888 : 0xffaa00, metalness: 1, roughness: 0.1 });
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.6, 20, 20), mat);
        m.position.set(x*1.8, y*1.8, z*1.8);
        group.add(m);
      }
    }
  }
  function anim() {
    controls.update(); group.rotation.y += 0.005;
    renderer.render(scene, camera);
    window.threeScene.animId = requestAnimationFrame(anim);
  }
  anim();
}