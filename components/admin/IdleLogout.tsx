'use client'

import { useAuth, useConfig } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { useEffect, type ReactNode } from 'react'

const IDLE_MS = 15 * 60 * 1000

export function IdleLogout({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const {
    config: {
      admin: {
        routes: { login, logout },
      },
      routes: { admin: adminRoute },
    },
  } = useConfig()

  const logoutPath = formatAdminURL({ adminRoute, path: logout })
  const loginPath = formatAdminURL({ adminRoute, path: login })

  useEffect(() => {
    if (!user) return

    let timer: ReturnType<typeof setTimeout>
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        const path = window.location.pathname
        if (path === loginPath || path === logoutPath) return
        window.location.assign(logoutPath)
      }, IDLE_MS)
    }

    reset()
    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'pointerdown'] as const
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }))
    return () => {
      clearTimeout(timer)
      events.forEach((event) => window.removeEventListener(event, reset))
    }
  }, [user, loginPath, logoutPath])

  return children
}
