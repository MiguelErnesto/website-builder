'use client'

import { OfferCard, type OfferCardProps } from '@/components/OfferCard'
import type { Locale } from '@/lib/i18n'
import { getMessages } from '@/lib/i18n'

type FeaturedItem = Pick<
  OfferCardProps,
  'slug' | 'title' | 'price' | 'image' | 'kind' | 'description' | 'featured' | 'promo'
> & { id: string }

type FeaturedCarouselProps = {
  locale: Locale
  items: FeaturedItem[]
  featuredHref: string
  promoHref: string
  allHref: string
  sectionId?: string
  showFeatured?: boolean
  showPromo?: boolean
  showAll?: boolean
}

function FeaturedSlide({
  locale,
  item,
  index,
}: {
  locale: Locale
  item: FeaturedItem
  index: number
}) {
  return (
    <OfferCard
      locale={locale}
      slug={item.slug}
      title={item.title}
      price={item.price}
      image={item.image}
      index={index + 1}
      kind={item.kind}
      description={item.description}
      featured={item.featured}
      promo={item.promo}
      animate={false}
    />
  )
}

export function FeaturedCarousel({
  locale,
  items,
  featuredHref,
  promoHref,
  allHref,
  sectionId = 'carrusel',
  showFeatured = true,
  showPromo = true,
  showAll = true,
}: FeaturedCarouselProps) {
  const t = getMessages(locale)

  if (items.length === 0) return null

  const seconds = Math.max(24, items.length * 8)
  const showActions = showFeatured || showPromo || showAll

  return (
    <section id={sectionId} className="featured-rail" aria-label={t.seeAll}>
      <div className="featured-rail-inner">
        <div className="featured-viewport">
          <ul
            className={`featured-track${items.length > 1 ? ' featured-track--loop' : ''}`}
            style={items.length > 1 ? { animationDuration: `${seconds}s` } : undefined}
          >
            {(items.length > 1 ? [0, 1] : [0]).flatMap((copy) =>
              items.map((item, index) => (
                <FeaturedSlide
                  key={`${copy}-${item.id}`}
                  locale={locale}
                  item={item}
                  index={index}
                />
              )),
            )}
          </ul>
        </div>
      </div>
      {showActions ? (
        <div className="featured-head">
          <p className="featured-actions">
            {showFeatured ? (
              <a href={featuredHref} className="flux-btn featured-chip-btn">
                {t.seeAllFeatured}
              </a>
            ) : null}
            {showPromo ? (
              <a href={promoHref} className="flux-btn featured-chip-btn">
                {t.seePromo}
              </a>
            ) : null}
            {showAll ? (
              <a href={allHref} className="flux-btn featured-chip-btn">
                {t.seeAll}
              </a>
            ) : null}
          </p>
        </div>
      ) : null}
    </section>
  )
}
