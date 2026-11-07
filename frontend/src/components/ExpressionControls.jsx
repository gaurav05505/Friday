import React, { useState } from 'react';
import { EXPRESSIONS, EXPRESSION_CONFIGS } from '../constants/expressions';

/**
 * ExpressionControls Component
 * Testing & interactive controls for Desk Buddy.
 * Designed mobile-first with touch-friendly buttons, stealth top dock,
 * and quick-access perception & behavior controls.
 */
export function ExpressionControls({
  currentExpression,
  onSelectExpression,
  onTriggerBlink,
  onTriggerWink,
  onTriggerGreeting,
  onTriggerFingerGun,
  fingerGunPlaying = false,
  fingerGunCooldown = false,
  fingerGunCooldownTime = 0,
  isWorkMode = false,
  onToggleWorkMode,
  isCameraActive = false,
  onToggleCamera,
  interactiveTracking,
  onToggleTracking,
  idleEnabled,
  onToggleIdle,
  blinkingEnabled,
  onToggleBlinking,
  oledBlack,
  onToggleOledBlack,
  isFullscreen,
  onToggleFullscreen,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const expressionsList = Object.values(EXPRESSIONS);

  return (
    <aside
      className={`desk-controls-wrapper ${isOpen ? 'is-open' : 'is-collapsed'}`}
      aria-label="Desk Buddy Controls"
    >
      {/* Floating Toggle Pill / Handle */}
      <div className="desk-controls-pill-bar">
        <button
          type="button"
          className="desk-pill-btn desk-pill-toggle"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Hide expression controls' : 'Show expression controls'}
        >
          <span className={`desk-pill-status-dot ${isWorkMode ? 'is-work-mode' : ''}`} />
          <span className="desk-pill-title">
            Desk Buddy:{' '}
            <strong className="desk-pill-active-expr">
              {isWorkMode ? 'Work Mode' : isCameraActive ? 'Vision Active' : EXPRESSION_CONFIGS[currentExpression]?.label}
            </strong>
          </span>
          <span className="desk-pill-icon">{isOpen ? '▲' : '▼'}</span>
        </button>

        {/* Quick action buttons always accessible when collapsed */}
        <div className="desk-pill-quick-actions">
          {/* Camera Vision Quick Action */}
          <button
            type="button"
            className={`desk-quick-action-btn ${isCameraActive ? 'is-active-camera-action' : ''}`}
            onClick={onToggleCamera}
            title={isCameraActive ? 'Turn off camera vision (C)' : 'Enable camera vision & wave detection (C)'}
            aria-label="Toggle Camera Vision"
          >
            📷
          </button>

          {/* Work Mode Quick Action */}
          <button
            type="button"
            className={`desk-quick-action-btn ${isWorkMode ? 'is-active-work-action' : ''}`}
            onClick={onToggleWorkMode}
            title={isWorkMode ? 'Exit Work Mode (M)' : 'Enter Work Mode (M)'}
            aria-label="Toggle Work Mode"
          >
            💻
          </button>

          {/* Finger Gun Quick Action */}
          <button
            type="button"
            className="desk-quick-action-btn desk-finger-gun-btn"
            onClick={onTriggerFingerGun}
            disabled={fingerGunPlaying || fingerGunCooldown}
            title={
              fingerGunPlaying
                ? 'Finger Gun active!'
                : fingerGunCooldown
                ? `Finger Gun cooldown (${fingerGunCooldownTime}s)`
                : 'Trigger Finger Gun Mode (P)'
            }
            aria-label="Trigger Finger Gun Mode"
          >
            {fingerGunCooldown ? `${fingerGunCooldownTime}s` : '👉'}
          </button>

          <button
            type="button"
            className="desk-quick-action-btn"
            onClick={() => onTriggerGreeting?.()}
            title="Trigger hand wave & greeting (G)"
            aria-label="Trigger hand wave & greeting"
          >
            👋
          </button>

          <button
            type="button"
            className="desk-quick-action-btn"
            onClick={onTriggerBlink}
            title="Trigger instant blink (Space)"
            aria-label="Trigger instant blink"
          >
            👁️
          </button>

          <button
            type="button"
            className="desk-quick-action-btn"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? '✕' : '⛶'}
          </button>
        </div>
      </div>

      {/* Expanded Controls Drawer */}
      {isOpen && (
        <div className="desk-controls-drawer">
          {/* Section 1: Expressions Selector */}
          <div className="desk-controls-section">
            <div className="desk-section-header">
              <span className="desk-section-title">Robot Expressions</span>
              <span className="desk-section-hint">Keys: 1-7</span>
            </div>

            <div className="desk-expression-grid">
              {expressionsList.map((exprKey, idx) => {
                const cfg = EXPRESSION_CONFIGS[exprKey];
                const isActive = currentExpression === exprKey;

                return (
                  <button
                    key={exprKey}
                    type="button"
                    className={`desk-expr-btn ${isActive ? 'is-active' : ''}`}
                    onClick={() => onSelectExpression(exprKey)}
                    aria-pressed={isActive}
                  >
                    <span className="desk-expr-shortcut">{idx + 1}</span>
                    <span className="desk-expr-icon">{cfg.icon}</span>
                    <span className="desk-expr-label">{cfg.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Expressive Actions (Camera Vision, Work Mode, Finger Gun, Wave, Blink, Wink) */}
          <div className="desk-controls-section">
            <div className="desk-section-header">
              <span className="desk-section-title">Interactive Reactions & Modes</span>
              <span className="desk-section-hint">C: Camera | M: Work | P: Gun | G: Wave</span>
            </div>

            <div className="desk-actions-row desk-actions-grid-6">
              {/* Camera Vision Toggle */}
              <button
                type="button"
                className={`desk-action-pill ${isCameraActive ? 'is-active is-camera-pill' : ''}`}
                onClick={onToggleCamera}
                title="Toggle Camera Vision & Hand Wave / Voice Detection (C)"
              >
                <span>{isCameraActive ? '📷 Vision: ON' : '📷 Camera'}</span>
              </button>

              {/* Work Mode Toggle */}
              <button
                type="button"
                className={`desk-action-pill ${isWorkMode ? 'is-active is-work-pill' : ''}`}
                onClick={onToggleWorkMode}
                title="Toggle Work Mode (M)"
              >
                <span>{isWorkMode ? '💻 Exit Work' : '💻 Work Mode'}</span>
              </button>

              <button
                type="button"
                className={`desk-action-pill ${fingerGunPlaying ? 'is-active' : ''}`}
                onClick={onTriggerFingerGun}
                disabled={fingerGunPlaying || fingerGunCooldown}
                title="Activate Finger Gun dodge and counter-blast (P)"
              >
                <span>
                  {fingerGunPlaying
                    ? '⚡ Firing...'
                    : fingerGunCooldown
                    ? `⏳ (${fingerGunCooldownTime}s)`
                    : '👉 Finger Gun'}
                </span>
              </button>

              <button
                type="button"
                className="desk-action-pill"
                onClick={() => onTriggerGreeting?.()}
                title="Trigger robot hand wave (G)"
              >
                <span>👋 Wave</span>
              </button>

              <button
                type="button"
                className="desk-action-pill"
                onClick={onTriggerBlink}
                title="Trigger blink (Space)"
              >
                <span>👁️ Blink</span>
              </button>

              <button
                type="button"
                className="desk-action-pill"
                onClick={() => onTriggerWink('left')}
                title="Trigger wink (W)"
              >
                <span>😉 Wink</span>
              </button>
            </div>
          </div>

          {/* Section 3: Live Behavioral Toggles */}
          <div className="desk-controls-section">
            <div className="desk-section-header">
              <span className="desk-section-title">Companion Behavior</span>
            </div>

            <div className="desk-toggles-grid">
              <label className="desk-toggle-card">
                <input
                  type="checkbox"
                  checked={isCameraActive}
                  onChange={onToggleCamera}
                />
                <div className="desk-toggle-info">
                  <span className="desk-toggle-name">Camera & Voice Vision</span>
                  <span className="desk-toggle-desc">See hand waves & hear "Hi"</span>
                </div>
              </label>

              <label className="desk-toggle-card">
                <input
                  type="checkbox"
                  checked={interactiveTracking}
                  onChange={(e) => onToggleTracking(e.target.checked)}
                />
                <div className="desk-toggle-info">
                  <span className="desk-toggle-name">Touch / Mouse Follow</span>
                  <span className="desk-toggle-desc">Tracks finger drag or cursor</span>
                </div>
              </label>

              <label className="desk-toggle-card">
                <input
                  type="checkbox"
                  checked={idleEnabled}
                  onChange={(e) => onToggleIdle(e.target.checked)}
                />
                <div className="desk-toggle-info">
                  <span className="desk-toggle-name">Idle Gaze & Saccades</span>
                  <span className="desk-toggle-desc">Living organic micro-movements</span>
                </div>
              </label>

              <label className="desk-toggle-card">
                <input
                  type="checkbox"
                  checked={blinkingEnabled}
                  onChange={(e) => onToggleBlinking(e.target.checked)}
                />
                <div className="desk-toggle-info">
                  <span className="desk-toggle-name">Auto-Blinking</span>
                  <span className="desk-toggle-desc">Randomized natural timing</span>
                </div>
              </label>

              <label className="desk-toggle-card">
                <input
                  type="checkbox"
                  checked={oledBlack}
                  onChange={(e) => onToggleOledBlack(e.target.checked)}
                />
                <div className="desk-toggle-info">
                  <span className="desk-toggle-name">Pure OLED Black</span>
                  <span className="desk-toggle-desc">{oledBlack ? 'True Black #000' : 'Dark Charcoal'}</span>
                </div>
              </label>
            </div>
          </div>

          {/* Section 4: Tips & Info */}
          <div className="desk-controls-footer">
            <div className="desk-tip-text">
              💡 <em>Enable 📷 Camera Vision (Key: C): Wave your hand side-to-side or say "Hi!" / "Hello!" to have Buddy wave back and greet you aloud!</em>
            </div>
            <button
              type="button"
              className="desk-fullscreen-cta"
              onClick={onToggleFullscreen}
            >
              {isFullscreen ? 'Exit Fullscreen Mode' : 'Enter Desk Dock Fullscreen'}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}

export default ExpressionControls;
