# Design Handoff: 감정 처방전 (Mood Pharmacy)

> Dev team reference for building React components from Stitch HTML screens.

---

## Shared Design Tokens (Screens 1-6, 8)

### Colors (Tailwind Config)
| Token | Value | Usage |
|-------|-------|-------|
| `primary` | `#5b13ec` | Buttons, progress bars, selected states, accents |
| `primary-soft` | `#ede7fe` | Screen 1 only — soft purple background tint |
| `accent-pink` | `#fce7f3` | Screen 1 only — floating icon backgrounds |
| `background-light` | `#f6f6f8` | Default page background (screens 2-4, 8) |
| `background-dark` | `#161022` | Dark mode / analysis screen radial gradient end |
| `paper` | `#FFFFFF` | Screen 6 — prescription card background |

### Fonts
| Family | Weights | CDN |
|--------|---------|-----|
| Plus Jakarta Sans | 300, 400, 500, 600, 700 | `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700` |
| Noto Sans KR | 300, 400, 500, 700 | `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700` |
| Noto Serif KR | 400, 700 | Screen 6 only: `https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700` |

**Font stack**: `'Plus Jakarta Sans', 'Noto Sans KR', sans-serif`

### Icons
- **Library**: Material Symbols Outlined
- **CDN**: `https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1`
- **Default settings**: `font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24`
- **Filled variant**: `font-variation-settings: 'FILL' 1` (used in feedback/checklist for selected states)

### Border Radius
| Token | Value |
|-------|-------|
| `DEFAULT` | `0.25rem` |
| `lg` | `0.5rem` |
| `xl` | `0.75rem` |
| `2xl` | `1rem` or `1.5rem` (varies by screen) |
| `full` | `9999px` (buttons, pills, avatar circles) |

### Shared CSS Classes

#### `.selected-card` (Screen 2)
```css
.selected-card {
  border: 2px solid #5b13ec;
  background-color: rgba(91, 19, 236, 0.05);
}
```

#### `.bg-custom-gradient` (Screen 5)
```css
.bg-custom-gradient {
  background: radial-gradient(circle at center, #2e1065 0%, #161022 100%);
}
```

#### `.paper-texture` (Screen 6)
```css
.paper-texture {
  background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuCzqY3FKnF-VsmXoFSu9EU0MTpsSD0JZhGJeSxXHb9s21UWO2TQn6PdkZmB9ppI3zMKwCrqRemG6v5_1HjibnhkdNoBK9talD5-FCPBXSAVT6NEL39qRpB93XtbHJtaM-jzA--2w_P5RTasscwjPyzSyXbcMPL3kX8YiWsEMBPQzJUS8bxitnJgI0G0GaSEhUu_gbfGefeKmhZ8I-DaTBz8M_Hc0AXtlKn376qAo_mRQVS4sXgstVFvFfXbDwyXodd_0DyLfp_KAns);
}
```

#### `.progress-ring-circle` (Screens 5, 7)
```css
.progress-ring-circle {
  transition: stroke-dashoffset 0.35s;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}
```

### Common Layout Patterns
- **Max width**: `max-w-[430px]` or `w-[430px]` — mobile frame
- **Min height**: `min-height: max(884px, 100dvh)`
- **Primary button**: `w-full bg-primary text-white font-bold py-4 rounded-full shadow-lg shadow-primary/30`
- **Back button**: `material-symbols-outlined` with `arrow_back` or `arrow_back_ios`
- **Header**: Sticky with `backdrop-blur-md` and semi-transparent background
- **Progress bar**: `h-1.5` or `h-2` with `bg-primary` fill, `rounded-full`
- **Bottom fade**: `bg-gradient-to-t from-background-light via-background-light/95 to-transparent`

---

## Per-Screen Details

