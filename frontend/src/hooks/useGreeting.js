import { useState, useEffect, useRef, useCallback } from 'react';
import { EXPRESSIONS } from '../constants/expressions';
import { playRobotChime, speakRobotGreeting } from '../utils/robotAudio';

const FRIENDLY_MESSAGES = [
  'Hii!',
  'Hey there!',
  "I'm here!",
  'Beep boop! ✦',
  'Hello friend!',
];

/**
 * useGreeting hook
 * Manages the robot companion greeting gesture, hand state, messages, voice & chime audio, and expression sync.
 * Quick, cheerful, punchy timing: ~1.45s total duration.
 */
export function useGreeting({ onExpressionChange, currentExpression }) {
  // handState: 'hidden' | 'entering'
  const [handState, setHandState] = useState('hidden');
  const [isWaving, setIsWaving] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState('');

  const previousExprRef = useRef(currentExpression);
  const timeoutsRef = useRef([]);

  const clearAllTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  // Trigger a full greeting sequence (snappy, cheerful, with vocal & chime reaction)
  const triggerGreeting = useCallback(
    (customMessage, { speak = true } = {}) => {
      clearAllTimeouts();

      // Remember expression before greeting started
      if (currentExpression !== EXPRESSIONS.HAPPY) {
        previousExprRef.current = currentExpression;
      }

      const msg =
        customMessage ||
        FRIENDLY_MESSAGES[Math.floor(Math.random() * FRIENDLY_MESSAGES.length)];

      // Step 1: Hand briskly enters, message pops up, play chime & speak aloud
      setHandState('entering');
      setIsWaving(true);
      setBubbleMessage(msg);

      if (speak) {
        playRobotChime();
        speakRobotGreeting(msg);
      }

      // Step 2: Eyes smile promptly (140ms)
      const t1 = setTimeout(() => {
        onExpressionChange(EXPRESSIONS.HAPPY);
      }, 140);

      // Step 3: Message fades and waving stops (1.2s)
      const t2 = setTimeout(() => {
        setBubbleMessage('');
        setIsWaving(false);
      }, 1200);

      // Step 4: Hand retracts completely off-screen and eyes revert (1.45s)
      const t3 = setTimeout(() => {
        setHandState('hidden');
        setBubbleMessage('');
        onExpressionChange(previousExprRef.current || EXPRESSIONS.NEUTRAL);
      }, 1450);

      timeoutsRef.current.push(t1, t2, t3);
    },
    [clearAllTimeouts, currentExpression, onExpressionChange]
  );

  // Playful reaction when user taps the eyes
  const triggerEyeReaction = useCallback(() => {
    const reactionMessages = ['*giggles*', 'I see you! 👀', 'Beep!', 'Hehe! ✦'];
    const chosen = reactionMessages[Math.floor(Math.random() * reactionMessages.length)];
    triggerGreeting(chosen);
  }, [triggerGreeting]);

  // Initial Greeting (Once per app session on mount)
  useEffect(() => {
    let hasGreeted = false;
    try {
      hasGreeted = sessionStorage.getItem('desk_buddy_greeting_shown') === 'true';
    } catch {
      hasGreeted = false;
    }

    if (!hasGreeted) {
      // Snappy initial pause of 400ms on first launch
      const initTimer = setTimeout(() => {
        triggerGreeting('Hii!', { speak: false }); // Silent on initial mount to respect browser autoplay policies
        try {
          sessionStorage.setItem('desk_buddy_greeting_shown', 'true');
        } catch {
          // ignore storage error in restricted modes
        }
      }, 400);

      timeoutsRef.current.push(initTimer);
    }

    return () => clearAllTimeouts();
  }, [clearAllTimeouts, triggerGreeting]);

  return {
    handState,
    isWaving,
    bubbleMessage,
    triggerGreeting,
    triggerEyeReaction,
  };
}
