import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'

import { getPageBySlug } from '@/lib/cms'
import { getMessages, isLocale } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) return { title: getMessages('es').siteFallback }
  const page = await getPageBySlug(slug, raw).catch(() => null)
  if (!page) return { title: getMessages(raw).notFound }
  return { title: String(page.title) }
}

export default async function CmsPage({ params }: PageProps) {
  const { locale: raw, slug } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const t = getMessages(locale)
  const page = await getPageBySlug(slug, locale).catch(() => null)
  if (!page) notFound()

  return (
    <main id="contenido" className="legal cms-page">
      <h1 className="band-title">{String(page.title)}</h1>
      {page.body ? <RichText data={page.body as never} /> : <p>{t.empty}</p>}
    </main>
  )
}
