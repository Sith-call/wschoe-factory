# UX Specialist Review -- Iteration 1

**App**: 하루 감사 일기 (Haru Gratitude Diary)
**Date**: 2026-04-11
**Viewport**: 430x932 (mobile-first)

---

## Flow Analysis

### Time to First Value
- **New user**: Onboarding (2 slides) -> "시작하기" -> Entry page -> type 1+ items -> save = **4 steps, ~30 seconds**
- **Returning user (no entry today)**: Home shows CTA "오늘의 감사 쓰기" -> Entry page -> type -> save = **3 steps, ~20 seconds**
- **Returning user (entry exists)**: Home immediately shows today's 3 gratitudes = **0 steps (instant value)**

Assessment: Time to first value is excellent. The 2-slide onboarding is minimal and non-blocking (skip available). Returning users see value immediately on home.

### Friction Points
1. **"이번 주 회고 보기" button (Home)**: Appears as a text link with no button affordance. Height = 20px, far below 44px WCAG minimum. Users will struggle to tap on mobile.
2. **"삭제" button (Detail page)**: Width = 24px. Positioned at bottom-left corner with no visual containment. Extremely difficult to tap accurately.
3. **Onboarding dots**: w-2 h-2 = 8x8px. While they have no critical function (can swipe/tap "다음"), they violate WCAG touch target guidance.
4. **No "write new entry" CTA when today's entry exists**: Once written, home shows the entry as read-only. There's no visible way to add/edit from home -- user must tap the entry card, then tap "수정". This 2-step indirection is unexpected.

### Drop-off Risk Points
1. **Detail -> Edit flow**: After tapping "수정" the page toggles inline editing with no visual confirmation that editing mode is active. Users may not realize they're in edit mode.
2. **Delete placement**: "삭제" is in the bottom-left corner with no visual hierarchy or color background -- just red text. Accidental taps are possible, though the confirm dialog mitigates data loss.
3. **Tablet/Desktop layout**: Content is left-aligned with no max-width constraint on the home layout, resulting in poor visual balance on screens wider than 500px.

---

## Screen-by-Screen UX Issues

### Home (/)
| Issue | Severity | Detail |
|-------|----------|--------|
| "이번 주 회고 보기" touch target | HIGH | 93x20px -- height 20px violates 44px WCAG minimum |
| Weekly dots non-interactive | LOW | w-8 h-8 = 32x32px dots look tappable (filled circles) but are plain divs. Users may try to tap them to navigate to that day's entry |
| "오늘의 감사" label text size | LOW | 12px -- meets minimum but could be more readable at 14px |
| No edit shortcut | MEDIUM | When entry exists, only way to edit is tap card -> tap "수정". Consider a small edit icon on the card |

Evidence: `/tmp/ralph-iter-1/ux/home.png`

### Detail (/detail/:date)
| Issue | Severity | Detail |
|-------|----------|--------|
| "삭제" button width | HIGH | 24px wide -- WCAG violation. Needs min-w-[44px] or full-width destructive button |
| Edit mode lacks visual distinction | MEDIUM | Toggling to edit mode only changes text -> input. No header color change, no "편집 중" indicator |
| No save confirmation visual | LOW | After saving edits, toast appears briefly. Good pattern but toast timeout should be confirmed |

Evidence: `/tmp/ralph-iter-1/ux/detail-page.png`, `/tmp/ralph-iter-1/ux/today-gratitude.png`

### Calendar (/calendar)
| Issue | Severity | Detail |
|-------|----------|--------|
| Future dates disabled UX | LOW | Disabled dates are visually distinct (correct). Good pattern |
| No month summary | LOW | "이번 달 11일 기록" shown below calendar but feels disconnected from the grid |
| Navigation arrows | OK | 44x44px touch targets -- compliant |

Evidence: `/tmp/ralph-iter-1/ux/calendar.png`

### Weekly Review (/weekly)
| Issue | Severity | Detail |
|-------|----------|--------|
| Dense text layout | MEDIUM | 7 days x 3 items = 21 lines of gratitude text. No visual separation between days besides card boundaries. Cognitive load is high |
| Tab switching (지난주/이번주) | LOW | Tab labels are clear. Active state uses pill background -- good |

Evidence: `/tmp/ralph-iter-1/ux/weekly-full.png`

### Entry (/entry)
| Issue | Severity | Detail |
|-------|----------|--------|
| Placeholder text identical for all 3 fields | LOW | All say "감사한 일을 적어보세요". Could use varied prompts ("1번째 감사", "2번째 감사" etc.) or inspirational hints |
| Keyboard Enter flow | OK | Enter key moves to next input, then saves on last. Good micro-interaction |
| Save button disabled state | OK | Visual distinction between enabled/disabled is clear |

