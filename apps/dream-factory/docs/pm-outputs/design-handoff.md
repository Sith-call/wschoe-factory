# Dream Factory -- Design Handoff

> Stitch Project: **471443557826209154**
> Generated: 2026-03-20
> Device: MOBILE (430px)
> Model: GEMINI_3_1_PRO

---

## Screen Index

| # | Screen | Stitch Screen ID | HTML File |
|---|--------|-----------------|-----------|
| 1 | IntroScreen | `d263558e38a44f5bbc16743286f3b058` | `01-IntroScreen.html` |
| 2 | SceneBuilderScreen | `3f4482095ff448be8fc9b03138595769` | `02-SceneBuilderScreen.html` |
| 3 | EmotionScreen | `8b942ac37aee45a69dac91a7cf53ba98` | `03-EmotionScreen.html` |
| 4 | AnalysisScreen | `2be7770e4e1a49f6a01df653cf018a55` | `04-AnalysisScreen.html` |
| 5 | InterpretationScreen | `f30ed8304993493bba3f57956d02740d` | `05-InterpretationScreen.html` |
| 6 | ShareScreen | `a40130674946476e8bc52de86dbc571c` | `06-ShareScreen.html` |
| 7 | GalleryScreen | `eaf11f4796c44a1e82549acb9ee6a74f` | `07-GalleryScreen.html` |
| 8 | PatternScreen | `a671b4f3cbaf4818ae44edb42f25cd4f` | `08-PatternScreen.html` |

---

## Global Design Tokens (Extracted from Stitch Output)

### Color System

All screens use a Material Design 3-inspired dark theme with custom semantic tokens:

| Token | Hex Value | Usage |
|-------|-----------|-------|
| `surface` | `#120e31` | Main background (deep navy) |
| `surface-dim` | `#120e31` | Same as surface |
| `surface-container-lowest` | `#0d082c` | Deepest background layer |
| `surface-container-low` | `#1a1739` | Card sections, subtle elevation |
| `surface-container` | `#1e1b3e` | Glass card backgrounds |
| `surface-container-high` | `#292649` | Elevated cards, insights |
| `surface-container-highest` | `#343054` | Highest elevation, slider tracks |
| `surface-bright` | `#383559` | Hover states |
| `primary` | `#c3c0ff` | Primary text accent, icons |
| `primary-container` | `#4f46e5` | CTA buttons, active states, progress bars |
| `on-primary-container` | `#dad7ff` | Text on primary container |
| `on-surface` | `#e4dfff` | Primary text on dark bg |
| `on-surface-variant` | `#c7c4d8` | Secondary/muted text |
| `on-background` | `#e4dfff` | Headline text |
| `secondary` | `#cebdff` | Secondary accent |
| `tertiary` / `accent-warm` | `#ffb95f` | Gold/amber accents, stars |
| `outline` | `#918fa1` | Border strokes |
| `outline-variant` | `#464555` | Subtle borders, dividers |

### Emotion Gradient Definitions (from GalleryScreen)

```css
.gradient-peace   { background: linear-gradient(to right, #6366F1, #3B82F6); }
.gradient-fear    { background: linear-gradient(to right, #334155, #0F172A); }
.gradient-joy     { background: linear-gradient(to right, #EC4899, #F59E0B); }
.gradient-sorrow  { background: linear-gradient(to right, #4338CA, #7C3AED); }
.gradient-surprise{ background: linear-gradient(to right, #FBBF24, #F472B6); }
.gradient-longing { background: linear-gradient(to right, #4F46E5, #06B6D4); }
```

### Typography

| Role | Font Family | Tailwind Class |
|------|-------------|----------------|
| Headlines/Titles | Noto Serif KR (400, 700) | `font-headline` |
| Body/UI | Be Vietnam Pro or Noto Sans KR (300-700) | `font-body` |
| Labels/Captions | Be Vietnam Pro or Noto Sans KR | `font-label` |
| Dream Quotes | Cormorant Garamond (italic) | `font-dream-quote` / `font-branding` |

