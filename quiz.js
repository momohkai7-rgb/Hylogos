/* ===================== Quiz mode (Progressive Difficulty) ===================== */
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
    try { localStorage.setItem(STORAGE_KEY, String(v)); } catch (e) {}
  }

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

  const ELEMENT_SYMS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : [];
  const MOLECULE_KEYS = (typeof MOLECULES !== "undefined") ? Object.keys(MOLECULES) : [];
  const ALLOY_KEYS = (typeof ALLOYS !== "undefined") ? Object.keys(ALLOYS) : [];
  const CATEGORY_KEYS = (typeof CATEGORY_META !== "undefined") ? Object.keys(CATEGORY_META) : [];

  const elementName = sym => ELEMENTS[sym].name;
  const moleculeName = key => MOLECULES[key].name;
  const moleculeFormula = key => MOLECULES[key].formula;
  const alloyName = key => ALLOYS[key].name;
  const alloyFormula = key => ALLOYS[key].formula;

  const alloyFormulaGroups = {};
  ALLOY_KEYS.forEach(k => {
    const f = alloyFormula(k);
    (alloyFormulaGroups[f] = alloyFormulaGroups[f] || []).push(k);
  });

  /* ---------- DYNAMIC TRUE/FALSE GENERATOR ---------- */
  function q_trueFalse() {
    const types = ['phase', 'metal_check', 'halogen_check', 'atomic_check'];
    const type = pick(types);
    
    let text = "";
    let answer = true;
    let explain = "";

    if (type === 'phase') {
      const sym = pick(ELEMENT_SYMS);
      const el = ELEMENTS[sym];
      if (!el.phase) return q_trueFalse();
      const actualPhase = el.phase;
      const fakePhases = ["Solid", "Liquid", "Gas"].filter(p => p !== actualPhase);
      const statedPhase = Math.random() < 0.5 ? actualPhase : pick(fakePhases);
      answer = (statedPhase === actualPhase);
      text = `True or False: At room temperature, ${el.name} (${sym}) exists as a ${statedPhase.toLowerCase()}.`;
      explain = `${el.name} is actually a ${actualPhase.toLowerCase()} at room temperature.`;
    } else if (type === 'metal_check') {
      const sym = pick(ELEMENT_SYMS);
      const el = ELEMENTS[sym];
      const testCategory = Math.random() < 0.5 ? "transition" : pick(CATEGORY_KEYS);
      answer = (el.category === testCategory);
      const catLabel = CATEGORY_META[testCategory] ? CATEGORY_META[testCategory].label : testCategory;
      text = `True or False: ${el.name} (${sym}) is classified as a ${catLabel.toLowerCase()}.`;
      explain = `${el.name} belongs to the "${CATEGORY_META[el.category]?.label || el.category}" category.`;
    } else if (type === 'halogen_check') {
      const sym = pick(ELEMENT_SYMS);
      const el = ELEMENTS[sym];
      const isHalogen = el.category === "halogen";
      answer = isHalogen;
      text = `True or False: ${el.name} (${sym}) is a halogen element.`;
      explain = isHalogen ? `${el.name} is a halogen (Group 17).` : `${el.name} is a ${CATEGORY_META[el.category]?.label || el.category}.`;
    } else {
      const sym = pick(ELEMENT_SYMS);
      const el = ELEMENTS[sym];
      text = `True or False: The atomic number (Z) of ${el.name} is ${el.z}.`;
      answer = true;
      explain = `Yes, ${el.name} has an atomic number of ${el.z}.`;
    }

    const choices = ["True", "False"];
    const correctIndex = answer ? 0 : 1;
    return { text, choices, correctIndex, explain };
  }

  /* ---------- MATH CALCULATION GENERATOR ---------- */
  function q_mathMass() {
    const targetMolecules = ["H2O", "CO2", "CH4", "NaCl"];
    const key = pick(targetMolecules);
    if (!MOLECULES[key]) return q_symbolToName();
    let mass = 18;
    if (key === "H2O") mass = 18;
    else if (key === "CO2") mass = 44;
    else if (key === "CH4") mass = 16;
    else if (key === "NaCl") mass = 58;
    
    const correct = `${key === "NaCl" ? "58.5" : mass} u`;
    const distractors = [`${mass + 4} u`, `${Math.max(5, mass - 6)} u`, `${mass + 12} u`];
    const { choices, correctIndex } = buildChoices(correct, distractors);
    return { 
      text: `What is the approximate molecular/molar mass of ${MOLECULES[key].name} (${MOLECULES[key].formula})?`, 
      choices, 
      correctIndex, 
      explain: `Calculated using standard atomic weights.` 
    };
  }

  /* ---------- FILL-IN-THE-BLANK GENERATOR ---------- */
  function q_fillBlank() {
    const items = [
      { text: "The chemical symbol for Gold is _______.", ans: "Au", pool: ["Ag", "Cu", "Pt", "Fe"] },
      { text: "The chemical formula for ordinary table salt is _______.", ans: "NaCl", pool: ["H2O", "CO2", "KCl", "NaOH"] },
      { text: "The gas that makes up about 78% of Earth's atmosphere is _______.", ans: "Nitrogen", pool: ["Oxygen", "Argon", "Carbon dioxide", "Hydrogen"] },
      { text: "The metal at the center of a chlorophyll molecule is _______.", ans: "Magnesium", pool: ["Iron", "Calcium", "Zinc", "Copper"] }
    ];
    const item = pick(items);
    const { choices, correctIndex } = buildChoices(item.ans, item.pool);
    return { text: item.text, choices, correctIndex, explain: `The correct answer is ${item.ans}.` };
  }

  /* ---------- SORTING / ORDERING GENERATOR ---------- */
  function q_sorting() {
    return {
      text: "Which option lists these elements in correct order of increasing Atomic Number (Z)?",
      choices: [
        "Lithium (3) → Carbon (6) → Neon (10)",
        "Carbon (6) → Lithium (3) → Neon (10)",
        "Neon (10) → Carbon (6) → Lithium (3)",
        "Lithium (3) → Neon (10) → Carbon (6)"
      ],
      correctIndex: 0,
      explain: "Atomic numbers increase sequentially: Li (3), C (6), Ne (10)."
    };
  }

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

  /* ---------- ALLOY question generators ---------- */
  function q_alloyFormulaToName() {
    const key = pick(ALLOY_KEYS);
    const a = ALLOYS[key];
    if (alloyFormulaGroups[a.formula].length > 1) return null;
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

  /* ---------- DIFFICULTY TIERS (Progressive Challenge) ---------- */
  const DIFFICULTY_TIERS = {
    elements: {
      easy: [q_symbolToName, q_nameToSymbol, q_trueFalse, q_fillBlank],
      medium: [q_category, q_phase, q_atomicNumber, q_mathMass],
      hard: [q_meltCompare, q_densityCompare, q_sorting, q_elementBlurb]
    },
    compounds: {
      easy: [q_formulaToName, q_nameToFormula, q_trueFalse, q_fillBlank],
      medium: [q_atomCount, q_compoundElements, q_mathMass],
      hard: [q_compoundBlurb, q_sorting]
    },
    alloys: {
      easy: [q_alloyFormulaToName, q_trueFalse, q_fillBlank],
      medium: [q_alloyNameToFormula, q_mathMass],
      hard: [q_alloyPrimaryElement, q_alloyBlurb, q_sorting]
    }
  };

  /* ---------- question flow with progressive difficulty ---------- */
  function nextQuestion() {
    const catTiers = DIFFICULTY_TIERS[state.category];
    
    // Determine difficulty tier based on current streak
    let pool = [];
    if (state.streak >= 8) {
      pool = [...catTiers.easy, ...catTiers.medium, ...catTiers.hard]; // Mix everything with heavy hard bias
    } else if (state.streak >= 4) {
      pool = [...catTiers.easy, ...catTiers.medium]; // Medium tier unlocked
    } else {
      pool = catTiers.easy; // Warm-up tier
    }

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
    const tierName = state.streak >= 8 ? "🔥 Expert" : (state.streak >= 4 ? "⚡ Medium" : "🌱 Warm-up");
    els.scoreEl.textContent = `${state.correct}/${state.answered} correct · ${tierName} · streak ${state.streak} · best ${state.bestStreak}`;
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
      
      let rewardText = `Correct!`;
      if (state.streak === 4) rewardText += ` ⚡ <strong>Medium Tier Unlocked!</strong>`;
      if (state.streak === 8) rewardText += ` 🔥 <strong>Expert Tier Unlocked!</strong>`;
      
      els.feedback.innerHTML = `${rewardText} ${q.explain ? escapeHtml(q.explain) : ""}`;
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
        msg += ` Streak reset. Back to Warm-up tier.`;
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

  els.toggle.addEventListener("click", openQuiz);
  els.close.addEventListener("click", closeQuiz);
  els.overlay.addEventListener("click", e => { if (e.target === els.overlay) closeQuiz(); });
  els.changeCat.addEventListener("click", showCategoryScreen);
  els.nextBtn.addEventListener("click", nextQuestion);
  els.catButtons.forEach(btn => btn.addEventListener("click", () => startCategory(btn.dataset.cat)));
})();
