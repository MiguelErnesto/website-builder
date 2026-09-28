import { getPayload } from 'payload'
import config from '@payload-config'

import type { Locale } from '@/lib/i18n'

export async function getCMS() {
  return getPayload({ config })
}

export async function getSite(locale: Locale) {
  const payload = await getCMS()
  return payload.findGlobal({
    slug: 'site',
    locale,
    depth: 3,
  })
}

export async function getPublishedProducts(locale: Locale) {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'products',
    locale,
    depth: 1,
    limit: 100,
    where: {
      _status: {
        equals: 'published',
      },
    },
    sort: 'title',
  })
  return result.docs
}

export async function getProductBySlug(slug: string, locale: Locale) {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'products',
    locale,
    depth: 1,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  return result.docs[0] ?? null
}

export async function getPageBySlug(slug: string, locale: Locale) {
  const payload = await getCMS()
  const result = await payload.find({
    collection: 'pages',
    locale,
    depth: 1,
    limit: 1,
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
  })
  return result.docs[0] ?? null
}
