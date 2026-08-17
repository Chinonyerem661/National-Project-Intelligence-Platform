# Infrastructure Delivery Platform

Ministry of Transportation portfolio oversight prototype. Next.js 15 (App Router), TypeScript, Tailwind v4.

```bash
npm install
npm run dev
```

Open http://localhost:3000

---

## Photography

This is the only part that needs your attention before a demo.

Every image resolves in three tiers, automatically:

1. **`public/evidence/<name>.jpg`** — your own photographs
2. **A keyword photo CDN** — real Creative Commons photos, no API key, deterministic per card
3. **A designed plate** naming the shot that belongs there

So it looks right out of the box, and looks *convincing* once you drop real files in. No code changes either way — just add files with these exact names.

For a ministry pitch, tier 1 is worth the hour. Photographs of actual Nigerian projects will land far harder than generic stock, and you likely have access to them through the contractor.

### Shot list — `public/evidence/`

| File | Shot |
|---|---|
| `survey.jpg` | Surveyor with total station on a corridor, figure in hi-vis |
| `earthworks.jpg` | Excavator cutting a road formation, red laterite spoil, low angle |
| `subgrade.jpg` | Graded earth formation running to the horizon, tyre tracks |
| `basecourse.jpg` | Vibratory roller compacting crushed stone base, oblique angle |
| `paving.jpg` | Asphalt paver laying binder course, steam rising, crew alongside |
| `wearing.jpg` | Finished carriageway curving away under raking light |
| `marking.jpg` | Fresh white centre-line on new asphalt, close perspective |
| `drainage.jpg` | Reinforced concrete box culvert under construction, formwork visible |
| `rebar.jpg` | Dense reinforcement cage before pour, shot down the length of the mat |
| `pier.jpg` | Bridge pier columns from below, upward angle against sky |
| `deck.jpg` | Bridge deck under construction, girders receding in perspective |
| `ballast.jpg` | Railway ballast bed and sleepers before rail laying |
| `track.jpg` | Track converging to a vanishing point, camera low |
| `signage.jpg` | Newly erected gantry or directional sign, upward angle |
| `delivery.jpg` | Stacked cement bags, culvert rings or steel on a laydown area |
| `defect.jpg` | Cracked or potholed carriageway, close low angle, cone nearby |

**Art direction.** Landscape, minimum 1600px wide, 3:2 or 16:9. Shoot or select *low or oblique* — angled shots read as documentary evidence, straight-on reads as stock. Overcast or raking late-light beats midday sun. A human figure in hi-vis gives scale and makes it feel like a record rather than a brochure.

To repoint at your own bucket instead, edit the single `remoteUrl()` function in `lib/images.ts`.

---

## Structure

```
app/
  page.tsx              Overview — measures, field photography, regional delivery
  projects/             Contract index and detail
  evidence/             Verification review queue
  budget/               Disbursement ledger
  admin/                Capture policy, devices, storage, users, audit
components/
  shell/                Sidebar, topbar
  ui/primitives.tsx     Cards, pills, meters, data rows
  evidence/             Image resolution, photo card, inspector, review queue
  admin/PolicyPanel     Capture rules
lib/
  types.ts              Domain model
  data.ts               Seed portfolio and evidence
  images.ts             Photography manifest
  format.ts             Currency, coordinates, dates
```

All data is in-memory in `lib/data.ts`. There is no backend and none is needed for the pitch — swap the imports for `fetch` calls when there is one.

---

## Design notes

**Typography.** Archivo for headings — a grotesque with signage lineage, which is the subject's own typographic world. Public Sans for body, the US federal design-system face: institutional and quiet, and deliberately not the Inter every dashboard defaults to. IBM Plex Mono for anything measured — coordinates, chainage, contract references, timestamps. All numerals are tabular so figures never shift width as they change.

**Colour.** Near-black carries a faint green cast so darks feel related to the accent rather than generic slate. The primary is the Nigerian federal green, deepened for screen legibility — grounded in the client's own identity rather than picked for taste. Status colours come from site materials: laterite, ochre dust, oxidised steel.

**The survey strip.** Uppercase mono at 10px with wide tracking, over a hairline rule. Used wherever the interface reports a measured fact. It is the device that makes the product read as an engineering instrument rather than a generic SaaS dashboard.

---

## Demo path

1. **Overview** — the variance column is the thesis: money released against work evidenced.
2. **Evidence** — 5 images failed verification. Open the Kano duplicate: perceptual hash matches evidence already accepted on a different contract. That is the fraud a ministry actually fears.
3. **Inspect** — five named checks with pass/fail, plus coordinates, device, uploader, capture time.
4. **Accept or reject** — the item leaves the queue, the counter drops, the decision is recorded.
5. **Admin** — tighten the geofence radius, show 22 images held in offline queues across three devices.
