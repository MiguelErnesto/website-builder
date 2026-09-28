import { redirect } from 'next/navigation'

type PageProps = {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ProductRedirect({ params }: PageProps) {
  const { locale, slug } = await params
  redirect(`/${locale}/ofertas/${slug}`)
}
