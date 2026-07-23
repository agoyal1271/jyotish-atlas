# Jyotish Atlas

**A living, interactive primer to Parashara's grammar of Vedic astrology.**

Open `index.html` in any modern browser — no server or install required. Chart calculation and saved charts work offline; birthplace search needs an internet connection.

---

## What it does

| Section | Description |
|---|---|
| **The idea** | Why Vedic astrology is a grammar (9 Grahas × 12 Rashis × 12 Bhavas), not a list to memorize |
| **9 Grahas** | Click any planet — nature, karakatvas, dignity, body, weekday |
| **12 Rashis** | Element, modality, ruler and body for each sign |
| **12 Bhavas** | House significations and classical categories (Kendra, Trikona, Dusthana…) |
| **Synthesizer** | Place a planet (D-1 sign + degree + house) → get the full layered reading including **D-9 Navamsa** (promise vs delivery), dignity, Nakshatra and Drishti. Switch to **Empty house** mode to read a house through its lord |
| **My Charts** | Create a Kundali from birth details, or upload a `.txt` / text-based `.pdf` chart (JHora / Parashara's Light format). Explore D-1 and divisional charts in Bhava Mandala, then save a detailed seven-page Kundali report |
| **BAV** | **Bhinna Ashtakavarga** for all 7 planets + Sarvashtakavarga, computed from the natal positions. Colour-coded by strength (5+ green → 1 red), natal house outlined, best/worst transit houses surfaced |
| **Practice** | Endless quiz drawn from the data — exaltations, lordships, karakas, house meanings |

---

## Creating or adding your chart

1. Click **Create my Kundali** on the welcome screen, or scroll to **My Charts**
2. Enter name, birth date, exact time and birthplace; or click **＋ Add chart** to import a `.txt` / `.pdf`
3. For a created chart, select the birthplace result so coordinates and its IANA timezone are filled automatically
4. The app calculates a Lahiri sidereal, whole-sign chart and saves it in your browser (localStorage)
5. Use **Bhava Mandala** to view D-1, D-2, D-9, D-10 and other divisions
6. Use **Open full PDF report** for a seven-page report with D-1/D-9 charts, planetary positions, Panchanga essentials, Chara Karakas, Ashtakavarga, varga matrix, Vimshottari Dasha and divisional chart pages; **Download D-1 SVG** saves a standalone chart

Compatible with JHora and Parashara's Light `.txt` exports and text-based PDFs. Image-only/scanned PDFs must be processed with OCR first.

---

## Technical notes

- **Static and local** — open `index.html` directly; personal birth data and calculated charts stay in the browser
- **PDF support** — bundled PDF.js extracts text locally from PDFs (`pdf.min.js` + `pdf.worker.min.js`)
- **Built-in Kundali generation** — bundled Astronomy Engine calculates accurate tropical planetary positions, which the app converts to Lahiri sidereal positions; `tz-lookup` resolves an IANA timezone from birthplace coordinates
- **Place privacy** — place search uses OpenStreetMap Nominatim. Only the search words are transmitted; the name, birth date/time and calculated chart remain in the browser
- **Chart settings** — Lahiri ayanāṃśa, sidereal zodiac, whole-sign houses and mean lunar nodes
- **Built-in regression guard** — open `index.html#selftest` to run 29 checks covering Navamsa, chart generation, timezone conversion, Kundali/report rendering and core data invariants. It stays inert during normal use.
- **Navamsa (D-9)** computed from each planet's degree using the classical `NAV_START = [Aries, Capricorn, Libra, Cancer]` rule; validated against four real natal charts (0 errors)
- **BAV tables** validated sign-by-sign against four natal charts (23/23 rows exact). Two commonly-printed table errors (Moon and Venus) were corrected via a four-chart constraint solver
- **Nakshatra** computed as `floor(lon / 13°20')` with pada as `floor(remainder / 3°20') + 1`; validated 11/11 against chart files
- **Bundled dependencies** — Astronomy Engine, `tz-lookup` and PDF.js are shipped locally; see `THIRD_PARTY_NOTICES.md`

---

## Accuracy caveats

- Dignity uses **natural (naisargika) friendships** only; compound (tatkalika) friendships require a full chart and are not included
- BAV does **not** include Rahu/Ketu contributions (classical BPHS excludes them from the seven-planet BAV)
- The app is a teaching tool, not a replacement for a full Jyotish software

---

## Roadmap (not yet built)

- [ ] Shad Bala / Shadbala strength meter
- [ ] Yoga recognizer (Pancha Mahapurusha, Raja, Dhana)
- [x] Vimsottari dasha clock
- [x] Downloadable North Indian D-1 chart
- [ ] Combine with the **Yearly Astrological Days** transit calendar

---

## License

MIT — free to use, share and adapt. Attribution appreciated.
