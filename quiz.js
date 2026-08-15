/* ===================== Quiz mode ===================== */
(function quizModule() {
  const els = {
    toggle: document.getElementById("quizToggle"),
    overlay: document.getElementById("quizOverlay"),
    close: document.getElementById("quizClose"),
    streakBadge: document.getElementById("quizStreakBadge"),
    catScreen: document.getElementById("quizCategoryScreen"),
    catButtons: document.querySelectorAll(".quiz-cat-btn"),
    qScreen: document.getElementById("quizQuestionScreen"),
    scoreEl: document.getElementById("quizScore"),
    changeCat: document.getElementById("quizChangeCat"),
    questionText: document.getElementById("quizQuestionText"),
    answersHost: document.getElementById("quizAnswers"),
    feedback: document.getElementById("quizFeedback"),
    nextBtn: document.getElementById("quizNext"),
  };

  // Bail safely if the markup isn't present, rather than throwing.
  if (!els.toggle || !els.overlay) return;

  const STORAGE_KEY = "hylogos_quiz_best_streak";

  const state = {
    category: null,
    streak: 0,
    bestStreak: loadBestStreak(),
    correct: 0,
    answered: 0,
    current: null,
  };

  function loadBestStreak() {
    try {
      const v = parseInt(localStorage.getItem(STORAGE_KEY), 10);
      return Number.isFinite(v) && v > 0 ? v : 0;
    } catch (e) { return 0; }
  }

  function saveBestStreak(v) {
    try { localStorage.setItem(STORAGE_KEY, String(v)); } catch (e) { /* storage unavailable, ignore */ }
  }

  /* ---------- generic helpers ---------- */

  function randInt(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[randInt(arr.length)]; }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = randInt(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Picks n distractor VALUES (via valueFn over keys) that are distinct from
  // correctValue and from each other. Returns null if it can't find enough —
  // callers treat null as "skip this question, try another".
  function distractorValues(keys, valueFn, correctValue, n, excludeKeys) {
    const exclude = excludeKeys || [];
    const seen = new Set([correctValue]);
    const out = [];
    const poolKeys = shuffle(keys.filter(k => !exclude.includes(k)));
    for (const k of poolKeys) {
      const v = valueFn(k);
      if (!seen.has(v)) { seen.add(v); out.push(v); }
      if (out.length === n) break;
    }
    return out.length === n ? out : null;
  }

  function buildChoices(correct, distractors) {
    const choices = shuffle([correct, ...distractors]);
    return { choices, correctIndex: choices.indexOf(correct) };
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------- data pools ---------- */

  const ELEMENT_SYMS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : [];
  const MOLECULE_KEYS = (typeof MOLECULES !== "undefined") ? Object.keys(MOLECULES) : [];
  const ALLOY_KEYS = (typeof ALLOYS !== "undefined") ? Object.keys(ALLOYS) : [];
  const CATEGORY_KEYS = (typeof CATEGORY_META !== "undefined") ? Object.keys(CATEGORY_META) : [];

  const elementName = sym => ELEMENTS[sym].name;
  const moleculeName = key => MOLECULES[key].name;
  const moleculeFormula = key => MOLECULES[key].formula;
  const alloyName = key => ALLOYS[key].name;
  const alloyFormula = key => ALLOYS[key].formula;

  // Alloys with a formula shared by more than one entry (e.g. two different
  // alloys both simplify to "Cu–Ni") make "which alloy has formula X"
  // ambiguous, so those get excluded from that specific question type.
  const alloyFormulaGroups = {};
  ALLOY_KEYS.forEach(k => {
    const f = alloyFormula(k);
    (alloyFormulaGroups[f] = alloyFormulaGroups[f] || []).push(k);
  });

  /* ---------- ELEMENT question generators ---------- */

  function q_symbolToName() {
    const sym = pick(ELEMENT_SYMS);
    const correct = elementName(sym);
    const distractors = distractorValues(ELEMENT_SYMS, elementName, correct, 3, [sym]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(correct, distractors);
    return { text: `What element has the symbol "${sym}"?`, choices, correctIndex, explain: ELEMENTS[sym].blurb };
  }

  function q_nameToSymbol() {
    const sym = pick(ELEMENT_SYMS);
    const distractors = distractorValues(ELEMENT_SYMS, k => k, sym, 3, [sym]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(sym, distractors);
    return { text: `What is the chemical symbol for ${elementName(sym)}?`, choices, correctIndex, explain: ELEMENTS[sym].blurb };
  }

  function q_category() {
    const candidates = ELEMENT_SYMS.filter(s => CATEGORY_KEYS.includes(ELEMENTS[s].category));
    if (!candidates.length) return null;
    const sym = pick(candidates);
    const cat = ELEMENTS[sym].category;
    const correct = CATEGORY_META[cat].label;
    const distractors = distractorValues(CATEGORY_KEYS, c => CATEGORY_META[c].label, correct, 3, [cat]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(correct, distractors);
    return { text: `What category does ${elementName(sym)} (${sym}) belong to?`, choices, correctIndex, explain: ELEMENTS[sym].blurb };
  }

  function q_phase() {
    const candidates = ELEMENT_SYMS.filter(s => ELEMENTS[s].phase);
    if (!candidates.length) return null;
    const sym = pick(candidates);
    const correct = ELEMENTS[sym].phase;
    const distractors = ["Solid", "Liquid", "Gas"].filter(p => p !== correct);
    const { choices, correctIndex } = buildChoices(correct, distractors);
    return { text: `What phase is ${elementName(sym)} in at room temperature?`, choices, correctIndex, explain: ELEMENTS[sym].blurb };
  }

  function q_meltCompare() {
    const candidates = ELEMENT_SYMS.filter(s => typeof ELEMENTS[s].melt === "number");
    if (candidates.length < 2) return null;
    const a = pick(candidates);
    let b = pick(candidates), guard = 0;
    while (b === a && guard++ < 20) b = pick(candidates);
    if (b === a) return null;
    const higher = ELEMENTS[a].melt >= ELEMENTS[b].melt ? a : b;
    const choices = shuffle([elementName(a), elementName(b)]);
    return {
      text: "Which has the higher melting point?",
      choices, correctIndex: choices.indexOf(elementName(higher)),
      explain: `${elementName(a)} melts at ${ELEMENTS[a].melt}°C, ${elementName(b)} melts at ${ELEMENTS[b].melt}°C.`,
    };
  }

  function q_densityCompare() {
    const byUnit = {};
    ELEMENT_SYMS.forEach(s => {
      if (typeof ELEMENTS[s].density !== "number") return;
      const u = ELEMENTS[s].densityUnit;
      (byUnit[u] = byUnit[u] || []).push(s);
    });
    const units = Object.keys(byUnit).filter(u => byUnit[u].length >= 2);
    if (!units.length) return null;
    const pool = byUnit[pick(units)];
    const a = pick(pool);
    let b = pick(pool), guard = 0;
    while (b === a && guard++ < 20) b = pick(pool);
    if (b === a) return null;
    const unit = ELEMENTS[a].densityUnit;
    const higher = ELEMENTS[a].density >= ELEMENTS[b].density ? a : b;
    const choices = shuffle([elementName(a), elementName(b)]);
    return {
      text: "Which is denser?",
      choices, correctIndex: choices.indexOf(elementName(higher)),
      explain: `${elementName(a)}: ${ELEMENTS[a].density} ${unit} · ${elementName(b)}: ${ELEMENTS[b].density} ${unit}`,
    };
  }

  function q_atomicNumber() {
    const sym = pick(ELEMENT_SYMS);
    const z = ELEMENTS[sym].z;
    const distractorSet = new Set();
    let guard = 0;
    while (distractorSet.size < 3 && guard++ < 60) {
      const offset = randInt(10) + 1;
      const cand = Math.random() < 0.5 ? z + offset : z - offset;
      if (cand >= 1 && cand <= 118 && cand !== z) distractorSet.add(cand);
    }
    if (distractorSet.size < 3) return null;
    const { choices, correctIndex } = buildChoices(String(z), Array.from(distractorSet).map(String));
    return { text: `What is the atomic number of ${elementName(sym)} (${sym})?`, choices, correctIndex, explain: ELEMENTS[sym].blurb };
  }

  function q_elementBlurb() {
    const candidates = ELEMENT_SYMS.filter(s => ELEMENTS[s].blurb);
    if (!candidates.length) return null;
    const sym = pick(candidates);
    const correct = elementName(sym);
    const distractors = distractorValues(ELEMENT_SYMS, elementName, correct, 3, [sym]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(correct, distractors);
    return { text: `Which element is this? "${ELEMENTS[sym].blurb}"`, choices, correctIndex, explain: `${correct} (${sym})` };
  }

  const ELEMENT_GENERATORS = [
    q_symbolToName, q_nameToSymbol, q_category, q_phase,
    q_meltCompare, q_densityCompare, q_atomicNumber, q_elementBlurb,
  ];

  /* ---------- COMPOUND question generators ---------- */

  function q_formulaToName() {
    const key = pick(MOLECULE_KEYS);
    const m = MOLECULES[key];
    const distractors = distractorValues(MOLECULE_KEYS, moleculeName, m.name, 3, [key]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(m.name, distractors);
    return { text: `What is the common name of ${m.formula}?`, choices, correctIndex, explain: MOLECULE_BLURBS[key] || "" };
  }

  function q_nameToFormula() {
    const key = pick(MOLECULE_KEYS);
    const m = MOLECULES[key];
    const distractors = distractorValues(MOLECULE_KEYS, moleculeFormula, m.formula, 3, [key]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(m.formula, distractors);
    return { text: `What is the chemical formula of ${m.name}?`, choices, correctIndex, explain: MOLECULE_BLURBS[key] || "" };
  }

  function q_atomCount() {
    const key = pick(MOLECULE_KEYS);
    const m = MOLECULES[key];
    const correct = m.atoms.length;
    const distractorSet = new Set();
    let guard = 0;
    while (distractorSet.size < 3 && guard++ < 60) {
      const offset = randInt(3) + 1;
      const cand = Math.random() < 0.5 ? correct + offset : correct - offset;
      if (cand >= 1 && cand !== correct) distractorSet.add(cand);
    }
    if (distractorSet.size < 3) return null;
    const { choices, correctIndex } = buildChoices(String(correct), Array.from(distractorSet).map(String));
    return { text: `How many atoms make up one molecule of ${m.name} (${m.formula})?`, choices, correctIndex, explain: MOLECULE_BLURBS[key] || "" };
  }

  function q_compoundBlurb() {
    const candidates = MOLECULE_KEYS.filter(k => MOLECULE_BLURBS[k]);
    if (!candidates.length) return null;
    const key = pick(candidates);
    const m = MOLECULES[key];
    const distractors = distractorValues(MOLECULE_KEYS, moleculeName, m.name, 3, [key]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(m.name, distractors);
    return { text: `Which compound is this? "${MOLECULE_BLURBS[key]}"`, choices, correctIndex, explain: `${m.name} (${m.formula})` };
  }

  function q_compoundElements() {
    const key = pick(MOLECULE_KEYS);
    const m = MOLECULES[key];
    const elSet = k => Array.from(new Set(MOLECULES[k].atoms.map(a => a.el))).sort().join(", ");
    const correct = elSet(key);
    const distractors = distractorValues(MOLECULE_KEYS, elSet, correct, 3, [key]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(correct, distractors);
    return { text: `Which elements make up ${m.name} (${m.formula})?`, choices, correctIndex, explain: MOLECULE_BLURBS[key] || "" };
  }

  const COMPOUND_GENERATORS = [
    q_formulaToName, q_nameToFormula, q_atomCount, q_compoundBlurb, q_compoundElements,
  ];

  /* ---------- ALLOY question generators ---------- */

  function q_alloyFormulaToName() {
    const key = pick(ALLOY_KEYS);
    const a = ALLOYS[key];
    if (alloyFormulaGroups[a.formula].length > 1) return null; // ambiguous formula, skip
    const distractors = distractorValues(ALLOY_KEYS, alloyName, a.name, 3, [key]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(a.name, distractors);
    return { text: `What alloy has the composition ${a.formula}?`, choices, correctIndex, explain: a.blurb };
  }

  function q_alloyNameToFormula() {
    const key = pick(ALLOY_KEYS);
    const a = ALLOYS[key];
    const distractors = distractorValues(ALLOY_KEYS, alloyFormula, a.formula, 3, [key]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(a.formula, distractors);
    return { text: `What is the elemental composition of ${a.name}?`, choices, correctIndex, explain: a.blurb };
  }

  function q_alloyPrimaryElement() {
    const candidates = ALLOY_KEYS.filter(k => Object.keys(ALLOYS[k].elements).length >= 2);
    if (!candidates.length) return null;
    const key = pick(candidates);
    const a = ALLOYS[key];
    const entries = Object.entries(a.elements).sort((x, y) => y[1] - x[1]);
    const correct = entries[0][0];
    const otherSyms = entries.slice(1).map(e => e[0]);
    const pool = ELEMENT_SYMS.filter(s => s !== correct && !otherSyms.includes(s));
    const extra = shuffle(pool).slice(0, 3);
    const distractors = shuffle([...otherSyms, ...extra]).slice(0, 3);
    if (distractors.length < 3) return null;
    const { choices, correctIndex } = buildChoices(correct, distractors);
    return { text: `What is the primary (highest %) element in ${a.name}?`, choices, correctIndex, explain: a.blurb };
  }

  function q_alloyBlurb() {
    const candidates = ALLOY_KEYS.filter(k => ALLOYS[k].blurb);
    if (!candidates.length) return null;
    const key = pick(candidates);
    const a = ALLOYS[key];
    const distractors = distractorValues(ALLOY_KEYS, alloyName, a.name, 3, [key]);
    if (!distractors) return null;
    const { choices, correctIndex } = buildChoices(a.name, distractors);
    return { text: `Which alloy is this? "${a.blurb}"`, choices, correctIndex, explain: `${a.name} (${a.formula})` };
  }

  const ALLOY_GENERATORS = [
    q_alloyFormulaToName, q_alloyNameToFormula, q_alloyPrimaryElement, q_alloyBlurb,
  ];

  const GENERATORS = {
    elements: ELEMENT_GENERATORS,
    compounds: COMPOUND_GENERATORS,
    alloys: ALLOY_GENERATORS,
  };

  /* ---------- question flow ---------- */

  function nextQuestion() {
    const pool = GENERATORS[state.category];
    let q = null, guard = 0;
    while (!q && guard++ < 25) q = pick(pool)();
    if (!q) return;
    state.current = q;
    renderQuestion(q);
  }

  function renderQuestion(q) {
    els.feedback.classList.add("hidden");
    els.feedback.classList.remove("is-correct", "is-wrong");
    els.nextBtn.classList.add("hidden");
    els.questionText.textContent = q.text;
    els.answersHost.innerHTML = "";
    q.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "quiz-answer-btn";
      btn.textContent = choice;
      btn.addEventListener("click", () => handleAnswer(i, btn));
      els.answersHost.appendChild(btn);
    });
    updateScoreLine();
  }

  function updateScoreLine() {
    els.scoreEl.textContent = `${state.correct}/${state.answered} correct · streak ${state.streak} · best ${state.bestStreak}`;
    els.streakBadge.textContent = `🔥 ${state.streak}`;
  }

  function handleAnswer(index, btnEl) {
    const q = state.current;
    const allBtns = Array.from(els.answersHost.children);
    allBtns.forEach(b => { b.disabled = true; });

    const isCorrect = index === q.correctIndex;
    state.answered++;

    if (isCorrect) {
      btnEl.classList.add("correct");
      state.correct++;
      state.streak++;
      els.feedback.classList.remove("is-wrong");
      els.feedback.classList.add("is-correct");
      els.feedback.innerHTML = `Correct! ${q.explain ? escapeHtml(q.explain) : ""}`;
    } else {
      btnEl.classList.add("wrong");
      allBtns[q.correctIndex].classList.add("correct");

      let msg = `Not quite — the correct answer was <strong>${escapeHtml(q.choices[q.correctIndex])}</strong>.`;
      if (q.explain) msg += ` ${escapeHtml(q.explain)}`;

      if (state.streak > state.bestStreak) {
        state.bestStreak = state.streak;
        saveBestStreak(state.bestStreak);
        msg += `<span class="quiz-record">🏆 New record — ${state.streak} in a row!</span>`;
      } else if (state.streak > 0) {
        msg += ` Streak ended at ${state.streak} (best: ${state.bestStreak}).`;
      }

      state.streak = 0;
      els.feedback.classList.remove("is-correct");
      els.feedback.classList.add("is-wrong");
      els.feedback.innerHTML = msg;
    }

    els.feedback.classList.remove("hidden");
    els.nextBtn.classList.remove("hidden");
    updateScoreLine();
  }

  /* ---------- screen switching ---------- */

  function showCategoryScreen() {
    state.category = null;
    els.catScreen.classList.remove("hidden");
    els.qScreen.classList.add("hidden");
  }

  function startCategory(cat) {
    state.category = cat;
    state.streak = 0;
    state.correct = 0;
    state.answered = 0;
    els.catScreen.classList.add("hidden");
    els.qScreen.classList.remove("hidden");
    nextQuestion();
  }

  function openQuiz() {
    els.overlay.classList.remove("hidden");
    els.overlay.setAttribute("aria-hidden", "false");
    showCategoryScreen();
    updateScoreLine();
  }

  function closeQuiz() {
    els.overlay.classList.add("hidden");
    els.overlay.setAttribute("aria-hidden", "true");
  }

  /* ---------- wiring ---------- */

  els.toggle.addEventListener("click", openQuiz);
  els.close.addEventListener("click", closeQuiz);
  els.overlay.addEventListener("click", e => { if (e.target === els.overlay) closeQuiz(); });
  els.changeCat.addEventListener("click", showCategoryScreen);
  els.nextBtn.addEventListener("click", nextQuestion);
  els.catButtons.forEach(btn => btn.addEventListener("click", () => startCategory(btn.dataset.cat)));
})();
