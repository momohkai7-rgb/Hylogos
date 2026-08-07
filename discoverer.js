/* =========================================================================
   DISCOVERER — "Discovered By" card, shown only for elements. Content
   shape genuinely differs by mode, so the body is regenerated per mode
   rather than forced into one fixed template.
========================================================================= */

function discovererCardHtml(d) {
  return `
    <div class="disc-portrait-wrap">
      <img class="disc-portrait" src="${d.portrait}" alt="${d.name}" loading="lazy"
           onerror="this.closest('.disc-portrait-wrap').classList.add('disc-portrait-fallback')">
      <div class="disc-portrait-fallback-label">${d.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
    </div>
    <div class="disc-name">${d.name}</div>
    <div class="disc-meta">${d.nationality} · ${d.profession}</div>
    <div class="disc-dates">${d.born}${d.died ? ' – ' + d.died : ' · living'}</div>
    <p class="disc-bio">${d.bio}</p>`;
}

function discovererRenderPair(container, ids, year, location, note) {
  let idx = 0;
  function draw() {
    const d = DISCOVERERS[ids[idx]];
    container.innerHTML = `
      <div class="disc-card-wrap">
        <button class="disc-nav" id="discPrev" aria-label="Previous">‹</button>
        <div class="disc-card" id="discCard">${discovererCardHtml(d)}</div>
        <button class="disc-nav" id="discNext" aria-label="Next">›</button>
      </div>
      <div class="disc-dots">${ids.map((_, i) => `<span class="disc-dot${i === idx ? ' active' : ''}"></span>`).join('')}</div>
      <div class="disc-context">${year} · ${location}${note ? ' — ' + note : ''}</div>`;
    document.getElementById('discPrev').addEventListener('click', () => { idx = (idx - 1 + ids.length) % ids.length; draw(); });
    document.getElementById('discNext').addEventListener('click', () => { idx = (idx + 1) % ids.length; draw(); });
    discovererAttachSwipe(document.getElementById('discCard'), () => { idx = (idx + 1) % ids.length; draw(); }, () => { idx = (idx - 1 + ids.length) % ids.length; draw(); });
  }
  draw();
}

function discovererAttachSwipe(card, onSwipeLeft, onSwipeRight) {
  let startX = 0, dx = 0, dragging = false;
  const threshold = 40;
  card.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; dx = 0; card.setPointerCapture(e.pointerId); card.style.transition = 'none'; });
  card.addEventListener('pointermove', e => {
    if (!dragging) return;
    dx = e.clientX - startX;
    card.style.transform = `translateX(${dx * 0.5}px)`;
    card.style.opacity = String(1 - Math.min(Math.abs(dx) / 260, 0.45));
  });
  function end() {
    if (!dragging) return;
    dragging = false;
    card.style.transition = ''; card.style.transform = ''; card.style.opacity = '';
    if (dx > threshold) onSwipeRight();
    else if (dx < -threshold) onSwipeLeft();
  }
  card.addEventListener('pointerup', end);
  card.addEventListener('pointercancel', end);
  card.addEventListener('pointerleave', () => { if (dragging) end(); });
}

function discovererShow(elementSymbol) {
  const section = document.getElementById('discovererSection');
  if (!section) return;
  const entry = (typeof ELEMENT_DISCOVERY !== 'undefined') ? ELEMENT_DISCOVERY[elementSymbol] : null;
  if (!entry || entry.mode === 'pending') { discovererHide(); return; }

  const body = document.getElementById('discovererBody');

  if (entry.mode === 'ancient') {
    body.innerHTML = `<div class="disc-ancient"><p>${ANCIENT_NOTE}</p></div>`;
  } else if (entry.mode === 'solo') {
    const d = DISCOVERERS[entry.id];
    body.innerHTML = `<div class="disc-card">${discovererCardHtml(d)}</div>
      <div class="disc-context">${entry.year} · ${entry.location}</div>`;
  } else if (entry.mode === 'pair') {
    body.innerHTML = '';
    discovererRenderPair(body, entry.ids, entry.year, entry.location, entry.note);
  } else if (entry.mode === 'many') {
    const rows = entry.people.map(p => `<div class="disc-person-row"><span class="disc-person-name">${p.name}</span><span class="disc-person-meta">${p.nationality} · ${p.profession}</span></div>`).join('');
    body.innerHTML = `
      <div class="disc-many">
        <div class="disc-people-list">${rows}</div>
        <p class="disc-bio">${entry.paragraph}</p>
        <div class="disc-context">${entry.year} · ${entry.location}</div>
      </div>`;
  } else {
    discovererHide();
    return;
  }
  section.classList.remove('hidden');
}

function discovererHide() {
  const section = document.getElementById('discovererSection');
  if (section) section.classList.add('hidden');
}
