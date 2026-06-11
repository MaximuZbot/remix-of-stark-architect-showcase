# Hero Mobile Fix + "Tools of the Trade" Logo Marquee

Two scoped changes: (1) fix the hero on mobile and the graffiti/text legibility + "floating" robots, and (2) replace the `Tech Stack` section with a cinematic monochrome logo carousel. This is a user-requested, scoped override of the usual "preserve template" rule, limited to `Hero.tsx` and `TechStack.tsx` (plus marquee keyframes).

## Part 1 — Hero fixes (`src/components/Hero.tsx`)

**Robots should be planted, not floating**
- Remove the mouse-parallax transform from the robot layer entirely so the robots stay completely stationary and look like they're standing in the scene (the background + text keep their subtle parallax).
- On mobile, anchor the robots to the bottom-right corner at a smaller size so they read as "standing on the ground" instead of hovering mid-screen.

**Graffiti vs. text legibility**
- Let the graffiti read stronger by easing off the heavy full-width darkening, and instead put a *focused* legibility scrim directly behind the text block only (a left-anchored gradient / soft vignette under the headline + description). Result: graffiti looks bolder and "more out there" on the open right side, while the text always sits on its own protected dark zone.
- Keep the amber neon glow over the light tube.

**Mobile layout (the "crumbling")**
- Restructure so the headline + description occupy the upper portion with a solid dark scrim, and the robots occupy the lower-right band — no overlap of text and robots.
- Reduce robot height on mobile (e.g. anchored bottom-right, ~55–60% width) and strengthen the bottom/left gradient so text never collides with the robots or graffiti.
- Headline keeps the fluid `clamp()` sizing; verify line breaks and spacing at 390px.

```text
 MOBILE                      DESKTOP
 ┌──────────────┐           ┌───────────────────────────┐
 │ MOHITH       │           │ MOHITH KANNA      [robot]  │
 │ KANNA        │           │ subtitle          [robot]  │
 │ subtitle     │           │ description      [robot/cat]│
 │ description  │           │                            │
 │        [robots]│         └───────────────────────────┘
 └──────────────┘
```

## Part 2 — "Tools of the Trade" marquee (`src/components/TechStack.tsx`)

Replace the wrapped-pill `Tech Stack` block with an infinite two-row logo marquee.

**Section header**
- Rename heading to `TOOLS OF THE TRADE` (keep the small `TECHNOLOGIES`-style eyebrow or update it to match), same typographic style as other sections so it stays on-brand.

**Logos — monochrome white**
- Use the `simple-icons` package for real brand SVG paths, rendered as inline SVGs with `fill: currentColor` and `text-white`.
- Default state: white at ~60% opacity, name hidden. Hover: 100% opacity + soft glow (drop-shadow) + the tool name fades in beneath the logo.
- Icons sourced from simple-icons: OpenAI, Claude, Gemini, Ollama, Python, OpenCV, Firebase, Supabase, React, Next.js, Docker, GitHub, Razorpay, Stripe, Vercel, Figma, Blender, n8n, Make.
- A few have no simple-icon (YOLO, Fusion 360, Roboflow, OpenRouter): render these as clean uppercase white wordmarks styled to match, so the row stays consistent. (Capabilities like OCR, AI Agents, Automation Scripts, Internal Tools are intentionally NOT included — they're not technologies.)

**Carousel structure**
- Row 1 scrolls continuously left: OpenAI · Claude · Gemini · Ollama · Python · YOLO · OpenCV · Firebase · Supabase
- Row 2 scrolls continuously right: React · Next.js · Docker · GitHub · Razorpay · Stripe · Vercel · Fusion 360
- Each row's items are duplicated once for a seamless infinite loop; edges fade out with a left/right mask gradient.
- Marquee runs on pure CSS transforms (`@keyframes marquee-left` / `marquee-right`), pauses on hover, and respects `prefers-reduced-motion`.

## Technical notes

- Add `simple-icons` as a dependency; import only the specific icons needed (tree-shakeable) and read each icon's `.path` for the SVG.
- Add the two marquee keyframes + utility classes (in `index.css` or `tailwind.config.ts`).
- No backend, routing, or other sections touched.

## Out of scope

- Navigation, other sections/pages, color tokens, and the contact robot widget remain unchanged.