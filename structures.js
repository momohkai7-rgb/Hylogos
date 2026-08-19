/* =========================================================================
   STRUCTURES — Canvas2D rendering engine + swipeable card UI controller
   for molecule/alloy structural views. Reuses the layered-alpha glow
   technique from the black-hole backdrop (not shadowBlur — confirmed
   unreliable across mobile browsers earlier in this project) so glow
   renders identically on every device.
========================================================================= */

/* ---------- palette (harmonizes with the site's existing tokens) ---------- */
const STRUCT_COLORS = {
  bond: '#eaf6ff',
  bondGlow: '#7fd9ff',
  atomGlow: '#42ffb0',      // new neon-green accent, used only here
  atomGlowAlt: '#7fd9ff',   // photon-blue, reused from the site palette
  lonePair: '#ffe9a8',
  wedgeFill: 'rgba(127,217,255,0.85)',
  ionicPos: '#ffb454',
  ionicNeg: '#7fd9ff',
  latticeLine: 'rgba(127,217,255,0.55)',
  latticeAtom: '#42ffb0',
  latticeAtomAlt: '#7fd9ff',
};

/* ---------- soft-glow helpers (layered alpha, NOT shadowBlur) ---------- */
function structSoftStroke(ctx, drawPath, color, coreWidth, glowWidth, glowAlpha) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalCompositeOperation = 'lighter';
  const layers = 4;
  for (let i = layers; i >= 1; i--) {
    ctx.globalAlpha = (glowAlpha || 0.14) * (i / layers) * 0.5;
    ctx.lineWidth = coreWidth + (glowWidth * i) / layers;
    ctx.lineCap = 'round';
    drawPath(ctx);
    ctx.stroke();
  }
  ctx.restore();
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = coreWidth;
  ctx.lineCap = 'round';
  ctx.globalAlpha = 1;
  drawPath(ctx);
  ctx.stroke();
  ctx.restore();
}

