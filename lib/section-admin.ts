import { PAGE_BLOCKS } from '@/globals/section-blocks'
import { mediaThumb } from '@/lib/media'

export const SECTION_TYPE_LABEL: Record<string, { es: string; en: string }> = {
  hero: { es: 'Principal', en: 'Main' },
  carousel: { es: 'Carrusel', en: 'Carousel' },
  about: { es: 'Nosotros', en: 'About' },
  faq: { es: 'FAQ', en: 'FAQ' },
  talkToUs: { es: 'Contáctenos', en: 'Contact us' },
  extra: { es: 'Sección', en: 'Section' },
}

export function sectionTypeLabel(type: string, en: boolean) {
  const row = SECTION_TYPE_LABEL[type]
  if (!row) return type
  return en ? row.en : row.es
}

export function fieldsForSection(type: string) {
  return PAGE_BLOCKS.find((block) => block.slug === type)?.fields || []
}

export function fieldLabel(label: unknown, en: boolean) {
  if (typeof label === 'string') return label
  if (label && typeof label === 'object') {
    const rec = label as { es?: string; en?: string }
    return (en ? rec.en || rec.es : rec.es || rec.en) || ''
  }
  return ''
}

function asId(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && /^\d+$/.test(value)) return Number(value)
  return value ?? null
}

export function toRelId(value: unknown) {
  if (value && typeof value === 'object' && 'id' in value) return asId((value as { id: unknown }).id)
  return asId(value)
}

export function serializeSection(block: Record<string, unknown>) {
  const out: Record<string, unknown> = { ...block }
  if ('cardsPerRow' in out) {
    const count = Math.floor(Number(out.cardsPerRow))
    out.cardsPerRow = Number.isFinite(count) && count >= 1 ? count : 3
  }
  for (const key of ['image', 'ctaPage', 'buttonPage']) {
    if (key in out) out[key] = toRelId(out[key])
  }
  for (const key of ['slides', 'cards', 'faqs']) {
    const list = out[key]
    if (!Array.isArray(list)) continue
    out[key] = list.map((row) => {
      if (!row || typeof row !== 'object') return row
      const rec = { ...(row as Record<string, unknown>) }
      if ('image' in rec) rec.image = toRelId(rec.image)
      if ('buttonPage' in rec) rec.buttonPage = toRelId(rec.buttonPage)
      if ('ctaPage' in rec) rec.ctaPage = toRelId(rec.ctaPage)
      return rec
    })
  }
  return out
}

export function sectionTitle(data: Record<string, unknown>, en: boolean) {
  if (typeof data.title === 'string' && data.title.trim()) return data.title.trim()
  if (typeof data.subtitle === 'string' && data.subtitle.trim()) return data.subtitle.trim()
  return sectionTypeLabel(typeof data.blockType === 'string' ? data.blockType : '', en)
}

export function sectionText(data: Record<string, unknown>) {
  for (const key of ['lead', 'text', 'subtitle']) {
    const value = data[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  const faqs = data.faqs
  if (Array.isArray(faqs) && faqs[0] && typeof faqs[0] === 'object') {
    const question = (faqs[0] as { question?: unknown }).question
    if (typeof question === 'string' && question.trim()) return question.trim()
  }
  return ''
}

export function sectionImage(data: Record<string, unknown>) {
  const direct = mediaThumb(data.image)
  if (direct) return direct
  for (const key of ['slides', 'cards']) {
    const list = data[key]
    if (!Array.isArray(list)) continue
    for (const row of list) {
      if (!row || typeof row !== 'object') continue
      const src = mediaThumb((row as { image?: unknown }).image)
      if (src) return src
    }
  }
  return null
}
