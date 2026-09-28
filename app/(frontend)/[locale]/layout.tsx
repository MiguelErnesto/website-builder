import type { CSSProperties, ReactNode } from 'react'
import { notFound } from 'next/navigation'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { getSite } from '@/lib/cms'
import { getMessages, isLocale } from '@/lib/i18n'
import { siteCopy } from '@/lib/site-copy'
import { themeStyle } from '@/lib/theme'
import type { Locale } from '@/lib/i18n'
import '@/app/globals.css'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }]
}

type LayoutProps = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Pick<LayoutProps, 'params'>) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : 'es'
  const t = getMessages(locale)
  try {
    const site = await getSite(locale)
    const copy = siteCopy(locale, site)
    return {
      title: { default: copy.name, template: `%s · ${copy.name}` },
      description: copy.metaDescription,
    }
  } catch {
    return {
      title: { default: t.siteFallback, template: `%s · ${t.siteFallback}` },
      description: t.metaDescription,
    }
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw

  const copy = siteCopy(locale, null)
  let brand = copy
  try {
    const site = await getSite(locale)
    brand = siteCopy(locale, site)
  } catch {
    // first boot
  }

  const ctaHref = `/${locale}#contacto`
  const style = themeStyle(brand.theme) as CSSProperties

  return (
    <html lang={locale} style={style}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={brand.theme.googleFontsHref} precedence="default" />
      </head>
      <body className="flex min-h-dvh flex-col bg-paper text-ink antialiased">
        <Header
          locale={locale}
          siteName={brand.name}
          logoText={brand.logoText}
          logoUrl={brand.logoUrl}
          showLogo={brand.show.logo}
          showLogoText={brand.show.logoText}
          navItems={brand.navItems}
          showNav={brand.show.nav}
          ctaLabel={brand.navCta}
          ctaHref={ctaHref}
          showNavCta={brand.show.navCta}
          showLangSwitch={brand.show.langSwitch}
        />
        {children}
        <Footer
          locale={locale}
          siteName={brand.name}
          logoText={brand.logoText}
          logoUrl={brand.logoUrl}
          showLogo={brand.show.logo}
          showLogoText={brand.show.logoText}
          navItems={brand.navItems}
          showNav={brand.show.nav}
          showLangSwitch={brand.show.langSwitch}
          email={brand.email || undefined}
          instagram={brand.instagram || undefined}
          facebook={brand.facebook || undefined}
          twitter={brand.twitter || undefined}
          youtube={brand.youtube || undefined}
          tiktok={brand.tiktok || undefined}
          linkedin={brand.linkedin || undefined}
          whatsapp={brand.whatsapp || undefined}
          pinterest={brand.pinterest || undefined}
        />
      </body>
    </html>
  )
}