### Screen 1: IntroScreen (`01-intro.html`)
- **Purpose**: Landing/welcome screen with CTA
- **Background**: `bg-gradient-to-b from-primary-soft/40 via-white to-white`
- **Extra Tailwind colors**: `primary-soft: #ede7fe`, `accent-pink: #fce7f3`, `background-light: #fdfcfd`
- **Layout**: Centered flex column, no header/progress bar
- **Illustration**: CSS-only pharmacy bottle (border-4 rounded-xl box with pink circle + icon)
- **Icons**: `medical_services`, `favorite`, `sentiment_satisfied`, `arrow_forward`, `history`
- **CTA**: `bg-primary text-white rounded-full font-bold text-lg shadow-lg shadow-primary/30`
- **Footer**: "기록 보기" link with `history` icon, bottom safe area bar (`w-32 h-1.5 bg-slate-200/50 rounded-full`)

### Screen 2: EmotionSelectScreen (`02-emotion-select.html`)
- **Purpose**: Select up to 3 emotions from 2-column grid
- **Background**: `bg-background-light` (`#f6f6f8`)
- **Layout**: Sticky header with progress bar (Step 1, 1/4), 2-col grid (`grid grid-cols-2 gap-4`), fixed bottom action area
- **Card (default)**: `bg-white p-4 rounded-xl shadow-sm border-2 border-transparent aspect-square`
- **Card (selected)**: Uses `.selected-card` class + checkmark badge (`bg-primary text-white rounded-full p-0.5` at `absolute top-2 right-2`)
- **Emotion icons (with background colors)**:
  - 기쁨: `sentiment_very_satisfied` / `bg-yellow-100` / `text-yellow-500`
  - 슬픔: `sentiment_dissatisfied` / `bg-blue-50` / `text-blue-400`
  - 분노: `mood_bad` / `bg-red-50` / `text-red-400`
  - 불안: `psychology_alt` / `bg-orange-50` / `text-orange-400`
  - 무기력: `bedtime` / `bg-slate-100` / `text-slate-400`
  - 스트레스: `bolt` / `bg-purple-100` / `text-purple-500`
  - 설렘: `favorite` / `bg-pink-50` / `text-pink-400`
  - 공허: `cloud` / `bg-gray-100` / `text-gray-400`
- **Bottom**: Fixed, gradient fade, selection count (`2/3 선택됨`), full-width "다음" button

### Screen 3: IntensityScreen (`03-intensity.html`)
- **Purpose**: Adjust intensity sliders for each selected emotion
- **Fixed width**: `w-[430px]` container (viewport meta: `width=430`)
- **Background**: `bg-gradient-to-b from-primary/5 via-background-light to-background-light`
- **Decorative blurs**: Two absolute-positioned blur circles (`bg-primary/5` and `bg-primary/10`, `blur-3xl`)
- **Progress**: Step 2/4, `w-50%` fill
- **Emotion cards**: `bg-white p-8 rounded-2xl shadow-sm border border-primary/5`
  - Icon circle: `w-20 h-20 bg-primary/10 rounded-full` (first card larger than second: w-16 h-16)
  - Slider: Custom CSS — `h-1.5 bg-primary/20` track, `h-1.5 bg-primary` fill, `w-6 h-6 bg-primary border-4 border-white rounded-full shadow-lg` thumb
  - Labels: 5 levels — 살짝, 조금, 보통, 꽤, 매우 (active label: `text-primary font-bold`)
- **CTA**: `bg-primary text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/20` (note: `rounded-xl` not `rounded-full`)
- **Icons**: `sentiment_dissatisfied`, `bolt`, `arrow_back`, `arrow_forward`

### Screen 4: ContextScreen (`04-context.html`)
- **Purpose**: Select situation/context for the emotion
- **Background**: `bg-white` container in `max-w-[430px]`
- **Progress**: Step 3/4, 75% fill
- **Selection grid**: `grid grid-cols-2 gap-4`, cards with `p-5 rounded-xl`
  - Default: `bg-white border-2 border-transparent shadow-sm`
  - Selected: `bg-primary/5 border-2 border-primary shadow-lg shadow-primary/10`
  - Icon circles: `w-16 h-16 rounded-full bg-slate-50` (default) / `bg-primary/10` (selected)
