/* ==========================================================================
   ULJEZ — Game Logic
   Pass-and-play igra reči, sve klijent-side.
   ========================================================================== */

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

const state = {
  // Settings (snimaju se u localStorage)
  numPlayers: 4,
  numImpostors: 1,
  category: 'sve',
  mode: 'hint',          // 'hint' | 'blank'
  timerEnabled: false,
  timerSeconds: 120,

  // Game state (in-memory, resetuje se sa svakom igrom)
  gameScreen: 'setup',   // 'setup' | 'preReveal' | 'reveal' | 'discussion' | 'results'
  word: null,
  hint: null,
  categoryUsed: null,
  impostorIndices: [],
  currentPlayer: 0,

  // Hold-to-reveal interno
  holdStart: null,
  holdRaf: null,

  // Timer interno
  timerInterval: null,
  timerRemaining: 0,
  wakeLock: null
};

const HOLD_DURATION = 900; // ms za otkrivanje
const HOLD_BUFFER = 60;    // mali buffer da animacija stigne do 100% pre trigger-a

let WORDS = {};

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

async function init() {
  try {
    const response = await fetch('reci.json');
    WORDS = await response.json();
    loadSavedSettings();
    handleRoute();
  } catch (err) {
    document.getElementById('app').innerHTML =
      `<div class="loader">Greška pri učitavanju reči. Da li si pokrenuo Live Server?</div>`;
    console.error(err);
  }
}

function loadSavedSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem('impostor-settings') || '{}');
    Object.assign(state, {
      numPlayers:    saved.numPlayers    ?? 4,
      numImpostors:  saved.numImpostors  ?? 1,
      category:      saved.category      ?? 'sve',
      mode:          saved.mode          ?? 'hint',
      timerEnabled:  saved.timerEnabled  ?? false,
      timerSeconds:  saved.timerSeconds  ?? 120
    });
  } catch (e) {}
}

function saveSettings() {
  localStorage.setItem('impostor-settings', JSON.stringify({
    numPlayers:   state.numPlayers,
    numImpostors: state.numImpostors,
    category:     state.category,
    mode:         state.mode,
    timerEnabled: state.timerEnabled,
    timerSeconds: state.timerSeconds
  }));
}

// ---------------------------------------------------------------------------
// Wake Lock — sprečava zaključavanje ekrana tokom igre
// ---------------------------------------------------------------------------

async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    state.wakeLock = await navigator.wakeLock.request('screen');
  } catch (e) {}
}

function releaseWakeLock() {
  if (state.wakeLock) {
    state.wakeLock.release().catch(() => {});
    state.wakeLock = null;
  }
}

// ---------------------------------------------------------------------------
// Game Logic
// ---------------------------------------------------------------------------

function startGame() {
  let pool = [];
  if (state.category === 'sve') {
    Object.entries(WORDS).forEach(([key, cat]) => {
      cat.parovi.forEach(p => pool.push({ ...p, kategorija: key }));
    });
  } else {
    const cat = WORDS[state.category];
    pool = cat.parovi.map(p => ({ ...p, kategorija: state.category }));
  }

  const picked = pool[Math.floor(Math.random() * pool.length)];
  state.word = picked.rec;
  state.hint = picked.hint;
  state.categoryUsed = WORDS[picked.kategorija].naziv;

  // 50% šanse da rec i hint zamene mesta — uljez ne može da nauči obrazac
  if (Math.random() < 0.5) {
    [state.word, state.hint] = [state.hint, state.word];
  }

  const indices = Array.from({ length: state.numPlayers }, (_, i) => i);
  shuffleArray(indices);
  state.impostorIndices = indices.slice(0, state.numImpostors);

  state.currentPlayer = 0;
  state.gameScreen = 'preReveal';
  requestWakeLock();
  triggerPageEnter();
  render();
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function isCurrentPlayerImpostor() {
  return state.impostorIndices.includes(state.currentPlayer);
}

function nextPlayer() {
  state.currentPlayer++;
  if (state.currentPlayer >= state.numPlayers) {
    state.gameScreen = 'discussion';
    if (state.timerEnabled) startTimer();
  } else {
    state.gameScreen = 'preReveal';
  }
  triggerPageEnter();
  render();
}

function showResults() {
  stopTimer();
  state.gameScreen = 'results';
  triggerPageEnter();
  render();
}

function newGame(keepSettings = false) {
  stopTimer();
  releaseWakeLock();
  state.gameScreen = 'setup';
  state.word = null;
  state.hint = null;
  state.impostorIndices = [];
  state.currentPlayer = 0;
  triggerPageEnter();
  render();
}

// ---------------------------------------------------------------------------
// Timer
// ---------------------------------------------------------------------------

function startTimer() {
  state.timerRemaining = state.timerSeconds;
  state.timerInterval = setInterval(() => {
    state.timerRemaining--;
    updateTimerDisplay();
    if (state.timerRemaining <= 0) {
      stopTimer();
      vibrate([200, 100, 200, 100, 400]);
    }
  }, 1000);
}

function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}

