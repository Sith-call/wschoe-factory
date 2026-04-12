# Ground Truth Source Audit Trail

**Date:** 2026-04-10
**Stitch Project ID:** 9878554332885103513

## Screen Sources

| Screen | Source | Notes |
|--------|--------|-------|
| home | Stitch MCP (GEMINI_3_1_PRO) | Direct inline response |
| entry | Stitch MCP (GEMINI_3_1_PRO) | Direct inline response |
| calendar | HTML/CSS fallback | Stitch timeout, 3 polls failed |
| detail | HTML/CSS fallback | Stitch timeout |
| weekly-reflection | HTML/CSS fallback | Agent-generated HTML |
| onboarding | HTML/CSS fallback | Agent-generated HTML |
| settings | HTML/CSS fallback | Agent-generated HTML |

## Summary

- **Stitch-sourced screens:** 2 (home, entry)
- **HTML/CSS fallback screens:** 5 (calendar, detail, weekly-reflection, onboarding, settings)
- **Total ground-truth PNGs:** 7

Stitch MCP was intermittently available — some calls returned inline, others timed out with no server-side result after 3 poll attempts (~4.5 min each). The HTML fallback path was used per Phase 2a.3-fallback in the stitch-generate skill.

All fallback HTML mockups follow the "Evening Calm" design system (light cream #fefcf4, sage green #4d644e, Manrope font) and comply with DESIGN_RULES.md anti-patterns.
