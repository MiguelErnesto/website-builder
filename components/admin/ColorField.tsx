'use client'

import type { TextFieldClientComponent } from 'payload'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import { useEffect, useState } from 'react'

import { DEFAULT_FONT_COLOR, DEFAULT_PRIMARY, DEFAULT_SECONDARY, parseHex } from '@/lib/theme'

function parsedHex(raw: string, fallback: string) {
  const v = raw.trim()
  const withHash = v.startsWith('#') ? v : `#${v}`
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(withHash)) return null
  return parseHex(withHash, fallback)
}

export const ColorField: TextFieldClientComponent = ({ field, path: pathFromProps, readOnly }) => {
  const path = pathFromProps || field.name
  const { disabled, errorMessage, setValue, showError, value } = useField<string>({
    path,
    potentiallyStalePath: path,
  })
  const fallback =
    field.name === 'colorSecondary'
      ? DEFAULT_SECONDARY
      : field.name === 'colorFontPrimary' || field.name === 'colorFontSecondary'
        ? DEFAULT_FONT_COLOR
        : DEFAULT_PRIMARY
  const hex = parseHex(value, fallback)
  const [draft, setDraft] = useState(hex)
  const description = typeof field.admin?.description === 'string' ? field.admin.description : undefined
  const locked = Boolean(readOnly || disabled)

  useEffect(() => {
    setDraft(hex)
  }, [hex])

  return (
    <div className="field-type color-field">
      <FieldLabel htmlFor={`${path}-hex`} label={field.label} path={path} required={field.required} />
      <FieldError message={errorMessage} showError={showError} />
      <div className="color-field__control">
        <input
          id={path}
          className="color-field__picker"
          type="color"
          value={hex}
          disabled={locked}
          onChange={(event) => setValue(event.target.value)}
        />
        <input
          id={`${path}-hex`}
          className="color-field__hex"
          type="text"
          spellCheck={false}
          autoComplete="off"
          maxLength={7}
          value={draft}
          disabled={locked}
          aria-label={`${typeof field.label === 'string' ? field.label : path} hex`}
          onChange={(event) => {
            const next = event.target.value
            setDraft(next)
            const parsed = parsedHex(next, fallback)
            if (parsed) setValue(parsed)
          }}
          onBlur={() => setDraft(hex)}
        />
      </div>
      <FieldDescription description={description} path={path} />
    </div>
  )
}
