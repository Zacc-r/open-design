# Chala.AI V2 — Component Reference

Complete token set and component vocabulary for the Chala.AI design system.
All values are authoritative — pulled from `Theme.swift` and the V2 design canvas.

---

## Design Tokens

### Colors (CSS var names match template.html)

```css
/* Surfaces */
--bg:              #050505      /* absolute black canvas */
--bg-raised:       #0B0B0B      /* slightly elevated surface */

/* Text hierarchy */
--text:            #ffffff               /* primary — 100% white */
--text-dim:        rgba(255,255,255,0.55) /* body copy */
--text-faint:      rgba(255,255,255,0.32) /* labels, metadata */
--text-muted:      rgba(255,255,255,0.18) /* placeholder */

/* Borders */
--hairline:        rgba(255,255,255,0.08) /* default 1px divider */
--hairline-strong: rgba(255,255,255,0.16) /* elevated / interactive rings */

/* Interactive */
--primary-fill:    #E0E0E0               /* filled button bg */
--primary-text:    #0B0B0B               /* text on primary fill */
--card:            rgba(255,255,255,0.04) /* card background */
--card-selected:   rgba(255,255,255,0.12) /* pressed / selected */
--input-bg:        rgba(255,255,255,0.05) /* form input fill */
--pill-bg:         rgba(255,255,255,0.10) /* tag / badge fill */

/* Radius */
--radius:          2px  /* all interactive elements */
```

### Typography

```css
--font-sans: 'Geist', 'SF Pro Text', system-ui, sans-serif
--font-mono: 'Geist Mono', ui-monospace, 'SF Mono', monospace
```

| Role | Size | Weight | Font | Tracking |
|---|---|---|---|---|
| Display | 42px | 500 | sans | −0.02em |
| Title | 36px | 500 | sans | −0.02em |
| Heading | 28–32px | 500 | sans | −0.02em |
| Heading SM | 24–26px | 500 | sans | −0.02em |
| Body | 14–15px | 400 | sans | normal |
| Label | 10px | 400 | mono | +0.18em |
| Label SM | 9px | 400 | mono | +0.18em |
| Numeric | varies | 500 | mono | −0.02em |
| Button | 13px | 500 | sans | +0.12em |
| Caption/Unit | 8–9px | 400 | mono | +0.06em |

**Rules:**
- Labels and buttons: always `text-transform: uppercase`
- Numerics: always `font-variant-numeric: tabular-nums`
- Headings: `letter-spacing: -0.02em`, `line-height: ~1.05`

---

## Components

### ButtonV2

Three variants, always uppercase 13px +0.12em tracking.

```html
<!-- Primary: light fill, dark text -->
<button class="btn-primary">SIGN IN</button>

<!-- Secondary: no fill, hairline border -->
<button class="btn-secondary">CONTINUE WITH GOOGLE</button>
```

Height: `50px min`. Width: `100%` in forms. Radius: `2px`.

### Label

Always uppercase, mono, tracked.

```html
<span class="label">WEEK 11 · DAY 04 / 07</span>
<span class="label-sm text-faint">SESSIONS</span>
```

### Heading

```html
<h1 class="heading">Good morning,<br><span style="color:var(--text-dim)">Alex.</span></h1>
<h2 class="heading-sm">Chest &amp; Shoulders</h2>
```

### Numeric

```html
<span class="numeric" style="font-size:42px; font-weight:500;">684</span>
<span style="font-size:9px; font-family:var(--font-mono); letter-spacing:0.06em; color:var(--text-faint);">KCAL</span>
```

### Rule (hairline divider)

```html
<div class="rule"></div>           <!-- rgba(255,255,255,0.08) -->
<div class="rule-strong"></div>    <!-- rgba(255,255,255,0.16) -->
```

### Card

```html
<div class="card">
  <div class="card-inner">…content…</div>
  <div class="rule-strong"></div>
  <div class="card-inner row-between" style="cursor:pointer;">
    <span class="label" style="color:var(--text);">BEGIN SESSION</span>
    <!-- arrow-right glyph -->
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
      <path d="M5 12 H19 M14 6 L20 12 L14 18"/>
    </svg>
  </div>
</div>
```

### Tab Bar (V2)

5 cells. Active cell gets `.active` class → icon uses full-white color + 4px dot below.

```html
<nav class="tabbar">
  <a class="tab active" aria-label="Home">
    <svg viewBox="0 0 24 24"…><!-- home path --></svg>
  </a>
  <a class="tab" aria-label="Chat">…</a>
  <a class="tab" aria-label="Calendar">…</a>
  <a class="tab" aria-label="Sports">…</a>
  <a class="tab" aria-label="Profile">…</a>
</nav>
```

No labels. Just icon + dot. Height 80px (8px top padding + 16px bottom padding + 20px icon + gaps).

### Glyphs (SVG paths)

