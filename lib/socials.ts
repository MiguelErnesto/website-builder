export const SOCIAL_KEYS = [
  'email',
  'instagram',
  'facebook',
  'twitter',
  'youtube',
  'tiktok',
  'linkedin',
  'whatsapp',
  'pinterest',
] as const

export type SocialKey = (typeof SOCIAL_KEYS)[number]

export const SOCIAL_META: Record<SocialKey, { label: string; field: string }> = {
  email: { label: 'Correo', field: 'contactEmail' },
  instagram: { label: 'Instagram', field: 'instagram' },
  facebook: { label: 'Facebook', field: 'facebook' },
  twitter: { label: 'X', field: 'twitter' },
  youtube: { label: 'YouTube', field: 'youtube' },
  tiktok: { label: 'TikTok', field: 'tiktok' },
  linkedin: { label: 'LinkedIn', field: 'linkedin' },
  whatsapp: { label: 'WhatsApp', field: 'whatsapp' },
  pinterest: { label: 'Pinterest', field: 'pinterest' },
}

export function isSocialKey(value: unknown): value is SocialKey {
  return typeof value === 'string' && (SOCIAL_KEYS as readonly string[]).includes(value)
}

export function socialHref(key: SocialKey, value: string) {
  const v = value.trim()
  if (!v) return ''
  if (key === 'email') return v.includes('mailto:') ? v : `mailto:${v}`
  if (key === 'whatsapp' && !/^https?:\/\//i.test(v)) {
    const phone = v.replace(/[^\d+]/g, '')
    return phone ? `https://wa.me/${phone.replace(/^\+/, '')}` : v
  }
  return v
}
