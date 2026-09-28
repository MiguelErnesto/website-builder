import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FadeUp } from '@/components/FadeUp'
import { getProductBySlug } from '@/lib/cms'
import { formatPrice, getMessages, isLocale, kindLabel } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) return { title: getMessages('es').siteFallback }
  const item = await getProductBySlug(slug, raw).catch(() => null)
  if (!item) {
    return { title: getMessages(raw).notFound }
  }
  const desc = typeof item.description === 'string' ? item.description : ''
  return { title: String(item.title), description: desc.slice(0, 160) }
}

export default async function OfferPage({ params }: PageProps) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const t = getMessages(locale)

  const item = await getProductBySlug(slug, locale).catch(() => null)
  if (!item) notFound()

  const image = typeof item.image === 'object' && item.image !== null ? item.image : null
  const src = image && 'url' in image ? image.url : null
  const alt =
    (image && 'alt' in image && typeof image.alt === 'string' && image.alt) || String(item.title)
  const type = kindLabel(item.kind, locale)
  const price = typeof item.price === 'number' ? item.price : 0

  return (
    <main id="contenido">
      <article className="offer-split">
        <div className="offer-visual">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} />
          ) : (
            <div className="offer-ph" aria-hidden="true">
              {t.itemImage}
            </div>
          )}
        </div>
        <div className="offer-info">
          <FadeUp>
            <p className="offer-badge">{type ?? t.offer}</p>
            <h1 className="offer-name">{String(item.title)}</h1>
            {price > 0 ? (
              <p className="offer-price">
                <span className="sr-only">{t.price}: </span>
                {formatPrice(price, locale)}
              </p>
            ) : null}
            {item.description ? <p className="offer-desc">{String(item.description)}</p> : null}
            <Link href={`/${locale}/ofertas`} className="flux-btn">
              {t.back}
            </Link>
          </FadeUp>
        </div>
      </article>
    </main>
  )
}
