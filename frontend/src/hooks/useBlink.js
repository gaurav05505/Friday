import { useState, useEffect, useRef, useCallback } from 'react';
import { EXPRESSION_CONFIGS } from '../constants/expressions';

/**
 * useBlink hook provides natural, organic blinking for Desk Buddy
 * - Randomized timing intervals
 * - Smooth multi-phase eyelid motion (close -> brief contact -> open)
 * - Occasional realistic double-blinks
 * - Expression-dependent blink speed & frequency
 * - Support for manual triggers and winks
 */
export function useBlink({
  expression = 'neutral',
  enabled = true,
  reducedMotion = false,
}) {
  // blinkScale: 1.0 (fully open) to 0.04 (closed)
  const [leftBlinkScale, setLeftBlinkScale] = useState(1);
  const [rightBlinkScale, setRightBlinkScale] = useState(1);
  const [isBlinking, setIsBlinking] = useState(false);

  const timeoutRef = useRef(null);
  const animFrameRef = useRef(null);
  const isBlinkingRef = useRef(false);

  const config = EXPRESSION_CONFIGS[expression] || EXPRESSION_CONFIGS.neutral;

  // Perform a single eyelid close-and-open animation cycle
  const executeBlinkCycle = useCallback(
    ({ duration = 140, left = true, right = true } = {}) => {
      return new Promise((resolve) => {
        if (reducedMotion) {
          resolve();
          return;
        }

        const startTime = performance.now();
        const closeTime = duration * 0.45; // 45% closing
        const pauseTime = duration * 0.10; // 10% closed
        const openTime = duration * 0.45;  // 45% opening

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;

          if (elapsed < closeTime) {
            // Closing: ease-in-quad
            const progress = elapsed / closeTime;
            const scale = 1 - Math.sin((progress * Math.PI) / 2) * 0.96;
            if (left) setLeftBlinkScale(Math.max(0.04, scale));
            if (right) setRightBlinkScale(Math.max(0.04, scale));
            animFrameRef.current = requestAnimationFrame(animate);
          } else if (elapsed < closeTime + pauseTime) {
            // Closed pause
            if (left) setLeftBlinkScale(0.04);
            if (right) setRightBlinkScale(0.04);
            animFrameRef.current = requestAnimationFrame(animate);
          } else if (elapsed < duration) {
            // Opening: ease-out-back / spring
            const openElapsed = elapsed - (closeTime + pauseTime);
            const progress = openElapsed / openTime;
            const easeOut = Math.sin((progress * Math.PI) / 2);
            const scale = 0.04 + easeOut * 0.96;
            if (left) setLeftBlinkScale(Math.min(1, scale));
            if (right) setRightBlinkScale(Math.min(1, scale));
            animFrameRef.current = requestAnimationFrame(animate);
          } else {
            // Completed
            if (left) setLeftBlinkScale(1);
            if (right) setRightBlinkScale(1);
            resolve();
          }
        };

        animFrameRef.current = requestAnimationFrame(animate);
      });
    },
    [reducedMotion]
  );

  // Trigger a full natural blink (with possible double-blink)
  const triggerBlink = useCallback(
    async ({ isDouble = false, left = true, right = true } = {}) => {
      if (isBlinkingRef.current && !isDouble) return;

      isBlinkingRef.current = true;
      setIsBlinking(true);

      const duration = config.blinkDuration || 140;
      await executeBlinkCycle({ duration, left, right });

      // Check if we should trigger a double blink
      const shouldDouble =
        !isDouble && Math.random() < (config.doubleBlinkChance || 0.18);

      if (shouldDouble && left && right) {
        // Short pause between double blinks (60-90ms)
        await new Promise((r) => setTimeout(r, 70));
        await executeBlinkCycle({ duration: duration * 0.85, left, right });
      }

      isBlinkingRef.current = false;
      setIsBlinking(false);
    },
    [config.blinkDuration, config.doubleBlinkChance, executeBlinkCycle]
  );

  // Trigger a playful wink (left or right)
  const triggerWink = useCallback(
    (side = 'left') => {
      triggerBlink({
        isDouble: false,
        left: side === 'left',
        right: side === 'right',
      });
    },
    [triggerBlink]
  );

  // Schedule next automatic randomized blink
  useEffect(() => {
    if (!enabled) return;

    const scheduleNextBlink = () => {
      const minInterval = config.blinkIntervalMin || 2800;
      const maxInterval = config.blinkIntervalMax || 5500;
      const randomDelay =
        Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;

      timeoutRef.current = setTimeout(async () => {
        await triggerBlink();
        scheduleNextBlink();
      }, randomDelay);
    };

    scheduleNextBlink();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [enabled, config.blinkIntervalMin, config.blinkIntervalMax, triggerBlink]);

  return {
    leftBlinkScale,
    rightBlinkScale,
    isBlinking,
    triggerBlink,
    triggerWink,
  };
}
