import { getMessages, isLocale } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params
  const t = getMessages(isLocale(raw) ? raw : 'es')
  return { title: t.notice, description: t.noticeLead }
}

export default async function NoticePage({ params }: PageProps) {
  const { locale: raw } = await params
  const t = getMessages(isLocale(raw) ? raw : 'es')
  return (
    <main id="contenido" className="legal">
      <h1 className="band-title">{t.notice}</h1>
      <p>{t.noticeLead}</p>
    </main>
  )
}
