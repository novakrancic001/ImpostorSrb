# Plan za Main Menu i Navigaciju

## Struktura aplikacije posle Faze 2

```
/                        → Početna (main menu) — NOVO
/igraj                   → Setup ekran (postojeće, samo preneto sa "/")
/kako-se-igra            → Pravila igre — NOVO
/o-igri                  → O nama / O igri — NOVO
/privacy                 → Politika privatnosti — NOVO
/terms                   → Uslovi korišćenja — NOVO
                         (404 stranica za sve ostalo)
```

Sve preko **hash-based routing-a** (`#/igraj`, `#/privacy` itd.) — najjednostavnije za statički hosting, radi bez konfiguracije servera.

> Alternativa: history API sa "real" URL-ovima (`/privacy` bez hash-a). Ovo izgleda lepše ali zahteva server config (redirect svih ruta na `index.html`). Netlify i Cloudflare Pages to lako rešavaju sa `_redirects` fajlom. **Predlog:** kreće se sa hash-based, kasnije migriramo ako treba.

---

## Wireframe glavnog menija

```
┌────────────────────────────────────┐
│                                    │
│       (suptilna grain tekstura)    │
│                                    │
│           ⚡ logo / ime            │
│                                    │
│        IMPOSTOR (display)          │
│       Srpska igra reči (small)    │
│                                    │
│                                    │
│   ┌──────────────────────────┐    │
│   │       ▶  IGRAJ           │    │ ← veliki CTA, zlatna
│   └──────────────────────────┘    │
│                                    │
│   ┌──────────────────────────┐    │
│   │     Kako se igra         │    │ ← sekundarni
│   └──────────────────────────┘    │
│                                    │
│                                    │
│   "Igraj sa 3-12 prijatelja        │
│    uživo, na jednom telefonu"      │
│                                    │
│                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                    │
│   O igri · Privacy · Terms         │ ← footer linkovi, mali
│        v0.2.0                      │
│                                    │
└────────────────────────────────────┘
```

### Šta će biti na ekranu

1. **Hero deo:**
   - Logo / ikona aplikacije (kad je dostupna)
   - Veliki naslov sa imenom igre (Fraunces italic)
   - Mali tagline ispod ("Srpska igra reči")

2. **CTA dugmad (vertikalno):**
   - Glavni: **IGRAJ** (zlatno, veliki, najistaknutiji)
   - Sekundarni: **Kako se igra** (ghost ili outline stil)

3. **Kratak opis ispod CTA-a:**
   - 1 rečenica — šta je igra, koliko igrača, gde se igra
   - Pomaže SEO i prvi utisak za novog korisnika

4. **Footer:**
   - Mali linkovi: O igri | Politika privatnosti | Uslovi korišćenja
   - Verzija aplikacije (npr. "v0.2.0")
   - Opciono: link ka GitHub-u, kontakt email, copyright godina

---

## Header / Footer u drugim stranicama

Privacy, Terms, O igri, Kako se igra stranice imaju jednostavniji layout:

```
┌────────────────────────────────────┐
│  ← Nazad                           │ ← header sa back dugmetom
├────────────────────────────────────┤
│                                    │
│  Naslov stranice                   │
│  (Fraunces, italic, veliki)        │
│                                    │
│  Body tekst...                     │
│  ...                               │
│  ...                               │
│                                    │
│  (Manrope za body, dovoljan        │
│   line-height, čitljiva širina)    │
│                                    │
│  ...                               │
│                                    │
├────────────────────────────────────┤
│  O igri · Privacy · Terms · Igraj  │ ← isti footer kao na main
└────────────────────────────────────┘
```

### Pravila za content stranice

- **Maksimalna širina teksta:** 65-70 karaktera po redu (čitljivost)
- **Line height:** 1.6-1.7 za body tekst
- **Headings:** Fraunces italic, ali manji od main heroa
- **Spacing:** velikodušan između sekcija
- **Linkovi:** zlatna boja, podvučeni samo na hover
- **Lists:** sa custom bullet-ima (mali kružić ili tačka u zlatnoj)
- **Tabele:** ako budu potrebne, čiste, bez border-a, samo donja linija ćelija

---

## Navigacija — tehnička implementacija

### Pristup 1: Hash router (preporučeno za start)

