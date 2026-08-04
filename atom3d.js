/* ---- PREMIUM COMPOUND VIEWER ---- */
function drawCompound3D(molData) {
  const host = document.getElementById('threeHost');
  const { scene, camera, renderer, controls } = atom3dInitScene(host);
  const molGroup = new THREE.Group();
  scene.add(molGroup);

  // 1. Build Atoms with High-End Glow
  molData.atoms.forEach(atom => {
    const color = ATOM_COLOR[atom.el] || ATOM_COLOR.default;
    const radius = (ATOM_RADIUS[atom.el] || 0.5) * 1.1;
    const mat = new THREE.MeshPhysicalMaterial({ color, emissive: color, emissiveIntensity: 0.5, roughness: 0.1, metalness: 0.2, clearcoat: 1 });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat);
    mesh.position.set(...atom.pos);
    atom3dAttachGlow(mesh, color, radius * 3, 0.3); // Uses your existing glow function
    molGroup.add(mesh);
  });

  // 2. Build Glowing "Energy" Bonds
  molData.bonds.forEach(pair => {
    const start = new THREE.Vector3(...molData.atoms[pair[0]].pos);
    const end = new THREE.Vector3(...molData.atoms[pair[1]].pos);
    const dist = start.distanceTo(end);
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, dist, 12),
      new THREE.MeshBasicMaterial({ color: 0x7fd9ff, transparent: true, opacity: 0.6 })
    );
    mesh.position.copy(start).lerp(end, 0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), end.clone().sub(start).normalize());
    molGroup.add(mesh);
  });

  // Animation Loop
  function anim() {
    controls.update();
    molGroup.rotation.y += 0.003; // Subtle idle rotation
    renderer.render(scene, camera);
    threeScene.animId = requestAnimationFrame(anim);
  }
  anim();
}

/* ---- PREMIUM ALLOY VIEWER ---- */
function drawAlloy3D(alloyData) {
  const host = document.getElementById('threeHost');
  const { scene, camera, renderer, controls } = atom3dInitScene(host);
  const lattice = new THREE.Group();
  scene.add(lattice);

  // Create a 3x3x3 Metallic Grid
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        const isBase = Math.random() > 0.2;
        const color = isBase ? 0x999999 : 0xffb454; // Base metal vs Alloy element
        const mat = new THREE.MeshPhysicalMaterial({ color, metalness: 1, roughness: 0.1, clearcoat: 1 });
        const atom = new THREE.Mesh(new THREE.SphereGeometry(0.7, 32, 32), mat);
        atom.position.set(x * 1.8, y * 1.8, z * 1.8);
        lattice.add(atom);
      }
    }
  }

  function anim() {
    controls.update();
    lattice.rotation.y += 0.002;
    renderer.render(scene, camera);
    threeScene.animId = requestAnimationFrame(anim);
  }
  anim();
}

/* ---- SHARED HELPER (Simplifies everything) ---- */
function atom3dInitScene(host) {
  const width = host.clientWidth, height = host.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 10;
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  host.appendChild(renderer.domElement);
  
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  return { scene, camera, renderer, controls };
}
