import { notFound } from 'next/navigation'
import { connection } from 'next/server'

import { HomeSections } from '@/components/HomeSections'
import { getPublishedProducts, getSite } from '@/lib/cms'
import { getMessages, isLocale } from '@/lib/i18n'
import { siteCopy } from '@/lib/site-copy'
import type { Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'es'
  const t = getMessages(locale)
  try {
    const site = await getSite(locale)
    const copy = siteCopy(locale, site)
    return { title: copy.name, description: copy.metaDescription }
  } catch {
    return { title: t.siteFallback, description: t.metaDescription }
  }
}

export default async function HomePage({ params }: PageProps) {
  await connection()
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const t = getMessages(locale)
  const empty = siteCopy(locale, null)
  let copy = empty
  let items: Awaited<ReturnType<typeof getPublishedProducts>> = []

  try {
    const site = await getSite(locale)
    copy = siteCopy(locale, site)
    items = await getPublishedProducts(locale)
  } catch {
    // first boot
  }

  const featured = items.filter((item) => item.featured)
  const promo = items.filter((item) => item.promo && !item.featured)
  const rest = items.filter((item) => !item.featured && !item.promo)
  const ctaHref = '#contacto'
  const toCard = (item: (typeof items)[number]) => ({
    id: String(item.id),
    slug: String(item.slug),
    title: String(item.title ?? ''),
    price: typeof item.price === 'number' ? item.price : null,
    image: item.image as never,
    kind: typeof item.kind === 'string' ? item.kind : null,
    description: typeof item.description === 'string' ? item.description : null,
    featured: Boolean(item.featured),
    promo: Boolean(item.promo),
  })
  const carouselItems = [...featured, ...promo, ...rest].map(toCard)

  return (
    <main id="contenido">
      <HomeSections
        locale={locale}
        sections={copy.sections}
        carouselItems={carouselItems}
        ctaHref={ctaHref}
        heroEm={t.heroEm}
      />
    </main>
  )
}
