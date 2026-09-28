'use client'

import { useLocale, useRouteTransition, useTranslation } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'
import * as qs from 'qs-esm'
import { useEffect, useId, useRef, useState } from 'react'

import { LangFlag } from '@/components/LangFlag'
import { isLocale, locales, type Locale } from '@/lib/i18n'

export function AdminLangSwitch() {
  const router = useRouter()
  const { startRouteTransition } = useRouteTransition()
  const { switchLanguage } = useTranslation()
  const locale = useLocale()
  const current = isLocale(locale.code) ? locale.code : 'es'
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const others = locales.filter((code) => code !== current)

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

  const go = (code: Locale) => {
    setOpen(false)
    const searchParams = new URLSearchParams(window.location.search)
    const url = qs.stringify(
      {
        ...qs.parse(searchParams.toString(), { depth: 10, ignoreQueryPrefix: true }),
        locale: code,
      },
      { addQueryPrefix: true },
    )
    startRouteTransition(() => {
      void (async () => {
        await switchLanguage?.(code)
        router.push(url)
      })()
    })
  }

  return (
    <div ref={rootRef} className={`lang-switch${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="lang-link lang-switch-btn"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={current}
        onClick={() => setOpen((v) => !v)}
      >
        <LangFlag code={current} />
        {current}
      </button>
      <ul id={listId} className="lang-switch-list" hidden={!open}>
        {others.map((code) => (
          <li key={code}>
            <button type="button" className="lang-link" lang={code} onClick={() => go(code)}>
              <LangFlag code={code} />
              {code}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
