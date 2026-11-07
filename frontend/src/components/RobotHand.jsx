import React from 'react';

/**
 * RobotHand Component
 * Minimalist robotic hand matching the cyan-blue and cobalt shadow visual identity.
 * Waving animation with wrist rotation and finger flexing.
 */
export function RobotHand({ isWaving = false, onHandClick }) {
  return (
    <div
      className={`desk-hand-svg-wrapper ${isWaving ? 'is-waving' : ''}`}
      onClick={onHandClick}
      role="button"
      tabIndex={0}
      aria-label="Desk Buddy robotic hand. Tap to wave!"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onHandClick?.();
        }
      }}
    >
      <svg
        viewBox="0 0 100 120"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- DEEP BLUE SHADOW LAYER (Offset to bottom-right, matching eyes) --- */}
        <g transform="translate(6, 8)" opacity="0.95">
          {/* Wrist Joint Shadow */}
          <rect x="36" y="85" width="28" height="30" rx="6" fill="#323AA5" />
          
          {/* Palm Shadow */}
          <rect x="22" y="44" width="56" height="48" rx="22" fill="#323AA5" />
          
          {/* Thumb Shadow */}
          <rect x="6" y="52" width="24" height="15" rx="7.5" transform="rotate(-25 18 59)" fill="#323AA5" />
          
          {/* Finger 1 (Index) Shadow */}
          <rect x="25" y="10" width="13" height="38" rx="6.5" fill="#323AA5" />
          
          {/* Finger 2 (Middle) Shadow */}
          <rect x="43" y="4" width="14" height="44" rx="7" fill="#323AA5" />
          
          {/* Finger 3 (Ring/Pinky) Shadow */}
          <rect x="62" y="14" width="13" height="34" rx="6.5" fill="#323AA5" />
        </g>

        {/* --- CYAN SURFACE LAYER (Flat, clean robotic surface) --- */}
        <g>
          {/* Wrist Joint Segment */}
          <rect x="36" y="85" width="28" height="30" rx="6" fill="#75D6E8" />
          <line x1="38" y1="96" x2="62" y2="96" stroke="#0B0D12" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <line x1="38" y1="104" x2="62" y2="104" stroke="#0B0D12" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />

          {/* Palm */}
          <rect x="22" y="44" width="56" height="48" rx="22" fill="#8AD6E2" />

          {/* Palm Tech Accent Line */}
          <circle cx="50" cy="68" r="5" fill="#323AA5" opacity="0.35" />
          <circle cx="50" cy="68" r="2.5" fill="#8AD6E2" />

          {/* Thumb */}
          <rect
            className="desk-hand-thumb"
            x="6"
            y="52"
            width="24"
            height="15"
            rx="7.5"
            transform="rotate(-25 18 59)"
            fill="#8AD6E2"
          />

          {/* Finger 1 (Index) */}
          <rect
            className="desk-hand-finger desk-hand-finger-1"
            x="25"
            y="10"
            width="13"
            height="38"
            rx="6.5"
            fill="#8AD6E2"
          />

          {/* Finger 2 (Middle) */}
          <rect
            className="desk-hand-finger desk-hand-finger-2"
            x="43"
            y="4"
            width="14"
            height="44"
            rx="7"
            fill="#8AD6E2"
          />

          {/* Finger 3 (Ring/Pinky) */}
          <rect
            className="desk-hand-finger desk-hand-finger-3"
            x="62"
            y="14"
            width="13"
            height="34"
            rx="6.5"
            fill="#8AD6E2"
          />
        </g>
      </svg>
    </div>
  );
}

export default RobotHand;
