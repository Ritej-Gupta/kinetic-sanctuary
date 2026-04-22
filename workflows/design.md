# KINETIC SANCTUARY — The Ground Truth Specification v3.0
### *"Where precision meets obsession. Consistency is velocity."*

---

## 0. Philosophy & Manifesto: High-Performance Architecture

> This is not a habit tracker. It is a performance instrument.

The Kinetic Sanctuary design system exists at the intersection of **luxury tech**, **editorial design**, and **behavioral science**. Every pixel, every animation delay, and every typographic choice is engineered for one purpose: to make the user *feel* the compounding power of their consistency.

We reject sterile "productivity" templates. We build an environment that is itself a reward.

**The Three Pillars:**
1.  **Tonal Depth** — Light is earned. Brightness signals achievement, not decoration. Boundaries are defined by background shifts, never by 1px solid borders.
2.  **Kinetic Restraint** — Motion is purposeful. Animation communicates state and telemetry, not just style.
3.  **Editorial Precision** — Typography sets the emotional tone. High-contrast pairings (Manrope + Inter) create a luxury "data lockup" feel.

---

## 1. Brand Identity & Voice

*   **Name**: Kinetic Sanctuary
*   **Tagline**: *Consistency is velocity.*
*   **Voice**: Calm authority. Quietly confident. Never shouty. Never gamified with cheap dopamine (no confetti, no cartoon mascots).
*   **Logo Mark**: A minimal lightning bolt glyph in `primary` teal, paired with "KINETIC" in Manrope ExtraBold (+0.12em tracking) and "SANCTUARY" in Inter Medium (40% opacity, +0.28em tracking).

---

## 2. Core Design Tokens

### 2.1 The Ocean Palette (Colors)
The palette is built on oceanic depth. Dark is not black—it is a tinted void.

| Token | Hex | Role |
| :--- | :--- | :--- |
| `primary` | `#75d5e2` | **Action Teal** — CTAs, active states, progress indicators. |
| `primary-container` | `#006069` | Deep teal for button gradients and pressed states. |
| `secondary` | `#96ccff` | **Velocity Blue** — Streak data, time-based metrics. |
| `tertiary` | `#7ddc7a` | **Success Green** — Completion, "win" states only. |
| `legendary` | `#f0c060` | **Legendary Amber** — Reserved exclusively for Personal Records (PRs). |
| `error` | `#ffb4ab` | **Friction Red** — Missed protocols, breaking streaks. |

### 2.2 The Achievement Spectrum (Heatmap & Stats)
For milestone and streak visualization, use this progressive color ramp:

| Level | Hex | Meaning |
| :--- | :--- | :--- |
| **0 — Inactive** | `#1a2123` | Empty cells / Not started. |
| **1 — Partial** | `#2b6e76` | Protocol started but not completed. |
| **2 — Consistent** | `#75d5e2` | Daily goal hit. |
| **3 — Exceptional** | `#7ddc7a` | Goal exceeded / Streak milestone. |
| **4 — Legendary** | `#f0c060` | All-time personal record achieved. |

### 2.3 Surface Hierarchy (Tonal Layering)
*Non-Negotiable: No 1px solid borders. Use these layers to imply depth.*

```css
Layer 0 — The Void:       #080f11 (Deepest background/cards)
Layer 1 — Canvas:         #0d1416 (Page background)
Layer 2 — Section:        #161d1f (Group containers)
Layer 3 — Module:         #1a2123 (Standard cards)
Layer 4 — Card:           #242b2d (Active/Elevated modules)
Layer 5 — Floating:       #2f3638 (Popovers, modals, tooltips)
Layer 6 — Glass:          rgba(36, 43, 45, 0.7) + backdrop-blur(16px)
```

---

## 3. Typography: The Dual-Voice System

### 3.1 Typeface Pairing
-   **Manrope** (Editorial Voice): Display text, headlines, large streak numbers, section titles.
-   **Inter** (Functional Voice): Body copy, labels, data metadata, technical readouts.

