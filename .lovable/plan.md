# Sim_ie — Functional Upgrade Plan

Preserve existing notebook design tokens (ivory `--paper`, sage `--primary`, Cambria headings, Calibri body, `notebook-grid`, `graph-paper`, `paper-card`). No new design system. Add one semantic `--warning` token for alarm states.

## 1. Circuit Builder — Simplified Schematic Sandbox

File: `src/pages/CircuitBuilder.tsx` (rewrite)

- **Component library (left rail)** — exactly 5 items, each with an inline SVG symbol component:
  1. Input Electrode (circle + lead line)
  2. Op-Amp (triangle with + / − pins)
  3. Resistor (zig-zag)
  4. Capacitor (two parallel plates)
  5. Ground (three stacked horizontal bars)
- **Placement** — click to place at next free slot OR drag onto the graph paper. Snap to 20px grid. Components stored as `{id, type, x, y}`. Auto-draw a thin connecting line (sage stroke) between consecutive placements to convey the linear chain visually.
- **Per-symbol affordances** — hover shows label and a tiny remove (×) button.
- **Simulate Output (top-right button)**:
  - Validates chain: must contain Electrode → Op-Amp → (Resistor OR Capacitor) → Ground (any subset order is fine as long as Electrode is first and Ground is last and at least 3 nodes total).
  - On success: slide-up bottom drawer (custom div, no new dep) with a looping SVG sine/ECG-ish waveform whose amplitude scales with Op-Amp presence and smoothness with Capacitor presence.
  - On failure: `sonner` toast `"Open Circuit detected in filter stage."` plus inline hint banner pointing at the missing stage.
- **Clear** retained. **Close drawer** button on drawer.

## 2. Simulation View — Patient Monitor with Versions + Scenarios

File: `src/pages/Simulation.tsx` (rewrite). Keep header + sage palette.

### Layout

- Top sub-tab strip: 5 **Version** tabs (shadcn `Tabs`):
  - Introduction & Theory
  - BME / Technical
  - Circuit Building / PCB
  - Troubleshooting & Service
  - User / Clinical (default)
- Three-column body: **left controls / center multi-trace canvas / right hotspot assembly**.

### Center — Patient Monitor canvas (User/Clinical version)

- Single HTML `<canvas>` driven by `requestAnimationFrame`. Five stacked rows, each with its own color (use new semantic tokens):
  - ECG — `--trace-ecg` (sage-leaning green)
  - RESP — `--trace-resp` (muted yellow)
  - Pleth/SpO2 — `--trace-pleth` (muted cyan)
  - CO2 — `--trace-co2` (muted violet)
  - IBP — `--trace-ibp` (muted red)
- Math: ECG = sum of gaussians for P, QRS, T scaled by `heartRate`; RESP = sine at `respRate`; Pleth = damped sine synced to HR; CO2 = trapezoid; IBP = double-hump per beat.
- Vitals digits panel on the right edge of the canvas (HR, SpO2, RR, etBCO2, BP).

### Left — Controls panel

- Sliders (shadcn `Slider`): Heart Rate, Resp Rate, SpO2, BP Systolic, Noise. All wired to canvas state.
- Below sliders: **Scenario row** (4 buttons in a horizontal `paper-card`): Normal · Arrhythmia (V-Tach) · Apnea · Hypoxia.
  - Normal → base formulas, default vitals.
  - V-Tach → ECG generator switches to fast chaotic sawtooth-sine hybrid (rate forced ~180), IBP peak drops ~40%.
  - Apnea → RESP and CO2 generators return 0 (flat baseline); whole vitals frame gets `animate-pulse` + `--warning` ring (red-ish on ivory) — implemented as `ring-2 ring-warning animate-pulse`.
  - Hypoxia → SpO2 slider snaps to 82, Pleth amplitude scaled to 0.4.

### Right — Hardware Assembly with hotspots

- Inline SVG of a stylized patient monitor: LCD screen, PCB layer, power module, comm module, sensor ports.
- Each region is a `<g>` with `onClick` opening an absolute-positioned floating panel (paper-card) anchored near the clicked region. Panel content: role / typical parameters / common failure modes. ESC or backdrop click closes. Use one piece of state `activeHotspot`.

### Version tabs change the right column / overlay

- Introduction & Theory → swap right column for explanatory text + simplified block diagram (Sensor → Amp → Filter → ADC → Display).
- BME / Technical → architecture diagram (ISA buses, microcontroller, modules) labeled.
- Circuit Building / PCB → SVG PCB top-view with copper traces and silkscreen labels; clicking traces shows what signal they carry.
- Troubleshooting & Service → mini sandbox: choose a fault from a list (Sensor lead-off / Amplifier saturation / Filter ringing / Display flicker) → that block flashes `--warning`, center canvas shows expected artifact, step list shows fix procedure with a "Resolve" button.
- User / Clinical → default (the live monitor described above).

State stays mounted across version tabs so the simulation keeps running.

## 3. Community Hub — Live React State

File: `src/pages/Community.tsx` (modify)

- Replace static `mockMessages` with `messagesByChannel: Record<string, Message[]>` in state, seeded with the existing mock entries on `#general`. Channels: `general`, `questions`, `projects` (the other two stay in UI but also wired).
- `activeChannel` already exists — make the feed render `messagesByChannel[activeChannel]`.
- **Composer**:
  - Controlled input → Enter or send-button click pushes `{ id, user: "User (Student)", role: "Student", text, time: new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) }` to the active channel and clears input.
  - Auto-scroll feed to bottom on new message (ref + `scrollIntoView`).
- **Simulated peer reply**:
  - On user send, `setTimeout(3000)` pushes a mentor reply from a small rotating pool keyed off keyword detection (default author "Dr. Sarah Jansen", role "Mentor"). Clear timer on unmount / channel switch.
- Channel switching already wired — verify and keep.

## Shared / Token Work

`src/index.css`:

- Add semantic tokens:
  - `--warning: 12 70% 55%;` + `--warning-foreground: 0 0% 100%;`
  - `--trace-ecg: 150 50% 40%;`
  - `--trace-resp: 45 70% 50%;`
  - `--trace-pleth: 185 55% 50%;`
  - `--trace-co2: 280 35% 55%;`
  - `--trace-ibp: 5 65% 55%;`

`tailwind.config.ts`:

- Extend `colors` with `warning` (DEFAULT + foreground) and `trace.{ecg,resp,pleth,co2,ibp}`, all using `hsl(var(--...))`.

## Out of Scope (this round)

- Dashboard rebrand to Sim_ie, ECG-machine SVG, 6 categories; diagnostic, rehabilitation, therapeutic, Life support, monitoring, and laboratory/analytical devices or machines — handled separately.
- Real backend / persistence / auth.
- Mobile-first responsive collapsing of triple-column layouts (will degrade gracefully but not fully redesigned).

## Files Touched

- `src/index.css` (tokens)
- `tailwind.config.ts` (colors)
- `src/pages/CircuitBuilder.tsx` (rewrite)
- `src/pages/Simulation.tsx` (rewrite)
- `src/pages/Community.tsx` (state + composer + auto-reply)