### Icons

All screens use **Material Symbols Outlined** with these settings:
```css
font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
```
Selected/active states use filled variant: `'FILL' 1`.

---

## Per-Screen Details

### Screen 1: IntroScreen

**Layout Pattern:** Full-screen hero with centered content, fixed bottom nav, star field background.

**Key CSS Classes:**
- `.star-field` -- Radial gradient dot pattern for night sky: `radial-gradient(circle at 2px 2px, rgba(195, 192, 255, 0.15) 1px, transparent 0); background-size: 32px 32px`
- `.glass-card` -- `rgba(52, 48, 84, 0.4)` + `backdrop-filter: blur(20px)`
- `.crystal-glow` -- `box-shadow: 0 0 60px 10px rgba(167, 139, 250, 0.25), inset 0 0 40px rgba(255, 185, 95, 0.1)`

**Material Icons Used:**
`auto_awesome`, `account_circle`, `star` (filled), `flare`, `edit_note`, `auto_stories` (filled), `insights`, `expand_more`

**Key Components:**
- Crystal ball: 48x48 rounded-full with gradient overlay + generated image
- CTA button: `bg-primary-container rounded-full shadow-[0_0_25px_rgba(79,70,229,0.3)]`
- Recent dream card: Glass card with aspect-[3/4], gradient overlay on image
- Bottom nav: Fixed, rounded-t-[40px], backdrop-blur-xl

---

### Screen 2: SceneBuilderScreen

**Layout Pattern:** Fixed header + scrollable 2-column grid + fixed bottom CTA.

**Key CSS Classes:**
- `.glass-card` -- `rgba(30, 27, 62, 0.6)` + `backdrop-filter: blur(12px)`
- `.icon-fill` -- `font-variation-settings: 'FILL' 1` for selected icons

**Material Icons Used:**
`auto_awesome`, `landscape`, `wb_cloudy`, `person`, `magic_button`, `water` (fill), `question_mark`, `forest`, `apartment`, `school`, `home`, `cloud`, `subway`, `mystery`, `arrow_forward`

**Key Components:**
- Progress bar: `h-[2px]` track, `w-1/3` fill with `shadow-[0_0_12px_#4f46e5]`
- Tab nav: `bg-surface-container-low rounded-xl p-1`, active tab has `bg-[#4f46e5]/20 rounded-xl`
- Preview strip: Horizontal flex of 12x12 rounded-full icons
- Selection grid: `grid-cols-2 gap-4`, cards are `aspect-square glass-card rounded-xl`
- Selected card: `bg-primary-container/20 border-2 border-primary shadow-[0_0_20px_rgba(79,70,229,0.2)]`
- Bottom CTA: Fixed, gradient fade from surface, full-width button `h-14 rounded-xl`

---

### Screen 3: EmotionScreen

**Layout Pattern:** Fixed header + scrollable content (grid + slider + textarea) + fixed bottom CTA.

**Key CSS Classes:**
- `.glass-card` -- Same as IntroScreen
- `.nebula-glow` -- `box-shadow: 0 0 25px rgba(79, 70, 229, 0.3)`
- `.active-border` -- `border: 1px solid rgba(195, 192, 255, 0.5); box-shadow: inset 0 0 12px rgba(79, 70, 229, 0.4)`

**Material Icons Used:**
`chevron_left`, `close`, `self_improvement`, `skull`, `cyclone`, `sentiment_very_satisfied`, `water_drop`, `local_fire_department`, `bolt`, `favorite`, `auto_awesome`

**Key Components:**
- Emotion grid: `grid-cols-2 gap-4`, each card has icon in rounded-full container
- Active emotion: `.active-border` class + `bg-primary/10` icon container
- Vividness slider: Custom 5-point discrete slider with `bg-gradient-to-r from-primary-container to-primary`
- Slider thumb: `w-5 h-5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.6)] border-2 border-primary-container`
- Textarea: `bg-surface-container-low border-b border-outline-variant/30`, Noto Serif KR for input
- Bottom CTA: "auto_awesome" icon + "꿈 해석받기" in rounded-full button

