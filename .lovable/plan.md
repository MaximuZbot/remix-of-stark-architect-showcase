# Hero Section — 3D Parallax Brutalist Redesign

Rebuild the home-page hero (`src/components/Hero.tsx`) into a full-screen, three-layer parallax scene: alleyway background, massive left-aligned "MOHITH KANNA" headline, and the robot/cat cutout pinned bottom-right so the robots overlap the text. Uses **Syne** for the display headline and **Plus Jakarta Sans** for body text. This is a scoped, user-requested override of the usual "preserve template" rule, and only affects the hero.

## 1. Assets

- Register the two uploaded images as CDN assets (no embedding of binaries in the repo):
  - `hero-alley.jpg` — alleyway background (wall, graffiti, bike, neon tube; no robots).
  - `hero-robots.png` — transparent cutout of the two robots + cat.
- Import both via their `.asset.json` pointers in `Hero.tsx`.

## 2. Fonts

- Load **Syne** (700/800) and **Plus Jakarta Sans** (400/500) via Google Fonts `<link>` in `index.html`.
- Add `font-display` (Syne) and extend `font-sans` (Plus Jakarta Sans) in `tailwind.config.ts` so the rest of the template's typography is untouched except where explicitly used in the hero.

## 3. Three-layer Z-index stack

Full-screen container: `w-full h-screen min-h-[600px] relative overflow-hidden bg-black`.

```text
 z-30  ┌───────────────────────────────────────────┐
       │  LAYER 3 — robots cutout (bottom-right)     │
 z-20  │  LAYER 2 — headline + subtitle (left)       │
 z-10  │  LAYER 1 — alley bg + gradient mask + glow  │
       └───────────────────────────────────────────┘
```

- **Layer 1 (background):** alley image `absolute inset-0 w-full h-full object-cover`, with an overlay `bg-gradient-to-r from-black/80 via-black/40 to-transparent` for left-side legibility.
- **Layer 2 (text):** left-aligned content box (~55% width, vertically centered), z-index above background, below robots — so the right edge of the headline tucks behind the standing robot.
- **Layer 3 (robots):** cutout `absolute bottom-0 right-0 h-full w-auto object-contain`, aligned to sit naturally in the scene.

## 4. Typography & content (left-aligned)

- Remove the three centered CTA buttons (View Projects / Work With Me / LinkedIn) from the hero fold.
- **Headline:** "MOHITH KANNA" in Syne, ultra-bold uppercase, `text-[clamp(3rem,8vw,6rem)] tracking-tighter leading-[0.95]`, solid white.
- **Subtitle/description block** directly beneath:
  - Line 1: "AI-Powered Solo Builder | Computer Vision (YOLO) | Automation & App Developer"
  - Paragraph: "I build AI-powered software, computer vision systems, and automation tools that replace manual workflows and ship fast."
  - Styling: `text-zinc-300 text-lg md:text-xl max-w-xl mt-4 leading-relaxed`.

## 5. Neon glow & parallax polish

- **Neon glow:** absolute element positioned over the overhead light tube (`bg-amber-400/20 blur-xl rounded-full`, plus a softer wider halo) to make the lighting feel vibrant and cast warmth onto the scene.
- **Mouse-move parallax (CSS transforms, no new dependency):** track cursor via a `mousemove` listener and `requestAnimationFrame`; apply transforms by layer depth:
  - Background wall: largest shift (~12px).
  - Headline/text: medium shift (~6px).
  - Robots: minimal/near-fixed shift (~2px) to sell depth.
  - Respects `prefers-reduced-motion` (disables the effect).

## 6. Responsive behavior

- Desktop: full three-layer composition as above.
- Mobile: headline scales down via the `clamp()`, robots shrink/anchor bottom-right without covering the headline, gradient mask strengthened so text stays legible. Keeps the existing scroll-driven fade-out behavior already in the component.

## Out of scope

- No changes to navigation, other sections, other pages, color tokens, or the contact robot widget. Only `Hero.tsx`, `index.html` (font link), and `tailwind.config.ts` (font registration) are touched, plus the two new asset pointers.