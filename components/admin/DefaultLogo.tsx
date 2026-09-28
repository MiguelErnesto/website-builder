'use client'

import { useField, useTranslation } from '@payloadcms/ui'

import { DEFAULT_LOGO_SRC } from '@/lib/media'

function hasLogo(value: unknown) {
  if (value == null || value === '') return false
  if (typeof value === 'number') return true
  if (typeof value === 'string') return value.length > 0
  if (typeof value === 'object' && 'id' in value && (value as { id?: unknown }).id) return true
  return false
}

export function DefaultLogo({
  field,
  path: pathFromProps,
}: {
  field?: { name?: string }
  path?: string
}) {
  const path = pathFromProps || field?.name || 'logo'
  const { value } = useField({ path, potentiallyStalePath: path })
  const { i18n } = useTranslation()
  const en = i18n.language === 'en'
  if (hasLogo(value)) return null

  return (
    <div className="default-logo-preview">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={DEFAULT_LOGO_SRC} alt={en ? 'Default logo' : 'Logo por defecto'} />
      <span>
        {en ? 'Default logo (used if you do not upload another)' : 'Logo por defecto (se usa si no subes otro)'}
      </span>
    </div>
  )
}