```js
// Pseudokod
function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  switch(hash) {
    case '/':              renderMainMenu(); break;
    case '/igraj':         renderSetup(); break;
    case '/kako-se-igra':  renderHowToPlay(); break;
    case '/o-igri':        renderAbout(); break;
    case '/privacy':       renderPrivacy(); break;
    case '/terms':         renderTerms(); break;
    default:               render404();
  }
  updateMetaTags(hash);
}

window.addEventListener('hashchange', handleRoute);
window.addEventListener('load', handleRoute);
```

URL-ovi izgledaju kao:
- `igra.rs/#/`
- `igra.rs/#/kako-se-igra`
- `igra.rs/#/privacy`

### Pristup 2: History API (kasnije, posle deploy-a)

URL-ovi izgledaju lepše:
- `igra.rs/`
- `igra.rs/kako-se-igra`
- `igra.rs/privacy`

Zahteva server config (Netlify `_redirects` fajl). Možemo migrirati posle prvog deploy-a.

---

## SEO meta tag-ovi po stranici

Svaka stranica ima unique title i description, ažurirano dinamički kroz JavaScript:

| Ruta | Title | Description |
|------|-------|-------------|
| `/` | **[NAZIV] — Srpska igra reči za društvo** | Besplatna online igra reči za 3-12 igrača. Pronađite uljeza u grupi. Igra se uživo, na jednom telefonu. |
| `/igraj` | **Igraj — [NAZIV]** | Postavi igru i počni partiju sa prijateljima. |
| `/kako-se-igra` | **Pravila igre — [NAZIV]** | Detaljna pravila igre uljeza na srpskom. Kako se igra, šta su modovi, saveti za igrače. |
| `/o-igri` | **O igri — [NAZIV]** | Otkud ideja, ko stoji iza, šta nas vodi. Srpska igra napravljena za nas. |
| `/privacy` | **Politika privatnosti — [NAZIV]** | Aplikacija ne prikuplja lične podatke. Sva podešavanja se čuvaju lokalno. |
| `/terms` | **Uslovi korišćenja — [NAZIV]** | Uslovi korišćenja besplatne web igre [NAZIV]. |

---

## Pitanja na koja treba odgovor pre kodiranja

Pre nego što počnem implementaciju Faze 2, par detalja koje samo ti znaš:

### 1. Šta tačno na **hero delu** main menija?

- Da li logo ide tu (kad ga budemo imali)?
- Da li privremeno samo veliki tekst sa imenom?
- Hoćemo li i sliku ili samo tipografiju?

**Moja preporuka:** za sad samo tipografija (dok nije logo finaliziran), centrirano. Kad logo bude tu, dodajemo ga iznad imena.

### 2. Tagline?

"Srpska igra reči" je opisno ali bezveze. Predlozi:
- "Srpska igra reči za društvo"
- "Pronađi uljeza"
- "Reči, blef, pobeda"
- "Igra za 3 do 12 prijatelja"
- "[NAZIV] — sve što treba je telefon i 3 prijatelja"

Koji vibe ti se najviše dopada? Ili nešto sasvim drugo?

### 3. Da li želiš "Sa hintom je preporučeno" badge negde na main meniju?

Ili ostavljamo da korisnik sam otkrije u podešavanjima šta je šta?

### 4. Onboarding modal — gde se pojavljuje?

**Opcija A:** Pri prvom otvaranju main menija (`localStorage` flag). Korisnik vidi 3-korakovni quick walkthrough.

**Opcija B:** Kao link "Kako se igra" sa main menija, bez automatskog pojavljivanja.

**Opcija C:** Kombinacija — automatski prvi put, dostupan posle preko linka.

**Moja preporuka:** Opcija B za sad. Manje agresivno, link je dovoljno vidljiv. Ako kasnije primetiš da ljudi ne razumeju, dodaješ Opciju A.

### 5. Da li jezik treba da postoji negde?

Plan je da imamo samo srpski (latinica + kasnije ćirilica). Ali ako jednog dana hoćeš english version — bolje je da od početka strukturišemo da to bude moguće. Predlog: dodati `lang` u `localStorage`, ali za sad samo `sr-latn`.

**Pitanje:** da li planiraš ikada english version? Ako da, struktuiram od početka. Ako ne — ne komplikujemo.

---

> 📋 Kad odgovoriš na ova pitanja, krećem sa implementacijom Faze 2. Plan:
>
> 1. Refaktor `app.js` da podržava router
> 2. Kreiranje main menu-a
> 3. Kreiranje praznih sekcija za Privacy, Terms, O igri, Kako se igra
> 4. Popunjavanje sekcija sa draft tekstovima (posle tvog editovanja)
> 5. SEO meta tag implementacija
> 6. Polish animacije i tranzicije