All glyphs: `viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `stroke-width="1.25"`, `stroke-linecap="square"`, `stroke-linejoin="miter"`.

```
home:        M3 11 L12 4 L21 11 V20 H14 V14 H10 V20 H3 Z
chat:        M4 5 H20 V17 H13 L9 21 V17 H4 Z
calendar:    M4 6 H20 V20 H4 Z M4 10 H20 M9 4 V8 M15 4 V8
profile:     circle cx=12 cy=9 r=3.5 + M5 20 C5 15 8 13 12 13 C16 13 19 15 19 20
bell:        M6 17 V11 C6 7.5 8.5 5 12 5 C15.5 5 18 7.5 18 11 V17 H20 H4 Z M10 20 C10.5 21 11.2 21.5 12 21.5 C12.8 21.5 13.5 21 14 20
arrow-right: M5 12 H19 M14 6 L20 12 L14 18
arrow-up:    M12 19 V5 M6 11 L12 5 L18 11
chevron-left:  M14 6 L8 12 L14 18
chevron-right: M10 6 L16 12 L10 18
dumbbell:    M3 9 V15 M5 7 V17 M7 10 H17 M19 7 V17 M21 9 V15
pulse/HR:    M3 12 H7 L9 6 L13 18 L15 12 H21
spark:       M12 3 V8 M12 16 V21 M3 12 H8 M16 12 H21 M5.5 5.5 L8 8 M16 16 L18.5 18.5 M18.5 5.5 L16 8 M8 16 L5.5 18.5
more (···):  circle cx=5 cy=12 r=1 + circle cx=12 cy=12 r=1 + circle cx=19 cy=12 r=1
check:       M4 12 L9 17 L20 6
```

### Macro Ring (SVG)

```html
<div class="macro-ring">
  <div style="position:relative; width:64px; height:64px;">
    <svg width="64" height="64" viewBox="0 0 64 64" style="transform:rotate(-90deg)">
      <!-- track -->
      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--hairline-strong)" stroke-width="1.5"/>
      <!-- arc (84% = stroke-dasharray: 137 163) — circumference = 2π×26 ≈ 163 -->
      <circle cx="32" cy="32" r="26" fill="none" stroke="var(--text)" stroke-width="1.5"
        stroke-dasharray="137 163" stroke-linecap="butt"/>
    </svg>
    <!-- center text -->
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <span class="numeric" style="font-size:14px;font-weight:500;">142</span>
      <span style="font-size:8px;font-family:var(--font-mono);letter-spacing:0.06em;color:var(--text-faint)">/170g</span>
    </div>
  </div>
  <span class="label-sm">PROTEIN</span>
</div>
```

Circumference formula: `2 × π × r = 2 × 3.14159 × 26 ≈ 163.4`
Arc length: `163.4 × (pct / 100)`
Stroke-dasharray: `"<arc> <circumference>"`

### Week Strip

```html
<div class="week-strip">
  <div class="day done"></div>   <!-- past completed -->
  <div class="day done"></div>
  <div class="day done"></div>
  <div class="day today"></div>  <!-- today -->
  <div class="day"></div>        <!-- future (hairline) -->
  <div class="day"></div>
  <div class="day"></div>
</div>
```

### Stat Row

```html
<div class="stat-row">
  <div class="stat-cell">
    <div class="numeric" style="font-size:32px;font-weight:500;">14</div>
    <div class="label-sm" style="margin-top:8px;">SESSIONS</div>
  </div>
  <div class="stat-cell">
    <div class="numeric" style="font-size:32px;font-weight:500;">11</div>
    <div class="label-sm" style="margin-top:8px;">CHECK-INS</div>
  </div>
  <div class="stat-cell" style="border-right:none;">
    <div class="numeric" style="font-size:32px;font-weight:500;">03</div>
    <div class="label-sm" style="margin-top:8px;">STREAK</div>
  </div>
</div>
```

### Quick Actions

```html
<div class="quick-actions">
  <div class="quick-cell">
    <!-- pulse glyph 16px -->
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
      <path d="M3 12 H7 L9 6 L13 18 L15 12 H21"/>
    </svg>
    <div style="margin-top:12px;font-size:13px;font-weight:500;color:var(--text);">Check-in</div>
    <div class="label-sm" style="margin-top:2px;">HOW YOU FEEL</div>
  </div>
  <div class="quick-cell">
    <!-- chat glyph 16px -->
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" stroke-width="1.25" stroke-linecap="square" stroke-linejoin="miter">
      <path d="M4 5 H20 V17 H13 L9 21 V17 H4 Z"/>
    </svg>
    <div style="margin-top:12px;font-size:13px;font-weight:500;color:var(--text);">Ask Coach</div>
    <div class="label-sm" style="margin-top:2px;">ANYTIME</div>
  </div>
</div>
```

### Form Field (auth)

```html
<div class="form-field">
  <div class="label-sm" style="color:var(--text-faint);">EMAIL OR USERNAME</div>
  <div class="form-value">alex@morgan.co</div>
</div>
<div class="form-field last">
  <div class="label-sm" style="color:var(--text-faint);">PASSWORD</div>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-top:8px;">
    <div style="font-size:15px;letter-spacing:0.2em;color:var(--text);">••••••••••</div>
    <div class="label-sm" style="color:var(--text-faint);">SHOW</div>
  </div>
</div>
```

### Meal Row

```html
<div class="meal-row">
  <div class="meal-time">
    <span class="numeric" style="font-size:11px;font-weight:500;color:var(--text-dim);">07:20</span>
  </div>
  <div class="meal-info">
    <div style="font-size:14px;font-weight:500;color:var(--text);">Oats & whey</div>
    <div style="font-size:11px;color:var(--text-faint);line-height:1.5;margin-top:4px;">Rolled oats · banana · whey · almond butter</div>
  </div>
  <div class="meal-kcal">
    <div class="numeric" style="font-size:14px;font-weight:500;">420</div>
    <div style="font-size:8px;font-family:var(--font-mono);letter-spacing:0.06em;color:var(--text-faint);margin-top:2px;">KCAL</div>
  </div>
</div>
```

---

## Hard Rules

1. Background is always `#050505` — never dark gray, never #111
2. All borders are exactly `1px` — never thicker
3. No shadows (except the outer device frame shadow)
4. No gradients on screen content
5. No color except white at varying opacities
6. All labels uppercase, mono, +0.18em tracking
7. Headings always negative tracking (−0.02em)
8. Numerics: tabular-nums, GeistMono
9. Button text: uppercase, +0.12em tracking
10. Border radius: 2px everywhere (inputs can use up to 4px)
