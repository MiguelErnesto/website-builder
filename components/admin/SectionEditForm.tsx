'use client'

import type { Field } from 'payload'
import { Button, useConfig, useForm, useLocale, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { CarouselProducts } from '@/components/admin/CarouselProducts'
import { mediaThumb } from '@/lib/media'
import {
  fieldLabel,
  fieldsForSection,
  sectionTypeLabel,
  serializeSection,
  toRelId,
} from '@/lib/section-admin'

type MediaDoc = { id: number | string; title?: string; url?: string; thumbnailURL?: string; filename?: string }
type PageDoc = { id: number | string; title?: string }

function rec(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' ? (value as Record<string, unknown>) : {}
}

function stable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stable)
  if (value && typeof value === 'object') {
    const row = value as Record<string, unknown>
    return Object.keys(row)
      .sort()
      .reduce<Record<string, unknown>>((out, key) => {
        out[key] = stable(row[key])
        return out
      }, {})
  }
  return value
}

function cardDirty(current: Record<string, unknown>, base?: Record<string, unknown>) {
  if (!base) return true
  return JSON.stringify(stable(current)) !== JSON.stringify(stable(base))
}

function cardMap(cards: unknown) {
  const map: Record<string, Record<string, unknown>> = {}
  if (!Array.isArray(cards)) return map
  for (const item of cards) {
    const row = rec(item)
    const id = String(row.id || '')
    if (!id) continue
    map[id] = structuredClone(row)
  }
  return map
}

function allowed(field: Field, data: Record<string, unknown>) {
  const condition = field.admin && 'condition' in field.admin ? field.admin.condition : undefined
  if (typeof condition !== 'function') return true
  return condition(data, data) !== false
}

function FieldHeading({
  label,
  show,
}: {
  label: string
  show?: { checked: boolean; onChange: (next: boolean) => void }
}) {
  if (!show) return <span className="section-edit-field__label">{label}</span>
  return (
    <label className="section-edit-field__label section-edit-field__label--check">
      <input type="checkbox" checked={show.checked} onChange={(event) => show.onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  )
}
function UploadPicker({
  label,
  value,
  onChange,
  show,
  off = false,
  en = false,
  actionsBelow = false,
}: {
  label: string
  value: unknown
  onChange: (next: unknown) => void
  show?: { checked: boolean; onChange: (next: boolean) => void }
  off?: boolean
  en?: boolean
  actionsBelow?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<MediaDoc[]>([])
  const [resolved, setResolved] = useState<MediaDoc | null>(null)
  const src = mediaThumb(value) || mediaThumb(resolved)
  const valueId = toRelId(value)

  useEffect(() => {
    if (mediaThumb(value) || valueId == null || valueId === '') {
      setResolved(null)
      return
    }
    let cancelled = false
    fetch(`/api/media/${valueId}?depth=0`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc) => {
        if (!cancelled && doc && typeof doc === 'object') setResolved(doc as MediaDoc)
      })
      .catch(() => null)
    return () => {
      cancelled = true
    }
  }, [value, valueId])

  useEffect(() => {
    if (!open) return
    fetch('/api/media?limit=40&depth=0&sort=-createdAt', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && Array.isArray(json.docs)) setItems(json.docs)
      })
      .catch(() => null)
  }, [open])

  return (
    <div className={`section-edit-field section-edit-field--upload${off ? ' is-off' : ''}`}>
      <FieldHeading label={label} show={show} />
      <div className={`section-edit-upload${actionsBelow ? ' section-edit-upload--below' : ''}`}>
        <span className="section-edit-upload__frame">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" />
          ) : (
            <span className="section-edit-upload__ph" />
          )}
          {value != null && value !== '' ? (
            <button
              className="section-edit-upload__clear"
              type="button"
              aria-label="Quitar"
              disabled={off}
              onClick={() => onChange(null)}
            >
              ×
            </button>
          ) : null}
        </span>
        <div className="section-edit-upload__actions">
          <Button
            buttonStyle="secondary"
            disabled={off}
            el="button"
            onClick={() => setOpen((v) => !v)}
            size="small"
            type="button"
          >
            {src ? (en ? 'Change' : 'Cambiar') : 'Elegir'}
          </Button>
        </div>
      </div>
      {open ? (
        <ul className="section-edit-media">
          {items.map((item) => {
            const thumb = mediaThumb(item)
            return (
              <li key={String(item.id)}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(item)
                    setOpen(false)
                  }}
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumb} alt={item.title || item.filename || ''} />
                  ) : (
                    <span>{item.title || item.filename || item.id}</span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

function ShapeIcon({ shape }: { shape: string }) {
  if (shape === 'circle') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="5" />
      </svg>
    )
  }
  if (shape === 'oval') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <ellipse cx="8" cy="8" rx="6" ry="3.5" />
      </svg>
    )
  }
  if (shape === 'portrait') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="5" y="2" width="6" height="12" />
      </svg>
    )
  }
  if (shape === 'landscape') {
    return (
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <rect x="1.5" y="5" width="13" height="6" />
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3" y="3" width="10" height="10" />
    </svg>
  )
}

function AlignIcon({ align }: { align: string }) {
  const bars =
    align === 'right'
      ? [
          [2, 1, 15],
          [8, 6, 9],
          [4, 11, 13],
        ]
      : align === 'center'
        ? [
            [2, 1, 15],
            [4, 6, 11],
            [3, 11, 13],
          ]
        : align === 'justify'
          ? [
              [1, 1, 16],
              [1, 6, 16],
              [1, 11, 16],
            ]
          : [
              [1, 1, 15],
              [1, 6, 9],
              [1, 11, 13],
            ]
  return (
    <svg viewBox="0 0 18 14" aria-hidden="true">
      {bars.map(([x, y, width]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width={width} height="2" rx="0.4" />
      ))}
    </svg>
  )
}

function textAlignValue(
  value: unknown,
  fallback: 'left' | 'center' | 'right' | 'justify' = 'left',
): 'left' | 'center' | 'right' | 'justify' {
  return value === 'left' || value === 'center' || value === 'right' || value === 'justify' ? value : fallback
}

function hexColor(value: unknown, fallback = '#ffffff') {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback
}

function letterStroke(selected: string, background = '#ffffff') {
  const lum = (hex: string) => {
    const n = Number.parseInt(hex.slice(1), 16)
    const channel = (c: number) => {
      const s = c / 255
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    }
    return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255)
  }
  const contrast = (a: string, b: string) => {
    const hi = Math.max(lum(a), lum(b))
    const lo = Math.min(lum(a), lum(b))
    return (hi + 0.05) / (lo + 0.05)
  }
  let best = '#111111'
  let score = -1
  for (const color of ['#111111', '#ffffff', '#b42318', '#175cd3', '#b54708']) {
    const next = Math.min(contrast(color, selected), contrast(color, background))
    if (next > score) {
      score = next
      best = color
    }
  }
  return best
}

