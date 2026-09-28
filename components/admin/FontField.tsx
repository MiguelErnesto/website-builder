'use client'

import type { SelectFieldClientComponent } from 'payload'
import { FieldDescription, FieldError, FieldLabel, useField } from '@payloadcms/ui'
import { useEffect, useId, useRef, useState } from 'react'

import { fontFamily, fontStack, googleFontsAllHref, isFontId } from '@/lib/theme'

function optionLabel(value: string, options: { label?: unknown; value?: string }[]) {
  const match = options.find((option) => option.value === value)
  if (typeof match?.label === 'string') return match.label
  return fontFamily(value)
}

export const FontField: SelectFieldClientComponent = ({ field, path: pathFromProps, readOnly }) => {
  const path = pathFromProps || field.name
  const { disabled, errorMessage, setValue, showError, value } = useField<string>({
    path,
    potentiallyStalePath: path,
  })
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const options = (field.options || []).map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  )
  const description = typeof field.admin?.description === 'string' ? field.admin.description : undefined
  const current = typeof value === 'string' && value ? value : 'open-sans'
  const currentLabel = optionLabel(current, options)

  useEffect(() => {
    const href = googleFontsAllHref()
    if (document.querySelector(`link[href="${href}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }, [])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="field-type font-field" ref={rootRef}>
      <FieldLabel htmlFor={path} label={field.label} path={path} required={field.required} />
      <FieldError message={errorMessage} showError={showError} />
      <button
        id={path}
        type="button"
        className="font-field__button"
        style={{ fontFamily: isFontId(current) ? fontStack(current) : fontStack('open-sans') }}
        aria-expanded={open}
        aria-controls={listId}
        disabled={Boolean(readOnly || disabled)}
        onClick={() => setOpen((v) => !v)}
      >
        {currentLabel}
      </button>
      {open ? (
        <ul id={listId} className="font-field__list">
          {options.map((option) => {
            const optionValue = String(option.value || '')
            const active = optionValue === current
            return (
              <li key={optionValue}>
                <button
                  type="button"
                  className={active ? 'font-field__option is-active' : 'font-field__option'}
                  style={{
                    fontFamily: isFontId(optionValue) ? fontStack(optionValue) : undefined,
                  }}
                  onClick={() => {
                    setValue(optionValue)
                    setOpen(false)
                  }}
                >
                  {typeof option.label === 'string' ? option.label : optionValue}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
      <FieldDescription description={description} path={path} />
    </div>
  )
}