### 3.2 Unified Type Scale
| Token | Font | Size | Weight | Line Height | Use |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-lg` | Manrope | 3.5rem (56px) | 800 | 1.1 | Hero metrics (streak numbers) |
| `display-sm` | Manrope | 2.25rem (36px) | 700 | 1.15 | Section hero titles |
| `headline-md` | Manrope | 1.75rem (28px) | 700 | 1.3 | Card headers |
| `title-lg` | Inter | 1.125rem (18px) | 600 | 1.4 | Subsection titles |
| `body-md` | Inter | 0.9375rem (15px) | 400 | 1.6 | Narrative content / Descriptions |
| `label-sm` | Inter | 0.6875rem (11px) | 500 | 1.3 | Metadata, timestamps, units |
| `overline` | Inter | 0.625rem (10px) | 600 | 1.2 | Section labels (Uppercase, tracked +0.12em) |

---

## 4. Component Specification

### 4.1 Navigation Sidebar (The Command Center)
-   **Width**: 256px fixed.
-   **Background**: `surface` (#0d1416).
-   **Structure**: 
    - Profile Section: Avatar circle, "Kinetic Sanctuary" title, "Precision Performance" subline.
    - Active State: `surface-container-high` fill + left `primary` accent bar (3px).
    - Hover: Subtle tonal shift to `surface-active`.

### 4.2 Metric Hero Cards
-   **Structure**: Icon container (48px circle), technical label, large display value, comparison chip (e.g., "+2 from avg").
-   **Colors**: 
    - Streak → Velocity Blue (`secondary`).
    - Completion → Success Green (`tertiary`).
    - Milestones/Wins → Action Teal (`primary`).
-   **Blueprint**:
    ```html
    <div class="bg-surface-container p-6 rounded-xl relative overflow-hidden shadow-ambient">
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon size={24} />
        </div>
        <span class="font-inter text-label-sm text-on-surface-variant overline">CURRENT STREAK</span>
      </div>
      <div class="flex items-baseline gap-2">
        <span class="font-manrope text-display-lg font-bold">14</span>
        <span class="font-inter text-label-sm text-on-surface-variant">Days</span>
      </div>
      <div class="mt-2 text-label-sm text-tertiary font-medium">+2 from avg</div>
    </div>
    ```

### 4.3 Intelligence Suite (v3.0)
#### 🧠 AI Coach Panel (§7.1)
-   **Visual**: Conversational interface with `surface-container-low` background. Features a vertical gradient left rail ("Coach Signal").
-   **Blueprint**:
    ```html
    <div class="relative pl-6 py-4 bg-surface-container-low rounded-xl">
      <div class="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-l-xl"></div>
      <div class="flex gap-4 items-start">
        <div class="w-10 h-10 rounded-full bg-primary/20 animate-pulse-glow flex items-center justify-center">
          <Brain size={20} />
        </div>
        <div class="flex-1 space-y-2">
          <p class="font-manrope text-title-lg font-semibold">Coach Insight</p>
          <p class="font-inter text-body-md text-on-surface-variant leading-relaxed">
            Your momentum is increasing. Physical protocols are tracking 15% higher this week.
          </p>
        </div>
      </div>
    </div>
    ```

#### 📊 Resonance Map (§7.4)
-   **Visual**: Dual-line correlation chart using smooth cubic bezier curves.
-   **Logic**: Shaded "flow resonance" zones between lines when physical and mental habits move in sync.

#### 🔥 Momentum Arc (§7.2)
-   **Visual**: Replaces static numbers with a dual-ring arc. 
-   **State**: Flashes `legendary` amber upon personal best.

### 4.4 The Protocol Engine (Habit Tracking)
#### 🎯 Protocol Bar (§7.5)
-   **Logic**: Numeric goal tracking (e.g., "3L Water"). 
-   **Visual**: Linear progress that transitions to `tertiary` at 100%. Overachievement (>100%) triggers a small `legendary` pulse indicator.
-   **Blueprint**:
    ```html
    <div class="space-y-2">
      <div class="flex justify-between items-end">
        <span class="font-manrope text-title-lg">Hydration</span>
        <span class="font-inter text-label-sm text-on-surface-variant">2.2 / 3.0 L</span>
      </div>
      <div class="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-primary to-primary-container rounded-full transition-all duration-500" 
             style="width: 73%"></div>
      </div>
    </div>
    ```

#### 🔗 Habit Stacking (§7.6)
-   **Visual**: Vertical visual chain showing trigger → action. Nodes glow `primary` for active actions and `tertiary` for completion.
-   **Blueprint**:
    ```html
    <div class="flex gap-4">
      <div class="flex flex-col items-center gap-1">
        <div class="w-3 h-3 rounded-full bg-surface-container-highest"></div>
        <div class="w-0.5 h-12 bg-surface-container-highest"></div>
        <div class="w-3 h-3 rounded-full bg-primary shadow-glow-primary"></div>
      </div>
      <div class="space-y-8">
        <div class="opacity-50">Morning Coffee (Trigger)</div>
        <div class="font-semibold text-primary">10m Meditation (Action)</div>
      </div>
    </div>
    ```

#### ⚡ Quick Entry FAB (§7.7)
-   **Visual**: Glassmorphic floating button with `primary` gradient.
-   **Interaction**: Morphs into a selection sheet using `layoutId` transitions.
-   **Blueprint**:
    ```jsx
    <motion.button 
      layoutId="quick-entry"
      className="fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-br from-primary to-primary-container shadow-glow-primary"
    >
      <Plus />
    </motion.button>
    ```

### 4.5 Performance Heatmap (§6.6)
-   **Structure**: GitHub-style grid with 16px cells and 4px gaps.
-   **Intensity**: Uses the Achievement Spectrum scale to visualize volume.
-   **Interaction**: Tooltip on hover with glassmorphic blur.

---

## 5. Environmental Dynamics

### 5.1 Contextual Banner (§7.3)
Subtle full-width header shift based on time of day:
-   **Morning (5am-10am)**: "Morning Protocol" / Teal gradients.
-   **Peak (10am-3pm)**: "Peak Window" / Blue gradients.
-   **Wind Down (7pm-10pm)**: "Focus Mode" / Lavender gradients.

### 5.2 Focus Mode (§7.9)
-   **Activation**: Auto-triggered after 7:00 PM.
-   **Visual**: Dimming non-essential telemetry cards.
-   **Content**: Surfaces "Tonight's Wrap" and "Tomorrow's Protocol" modules for cognitive recovery.

### 5.3 Offline Infrastructure (§7.10)
-   **State**: "Signal Lost" banner slides in from top.
-   **Logic**: Queued syncs visualized with a `secondary` blue dot on logged items.

---

## 6. Interaction & Motion System

### 6.1 Timing Tokens
-   **Instant (80ms)**: Toggles, checkboxes.
-   **Fast (150ms)**: Button hover, hover-lifts.
-   **Standard (250ms)**: Navigation, card transitions.
-   **Expressive (400ms)**: Panels, modals, sheets.
-   **Dramatic (600ms)**: Page transitions, celebrations.

### 6.2 Signature Animations
-   **The Check-in**: Scale pulse (1.15x) → Success fill → Glow fade.
-   **The Quiet Win (§7.8)**: Metric card "breathing" effect (slow scale pulse) + professional editorial toasts.
-   **Heatmap Load**: Column-by-column staggered fade-in.

---

## 7. Knowledge Appendix: Recommended Protocols

*Use these categories to populate a balanced performance dashboard:*

| Category | Protocol Idea | Purpose |
| :--- | :--- | :--- |
| **Physical Health** | 3L Hydration / 5km Run | Base metabolic maintenance. |
| **Mental Clarity** | 10m Meditation / Journal | Nervous system regulation. |
| **Productivity** | 'Eat the Frog' (Crucial Task) | Focus optimization. |
| **Learning** | Read 15 Pages | Long-term knowledge compounding. |
| **Wellness** | Phone Shutdown at 9pm | Circadian rhythm protection. |
| **Financial** | Protocol Expense Check | Peace of mind / stability. |

---

## 8. Development Checklist

- [ ] **Surface Check**: No 1px solid internal borders.
- [ ] **Typography Check**: Headlines in Manrope, functional labels in Inter.
- [ ] **Achievement Spectrum**: Hex codes match for Heatmap and Progress rings.
- [ ] **Ambient Shadows**: Shadows must be tinted with surface color (max 6-8% opacity).
- [ ] **Focus Mode**: specialized views tested for evening transition.
- [ ] **Accessibility**: Touch targets 44px+; Color contrast WCAG AA compliant.

---

*Kinetic Sanctuary Design System v3.0 — Compiled for Total Performance.*
# KINETIC SANCTUARY — Design System v2.0
### *"Where precision meets obsession."*

---

## 0. Philosophy & Manifesto

> This is not a habit tracker. It is a performance instrument.

The Kinetic Sanctuary design system exists at the intersection of **luxury tech** and **behavioral science**. Every pixel, every animation delay, every typographic choice is engineered to do one thing: make the user *feel* the compounding power of their consistency.

We reject the sterile "productivity app" template. We build something users return to not because they must — but because the environment itself is a reward.

**Three Pillars:**
1. **Tonal Depth** — Light is earned. Brightness signals achievement, not decoration.
2. **Kinetic Restraint** — Motion is purposeful. Animation communicates state, not style.
3. **Editorial Precision** — Typography sets the emotional tone before the data does.

---

## 1. Brand Identity

**Name:** Kinetic Sanctuary  
**Tagline:** *Consistency is velocity.*  
**Voice:** Calm authority. Quietly confident. Never shouty. Never gamified with cheap dopamine.  
**Anti-patterns:** No confetti explosions. No cartoon mascots. No generic "You did it! 🎉" messages.

### Logo Mark
- A minimal lightning bolt glyph rendered in the `primary` teal — `#75d5e2`
- Paired with "KINETIC" in Manrope ExtraBold, tracked at `+0.12em`
- Subline "SANCTUARY" in Inter Medium at 40% opacity, tracked at `+0.28em`

