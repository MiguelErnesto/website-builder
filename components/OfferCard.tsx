import Link from 'next/link'

import { FadeUp } from '@/components/FadeUp'
import type { Locale } from '@/lib/i18n'
import { excerpt, formatPrice, getMessages } from '@/lib/i18n'

type MediaValue = {
  url?: string | null
  alt?: string | null
} | number | string | null

export type OfferCardProps = {
  locale: Locale
  slug: string
  title: string
  price?: number | null
  image: MediaValue
  index: number
  kind?: string | null
  description?: string | null
  featured?: boolean
  promo?: boolean
  animate?: boolean
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function OfferCard({
  locale,
  slug,
  title,
  price,
  image,
  index,
  description,
  featured = false,
  promo = false,
  animate = true,
}: OfferCardProps) {
  const t = getMessages(locale)
  const media = typeof image === 'object' && image !== null ? image : null
  const src = media?.url ?? null
  const alt = media?.alt || title
  const showPrice = typeof price === 'number' && price > 0
  const summary = description ? excerpt(description) : null

  const body = (
    <article>
      <span className="flux-card-no" aria-hidden="true">
        {pad(index)}
      </span>
      <Link href={`/${locale}/ofertas/${slug}`}>
        <div className="flux-card-visual">
          {featured ? (
            <span className="flux-card-tag flux-card-tag--featured">
              <span aria-hidden="true">★</span> {t.featuredTag}
            </span>
          ) : null}
          {promo ? <span className="flux-card-tag flux-card-tag--promo">{t.promoTag}</span> : null}
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} />
          ) : (
            <div className="flux-card-ph" aria-hidden="true">
              {t.itemImage}
            </div>
          )}
        </div>
        <div className="flux-card-meta">
          <h3 className="flux-card-name">{title}</h3>
          {summary ? <p className="flux-card-excerpt">{summary}</p> : null}
          {showPrice ? (
            <p className="flux-card-price">
              <span className="sr-only">{t.price}: </span>
              {formatPrice(price, locale)}
            </p>
          ) : null}
          <span className="flux-chip">{t.more}</span>
        </div>
      </Link>
    </article>
  )

  return <li className="flux-card">{animate ? <FadeUp>{body}</FadeUp> : body}</li>
}
