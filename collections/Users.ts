import type { CollectionConfig } from 'payload'

import { L } from '@/lib/labels'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: L('Usuario', 'User'),
    plural: L('Usuarios', 'Users'),
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
