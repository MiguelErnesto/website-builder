import { getTranslation } from '@payloadcms/translations'
import { Button, Gutter, Locked } from '@payloadcms/ui'
import { RenderServerComponent } from '@payloadcms/ui/elements/RenderServerComponent'
import { EntityType, groupNavItems } from '@payloadcms/ui/shared'
import type { ServerProps } from 'payload'
import { formatAdminURL } from 'payload/shared'

import { DashboardIcon } from '@/components/admin/DashboardIcon'

const baseClass = 'dashboard'

type DashboardProps = {
  globalData: Array<{
    data: {
      _isLocked: boolean
      _lastEditedAt: string | null
      _userEditing: unknown
    }
    lockDuration?: number
    slug: string
  }>
  navGroups?: ReturnType<typeof groupNavItems>
} & ServerProps

export async function Dashboard(props: DashboardProps) {
  const {
    globalData,
    i18n,
    locale,
    navGroups,
    params,
    payload,
    permissions,
    searchParams,
    user,
  } = props
  const { t } = i18n
  const {
    admin: {
      components: { afterDashboard, beforeDashboard },
    },
    routes: { admin: adminRoute },
  } = payload.config

  const collectionSlugs = (navGroups || []).flatMap((group) =>
    group.entities.filter((entity) => entity.type === EntityType.collection).map((entity) => entity.slug),
  )

  const counts = Object.fromEntries(
    await Promise.all(
      collectionSlugs.map(async (slug) => {
        try {
          const { totalDocs } = await payload.count({
            collection: slug,
            overrideAccess: false,
            user: user || undefined,
          })
          return [slug, totalDocs] as const
        } catch {
          return [slug, null] as const
        }
      }),
    ),
  )

  const serverProps = { i18n, locale, params, payload, permissions, searchParams, user }

  return (
    <div className={baseClass}>
      <Gutter className={`${baseClass}__wrap`}>
        {beforeDashboard
          ? RenderServerComponent({
              Component: beforeDashboard,
              importMap: payload.importMap,
              serverProps,
            })
          : null}
        {!navGroups?.length ? (
          <p>no nav groups....</p>
        ) : (
          navGroups.map(({ entities, label }, groupIndex) => (
            <div className={`${baseClass}__group`} key={groupIndex}>
              <h2 className={`${baseClass}__label`}>{label}</h2>
              <ul className={`${baseClass}__card-list`}>
                {entities.map(({ slug, type, label: entityLabel }, entityIndex) => {
                  const title = getTranslation(entityLabel, i18n)
                  const isCollection = type === EntityType.collection
                  const href = formatAdminURL({
                    adminRoute,
                    path: isCollection ? `/collections/${slug}` : `/globals/${slug}`,
                  })
                  const createHREF = formatAdminURL({
                    adminRoute,
                    path: `/collections/${slug}/create`,
                  })
                  const hasCreatePermission = isCollection
                    ? Boolean(permissions?.collections?.[slug]?.create)
                    : false
                  const count = isCollection ? counts[slug] : null

                  let isLocked = false
                  let userEditing: { id?: string | number } | null = null
                  if (!isCollection) {
                    const globalLockData = globalData.find((global) => global.slug === slug)
                    if (globalLockData) {
                      isLocked = globalLockData.data._isLocked
                      userEditing = globalLockData.data._userEditing as {
                        id?: string | number
                      } | null
                      const lastEditedAt = new Date(globalLockData.data._lastEditedAt || 0).getTime()
                      const lockExpirationTime =
                        lastEditedAt + (globalLockData.lockDuration || 300) * 1000
                      if (Date.now() > lockExpirationTime) {
                        isLocked = false
                        userEditing = null
                      }
                    }
                  }

                  const buttonAriaLabel = isCollection
                    ? t('general:showAllLabel', { label: title })
                    : t('general:editLabel', { label: title })

                  return (
                    <li key={entityIndex}>
                      <div className="card card--has-onclick card-entity" id={`card-${slug}`}>
                        <span className="card-entity__icon">
                          <DashboardIcon slug={slug} />
                        </span>
                        <div className="card-entity__meta">
                          <h3 className="card__title">{title}</h3>
                          {typeof count === 'number' ? (
                            <p className="card-entity__count">{count}</p>
                          ) : null}
                        </div>
                        {isLocked && user?.id !== userEditing?.id ? (
                          <div className="card__actions">
                            <Locked className={`${baseClass}__locked`} user={userEditing} />
                          </div>
                        ) : hasCreatePermission ? (
                          <div className="card__actions">
                            <Button
                              aria-label={t('general:createNewLabel', { label: entityLabel })}
                              buttonStyle="icon-label"
                              el="link"
                              icon="plus"
                              iconStyle="with-border"
                              round
                              to={createHREF}
                            />
                          </div>
                        ) : null}
                        <Button
                          aria-label={buttonAriaLabel}
                          buttonStyle="none"
                          className="card__click"
                          el="link"
                          to={href}
                        />
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))
        )}
        {afterDashboard
          ? RenderServerComponent({
              Component: afterDashboard,
              importMap: payload.importMap,
              serverProps,
            })
          : null}
      </Gutter>
    </div>
  )
}
