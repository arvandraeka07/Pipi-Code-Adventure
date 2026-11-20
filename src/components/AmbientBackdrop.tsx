import { useEffect, useRef, type CSSProperties } from 'react'

const SPARKS = [
  { left: '7%', top: '18%', size: 7, color: '#63DE95', delay: '0s', duration: '7s' },
  { left: '91%', top: '13%', size: 6, color: '#FFC93C', delay: '-1.4s', duration: '8s' },
  { left: '84%', top: '42%', size: 5, color: '#CDBAF9', delay: '-3.2s', duration: '6.5s' },
  { left: '12%', top: '62%', size: 6, color: '#8ED8FF', delay: '-2.2s', duration: '9s' },
  { left: '72%', top: '76%', size: 4, color: '#FF8A7A', delay: '-0.8s', duration: '7.5s' },
  { left: '28%', top: '86%', size: 5, color: '#63DE95', delay: '-4s', duration: '8.5s' },
  { left: '48%', top: '9%', size: 4, color: '#FFC93C', delay: '-5s', duration: '6s' },
  { left: '95%', top: '67%', size: 5, color: '#FFD9E3', delay: '-1.8s', duration: '9.5s' },
]

export function AmbientBackdrop() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    let pointerX = window.innerWidth * 0.72
    let pointerY = window.innerHeight * 0.18
    const update = () => {
      frame = 0
      node.style.setProperty('--pointer-x', `${pointerX}px`)
      node.style.setProperty('--pointer-y', `${pointerY}px`)
    }
    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="ambient-backdrop" aria-hidden="true">
      <span className="ambient-orb ambient-orb-a" />
      <span className="ambient-orb ambient-orb-b" />
      <span className="ambient-orb ambient-orb-c" />
      <span className="ambient-glow" />
      {SPARKS.map((spark, index) => (
        <span
          key={index}
          className="ambient-spark"
          style={
            {
              left: spark.left,
              top: spark.top,
              width: spark.size,
              height: spark.size,
              backgroundColor: spark.color,
              animationDelay: spark.delay,
              animationDuration: spark.duration,
            } satisfies CSSProperties
          }
        />
      ))}
    </div>
  )
}