---

## 2. Color System — Tonal Depth Architecture

The palette is built on oceanic depth. Dark is not black — it is a tinted void.

### Core Tokens

| Token | Hex | Role |
|---|---|---|
| `primary` | `#75d5e2` | Action Teal — CTAs, active states, progress |
| `primary-container` | `#006069` | CTA gradient terminus, pressed states |
| `secondary` | `#96ccff` | Velocity Blue — streak data, time-based metrics |
| `tertiary` | `#7ddc7a` | Success Green — completion, "win" states only |
| `error` | `#ffb4ab` | Friction Red — missed habits, breaking streaks |
| `surface` | `#0d1416` | Base canvas |
| `surface-container-low` | `#161d1f` | Sectioning layer |
| `surface-container` | `#1a2123` | Module background |
| `surface-container-high` | `#242b2d` | Active / interactive modules |
| `surface-container-highest` | `#2f3638` | Popovers, tooltips, modals |
| `surface-container-lowest` | `#080f11` | The void — deepest cards |
| `on-surface` | `#dde4e6` | Primary text |
| `on-surface-variant` | `#bec8c9` | Secondary / metadata text |
| `outline-variant` | `#3f4949` | Ghost borders (used at 15% opacity max) |

### NEW — Achievement Spectrum

For milestone and streak visualization, use this progressive color ramp:

