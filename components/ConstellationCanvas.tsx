'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  directionX: number
  directionY: number
  size: number
}

export default function ConstellationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationStartRef = useRef(0)
  const connectionProgressRef = useRef(0)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const connectionDelay = 2500
    const connectionDuration = 3500

    function setCanvasSize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    function initParticles() {
      if (!canvas) return
      const particles: Particle[] = []
      const count = (canvas.height * canvas.width) / 9000

      for (let i = 0; i < count; i++) {
        const size = Math.random() * 1.5 + 1
        particles.push({
          x: Math.random() * (canvas.width - size * 4) + size * 2,
          y: Math.random() * (canvas.height - size * 4) + size * 2,
          directionX: (Math.random() * 0.4) - 0.2,
          directionY: (Math.random() * 0.4) - 0.2,
          size,
        })
      }

      particlesRef.current = particles
    }

    function drawParticles() {
      if (!ctx || !canvas) return

      particlesRef.current.forEach((p) => {
        if (p.x > canvas.width || p.x < 0) p.directionX = -p.directionX
        if (p.y > canvas.height || p.y < 0) p.directionY = -p.directionY
        p.x += p.directionX
        p.y += p.directionY

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(253, 253, 255, 0.4)'
        ctx.fill()
      })
    }

    function drawConnections() {
      if (!ctx || !canvas) return

      const progress = connectionProgressRef.current
      const maxDistSq = ((canvas.width / 7) ** 2) * progress
      if (maxDistSq === 0) return

      const particles = particlesRef.current
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distSq = dx * dx + dy * dy

          if (distSq < maxDistSq) {
            const opacity = (1 - distSq / 20000) * 0.15
            ctx.strokeStyle = `rgba(253, 253, 255, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
      }
    }

    function animate(timestamp: number) {
      if (!ctx || !canvas) return
      if (!animationStartRef.current) animationStartRef.current = timestamp

      const elapsed = timestamp - animationStartRef.current
      if (elapsed > connectionDelay) {
        connectionProgressRef.current = Math.min(
          (elapsed - connectionDelay) / connectionDuration,
          1
        )
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawParticles()
      drawConnections()
      rafRef.current = requestAnimationFrame(animate)
    }

    // Pause when tab not visible (performance)
    function handleVisibilityChange() {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current)
      } else {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    setCanvasSize()
    initParticles()
    rafRef.current = requestAnimationFrame(animate)

    window.addEventListener('resize', () => {
      setCanvasSize()
      initParticles()
    })
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelAnimationFrame(rafRef.current)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="constellation-canvas"
      aria-hidden="true"
    />
  )
}
