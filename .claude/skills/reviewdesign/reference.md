# UI/UX Design Knowledge Base — Reference

> Source: 21 video transcripts by top UI/UX designers. Mention count per rule noted as [N/21].
> This file is the SINGLE SOURCE OF TRUTH for the reviewdesign skill. Do not invent rules outside this file.

---

## 1. TYPOGRAPHY

### 1.1 Font Selection & Pairing
- **Font = brand decision**. Arial/Times New Roman = amateur signal.
- **Anchor font** = headline font, sets personality. Pick first, then find support fonts.
- **3 levels**: L1 = one font family. L2 = super families (Source Sans/Serif/Code, DM Sans/Serif, Tato Sans/Slab). L3 = cross-foundry combos (advanced).
- **Pairing rule**: same world, different roles. Don't pair too-similar fonts (Georgia + Times = bad).
- **Variable fonts** with many weights = precise attention control.
- **Resource**: fontsinuse.com for pairing inspiration.

### 1.2 Font Sizes & Weights [16/21]
- **Max 4 font sizes, 2 font weights**. More = messy.
- Heading, subheading, body, caption — usually enough.
- Recommended: semi-bold headings, regular body.
- Display fonts for attention; legible fonts for reading. >7-10 words = legibility priority.

### 1.3 Line Height [8/21]
- **Headings**: 1.0-1.3x font size (Spotify production: exact 1:1 on headers).
- **Body**: 1.3-1.5x font size.
- Larger text = smaller ratio.
- Line height acts as implicit margin — can reduce explicit spacing needs.

### 1.4 Letter Spacing [6/21]
- **Headlines**: negative (-1px to -3px) for scanability.
- **Body**: 0px default — don't touch.
- **CTAs**: positive (+1px to +2px) — slows users down to read.
- Negative spacing ONLY on large headings — kills readability on small text.

### 1.5 Text Width [5/21]
- Body: **50-75 characters per line** (~600px desktop).
- Long lines = intimidating, users skip, fewer conversions.
- Break every 2-3 sentences.

### 1.6 Text Alignment [3/21]
- >3 lines = left align always.
- Short headings = center OK.
- **NEVER mix** center heading + left body (or vice versa).

---

## 2. COLOR

### 2.1 The 60/30/10 Rule [12/21]
- **60%** neutral (white, light gray, dark bg).
- **30%** brand/complementary.
- **10%** accent — **reserve for CTAs**.
- Everything screams = nothing gets attention.
- Tints/shades of ONE color > multiple colors.

### 2.2 Contrast & Accessibility [10/21]
- High contrast text always.
- Checker tools: Figma "Contrast" plugin, coolers.co.
- **WCAG compliance** required. Test on different devices.
- Brand color fails WCAG? Darken until pass.

### 2.3 Neutral Balance [4/21]
- Backgrounds stay in background — no bright bg colors.
- Light: neutral gray bg + white foreground.
- Dark: darker bg + slightly lighter foreground.
- **Brand-tint neutrals**: hint of brand color in gray (Headspace: orange-tinted cards).
- Sometimes border-only (no bg) is cleanest.

### 2.4 Avoid Pure Black & White [4/21]
- Dark gray > pure black for secondary text.
- Professional UIs use gray shades, not #000000.
- Dark mode: pure white ONLY for most important elements.
- Separates amateurs from pros.

### 2.5 Extending Brand Palette [3/21]
- **Analogous**: rotate on wheel (purple -> blue, pink).
- **Complementary**: across wheel (purple -> yellow).
- Real examples: Mailchimp (yellow + turquoise), Airbnb (bright + deep pink).

### 2.6 Semantic Colors [3/21]
- **Red** = destructive (delete, error). Always. Even if not brand color.
- **Green** = success.
- Keep red/green regardless of brand palette.
- Don't use brand color for destructive actions.

### 2.7 Element States [3/21]
- **Hover**: lighter/brighter.
- **Active/pressed**: darker.
- **Disabled**: desaturated + light gray + muted text.
- **Mobile**: no hover — press = slightly darker ("pressing into").

### 2.8 Dark Mode [3/21]
- NOT inverse of light. Separate palette.
- Brighten borders/cards (dark needs bigger differences).
- Light gray for body text (not white — easier on eyes).
- Desaturate brand colors slightly.

### 2.9 Shadow Colors [3/21]
- Match shadow to background behind element.
- Purple bg -> purple-tinted shadow, NOT gray.
- Soft: low opacity, high blur, brand-tinted.
- Default Figma shadows = amateur.

### 2.10 Grayscale-First Validation [3/21]
- Desaturate to test. If hierarchy breaks without color -> design is broken.
- Color enhances, doesn't carry.
- Never let AI choose colors [2/21].

---

## 3. SPACING & LAYOUT

### 3.1 The 8-Point Grid [9/21]
- All values divisible by **8** (or 4).
- 25px -> 24px. 11px -> 12px.
- **Within groups**: base value (e.g., 16px).
- **Between groups**: 2x base (e.g., 32px).
- **Between sections**: consistent larger value (e.g., 104px).

