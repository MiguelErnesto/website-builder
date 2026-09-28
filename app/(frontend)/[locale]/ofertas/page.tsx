import { notFound } from 'next/navigation'

import { HeroSearch } from '@/components/HeroSearch'
import { OfferCard } from '@/components/OfferCard'
import { getPublishedProducts, getSite } from '@/lib/cms'
import { getMessages, isLocale } from '@/lib/i18n'
import { siteCopy } from '@/lib/site-copy'
import type { Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; destacados?: string; promocion?: string }>
}

function matchesQuery(
  item: { title?: unknown; description?: unknown; slug?: unknown; kind?: unknown },
  query: string,
) {
  const q = query.toLowerCase()
  return [item.title, item.description, item.slug, item.kind].some(
    (value) => typeof value === 'string' && value.toLowerCase().includes(q),
  )
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'es'
  const t = getMessages(locale)
  const { q, destacados, promocion } = await searchParams
  const query = typeof q === 'string' ? q.trim() : ''
  const onlyFeatured = destacados === '1'
  const onlyPromo = promocion === '1'
  const heading = onlyFeatured ? t.featured : onlyPromo ? t.promo : t.allOffers
  try {
    const site = await getSite(locale)
    const copy = siteCopy(locale, site)
    return {
      title: query ? `${t.searchResults}: ${query}` : heading === t.allOffers ? t.allOffers : heading,
      description: copy.metaDescription,
    }
  } catch {
    return { title: heading, description: t.metaDescription }
  }
}

export default async function OffersPage({ params, searchParams }: PageProps) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const t = getMessages(locale)
  const { q, destacados, promocion } = await searchParams
  const query = typeof q === 'string' ? q.trim() : ''
  const onlyFeatured = destacados === '1'
  const onlyPromo = promocion === '1'
  let title = onlyFeatured ? t.featured : onlyPromo ? t.promo : t.allOffers
  let items: Awaited<ReturnType<typeof getPublishedProducts>> = []

  try {
    const site = await getSite(locale)
    if (!onlyFeatured && !onlyPromo) title = siteCopy(locale, site).offeringsTitle
    items = await getPublishedProducts(locale)
  } catch {
    // first boot
  }

  const pool = onlyFeatured
    ? items.filter((item) => item.featured)
    : onlyPromo
      ? items.filter((item) => item.promo)
      : items
  const shown = query ? pool.filter((item) => matchesQuery(item, query)) : pool

  return (
    <main id="contenido" className="offer offer-page">
      <div className="offer-header">
        <h1 className="offer-title">{query ? t.searchResults : title}</h1>
        <p className="offer-lead">
          {query ? `“${query}”` : onlyFeatured ? t.featured : onlyPromo ? t.promo : t.offerLead}
        </p>
        <HeroSearch locale={locale} defaultValue={query} />
      </div>
      {shown.length === 0 ? (
        <p className="empty-note">{query ? t.searchEmpty : t.empty}</p>
      ) : (
        <ul className="offer-grid">
          {shown.map((item, index) => (
            <OfferCard
              key={String(item.id)}
              locale={locale}
              slug={String(item.slug)}
              title={String(item.title ?? '')}
              price={typeof item.price === 'number' ? item.price : null}
              image={item.image as never}
              index={index + 1}
              kind={typeof item.kind === 'string' ? item.kind : null}
              description={typeof item.description === 'string' ? item.description : null}
              featured={Boolean(item.featured)}
              promo={Boolean(item.promo)}
            />
          ))}
        </ul>
      )}
    </main>
  )
}