| Level | Token | Hex | Use |
|---|---|---|---|
| 0 — Inactive | `inactive` | `#1a2123` | Heatmap empty cells |
| 1 — Partial | `partial` | `#2b6e76` | Started but not finished |
| 2 — Consistent | `primary` | `#75d5e2` | Goal hit |
| 3 — Exceptional | `tertiary` | `#7ddc7a` | Goal exceeded / streak milestone |
| 4 — Legendary | `legendary` | `#f0c060` | Personal records only |

The `legendary` amber is used **exclusively** for all-time personal records. It should appear sparingly — its rarity is what gives it power.

### The "No-Line" Rule (Non-Negotiable)
Boundaries are defined by **background shifts, not borders**. A 1px solid line is a failure of design confidence. Use surface hierarchy to imply edges. If contrast is insufficient for accessibility (WCAG AA), use a **Ghost Border**: `outline-variant` at **15% opacity maximum**.

---

## 3. Typography — The Editorial Hierarchy

### Typeface Pairing
- **Manrope** — Editorial Voice. All display text, headlines, key metrics.
- **Inter** — Functional Voice. Body copy, labels, data, captions.

### Scale

| Token | Font | Size | Weight | Line Height | Use |
|---|---|---|---|---|---|
| `display-lg` | Manrope | 3.5rem (56px) | 800 | 1.1 | Hero metrics (streak count) |
| `display-sm` | Manrope | 2.25rem (36px) | 700 | 1.15 | Section heroes |
| `headline-lg` | Manrope | 1.75rem (28px) | 700 | 1.2 | Page titles |
| `headline-md` | Manrope | 1.375rem (22px) | 700 | 1.3 | Card headers |
| `title-lg` | Manrope | 1.125rem (18px) | 600 | 1.4 | Subsection titles |
| `body-md` | Inter | 0.9375rem (15px) | 400 | 1.6 | Content, descriptions |
| `body-sm` | Inter | 0.8125rem (13px) | 400 | 1.5 | Secondary info |
| `label-md` | Inter | 0.75rem (12px) | 500 | 1.4 | Chips, tags, metadata |
| `label-sm` | Inter | 0.6875rem (11px) | 500 | 1.3 | Technical metadata, timestamps |
| `overline` | Inter | 0.625rem (10px) | 600 | 1.2 | Uppercase section labels (tracked +0.12em) |

### Editorial Rule
Pair high-contrast type sizes. A `display-sm` number (Manrope, 800 weight) against a `label-sm` descriptor (Inter, 500 weight, `on-surface-variant` color) creates a luxury "data lockup" — like a premium watch face.

---

## 4. Elevation & Depth — The Layering Principle

