import React from 'react';

/**
 * GreetingBubble Component
 * Minimalist speech bubble displaying short robotic companion messages.
 * When message is empty or null, it safely renders nothing.
 */
export function GreetingBubble({ message = '' }) {
  if (!message || typeof message !== 'string' || message.trim() === '') {
    return null;
  }

  return (
    <div className="desk-greeting-bubble" role="status" aria-live="polite">
      <span className="desk-greeting-sparkle">✦</span>
      <span className="desk-greeting-text">{message}</span>
    </div>
  );
}

export default GreetingBubble;
