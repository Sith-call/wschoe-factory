# Iteration 2 Design Consistency Review -- Dream Factory

**Reviewer**: Senior UI/UX Designer
**Date**: 2026-03-20
**Scope**: 8 screens (Stitch HTML sources + React implementation)
**Method**: Cross-referencing Stitch ground-truth HTML, rendered screenshots, and final React TSX

---

## 1. Per-Screen Design Audit

### Screen 01: IntroScreen

**Stitch HTML**:
- Font stack: `Be Vietnam Pro` + `Noto Sans KR` for body, `Noto Serif KR` for headline (line 66-67)
- borderRadius: `DEFAULT: 1rem, lg: 2rem, xl: 3rem, full: 9999px` (line 69)
- glass-card: `rgba(52, 48, 84, 0.4)`, blur `20px` (line 79-80)
- App name: "The Ethereal Archive" (line 102)
- Bottom nav: 3 tabs (기록/갤러리/통계), `rounded-t-[40px]`, `bg-indigo-950/60` (line 181)

**React TSX (IntroScreen.tsx)**:
- App name changed to "꿈 공장" (line 19) -- intentional localization, acceptable
- Bottom nav structure matches Stitch faithfully (line 114-127)
- No notable divergence from Stitch source

**Issues**: None significant. This is the best-preserved screen.

---

### Screen 02: SceneBuilderScreen

**Stitch HTML**:
- Font stack: `Noto Sans KR` only for body/label (line 66-67) -- **MISSING `Be Vietnam Pro`**
- borderRadius: `DEFAULT: 0.125rem, lg: 0.25rem, xl: 0.5rem, full: 0.75rem` (line 69) -- **COMPLETELY DIFFERENT** from Screen 01
- glass-card: `rgba(30, 27, 62, 0.6)`, blur `12px` (line 86-88) -- different opacity and blur
- secondary-container: `#2f3aa3` (line 18) vs Screen 01's `#4f319c` -- **COLOR TOKEN MISMATCH**
- tertiary-container: `#7d42b6` (line 60) vs Screen 01's `#885500` -- **COLOR TOKEN MISMATCH**
- tertiary: `#ddb8ff` (line 22) vs Screen 01's `#ffb95f` -- **MAJOR COLOR MISMATCH** (purple vs amber)
- on-secondary-container: `#a8afff` (line 62) vs Screen 01's `#bea8ff`
- No bottom nav -- replaced with fixed "다음 단계로" footer button (line 211-216)
- App name: "꿈의 조각가" (line 108) -- different from Screen 01's "The Ethereal Archive"

**React TSX (SceneBuilderScreen.tsx)**:
- Uses unified index.html config, so color tokens are consistent with Screen 01
- borderRadius uses the unified `1rem` default from index.html
- glass-card-subtle class used (line 143, 168) -- matches index.html's definition
- App name: "꿈의 조각가" (line 99) -- preserved from Stitch

**Issues**:
- `tertiary` color in Stitch (`#ddb8ff` purple) differs drastically from every other screen's `#ffb95f` (amber)
- `secondary-container` color `#2f3aa3` (blue) differs from canonical `#4f319c` (purple)
- borderRadius values (`0.125rem`) would make all corners essentially sharp -- visually incompatible with the rounded design language

---

### Screen 03: EmotionScreen

**Stitch HTML**:
- Font stack: `Be Vietnam Pro` for body/label (line 66-67) -- no `Noto Sans KR`
- borderRadius: `DEFAULT: 1rem, lg: 2rem, xl: 3rem, full: 9999px` (line 69) -- matches Screen 01
- App name: "The Ethereal Archive" (line 106) -- matches Screen 01
- active-border: `1px solid rgba(195,192,255,0.5)` + inset shadow (line 87-89)
- tertiary: `#ffb95f` (line 41) -- matches Screen 01
- secondary-container: `#4f319c` (line 32) -- matches Screen 01
- Bottom CTA: `rounded-full`, `py-5` (line 220) -- **different from Screen 02's `rounded-xl`, `h-14`**
- Header has chevron_left + close buttons (line 103-109)

**React TSX (EmotionScreen.tsx)**:
- Header title: "감정 선택" instead of "The Ethereal Archive" (line 48) -- localized
- Uses unified tokens from index.html
- Button: `rounded-full`, `py-5` (line 150) -- matches Stitch for this screen but differs from SceneBuilder's `rounded-xl h-14`

