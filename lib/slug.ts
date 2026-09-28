export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function titleText(title: unknown) {
  if (typeof title === 'string') return title
  if (title && typeof title === 'object') {
    const rec = title as Record<string, unknown>
    if (typeof rec.es === 'string' && rec.es.trim()) return rec.es
    if (typeof rec.en === 'string' && rec.en.trim()) return rec.en
    const first = Object.values(rec).find((item) => typeof item === 'string' && item.trim())
    return typeof first === 'string' ? first : ''
  }
  return ''
}
