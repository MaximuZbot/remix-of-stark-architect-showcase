# Contact Section Robot Upgrade

Upgrade the home-page contact section (`src/components/Contact.tsx`) so a small CRT-screen robot from the same world as the hero sits in the lower-left, watching the cursor. Rebalance the layout around it. No redesign of typography, colors, or aesthetic — only the robot integration and layout rebalance.

## 1. Add the robot asset

- Register the uploaded robot head (`user-uploads://newhead.png`) as an app asset under `src/assets/` (e.g. `robot-head.png`) so it can be imported. The uploaded PNG is used exactly as-is — no regeneration, recolor, or restyle.

## 2. New `RobotEyes` component

Create `src/components/RobotEyes.tsx` — a self-contained React + canvas port of the provided eye-system code:

- Container `div` with the robot head `<img>` plus an overlaid `<canvas>` positioned over the black CRT screen (top ~31.5%, left ~20.5%, width ~59%, height ~44.5%, `mix-blend-mode: screen`).
- Canvas logic ported into a `useEffect` (with proper cleanup of listeners and `requestAnimationFrame`):
  - LED pixel-matrix rendering, glowing cyan (`#26ffff` / shadow `#00f3ff`) on a faint dark grid.
  - Spring-physics pupil tracking that follows the global cursor, mapped into canvas space.
  - Head-drift: whole eye system bouncily sways a few px toward the cursor.
  - Random blinking every ~3–8s with occasional double blink, plus the squish animation.
  - DPR-aware sizing and a resize handler.
- Add subtle **idle breathing** (tiny vertical float + sway) via a CSS animation on the container so it never feels static.
- Sizing via a `className`/prop so it can scale down on mobile.

## 3. Rework `Contact.tsx` layout

Left column changes:
- **Remove** the entire `CONNECT` / LinkedIn card.
- **Merge** the LinkedIn link into the `AVAILABILITY` card so it reads:
  - `AVAILABILITY`
  - `Available for freelance, startups, and full-time roles`
  - LinkedIn link (same icon + URL, styled to match the card).
- Place the `RobotEyes` component in the freed bottom-left region — aligned with the info cards, slightly floating above the bottom edge, becoming the visual focal point of that area (not the hero, which is untouched).

Right column changes:
- Reduce the "Send a Message" glass card's visual weight ~15% (e.g. constrain its max-width and/or reduce padding/scale), keeping all fields, functionality, and styling intact.

## 4. Mobile behavior

- Robot stays visible, scaled down (smaller fixed size at `sm`/below), keeps blinking and eye tracking.
- Ensure it never overlaps the form or pushes content off-screen — stacking/layout cleanliness prioritized over robot size.

## Technical notes

- Mouse tracking uses `window` mousemove mapped through `canvas.getBoundingClientRect()` so tracking works regardless of scroll position.
- All animation/timer/listener resources are cleaned up on unmount to avoid leaks.
- Cyan glow, worn-metal CRT look, and cyberpunk mood come entirely from the uploaded asset + cyan LEDs — no new colors introduced into the design system.

## Out of scope

- Hero section, navigation, other pages, typography, and color tokens remain unchanged.
- No backend; the contact form's existing submit behavior is preserved.
