'use client'

import { useEffect, useRef, useState } from 'react'

interface AnimatedCounterProps {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
  className?: string
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

export default function AnimatedCounter({
  target,
  duration = 2000,
  suffix = '',
  prefix = '',
  decimals = 0,
  className = '',
}: AnimatedCounterProps) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true
          const startTime = performance.now()

          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const easedProgress = easeOut(progress)
            const current = easedProgress * target

            setValue(current)

            if (progress < 1) {
              requestAnimationFrame(tick)
            }
          }

          requestAnimationFrame(tick)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  const displayValue = decimals > 0
    ? value.toFixed(decimals)
    : Math.round(value).toLocaleString()

  return (
    <span ref={ref} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  )
}