### Physical Layers (Bottom → Top)
```
Layer 0 — Void:       surface-container-lowest (#080f11)
Layer 1 — Canvas:     surface (#0d1416)
Layer 2 — Section:    surface-container-low (#161d1f)
Layer 3 — Module:     surface-container (#1a2123)
Layer 4 — Card:       surface-container-high (#242b2d)
Layer 5 — Floating:   surface-container-highest (#2f3638)
Layer 6 — Glass:      rgba(36,43,45,0.6) + backdrop-blur(16px)
```

### Shadow Tokens
No black shadows. Shadows are **tinted ambient glows**.

| Token | Value | Use |
|---|---|---|
| `shadow-ambient` | `0 8px 32px -4px rgba(221,228,230,0.06)` | Cards, resting modules |
| `shadow-float` | `0 16px 48px -8px rgba(221,228,230,0.08)` | Modals, popovers |
| `shadow-glow-primary` | `0 0 24px rgba(117,213,226,0.20)` | Active CTAs, primary elements |
| `shadow-glow-tertiary` | `0 0 16px rgba(125,220,122,0.18)` | Completed states |
| `shadow-glow-legendary` | `0 0 20px rgba(240,192,96,0.25)` | Personal records |

---

## 5. Motion System — Kinetic Restraint

Motion communicates state, not style. Every animation must answer: **what information does this motion convey?**

### Timing Tokens

| Token | Duration | Easing | Use |
|---|---|---|---|
| `motion-instant` | 80ms | `ease-out` | Toggles, checkboxes |
| `motion-fast` | 150ms | `ease-out` | Button states, hover |
| `motion-standard` | 250ms | `cubic-bezier(0.2,0,0,1)` | Card transitions |
| `motion-expressive` | 400ms | `cubic-bezier(0.05,0.7,0.1,1)` | Panels, sheets, modals |
| `motion-dramatic` | 600ms | `cubic-bezier(0.0,0.0,0.2,1)` | Page transitions, celebrations |

### Signature Animations

**Habit Check-in:** When a habit is marked complete, the circle should:
1. Scale up slightly (`scale(1.15)`) at 80ms
2. Fill with `tertiary` color at 150ms
3. Show a brief glow pulse (`shadow-glow-tertiary`) that fades over 400ms
4. The row background subtly shifts to `tertiary/5%`

**Streak Milestone:** On hitting 7, 21, 66, 100, 365-day streaks:
1. A subtle radial gradient sweep from center expands across the stat card
2. Color shifts to `legendary` amber for 2 seconds, then gracefully returns to `primary`
3. A single, muted particle burst (6-8 dots, no confetti chaos) radiates outward
4. The metric number ticks up via a `counter` animation

**Progress Bar Fill:** Never jump. Always animate width over `motion-expressive` with the M3 easing. The fill gradient transitions from `primary-container` to `primary`.

**Heatmap Load:** Cells populate column-by-column with `animation-delay` staggered at `8ms` intervals, fading in from `opacity: 0` and `translateY(4px)`.

---

## 6. Components — Precision Elements

### 6.1 Buttons

**Primary CTA**
```css
background: linear-gradient(135deg, #75d5e2 0%, #006069 100%);
border-radius: 0.75rem;
color: #001f23;
font: 600 0.9375rem/1 'Inter';
padding: 0.75rem 1.5rem;
box-shadow: 0 0 24px rgba(117,213,226,0.20);
transition: transform 150ms ease-out, box-shadow 150ms ease-out;
```
Hover: `translateY(-1px)` + increased glow. Active: `translateY(0)` + reduced glow.

**Secondary**  
`surface-container-high` fill, `primary` text. No border. Subtle background shift on hover.

**Ghost / Tertiary**  
Text only in `primary`. On hover: `surface-container` background at 60% opacity.

**Danger**  
`error/10` background, `error` text. Ghost border of `error` at 20% opacity.

### 6.2 Data Chips & Badges

Use `border-radius: 9999px`. Status chips: `background: status-color/10`, `color: status-color` at full opacity. This creates the "glow label" effect — a premium alternative to colored pills.

| Variant | Background | Text |
|---|---|---|
| Success | `tertiary/10` | `tertiary` |
| Active | `primary/10` | `primary` |
| Warning | `#f0c060/10` | `#f0c060` |
| Error | `error/10` | `error` |
| Neutral | `surface-container-high` | `on-surface-variant` |

### 6.3 Input Fields

```
Background: surface-container-highest
Border: none (default)
Border-radius: 0.5rem
Padding: 0.75rem 1rem
Font: Inter 400 0.9375rem
```

Focus state: Background shifts to `surface-bright`. Ghost border of `primary` at 25% opacity appears. Label animates up in `primary` color.

### 6.4 Cards

