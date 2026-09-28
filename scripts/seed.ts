import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import type { Payload } from 'payload'
import sharp from 'sharp'

import { SEED_ADMIN, SEED_PRODUCTS, SEED_SITE, type SeedProduct } from './seed-catalog'
import { SEED_PHOTO_FALLBACK, SEED_PHOTOS } from './seed-photos'
import { needsDefaultSections, seedSectionBlocks } from '@/lib/sections'
import { getMessages } from '@/lib/i18n'

let seedLock: Promise<void> | null = null

export async function seedCatalog(payload: Payload) {
  if (seedLock) return seedLock
  seedLock = runSeed(payload).finally(() => {
    seedLock = null
  })
  return seedLock
}

async function runSeed(payload: Payload) {
  await seedAdmin(payload)
  await seedSite(payload)
  await collapseSiteSections(payload)
  await seedFunnel(payload)
  await removeOfferingsCarousel(payload)
  await removeDefaultCarousel(payload)
  await seedProducts(payload)
  await seedRealImages(payload)
  await seedFeatured(payload)
  await seedPromo(payload)
}

async function seedAdmin(payload: Payload) {
  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: SEED_ADMIN.email } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) {
    payload.logger.info(`[seed] admin ${SEED_ADMIN.email} ya existe`)
    return
  }

  await payload.create({
    collection: 'users',
    overrideAccess: true,
    data: {
      email: SEED_ADMIN.email,
      password: SEED_ADMIN.password,
    },
  })
  payload.logger.info(`[seed] admin ${SEED_ADMIN.email}`)
}

async function seedSite(payload: Payload) {
  const site = await payload.findGlobal({
    slug: 'site',
    locale: 'es',
    overrideAccess: true,
  })
  const name = typeof site?.name === 'string' ? site.name.trim() : ''
  if (name && name !== 'Catálogo') {
    return
  }

  await payload.updateGlobal({
    slug: 'site',
    locale: 'es',
    overrideAccess: true,
    data: {
      name: SEED_SITE.name.es,
      metaDescription:
        'Promoción de productos, servicios, oficios y cursos. Oferta clara, prueba social y un siguiente paso.',
    },
  })
  await payload.updateGlobal({
    slug: 'site',
    locale: 'en',
    overrideAccess: true,
    data: {
      name: SEED_SITE.name.en,
      metaDescription:
        'Promote products, services, crafts or courses. A clear offer, social proof, and a next step.',
    },
  })
  payload.logger.info('[seed] global Sitio')
}

async function collapseSiteSections(payload: Payload) {
  const site = await payload.findGlobal({
    slug: 'site',
    locale: 'es',
    depth: 0,
    overrideAccess: true,
  })
  const ids = new Set(
    (Array.isArray(site?.sections) ? site.sections : [])
      .map((row) =>
        row && typeof row === 'object' && 'id' in row ? String((row as { id: unknown }).id) : '',
      )
      .filter(Boolean),
  )
  if (ids.size === 0) return

  const prefs = await payload.find({
    collection: 'payload-preferences',
    where: { key: { equals: 'global-site' } },
    limit: 50,
    overrideAccess: true,
  })

  for (const doc of prefs.docs) {
    const value =
      doc.value && typeof doc.value === 'object' ? { ...(doc.value as Record<string, unknown>) } : {}
    const fields =
      value.fields && typeof value.fields === 'object'
        ? { ...(value.fields as Record<string, unknown>) }
        : {}
    const sections =
      fields.sections && typeof fields.sections === 'object'
        ? { ...(fields.sections as Record<string, unknown>) }
        : {}
    const collapsed = Array.isArray(sections.collapsed)
      ? sections.collapsed.map((id) => String(id))
      : []
    const stale = collapsed.some((id) => !ids.has(id))
    if (!stale) continue

    await payload.update({
      collection: 'payload-preferences',
      id: doc.id,
      overrideAccess: true,
      data: {
        value: {
          ...value,
          fields: {
            ...fields,
            sections: { ...sections, collapsed: [...ids] },
          },
        },
      },
    })
  }
}

function mediaId(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (value && typeof value === 'object' && 'id' in value && typeof value.id === 'number') {
    return value.id
  }
  return undefined
}

