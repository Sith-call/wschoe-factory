# Market Research: haru-gratitude-diary (하루 감사 일기)

**Date:** 2026-04-10
**Analyst:** PM Data Analytics
**App Concept:** 매일 감사한 일 3가지를 기록하고 주간 회고로 돌아보는 최소주의 감사 일기 앱

---

## 1. Market Sizing: TAM / SAM / SOM

### 1-1. TAM (Total Addressable Market)

| Metric | Value | Source |
|--------|-------|--------|
| Global mindfulness meditation app market (2025) | USD 2.69B | Verified Market Reports |
| Global gratitude journal app market (2024) | USD 310-313M | Growth Market Reports / Dataintelo |
| Global gratitude journal app CAGR (2025-2033) | 11.8-15.2% | Growth Market Reports / Dataintelo |
| Projected global gratitude journal app market (2033) | USD 864M - 1.11B | Multiple reports |

**TAM Estimate:** The total global addressable market for gratitude journaling apps sits at approximately **USD 350-380M in 2026**, growing at 12-15% annually. Within the broader mindfulness app market (USD 2.7B+), gratitude journaling occupies roughly 12-14% of the total value.

### 1-2. SAM (Serviceable Addressable Market) -- Korea Focus

| Metric | Value | Source |
|--------|-------|--------|
| South Korea mindfulness meditation app market (2024) | USD 180.65M | Expert Market Research |
| South Korea mindfulness app CAGR (2025-2034) | 8.40% | Expert Market Research |
| South Korea projected value (2034) | USD 404.70M | Expert Market Research |
| Korea smartphone penetration | 97%+ | Statista |

**SAM Estimate:** Applying the global gratitude-journal share (12-14%) to the Korean mindfulness app market yields a Korea gratitude journaling SAM of approximately **USD 22-26M in 2026**. This includes both subscription and freemium revenue models.

### 1-3. SOM (Serviceable Obtainable Market)

Given that haru-gratitude-diary enters as a new, minimalist entrant in a market with established players (마보, 마인드카페/코끼리), a realistic SOM target:

| Scenario | Market Share | Revenue Estimate (Year 1) |
|----------|-------------|---------------------------|
| Conservative | 0.5-1% of Korea SAM | USD 110K-260K |
| Moderate | 1-3% of Korea SAM | USD 260K-780K |
| Aggressive | 3-5% of Korea SAM | USD 780K-1.3M |

**SOM Recommendation:** Target the moderate scenario (1-3%) with a free-to-use core + optional premium subscription model. A differentiated minimalist UX and Korean-first design can capture underserved users who find existing apps too complex or too expensive.

---

## 2. Competitor Landscape

### 2-1. Global Competitors

#### Five Minute Journal (Intelligent Change)

| Attribute | Detail |
|-----------|--------|
| Platform | iOS, Android |
| Pricing | Free (basic) / USD 9.99/mo or USD 39.99/yr (premium) |
| Downloads | 1M+ |
| Core UX | Structured morning + evening prompts based on bestselling physical journal |
| Strengths | Strong brand recognition from physical product; proven gratitude framework; clean design |
| Weaknesses | No AI insights; no voice transcription; limited export; premium cost is high for Korean market |
| Differentiation gap | English-first; no Korean localization; no weekly reflection feature |

#### Day One

| Attribute | Detail |
|-----------|--------|
| Platform | iOS, Android, macOS, Windows, Web |
| Pricing | Free (basic) / USD 24.99-34.99/yr (premium) |
| Downloads | 5M+ |
| Core UX | General-purpose journal with rich media (photos, video, audio, maps) |
| Strengths | Cross-platform; E2E encryption; rich media; Apple Watch support; mature product |
| Weaknesses | Not gratitude-specific; feature-heavy (intimidating for minimalist users); English-focused |
| Differentiation gap | Too general-purpose; no guided gratitude prompts; no weekly reflection summaries |

#### Gratitude: Self-Care Journal (Gratefulness.me)

| Attribute | Detail |
|-----------|--------|
| Platform | iOS, Android |
| Pricing | Free (basic) / USD 29.99-59.99/yr (premium) |
| Downloads | 5M+ |
| Core UX | Daily gratitude prompts, affirmations, vision board, gratitude tree visualization |
| Strengths | Large user base; gamification (gratitude tree); affirmation integration |
| Weaknesses | Feature bloat (vision board, affirmations, worksheets); not minimalist; English-first |
| Differentiation gap | Tries to do too much; no Korean language; weekly review is not a core feature |