- **No dividers between list items.** Use 16–24px vertical whitespace or surface-level shift.
- Card resting state: `surface-container-high`, `shadow-ambient`
- Card hover: `surface-container-highest`, `shadow-float`, subtle `translateY(-2px)`
- Card active/selected: Left accent bar of `primary` (4px wide, full height, rounded right)

### 6.5 Progress Bars

```css
height: 4px; /* thin by default, 6px for primary metrics */
background: surface-container-highest; /* track */
border-radius: 9999px;
```
Fill: `linear-gradient(90deg, primary-container, primary)`. Never flat color.

For "overachieved" state (value > 100%): fill transitions to `tertiary` gradient.

### 6.6 Habit Heatmap

- Cell size: `10px × 10px` with `2px` gap
- Border-radius: `2px` (sm rounded — never sharp, never fully circular)
- Color ramp: `inactive → partial → primary → tertiary → legendary`
- Tooltip on hover: Glassmorphism panel, `surface-container-highest/90%`, `backdrop-blur(12px)`
- Month labels: `overline` style, `on-surface-variant`

### 6.7 Progress Rings (SVG)

Used for daily/weekly percentage metrics.
- Stroke width: `4px`
- Background ring: `surface-container-highest`
- Foreground: `primary` with `stroke-linecap: round`
- The number inside uses `headline-md` (Manrope) with `label-sm` descriptor below
- Animate via `stroke-dashoffset` on load with `motion-expressive` easing

### 6.8 Navigation

**Desktop Sidebar (Fixed, 256px)**  
`surface` background. Active item: `surface-container-high` fill + left `primary` accent bar (3px). Inactive icons: `on-surface-variant`. Active icons: `primary`.

**Mobile Bottom Bar**  
Glassmorphism: `rgba(13,20,22,0.85)` + `backdrop-blur(20px)`. Central FAB floats above with `primary` gradient and `-16px translateY`. No visible top border — elevation is defined by the shadow only (`shadow-float`).

### 6.9 Modals & Sheets

- Background: `surface-container-highest` at 96% opacity
- `backdrop-blur(20px)` on the overlay
- Border-radius: `1rem` (top corners only for bottom sheets)
- Entry: `translateY(100%)` → `translateY(0)` over `motion-expressive`
- A gradient "handle" indicator at the top of bottom sheets in `on-surface-variant/30`

---

## 7. NEW FEATURES — Design Specifications

### 7.1 🧠 AI Coach Panel (Conversational Interface)

A dedicated AI coaching surface distinct from simple insight cards. The AI Coach communicates in a conversational register — like a high-performance coach who has studied your data.

**Visual Treatment:**
- Full-width panel with a `surface-container-low` background
- Left edge: `4px` gradient bar — `linear-gradient(180deg, primary, secondary)` — the "Coach Signal"
- AI avatar: An abstract geometric glyph (not a face), animated with a slow pulse `glow-primary`
- Message bubbles: `surface-container-high` background, `1rem` border-radius
- Highlighted insights within the message: `primary` text weight 600, never underlined

**Interaction States:**
- Thinking: Three dots animate in `primary` with a wave pattern
- New insight ready: The Coach Signal bar pulses once
- User can rate insights (subtle thumbs up/down in `on-surface-variant` — no gamification weight)

### 7.2 🔥 Streak Visualization — "The Momentum Arc"

Replace the plain streak number with an arc visualization showing:
- **Inner ring:** Current streak (days)
- **Outer ring:** Personal best streak (context line in `on-surface-variant/30`)
- **Arc fill:** Animates clockwise, color shifts from `primary` → `tertiary` as streak approaches the personal best
- **Center:** `display-lg` number in Manrope 800, label below in `label-sm` `on-surface-variant`

At personal best: Outer ring fills in `legendary` amber with a `shadow-glow-legendary` pulse.

### 7.3 🗓️ Time-of-Day Context Banner

A subtle, full-width contextual banner that shifts with the time of day. Sits below the page header.

| Time | Greeting | Accent | Background Gradient |
|---|---|---|---|
| 5am–10am | "Morning Protocol" | `primary` | `radial-gradient(ellipse at top-left, primary/8%, transparent 70%)` |
| 10am–3pm | "Peak Window" | `secondary` | `radial-gradient(ellipse at top-right, secondary/6%, transparent 70%)` |
| 3pm–7pm | "Afternoon Momentum" | `tertiary` | `radial-gradient(ellipse at center, tertiary/6%, transparent 70%)` |
| 7pm–10pm | "Wind Down" | `#c084fc` (soft lavender) | `radial-gradient(ellipse at bottom, #c084fc/6%, transparent 70%)` |
| 10pm+ | "Recovery Mode" | `surface-container-high` | None (dark, quiet) |

