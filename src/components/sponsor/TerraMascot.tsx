import React, { useState } from 'react'
import { motion } from 'framer-motion'

export type TerraPose = 'welcome' | 'pointing' | 'celebrating' | 'observing'

interface TerraMascotProps {
  pose?: TerraPose
  size?: number
  className?: string
  speechBubbleText?: string
}

export const TerraMascot: React.FC<TerraMascotProps> = ({
  pose = 'welcome',
  size = 72,
  className = '',
  speechBubbleText
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Floating animation variants based on pose
  const floatVariants = {
    welcome: {
      y: [0, -6, 0],
      rotate: [0, 1.5, 0, -1.5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    pointing: {
      x: [0, 5, 0],
      rotate: [5, 8, 5],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    celebrating: {
      y: [0, -10, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    },
    observing: {
      rotate: [-3, -6, -3],
      y: [0, -3, 0],
      transition: {
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  }

  return (
    <div
      className={`relative inline-flex items-center gap-3 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        variants={floatVariants}
        animate={pose}
        style={{ width: size, height: size }}
        className="relative shrink-0 cursor-pointer"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_8px_16px_rgba(16,185,129,0.25)]"
        >
          {/* Ambient Glow */}
          <circle
            cx="50"
            cy="52"
            r="38"
            fill="url(#terra_glow_gradient)"
            opacity={isHovered ? '0.45' : '0.25'}
            className="transition-opacity duration-300"
          />

          {/* Orbital Circular Recycling Ring */}
          <motion.ellipse
            cx="50"
            cy="55"
            rx="42"
            ry="14"
            stroke="url(#ring_gradient)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
            fill="none"
            transform="rotate(-15 50 55)"
            animate={{
              strokeDashoffset: isHovered ? [0, -40] : [0, -20]
            }}
            transition={{
              duration: isHovered ? 4 : 8,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          {/* Tiny Orbital Particle on the ring */}
          <motion.circle
            cx="22"
            cy="50"
            r="2.5"
            fill="#34D399"
            animate={{
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />

          {/* Core Body - Friendly Earth Orb */}
          <circle
            cx="50"
            cy="52"
            r="28"
            fill="url(#body_gradient)"
            stroke="#10B981"
            strokeWidth="1.5"
          />

          {/* Continental / Leaf Pattern Swirls on Body */}
          <path
            d="M 38 46 Q 44 40 54 44 T 62 56 Q 54 62 42 58 Z"
            fill="#059669"
            opacity="0.35"
          />

          {/* Botanical Sprout Plumes on Crown */}
          <g transform="translate(0, -2)">
            {/* Left Leaf */}
            <motion.path
              d="M 48 25 C 44 18 36 16 34 20 C 33 24 40 28 48 26 Z"
              fill="#34D399"
              stroke="#059669"
              strokeWidth="1"
              animate={{
                rotate: isHovered ? [-4, 6, -4] : [-2, 2, -2]
              }}
              style={{ originX: '48px', originY: '26px' }}
              transition={{
                duration: isHovered ? 1.2 : 2.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            {/* Right Leaf */}
            <motion.path
              d="M 52 25 C 56 16 66 14 68 18 C 70 23 62 27 52 26 Z"
              fill="#10B981"
              stroke="#047857"
              strokeWidth="1"
              animate={{
                rotate: isHovered ? [4, -6, 4] : [2, -2, 2]
              }}
              style={{ originX: '52px', originY: '26px' }}
              transition={{
                duration: isHovered ? 1.4 : 2.8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
            {/* Sprout Stem */}
            <path
              d="M 50 25 L 50 29"
              stroke="#059669"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          {/* Facial Features */}
          {pose === 'celebrating' || isHovered ? (
            /* Joyful / Happy Eyes (Curved Arcs) */
            <g stroke="#064E3B" strokeWidth="2.5" strokeLinecap="round" fill="none">
              <path d="M 41 51 Q 45 47 49 51" />
              <path d="M 55 51 Q 59 47 63 51" />
            </g>
          ) : pose === 'pointing' ? (
            /* Focused Glancing Right Eyes */
            <g fill="#064E3B">
              <circle cx="46" cy="51" r="2.8" />
              <circle cx="47" cy="50" r="1" fill="#FFFFFF" />
              <circle cx="60" cy="51" r="2.8" />
              <circle cx="61" cy="50" r="1" fill="#FFFFFF" />
            </g>
          ) : (
            /* Calm Inquisitive Eyes */
            <g fill="#064E3B">
              <circle cx="43" cy="51" r="2.8" />
              <circle cx="44" cy="50" r="0.9" fill="#FFFFFF" />
              <circle cx="57" cy="51" r="2.8" />
              <circle cx="58" cy="50" r="0.9" fill="#FFFFFF" />
            </g>
          )}

          {/* Cheeks - Soft Coral Blush */}
          <circle cx="37" cy="55" r="2.5" fill="#F43F5E" opacity="0.4" />
          <circle cx="63" cy="55" r="2.5" fill="#F43F5E" opacity="0.4" />

          {/* Gentle Smile */}
          <path
            d="M 47 57 Q 50 61 53 57"
            stroke="#064E3B"
            strokeWidth="1.8"
            strokeLinecap="round"
            fill="none"
          />

          {/* Gradients */}
          <defs>
            <radialGradient id="terra_glow_gradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="body_gradient" x1="22" y1="24" x2="78" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#D1FAE5" />
              <stop offset="45%" stopColor="#A7F3D0" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="ring_gradient" x1="10" y1="50" x2="90" y2="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Optional Editorial Speech / Context Pill */}
      {speechBubbleText && (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs font-mono text-text-secondary shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald shrink-0" />
          <span>{speechBubbleText}</span>
        </motion.div>
      )}
    </div>
  )
}