**Issues**:
- CTA button shape inconsistency: EmotionScreen uses `rounded-full` while SceneBuilder uses `rounded-xl`
- Progress label: "Journey Phase" in Stitch (line 115) but "감정 단계" in React (line 58) -- acceptable localization

---

### Screen 04: AnalysisScreen

**Stitch HTML**:
- **ENTIRELY DIFFERENT FONT STACK**: `Newsreader` for body, `Cormorant Garamond` for branding, `Manrope` for labels (line 69-73)
- **MINIMAL COLOR TOKENS** -- only 6 colors defined (line 62-68) vs 30+ in other screens
- `primary: #cebdff` (line 64) -- **DIFFERENT** from canonical `#c3c0ff`
- `secondary: #ffb95f` (line 65) -- maps to what other screens call `tertiary`
- No borderRadius extension defined at all
- No bottom nav, no top nav -- standalone loading screen
- Body class: `mystic-gradient` -- custom radial gradient background (line 85)
- Constellation SVG with star-dots using `fill: #ffb95f` (line 43-45) -- hardcoded

**React TSX (AnalysisScreen.tsx)**:
- Uses `mystic-gradient`, `crystal-ball-glow`, `swirl-1`, `swirl-2` classes from index.html (lines 35-73)
- Uses `font-headline` and `text-on-surface` from unified tokens (line 80, 86)
- Branding text uses `font-branding` (line 102) -- defined in index.html
- SVG constellation dots use hardcoded `star-dot` class (line 44-53)

**Issues**:
- The Stitch source uses completely different fonts (Newsreader, Manrope) not used anywhere else
- React implementation correctly falls back to unified font stack from index.html
- `primary: #cebdff` in Stitch source is non-canonical -- React uses `#c3c0ff` from index.html

---

### Screen 05: InterpretationScreen

**Stitch HTML**:
- Font stack: `Be Vietnam Pro` for body/label + `Cormorant Garamond` for dream-quote (line 73-76)
- borderRadius: `DEFAULT: 1rem, lg: 2rem, xl: 3rem, full: 9999px` (line 78) -- matches canonical
- Full Material Design 3 color tokens (30+) -- matches Screen 01/03
- App name: "The Ethereal Archive" (line 95) -- uses hardcoded font `Noto_Serif` inline style
- Bottom nav: 4 tabs (auto_stories/visibility/nights_stay/settings) (line 169-186) -- **COMPLETELY DIFFERENT** from Screen 01's 3 tabs (기록/갤러리/통계)
- Active nav item color: `text-[#ffb95f]` amber (line 175) vs Screen 01's `text-indigo-100`
- Nav tab icons all different from other screens
- Card gradient: `from-[#7C3AED] via-[#4f46e5] to-[#3B82F6]` (line 106) -- unique to this screen
- CTA buttons: `rounded-full` (line 155, 159) -- matches Screen 03, differs from Screen 02

**React TSX (InterpretationScreen.tsx)**:
- Bottom nav normalized to 3 tabs (기록/갤러리/통계) matching IntroScreen (line 161-174)
- Card uses DreamIconComposition instead of static gradient (line 53-59)
- Background uses inline style gradient instead of Stitch's class-based approach (line 48-49)
- App title: "꿈 해석" (line 33) -- localized from "The Ethereal Archive"

**Issues**:
- Stitch had 4-tab bottom nav with completely different icons -- was correctly normalized in React
- Header has `menu` hamburger icon (line 31) -- only screen with this; others use `auto_awesome` or `chevron_left`

---

### Screen 06: ShareScreen

**Stitch HTML**:
- Font stack: `Be Vietnam Pro` + `Noto Sans KR` for body (line 66) -- matches Screen 01
- borderRadius: `DEFAULT: 1rem, lg: 2rem, xl: 3rem, full: 9999px` (line 69) -- matches canonical
- Full color tokens, all matching canonical palette
- Header: `arrow_back` + "Share Dream" text (line 94-98) -- **English title**, inconsistent language
- dream-card-gradient: `linear-gradient(135deg, #4f46e5, #1a1739)` (line 79-80)
- star-field: uses white dots (`#ffffff`) instead of indigo dots (line 82-84) -- different from Screen 01
- No bottom nav at all (line 158-159 comment explains suppression)
- Body bg: `bg-surface-container-lowest` (line 92) -- `#0d082c`, darker than other screens' `#120e31`

**React TSX (ShareScreen.tsx)**:
- Header title: "꿈 공유하기" (line 30) -- localized from "Share Dream"
- Uses `bg-surface-container-lowest` (line 24) -- matches Stitch, but differs from other screens
- Uses DreamIconComposition for visual hero (line 47-53)
- No bottom nav -- matches Stitch
- star-field-share class from index.html used (line 59)