function blockOf(sections: unknown, type: string) {
  if (!Array.isArray(sections)) return null
  for (const row of sections) {
    if (row && typeof row === 'object' && 'blockType' in row && row.blockType === type) {
      return row as Record<string, unknown>
    }
  }
  return null
}

function seedHomeBlocks(site: { sections?: unknown } | null, locale: 'es' | 'en') {
  const defaults = seedSectionBlocks(locale, site as never)
  const nosotros = blockOf(site?.sections, 'nosotros')
  const cierre = blockOf(site?.sections, 'faqCierre')
  const hero = defaults[0]
  const about = defaults[1]
  const faq = defaults[2]
  const talk = defaults[3]
  return [
    {
      ...hero,
      title: locale === 'es' ? SEED_SITE.heroTitle.es : SEED_SITE.heroTitle.en,
      lead: locale === 'es' ? SEED_SITE.heroLead.es : SEED_SITE.heroLead.en,
      cta: locale === 'es' ? SEED_SITE.heroCta.es : SEED_SITE.heroCta.en,
    },
    {
      ...about,
      title: typeof nosotros?.title === 'string' ? nosotros.title : about.title,
      text: typeof nosotros?.text === 'string' ? nosotros.text : about.text,
      image: mediaId(nosotros?.image),
    },
    {
      ...faq,
      title: typeof cierre?.faqTitle === 'string' ? cierre.faqTitle : faq.title,
      faqs: Array.isArray(cierre?.faqs) && cierre.faqs.length > 0 ? cierre.faqs : faq.faqs,
    },
    {
      ...talk,
      title: typeof cierre?.ctaTitle === 'string' ? cierre.ctaTitle : talk.title,
      text: typeof cierre?.ctaText === 'string' ? cierre.ctaText : talk.text,
      button: typeof cierre?.ctaButton === 'string' ? cierre.ctaButton : talk.button,
    },
  ]
}

function rowId(row: unknown) {
  if (row && typeof row === 'object' && 'id' in row && row.id != null) return String(row.id)
  return undefined
}

function withNestedIds(blocks: Record<string, unknown>[], saved: unknown) {
  if (!Array.isArray(saved)) return blocks
  return blocks.map((block, index) => {
    const prev = saved[index]
    const id = rowId(prev)
    const next = { ...block, ...(id ? { id } : {}) }
    if (
      next.blockType === 'faq' &&
      prev &&
      typeof prev === 'object' &&
      'faqs' in prev &&
      Array.isArray(prev.faqs) &&
      Array.isArray(next.faqs)
    ) {
      next.faqs = (next.faqs as unknown[]).map((faq, faqIndex) => {
        const faqId = rowId(prev.faqs[faqIndex])
        return {
          ...(faq && typeof faq === 'object' ? faq : {}),
          ...(faqId ? { id: faqId } : {}),
        }
      })
    }
    return next
  })
}

async function seedFunnel(payload: Payload) {
  const esSite = await payload.findGlobal({
    slug: 'site',
    locale: 'es',
    overrideAccess: true,
    depth: 2,
  })
  if (!needsDefaultSections(esSite?.sections)) {
    await repairFaqEs(payload, esSite)
    return
  }

  const enSite = await payload.findGlobal({
    slug: 'site',
    locale: 'en',
    overrideAccess: true,
    depth: 1,
  })

  const esBlocks = seedHomeBlocks(esSite as never, 'es')
  await payload.updateGlobal({
    slug: 'site',
    locale: 'es',
    overrideAccess: true,
    data: {
      metaDescription:
        typeof esSite?.metaDescription === 'string' && esSite.metaDescription.trim()
          ? esSite.metaDescription
          : 'Promoción de productos, servicios, oficios y cursos. Oferta clara, prueba social y un siguiente paso.',
      sections: esBlocks as never,
    },
  })

  const saved = await payload.findGlobal({
    slug: 'site',
    locale: 'es',
    overrideAccess: true,
    depth: 2,
  })
  const enBlocks = withNestedIds(seedHomeBlocks(enSite as never, 'en'), saved?.sections)
  await payload.updateGlobal({
    slug: 'site',
    locale: 'en',
    overrideAccess: true,
    data: {
      metaDescription:
        typeof enSite?.metaDescription === 'string' && enSite.metaDescription.trim()
          ? enSite.metaDescription
          : 'Promote products, services, crafts or courses. A clear offer, social proof, and a next step.',
      sections: enBlocks as never,
    },
  })
  payload.logger.info('[seed] secciones Sitio')
}

