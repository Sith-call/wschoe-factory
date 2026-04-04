# Design Review Report -- Dad Joke Machine (Iteration 3)

**Date:** 2026-04-02
**URL:** http://localhost:5190
**Viewport:** 375x812 (mobile)
**Design System:** apps/dad-joke-machine/docs/design-system.md
**Reviewer:** Design Visionary (gstack /design-review)

---

## First Impression

The site communicates **playful retro warmth**. The Black Han Sans title "아재개그 자판기" immediately sets the tone. The tangerine orange button with box-shadow depth effect is the clear focal point, and the overall layout is minimal and purposeful.

I notice the cream background gives the intended "worn plastic vending machine panel" feel. The vertical centering of the idle state works for this single-action UI.

The first 3 things my eye goes to are: **the title**, **the orange button**, **the counter at the bottom**.

If I had to describe this in one word: **Charming**.

---

## Design Score: B+
## AI Slop Score: A

---

## Findings

### FINDING-001 [HIGH] -- Color palette deviated from design system (warm -> cool)

**Category:** Color & Contrast
**Status:** FIXED

7 CSS variables were using cool gray values instead of the warm cream/beige palette specified in design-system.md. This killed the retro vending machine aesthetic, the app's core identity.

| Variable | Was (cool gray) | Should be (warm) |
|----------|-----------------|-------------------|
| `--background` | `#FAFAFA` | `#FBF7F0` |
| `--primary-light` | `#FFF5EE` | `#FFF0E6` |
| `--text-primary` | `#1A1A1A` | `#2D2418` |
| `--text-secondary` | `#6B6B6B` | `#7A6F60` |
| `--text-tertiary` | `#A0A0A0` | `#AEA494` |
| `--border` | `#E8E8E8` | `#E5DDD2` |
| Desktop body bg | `#F0F0F0` | `#E5DDD2` |

**Fix:** Updated all 7 values in `src/style.css` `:root` and `@media (min-width: 431px)` blocks to match design-system.md.

**File:** `apps/dad-joke-machine/src/style.css` (lines 5-15, 54)

---

### FINDING-002 [MEDIUM] -- Touch targets below 44px minimum

**Category:** Interaction States / Accessibility
**Status:** FIXED

Multiple interactive elements were below the 44x44px minimum touch target per DESIGN_RULES.md R21:

| Element | Was | Fixed to |
|---------|-----|----------|
| `.fav-icon-btn` (star icon, header) | 40x40 (padding 8px) | 44x44 (padding 10px) |
| `.back-btn` (arrow, favorites header) | 36x36 (padding 8px) | 44x44 (padding 12px) |
| `.joke-action-btn` (copy/save) | ~36px height | min-height 44px |
| `.fav-action-btn` (copy in fav list) | min-height 36px | min-height 44px |

**File:** `apps/dad-joke-machine/src/style.css`

---

### FINDING-003 [MEDIUM] -- No prefers-reduced-motion support

**Category:** Motion & Animation
**Status:** FIXED

The app has 5 animations (joke-pop, punchline-reveal, heart-bounce, reaction-pop, confetti-fall) and multiple transitions, but no `prefers-reduced-motion` media query. Users with motion sensitivity would have no way to disable these.

**Fix:** Added `@media (prefers-reduced-motion: reduce)` block that:
- Disables all keyframe animations
- Sets animated elements to their final state (opacity 1, transform none)
- Removes transitions from interactive elements

**File:** `apps/dad-joke-machine/src/style.css`

---

### FINDING-004 [MEDIUM] -- No focus-visible styles

**Category:** Interaction States / Accessibility
**Status:** FIXED

No `:focus-visible` outlines were defined for any interactive element. Keyboard users would have no visual indication of focus position.

**Fix:** Added `:focus-visible` styles for:
- Primary/secondary/skip buttons: 3px solid primary outline
- Icon buttons (fav, back): 2px solid primary outline
- Action buttons (copy, save, delete): 2px solid secondary outline

**File:** `apps/dad-joke-machine/src/style.css`

