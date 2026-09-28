import type { Block, Field } from 'payload'

import { L } from '@/lib/labels'

const show: Field = {
  name: 'visible',
  type: 'checkbox',
  defaultValue: true,
  label: L('Visible', 'Visible'),
}

const showNamed = (name: string, label: Field['label'], extra?: Partial<Field>): Field => ({
  name,
  type: 'checkbox',
  defaultValue: true,
  label,
  ...extra,
})

const isMedia = (_: unknown, sibling: { layout?: string }) => sibling?.layout !== 'cards'
const isCards = (_: unknown, sibling: { layout?: string }) => sibling?.layout === 'cards'

const buttonFields = (when?: (args: unknown, sibling: Record<string, unknown>) => boolean): Field[] => [
  showNamed('showButton', L('Mostrar botón', 'Show button'), when ? { admin: { condition: when } } : undefined),
  {
    name: 'buttonLabel',
    type: 'text',
    localized: true,
    label: L('Texto del botón', 'Button text'),
    admin: {
      condition: (_, sibling) => (when ? when(_, sibling) : true) && sibling?.showButton !== false,
    },
  },
  {
    name: 'buttonPage',
    type: 'relationship',
    relationTo: 'pages',
    label: L('Página del botón', 'Button page'),
    admin: {
      condition: (_, sibling) => (when ? when(_, sibling) : true) && sibling?.showButton !== false,
    },
  },
]

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Hero' },
  fields: [
    {
      type: 'row',
      admin: { className: 'hero-toggles' },
      fields: [
        showNamed('showTitle', L('Título', 'Title'), { admin: { width: '20%' } }),
        showNamed('showLead', L('Texto', 'Text'), { admin: { width: '20%' } }),
        showNamed('showCta', L('Botón', 'Button'), { admin: { width: '20%' } }),
        showNamed('showSearch', L('Buscador', 'Search'), { admin: { width: '20%' } }),
        showNamed('showImage', L('Imagen', 'Image'), { admin: { width: '20%' } }),
      ],
    },
    { name: 'title', type: 'text', localized: true, label: L('Título', 'Title') },
    { name: 'lead', type: 'textarea', localized: true, label: L('Texto', 'Text') },
    { name: 'cta', type: 'text', localized: true, label: L('Botón', 'Button') },
    {
      name: 'ctaPage',
      type: 'relationship',
      relationTo: 'pages',
      label: L('Página del botón', 'Button page'),
    },
    {
      name: 'ctaHref',
      type: 'text',
      label: L('Sección o enlace del botón', 'Button section or URL'),
      admin: {
        description: L(
          'Ej. #contacto, #nosotros o /es/paginas/aviso. Si hay página y enlace, se usa el enlace.',
          'E.g. #contacto, #nosotros or /en/paginas/notice. If both page and URL are set, the URL is used.',
        ),
      },
    },
    {
      name: 'searchPlaceholder',
      type: 'text',
      localized: true,
      label: L('Placeholder del buscador', 'Search placeholder'),
    },
    {
      name: 'slides',
      type: 'array',
      labels: { singular: L('Imagen', 'Image'), plural: L('Imágenes', 'Images') },
      admin: { initCollapsed: true },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: L('Imagen', 'Image') },
        {
          name: 'text',
          type: 'text',
          localized: true,
          label: L('Texto sobre la imagen', 'Image caption'),
        },
        {
          type: 'row',
          fields: [
            {
              name: 'textX',
              type: 'select',
              defaultValue: 'center',
              label: L('Horizontal', 'Horizontal'),
              options: [
                { label: L('Izquierda', 'Left'), value: 'left' },
                { label: L('Centro', 'Center'), value: 'center' },
                { label: L('Derecha', 'Right'), value: 'right' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'textY',
              type: 'select',
              defaultValue: 'center',
              label: L('Vertical', 'Vertical'),
              options: [
                { label: L('Arriba', 'Top'), value: 'top' },
                { label: L('Centro', 'Center'), value: 'center' },
                { label: L('Abajo', 'Bottom'), value: 'bottom' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: L('Imagen', 'Image'),
      admin: {
        condition: (_, sibling) => !Array.isArray(sibling?.slides) || sibling.slides.length === 0,
      },
    },
    show,
  ],
}

export const CarouselBlock: Block = {
  slug: 'carousel',
  labels: { singular: L('Carrusel', 'Carousel'), plural: L('Carrusel', 'Carousel') },
  fields: [
    {
      name: 'productThumbs',
      type: 'ui',
      admin: {
        components: {
          Field: '/components/admin/CarouselProducts#CarouselProducts',
        },
      },
    },
    { name: 'title', type: 'text', localized: true, label: L('Título', 'Title') },
    { name: 'lead', type: 'textarea', localized: true, label: L('Texto', 'Text') },
    showNamed('showTitle', L('Mostrar título', 'Show title')),
    showNamed('showLead', L('Mostrar texto', 'Show text')),
    showNamed('showFeatured', L('Mostrar enlace Destacados', 'Show Featured link')),
    showNamed('showPromo', L('Mostrar enlace Promoción', 'Show Sale link')),
    showNamed('showAll', L('Mostrar enlace Ver todos', 'Show See all link')),
    show,
  ],
}

export const AboutBlock: Block = {
  slug: 'about',
  labels: { singular: L('Nosotros', 'About'), plural: L('Nosotros', 'About') },
  fields: [
    { name: 'title', type: 'text', localized: true, label: L('Título', 'Title') },
    { name: 'text', type: 'textarea', localized: true, label: L('Texto', 'Text') },
    showNamed('circleImages', L('Mostrar imágenes en círculo', 'Show images as circles'), {
      defaultValue: false,
    }),
    {
      name: 'cards',
      type: 'array',
      labels: { singular: L('Imagen', 'Image'), plural: L('Imágenes', 'Images') },
      admin: { initCollapsed: true },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', label: L('Imagen', 'Image') },
        { name: 'title', type: 'text', localized: true, label: L('Título', 'Title') },
        { name: 'text', type: 'textarea', localized: true, label: L('Descripción', 'Description') },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: L('Imagen', 'Image'),
      admin: {
        condition: (_, sibling) => !Array.isArray(sibling?.cards) || sibling.cards.length === 0,
      },
    },
    showNamed('showTitle', L('Mostrar título', 'Show title')),
    show,
  ],
}

export const FaqBlock: Block = {
  slug: 'faq',
  labels: { singular: 'FAQ', plural: 'FAQ' },
  fields: [
    { name: 'title', type: 'text', localized: true, label: L('Título', 'Title') },
    {
      name: 'faqs',
      type: 'array',
      labels: { singular: L('Pregunta', 'Question'), plural: L('Preguntas', 'Questions') },
      admin: { initCollapsed: true },
      fields: [
        { name: 'question', type: 'text', localized: true, required: true, label: L('Pregunta', 'Question') },
        { name: 'answer', type: 'textarea', localized: true, required: true, label: L('Respuesta', 'Answer') },
      ],
    },
    showNamed('showTitle', L('Mostrar título', 'Show title')),
    show,
  ],
}

export const TalkToUsBlock: Block = {
  slug: 'talkToUs',
  labels: { singular: L('Contáctenos', 'Contact us'), plural: L('Contáctenos', 'Contact us') },
  fields: [
    { name: 'title', type: 'text', localized: true, label: L('Título', 'Title') },
    { name: 'text', type: 'textarea', localized: true, label: L('Texto', 'Text') },
    { name: 'button', type: 'text', localized: true, label: L('Botón', 'Button') },
    showNamed('showTitle', L('Mostrar título', 'Show title')),
    showNamed('showText', L('Mostrar texto', 'Show text')),
    showNamed('showButton', L('Mostrar botón', 'Show button')),
    show,
  ],
}

export const ExtraBlock: Block = {
  slug: 'extra',
  labels: { singular: L('Sección', 'Section'), plural: L('Secciones', 'Sections') },
  fields: [
    { name: 'title', type: 'text', localized: true, label: L('Título de la sección', 'Section title'), admin: { className: 'section-edit-field--pad' } },
    showNamed('showTitle', L('Mostrar título', 'Show title')),
    showNamed('showInMenu', L('Mostrar en el menú', 'Show in menu'), { defaultValue: false }),
    show,
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'cards',
      required: true,
      admin: { hidden: true },
      options: [
        { label: L('Imagen + texto', 'Image + text'), value: 'media' },
        { label: L('Tarjetas', 'Cards'), value: 'cards' },
      ],
    },
    {
      name: 'cardsPerRow',
      type: 'number',
      defaultValue: 3,
      min: 1,
      label: L('Cantidad de tarjetas de ancho en la sección', 'Number of cards across in the section'),
      admin: { condition: isCards },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: L('Imagen', 'Image'),
      admin: { condition: isMedia },
    },
    showNamed('showImage', L('Mostrar imagen', 'Show image'), { admin: { condition: isMedia } }),
    {
      name: 'imageAlign',
      type: 'select',
      defaultValue: 'left',
      label: L('Alineación de la imagen', 'Image alignment'),
      options: [
        { label: L('Izquierda', 'Left'), value: 'left' },
        { label: L('Derecha', 'Right'), value: 'right' },
      ],
      admin: { condition: isMedia },
    },
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      label: L('Subtítulo', 'Subtitle'),
      admin: { condition: isMedia },
    },
    showNamed('showSubtitle', L('Mostrar subtítulo', 'Show subtitle'), { admin: { condition: isMedia } }),
    {
      name: 'text',
      type: 'textarea',
      localized: true,
      label: L('Texto', 'Text'),
      admin: { condition: isMedia },
    },
    showNamed('showText', L('Mostrar texto', 'Show text'), { admin: { condition: isMedia } }),
    ...buttonFields(isMedia),
    {
      name: 'cards',
      type: 'array',
      label: L('Tarjetas', 'Cards'),
      labels: { singular: L('Tarjeta', 'Card'), plural: L('Tarjetas', 'Cards') },
      admin: { condition: isCards, initCollapsed: true },
      fields: [
        show,
        {
          type: 'row',
          admin: { className: 'section-edit-row--image' },
          fields: [
            { name: 'image', type: 'upload', relationTo: 'media', label: L('Imagen', 'Image') },
            {
              name: 'imageAlign',
              type: 'select',
              defaultValue: 'left',
              label: L('Alineación de la imagen', 'Image alignment'),
              options: [
                { label: L('Izquierda', 'Left'), value: 'left' },
                { label: L('Centro', 'Center'), value: 'center' },
                { label: L('Derecha', 'Right'), value: 'right' },
              ],
            },
            {
              name: 'imageAlignY',
              type: 'select',
              defaultValue: 'center',
              label: L('Alineación vertical', 'Vertical alignment'),
              options: [
                { label: L('Arriba', 'Top'), value: 'top' },
                { label: L('Centro', 'Center'), value: 'center' },
                { label: L('Abajo', 'Bottom'), value: 'bottom' },
              ],
            },
          ],
        },
        showNamed('showImage', L('Mostrar imagen', 'Show image')),
        { name: 'subtitle', type: 'text', localized: true, label: L('Subtítulo', 'Subtitle') },
        showNamed('showSubtitle', L('Mostrar subtítulo', 'Show subtitle')),
        { name: 'text', type: 'textarea', localized: true, label: L('Texto', 'Text') },
        {
          name: 'textAlign',
          type: 'select',
          defaultValue: 'left',
          label: L('Alineación del texto', 'Text alignment'),
          options: [
            { label: L('Izquierda', 'Left'), value: 'left' },
            { label: L('Centro', 'Center'), value: 'center' },
            { label: L('Derecha', 'Right'), value: 'right' },
          ],
        },
        showNamed('showText', L('Mostrar texto', 'Show text')),
        { name: 'footer', type: 'text', localized: true, label: L('Footer', 'Footer') },
        showNamed('showFooter', L('Mostrar footer', 'Show footer')),
        {
          type: 'row',
          admin: { className: 'section-edit-row--button' },
          fields: [
            {
              name: 'buttonLabel',
              type: 'text',
              localized: true,
              label: L('Texto del botón', 'Button text'),
            },
            {
              name: 'buttonPage',
              type: 'relationship',
              relationTo: 'pages',
              label: L('Página del botón', 'Button page'),
            },
            {
              name: 'buttonAlign',
              type: 'select',
              defaultValue: 'left',
              label: L('Alineación del botón', 'Button alignment'),
              options: [
                { label: L('Izquierda', 'Left'), value: 'left' },
                { label: L('Centro', 'Center'), value: 'center' },
                { label: L('Derecha', 'Right'), value: 'right' },
              ],
            },
          ],
        },
        showNamed('showButton', L('Mostrar botón', 'Show button')),
      ],
    },
  ],
}

export const PAGE_BLOCKS = [
  HeroBlock,
  CarouselBlock,
  AboutBlock,
  FaqBlock,
  TalkToUsBlock,
  ExtraBlock,
].map((block) => ({
  ...block,
  admin: {
    ...block.admin,
    disableBlockName: true,
    components: {
      ...block.admin?.components,
      Label: '/components/admin/SectionCardLabel#SectionCardLabel',
    },
  },
}))