**Issues**:
- Background color (`#0d082c`) darker than all other screens (`#120e31`) -- visual jump when navigating
- No bottom nav -- user has no way to navigate except back button; inconsistent with other screens

---

### Screen 07: GalleryScreen

**Stitch HTML**:
- Font stack: `Be Vietnam Pro` for body/label (line 67-68) -- no serif fallback
- borderRadius: `DEFAULT: 0.25rem, lg: 0.5rem, xl: 0.75rem, 2xl: 1rem, 3xl: 1.5rem, full: 9999px` (line 69) -- **DIFFERENT AGAIN** from canonical
- secondary: `#ffb0cd` (pink) (line 32) -- **COMPLETELY DIFFERENT** from canonical `#cebdff` (purple)
- secondary-container: `#aa0266` (line 44) -- **COMPLETELY DIFFERENT** from canonical `#4f319c`
- on-secondary: `#640039` (line 61) -- magenta, not purple
- Body bg hardcoded: `#0F0B2E` (line 75) -- **DIFFERENT** from canonical `#120e31` and from `#0d082c`
- material-symbols-outlined wght: `400` (line 76) vs canonical `300` -- icon weight mismatch
- App name: "Celestial Dream Archive" (line 100) -- yet another app name variant
- Bottom nav: 4 tabs (Journal/Patterns/Stats/Settings) in English (line 181-198) -- **DIFFERENT from Screen 01's Korean 3-tab nav**
- glass-panel: `rgba(30, 27, 62, 0.6)` blur `20px` (line 78) -- different from Screen 01's glass-card
- Masonry cards: `rounded-3xl` (line 121) -- 1.5rem, but with this screen's borderRadius override, `3xl` = `1.5rem` not `9999px`
- FAB button: gradient-joy colored (line 177) -- pink/amber, unique to this screen

**React TSX (GalleryScreen.tsx)**:
- App title: "꿈 갤러리" (line 51) -- localized
- Uses unified tokens from index.html -- all color mismatches from Stitch are resolved
- Bottom nav: Normalized to 3 Korean tabs (기록/갤러리/통계) matching other screens (line 127-140)
- glass-panel class used from index.html (line 99)
- masonry-grid class used from index.html (line 90)
- FAB preserved with gradient-joy (line 121)

**Issues**:
- The Stitch source has a completely different secondary color palette (pink instead of purple)
- The React implementation correctly overrides this via unified index.html tokens
- FAB uses gradient-joy (pink-to-amber) which may clash with the indigo-dominant palette

---

### Screen 08: PatternScreen

**Stitch HTML**:
- **ENTIRELY DIFFERENT DESIGN SYSTEM**: Uses `Manrope` for body/label, `Noto Serif` (not KR) for headline (line 68-71)
- primary: `#a7a5ff` (line 30) -- **DIFFERENT** from canonical `#c3c0ff`
- primary-container: `#9795ff` (line 17) -- **DIFFERENT** from canonical `#4f46e5`
- on-surface: `#e7e2ff` (line 18) -- subtly different from canonical `#e4dfff`
- background: `#0d082c` (line 19) -- different from canonical `#120e31`
- on-primary-container: `#14007e` (line 43) -- dark blue, vs canonical `#dad7ff` (light purple) -- **INVERTED semantics**
- borderRadius: `DEFAULT: 1rem, lg: 2rem, xl: 3rem, full: 9999px` (line 72) -- matches canonical
- App name: "The Celestial Observer" (line 104) -- yet ANOTHER app name variant
- Bottom nav: 4 tabs (Home/Library/Patterns/Settings) in English (line 291-308) -- different from canonical
- Active nav: gradient background `from-[#a7a5ff] to-[#645efb]` (line 300) -- unique active state style
- Section cards: `rounded-xl` with `bg-surface-container-low` (line 113) -- matches intent
- body dot background: `rgba(167,165,255,0.05)` (line 80-81) -- unique subtle pattern