---

### FINDING-005 [POLISH] -- Joke card uses colored left border (AI slop pattern #8)

**Category:** AI Slop Detection
**Status:** DEFERRED

The joke card uses `border-left: 4px solid var(--primary)`, which is item #8 on the AI slop blacklist. However, this is explicitly specified in the design system as an intentional design choice for the joke card component. The asymmetric border-radius (0 12px 12px 0) plus the left accent bar creates a deliberate visual identity, not a generic card decoration.

**Verdict:** This is an intentional design decision documented in design-system.md, not accidental AI slop. No change needed.

---

### FINDING-006 [POLISH] -- Counter text could be warmer

**Category:** Typography
**Status:** NOT FIXED (low priority)

The counter "오늘 0개 봄" uses `--text-tertiary` which is correct per design system. The Sora font with tabular-nums is properly applied. No issue.

---

## DESIGN_RULES.md Checklist

```
[x] R1  -- Unique color palette (tangerine orange + cream + forest green)
[x] R2  -- No gradient text
[x] R3  -- No 135deg gradient
[x] R4  -- No fadeInUp. Uses scale-based pop + left slide + instant display
[x] R5  -- Single-screen app, no bottom tab bar
[x] R6  -- No backdrop-blur
[x] R7  -- No decorative particles (confetti only on 50-clear, functional)
[x] R8  -- Unique font combo: Nanum Gothic + Sora + Black Han Sans
[x] R9  -- Light mode only, cream background is core identity
[x] R10 -- Mixed border-radius: 8px (buttons), 0+12px (card), 0 (list), pill (icons), 4px (badge)
[x] R11 -- Phosphor Icons throughout
[x] R12 -- Proper weight hierarchy: title=Black Han Sans, H2=700, body=400
[x] R13 -- No emoji as icons
[x] R14 -- Left-aligned content, center only for idle button + 50-clear screen
[x] R15 -- No card nesting
[x] R16 -- 3-tier button hierarchy: Primary (solid orange), Secondary (outline green), Tertiary (text)
[x] R17 -- No spinner+text rotation. Uses dot animation for loading
[x] R18 -- Interaction feedback present (toast for save/copy/delete, heart bounce)
[x] R19 -- Inline actions don't cause page navigation
[x] R20 -- Secondary button uses design system secondary color (#2B5F3A)
[x] R21 -- Touch targets now 44px minimum (FIXED)
```

---

## Category Grades

| Category | Grade | Notes |
|----------|-------|-------|
| Visual Hierarchy | A | Clear focal point, minimal noise, good squint test |
| Typography | A | 3 intentional fonts, proper scale, good weight contrast |
| Color & Contrast | A- | Warm palette now correct. Good semantic color use |
| Spacing & Layout | A | Consistent 4/8px scale, intentional white space |
| Interaction States | B+ | Hover/active states present. Focus-visible added |
| Responsive | B+ | Mobile-first design, proper dvh usage |
| Content Quality | A | Warm empty state with CTA, specific button labels |
| AI Slop | A | One justified pattern (#8 left border), everything else clean |
| Motion | A- | Purposeful animations, reduced-motion now supported |
| Performance | A | Fast load, no unnecessary assets, light CSS |

---

## Summary

| Metric | Value |
|--------|-------|
| Total findings | 6 |
| Fixed | 4 (FINDING-001 through FINDING-004) |
| Deferred | 1 (FINDING-005, intentional design choice) |
| Not fixed | 1 (FINDING-006, no actual issue) |
| Design Score | B+ |
| AI Slop Score | A |

### What was fixed
1. **Color palette alignment** -- 7 CSS variables corrected from cool gray to warm cream/beige per design-system.md
2. **Touch targets** -- 4 button types enlarged to meet 44px minimum
3. **Reduced motion** -- Added `prefers-reduced-motion` media query for all animations
4. **Focus visible** -- Added `:focus-visible` outlines for keyboard accessibility

### Build verification
`npm run build` passes successfully after all fixes.
