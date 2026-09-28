import { getMessages, type Locale } from '@/lib/i18n'
import { mediaUrl } from '@/lib/media'

function flag(value: unknown, fallback = true) {
  return typeof value === 'boolean' ? value : fallback
}

function pick(value: unknown, fallback = '') {
  if (typeof value !== 'string') return fallback
  const v = value.trim()
  return v || fallback
}

function align(value: unknown, allowed: readonly string[], fallback: string) {
  return typeof value === 'string' && allowed.includes(value) ? value : fallback
}

function rows<T extends Record<string, string>>(
  list: unknown,
  keys: (keyof T)[],
  fallback: T[] = [],
): T[] {
  if (!Array.isArray(list) || list.length === 0) return fallback
  const out: T[] = []
  for (const row of list) {
    if (!row || typeof row !== 'object') continue
    const rec = row as Record<string, unknown>
    const item = {} as T
    let ok = true
    for (const key of keys) {
      const v = rec[String(key)]
      if (typeof v !== 'string' || !v.trim()) {
        ok = false
        break
      }
      item[key] = v.trim() as T[typeof key]
    }
    if (ok) out.push(item)
  }
  return out.length ? out : fallback
}

function pageHref(locale: Locale, value: unknown): string | null {
  if (!value || typeof value !== 'object') return null
  const rec = value as Record<string, unknown>
  const slug = typeof rec.slug === 'string' ? rec.slug.trim() : ''
  if (!slug) return null
  return `/${locale}/paginas/${slug}`
}

function uniqueId(base: string, used: Map<string, number>) {
  const n = (used.get(base) ?? 0) + 1
  used.set(base, n)
  return n === 1 ? base : `${base}-${n}`
}

export type FaqItem = { question: string; answer: string }

export type HeroSlide = {
  image: string
  text: string
  textX: 'left' | 'center' | 'right'
  textY: 'top' | 'center' | 'bottom'
}

export type AboutCard = {
  image: string | null
  title: string
  text: string
}

export type ExtraCard = {
  image: string | null
  showImage: boolean
  imageAlign: 'left' | 'center' | 'right'
  imageAlignY: 'top' | 'center' | 'bottom'
  subtitle: string
  showSubtitle: boolean
  text: string
  textAlign: 'left' | 'center' | 'right'
  showText: boolean
  footer: string
  showFooter: boolean
  buttonLabel: string
  buttonHref: string | null
  buttonAlign: 'left' | 'center' | 'right'
  showButton: boolean
}

export type HomeSection =
  | {
      type: 'hero'
      id: string
      title: string
      lead: string
      cta: string
      ctaHref: string
      searchPlaceholder: string
      image: string | null
      slides: HeroSlide[]
      showTitle: boolean
      showLead: boolean
      showCta: boolean
      showSearch: boolean
      showImage: boolean
    }
  | {
      type: 'carousel'
      id: string
      title: string
      lead: string
      showTitle: boolean
      showLead: boolean
      showFeatured: boolean
      showPromo: boolean
      showAll: boolean
    }
  | {
      type: 'about'
      id: string
      title: string
      text: string
      image: string | null
      cards: AboutCard[]
      circleImages: boolean
      showTitle: boolean
    }
  | { type: 'faq'; id: string; title: string; faqs: FaqItem[]; showTitle: boolean }
  | {
      type: 'talkToUs'
      id: string
      title: string
      text: string
      button: string
      showTitle: boolean
      showText: boolean
      showButton: boolean
    }
  | {
      type: 'extra'
      id: string
      title: string
      showTitle: boolean
      showInMenu: boolean
      layout: 'media' | 'cards'
      cardsPerRow: number
      image: string | null
      showImage: boolean
      imageAlign: 'left' | 'right'
      subtitle: string
      showSubtitle: boolean
      text: string
      showText: boolean
      buttonLabel: string
      buttonHref: string | null
      showButton: boolean
      cards: ExtraCard[]
    }

