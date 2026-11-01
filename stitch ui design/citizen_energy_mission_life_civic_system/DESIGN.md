---
name: Citizen Energy & Mission LiFE Civic System
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3f4945'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#707975'
  outline-variant: '#bfc9c4'
  surface-tint: '#29695a'
  primary: '#003a2f'
  on-primary: '#ffffff'
  primary-container: '#0b5345'
  on-primary-container: '#86c5b3'
  inverse-primary: '#93d3c1'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#003847'
  on-tertiary: '#ffffff'
  tertiary-container: '#005065'
  on-tertiary-container: '#73c3e2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#afefdc'
  primary-fixed-dim: '#93d3c1'
  on-primary-fixed: '#002019'
  on-primary-fixed-variant: '#065043'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#b9eaff'
  tertiary-fixed-dim: '#81d1f0'
  on-tertiary-fixed: '#001f29'
  on-tertiary-fixed-variant: '#004d62'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Public Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  headline-xl-mobile:
    fontFamily: Public Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Source Sans 3
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Source Sans 3
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Source Sans 3
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 20px
  label-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
  label-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system projects unyielding institutional credibility, civic pride, and modern environmental stewardship. Built for universal public access across demographics, the design language marries bureaucratic authority with optimistic, action-oriented climate empowerment.

The style is **Corporate / Modern Civic-Tech**: crisp, structured layouts, purposeful contrast ratios, and deliberate functional hierarchy. Avoid excessive decoration, trendy skeumorphism, or high-friction glass layers. Visual weight stems from precise information design, high-legibility government-grade typography, and clean, modular data displays. Citizen dashboards, subsidy calculators, and community leaderboards maintain an open, trustworthy aesthetic that feels both official and welcoming.

## Colors

The palette establishes institutional trust through nature-grounded depth and solar energy vitality, adhering strictly to WCAG 2.1 AA and AAA standards.

- **Primary (`#0B5345`)**: Deep Emerald Forest. Represents governmental stability, ecological authority, and institutional integrity. Utilized for major navigation bars, key interactive actions, authoritative badges, and active civic states.
- **Secondary (`#F59E0B`)**: Warm Solar Amber. Evokes clean solar energy, solar rooftop incentives (Surya Ghar), gamified points, LiFE pledges, and highlight badges. Used purposefully as an accent to drive user engagement without competing with the primary green.
- **Tertiary (`#0E7490`)**: Clean Hydro/Aero Cyan. Supports data visualization, analytical metrics, water/wind energy initiatives, and carbon audit trend lines.
- **Neutral (`#0F172A`)**: Deep Slate. Serves as high-contrast body typography, critical text elements, and anchor borders. Paired with background tints of `#F8FAFC` (Canvas Gray-White) and `#FFFFFF` (Surface Elevated) to guarantee optimal contrast and reduce digital fatigue.
- **Success (`#10B981`)**: Renewable Green. Used for verified energy savings, positive metric deltas, and completed citizen milestones.

## Typography

Typography prioritizes extreme clarity across wide demographic ranges, multilingual translation contexts, and varying device displays.

- **Headlines (`Public Sans`)**: A sturdy, government-grade geometric grotesque engineered for civic communication. Conveys structure, clarity, and authority in section headers, portal navigation, and metric titles.
- **Body Text (`Source Sans 3`)**: A rational humanist workhorse offering pristine legibility in continuous prose, subsidy rules, citizen FAQs, and energy audit instructions. Open counters and distinct letterforms prevent character ambiguity in figures and numeric indicators.
- **Data & Numeric Displays**: Key audit metrics, kWh readings, subsidy rupee figures (`₹`), and community rank ordinals leverage tabular lining figures with bold weights in `Public Sans` to ensure alignment across multi-row data tables.

## Layout & Spacing

The layout is anchored on an 8pt base grid implemented through a flexible 12-column grid system for large screens and reflowable 4-column structures on mobile devices.

- **Desktop (1024px and above)**: 12 columns with a fixed maximum container width of 1280px, `margin: 2rem`, and `gutter: 1.5rem`. Enables multi-column analytical panels, split calculator interfaces, and side-by-side comparative leaderboards.
- **Tablet (640px to 1023px)**: 8 columns, `margin: 1.5rem`, `gutter: 1rem`. Cards and calculator output views condense to dual-column stacks.
- **Mobile (under 640px)**: 4 columns, `margin-sm: 1rem`, `gutter-sm: 1rem`. Forms, calculation steps, and data cards switch to full-width linear feeds.
- **Rhythm & Padding**: Strict reliance on `space-sm` (8px) for tightly grouped form controls, `space-md` (16px) for card body padding and lists, and `space-xl` (40px) for separating logical government domains and citizen action modules.

