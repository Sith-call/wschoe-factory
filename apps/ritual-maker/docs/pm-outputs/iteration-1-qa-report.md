# Ritual Maker - Iteration 1 QA Report

**Date:** 2026-03-20
**Tester:** Automated QA (Playwright + Code Review)
**Build:** Production build successful (23 modules, 234.62 kB gzip: 70.87 kB)
**Server:** Vite v8.0.1, dev mode
**Viewport:** 430x932 (mobile)

---

## Test Summary

| Category | Result |
|----------|--------|
| Build (tsc + vite) | PASS |
| Console errors | PASS (0 errors) |
| Home screen render | PASS |
| Quest screen render | PASS |
| Skill tree screen render | PASS |
| Guild screen render | PASS |
| Profile screen render | PASS |
| Boss battle screen render | PASS |
| Navigation (bottom bar) | PASS |
| Quest completion interaction | PASS |
| Boss battle interaction | PASS |
| LocalStorage persistence | PASS |

**Overall: PASS (12/12)**

---

## Screen-by-Screen Results

### 1. Home Screen
- Character card displays correctly with class emoji, name ("모험가"), level (Lv.3), title ("루틴 워커")
- XP bar renders with correct fill (EXP value / xpToNext)
- 4 stat bars (체력/지력/정신력/민첩) render with colored progress bars
- Streak counter ("3일 연속 스트릭") displays correctly
- Today's completion percentage ("38%") displays
- Quest summary shows morning (3/3), afternoon (0/1), evening (0/4) slots
- Morning slot shows completed state (green border) when 3/3 done
- Quick action buttons (스킬트리, 보스배틀, 길드) all functional
- Bottom nav bar renders 5 items with correct labels and emojis

### 2. Quest Screen
- Time slot tabs (아침/오후/저녁) render correctly with completion counts
- Auto-selects current time slot on load (afternoon during test)
- Quest card displays ritual name, category badge, XP reward, and description
- Class bonus hint shows at bottom ("전사 클래스 보너스: 체력 루틴 XP +20%")
- Quest completion works: tapping uncompleted quest shows "오후 퀘스트 완료!" banner with bonus XP
- Completed quest shows checkmark icon and strikethrough text
- Header shows cumulative "+90 XP 오늘 획득" after completions

### 3. Skill Tree Screen
- Header shows unlock count (4/13 해금됨)
- 4 tiers render: 초급(Tier 1), 중급(Tier 2), 고급(Tier 3), 전설(Tier 4)
- Unlocked skills (Tier 1) show amber/gold styling with glow effect
- Locked skills show lock icon, opacity reduction, and level requirement text
- Legend at bottom explains unlock states
- Connection lines between tiers render

### 4. Guild Screen
- Guild stats header: 6 members, Lv.4, 64 total streak
- Ranking list shows all members sorted by level (이지은 Lv.7 at #1)
- Player entry ("모험가 (나)") highlighted with amber border at rank 6
- Weekly guild challenge section with progress bar (3/5)
- "친구 초대하기" button at bottom

### 5. Profile Screen
- Character portrait with class gradient background
- Stats detail section with descriptions for each stat
- Activity summary: total XP (330), completions (14), days (3), skills (4)
- Category breakdown chart with proportional bars
- 7-day calendar showing recent activity

### 6. Boss Battle Screen
- Intro phase: Boss emoji (green slime), name, weakness, reward info
- Weekly stats display: completions (14), XP (330), base damage (112 DMG)
- Battle phase: HP bar with color transitions, 3 reflection questions
- Textarea inputs accept text, damage calculation updates live
- Attack button shows total damage, disabled until 1+ answer provided
- Victory phase renders on boss defeat with reward display

---

## Issues Found

### Minor Issues (non-blocking)

1. **BossBattleScreen: `character` prop passed but not used**
   - `App.tsx` line 188 passes `character={state.character}` to `BossBattleScreen`
   - `BossBattleScreen.tsx` Props interface does not include `character`
   - TypeScript may emit a warning depending on strict mode; currently no build error since extra props are silently ignored in JSX

2. **Quest XP float animation positioned incorrectly**
   - `QuestScreen.tsx` line 141: `animate-floatUp` uses `position: absolute` but the parent button does not have `position: relative`
   - The "+XP!" animation text may appear outside the card boundary or in an unexpected position
   - **Severity:** Low visual glitch, only visible for ~1 second during animation

3. **Streak logic does not increment properly**
   - `App.tsx` lines 114-118: streak calculation sets `streak` to `prev.character.streak` unchanged when yesterday has completions, rather than incrementing by 1
   - The ternary on line 118 always evaluates to 0 (condition: `updatedLog.completions.length === 1 ? 0 : 0`)
   - Streak counter remains at seed value (3) and never grows
   - **Severity:** Functional bug but does not cause crashes

4. **Skill tree "해금 가능" skills cannot actually be unlocked**
   - `SkillTreeScreen.tsx` shows "해금 가능!" text but has no click handler to toggle `unlocked` state
   - Legend says "⬜ 해금 가능 — 조건 충족, 탭하여 해금" but tapping does nothing
   - **Severity:** Feature incomplete, UX mismatch with legend text

5. **Guild challenge progress is hardcoded**
   - `GuildScreen.tsx` line 99: progress bar is fixed at 60% (style `width: '60%'`) and count is static "3/5"
   - Not connected to actual streak data
   - **Severity:** Demo limitation, acceptable for MVP

6. **Tailwind CSS loaded via CDN**
   - `index.html` loads Tailwind via `cdn.tailwindcss.com` script tag
   - This is not recommended for production (performance, reliability)
   - Should use PostCSS build pipeline for production deployment
   - **Severity:** Build/deploy concern, fine for demo

7. **Viewport meta uses fixed width 430**
   - `<meta name="viewport" content="width=430, ...">`
   - Non-standard viewport; may cause unexpected scaling on devices with different widths
   - Standard practice: `width=device-width`

---

## Screenshots

All screenshots saved to `docs/pm-outputs/`:
- `screenshot-home.png` - Home screen
- `screenshot-quest.png` - Quest screen (afternoon tab)
- `screenshot-quest-complete.png` - Quest completion with banner
- `screenshot-skill-tree.png` - Skill tree (Tier 1-2 visible)
- `screenshot-guild.png` - Guild ranking
- `screenshot-profile.png` - Profile with stats
- `screenshot-boss-battle.png` - Boss intro phase
- `screenshot-boss-fight.png` - Boss battle phase with reflection questions

---

## Recommendations for Next Iteration

1. **Fix streak logic** - Implement proper day-over-day streak counting
2. **Add skill unlock interaction** - Let users tap to unlock available skills
3. **Connect guild challenge to real data** - Calculate from actual member streaks
4. **Add quest completion animation fix** - Set `position: relative` on quest button
5. **Migrate Tailwind to build pipeline** - Replace CDN with PostCSS for production
6. **Add onboarding/class selection** - Currently hardcoded to "warrior" class
