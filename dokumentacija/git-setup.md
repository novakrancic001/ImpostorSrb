# Git setup za projekat

## .gitignore

Predložen sadržaj za `.gitignore` fajl u korenu projekta:

```gitignore
# macOS
.DS_Store
.AppleDouble
.LSOverride

# Windows
Thumbs.db
Desktop.ini
$RECYCLE.BIN/

# Linux
*~
.directory

# Editor folderi
.vscode/
.idea/
*.swp
*.swo
*~

# Node (ako se ikada pojavi)
node_modules/
package-lock.json
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build folderi (ne koristimo, ali za svaki slučaj)
dist/
build/
.cache/

# Environment files (ako budemo imali analytics, API ključeve)
.env
.env.local
.env.*.local

# OS i privremeni fajlovi
*.log
*.tmp
.tmp/
.temp/

# Lokalna podešavanja za development
.local/
*.local

# Drafts folder (ovo OVO mi DRŽIMO u repo-u jer su drafti deo planiranja)
# !drafts/  ← ne komentariši ovo, drafts ide u git
```

> 📝 Napomena: `drafts/` folder ostaje u git-u — to su deo dokumentacije projekta.

---

## Inicijalni commit (predlog)

```bash
# Otvori terminal u korenu projekta
cd putanja/do/impostor/

# Inicijalizuj git
git init

# Postavi defaultnu granu na "main"
git branch -M main

# Dodaj .gitignore prvo (videti gore)
# Onda dodaj sve fajlove
git add .

# Prvi commit
git commit -m "Initial commit: MVP verzija sa svim Faza 1 fajlovima i planom za Faza 2"

# Poveži sa GitHub-om (kreiraj prvo prazan repo na github.com)
git remote add origin https://github.com/[TVOJ-USERNAME]/[NAZIV-REPO].git
git push -u origin main
```

---

## Predlog commit poruka konvencije

Da Claude Code i ti imate kontekst kroz git istoriju, predlažem prefiksiranje:

```
feat: nova funkcionalnost (npr. "feat: dodat onboarding modal")
fix: ispravka bug-a (npr. "fix: tajmer se ne resetuje pri novoj igri")
style: izmene CSS-a, vizuelne stvari (npr. "style: poboljšana animacija reveal-a")
docs: dokumentacija (npr. "docs: ažurirana DOKUMENTACIJA.md za Sesiju 3")
content: izmene sadržaja, reči, tekstova (npr. "content: dodato 20 novih reči u kategoriju 'Hrana'")
refactor: prepravka koda bez funkcionalnih izmena
chore: housekeeping (npr. "chore: dodat favicon set")
seo: SEO izmene
```

Primer dobrih poruka:

```
feat: dodat client-side router sa hash-based navigacijom
content: napisana finalna verzija Privacy Policy stranice
fix: hold-to-reveal ne radi na iOS Safari < 16
style: tipografija na Privacy stranici sad koristi Manrope umesto Fraunces
```

---

## Predlog branch strategije (za sada)

Pošto si solo developer, jednostavno:

- **`main`** — uvek "deployable" stanje, ono što ide live
- **`dev`** ili feature grane (`feature/onboarding`, `feature/seo-meta`) za rad u toku

Kad si zadovoljan, merge sa main. Bez previše ceremonije.

---

## Šta NE commit-uješ

Pravilo broj jedan: **nikada API ključeve, lozinke, lične podatke**.

Pošto je ovo statički projekat bez backenda, to praktično znači:

- Ako kasnije dodaš Plausible Analytics — site ID može u kod (javan je)
- Ako budeš imao API ključeve za bilo šta — u `.env` fajl, koji je u `.gitignore`
- Lične napomene, TODO za sebe — može u `CLAUDE.local.md` (već u `.gitignore`)

---

> 📌 Preporuka:
> Posle prvog commit-a, kreiraj **public GitHub repo** ako planiraš da kod bude otvoren — to dodaje verodostojnost projektu i Claude Code može da prati git status. Ako želiš privatan, isto, samo public bude bolji za marketing kasnije.