## Elevation & Depth

Visual hierarchy employs **Tonal Layering with Crisp Low-Contrast Outlines**, avoiding heavy blur matrices or floating neomorphic illusions to preserve an authoritative, print-like administrative aesthetic.

- **Level 0 (Canvas Base)**: `#F8FAFC` base surface creating soft, glare-free background contrast for day-long reading.
- **Level 1 (Card & Content Surface)**: Pure `#FFFFFF` surface bordered by a 1px structural outline of `#E2E8F0`. Shadow is microscopic: `0 1px 2px 0 rgba(15, 23, 42, 0.05)`.
- **Level 2 (Interactive Floating & Menus)**: `#FFFFFF` surface elevated using `0 4px 6px -1px rgba(15, 23, 42, 0.08), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`. Applied to tooltips, subsidy calculation summary overlays, and dropdown navigation panels.
- **Level 3 (Modal Dialogs & Critical Pledges)**: Modals and action sheets use `0 20px 25px -5px rgba(15, 23, 42, 0.12)` layered above a 40% opacity `#0F172A` backdrop scrim.

## Shapes

The design system enforces a **Soft (`1`)** shape language.

- **Base Radius (`0.25rem` / `4px`)**: Inputs, badges, small buttons, status indicators, and table cells.
- **Container Radius (`rounded-lg` / `0.5rem` / `8px`)**: Data cards, metric panels, subsidy calculator steps, and pledge certificates.
- **Surface Modal Radius (`rounded-xl` / `0.75rem` / `12px`)**: Citizen modals, bottom sheets, and major dashboard widget wrappers.

This restrained rounding conveys administrative formality and technological precision while maintaining approachable human warmth. Pill shapes are strictly forbidden except for circular user avatars and compact badge tags.

## Components

### Buttons
- **Primary Action**: Solid `#0B5345` fill with white text (`label-md`). Flat default state; `:hover` deepens to `#083D32`; `:focus-visible` presents a crisp 2px offset ring in `#F59E0B`. Used for primary citizen commitments (e.g., "Submit Pledge", "Calculate Solar Subsidy").
- **Secondary Action**: Bordered button with 1.5px `#0B5345` line, transparent background, and `#0B5345` text. On hover, fills with a 5% opacity tint of the primary color.
- **Accent / Solar Action**: Solid `#F59E0B` fill with `#0F172A` text. Reserved strictly for peak high-value clean energy conversion points (e.g., "Apply for PM Surya Ghar").
- **Disabled State**: `#E2E8F0` fill with `#94A3B8` label, retaining structural bounds without opacity tricks.

### Chips & Badges
- **Status & LiFE Categories**: 4px radius with 6px vertical / 10px horizontal padding.
- **Energy Badges**: Subtle light tint backgrounds (e.g., 10% `#F59E0B` tint for "Solar Pioneer", 10% `#0B5345` for "Energy Auditor") with high-contrast foreground text in matching base shades.

### Input Fields & Selects
- 4px radius, 1.5px border in `#CBD5E1`, `#FFFFFF` interior fill, with 12px horizontal and 10px vertical padding.
- Focused state transforms the border to `#0B5345` with a subtle 2px outer aura.
- Labels are positioned statically above the field in `Public Sans` (`label-sm`, `#0F172A`) with unambiguous asterisks for required administrative fields.

### Checkboxes & Radio Buttons
- 18px by 18px click target inside a 44px minimum accessible tap area.
- Unchecked: 1.5px outline in `#64748B`. Checked: Solid `#0B5345` with crisp white checkmark or center pip. Focus rings adhere to `#F59E0B`.

### Lists & Data Grids
- Tabular lists for audit history and leaderboards use alternating zebra fills (`#FFFFFF` and `#F8FAFC`) with subtle 1px dividers in `#E2E8F0`.
- Metric numbers and ranks are right-aligned and bolded; descriptive metadata uses secondary body styles.

### Cards & Dashboards
- **Metric Tiles**: Level 1 elevation cards featuring top-accent colored indicator bars (3px solid `#0B5345` for consumption, `#F59E0B` for solar generation, `#0E7490` for carbon offset).
- **Gamified Pledge Cards**: Structured with distinct iconography on the left, clear civic pledge targets in the center, and interactive toggle switches or completion checkmarks on the right.

### Subsidy Calculator Widgets
- Stepped horizontal progress track utilizing filled `#0B5345` segments.
- Live cost and savings outputs displayed inside prominent summary containers with distinct `#F8FAFC` backgrounds and `#F59E0B` visual callouts for total subsidy benefits.