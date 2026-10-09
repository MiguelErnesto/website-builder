'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { LangSwitch } from '@/components/LangSwitch'
import { HeroSearch } from '@/components/HeroSearch'
import type { Locale } from '@/lib/i18n'
import { getMessages } from '@/lib/i18n'
import type { NavItem } from '@/lib/site-copy'

type HeaderProps = {
  locale: Locale
  siteName: string
  logoText: string
  logoUrl: string | null
  showLogo: boolean
  showLogoText: boolean
  navItems: NavItem[]
  showNav: boolean
  ctaLabel: string
  ctaHref: string
  showNavCta: boolean
  showLangSwitch: boolean
  showSearch: boolean
  searchPlaceholder: string
}

export function Header({
  locale,
  siteName,
  logoText,
  logoUrl,
  showLogo,
  showLogoText,
  navItems,
  showNav,
  ctaLabel,
  ctaHref,
  showNavCta,
  showLangSwitch,
  showSearch,
  searchPlaceholder,
}: HeaderProps) {
  const t = getMessages(locale)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const onHome = pathname === `/${locale}` || pathname === `/${locale}/`
  const home = `/${locale}`
  const links = showNav ? navItems : []

  const close = () => setOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <a className="skip-link" href="#contenido">
        {t.skip}
      </a>
      <header className={`flux-header${scrolled ? ' is-scrolled' : ''}`}>
        <nav className="flux-nav" aria-label={t.home}>
          <Link href={home} className="flux-logo">
            {showLogo && logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="" className="flux-logo-img" />
            ) : null}
            {showLogoText ? <span className="flux-logo-text">{logoText || siteName}</span> : null}
          </Link>
          {showSearch ? (
            <div className="flux-header-search">
              <HeroSearch locale={locale} placeholder={searchPlaceholder} icon />
            </div>
          ) : null}
          <ul className="flux-menu">
            {links.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
            {showNavCta ? (
              <li>
                <a href={ctaHref} className="flux-btn flux-btn--nav">
                  {ctaLabel}
                </a>
              </li>
            ) : null}
            {showLangSwitch ? (
              <li className="lang-switch-item">
                <LangSwitch locale={locale} />
              </li>
            ) : null}
          </ul>
          <button
            type="button"
            className={`hamburger${open ? ' is-open' : ''}`}
            aria-expanded={open}
            aria-controls="menu-movil"
            aria-label={open ? t.closeMenu : t.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>
        <nav
          id="menu-movil"
          className={`flux-mobile${open ? ' is-open' : ''}`}
          aria-label={t.home}
          aria-hidden={!open}
        >
          <Link href={home} onClick={close} aria-current={onHome ? 'page' : undefined}>
            {t.home}
          </Link>
          {links.map((item) => (
            <a key={`${item.href}-${item.label}`} href={item.href} onClick={close}>
              {item.label}
            </a>
          ))}
          {showNavCta ? (
            <a href={ctaHref} className="flux-btn flux-btn--nav" onClick={close}>
              {ctaLabel}
            </a>
          ) : null}
          {showLangSwitch ? <LangSwitch locale={locale} /> : null}
        </nav>
      </header>
    </>
  )
}
