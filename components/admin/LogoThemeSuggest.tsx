'use client'

import { Button, useField, useTranslation } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

import { DEFAULT_LOGO_SRC } from '@/lib/media'
import { darkenHex, fontFamily, parseHex, type FontId } from '@/lib/theme'

type Suggestion = {
  primary: string
  secondary: string
  fontPrimaryColor: string
  fontSecondaryColor: string
  body: FontId
  display: FontId
}

function rec(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value ? (value as Record<string, unknown>) : null
}

async function logoSrc(value: unknown): Promise<string | null> {
  const obj = rec(value)
  if (obj) {
    if (typeof obj.url === 'string' && obj.url) return obj.url
    if (typeof obj.filename === 'string' && obj.filename) return `/api/media/file/${obj.filename}`
    if (obj.id != null) {
      const res = await fetch(`/api/media/${obj.id}`, { credentials: 'include' })
      if (res.ok) {
        const doc = (await res.json()) as { url?: string; filename?: string }
        if (doc.url) return doc.url
        if (doc.filename) return `/api/media/file/${doc.filename}`
      }
    }
  }
  if (typeof value === 'number' || (typeof value === 'string' && /^\d+$/.test(value))) {
    const res = await fetch(`/api/media/${value}`, { credentials: 'include' })
    if (res.ok) {
      const doc = (await res.json()) as { url?: string; filename?: string }
      if (doc.url) return doc.url
      if (doc.filename) return `/api/media/file/${doc.filename}`
    }
  }
  return DEFAULT_LOGO_SRC
}

function hex(r: number, g: number, b: number) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
}

function hue(r: number, g: number, b: number) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const d = max - min
  if (d === 0) return 0
  let h = 0
  if (max === r) h = ((g - b) / d) % 6
  else if (max === g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  h *= 60
  return h < 0 ? h + 360 : h
}

function sat(r: number, g: number, b: number) {
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  const l = (max + min) / 2
  if (max === min) return 0
  return l > 0.5 ? (max - min) / (2 - max - min) : (max - min) / (max + min)
}

function luminance(hexColor: string) {
  const raw = hexColor.replace('#', '')
  if (raw.length !== 6) return 1
  const n = (i: number) => parseInt(raw.slice(i, i + 2), 16)
  return (0.2126 * n(0) + 0.7152 * n(2) + 0.0722 * n(4)) / 255
}

function inkFrom(hexColor: string) {
  return luminance(hexColor) < 0.4 ? hexColor : darkenHex(hexColor, 0.58)
}

function fontsForHue(h: number, s: number): { body: FontId; display: FontId } {
  if (s < 0.18) return { body: 'inter', display: 'cormorant' }
  if (h < 40 || h >= 340) return { body: 'lato', display: 'playfair' }
  if (h < 80) return { body: 'nunito', display: 'fraunces' }
  if (h < 170) return { body: 'work-sans', display: 'source-serif' }
  if (h < 260) return { body: 'montserrat', display: 'source-serif' }
  return { body: 'inter', display: 'cormorant' }
}

function sample(src: string): Promise<Suggestion | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const size = 48
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        resolve(null)
        return
      }
      ctx.drawImage(img, 0, 0, size, size)
      const data = ctx.getImageData(0, 0, size, size).data
      const buckets = new Map<string, { n: number; r: number; g: number; b: number }>()
      for (let i = 0; i < data.length; i += 4) {
        const a = data[i + 3]
        if (a < 80) continue
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        if (sat(r, g, b) < 0.08 && (r + g + b) / 3 > 230) continue
        const key = `${Math.round(r / 24)}_${Math.round(g / 24)}_${Math.round(b / 24)}`
        const cur = buckets.get(key) || { n: 0, r: 0, g: 0, b: 0 }
        cur.n += 1
        cur.r += r
        cur.g += g
        cur.b += b
        buckets.set(key, cur)
      }
      const ranked = [...buckets.values()]
        .map((c) => ({
          n: c.n,
          r: Math.round(c.r / c.n),
          g: Math.round(c.g / c.n),
          b: Math.round(c.b / c.n),
        }))
        .sort((a, b) => b.n - a.n)
      const primary = ranked[0]
      if (!primary) {
        resolve(null)
        return
      }
      const ph = hue(primary.r, primary.g, primary.b)
      const secondary =
        ranked.find((c) => {
          const dh = Math.abs(hue(c.r, c.g, c.b) - ph)
          return Math.min(dh, 360 - dh) > 40
        }) || ranked[1] || primary
      const fonts = fontsForHue(ph, sat(primary.r, primary.g, primary.b))
      const primaryHex = hex(primary.r, primary.g, primary.b)
      const secondaryHex = hex(secondary.r, secondary.g, secondary.b)
      resolve({
        primary: primaryHex,
        secondary: secondaryHex,
        fontPrimaryColor: inkFrom(primaryHex),
        fontSecondaryColor: inkFrom(secondaryHex),
        body: fonts.body,
        display: fonts.display,
      })
    }
    img.onerror = () => resolve(null)
    img.src = src
  })
}

