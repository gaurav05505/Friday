# Desk Buddy — Minimalist AI Robot Eyes Interface & Interactive Companion

A mobile-first, expressive robot eyes interface and interactive companion for **Desk Buddy**, inspired by futuristic desktop robotics (such as LOOI, Cozmo, and Eve).

Recreated entirely from code using **React 19, Framer Motion, HTML5, and CSS3** to match the visual reference with precision: flat, clean cyan circular eyes with a subtle deep-blue shadow offset to the bottom-right on an OLED black / dark charcoal screen.

---

## ✨ Features

- **Exact Visual Reference Match**:
  - Two large, perfectly circular cyan eyes (`#8AD6E2`).
  - Deep cobalt-blue shadow layer offset towards bottom-right quadrant (`#323AA5`).
  - Dark Charcoal (`#0B0D12`) or True OLED Black (`#000000`) background.
  - Symmetrical horizontal alignment and proportional spacing (~0.78x eye diameter).
  - No eyebrows, nose, mouth, or visual clutter.

- **💻 Work Mode (Manual Button & Future Voice Command Ready)**:
  - **Focused Expression**: Transition's Buddy's eyes into a determined, serious, concentrated gaze (`scale: 1.04, 0.80`, downward focus).
  - **Minimalist Glowing Laptop**: Renders a sleek futuristic laptop in front of Buddy with ambient cyan light casting softly onto Buddy's face, animated coding streams, and backlit keyboard deck.
  - **Dual Robotic Typing Hands**: Two small robotic hands positioned over the keyboard.
  - **Natural Varied Typing**: Fingers animate with natural varied cadences (index, middle, pinky, thumb on left & right hands with independent staggered rhythms) instead of mechanical simultaneous tapping.
  - **Screen Scanning Gaze**: Buddy's eyes actively scan horizontally across the laptop screen while working, with occasional thoughtful glances.
  - **Status Label**: Sleek `"⚡ Working..."` badge with pulsing status dot and quick dismiss button.
  - **Smooth Deactivation**: Deactivating smoothly stops the typing animation, slides the laptop away, and returns Buddy's eyes to normal idle mode.
  - **Voice Activation Architecture**: Decoupled in [`useWorkMode.js`](file:///c:/Users/goura/OneDrive/Desktop/New%20Projects/Friday/frontend/src/hooks/useWorkMode.js) so future voice command recognition can trigger the exact same state machine.

- **👉 Cinematic Finger-Gun Mode (Framer Motion & SVG)**:
  - Matrix-style **cinematic slow motion dodge**: Buddy banks and tilts sideways (`-75px, +24px, -14°`) over 1.8 seconds.
  - A glowing cyan projectile glides across the screen in slow motion with 3 trailing ghost afterimages and floating particle sparks.
  - Coordinated eye gaze tracks the slow-motion bullet as it flies past his head.
  - Futuristic energy gun revealed, turning **directly toward the camera/viewer** in 3D perspective foreshortening.
  - Charging sequence with converging energy rings, followed by a massive cyan-blue plasma beam exploding toward the screen and cinematic screen muzzle flash.
  - Confident celebration wink, speech badge (`"Gotcha! 😉"`), and 3-second cooldown countdown.

- **👋 Interactive Greeting & Robotic Hand System**:
  - Minimalist cyan robotic hand smoothly enters on initial launch, waves with natural wrist oscillation, pops up a `"Hii!"` speech bubble, and the eyes smile (`◠ ◠`)! The hand then smoothly retracts completely off-screen.
  - Quick, punchy ~1.45s timing.
  - Session-aware: runs once upon opening, and can be re-triggered anytime by tapping the hand, pressing `G`, or via the testing dock.

- **📱 Mobile-First Responsive Layout**:
  - Scales gracefully from 320px smartphones up to 4K desktop screens.
  - Fluid sizing with CSS `clamp()` and `min(vw, vh)` ensuring eyes, laptop, hands, and raygun remain proportional across portrait and landscape docks.
  - Safe-area insets support (`env(safe-area-inset-*)`) for notched displays.
  - Full viewport lock (`100dvh`), avoiding accidental scrolling, pull-to-refresh, or pinch-zoom.

- **👁️ Natural Organic Blinking & Living Gaze**:
  - Randomized timing intervals (2.5s – 5.5s, customized per expression).
  - Multi-phase eyelid physics with occasional realistic double-blinks.
  - Real-time touch/pointer tracking with exponential lerp smoothing.
  - **Zero React re-renders on pointer move**: direct CSS variable injection via `requestAnimationFrame` for guaranteed 60–120fps mobile performance.
  - Natural saccades & physiological micro-drift wave mimicking biological breathing.

- **🎭 7 Expressive States**:
  1. **Neutral**: Calm, relaxed robotic gaze with standard blinking and idle saccades.
  2. **Happy**: Slightly narrowed cheerful eyes with upward arch, inward tilt, and joyful double-blinking.
  3. **Sleepy**: Heavily lowered eyelids, drowsy slow blinks, downward drift, and weary tilt.
  4. **Curious**: Enlarged attentive gaze (+15% scale) with inquisitive synchronized head tilt.
  5. **Surprised**: Widened alert eyes (+30% scale) with startle pop entry and flutter blinks.
  6. **Thinking**: Eyes glance towards the upper corner with subtle cognitive scanning motion.
  7. **Focused (Work Mode)**: Serious, concentrated gaze scanning down toward the laptop display.

---

## ⌨️ Keyboard & Touch Shortcuts

| Action | Control / Key |
|---|---|
| **💻 Toggle Work Mode** | Key `M` or tap the laptop button in the dock |
| **👉 Trigger Finger-Gun Mode** | Key `P` or tap the finger-gun button in the dock |
| **👋 Wave Hand & Greeting** | Key `G` or tap the robotic hand / dock wave button |
| **Tap Eyes** | Playful reaction (wink, giggle message, happy squint) |
| **Double Blink Reaction** | Double-tap anywhere on screen (<320ms) |
| **Trigger Blink** | `Spacebar` or tap eye button in dock |
| **Wink Left Eye** | Tap directly on left eye or press `W` |
| **Wink Right Eye** | Tap directly on right eye |
| **Expressions 1–7** | Keys `1` to `7` (Neutral, Happy, Sleepy, Curious, Surprised, Thinking, Focused) |
| **Gaze Tracking** | Drag finger or move mouse across screen |
| **Toggle Fullscreen** | Key `F` or fullscreen icon in dock |

---

## 📁 Component Architecture

```
frontend/src/
├── components/
│   ├── Eye.jsx                 # Individual eye (cyan surface + deep-blue shadow layers)
│   ├── EyePair.jsx             # Symmetrical horizontal pair and positioning
│   ├── RobotHand.jsx           # SVG robotic hand with wrist rotation & waving animation
│   ├── GreetingBubble.jsx      # Minimalist speech bubble for companion messages
│   ├── FingerGunEffect.jsx     # Framer Motion slow-mo projectile, 3D barrel & screen beam
│   ├── WorkModeRig.jsx         # Minimalist glowing laptop & dual animated typing hands
│   └── ExpressionControls.jsx  # Mobile-first collapsible testing dock
├── constants/
│   └── expressions.js          # Expressions geometry, tilts, blinks & gaze configurations
├── hooks/
│   ├── useBlink.js             # Natural multi-phase blinking & double-blink timing
│   ├── useEyeGaze.js           # 120fps lerp tracking, idle saccades & micro-drifts (0 re-renders)
│   ├── useGreeting.js          # Greeting state machine, hand entrance/exit, & message cycle
│   ├── useFingerGun.js         # Slow-mo dodge, synchronized gaze, 3D blast, & cooldown state
│   └── useWorkMode.js          # Work mode state, screen scanning saccades, & voice-ready API
├── styles/
│   ├── index.css               # Mobile viewport reset, OLED mode, safe area insets
│   ├── eyes.css                # Reference color tokens, fluid clamp sizing, GPU transforms
│   ├── hand.css                # Hand entrance, waving wrist keyframes, speech bubble
│   ├── fingerGun.css           # Fullscreen flash, 3D muzzle perspective, shockwave rings
│   ├── workMode.css            # Glowing laptop screen, dual typing hands, code streams
│   └── controls.css            # Touch-friendly dock, drawer animations, theme toggles
├── App.jsx                     # Top-level orchestration & keyboard/touch listeners
└── main.jsx                    # React 19 entry point
```

---

## 🚀 Getting Started

### Run Development Server
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```

### Run Linter
```bash
cd frontend
npm run lint
```
