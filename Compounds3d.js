/* =========================================================================
   COMPOUNDS & ALLOYS 3D ENGINE — UPGRADED PREDIUM VERSION
   Matches the visual style and interactivity of atom3d.js
========================================================================= */

const VIZ_THEME = {
    emerald: 0x10FF78,
    bondRadius: 0.06,
    atomDetail: 32,
    latticeSpacing: 1.8
};

// --- Shared Glow Engine (Replicating atom3d logic) ---
let _sharedGlowTex = null;
function getGlowTexture() {
    if (_sharedGlowTex) return _sharedGlowTex;
    const size = 128;
    const c = document.createElement('canvas'); c.width = c.height = size;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(size/2,size/2,0,size/2,size/2,size/2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.45)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.fillRect(0,0,size,size);
    _sharedGlowTex = new THREE.CanvasTexture(c);
    return _sharedGlowTex;
}

function attachGlow(mesh, color, scale, baseOpacity) {
    const tex = getGlowTexture();
    const mat = new THREE.SpriteMaterial({ 
        map: tex, color, transparent: true, 
        blending: THREE.AdditiveBlending, depthWrite: false, opacity: baseOpacity 
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(scale, scale, scale);
    mesh.add(sprite);
    
    // Store for animation/selection
    mesh.userData.glow = sprite;
    mesh.userData.glowBaseScale = scale;
    mesh.userData.glowBaseOpacity = baseOpacity;
}

// --- Core Scene Setup ---
function setupPremiumScene(host) {
    host.innerHTML = "";
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    const camera = new THREE.PerspectiveCamera(45, host.clientWidth / host.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    host.appendChild(renderer.domElement);

    // High-end Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.2));
    const l1 = new THREE.DirectionalLight(0xffffff, 0.8);
    l1.position.set(5, 10, 7);
    scene.add(l1);
    const l2 = new THREE.PointLight(VIZ_THEME.emerald, 0.5, 20);
    l2.position.set(-5, -5, -5);
    scene.add(l2);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    return { scene, camera, renderer, controls };
}

// --- 1. MOLECULES ---
window.drawCompound3D = function(data) {
    const { scene, camera, renderer, controls } = setupPremiumScene(els.threeHost);
    const atomMeshes = [];
    const interactiveObjects = [];

    // Create Atoms
    data.atoms.forEach(a => {
        const symbol = a.el;
        const color = ATOM_COLOR[symbol] || ATOM_COLOR.default;
        const radius = (ATOM_RADIUS[symbol] || ATOM_RADIUS.default) * 0.9;

        const geo = new THREE.SphereGeometry(radius, VIZ_THEME.atomDetail, VIZ_THEME.atomDetail);
        const mat = new THREE.MeshPhysicalMaterial({
            color: color, emissive: color, emissiveIntensity: 0.2,
            metalness: 0.1, roughness: 0.2, clearcoat: 0.8
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(a.pos[0]*2, a.pos[1]*2, a.pos[2]*2);
        
        const elData = ELEMENTS[symbol];
        mesh.userData = { 
            type: 'atom', title: `${elData.name} (${symbol})`, 
            desc: elData.blurb, baseEmissive: 0.2 
        };

        attachGlow(mesh, color, radius * 4, 0.3);
        scene.add(mesh);
        atomMeshes.push(mesh);
        interactiveObjects.push(mesh);
    });

    // Create Glowing Bonds
    data.bonds.forEach(b => {
        const start = atomMeshes[b[0]].position;
        const end = atomMeshes[b[1]].position;
        const dist = start.distanceTo(end);

        const geo = new THREE.CylinderGeometry(VIZ_THEME.bondRadius, VIZ_THEME.bondRadius, dist, 16);
        const mat = new THREE.MeshStandardMaterial({
            color: VIZ_THEME.emerald, emissive: VIZ_THEME.emerald,
            emissiveIntensity: 1.2, transparent: true, opacity: 0.8
        });

        const bond = new THREE.Mesh(geo, mat);
        bond.position.copy(start).lerp(end, 0.5);
        bond.lookAt(end);
        bond.rotateX(Math.PI / 2);
        
        bond.userData = { 
            type: 'bond', title: 'Chemical Bond', 
            desc: 'A covalent electron-sharing interaction stabilizing the molecule.',
            baseEmissive: 1.2
        };

        attachGlow(bond, VIZ_THEME.emerald, dist, 0.15);
        scene.add(bond);
        interactiveObjects.push(bond);
    });

    camera.position.z = 8;
    initInteraction(scene, camera, renderer, interactiveObjects);
    runAnimation(scene, camera, renderer, controls);
};

// --- 2. ALLOYS ---
window.drawAlloy3D = function(data) {
    const { scene, camera, renderer, controls } = setupPremiumScene(els.threeHost);
    const interactiveObjects = [];
    
    // Parse element composition for random distribution
    const symbols = Object.keys(data.elements);
    const totalWeight = Object.values(data.elements).reduce((a, b) => a + b, 0);

    // Create 3x3x3 Lattice
    for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
            for (let z = -1; z <= 1; z++) {
                // Pick element based on weight
                let roll = Math.random() * totalWeight;
                let symbol = symbols[0];
                for (let s of symbols) {
                    if (roll < data.elements[s]) { symbol = s; break; }
                    roll -= data.elements[s];
                }

                const color = ATOM_COLOR[symbol] || 0xcccccc;
                const mesh = new THREE.Mesh(
                    new THREE.SphereGeometry(0.55, 24, 24),
                    new THREE.MeshPhysicalMaterial({ 
                        color: color, metalness: 1.0, roughness: 0.1, 
                        emissive: color, emissiveIntensity: 0.1 
                    })
                );
                mesh.position.set(x * 1.8, y * 1.8, z * 1.8);
                
                mesh.userData = { 
                    title: `${ELEMENTS[symbol].name} (In Lattice)`, 
                    desc: `This ${symbol} atom is part of the metallic crystalline structure of ${data.name}.`,
                    baseEmissive: 0.1
                };

                attachGlow(mesh, color, 2.5, 0.15);
                scene.add(mesh);
                interactiveObjects.push(mesh);
            }
        }
    }

    camera.position.set(5, 5, 8);
    initInteraction(scene, camera, renderer, interactiveObjects);
    runAnimation(scene, camera, renderer, controls);
};

// --- Helper: Interaction ---
function initInteraction(scene, camera, renderer, targets) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selected = null;
    let mouseDownPos = { x: 0, y: 0 };

    renderer.domElement.addEventListener('mousedown', e => {
        mouseDownPos = { x: e.clientX, y: e.clientY };
    });

    renderer.domElement.addEventListener('mouseup', e => {
        const dist = Math.sqrt((e.clientX - mouseDownPos.x)**2 + (e.clientY - mouseDownPos.y)**2);
        if (dist > 5) return; // Ignore drags

        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(targets);

        if (selected) {
            // Reset old selection
            selected.scale.set(1, 1, 1);
            selected.material.emissiveIntensity = selected.userData.baseEmissive;
            selected.userData.glow.scale.setScalar(selected.userData.glowBaseScale);
        }

        if (hits.length > 0) {
            selected = hits[0].object;
            const d = selected.userData;
            // Visual Highlight
            selected.scale.setScalar(1.2);
            selected.material.emissiveIntensity = d.baseEmissive * 3;
            selected.userData.glow.scale.setScalar(selected.userData.glowBaseScale * 1.5);

            // Update UI
            document.getElementById("subjectName").innerHTML = `<span style="color:#10FF78">${d.title}</span>`;
            document.getElementById("viewerNote").textContent = d.desc;
        }
    });
}

// --- Helper: Animation Loop ---
function runAnimation(scene, camera, renderer, controls) {
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
    window.threeScene = { renderer };
}