#### Presently

| Attribute | Detail |
|-----------|--------|
| Platform | Android only |
| Pricing | Free (fully free, open-source) |
| Downloads | 100K+ |
| Core UX | Minimalist daily gratitude entries with timeline view |
| Strengths | Truly minimalist; privacy-focused (local data only); free; 4.9 star rating |
| Weaknesses | Android only; no iOS; no analytics or reflection features; small team |
| Differentiation gap | Closest competitor in philosophy but lacks weekly reflections, trend visualization, iOS support |

### 2-2. Korean Domestic Competitors

#### 마보 (Mabo)

| Attribute | Detail |
|-----------|--------|
| Platform | iOS, Android |
| Pricing | Free (basic) / Subscription (premium meditation content) |
| Users | 950K downloads, 450K+ registered users |
| Core UX | Guided meditation with post-meditation diary; community sharing |
| Strengths | First Korean meditation app (2016); strong brand in Korea; meditation diary feature |
| Weaknesses | Meditation-centric, not gratitude-focused; diary is secondary to meditation; complex feature set |
| Differentiation gap | Does not address daily gratitude practice; no structured 3-item gratitude format; no weekly reflection |

#### 마인드카페 (MindCafe) + 코끼리 (Kokkiri)

| Attribute | Detail |
|-----------|--------|
| Platform | iOS, Android |
| Pricing | Free community / Paid counseling sessions |
| Users | 2M+ (마인드카페), 450K (코끼리) |
| Core UX | Anonymous mental health community + AI assessment + counseling + meditation (post-코끼리 acquisition) |
| Strengths | Largest Korean mental health platform; comprehensive mental care ecosystem; professional counseling |
| Weaknesses | Heavy and complex; counseling-focused (not daily journaling); not a lightweight daily habit tool |
| Differentiation gap | Overkill for users who just want a simple daily gratitude practice; no minimalist journaling focus |

#### Meditopia

| Attribute | Detail |
|-----------|--------|
| Platform | iOS, Android |
| Pricing | Free trial / USD 59.99/yr |
| Users | 30M+ globally |
| Core UX | Meditation, sleep stories, mood tracking in 10+ languages including Korean |
| Strengths | Multi-language; large content library; sleep + meditation bundle |
| Weaknesses | Expensive; meditation-centric; gratitude is a minor sub-feature; subscription fatigue |
| Differentiation gap | Gratitude journaling is buried inside a large meditation platform; not purpose-built for daily gratitude |

### 2-3. Competitive Positioning Map

```
                High Complexity
                     |
    마인드카페 ------+------ Day One
    Meditopia        |
                     |
    마보       Gratitude App
                     |
  ───────────────────+─────────────────
  Meditation-        |         Gratitude-
  Focused            |          Focused
                     |
    코끼리           |     Five Minute Journal
                     |
               Presently
                     |
            * haru-gratitude-diary *
                     |
                Low Complexity
```

**haru-gratitude-diary targets the bottom-right quadrant: gratitude-focused + low complexity.** This is the least contested space in the Korean market where no domestic competitor currently operates.

---

## 3. Market Trends

### 3-1. Mindfulness App Growth

- The global mindfulness meditation app market is projected to grow at a CAGR of 24.75% from 2026-2033, reaching well beyond USD 10B.
- The gratitude journal app sub-segment is growing at 12-15% CAGR, indicating strong but sustainable growth without hype-cycle risk.
- Korea's mindfulness app market (USD 180M in 2024) is growing at 8.4% CAGR, slower than global but stable, indicating a maturing market with room for niche entrants.

### 3-2. MZ Generation (Korean Gen Z + Millennials) Mental Health

- Korean MZ generation actively seeks digital tools for daily mental health management, preferring apps that integrate into daily routines over formal counseling.
- 2025 trend reports highlight that MZ users in Korea favor "micro-wellness" -- short, daily mental health activities (5 minutes or less) over long meditation sessions.
- MZ consumers represent roughly 25% of wellness consumers but over 40% of market spend (McKinsey), making them the most valuable demographic for wellness apps.
- The 13-18 age group is the fastest-growing segment for mindfulness apps globally (2026-2033 forecast), suggesting an emerging Gen Alpha pipeline.

### 3-3. Post-Pandemic Mental Health Awareness in Korea

