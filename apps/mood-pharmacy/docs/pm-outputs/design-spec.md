# 감정 처방전 (Mood Pharmacy) — Design Specification

## Stitch Project
- **Project ID**: `8803207077034647694`
- **Project Name**: 감정 처방전 Mood Pharmacy v3

## Design System

### Primary Theme (Screens 1-6, 8)
- **Primary Color**: #5b13ec (deep purple)
- **Background**: #f6f6f8 (light gray) / #FCF9F2 (warm cream for prescription)
- **Dark Background**: #161022 (deep purple-black, analysis screen only)
- **Font Family**: Plus Jakarta Sans + Noto Sans KR
- **Border Radius**: 0.5rem (cards), 9999px (buttons/pills)
- **Icons**: Material Symbols Outlined

### Checklist Theme (Screen 7)
- **Primary Color**: #D67D61 (terracotta)
- **Background**: #fcf9f4 (warm cream)
- **Headline Font**: Newsreader (serif, italic)
- **Body Font**: Manrope (sans-serif)
- **Success Color**: #4caf50 / #e8f5e9

## Screen Inventory

| # | Screen | Stitch Screen ID | Component |
|---|--------|------------------|-----------|
| 1 | IntroScreen | d38e065372fb477bb9360f2d4f812dd9 | IntroScreen.tsx |
| 2 | EmotionSelectScreen | a734e2ab4c4445e7a1dae510a68917d7 | EmotionSelectScreen.tsx |
| 3 | IntensityScreen | f2eab3777dad4be1aec76631979802b7 | IntensityScreen.tsx |
| 4 | ContextScreen | 176d8f3cd9dd4251906afdc45daad81d | ContextScreen.tsx |
| 5 | AnalysisScreen | 1f1a4f4aee4c4d46843264e42911a324 | AnalysisScreen.tsx |
| 6 | PrescriptionScreen | 109e41a28b234a329689a86baaafbe71 | PrescriptionScreen.tsx |
| 7 | ChecklistScreen | a4396d2e669c43db99a254e5f16f0ee0 | ChecklistScreen.tsx |
| 8 | FeedbackScreen | b9f6e24b424d4f28b9f1542882c2f01d | FeedbackScreen.tsx |

## Design Sync Strategy
- Tailwind CDN (not npm) used in index.html to match Stitch HTML output exactly
- Stitch HTML source files stored in docs/pm-outputs/ as ground truth
- Paper texture for prescription card loaded from Google CDN
- Checklist screen uses arbitrary Tailwind values (e.g., `text-[#D67D61]`) for its alternate theme

## Stitch Prompt Guidelines
- No emojis in prompts
- Describe mood, atmosphere, visual metaphors in rich text
- Let Stitch decide specific design decisions (colors, icons, layout details)
- Reference existing screens for consistency: "Use the existing theme"