function ColorMark({
  value,
  disabled,
  label,
  onChange,
}: {
  value: string
  disabled?: boolean
  label: string
  onChange: (next: string) => void
}) {
  return (
    <label className="section-edit-color" title={label}>
      <span
        aria-hidden="true"
        style={{ color: value, WebkitTextStroke: `1px ${letterStroke(value)}`, paintOrder: 'stroke fill' }}
      >
        A
      </span>
      <input type="color" aria-label={label} disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}

function AlignButtons({
  value,
  fallback = 'left',
  disabled,
  en,
  label,
  inline = false,
  justify = false,
  onChange,
}: {
  value: unknown
  fallback?: 'left' | 'center' | 'right' | 'justify'
  disabled?: boolean
  en: boolean
  label: string
  inline?: boolean
  justify?: boolean
  onChange: (next: 'left' | 'center' | 'right' | 'justify') => void
}) {
  const current = textAlignValue(value, fallback)
  const options = justify ? (['left', 'center', 'justify', 'right'] as const) : (['left', 'center', 'right'] as const)
  return (
    <div className={`section-edit-text-align${inline ? ' section-edit-text-align--inline' : ''}`}>
      <div className="section-edit-align" role="group" aria-label={label}>
        {options.map((optionValue) => {
          const on = current === optionValue
          const optionLabel =
            optionValue === 'center'
              ? en
                ? 'Center'
                : 'Centro'
              : optionValue === 'right'
                ? en
                  ? 'Right'
                  : 'Derecha'
                : optionValue === 'justify'
                  ? en
                    ? 'Justify'
                    : 'Justificar'
                  : en
                    ? 'Left'
                    : 'Izquierda'
          return (
            <button
              key={optionValue}
              type="button"
              className={on ? 'is-on' : ''}
              disabled={disabled}
              aria-pressed={on}
              aria-label={optionLabel}
              title={optionLabel}
              onClick={() => onChange(optionValue)}
            >
              <AlignIcon align={optionValue} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function fontSizeValue(value: unknown, fallback: 'sm' | 'md' | 'lg' | 'xl'): 'sm' | 'md' | 'lg' | 'xl' {
  return value === 'sm' || value === 'md' || value === 'lg' || value === 'xl' ? value : fallback
}

function FontSizeSelect({
  value,
  fallback,
  disabled,
  en,
  onChange,
}: {
  value: unknown
  fallback: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  en: boolean
  onChange: (next: 'sm' | 'md' | 'lg' | 'xl') => void
}) {
  const current = fontSizeValue(value, fallback)
  const label = (size: string) =>
    size === 'sm' ? (en ? 'Small' : 'Pequeño') : size === 'lg' ? (en ? 'Large' : 'Grande') : size === 'xl' ? (en ? 'Extra large' : 'Muy grande') : en ? 'Medium' : 'Mediano'
  return (
    <select
      className="section-edit-size"
      aria-label={en ? 'Font size' : 'Tamaño de letra'}
      disabled={disabled}
      value={current}
      onChange={(event) => onChange(fontSizeValue(event.target.value, fallback))}
    >
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <option key={size} value={size}>
          {label(size)}
        </option>
      ))}
    </select>
  )
}

function yAlignValue(value: unknown, fallback: 'top' | 'center' | 'bottom' = 'bottom'): 'top' | 'center' | 'bottom' {
  return value === 'top' || value === 'center' || value === 'bottom' ? value : fallback
}

function AlignVButtons({
  value,
  fallback = 'bottom',
  disabled,
  en,
  label,
  inline = false,
  onChange,
}: {
  value: unknown
  fallback?: 'top' | 'center' | 'bottom'
  disabled?: boolean
  en: boolean
  label: string
  inline?: boolean
  onChange: (next: 'top' | 'center' | 'bottom') => void
}) {
  const current = yAlignValue(value, fallback)
  return (
    <div className={`section-edit-text-align${inline ? ' section-edit-text-align--inline' : ''}`}>
      <div className="section-edit-align" role="group" aria-label={label}>
        {(['top', 'center', 'bottom'] as const).map((optionValue) => {
          const on = current === optionValue
          const optionLabel =
            optionValue === 'top' ? (en ? 'Top' : 'Arriba') : optionValue === 'bottom' ? (en ? 'Bottom' : 'Abajo') : en ? 'Center' : 'Centro'
          return (
            <button
              key={optionValue}
              type="button"
              className={on ? 'is-on' : ''}
              disabled={disabled}
              aria-pressed={on}
              aria-label={optionLabel}
              title={optionLabel}
              onClick={() => onChange(optionValue)}
            >
              <AlignVIcon align={optionValue} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

function AlignVIcon({ align }: { align: string }) {
  const y = align === 'bottom' ? 8 : align === 'center' ? 4 : 1
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="2" y={y} width="12" height="1.7" rx="0.3" />
      <rect x="4" y={y + 3} width="8" height="1.7" rx="0.3" />
      <rect x="3" y={y + 6} width="10" height="1.7" rx="0.3" />
    </svg>
  )
}
function RowActions({
  corner,
  rowIndex,
  total,
  removeLabel,
  onUp,
  onDown,
  onRemove,
  iconRemove = false,
}: {
  corner?: boolean
  rowIndex: number
  total: number
  removeLabel: string
  onUp: () => void
  onDown: () => void
  onRemove: () => void
  iconRemove?: boolean
}) {
  return (
    <div className={`section-edit-array__move${corner ? ' section-edit-array__move--corner' : ''}`}>
      {iconRemove ? (
        <button
          className="section-edit-array__icon"
          type="button"
          aria-label="Subir"
          disabled={rowIndex === 0}
          onClick={onUp}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 2.2 L9.6 8.2 H2.4 Z" />
          </svg>
        </button>
      ) : (
        <Button buttonStyle="none" el="button" disabled={rowIndex === 0} onClick={onUp} size="small" type="button">
          ↑
        </Button>
      )}
      {iconRemove ? (
        <button
          className="section-edit-array__icon"
          type="button"
          aria-label="Bajar"
          disabled={rowIndex === total - 1}
          onClick={onDown}
        >
          <svg viewBox="0 0 12 12" aria-hidden="true">
            <path d="M6 9.8 L2.4 3.8 H9.6 Z" />
          </svg>
        </button>
      ) : (
        <Button
          buttonStyle="none"
          el="button"
          disabled={rowIndex === total - 1}
          onClick={onDown}
          size="small"
          type="button"
        >
          ↓
        </Button>
      )}
      <button className="section-edit-array__remove" type="button" aria-label={removeLabel} onClick={onRemove}>
        {iconRemove ? '×' : removeLabel}
      </button>
    </div>
  )
}

function Fields({
  fields,
  data,
  onChange,
  en,
  pages,
  inCard = false,
  alignText = false,
  alignTitle = false,
  onSaveCard,
  onCancelCard,
  onRemoveCard,
  onCardsPerRow,
  cardBaselines = {},
  savingCard = '',
  onHeroSetting,
  savingHero = {},
  onSaveAll,
  saveAllLabel = '',
  saveAllDisabled = false,
}: {
  fields: Field[]
  data: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  en: boolean
  pages: PageDoc[]
  inCard?: boolean
  alignText?: boolean
  alignTitle?: boolean
  onSaveCard?: (card: Record<string, unknown>) => Promise<void>
  onCancelCard?: (cardId: string) => void
  onRemoveCard?: (cardId: string) => void
  onCardsPerRow?: (count: number) => void
  cardBaselines?: Record<string, Record<string, unknown>>
  savingCard?: string
  onHeroSetting?: (patch: Record<string, unknown>) => void
  savingHero?: Record<string, boolean>
  onSaveAll?: () => void
  saveAllLabel?: string
  saveAllDisabled?: boolean
}) {
  const set = (name: string, value: unknown) => onChange({ ...data, [name]: value })
  const boxClass = (field: Field, extra = '') => {
    const fromAdmin =
      field.admin && 'className' in field.admin && typeof field.admin.className === 'string'
        ? field.admin.className
        : ''
    return ['section-edit-field', extra, fromAdmin].filter(Boolean).join(' ')
  }
  const partKey = (fieldName: string) => {
    if (fieldName === 'image' || fieldName === 'imageAlign' || fieldName === 'imageAlignY' || fieldName === 'imageShape') return 'showImage'
    if (fieldName === 'title') return 'showTitle'
    if (fieldName === 'subtitle') return 'showSubtitle'
    if (fieldName === 'text' || fieldName === 'textAlign') return 'showText'
    if (fieldName === 'footer') return 'showFooter'
    if (fieldName === 'buttonLabel' || fieldName === 'buttonPage' || fieldName === 'buttonAlign') return 'showButton'
    if (fieldName === 'cta' || fieldName === 'ctaPage') return 'showCta'
    return ''
  }
  const heroKey = (fieldName: string) => {
    if (data.blockType !== 'hero' || inCard) return ''
    if (fieldName === 'title') return 'showTitle'
    if (fieldName === 'lead') return 'showLead'
    if (fieldName === 'cta') return 'showCta'
    if (fieldName === 'searchPlaceholder') return 'showSearch'
    if (fieldName === 'image') return 'showImage'
    return ''
  }
  const showFor = (fieldName: string) => {
    const withBox =
      fieldName === 'image' ||
      fieldName === 'title' ||
      fieldName === 'subtitle' ||
      fieldName === 'text' ||
      fieldName === 'footer' ||
      fieldName === 'cta'
    const key = inCard ? partKey(fieldName) : heroKey(fieldName) || (data.blockType === 'extra' && fieldName === 'title' ? 'showTitle' : '')
    if (!key || (inCard && !withBox)) return undefined
    if (!inCard && !heroKey(fieldName) && !(data.blockType === 'extra' && fieldName === 'title')) return undefined
    const current = data[key]
    return {
      checked: typeof current === 'boolean' ? current : true,
      onChange: (next: boolean) => set(key, next),
    }
  }
  const partOff = (fieldName: string) => {
    const key = inCard ? partKey(fieldName) : heroKey(fieldName)
    if (inCard) return Boolean(key) && data[key] === false
    if (data.blockType === 'extra' && fieldName === 'title') return data.showTitle === false
    if (data.blockType === 'hero' && (fieldName === 'ctaPage' || fieldName === 'ctaHref')) return data.showCta === false
    return Boolean(key) && data[key] === false
  }

  return (
    <>
      {fields.map((field, index) => {
        if (!allowed(field, data)) return null
        if (field.type === 'row' && 'fields' in field) {
          const rowClass =
            field.admin && 'className' in field.admin && typeof field.admin.className === 'string'
              ? field.admin.className
              : ''
          if (!inCard && data.blockType === 'hero' && rowClass.includes('section-edit-row--hero-cta')) return null
          const ctaTools = alignTitle && rowClass.includes('section-edit-row--hero-slide-cta')
          const ctaOff = data.showCta === false
          const rowFields = (
            <Fields
              fields={field.fields}
              data={data}
              onChange={onChange}
              en={en}
              pages={pages}
              inCard={inCard}
              alignText={alignText}
              alignTitle={alignTitle}
            />
          )
          if (inCard && rowClass.includes('section-edit-row--button')) {
            const buttonOn = data.showButton !== false
            return (
              <div className="section-edit-button" key={`row-${index}`}>
                <FieldHeading
                  label={en ? 'Button' : 'Botón'}
                  show={{ checked: buttonOn, onChange: (next) => set('showButton', next) }}
                />
                <div className={`section-edit-row ${rowClass}`}>{rowFields}</div>
              </div>
            )
          }
          if (!ctaTools) {
            return (
              <div className={`section-edit-row${rowClass ? ` ${rowClass}` : ''}`} key={`row-${index}`}>
                {rowFields}
              </div>
            )
          }
          return (
            <div className="section-edit-cta" key={`row-${index}`}>
              <div className={`section-edit-row${rowClass ? ` ${rowClass}` : ''}`}>{rowFields}</div>
              <div className="section-edit-text-tools section-edit-text-tools--cta">
                <ColorMark
                  value={hexColor(data.ctaColor, '#cc9999')}
                  disabled={ctaOff}
                  label={en ? 'Button color' : 'Color del botón'}
                  onChange={(next) => set('ctaColor', next)}
                />
                <FontSizeSelect
                  value={data.ctaSize}
                  fallback="md"
                  disabled={ctaOff}
                  en={en}
                  onChange={(next) => set('ctaSize', next)}
                />
                <AlignButtons
                  value={data.ctaAlign}
                  fallback="center"
                  disabled={ctaOff}
                  en={en}
                  label={en ? 'Button alignment' : 'Alineación del botón'}
                  onChange={(next) => set('ctaAlign', next)}
                />
                <AlignVButtons
                  value={data.ctaAlignY}
                  disabled={ctaOff}
                  en={en}
                  label={en ? 'Vertical alignment' : 'Alineación vertical'}
                  onChange={(next) => set('ctaAlignY', next)}
                />
              </div>
            </div>
          )
        }
        if (field.type === 'ui') {
          return field.name === 'productThumbs' ? <CarouselProducts key="thumbs" /> : null
        }
        if (!('name' in field) || !field.name) return null
        const name = field.name
        if (
          name === 'imageAlignY' ||
          name === 'subtitleAlign' ||
          name === 'footerAlign' ||
          name === 'textAlign' ||
          name === 'textAlignY' ||
          name === 'titleAlign' ||
          name === 'titleAlignY' ||
          name === 'titleSize' ||
          name === 'titleColor' ||
          name === 'textColor' ||
          name === 'textSize' ||
          name === 'ctaAlign' ||
          name === 'ctaAlignY' ||
          name === 'ctaSize' ||
          name === 'ctaColor' ||
          name === 'cardsPerRow' ||
          name === 'layout'
        )
          return null
        if (!inCard && data.blockType === 'hero' && (name === 'slideTransition' || name === 'slideDuration' || name === 'showSlideNav' || name === 'lead' || name === 'searchPlaceholder' || name === 'title')) return null
        const label = fieldLabel(field.label, en) || name
        const value = data[name]

        if (field.type === 'checkbox') {
          if (inCard && name.startsWith('show')) return null
          if (!inCard && data.blockType === 'hero' && (name.startsWith('show') || name === 'visible')) return null
          if (!inCard && name === 'showTitle' && data.blockType === 'extra') return null
          return (
            <label className="section-edit-check" key={name}>
              <input
                type="checkbox"
                checked={typeof value === 'boolean' ? value : field.defaultValue !== false}
                onChange={(event) => set(name, event.target.checked)}
              />
              <span>{label}</span>
            </label>
          )
        }
        const show = showFor(name)
        const off = partOff(name)
        const mark = (extra = '') => `${boxClass(field, extra)}${off ? ' is-off' : ''}`
        const Wrap = show ? 'div' : 'label'
        if (field.type === 'textarea') {
          return (
            <Wrap className={mark()} key={name}>
              <FieldHeading label={label} show={show} />
              <textarea
                rows={name === 'text' ? (inCard ? 5 : 7) : 4}
                disabled={off}
                value={typeof value === 'string' ? value : ''}
                onChange={(event) => set(name, event.target.value)}
              />
              {alignText && name === 'text' ? (
                <div className="section-edit-text-tools section-edit-text-tools--body">
                  {alignTitle ? (
                    <ColorMark
                      value={hexColor(data.textColor)}
                      disabled={off}
                      label={en ? 'Text color' : 'Color del texto'}
                      onChange={(next) => set('textColor', next)}
                    />
                  ) : null}
                  {alignTitle ? (
                    <FontSizeSelect
                      value={data.textSize}
                      fallback="md"
                      disabled={off}
                      en={en}
                      onChange={(next) => set('textSize', next)}
                    />
                  ) : null}
                  <AlignButtons
                    justify={!alignTitle}
                    value={data.textAlign}
                    fallback={alignTitle ? 'center' : 'left'}
                    disabled={off}
                    en={en}
                    label={en ? 'Text alignment' : 'Alineación del texto'}
                    onChange={(next) => set('textAlign', next)}
                  />
                  {alignTitle ? (
                    <AlignVButtons
                      value={data.textAlignY}
                      disabled={off}
                      en={en}
                      label={en ? 'Vertical alignment' : 'Alineación vertical'}
                      onChange={(next) => set('textAlignY', next)}
                    />
                  ) : null}
                </div>
              ) : null}
            </Wrap>
          )
        }
        if (field.type === 'text') {
          const TitleWrap = show ? 'div' : Wrap
          const titleColor = alignTitle && name === 'title' ? hexColor(data.titleColor) : ''
          return (
            <TitleWrap className={`${boxClass(field, show && name === 'title' ? 'section-edit-field--title' : '')}${off ? ' is-off' : ''}`} key={name}>
              <FieldHeading label={label} show={show} />
              {alignText && !alignTitle && (name === 'subtitle' || name === 'footer') ? (
                <div className="section-edit-input-line">
                  <input
                    type="text"
                    disabled={off}
                    value={typeof value === 'string' ? value : ''}
                    onChange={(event) => set(name, event.target.value)}
                  />
                  <AlignButtons
                    inline
                    value={name === 'subtitle' ? data.subtitleAlign : data.footerAlign}
                    fallback="left"
                    disabled={off}
                    en={en}
                    label={en ? 'Alignment' : 'Alineación'}
                    onChange={(next) => set(name === 'subtitle' ? 'subtitleAlign' : 'footerAlign', next)}
                  />
                </div>
              ) : (
                <input
                  type="text"
                  disabled={off}
                  value={typeof value === 'string' ? value : ''}
                  onChange={(event) => set(name, event.target.value)}
                />
              )}
              {alignTitle && name === 'title' ? (
                <div className="section-edit-text-tools">
                  <ColorMark
                    value={titleColor}
                    disabled={off}
                    label={en ? 'Title color' : 'Color del título'}
                    onChange={(next) => set('titleColor', next)}
                  />
                  <FontSizeSelect
                    value={data.titleSize}
                    fallback="lg"
                    disabled={off}
                    en={en}
                    onChange={(next) => set('titleSize', next)}
                  />
                  <AlignButtons
                    value={data.titleAlign}
                    fallback="center"
                    disabled={off}
                    en={en}
                    label={en ? 'Title alignment' : 'Alineación del título'}
                    onChange={(next) => set('titleAlign', next)}
                  />
                  <AlignVButtons
                    value={data.titleAlignY}
                    disabled={off}
                    en={en}
                    label={en ? 'Vertical alignment' : 'Alineación vertical'}
                    onChange={(next) => set('titleAlignY', next)}
                  />
                </div>
              ) : null}
            </TitleWrap>
          )
        }
        if (field.type === 'number') {
          const numeric = typeof value === 'number' ? value : Number(field.defaultValue ?? '')
          return (
            <label className={boxClass(field)} key={name}>
              <span className="section-edit-field__label">{label}</span>
              <input
                type="number"
                min={typeof field.min === 'number' ? field.min : undefined}
                step={1}
                value={Number.isFinite(numeric) ? numeric : ''}
                onChange={(event) => {
                  const raw = event.target.value
                  set(name, raw === '' ? '' : Number(raw))
                }}
              />
            </label>
          )
        }
        if (field.type === 'select') {
          const options = (field.options || []).map((option) =>
            typeof option === 'string' ? { label: option, value: option } : option,
          )
          if (name === 'imageShape') {
            const shapes = [
              ['square', en ? 'Square' : 'Cuadrado'],
              ['oval', en ? 'Oval' : 'Ovalado'],
              ['circle', en ? 'Circle' : 'Circular'],
              ['portrait', en ? 'Vertical rectangle' : 'Rectangular vertical'],
              ['landscape', en ? 'Horizontal rectangle' : 'Rectangular horizontal'],
            ] as const
            const current = typeof value === 'string' ? value : 'landscape'
            return (
              <div className={mark('section-edit-field--shape')} key={name}>
                <FieldHeading label={label} />
                <div className="section-edit-shapes" role="group" aria-label={label}>
                  {[shapes.slice(0, 3), shapes.slice(3)].map((row) => (
                    <div className="section-edit-shapes__row" key={row[0][0]}>
                      {row.map(([optionValue, optionLabel]) => (
                        <button
                          key={optionValue}
                          type="button"
                          className={current === optionValue ? 'is-on' : ''}
                          disabled={off}
                          aria-pressed={current === optionValue}
                          aria-label={optionLabel}
                          title={optionLabel}
                          onClick={() => set(name, optionValue)}
                        >
                          <ShapeIcon shape={optionValue} />
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )
          }
          if (name === 'imageAlign' || name === 'buttonAlign') {
            const current = typeof value === 'string' ? value : String(field.defaultValue || 'left')
            return (
              <div className={mark('section-edit-field--align')} key={name}>
                <FieldHeading label={label} />
                <div className="section-edit-align" role="group" aria-label={label}>
                  {options.map((option) => {
                    const optionValue = String(option.value)
                    const optionLabel = fieldLabel(option.label, en) || optionValue
                    const on = current === optionValue
                    return (
                      <button
                        key={optionValue}
                        type="button"
                        className={on ? 'is-on' : ''}
                        disabled={off}
                        aria-pressed={on}
                        aria-label={optionLabel}
                        title={optionLabel}
                        onClick={() => set(name, optionValue)}
                      >
                        <AlignIcon align={optionValue} />
                      </button>
                    )
                  })}
                </div>
                {name === 'imageAlign' ? (
                  <div className="section-edit-align" role="group" aria-label={en ? 'Vertical alignment' : 'Alineación vertical'}>
                    {(['top', 'center', 'bottom'] as const).map((optionValue) => {
                      const currentY = data.imageAlignY === 'top' || data.imageAlignY === 'bottom' ? data.imageAlignY : 'center'
                      const on = currentY === optionValue
                      const optionLabel =
                        optionValue === 'top'
                          ? en
                            ? 'Top'
                            : 'Arriba'
                          : optionValue === 'bottom'
                            ? en
                              ? 'Bottom'
                              : 'Abajo'
                            : en
                              ? 'Center'
                              : 'Centro'
                      return (
                        <button
                          key={optionValue}
                          type="button"
                          className={on ? 'is-on' : ''}
                          disabled={off}
                          aria-pressed={on}
                          aria-label={optionLabel}
                          title={optionLabel}
                          onClick={() => set('imageAlignY', optionValue)}
                        >
                          <AlignVIcon align={optionValue} />
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          }
          return (
            <Wrap className={mark()} key={name}>
              <FieldHeading label={label} show={show} />
              <select
                disabled={off}
                value={typeof value === 'string' ? value : String(field.defaultValue || '')}
                onChange={(event) => set(name, event.target.value)}
              >
                {options.map((option) => (
                  <option key={String(option.value)} value={String(option.value)}>
                    {fieldLabel(option.label, en) || String(option.value)}
                  </option>
                ))}
              </select>
            </Wrap>
          )
        }
        if (field.type === 'upload') {
          return (
            <UploadPicker
              key={name}
              actionsBelow={alignText && !alignTitle}
              en={en}
              label={label}
              off={off}
              show={show}
              value={value}
              onChange={(next) => set(name, next)}
            />
          )
        }
        if (field.type === 'relationship') {
          return (
            <Wrap className={mark()} key={name}>
              <FieldHeading label={label} show={show} />
              <select
                disabled={off}
                value={String(toRelId(value) ?? '')}
                onChange={(event) => {
                  const raw = event.target.value
                  if (!raw) set(name, null)
                  else set(name, /^\d+$/.test(raw) ? Number(raw) : raw)
                }}
              >
                <option value="">{en ? 'None' : 'Ninguna'}</option>
                {pages.map((page) => (
                  <option key={String(page.id)} value={String(page.id)}>
                    {page.title || page.id}
                  </option>
                ))}
              </select>
            </Wrap>
          )
        }
        if (field.type === 'array' && 'fields' in field) {
          const rows = Array.isArray(value) ? value : []
          const isExtraCards =
            name === 'cards' && field.fields.some((item) => 'name' in item && item.name === 'showSubtitle')
          const isHeroSlides = name === 'slides' && data.blockType === 'hero'
          const isCards = isExtraCards || isHeroSlides
          const perRowRaw = Number(data.cardsPerRow)
          const perRow = Number.isFinite(perRowRaw) && perRowRaw >= 1 ? Math.floor(perRowRaw) : 3
          return (
            <div className={`section-edit-array${isCards ? ' section-edit-array--cards' : ''}${isHeroSlides ? ' section-edit-array--hero section-edit-array--extra' : ''}${isExtraCards ? ' section-edit-array--extra' : ''}`} key={name}>
              {isHeroSlides ? null : (
                <div className="section-edit-array__head">
                  {isExtraCards ? (
                    <label className="section-edit-count">
                      <span>{en ? 'Number of cards across in the section' : 'Cantidad de tarjetas de ancho en la sección'}</span>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        value={perRow}
                        onChange={(event) => {
                          const next = Math.max(1, Math.floor(Number(event.target.value) || 1))
                          set('cardsPerRow', next)
                          onCardsPerRow?.(next)
                        }}
                      />
                    </label>
                  ) : (
                    <span className="section-edit-field__label">
                      {('labels' in field && fieldLabel(field.labels?.plural, en)) || label}
                    </span>
                  )}
                  <Button
                    buttonStyle="secondary"
                    el="button"
                    onClick={() => set(name, [...rows, { id: crypto.randomUUID() }])}
                    size="small"
                    type="button"
                  >
                    {isCards ? (en ? 'Add card' : 'Añadir tarjeta') : en ? 'Add' : 'Añadir'}
                  </Button>
                </div>
              )}
              {isHeroSlides ? (
                <div className="section-edit-hero-tools">
                  <label className="section-edit-field">
                    <span className="section-edit-field__label">
                      {en ? 'Transition' : 'Transición'}
                      {savingHero.slideTransition ? (
                        <span className="section-edit-saving">{en ? 'Saving...' : 'Guardando...'}</span>
                      ) : null}
                    </span>
                    <select
                      value={typeof data.slideTransition === 'string' ? data.slideTransition : 'fade'}
                      onChange={(event) => onHeroSetting?.({ slideTransition: event.target.value })}
                    >
                      <option value="fade">{en ? 'Fade' : 'Fundido'}</option>
                      <option value="slide">{en ? 'Slide' : 'Deslizar'}</option>
                      <option value="slide-left">{en ? 'Slide left' : 'Deslizar a la izquierda'}</option>
                      <option value="rise">{en ? 'Rise' : 'Subir'}</option>
                      <option value="zoom">Zoom</option>
                      <option value="none">{en ? 'Cut' : 'Corte'}</option>
                    </select>
                  </label>
                  <label className="section-edit-field">
                    <span className="section-edit-field__label">
                      {en ? 'Duration in seconds' : 'Duración en segundos'}
                      {savingHero.slideDuration ? (
                        <span className="section-edit-saving">{en ? 'Saving...' : 'Guardando...'}</span>
                      ) : null}
                    </span>
                    <input
                      type="number"
                      min={1}
                      step={1}
                      value={Number.isFinite(Number(data.slideDuration)) ? Number(data.slideDuration) : 6}
                      onChange={(event) => {
                        const raw = event.target.value
                        const next = raw === '' ? '' : Number(raw)
                        set('slideDuration', next)
                        if (typeof next === 'number' && next >= 1) onHeroSetting?.({ slideDuration: next })
                      }}
                    />
                  </label>
                  <label className="section-edit-hero-tools__nav">
                    <input
                      type="checkbox"
                      checked={data.showSlideNav !== false}
                      onChange={(event) => onHeroSetting?.({ showSlideNav: event.target.checked })}
                    />
                    <span>
                      {en ? 'Navigation between images' : 'Navegación entre imágenes'}
                      <span className={`section-edit-saving${savingHero.showSlideNav ? '' : ' is-idle'}`}>
                        {en ? 'Saving...' : 'Guardando...'}
                      </span>
                    </span>
                  </label>
                  <div className="section-edit-hero-tools__add">
                    <Button
                      buttonStyle="secondary"
                      el="button"
                      onClick={() => set(name, [...rows, { id: crypto.randomUUID() }])}
                      size="small"
                      type="button"
                    >
                      {en ? 'Add card' : 'Añadir tarjeta'}
                    </Button>
                  </div>
                  {onSaveAll ? (
                    <div className="section-edit-hero-tools__save">
                      <Button
                        buttonStyle="primary"
                        className="section-edit-save-all"
                        disabled={saveAllDisabled}
                        el="button"
                        onClick={onSaveAll}
                        type="button"
                      >
                        {saveAllLabel}
                      </Button>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className="section-edit-array__rows">
              {rows.map((row, rowIndex) => {
                const removeLabel = isCards ? (en ? 'Delete' : 'Eliminar') : en ? 'Remove' : 'Quitar'
                const onUp = () => {
                  const copy = rows.slice()
                  const [item] = copy.splice(rowIndex, 1)
                  copy.splice(rowIndex - 1, 0, item)
                  set(name, copy)
                }
                const onDown = () => {
                  const copy = rows.slice()
                  const [item] = copy.splice(rowIndex, 1)
                  copy.splice(rowIndex + 1, 0, item)
                  set(name, copy)
                }
                const onRemove = () => {
                  if (isCards && !window.confirm(en ? 'Delete this card?' : '¿Eliminar esta tarjeta?')) return
                  const cardId = String(rowData.id || '')
                  if (isCards && cardId && cardBaselines[cardId]) {
                    void onRemoveCard?.(cardId)
                    return
                  }
                  set(name, rows.filter((_, i) => i !== rowIndex))
                }
                const rowData = rec(row)
                const cardOff = isCards && rowData.visible === false
                const cardFields = isCards
                  ? field.fields.filter((item) => !('name' in item) || item.name !== 'visible')
                  : field.fields
                return (
                  <div
                    className={`section-edit-array__row${cardOff ? ' is-off' : ''}`}
                    key={String(rowData.id || rowIndex)}
                  >
                    {isCards ? (
                      <div className="section-edit-array__head-card">
                        <span className="section-edit-switch-row">
                          <button
                            className={`section-edit-switch${rowData.visible !== false ? ' is-on' : ''}`}
                            type="button"
                            aria-pressed={rowData.visible !== false}
                            onClick={() => {
                              const copy = rows.slice()
                              copy[rowIndex] = { ...rowData, visible: rowData.visible === false }
                              set(name, copy)
                            }}
                          />
                          <span>Visible</span>
                        </span>
                        <RowActions
                          corner
                          iconRemove
                          rowIndex={rowIndex}
                          total={rows.length}
                          removeLabel={removeLabel}
                          onUp={onUp}
                          onDown={onDown}
                          onRemove={onRemove}
                        />
                      </div>
                    ) : null}
                    <Fields
                      fields={cardFields}
                      data={rowData}
                      en={en}
                      pages={pages}
                      inCard={isCards}
                      alignText={isExtraCards || isHeroSlides}
                      alignTitle={isHeroSlides}
                      onChange={(next) => {
                        const copy = rows.slice()
                        copy[rowIndex] = next
                        set(name, copy)
                      }}
                    />
                    {isCards ? (
                      <div className="section-edit-array__foot">
                        <div className="section-edit-array__foot-actions">
                          {(() => {
                            const cardId = String(rowData.id || '')
                            const dirty = cardDirty(rowData, cardBaselines[cardId])
                            const busy = savingCard === String(rowData.id || rowIndex)
                            return (
                              <>
                                <Button
                                  buttonStyle="primary"
                                  disabled={!dirty || busy}
                                  el="button"
                                  onClick={() => void onSaveCard?.(rowData)}
                                  size="small"
                                  type="button"
                                >
                                  {busy ? (en ? 'Saving…' : 'Guardando…') : en ? 'Save' : 'Guardar'}
                                </Button>
                                <Button
                                  buttonStyle="secondary"
                                  className="section-edit-card-cancel"
                                  disabled={!dirty || busy}
                                  el="button"
                                  onClick={() => onCancelCard?.(cardId)}
                                  size="small"
                                  type="button"
                                >
                                  {en ? 'Cancel' : 'Cancelar'}
                                </Button>
                              </>
                            )
                          })()}
                        </div>
                        <RowActions
                          iconRemove
                          rowIndex={rowIndex}
                          total={rows.length}
                          removeLabel={removeLabel}
                          onUp={onUp}
                          onDown={onDown}
                          onRemove={onRemove}
                        />
                      </div>
                    ) : (
                      <RowActions
                        rowIndex={rowIndex}
                        total={rows.length}
                        removeLabel={removeLabel}
                        onUp={onUp}
                        onDown={onDown}
                        onRemove={onRemove}
                      />
                    )}
                  </div>
                )
              })}
              </div>
            </div>
          )
        }
        return null
      })}
    </>
  )
}

function pinSectionFlags(fields: Field[]) {
  const order = ['visible', 'showInMenu']
  const flags: Field[] = []
  const rest: Field[] = []
  for (const field of fields) {
    const name = 'name' in field ? field.name : ''
    if (order.includes(String(name))) flags.push(field)
    else rest.push(field)
  }
  flags.sort((a, b) => order.indexOf(String('name' in a && a.name)) - order.indexOf(String('name' in b && b.name)))
  return { flags, rest }
}

function asCards(section: Record<string, unknown>) {
  return section.blockType === 'extra' ? { ...section, layout: 'cards' } : section
}

function pickSection(list: unknown[], sectionId: string) {
  const byIndex = sectionId.startsWith('i-') ? Number(sectionId.slice(2)) : Number.NaN
  if (Number.isInteger(byIndex)) return { index: byIndex, row: list[byIndex] }
  const index = list.findIndex(
    (item) => item && typeof item === 'object' && String((item as { id?: unknown }).id) === sectionId,
  )
  return { index, row: index >= 0 ? list[index] : undefined }
}

export function SectionEditForm({ sectionId }: { sectionId: string }) {
  const { i18n } = useTranslation()
  const locale = useLocale()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const { dispatchFields, getData } = useForm()
  const en = i18n.language === 'en'
  const localeCode = locale.code || 'es'
  const refreshSection = (nextBlock: Record<string, unknown>) => {
    try {
      const data = getData()
      const sections = Array.isArray(data.sections) ? (data.sections as unknown[]).slice() : []
      const { index } = pickSection(sections, sectionId)
      if (index >= 0) sections[index] = nextBlock
      dispatchFields({ type: 'UPDATE', path: 'sections', value: sections, initialValue: sections })
    } catch {
      // the saved data is already stored
    }
  }
  const backHref = formatAdminURL({ adminRoute, path: '/globals/site' })
  const [block, setBlock] = useState<Record<string, unknown> | null>(null)
  const [pages, setPages] = useState<PageDoc[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingCard, setSavingCard] = useState('')
  const [cardBaselines, setCardBaselines] = useState<Record<string, Record<string, unknown>>>({})
  const [sectionBaseline, setSectionBaseline] = useState<Record<string, unknown> | null>(null)
  const perRowTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const motionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const motionRef = useRef<Record<string, unknown>>({})
  const motionGen = useRef<Record<string, number>>({})
  const [savingHero, setSavingHero] = useState<Record<string, boolean>>({})

  const load = useCallback(async () => {
    const res = await fetch(`/api/globals/site?depth=2&locale=${encodeURIComponent(localeCode)}`, {
      credentials: 'include',
    })
    if (!res.ok) throw new Error('load')
    const site = (await res.json()) as { sections?: unknown }
    const list = Array.isArray(site.sections) ? site.sections : []
    const { row } = pickSection(list, sectionId)
    if (!row || typeof row !== 'object') throw new Error('missing')
    const next = { ...(row as Record<string, unknown>) }
    if (next.blockType === 'extra') next.layout = 'cards'
    setBlock(next)
    setSectionBaseline(structuredClone(next))
    setCardBaselines(cardMap(next.blockType === 'hero' ? next.slides : next.cards))
  }, [localeCode, sectionId])

  useEffect(() => {
    load().catch(() => setError(en ? 'Section not found.' : 'Sección no encontrada.'))
  }, [en, load])

  useEffect(
    () => () => {
      if (perRowTimer.current) clearTimeout(perRowTimer.current)
      if (motionTimer.current) clearTimeout(motionTimer.current)
    },
    [],
  )

  useEffect(() => {
    fetch('/api/pages?limit=50&depth=0&sort=title', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && Array.isArray(json.docs)) setPages(json.docs)
      })
      .catch(() => null)
  }, [])

  const fields = useMemo(
    () => fieldsForSection(typeof block?.blockType === 'string' ? block.blockType : ''),
    [block?.blockType],
  )

  const saveCardsPerRow = (count: number) => {
    if (perRowTimer.current) clearTimeout(perRowTimer.current)
    perRowTimer.current = setTimeout(() => {
      void (async () => {
        try {
          const res = await fetch(`/api/globals/site?depth=0&locale=${encodeURIComponent(localeCode)}`, {
            credentials: 'include',
          })
          if (!res.ok) throw new Error('load')
          const site = (await res.json()) as { sections?: unknown }
          const list = Array.isArray(site.sections) ? site.sections : []
          const { index, row } = pickSection(list, sectionId)
          if (index < 0 || !row || typeof row !== 'object') throw new Error('missing')
          const sections = list.map((item, i) =>
            i === index ? serializeSection(asCards({ ...rec(row), cardsPerRow: count })) : serializeSection(rec(item)),
          )
          const savedRes = await fetch(`/api/globals/site?locale=${encodeURIComponent(localeCode)}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sections }),
          })
          if (!savedRes.ok) throw new Error('save')
          setSectionBaseline((prev) => (prev ? { ...prev, cardsPerRow: count, layout: prev.blockType === 'extra' ? 'cards' : prev.layout } : prev))
        } catch {
          setError(en ? 'Could not save the card count.' : 'No se pudo guardar la cantidad de tarjetas.')
        }
      })()
    }, 400)
  }

  const saveHeroSetting = (patch: Record<string, unknown>) => {
    motionRef.current = { ...motionRef.current, ...patch }
    const pending: Record<string, boolean> = {}
    for (const key of Object.keys(patch)) {
      motionGen.current[key] = (motionGen.current[key] || 0) + 1
      pending[key] = true
    }
    setSavingHero((prev) => ({ ...prev, ...pending }))
    setBlock((prev) => (prev ? { ...prev, ...patch } : prev))
    const run = () => {
      const latest = { ...motionRef.current }
      const gens = Object.fromEntries(Object.keys(latest).map((key) => [key, motionGen.current[key]]))
      void (async () => {
        try {
          const res = await fetch(`/api/globals/site?depth=0&locale=${encodeURIComponent(localeCode)}`, {
            credentials: 'include',
          })
          if (!res.ok) throw new Error('load')
          const site = (await res.json()) as { sections?: unknown }
          const list = Array.isArray(site.sections) ? site.sections : []
          const { index, row } = pickSection(list, sectionId)
          if (index < 0 || !row || typeof row !== 'object') throw new Error('missing')
          const sections = list.map((item, i) =>
            i === index ? serializeSection({ ...rec(row), ...latest }) : serializeSection(rec(item)),
          )
          const savedRes = await fetch(`/api/globals/site?locale=${encodeURIComponent(localeCode)}`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sections }),
          })
          if (!savedRes.ok) throw new Error('save')
          setSectionBaseline((prev) => (prev ? { ...prev, ...latest } : prev))
          if (block) refreshSection({ ...block, ...latest })
        } catch {
          setError(en ? 'Could not save.' : 'No se pudo guardar.')
        } finally {
          setSavingHero((prev) => {
            const next = { ...prev }
            for (const key of Object.keys(gens)) {
              if (motionGen.current[key] === gens[key]) next[key] = false
            }
            return next
          })
        }
      })()
    }
    if ('slideDuration' in patch) {
      if (motionTimer.current) clearTimeout(motionTimer.current)
      motionTimer.current = setTimeout(run, 400)
      return
    }
    run()
  }

  const saveCard = async (card: Record<string, unknown>) => {
    const cardId = String(card.id || '')
    setSavingCard(cardId)
    setError('')
    try {
      const res = await fetch(`/api/globals/site?depth=0&locale=${encodeURIComponent(localeCode)}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('load')
      const site = (await res.json()) as { sections?: unknown }
      const list = Array.isArray(site.sections) ? site.sections : []
      const { index, row } = pickSection(list, sectionId)
      if (index < 0 || !row || typeof row !== 'object') throw new Error('missing')
      const server = rec(row)
      const listKey = server.blockType === 'hero' ? 'slides' : 'cards'
      const cards = Array.isArray(server[listKey]) ? (server[listKey] as unknown[]).slice() : []
      const at = cards.findIndex((item) => String(rec(item).id) === cardId)
      if (at >= 0) cards[at] = card
      else cards.push(card)
      const sections = list.map((item, i) =>
        i === index ? serializeSection(asCards({ ...server, [listKey]: cards })) : serializeSection(rec(item)),
      )
      const savedRes = await fetch(`/api/globals/site?locale=${encodeURIComponent(localeCode)}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      })
      if (!savedRes.ok) throw new Error('save')
      setCardBaselines((prev) => ({ ...prev, [cardId]: structuredClone(card) }))
      setSectionBaseline((prev) => {
        if (!prev) return prev
        const listKey = prev.blockType === 'hero' ? 'slides' : 'cards'
        const cards = Array.isArray(prev[listKey]) ? (prev[listKey] as unknown[]).slice() : []
        const at = cards.findIndex((item) => String(rec(item).id) === cardId)
        if (at >= 0) cards[at] = structuredClone(card)
        else cards.push(structuredClone(card))
        return { ...prev, [listKey]: cards }
      })
      if (block) refreshSection(block)
    } catch {
      setError(en ? 'Could not save the card.' : 'No se pudo guardar la tarjeta.')
    } finally {
      setSavingCard('')
    }
  }

  const removeCard = async (cardId: string) => {
    if (!block) return
    const listKey = block.blockType === 'hero' ? 'slides' : 'cards'
    const rows = Array.isArray(block[listKey]) ? (block[listKey] as unknown[]) : []
    const nextBlock = { ...block, [listKey]: rows.filter((item) => String(rec(item).id) !== cardId) }
    setBlock(nextBlock)
    setError('')
    try {
      const res = await fetch(`/api/globals/site?depth=0&locale=${encodeURIComponent(localeCode)}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('load')
      const site = (await res.json()) as { sections?: unknown }
      const list = Array.isArray(site.sections) ? site.sections : []
      const { index, row } = pickSection(list, sectionId)
      if (index < 0 || !row || typeof row !== 'object') throw new Error('missing')
      const server = rec(row)
      const serverKey = server.blockType === 'hero' ? 'slides' : 'cards'
      const cards = (Array.isArray(server[serverKey]) ? (server[serverKey] as unknown[]) : []).filter(
        (item) => String(rec(item).id) !== cardId,
      )
      const sections = list.map((item, i) =>
        i === index ? serializeSection(asCards({ ...server, [serverKey]: cards })) : serializeSection(rec(item)),
      )
      const savedRes = await fetch(`/api/globals/site?locale=${encodeURIComponent(localeCode)}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      })
      if (!savedRes.ok) throw new Error('save')
      setCardBaselines((prev) => {
        const next = { ...prev }
        delete next[cardId]
        return next
      })
      setSectionBaseline((prev) => {
        if (!prev) return prev
        const key = prev.blockType === 'hero' ? 'slides' : 'cards'
        const current = Array.isArray(prev[key]) ? (prev[key] as unknown[]) : []
        return { ...prev, [key]: current.filter((item) => String(rec(item).id) !== cardId) }
      })
      refreshSection(nextBlock)
    } catch {
      setBlock(block)
      setError(en ? 'Could not delete the card.' : 'No se pudo eliminar la tarjeta.')
    }
  }

  const cancelCard = (cardId: string) => {
    const base = cardBaselines[cardId]
    setBlock((prev) => {
      if (!prev) return prev
      const listKey = prev.blockType === 'hero' ? 'slides' : 'cards'
      const rows = prev[listKey]
      if (!Array.isArray(rows)) return prev
      const next = base
        ? rows.map((item) => (String(rec(item).id) === cardId ? structuredClone(base) : item))
        : rows.filter((item) => String(rec(item).id) !== cardId)
      return { ...prev, [listKey]: next }
    })
  }

  const save = async () => {
    if (!block) return
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch(`/api/globals/site?depth=0&locale=${encodeURIComponent(localeCode)}`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('load')
      const site = (await res.json()) as { sections?: unknown }
      const list = Array.isArray(site.sections) ? site.sections : []
      const { index } = pickSection(list, sectionId)
      const sections = list.map((item, i) =>
        i === index ? serializeSection(asCards(block)) : serializeSection(rec(item)),
      )
      const savedRes = await fetch(`/api/globals/site?locale=${encodeURIComponent(localeCode)}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections }),
      })
      if (!savedRes.ok) throw new Error('save')
      setCardBaselines(cardMap(block.blockType === 'hero' ? block.slides : block.cards))
      setSectionBaseline(structuredClone(asCards(block)))
      setSaved(true)
    } catch {
      setError(en ? 'Could not save.' : 'No se pudo guardar.')
    } finally {
      setSaving(false)
    }
  }

  if (error && !block) {
    return (
      <div className="section-edit">
        <p>{error}</p>
        <a href={backHref}>{en ? 'Back to sections' : 'Volver a secciones'}</a>
      </div>
    )
  }

  if (!block) return <div className="section-edit">{en ? 'Loading…' : 'Cargando…'}</div>

  const type = typeof block.blockType === 'string' ? block.blockType : ''

  const sectionDirty = Boolean(block && sectionBaseline && cardDirty(block, sectionBaseline))
  const saveAllLabel = saving ? (en ? 'Saving…' : 'Guardando…') : en ? 'Save all' : 'Guardar todo'

  return (
    <div className={`section-edit${type === 'hero' ? ' section-edit--hero' : ''}`}>
      <div className="section-edit__head">
        <a href={backHref}>{en ? '← Sections' : '← Secciones'}</a>
        <h1>{sectionTypeLabel(type, en)}</h1>
      </div>
      {error ? <p className="section-edit__error">{error}</p> : null}
      {saved ? <p className="section-edit__ok">{en ? 'Saved.' : 'Guardado.'}</p> : null}
      {(() => {
        const { flags, rest } = pinSectionFlags(fields)
        const saveAll = () => (
          <Button
            buttonStyle="primary"
            className="section-edit-save-all"
            disabled={!sectionDirty || saving}
            el="button"
            onClick={() => void save()}
            type="button"
          >
            {saveAllLabel}
          </Button>
        )
        return (
          <>
            {type === 'hero' ? (
              <div className="section-edit-flags">
                <label className="section-edit-check">
                  <input
                    type="checkbox"
                    checked={block.showInMenu !== false}
                    onChange={(event) => saveHeroSetting({ showInMenu: event.target.checked })}
                  />
                  <span>
                    {en ? 'Show on the home page' : 'Mostrar en la página de Inicio'}
                    {savingHero.showInMenu ? (
                      <span className="section-edit-saving">{en ? 'Saving...' : 'Guardando...'}</span>
                    ) : null}
                  </span>
                </label>
              </div>
            ) : flags.length ? (
              <div className="section-edit-flags">
                <div className="section-edit-flags__checks">
                  {type === 'extra' ? (
                    <label className="section-edit-check">
                      <input
                        type="checkbox"
                        checked={block.showInMenu === true}
                        onChange={(event) => saveHeroSetting({ showInMenu: event.target.checked })}
                      />
                      <span>
                        {en ? 'Show in the navigation menu' : 'Mostrar en el menú de navegación'}
                        {savingHero.showInMenu ? (
                          <span className="section-edit-saving">{en ? 'Saving...' : 'Guardando...'}</span>
                        ) : null}
                      </span>
                    </label>
                  ) : (
                    <Fields fields={flags} data={block} en={en} onChange={setBlock} pages={pages} />
                  )}
                </div>
                {saveAll()}
              </div>
            ) : null}
            <Fields
              fields={rest}
              data={block}
              en={en}
              onChange={setBlock}
              pages={pages}
              onSaveCard={saveCard}
              onCancelCard={cancelCard}
              onRemoveCard={removeCard}
              onCardsPerRow={saveCardsPerRow}
              onHeroSetting={type === 'hero' ? saveHeroSetting : undefined}
              savingHero={savingHero}
              onSaveAll={type === 'hero' ? () => void save() : undefined}
              saveAllLabel={saveAllLabel}
              saveAllDisabled={!sectionDirty || saving}
              cardBaselines={cardBaselines}
              savingCard={savingCard}
            />
            {type !== 'hero' ? <div className="section-edit-save">{saveAll()}</div> : null}
          </>
        )
      })()}
    </div>
  )
}
