'use client'

import type { Field } from 'payload'
import { Button, useConfig, useLocale, useTranslation } from '@payloadcms/ui'
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
  if (!base) return false
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
}: {
  label: string
  value: unknown
  onChange: (next: unknown) => void
  show?: { checked: boolean; onChange: (next: boolean) => void }
  off?: boolean
  en?: boolean
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
      <div className="section-edit-upload">
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

function textAlignValue(value: unknown): 'left' | 'center' | 'right' {
  return value === 'center' || value === 'right' ? value : 'left'
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
  onSaveCard,
  onCancelCard,
  onCardsPerRow,
  cardBaselines = {},
  savingCard = '',
  savedCard = '',
}: {
  fields: Field[]
  data: Record<string, unknown>
  onChange: (next: Record<string, unknown>) => void
  en: boolean
  pages: PageDoc[]
  inCard?: boolean
  onSaveCard?: (card: Record<string, unknown>) => Promise<void>
  onCancelCard?: (cardId: string) => void
  onCardsPerRow?: (count: number) => void
  cardBaselines?: Record<string, Record<string, unknown>>
  savingCard?: string
  savedCard?: string
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
    if (fieldName === 'image' || fieldName === 'imageAlign' || fieldName === 'imageAlignY') return 'showImage'
    if (fieldName === 'subtitle') return 'showSubtitle'
    if (fieldName === 'text' || fieldName === 'textAlign') return 'showText'
    if (fieldName === 'footer') return 'showFooter'
    if (fieldName === 'buttonLabel' || fieldName === 'buttonPage' || fieldName === 'buttonAlign') return 'showButton'
    return ''
  }
  const showFor = (fieldName: string) => {
    const withBox =
      fieldName === 'image' ||
      fieldName === 'subtitle' ||
      fieldName === 'text' ||
      fieldName === 'footer' ||
      fieldName === 'buttonLabel'
    const key = partKey(fieldName)
    if (!inCard || !withBox || !key) return undefined
    const current = data[key]
    return {
      checked: typeof current === 'boolean' ? current : true,
      onChange: (next: boolean) => set(key, next),
    }
  }
  const partOff = (fieldName: string) => {
    const key = partKey(fieldName)
    if (!inCard || !key) return false
    return data[key] === false
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
          return (
            <div className={`section-edit-row${rowClass ? ` ${rowClass}` : ''}`} key={`row-${index}`}>
              <Fields fields={field.fields} data={data} onChange={onChange} en={en} pages={pages} inCard={inCard} />
            </div>
          )
        }
        if (field.type === 'ui') {
          return field.name === 'productThumbs' ? <CarouselProducts key="thumbs" /> : null
        }
        if (!('name' in field) || !field.name) return null
        const name = field.name
        if (name === 'imageAlignY' || name === 'textAlign' || name === 'cardsPerRow' || name === 'layout') return null
        const label = fieldLabel(field.label, en) || name
        const value = data[name]

        if (field.type === 'checkbox') {
          if (inCard && name.startsWith('show')) return null
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
                style={inCard && name === 'text' ? { textAlign: textAlignValue(data.textAlign) } : undefined}
                value={typeof value === 'string' ? value : ''}
                onChange={(event) => set(name, event.target.value)}
              />
              {inCard && name === 'text' ? (
                <div className="section-edit-text-align">
                  <div className="section-edit-align" role="group" aria-label={en ? 'Text alignment' : 'Alineación del texto'}>
                    {(['left', 'center', 'right'] as const).map((optionValue) => {
                      const on = textAlignValue(data.textAlign) === optionValue
                      const optionLabel = optionValue === 'center' ? (en ? 'Center' : 'Centro') : optionValue === 'right' ? (en ? 'Right' : 'Derecha') : en ? 'Left' : 'Izquierda'
                      return (
                        <button
                          key={optionValue}
                          type="button"
                          className={on ? 'is-on' : ''}
                          disabled={off}
                          aria-pressed={on}
                          aria-label={optionLabel}
                          title={optionLabel}
                          onClick={() => set('textAlign', optionValue)}
                        >
                          <AlignIcon align={optionValue} />
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : null}
            </Wrap>
          )
        }
        if (field.type === 'text') {
          const titleToggle = !inCard && name === 'title' && data.blockType === 'extra'
          const titleShow = titleToggle
            ? { checked: data.showTitle !== false, onChange: (next: boolean) => set('showTitle', next) }
            : show
          const titleOff = titleToggle ? data.showTitle === false : off
          const TitleWrap = titleShow ? 'div' : Wrap
          return (
            <TitleWrap className={`${boxClass(field, titleToggle ? 'section-edit-field--title' : '')}${titleOff ? ' is-off' : ''}`} key={name}>
              <FieldHeading label={label} show={titleShow} />
              <input
                type="text"
                disabled={titleOff}
                value={typeof value === 'string' ? value : ''}
                onChange={(event) => set(name, event.target.value)}
              />
            </TitleWrap>
          )
        }
        if (field.type === 'select') {
          const options = (field.options || []).map((option) =>
            typeof option === 'string' ? { label: option, value: option } : option,
          )
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
          const isCards =
            name === 'cards' && field.fields.some((item) => 'name' in item && item.name === 'showSubtitle')
          const perRowRaw = Number(data.cardsPerRow)
          const perRow = Number.isFinite(perRowRaw) && perRowRaw >= 1 ? Math.floor(perRowRaw) : 3
          return (
            <div className={`section-edit-array${name === 'cards' ? ' section-edit-array--cards' : ''}`} key={name}>
              <div className="section-edit-array__head">
                {isCards ? (
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
                const onRemove = () => set(name, rows.filter((_, i) => i !== rowIndex))
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
                        <label className="section-edit-check">
                          <input
                            type="checkbox"
                            checked={rowData.visible !== false}
                            onChange={(event) => {
                              const copy = rows.slice()
                              copy[rowIndex] = { ...rowData, visible: event.target.checked }
                              set(name, copy)
                            }}
                          />
                          <span>Visible</span>
                        </label>
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
                                  {busy
                                    ? en
                                      ? 'Saving…'
                                      : 'Guardando…'
                                    : savedCard === String(rowData.id || rowIndex)
                                      ? en
                                        ? 'Saved'
                                        : 'Guardado'
                                      : en
                                        ? 'Save'
                                        : 'Guardar'}
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
  const en = i18n.language === 'en'
  const localeCode = locale.code || 'es'
  const backHref = formatAdminURL({ adminRoute, path: '/globals/site' })
  const [block, setBlock] = useState<Record<string, unknown> | null>(null)
  const [pages, setPages] = useState<PageDoc[]>([])
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [savingCard, setSavingCard] = useState('')
  const [savedCard, setSavedCard] = useState('')
  const [cardBaselines, setCardBaselines] = useState<Record<string, Record<string, unknown>>>({})
  const [sectionBaseline, setSectionBaseline] = useState<Record<string, unknown> | null>(null)
  const perRowTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    setCardBaselines(cardMap(next.cards))
  }, [localeCode, sectionId])

  useEffect(() => {
    load().catch(() => setError(en ? 'Section not found.' : 'Sección no encontrada.'))
  }, [en, load])

  useEffect(
    () => () => {
      if (perRowTimer.current) clearTimeout(perRowTimer.current)
    },
    [],
  )

  useEffect(() => {
    const cards = block?.cards
    if (!Array.isArray(cards)) return
    setCardBaselines((prev) => {
      let changed = false
      const next = { ...prev }
      for (const item of cards) {
        const row = rec(item)
        const id = String(row.id || '')
        if (!id || id in next) continue
        next[id] = structuredClone(row)
        changed = true
      }
      return changed ? next : prev
    })
  }, [block])

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

  const saveCard = async (card: Record<string, unknown>) => {
    const cardId = String(card.id || '')
    setSavingCard(cardId)
    setSavedCard('')
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
      const cards = Array.isArray(server.cards) ? server.cards.slice() : []
      const at = cards.findIndex((item) => String(rec(item).id) === cardId)
      if (at >= 0) cards[at] = card
      else cards.push(card)
      const sections = list.map((item, i) =>
        i === index ? serializeSection(asCards({ ...server, cards })) : serializeSection(rec(item)),
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
        if (!prev || !Array.isArray(prev.cards)) return prev
        const cards = prev.cards.slice()
        const at = cards.findIndex((item) => String(rec(item).id) === cardId)
        if (at >= 0) cards[at] = structuredClone(card)
        else cards.push(structuredClone(card))
        return { ...prev, cards }
      })
      setSavedCard(cardId)
    } catch {
      setError(en ? 'Could not save the card.' : 'No se pudo guardar la tarjeta.')
    } finally {
      setSavingCard('')
    }
  }

  const cancelCard = (cardId: string) => {
    const base = cardBaselines[cardId]
    if (!base) return
    setBlock((prev) => {
      if (!prev || !Array.isArray(prev.cards)) return prev
      return {
        ...prev,
        cards: prev.cards.map((item) => (String(rec(item).id) === cardId ? structuredClone(base) : item)),
      }
    })
    setSavedCard('')
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
      setCardBaselines(cardMap(block.cards))
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
    <div className="section-edit">
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
            {flags.length ? (
              <div className="section-edit-flags">
                <div className="section-edit-flags__checks">
                  <Fields fields={flags} data={block} en={en} onChange={setBlock} pages={pages} />
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
              onCardsPerRow={saveCardsPerRow}
              cardBaselines={cardBaselines}
              savingCard={savingCard}
              savedCard={savedCard}
            />
            <div className="section-edit-save">{saveAll()}</div>
          </>
        )
      })()}
    </div>
  )
}
