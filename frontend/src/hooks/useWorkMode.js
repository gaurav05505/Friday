import { useState, useRef, useCallback, useEffect } from 'react';
import { EXPRESSIONS } from '../constants/expressions';

/**
 * useWorkMode hook
 * Manages Work Mode state, eye synchronization, and natural screen scanning saccades.
 * Modular architecture ready for future voice command activation.
 */
export function useWorkMode({ onExpressionChange, currentExpression, containerRef }) {
  const [isWorkMode, setIsWorkMode] = useState(false);
  const previousExprRef = useRef(currentExpression);
  const scanIntervalRef = useRef(null);

  const startWorkMode = useCallback(() => {
    if (currentExpression !== EXPRESSIONS.FOCUSED) {
      previousExprRef.current = currentExpression;
    }
    setIsWorkMode(true);
    onExpressionChange?.(EXPRESSIONS.FOCUSED);

    // Initial downward focus looking at laptop
    if (containerRef?.current) {
      containerRef.current.style.setProperty('--gaze-x', '-8px');
      containerRef.current.style.setProperty('--gaze-y', '15px');
    }

    // Natural laptop reading / scanning loop (reading code lines across screen)
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    let scanStep = 0;
    scanIntervalRef.current = setInterval(() => {
      if (!containerRef?.current) return;
      scanStep = (scanStep + 1) % 5;

      if (scanStep === 0) {
        // Look left of code
        containerRef.current.style.setProperty('--gaze-x', '-14px');
        containerRef.current.style.setProperty('--gaze-y', '14px');
      } else if (scanStep === 1) {
        // Read across to center
        containerRef.current.style.setProperty('--gaze-x', '0px');
        containerRef.current.style.setProperty('--gaze-y', '15px');
      } else if (scanStep === 2) {
        // Read across to right
        containerRef.current.style.setProperty('--gaze-x', '14px');
        containerRef.current.style.setProperty('--gaze-y', '16px');
      } else if (scanStep === 3) {
        // Next line down
        containerRef.current.style.setProperty('--gaze-x', '-10px');
        containerRef.current.style.setProperty('--gaze-y', '17px');
      } else if (scanStep === 4) {
        // Occasional thoughtful glance slightly up
        containerRef.current.style.setProperty('--gaze-x', '6px');
        containerRef.current.style.setProperty('--gaze-y', '6px');
      }
    }, 1200);
  }, [currentExpression, onExpressionChange, containerRef]);

  const stopWorkMode = useCallback(() => {
    setIsWorkMode(false);
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    // Re-center gaze smoothly
    if (containerRef?.current) {
      containerRef.current.style.setProperty('--gaze-x', '0px');
      containerRef.current.style.setProperty('--gaze-y', '0px');
    }

    onExpressionChange?.(previousExprRef.current || EXPRESSIONS.NEUTRAL);
  }, [onExpressionChange, containerRef]);

  const toggleWorkMode = useCallback(() => {
    if (isWorkMode) {
      stopWorkMode();
    } else {
      startWorkMode();
    }
  }, [isWorkMode, startWorkMode, stopWorkMode]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, []);

  return {
    isWorkMode,
    toggleWorkMode,
    setWorkMode: (active) => (active ? startWorkMode() : stopWorkMode()),
  };
}