### Settings (/settings)
| Issue | Severity | Detail |
|-------|----------|--------|
| "데모 데이터 생성" visible to real users | LOW | This is a dev/demo feature. Should be hidden or moved to a debug menu |
| "모든 데이터 삭제" placement | MEDIUM | Directly below "데모 데이터 생성" with similar card styling. Risk of accidental tap on wrong button. Different visual treatment needed |

Evidence: `/tmp/ralph-iter-1/ux/settings.png`

### Responsive Layout
| Breakpoint | Issue |
|------------|-------|
| Mobile (375px) | Good -- content fills width appropriately |
| Tablet (768px) | Content not centered, left-aligned with excessive right whitespace |
| Desktop (1280px) | Same issue amplified -- no max-width container, content floats left |

Evidence: `/tmp/ralph-iter-1/ux/responsive-mobile.png`, `/tmp/ralph-iter-1/ux/responsive-tablet.png`, `/tmp/ralph-iter-1/ux/responsive-desktop.png`

---

## Top 3 Critical UX Issues

### 1. WCAG Touch Target Violations (HIGH)
Two interactive elements fail the 44x44px minimum:
- "이번 주 회고 보기": 93x20px (height 20px)
- "삭제": 24x44px (width 24px)

These make the app inaccessible for users with motor impairments and frustrating for all mobile users. The "삭제" button is a destructive action -- ironically, its tiny size reduces accidental deletion but creates an accessibility barrier.

**Fix**: Add `min-h-[44px] min-w-[44px] px-4 py-3` to both buttons. For "삭제", consider a full-width button with danger styling at the bottom of the page.

### 2. Edit Mode Lacks Clear Visual State (MEDIUM)
When users tap "수정" on the detail page, the inline toggle to edit mode has no visual header change. The transition from read -> edit is subtle (text becomes input fields) but:
- No "편집 중" label in header
- No cancel/save buttons visible until scrolling
- No color change to indicate state

**Fix**: Change header background or add an "편집 중" badge. Show cancel/save buttons fixed at bottom or in header.

### 3. Tablet/Desktop Responsive Layout (MEDIUM)
Content is left-aligned on wider viewports with no max-width container. The bottom nav stretches full width on desktop, which is a mobile-only pattern misapplied.

**Fix**: Add `max-w-md mx-auto` wrapper. On desktop, consider hiding the bottom nav or converting to a sidebar.

---

## Performance

| Metric | Value | Assessment |
|--------|-------|------------|
| DNS | 0ms | Local |
| TTFB | 1ms | Excellent |
| DOM Ready | 52ms | Excellent |
| Full Load | 81ms | Excellent |

Performance is not a UX concern for this app.

---

## Color & Typography Analysis

| Element | Color | Background | Size | Contrast Assessment |
|---------|-------|------------|------|---------------------|
| H1 (date) | rgb(54,57,45) | cream bg | 18px | Good contrast |
| Body text | rgb(54,57,45) | transparent | 14px | Acceptable |
| Sage accent | rgb(77,100,78) | transparent | 14px | Adequate on cream |
| Sub-labels | rgb(99,102,88) | transparent | 12px | Borderline -- 12px at this contrast may be hard to read in bright light |

Heading hierarchy: Only H1 is used (18px). No H2/H3 structure, which is acceptable for a single-screen SPA-style app but could improve screen reader navigation.

---

## Scores

| Dimension | Weight | Score | Key Issue |
|-----------|--------|-------|-----------|
| Information Architecture | 20% | 78 | Simple and clear 5-screen structure. Missing edit shortcut from home |
| Interaction Design | 25% | 62 | Two WCAG touch target violations. Edit mode state unclear |
| User Flow | 25% | 80 | Time to first value is excellent. Entry flow is clean |
| Cognitive Load | 20% | 82 | Minimal per-screen decisions. Weekly review is dense |
| Accessibility | 10% | 58 | Touch targets, 12px labels, single heading level |

**Weighted Total: 73/100**

---

## Improvement Suggestions (Priority Order)

### P0 -- Must Fix Before Ship
1. **Fix touch targets**: "이번 주 회고 보기" and "삭제" need min 44x44px
2. **Add visual edit mode indicator**: Header change or badge when editing

### P1 -- Should Fix
3. **Responsive max-width**: Add `max-w-md mx-auto` container for tablet/desktop
4. **Differentiate settings destructive actions**: Separate "데모 데이터 생성" from "모든 데이터 삭제" visually
5. **Weekly review readability**: Add day labels or visual dividers between daily entries

### P2 -- Nice to Have
6. **Varied input placeholders**: Different prompts for each gratitude slot
7. **Weekly dot interactivity**: Make home's weekly dots tappable to navigate to that day
8. **Sub-label font size**: Increase 12px labels to 14px for better readability