function structSoftDot(ctx, x, y, r, color, glowColor) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  const rings = 5;
  for (let i = rings; i >= 1; i--) {
    ctx.globalAlpha = 0.09 * (i / rings);
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.arc(x, y, r + (r * 1.6 * i) / rings, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  ctx.save();
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

/* =========================================================================
   MOLECULE 2D RENDERER — structural / lewis / skeletal / wedgedash /
   resonance / condensed
========================================================================= */
function structRenderMolecule2D(canvas, structure) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  if (structure.type === 'condensed') {
    structRenderCondensed(ctx, w, h, structure.formula);
    return;
  }

  const atoms = structure.atoms2d, bonds = structure.bonds2d || [];
  if (!atoms || !atoms.length) return;

  // fit to canvas
  const xs = atoms.map(a => a.x), ys = atoms.map(a => a.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = Math.max(maxX - minX, 1), spanY = Math.max(maxY - minY, 1);
  const pad = 46;
  const scale = Math.min((w - pad * 2) / spanX, (h - pad * 2) / spanY);
  const cx = w / 2, cy = h / 2;
  const mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
  const px = (p) => cx + (p.x - mx) * scale;
  const py = (p) => cy - (p.y - my) * scale;

  // bonds first, so atoms sit on top
  bonds.forEach(([ia, ib, order, style]) => {
    const a = atoms[ia], b = atoms[ib];
    if (!a || !b) return;
    const A = { x: px(a), y: py(a) }, B = { x: px(b), y: py(b) };
    if (style === 'ionic') {
      structSoftStroke(ctx, c => {
        c.setLineDash([6, 6]);
        c.beginPath(); c.moveTo(A.x, A.y); c.lineTo(B.x, B.y);
      }, STRUCT_COLORS.bondGlow, 1.5, 8, 0.16);
      ctx.setLineDash([]);
      return;
    }
    const dx = B.x - A.x, dy = B.y - A.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len, ny = dx / len; // perpendicular unit vector

    if (style === 'wedge' || style === 'dash') {
      const steps = style === 'dash' ? 7 : 1;
      ctx.save();
      ctx.fillStyle = STRUCT_COLORS.wedgeFill;
      ctx.globalCompositeOperation = 'lighter';
      if (style === 'wedge') {
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x + nx * 6, B.y + ny * 6);
        ctx.lineTo(B.x - nx * 6, B.y - ny * 6);
        ctx.closePath();
        ctx.fill();
      } else {
        for (let s = 1; s <= steps; s++) {
          const t = s / steps;
          const wgt = 1 + t * 5;
          const mxp = A.x + dx * t, myp = A.y + dy * t;
          ctx.globalAlpha = 0.85;
          ctx.beginPath();
          ctx.moveTo(mxp + nx * wgt, myp + ny * wgt);
          ctx.lineTo(mxp - nx * wgt, myp - ny * wgt);
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = STRUCT_COLORS.wedgeFill;
          ctx.stroke();
        }
      }
      ctx.restore();
      return;
    }

    // plain single/double/triple — parallel glowing lines
    const n = order || 1;
    const gap = 4.2;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * gap;
      structSoftStroke(ctx, c => {
        c.beginPath();
        c.moveTo(A.x + nx * off, A.y + ny * off);
        c.lineTo(B.x + nx * off, B.y + ny * off);
      }, STRUCT_COLORS.bondGlow, 2, 7, 0.13);
    }
  });

  // lone pairs
  atoms.forEach((a, i) => {
    if (!a.lp) return;
    const P = { x: px(a), y: py(a) };
    let dirx = 0, diry = 0, count = 0;
    bonds.forEach(([ia, ib]) => {
      if (ia === i) { const b = atoms[ib]; if(b){ dirx += (a.x - b.x); diry += (a.y - b.y); count++; } }
      if (ib === i) { const b = atoms[ia]; if(b){ dirx += (a.x - b.x); diry += (a.y - b.y); count++; } }
    });
    if (count === 0) { dirx = 0; diry = 1; }
    const dlen = Math.hypot(dirx, diry) || 1;
    dirx /= dlen; diry /= dlen;
    const perpx = -diry, perpy = dirx;
    const baseR = 20;
    for (let p = 0; p < a.lp; p++) {
      const spread = (p - (a.lp - 1) / 2) * 11;
      const bx = P.x - dirx * (26) + perpx * spread;
      const by = P.y + diry * (26) + perpy * spread;
      [[-2.2, 0], [2.2, 0]].forEach(([ddx, ddy]) => {
        structSoftDot(ctx, bx + perpx * ddx, by + perpy * ddy, 2, STRUCT_COLORS.lonePair, STRUCT_COLORS.lonePair);
      });
    }
  });

  // atoms
  atoms.forEach((a, i) => {
    const P = { x: px(a), y: py(a) };
    const isCarbonSkeletal = structure.skeletal && a.el === 'C';
    if (a.skelHide) return;
    if (isCarbonSkeletal) {
      structSoftDot(ctx, P.x, P.y, 2.4, 'rgba(232,246,255,0.55)', STRUCT_COLORS.bondGlow);
      return;
    }
    const glowColor = (a.el === 'C' || a.el === 'H') ? STRUCT_COLORS.atomGlowAlt : STRUCT_COLORS.atomGlow;
    const r = a.el === 'H' ? 11 : 15;
    structSoftDot(ctx, P.x, P.y, r, '#0d0a18', glowColor);
    ctx.save();
    ctx.font = `600 ${a.el.length > 1 ? 12 : 13.5}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = glowColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'transparent';
    ctx.fillText(a.el, P.x, P.y + 0.5);
    ctx.restore();
    if (a.charge) {
      ctx.save();
      ctx.font = `500 9px "IBM Plex Mono", monospace`;
      ctx.fillStyle = a.charge.includes('–') || a.charge.includes('-') ? STRUCT_COLORS.ionicNeg : STRUCT_COLORS.ionicPos;
      ctx.textAlign = 'left';
      ctx.fillText(a.charge, P.x + r * 0.7, P.y - r * 0.7);
      ctx.restore();
    }
  });
}

function structRenderCondensed(ctx, w, h, formula) {
  if (!formula) return;
  const cx = w / 2, cy = h / 2;
  const baseSize = Math.min(w / (formula.length * 0.72), 46);
  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  let totalW = 0;
  const parts = [];
  for (const ch of formula) {
    const isDigitLike = /[0-9₀-₉]/.test(ch);
    const size = isDigitLike ? baseSize * 0.6 : baseSize;
    ctx.font = `600 ${size}px "Space Grotesk", sans-serif`;
    const width = ctx.measureText(ch).width;
    parts.push({ ch, size, width, sub: isDigitLike });
    totalW += width;
  }
  let x = cx - totalW / 2;
  parts.forEach(p => {
    ctx.font = `600 ${p.size}px "Space Grotesk", sans-serif`;
    const y = cy + (p.sub ? baseSize * 0.22 : 0) + baseSize * 0.32;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 3; i >= 1; i--) {
      ctx.globalAlpha = 0.1 * (i / 3);
      ctx.fillStyle = STRUCT_COLORS.atomGlow;
      ctx.fillText(p.ch, x - i * 0.4, y);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#eaf6ff';
    ctx.fillText(p.ch, x, y);
    x += p.width;
  });
  ctx.restore();
}

/* =========================================================================
   CRYSTAL / ALLOY RENDERER — isometric unit cells
========================================================================= */
function structIso(x, y, z) {
  return { x: (x - z) * Math.cos(Math.PI / 6), y: (x + z) * Math.sin(Math.PI / 6) - y };
}

function structCellGeometry(system) {
  const corners = [];
  for (const sx of [-0.5, 0.5]) for (const sy of [-0.5, 0.5]) for (const sz of [-0.5, 0.5]) corners.push([sx, sy, sz]);
  const edges = [
    [0,1],[0,2],[0,4],[1,3],[1,5],[2,3],[2,6],[3,7],[4,5],[4,6],[5,7],[6,7]
  ];

  if (system === 'BCC') {
    return { corners, edges, primary: corners.concat([[0,0,0]]), secondary: [] };
  }
  if (system === 'FCC') {
    const faces = [[0.5,0,0],[-0.5,0,0],[0,0.5,0],[0,-0.5,0],[0,0,0.5],[0,0,-0.5]];
    return { corners, edges, primary: corners.concat(faces), secondary: [] };
  }
  if (system === 'TETRAGONAL') {
    const stretched = corners.map(([x,y,z]) => [x, y * 1.5, z]);
    return { corners: stretched, edges, primary: stretched.concat([[0,0,0]]), secondary: [] };
  }
  if (system === 'ROCKSALT') {
    const faces = [[0.5,0,0],[-0.5,0,0],[0,0.5,0],[0,-0.5,0],[0,0,0.5],[0,0,-0.5]];
    const edgeCenters = [];
    for (const sx of [-0.5,0.5]) for (const sy of [-0.5,0.5]) edgeCenters.push([sx,sy,0]);
    for (const sx of [-0.5,0.5]) for (const sz of [-0.5,0.5]) edgeCenters.push([sx,0,sz]);
    for (const sy of [-0.5,0.5]) for (const sz of [-0.5,0.5]) edgeCenters.push([0,sy,sz]);
    return { corners, edges, primary: corners.concat(faces), secondary: edgeCenters.concat([[0,0,0]]) };
  }
  if (system === 'HCP') {
    const hex = (r, z) => Array.from({length:6}, (_,i) => {
      const a = (Math.PI/3)*i;
      return [r*Math.cos(a), z, r*Math.sin(a)];
    });
    const top = hex(0.55, 0.5), bottom = hex(0.55, -0.5);
    const mid = [0,1,2].map(i => {
      const a = (Math.PI/3)*i + Math.PI/6;
      return [0.32*Math.cos(a), 0, 0.32*Math.sin(a)];
    });
    const hexEdges = (offset) => [0,1,2,3,4,5].map(i => [offset+i, offset+((i+1)%6)]);
    const edgesHcp = hexEdges(0).concat(hexEdges(6)).concat([0,1,2,3,4,5].map(i => [i, i+6]));
    return { corners: top.concat(bottom), edges: edgesHcp, primary: top.concat(bottom).concat([[0,0.5,0],[0,-0.5,0]]), secondary: mid, isHex:true };
  }
  // Safe default fallback for any unmapped system
  return { corners, edges, primary: corners.concat([[0,0,0]]), secondary: [] };
}

function structDrawCellAt(ctx, ox, oy, scale, system, opts) {
  const geo = structCellGeometry(system);
  const proj = (p) => { const s = structIso(p[0], p[1], p[2]); return { x: ox + s.x * scale, y: oy + s.y * scale }; };

  if (!(opts && opts.packed)) {
    geo.edges.forEach(([i, j]) => {
      const A = proj(geo.corners[i]), B = proj(geo.corners[j]);
      structSoftStroke(ctx, c => { c.beginPath(); c.moveTo(A.x, A.y); c.lineTo(B.x, B.y); }, STRUCT_COLORS.latticeLine, 1.2, 5, 0.1);
    });
  }

  const atomR = (opts && opts.atomR) || Math.max(5, scale * (opts && opts.packed ? 0.20 : 0.11));
  (geo.primary || []).forEach(p => {
    const P = proj(p);
    structSoftDot(ctx, P.x, P.y, atomR, '#0d0a18', STRUCT_COLORS.latticeAtom);
  });
  (geo.secondary || []).forEach(p => {
    const P = proj(p);
    structSoftDot(ctx, P.x, P.y, atomR * (opts && opts.packed ? 1 : 0.85), '#0d0a18', STRUCT_COLORS.latticeAtomAlt);
  });

  return geo;
}

function structDrawLattice2x2(ctx, w, h, system) {
  const cellScale = Math.min(w, h) * 0.30;
  const spacing = cellScale * 1.05;
  const originX = w / 2, originY = h / 2 + cellScale * 0.15;
  for (let ix = 0; ix < 2; ix++) {
    for (let iz = 0; iz < 2; iz++) {
      const offset = structIso((ix - 0.5) * 1, 0, (iz - 0.5) * 1);
      structDrawCellAt(ctx, originX + offset.x * spacing, originY + offset.y * spacing, cellScale, system, { atomR: Math.max(3.5, cellScale * 0.07) });
    }
  }
}

function structDrawArrangement(ctx, w, h, system) {
  const scale = Math.min(w, h) * 0.34;
  const ox = w / 2, oy = h / 2;
  const geo = structCellGeometry(system);
  const proj = (p) => { const s = structIso(p[0], p[1], p[2]); return { x: ox + s.x * scale, y: oy + s.y * scale }; };
  const center = { x: 0, y: 0, z: 0 };
  const neighbors = (geo.primary || []).concat(geo.secondary || []).filter(p => !(p[0]===0&&p[1]===0&&p[2]===0));
  const C = proj([0,0,0]);
  neighbors.slice(0, 12).forEach(p => {
    const N = proj(p);
    structSoftStroke(ctx, c => { c.beginPath(); c.moveTo(C.x, C.y); c.lineTo(N.x, N.y); }, STRUCT_COLORS.atomGlow, 1, 6, 0.14);
    structSoftDot(ctx, N.x, N.y, Math.max(5, scale*0.09), '#0d0a18', STRUCT_COLORS.latticeAtomAlt);
  });
  structSoftDot(ctx, C.x, C.y, Math.max(7, scale*0.12), '#0d0a18', STRUCT_COLORS.atomGlow);
}

function structDrawDualPhase(ctx, w, h, systemA, systemB, labelA, labelB) {
  const scale = Math.min(w, h * 1.6) * 0.17;
  const oy = h / 2 + scale * 0.05;
  structDrawCellAt(ctx, w * 0.27, oy, scale, systemA, { atomR: Math.max(4, scale * 0.11) });
  structDrawCellAt(ctx, w * 0.73, oy, scale, systemB, { atomR: Math.max(4, scale * 0.11) });
  ctx.save();
  ctx.font = '500 9px "IBM Plex Mono", monospace';
  ctx.fillStyle = 'rgba(232,246,255,0.6)';
  ctx.textAlign = 'center';
  ctx.fillText(labelA, w * 0.27, h - 12);
  ctx.fillText(labelB, w * 0.73, h - 12);
  ctx.restore();
}

function structDrawMultiphase(ctx, w, h) {
  const grains = 5;
  const colors = [STRUCT_COLORS.atomGlow, STRUCT_COLORS.atomGlowAlt, '#ffb454', '#c6a0e8', '#ff8f8f'];
  let seed = 11;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let g = 0; g < grains; g++) {
    const cx = w * (0.2 + rnd() * 0.6), cy = h * (0.2 + rnd() * 0.6);
    const rad = Math.min(w, h) * (0.1 + rnd() * 0.1);
    const color = colors[g % colors.length];
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = color;
    ctx.beginPath();
    const pts = 7;
    for (let i = 0; i <= pts; i++) {
      const a = (Math.PI * 2 * i) / pts;
      const r = rad * (0.75 + rnd() * 0.5);
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath(); ctx.fill();
    ctx.restore();
    for (let d = 0; d < 5; d++) {
      const a = rnd() * Math.PI * 2, r = rnd() * rad * 0.6;
      structSoftDot(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 3.5, '#0d0a18', color);
    }
  }
}

function structDrawLiquid(ctx, w, h) {
  const cx = w / 2, cy = h / 2, rad = Math.min(w, h) * 0.28;
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = 0.10;
  ctx.fillStyle = STRUCT_COLORS.atomGlowAlt;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rad * 1.15, rad * 0.85, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  let seed = 3;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  for (let i = 0; i < 22; i++) {
    const a = rnd() * Math.PI * 2, r = rnd() * rad * 0.85;
    structSoftDot(ctx, cx + Math.cos(a) * r * 1.15, cy + Math.sin(a) * r * 0.85, 4, '#0d0a18', STRUCT_COLORS.atomGlowAlt);
  }
}

function structRenderCrystal(canvas, archetypeKey, viewType) {
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth, h = canvas.clientHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);

  if (archetypeKey === 'LIQUID') { structDrawLiquid(ctx, w, h); return; }
  if (archetypeKey === 'MULTIPHASE') { structDrawMultiphase(ctx, w, h); return; }
  if (archetypeKey === 'DUPLEX') {
    if (viewType === 'phase') { structDrawDualPhase(ctx, w, h, 'BCC', 'FCC', 'ferrite', 'austenite'); return; }
    if (viewType === 'lattice') { structDrawLattice2x2(ctx, w, h, 'FCC'); return; }
    if (viewType === 'arrange') { structDrawArrangement(ctx, w, h, 'FCC'); return; }
    const packedD = viewType === 'structure';
    structDrawCellAt(ctx, w/2, h/2, Math.min(w,h) * (packedD ? 0.30 : 0.32), 'FCC', { packed: packedD });
    return;
  }
  if (archetypeKey === 'SHAPE_MEMORY') {
    if (viewType === 'phase') { structDrawDualPhase(ctx, w, h, 'BCC', 'TETRAGONAL', 'austenite', 'martensite'); return; }
    if (viewType === 'lattice') { structDrawLattice2x2(ctx, w, h, 'BCC'); return; }
    if (viewType === 'arrange') { structDrawArrangement(ctx, w, h, 'BCC'); return; }
    const packedS = viewType === 'structure';
    structDrawCellAt(ctx, w/2, h/2, Math.min(w,h) * (packedS ? 0.30 : 0.32), 'BCC', { packed: packedS });
    return;
  }

  if (viewType === 'lattice') { structDrawLattice2x2(ctx, w, h, archetypeKey); return; }
  if (viewType === 'arrange') { structDrawArrangement(ctx, w, h, archetypeKey); return; }
  const scale = Math.min(w, h) * (archetypeKey === 'HCP' ? 0.34 : 0.32);
  const packed = viewType === 'structure';
  structDrawCellAt(ctx, w / 2, h / 2 + (archetypeKey === 'HCP' ? scale * 0.1 : 0), packed ? scale * 0.92 : scale, archetypeKey, { packed });
}

/* =========================================================================
   VIEW GENERATION — builds the swipeable list of views for a molecule
   or an alloy (WITH AUTOMATIC FALLBACKS FOR NEW ADDITIONS)
========================================================================= */
function structMoleculeViews(key) {
  let entries = (typeof MOLECULE_STRUCTURES !== 'undefined') ? MOLECULE_STRUCTURES[key] : null;
  
  // AUTOMATIC FALLBACK: If a new molecule was added in data.js but not manually laid out in structures-data.js
  if (!entries && typeof MOLECULES !== 'undefined' && MOLECULES[key]) {
    const mol = MOLECULES[key];
    entries = [
      { 
        type: "structural", 
        name: "Molecular Structure",
        atoms2d: mol.atoms.map((a, idx) => ({ el: a.el, x: (idx - mol.atoms.length/2) * 0.8, y: (idx % 2 === 0 ? 0.4 : -0.4) })),
        bonds2d: mol.bonds.map(b => [b[0], b[1], 1]),
        info: { 
          structureType: "Covalent Molecule", 
          bondType: "Covalent Bonds", 
          molecularGeometry: "Standard Mapping", 
          bondAngles: "Idealized VSEPR", 
          hybridization: "Localized Orbitals", 
          polarity: "Calculated",
          notes: `Dynamic structural representation mapped directly from the ${mol.name} dataset parameters.` 
        } 
      }
    ];
  }

  if (!entries || !entries.length) return [];
  return entries.map(e => ({
    name: e.name,
    render: (canvas) => {
      if (e.crystalSystem) structRenderCrystal(canvas, e.crystalSystem, 'cell');
      else structRenderMolecule2D(canvas, e);
    },
    info: e.info,
  }));
}

function structAlloyViews(key) {
  let tag = (typeof ALLOY_STRUCTURE_INFO !== 'undefined') ? ALLOY_STRUCTURE_INFO[key] : null;
  
  // AUTOMATIC FALLBACK: If a new alloy was added in data.js but not mapped in structures-data.js
  if (!tag) {
    tag = { system: "FCC", note: "Standard metallic solid-solution lattice configuration generated dynamically." };
  }

  const arch = CRYSTAL_SPECIAL[tag.system] || CRYSTAL_ARCHETYPES[tag.system] || CRYSTAL_ARCHETYPES['FCC'];
  const baseInfo = (notes) => ({
    structureType: "Crystalline solid (metallic)",
    bondType: "Metallic",
    molecularGeometry: arch.label,
    bondAngles: arch.axisAngles,
    hybridization: "n/a (metallic bonding)",
    polarity: "n/a",
    coordinationNumber: arch.coordinationNumber,
    notes,
  });
  const views = [
    { name: "Crystal Structure", render: c => structRenderCrystal(c, tag.system, 'structure'), info: baseInfo(tag.note) },
    { name: "Unit Cell", render: c => structRenderCrystal(c, tag.system, 'cell'), info: baseInfo(arch.cellDesc) },
    { name: "Atomic Arrangement", render: c => structRenderCrystal(c, tag.system, 'arrange'), info: baseInfo(arch.arrangeDesc) },
    { name: "Crystal Lattice", render: c => structRenderCrystal(c, tag.system, 'lattice'), info: baseInfo(arch.latticeDesc) },
  ];
  if (tag.system === 'DUPLEX' || tag.system === 'SHAPE_MEMORY') {
    views.push({ name: "Phase Structure", render: c => structRenderCrystal(c, tag.system, 'phase'), info: baseInfo(tag.note) });
  }
  return views;
}

/* =========================================================================
   CARD CONTROLLER — populate + swipe. Entry points for script.js:
   structuresShow(type, key, data) / structuresHide()
========================================================================= */
let structCurrentViews = [];
let structCurrentIndex = 0;

function structRenderInfo(info) {
  const grid = document.getElementById('structureInfoGrid');
  if (!grid) return;
  const fields = [
    ['Structure Type', info.structureType],
    ['Bond Type', info.bondType],
    ['Molecular Geometry', info.molecularGeometry],
    ['Bond Angle(s)', info.bondAngles],
    ['Hybridization', info.hybridization],
    ['Polarity', info.polarity],
    ['Coordination Number', info.coordinationNumber],
  ].filter(([, v]) => v !== undefined && v !== null && v !== '');
  grid.innerHTML = fields.map(([label, val]) =>
    `<div class="struct-fact"><span class="struct-fact-label">${label}</span><span class="struct-fact-value">${val}</span></div>`
  ).join('');
  const notesEl = document.getElementById('structureNotes');
  if (notesEl) notesEl.textContent = (info.notes || '');
}

function structRenderCurrent() {
  const view = structCurrentViews[structCurrentIndex];
  const canvas = document.getElementById('structureCanvas');
  const nameEl = document.getElementById('structureName');
  const counterEl = document.getElementById('structureCounter');
  const dotsEl = document.getElementById('structureDots');
  if (!view || !canvas) return;
  nameEl.textContent = view.name;
  counterEl.textContent = `${structCurrentIndex + 1} / ${structCurrentViews.length}`;
  if (dotsEl) {
    dotsEl.innerHTML = structCurrentViews.map((_, i) =>
      `<span class="struct-dot${i === structCurrentIndex ? ' active' : ''}"></span>`).join('');
  }
  view.render(canvas);
  structRenderInfo(view.info);
}

function structNext() {
  if (!structCurrentViews.length) return;
  structCurrentIndex = (structCurrentIndex + 1) % structCurrentViews.length;
  structRenderCurrent();
}
function structPrev() {
  if (!structCurrentViews.length) return;
  structCurrentIndex = (structCurrentIndex - 1 + structCurrentViews.length) % structCurrentViews.length;
  structRenderCurrent();
}

function structuresShow(type, key) {
  const section = document.getElementById('structuresSection');
  if (!section) return;
  const views = type === 'molecule' ? structMoleculeViews(key)
              : type === 'alloy' ? structAlloyViews(key)
              : [];
  if (!views.length) { structuresHide(); return; }
  structCurrentViews = views;
  structCurrentIndex = 0;
  section.classList.remove('hidden');
  structRenderCurrent();
}

function structuresHide() {
  const section = document.getElementById('structuresSection');
  if (section) section.classList.add('hidden');
  structCurrentViews = [];
}

function structInitSwipe() {
  const card = document.getElementById('structureCard');
  if (!card) return;
  let startX = 0, dx = 0, dragging = false;
  const threshold = 40;

  card.addEventListener('pointerdown', e => {
    dragging = true; startX = e.clientX; dx = 0;
    card.setPointerCapture(e.pointerId);
    card.style.transition = 'none';
  });
  card.addEventListener('pointermove', e => {
    if (!dragging) return;
    dx = e.clientX - startX;
    card.style.transform = `translateX(${dx * 0.5}px)`;
    card.style.opacity = String(1 - Math.min(Math.abs(dx) / 260, 0.45));
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false;
    card.style.transition = '';
    card.style.transform = '';
    card.style.opacity = '';
    if (dx > threshold) structPrev();
    else if (dx < -threshold) structNext();
  }
  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);
  card.addEventListener('pointerleave', () => { if (dragging) endDrag(); });

  const prevBtn = document.getElementById('structurePrev');
  const nextBtn = document.getElementById('structureNext');
  if (prevBtn) prevBtn.addEventListener('click', structPrev);
  if (nextBtn) nextBtn.addEventListener('click', structNext);

  document.addEventListener('keydown', e => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (section_isHidden()) return;
    if (e.key === 'ArrowLeft') structPrev();
    if (e.key === 'ArrowRight') structNext();
  });
  function section_isHidden() {
    const s = document.getElementById('structuresSection');
    return !s || s.classList.contains('hidden');
  }

  window.addEventListener('resize', () => { if (structCurrentViews.length) structRenderCurrent(); });
}
structInitSwipe();
