# CLAUDE.md — Kontekst projekta

> Ovo je context fajl koji Claude Code automatski čita na početku svake sesije.
> Sadrži kompletan kontekst projekta, plan razvoja i listu zadataka.

---

## Šta gradimo

**Impostor (privremeno ime)** — srpska web igra reči po uzoru na *Spyfall* / *Werewords*.

Pass-and-play na jednom telefonu: host započne igru, svaki igrač dobije telefon, drži krug da otkrije reč, predaje sledećem. Jedan ili dva igrača su "uljezi" — ili ne dobiju ništa ili dobiju sličnu reč iz iste kategorije kao hint. Cilj diskusije je da svi pogađaju ko je uljez.

**Ključni zahtevi:**
- Vanilla JS, HTML, CSS (bez frameworka, bez build step-a)
- Statički sajt, deploy na Netlify/Vercel/Cloudflare Pages
- Mobile-first (telefon je primarni uređaj — desktop je sekundaran)
- Srpski jezik, srpsko tržište, srpske reči
- Bez backend-a — sav state na klijentu (localStorage za podešavanja)

---

## Stack i odluke

**Tehnologije:**
- HTML5 + CSS3 + Vanilla JavaScript (ES2020+, ne treba transpile)
- JSON fajl za bazu reči (`reci.json`)
- Google Fonts: Fraunces (display, italic serif) + Manrope (sans body)
- Bez frameworka, bez build alata, bez npm dependencies za sad

**Razlog za vanilla:** igra je pass-and-play na jednom telefonu, nema multiplayer-a preko mreže, nema accounta — JSON + render funkcije rade savršeno. Framework bi bio overhead.

**Hosting (planirano):** Netlify ili Cloudflare Pages, GitHub repo → auto deploy.

**Stvari koje smo namerno odbacili:**
- ❌ WordPress (overkill, CMS za igru je pogrešan alat)
- ❌ PHP (nepotreban backend za client-side igru)
- ❌ React/Vue/Svelte (overhead za ovu skalu; možda kasnije ako dodajemo multiplayer)

---

## Struktura projekta

```
impostor/
├── index.html          # Entry point, postavlja meta i Google Fonts
├── styles.css          # Sav stil, mobile-first, dark theme
├── app.js              # Game logika, state, rendering svih ekrana
├── content.js          # HTML sadržaj za statičke stranice (CONTENT objekat)
├── reci.json           # Baza reči po kategorijama
├── robots.txt          # SEO — dozvoljava sve, Sitemap link
├── sitemap.xml         # SEO — jedan unos (hash routing ograničenje)
├── .gitignore          # Ignoriše OS, editor i Node fajlove
├── images/
│   └── uljez - favicon.png   # Logo/favicon (500x500px PNG)
├── README.md           # Korisničko uputstvo (kako pokrenuti)
├── CLAUDE.md           # ← OVAJ FAJL — kontekst za Claude Code
└── dokumentacija/
    └── DOKUMENTACIJA.md    # Tehnička dokumentacija funkcija (live, ažurira se)
```

Ne dodavaj `node_modules`, `package.json`, build foldere — ovaj projekat je čist.

---

## Pravila kodiranja (važno)

1. **Vanilla samo.** Nema npm-a, nema build step-a. Sve mora da radi direktno preko Live Server-a / statičkog HTTP servera.
2. **Mobile-first uvek.** Najpre proveri kako izgleda na 380px (telefon), pa onda desktop.
3. **Dark theme je default**, topli zlatni akcenat (`--accent: #d4a574`).
4. **Tipografija:** Fraunces za display/naslove (italic, opsz 144), Manrope za body.
5. **Touch targeti minimum 44x44px** (iOS HIG standard).
6. **`touch-action: manipulation`** na sve interaktivne elemente da izbegnemo 300ms delay.
7. **`user-select: none`** na ceo body — ovo je igra, ne sajt za čitanje.
8. **`localStorage`** za podešavanja, NE za game state (game state je u memoriji, resetuje se).
9. **Ne menjaj `reci.json` strukturu** osim ako se ne dogovorimo — korisnik ručno dodaje reči.
10. **Sve stringove ka korisniku — na srpskom**, latinica za sad (ćirilica kasnije).
11. **Bez logovanja korisničkih podataka.** Privacy-friendly, GDPR-safe by default.
12. **SEO:** svaka stranica mora imati unique `<title>` i `<meta name="description">`.

---

## Estetika i ton

