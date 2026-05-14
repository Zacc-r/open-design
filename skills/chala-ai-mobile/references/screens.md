# Chala.AI — V2 Screen Reference

16 designed screens extracted from the Chala.AI V2 design canvas.
Use these as archetypes — match the brief to the nearest entry, then adapt.

---

## 01 Sign In

**Purpose:** Email/password auth with Google OAuth option.

**Layout:**
```
[status bar 47px]
[content — flex column, padding 32px 28px 28px]
  Wordmark (120px wide, 40% opacity) + margin-bottom 36px
  Heading 32px: "Welcome back."
  Body 14px text-dim: "Sign in to continue training with intent."

  Form fields (hairline-bottom-only borders):
    — Email or username | value or placeholder
    — Password | •••••••• | SHOW label right-aligned

  "Forgot password?" — 11px text-dim, right-aligned, underline, padding 12px 0 24px

  [btn-primary] "SIGN IN"
  [btn-secondary] "CONTINUE WITH GOOGLE" (SVG G monogram left of text)

  Divider: hairline rules + "Or" label-sm centered between them

  No account row: label-sm "New here?" + "Create account" underline-link

[no tab bar — auth screen]
```

---

## 02 Home

**Purpose:** Daily dashboard with today's workout, week progress, coach insight.

**Layout:**
```
[status bar 47px]
[content — flex column, padding 12px 28px 0, overflow hidden]
  Top row (height 36px):
    Wordmark 64px 40%-opacity | bell glyph (18px, text-faint) right

  Rule margin-top 8px margin-bottom 24px

  Greeting block margin-bottom 28px:
    Label: "TUE · MAR 12 · 09:41" (text-faint)
    Heading 36px 500wt: "Good morning,\n" + "Alex." (text-dim)

  Week strip margin-bottom 28px:
    Row-between: Label "WEEK 11 · DAY 04 / 07" | Label "STREAK " + Numeric "03"
    7-column grid of 4px-tall bars:
      past days: bg text (white)
      today: bg text 60% opacity
      future: bg hairline

  Today workout card (border card, margin-bottom 24px):
    Card padding 20px:
      Row-between: Label "TODAY · PUSH" | dumbbell glyph 16px
      Heading 26px 500wt: "Chest &\nShoulders"
      Stat row (gap 24px, baseline align):
        Numeric 20px "58" + "MIN" caption
        1px vertical hairline 14px tall
        Numeric 20px "06" + "EXERCISES" caption
        1px vertical hairline
        Numeric 20px text-accent "+12" + "VOL" caption
    Rule hairline-strong
    Row-between padding 16px 20px:
      Label 11px "BEGIN SESSION" | arrow-right glyph 18px text

  Coach Insight margin-bottom 24px:
    Label "COACH INSIGHT" margin-bottom 10px
    Body 14px text-dim line-height 1.55:
      "Your sleep dropped 8% this week..."

  Quick actions (margin-top auto, margin-bottom 16px):
    2-cell grid with hairline divider:
      Left: pulse glyph 16px | "Check-in" 13px 500wt | label-sm 9px "HOW YOU FEEL"
      Right: chat glyph 16px | "Ask Coach" 13px 500wt | label-sm 9px "ANYTIME"

[tab bar — Home active]
```

---

## 03 Chat (empty)

**Purpose:** Coach chat entry point — empty state with prompt suggestions.

**Layout:**
```
[status bar 47px]
[content — flex column, full height]
  Center block (margin auto):
    Wordmark 80px 40%-opacity centered
    Heading 24px 500wt centered margin-top 20px: "How can I\nhelp you?"

  Prompt suggestions (4 rows, each hairline-bottom):
    Padding 16px 28px, row-between:
      Body 14px text-dim: "What should I eat before a workout?"
      arrow-right glyph 16px text-faint

  Input bar at bottom (padding 16px 28px 32px):
    Input box (border hairline-strong, 2px radius, padding 14px 16px, bg input-bg):
      Placeholder label-sm text-muted: "ASK COACH..."
      send glyph right edge (arrow-up 18px text-faint)

[tab bar — Chat active]
```

---

## 03b Chat (active)

**Purpose:** Active AI coach conversation.

