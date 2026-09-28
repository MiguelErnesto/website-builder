import es from '@/messages/es.json'
import en from '@/messages/en.json'

export const locales = ['es', 'en'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'es'

const dictionaries = { es, en }

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getMessages(locale: string) {
  return isLocale(locale) ? dictionaries[locale] : dictionaries[defaultLocale]
}

export function formatPrice(value: number, locale: string) {
  return new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'es-ES', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export const offerKinds = ['product', 'service', 'good', 'craft', 'course', 'other'] as const
export type OfferKind = (typeof offerKinds)[number]

export function isOfferKind(value: unknown): value is OfferKind {
  return typeof value === 'string' && offerKinds.includes(value as OfferKind)
}

export function kindLabel(kind: unknown, locale: string) {
  if (!isOfferKind(kind)) return null
  return getMessages(locale).kinds[kind]
}

export function excerpt(text: string, max = 140) {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).trimEnd()}…`
}
