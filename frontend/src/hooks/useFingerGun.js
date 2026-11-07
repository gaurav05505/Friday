import { useState, useRef, useCallback, useEffect } from 'react';
import { EXPRESSIONS } from '../constants/expressions';

/**
 * useFingerGun hook
 * Manages the revised cinematic slow-motion Finger-Gun interactive sequence:
 * 1. Surprise reaction (0 - 450ms)
 * 2. Slow-motion dodge synchronized with glowing projectile & gaze tracking (450ms - 2250ms)
 * 3. Energy gun revealed & aimed directly towards the camera/viewer (2250ms - 2950ms)
 * 4. Brief charging animation with converging energy (2950ms - 3600ms)
 * 5. Cyan-blue energy beam fired directly towards the viewer with muzzle flash (3600ms - 4300ms)
 * 6. Playful confident celebration & wink (4300ms - 5100ms)
 * 7. Return to normal idle state & cooldown timer
 */
export function useFingerGun({ onExpressionChange, onTriggerWink, containerRef }) {
  const [isPlaying, setIsPlaying] = useState(false);
  // 'idle' | 'surprise' | 'slowmo_dodge' | 'reveal_aim' | 'charging' | 'firing' | 'celebrating'
  const [phase, setPhase] = useState('idle');
  const [cooldown, setCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const timeoutsRef = useRef([]);
  const cooldownIntervalRef = useRef(null);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const triggerFingerGun = useCallback(() => {
    if (isPlaying || cooldown) return;

    clearAllTimeouts();
    setIsPlaying(true);

    // 1. Surprise notice (0ms - 450ms)
    setPhase('surprise');
    onExpressionChange?.(EXPRESSIONS.SURPRISED);

    // 2. Cinematic slow-motion dodge (450ms - 2250ms)
    const t1 = setTimeout(() => {
      setPhase('slowmo_dodge');

      // Coordinate eye gaze tracking the slow-motion bullet in flight
      if (containerRef?.current) {
        containerRef.current.style.setProperty('--gaze-x', '22px');
        containerRef.current.style.setProperty('--gaze-y', '-8px');
      }

      // Halfway through the slow-motion pass, gaze follows the bullet past the head
      const gazeTimer = setTimeout(() => {
        if (containerRef?.current) {
          containerRef.current.style.setProperty('--gaze-x', '-24px');
          containerRef.current.style.setProperty('--gaze-y', '10px');
        }
      }, 900);
      timeoutsRef.current.push(gazeTimer);
    }, 450);

    // 3. Reveal gun & aim directly at viewer (2250ms - 2950ms)
    const t2 = setTimeout(() => {
      setPhase('reveal_aim');
      onExpressionChange?.(EXPRESSIONS.CURIOUS);

      // Re-center eyes looking straight down the barrel at the user
      if (containerRef?.current) {
        containerRef.current.style.setProperty('--gaze-x', '0px');
        containerRef.current.style.setProperty('--gaze-y', '0px');
      }
    }, 2250);

    // 4. Brief charging animation (2950ms - 3600ms)
    const t3 = setTimeout(() => {
      setPhase('charging');
    }, 2950);

    // 5. Fire energy beam towards viewer + muzzle flash (3600ms - 4300ms)
    const t4 = setTimeout(() => {
      setPhase('firing');
    }, 3600);

    // 6. Confident celebration & wink (4300ms - 5100ms)
    const t5 = setTimeout(() => {
      setPhase('celebrating');
      onExpressionChange?.(EXPRESSIONS.HAPPY);
      onTriggerWink?.('left');
    }, 4300);

    // 7. Complete: return to normal & start 3-second cooldown (5100ms)
    const t6 = setTimeout(() => {
      setPhase('idle');
      setIsPlaying(false);
      onExpressionChange?.(EXPRESSIONS.NEUTRAL);

      setCooldown(true);
      setCooldownTime(3);

      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
      cooldownIntervalRef.current = setInterval(() => {
        setCooldownTime((prev) => {
          if (prev <= 1) {
            clearInterval(cooldownIntervalRef.current);
            setCooldown(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 5100);

    timeoutsRef.current.push(t1, t2, t3, t4, t5, t6);
  }, [isPlaying, cooldown, clearAllTimeouts, onExpressionChange, onTriggerWink, containerRef]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      clearAllTimeouts();
      if (cooldownIntervalRef.current) clearInterval(cooldownIntervalRef.current);
    };
  }, [clearAllTimeouts]);

  return {
    isPlaying,
    phase,
    cooldown,
    cooldownTime,
    triggerFingerGun,
  };
}
