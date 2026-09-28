import type { CollectionConfig } from 'payload'

import { L } from '@/lib/labels'
import { slugify, titleText } from '@/lib/slug'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: L('Página', 'Page'),
    plural: L('Páginas', 'Pages'),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status'],
    description: L(
      'Páginas independientes. Los botones de las secciones enlazan aquí.',
      'Standalone pages. Section buttons can link here.',
    ),
    components: {
      beforeList: ['/components/admin/PagesCopy#PagesCopy'],
      beforeListTable: ['/components/admin/PagesCopy#PagesCopy'],
      edit: {
        beforeDocumentControls: ['/components/admin/PagesCopy#PagesCopy'],
      },
    },
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        const slug = typeof data.slug === 'string' ? data.slug.trim() : ''
        if (slug) return data
        const next = slugify(titleText(data.title))
        if (next) data.slug = next
        return data
      },
    ],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      label: L('Título', 'Title'),
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
        components: {
          Field: '/components/admin/SlugField#SlugField',
        },
      },
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: L('Contenido', 'Content'),
    },
  ],
}
