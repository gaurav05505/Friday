/**
 * robotAudio.js
 * Desk Buddy Voice Synthesis and Cheerful Electronic Robot Chimes
 * Zero external audio files; uses Web Audio API + Web Speech Synthesis API.
 */

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a cute, cheerful 2-tone electronic robot chirp chime (like Wall-E / BB-8)
 */
export function playRobotChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Tone 1: Note 1 (D5 ~ 587Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // Quick upward pitch sweep

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.24);

    // Tone 2: Note 2 (A5 ~ 880Hz -> 1175Hz cute chirp)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.24);

    gain2.gain.setValueAtTime(0.001, now + 0.1);
    gain2.gain.linearRampToValueAtTime(0.14, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.start(now + 0.1);
    osc2.stop(now + 0.34);
  } catch (err) {
    console.debug('Audio chime playback omitted:', err);
  }
}

/**
 * Buddy Speech Synthesis: speaks a friendly greeting aloud in a cute, upbeat pitch
 */
export function speakRobotGreeting(text = 'Hii!') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending utterances

    // Clean greeting text for clean natural speech pronunciation
    const cleanText = text.replace(/[^a-zA-Z0-9\s!?,]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText || 'Hi!');

    utterance.pitch = 1.32; // Cheerful, cute robot pitch
    utterance.rate = 1.08;  // Lively brisk pace
    utterance.volume = 0.95;

    // Pick a natural / friendly voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') ||
              v.name.includes('Google') ||
              v.name.includes('Samantha') ||
              v.name.includes('Zira') ||
              v.name.includes('Victoria'))
        ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferred) {
        utterance.voice = preferred;
      }
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.debug('Speech synthesis omitted:', err);
  }
}