function sameColor(value: unknown, suggested: string) {
  return parseHex(value, '').toLowerCase() === suggested.toLowerCase()
}

export function LogoThemeSuggest() {
  const { value } = useField({ path: 'logo', potentiallyStalePath: 'logo' })
  const { value: colorPrimary, setValue: setPrimary } = useField<string>({
    path: 'colorPrimary',
    potentiallyStalePath: 'colorPrimary',
  })
  const { value: colorSecondary, setValue: setSecondary } = useField<string>({
    path: 'colorSecondary',
    potentiallyStalePath: 'colorSecondary',
  })
  const { value: colorFontPrimary, setValue: setFontPrimaryColor } = useField<string>({
    path: 'colorFontPrimary',
    potentiallyStalePath: 'colorFontPrimary',
  })
  const { value: colorFontSecondary, setValue: setFontSecondaryColor } = useField<string>({
    path: 'colorFontSecondary',
    potentiallyStalePath: 'colorFontSecondary',
  })
  const { value: fontPrimary, setValue: setFontPrimary } = useField<string>({
    path: 'fontPrimary',
    potentiallyStalePath: 'fontPrimary',
  })
  const { value: fontSecondary, setValue: setFontSecondary } = useField<string>({
    path: 'fontSecondary',
    potentiallyStalePath: 'fontSecondary',
  })
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null)

  useEffect(() => {
    let cancelled = false
    logoSrc(value)
      .then((src) => (src ? sample(src) : null))
      .then((next) => {
        if (!cancelled) setSuggestion(next)
      })
    return () => {
      cancelled = true
    }
  }, [value])

  if (!suggestion) return null

  const applied =
    sameColor(colorPrimary, suggestion.primary) &&
    sameColor(colorSecondary, suggestion.secondary) &&
    sameColor(colorFontPrimary, suggestion.fontPrimaryColor) &&
    sameColor(colorFontSecondary, suggestion.fontSecondaryColor) &&
    fontPrimary === suggestion.body &&
    fontSecondary === suggestion.display

  const title = applied
    ? en
      ? 'Suggestion from the logo (applied)'
      : 'Sugerencia según el logo (aplicada)'
    : en
      ? 'Suggestion from the logo'
      : 'Sugerencia según el logo'

  return (
    <details className="logo-theme-suggest">
      <summary className="logo-theme-suggest__summary">{title}</summary>
      <div className="logo-theme-suggest__body">
        {applied ? null : (
          <Button
            buttonStyle="primary"
            className="logo-theme-suggest__apply"
            el="button"
            onClick={() => {
              setPrimary(suggestion.primary)
              setSecondary(suggestion.secondary)
              setFontPrimaryColor(suggestion.fontPrimaryColor)
              setFontSecondaryColor(suggestion.fontSecondaryColor)
              setFontPrimary(suggestion.body)
              setFontSecondary(suggestion.display)
            }}
            size="small"
            type="button"
          >
            {en ? 'Apply' : 'Aplicar'}
          </Button>
        )}
        <div className="logo-theme-suggest__grid">
          <div className="logo-theme-suggest__item">
            <span>{en ? 'Primary color:' : 'Color Primario:'}</span>
            <span className="logo-theme-suggest__swatch" style={{ background: suggestion.primary }} />
            <code>{suggestion.primary}</code>
          </div>
          <div className="logo-theme-suggest__item">
            <span>{en ? 'Secondary color:' : 'Color Secundario:'}</span>
            <span className="logo-theme-suggest__swatch" style={{ background: suggestion.secondary }} />
            <code>{suggestion.secondary}</code>
          </div>
          <div className="logo-theme-suggest__item">
            <span>{en ? 'Primary font color:' : 'Color fuente principal:'}</span>
            <span className="logo-theme-suggest__swatch" style={{ background: suggestion.fontPrimaryColor }} />
            <code>{suggestion.fontPrimaryColor}</code>
          </div>
          <div className="logo-theme-suggest__item">
            <span>{en ? 'Primary font:' : 'Fuente principal:'}</span>
            <span>{fontFamily(suggestion.body)}</span>
          </div>
          <div className="logo-theme-suggest__item">
            <span>{en ? 'Secondary font color:' : 'Color fuente secundaria:'}</span>
            <span className="logo-theme-suggest__swatch" style={{ background: suggestion.fontSecondaryColor }} />
            <code>{suggestion.fontSecondaryColor}</code>
          </div>
          <div className="logo-theme-suggest__item">
            <span>{en ? 'Secondary font:' : 'Fuente secundaria:'}</span>
            <span>{fontFamily(suggestion.display)}</span>
          </div>
        </div>
      </div>
    </details>
  )
}