**Layout:**
```
[status bar 47px]
[header: row-between padding 12px 28px]
  chevron-left 20px text-dim | Label "COACH" | more glyph

[content — scrollable messages]
  Coach message bubble (left-aligned, padding 12px 16px, bg card, border hairline):
    "Coach" label-sm text-faint above bubble
    Body 14px text (white): message text
    Timestamp label-sm text-faint below

  User message bubble (right-aligned, bg primary-fill, text primary-text):
    Body 14px

  Typing indicator (3 dots, opacity pulses):
    Same card bubble, 3 dots 6px each

[input bar — same as empty state but with content]
[no tab bar — chat is full-screen]
```

---

## 04 Calendar

**Purpose:** Workout history calendar.

**Layout:**
```
[status bar 47px]
[header padding 8px 28px 20px]:
  Label text-faint "CALENDAR" margin-bottom 6px
  Heading 30px "March"
  Row-between: current month | chevron-left chevron-right navigation

Rule

[month grid — 7 columns]:
  Day headers (Su Mo Tu We Th Fr Sa): label-sm text-faint, padding 12px
  Rule
  Day cells (7-column grid):
    — Empty days: label-sm text-faint
    — Training days: label-sm text (white), 4px white dot below number
    — Today: label 12px white, rounded accent indicator
    — Rest days: label-sm text-muted

Rule

[session list — scrollable]:
  Section header: label text-faint + date, padding 20px 28px 12px
  Session rows:
    Row padding 16px 28px, border-bottom hairline:
      Left: label-sm text-faint (MON, TUE etc) | session name 14px 500wt | exercises count label-sm
      Right: Numeric "58" + "MIN" caption

[tab bar — Calendar active]
```

---

## 05 Nutrition (Fuel)

**Purpose:** Daily calorie and macro tracking.

**Layout:**
```
[status bar 47px]
[header padding 8px 28px 20px]:
  Row-between:
    Left: Label text-faint "TODAY · TUE 14" | Heading 30px "Fuel"
    Right: 36×36 hairline-strong box, border 2px radius, "+" inside (font-weight 300, 18px)

Rule

[Calorie banner padding 20px 24px 24px]:
  Row-between:
    Left: Label text-faint "REMAINING" | Numeric 42px 500wt "684" + "KCAL" caption
    Right: "1,816 / 2,500" caption | 120px progress bar (2px height)

[Macro rings — 3 columns, padding 0 24px 24px]:
  Each ring:
    SVG 64×64: hairlineStrong circle track (1.5px) + white arc (1.5px, stroke-dasharray %fill)
    Numeric 14px center overlay + unit caption
    Label-sm below ring: "PROTEIN" / "CARBS" / "FAT"
  Values: Protein 142/170g (84%) | Carbs 188/275g (68%) | Fat 43/83g (52%)

Rule

[Meals section header padding 20px 24px 12px]:
  Row-between: Label text-faint "MEALS · 3 LOGGED" | Label text "ADD +"

Rule

[Meal rows — 3 meals]:
  meal-row layout: time-col | name + items | kcal right
  07:20 — Oats & whey (420kcal) — "Rolled oats · banana · whey · almond butter"
  12:45 — Chicken bowl (612kcal) — "Grilled chicken · rice · avocado · greens"
  16:10 — Snack (184kcal) — "Greek yogurt · honey · berries"

Rule

[Wearable stats — 4-cell horizontal grid, border hairline]:
  Each cell padding 16px 12px, border-right hairline:
    glyph 14px text-dim | Numeric 18px 500wt | Label-sm 8px
  Values: Steps 8,241 | kcal 312 | Sleep 7.2h | HRV 62ms

Rule

[Body metrics]:
  Section label "BODY · METRICS" padding 20px 24px 12px
  Rule
  Body row rows (border-bottom hairline, padding 16px 24px):
    label text-dim | Numeric 16px + unit + delta right
  Weight: 83.4 kg (−0.3)
  Body fat: 14.2 % (−0.1)
  Muscle: 64.1 kg (+0.1)

[tab bar — Nutrition active]
```

---

## 06 Profile

**Purpose:** User stats, membership status, preferences.