- **Context options & icons**:
  - 직장/학교: `corporate_fare`
  - 연인/가족: `favorite`
  - 대인관계: `groups`
  - 돈/미래: `savings`
  - 혼자만의 시간: `self_improvement`
  - 모르겠음: `help_outline`
- **CTA**: `bg-primary text-white font-bold py-4 rounded-full` with `auto_awesome` icon
- **Icons**: `arrow_back`, `auto_awesome`

### Screen 5: AnalysisScreen (`05-analysis.html`)
- **Purpose**: Loading/analysis animation screen (dark theme)
- **Background**: `.bg-custom-gradient` — `radial-gradient(circle at center, #2e1065 0%, #161022 100%)`
- **Fixed dimensions**: `w-[430px] h-[932px]` container
- **Decorative glows**: Two absolute blur circles (`bg-primary/20 blur-[100px]`, `bg-primary/10 blur-[80px]`)
- **Progress ring**: SVG circles, `r=45`, `stroke-dasharray="283"`, `stroke-dashoffset="100"` (for ~65% progress)
  - Track: `text-primary/10 stroke-current`
  - Fill: `text-white/80 stroke-current`
- **Center icon**: `mail` icon at 84px, ultra-light weight (`font-variation-settings: 'FILL' 0, 'wght' 100, 'GRAD' 0, 'opsz' 48`)
- **Text**: All white — `text-white text-2xl font-medium` heading, `text-white/40 text-xs italic` subtitle
- **Step dots**: 4 dots, active one has `shadow-[0_0_8px_white]`
- **Branding**: "Mood Apothecary" in `text-[10px] uppercase tracking-[0.2em]`
- **Icons**: `mail`, `check_circle`, `auto_awesome`

### Screen 6: PrescriptionScreen (`06-prescription.html`)
- **Purpose**: Display the personalized prescription card
- **Background**: `bg-background-light` override to `#FCF9F2` (warm cream)
- **Extra font**: `Noto Serif KR` for prescription header (`font-serif-ko`)
- **Extra color**: `paper: #FFFFFF`
- **Card**: `max-w-[382px] bg-paper rounded-2xl shadow-xl border border-slate-200/50 paper-texture` (textured background image)
- **Header**: "처방전" in `font-serif-ko text-3xl font-bold text-primary`, "Prescription" subtitle with decorative lines
- **Patient info grid**: 2-col grid with `text-xs` labels in `text-slate-400`
- **Diagnosis badge**: `bg-primary/5 rounded-xl p-5 border border-primary/10 text-center`
- **Prescription items**: Row layout with `size-12 bg-slate-50 rounded-full` icon, timing pills:
  - 즉시: `bg-red-50 text-red-600`
  - 30분 내: `bg-blue-50 text-blue-600`
  - 오늘 중: `bg-green-50 text-green-600`
- **Caution note**: `bg-amber-50/50 p-3 rounded-lg` with `warning` icon in `text-amber-500`
- **Stamp**: Absolute bottom-right, `border-4 border-primary rounded-full rotate-12 opacity-20`, "MOOD CLINIC" text
- **Actions**: Primary solid button + outlined secondary button (`border-2 border-primary text-primary rounded-2xl`)
- **Icons**: `arrow_back`, `more_vert`, `air`, `coffee`, `favorite`, `schedule`, `warning`, `play_circle`, `share`

### Screen 7: ChecklistScreen (`07-checklist.html`)
- **Purpose**: Track prescription task completion
- **ALTERNATE THEME** — completely different design tokens:

| Token | Value |
|-------|-------|
| `primary` | `#D67D61` (terracotta) |
| `background-light` | `#fcf9f4` (warm cream) |
| `background-dark` | `#1f1613` |
| `success-muted` | `#e8f5e9` |
| `success-deep` | `#4caf50` |

- **Fonts**:
  - Headlines: `Newsreader` (serif, italic) — `font-display`
  - Body: `Manrope` (sans-serif) — `font-sans`
  - CDN: `https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800`