function updateTimerDisplay() {
  const text = document.querySelector('.timer-text');
  const progress = document.querySelector('.timer-svg .progress');
  const svg = document.querySelector('.timer-svg');
  if (!text || !progress) return;

  const mins = Math.floor(state.timerRemaining / 60);
  const secs = state.timerRemaining % 60;
  text.textContent = `${mins}:${String(secs).padStart(2, '0')}`;

  const ratio = state.timerRemaining / state.timerSeconds;
  const circ = 2 * Math.PI * 90; // r=90
  progress.style.strokeDashoffset = circ * (1 - ratio);

  if (state.timerRemaining <= 10) {
    text.classList.add('warning');
    svg.classList.add('warning');
  }
}

function vibrate(pattern) {
  if ('vibrate' in navigator) navigator.vibrate(pattern);
}

// ---------------------------------------------------------------------------
// Animation helper
// ---------------------------------------------------------------------------

function triggerPageEnter() {
  const app = document.getElementById('app');
  app.classList.remove('page-enter');
  void app.offsetWidth; // force reflow da bi animacija mogla ponovo da se okine
  app.classList.add('page-enter');
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

const META = {
  '/': {
    title: 'Uljez — Srpska igra reči za društvo',
    description: 'Besplatna igra reči za 3-12 igrača. Pronađite uljeza u grupi. Igra se uživo, na jednom telefonu.'
  },
  '/igraj': {
    title: 'Igraj — Uljez',
    description: 'Postavi igru i počni partiju sa prijateljima.'
  },
  '/kako-se-igra': {
    title: 'Kako se igra — Uljez',
    description: 'Pravila igre Uljez na srpskom. Kako se igra, šta su modovi, saveti za igrače.'
  },
  '/o-igri': {
    title: 'O igri — Uljez',
    description: 'Otkud ideja, ko stoji iza Uljeza. Srpska igra napravljena za nas.'
  },
  '/privacy': {
    title: 'Politika privatnosti — Uljez',
    description: 'Aplikacija ne prikuplja lične podatke. Sva podešavanja se čuvaju lokalno u tvom browseru.'
  },
  '/terms': {
    title: 'Uslovi korišćenja — Uljez',
    description: 'Uslovi korišćenja besplatne web igre Uljez.'
  }
};

function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const activeGame = state.gameScreen !== 'setup' && state.gameScreen !== 'results';

  // Ako je igra u toku i korisnik navigira van /igraj — pitaj pre napuštanja
  if (activeGame && hash !== '/igraj') {
    if (!confirm('Napustiti igru u toku?')) {
      history.replaceState(null, '', '#/igraj');
      return;
    }
    stopTimer();
    releaseWakeLock();
    state.gameScreen = 'setup';
  }

  updateMeta(hash);
  triggerPageEnter();

  const app = document.getElementById('app');
  switch (hash) {
    case '/':             renderMainMenu(app);              break;
    case '/igraj':        renderGame(app);                  break;
    case '/kako-se-igra': renderContentPage(app, 'kako-se-igra'); break;
    case '/o-igri':       renderContentPage(app, 'o-igri'); break;
    case '/privacy':      renderContentPage(app, 'privacy'); break;
    case '/terms':        renderContentPage(app, 'terms');  break;
    default:              render404(app);
  }
}

