# Projects Page Strategic Redesign

Reorganize `/projects` from a flat list of equal cards into a story with three weighted tiers. Live, shipped websites become the hero. No raw URLs anywhere — only "Visit Website" buttons. Technical systems get a connected case-study treatment showing how the OCR pipeline powers the Instagram tool.

## Narrative & Hierarchy

```text
SELECTED WORK
─────────────────────────────────────────
01  LIVE WEBSITES            ← largest, full-width feature cards
       SkyIndia · ThinkXYZ · Mew Layer Labs · Philono

02  PROTOTYPES & CONCEPTS    ← compact, lower-emphasis cards
       School Website · SunVerge · Mentra

03  AI, AUTOMATION & COMPUTER VISION   ← technical case-study cards
       Instagram Analytics ──built from──► OCR Pipeline (Core Tech)
                          └─related website─► Philono
       Custom YOLO Detection      (independent)
       Internal Business Automation Tools (independent)
       SkyIndia CRM App · Role-Based Dashboard · Web→APK (folded in here)
```

## Data Model Changes (`src/data/projects.ts`)

Extend the `Project` interface with optional fields and a `tier`:
- `tier: "live" | "prototype" | "system"` — drives which section renders the card.
- `liveUrl?: string` — external link for the "Visit Website" button (never shown as text).
- `status?: string` — short label e.g. "Live Production Website", "Concept Website", "Core Technology".
- `relatedSlugs?: string[]` — for the OCR ↔ Instagram ↔ Philono relationships.
- `usedBy?: string` / `builtFrom?: string[]` — relationship copy for system cards.

Add new entries (live + prototype) with concise challenge/solution/results so their detail pages work:
- `skyindia-website` → tier live, url `https://skyindiamattress.in/`
- `thinkxyz` (Think XYZ Prints) → live, `https://thinkxyz.in/`
- `mewlayer-labs` → live, `https://mewlayerlabs.netlify.app/`
- `philono` → live, `https://philono.netlify.app/` (also referenced by the Instagram tool)
- `school-website` → prototype, `https://schoolwebsitev10.netlify.app/`
- `sunverge` → prototype, `https://sunverge.netlify.app/`
- `mentra` → prototype, `https://mentra-professional-lv26.bolt.host`

Update existing entries: tag `instagram-analytics`, `ocr-pipeline`, `yolo-detection`, `business-automation`, `skyindia-crm`, `role-based-dashboard`, `web-to-apk` as tier `system`. Add relationship metadata: OCR pipeline `usedBy: instagram-analytics` + `status: "Core Technology"`; Instagram `builtFrom: [ocr-pipeline, ...]` + `relatedSlugs: [philono]`.

## Imagery

- **Live + prototype cards:** capture real screenshots from each live site (via the website-fetch/screenshot tool) and save to `src/assets/`. These replace generic renders for shipped work.
- **Technical systems:** generate clean schematic graphics (workflow diagram, OCR input→structured-output, detection overlay, automation flow) to replace the purple monitor renders. Style: minimal, monochrome to match the black/white design system — not marketing art.

## Page Rebuild (`src/pages/Projects.tsx`)

Replace the single uniform grid with three distinct section components, each with its own visual weight:

1. **LiveWebsiteCard** — full-width (or large 2-up) feature cards: big screenshot, title, `status` chip, short capability blurb, and a prominent **Visit Website →** button (`<a target="_blank" rel="noopener noreferrer">`). Card body still links to the detail page; the button stops propagation and opens the external site. Hover reveals the CTA.
2. **PrototypeCard** — compact 3-up grid, smaller imagery, muted styling, label like "Client Concept" / "Concept Website" / "Personal Product Exploration". Visit Website button present but understated.
3. **SystemCard** — case-study style card (no fake marketing photo; uses generated diagram). Shows relationship rows: "Built from →", "Core Technology · Used by →", "Related Website →" rendered as small linked pills to the related project/site. YOLO, Automation, CRM, Dashboard, Web→APK render as standalone system cards without relationship rows.

Keep the existing `← BACK` link, `Navigation`, scroll animations, and the section header pattern. Vary card size/ratio/emphasis between tiers so the page no longer reads as one repeated template.

## Detail Pages (`src/pages/ProjectDetail.tsx`)

Add a **Visit Website** button in the hero for any project with `liveUrl`. Add a "Related Projects" block when `relatedSlugs`/`usedBy`/`builtFrom` exist, linking between the OCR pipeline, Instagram tool, and Philono. Existing prev/next nav stays.

## Out of Scope

- Homepage `ProjectsPreview` stays unchanged (per your choice).
- No backend; everything is static data + assets.

## Technical Notes

- Card-in-card linking: outer `<Link>` to detail page, inner external `<a>` for Visit Website with `onClick={e => e.stopPropagation()}` to avoid route navigation when the button is clicked.
- Screenshots captured at build time and committed as image assets; imported normally in `projects.ts`.
- Generated diagrams created with the image tool, saved under `src/assets/`, monochrome to fit tokens.