type SiteLike = {
  heroTitle?: string | null
  heroLead?: string | null
  heroCta?: string | null
  heroImage?: unknown
  showHeroTitle?: boolean | null
  showHeroLead?: boolean | null
  showHeroCta?: boolean | null
  showHeroSearch?: boolean | null
  showHeroImage?: boolean | null
  offeringsTitle?: string | null
  offeringsLead?: string | null
  aboutTitle?: string | null
  aboutText?: string | null
  aboutImage?: unknown
  faqTitle?: string | null
  faqs?: unknown
  ctaTitle?: string | null
  ctaText?: string | null
  ctaButton?: string | null
  sections?: unknown
} | null

const NEW_TYPES = new Set(['hero', 'carousel', 'about', 'faq', 'talkToUs', 'extra'])
const OLD_TYPES = new Set(['oferta', 'valor', 'confianza', 'nosotros', 'faqCierre'])

export function needsDefaultSections(sections: unknown) {
  if (!Array.isArray(sections) || sections.length === 0) return true
  const types = sections
    .map((row) =>
      row && typeof row === 'object' && 'blockType' in row ? String(row.blockType) : '',
    )
    .filter(Boolean)
  if (types.length === 0) return true
  const hasNew = types.some((type) => NEW_TYPES.has(type))
  const onlyOld = types.every((type) => OLD_TYPES.has(type) || type === 'extra')
  return !hasNew && onlyOld
}

export function defaultHomeSections(locale: Locale): HomeSection[] {
  const t = getMessages(locale)
  return [
    {
      type: 'hero',
      id: 'hero',
      title: t.heroFallback,
      lead: t.heroLead,
      cta: t.ctaFallback,
      ctaHref: '#nosotros',
      searchPlaceholder: t.searchPlaceholder,
      image: '/new-vision/hero.jpg',
      slides: [{ image: '/new-vision/hero.jpg', text: '', textX: 'center', textY: 'center' }],
      showTitle: true,
      showLead: true,
      showCta: true,
      showSearch: true,
      showImage: true,
    },
    {
      type: 'about',
      id: 'nosotros',
      title: t.aboutTitle,
      text: t.aboutText,
      image: null,
      cards: [],
      circleImages: false,
      showTitle: true,
    },
    { type: 'faq', id: 'faq', title: t.faqTitle, faqs: t.faqs, showTitle: true },
    {
      type: 'talkToUs',
      id: 'contacto',
      title: t.ctaTitle,
      text: t.ctaText,
      button: t.ctaButton,
      showTitle: true,
      showText: true,
      showButton: true,
    },
  ]
}

export function seedSectionBlocks(locale: Locale, site: SiteLike = null) {
  const t = getMessages(locale)
  return [
    {
      blockType: 'hero' as const,
      title: pick(site?.heroTitle, t.heroFallback),
      lead: pick(site?.heroLead, t.heroLead),
      cta: pick(site?.heroCta, t.ctaFallback),
      showTitle: flag(site?.showHeroTitle),
      showLead: flag(site?.showHeroLead),
      showCta: flag(site?.showHeroCta),
      showSearch: flag(site?.showHeroSearch),
      showImage: flag(site?.showHeroImage),
      visible: true,
    },
    {
      blockType: 'about' as const,
      title: pick(site?.aboutTitle, t.aboutTitle),
      text: pick(site?.aboutText, t.aboutText),
      showTitle: true,
      visible: true,
    },
    {
      blockType: 'faq' as const,
      title: pick(site?.faqTitle, t.faqTitle),
      faqs: Array.isArray(site?.faqs) && site.faqs.length > 0
        ? site.faqs
        : t.faqs.map((item) => ({ question: item.question, answer: item.answer })),
      showTitle: true,
      visible: true,
    },
    {
      blockType: 'talkToUs' as const,
      title: pick(site?.ctaTitle, t.ctaTitle),
      text: pick(site?.ctaText, t.ctaText),
      button: pick(site?.ctaButton, t.ctaButton),
      showTitle: true,
      showText: true,
      showButton: true,
      visible: true,
    },
  ]
}

