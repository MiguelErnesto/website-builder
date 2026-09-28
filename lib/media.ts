export const DEFAULT_LOGO_SRC = '/logo-default.svg'

function rec(image: unknown): Record<string, unknown> | null {
  return typeof image === 'object' && image ? (image as Record<string, unknown>) : null
}

export function mediaUrl(image: unknown): string | null {
  const value = rec(image)
  if (!value) return null
  if (typeof value.url === 'string' && value.url) return value.url
  if (typeof value.filename === 'string' && value.filename) return `/api/media/file/${value.filename}`
  return null
}

export function mediaThumb(image: unknown): string | null {
  const value = rec(image)
  if (!value) return null
  if (typeof value.thumbnailURL === 'string' && value.thumbnailURL) return value.thumbnailURL
  return mediaUrl(image)
}
