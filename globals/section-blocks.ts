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
  labels: { singular: L('Principal', 'Main'), plural: L('Principal', 'Main') },
  fields: [
    showNamed('showTitle', L('Título', 'Title')),
    showNamed('showLead', L('Texto', 'Text')),
    showNamed('showCta', L('Botón', 'Button')),
    showNamed('showSearch', L('Buscador', 'Search')),
    showNamed('showImage', L('Imagen', 'Image')),
    { name: 'title', type: 'text', localized: true, label: L('Título general', 'General title') },
    { name: 'lead', type: 'textarea', localized: true, label: L('Texto', 'Text') },
    {
      type: 'row',
      admin: { className: 'section-edit-row--hero-cta' },
      fields: [
        { name: 'cta', type: 'text', localized: true, label: L('Texto del botón', 'Button text') },
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
      ],
    },
    {
      name: 'searchPlaceholder',
      type: 'text',
      localized: true,
      label: L('Placeholder del buscador', 'Search placeholder'),
    },
    {
      name: 'slideTransition',
      type: 'select',
      defaultValue: 'fade',
      label: L('Transición', 'Transition'),
      options: [
        { label: L('Fundido', 'Fade'), value: 'fade' },
        { label: L('Deslizar', 'Slide'), value: 'slide' },
        { label: L('Deslizar a la izquierda', 'Slide left'), value: 'slide-left' },
        { label: L('Subir', 'Rise'), value: 'rise' },
        { label: L('Zoom', 'Zoom'), value: 'zoom' },
        { label: L('Corte', 'Cut'), value: 'none' },
      ],
    },
    {
      name: 'slides',
      type: 'array',
      label: L('Imágenes', 'Images'),
      labels: { singular: L('Imagen', 'Image'), plural: L('Imágenes', 'Images') },
      admin: { initCollapsed: true },
      fields: [
        show,
        { name: 'image', type: 'upload', relationTo: 'media', label: L('Imagen', 'Image') },
        showNamed('showImage', L('Mostrar imagen', 'Show image')),
        { name: 'title', type: 'text', localized: true, label: L('Título', 'Title') },
        {
          name: 'titleAlign',
          type: 'select',
          defaultValue: 'center',
          label: L('Alineación del título', 'Title alignment'),
          options: [
            { label: L('Izquierda', 'Left'), value: 'left' },
            { label: L('Centro', 'Center'), value: 'center' },
            { label: L('Derecha', 'Right'), value: 'right' },
          ],
        },
        {
          name: 'titleAlignY',
          type: 'select',
          defaultValue: 'bottom',
          label: L('Alineación vertical del título', 'Title vertical alignment'),
          options: [
            { label: L('Arriba', 'Top'), value: 'top' },
            { label: L('Centro', 'Center'), value: 'center' },
            { label: L('Abajo', 'Bottom'), value: 'bottom' },
          ],
        },
        {
          name: 'titleSize',
          type: 'select',
          defaultValue: 'lg',
          label: L('Tamaño del título', 'Title size'),
          options: [
            { label: L('Pequeño', 'Small'), value: 'sm' },
            { label: L('Mediano', 'Medium'), value: 'md' },
            { label: L('Grande', 'Large'), value: 'lg' },
            { label: L('Muy grande', 'Extra large'), value: 'xl' },
          ],
        },
        { name: 'titleColor', type: 'text', label: L('Color del título', 'Title color') },
        showNamed('showTitle', L('Mostrar título', 'Show title')),
        { name: 'text', type: 'textarea', localized: true, label: L('Texto', 'Text') },
        {
          name: 'textAlign',
          type: 'select',
          defaultValue: 'center',
          label: L('Alineación del texto', 'Text alignment'),
          options: [
            { label: L('Izquierda', 'Left'), value: 'left' },
            { label: L('Centro', 'Center'), value: 'center' },
            { label: L('Derecha', 'Right'), value: 'right' },
          ],
        },
        {
          name: 'textAlignY',
          type: 'select',
          defaultValue: 'bottom',
          label: L('Alineación vertical del texto', 'Text vertical alignment'),
          options: [
            { label: L('Arriba', 'Top'), value: 'top' },
            { label: L('Centro', 'Center'), value: 'center' },
            { label: L('Abajo', 'Bottom'), value: 'bottom' },
          ],
        },
        {
          name: 'textSize',
          type: 'select',
          defaultValue: 'md',
          label: L('Tamaño del texto', 'Text size'),
          options: [
            { label: L('Pequeño', 'Small'), value: 'sm' },
            { label: L('Mediano', 'Medium'), value: 'md' },
            { label: L('Grande', 'Large'), value: 'lg' },
            { label: L('Muy grande', 'Extra large'), value: 'xl' },
          ],
        },
        { name: 'textColor', type: 'text', label: L('Color del texto', 'Text color') },
        showNamed('showText', L('Mostrar texto', 'Show text')),
        {
          type: 'row',
          admin: { className: 'section-edit-row--hero-slide-cta' },
          fields: [
            showNamed('showCta', L('Texto del botón', 'Button text')),
            { name: 'cta', type: 'text', localized: true, label: L('Texto del botón', 'Button text') },
            {
              name: 'ctaPage',
              type: 'relationship',
              relationTo: 'pages',
              label: L('Página del botón', 'Button page'),
            },
            {
              name: 'ctaAlign',
              type: 'select',
              defaultValue: 'center',
              label: L('Alineación del botón', 'Button alignment'),
              options: [
                { label: L('Izquierda', 'Left'), value: 'left' },
                { label: L('Centro', 'Center'), value: 'center' },
                { label: L('Derecha', 'Right'), value: 'right' },
              ],
            },
            {
              name: 'ctaAlignY',
              type: 'select',
              defaultValue: 'bottom',
              label: L('Alineación vertical del botón', 'Button vertical alignment'),
              options: [
                { label: L('Arriba', 'Top'), value: 'top' },
                { label: L('Centro', 'Center'), value: 'center' },
                { label: L('Abajo', 'Bottom'), value: 'bottom' },
              ],
            },
            {
              name: 'ctaSize',
              type: 'select',
              defaultValue: 'md',
              label: L('Tamaño del botón', 'Button size'),
              options: [
                { label: L('Pequeño', 'Small'), value: 'sm' },
                { label: L('Mediano', 'Medium'), value: 'md' },
                { label: L('Grande', 'Large'), value: 'lg' },
                { label: L('Muy grande', 'Extra large'), value: 'xl' },
              ],
            },
            { name: 'ctaColor', type: 'text', label: L('Color del botón', 'Button color') },
          ],
        },
      ],
    },
    {
      name: 'slideDuration',
      type: 'number',
      defaultValue: 6,
      min: 1,
      label: L('Duración en segundos', 'Duration in seconds'),
    },
    showNamed('showSlideNav', L('Navegación entre imágenes', 'Navigation between images')),
    showNamed('showInMenu', L('Mostrar en la página de Inicio', 'Show on the home page'), { defaultValue: true }),
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
    showNamed('showInMenu', L('Mostrar en el menú de navegación', 'Show in the navigation menu'), { defaultValue: false }),
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
              name: 'imageShape',
              type: 'select',
              defaultValue: 'landscape',
              label: L('Forma', 'Shape'),
              admin: { className: 'section-edit-field--shape' },
              options: [
                { label: L('Cuadrado', 'Square'), value: 'square' },
                { label: L('Ovalado', 'Oval'), value: 'oval' },
                { label: L('Circular', 'Circle'), value: 'circle' },
                { label: L('Rectangular vertical', 'Vertical rectangle'), value: 'portrait' },
                { label: L('Rectangular horizontal', 'Horizontal rectangle'), value: 'landscape' },
              ],
            },
            {
              name: 'imageAlign',
              type: 'select',
              defaultValue: 'left',
              label: L('Alineación', 'Alignment'),
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
        {
          name: 'subtitleAlign',
          type: 'select',
          defaultValue: 'left',
          label: L('Alineación del subtítulo', 'Subtitle alignment'),
          options: [
            { label: L('Izquierda', 'Left'), value: 'left' },
            { label: L('Centro', 'Center'), value: 'center' },
            { label: L('Derecha', 'Right'), value: 'right' },
          ],
        },
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
            { label: L('Justificar', 'Justify'), value: 'justify' },
            { label: L('Derecha', 'Right'), value: 'right' },
          ],
        },
        showNamed('showText', L('Mostrar texto', 'Show text')),
        { name: 'footer', type: 'text', localized: true, label: L('Footer', 'Footer') },
        {
          name: 'footerAlign',
          type: 'select',
          defaultValue: 'left',
          label: L('Alineación del footer', 'Footer alignment'),
          options: [
            { label: L('Izquierda', 'Left'), value: 'left' },
            { label: L('Centro', 'Center'), value: 'center' },
            { label: L('Derecha', 'Right'), value: 'right' },
          ],
        },
        showNamed('showFooter', L('Mostrar footer', 'Show footer')),
        {
          type: 'row',
          admin: { className: 'section-edit-row--button' },
          fields: [
            {
              name: 'buttonLabel',
              type: 'text',
              localized: true,
              label: L('Texto', 'Text'),
            },
            {
              name: 'buttonPage',
              type: 'relationship',
              relationTo: 'pages',
              label: L('Página', 'Page'),
            },
            {
              name: 'buttonAlign',
              type: 'select',
              defaultValue: 'left',
              label: L('Alineación', 'Alignment'),
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
