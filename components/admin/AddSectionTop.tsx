'use client'

import { Button, useTranslation } from '@payloadcms/ui'

export function AddSectionTop() {
  const { i18n, t } = useTranslation()
  const noun = i18n.language === 'en' ? 'section' : 'sección'

  return (
    <Button
      buttonStyle="icon-label"
      className="add-section-top"
      el="button"
      icon="plus"
      iconPosition="left"
      onClick={(event) => {
        const field = event.currentTarget.closest('.blocks-field')
        field?.querySelector<HTMLElement>('.blocks-field__drawer-toggler')?.click()
      }}
      type="button"
    >
      {t('fields:addLabel', { label: noun })}
    </Button>
  )
}
