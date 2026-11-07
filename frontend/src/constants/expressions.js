/**
 * Expression configuration for Desk Buddy Robot Eyes
 * Defines geometric scale, tilt, border radius / shape, blink behavior, and gaze tendencies for each expression.
 */

export const EXPRESSIONS = {
  NEUTRAL: 'neutral',
  HAPPY: 'happy',
  SLEEPY: 'sleepy',
  CURIOUS: 'curious',
  SURPRISED: 'surprised',
  THINKING: 'thinking',
  FOCUSED: 'focused', // Serious, concentrated work mode expression
};

export const EXPRESSION_CONFIGS = {
  [EXPRESSIONS.NEUTRAL]: {
    id: EXPRESSIONS.NEUTRAL,
    label: 'Neutral',
    icon: '● ●',
    description: 'Relaxed, calm robotic gaze with natural idle saccades and blinks.',
    scaleX: 1.0,
    scaleY: 1.0,
    leftRotate: 0,
    rightRotate: 0,
    borderRadius: '50%',
    blinkIntervalMin: 2800,
    blinkIntervalMax: 5500,
    blinkDuration: 140, // ms
    doubleBlinkChance: 0.18,
    gazeRangeX: 28, // max px gaze deflection
    gazeRangeY: 20,
    gazeBiasX: 0,
    gazeBiasY: 0,
    idleSpeed: 1.0,
  },

  [EXPRESSIONS.HAPPY]: {
    id: EXPRESSIONS.HAPPY,
    label: 'Happy',
    icon: '◠ ◠',
    description: 'Joyful, slightly narrowed cheerful eyes with upward arch and upbeat personality.',
    scaleX: 1.08,
    scaleY: 0.72,
    leftRotate: 4.0, // subtle cheerful inward tilt
    rightRotate: -4.0,
    borderRadius: '50% 50% 32% 32% / 65% 65% 35% 35%',
    blinkIntervalMin: 2200,
    blinkIntervalMax: 4400,
    blinkDuration: 120,
    doubleBlinkChance: 0.35, // happy double blinks happen more frequently
    gazeRangeX: 22,
    gazeRangeY: 16,
    gazeBiasX: 0,
    gazeBiasY: -6, // slightly elevated cheerful gaze
    idleSpeed: 1.25,
  },

  [EXPRESSIONS.SLEEPY]: {
    id: EXPRESSIONS.SLEEPY,
    label: 'Sleepy',
    icon: '◒ ◒',
    description: 'Drowsy, partially closed eyes with slow, heavy blinks and downward drift.',
    scaleX: 1.02,
    scaleY: 0.44, // heavily lowered eyelids
    leftRotate: -3.5, // weary outward droop
    rightRotate: 3.5,
    borderRadius: '24% 24% 50% 50% / 30% 30% 70% 70%',
    blinkIntervalMin: 5500,
    blinkIntervalMax: 9500,
    blinkDuration: 380, // slow, heavy blink
    doubleBlinkChance: 0.05,
    gazeRangeX: 14,
    gazeRangeY: 12,
    gazeBiasX: 0,
    gazeBiasY: 12, // heavy downward droop
    idleSpeed: 0.5,
  },

  [EXPRESSIONS.CURIOUS]: {
    id: EXPRESSIONS.CURIOUS,
    label: 'Curious',
    icon: '◕ ◕',
    description: 'Slightly enlarged, attentive eyes with an inquisitive head tilt.',
    scaleX: 1.15,
    scaleY: 1.15,
    leftRotate: 5.0, // inquisitive synchronized cocked tilt
    rightRotate: 5.0,
    borderRadius: '50%',
    blinkIntervalMin: 3500,
    blinkIntervalMax: 7000,
    blinkDuration: 130,
    doubleBlinkChance: 0.12,
    gazeRangeX: 34,
    gazeRangeY: 26,
    gazeBiasX: 10, // looking slightly to the side
    gazeBiasY: -8, // looking slightly upward
    idleSpeed: 1.1,
  },

  [EXPRESSIONS.SURPRISED]: {
    id: EXPRESSIONS.SURPRISED,
    label: 'Surprised',
    icon: 'O O',
    description: 'Widened, enlarged eyes with heightened alert state and startle pop.',
    scaleX: 1.28,
    scaleY: 1.34,
    leftRotate: 0,
    rightRotate: 0,
    borderRadius: '50%',
    blinkIntervalMin: 4500,
    blinkIntervalMax: 8500, // wide-eyed stare before blinking
    blinkDuration: 95,
    doubleBlinkChance: 0.45, // rapid alert flutter blinks
    gazeRangeX: 20,
    gazeRangeY: 18,
    gazeBiasX: 0,
    gazeBiasY: 0,
    idleSpeed: 1.4,
  },

  [EXPRESSIONS.THINKING]: {
    id: EXPRESSIONS.THINKING,
    label: 'Thinking',
    icon: '↗ ↗',
    description: 'Eyes glance toward the upper corner with subtle cognitive scanning motion.',
    scaleX: 0.95,
    scaleY: 0.95,
    leftRotate: -2,
    rightRotate: -2,
    borderRadius: '48% 52% 50% 50%',
    blinkIntervalMin: 3000,
    blinkIntervalMax: 6000,
    blinkDuration: 160,
    doubleBlinkChance: 0.15,
    gazeRangeX: 16,
    gazeRangeY: 14,
    gazeBiasX: 22, // look up and to the right
    gazeBiasY: -20,
    idleSpeed: 0.7,
  },

  [EXPRESSIONS.FOCUSED]: {
    id: EXPRESSIONS.FOCUSED,
    label: 'Focused',
    icon: '■ ■',
    description: 'Serious, concentrated gaze scanning down toward the laptop while working.',
    scaleX: 1.04,
    scaleY: 0.80, // focused, slightly narrowed concentrated eyes
    leftRotate: 2.0, // determined subtle inward focus
    rightRotate: -2.0,
    borderRadius: '45% 45% 40% 40% / 55% 55% 45% 45%',
    blinkIntervalMin: 4200,
    blinkIntervalMax: 7800,
    blinkDuration: 110,
    doubleBlinkChance: 0.10,
    gazeRangeX: 18, // scanning left to right across code
    gazeRangeY: 6,
    gazeBiasX: 0,
    gazeBiasY: 14, // looking down at laptop screen in front of him
    idleSpeed: 0.85,
  },
};
