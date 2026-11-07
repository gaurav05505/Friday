import React from 'react';

/**
 * Eye Component
 * Renders a single robot eye with visual fidelity to the reference image:
 * - Perfectly circular geometry
 * - Flat, clean cyan eye surface
 * - Deep-blue shadow offset towards the bottom-right
 * - Smooth eyelid squashing for natural blinking
 * - Expression morphing (border-radius, tilt, scale)
 */
export function Eye({
  side = 'left',
  expression = 'neutral',
  blinkScale = 1.0,
  rotation = 0,
  scaleX = 1.0,
  scaleY = 1.0,
  borderRadius = '50%',
  clipPath = 'none',
  onEyeClick,
}) {
  return (
    <div
      className={`desk-eye-wrapper desk-eye-${side}`}
      data-side={side}
      data-expression={expression}
      onClick={onEyeClick}
      role="presentation"
      aria-hidden="true"
    >
      {/* Eye Motion Container: Handles rotation & expression scaling */}
      <div
        className="desk-eye-transform-container"
        style={{
          transform: `rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`,
        }}
      >
        {/* Blink Squash Layer: Scales vertically during blinks */}
        <div
          className="desk-eye-blink-container"
          style={{
            transform: `scaleY(${blinkScale})`,
          }}
        >
          {/* Layer 1: Deep Blue Shadow Layer (offset to bottom-right) */}
          <div
            className="desk-eye-layer desk-eye-shadow"
            style={{
              borderRadius,
              clipPath: clipPath !== 'none' ? clipPath : undefined,
            }}
          />

          {/* Layer 2: Flat Clean Cyan Surface Layer */}
          <div
            className="desk-eye-layer desk-eye-surface"
            style={{
              borderRadius,
              clipPath: clipPath !== 'none' ? clipPath : undefined,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Eye;
