import type { CollectionConfig } from 'payload'

import { L } from '@/lib/labels'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: L('Oferta', 'Offer'),
    plural: L('Ofertas', 'Offers'),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'featured', 'promo', 'slug', 'price', '_status'],
    description: L(
      'Ítem promocionado: producto, servicio, bien, manualidad, curso u otro.',
      'Promoted item: product, service, good, craft, course or other.',
    ),
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
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'kind',
      type: 'select',
      defaultValue: 'product',
      label: L('Tipo', 'Kind'),
      options: [
        { label: L('Producto', 'Product'), value: 'product' },
        { label: L('Servicio', 'Service'), value: 'service' },
        { label: L('Bien', 'Good'), value: 'good' },
        { label: L('Manualidad', 'Craft'), value: 'craft' },
        { label: L('Curso', 'Course'), value: 'course' },
        { label: L('Otro', 'Other'), value: 'other' },
      ],
      admin: {
        position: 'sidebar',
        description: L(
          'Tipo de propuesta. Define la etiqueta en la ficha pública.',
          'Offer type. Sets the label on the public card.',
        ),
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: L('Descripción', 'Description'),
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      label: L('Precio', 'Price'),
      admin: {
        description: L(
          'Opcional. Si va vacío o es 0, no se muestra en la web.',
          'Optional. If empty or 0, it is hidden on the site.',
        ),
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: L('Destacado', 'Featured'),
      admin: {
        position: 'sidebar',
        description: L(
          'Sale primero en el carrusel, con la etiqueta Destacado.',
          'Shows first in the carousel, with the Featured tag.',
        ),
      },
    },
    {
      name: 'promo',
      type: 'checkbox',
      defaultValue: false,
      label: L('En promoción', 'On sale'),
      admin: {
        position: 'sidebar',
        description: L(
          'Muestra la etiqueta Promoción en el carrusel.',
          'Shows the Sale tag in the carousel.',
        ),
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: L('Imagen', 'Image'),
    },
  ],
}
