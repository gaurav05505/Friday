import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * CameraVisionHUD Component
 * Picture-In-Picture robotic HUD showing Buddy's live vision,
 * real-time motion energy feedback, hand tracking crosshair, and wave/voice detection.
 */
export function CameraVisionHUD({
  isActive,
  stream,
  onClose,
  videoRef,
  canvasRef,
  attachVideoRef,
  isWaveDetected,
  detectionNotice,
  motionLevel = 0,
  waveProgress = 0,
  handTrackingX = 50,
  hasHandMotion = false,
  errorMessage,
  isMicEnabled = true,
  isVoiceListening = false,
  onToggleMic,
  onRetry,
  onSimulateWave,
}) {
  const [isMinimized, setIsMinimized] = useState(false);

  // Fallback safety to ensure video element plays if stream prop updates
  useEffect(() => {
    if (videoRef && videoRef.current && stream) {
      const v = videoRef.current;
      v.muted = true;
      v.playsInline = true;
      v.autoplay = true;
      if (v.srcObject !== stream) {
        v.srcObject = stream;
        v.play().catch(() => {});
      }
    }
  }, [stream, videoRef]);

  if (!isActive) return null;

  return (
    <aside
      className={`desk-camera-hud-wrapper ${isMinimized ? 'is-minimized' : ''}`}
      aria-label="Desk Buddy Camera Vision"
    >
      <motion.div
        className="desk-camera-hud-card"
        initial={{ opacity: 0, scale: 0.9, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: -20 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* HUD Top Bar */}
        <div className="desk-camera-hud-header">
          <div className="desk-camera-hud-title">
            <span className={`desk-camera-hud-indicator ${isWaveDetected ? 'is-detecting' : ''}`} />
            <span className="desk-camera-hud-label">
              {isMinimized ? 'Buddy Vision' : 'Buddy Vision & Gesture'}
            </span>
          </div>

          <div className="desk-camera-hud-actions">
            {/* Quick Test Wave Trigger Button */}
            {onSimulateWave && !isMinimized && (
              <button
                type="button"
                className="desk-camera-test-wave-btn"
                onClick={onSimulateWave}
                title="Test Buddy wave & greeting reaction"
              >
                👋 Test
              </button>
            )}

            <button
              type="button"
              className="desk-camera-hud-action-btn"
              onClick={() => setIsMinimized((prev) => !prev)}
              title={isMinimized ? 'Expand Camera View' : 'Minimize View'}
              aria-label={isMinimized ? 'Expand Camera View' : 'Minimize View'}
            >
              {isMinimized ? '🗖' : '🗕'}
            </button>
            <button
              type="button"
              className="desk-camera-hud-action-btn is-close"
              onClick={onClose}
              title="Close Camera (C)"
              aria-label="Close Camera"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Viewport Frame & Controls (Preserved in DOM during minimize to prevent stream unmounting) */}
        <div
          className="desk-camera-hud-body"
          style={{ display: isMinimized ? 'none' : 'block' }}
        >
          {errorMessage ? (
            <div className="desk-camera-error-container">
              <span className="desk-camera-error-icon">📷⚠️</span>
              <p className="desk-camera-error-text">{errorMessage}</p>
              {onRetry && (
                <button
                  type="button"
                  className="desk-camera-retry-btn"
                  onClick={onRetry}
                >
                  Allow & Retry
                </button>
              )}
            </div>
          ) : (
            <div className="desk-camera-viewport-frame">
              {/* Mirrored live video feed with callback ref attachment */}
              <video
                ref={attachVideoRef || videoRef}
                className="desk-camera-video-feed"
                autoPlay
                playsInline
                muted
              />

              {/* Hidden canvas for optical motion differencing */}
              <canvas
                ref={canvasRef}
                width="128"
                height="96"
                className="desk-camera-hidden-canvas"
                aria-hidden="true"
              />

              {/* Scanline & Grid Effect */}
              <div className="desk-camera-scanlines" />

              {/* Tech Reticles */}
              <div className="desk-hud-bracket top-left" />
              <div className="desk-hud-bracket top-right" />
              <div className="desk-hud-bracket bottom-left" />
              <div className="desk-hud-bracket bottom-right" />

              {/* Center Crosshair */}
              <div className="desk-hud-crosshair">
                <div className="desk-hud-crosshair-center" />
              </div>

              {/* Real-time Hand Position Tracker Line */}
              {hasHandMotion && (
                <div
                  className="desk-hud-hand-tracker"
                  style={{ left: `${100 - handTrackingX}%` }}
                >
                  <div className="desk-hud-tracker-line" />
                  <div className="desk-hud-tracker-pill">👋</div>
                </div>
              )}

              {/* Wave / Voice Detected Flash Banner */}
              <AnimatePresence>
                {isWaveDetected && (
                  <motion.div
                    className="desk-hud-detected-banner"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <span className="desk-hud-detected-text">
                      {detectionNotice || 'Hand Wave Detected! 👋'}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Motion Energy & Wave Progress Indicators */}
              <div className="desk-hud-status-overlay">
                <div className="desk-hud-wave-segments">
                  <span className="desk-hud-wave-label">Wave:</span>
                  <div className="desk-hud-segments-track" title="Wave progress (Requires 3 alternating strokes)">
                    <span className={`segment ${waveProgress >= 1 ? 'is-active' : ''}`} />
                    <span className={`segment ${waveProgress >= 2 ? 'is-active' : ''}`} />
                    <span className={`segment ${waveProgress >= 3 ? 'is-active' : ''}`} />
                  </div>
                </div>

                <div className="desk-hud-motion-meter">
                  <span className="desk-hud-meter-label">Motion:</span>
                  <div className="desk-hud-meter-bar">
                    <div
                      className="desk-hud-meter-fill"
                      style={{ width: `${motionLevel}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Status / Instructions & Mic Toggle */}
          <div className="desk-camera-hud-footer">
            <div className="desk-hud-hint">
              <span className="desk-hud-hint-icon">👋</span>
              <span className="desk-hud-hint-text">
                Raise hand & wave side-to-side {isMicEnabled ? "or say \"Hi!\"" : ""} to greet Buddy!
              </span>
            </div>

            <div className="desk-hud-footer-controls">
              {onToggleMic && (
                <button
                  type="button"
                  className={`desk-hud-mic-toggle ${isMicEnabled ? 'is-enabled' : 'is-disabled'}`}
                  onClick={onToggleMic}
                  title={isMicEnabled ? 'Mute microphone (Only camera wave detection)' : 'Enable microphone ("Hi")'}
                >
                  {isMicEnabled ? '🎙️ Mic: ON' : '🔇 Mic: OFF'}
                </button>
              )}

              {isVoiceListening && isMicEnabled && (
                <div className="desk-hud-voice-badge">
                  <span className="desk-voice-dot" />
                  <span>Listening</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </aside>
  );
}

export default CameraVisionHUD;
