'use client'

import { useEffect, useRef, useState } from 'react'

import { getMessages, type Locale } from '@/lib/i18n'
import type { HeroSlide, HeroTransition } from '@/lib/sections'

function inkOn(hex: string) {
  const n = Number.parseInt(hex.slice(1), 16)
  if (!Number.isFinite(n)) return '#fff'
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#1d2939' : '#fff'
}

export function HeroSlides({
  slides,
  transition = 'fade',
  duration = 6,
  locale = 'es',
  showNav = true,
}: {
  slides: HeroSlide[]
  transition?: HeroTransition
  duration?: number
  locale?: Locale
  showNav?: boolean
}) {
  const t = getMessages(locale)
  const [index, setIndex] = useState(0)
  const [leaving, setLeaving] = useState(-1)
  const [back, setBack] = useState(false)
  const [clock, setClock] = useState(0)
  const indexRef = useRef(0)
  const seconds = Number.isFinite(duration) && duration >= 1 ? duration : 6
  indexRef.current = index

  useEffect(() => {
    setIndex(0)
    setLeaving(-1)
    setBack(false)
  }, [slides.length, transition, seconds])

  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => {
      const current = indexRef.current
      setLeaving(current)
      setBack(false)
      setIndex((current + 1) % slides.length)
    }, seconds * 1000)
    return () => window.clearInterval(timer)
  }, [slides.length, seconds, clock])

  const go = (target: number, reverse: boolean) => {
    if (slides.length < 2 || target === index) return
    setLeaving(index)
    setBack(reverse)
    setIndex((target + slides.length) % slides.length)
    setClock((value) => value + 1)
  }

  if (!slides.length) return null

  return (
    <div className={`hero-bg hero-bg--${transition}${back ? ' hero-bg--back' : ''}${showNav && slides.length > 1 ? ' hero-bg--nav' : ''}`}>
      {slides.map((slide, i) => (
        <div
          key={`${slide.image || 'slide'}-${i}`}
          className={`hero-slide${i === index ? ' is-active' : ''}${i === leaving ? ' is-leaving' : ''}`}
          aria-hidden={i !== index}
        >
          {slide.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.image} alt="" />
          ) : null}
          <span className="hero-slide-dim" aria-hidden="true" />
          {(['top', 'center', 'bottom'] as const).map((y) => {
            const title = slide.title && slide.titleAlignY === y
            const text = slide.text && slide.textAlignY === y
            const cta = slide.cta && slide.ctaAlignY === y
            if (!title && !text && !cta) return null
            const ctaStyle = slide.ctaColor
              ? { background: slide.ctaColor, color: inkOn(slide.ctaColor) }
              : undefined
            return (
              <div className={`hero-slide-caption hero-slide-caption--y-${y}`} key={y}>
                {title ? (
                  <p className={`hero-slide-title hero-slide-title--${slide.titleAlign} hero-slide-title--${slide.titleSize}`} style={slide.titleColor ? { color: slide.titleColor } : undefined}>
                    {slide.title}
                  </p>
                ) : null}
                {text ? (
                  <p className={`hero-slide-text hero-slide-text--${slide.textAlign} hero-slide-text--${slide.textSize}`} style={slide.textColor ? { color: slide.textColor } : undefined}>
                    {slide.text}
                  </p>
                ) : null}
                {cta ? (
                  <a className={`flux-btn hero-slide-cta hero-slide-cta--${slide.ctaAlign} hero-slide-cta--${slide.ctaSize}`} href={slide.ctaHref || '#'} style={ctaStyle}>
                    {slide.cta}
                  </a>
                ) : null}
              </div>
            )
          })}
        </div>
      ))}
      {showNav && slides.length > 1 ? (
        <div className="hero-nav">
          <button type="button" className="hero-nav__arrow" aria-label={t.prev} onClick={() => go(index - 1, true)}>
            ‹
          </button>
          <div className="hero-nav__picks">
            {slides.map((slide, i) => (
              <button
                key={`${slide.image || 'pick'}-${i}`}
                type="button"
                className={i === index ? 'is-on' : ''}
                aria-label={`${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => go(i, i < index)}
              >
                {slide.image ? <img src={slide.image} alt="" /> : <span>{i + 1}</span>}
              </button>
            ))}
          </div>
          <button type="button" className="hero-nav__arrow" aria-label={t.next} onClick={() => go(index + 1, false)}>
            ›
          </button>
        </div>
      ) : null}
    </div>
  )
}
