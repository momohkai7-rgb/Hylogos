// MatAI — interactive periodic table overlay.
// Standard 18x7 layout with lanthanides/actinides detached below, matching
// conventional periodic table geometry. Color-coded by CATEGORY_META (data.js).
// Tapping a cell feeds straight into the same showSubject() flow as a search.

const GRID_POS = {H:[1,1], He:[18,1], Li:[1,2], Be:[2,2], B:[13,2], C:[14,2], N:[15,2], O:[16,2], F:[17,2], Ne:[18,2], Na:[1,3], Mg:[2,3], Al:[13,3], Si:[14,3], P:[15,3], S:[16,3], Cl:[17,3], Ar:[18,3], K:[1,4], Ca:[2,4], Sc:[3,4], Ti:[4,4], V:[5,4], Cr:[6,4], Mn:[7,4], Fe:[8,4], Co:[9,4], Ni:[10,4], Cu:[11,4], Zn:[12,4], Ga:[13,4], Ge:[14,4], As:[15,4], Se:[16,4], Br:[17,4], Kr:[18,4], Rb:[1,5], Sr:[2,5], Y:[3,5], Zr:[4,5], Nb:[5,5], Mo:[6,5], Tc:[7,5], Ru:[8,5], Rh:[9,5], Pd:[10,5], Ag:[11,5], Cd:[12,5], In:[13,5], Sn:[14,5], Sb:[15,5], Te:[16,5], I:[17,5], Xe:[18,5], Cs:[1,6], Ba:[2,6], La:[3,9], Ce:[4,9], Pr:[5,9], Nd:[6,9], Pm:[7,9], Sm:[8,9], Eu:[9,9], Gd:[10,9], Tb:[11,9], Dy:[12,9], Ho:[13,9], Er:[14,9], Tm:[15,9], Yb:[16,9], Lu:[17,9], Hf:[4,6], Ta:[5,6], W:[6,6], Re:[7,6], Os:[8,6], Ir:[9,6], Pt:[10,6], Au:[11,6], Hg:[12,6], Tl:[13,6], Pb:[14,6], Bi:[15,6], Po:[16,6], At:[17,6], Rn:[18,6], Fr:[1,7], Ra:[2,7], Ac:[3,10], Th:[4,10], Pa:[5,10], U:[6,10], Np:[7,10], Pu:[8,10], Am:[9,10], Cm:[10,10], Bk:[11,10], Cf:[12,10], Es:[13,10], Fm:[14,10], Md:[15,10], No:[16,10], Lr:[17,10], Rf:[4,7], Db:[5,7], Sg:[6,7], Bh:[7,7], Hs:[8,7], Mt:[9,7], Ds:[10,7], Rg:[11,7], Cn:[12,7], Nh:[13,7], Fl:[14,7], Mc:[15,7], Lv:[16,7], Ts:[17,7], Og:[18,7]};

(function () {
  const overlay = document.getElementById('ptableOverlay');
  const toggleBtn = document.getElementById('ptableToggle');
  const closeBtn = document.getElementById('ptableClose');
  const grid = document.getElementById('ptableGrid');
  const legend = document.getElementById('ptableLegend');
  if (!overlay || !grid) return;

  let built = false;

  function buildGrid() {
    if (built) return;
    built = true;

    // Pointer placeholders for the detached f-block rows (standard table convention).
    [{ x: 3, y: 6, label: '57–71', targetY: 9 }, { x: 3, y: 7, label: '89–103', targetY: 10 }]
      .forEach(p => {
        const cell = document.createElement('div');
        cell.className = 'ptable-cell ptable-placeholder';
        cell.style.gridColumn = p.x;
        cell.style.gridRow = p.y;
        cell.textContent = p.label;
        cell.addEventListener('click', () => {
          const target = grid.querySelector(`.ptable-cell[data-ypos="${p.targetY}"][data-xpos="3"]`);
          if (target) target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        });
        grid.appendChild(cell);
      });

    Object.keys(GRID_POS).forEach(sym => {
      const e = ELEMENTS[sym];
      const pos = GRID_POS[sym];
      if (!e || !pos) return;
      const meta = CATEGORY_META[e.category] || { label: e.category, color: '#8b84a3' };

      const cell = document.createElement('div');
      cell.className = 'ptable-cell';
      cell.style.gridColumn = pos[0];
      cell.style.gridRow = pos[1];
      cell.style.setProperty('--accent', meta.color);
      cell.dataset.symbol = sym;
      cell.dataset.xpos = pos[0];
      cell.dataset.ypos = pos[1];
      cell.setAttribute('role', 'button');
      cell.setAttribute('aria-label', `${e.name}, atomic number ${e.z}`);
      cell.innerHTML = `<span class="ptable-z">${e.z}</span><span class="ptable-sym">${sym}</span>`;
      cell.addEventListener('click', () => selectElement(sym));
      grid.appendChild(cell);
    });

    if (legend) {
      Object.values(CATEGORY_META).forEach(meta => {
        const chip = document.createElement('div');
        chip.className = 'ptable-legend-chip';
        chip.style.setProperty('--accent', meta.color);
        chip.innerHTML = `<span class="dot"></span>${meta.label}`;
        legend.appendChild(chip);
      });
    }
  }

  function selectElement(sym) {
    const data = ELEMENTS[sym];
    if (!data) return;
    if (typeof showSubject === 'function') {
      showSubject({ type: 'element', key: sym, data });
    }
    if (typeof els !== 'undefined' && els.search) els.search.value = data.name;
    closeOverlay();
    setTimeout(() => {
      const results = document.getElementById('results');
      if (results) results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  }

  function markActive() {
    grid.querySelectorAll('.ptable-cell.active').forEach(c => c.classList.remove('active'));
    if (typeof currentSubject !== 'undefined' && currentSubject && currentSubject.type === 'element') {
      const cell = grid.querySelector(`.ptable-cell[data-symbol="${currentSubject.key}"]`);
      if (cell) cell.classList.add('active');
    }
  }

  function openOverlay() {
    buildGrid();
    markActive();
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeOverlay() {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (toggleBtn) toggleBtn.addEventListener('click', openOverlay);
  if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeOverlay(); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeOverlay();
  });
})();
