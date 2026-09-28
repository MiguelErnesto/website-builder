import type { ReactNode } from 'react'

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
      {children}
    </svg>
  )
}

export function DashboardIcon({ slug }: { slug: string }) {
  switch (slug) {
    case 'users':
      return (
        <Icon>
          <circle cx="12" cy="8" r="3.25" />
          <path d="M5.5 19.5c.8-3.2 3.3-5 6.5-5s5.7 1.8 6.5 5" />
        </Icon>
      )
    case 'media':
      return (
        <Icon>
          <rect x="3.5" y="5.5" width="17" height="13" rx="2" />
          <circle cx="9" cy="10.5" r="1.6" />
          <path d="M7 16.5 10.5 13l3 3 2.2-2.2 3.8 2.7" />
        </Icon>
      )
    case 'products':
      return (
        <Icon>
          <path d="M4 8.5h16l-1.2 10.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8L4 8.5Z" />
          <path d="M8.5 8.5V7a3.5 3.5 0 0 1 7 0v1.5" />
        </Icon>
      )
    case 'pages':
      return (
        <Icon>
          <path d="M7 3.5h7.5L19.5 9v11.5H7A1.5 1.5 0 0 1 5.5 19V5A1.5 1.5 0 0 1 7 3.5Z" />
          <path d="M14.5 3.5V9h5.5" />
          <path d="M9 13h6M9 16.5h4" />
        </Icon>
      )
    case 'site':
      return (
        <Icon>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16M12 4c2.5 2.4 3.8 5.2 3.8 8S14.5 17.6 12 20c-2.5-2.4-3.8-5.2-3.8-8S9.5 6.4 12 4Z" />
        </Icon>
      )
    default:
      return (
        <Icon>
          <rect x="4" y="5" width="7" height="7" rx="1.2" />
          <rect x="13" y="5" width="7" height="7" rx="1.2" />
          <rect x="4" y="14" width="7" height="7" rx="1.2" />
          <rect x="13" y="14" width="7" height="7" rx="1.2" />
        </Icon>
      )
  }
}