This is not a bold visual element — it should be felt, not seen. The gradient is the atmosphere.

### 7.4 📊 Habit Correlation Chart — "The Resonance Map"

A dual-line chart on the Insights page visualizing two habits over time.

**Visual:**
- X-axis: 4 weeks of data, labeled at week intervals in `overline` style
- Y-axis: Hidden (values are shown on hover only)
- Line 1 (`primary` teal): Physical habit (e.g., Exercise)
- Line 2 (`secondary` blue): Mental habit (e.g., Focus Score)
- Lines use smooth cubic bezier curves, not straight segments
- Intersection zones: Subtle `primary/5%` fill between the lines when they move together
- Tooltip: Glassmorphism card, both values + "Correlation: 0.88" in `tertiary`

**Correlation Insight Card** (adjacent to chart):  
`surface-container-low` background. Header in `headline-md`. The correlation coefficient in `display-sm` Manrope. A single sentence explanation in `body-sm`.

### 7.5 🎯 Goal-Targeting Progress Indicator — "The Protocol Bar"

For habits with custom targets (e.g., "Run 5km", "Drink 3L", "Read 30 pages"):

- Replace simple checkboxes with a contextual progress bar + target chip
- Target chip: Shows goal in `label-md` — floats above the far right of the progress bar
- Current value: Shows below the progress fill in `on-surface-variant`
- At 100%: Bar transitions to `tertiary`, a "TARGET ACHIEVED" chip appears in `tertiary/10` + `tertiary` text
- Overachieve state (>100%): A small `legendary` pulse animates at the end of the bar

### 7.6 🔗 Habit Stacking — Visual Chain Representation

The "Stack of the Day" card uses a **vertical connector pattern**:

```
●  TRIGGER          ← dim node (surface-container-highest)
│
│  [Trigger card]
│
●  ACTION           ← glowing node (primary + shadow-glow-primary)
│
│  [Action card]    ← primary/10 background
│
○  NEXT             ← ghost node (outline-variant/30)
```

- Connector line: `surface-container-highest`, 1px, vertical
- Nodes: 10px circles
- Trigger node: Neutral — `surface-container-highest`  
- Action node: Glowing — `primary` fill + `shadow-glow-primary`
- Completed action: Node shifts to `tertiary` + `shadow-glow-tertiary`

Add a **"+ Link Habit"** ghost button at the bottom of each stack. On click, a bottom sheet presents available habits to chain.

### 7.7 ⚡ Quick Entry — Floating Action System

The "+ Quick Entry" button is a **glassmorphism FAB** (Floating Action Button):

```css
background: linear-gradient(135deg, #75d5e2 0%, #006069 100%);
border-radius: 9999px;
padding: 0.875rem 1.5rem;
backdrop-filter: blur(16px);
box-shadow: 0 8px 32px rgba(117,213,226,0.30);
```

On activation, the FAB **morphs** into a Quick Entry sheet:
1. FAB scales up and blurs (150ms)
2. Sheet expands from FAB position (400ms, `motion-expressive`)
3. Sheet contains: habit selector (chip group), value input, confirm button

The sheet background: `surface-container-highest` at 95% + `backdrop-blur(20px)`.

### 7.8 🏆 Milestone Celebration System — "The Quiet Win"

When a meaningful milestone is hit (7-day streak, 66-day habit formation, 100 total wins):

**No confetti. No popups.**

Instead:
1. The stat card **breathes** — a slow `scale(1.02)` pulse twice over 800ms
2. The metric number shifts briefly to `legendary` amber then fades back to `primary` over 2s
3. A single toast appears bottom-right (not bottom-center): 
   - `surface-container-highest` background
   - Left glow bar in `legendary`
   - Text: A milestone message in Manrope — brief, editorial, never generic
   - Auto-dismisses at 4s with a left-to-right fade wipe

**Example milestone messages (Manrope, italic):**
- *"14 days. The neural pathway is forming."*
- *"66 days. This is no longer a habit. It's you."*
- *"100 wins. Velocity confirmed."*

### 7.9 📅 Focus Mode — Evening Routine View

A specialized view activating after 7pm that shifts the dashboard into a quieter state:

- The `surface` background gains a barely-perceptible `radial-gradient` from `#0a1015` (even deeper than base)
- Card brightness reduces slightly — `brightness(0.92)` on all non-essential modules
- Only two modules are prominently displayed:
  1. **Tomorrow's Protocol** — habits to prepare for
  2. **Today's Wrap** — completion summary with the day's consistency score
