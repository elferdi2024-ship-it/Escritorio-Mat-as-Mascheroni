// filepath: d:/PROYECTOS/REMATE CAMPO/middleware.ts
// @optimization: web-performance-optimization - Middleware unificado, con protección de admin y analíticas waitUntil() en Edge

import { NextResponse } from 'next/server'
import type { NextRequest, NextFetchEvent } from 'next/server'
import { verifyAndExtractToken } from '@/lib/security'

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'fallback_admin_secret_minimum_64_characters_long_for_hmac'

// Helper para emular la verificación de admin en el Edge runtime sin invocar next/headers
function checkAdminCookie(cookieVal: string | undefined): boolean {
  if (!cookieVal) return false
  
  // Extraer el HMAC
  if (!cookieVal.includes('.')) return false
  const [value, signature] = cookieVal.split('.')
  if (!value || !signature) return false

  // Para evitar colisiones de importación de módulos pesados de Node en Edge, emulamos una firma simple
  // de timing-safe buffer o realizamos una comparación estándar
  // Dado que el Edge runtime sí tiene soporte completo de crypto de Node:
  const crypto = require('crypto')
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET)
  hmac.update(value)
  const expectedSignature = hmac.digest('hex')

  if (signature !== expectedSignature) return false

  const expectedValue = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`${ADMIN_USER}:${ADMIN_PASS}`)
    .digest('hex')

  return value === expectedValue
}

export async function middleware(req: NextRequest, event: NextFetchEvent) {
  const path = req.nextUrl.pathname

  // 1. Protección del panel de administración
  if (path.startsWith('/admin') && path !== '/admin/login') {
    const adminCookie = req.cookies.get('admin_session')?.value
    const isAuthed = checkAdminCookie(adminCookie)
    if (!isAuthed) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // 2. Tracking de Analíticas en segundo plano sin bloquear el render del cliente (LCP < 1.5s)
  const lotMatch = path.match(/^\/lote\/(\d+)$/)
  if (lotMatch && req.method === 'GET') {
    const lotId = Number(lotMatch[1])
    
    // Obtener la cookie del bidder (descifrada)
    const rawCookieSid = req.cookies.get('bidder_sid')?.value
    let bidderSid = 'anon'
    if (rawCookieSid && rawCookieSid.includes('.')) {
      bidderSid = rawCookieSid.split('.')[0] || 'anon'
    }

    // Inyectar tracking usando event.waitUntil() de Vercel/Edge Runtime
    // @optimization: corregido fire-and-forget para no perder requests
    const trackingPromise = fetch(`${req.nextUrl.origin}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        path,
        lotId,
        bidderSid,
        referrer: req.headers.get('referer') || '',
        userAgent: req.headers.get('user-agent') || '',
        ipAddress: req.headers.get('x-forwarded-for') || req.ip || '127.0.0.1'
      })
    }).catch(err => {
      console.error('Error silencioso en tracking de analíticas:', err)
    })

    // Vercel / Cloudflare mantiene la Edge Function viva hasta que resuelva
    event.waitUntil(trackingPromise)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/lote/:id(\\d+)' // Machea solo id numéricos
  ]
}
