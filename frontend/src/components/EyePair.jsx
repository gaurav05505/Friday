import React from 'react';
import Eye from './Eye';
import { EXPRESSION_CONFIGS } from '../constants/expressions';

/**
 * EyePair Component
 * Controls both eyes, symmetric positioning, and gaze translations.
 */
export function EyePair({
  expression = 'neutral',
  leftBlinkScale = 1.0,
  rightBlinkScale = 1.0,
  onLeftEyeClick,
  onRightEyeClick,
}) {
  const config = EXPRESSION_CONFIGS[expression] || EXPRESSION_CONFIGS.neutral;

  return (
    <div className="desk-eyes-gaze-layer">
      <div className="desk-eyes-pair-container">
        {/* Left Eye */}
        <Eye
          side="left"
          expression={expression}
          blinkScale={leftBlinkScale}
          rotation={config.leftRotate || 0}
          scaleX={config.scaleX || 1.0}
          scaleY={config.scaleY || 1.0}
          borderRadius={config.borderRadius || '50%'}
          clipPath={config.clipPath || 'none'}
          onEyeClick={onLeftEyeClick}
        />

        {/* Right Eye */}
        <Eye
          side="right"
          expression={expression}
          blinkScale={rightBlinkScale}
          rotation={config.rightRotate || 0}
          scaleX={config.scaleX || 1.0}
          scaleY={config.scaleY || 1.0}
          borderRadius={config.borderRadius || '50%'}
          clipPath={config.clipPath || 'none'}
          onEyeClick={onRightEyeClick}
        />
      </div>
    </div>
  );
}

export default EyePair;