- **Vibe:** atmosferičan, kao kafanska igra uveče — toplo zlato na crnoj, suptilna grain tekstura
- **Tipografija:** Fraunces italic za "drama" momente (otkrivanje reči, naslovi), Manrope za UI
- **Animacije:** suptilne, fadeIn na promene ekrana, hold-to-reveal sa progress prstenom
- **Boje:** crna pozadina, zlatni akcenat, crvena samo za "ti si uljez" momenat

Ne dodavaj generičke "AI gradient" stilove (ljubičasto-roza), ne koristi Inter/Roboto.

---

## SEO i meta zahtevi (DODATO U FAZI 2)

Svaka logička "stranica" treba unique title i description. Pošto je SPA, ovo radimo:
- Promenom `document.title` i `meta[name=description]` pri svakoj promeni ekrana
- Za multi-page sekcije (Privacy, Terms, O igri) možda razdvojiti u prave HTML fajlove (`privacy.html`, `terms.html`, `o-igri.html`) za bolji SEO i indeksiranje

**Title format:** `{ekran} — Impostor | Srpska igra reči`
**Description:** prilagoditi po ekranu, max 160 karaktera, sa relevantnim ključnim rečima na srpskom.

**Ključne reči (research u toku):**
- "igra reči srpski"
- "društvene igre online"
- "impostor igra"
- "igre za žurke"
- "igre za druženje"
- (definisaće se posle SEO research-a)

---

## Faze razvoja

### ✅ Faza 1 — MVP (završeno)
Core igra radi: setup ekran, hold-to-reveal, diskusija sa tajmerom, rezultati. 108 parova u 8 kategorija.

### ✅ Faza 2 — Content i polish (uglavnom završeno — ostaje samo polish)
**Cilj:** dovršiti aplikaciju kao "pravu" — sa svim stranicama koje očekuje korisnik i SEO-om.

Pogledaj `## TODO` ispod za konkretne zadatke.

### ⏳ Faza 3 — PWA i offline
Manifest, service worker, ikone, splash screens.

### ⏳ Faza 4 — Brending
Finalno ime, logo, OG/Twitter preview slike, custom domen.

### ⏳ Faza 5 — Deploy
Netlify/Cloudflare Pages, analytics (Plausible), produkcija live.

### ⏳ Faza 6 — Marketing
TikTok/Instagram sadržaj, influencer outreach, QR kodovi.

---

## TODO — Faza 2 (aktivna)

Prioritet visok ka niskom. Označi `[x]` kad završiš.

### Stranice i navigacija
- [x] **Main menu / Početna** — pravi početni ekran sa CTA "Igraj", linkovima ka O igri, Pravila, Privacy, Terms. Trenutno setup ekran je odmah prvi.
- [x] **Strana "Kako se igra" / Pravila** — kompletna pravila igre na srpskom, sa primerima
- [x] **Strana "O igri" / O nama** — kratko ko stoji iza, ideja iza igre
- [x] **Privacy Policy** — GDPR-compliant tekst na srpskom. Šta čuvamo (samo localStorage podešavanja), šta NE čuvamo (ništa na serveru), analytics info ako dodamo Plausible
- [x] **Terms of Use** — uslovi korišćenja, ograničenje odgovornosti, da igra nije zvanično povezana sa Spyfall/među nama/itd.
- [x] **Router** — jednostavan client-side router za navigaciju između sekcija (hashbang ili history API)
- [x] **Header/Footer** komponente sa linkovima ka svim stranama
- [x] **404 stranica** ako neko unese loš URL

### SEO i meta
- [x] **Dinamičko ažuriranje title-a i description-a** po stranici
- [x] **`<meta property="og:*">`** za Open Graph (WhatsApp/Facebook preview)
- [x] **`<meta name="twitter:*">`** za Twitter card preview
- [x] **`robots.txt`** i **`sitemap.xml`**
- [x] **Strukturirani podaci (JSON-LD)** za WebApplication schema
- [ ] **`lang="sr"` provera svuda**, `hreflang` ako bude potrebe za regionom

### Polish core iskustva
- [x] **Onboarding modal** pri prvom otvaranju — kratak walkthrough (3 koraka), skipovljiv, ne pojavljuje se ponovo (localStorage flag)
- [x] **Bolje animacije prelaza** — `.page-enter` klasa, animacija se okida samo pri pravoj navigaciji (ne pri re-renderu istog ekrana)
- [ ] **Reveal animacija reči** — slovo-po-slovo ili fade scale, da bude "drama" momenat
- [ ] **Mode kategorija "Family friendly" filter** — boolean na svakom paru u JSON-u, toggle u podešavanjima
- [ ] **Reset settings dugme** u nekom advanced delu
- [ ] **Back gesture handling** — kad korisnik pritisne back na Androidu, ne sme da izađe iz app-a usred igre bez confirm-a
- [ ] **Confirmation pre prekida igre** je već tu, ali proveri sve edge case-ove

