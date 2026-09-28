import type { Locale } from '@/lib/i18n'

type LangFlagProps = {
  code: Locale
}

export function LangFlag({ code }: LangFlagProps) {
  if (code === 'es') {
    return (
      <svg className="lang-flag" viewBox="0 0 21 15" aria-hidden="true">
        <rect width="21" height="15" fill="#c60b1e" />
        <rect y="4" width="21" height="7" fill="#ffc400" />
      </svg>
    )
  }

  return (
    <svg className="lang-flag" viewBox="0 0 21 15" aria-hidden="true">
      <rect width="21" height="15" fill="#012169" />
      <path d="M0 0 L21 15 M21 0 L0 15" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 L21 15 M21 0 L0 15" stroke="#c8102e" strokeWidth="1.5" />
      <path d="M10.5 0 V15 M0 7.5 H21" stroke="#fff" strokeWidth="5" />
      <path d="M10.5 0 V15 M0 7.5 H21" stroke="#c8102e" strokeWidth="3" />
    </svg>
  )
}