---

### Screen 4: AnalysisScreen

**Layout Pattern:** Full-screen immersive, centered crystal ball, no navigation.

**Key CSS Classes:**
- `.mystic-gradient` -- `radial-gradient(circle at center, #3730a3 0%, #0d082c 70%, #0d082c 100%)`
- `.crystal-ball-glow` -- `radial-gradient(circle at 30% 30%, rgba(167, 139, 250, 0.4) 0%, rgba(75, 44, 152, 0.2) 50%, transparent 100%)` + box-shadow
- `.swirl-1` -- Violet radial gradient with blur(20px), animated spin 12s
- `.swirl-2` -- Gold radial gradient with blur(25px), animated reverse spin 8s
- `.constellation-line` -- `rgba(206, 189, 255, 0.08)` SVG stroke
- `.star-dot` -- `#ffb95f` fill with glow shadow
- `.pulse-text` -- `animation: pulse-opacity 3s ease-in-out infinite` (0.6 to 1 opacity)

**Material Icons Used:**
`flare`

**Key Components:**
- Crystal ball: 64x64 rounded-full with internal swirling CSS animations
- SVG constellation lines connecting dots around the ball
- Text stages: Completed = `text-on-surface/40 text-sm`, Active = `text-on-surface text-xl` with pulse
- Branding: `font-branding italic text-on-surface/20 text-[10px] tracking-[0.6rem]` (Cormorant Garamond)

---

### Screen 5: InterpretationScreen

**Layout Pattern:** Centered tarot card with action buttons below, fixed bottom nav.

**Key CSS Classes:**
- `.ease-out-expo` -- `cubic-bezier(0.16, 1, 0.3, 1)`
- Card gradient: `bg-gradient-to-br from-[#7C3AED] via-[#4f46e5] to-[#3B82F6]`
- Gold border wrapper: `bg-gradient-to-b from-[#ffb95f]/30 to-transparent` (1px padding trick)

**Material Icons Used:**
`menu`, `auto_awesome`, `auto_stories`, `visibility`, `nights_stay`, `settings`

**Key Components:**
- Card: `aspect-[2/3.2] rounded-[1rem]`, gold gradient border via wrapper padding
- Title: `font-headline text-2xl text-white text-center`
- Keyword pills: `px-3 py-1 rounded-full bg-surface-container-low/40 backdrop-blur-md text-primary text-[10px]`
- Symbol explanations: Flex row with `border-b border-white/5`, key on left, meaning on right
- Fortune quote: `font-dream-quote italic text-white/60 text-sm` (Cormorant Garamond)
- Buttons: Primary = `bg-primary-container rounded-full`, Secondary = `border border-outline-variant rounded-full`

---

### Screen 6: ShareScreen

**Layout Pattern:** Centered share card with 3-column action grid below.

**Key CSS Classes:**
- `.dream-card-gradient` -- `linear-gradient(135deg, #4f46e5 0%, #1a1739 100%)`
- `.star-field` -- `radial-gradient(circle, #ffffff 1px, transparent 1px); background-size: 40px 40px`

**Material Icons Used:**
`arrow_back`, `auto_awesome` (filled), `download`, `chat`, `link`

**Key Components:**
- Card: `aspect-[430/540]` with gradient + gold border `border-tertiary/30`
- Keyword pills: `bg-white/10 border border-white/10 rounded-full`
- Interpretation quote: `bg-surface-dim/40 backdrop-blur-md border-l-2 border-tertiary`
- Watermark: `font-headline italic text-sm text-tertiary/60 tracking-widest`
- Share buttons: `grid-cols-3 gap-4`, each glass tile with icon + label

---

### Screen 7: GalleryScreen

**Layout Pattern:** Tab nav + horizontal filter chips + 2-column masonry grid + FAB.

