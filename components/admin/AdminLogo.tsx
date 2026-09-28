import { DEFAULT_LOGO_SRC } from '@/lib/media'

export function AdminLogo() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={DEFAULT_LOGO_SRC} alt="Logo" className="admin-brand-logo" />
  )
}

export function AdminIcon() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={DEFAULT_LOGO_SRC} alt="" className="admin-brand-icon" />
  )
}