- COVID-19 accelerated mental health awareness across all demographics in Korea. The government has increased ESG-aligned mental health initiatives.
- Digital mental care market grew 18.4% YoY in 2024 (from USD 17.06B to USD 20.1B globally), with Korea following the trend.
- The stigma around mental health apps has significantly decreased in Korea, with "마음 건강" (mental health) becoming a normalized consumer category.
- The Korean government has pushed for digital health solutions, creating a regulatory tailwind for wellness apps.

### 3-4. Minimalism and Journaling Trends

- The global journaling app market is expanding as users seek alternatives to social media for personal expression.
- "Less is more" design philosophy is gaining traction, with users increasingly rejecting feature-bloated wellness apps.
- Physical gratitude journals (paper-based) remain a strong category in Korea (Kyobo, Yes24 bestsellers), indicating proven demand for the gratitude practice format -- but no dominant digital Korean-language equivalent exists.

---

## 4. Key Opportunity Gaps

### Gap 1: No Korean-first minimalist gratitude journal app exists

The most critical finding: **there is no purpose-built, Korean-language, minimalist gratitude journal app in the Korean market.** Every existing Korean mental health app (마보, 마인드카페, 코끼리) is either meditation-focused or a comprehensive mental health platform. Global gratitude apps (Five Minute Journal, Gratitude, Presently) are English-first without meaningful Korean localization.

**Opportunity:** Be the first Korean-native minimalist gratitude journal. This is a blue ocean in the domestic market.

### Gap 2: Weekly reflection is a missing feature

Most gratitude apps focus on daily input (write 3 things) but lack a meaningful weekly reflection/review mechanism. Users log entries but never revisit them. This reduces long-term engagement and the perceived value of the habit.

**Opportunity:** Build weekly reflection as a core feature, not an afterthought. Summarize the week's gratitude entries, highlight patterns, and prompt deeper reflection.

### Gap 3: Subscription fatigue in the wellness space

Korean users are experiencing subscription fatigue. Meditopia (USD 60/yr), Five Minute Journal (USD 40/yr), and even 마보's premium tiers face resistance. Users want value without ongoing cost commitment.

**Opportunity:** Offer a generous free tier with the core 3-gratitude-items + weekly reflection completely free. Monetize through optional premium features (data export, custom themes, AI-powered weekly insights) at a significantly lower price point (USD 15-20/yr or USD 2.99/mo).

### Gap 4: Habit formation UX is under-designed

Existing apps treat gratitude journaling as content creation rather than habit building. They lack streak visualization, gentle nudges, or celebration mechanics that reinforce the daily habit without becoming gamification noise.

**Opportunity:** Design for habit formation first. Minimal but effective streak tracking, a calm daily reminder system, and subtle progress visualization (e.g., a growing seasonal tree or filling calendar) that rewards consistency without overwhelming the user.

### Gap 5: Privacy-conscious local-first data storage

Korean users are increasingly privacy-conscious, especially with mental health data. Most competitors require account creation and cloud storage, creating friction and trust concerns.

**Opportunity:** Default to local-only data storage with optional cloud backup. No mandatory account creation. This aligns with the minimalist philosophy and builds trust with privacy-sensitive users.

---

## 5. Data-Driven Recommendation

**What the data says:**

1. The gratitude journal app market (USD 350-380M globally, USD 22-26M in Korea) is growing at 12-15% CAGR with no dominant Korean-native player in the minimalist journaling niche.
2. Korean MZ users actively seek micro-wellness tools but are underserved by existing apps that are either meditation-centric (마보, 코끼리) or overly complex (마인드카페, Day One).
3. The competitive landscape has a clear gap in the "gratitude-focused + low complexity" quadrant for the Korean market.
4. Weekly reflection -- a core differentiator of haru-gratitude-diary -- is absent from virtually all competitors.

**Confidence level:** HIGH for market opportunity; MEDIUM for revenue projections (dependent on monetization model execution and user acquisition strategy).

**Recommended action:** Proceed with haru-gratitude-diary development targeting the Korean MZ demographic (25-39) with the following strategic priorities:

- **P0:** Korean-native minimalist UX with zero-friction onboarding (no signup required)
- **P0:** Core loop = daily 3-gratitude entries + weekly reflection summary
- **P1:** Habit formation mechanics (streaks, gentle reminders, seasonal progress visualization)
- **P1:** Free-first monetization (core features free, premium at USD 1,900-2,900/mo KRW)
- **P2:** Local-first data storage with optional cloud sync
- **P2:** AI-powered weekly insight summaries (premium feature)

**Go/No-Go:** GO -- the market gap is clear, the TAM is sufficient, and the minimalist positioning is defensible against feature-heavy incumbents.
