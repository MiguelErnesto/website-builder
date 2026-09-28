import type { GlobalConfig } from 'payload'

import { PAGE_BLOCKS } from './section-blocks'
import { L } from '../lib/labels'
import { FONT_SELECT_OPTIONS } from '../lib/theme'

const show = (name: string, label: { es: string; en: string }) => ({
  name,
  type: 'checkbox' as const,
  defaultValue: true,
  label,
})

export const Site: GlobalConfig = {
  slug: 'site',
  label: L('Sitio', 'Site'),
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: L('Identidad', 'Identity'),
          fields: [
            { name: 'name', type: 'text', localized: true, required: true, label: L('Nombre', 'Name') },
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              label: 'Logo',
              admin: {
                description: L(
                  'Si no hay logo, se muestra la imagen por defecto.',
                  'If there is no logo, the default image is shown.',
                ),
                components: {
                  beforeInput: '/components/admin/DefaultLogo#DefaultLogo',
                },
              },
            },
            {
              name: 'logoText',
              type: 'text',
              localized: true,
              label: L('Texto del logo', 'Logo text'),
              admin: {
                description: L(
                  'Si está vacío, usa el nombre del sitio.',
                  'If empty, the site name is used.',
                ),
              },
            },
            show('showLogo', L('Mostrar logo', 'Show logo')),
            show('showLogoText', L('Mostrar texto del logo', 'Show logo text')),
            {
              name: 'metaDescription',
              type: 'textarea',
              localized: true,
              label: L('Meta descripción', 'Meta description'),
              admin: {
                description: L(
                  'Meta description SEO (hasta ~160 caracteres).',
                  'SEO meta description (up to ~160 characters).',
                ),
              },
            },
            {
              type: 'row',
              admin: { className: 'socials-row' },
              fields: [
                {
                  name: 'contactEmail',
                  type: 'email',
                  label: L('Correo', 'Email'),
                  admin: {
                    width: '33%',
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
                {
                  name: 'whatsapp',
                  type: 'text',
                  label: 'WhatsApp',
                  admin: {
                    width: '33%',
                    description: L('URL o número, ej. https://wa.me/54911...', 'URL or number, e.g. https://wa.me/54911...'),
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
                {
                  name: 'instagram',
                  type: 'text',
                  label: 'Instagram',
                  admin: {
                    width: '33%',
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
                {
                  name: 'facebook',
                  type: 'text',
                  label: 'Facebook',
                  admin: {
                    width: '33%',
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
                {
                  name: 'twitter',
                  type: 'text',
                  label: 'X',
                  admin: {
                    width: '33%',
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
                {
                  name: 'youtube',
                  type: 'text',
                  label: 'YouTube',
                  admin: {
                    width: '33%',
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
                {
                  name: 'tiktok',
                  type: 'text',
                  label: 'TikTok',
                  admin: {
                    width: '33%',
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  label: 'LinkedIn',
                  admin: {
                    width: '33%',
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
                {
                  name: 'pinterest',
                  type: 'text',
                  label: 'Pinterest',
                  admin: {
                    width: '33%',
                    components: { Field: '/components/admin/SocialField#SocialField' },
                  },
                },
              ],
            },
          ],
        },
        {
          label: L('Apariencia', 'Appearance'),
          fields: [
            {
              name: 'logoThemeSuggest',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/LogoThemeSuggest#LogoThemeSuggest',
                },
              },
            },
            {
              name: 'appearanceSettings',
              type: 'ui',
              admin: {
                components: {
                  Field: '/components/admin/AppearanceHeading#AppearanceHeading',
                },
              },
            },
            {
              type: 'row',
              admin: { className: 'appearance-colors' },
              fields: [
                {
                  name: 'colorPrimary',
                  type: 'text',
                  label: L('Color primario', 'Primary color'),
                  defaultValue: '#cc9999',
                  admin: {
                    components: {
                      Field: '/components/admin/ColorField#ColorField',
                    },
                  },
                },
                {
                  name: 'colorSecondary',
                  type: 'text',
                  label: L('Color secundario', 'Secondary color'),
                  defaultValue: '#0099ff',
                  admin: {
                    components: {
                      Field: '/components/admin/ColorField#ColorField',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              admin: { className: 'appearance-font' },
              fields: [
                {
                  name: 'colorFontPrimary',
                  type: 'text',
                  label: L('Color fuente principal', 'Primary font color'),
                  defaultValue: '#333333',
                  admin: {
                    components: {
                      Field: '/components/admin/ColorField#ColorField',
                    },
                  },
                },
                {
                  name: 'fontPrimary',
                  type: 'select',
                  label: L('Fuente principal', 'Body font'),
                  defaultValue: 'open-sans',
                  options: FONT_SELECT_OPTIONS,
                  admin: {
                    components: {
                      Field: '/components/admin/FontField#FontField',
                    },
                  },
                },
              ],
            },
            {
              type: 'row',
              admin: { className: 'appearance-font' },
              fields: [
                {
                  name: 'colorFontSecondary',
                  type: 'text',
                  label: L('Color fuente secundaria', 'Secondary font color'),
                  defaultValue: '#333333',
                  admin: {
                    components: {
                      Field: '/components/admin/ColorField#ColorField',
                    },
                  },
                },
                {
                  name: 'fontSecondary',
                  type: 'select',
                  label: L('Fuente secundaria (titulares)', 'Display font (headings)'),
                  defaultValue: 'open-sans',
                  options: FONT_SELECT_OPTIONS,
                  admin: {
                    components: {
                      Field: '/components/admin/FontField#FontField',
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          label: L('Navegación', 'Navigation'),
          fields: [
            show('showNav', L('Mostrar menú', 'Show menu')),
            show('showNavCta', L('Mostrar botón del menú', 'Show menu button')),
            show('showLangSwitch', L('Mostrar cambio de idioma', 'Show language switch')),
            {
              name: 'navCta',
              type: 'text',
              localized: true,
              label: L('Texto del botón del menú', 'Menu button text'),
            },
            {
              name: 'navItems',
              type: 'array',
              label: L('Ítems del menú', 'Menu items'),
              labels: { singular: L('Ítem', 'Item'), plural: L('Ítems', 'Items') },
              admin: {
                description: L(
                  'Si está vacío, se usa el menú por defecto. href: /es#faq o /es/nosotros.',
                  'If empty, the default menu is used. href: /en#faq or /en/nosotros.',
                ),
              },
              fields: [
                { name: 'label', type: 'text', localized: true, required: true, label: L('Nombre', 'Name') },
                { name: 'href', type: 'text', required: true, label: L('Enlace', 'Link') },
                show('visible', L('Visible', 'Visible')),
              ],
            },
          ],
        },
        {
          label: L('Secciones', 'Sections'),
          fields: [
            {
              name: 'sections',
              type: 'blocks',
              labels: { singular: L('Sección', 'Section'), plural: L('Secciones', 'Sections') },
              admin: {
                initCollapsed: true,
                className: 'sections-cards',
                description: L(
                  'Hero, Nosotros, FAQ y Contáctenos salen por defecto. Reordena, oculta o añade secciones.',
                  'Hero, About, FAQ and Contact us are included by default. Reorder, hide or add sections.',
                ),
                components: {
                  beforeInput: [
                    '/components/admin/SectionEditGate#SectionEditGate',
                    '/components/admin/AddSectionTop#AddSectionTop',
                  ],
                },
              },
              blocks: PAGE_BLOCKS,
            },
          ],
        },
      ],
    },
  ],
}
