// filepath: d:/PROYECTOS/REMATE CAMPO/lib/security.ts
// @optimization: typescript-expert - Módulo unificado de criptografía y validación de seguridad (bidders y admin)

import crypto from 'crypto'
import { cookies } from 'next/headers'

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'fallback_admin_secret_minimum_64_characters_long_for_hmac'
const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin'

// Firmar un valor con HMAC SHA-256
export function signValue(value: string): string {
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET)
  hmac.update(value)
  return hmac.digest('hex')
}

// Crear un token firmado (valor.firma)
export function createSignedToken(value: string): string {
  const signature = signValue(value)
  return `${value}.${signature}`
}

// Verificar un token firmado y extraer el valor original
export function verifyAndExtractToken(token: string): string | null {
  if (!token || !token.includes('.')) return null
  const [value, signature] = token.split('.')
  if (!value || !signature) return null
  const expectedSignature = signValue(value)
  if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return value
  }
  return null
}

// Verificar la autenticación del administrador de forma unificada y segura
export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = cookies()
  const adminSession = cookieStore.get('admin_session')?.value
  if (!adminSession) return false

  // El valor original debe coincidir con la combinación HMAC de ADMIN_USER + ADMIN_PASS
  const expectedValue = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`${ADMIN_USER}:${ADMIN_PASS}`)
    .digest('hex')

  const extracted = verifyAndExtractToken(adminSession)
  return extracted === expectedValue
}

// Generar una sesión para administrador y establecer la cookie
export async function loginAdmin(): Promise<boolean> {
  const expectedValue = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`${ADMIN_USER}:${ADMIN_PASS}`)
    .digest('hex')
  
  const signedSession = createSignedToken(expectedValue)
  
  const cookieStore = cookies()
  cookieStore.set('admin_session', signedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 2, // 2 horas de sesión
    path: '/'
  })
  return true
}

// Cerrar sesión del administrador
export async function logoutAdmin(): Promise<void> {
  const cookieStore = cookies()
  cookieStore.delete('admin_session')
}
