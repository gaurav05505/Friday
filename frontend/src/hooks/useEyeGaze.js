import { useEffect, useRef, useCallback } from 'react';
import { EXPRESSION_CONFIGS } from '../constants/expressions';

/**
 * useEyeGaze hook manages interactive tracking, idle saccades, and micro-drifts.
 * Uses requestAnimationFrame and direct CSS variable injection to avoid React re-renders.
 */
export function useEyeGaze({
  containerRef,
  expression = 'neutral',
  interactiveEnabled = true,
  idleEnabled = true,
  reducedMotion = false,
}) {
  const config = EXPRESSION_CONFIGS[expression] || EXPRESSION_CONFIGS.neutral;

  // Mutable animation state (avoids re-renders)
  const stateRef = useRef({
    // Target position (from user or idle)
    targetX: 0,
    targetY: 0,
    // Current smoothed position
    currentX: 0,
    currentY: 0,
    // Idle saccade target
    idleTargetX: 0,
    idleTargetY: 0,
    // Interaction status
    isInteracting: false,
    lastInteractionTime: 0,
    // Next saccade timer
    nextSaccadeTime: 0,
  });

  const animFrameRef = useRef(null);
  const configRef = useRef(config);

  // Keep configRef updated whenever config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // Update target when user taps or moves pointer
  const handlePointerMove = useCallback(
    (clientX, clientY) => {
      if (!interactiveEnabled || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates (-1 to 1) from viewport center
      const rawNormX = (clientX - centerX) / (rect.width / 2 || 1);
      const rawNormY = (clientY - centerY) / (rect.height / 2 || 1);

      // Clamp distance into an ellipse
      const dist = Math.sqrt(rawNormX * rawNormX + rawNormY * rawNormY);
      const clampedDist = Math.min(1.0, dist);
      const angle = Math.atan2(rawNormY, rawNormX);

      const normX = Math.cos(angle) * clampedDist;
      const normY = Math.sin(angle) * clampedDist;

      const currentCfg = configRef.current;
      const maxX = currentCfg.gazeRangeX || 28;
      const maxY = currentCfg.gazeRangeY || 20;

      stateRef.current.targetX = normX * maxX;
      stateRef.current.targetY = normY * maxY;
      stateRef.current.isInteracting = true;
      stateRef.current.lastInteractionTime = performance.now();
    },
    [interactiveEnabled, containerRef]
  );

  const handlePointerEnd = useCallback(() => {
    stateRef.current.isInteracting = false;
    stateRef.current.lastInteractionTime = performance.now();
  }, []);

  // Main animation loop
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize timers on mount
    if (stateRef.current.lastInteractionTime === 0) {
      stateRef.current.lastInteractionTime = performance.now();
      stateRef.current.nextSaccadeTime = performance.now() + 1500;
    }

    const animate = (timestamp) => {
      const state = stateRef.current;
      const cfg = configRef.current;
      const now = timestamp;

      if (reducedMotion) {
        // Reduced motion: snap gently to expression bias
        containerRef.current?.style.setProperty('--gaze-x', `${cfg.gazeBiasX || 0}px`);
        containerRef.current?.style.setProperty('--gaze-y', `${cfg.gazeBiasY || 0}px`);
        return;
      }

      // Check if user has stopped interacting
      const timeSinceInteraction = now - state.lastInteractionTime;
      const isIdle = !state.isInteracting && timeSinceInteraction > 1200;

      if (isIdle && idleEnabled) {
        // Handle natural saccadic movements
        if (now > state.nextSaccadeTime) {
          const maxX = cfg.gazeRangeX || 28;
          const maxY = cfg.gazeRangeY || 20;

          // 40% chance to look at/near center, 60% chance to dart to an idle focal point
          const returnToCenter = Math.random() < 0.40;
          if (returnToCenter) {
            state.idleTargetX = 0;
            state.idleTargetY = 0;
          } else {
            // Random direction saccade
            const angle = Math.random() * Math.PI * 2;
            const distance = (0.2 + Math.random() * 0.75);
            state.idleTargetX = Math.cos(angle) * maxX * distance;
            state.idleTargetY = Math.sin(angle) * maxY * distance * 0.75;
          }

          // Schedule next saccade (2.0s to 5.0s, modified by expression idleSpeed)
          const speedMod = cfg.idleSpeed || 1.0;
          const saccadeInterval = (1800 + Math.random() * 3200) / speedMod;
          state.nextSaccadeTime = now + saccadeInterval;
        }

        // Add subtle continuous micro-drift (living breathing organic motion)
        const t = now * 0.0015;
        const driftX = Math.sin(t * 1.1) * 2.2 + Math.sin(t * 2.3) * 1.2;
        const driftY = Math.cos(t * 0.9) * 1.8;

        state.targetX = state.idleTargetX + (cfg.gazeBiasX || 0) + driftX;
        state.targetY = state.idleTargetY + (cfg.gazeBiasY || 0) + driftY;
      } else if (!state.isInteracting) {
        // Return smoothly toward expression bias when user releases touch
        state.targetX = (cfg.gazeBiasX || 0);
        state.targetY = (cfg.gazeBiasY || 0);
      }

      // Organic exponential lerp smoothing (spring-like responsiveness)
      const lerpSpeed = state.isInteracting ? 0.16 : 0.08;
      state.currentX += (state.targetX - state.currentX) * lerpSpeed;
      state.currentY += (state.targetY - state.currentY) * lerpSpeed;

      // Direct CSS variable injection to avoid React re-renders!
      if (containerRef.current) {
        containerRef.current.style.setProperty(
          '--gaze-x',
          `${state.currentX.toFixed(2)}px`
        );
        containerRef.current.style.setProperty(
          '--gaze-y',
          `${state.currentY.toFixed(2)}px`
        );
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [containerRef, idleEnabled, reducedMotion]);

  return {
    handlePointerMove,
    handlePointerEnd,
  };
}
