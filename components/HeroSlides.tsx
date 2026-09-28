'use client'

import { useEffect, useState } from 'react'

import type { HeroSlide } from '@/lib/sections'

export function HeroSlides({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 6000)
    return () => window.clearInterval(timer)
  }, [slides.length])

  return (
    <div className="hero-bg">
      {slides.map((slide, i) => (
        <div
          key={`${slide.image}-${i}`}
          className={`hero-slide${i === index ? ' is-active' : ''}`}
          aria-hidden={i !== index}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={slide.image} alt="" />
          <span className="hero-slide-dim" aria-hidden="true" />
          {slide.text ? (
            <p className={`hero-slide-caption hero-slide-caption--${slide.textX} hero-slide-caption--y-${slide.textY}`}>
              {slide.text}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  )
}
