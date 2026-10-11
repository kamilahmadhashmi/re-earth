import React, { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

interface NumberTickerProps {
  value: number
  direction?: 'up' | 'down'
  className?: string
  delay?: number // in seconds
  decimalPlaces?: number
  prefix?: string
  suffix?: string
}

export const NumberTicker: React.FC<NumberTickerProps> = ({
  value,
  direction = 'up',
  delay = 0,
  className = '',
  decimalPlaces = 0,
  prefix = '',
  suffix = ''
}) => {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === 'down' ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  })
  const isInView = useInView(ref, { once: true, margin: '0px' })

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(direction === 'down' ? 0 : value)
      }, delay * 1000)
      return () => clearTimeout(timer)
    }
  }, [isInView, delay, value, direction, motionValue])

  useEffect(
    () =>
      springValue.on('change', (latest) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${latest.toFixed(decimalPlaces)}${suffix}`
        }
      }),
    [springValue, decimalPlaces, prefix, suffix]
  )

  return (
    <span
      className={`inline-block tabular-nums tracking-tight ${className}`}
      ref={ref}
    >
      {prefix}
      {(direction === 'down' ? value : 0).toFixed(decimalPlaces)}
      {suffix}
    </span>
  )
}

export default NumberTicker
