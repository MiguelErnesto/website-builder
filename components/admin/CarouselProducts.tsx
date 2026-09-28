'use client'

import { useConfig, useTranslation } from '@payloadcms/ui'
import { formatAdminURL } from 'payload/shared'
import { useEffect, useState } from 'react'

import { mediaThumb } from '@/lib/media'

type Item = {
  id: string
  title: string
  src: string | null
}

export function CarouselProducts() {
  const { i18n } = useTranslation()
  const {
    config: {
      routes: { admin: adminRoute },
    },
  } = useConfig()
  const [items, setItems] = useState<Item[]>([])
  const en = i18n.language === 'en'

  useEffect(() => {
    let cancelled = false
    fetch('/api/products?limit=50&depth=1&sort=title', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled || !json || !Array.isArray(json.docs)) return
        setItems(
          json.docs.map((doc: { id?: unknown; title?: unknown; image?: unknown }) => ({
            id: String(doc.id),
            title: typeof doc.title === 'string' ? doc.title : '',
            src: mediaThumb(doc.image),
          })),
        )
      })
      .catch(() => null)
    return () => {
      cancelled = true
    }
  }, [])

  if (!items.length) return null

  return (
    <div className="carousel-products">
      <p className="carousel-products__hint">
        {en ? 'Click an image to edit its carousel data.' : 'Clic en una imagen para editar sus datos del carrusel.'}
      </p>
      <ul className="carousel-products__list">
        {items.map((item) => {
          const href = formatAdminURL({
            adminRoute,
            path: `/collections/products/${item.id}`,
          })
          return (
            <li key={item.id}>
              <a href={href} className="carousel-products__item" title={item.title}>
                {item.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.src} alt={item.title} />
                ) : (
                  <span className="carousel-products__ph">{item.title || item.id}</span>
                )}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
