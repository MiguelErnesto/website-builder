import Link from 'next/link'

import { LangSwitch } from '@/components/LangSwitch'
import { SocialIcon } from '@/components/SocialIcon'
import type { Locale } from '@/lib/i18n'
import { getMessages } from '@/lib/i18n'
import type { NavItem } from '@/lib/site-copy'
import { SOCIAL_KEYS, SOCIAL_META, socialHref, type SocialKey } from '@/lib/socials'

type FooterProps = {
  locale: Locale
  siteName: string
  logoText: string
  logoUrl: string | null
  showLogo: boolean
  showLogoText: boolean
  navItems: NavItem[]
  showNav: boolean
  showLangSwitch: boolean
  email?: string
  instagram?: string
  facebook?: string
  twitter?: string
  youtube?: string
  tiktok?: string
  linkedin?: string
  whatsapp?: string
  pinterest?: string
}

export function Footer({
  locale,
  siteName,
  logoText,
  logoUrl,
  showLogo,
  showLogoText,
  navItems,
  showNav,
  showLangSwitch,
  email,
  instagram,
  facebook,
  twitter,
  youtube,
  tiktok,
  linkedin,
  whatsapp,
  pinterest,
}: FooterProps) {
  const t = getMessages(locale)
  const year = new Date().getFullYear()
  const home = `/${locale}`
  const links = showNav ? navItems : []
  const values: Record<SocialKey, string | undefined> = {
    email,
    instagram,
    facebook,
    twitter,
    youtube,
    tiktok,
    linkedin,
    whatsapp,
    pinterest,
  }
  const socials = SOCIAL_KEYS.map((key) => {
    const value = values[key]?.trim()
    if (!value) return null
    const href = socialHref(key, value)
    if (!href) return null
    return { key, href, label: SOCIAL_META[key].label }
  }).filter((item): item is { key: SocialKey; href: string; label: string } => item !== null)

  return (
    <footer className="flux-footer">
      <div className="footer-grid">
        <div>
          <p className="flux-footer-brand">
            {showLogo && logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="flux-logo-img" />
            ) : null}
            {showLogoText ? logoText || siteName : null}
          </p>
          <p className="flux-footer-copy">
            © {year} {siteName}
          </p>
        </div>
        <nav aria-label={t.sitemap}>
          <h2 className="footer-heading">{t.sitemap}</h2>
          <ul className="footer-links">
            <li>
              <Link href={home}>{t.home}</Link>
            </li>
            {links.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="footer-heading">{t.contact}</h2>
          <ul className="footer-links">
            <li>
              <a href={`${home}#contacto`}>{t.navCta}</a>
            </li>
          </ul>
          {socials.length ? (
            <>
              <h2 className="footer-heading">{t.social}</h2>
              <ul className="footer-social">
                {socials.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      aria-label={item.label}
                      {...(item.key === 'email'
                        ? {}
                        : { rel: 'noopener noreferrer', target: '_blank' })}
                    >
                      <SocialIcon name={item.key} />
                      <span>{item.key === 'email' ? email : item.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
        <nav aria-label={t.legal}>
          <h2 className="footer-heading">{t.legal}</h2>
          <ul className="footer-links">
            <li>
              <Link href={`${home}/privacidad`}>{t.privacy}</Link>
            </li>
            <li>
              <Link href={`${home}/aviso`}>{t.notice}</Link>
            </li>
          </ul>
          {showLangSwitch ? (
            <div className="flux-langs">
              <LangSwitch locale={locale} />
            </div>
          ) : null}
        </nav>
      </div>
    </footer>
  )
}
