import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { defaultLocale, locales } from '@/lib/i18n'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/media') ||
    pathname.startsWith('/_next')
  ) {
    return NextResponse.next()
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  )

  if (hasLocale) {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
