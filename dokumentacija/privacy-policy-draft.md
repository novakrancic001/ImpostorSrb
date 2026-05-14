# Politika privatnosti

**Poslednje ažuriranje:** [DATUM, npr. 15. januar 2026.]

## Uvod

Hvala što koristiš [NAZIV APLIKACIJE] (u daljem tekstu "aplikacija" ili "igra"). Privatnost naših korisnika nam je važna i transparentnost o tome kako tretiramo podatke je naša obaveza.

Ova politika privatnosti objašnjava koje podatke prikupljamo (vrlo malo), kako ih koristimo (lokalno na tvom uređaju), i koja su tvoja prava.

**Ukratko:** Ova aplikacija je dizajnirana tako da ne prikuplja, ne čuva i ne deli tvoje lične podatke. Sva podešavanja se čuvaju isključivo lokalno u tvom browseru.

---

## Ko je odgovoran za obradu podataka

Aplikaciju razvija i održava:

**[IME / NAZIV ENTITETA]**
[Adresa, ako primenjivo]
Email za kontakt: [EMAIL ADRESA]

> ⚠ Napomena za editovanje: Ako planiraš da operišeš kao fizičko lice, dovoljan je email. Ako kao firma, dodaj puno ime, adresu sedišta i PIB.

---

## Koje podatke prikupljamo

### Podaci koji se čuvaju lokalno na tvom uređaju

Aplikacija koristi `localStorage` (deo tvog web browsera) da bi zapamtila tvoja podešavanja između sesija. Konkretno, čuvamo:

- Broj igrača koji si poslednji put izabrao
- Broj uljeza
- Izabranu kategoriju reči
- Mod igre (sa hintom ili bez)
- Da li je tajmer uključen i koliko traje

**Ovi podaci nikada ne napuštaju tvoj uređaj.** Ne šaljemo ih na server, ne pravimo backup, ne dele se sa trećim stranama. Možeš ih obrisati u bilo kom trenutku — bilo brisanjem browser podataka, bilo dugmetom "Resetuj podešavanja" u aplikaciji [ako bude dodato].

### Podaci koje NE prikupljamo

Aplikacija **NE** prikuplja:

- Tvoje ime, email, broj telefona ili druge lične podatke
- IP adresu (ne postoji backend server koji bi je video)
- Lokaciju
- Sadržaj igara koje si igrao, ko je pobedio, ko je bio uljez
- Bilo kakvu komunikaciju između igrača
- Identifikatore uređaja, fingerprint browsera

### Cookies

Aplikacija **ne koristi kolačiće** (cookies) u tradicionalnom smislu. `localStorage` koji koristimo nije isto što i kolačić — to je tehnologija koja čuva podatke isključivo lokalno i ne šalje se serverima pri svakom zahtevu.

---

## Analitika

> ⚠ Napomena za editovanje: Izaberi jednu od dve opcije ispod, obriši drugu.

### Opcija A — Bez analitike (trenutno)

Trenutno ne koristimo nikakav analitički alat. Ne znamo koliko korisnika ima aplikacija, ne znamo koje stranice posećuju, ne pratimo njihovo ponašanje.

### Opcija B — Sa Plausible Analytics (ako dodajemo kasnije)

Za potrebe razumevanja koliko ljudi koristi aplikaciju i koje stranice se posećuju, koristimo [Plausible Analytics](https://plausible.io) — analitički alat koji je dizajniran sa privatnošću u fokusu.

Plausible:
- **Ne koristi kolačiće**
- **Ne prikuplja lične podatke**
- **Ne pravi fingerprint korisnika**
- Prikuplja samo anonimne, agregirane podatke: broj poseta, koje stranice, sa kog uređaja (desktop/mobile), iz koje zemlje
- Usklađen sa GDPR-om, CCPA-om i ostalim regulativama o privatnosti

Više informacija na: [https://plausible.io/data-policy](https://plausible.io/data-policy)

---

## Deljenje sa trećim licima

**Ne delimo nikakve podatke sa trećim licima.** Pošto i ne prikupljamo lične podatke, nema ničega da se deli.

Spoljni servisi koje aplikacija koristi:

- **Google Fonts** — fontovi se učitavaju sa `fonts.googleapis.com`. Google može da loguje IP adresu pri učitavanju fonta. [Više info](https://policies.google.com/privacy)
- **[Hosting provajder — Netlify / Cloudflare / itd.]** — služi statičke fajlove. Hosting provajder može imati pristup standardnim server logovima (IP adresa, vreme zahteva, user agent) prema svojim politikama privatnosti.

> ⚠ Napomena za editovanje: Posle deploya, ovde dodaj konkretan hosting provajder i link na njihovu politiku privatnosti.

---

## Tvoja prava

Pošto ne čuvamo nikakve lične podatke o tebi na našoj strani, mnoga "klasična" GDPR prava su praktično nepotrebna — ali za potpunost:

- **Pravo na pristup:** Možeš pogledati šta je sačuvano lokalno otvaranjem developer alata u browseru (F12 → Application → Local Storage)
- **Pravo na brisanje:** Obriši browser podatke za ovaj sajt — sve nestaje istog trenutka
- **Pravo na prenosivost:** Podaci su tvoji, u tvom browseru. Možeš ih kopirati u JSON formatu iz developer alata.
- **Pravo na žalbu:** Ako smatraš da ti je neko pravo ugroženo, možeš podneti žalbu Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti Republike Srbije: [https://www.poverenik.rs](https://www.poverenik.rs)

---

## Deca i maloletna lica

Aplikacija nije namenjena specifično deci, ali sadržaj je family-friendly (porodičan). Ne prikupljamo namerno podatke od osoba mlađih od 16 godina. Pošto i ne prikupljamo podatke generalno, ovo je manje aktivno pitanje.

---

## Promene politike privatnosti

Možemo s vremena na vreme da ažuriramo ovu politiku. Datum poslednje izmene će biti naveden na vrhu. Veće izmene ćemo, ako je moguće, najaviti unutar aplikacije.

---

## Kontakt

Za pitanja o privatnosti, ili o aplikaciji generalno:

📧 **[KONTAKT EMAIL]**

---

> ⚠ NAPOMENE ZA EDITOVANJE PRE PUBLIKOVANJA:
> 1. Popuni sve `[ZAGRADE]` realnim vrednostima
> 2. Izaberi između Opcije A i B za analitiku, obriši onu koju ne koristiš
> 3. Dodaj hosting provajdera posle deploy-a
> 4. Stavi pravi datum poslednjeg ažuriranja
> 5. Ako kasnije dodaš Plausible ili nešto drugo, ažuriraj odgovarajući deo
> 6. **Ovaj tekst NIJE pravni dokument verifikovan od strane advokata.** Za komercijalnu/poslovnu upotrebu preporučljivo je konsultovati advokata za zaštitu podataka. Za hobi projekat ovo bi trebalo da bude više nego dovoljno.
