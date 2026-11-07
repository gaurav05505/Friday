import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * useCameraVision hook
 * Real-time, robust hand-wave gesture detection for Desk Buddy.
 * - Global motion rejection: filters out whole-body movement, chair shifts, and head sways.
 * - Localized spatial bounding box tracking (spanX, spanY, motion density).
 * - Minimum stroke amplitude (>=7.5px) to prevent false positives from micro-movements.
 * - True 3-reversal oscillation requirement (Left -> Right -> Left -> Right).
 * - Fast reset timeout (600ms): pauses or slow sways reset wave progress.
 * - Optional, toggleable voice recognition for "Hi" / "Wave hand" with strict phrase matching.
 * - 3.5s cooldown to prevent repeat triggers.
 */
export function useCameraVision({ onWaveDetected }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isWaveDetected, setIsWaveDetected] = useState(false);
  const [detectionNotice, setDetectionNotice] = useState('');
  const [motionLevel, setMotionLevel] = useState(0);
  const [waveProgress, setWaveProgress] = useState(0); // 0 to 3 segments
  const [handTrackingX, setHandTrackingX] = useState(50);
  const [hasHandMotion, setHasHandMotion] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const voiceCooldownUntil = useRef(0);

  // Gesture tracking state
  const trackingState = useRef({
    prevFrameData: null,
    anchorX: 64, // Center anchor
    directionChanges: 0,
    lastDirection: 0, // -1: left, 1: right
    lastDirectionTime: 0,
    cooldownUntil: 0,
    lastMotionReportTime: 0,
  });

  // Callback ref keeper
  const onWaveDetectedRef = useRef(onWaveDetected);
  useEffect(() => {
    onWaveDetectedRef.current = onWaveDetected;
  }, [onWaveDetected]);

  // Trigger greeting reaction with visual HUD feedback
  const triggerDetectedEvent = useCallback((type = 'wave', message = 'Hii!') => {
    setIsWaveDetected(true);
    setDetectionNotice(type === 'voice' ? 'Voice: "Hi!" 🎙️' : 'Hand Wave Detected! 👋');
    setWaveProgress(3);

    onWaveDetectedRef.current?.(message);

    setTimeout(() => {
      setIsWaveDetected(false);
      setDetectionNotice('');
      setWaveProgress(0);
    }, 1800);
  }, []);

  // Callback ref to attach stream as soon as <video> mounts into DOM
  const attachVideoRef = useCallback((node) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.muted = true;
      node.playsInline = true;
      node.autoplay = true;
      if (node.srcObject !== streamRef.current) {
        node.srcObject = streamRef.current;
        node.play().catch((err) => console.debug('Video autoplay notice:', err));
      }
    }
  }, []);

  // Frame processing loop ref
  const processFrameRef = useRef(null);

  useEffect(() => {
    processFrameRef.current = () => {
      if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

      const video = videoRef.current;

      // Wait until video has loaded metadata and current frame data
      if (video.readyState < 2 || video.videoWidth === 0) {
        animFrameRef.current = requestAnimationFrame(() => {
          processFrameRef.current?.();
        });
        return;
      }

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      const width = 128;
      const height = 96;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      // Draw downsampled camera frame
      ctx.drawImage(video, 0, 0, width, height);
      const frame = ctx.getImageData(0, 0, width, height);
      const data = frame.data;
      const now = performance.now();

      const state = trackingState.current;

      if (state.prevFrameData && now > state.cooldownUntil) {
        const prev = state.prevFrameData;
        let diffSum = 0;
        let motionXSum = 0;
        let motionCount = 0;

        let minX = width;
        let maxX = 0;
        let minY = height;
        let maxY = 0;

        // Sample every 4th pixel (stride 16 in ImageData)
        for (let i = 0; i < data.length; i += 16) {
          const rDiff = Math.abs(data[i] - prev[i]);
          const gDiff = Math.abs(data[i + 1] - prev[i + 1]);
          const bDiff = Math.abs(data[i + 2] - prev[i + 2]);
          const diff = (rDiff + gDiff + bDiff) / 3;

          // Motion threshold: filters sensor noise (>20 is genuine physical motion)
          if (diff > 20) {
            const pixelIndex = i / 4;
            const x = pixelIndex % width;
            const y = Math.floor(pixelIndex / width);

            // Focus on upper 85% of frame (ignore desk surface / keyboard)
            if (y < height * 0.85) {
              diffSum += diff;
              motionXSum += x;
              motionCount++;

              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        // Real-time Motion Energy Metric (0-100%) for HUD visualizer
        if (now - state.lastMotionReportTime > 60) {
          const energy = Math.min(100, Math.round((motionCount / 90) * 100));
          setMotionLevel(energy);
          state.lastMotionReportTime = now;
        }

        const spanX = maxX > minX ? maxX - minX : 0;
        const spanY = maxY > minY ? maxY - minY : 0;

        // CRITICAL FILTER 1: Reject Global Whole-Body Movement
        // If movement covers more than 55% of width and 50% of height, or >420 pixels:
        // That is a body posture shift, chair roll, or camera movement — NOT a hand wave!
        const isGlobalBodyShift = (spanX > 70 && spanY > 48) || motionCount > 420;

        if (isGlobalBodyShift) {
          // Immediately reset any active wave progress
          state.directionChanges = 0;
          state.lastDirection = 0;
          setWaveProgress(0);
          setHasHandMotion(false);
        } else if (motionCount >= 26 && diffSum >= 850) {
          // CRITICAL FILTER 2: Localized Hand Gesture Detection
          setHasHandMotion(true);
          const centroidX = motionXSum / motionCount;

          // Update hand reticle percentage (0 to 100%)
          setHandTrackingX(Math.round((centroidX / width) * 100));

          // Calculate displacement from current anchor
          const distFromAnchor = centroidX - state.anchorX;

          // CRITICAL FILTER 3: Meaningful Stroke Amplitude
          // Hand must move at least 7.5 pixels on a 128px canvas (~6% frame width)
          // Micro-movements, head tilts, and breathing are <4px and get rejected
          if (Math.abs(distFromAnchor) >= 7.5) {
            const currentDir = distFromAnchor > 0 ? 1 : -1;

            if (state.lastDirection !== 0 && currentDir !== state.lastDirection) {
              const timeSinceLastFlip = now - state.lastDirectionTime;

              // CRITICAL FILTER 4: Natural Waving Tempo
              // Each stroke flip must be between 100ms and 520ms (human waving rhythm)
              if (timeSinceLastFlip >= 100 && timeSinceLastFlip <= 520) {
                state.directionChanges++;
                state.lastDirectionTime = now;
                state.lastDirection = currentDir;
                state.anchorX = centroidX;

                setWaveProgress(Math.min(3, state.directionChanges));

                // CRITICAL FILTER 5: True Multi-Stroke Oscillation
                // Requires 3 alternating reversals (Left -> Right -> Left -> Right)
                if (state.directionChanges >= 3) {
                  state.cooldownUntil = now + 3500; // 3.5s cooldown
                  state.directionChanges = 0;
                  setWaveProgress(0);
                  triggerDetectedEvent('wave', 'Hii!');
                }
              } else if (timeSinceLastFlip > 520) {
                // Slower than a wave, start fresh count
                state.directionChanges = 1;
                state.lastDirectionTime = now;
                state.lastDirection = currentDir;
                state.anchorX = centroidX;
                setWaveProgress(1);
              }
            } else {
              // Continuing in same direction or first detected move
              if (state.lastDirection === 0) {
                state.lastDirection = currentDir;
                state.lastDirectionTime = now;
              }
              state.anchorX = centroidX;
            }
          }
        } else {
          setHasHandMotion(false);
          // If motion settles for >600ms, reset progress
          if (now - state.lastDirectionTime > 600) {
            state.directionChanges = 0;
            setWaveProgress(0);
          }
        }
      }

      state.prevFrameData = data;
      animFrameRef.current = requestAnimationFrame(() => {
        processFrameRef.current?.();
      });
    };
  }, [isCameraActive, triggerDetectedEvent]);

  // Stop camera stream & voice recognition cleanly
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (speechRecognitionRef.current) {
      try {
        speechRecognitionRef.current.stop();
      } catch {
        // ignore
      }
      speechRecognitionRef.current = null;
    }

    setStream(null);
    setIsCameraActive(false);
    setIsVoiceListening(false);
    setIsWaveDetected(false);
    setMotionLevel(0);
    setWaveProgress(0);
    setHasHandMotion(false);
  }, []);

  // Initialize Speech Recognition for voice trigger ("hi", "wave hand", etc.)
  const startSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined' || !isMicEnabled) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsVoiceListening(true);
      };

      recognition.onresult = (event) => {
        const now = performance.now();
        if (now < voiceCooldownUntil.current) return;

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0]?.transcript?.trim().toLowerCase() || '';

          // Strict phrase matching so ordinary talking or noise does NOT trigger it
          const matchesGreeting =
            /^(hi|hii|hello|hey|wave|wave\s*hand|say\s*hi|hey\s*buddy)$/i.test(transcript) ||
            /\b(wave\s*hand|say\s*hi\s*buddy)\b/i.test(transcript);

          if (matchesGreeting) {
            voiceCooldownUntil.current = now + 3500;
            triggerDetectedEvent('voice', 'Hii!');
            break;
          }
        }
      };

      recognition.onerror = () => {
        // Silently tolerate
      };

      recognition.onend = () => {
        if (streamRef.current && isCameraActive && isMicEnabled) {
          try {
            recognition.start();
          } catch {
            // ignore
          }
        } else {
          setIsVoiceListening(false);
        }
      };

      recognition.start();
      speechRecognitionRef.current = recognition;
    } catch {
      // ignore
    }
  }, [isCameraActive, isMicEnabled, triggerDetectedEvent]);

  // Toggle microphone listening on/off
  const toggleMic = useCallback(() => {
    setIsMicEnabled((prev) => {
      const next = !prev;
      if (!next && speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop();
        } catch {
          // ignore
        }
        speechRecognitionRef.current = null;
        setIsVoiceListening(false);
      } else if (next && isCameraActive) {
        startSpeechRecognition();
      }
      return next;
    });
  }, [isCameraActive, startSpeechRecognition]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported on this browser or context.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);
      setHasPermission(true);
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.muted = true;
        videoRef.current.playsInline = true;
        videoRef.current.autoplay = true;
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => console.debug('Video play catch:', err));
      }

      if (isMicEnabled) {
        startSpeechRecognition();
      }
    } catch (err) {
      console.warn('Camera vision error:', err);
      setHasPermission(false);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in your browser address bar.'
          : err.message || 'Unable to access camera.'
      );
      setIsCameraActive(false);
    }
  }, [isMicEnabled, startSpeechRecognition]);

  // Ensure video element receives stream whenever stream or isCameraActive updates
  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      const v = videoRef.current;
      v.muted = true;
      v.playsInline = true;
      v.autoplay = true;
      if (v.srcObject !== stream) {
        v.srcObject = stream;
        v.play().catch((err) => console.debug('Video play catch:', err));
      }
    }
  }, [isCameraActive, stream]);

  // Run processing loop when camera is active
  useEffect(() => {
    if (isCameraActive) {
      animFrameRef.current = requestAnimationFrame(() => {
        processFrameRef.current?.();
      });
    } else {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCameraActive]);

  // Clean up on unmount
  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const toggleCamera = useCallback(() => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  }, [isCameraActive, startCamera, stopCamera]);

  return {
    isCameraActive,
    stream,
    hasPermission,
    isWaveDetected,
    detectionNotice,
    motionLevel,
    waveProgress,
    handTrackingX,
    hasHandMotion,
    errorMessage,
    isMicEnabled,
    isVoiceListening,
    videoRef,
    canvasRef,
    attachVideoRef,
    startCamera,
    stopCamera,
    toggleCamera,
    toggleMic,
    triggerDetectedEvent,
  };
}

export default useCameraVision;
