/* ==========================================================================
   content.js — HTML sadržaj za statičke stranice
   Svaki ključ odgovara ruti: 'kako-se-igra', 'o-igri', 'privacy', 'terms'
   ========================================================================== */

const CONTENT = {

  /* --------------------------------------------------------------------------
     Kako se igra
     ------------------------------------------------------------------------ */
  'kako-se-igra': { html: `
    <h2 class="content-title">Kako se igra</h2>

    <h3>Šta je Uljez?</h3>
    <p>Društvena igra reči za grupu od <strong>3 do 12 igrača</strong>. Igra se uživo, na jednom telefonu koji kruži između igrača.</p>
    <p>Princip je jednostavan: svi igrači dobiju istu reč — osim <strong>jednog ili dvojice uljeza</strong>, koji ili ne dobiju ništa ili dobiju sličnu, ali drugačiju reč. Cilj svih ostalih je da otkriju ko je uljez. Cilj uljeza je da ostane neprimećen.</p>
    <p><strong>Vreme za jednu partiju:</strong> 5–10 minuta. Idealno za posle večere, na žurci, ili kad ne znate šta da radite.</p>

    <h3>Šta vam treba</h3>
    <ul>
      <li><strong>Jedan telefon</strong> (ili tablet) sa otvorenom aplikacijom</li>
      <li><strong>Najmanje 3 igrača</strong> uživo, u istoj prostoriji</li>
      <li><strong>Olovka i papir</strong> (opciono) za beleženje rezultata kroz više partija</li>
    </ul>

    <h3>Postavljanje igre</h3>
    <p>Pre nego što počnete:</p>
    <ol>
      <li><strong>Izaberite hosta.</strong> Jedna osoba drži telefon i podešava igru. Host može takođe da bude igrač.</li>
      <li><strong>Dogovorite se oko broja igrača.</strong> Minimum 3, idealno 4–7, maksimum 12.</li>
      <li><strong>Odlučite koliko uljeza.</strong> Sa 3–5 igrača: 1 uljez. Sa 6+ igrača: možete imati i 2 uljeza za više haosa.</li>
      <li><strong>Izaberite kategoriju.</strong> Hrana, mesta u Srbiji, poznate ličnosti, filmovi, sport... ili "sve" za totalno nasumičnu reč.</li>
      <li><strong>Izaberite mod</strong> (sa hintom ili bez ničega).</li>
      <li><strong>Izaberite tajmer</strong> (opciono).</li>
    </ol>

    <h3>Dva moda igre</h3>

    <h4>Mod 1: Sa hintom (slična reč) — preporučeno za početnike</h4>
    <p>Uljez ne ostaje potpuno u mraku — dobija sličnu reč iz iste kategorije kao hint.</p>
    <p><strong>Primer:</strong> Glavna reč je <strong>"burek"</strong>. Uljez vidi <strong>"pita"</strong>.</p>
    <p>Ovo znači da uljez:</p>
    <ul>
      <li>Zna kategoriju (hrana)</li>
      <li>Može lakše da blefira — kad neko kaže "ujutru", uljez sa "pitom" može mirno da klimne glavom</li>
      <li>Ali rizikuje da kaže nešto karakteristično za pitu, a ne burek — i tako se oda</li>
    </ul>
    <p>Ovaj mod je dinamičniji i zabavniji za grupe koje se prvi put igraju.</p>

    <h4>Mod 2: Bez ničega — klasično, teže za uljeza</h4>
    <p>Uljez ne dobija ni jednu reč — samo informaciju "ti si uljez" i kategoriju. Mora pažljivo da prati šta drugi pričaju i da na licu mesta improvizuje. Kad uspe — pobeda je slađa.</p>

    <h3>Tok igre</h3>

    <h4>1. Otkrivanje reči</h4>
    <p>Aplikacija prikazuje "Igrač 1 — drži za otkrivanje". Prvi igrač uzima telefon, drži krug nekoliko sekundi, vidi svoju reč, sakrije telefon (tap na ekran), i predaje sledećem igraču.</p>
    <p><strong>Važno:</strong> Niko drugi ne sme da gleda dok je tuđa reč na ekranu. Ako neko slučajno vidi, partija se prekida i počinje nova.</p>

    <h4>2. Diskusija</h4>
    <p>Kad svi vide svoje, počinje diskusija. Najjednostavnija pravila:</p>
    <blockquote>Svaki igrač, po redu, kaže <strong>jednu reč</strong> koja je povezana sa njihovom rečju. Ne sme da kaže samu reč.</blockquote>
    <p><strong>Primer</strong> (reč je "burek"):</p>
    <ul>
      <li>Igrač 1: "tanak"</li>
      <li>Igrač 2: "doručak"</li>
      <li>Igrač 3 (uljez sa "pitom"): "topla"</li>
      <li>Igrač 4: "sir"</li>
      <li>Igrač 5: "ujutru"</li>
    </ul>
    <p>Posle prvog kruga, ide se u drugi — sada svaki igrač može da kaže rečenicu ili pitanje drugom igraču.</p>

    <h4>3. Glasanje</h4>
    <p>Posle dovoljno diskusije (ili kad istekne tajmer), svi istovremeno pokazuju prstom ko misle da je uljez.</p>
    <blockquote>Aplikacija ne vodi glasanje — to radite uživo. Aplikacija samo otkriva ko je bio uljez na kraju.</blockquote>

    <h4>4. Otkrivanje</h4>
    <p>Kliknite "Otkrij ko je uljez" u aplikaciji. Pojaviće se koja je bila glavna reč, koji igrač(i) su bili uljezi, i (u hint modu) koji hint je uljez dobio.</p>

    <h3>Ko pobeđuje?</h3>
    <p><strong>Ako su ostali pogodili uljeza:</strong> Ostali igrači pobeđuju.</p>
    <p><strong>Ako uljez nije razotkriven:</strong> Uljez pobeđuje.</p>
    <p><strong>Bonus pravilo (opciono):</strong> Ako uljez bude razotkriven, ali pogodi koja je bila glavna reč — uljez ipak pobeđuje! Ovo dodaje sloj strategije: ostali ne smeju da otkriju previše čak ni kad su sigurni ko je uljez.</p>

    <h3>Saveti za bolju igru</h3>

    <h4>Za sve igrače</h4>
    <ul>
      <li>Ne budi previše opšti ("dobro je", "ja to volim") — deluje sumnjivo</li>
      <li>Ne budi previše specifičan ("kora od jufke") — daje uljezu previše informacija</li>
      <li>Pazi na ko gleda u koga kad neko kaže nešto neobično</li>
      <li>Pitanja su moćnija od izjava — primoravaju drugog igrača da se otkrije više</li>
    </ul>

    <h4>Za uljeze</h4>
    <ul>
      <li>Slušaj prvi krug do kraja pre nego što ti je red</li>
      <li>Ako imaš hint, ne govori o hintu direktno — govori o kategoriji</li>
      <li>Prati šta većina kaže i drži se opštih reči</li>
      <li>Klimaj glavom kad drugi nešto kažu — ali ne previše</li>
      <li>Nemoj prvi da nekoga optužuješ — to je crveni znak</li>
    </ul>

    <h4>Za hosta</h4>
    <ul>
      <li>Ne otkrivaj ko je uljez dok aplikacija to ne kaže</li>
      <li>Igraj i ti, ne samo da držiš telefon</li>
      <li>Za mlađu publiku, biraj samo "hrana" ili "mesta" kategorije</li>
    </ul>

    <h3>Šta ako...</h3>

    <p><strong>...neko slučajno vidi tuđu reč?</strong><br>
    Partija je pokvarena. Pokrenite novu — aplikacija će izabrati drugu reč.</p>

    <p><strong>...dva igrača kažu istu reč?</strong><br>
    To je u redu, samo ide dalje. Ali često ukazuje da niko od njih nije uljez.</p>

    <p><strong>...tajmer istekne pre nego što odlučimo?</strong><br>
    Glasajte odmah, ili produžite diskusiju — kako grupa želi. Tajmer je samo orijentir.</p>

    <p><strong>...ima 2 uljeza?</strong><br>
    Oni ne znaju jedno za drugo! Mnogo teža varijanta igre.</p>

    <div class="content-cta">
      <a href="#/" class="btn btn-secondary">← Idi na početnu</a>
    </div>
  ` },

  /* --------------------------------------------------------------------------
     O igri
     ------------------------------------------------------------------------ */
  'o-igri': { html: `
    <h2 class="content-title">O igri</h2>

    <h3>Otkud ovo</h3>
    <p>Uljez je nastao iz jednostavne želje — da postoji <strong>prava srpska verzija</strong> igre uljeza, koju ćemo igrati uveče u stanu, na slavi, u kafiću, na putovanju.</p>
    <p>Igre tipa <em>Spyfall</em> i <em>Among Us</em> postoje na engleskom već godinama, ali kad pokušaš da ih igraš u srpskoj grupi, nije isto. Reči su strane, reference su tuđe, kulturni kontekst je drugačiji. "Lemon" kao reč nema istu težinu kao "burek". "Times Square" nije isto što i "Kalemegdan".</p>
    <p>Zato smo napravili igru koja je <strong>napravljena za nas</strong> — sa rečima koje znamo, kategorijama koje pratimo, i osećajem koji pasuje uz rakiju i kafu.</p>

    <h3>Šta nas pokreće</h3>
    <p><strong>Jednostavnost.</strong> Ne treba ti aplikacija sa registracijom, profilima, naplatama. Otvoriš link, klikneš "Igraj", igraš. Toliko.</p>
    <p><strong>Privatnost.</strong> Ne želimo tvoje podatke. Aplikacija ne zna ko si, ne pamti šta si igrao, ne šalje ništa nikuda. Sva podešavanja ostaju u tvom browseru.</p>
    <p><strong>Kulturni kontekst.</strong> Reči nisu prevod sa engleskog — pisane su misleći na nas. Slavski običaji, domaća muzika, naši filmovi, lokalna mesta. Ako prepoznaš referencu, znači da je igra dobro odrađena.</p>
    <p><strong>Besplatno.</strong> Aplikacija je besplatna i ostaće takva. Bez reklama u igri. Bez "premium" verzije.</p>

    <h3>Ko stoji iza</h3>
    <p>Više informacija uskoro.</p>

    <h3>Tehnologija (za znatiželjne)</h3>
    <p>Aplikacija je napisana u čistom JavaScript-u, HTML-u i CSS-u — bez velikih framework-a, bez build alata, bez backenda. To znači:</p>
    <ul>
      <li>Učitava se <strong>brzo</strong>, čak i na slabijem internetu</li>
      <li>Ne zavisi od trećih servisa — dovoljno je da jednom učitaš stranicu</li>
      <li>Kod je dovoljno mali da ga <strong>jedna osoba može razumeti i održavati</strong></li>
    </ul>
    <p>Tehnologija je sredstvo, ne cilj. Ono što pravi razliku — to su reči, kategorije, i način na koji se igra prirodno odvija.</p>

    <div class="content-cta">
      <a href="#/" class="btn btn-secondary">← Idi na početnu</a>
    </div>
  ` },

  /* --------------------------------------------------------------------------
     Privacy Policy
     ------------------------------------------------------------------------ */
  'privacy': { html: `
    <h2 class="content-title">Politika privatnosti</h2>
    <p><strong>Poslednje ažuriranje:</strong> Januar 2026.</p>

    <h3>Uvod</h3>
    <p>Hvala što koristiš Uljez. Privatnost naših korisnika nam je važna i transparentnost o tome kako tretiramo podatke je naša obaveza.</p>
    <p><strong>Ukratko:</strong> Ova aplikacija je dizajnirana tako da ne prikuplja, ne čuva i ne deli tvoje lične podatke. Sva podešavanja se čuvaju isključivo lokalno u tvom browseru.</p>

    <h3>Ko je odgovoran za obradu podataka</h3>
    <p>Aplikaciju razvija i održava autor projekta Uljez. Kontakt će biti dodat uskoro.</p>

    <h3>Koje podatke prikupljamo</h3>

    <h4>Podaci koji se čuvaju lokalno na tvom uređaju</h4>
    <p>Aplikacija koristi <code>localStorage</code> (deo tvog web browsera) da bi zapamtila tvoja podešavanja između sesija. Konkretno, čuvamo:</p>
    <ul>
      <li>Broj igrača koji si poslednji put izabrao</li>
      <li>Broj uljeza</li>
      <li>Izabranu kategoriju reči</li>
      <li>Mod igre (sa hintom ili bez)</li>
      <li>Da li je tajmer uključen i koliko traje</li>
      <li>Da li si prošao uvodne korake (onboarding)</li>
    </ul>
    <p><strong>Ovi podaci nikada ne napuštaju tvoj uređaj.</strong> Ne šaljemo ih na server, ne pravimo backup, ne dele se sa trećim stranama. Možeš ih obrisati u bilo kom trenutku brisanjem browser podataka za ovaj sajt.</p>

    <h4>Podaci koje NE prikupljamo</h4>
    <p>Aplikacija <strong>ne</strong> prikuplja:</p>
    <ul>
      <li>Tvoje ime, email, broj telefona ili druge lične podatke</li>
      <li>IP adresu (ne postoji backend server koji bi je video)</li>
      <li>Lokaciju</li>
      <li>Sadržaj igara koje si igrao, ko je pobedio, ko je bio uljez</li>
      <li>Identifikatore uređaja ili fingerprint browsera</li>
    </ul>

    <h4>Cookies</h4>
    <p>Aplikacija <strong>ne koristi kolačiće</strong>. <code>localStorage</code> koji koristimo nije isto što i kolačić — to je tehnologija koja čuva podatke isključivo lokalno i ne šalje se serverima pri svakom zahtevu.</p>

    <h3>Analitika</h3>
    <p>Trenutno ne koristimo nikakav analitički alat. Ne znamo koliko korisnika ima aplikacija, ne znamo koje stranice posećuju, ne pratimo njihovo ponašanje.</p>

    <h3>Deljenje sa trećim licima</h3>
    <p><strong>Ne delimo nikakve podatke sa trećim licima.</strong> Pošto i ne prikupljamo lične podatke, nema ničega da se deli.</p>
    <p>Spoljni servisi koje aplikacija koristi:</p>
    <ul>
      <li><strong>Google Fonts</strong> — fontovi se učitavaju sa <code>fonts.googleapis.com</code>. Google može da loguje IP adresu pri učitavanju fonta. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Više info</a></li>
      <li><strong>Hosting provajder</strong> — služi statičke fajlove i može imati pristup standardnim server logovima prema svojoj politici privatnosti.</li>
    </ul>

    <h3>Tvoja prava</h3>
    <p>Pošto ne čuvamo nikakve lične podatke o tebi na našoj strani:</p>
    <ul>
      <li><strong>Pravo na pristup:</strong> Možeš pogledati šta je sačuvano lokalno otvaranjem developer alata (F12 → Application → Local Storage)</li>
      <li><strong>Pravo na brisanje:</strong> Obriši browser podatke za ovaj sajt — sve nestaje istog trenutka</li>
      <li><strong>Pravo na žalbu:</strong> Možeš podneti žalbu <a href="https://www.poverenik.rs" target="_blank" rel="noopener">Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti</a> Republike Srbije</li>
    </ul>

    <h3>Deca i maloletna lica</h3>
    <p>Aplikacija nije namenjena specifično deci, ali sadržaj je porodičan. Ne prikupljamo namerno podatke od osoba mlađih od 16 godina — a pošto ne prikupljamo podatke generalno, ovo je manje aktivno pitanje.</p>

    <h3>Promene politike privatnosti</h3>
    <p>Možemo s vremena na vreme da ažuriramo ovu politiku. Datum poslednje izmene je naveden na vrhu. Veće izmene ćemo, ako je moguće, najaviti unutar aplikacije.</p>

    <div class="content-cta">
      <a href="#/" class="btn btn-secondary">← Idi na početnu</a>
    </div>
  ` },

  /* --------------------------------------------------------------------------
     Terms of Use
     ------------------------------------------------------------------------ */
  'terms': { html: `
    <h2 class="content-title">Uslovi korišćenja</h2>
    <p><strong>Poslednje ažuriranje:</strong> Januar 2026.</p>

    <h3>1. Prihvatanje uslova</h3>
    <p>Pristupanjem i korišćenjem Uljeza (u daljem tekstu "aplikacija", "igra", "servis"), prihvataš ove uslove korišćenja u celosti. Ako se sa nekim delom ne slažeš, molimo te da ne koristiš aplikaciju.</p>

    <h3>2. Šta je aplikacija</h3>
    <p>Uljez je besplatna web aplikacija za društvenu igru reči. Aplikacija radi u tvom web browseru, ne zahteva registraciju, i namenjena je za korišćenje uživo u grupi, na jednom telefonu (pass-and-play format).</p>
    <p>Aplikacija je razvijena kao nezavisan projekat i <strong>nije zvanično povezana</strong> sa drugim igrama sličnog formata kao što su <em>Spyfall</em>, <em>Among Us</em>, <em>Werewords</em> niti bilo kojom drugom registrovanom igrom ili brendom.</p>

    <h3>3. Pravo korišćenja</h3>
    <p>Daje ti se besplatno, neisključivo i opozivo pravo da koristiš aplikaciju za ličnu, nekomercijalnu zabavu.</p>
    <p><strong>Smeš:</strong></p>
    <ul>
      <li>Da koristiš aplikaciju koliko god želiš</li>
      <li>Da je deliš sa prijateljima slanjem linka</li>
      <li>Da je koristiš na bilo kom broju uređaja</li>
      <li>Da praviš snimke i deliš ih na društvenim mrežama</li>
    </ul>
    <p><strong>Ne smeš:</strong></p>
    <ul>
      <li>Da je koristiš u komercijalne svrhe bez pisanog odobrenja</li>
      <li>Da je preprodaješ ili naplaćuješ pristup</li>
      <li>Da koristiš automatizovane skripte ili botove za pristup</li>
      <li>Da je koristiš za bilo kakav nelegalan sadržaj ili aktivnost</li>
    </ul>

    <h3>4. Sadržaj reči</h3>
    <p>Aplikacija dolazi sa unapred definisanom bazom reči na srpskom jeziku, podeljenom u kategorije. Trudimo se da sadržaj bude primeren za široku publiku i kulturno relevantan za srpsko govorno područje. Ako primetiš sadržaj koji smatraš neprikladnim, javi nam se.</p>

    <h3>5. Pravila ponašanja u igri</h3>
    <p>Aplikacija je alat za zabavu. Korisnici su odgovorni za sopstveno ponašanje tokom igre uživo. Ne snosimo odgovornost za nesporazume ili svađe između igrača.</p>

    <h3>6. Intelektualna svojina</h3>
    <p>Sav originalan sadržaj aplikacije — uključujući dizajn korisničkog interfejsa, originalnu bazu reči i kategorije, i tekstove na sajtu — zaštićeni su autorskim pravom i pripadaju autoru aplikacije.</p>
    <p>Fontovi <em>Fraunces</em> i <em>Manrope</em> su distribuirani pod SIL Open Font License preko Google Fonts.</p>

    <h3>7. Ograničenje odgovornosti</h3>
    <p>Aplikacija se obezbeđuje <strong>"kao što jeste"</strong>, bez bilo kakvih garancija. Ne snosimo odgovornost za eventualne tehničke probleme, prekide rada, gubitak podataka, niti za sadržaj komunikacije između igrača tokom igre.</p>
    <p>Ova ograničenja važe u meri u kojoj to dozvoljava važeći zakon.</p>

    <h3>8. Privatnost</h3>
    <p>Korišćenje aplikacije podleže i našoj <a href="#/privacy">Politici privatnosti</a>. Kratak rezime: ne prikupljamo lične podatke, sva podešavanja se čuvaju lokalno u tvom browseru.</p>

    <h3>9. Promene uslova</h3>
    <p>Zadržavamo pravo da izmenimo ove uslove u bilo kom trenutku. Promene stupaju na snagu danom objavljivanja. Nastavak korišćenja aplikacije nakon izmena znači prihvatanje izmenjenih uslova.</p>

    <h3>10. Prekid pristupa</h3>
    <p>Ti možeš prestati da koristiš aplikaciju u bilo kom trenutku — jednostavno ne otvaraj sajt. Brisanje browser podataka ukloniće sva tvoja lokalna podešavanja.</p>

    <h3>11. Primenjivo pravo i nadležnost</h3>
    <p>Za bilo kakve sporove povodom ovih uslova, primenjivo je pravo Republike Srbije. Sporovi će se rešavati pred nadležnim sudom u Beogradu.</p>

    <h3>12. Razdvojivost</h3>
    <p>Ako se utvrdi da je bilo koja odredba ovih uslova nevažeća ili neprimenljiva, ostatak uslova ostaje na snazi.</p>

    <div class="content-cta">
      <a href="#/" class="btn btn-secondary">← Idi na početnu</a>
    </div>
  ` }

};