### Sadržaj — odlaganje na korisnika
- [x] ~~Proširiti `reci.json`~~ → **korisnik dodaje ručno**
- [ ] **Dodati `family_friendly: true/false` polje na svaki par** u JSON strukturi (sad polako, korisnik može da popunjava)

### Tehnički housekeeping
- [x] **`.gitignore`** za projekat (`.DS_Store`, `node_modules` ako se nekad pojavi, `.vscode/`)
- [x] **`favicon.ico`** + `apple-touch-icon` — koristi `images/uljez - favicon.png` (500x500px, placeholder do finalnog brenda)
- [ ] **Performance audit** sa Lighthouse — cilj 95+ na svim metrikama na mobile
- [ ] **Accessibility audit** — kontrast, screen reader podrška za osnovni navigation, `aria-label` na ikoničkim dugmadima

---

## TODO — kasnije faze (referenca)

### Faza 3 (PWA)
- [ ] `manifest.json` sa ikonom, ime, theme color
- [ ] Service worker za offline mode
- [ ] Set ikona u svim veličinama (192, 512, maskable za Android)
- [ ] iOS splash screen-ovi
- [ ] "Add to Home Screen" prompt na pravo vreme

### Faza 4 (Brending)
- [ ] **SEO research za naziv** — proveriti šta se traži na Google Trends, šta već postoji
- [ ] **Finalno ime aplikacije**
- [ ] **Logo** (SVG, monohromatski + color verzija)
- [ ] **Custom domen** (`.rs` ili `.com`)
- [ ] **OG image** (1200x630px) sa logom i sloganom
- [ ] **Favicon set** (svi formati, brand boje)

### Faza 5 (Deploy)
- [ ] Netlify/Cloudflare Pages setup
- [ ] Custom domen + DNS
- [ ] HTTPS (automatski sa Netlify/Cloudflare)
- [ ] Plausible Analytics (ili Umami self-hosted)
- [ ] Cookie banner ako koristimo analytics (verovatno ne treba ako je Plausible, ali proveriti)

### Faza 6 (Marketing) — van Claude Code scope-a
- TikTok/Instagram Reels strategija
- Influencer outreach
- QR kodovi za štampu
- Submit na ProductHunt, igrice direktorijume

---

## Najvažnije korisnikove preference (iz ranijih razgovora)

- **Ime aplikacije** — privremeno **Uljez** u kodu i UI-u. Finalno ime čeka SEO research u Srbiji.
- **Tagline** — "Pronađi uljeza" (dogovoreno u sesiji 3)
- **Hero na main meniju** — logo slika (72px) iznad "Uljez" naslova; logo je i u page-header content stranica (28px centered)
- **Onboarding** — automatski pri prvom otvaranju (localStorage flag), skipovljiv, dostupan posle preko "Kako se igra" linka
- **Router** — hash-based (`#/igraj`, `#/privacy` itd.) — ne history API za sad
- **Verzija** — v0.2.1 posle sesije 4
- **Kontakt email** — preskočen za sad, dodaje se kasnije
- **Sadržaj reči** — mainstream + family-friendly kao odvojena kategorija, NE odvažan/psovke
- **Pismo** — latinica sad, ćirilica kasnije (toggle, opciono)
- **Ciljna publika** — sve od navedenog (kafanske grupe, porodice, studenti) — ne fokusiramo na jednu nišu još
- **Vreme** — bez žurbe, "koliko god treba"
- **Reči se dodaju ručno** — korisnik sam editujе `reci.json`, ne pravimo admin UI
- **Korisnik može da testira na pravim telefonima sa pravim grupama** — koristi ovo za feedback

---

## Šta NE diraj bez razgovora

- `reci.json` sadržaj — strukturu možeš predložiti, ali sadržaj korisnik dodaje sam
- Brending i ime — čeka SEO research
- Bilo kakav backend kod — ostajemo client-side
- npm/build alate — ostajemo vanilla

---

## Workflow za nove sesije

1. Pročitaj ovaj `CLAUDE.md` (automatski)
2. Pročitaj `DOKUMENTACIJA.md` ako menjaš postojeću funkciju
3. Pre nego što počneš veći zadatak, predloži korisniku plan
4. **Na kraju sesije UVEK ažuriraj `DOKUMENTACIJA.md`** ako si dodao/menjao funkcije
5. Označi završene `[x]` u TODO listi iznad
6. Ako ima novih odluka koje treba zapamtiti, dodaj ih u "Najvažnije korisnikove preference"
