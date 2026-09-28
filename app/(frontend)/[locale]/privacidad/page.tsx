import { getMessages, isLocale } from '@/lib/i18n'

type PageProps = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale: raw } = await params
  const t = getMessages(isLocale(raw) ? raw : 'es')
  return { title: t.privacy, description: t.privacyLead }
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale: raw } = await params
  const t = getMessages(isLocale(raw) ? raw : 'es')
  return (
    <main id="contenido" className="legal">
      <h1 className="band-title">{t.privacy}</h1>
      <p>{t.privacyLead}</p>
    </main>
  )
}