async function removeOfferingsCarousel(payload: Payload) {
  for (const locale of ['es', 'en'] as const) {
    const site = await payload.findGlobal({
      slug: 'site',
      locale,
      overrideAccess: true,
      depth: 0,
    })
    const sections = Array.isArray(site?.sections) ? site.sections : []
    const next = sections.filter(
      (row) => !(row && typeof row === 'object' && 'blockType' in row && row.blockType === 'carousel'),
    )
    if (next.length === sections.length) continue
    await payload.updateGlobal({
      slug: 'site',
      locale,
      overrideAccess: true,
      data: { sections: next as never },
    })
    payload.logger.info(`[seed] carousel Offerings quitado (${locale})`)
  }
}

async function repairFaqEs(
  payload: Payload,
  esSite: { sections?: unknown; metaDescription?: string | null },
) {
  const t = getMessages('es')
  const sections = Array.isArray(esSite?.sections) ? esSite.sections : []
  const faq = sections.find(
    (row) => row && typeof row === 'object' && 'blockType' in row && row.blockType === 'faq',
  ) as { faqs?: unknown[]; id?: string } | undefined
  if (!faq || !Array.isArray(faq.faqs) || faq.faqs.length === 0) return
  const missing = faq.faqs.some((row) => {
    if (!row || typeof row !== 'object') return true
    const question = 'question' in row ? row.question : null
    return typeof question !== 'string' || !question.trim()
  })
  if (!missing) return

  const patched = sections.map((row) => {
    if (!row || typeof row !== 'object' || !('blockType' in row) || row.blockType !== 'faq') {
      return row
    }
    const rec = row as { faqs?: unknown[] }
    return {
      ...rec,
      faqs: t.faqs.map((item, index) => ({
        id: rowId(rec.faqs?.[index]),
        question: item.question,
        answer: item.answer,
      })),
    }
  })
  await payload.updateGlobal({
    slug: 'site',
    locale: 'es',
    overrideAccess: true,
    data: { sections: patched as never },
  })
  payload.logger.info('[seed] FAQ es')
}

async function seedFeatured(payload: Payload) {
  const marked = await payload.count({
    collection: 'products',
    overrideAccess: true,
    where: { featured: { equals: true } },
  })
  if (marked.totalDocs > 0) return

  const first = await payload.find({
    collection: 'products',
    overrideAccess: true,
    limit: 6,
    sort: 'title',
  })
  for (const doc of first.docs) {
    await payload.update({
      collection: 'products',
      id: doc.id,
      overrideAccess: true,
      data: { featured: true },
    })
  }
  if (first.docs.length) {
    payload.logger.info(`[seed] ${first.docs.length} ofertas destacadas`)
  }
}

async function seedPromo(payload: Payload) {
  const marked = await payload.count({
    collection: 'products',
    overrideAccess: true,
    where: { promo: { equals: true } },
  })
  if (marked.totalDocs > 0) return

  const next = await payload.find({
    collection: 'products',
    overrideAccess: true,
    limit: 6,
    sort: 'title',
    where: { featured: { not_equals: true } },
  })
  for (const doc of next.docs) {
    await payload.update({
      collection: 'products',
      id: doc.id,
      overrideAccess: true,
      data: { promo: true },
    })
  }
  if (next.docs.length) {
    payload.logger.info(`[seed] ${next.docs.length} ofertas en promoción`)
  }
}

