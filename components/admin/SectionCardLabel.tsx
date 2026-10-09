'use client'

import { useConfig, useField, useRowLabel, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { useEffect, useRef, useState } from 'react'

import { mediaThumb } from '@/lib/media'
import { sectionImage, sectionText, sectionTitle, sectionTypeLabel } from '@/lib/section-admin'

type Row = {
  id?: string | number
  blockType?: string
  title?: string
  lead?: string
  text?: string
  subtitle?: string
  image?: unknown
  slides?: Array<{ image?: unknown }>
  cards?: Array<{ image?: unknown }>
  faqs?: Array<{ question?: string }>
}

function rowId(value: unknown) {
  if (!value || typeof value !== 'object' || !('id' in value)) return ''
  const id = (value as { id?: unknown }).id
  return id == null ? '' : String(id)
}

function sectionKey(data: Row, order: number) {
  const id = rowId(data)
  if (id) return id
  return `i-${Math.max(order - 1, 0)}`
}

export function SectionCardLabel() {
  const { data, path } = useRowLabel<Row>()
  const { value: sections } = useField({ path: 'sections', potentiallyStalePath: 'sections' })
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const { i18n } = useTranslation()
  const [carouselSrc, setCarouselSrc] = useState<string | null>(null)
  const rootRef = useRef<HTMLAnchorElement>(null)
  const list = Array.isArray(sections) ? sections : []
  const id = rowId(data)
  const pathIndex = typeof path === 'string' ? Number((path.match(/\.(\d+)(?:\.|$)/) || [])[1]) : Number.NaN
  const liveIndex = id ? list.findIndex((item) => rowId(item) === id) : -1
  const order =
    liveIndex >= 0 ? liveIndex + 1 : Number.isInteger(pathIndex) && pathIndex >= 0 ? pathIndex + 1 : 1
  const en = i18n.language === 'en'
  const type = data && typeof data.blockType === 'string' ? data.blockType : ''
  const href = `${formatAdminURL({
    adminRoute,
    path: '/globals/site',
  })}?section=${encodeURIComponent(data ? sectionKey(data, order) : '')}`

  useEffect(() => {
    if (type !== 'carousel') return
    let cancelled = false
    fetch('/api/products?limit=1&depth=1&sort=title', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json || !Array.isArray(json.docs)) return
        const first = json.docs[0] as { image?: unknown } | undefined
        const src = mediaThumb(first?.image)
        if (src) setCarouselSrc(src)
      })
      .catch(() => null)
    return () => {
      cancelled = true
    }
  }, [type])

  useEffect(() => {
    const rowEl = rootRef.current?.closest('.blocks-field__row')
    if (!rowEl || !data) return
    const onClick = (event: Event) => {
      const target = event.target as HTMLElement | null
      if (!target) return
      if (target.closest('.array-actions, .blocks-field__row-actions, button:not(.collapsible__toggle)')) {
        return
      }
      if (target.closest('.collapsible__toggle, .section-card-label')) {
        event.preventDefault()
        event.stopPropagation()
        window.location.assign(href)
      }
    }
    rowEl.addEventListener('click', onClick, true)
    return () => rowEl.removeEventListener('click', onClick, true)
  }, [data, href])

  if (!data) return null

  const rawTitle = typeof data.title === 'string' ? data.title.trim() : ''
  const isHero =
    type === 'hero' ||
    rawTitle === 'Hero' ||
    rawTitle === 'Lo que hacemos, con claridad.' ||
    rawTitle === 'What we do, shown clearly.'
  const title = isHero ? sectionTypeLabel('hero', en) : sectionTitle(data as Record<string, unknown>, en)
  const text = isHero ? '' : sectionText(data as Record<string, unknown>)
  const image = type === 'carousel' ? carouselSrc : sectionImage(data as Record<string, unknown>)

  return (
    <a ref={rootRef} className="section-card-label" href={href}>
      <span className="section-card-label__n">{order}</span>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img className="section-card-label__img" src={image} alt="" />
      ) : (
        <span className="section-card-label__ph" aria-hidden="true" />
      )}
      <span className="section-card-label__meta">
        <strong>{title}</strong>
        {text ? <span className="section-card-label__text">{text}</span> : null}
      </span>
    </a>
  )
}
