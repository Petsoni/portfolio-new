Plan first. For each task, list the files you will touch before editing. Find code by the selectors seen in production:
.experience-row, .hero-link-peek, .hero-peek-page, .hero-peek-tile
.dropdown-trigger, .multistate-button, .variant-switcher-option, .slider
[data-sound], [data-haptic], [aria-haspopup="dialog"]
Tokens, not raw values. Color, spacing, radius, type, shadow, duration and easing come from tokens. If a value has no token, add it to the token file and say so in the summary. Never invent one silently.
No !important, no magic numbers, no div soup, no disabling focus outlines.
Motion: transform and opacity only. UI transitions 150–300ms, ease-out or springs for entering, interruptible. Every animation respects prefers-reduced-motion.
Semantic HTML first, ARIA only where HTML can't do it.
No new dependencies unless the benefit is significant; state it when you add one. Radix is already in Petar's stack and is fine to use.
Never invent content: metrics, roles, dates or URLs. Leave TODO(petar): … markers.
One task = one commit, conventional commit message. Run the verification for that task before committing.
Keep the visual direction. The minimal look is good; these fixes are about hierarchy, behavior and content, not a restyle.