**Layout:**
```
[status bar 47px]
[content padding 12px 28px 0, overflow auto]
  Label text-faint "PROFILE" margin-bottom 8px
  Heading 36px: "Alex\n" + "Morgan." (text-dim second line)

  Identity row (gap 16px, margin-bottom 24px):
    56×56 box border hairline-strong 2px radius: "AM" heading 20px centered
    Right: Label text accent "INTERMEDIATE" | Label-sm text-faint "MEMBER SINCE MAR 2025"

  Stats (stat-row, padding 0 20px, margin-bottom 24px):
    3 cells divided by hairlines:
      Numeric 32px "14" | Label-sm "SESSIONS"
      Numeric 32px "11" | Label-sm "CHECK-INS"
      Numeric 32px "03" | Label-sm "STREAK"

  Gym Pass card (border hairline-strong, padding 16px, margin-bottom 24px):
    Row (gap 14px):
      56×56 white QR (mini pattern, bg white, padding 4px, 2px radius)
      Right: Label "ETA GYM PASS" | Label-sm text-faint "Expires Dec 2025" | Label-sm text-faint "Member #00421"

  Preferences list (border hairline, 2px radius):
    Pref rows (padding 16px 20px, border-bottom hairline):
      Label text-faint left | value text 14px 500wt right
    Training days: Mon/Wed/Fri
    Units: Metric
    Goal: Hypertrophy
    Rest: 90 SEC
    Notifications: On

  Section header "ACCOUNT" label text-faint, margin-top 20px
  Action rows (border hairline, 2px radius):
    Settings row | Sign out row (text-faint)

[tab bar — Profile active]
```

---

## 07 Sports

**Purpose:** Activity history — running and workout stats.

**Layout:**
```
[status bar 47px]
[header padding 8px 28px 20px]:
  Row-between: Heading 30px "Activity" | week-range label text-faint

[Summary strip — 3 cells, border hairline, margin 0 28px 24px]:
  Total distance: Numeric 28px + km caption | Label-sm "DISTANCE"
  Active time: Numeric + h label | Label-sm "TIME"
  Elevation: Numeric + m label | Label-sm "ELEVATION"

Rule

[Week bar chart — 7 bars, padding 20px 28px]:
  Each bar: flex column, label-sm day (Mo Tu...), bar fill proportional to distance
  Active day bar: bg text (white)
  Other days: bg hairline-strong

[Recent activities]:
  Section header label text-faint

  Run cards (border hairline, 2px radius, padding 16px 20px, margin 0 28px 8px):
    Row-between:
      Left: Label text-faint "MON 09 · MORNING RUN" | Heading 24px distance "8.2KM"
      Right: Numeric pace "4:52" + "MIN/KM" caption
    Row: duration + elevation + avg HR chips (label-sm in pill)

[tab bar — Sports active]
```

---

## Sports — Run Detail

**Purpose:** Detailed run breakdown with route map.

**Layout:**
```
[status bar 47px]
[nav header padding 12px 28px]:
  chevron-left | Label center "RUN DETAIL" | more glyph

[Route map — 180px tall, padding 0]:
  SVG polyline on dark canvas (#0B0B0B):
    Route line: white 1px stroke, slightly wavy path
    Start/end markers: 4px white dots
    Distance markers: label-sm along route

Rule

[Key stats — 4-cell row, border hairline]:
  Distance: Numeric 28px "8.2" + "KM"
  Pace: Numeric 28px "4:52" + "MIN/KM"
  Time: Numeric 28px "40:08" + "H:M"
  Elevation: Numeric 28px "+84" + "M"

Rule

[Splits table — per-km]:
  Header row: label-sm "KM" | "PACE" | "HEART RATE" | "ELEVATION"
  Rule
  Data rows (padding 12px 24px, border-bottom hairline):
    Numeric columns right-aligned | pace pace per split

[HR chart — 60px tall SVG, padding 20px 24px]:
  Polyline on dark bg, heart rate over time
  Min/max labels outside

[tab bar — Sports active]
```

---

## Sports — AI Routes

**Purpose:** AI-curated running routes.

**Layout:**
```
[status bar 47px]
[header padding 12px 28px 20px]:
  Label text-faint "AI ROUTES · TODAY"
  Heading 28px "Pick your\nroute."

[3 route cards — stacked, margin 0 28px 12px]:
  Card border hairline-strong, padding 16px:
    Row-between:
      Label text-faint route name | distance pill (label-sm "8.2 KM")
    Heading 24px: route description short
    Row gap 12px margin-top 12px:
      Pill "MODERATE" | Pill "↑ 84M" | Pill "~40 MIN"
    Body 13px text-dim margin-top 8px: route description 2 lines

[no tab bar — modal sheet style]
```

---

## Settings

**Purpose:** App preferences and account management.

