'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { LangFlag } from '@/components/LangFlag'
import type { Locale } from '@/lib/i18n'
import { getMessages, locales } from '@/lib/i18n'

type LangSwitchProps = {
  locale: Locale
}

function localeHref(pathname: string, from: Locale, to: Locale) {
  const prefix = `/${from}`
  if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
    const next = pathname.replace(prefix, `/${to}`)
    return next || `/${to}`
  }
  return `/${to}`
}

export function LangSwitch({ locale }: LangSwitchProps) {
  const t = getMessages(locale)
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const others = locales.filter((code) => code !== locale)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className={`lang-switch${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="lang-link lang-switch-btn"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={t.lang}
        onClick={() => setOpen((v) => !v)}
      >
        <LangFlag code={locale} />
        {locale}
      </button>
      <ul id={listId} className="lang-switch-list" hidden={!open}>
        {others.map((code) => (
          <li key={code}>
            <Link
              href={localeHref(pathname, locale, code)}
              hrefLang={code}
              lang={code}
              className="lang-link"
              onClick={() => setOpen(false)}
            >
              <LangFlag code={code} />
              {code}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
