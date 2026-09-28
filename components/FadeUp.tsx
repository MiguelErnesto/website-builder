'use client'

import { useEffect, useRef, type ReactNode } from 'react'

type FadeUpProps = {
  children: ReactNode
  className?: string
}

export function FadeUp({ children, className = '' }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (!motionOk) {
      el.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.12 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`fade-up ${className}`}>
      {children}
    </div>
  )
}
