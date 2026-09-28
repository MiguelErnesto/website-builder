'use client'

import { useTranslation } from '@payloadcms/ui'

export function AppearanceHeading() {
  const { i18n } = useTranslation()
  return <h3 className="appearance-settings-title">{i18n.language === 'en' ? 'Settings' : 'Ajustes'}</h3>
}
