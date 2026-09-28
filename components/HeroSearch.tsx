import type { Locale } from '@/lib/i18n'
import { getMessages } from '@/lib/i18n'

type HeroSearchProps = {
  locale: Locale
  defaultValue?: string
  placeholder?: string
}

export function HeroSearch({ locale, defaultValue = '', placeholder }: HeroSearchProps) {
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
      <button type="submit" className="flux-btn">
        {t.search}
      </button>
    </form>
  )
}