function heroCtaHref(locale: Locale, row: Record<string, unknown>) {
  const custom = pick(row.ctaHref)
  if (custom) {
    if (custom.startsWith('#') || custom.startsWith('/') || /^https?:\/\//i.test(custom)) return custom
    return `#${custom}`
  }
  return pageHref(locale, row.ctaPage) || '#nosotros'
}

function parseSlides(list: unknown, fallback: string | null): HeroSlide[] {
  const out: HeroSlide[] = []
  if (Array.isArray(list)) {
    for (const item of list) {
      if (!item || typeof item !== 'object') continue
      const rec = item as Record<string, unknown>
      const image = mediaUrl(rec.image)
      if (!image) continue
      out.push({
        image,
        text: pick(rec.text),
        textX: align(rec.textX, ['left', 'center', 'right'], 'center') as HeroSlide['textX'],
        textY: align(rec.textY, ['top', 'center', 'bottom'], 'center') as HeroSlide['textY'],
      })
    }
  }
  if (out.length) return out
  if (fallback) return [{ image: fallback, text: '', textX: 'center', textY: 'center' }]
  return [{ image: '/new-vision/hero.jpg', text: '', textX: 'center', textY: 'center' }]
}

function parseAboutCards(list: unknown, fallback: string | null): AboutCard[] {
  const out: AboutCard[] = []
  if (Array.isArray(list)) {
    for (const item of list) {
      if (!item || typeof item !== 'object') continue
      const rec = item as Record<string, unknown>
      const image = mediaUrl(rec.image)
      const title = pick(rec.title)
      const text = pick(rec.text)
      if (!image && !title && !text) continue
      out.push({ image, title, text })
    }
  }
  if (out.length) return out
  if (fallback) return [{ image: fallback, title: '', text: '' }]
  return []
}

function parseCard(row: Record<string, unknown>, locale: Locale): ExtraCard | null {
  if (flag(row.visible) === false) return null
  const subtitle = pick(row.subtitle)
  const text = pick(row.text)
  const footer = pick(row.footer)
  const buttonLabel = pick(row.buttonLabel)
  const image = mediaUrl(row.image)
  const buttonHref = pageHref(locale, row.buttonPage)
  if (!subtitle && !text && !footer && !buttonLabel && !image) return null
  return {
    image,
    showImage: flag(row.showImage),
    imageAlign: align(row.imageAlign, ['left', 'center', 'right'], 'left') as ExtraCard['imageAlign'],
    imageAlignY: align(row.imageAlignY, ['top', 'center', 'bottom'], 'center') as ExtraCard['imageAlignY'],
    subtitle,
    showSubtitle: flag(row.showSubtitle),
    text,
    textAlign: align(row.textAlign, ['left', 'center', 'right'], 'left') as ExtraCard['textAlign'],
    showText: flag(row.showText),
    footer,
    showFooter: flag(row.showFooter),
    buttonLabel,
    buttonHref,
    buttonAlign: align(row.buttonAlign, ['left', 'center', 'right'], 'left') as ExtraCard['buttonAlign'],
    showButton: flag(row.showButton),
  }
}

function parseBlock(
  row: Record<string, unknown>,
  index: number,
  used: Map<string, number>,
  locale: Locale,
): HomeSection | null {
  if (flag(row.visible) === false) return null
  const type = typeof row.blockType === 'string' ? row.blockType : ''
  const rawId = typeof row.id === 'string' ? row.id : `s-${index}`
  const base =
    type === 'hero'
      ? 'hero'
      : type === 'carousel'
        ? 'carrusel'
        : type === 'about'
          ? 'nosotros'
          : type === 'faq'
            ? 'faq'
            : type === 'talkToUs'
              ? 'contacto'
              : rawId
  const id = uniqueId(base, used)

  if (type === 'hero') {
    const showTitle = flag(row.showTitle)
    const showLead = flag(row.showLead)
    const showCta = flag(row.showCta)
    const showSearch = flag(row.showSearch)
    const showImage = flag(row.showImage)
    if (!showTitle && !showLead && !showCta && !showSearch && !showImage) return null
    const image = mediaUrl(row.image)
    return {
      type: 'hero',
      id,
      title: pick(row.title),
      lead: pick(row.lead),
      cta: pick(row.cta),
      ctaHref: heroCtaHref(locale, row),
      searchPlaceholder: pick(row.searchPlaceholder),
      image: image ?? '/new-vision/hero.jpg',
      slides: parseSlides(row.slides, image),
      showTitle,
      showLead,
      showCta,
      showSearch,
      showImage,
    }
  }
  if (type === 'carousel') {
    return {
      type: 'carousel',
      id,
      title: pick(row.title),
      lead: pick(row.lead),
      showTitle: flag(row.showTitle, false),
      showLead: flag(row.showLead, false),
      showFeatured: flag(row.showFeatured),
      showPromo: flag(row.showPromo),
      showAll: flag(row.showAll),
    }
  }
  if (type === 'about') {
    const image = mediaUrl(row.image)
    return {
      type: 'about',
      id,
      title: pick(row.title),
      text: pick(row.text),
      image,
      cards: parseAboutCards(row.cards, image),
      circleImages: flag(row.circleImages, false),
      showTitle: flag(row.showTitle),
    }
  }
  if (type === 'faq') {
    return {
      type: 'faq',
      id,
      title: pick(row.title),
      faqs: rows(row.faqs, ['question', 'answer']),
      showTitle: flag(row.showTitle),
    }
  }
  if (type === 'talkToUs') {
    return {
      type: 'talkToUs',
      id,
      title: pick(row.title),
      text: pick(row.text),
      button: pick(row.button),
      showTitle: flag(row.showTitle),
      showText: flag(row.showText),
      showButton: flag(row.showButton),
    }
  }
  if (type === 'extra') {
    const layout = row.layout === 'cards' ? 'cards' : 'media'
    const cards: ExtraCard[] = []
    if (layout === 'cards' && Array.isArray(row.cards)) {
      for (const item of row.cards) {
        if (!item || typeof item !== 'object') continue
        const card = parseCard(item as Record<string, unknown>, locale)
        if (card) cards.push(card)
      }
    }
    const buttonHref = flag(row.showButton) ? pageHref(locale, row.buttonPage) : null
    const perRow = Math.floor(Number(row.cardsPerRow))
    return {
      type: 'extra',
      id,
      title: pick(row.title),
      showTitle: flag(row.showTitle),
      showInMenu: flag(row.showInMenu, false),
      layout,
      cardsPerRow: Number.isFinite(perRow) && perRow >= 1 ? perRow : 3,
      image: flag(row.showImage) ? mediaUrl(row.image) : null,
      showImage: flag(row.showImage),
      imageAlign: align(row.imageAlign, ['left', 'right'], 'left') as 'left' | 'right',
      subtitle: pick(row.subtitle),
      showSubtitle: flag(row.showSubtitle),
      text: pick(row.text),
      showText: flag(row.showText),
      buttonLabel: pick(row.buttonLabel),
      buttonHref,
      showButton: flag(row.showButton) && Boolean(buttonHref),
      cards,
    }
  }
  return null
}

export function readHomeSections(site: SiteLike, locale: Locale): HomeSection[] {
  if (Array.isArray(site?.sections) && site.sections.length > 0 && !needsDefaultSections(site.sections)) {
    const used = new Map<string, number>()
    const out: HomeSection[] = []
    site.sections.forEach((row, index) => {
      if (!row || typeof row !== 'object') return
      const parsed = parseBlock(row as Record<string, unknown>, index, used, locale)
      if (parsed) out.push(parsed)
    })
    return out.length ? out : defaultHomeSections(locale)
  }
  return defaultHomeSections(locale)
}

export function firstCarouselTitle(sections: HomeSection[], fallback: string) {
  const carousel = sections.find((s) => s.type === 'carousel')
  return carousel && carousel.title ? carousel.title : fallback
}
