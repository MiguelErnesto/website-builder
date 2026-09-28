import type { ReactNode } from 'react'

import type { SocialKey } from '@/lib/socials'

function Svg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.75">
      {children}
    </svg>
  )
}

export function SocialIcon({ name }: { name: SocialKey }) {
  switch (name) {
    case 'email':
      return (
        <Svg>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </Svg>
      )
    case 'instagram':
      return (
        <Svg>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        </Svg>
      )
    case 'facebook':
      return (
        <Svg>
          <path d="M14 8h3V4.8h-3c-2.4 0-4 1.5-4 4V11H7.5v3.2H10V20h3.3v-5.8h2.8L16.6 11H13.3V8.9c0-.5.3-.9 1-.9Z" />
        </Svg>
      )
    case 'twitter':
      return (
        <Svg>
          <path d="M4 4h4.4l4 5.4L16.8 4H20l-6.3 8.1L20 20h-4.4l-4.2-5.7L7.2 20H4l6.6-8.4L4 4Z" />
        </Svg>
      )
    case 'youtube':
      return (
        <Svg>
          <rect x="2.5" y="6" width="19" height="12" rx="3" />
          <path d="M10.5 9.5v5l5-2.5-5-2.5Z" fill="currentColor" stroke="none" />
        </Svg>
      )
    case 'tiktok':
      return (
        <Svg>
          <path d="M14 4v10.2a3.7 3.7 0 1 1-3.2-3.66V13a1.5 1.5 0 1 0 1.5 1.5V4h1.7c.4 2.2 1.8 3.6 4 4V10c-1.5-.1-2.8-.7-4-1.7V4Z" />
        </Svg>
      )
    case 'linkedin':
      return (
        <Svg>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2" />
          <path d="M8 10.2V16M8 8v.01M11.2 16v-3.4c0-1.3.8-2 1.9-2s1.9.8 1.9 2V16" />
        </Svg>
      )
    case 'whatsapp':
      return (
        <Svg>
          <path d="M12 4.5a7.5 7.5 0 0 0-6.4 11.4L4.5 19.5l3.7-1A7.5 7.5 0 1 0 12 4.5Z" />
          <path d="M9.4 9.6c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .5.4.2.5.6 1.7.6 1.8 0 .2 0 .4-.2.5l-.5.5c-.1.1-.2.3 0 .5.3.4.8.9 1.3 1.2.4.2.6.2.8 0l.5-.4c.2-.1.4-.1.6 0l1.5.8c.2.1.3.3.2.6-.2.6-.9 1.1-1.5 1.2-.5 0-2.2.1-4-1.5-1.6-1.4-2.1-3.2-2.2-3.7 0-.6.5-1.3 1.1-1.6Z" />
        </Svg>
      )
    case 'pinterest':
      return (
        <Svg>
          <circle cx="12" cy="12" r="8" />
          <path d="M11 17.2c.2-1.4.6-2.7 1-4-.5.1-1.2-.3-1.4-1.2-.2-1 .4-1.6 1.2-1.6 1.2 0 1.5 1.1 1.3 2-.2.8-.5 1.6-.6 2.4-.2 1 .4 1.3 1.1.8 1.2-.8 2-2.4 1.9-4.1-.1-2.2-2-3.4-4.1-3.2-2.3.2-3.7 1.8-3.5 3.8.1.8.5 1.5.7 1.6" />
        </Svg>
      )
    default:
      return null
  }
}
