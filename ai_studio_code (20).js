/* ===================== COMPOUNDS & ALLOYS 3D ENGINE ===================== */

// Configuration for visual quality
const VIZ_CONF = {
    emerald: 0x10FF78,
    bondRadius: 0.07,
    atomDetail: 32,
    latticeSize: 3,
    latticeSpacing: 1.8
};

/**
 * Renders Molecules (H2O, HCl, etc.) with glowing 3D bonds.
 */
window.drawCompound3D = function(moleculeData) {
    const { scene, camera, renderer, controls } = initSceneCore();
    const atomMeshes = [];

    // 1. Create Atoms
    moleculeData.atoms.forEach((atom) => {
        const symbol = atom.el;
        const color = ATOM_COLOR[symbol] || ATOM_COLOR.default;
        const radius = (ATOM_RADIUS[symbol] || ATOM_RADIUS.default) * 0.85;

        const geo = new THREE.SphereGeometry(radius, VIZ_CONF.atomDetail, VIZ_CONF.atomDetail);
        const mat = new THREE.MeshStandardMaterial({
            color: color,
            metalness: 0.2,
            roughness: 0.1,
            emissive: color,
            emissiveIntensity: 0.2
        });

        const mesh = new THREE.Mesh(geo, mat);
        // Scale positions for visual clarity
        mesh.position.set(atom.pos[0] * 2, atom.pos[1] * 2, atom.pos[2] * 2);
        
        // Metadata for interaction
        const elData = ELEMENTS[symbol];
        mesh.userData = {
            type: 'atom',
            title: `${elData.name} (${symbol})`,
            desc: `Atomic No: ${elData.z} | This element provides the ${atom.role || 'chemical basis'} for this molecule.`
        };

        scene.add(mesh);
        atomMeshes.push(mesh);
    });

    // 2. Create Glowing Bonds
    moleculeData.bonds.forEach((bondPair) => {
        const start = atomMeshes[bondPair[0]].position;
        const end = atomMeshes[bondPair[1]].position;
        
        const distance = start.distanceTo(end);
        const geo = new THREE.CylinderGeometry(VIZ_CONF.bondRadius, VIZ_CONF.bondRadius, distance, 16);
        const mat = new THREE.MeshStandardMaterial({
            color: VIZ_CONF.emerald,
            emissive: VIZ_CONF.emerald,
            emissiveIntensity: 1.5, // Bloom/Glow effect
            transparent: true,
            opacity: 0.85
        });

        const bond = new THREE.Mesh(geo, mat);
        bond.position.copy(start).lerp(end, 0.5);
        bond.lookAt(end);
        bond.rotateX(Math.PI / 2);
        
        bond.userData = {
            type: 'bond',
            title: 'Covalent Bond',
            desc: 'A high-energy electron sharing bond that stabilizes the molecular structure.'
        };

        scene.add(bond);
    });

    startAnimationLoop(scene, camera, renderer, controls);
};

/**
 * Renders Metallic Alloys as a crystal lattice.
 */
window.drawAlloy3D = function(alloyData) {
    const { scene, camera, renderer, controls } = initSceneCore();

    // Create a 3x3x3 lattice
    for (let x = 0; x < VIZ_CONF.latticeSize; x++) {
        for (let y = 0; y < VIZ_CONF.latticeSize; y++) {
            for (let z = 0; z < VIZ_CONF.latticeSize; z++) {
                
                // Randomize metal distribution based on composition
                const rand = Math.random();
                let selected = alloyData.composition[0];
                if (alloyData.composition[1] && rand > alloyData.composition[0].ratio) {
                    selected = alloyData.composition[1];
                }

                const color = ATOM_COLOR[selected.el] || 0xcccccc;
                const geo = new THREE.SphereGeometry(0.55, 24, 24);
                const mat = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: 1.0, // Reflective metallic surface
                    roughness: 0.15,
                    emissive: color,
                    emissiveIntensity: 0.05
                });

                const atom = new THREE.Mesh(geo, mat);
                atom.position.set(
                    (x - 1) * VIZ_CONF.latticeSpacing,
                    (y - 1) * VIZ_CONF.latticeSpacing,
                    (z - 1) * VIZ_CONF.latticeSpacing
                );

                const elData = ELEMENTS[selected.el];
                atom.userData = {
                    title: `${elData.name} in Lattice`,
                    desc: `Concentration: ${(selected.ratio * 100).toFixed(1)}% | ${selected.role}`
                };

                scene.add(atom);
            }
        }
    }

    // Add "Electron Sea" (floating particles)
    const pGeo = new THREE.BufferGeometry();
    const pCoords = new Float32Array(100 * 3);
    for(let i=0; i<300; i++) pCoords[i] = (Math.random() - 0.5) * 10;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pCoords, 3));
    const pMat = new THREE.PointsMaterial({ color: VIZ_CONF.emerald, size: 0.04, transparent: true, opacity: 0.4 });
    scene.add(new THREE.Points(pGeo, pMat));

    startAnimationLoop(scene, camera, renderer, controls);
};

/* ===================== INTERNAL ENGINE HELPERS ===================== */

function initSceneCore() {
    const host = document.getElementById("threeHost");
    host.innerHTML = ""; // Clear existing

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    host.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Interaction Logic
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    renderer.domElement.addEventListener('click', (event) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const data = intersects[0].object.userData;
            if (data.title) {
                document.getElementById("subjectName").innerHTML = `<span style="color:#10FF78">${data.title}</span>`;
                document.getElementById("viewerNote").textContent = data.desc;
            }
        }
    });

    return { scene, camera, renderer, controls };
}

function startAnimationLoop(scene, camera, renderer, controls) {
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    // Allow script.js to dispose later
    window.threeScene = { renderer };
}