- **Border radius**: Larger defaults — `DEFAULT: 1rem`, `lg: 2rem`, `xl: 3rem`
- **Progress ring**: SVG, `r=70`, `stroke-width=8`, `stroke-dasharray="440"`, `stroke-dashoffset="293"` (33%)
- **Task states**:
  - Completed: `bg-success-muted border border-success-deep/20`, green checkmark circle, strikethrough text
  - In-progress (NOW DOING): `bg-white border-2 border-primary shadow-lg scale-[1.02] ring-4 ring-primary/5`, terracotta "시작하기" button
  - Upcoming: `bg-slate-100/50 border border-slate-200 opacity-60`, lock icon
- **Bottom nav**: Fixed, 4 tabs — 홈(`home`), 처방(`assignment_turned_in` filled), 기록(`history`), 설정(`settings`)
- **Icons**: `arrow_back`, `more_vert`, `check`, `verified`, `schedule`, `play_arrow`, `lock`, `home`, `assignment_turned_in`, `history`, `settings`

### Screen 8: FeedbackScreen (`08-feedback.html`)
- **Purpose**: Post-prescription mood feedback + history
- **Background**: `bg-white` container, standard purple theme
- **Mood scale**: 5 face icons in a row — `sentiment_very_dissatisfied`, `sentiment_dissatisfied`, `sentiment_neutral`, `sentiment_satisfied`, `sentiment_very_satisfied`
  - Default: `size-14 rounded-full bg-slate-100`
  - Selected (좋아): `size-16 rounded-full bg-primary/10 border-2 border-primary shadow-[0_0_15px_rgba(91,19,236,0.3)]`, filled icon (`FILL 1`)
- **Emotional shift card**: `bg-primary/5 rounded-2xl p-5 border border-primary/10`
  - Before/After comparison with stacked circle avatars
  - Arrow: `trending_up` icon between columns
- **Memo textarea**: `bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[120px]`, maxlength 50, character counter
- **Weekly history**: 5-day row of circle avatars with date labels and mood descriptions
  - Filled day: `border-2 border-primary/20` or `border-primary/30 bg-primary/5`, filled sentiment icon
  - Empty day: `border-2 border-dashed border-slate-200 opacity-40`, `add` icon
- **Bottom nav**: 4 tabs — 홈(`home`), 기록(`history` filled), 처방(`medication`), 프로필(`person`)
- **Icons**: `arrow_back`, `sentiment_very_dissatisfied`, `sentiment_dissatisfied`, `sentiment_neutral`, `sentiment_satisfied`, `sentiment_very_satisfied`, `potted_plant`, `cloud`, `sunny`, `auto_awesome`, `trending_up`, `chevron_right`, `add`, `home`, `history`, `medication`, `person`

---

## CDN Dependencies Summary

```html
<!-- Tailwind CSS -->
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

<!-- Fonts: Main theme (screens 1-6, 8) -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet"/>

<!-- Font: Prescription header (screen 6) -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;700&display=swap" rel="stylesheet"/>

<!-- Fonts: Checklist theme (screen 7) -->
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Manrope:wght@200..800&display=swap" rel="stylesheet"/>

<!-- Icons -->
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
```

---

## Implementation Notes

1. **Screen 7 has its own theme** — the React component must override the global theme tokens (primary color, fonts, border radii). Consider a `ChecklistThemeProvider` wrapper or scoped CSS variables.
2. **Screen 5 is dark-only** — uses `bg-custom-gradient` with no light/dark toggle.
3. **Screen 6 uses `#FCF9F2` background** — different from the standard `#f6f6f8`. The prescription card needs the `.paper-texture` background image from Google CDN.
4. **Slider on Screen 3** is CSS-only (not `<input type="range">`) — implement with a custom React slider component.
5. **Progress bars** vary: some use `rounded-full` buttons, others use `rounded-xl`. Match per screen.
6. **Bottom navigation** appears on screens 7 and 8 only (fixed position, 4 tabs).
7. **Filled icons** (`FILL 1`) are used sparingly — only for selected/active states in bottom nav and feedback faces.
