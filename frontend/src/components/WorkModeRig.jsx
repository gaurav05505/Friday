import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * WorkModeRig Component
 * Renders the minimalist glowing laptop centered directly between Buddy's eyes,
 * dual animated robotic typing hands, and "Working..." status badge.
 */
export function WorkModeRig({ isActive = false, onDismiss }) {
  return (
    <AnimatePresence>
      {isActive && (
        <div className="desk-work-mode-wrapper">
          <motion.div
            key="work-mode-rig"
            className="desk-work-mode-container"
            initial={{ y: 35, opacity: 0, scale: 0.88 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 35, opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Desk Buddy in Work Mode"
          >
            {/* Status Badge: "Working..." sits directly in the gap between eyes */}
            <div className="desk-work-status-badge">
              <span className="desk-work-status-dot" />
              <span className="desk-work-status-text">Working...</span>
              <span className="desk-work-mode-hint" onClick={onDismiss} title="Click to stop Work Mode">
                ✕
              </span>
            </div>

            {/* Upward Ambient Screen Glow Casting onto Buddy's Eyes */}
            <div className="desk-laptop-screen-ambient-glow" />

            {/* Laptop & Dual Hands Rig */}
            <div className="desk-laptop-rig">
              {/* SVG Minimalist Laptop (Consistent with Cyan & Deep-Blue Aesthetic) */}
              <svg
                viewBox="0 0 240 150"
                width="100%"
                height="100%"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="desk-laptop-svg"
              >
                {/* --- LAPTOP BASE SHADOW --- */}
                <ellipse cx="120" cy="142" rx="100" ry="8" fill="#323AA5" opacity="0.6" />

                {/* --- LAPTOP DISPLAY (Angled slightly in perspective) --- */}
                <g className="desk-laptop-screen-group">
                  {/* Screen Outer Lid & Shadow */}
                  <rect x="44" y="10" width="152" height="96" rx="8" fill="#323AA5" />
                  <rect x="42" y="8" width="152" height="96" rx="8" fill="#0B0D12" stroke="#8AD6E2" strokeWidth="1.5" />

                  {/* Glowing Screen Display */}
                  <rect x="48" y="14" width="140" height="84" rx="4" fill="#0E1624" />
                  <rect
                    x="48"
                    y="14"
                    width="140"
                    height="84"
                    rx="4"
                    fill="url(#screen-glow-gradient)"
                    className="desk-laptop-screen-active-glow"
                  />

                  {/* Stylized Active Code Lines & Activity Bars */}
                  <g opacity="0.85">
                    <rect x="56" y="24" width="28" height="4" rx="2" fill="#8AD6E2" className="code-line-pulse-1" />
                    <rect x="88" y="24" width="46" height="4" rx="2" fill="#75D6E8" opacity="0.7" />
                    <rect x="56" y="32" width="58" height="4" rx="2" fill="#8AD6E2" className="code-line-pulse-2" />
                    <rect x="56" y="40" width="42" height="4" rx="2" fill="#75D6E8" opacity="0.8" />
                    <rect x="102" y="40" width="34" height="4" rx="2" fill="#8AD6E2" className="code-line-pulse-3" />
                    <rect x="56" y="48" width="68" height="4" rx="2" fill="#8AD6E2" />
                    <rect x="56" y="56" width="38" height="4" rx="2" fill="#75D6E8" opacity="0.7" />
                    <rect x="98" y="56" width="24" height="4" rx="2" fill="#8AD6E2" className="code-line-pulse-1" />
                    <rect x="56" y="64" width="52" height="4" rx="2" fill="#8AD6E2" className="code-line-pulse-2" />

                    {/* Activity Progress / Stream Spark */}
                    <rect x="56" y="78" width="124" height="3" rx="1.5" fill="#1A273D" />
                    <rect x="56" y="78" width="48" height="3" rx="1.5" fill="#8AD6E2" className="code-progress-bar" />
                  </g>
                </g>

                {/* --- LAPTOP KEYBOARD BASE --- */}
                <g className="desk-laptop-base-group">
                  {/* Hinge Joint */}
                  <rect x="90" y="100" width="60" height="4" rx="2" fill="#75D6E8" />

                  {/* Keyboard Deck */}
                  <polygon points="26,134 214,134 196,102 44,102" fill="#131A26" stroke="#8AD6E2" strokeWidth="1.2" />

                  {/* Backlit Key Rows */}
                  <g opacity="0.7" stroke="#8AD6E2" strokeWidth="0.8" fill="rgba(138, 214, 226, 0.12)">
                    {/* Row 1 */}
                    <rect x="52" y="106" width="136" height="4" rx="1" />
                    {/* Row 2 */}
                    <rect x="48" y="112" width="144" height="4.5" rx="1" />
                    {/* Row 3 */}
                    <rect x="44" y="118.5" width="152" height="5" rx="1" />
                    {/* Row 4 (Spacebar row) */}
                    <rect x="94" y="125.5" width="52" height="4" rx="1" fill="#8AD6E2" opacity="0.3" />
                  </g>

                  {/* Trackpad */}
                  <rect x="104" y="130" width="32" height="3" rx="1.5" fill="#1F2C3F" stroke="#8AD6E2" strokeWidth="0.6" opacity="0.8" />
                </g>

                {/* Gradient Definitions */}
                <defs>
                  <linearGradient id="screen-glow-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8AD6E2" stopOpacity="0.25" />
                    <stop offset="60%" stopColor="#323AA5" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#0B0D12" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* --- TWO ROBOTIC HANDS TYPING OVER KEYBOARD --- */}
              {/* Left Robotic Hand */}
              <div className="desk-typing-hand-wrapper hand-left">
                <svg viewBox="0 0 60 70" width="100%" height="100%" fill="none">
                  {/* Shadow */}
                  <g transform="translate(3, 4)" opacity="0.85">
                    <ellipse cx="30" cy="46" rx="18" ry="14" fill="#323AA5" />
                    <rect x="14" y="18" width="6" height="22" rx="3" fill="#323AA5" />
                    <rect x="23" y="14" width="7" height="26" rx="3.5" fill="#323AA5" />
                    <rect x="33" y="16" width="6" height="24" rx="3" fill="#323AA5" />
                    <rect x="41" y="24" width="6" height="16" rx="3" fill="#323AA5" />
                  </g>

                  {/* Cyan Palm */}
                  <ellipse cx="30" cy="46" rx="18" ry="14" fill="#8AD6E2" />
                  <line x1="22" y1="48" x2="38" y2="48" stroke="#0B0D12" strokeWidth="1.5" opacity="0.4" />

                  {/* Fingers with Natural Varied Typing Keyframes */}
                  <rect x="14" y="18" width="6" height="22" rx="3" fill="#8AD6E2" className="type-finger finger-l-pinky" />
                  <rect x="23" y="14" width="7" height="26" rx="3.5" fill="#8AD6E2" className="type-finger finger-l-mid" />
                  <rect x="33" y="16" width="6" height="24" rx="3" fill="#8AD6E2" className="type-finger finger-l-index" />
                  <rect x="41" y="24" width="6" height="16" rx="3" fill="#8AD6E2" className="type-finger finger-l-thumb" />
                </svg>
              </div>

              {/* Right Robotic Hand */}
              <div className="desk-typing-hand-wrapper hand-right">
                <svg viewBox="0 0 60 70" width="100%" height="100%" fill="none">
                  {/* Shadow */}
                  <g transform="translate(3, 4)" opacity="0.85">
                    <ellipse cx="30" cy="46" rx="18" ry="14" fill="#323AA5" />
                    <rect x="13" y="24" width="6" height="16" rx="3" fill="#323AA5" />
                    <rect x="21" y="16" width="6" height="24" rx="3" fill="#323AA5" />
                    <rect x="30" y="14" width="7" height="26" rx="3.5" fill="#323AA5" />
                    <rect x="40" y="18" width="6" height="22" rx="3" fill="#323AA5" />
                  </g>

                  {/* Cyan Palm */}
                  <ellipse cx="30" cy="46" rx="18" ry="14" fill="#8AD6E2" />
                  <line x1="22" y1="48" x2="38" y2="48" stroke="#0B0D12" strokeWidth="1.5" opacity="0.4" />

                  {/* Fingers with Natural Varied Typing Keyframes */}
                  <rect x="13" y="24" width="6" height="16" rx="3" fill="#8AD6E2" className="type-finger finger-r-thumb" />
                  <rect x="21" y="16" width="6" height="24" rx="3" fill="#8AD6E2" className="type-finger finger-r-index" />
                  <rect x="30" y="14" width="7" height="26" rx="3.5" fill="#8AD6E2" className="type-finger finger-r-mid" />
                  <rect x="40" y="18" width="6" height="22" rx="3" fill="#8AD6E2" className="type-finger finger-r-pinky" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default WorkModeRig;