### 3.2 White Space [8/21]
- Active element, not passive.
- "More white space than you think."
- Break text into chunks.
- Start with MORE spacing, reduce until happy.

### 3.3 Relationship Proximity [6/21]
- Related = closer. Unrelated = farther (Gestalt proximity).
- Heading->body below = 1x. Heading->body above = 2x.
- Same shape/size/color = perceived as group (Gestalt similarity).

### 3.4 Layout Patterns [4/21]
- 12-column grid. Rarely >1-3 columns per section.
- Top-to-bottom, left-to-right flow.
- Nav at top, CTA prominent.
- Mix section styles for scroll engagement.
- Dashboards use grids more strictly.

### 3.5 Single Column Forms [2/21]
- Side-by-side fields = bad.
- Exception: country code + phone.
- Single column = spacious, clear flow.

### 3.6 Responsive / Mobile [4/21]
- Must adapt to any screen.
- **Thumb zone**: primary CTAs bottom of mobile screen.
- Buttons large enough to tap.
- No lorem ipsum — use real content.
- REM units (px / 16) for responsive.

---

## 4. VISUAL HIERARCHY

### 4.1 Three Levels [10/21]
- **L1**: biggest/boldest — grabs attention.
- **L2**: secondary — visible, doesn't compete.
- **L3**: details — for deep divers.
- F-pattern outdated. Use visual weight.

### 4.2 Four Mechanisms [5/21]
1. **Large text** — noticed first.
2. **Animation/movement** — yanks attention.
3. **Color contrast** — saturated vs neutral pulls eye.
4. **Heavy font weight** — bold pops.

### 4.3 Opacity for Hierarchy [3/21]
- Material Design: 87% = high, 60% = medium.
- Headlines 100%, subheadings ~70%, supporting ~60%.
- Creates hierarchy without changing font size.

### 4.4 De-emphasize to Emphasize [3/21]
- To make X stand out, turn down everything else.
- Don't just crank primary — reduce secondary.
- Zoom out test: key elements scannable from distance?
- Not all H1s need same size.

### 4.5 Squint Test [2/21]
- Squint until blurry. Headline and CTA must pop.
- If not -> hierarchy broken.
- Use after every design pass.

---

## 5. COMPONENTS & PATTERNS

### 5.1 Buttons [8/21]
- Adequate padding (tappability + legibility).
- **Title case**, not UPPERCASE.
- Clear labels: "Send Reset Link" not "Next" / "Submit" / "Let's Do This".
- **No ghost buttons** — users miss them.
- Brand color for **primary CTA only**.
- Border radius matches surrounding UI.

### 5.2 Icons [6/21]
- ONE icon set, ONE style. Stick with it.
- Exception: filled for active nav state.
- Must be recognizable without labels.
- Recommended: **Phosphor, Lucide, Untitled UI, Huge Icons, Feather**.
- Different styles OK only if visually separated.
- **Emojis are NOT icons.** Replace with proper libraries.

### 5.3 Border Radius [4/21]
- **Nested**: inner = outer - padding. Card 16px, 4px padding -> image 12px.
- Deeper nesting = smaller radius.
- Consistent across similar components.

### 5.4 Cards [4/21]
- Light mode: bg color. Dark mode: borders.
- Selectable cards > text lists/dropdowns.
- Reduce noise: triple-dot menus, centered dates.

### 5.5 Charts [5/21]
- Always: legend, labels, axis values, grid lines, date selector.
- Gray out incomplete data.
- Readability > aesthetics.
- Flat bar tops (rounded = hard to read values).
- Show comparison data. Offer drill-down.
- Stick to line, bar, doughnut. Don't invent types.

### 5.6 Navigation [4/21]
- Simple, grouped by relevance.
- Icons + short titles. Rarely-used items at bottom.
- Collapsible: icons work alone.
- Active state indicator.

### 5.7 Modals, Popovers, Toasts [2/21]
- **Popover**: simple, non-blocking.
- **Modal**: complex, blocking (confirm/cancel).
- **New page**: permanent/large content.
- **Toast**: confirm actions without blocking.

### 5.8 Empty States [3/21]
- NEVER blank. No "You have no projects" dead ends.
- Include: explanation + guidance + CTA ("Create New Project").
- Educate, guide, encourage.

### 5.9 Dashboards [2/21]
- Sidebar = spine (nav, profile, search).
- Most important data at top.
- Smaller fonts, tighter spacing than landing pages.
- Strict grids. Tables need search/filter/sort.
- Optimistic UI (update instantly, assume success).

---

## 6. MOTION & EMOTIONAL DESIGN

### 6.1 Animation [7/21]
- Personality: rotate, fly in, bob, slide — not just fade.
- **Purposeful** motion adds clarity, not flash.
- Buttons: always hover/click animation.
- No scroll-jacking.
- Parallax in spacious margins.
- Overusing = worse than none.

### 6.2 Micro-interactions [5/21]
- Button press -> gray out / spinner for loading.
- Save -> fill icon + notification dot.
- **"Did my click register?"** — user must never wonder.
- Success -> bounce, glow, sparkle (not just green check).
- Celebrate small wins.