- All other modules are dimmed but accessible via a "Show All" toggle
- A subtle ambient sound icon (muted by default) signals the mode shift

### 7.10 🌐 Offline State — "Signal Lost"

When the app detects no network connection:

- A `surface-container-high` banner slides in from the top (not a blocking modal)
- Left indicator: A pulsing dot in `error/60%`
- Text: *"Working offline. Your data is safe."* in `body-sm` `on-surface-variant`
- Habit logging still works — queued syncs are visualized as a subtle "sync pending" indicator on each logged item (a small `secondary` dot)

---

## 8. Layout Architecture

### Desktop Grid (≥1024px)
```
[256px Sidebar] | [Flexible Content — 8 cols] | [Optional Right Rail — 4 cols]
```

Sidebar: Fixed, `surface` background. Content area: Scrolls independently. Right rail: Sticky on scroll for AI coach / habit stacking cards.

### Asymmetric Spacing — "Editorial Breathing Room"

- Page padding: `2.5rem` (not the standard `1.5rem`)
- Card-to-card gap: `1.5rem`
- Section header margin-bottom: `2rem`
- Stat cards row: `1.25rem` gap
- Inner card padding: `1.5rem` standard, `2rem` for hero cards

Asymmetry is intentional. The main content column can shift `1.25rem` left of center. The right rail sits flush to the edge. This creates dynamic tension that feels editorial.

### Mobile Layout (< 768px)
- Single column, full width
- Bottom navigation bar (glassmorphism, 64px)
- Cards use full bleed to screen edges with `1rem` internal padding
- Heatmap scrolls horizontally within its container (custom scrollbar: 4px, rounded, `surface-container-highest`)

---

## 9. Accessibility

- **Contrast:** All text must meet WCAG AA (4.5:1 for body, 3:1 for large text). `on-surface` on `surface-container-high` is verified compliant.
- **Focus Indicators:** Default browser outline replaced with a `2px` ghost border of `primary` at 80% opacity, `2px offset`. Never hidden.
- **Motion:** All animations must respect `prefers-reduced-motion`. At reduced motion: duration collapses to `80ms`, no transforms, only opacity transitions.
- **Touch Targets:** Minimum `44px × 44px` for all interactive elements on mobile.
- **Screen Readers:** All icon-only buttons have `aria-label`. Heatmap cells have `aria-label="[Date]: [Status]"`.

---

## 10. Implementation Notes

### CSS Custom Properties
```css
:root {
  --primary: #75d5e2;
  --primary-container: #006069;
  --secondary: #96ccff;
  --tertiary: #7ddc7a;
  --legendary: #f0c060;
  --surface: #0d1416;
  --surface-container-lowest: #080f11;
  --surface-container-low: #161d1f;
  --surface-container: #1a2123;
  --surface-container-high: #242b2d;
  --surface-container-highest: #2f3638;
  --on-surface: #dde4e6;
  --on-surface-variant: #bec8c9;
  --outline-variant: #3f4949;
  
  --shadow-glow-primary: 0 0 24px rgba(117, 213, 226, 0.20);
  --shadow-glow-tertiary: 0 0 16px rgba(125, 220, 122, 0.18);
  --shadow-glow-legendary: 0 0 20px rgba(240, 192, 96, 0.25);
  
  --motion-fast: 150ms;
  --motion-standard: 250ms;
  --motion-expressive: 400ms;
  --easing-standard: cubic-bezier(0.2, 0, 0, 1);
  --easing-expressive: cubic-bezier(0.05, 0.7, 0.1, 1);
}
```

### Font Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Do's
- ✅ Use `on-surface-variant` for all secondary/supporting text
- ✅ Apply `backdrop-filter: blur()` on all overlapping glassmorphism elements
- ✅ Animate state changes — never jump
- ✅ Use the Achievement Spectrum for any data visualization involving completion
- ✅ Pair a `display` font size with a `label` font size for data lockups
- ✅ Use editorial milestone messages (Manrope, weighted) not generic copy

### Don'ts
- ❌ No 1px solid borders for defining sections — **ever**
- ❌ No black or neutral shadows — use tinted glows
- ❌ No confetti or cartoon celebration states
- ❌ No Inter for headlines > `title-lg`
- ❌ No flat color progress bars — always gradient
- ❌ No cramming — if a screen feels dense, add `surface` padding, not smaller text
- ❌ No `legendary` amber for anything except personal records — scarcity is power
- ❌ No generic AI insight copy — every coach message must feel written, not generated

---

*Kinetic Sanctuary Design System v2.0 — Built for the obsessed.*