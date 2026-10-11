import React, { useState, useEffect, useRef } from 'react'

export type ScrambleTag = 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'

interface KineticScrambleTextProps {
  text: string
  className?: string
  scrambleChars?: string
  duration?: number // duration in ms
  speed?: number // speed of interval in ms
  trigger?: 'inView' | 'mount' | 'hover'
  as?: ScrambleTag
  delay?: number
}

const DEFAULT_CHARS = '0123456789ABCDEF∆◈⌁█§ØX'

export const KineticScrambleText: React.FC<KineticScrambleTextProps> = ({
  text,
  className = '',
  scrambleChars = DEFAULT_CHARS,
  duration = 900,
  speed = 35,
  trigger = 'inView',
  as = 'span',
  delay = 0
}) => {
  const [displayText, setDisplayText] = useState(text)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startScramble = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      const startTime = Date.now()
      const length = text.length

      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(1, elapsed / duration)
        const revealCount = Math.floor(progress * length)

        let result = ''
        for (let i = 0; i < length; i++) {
          if (text[i] === ' ' || text[i] === '\n') {
            result += text[i]
          } else if (i < revealCount) {
            result += text[i]
          } else {
            result += scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
          }
        }

        setDisplayText(result)

        if (progress >= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setDisplayText(text)
          setHasAnimated(true)
        }
      }, speed)
    }, delay)
  }

  useEffect(() => {
    if (trigger === 'mount') {
      startScramble()
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    }

    if (trigger === 'inView' && elementRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !hasAnimated) {
              startScramble()
            }
          })
        },
        { threshold: 0.25 }
      )

      observer.observe(elementRef.current)
      return () => {
        observer.disconnect()
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
      }
    }
  }, [trigger, text, hasAnimated])

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      startScramble()
    }
  }

  return React.createElement(
    as,
    {
      ref: elementRef,
      className: `font-inherit inline-block overflow-visible align-baseline ${className}`,
      onMouseEnter: handleMouseEnter,
      'aria-label': text
    },
    displayText
  )
}

export default KineticScrambleText
