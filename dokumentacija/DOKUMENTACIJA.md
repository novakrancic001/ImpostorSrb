# DOKUMENTACIJA.md — Tehnička dokumentacija

> Živa dokumentacija projekta. **Ažurira se na kraju svake sesije.**
> CSS je namerno izostavljen — sav style je u `styles.css` sa komentarima po sekcijama.

**Poslednje ažuriranje:** Sesija 4 (ispravka animacije prelaza, favicon/logo, SEO fajlovi, .gitignore)
**Verzija aplikacije:** 0.2.1

---

## Sadržaj

1. [Tehnologije i verzije](#tehnologije-i-verzije)
2. [Struktura fajlova](#struktura-fajlova)
3. [State objekat](#state-objekat)
4. [Konstante](#konstante)
5. [Bootstrap funkcije](#bootstrap-funkcije)
6. [Wake Lock funkcije](#wake-lock-funkcije)
7. [Game logic funkcije](#game-logic-funkcije)
8. [Timer funkcije](#timer-funkcije)
9. [Router](#router)
10. [Main menu i onboarding](#main-menu-i-onboarding)
11. [Content stranice](#content-stranice)
12. [Render funkcije](#render-funkcije)
13. [Helper funkcije](#helper-funkcije)
14. [Struktura JSON baze reči](#struktura-json-baze-reči)
15. [Event listeners pregled](#event-listeners-pregled)
16. [Changelog](#changelog)

---

## Tehnologije i verzije

| Tehnologija | Verzija / Spec | Gde se koristi |
|---|---|---|
| HTML | HTML5 | `index.html` |
| CSS | CSS3, custom properties, conic-gradient, dvh units | `styles.css` |
| JavaScript | ES2020+ (vanilla, bez build-a) | `app.js`, `content.js` |
| JSON | standard | `reci.json` |
| Google Fonts | Fraunces (variable), Manrope (400-800) | preko `<link>` u `index.html` |
| Pointer Events API | nativna | hold-to-reveal logika |
| Wake Lock API | nativna (gde podržano) | sprečava zaključavanje ekrana |
| Vibration API | nativna (Android Chrome) | tactile feedback |
| localStorage | Web Storage API | čuva podešavanja i onboarding flag |
| `fetch` | nativna | učitavanje `reci.json` |
| History API | nativna | `history.replaceState` za hash korekciju |

**Browser support cilj:** Chrome/Edge 100+, Safari 15+, Firefox 100+ (sve glavne mobile browsere u poslednje 2 godine).

**Bez:** npm, package.json, build alata, transpilera, frameworka, server-side koda.

---

## Struktura fajlova

```
impostor/
├── index.html          # Entry, učitava fontove, content.js i app.js; sadrži JSON-LD
├── styles.css          # Sav stil (organizovan po sekcijama sa komentarima)
├── app.js              # Sva logika: router, game, onboarding, SEO, animacije
├── content.js          # HTML sadržaj za statičke stranice (CONTENT objekat)
├── reci.json           # Baza reči, učitava se preko fetch
├── robots.txt          # SEO crawler direktive
├── sitemap.xml         # SEO sitemap (jedan unos zbog hash routinga)
├── .gitignore          # OS, editor, Node fajlovi
├── images/
│   └── uljez - favicon.png   # Logo/favicon, 500x500px PNG
├── README.md           # User-facing uputstvo za pokretanje
├── CLAUDE.md           # Kontekst za Claude Code sesije
└── dokumentacija/
    ├── DOKUMENTACIJA.md    # ← OVAJ FAJL
    ├── git-setup.md
    ├── main-menu-plan.md
    ├── kako-se-igra-draft.md
    ├── o-igri-draft.md
    ├── privacy-policy-draft.md
    └── terms-draft.md
```

---

## State objekat

Globalni `state` objekat u `app.js` čuva svu mutable state aplikacije.

```js
const state = {
  // ——— Podešavanja (snima se u localStorage) ———
  numPlayers: 4,            // broj igrača (3-12)
  numImpostors: 1,          // broj uljeza (1 ili 2, max numPlayers-2)
  category: 'sve',          // ključ iz reci.json ili 'sve' za sve kategorije
  mode: 'hint',             // 'hint' = uljez dobija sličnu reč, 'blank' = ništa
  timerEnabled: false,      // true/false — da li je tajmer aktivan
  timerSeconds: 120,        // trajanje tajmera u sekundama (30-300)

  // ——— Game state (in-memory, resetuje se sa svakom igrom) ———
  gameScreen: 'setup',      // 'setup' | 'preReveal' | 'reveal' | 'discussion' | 'results'
  word: null,               // string — glavna reč
  hint: null,               // string — reč za uljeza u 'hint' modu
  categoryUsed: null,       // string — naziv izabrane kategorije (za prikaz)
  impostorIndices: [],      // niz indeksa (0-based) igrača koji su uljezi
  currentPlayer: 0,         // indeks trenutnog igrača u pre-reveal/reveal ciklusu

  // ——— Hold-to-reveal interno ———
  holdStart: null,          // timestamp (performance.now()) kad je hold počeo
  holdRaf: null,            // requestAnimationFrame ID

  // ——— Tajmer interno ———
  timerInterval: null,      // setInterval ID
  timerRemaining: 0,        // preostalo sekundi
  wakeLock: null            // WakeLockSentinel ili null
};
```

**Napomena od v0.2.0:** `state.screen` je preimenovano u `state.gameScreen` radi jasnog razdvajanja od URL ruta.

**Konvencija:** sve što počinje sa "podešavanjima" snima se u localStorage preko `saveSettings()`. Sve ostalo je in-memory only.

---

## Konstante

```js
const HOLD_DURATION = 900;  // ms koliko korisnik mora da drži za otkrivanje
const HOLD_BUFFER = 60;     // dodatni ms da animacija stigne do 100% pre trigger-a
let WORDS = {};             // popunjava se u init() iz reci.json
```

---

## Bootstrap funkcije

### `init()`
**Async.** Učitava `reci.json`, popunjava `WORDS`, učitava podešavanja, pa poziva `handleRoute()` (ne `render()` direktno kao u v0.1.0).

```js
async function init() { ... }
```

---

### `loadSavedSettings()`
Čita `localStorage['impostor-settings']`, parsira JSON, merge-uje sa default vrednostima u `state`.

```js
function loadSavedSettings() { ... }
```

---

### `saveSettings()`
Snima podešavanja u `localStorage['impostor-settings']`. Snima SAMO settings polja, nikad game state.

```js
function saveSettings() { ... }
```

---

## Wake Lock funkcije

### `requestWakeLock()`
**Async.** Traži od browsera da ne zaključava ekran. Tiho ne radi ništa ako API ne postoji.

### `releaseWakeLock()`
Oslobađa wake lock. Sigurno se može pozvati i kad nema lock-a.

---

## Game logic funkcije

### `startGame()`
Postavlja game state i prebacuje na `preReveal`. Biografi reč, uljeze, 50% swap.

### `shuffleArray(arr)`
In-place Fisher-Yates shuffle.

### `isCurrentPlayerImpostor()`
Boolean — da li je `state.currentPlayer` u `state.impostorIndices`.

### `nextPlayer()`
Inkrementira `currentPlayer`. Ako je poslednji → `discussion` + tajmer. Inače → `preReveal`.

### `showResults()`
Zaustavlja tajmer, prebacuje na `results`.

### `newGame(keepSettings = false)`
Resetuje game state, vraća na `setup`. Ne menja hash — ostaje na `#/igraj`.

---

## Timer funkcije

### `startTimer()`
Postavlja `timerRemaining` i pokreće `setInterval`.

### `stopTimer()`
Briše `setInterval`. Sigurno se može pozvati i kad tajmer nije aktivan.

### `updateTimerDisplay()`
Ažurira DOM tajmera (tekst, SVG progress ring, warning klase).

### `vibrate(pattern)`
Wrapper oko `navigator.vibrate()` sa existence check.

---

## Router

### Arhitektura

Aplikacija koristi **hash-based routing** (`#/igraj`, `#/privacy` itd.). Rute su:

| Hash | Ekran |
|------|-------|
| `#/` ili prazan | Main menu |
| `#/igraj` | Setup ekran (i ostatak game flow-a) |
| `#/kako-se-igra` | Stranica sa pravilima |
| `#/o-igri` | O igri stranica |
| `#/privacy` | Politika privatnosti |
| `#/terms` | Uslovi korišćenja |
| sve ostalo | 404 stranica |

Game flow (`preReveal`, `reveal`, `discussion`, `results`) ostaje uvek na `#/igraj` — samo `state.gameScreen` se menja.

### `triggerPageEnter()`
Dodaje `.page-enter` CSS klasu na `#app` element, čime okida `fadeIn` animaciju. Uklanja klasu pre dodavanja (`void app.offsetWidth` forsira reflow) da bi animacija mogla da se ponovo pokrene. Poziva se samo pri pravim navigacijskim prelazima — ne pri re-renderima istog ekrana.

**Mesta pozivanja:** `handleRoute()`, `startGame()`, `nextPlayer()`, `showResults()`, `newGame()`, i u `setupHoldToReveal` tick-u pri prelasku na `reveal`.

### `handleRoute()`
Centralni dispatcher. Čita `window.location.hash`, provera da li je igra aktivna (confirm pre napuštanja), poziva `updateMeta()`, `triggerPageEnter()` i pravi render.

```js
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  // activeGame check + confirm
  // updateMeta + switch dispatch
}
```

**Zaštita od napuštanja igre:** Ako je `state.gameScreen !== 'setup'` i `!== 'results'` i korisnik navigira na drugu rutu, pojavljuje se `confirm()`. Ako odbije, `history.replaceState` vraća hash na `#/igraj`.

### `updateMeta(hash)`
Ažurira `document.title`, `<meta name="description">`, i OG/Twitter meta tagove. Poziva `setMetaTag()` helper.

### `setMetaTag(attrName, attrValue, content)`
Helper koji pronalazi ili kreira `<meta>` element sa datim atributom i postavlja `content`.

### `render()`
Interni re-render koji poziva `renderGame(app)`. Osigurava da je URL `#/igraj` pre renderovanja. Poziva se iz game logic funkcija (startGame, nextPlayer, itd.).

### `renderGame(app)`
Switch dispatcher koji čita `state.gameScreen` i poziva pravu render funkciju.

---

## Main menu i onboarding

### `renderMainMenu(app)`
Renderuje početni ekran sa hero sekcijom (naziv "Uljez", tagline), dva CTA dugmeta i footer-om sa linkovima i verzijom. Posle renderovanja poziva `maybeShowOnboarding(app)`.

### `maybeShowOnboarding(app)`
Proverava `localStorage['uljez-onboarded']`. Ako ne postoji — poziva `showOnboardingModal(app)`.

### `showOnboardingModal(app)`
Kreira `div.modal-overlay`, dodaje ga na `app`, attach-uje event listener koji delegira click-ove na `[data-action]`.

**Logika navigacije:**
- `data-action="next"` na poslednjem stepu → zatvori + navigate na `#/igraj`
- `data-action="next"` na stepu 1 ili 2 → inkrementira step, re-renderuje
- `data-action="skip"` → zatvori odmah

### `closeOnboarding(overlay)`
Postavlja `localStorage['uljez-onboarded'] = '1'` i uklanja overlay iz DOM-a.

### `renderOnboardingStep(step)`
Vraća HTML string za jedan od 3 onboarding step-a. Stepovi:
1. "Šta je Uljez?" — kratak opis igre
2. "Kako se igra?" — telefon kruži, glasanje
3. "Spreman?" — CTA za igru

---

## Content stranice

### `renderContentPage(app, key)`
Renderuje content stranicu za dati ključ. HTML sadržaj dolazi iz `CONTENT[key].html` (definisano u `content.js`). Ako ključ ne postoji — poziva `render404(app)`.

Struktura:
```html
<div class="content-page">
  <header class="page-header">← Nazad | Uljez logo</header>
  <div class="content-body"><!-- CONTENT[key].html --></div>
  <footer class="page-footer"><!-- footer nav linkovi --></footer>
</div>
```

### `render404(app)`
Renderuje jednostavnu 404 stranicu sa linkom na `#/`.

### `content.js` — CONTENT objekat

Zasebni fajl učitan pre `app.js` u `index.html`. Definiše globalni `CONTENT` objekat sa ključevima:

| Ključ | Sadržaj |
|-------|---------|
| `'kako-se-igra'` | Kompletna pravila igre |
| `'o-igri'` | O projektu, vrednosti, tehnologija |
| `'privacy'` | GDPR-compliant politika privatnosti |
| `'terms'` | Uslovi korišćenja |

Svaki unos ima oblik `{ html: '...' }` — čist HTML string koji ide direktno u `.content-body`.

---

## Render funkcije

### `renderSetup(app)`
Setup ekran sa svim podešavanjima. Od v0.2.0 ima `← Nazad` link na vrhu i naslov "Uljez" (umesto "Impostor").

### `renderPreReveal(app)`
Ekran "Igrač N od X, drži za otkrivanje". Poziva `setupHoldToReveal()`.

### `setupHoldToReveal()`
Attach-uje pointer event listenere na `#hold-area`. Koristi `requestAnimationFrame` za smooth animaciju. `conic-gradient` se postavlja direktno preko inline style-a.

### `renderReveal(app)`
Prikazuje reč. Uljez → zlatna boja (hint) ili crvena "???" (blank). 300ms delay pre registracije tap-a.

### `renderDiscussion(app)`
Diskusija ekran sa opcionalnim SVG tajmerom.

### `renderResults(app)`
Finalni rezultati sa rečju i uljezima. Oslobađa wake lock.

---

## Helper funkcije

### `formatDuration(sec)`
Formatira sekunde za setup ekran. `"45s"`, `"2min"`, `"1m 30s"`.

### `formatTime(sec)`
Formatira sekunde za tajmer. `"M:SS"` format.

### `escapeHtml(s)`
Escape-uje HTML special characters za bezbedno umetanje u `innerHTML`.

---

## Struktura JSON baze reči

`reci.json` struktura (nepromenjena od v0.1.0):

```json
{
  "kategorija_kljuc": {
    "naziv": "Prikazni naziv",
    "ikonica": "🍽",
    "parovi": [
      { "rec": "glavna reč", "hint": "slična reč za uljeza" }
    ]
  }
}
```

**Plan za Fazu 2:** dodaće se `family_friendly: true/false` polje na svaki par.

---

## Event listeners pregled

### Globalni
- `window.addEventListener('hashchange', handleRoute)` — poziva router na svaku promenu hasha
- `document.addEventListener('visibilitychange', ...)` — re-acquire wake lock kad se tab vrati u fokus tokom igre

### Main menu
- `[data-action="next"]` na onboarding modalu — sledeći korak
- `[data-action="skip"]` na onboarding modalu — zatvori modal

### Setup ekran
- `[data-action]` dugmad — stepper za players/impostors, "start" za početak igre
- `[data-cat]` dugmad — izbor kategorije
- `[data-mode]` dugmad — toggle za mod
- `[data-timer]` dugmad — toggle za tajmer on/off
- `#timer-slider` — `input` (live update) + `change` (snimanje)

### Pre-reveal ekran
- `#hold-area` — pointerdown/up/leave/cancel za hold-to-reveal
- "Prekini igru" link — confirm + newGame

### Reveal ekran
- `#reveal-area` (ceo ekran) — click → nextPlayer (sa 300ms delay setupa)

### Discussion ekran
- "Otkrij ko je uljez" — showResults
- "Prekini igru" — confirm + newGame

### Results ekran
- "Nova igra · iste postavke" — startGame
- "Promeni podešavanja" — newGame

---

## Changelog

### Sesija 1 (MVP) — v0.1.0
- Inicijalna verzija app.js, styles.css, index.html, reci.json
- 5 ekrana: setup, preReveal, reveal, discussion, results
- Hold-to-reveal (900ms), Wake Lock, Vibration, localStorage settings
- 108 parova u 8 kategorija

### Sesija 2 (planiranje + context fajlovi) — v0.1.0
- Bez izmena koda
- Dodati CLAUDE.md i DOKUMENTACIJA.md
- Definisan plan za Fazu 2

### Sesija 4 — v0.2.1
- **Ispravka animacije prelaza (bug):** uklonjen `animation` sa `.screen` i `.content-page`; dodata `.page-enter` CSS klasa; nova `triggerPageEnter()` funkcija u `app.js` okida animaciju samo pri pravoj navigaciji, ne pri re-renderu istog ekrana
- **Favicon i logo:** `<link rel="icon">` i `<link rel="apple-touch-icon">` u `index.html`; logo slika (`images/uljez - favicon.png`) dodata na main menu (72px) i u page-header content stranica (28px); dodate CSS klase `.menu-logo` i ažurirana `.page-header-logo`
- **robots.txt:** kreiran u korenu projekta
- **sitemap.xml:** kreiran u korenu projekta; komentar objašnjava ograničenje hash routinga
- **JSON-LD:** dodat `<script type="application/ld+json">` u `<head>` sa `WebApplication` schema
- **`.gitignore`:** kreiran u korenu projekta
- **Verzija:** bumped na v0.2.1 u UI

### Sesija 3 (Faza 2) — v0.2.0
- **Router:** hash-based routing, `handleRoute()`, zaštita od napuštanja aktivne igre
- **Main menu:** hero sa "Uljez" imenom, tagline "Pronađi uljeza", dva CTA, footer sa linkovima i v0.2.0
- **Content stranice:** kako-se-igra, o-igri, privacy, terms — sve sa page header/footer komponentama
- **`content.js`:** novi fajl sa HTML sadržajem za content stranice
- **SEO:** `updateMeta()` + `setMetaTag()` — ažuriranje title, description, OG i Twitter meta tagova pri svakoj promeni rute
- **Onboarding modal:** 3-korakovni walkthrough, automatski pri prvom otvaranju (`uljez-onboarded` localStorage flag), skipovljiv
- **CSS ispravka:** `--font-display` ispravljeno sa 'Manrope' na 'Fraunces'
- **Renaming:** `state.screen` → `state.gameScreen`; ime aplikacije "Impostor" → "Uljez" u UI
- **Setup ekran:** dodat "← Nazad" link, ažuriran naslov na "Uljez"