**Key CSS Classes:**
- `.glass-panel` -- `rgba(30, 27, 62, 0.6)` + `backdrop-filter: blur(20px)`
- `.dream-card-shadow` -- `box-shadow: 0 20px 40px rgba(195, 192, 255, 0.08)`
- `.masonry-grid` -- `grid-template-columns: repeat(2, 1fr); gap: 1rem; align-items: start`
- `.active-tab-underline` -- `border-bottom: 2px solid #c3c0ff`
- Emotion gradients: `.gradient-peace`, `.gradient-fear`, `.gradient-joy`, `.gradient-sorrow`, `.gradient-surprise`, `.gradient-longing`

**Material Icons Used:**
`auto_awesome`, `account_circle`, `add`, `book_2`, `query_stats`, `analytics`, `settings`

**Key Components:**
- Tabs: Font-headline, active has underline
- Filter chips: `rounded-full`, active = `bg-primary-container text-white`, inactive = `border border-outline-variant`
- Dream cards: Glass panel + `rounded-3xl`, emotion gradient strip `h-1.5` at top
- Card content: Emotion label (10px caps), title (Noto Serif KR lg), date
- Masonry offset: Odd-column cards have `mt-4` for staggered effect
- FAB: `w-16 h-16 rounded-full gradient-joy` (pink-to-amber gradient)

---

### Screen 8: PatternScreen

**Layout Pattern:** Tab nav + 4 vertically stacked visualization cards + insight card.

**Key CSS Classes:**
- Background: `radial-gradient(circle at 2px 2px, rgba(167, 165, 255, 0.05) 1px, transparent 0); background-size: 24px 24px`
- `.serif-title` -- `font-family: 'Noto Serif', serif`
- Chart sections: `bg-surface-container-low p-6 rounded-xl`
- Bar chart gradient: `from-[#4F46E5] to-[#A78BFA]`

**Material Icons Used:**
`flare`, `calendar_month`, `auto_awesome` (filled), `bedtime`, `auto_stories`, `timeline` (filled), `settings`

**Key Components:**
1. **Dot Calendar**: `grid-cols-7 gap-y-4`, filled dots = `bg-primary shadow-[0_0_10px_rgba(167,165,255,0.4)]`, empty = `border border-outline-variant/30`
2. **Bar Chart**: Horizontal bars with gradient fill, decreasing widths (90%, 65%, 55%, 40%, 25%), opacity fade
3. **Donut Chart**: SVG `stroke-dasharray` technique on overlapping circles, center label
4. **Line Chart**: Dot markers at varying heights + SVG path overlay
5. **Insight Card**: `bg-surface-container-high border border-primary/10`, auto_awesome icon, highlighted keyword in text

---

## Shared Patterns

### Glass-morphism Card
```css
background: rgba(30, 27, 62, 0.6);  /* or rgba(52, 48, 84, 0.4) */
backdrop-filter: blur(12px);         /* or blur(20px) */
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(70, 69, 85, 0.1);  /* outline-variant/10 */
```

### Glow Effect (Selected State)
```css
border: 2px solid #4f46e5;  /* primary-container */
box-shadow: 0 0 20px rgba(79, 70, 229, 0.2);
```

### CTA Button
```css
background: #4f46e5;  /* primary-container */
border-radius: 9999px;  /* or 0.75rem */
box-shadow: 0 0 25px rgba(79, 70, 229, 0.3);
```

### Background Nebula Decorations
```css
/* Positioned absolute, blurred colored circles */
position: absolute;
background: rgba(79, 70, 229, 0.2);
filter: blur(100px);
border-radius: 50%;
z-index: -1;
```

---

## HTML Files Location

- Source HTML: `/tmp/dream-factory-html/01-IntroScreen.html` through `08-PatternScreen.html`
- Reference screenshots: `/tmp/stitch-dream-ref/`

## Stitch Project URL

https://stitch.withgoogle.com/project/471443557826209154
