import { getMessages, type Locale } from '@/lib/i18n'
import { DEFAULT_LOGO_SRC, mediaUrl } from '@/lib/media'
import { firstCarouselTitle, readHomeSections } from '@/lib/sections'
import { themeFromSite } from '@/lib/theme'

const STALE_NAME = new Set(['Catálogo', 'Catalog'])
const STALE_NAV_CTA = new Set(['Hablemos', 'Talk to us', 'Talk To Us'])

function pick(value: unknown, fallback: string, stale?: Set<string>) {
  if (typeof value !== 'string') return fallback
  const v = value.trim()
  if (!v || stale?.has(v)) return fallback
  return v
}

function flag(value: unknown, fallback = true) {
  return typeof value === 'boolean' ? value : fallback
}

export type NavItem = {
  href: string
  label: string
}

export type SiteFields = {
  name?: string | null
  logo?: unknown
  logoText?: string | null
  showLogo?: boolean | null
  showLogoText?: boolean | null
  metaDescription?: string | null
  contactEmail?: string | null
  instagram?: string | null
  facebook?: string | null
  twitter?: string | null
  youtube?: string | null
  tiktok?: string | null
  linkedin?: string | null
  whatsapp?: string | null
  pinterest?: string | null
  colorPrimary?: string | null
  colorSecondary?: string | null
  colorFontPrimary?: string | null
  colorFontSecondary?: string | null
  fontPrimary?: string | null
  fontSecondary?: string | null
  navCta?: string | null
  showNav?: boolean | null
  showNavCta?: boolean | null
  showLangSwitch?: boolean | null
  navItems?: unknown
  sections?: unknown
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
} | null

function isCarouselHref(href: string) {
  return /#carrusel(?:$|[/?#])/.test(href)
}

function isContactNav(href: string, label: string) {
  return /#contacto(?:$|[/?#])/.test(href) && /^(contact|contacto)$/i.test(label.trim())
}

function isOfferingsNav(href: string, label: string) {
  return isCarouselHref(href) || /^(offerings|oferta|ofertas)$/i.test(label.trim())
}

function defaultNav(locale: Locale): NavItem[] {
  const t = getMessages(locale)
  const home = `/${locale}`
  return [
    { href: `${home}#nosotros`, label: t.about },
    { href: `${home}#faq`, label: t.faq },
  ]
}

function readNav(rows: unknown, locale: Locale): NavItem[] {
  if (!Array.isArray(rows) || rows.length === 0) return defaultNav(locale)
  const out: NavItem[] = []
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const rec = row as Record<string, unknown>
    if (flag(rec.visible) === false) continue
    const label = typeof rec.label === 'string' ? rec.label.trim() : ''
    const href = typeof rec.href === 'string' ? rec.href.trim() : ''
    if (!label || !href || isCarouselHref(href) || isContactNav(href, label) || isOfferingsNav(href, label)) continue
    out.push({ label, href })
  }
  return out.length ? out : defaultNav(locale)
}

export function siteCopy(locale: Locale, site: SiteFields) {
  const t = getMessages(locale)
  const name = pick(site?.name, t.siteFallback, STALE_NAME)
  const sections = readHomeSections(site, locale)
  return {
    name,
    logoText: pick(site?.logoText, name),
    logoUrl: mediaUrl(site?.logo) || DEFAULT_LOGO_SRC,
    metaDescription: pick(site?.metaDescription, t.metaDescription),
    navCta: pick(site?.navCta, t.navCta, STALE_NAV_CTA),
    email: pick(site?.contactEmail, ''),
    instagram: pick(site?.instagram, ''),
    facebook: pick(site?.facebook, ''),
    twitter: pick(site?.twitter, ''),
    youtube: pick(site?.youtube, ''),
    tiktok: pick(site?.tiktok, ''),
    linkedin: pick(site?.linkedin, ''),
    whatsapp: pick(site?.whatsapp, ''),
    pinterest: pick(site?.pinterest, ''),
    navItems: [
      ...readNav(site?.navItems, locale),
      ...sections.flatMap((section) => {
        if (section.type !== 'extra' || !section.showInMenu || !section.title.trim()) return []
        return [{ href: `/${locale}#${section.id}`, label: section.title.trim() }]
      }),
    ],
    offeringsTitle: firstCarouselTitle(sections, t.offer),
    sections,
    theme: themeFromSite(site),
    show: {
      logo: flag(site?.showLogo),
      logoText: flag(site?.showLogoText),
      nav: flag(site?.showNav),
      navCta: flag(site?.showNavCta),
      langSwitch: flag(site?.showLangSwitch),
    },
  }
}

export type SiteCopy = ReturnType<typeof siteCopy>

export { mediaUrl } from '@/lib/media'

export const FEATURED_LIMIT = 6