function updateMeta(hash) {
  const m = META[hash] || META['/'];
  document.title = m.title;
  setMetaTag('name', 'description', m.description);
  setMetaTag('property', 'og:title', m.title);
  setMetaTag('property', 'og:description', m.description);
  setMetaTag('property', 'og:type', 'website');
  setMetaTag('name', 'twitter:card', 'summary');
  setMetaTag('name', 'twitter:title', m.title);
  setMetaTag('name', 'twitter:description', m.description);
}

function setMetaTag(attrName, attrValue, content) {
  let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.content = content;
}

// ---------------------------------------------------------------------------
// Main Menu
// ---------------------------------------------------------------------------

function renderMainMenu(app) {
  app.innerHTML = `
    <section class="screen main-menu">
      <div class="menu-hero">
        <img src="images/uljez-transparent-favicon.png" alt="Uljez" class="menu-logo">
        <span class="eyebrow">Srpska igra reči</span>
        <h1 class="menu-title display">Uljez</h1>
        <p class="menu-tagline">Pronađi uljeza</p>
      </div>

      <div class="menu-cta">
        <a href="#/igraj" class="btn btn-primary btn-large">Igraj</a>
        <a href="#/kako-se-igra" class="btn btn-secondary">Kako se igra</a>
        <p class="menu-desc">Igra za 3–12 igrača, uživo, na jednom telefonu.</p>
      </div>

      <footer class="menu-footer">
        <nav class="footer-nav">
          <a href="#/o-igri">O igri</a>
          <span class="footer-sep">·</span>
          <a href="#/privacy">Privacy</a>
          <span class="footer-sep">·</span>
          <a href="#/terms">Terms</a>
        </nav>
        <span class="footer-version">v0.2.1</span>
      </footer>
    </section>
  `;

  maybeShowOnboarding(app);
}

// ---------------------------------------------------------------------------
// Onboarding Modal
// ---------------------------------------------------------------------------

function maybeShowOnboarding(app) {
  if (localStorage.getItem('uljez-onboarded')) return;
  showOnboardingModal(app);
}

function showOnboardingModal(app) {
  let step = 1;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = renderOnboardingStep(step);
  app.appendChild(overlay);

  overlay.addEventListener('click', e => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (action === 'next') {
      step++;
      if (step > 3) {
        closeOnboarding(overlay);
        window.location.hash = '#/igraj';
        return;
      }
      overlay.innerHTML = renderOnboardingStep(step);
    }
    if (action === 'skip') {
      closeOnboarding(overlay);
    }
  });
}

function closeOnboarding(overlay) {
  localStorage.setItem('uljez-onboarded', '1');
  overlay.remove();
}