### 6.3 Emotional Design [2/21]
- Usefulness isn't enough — feelings matter.
- Duolingo: animations -> DAU 14.2M to 34M.
- Phantom wallet: animations -> #2 US utility app.
- Revolut: tactile charts, 3D flip -> premium feel.
- Every micro-interaction = trust signal. Polish = trust.

### 6.4 Emotional Tactics
- Micro-interactions on repeated behaviors.
- Mascots/characters for encouragement.
- Progress: streaks, levels, completion bars -> momentum.
- Intimidating domains (finance, health): friendly visuals + warm details.
- First impression/onboarding = critical for trust.
- Subtle animation in security flows = trust.

### 6.5 Playfulness [3/21]
- Illustrations, doodles without clutter.
- Draw attention to center, trail at edges.
- Match vibe: professional -> realistic images, fun -> blobs/colors.
- 404 pages = perfect for personality.
- "We sweat the details" > "We take pride in our attention to detail."

### 6.6 Progressive Disclosure [3/21]
- Show what's needed now, reveal more on demand.
- "Load more" > infinite scroll (user control + footer).
- Collapsible sections. Search bar icon -> expands on click.

---

## 7. UX PRINCIPLES

### 7.1 User Intent First [5/21]
- What does user need to DO? Not what should layout look like.
- List tasks -> rank importance -> hierarchy matches.
- Primary = most contrast. Secondary = less.
- "If design doesn't consider conversion, it's useless."

### 7.2 Content-First [4/21]
- Content drives design, not reverse.
- Display based on user interaction patterns.
- Edge cases: long names -> truncate, icons on bright images -> contrast circle.
- No lorem ipsum.

### 7.3 Affordance [4/21]
- Mental models: account top-right, Escape closes modals, nav at top.
- Work WITH expectations.
- "Intuitive" = established patterns + small flair.
- Don't reinvent — check Dribbble/Behance first.

### 7.4 Conversion [4/21]
- **Clarity**: who, what, why in 5 seconds.
- **Scannability**: people scan, not read.
- **Motivation**: speak to heart, not features.
- 80% leave after first fold -> make it crystal clear.
- Reduce interaction cost: expose content directly.

### 7.5 Copy & Labels [5/21]
- Clear, short, action-based.
- Natural language > jargon.
- Don't repeat same word in heading + label.
- Button text = actual action. "Send Reset Link" not "Submit."

### 7.6 Accessibility [4/21]
- WCAG contrast compliance.
- Keyboard navigation (tab through without mouse).
- Don't rely on color alone (add icons, labels, patterns).
- Alt text. One H1 per page. Thumb zones on mobile.

### 7.7 Design Validation [4/21]
- **Squint test**: blur -> headline + CTA pop?
- **Scroll backward**: bottom to top reveals issues.
- **Grayscale test**: does hierarchy work without color?
- **Test on real devices**.

### 7.8 Vibe-Coded / AI Anti-patterns [2/21]
- Emojis as icons
- AI-chosen bright clashing colors
- Duplicate KPIs shown 3x on same page
- Gradient profile circles with letters
- Sparse modals with too much empty space
- No analytics pages
- Landing pages without graphics = zero trust
- AI-generated over-complex navigation
- Stacked effects (shadow + glow + gradient)
- No empty/loading/error states

---

## 8. DESIGN CONCEPTS

### 8.1 Star of the Show [2/21]
- ONE standout element per page that makes people feel.
- Connected to brand, not just cool.
- Build from a "seed" question. Everything supports the star.

### 8.2 Visual Rhyming [2/21]
- Repeat elements (shapes, colors, textures) across site.
- Echo star components in buttons, icons, cards.
- Creates "one universe" cohesion.

### 8.3 Depth & Texture [3/21]
- Subtle texture (noise, dots) -> content sits ON something.
- Glass effects, soft shadows.
- Radial gradient behind text over textured backgrounds.
- Corner gradients for color without loudness.
- NEVER compete with content.

### 8.4 Design Systems [2/21]
- Define: spacing, typography, colors, interactions.
- Lean = flexible. Large = deeply defined.
- Shared language, not just visual consistency.
- Master rules, then intentionally break them.

### 8.5 Images [2/21]
- Match image colors to site palette.
- People looking toward key content (eyes guide gaze).
- WebP, ~300KB max. Rule of thirds.
- Export at exact needed dimensions.
- Natural expressions > staged stock.

---

## TOP 10 MOST REPEATED RULES

| # | Rule | Mentions |
|---|------|----------|
| 1 | 60/30/10 color rule | 12/21 |
| 2 | Visual hierarchy (3 levels) | 10/21 |
| 3 | Contrast & accessibility (WCAG) | 10/21 |
| 4 | 8-point grid spacing | 9/21 |
| 5 | Max 4 font sizes, 2 weights | 8/21 |
| 6 | White space is active, not passive | 8/21 |
| 7 | Clear, action-based button labels | 8/21 |
| 8 | Line height ratios (1.0-1.3 / 1.3-1.5) | 8/21 |
| 9 | Purposeful animation, not decorative | 7/21 |
| 10 | Letter spacing (- headings / 0 body / + CTAs) | 6/21 |