async function seedProducts(payload: Payload) {
  const existing = await payload.count({
    collection: 'products',
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) {
    payload.logger.info(`[seed] ${existing.totalDocs} producto(s) — omitiendo catálogo`)
    return
  }

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'catalogo-seed-'))

  try {
    for (const product of SEED_PRODUCTS) {
      const filePath = await resolveProductPhoto(product, tmp)

      const media = await payload.create({
        collection: 'media',
        locale: 'es',
        overrideAccess: true,
        data: { alt: product.alt.es },
        filePath,
      })
      await payload.update({
        collection: 'media',
        id: media.id,
        locale: 'en',
        overrideAccess: true,
        data: { alt: product.alt.en },
      })

      const created = await payload.create({
        collection: 'products',
        locale: 'es',
        overrideAccess: true,
        draft: false,
        data: {
          title: product.title.es,
          slug: product.slug,
          description: product.description.es,
          price: product.price,
          kind: 'product',
          image: media.id,
          _status: 'published',
        },
      })
      await payload.update({
        collection: 'products',
        id: created.id,
        locale: 'en',
        overrideAccess: true,
        draft: false,
        data: {
          title: product.title.en,
          description: product.description.en,
          _status: 'published',
        },
      })
    }
  } finally {
    await fs.rm(tmp, { recursive: true, force: true })
  }

  payload.logger.info(`[seed] ${SEED_PRODUCTS.length} productos publicados`)
}

async function seedRealImages(payload: Payload) {
  const existing = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 100,
    overrideAccess: true,
  })
  const needs = existing.docs.filter((doc) => {
    const image = typeof doc.image === 'object' && doc.image !== null ? doc.image : null
    const filename = image && 'filename' in image ? String(image.filename) : ''
    return !filename.toLowerCase().endsWith('.jpg')
  })
  if (needs.length === 0) {
    payload.logger.info('[seed] fotos reales ya están')
    return
  }

  const tmp = await fs.mkdtemp(path.join(os.tmpdir(), 'catalogo-photos-'))
  let updated = 0
  try {
    for (const doc of needs) {
      const product = SEED_PRODUCTS.find((item) => item.slug === doc.slug)
      if (!product) continue
      const filePath = await resolveProductPhoto(product, tmp)
      const media = await payload.create({
        collection: 'media',
        locale: 'es',
        overrideAccess: true,
        data: { alt: product.alt.es },
        filePath,
      })
      await payload.update({
        collection: 'media',
        id: media.id,
        locale: 'en',
        overrideAccess: true,
        data: { alt: product.alt.en },
      })
      await payload.update({
        collection: 'products',
        id: doc.id,
        overrideAccess: true,
        data: { image: media.id },
      })
      updated += 1
    }
  } finally {
    await fs.rm(tmp, { recursive: true, force: true })
  }
  payload.logger.info(`[seed] ${updated} foto(s) reales`)
}

async function resolveProductPhoto(product: SeedProduct, tmp: string) {
  const bundled = path.join(process.cwd(), 'scripts/seed-photos', `${product.slug}.jpg`)
  try {
    await fs.access(bundled)
    return bundled
  } catch {
    // download
  }

  const dest = path.join(tmp, `${product.slug}.jpg`)
  const urls = [SEED_PHOTOS[product.slug], SEED_PHOTO_FALLBACK].filter(Boolean)
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'catalogo-web-seed' },
        signal: AbortSignal.timeout(25000),
      })
      if (!res.ok) continue
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.byteLength < 8000) continue
      await sharp(buf).resize(900, 700, { fit: 'cover' }).jpeg({ quality: 82 }).toFile(dest)
      await fs.mkdir(path.dirname(bundled), { recursive: true })
      await fs.copyFile(dest, bundled).catch(() => undefined)
      return dest
    } catch {
      // try next url
    }
  }

  await sharp(Buffer.from(productSvg(product))).jpeg({ quality: 82 }).toFile(dest)
  return dest
}

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function productSvg(product: SeedProduct) {
  const title = escapeXml(product.title.es)
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#FAFAF9"/>
  <rect x="32" y="32" width="736" height="536" fill="${product.bg}" stroke="#1C1917" stroke-width="8"/>
  <rect x="96" y="96" width="608" height="320" fill="#FAFAF9" stroke="#1C1917" stroke-width="6"/>
  <circle cx="400" cy="256" r="88" fill="${product.ink}" stroke="#1C1917" stroke-width="6"/>
  <rect x="312" y="248" width="176" height="120" fill="#FAFAF9" stroke="#1C1917" stroke-width="6"/>
  <text x="400" y="500" text-anchor="middle" font-family="sans-serif" font-size="28" font-weight="700" fill="#1C1917">${title}</text>
</svg>`
}
