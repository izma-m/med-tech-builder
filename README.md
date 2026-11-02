# sim-ie

Design a modern, minimal, and highly intuitive web app wireframe for a Biomedical Engineering Visual Simulation Platform called “ClinSim”.

The goal of this app is NOT just to teach theory, but to help students learn how biomedical machines work, including:

 Understanding signals (ECG, EEG, etc.)

 Building systems (circuits + sensors)

 Simulating real-world medical devices

The design should feel:

 Clean and futuristic (similar to medical UI dashboards)

 Slightly dark-themed (black/charcoal background with neon accents like green/blue ECG tones)

 Minimal but interactive (not cluttered)

 Built for students (Gen Z-friendly but professional)

🧩 1. AUTH FLOW

🔐 Sign Up Page

 Simple, centered card UI

 Fields:

 Full Name

 Email

 Password

 CTA: “Create Account”

 Secondary option: “Already have an account? Login”

 Optional: Google sign-in

 Visual: subtle animated waveform (ECG/EEG style) in background

🔑 Login Page

 Email + Password

 “Forgot Password?”

 CTA: Login

 Clean, distraction-free

 Same visual identity as signup

🏠 2. MAIN DASHBOARD (HOME PAGE)

This is the most important page.

Layout:

 Left Sidebar Navigation

 Top Bar (Search + Profile)

 Main Content Area

📌 Sidebar Navigation:

 Home

 Simulations

 Circuit Builder

 My Progress

 Saved Projects

 Settings

🔝 Top Bar:

 Search simulations (e.g. “ECG”, “MRI”)

 Profile icon

 Notifications (optional)

🧠 Main Section:

🔹 Welcome Section

 “Welcome back, [Name]”

 Subtitle: “Continue building biomedical systems”

🔹 Categories of Simulations (Grid Layout)

Each category is a clickable card:

Bio-Signals

 ECG

 EEG

 EMG

Medical Devices

 Patient Monitor

 Ventilator

 Infusion Pump

Imaging Systems

 X-Ray

 CT Scan

 MRI

Circuit-Based Systems

 Amplifiers

 Filters

 Sensor circuits

Each card should:

 Have icon/visual

 Short description

 “Explore” button

🔹 Continue Learning Section

 Recently opened simulations

 Resume buttons

🔹 Featured Simulation

 Highlight:
“Build an ECG Machine from Scratch”

 CTA: Start Simulation

🧪 3. SIMULATION PAGE (CORE EXPERIENCE)

This is the HEART of the app.

Layout:

Split screen:

LEFT PANEL → Controls

 Parameters (sliders, toggles)

 Heart Rate

 Blood Pressure

 Noise Level

 Simulation states:

 Normal

 Arrhythmia

 Fault Mode

CENTER → VISUAL OUTPUT

 Real-time waveform display

 Animated graphs (ECG/EEG etc.)

 Clean black background with glowing lines

RIGHT PANEL → SYSTEM BREAKDOWN

 Blocks showing:

 Sensor

 Amplifier

 Filter

 Output

 Each block clickable → opens explanation

BOTTOM PANEL → LEARNING MODE

Tabs:

 “Concept”

 “Circuit”

 “Code (Arduino-style)”

 “Real-Life Application”

🔌 4. CIRCUIT BUILDER PAGE

Drag-and-drop interface (VERY IMPORTANT)

Features:

 Components panel:

 Resistors

 Capacitors

 Op-Amps

 Sensors

 Workspace grid

 Drag wires between components

 Simulate output

Goal:

Students build systems like:

 ECG amplifier circuit

 Signal filtering chain

📊 5. MY PROGRESS PAGE

 Completed simulations

 Skill progress bars:

 Signal Understanding

 Circuit Design

 System Thinking

 Achievements / badges

💾 6. SAVED PROJECTS

 Saved simulations

 Custom-built circuits

 Editable + Resume option

⚙️ 7. SETTINGS PAGE

 Profile settings

 Dark/light toggle (default dark)

 Learning preferences

🎨 DESIGN SYSTEM

Colors:

 Background: Black / Dark Gray

 Accent:

 Neon Green (ECG)

 Electric Blue

 Text: White / Light gray

Typography:

 Clean sans-serif (modern)

 Slightly tech/medical feel

UI Style:

 Rounded cards

 Soft glow effects

 Minimal borders

 Smooth transitions

🧠 IMPORTANT DESIGN PHILOSOPHY

This is NOT a generic learning app.

This app must:

 Feel like a biomedical lab + simulator

 Help users think like engineers:
→ Input → Processing → Output

 Emphasize:

 Systems

 Circuits

 Real-world machines

⭐ BONUS FEATURES (if possible)

 “Fault Injection Mode” (simulate device errors)

 “Guided Build Mode” (step-by-step machine creation)

 Multiplayer lab (future concept)

💡 Extra Tip (for YOU)

After generating this, your next step should be:

 Export layout ideas

 Recreate in FlutterFlow

 Then connect:

 Simulation logic (JS / Python backend)

 UI animations (charts, canvas)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://med-tech-builder.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5d014992-e8c0-463a-bf82-a6cef6112009).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
