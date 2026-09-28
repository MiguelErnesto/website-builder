'use client'

import { getTranslation } from '@payloadcms/translations'
import { Link, Logout, useAuth, useConfig, useTranslation } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { formatAdminURL } from 'payload/shared'

import { AdminLangSwitch } from '@/components/admin/AdminLangSwitch'
import { DEFAULT_LOGO_SRC } from '@/lib/media'

type VisibleEntities = {
  collections: string[]
  globals: string[]
}

export function AdminTopNav({ visibleEntities }: { visibleEntities?: VisibleEntities }) {
  const pathname = usePathname()
  const { i18n, t } = useTranslation()
  const { user } = useAuth()
  const {
    config: {
      collections,
      globals,
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const userLabel =
    user && typeof user === 'object' && 'email' in user && typeof user.email === 'string'
      ? user.email
      : ''

  const dashboardHref = formatAdminURL({ adminRoute, path: '/' })
  const collectionSlugs = visibleEntities?.collections
  const globalSlugs = visibleEntities?.globals
  const navCollections = collections.filter((collection) =>
    collectionSlugs ? collectionSlugs.includes(collection.slug) : !collection.slug.startsWith('payload-'),
  )
  const navGlobals = globals.filter((global) =>
    globalSlugs ? globalSlugs.includes(global.slug) : true,
  )

  return (
    <div className="admin-top-nav">
      <Link className="admin-top-nav__brand" href={dashboardHref} prefetch={false}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DEFAULT_LOGO_SRC} alt="" className="admin-top-nav__logo" />
        <span>{t('general:dashboard')}</span>
      </Link>
      <nav className="admin-top-nav__links" aria-label={t('general:dashboard')}>
        {navCollections.map((collection) => {
          const href = formatAdminURL({
            adminRoute,
            path: `/collections/${collection.slug}`,
          })
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={collection.slug}
              className={active ? 'admin-top-nav__link is-active' : 'admin-top-nav__link'}
              href={href}
              prefetch={false}
            >
              {getTranslation(collection.labels.plural, i18n)}
            </Link>
          )
        })}
        {navGlobals.map((global) => {
          const href = formatAdminURL({
            adminRoute,
            path: `/globals/${global.slug}`,
          })
          const active = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={global.slug}
              className={active ? 'admin-top-nav__link is-active' : 'admin-top-nav__link'}
              href={href}
              prefetch={false}
            >
              {getTranslation(global.label, i18n)}
            </Link>
          )
        })}
      </nav>
      <div className="admin-top-nav__end">
        <AdminLangSwitch />
        {userLabel ? <span className="admin-top-nav__user">{userLabel}</span> : null}
        <Logout />
      </div>
    </div>
  )
}
