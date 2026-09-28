import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { es } from '@payloadcms/translations/languages/es'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { config as loadEnv } from 'dotenv'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { Pages } from './collections/Pages'
import { Site } from './globals/Site'
import { seedCatalog } from './scripts/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

loadEnv({ path: path.resolve(dirname, '.env') })

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      providers: ['/components/admin/IdleLogout#IdleLogout'],
      header: ['/components/admin/AdminTopNav#AdminTopNav'],
      graphics: {
        Logo: '/components/admin/AdminLogo#AdminLogo',
        Icon: '/components/admin/AdminLogo#AdminIcon',
      },
      views: {
        dashboard: {
          Component: '/components/admin/Dashboard#Dashboard',
        },
      },
    },
  },
  collections: [Users, Media, Products, Pages],
  globals: [Site],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    push: process.env.CI === 'true' ? false : process.env.NODE_ENV !== 'production',
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  i18n: {
    fallbackLanguage: 'es',
    supportedLanguages: { es, en },
  },
  localization: {
    locales: [
      { label: { es: 'Español', en: 'Spanish' }, code: 'es' },
      { label: { es: 'Inglés', en: 'English' }, code: 'en' },
    ],
    defaultLocale: 'es',
    fallback: true,
  },
  graphQL: {
    disable: true,
  },
  sharp,
  onInit: async (payload) => {
    try {
      await seedCatalog(payload)
    } catch (error) {
      payload.logger.error({ err: error }, '[seed] falló')
    }
  },
})