**React TSX (PatternScreen.tsx)**:
- App title: "The Celestial Observer" (line 106) -- preserved from Stitch (inconsistent with other screens' Korean titles)
- Uses `pattern-dot-bg` class from index.html (line 101)
- Uses `serif-title` helper class for section headings (line 120, 142, etc.)
- Bottom nav: Normalized to 3 Korean tabs (line 247-260)
- Uses `bg-surface-container-lowest` (line 101) -- `#0d082c`, darker than other screens
- Colors use unified tokens from index.html

**Issues**:
- App title "The Celestial Observer" in React -- should be Korean like other screens
- Background `#0d082c` is darker than main screens' `#120e31`
- primary color in Stitch was `#a7a5ff` (brighter blue-purple) vs canonical `#c3c0ff` (softer lavender)

---

## 2. Cross-Screen Consistency Issues

### 2.1 Color Token Conflicts in Stitch Sources

| Token | Screen 01 | Screen 02 | Screen 04 | Screen 07 | Screen 08 |
|-------|-----------|-----------|-----------|-----------|-----------|
| primary | `#c3c0ff` | `#c3c0ff` | `#cebdff` | `#c3c0ff` | `#a7a5ff` |
| primary-container | `#4f46e5` | `#4f46e5` | -- | `#4f46e5` | `#9795ff` |
| tertiary | `#ffb95f` | `#ddb8ff` | `#ffb95f` (as secondary) | `#ffb95f` | `#919bff` |
| secondary | `#cebdff` | `#bdc2ff` | -- | `#ffb0cd` | `#a88cfb` |
| secondary-container | `#4f319c` | `#2f3aa3` | -- | `#aa0266` | `#4f319c` |
| background | `#120e31` | `#120e31` | `#120e31` | `#0F0B2E` | `#0d082c` |
| on-surface | `#e4dfff` | `#e4dfff` | `#e4dfff` | `#e4dfff` | `#e7e2ff` |

**Verdict**: Stitch generated each screen with a DIFFERENT Material Design 3 color palette. Screen 02 uses blue-tinted secondary, Screen 04 uses minimal tokens with shifted primary, Screen 07 uses an entirely pink secondary scheme, and Screen 08 uses brighter purple primaries.

### 2.2 Typography Conflicts in Stitch Sources

| Screen | Body Font | Label Font | Extra Fonts |
|--------|-----------|------------|-------------|
| 01 | Be Vietnam Pro, Noto Sans KR | Be Vietnam Pro | -- |
| 02 | Noto Sans KR | Noto Sans KR | -- |
| 03 | Be Vietnam Pro | Be Vietnam Pro | -- |
| 04 | Newsreader | Manrope | Cormorant Garamond |
| 05 | Be Vietnam Pro | Be Vietnam Pro | Cormorant Garamond |
| 06 | Be Vietnam Pro, Noto Sans KR | Be Vietnam Pro | -- |
| 07 | Be Vietnam Pro | Be Vietnam Pro | -- |
| 08 | Manrope | Manrope | Noto Serif (not KR) |

**Verdict**: 4 different body font configurations across 8 screens. Screens 04 and 08 use completely non-canonical fonts.

### 2.3 borderRadius Conflicts in Stitch Sources

| Screen | DEFAULT | lg | xl | full |
|--------|---------|----|----|------|
| 01, 03, 05, 06, 08 | 1rem | 2rem | 3rem | 9999px |
| 02 | 0.125rem | 0.25rem | 0.5rem | 0.75rem |
| 07 | 0.25rem | 0.5rem | 0.75rem | 9999px |
| 04 | (not defined) | -- | -- | -- |

**Verdict**: Screen 02 and 07 would have nearly SQUARE corners on all components if their borderRadius was used.

### 2.4 Bottom Navigation Inconsistencies in Stitch Sources

| Screen | Tabs | Icons | Language | Shape |
|--------|------|-------|----------|-------|
| 01 | 3 | edit_note/auto_stories/insights | Korean | rounded-t-[40px] |
| 02 | None (CTA only) | -- | -- | -- |
| 03 | None (CTA only) | -- | -- | -- |
| 04 | None (loading) | -- | -- | -- |
| 05 | 4 | auto_stories/visibility/nights_stay/settings | None | rounded-t-[3rem] |
| 06 | None (suppressed) | -- | -- | -- |
| 07 | 4 | book_2/query_stats/analytics/settings | English | rounded-t-[24px] |
| 08 | 4 | bedtime/auto_stories/timeline/settings | English | rounded-t-[3rem] |

**Verdict**: 4 different bottom nav configurations. The React implementation correctly normalizes all to 3 Korean tabs.

### 2.5 glass-card Definition Conflicts

| Screen | Background RGBA | Blur |
|--------|----------------|------|
| 01 | `(52, 48, 84, 0.4)` | 20px |
| 02 | `(30, 27, 62, 0.6)` | 12px |
| 03 | `(52, 48, 84, 0.4)` | 12px |
| 07 | `(30, 27, 62, 0.6)` | 20px |

### 2.6 App Name Inconsistencies

| Screen | Stitch App Name | React App Name |
|--------|----------------|----------------|
| 01 | The Ethereal Archive | 꿈 공장 |
| 02 | 꿈의 조각가 | 꿈의 조각가 |
| 03 | The Ethereal Archive | 감정 선택 |
| 04 | DREAM FACTORY | 꿈 공장 |
| 05 | The Ethereal Archive | 꿈 해석 |
| 06 | Share Dream | 꿈 공유하기 |
| 07 | Celestial Dream Archive | 꿈 갤러리 |
| 08 | The Celestial Observer | The Celestial Observer |

**Verdict**: 5 different app names in Stitch. React mostly localizes but Screen 08 still has English name.

---

## 3. Dimension Scores

### 3.1 Color Consistency: 62/100

The React implementation uses a unified index.html tailwind config that resolves MOST Stitch color conflicts. However:
- ShareScreen and PatternScreen use `bg-surface-container-lowest` (#0d082c) while others use `bg-surface`/`bg-surface-dim` (#120e31), creating a noticeable darkness shift
- Hardcoded hex colors throughout React components (e.g., `text-[#F8FAFC]`, `text-[#c3c0ff]`, `bg-[#120e31]`) bypass the token system
- The FAB on GalleryScreen uses `gradient-joy` (pink-to-amber) which clashes with the indigo-dominant scheme
- PatternScreen header uses `text-[#a7a5ff]` and `text-[#a88cfb]` -- hardcoded colors not in the token system

### 3.2 Typography: 72/100

The React implementation correctly unifies to `Be Vietnam Pro` + `Noto Sans KR` for body and `Noto Serif KR` for headlines via index.html. However:
- The headline font `Noto Serif KR` is consistently used across React components
- `Cormorant Garamond` is correctly added as `font-dream-quote` / `font-branding` for decorative use only
- Header font sizes vary: `text-lg` (Intro, SceneBuilder, Emotion), `text-xl` (Interpretation, Gallery), `text-2xl` (Share, Pattern)
- Some screens use inline font specification `font-['Noto_Serif_KR']` or `font-['Noto_Sans_KR']` instead of semantic classes

### 3.3 Layout Consistency: 68/100

- **Header height**: Consistently `h-16` across most screens, but Share screen uses `py-4` without explicit height
- **Main padding**: `px-6` is consistent, but `pt` varies: `pt-24` (Intro, Emotion), `pt-20` (SceneBuilder), `mt-16` (Gallery)
- **CTA button shapes DIFFER**:
  - IntroScreen: `rounded-full px-10 py-4` (pill, inline)
  - SceneBuilderScreen: `rounded-xl h-14` (rectangle, full-width)
  - EmotionScreen: `rounded-full py-5` (pill, full-width)
  - InterpretationScreen: `rounded-full py-4` (pill, full-width)
- **Card border-radius**: `rounded-xl` (SceneBuilder grid), `rounded-[1.5rem]` (Intro preview), `rounded-3xl` (Gallery cards), `rounded-[1rem]` (Interpretation card) -- four different radii for cards
- **Bottom nav padding**: Consistently `px-8 pb-8 pt-4` across all React screens that have it

### 3.4 Interaction Patterns: 78/100

- **Selected state (Scene cards)**: `bg-primary-container/20 border-2 border-primary shadow-glow` -- consistent in React
- **Selected state (Emotion cards)**: `active-border` class with inset glow -- visually similar but technically different from scene selection
- **Button active state**: `active:scale-95` or `active:scale-[0.98]` used consistently
- **Hover states**: `hover:scale-105` (Intro CTA), `hover:scale-[1.02]` (Interpretation save), `hover:bg-surface-bright` (scene cards) -- minor inconsistencies in scale values
- **Bottom nav active indicator**: Consistently uses `bg-indigo-500/20 text-indigo-100 rounded-full px-6 py-2` in React

### 3.5 Brand Identity: 65/100

- The dark indigo space/cosmic theme is consistent across screens
- Mystical/ethereal language and iconography (crystal ball, constellations, flare) create brand coherence
- However, the MULTIPLE app names weaken brand identity (even in React: "꿈 공장" vs "꿈의 조각가" vs "감정 선택" vs "꿈 해석" vs etc.)
- The PatternScreen feels like a separate analytics app -- different header style (sticky, not fixed; has inline text navigation instead of bottom tabs serving as main nav), different background color, English title
- The ShareScreen lacks bottom navigation, breaking the app shell pattern
- The GalleryScreen's pink FAB is tonally inconsistent with the indigo-purple palette

---

## 4. Overall Design Consistency Score

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|----------|
| Color Consistency | 25% | 62 | 15.5 |
| Typography | 20% | 72 | 14.4 |
| Layout Consistency | 20% | 68 | 13.6 |
| Interaction Patterns | 15% | 78 | 11.7 |
| Brand Identity | 20% | 65 | 13.0 |
| **Overall** | **100%** | -- | **68.2** |

---

## 5. Categorized Issues

### RED -- Consistency Broken (Must Fix)

1. **Screen 08 (PatternScreen)**: English app title "The Celestial Observer" not localized -- the only screen with a fully English header title in React (`PatternScreen.tsx` line 106)

2. **Background color split**: PatternScreen and ShareScreen use `bg-surface-container-lowest` (#0d082c) while all other screens use `bg-surface` / `bg-surface-dim` (#120e31) -- creates a visible flash when navigating between screens (`ShareScreen.tsx` line 24, `PatternScreen.tsx` line 101)

3. **CTA button shape inconsistency**: SceneBuilderScreen uses `rounded-xl h-14` (`SceneBuilderScreen.tsx` line 190) while EmotionScreen and InterpretationScreen use `rounded-full py-4/py-5` -- on the same user flow, adjacent screens have different button shapes

4. **ShareScreen has no bottom navigation**: User loses the app shell and has no way to navigate to Gallery or Record screens without using the back button (`ShareScreen.tsx` -- no nav element exists)

5. **Header title font size varies**: `text-lg` (3 screens), `text-xl` (2 screens), `text-2xl` (2 screens) -- the app title in the header bar has 3 different sizes across screens

### YELLOW -- Improvement Recommended

6. **Hardcoded hex colors bypass token system**: Multiple files use `text-[#F8FAFC]`, `text-[#c3c0ff]`, `bg-[#120e31]`, `text-[#a7a5ff]`, `text-[#a88cfb]` instead of semantic token classes (`EmotionScreen.tsx` lines 68, 95, 157; `SceneBuilderScreen.tsx` lines 96, 99, 123-124; `PatternScreen.tsx` lines 88-89, 105-106, 109-110)

7. **GalleryScreen FAB uses gradient-joy** (pink-to-amber): Visually distracting against the indigo-dominant scheme (`GalleryScreen.tsx` line 121). Should use primary-container or a subtler gradient.

8. **Header navigation icons inconsistent**: IntroScreen uses `auto_awesome` + `account_circle`; SceneBuilder uses `auto_awesome` only; EmotionScreen uses `chevron_left` + `close`; InterpretationScreen uses `menu` + `auto_awesome`; ShareScreen uses `arrow_back`; GalleryScreen uses `auto_awesome` + `account_circle`; PatternScreen uses `flare` (`InterpretationScreen.tsx` line 31, `PatternScreen.tsx` line 105)

9. **PatternScreen header is `sticky` not `fixed`**: Uses `sticky top-0` (`PatternScreen.tsx` line 103) while all other screens use `fixed top-0` -- scrolling behavior differs

10. **glass-card vs glass-card-subtle vs glass-panel**: Three different glassmorphism variants are defined in index.html (lines 114-128) but usage is inconsistent -- SceneBuilderScreen uses `glass-card-subtle`, GalleryScreen uses `glass-panel`, IntroScreen uses `glass-card`

11. **Card border-radius inconsistency**: `rounded-xl` (SceneBuilder), `rounded-[1.5rem]` (Intro preview), `rounded-3xl` (Gallery), `rounded-[1rem]` (Interpretation) -- should standardize to 1-2 card radius values

12. **InterpretationScreen header has `menu` hamburger**: No other screen uses hamburger menu; it should be `chevron_left` or `auto_awesome` to match the pattern (`InterpretationScreen.tsx` line 31)

### GREEN -- Acceptable

13. **Bottom navigation normalization**: React correctly normalizes all bottom navs to 3 Korean tabs (기록/갤러리/통계) with consistent styling -- well executed

14. **Unified Tailwind config**: index.html provides a single source of truth for color tokens, font families, and borderRadius -- resolves most Stitch-originated conflicts

15. **Emotion gradients**: Consistently defined in index.html (lines 158-165) and applied uniformly in GalleryScreen cards

16. **Active/selected states**: `active-border` class consistently applied for emotion selection; `border-2 border-primary` consistently applied for scene selection

17. **Progress bar styling**: Consistent `h-[2px]` bar with `bg-primary-container` fill and glow shadow across SceneBuilder and EmotionScreen

18. **Analysis screen**: Unique full-screen loading experience with crystal ball animation -- intentionally distinct, no consistency issues

---

## 6. Stitch Modification Recommendations

### Screens That Need Re-generation

1. **Screen 02 (SceneBuilderScreen)**: Must be regenerated with correct borderRadius (`1rem` default), correct tertiary color (`#ffb95f` amber not `#ddb8ff` purple), and `Be Vietnam Pro` in the font stack. The current Stitch source has the most token deviations.

2. **Screen 07 (GalleryScreen)**: Must be regenerated with correct secondary palette (`#cebdff` purple not `#ffb0cd` pink), correct borderRadius, correct background color (`#120e31`), and Korean bottom nav labels.

3. **Screen 08 (PatternScreen)**: Must be regenerated with correct font stack (`Be Vietnam Pro` not `Manrope`), correct primary (`#c3c0ff` not `#a7a5ff`), correct primary-container (`#4f46e5` not `#9795ff`), and Korean header/nav labels.

### Screens That Need Editing (Not Full Regen)

4. **Screen 04 (AnalysisScreen)**: Edit the Stitch HTML to use canonical fonts. Replace `Newsreader` body font with `Be Vietnam Pro` and `Manrope` labels with `Be Vietnam Pro`. Change `primary: #cebdff` to `#c3c0ff`.

5. **Screen 05 (InterpretationScreen)**: Edit the bottom nav to use 3 Korean tabs matching Screen 01. Change header from `menu` to `chevron_left` or `arrow_back`.

### Screens That Are Acceptable As-Is

6. **Screen 01 (IntroScreen)**: Reference screen -- use as the canonical source for design tokens.
7. **Screen 03 (EmotionScreen)**: Minor deviations only -- acceptable.
8. **Screen 06 (ShareScreen)**: Acceptable, but add a bottom nav to match the app shell pattern.

---

## 7. CSS/Tailwind Fixes for Dev Team

### Fix 1: Unify background color across all screens

```diff
# ShareScreen.tsx line 24
- <div className="bg-surface-container-lowest text-on-surface ...
+ <div className="bg-surface text-on-surface ...

# PatternScreen.tsx line 101
- <div className="min-h-screen pb-32 bg-surface-container-lowest text-on-surface font-body pattern-dot-bg">
+ <div className="min-h-screen pb-32 bg-surface text-on-surface font-body pattern-dot-bg">

# PatternScreen.tsx line 86 (empty state)
- <div className="min-h-screen flex flex-col bg-surface-container-lowest text-on-surface pb-32 pattern-dot-bg">
+ <div className="min-h-screen flex flex-col bg-surface text-on-surface pb-32 pattern-dot-bg">
```

### Fix 2: Standardize CTA button shape to `rounded-full` (pill)

```diff
# SceneBuilderScreen.tsx line 190-191
- className={`w-full h-14 rounded-xl font-body font-bold text-lg ...
+ className={`w-full py-4 rounded-full font-body font-bold text-lg ...
```

### Fix 3: Standardize header title font size to `text-lg`

```diff
# InterpretationScreen.tsx line 33
- <h1 className="font-headline text-xl tracking-[0.2em] text-[#c3c0ff]">꿈 해석</h1>
+ <h1 className="font-headline text-lg tracking-[0.2em] text-primary">꿈 해석</h1>

# ShareScreen.tsx line 30
- <h1 className="ml-4 font-headline text-2xl tracking-wide text-indigo-200">꿈 공유하기</h1>
+ <h1 className="ml-4 font-headline text-lg tracking-wide text-indigo-200">꿈 공유하기</h1>

# GalleryScreen.tsx line 51
- <h1 className="font-headline text-xl font-bold text-white tracking-widest">꿈 갤러리</h1>
+ <h1 className="font-headline text-lg font-bold text-white tracking-widest">꿈 갤러리</h1>

# PatternScreen.tsx line 106
- <h1 className="text-2xl font-headline italic text-[#a7a5ff]">The Celestial Observer</h1>
+ <h1 className="text-lg font-headline italic text-primary">패턴 분석</h1>
```

### Fix 4: Replace hardcoded hex colors with token classes

```diff
# EmotionScreen.tsx line 68
- <h2 className="font-headline text-3xl leading-snug text-[#F8FAFC]">
+ <h2 className="font-headline text-3xl leading-snug text-on-background">

# EmotionScreen.tsx line 95
- isActive ? 'text-[#F8FAFC]' : 'text-on-surface-variant'
+ isActive ? 'text-on-background' : 'text-on-surface-variant'

# EmotionScreen.tsx lines 157, 159
- canProceed ? 'text-[#F8FAFC]' : 'text-on-surface-variant/40'
+ canProceed ? 'text-on-primary-container' : 'text-on-surface-variant/40'

# SceneBuilderScreen.tsx line 96
- <button onClick={onBack} className="flex items-center gap-2 text-[#4f46e5]">
+ <button onClick={onBack} className="flex items-center gap-2 text-primary-container">

# SceneBuilderScreen.tsx line 99
- <h1 className="font-headline text-lg tracking-[0.1em] text-[#e4dfff] uppercase">
+ <h1 className="font-headline text-lg tracking-[0.1em] text-on-surface uppercase">

# PatternScreen.tsx line 105
- <span className="material-symbols-outlined text-[#a7a5ff]">flare</span>
+ <span className="material-symbols-outlined text-primary">flare</span>

# PatternScreen.tsx line 109-110
- <button onClick={onGoGallery} className="text-[#a88cfb]/60 font-body ...
+ <button onClick={onGoGallery} className="text-secondary/60 font-body ...
- <button className="text-[#a7a5ff] border-b-2 border-[#a7a5ff] pb-1 font-body">
+ <button className="text-primary border-b-2 border-primary pb-1 font-body">
```

### Fix 5: Add bottom nav to ShareScreen

```tsx
# ShareScreen.tsx -- add before closing </div> of the root element:
+ {/* BottomNavBar */}
+ <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-8 pb-8 pt-4 bg-indigo-950/60 backdrop-blur-xl rounded-t-[40px] border-t border-white/10 shadow-[0_-8px_32px_rgba(79,70,229,0.15)] max-w-[430px]">
+   <button onClick={onBack} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
+     <span className="material-symbols-outlined mb-1">edit_note</span>
+     <span className="font-label text-[10px] tracking-wider">기록</span>
+   </button>
+   <button className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
+     <span className="material-symbols-outlined mb-1">auto_stories</span>
+     <span className="font-label text-[10px] tracking-wider">갤러리</span>
+   </button>
+   <button className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
+     <span className="material-symbols-outlined mb-1">insights</span>
+     <span className="font-label text-[10px] tracking-wider">통계</span>
+   </button>
+ </nav>
```

### Fix 6: Fix InterpretationScreen header icon

```diff
# InterpretationScreen.tsx line 31
- <span className="material-symbols-outlined">menu</span>
+ <span className="material-symbols-outlined">arrow_back</span>
```

### Fix 7: Make PatternScreen header `fixed` instead of `sticky`

```diff
# PatternScreen.tsx line 103
- <header className="bg-[#0d082c] flex justify-between items-center px-8 py-6 w-full sticky top-0 z-50">
+ <header className="bg-surface/80 backdrop-blur-xl flex justify-between items-center px-8 h-16 w-full fixed top-0 z-50 max-w-[430px]">
```
(And add `pt-20` to the main content to compensate.)

### Fix 8: Standardize card border-radius

Define in index.html:
```css
/* Add to <style> section */
.card-radius { border-radius: 1.5rem; }  /* Use for all content cards */
.card-radius-sm { border-radius: 1rem; }  /* Use for grid selection items */
```

Then apply:
- Gallery dream cards: replace `rounded-3xl` with `card-radius`
- Interpretation card: replace `rounded-[1rem]` with `card-radius`
- SceneBuilder grid items: keep `rounded-xl` (= `card-radius-sm`)
- Intro preview card inner: replace `rounded-[1.5rem]` with `card-radius`

### Fix 9: Consolidate glassmorphism classes

Keep only two variants in index.html:
```css
/* Primary glass -- for content cards, modals */
.glass-card {
  background: rgba(52, 48, 84, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
/* Subtle glass -- for selection items, containers */
.glass-card-subtle {
  background: rgba(30, 27, 62, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```
Remove `glass-panel` and replace all usages with `glass-card-subtle`.

---

## Summary

The React implementation has done significant work to normalize the inconsistencies from Stitch's per-screen generation. The unified `index.html` Tailwind config resolves most color token and font conflicts. However, 5 critical issues remain (background color split, button shape inconsistency, missing bottom nav, header size variance, English app title on PatternScreen) that break the sense of a unified product. The 9 fixes above address all major issues and would bring the overall score from **68.2** to an estimated **82-85**.
