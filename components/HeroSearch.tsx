import type { Locale } from '@/lib/i18n'
import { getMessages } from '@/lib/i18n'

type HeroSearchProps = {
  locale: Locale
  defaultValue?: string
  placeholder?: string
  icon?: boolean
}

export function HeroSearch({ locale, defaultValue = '', placeholder, icon = false }: HeroSearchProps) {
  const t = getMessages(locale)

  return (
    <form className="hero-search" action={`/${locale}/ofertas`} method="get" role="search">
      <label htmlFor="q" className="sr-only">
        {t.search}
      </label>
      <input
        id="q"
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder?.trim() || t.searchPlaceholder}
        autoComplete="off"
      />
      <button type="submit" className="flux-btn" aria-label={t.search}>
        {icon ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.25" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M15.2 15.2 L20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          t.search
        )}
      </button>
    </form>
  )
}
