import React, { useState, useEffect, useRef, useCallback } from 'react';
import EyePair from './components/EyePair';
import ExpressionControls from './components/ExpressionControls';
import RobotHand from './components/RobotHand';
import GreetingBubble from './components/GreetingBubble';
import FingerGunEffect from './components/FingerGunEffect';
import WorkModeRig from './components/WorkModeRig';
import CameraVisionHUD from './components/CameraVisionHUD';
import { useBlink } from './hooks/useBlink';
import { useEyeGaze } from './hooks/useEyeGaze';
import { useGreeting } from './hooks/useGreeting';
import { useFingerGun } from './hooks/useFingerGun';
import { useWorkMode } from './hooks/useWorkMode';
import { useCameraVision } from './hooks/useCameraVision';
import { EXPRESSIONS } from './constants/expressions';

import './styles/index.css';
import './styles/eyes.css';
import './styles/controls.css';
import './styles/hand.css';
import './styles/fingerGun.css';
import './styles/workMode.css';
import './styles/cameraVision.css';

export function App() {
  // Current Expression state
  const [expression, setExpression] = useState(EXPRESSIONS.NEUTRAL);

  // Behavioral feature toggles
  const [interactiveTracking, setInteractiveTracking] = useState(true);
  const [idleEnabled, setIdleEnabled] = useState(true);
  const [blinkingEnabled, setBlinkingEnabled] = useState(true);
  const [oledBlack, setOledBlack] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reduced motion preference detection
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Root container ref for eye gaze custom property injection
  const stageRef = useRef(null);

  // Blinking hook
  const {
    leftBlinkScale,
    rightBlinkScale,
    triggerBlink,
    triggerWink,
  } = useBlink({
    expression,
    enabled: blinkingEnabled,
    reducedMotion,
  });

  // Eye gaze tracking & idle saccades hook
  const { handlePointerMove, handlePointerEnd } = useEyeGaze({
    containerRef: stageRef,
    expression,
    interactiveEnabled: interactiveTracking,
    idleEnabled,
    reducedMotion,
  });

  // Robotic Hand Greeting & Gestures hook
  const {
    handState,
    isWaving,
    bubbleMessage,
    triggerGreeting,
    triggerEyeReaction,
  } = useGreeting({
    onExpressionChange: setExpression,
    currentExpression: expression,
  });

  // Camera Vision & Voice Greeting Perception hook
  const {
    isCameraActive,
    stream,
    isWaveDetected,
    detectionNotice,
    motionLevel,
    waveProgress,
    handTrackingX,
    hasHandMotion,
    errorMessage: cameraErrorMessage,
    isMicEnabled,
    isVoiceListening,
    videoRef: cameraVideoRef,
    canvasRef: cameraCanvasRef,
    attachVideoRef,
    toggleCamera,
    toggleMic,
    startCamera,
    triggerDetectedEvent,
  } = useCameraVision({
    onWaveDetected: (msg) => {
      triggerGreeting(msg || 'Hii!');
    },
  });

  // Finger Gun Mode hook (Cinematic Slow-Motion Dodge & Viewer-Directed Beam)
  const {
    isPlaying: isFingerGunPlaying,
    phase: fingerGunPhase,
    cooldown: fingerGunCooldown,
    cooldownTime: fingerGunCooldownTime,
    triggerFingerGun,
  } = useFingerGun({
    onExpressionChange: setExpression,
    onTriggerWink: triggerWink,
    containerRef: stageRef,
  });

  // Work Mode hook (Manual toggle, ready for future voice command triggers)
  const {
    isWorkMode,
    toggleWorkMode,
  } = useWorkMode({
    onExpressionChange: setExpression,
    currentExpression: expression,
    containerRef: stageRef,
  });

  // Fullscreen action
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  }, []);

  // Sync fullscreen state
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Track double taps for playful reaction
  const lastTapRef = useRef(0);

  const onPointerDown = useCallback(
    (e) => {
      const now = performance.now();
      const timeSinceLastTap = now - lastTapRef.current;
      lastTapRef.current = now;

      // Double tap detected (< 320ms) -> playful double blink + happy reaction
      if (timeSinceLastTap < 320 && !isFingerGunPlaying && !isWorkMode) {
        triggerBlink({ isDouble: true });
        triggerEyeReaction();
      }

      handlePointerMove(e.clientX, e.clientY);
    },
    [handlePointerMove, triggerBlink, triggerEyeReaction, isFingerGunPlaying, isWorkMode]
  );

  const onPointerMove = useCallback(
    (e) => {
      handlePointerMove(e.clientX, e.clientY);
    },
    [handlePointerMove]
  );

  const onPointerUp = useCallback(() => {
    handlePointerEnd();
  }, [handlePointerEnd]);

  // Keyboard controls for testing & presentations
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      switch (e.key) {
        case '1':
          setExpression(EXPRESSIONS.NEUTRAL);
          break;
        case '2':
          setExpression(EXPRESSIONS.HAPPY);
          break;
        case '3':
          setExpression(EXPRESSIONS.SLEEPY);
          break;
        case '4':
          setExpression(EXPRESSIONS.CURIOUS);
          break;
        case '5':
          setExpression(EXPRESSIONS.SURPRISED);
          break;
        case '6':
          setExpression(EXPRESSIONS.THINKING);
          break;
        case '7':
          setExpression(EXPRESSIONS.FOCUSED);
          break;
        case ' ':
          e.preventDefault();
          triggerBlink();
          break;
        case 'w':
        case 'W':
          triggerWink('left');
          break;
        case 'g':
        case 'G':
          triggerGreeting();
          break;
        case 'c':
        case 'C':
          toggleCamera();
          break;
        case 'p':
        case 'P':
          triggerFingerGun();
          break;
        case 'm':
        case 'M':
          toggleWorkMode();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerBlink, triggerWink, triggerGreeting, toggleCamera, triggerFingerGun, toggleWorkMode, toggleFullscreen]);

  return (
    <main
      className={`desk-app-root ${oledBlack ? 'oled-black-mode' : ''}`}
      aria-label="Desk Buddy Robot Eyes"
    >
      {/* Interactive Face Stage: Center-aligned, touch-optimized, slowmo-dodge animated */}
      <section
        ref={stageRef}
        className={`desk-face-stage ${fingerGunPhase === 'slowmo_dodge' ? 'is-slowmo-dodging' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <EyePair
          expression={expression}
          leftBlinkScale={leftBlinkScale}
          rightBlinkScale={rightBlinkScale}
          onLeftEyeClick={(e) => {
            e.stopPropagation();
            triggerWink('left');
            triggerEyeReaction();
          }}
          onRightEyeClick={(e) => {
            e.stopPropagation();
            triggerWink('right');
            triggerEyeReaction();
          }}
        />

        {/* Finger-Gun Cinematic Slow-Mo Projectile, 3D Barrel & Viewer-Directed Beam */}
        <FingerGunEffect phase={fingerGunPhase} />

        {/* Work Mode: Glowing Laptop & Dual Animated Typing Hands */}
        <WorkModeRig isActive={isWorkMode} onDismiss={toggleWorkMode} />
      </section>

      {/* Futuristic Camera Vision & Hand-Wave PIP HUD */}
      <CameraVisionHUD
        isActive={isCameraActive}
        stream={stream}
        onClose={toggleCamera}
        videoRef={cameraVideoRef}
        canvasRef={cameraCanvasRef}
        attachVideoRef={attachVideoRef}
        isWaveDetected={isWaveDetected}
        detectionNotice={detectionNotice}
        motionLevel={motionLevel}
        waveProgress={waveProgress}
        handTrackingX={handTrackingX}
        hasHandMotion={hasHandMotion}
        errorMessage={cameraErrorMessage}
        isMicEnabled={isMicEnabled}
        isVoiceListening={isVoiceListening}
        onToggleMic={toggleMic}
        onRetry={startCamera}
        onSimulateWave={() => triggerDetectedEvent('wave', 'Hii!')}
      />

      {/* Robotic Hand & Greeting Gesture */}
      {handState !== 'hidden' && (
        <aside
          className={`desk-hand-container is-${handState}`}
          aria-label="Robot companion hand"
        >
          <GreetingBubble message={bubbleMessage} />
          <RobotHand
            isWaving={isWaving}
            onHandClick={() => triggerGreeting()}
          />
        </aside>
      )}

      {/* Floating Testing & Expression Controls */}
      <ExpressionControls
        currentExpression={expression}
        onSelectExpression={setExpression}
        onTriggerBlink={triggerBlink}
        onTriggerWink={triggerWink}
        onTriggerGreeting={triggerGreeting}
        onTriggerFingerGun={triggerFingerGun}
        fingerGunPlaying={isFingerGunPlaying}
        fingerGunCooldown={fingerGunCooldown}
        fingerGunCooldownTime={fingerGunCooldownTime}
        isWorkMode={isWorkMode}
        onToggleWorkMode={toggleWorkMode}
        isCameraActive={isCameraActive}
        onToggleCamera={toggleCamera}
        interactiveTracking={interactiveTracking}
        onToggleTracking={setInteractiveTracking}
        idleEnabled={idleEnabled}
        onToggleIdle={setIdleEnabled}
        blinkingEnabled={blinkingEnabled}
        onToggleBlinking={setBlinkingEnabled}
        oledBlack={oledBlack}
        onToggleOledBlack={setOledBlack}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    </main>
  );
}

export default App;