function renderOnboardingStep(step) {
  const steps = [
    {
      title: 'Šta je Uljez?',
      text: 'Igra reči za 3–12 igrača. Svi dobiju istu reč — osim <strong>uljeza</strong>, koji mora da se pretvara da je zna.',
      cta: 'Dalje'
    },
    {
      title: 'Kako se igra?',
      text: 'Telefon kruži. Svaki igrač drži krug i vidi svoju reč. Posle diskusije — glasajte ko je uljez.',
      cta: 'Dalje'
    },
    {
      title: 'Spreman?',
      text: 'Sve što trebaš je jedan telefon i par prijatelja. Besplatno, bez registracije.',
      cta: 'Hajde, igraj'
    }
  ];

  const s = steps[step - 1];
  return `
    <div class="modal">
      <button class="modal-skip" data-action="skip">×</button>
      <div class="modal-step-indicator">
        ${[1, 2, 3].map(i => `<span class="step-dot ${i === step ? 'active' : ''}"></span>`).join('')}
      </div>
      <h2 class="modal-title display">${s.title}</h2>
      <p class="modal-text">${s.text}</p>
      <button class="btn btn-primary" data-action="next">${s.cta}</button>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// Content Pages
// ---------------------------------------------------------------------------

function renderContentPage(app, key) {
  const content = CONTENT[key];
  if (!content) { render404(app); return; }

  app.innerHTML = `
    <div class="content-page">
      <header class="page-header">
        <a href="#/" class="back-link">← Nazad</a>
        <img src="images/uljez-transparent-favicon.png" alt="Uljez" class="page-header-logo">
        <span></span>
      </header>
      <div class="content-body">
        ${content.html}
      </div>
      <footer class="page-footer">
        <nav class="footer-nav">
          <a href="#/o-igri">O igri</a>
          <span class="footer-sep">·</span>
          <a href="#/privacy">Privacy</a>
          <span class="footer-sep">·</span>
          <a href="#/terms">Terms</a>
          <span class="footer-sep">·</span>
          <a href="#/igraj">Igraj</a>
        </nav>
      </footer>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 404
// ---------------------------------------------------------------------------

function render404(app) {
  app.innerHTML = `
    <section class="screen">
      <div class="not-found">
        <span class="eyebrow">404</span>
        <h1 class="display">Stranica ne postoji</h1>
        <p class="muted">Ova stranica ne postoji ili je uklonjena.</p>
        <a href="#/" class="btn btn-secondary">← Idi na početnu</a>
      </div>
    </section>
  `;
}

// ---------------------------------------------------------------------------
// Render dispatcher — game flow
// ---------------------------------------------------------------------------

function render() {
  // Osiguraj da je URL na #/igraj kad se renderuje game
  if (window.location.hash !== '#/igraj') {
    history.replaceState(null, '', '#/igraj');
  }
  const app = document.getElementById('app');
  renderGame(app);
}

function renderGame(app) {
  switch (state.gameScreen) {
    case 'setup':      renderSetup(app);      break;
    case 'preReveal':  renderPreReveal(app);  break;
    case 'reveal':     renderReveal(app);     break;
    case 'discussion': renderDiscussion(app); break;
    case 'results':    renderResults(app);    break;
  }
}

// ---------------------------------------------------------------------------
// Setup screen
// ---------------------------------------------------------------------------

function renderSetup(app) {
  const cats = Object.entries(WORDS);
  app.innerHTML = `
    <section class="screen">
      <nav class="screen-back-nav">
        <a href="#/" class="back-link">← Nazad</a>
      </nav>

      <header class="setup-header">
        <span class="eyebrow">Srpska igra reči</span>
        <h1><span class="highlight">U</span>ljez</h1>
        <p>Svi dobiju reč osim uljeza. Pronađite ko se pretvara.</p>
      </header>

      <div class="section">
        <div class="section-title">Igrači</div>
        <div class="row-spread">
          <div class="stepper-label">Broj igrača</div>
          <div class="stepper-controls">
            <button class="stepper-btn" data-action="dec-players" ${state.numPlayers <= 3 ? 'disabled' : ''}>−</button>
            <span class="stepper-value">${state.numPlayers}</span>
            <button class="stepper-btn" data-action="inc-players" ${state.numPlayers >= 12 ? 'disabled' : ''}>+</button>
          </div>
        </div>
        <div class="row-spread">
          <div class="stepper-label">Broj uljeza</div>
          <div class="stepper-controls">
            <button class="stepper-btn" data-action="dec-imp" ${state.numImpostors <= 1 ? 'disabled' : ''}>−</button>
            <span class="stepper-value">${state.numImpostors}</span>
            <button class="stepper-btn" data-action="inc-imp" ${state.numImpostors >= Math.min(2, state.numPlayers - 2) ? 'disabled' : ''}>+</button>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Kategorija</div>
        <div class="chips">
          <button class="chip ${state.category === 'sve' ? 'active' : ''}" data-cat="sve">
            <span class="chip-icon">🎲</span>Sve kategorije
          </button>
          ${cats.map(([key, cat]) => `
            <button class="chip ${state.category === key ? 'active' : ''}" data-cat="${key}">
              <span class="chip-icon">${cat.ikonica}</span>${cat.naziv}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="section">
        <div class="section-title">Mod uljeza</div>
        <div class="toggle-group">
          <button class="toggle-option ${state.mode === 'hint' ? 'active accent' : ''}" data-mode="hint">
            Slična reč (hint)
          </button>
          <button class="toggle-option ${state.mode === 'blank' ? 'active accent' : ''}" data-mode="blank">
            Bez ničega
          </button>
        </div>
        <p class="helper-text">
          ${state.mode === 'hint'
            ? 'Uljez vidi sličnu reč iz iste kategorije — može lakše da blefira.'
            : 'Uljez ne vidi ništa — mora samo da prati šta drugi pričaju.'}
        </p>
      </div>

      <div class="section">
        <div class="section-title">Tajmer za diskusiju</div>
        <div class="toggle-group">
          <button class="toggle-option ${!state.timerEnabled ? 'active accent' : ''}" data-timer="off">
            Bez tajmera
          </button>
          <button class="toggle-option ${state.timerEnabled ? 'active accent' : ''}" data-timer="on">
            Sa tajmerom
          </button>
        </div>
        ${state.timerEnabled ? `
          <div class="timer-row">
            <label>Trajanje</label>
            <input type="range" min="30" max="300" step="15" value="${state.timerSeconds}" id="timer-slider">
            <span class="timer-value">${formatDuration(state.timerSeconds)}</span>
          </div>
        ` : ''}
      </div>

      <div class="cta-row">
        <button class="btn btn-primary btn-large" data-action="start">
          Počni igru
        </button>
      </div>
    </section>
  `;

  app.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'inc-players' && state.numPlayers < 12) state.numPlayers++;
      if (action === 'dec-players' && state.numPlayers > 3) {
        state.numPlayers--;
        if (state.numImpostors > Math.min(2, state.numPlayers - 2)) {
          state.numImpostors = Math.min(2, state.numPlayers - 2);
        }
      }
      if (action === 'inc-imp' && state.numImpostors < Math.min(2, state.numPlayers - 2)) state.numImpostors++;
      if (action === 'dec-imp' && state.numImpostors > 1) state.numImpostors--;
      if (action === 'start') { saveSettings(); startGame(); return; }
      saveSettings();
      render();
    });
  });

  app.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.category = btn.dataset.cat;
      saveSettings();
      render();
    });
  });

  app.querySelectorAll('[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.mode = btn.dataset.mode;
      saveSettings();
      render();
    });
  });

  app.querySelectorAll('[data-timer]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.timerEnabled = btn.dataset.timer === 'on';
      saveSettings();
      render();
    });
  });

  const slider = document.getElementById('timer-slider');
  if (slider) {
    slider.addEventListener('input', e => {
      state.timerSeconds = parseInt(e.target.value);
      const valEl = app.querySelector('.timer-value');
      if (valEl) valEl.textContent = formatDuration(state.timerSeconds);
    });
    slider.addEventListener('change', saveSettings);
  }
}

function formatDuration(sec) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s === 0 ? `${m}min` : `${m}m ${s}s`;
}

// ---------------------------------------------------------------------------
// Pre-reveal screen
// ---------------------------------------------------------------------------

function renderPreReveal(app) {
  app.innerHTML = `
    <section class="screen">
      <div class="prereveal">
        <div class="player-num">${state.currentPlayer + 1}</div>
        <div class="player-of">igrač od ${state.numPlayers}</div>

        <div class="hold-area" id="hold-area">
          <div class="hold-progress" id="hold-progress" style="--progress: 0"></div>
          <div class="hold-text">Drži</div>
          <div class="hold-subtext">za otkrivanje</div>
        </div>

        <p class="prereveal-instruction">
          ${state.currentPlayer === 0
            ? 'Telefon kruži. <strong>Niko drugi ne sme da gleda.</strong>'
            : 'Predaj telefon sledećem igraču.'}
        </p>
      </div>

      <div class="cta-row">
        <button class="tiny-link" data-action="cancel">↩ Prekini igru</button>
      </div>
    </section>
  `;

  setupHoldToReveal();

  app.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    if (confirm('Sigurno želiš da prekineš igru?')) newGame();
  });
}

function setupHoldToReveal() {
  const area = document.getElementById('hold-area');
  const progressEl = document.getElementById('hold-progress');
  if (!area) return;

  let raf = null;
  let cancelled = false;

  const startHold = (e) => {
    e.preventDefault();
    cancelled = false;
    state.holdStart = performance.now();
    area.classList.add('holding');
    tick();
  };

  const tick = () => {
    if (cancelled) return;
    const elapsed = performance.now() - state.holdStart;
    const pct = Math.min(100, (elapsed / HOLD_DURATION) * 100);
    progressEl.style.setProperty('--progress', pct);

    // Conic-gradient sa CSS varijablom nije pouzdana u svim browserima — postavljamo direktno
    progressEl.style.background = `conic-gradient(var(--accent) ${pct}%, transparent 0)`;

    if (elapsed >= HOLD_DURATION + HOLD_BUFFER) {
      vibrate(50);
      state.gameScreen = 'reveal';
      triggerPageEnter();
      render();
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  const cancelHold = () => {
    cancelled = true;
    if (raf) cancelAnimationFrame(raf);
    area.classList.remove('holding');
    progressEl.style.background = '';
    progressEl.style.setProperty('--progress', 0);
  };

  area.addEventListener('pointerdown', startHold);
  area.addEventListener('pointerup', cancelHold);
  area.addEventListener('pointerleave', cancelHold);
  area.addEventListener('pointercancel', cancelHold);
}

// ---------------------------------------------------------------------------
// Reveal screen
// ---------------------------------------------------------------------------

function renderReveal(app) {
  const isImpostor = isCurrentPlayerImpostor();
  let wordToShow, label, wordClass, badge = '';

  if (isImpostor) {
    if (state.mode === 'hint') {
      wordToShow = state.hint;
      label = `Kategorija: ${state.categoryUsed}`;
      wordClass = 'hint';
      badge = `<div class="reveal-impostor-tag">Ti si uljez · ovo je samo nagoveštaj</div>`;
    } else {
      wordToShow = '???';
      label = `Kategorija: ${state.categoryUsed}`;
      wordClass = 'impostor';
      badge = `<div class="reveal-impostor-tag">Ti si uljez · pretvaraj se</div>`;
    }
  } else {
    wordToShow = state.word;
    label = `Kategorija: ${state.categoryUsed}`;
    wordClass = 'normal';
  }

  app.innerHTML = `
    <section class="screen">
      <div class="reveal" id="reveal-area">
        <div class="reveal-label">${label}</div>
        ${badge}
        <div class="reveal-word ${wordClass}">${escapeHtml(wordToShow)}</div>
        <div class="reveal-instruction">Dodirni za sakrivanje</div>
      </div>
    </section>
  `;

  // Mali delay — sprečava da isti tap koji završava hold odmah pređe dalje
  setTimeout(() => {
    const area = document.getElementById('reveal-area');
    if (area) {
      area.addEventListener('click', () => nextPlayer(), { once: true });
    }
  }, 300);
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

// ---------------------------------------------------------------------------
// Discussion screen
// ---------------------------------------------------------------------------

function renderDiscussion(app) {
  const players = Array.from({ length: state.numPlayers }, (_, i) => i + 1);

  const timerHtml = state.timerEnabled ? `
    <div class="timer-display">
      <div class="timer-circle">
        <svg class="timer-svg" viewBox="0 0 200 200">
          <circle class="track" cx="100" cy="100" r="90"></circle>
          <circle class="progress" cx="100" cy="100" r="90"
            stroke-dasharray="${2 * Math.PI * 90}"
            stroke-dashoffset="0"></circle>
        </svg>
        <div class="timer-text">${formatTime(state.timerSeconds)}</div>
      </div>
    </div>
  ` : `
    <div class="discussion-header" style="margin-top: var(--space-7)">
      <h2 class="display">Diskutujte</h2>
      <p>Svaki igrač kaže <strong>jednu reč</strong> povezanu sa pojmom. Kada svi kažu — glasajte.</p>
    </div>
  `;

  app.innerHTML = `
    <section class="screen">
      ${state.timerEnabled ? `
        <div class="discussion-header">
          <h2 class="display">Diskusija</h2>
          <p>Svaki igrač kaže jednu reč povezanu sa pojmom.</p>
        </div>
      ` : ''}

      ${timerHtml}

      <div class="players-list">
        <div class="players-list-title">Redosled igrača</div>
        ${players.map(n => `
          <div class="player-row">
            <div class="player-num-pill">${n}</div>
            <div>Igrač ${n}</div>
          </div>
        `).join('')}
      </div>

      <div class="cta-row">
        <button class="btn btn-primary btn-large" data-action="results">
          Otkrij ko je uljez
        </button>
        <button class="btn btn-ghost" data-action="cancel">Prekini igru</button>
      </div>
    </section>
  `;

  if (state.timerEnabled) updateTimerDisplay();

  app.querySelector('[data-action="results"]').addEventListener('click', showResults);
  app.querySelector('[data-action="cancel"]').addEventListener('click', () => {
    if (confirm('Prekinuti igru bez otkrivanja?')) newGame();
  });
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Results screen
// ---------------------------------------------------------------------------

function renderResults(app) {
  const impostorNums = state.impostorIndices.map(i => i + 1).sort((a, b) => a - b);
  releaseWakeLock();

  app.innerHTML = `
    <section class="screen">
      <div class="results">
        <div class="results-eyebrow">Reč je bila</div>
        <div class="results-word">${escapeHtml(state.word)}</div>

        <div class="impostor-reveal">
          <div class="impostor-reveal-label">
            ${impostorNums.length > 1 ? 'Uljezi' : 'Uljez'}
          </div>
          <div class="impostor-list">
            ${impostorNums.map(n => `
              <div class="impostor-badge">
                <span class="num">Igrač</span>
                <span>${n}</span>
              </div>
            `).join('')}
          </div>
          ${state.mode === 'hint' ? `
            <div class="helper-text" style="margin-top: var(--space-4); text-align: center;">
              Uljez je dobio: <strong style="color: var(--accent)">${escapeHtml(state.hint)}</strong>
            </div>
          ` : ''}
        </div>

        <div class="cta-row">
          <button class="btn btn-primary btn-large" data-action="again">
            Nova igra · iste postavke
          </button>
          <button class="btn btn-secondary" data-action="setup">
            Promeni podešavanja
          </button>
        </div>
      </div>
    </section>
  `;

  app.querySelector('[data-action="again"]').addEventListener('click', startGame);
  app.querySelector('[data-action="setup"]').addEventListener('click', () => newGame());
}

// ---------------------------------------------------------------------------
// Re-acquire wake lock kad se ekran vrati u fokus
// ---------------------------------------------------------------------------

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' &&
      state.gameScreen !== 'setup' &&
      state.gameScreen !== 'results') {
    requestWakeLock();
  }
});

// ---------------------------------------------------------------------------
// Router listeners
// ---------------------------------------------------------------------------

window.addEventListener('hashchange', handleRoute);

// ---------------------------------------------------------------------------
// Go!
// ---------------------------------------------------------------------------

init();
