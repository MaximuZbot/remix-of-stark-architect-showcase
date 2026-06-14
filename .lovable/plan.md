# Logo Marquee + Contact Mobile Refinements

Scoped polish to `TechStack.tsx` and `Contact.tsx` (plus a sharper robot image). No backend, routing, or other sections touched.

## 1. "Tools of the Trade" — fonts (`src/components/TechStack.tsx`)

**Section heading**
- Revert `TOOLS OF THE TRADE` from the bold Syne display style (`font-display font-extrabold uppercase tracking-tighter`) back to the template's standard section-heading style used by every other section: `text-4xl md:text-6xl font-light`. This makes it consistent with "Selected Work", "Capabilities", "About", etc.

**Wordmark logos (YOLO, Fusion 360, and other text-only entries)**
- These currently render in the heavy Syne display font, which looks off next to the real SVG marks. Switch them to a clean, normal wordmark: `font-sans` (Plus Jakarta Sans), medium/semibold weight, tighter sizing so they sit at the same visual scale as the icon logos — white, same hover glow behavior as the icons.

## 2. Logo marquee — mobile sizing (`src/components/TechStack.tsx`)

- Make the logos a bit smaller on mobile only. Icons drop from `h-9 w-9` to roughly `h-7 w-7` on small screens (keep `h-9 w-9` from `md:` up), and wordmark text scales down to match. Spacing between items tightens slightly on mobile so the row still reads as a marquee.
- No change to desktop sizing.

## 3. Contact section — mobile layout (`src/components/Contact.tsx`)

Current mobile order (stacked): heading → LOCATION/AVAILABILITY → robot, then the full message form → paragraph.

Changes (mobile only; desktop layout untouched):
- Keep the paragraph box ("I approach each project…").
- Place a compact "send a message" box **next to the robot** on mobile: the robot and a small message card sit side-by-side in a row, so the robot has a clear purpose and the section block reads cleanly instead of feeling empty/crumbled. The small box is a condensed prompt/CTA card (e.g. "Got a project? Send a message") that links to the full form, keeping mobile tidy while the full form stays available below.
- Tighten spacing/margins in this block so it's properly aligned on a 390px screen.

```text
 MOBILE (contact)
 ┌─────────────────────────┐
 │ GET IN TOUCH            │
 │ Let's Build Something…  │
 │ [LOCATION]              │
 │ [AVAILABILITY]          │
 │ ┌────────┐ ┌──────────┐ │
 │ │ robot  │ │ send a   │ │
 │ │ (eyes) │ │ message →│ │
 │ └────────┘ └──────────┘ │
 │ [ full message form ]   │
 │ [ paragraph box ]       │
 └─────────────────────────┘
```

## 4. Sharper robot image

- The robot uses `robot-head.png` with a canvas that draws the glowing dot-matrix eyes at fixed percentage offsets, so the eye sockets must stay in the exact same position. Rather than generate a brand-new robot (which would move the eyes and break alignment), enhance the existing image to higher resolution / sharper detail while preserving the same composition and framing, then upload it as a new CDN asset and point `RobotEyes` at it. Verify the canvas eyes still line up after the swap.

## Technical notes

- `font-display` = Syne, `font-sans` = Plus Jakarta Sans (from `tailwind.config.ts`).
- Robot eye-canvas offsets live in `index.css` (`.robot-eyes-canvas`: top 31.5%, left 20.5%, width 59%, height 44.5%) — keep the enhanced image's framing identical so these stay valid.
- Verify both mobile (390px) and desktop after changes.

## Out of scope

- Navigation, hero, other sections, color tokens, and marquee animation logic stay unchanged.
