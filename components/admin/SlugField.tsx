'use client'

import type { TextFieldClientComponent } from 'payload'
import { FieldError, FieldLabel, useField, useFormFields } from '@payloadcms/ui'
import { useEffect, useRef } from 'react'

import { slugify } from '@/lib/slug'

export const SlugField: TextFieldClientComponent = ({ field, path: pathFromProps, readOnly }) => {
  const path = pathFromProps || field.name
  const { disabled, errorMessage, setValue, showError, value } = useField<string>({
    path,
    potentiallyStalePath: path,
  })
  const title = useFormFields(([fields]) => (typeof fields.title?.value === 'string' ? fields.title.value : ''))
  const auto = useRef<string | null>(null)
  const locked = Boolean(readOnly || disabled)

  useEffect(() => {
    const next = slugify(title)
    const current = typeof value === 'string' ? value : ''
    if (current && current !== auto.current) return
    if (!next || current === next) return
    auto.current = next
    setValue(next)
  }, [setValue, title, value])

  return (
    <div className="field-type text">
      <FieldLabel label={field.label || 'Slug'} path={path} required={field.required} />
      <FieldError message={errorMessage} showError={showError} />
      <input
        id={`field-${path.replace(/\./g, '__')}`}
        name={path}
        type="text"
        value={typeof value === 'string' ? value : ''}
        disabled={locked}
        onChange={(event) => {
          auto.current = null
          setValue(event.target.value)
        }}
      />
    </div>
  )
}
