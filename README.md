# Impostor — srpska igra reči

MVP verzija. Pass-and-play na jednom telefonu.

## Pokretanje

**Live Server (VS Code ekstenzija):**
1. Otvori folder `impostor/` u VS Code-u
2. Klikni desnim klikom na `index.html` → "Open with Live Server"
3. Otvoriće se u browseru na `http://127.0.0.1:5500` ili sličnoj adresi

**Bilo koji drugi statički server:**
```bash
# Python 3
python -m http.server 8000

# Node (npx)
npx serve

# PHP
php -S localhost:8000
```

> ⚠️ Ne može se pokrenuti dvostrukim klikom na `index.html` (file://) jer `fetch()` ne radi sa lokalnim fajlovima — mora server.

## Testiranje na telefonu (preporučeno)

Pošto je responsive ključno, testiraj na telefonu:

1. Pokreni Live Server (radi na port-u 5500)
2. Pronađi lokalnu IP adresu kompjutera (`ipconfig` na Windows-u, `ifconfig` ili `ip a` na Linux/Mac)
3. Na telefonu (mora biti na istoj WiFi mreži), otvori `http://192.168.x.x:5500`
4. Settings za Live Server u VS Code: postavi `liveServer.settings.host: "0.0.0.0"`

## Struktura

- `index.html` — entry point
- `styles.css` — sav stil, mobile-first
- `app.js` — game logika, state, rendering
- `reci.json` — baza reči po kategorijama (lako za proširivanje)

## Dodavanje reči

Edituj `reci.json` po šablonu:

```json
"kategorija_kljuc": {
  "naziv": "Naziv kategorije",
  "ikonica": "🎯",
  "parovi": [
    { "rec": "glavna reč", "hint": "slična reč za uljeza" }
  ]
}
```

Ne moraš ništa drugo da menjaš — kategorija će se automatski pojaviti u izboru.

## Funkcionalnosti u ovoj verziji

- ✅ 3-12 igrača, 1-2 uljeza
- ✅ 8 kategorija sa srpskim rečima (~110 parova)
- ✅ Mod sa hintom / bez hinta
- ✅ Custom tajmer (30s - 5min) ili bez tajmera
- ✅ Hold-to-reveal (sprečava slučajne tap-ove)
- ✅ Wake Lock (ekran se ne zaključava tokom igre)
- ✅ Vibracija na otkrivanju i kraju tajmera
- ✅ localStorage pamti poslednja podešavanja
- ✅ Responsive, dark theme

## Sledeći koraci (Faza 2-3)

- Više reči (cilj: 300+ parova)
- PWA (manifest + service worker za offline)
- Više animacija / mikro-interakcija
- Custom kategorije (korisnik unosi svoje reči)
- Statistike (lokalne)
- Podela rezultata na WhatsApp
