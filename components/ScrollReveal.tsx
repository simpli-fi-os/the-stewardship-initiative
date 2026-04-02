'use client'

import { useEffect, useRef, ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade'
  duration?: number
  threshold?: number
  className?: string
  triggerOnce?: boolean
}

const directionStyles: Record<string, { transform: string }> = {
  up: { transform: 'translateY(30px)' },
  down: { transform: 'translateY(-30px)' },
  left: { transform: 'translateX(30px)' },
  right: { transform: 'translateX(-30px)' },
  fade: { transform: 'none' },
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 800,
  threshold = 0.1,
  className = '',
  triggerOnce = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Set initial hidden state
    const initial = directionStyles[direction] || directionStyles.up
    el.style.opacity = '0'
    el.style.transform = initial.transform
    el.style.transition = `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`
    el.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1'
          el.style.transform = 'translate(0, 0)'
          if (triggerOnce) observer.unobserve(el)
        } else if (!triggerOnce) {
          el.style.opacity = '0'
          el.style.transform = initial.transform
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, direction, duration, threshold, triggerOnce])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
