export const DEFAULT_PRIMARY = '#cc9999'
export const DEFAULT_SECONDARY = '#0099ff'
export const DEFAULT_FONT_COLOR = '#333333'

export const FONT_IDS = [
  'open-sans',
  'lato',
  'montserrat',
  'nunito',
  'inter',
  'poppins',
  'raleway',
  'work-sans',
  'dm-sans',
  'figtree',
  'outfit',
  'manrope',
  'playfair',
  'source-serif',
  'merriweather',
  'lora',
  'libre-baskerville',
  'cormorant',
  'fraunces',
  'eb-garamond',
] as const

export type FontId = (typeof FONT_IDS)[number]

const FONTS: Record<
  FontId,
  { family: string; fallback: string; google: string }
> = {
  'open-sans': {
    family: 'Open Sans',
    fallback: 'sans-serif',
    google: 'Open+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  lato: {
    family: 'Lato',
    fallback: 'sans-serif',
    google: 'Lato:ital,wght@0,400;0,700;0,900;1,400',
  },
  montserrat: {
    family: 'Montserrat',
    fallback: 'sans-serif',
    google: 'Montserrat:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  nunito: {
    family: 'Nunito',
    fallback: 'sans-serif',
    google: 'Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  inter: {
    family: 'Inter',
    fallback: 'sans-serif',
    google: 'Inter:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  poppins: {
    family: 'Poppins',
    fallback: 'sans-serif',
    google: 'Poppins:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  raleway: {
    family: 'Raleway',
    fallback: 'sans-serif',
    google: 'Raleway:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  'work-sans': {
    family: 'Work Sans',
    fallback: 'sans-serif',
    google: 'Work+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  'dm-sans': {
    family: 'DM Sans',
    fallback: 'sans-serif',
    google: 'DM+Sans:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  figtree: {
    family: 'Figtree',
    fallback: 'sans-serif',
    google: 'Figtree:ital,wght@0,400;0,600;0,700;0,800;1,400',
  },
  outfit: {
    family: 'Outfit',
    fallback: 'sans-serif',
    google: 'Outfit:wght@400;600;700;800',
  },
  manrope: {
    family: 'Manrope',
    fallback: 'sans-serif',
    google: 'Manrope:wght@400;600;700;800',
  },
  playfair: {
    family: 'Playfair Display',
    fallback: 'serif',
    google: 'Playfair+Display:ital,wght@0,400;0,700;0,800;1,400',
  },
  'source-serif': {
    family: 'Source Serif 4',
    fallback: 'serif',
    google: 'Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;0,8..60,800;1,8..60,400',
  },
  merriweather: {
    family: 'Merriweather',
    fallback: 'serif',
    google: 'Merriweather:ital,opsz,wght@0,18..144,400;0,18..144,700;1,18..144,400',
  },
  lora: {
    family: 'Lora',
    fallback: 'serif',
    google: 'Lora:ital,wght@0,400;0,700;1,400',
  },
  'libre-baskerville': {
    family: 'Libre Baskerville',
    fallback: 'serif',
    google: 'Libre+Baskerville:ital,wght@0,400;0,700;1,400',
  },
  cormorant: {
    family: 'Cormorant Garamond',
    fallback: 'serif',
    google: 'Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400',
  },
  fraunces: {
    family: 'Fraunces',
    fallback: 'serif',
    google: 'Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400',
  },
  'eb-garamond': {
    family: 'EB Garamond',
    fallback: 'serif',
    google: 'EB+Garamond:ital,wght@0,400;0,600;0,700;1,400',
  },
}

export function isFontId(value: unknown): value is FontId {
  return typeof value === 'string' && (FONT_IDS as readonly string[]).includes(value)
}

export function fontStack(id: FontId) {
  const font = FONTS[id]
  return `'${font.family}', ${font.fallback}`
}

export const FONT_SELECT_OPTIONS = FONT_IDS.map((id) => ({
  label: FONTS[id].family,
  value: id,
}))

export function fontFamily(id: string) {
  return isFontId(id) ? FONTS[id].family : FONTS['open-sans'].family
}

export function googleFontsHref(primary: FontId, secondary: FontId) {
  const ids = primary === secondary ? [primary] : [primary, secondary]
  const families = ids.map((id) => `family=${FONTS[id].google}`).join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

export function googleFontsAllHref() {
  const families = FONT_IDS.map((id) => `family=${FONTS[id].google}`).join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

export function parseHex(value: unknown, fallback: string) {
  if (typeof value !== 'string') return fallback
  const v = value.trim()
  if (/^#([0-9a-fA-F]{3})$/.test(v)) {
    const [, a, b, c] = v
    return `#${a}${a}${b}${b}${c}${c}`.toLowerCase()
  }
  if (/^#([0-9a-fA-F]{6})$/.test(v)) return v.toLowerCase()
  return fallback
}

export function darkenHex(hex: string, amount = 0.35) {
  const raw = hex.replace('#', '')
  if (raw.length !== 6) return hex
  const n = (i: number) => Math.max(0, Math.round(parseInt(raw.slice(i, i + 2), 16) * (1 - amount)))
  return `#${[n(0), n(2), n(4)].map((c) => c.toString(16).padStart(2, '0')).join('')}`
}

export function themeFromSite(site: {
  colorPrimary?: string | null
  colorSecondary?: string | null
  colorFontPrimary?: string | null
  colorFontSecondary?: string | null
  fontPrimary?: string | null
  fontSecondary?: string | null
} | null) {
  const colorPrimary = parseHex(site?.colorPrimary, DEFAULT_PRIMARY)
  const colorSecondary = parseHex(site?.colorSecondary, DEFAULT_SECONDARY)
  const colorFontPrimary = parseHex(site?.colorFontPrimary, DEFAULT_FONT_COLOR)
  const colorFontSecondary = parseHex(site?.colorFontSecondary, DEFAULT_FONT_COLOR)
  const fontPrimary = isFontId(site?.fontPrimary) ? site.fontPrimary : 'open-sans'
  const fontSecondary = isFontId(site?.fontSecondary) ? site.fontSecondary : fontPrimary
  return {
    colorPrimary,
    colorSecondary,
    colorPrimaryDeep: darkenHex(colorPrimary),
    colorFontPrimary,
    colorFontSecondary,
    fontPrimary,
    fontSecondary,
    fontPrimaryStack: fontStack(fontPrimary),
    fontSecondaryStack: fontStack(fontSecondary),
    googleFontsHref: googleFontsHref(fontPrimary, fontSecondary),
  }
}

export function themeStyle(theme: ReturnType<typeof themeFromSite>): Record<string, string> {
  return {
    '--color-rose': theme.colorPrimary,
    '--color-rose-deep': theme.colorPrimaryDeep,
    '--color-sky': theme.colorSecondary,
    '--color-accent': theme.colorPrimary,
    '--color-accent-ink': theme.colorSecondary,
    '--color-font-primary': theme.colorFontPrimary,
    '--color-font-secondary': theme.colorFontSecondary,
    '--color-ink': theme.colorFontPrimary,
    '--font-sans': theme.fontPrimaryStack,
    '--font-display': theme.fontSecondaryStack,
  }
}
