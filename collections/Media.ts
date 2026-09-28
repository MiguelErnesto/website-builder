import type { CollectionConfig } from 'payload'

import { L } from '@/lib/labels'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: L('Medio', 'Media'),
    plural: L('Medios', 'Media'),
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      required: true,
      label: L('Texto alternativo', 'Alt text'),
    },
  ],
  upload: true,
}
