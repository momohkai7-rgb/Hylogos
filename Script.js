/* ===================== Cosmic backdrop (Premium Black Hole Animation) ===================== */
(function backdrop() {
  const canvas = document.getElementById("starfield");
  const ctx = canvas.getContext("2d");
  const searchEl = document.getElementById("search");
  let stars = [];
  let motes = [];
  const hole = { cx: 0, cy: 0, r: 0 };

  const VOID_RGB = "5, 4, 15"; 

  const rmQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = rmQuery.matches;
  rmQuery.addEventListener("change", e => { reducedMotion = e.matches; });

  const ELEMENT_SYMBOLS = (typeof ELEMENTS !== "undefined") ? Object.keys(ELEMENTS) : ["H", "O", "Fe", "Na", "C", "Au"];
  
  // Premium Neon Colors from Reference
  const PALETTE = {
    WHITE: "255, 255, 255",
    YELLOW: "255, 240, 150",
    ORANGE: "255, 130, 35",
    PINK: "255, 45, 130",
    MAGENTA: "180, 40, 230",
    PURPLE: "100, 20, 180"
  };

  function moteColor(sym) {
    if (typeof ELEMENTS === "undefined" || !ELEMENTS[sym]) return "#8b84a3";
    const meta = (typeof CATEGORY_META !== "undefined") && CATEGORY_META[ELEMENTS[sym].category];
    return meta ? meta.color : "#8b84a3";
  }

  function spawnMote() {
    const sym = ELEMENT_SYMBOLS[Math.floor(Math.random() * ELEMENT_SYMBOLS.length)];
    const rBase = hole.r || 60;
    return {
      angle: Math.random() * Math.PI * 2,
      radius: rBase * (2.8 + Math.random() * 1.5),
      speed: 0.12 + Math.random() * 0.1,
      symbol: sym,
      color: moteColor(sym),
      box: 15 + Math.random() * 5,
    };
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const starCount = Math.floor((canvas.width * canvas.height) / 9000);
    stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
    }));
    updateHolePosition();
    if (motes.length === 0) motes = Array.from({ length: 14 }, spawnMote);
  }

  function updateHolePosition() {
    if (searchEl) {
      const rect = searchEl.getBoundingClientRect();
      hole.cx = rect.left + rect.width / 2;
      hole.cy = rect.top + rect.height / 2;
      hole.r = rect.width / 2;
    }
    // Fallback if search isn't ready or positioned
    if (!hole.cx || hole.cx === 0) {
      hole.cx = window.innerWidth / 2;
      hole.cy = window.innerHeight * 0.4;
      hole.r = 75;
    }
  }

  function drawStars(t) {