**Layout:**
```
[status bar 47px]
[header padding 12px 28px 20px]:
  Label text-faint "SETTINGS"
  Heading 30px "Preferences"

[Grouped setting sections]:
  Section header label text-faint "TRAINING" padding 20px 24px 8px
  Rule
  Settings rows (padding 16px 24px, border-bottom hairline):
    Label text-faint left | value text 14px right | chevron-right glyph
  Training frequency | Rest duration | Units

  Section header "INTEGRATIONS"
  Apple Health row: Label "APPLE HEALTH" | toggle state label
  Wearable row: Label "WEARABLE" | "None" text-dim

  Section header "NOTIFICATIONS"
  Workout reminder | Rest reminder | Check-in reminder

  Section header "ACCOUNT"
  Profile | Email | Password | Sign Out (text-faint/danger)

[no tab bar — settings is pushed from profile]
```

---

## Gym Pass

**Purpose:** Full-screen membership QR code.

**Layout:**
```
[status bar 47px]
[content — center-aligned, full height flex column]:
  chevron-left + "GYM PASS" header

  Center content:
    Wordmark 80px dim
    40px gap
    Heading 24px center: "ETA Training\nNew York"

    QR code block (white bg, 200×200, padding 16px, 2px radius):
      SVG 9×9 finder pattern grid (authentic QR corners)
      Body below: Numeric "00421" | label-sm "MEMBER"

    Member details below QR:
      Name heading | Tier label | Expiry label-sm

    Label-sm text-faint center bottom: "SHOW AT RECEPTION"

[no tab bar — modal full-screen]
```

---

## Active Workout

**Purpose:** Live workout session tracking.

**Layout:**
```
[status bar 47px]
[session header padding 12px 28px]:
  Row-between:
    Label text-faint "PUSH · CHEST & SHOULDERS"
    close/x glyph 20px

  Elapsed timer: Numeric 48px tabular center "38:14" + "MIN" caption

  Progress strip: 4px bar, n/m exercises done

Rule

[Current exercise block padding 20px 28px]:
  Label text-faint "EXERCISE 03 / 06"
  Heading 30px 500wt: "Bench Press"
  Label-sm text-dim margin-top 4px: "4 sets · 60 sec rest"

  Set rows (border-bottom hairline):
    Row: Numeric set# | weight input | "×" | reps input | check glyph
    Completed rows: text-dim + check glyph filled
    Active row: highlighted

  [btn-primary] "COMPLETE SET" or "START REST"

[Rest timer overlay — full-screen dimmed]:
  Dim backdrop rgba(0,0,0,0.85)
  Center card:
    Label text-faint "REST"
    Numeric 80px countdown "01:24"
    Label-sm text-dim "Bench Press — set 2 of 4"
    [btn-secondary] "SKIP REST"

[no tab bar — workout full-screen]
```

---

## Exercise Library

**Purpose:** Browse and search exercises.

**Layout:**
```
[status bar 47px]
[search header padding 12px 28px 16px]:
  Heading 28px "Exercises"
  Search input (margin-top 16px, full-width, bg input-bg, border hairline, padding 12px 16px 12px 40px):
    search glyph left inside
    placeholder label-sm text-muted "SEARCH EXERCISES"

[Filter pills row, padding 0 28px 16px, horizontal scroll]:
  Active: pill bg pill-bg "ALL" | "PUSH" | "PULL" | "LEGS" | "CORE" | "CARDIO"

Rule

[Exercise grid — 2 columns, padding 16px 28px, gap 12px]:
  Exercise card (border hairline, padding 16px):
    Heading-sm 18px: "Bench Press"
    Label-sm text-faint: "CHEST · TRICEPS"
    Muscle group pills row

[tab bar — none or Sports active if pushed from Sports]
```

---

## Onboarding Flow

**Purpose:** 4-step setup (Disclaimer → Basics → Goals → Experience).

**Shell:**
```
[status bar 47px]
[progress strip — 4 segments, active filled]:
  4-bar week-strip style, one segment per step

[content padding 32px 28px]:
  Step label: label-sm text-faint "STEP 2 / 4"
  Heading 36px: step title
  Body 14px text-dim: step description

  Step-specific content (form fields, option rows, sliders)

[footer padding 0 28px 40px]:
  [btn-primary] "CONTINUE"
  [btn-secondary] "BACK" (on steps 2+)
```

**Step 1 — Disclaimer:**
Heading "Before we start."; body disclaimer text; checkbox row; continue CTA.

**Step 2 — Basics:**
Form fields: Name | Date of Birth | Height | Weight | Sex.

**Step 3 — Goals:**
4 option tiles in 2×2 grid (Hypertrophy / Strength / Endurance / Weight Loss), each tappable with check glyph when selected.

**Step 4 — Experience:**
3 option rows (Beginner / Intermediate / Advanced) with description sub-label.
