import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * FingerGunEffect Component
 * Cinematic slow-motion bullet dodge & viewer-directed energy beam blast.
 * Implemented with Framer Motion, SVG, and CSS.
 */
export function FingerGunEffect({ phase = 'idle' }) {
  if (phase === 'idle') return null;

  const showSlowMoBullet = phase === 'slowmo_dodge';
  const showGun = ['reveal_aim', 'charging', 'firing'].includes(phase);
  const isCharging = phase === 'charging';
  const isFiring = phase === 'firing';

  return (
    <div className="desk-finger-gun-layer" aria-hidden="true">
      {/* 1. Cinematic Fullscreen Muzzle Flash Overlay (Fires towards viewer) */}
      <AnimatePresence>
        {isFiring && (
          <motion.div
            key="screen-flash"
            className="desk-cinematic-screen-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.95, 0.4, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* 2. Slow-Motion Glowing Cyan Bullet with Particle Motion Trail */}
      <AnimatePresence>
        {showSlowMoBullet && (
          <motion.div
            key="slowmo-bullet"
            className="desk-slowmo-projectile-track"
            initial={{ x: '55vw', y: '8vh', opacity: 0, scale: 0.7 }}
            animate={{
              x: '-70vw',
              y: '-18vh',
              opacity: [0, 1, 1, 1, 0],
              scale: [0.7, 1.05, 1.15, 1.25, 0.9],
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.75, // Cinematic slow motion duration
              ease: [0.25, 0.1, 0.25, 1.0], // Silky smooth easing
            }}
          >
            {/* Primary Glowing Cyan Bullet Core */}
            <div className="desk-slowmo-bullet-core">
              <span className="desk-bullet-glow-aura" />
            </div>

            {/* Trailing Ghost Particles (Slow-Motion Afterimages) */}
            <div className="desk-slowmo-ghost ghost-1" />
            <div className="desk-slowmo-ghost ghost-2" />
            <div className="desk-slowmo-ghost ghost-3" />

            {/* Slow-Motion Particle Sparks */}
            <div className="desk-spark-particle spark-1" />
            <div className="desk-spark-particle spark-2" />
            <div className="desk-spark-particle spark-3" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Futuristic Stylized Sci-Fi Energy Gun (Turned directly towards the camera/viewer) */}
      <AnimatePresence>
        {showGun && (
          <motion.div
            key="viewer-gun"
            className={`desk-viewer-gun-rig ${isCharging ? 'is-charging' : ''} ${isFiring ? 'is-firing-recoil' : ''}`}
            initial={{ opacity: 0, scale: 0.4, y: 120, rotateX: 20 }}
            animate={{
              opacity: 1,
              scale: isFiring ? [1, 0.85, 1.05, 1] : 1,
              y: 0,
              rotateX: 0,
            }}
            exit={{ opacity: 0, scale: 0.5, y: 140 }}
            transition={{
              duration: isFiring ? 0.45 : 0.4,
              ease: [0.34, 1.56, 0.64, 1],
            }}
          >
            {/* 3A. Energy Beam Expanding Directly OUTWARD Towards the Screen/Viewer */}
            {isFiring && (
              <motion.div
                className="desk-viewer-energy-blast-system"
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{
                  scale: [0.1, 1.4, 4.5, 9.0],
                  opacity: [1, 1, 0.75, 0],
                }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Shockwave Rings Expanding Towards Camera */}
                <div className="desk-blast-shockwave ring-1" />
                <div className="desk-blast-shockwave ring-2" />
                {/* Central High-Intensity Plasma Beam Burst */}
                <div className="desk-blast-plasma-core" />
                {/* Radial Laser Rays Spreading to Screen Edges */}
                <div className="desk-blast-laser-rays" />
              </motion.div>
            )}

            {/* 3B. Energy Gun Model Pointed Straight at the Viewer (Pure SVG in Foreshortened 3D Perspective) */}
            <div className="desk-barrel-perspective-container">
              <svg
                viewBox="0 0 160 160"
                width="100%"
                height="100%"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Shadow Layer (Deep Cobalt Blue #323AA5 offset bottom-right) */}
                <g transform="translate(6, 8)" opacity="0.95">
                  {/* Outer Armor Casing Shadow */}
                  <rect x="24" y="24" width="112" height="112" rx="42" fill="#323AA5" />
                  {/* Grip / Support Base Shadow */}
                  <rect x="58" y="128" width="44" height="26" rx="12" fill="#323AA5" />
                </g>

                {/* Gun Housing & Muzzle Barrel (Looking down the barrel) */}
                <g>
                  {/* Robot Hand Grip Support (Turned toward user) */}
                  <rect x="58" y="128" width="44" height="26" rx="12" fill="#75D6E8" />
                  <line x1="66" y1="138" x2="94" y2="138" stroke="#0B0D12" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
                  <line x1="66" y1="145" x2="94" y2="145" stroke="#0B0D12" strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />

                  {/* Outer Main Body Casing (Smooth rounded robotic square/pill) */}
                  <rect x="24" y="24" width="112" height="112" rx="42" fill="#8AD6E2" />

                  {/* Heat Sink Accent Slots on Perimeter */}
                  <rect x="36" y="16" width="16" height="6" rx="3" fill="#75D6E8" />
                  <rect x="108" y="16" width="16" height="6" rx="3" fill="#75D6E8" />
                  <rect x="16" y="36" width="6" height="16" rx="3" fill="#75D6E8" />
                  <rect x="138" y="36" width="6" height="16" rx="3" fill="#75D6E8" />

                  {/* Concentric Barrel Rim (Deep Cobalt Chamber Rim) */}
                  <circle cx="80" cy="80" r="46" fill="#0B0D12" />
                  <circle cx="80" cy="80" r="42" fill="#323AA5" />
                  <circle cx="80" cy="80" r="37" fill="#0B0D12" />

                  {/* Rotating Magnetic Stabilization Ring (Hex Emitter Petals) */}
                  <g className={isCharging ? 'desk-emitter-ring-spin' : ''} style={{ transformOrigin: '80px 80px' }}>
                    <circle cx="80" cy="80" r="32" stroke="#8AD6E2" strokeWidth="3" strokeDasharray="16 10" />
                    <circle cx="80" cy="52" r="3.5" fill="#8AD6E2" />
                    <circle cx="108" cy="80" r="3.5" fill="#8AD6E2" />
                    <circle cx="80" cy="108" r="3.5" fill="#8AD6E2" />
                    <circle cx="52" cy="80" r="3.5" fill="#8AD6E2" />
                  </g>

                  {/* Central Plasma Aperture (Glowing core pointing at camera) */}
                  <circle cx="80" cy="80" r="22" fill="#323AA5" />
                  <circle
                    cx="80"
                    cy="80"
                    r={isCharging ? 18 : 14}
                    fill={isCharging || isFiring ? '#FFFFFF' : '#8AD6E2'}
                    className="desk-muzzle-plasma-core"
                  />
                  {/* Hot Center Point */}
                  <circle cx="80" cy="80" r="6" fill="#FFFFFF" />
                </g>
              </svg>

              {/* Charging Energy Swirls (Converging into the barrel during charging) */}
              {isCharging && (
                <div className="desk-charging-energy-converge">
                  <span className="desk-converge-ring ring-c1" />
                  <span className="desk-converge-ring ring-c2" />
                  <span className="desk-converge-ring ring-c3" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Cinematic Comic Action Badges */}
      <AnimatePresence>
        <div className="desk-gun-comic-badge">
          {phase === 'surprise' && (
            <motion.span
              key="b-surprise"
              className="desk-comic-text"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              Pew?! ⚡
            </motion.span>
          )}

          {phase === 'slowmo_dodge' && (
            <motion.span
              key="b-dodge"
              className="desk-comic-text desk-comic-slowmo"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              SLOW-MO DODGE 💨
            </motion.span>
          )}

          {phase === 'reveal_aim' && (
            <motion.span
              key="b-aim"
              className="desk-comic-text"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              Target Acquired 🎯
            </motion.span>
          )}

          {phase === 'charging' && (
            <motion.span
              key="b-charge"
              className="desk-comic-text desk-comic-charging"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [1, 1.1, 1], opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.3 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              CHARGING... ⚡
            </motion.span>
          )}

          {phase === 'firing' && (
            <motion.span
              key="b-fire"
              className="desk-comic-text desk-comic-blast"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1.2, 1], opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              PEW! 💥
            </motion.span>
          )}

          {phase === 'celebrating' && (
            <motion.span
              key="b-celeb"
              className="desk-comic-text desk-comic-win"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              Gotcha! 😉
            </motion.span>
          )}
        </div>
      </AnimatePresence>
    </div>
  );
}

export default FingerGunEffect;
