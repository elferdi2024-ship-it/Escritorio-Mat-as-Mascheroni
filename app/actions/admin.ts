// filepath: d:/PROYECTOS/REMATE CAMPO/app/actions/admin.ts
// @optimization: typescript-expert - Server Action de administración con validación HMAC unificada, criptográficamente robusta y de tipo estricto

'use server'

import { cookies } from 'next/headers'
import crypto from 'crypto'
import { z } from 'zod'

const loginSchema = z.object({
  user: z.string().min(2).trim(),
  pass: z.string().min(2).trim(),
})

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || 'admin'
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'fallback_admin_secret_minimum_64_characters_long_for_hmac'

export interface AdminResponse {
  ok: boolean
  error?: string
}

/**
 * Verifica la validez de la sesión de administrador actual en el servidor
 */
export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('admin_session')?.value
  
  if (!adminCookie || !adminCookie.includes('.')) return false

  const [value, signature] = adminCookie.split('.')
  if (!value || !signature) return false

  // Calcular la firma esperada del token
  const hmac = crypto.createHmac('sha256', ADMIN_SECRET)
  hmac.update(value)
  const expectedSignature = hmac.digest('hex')

  // Comparación segura contra ataques de temporización
  const signatureBuffer = Buffer.from(signature, 'hex')
  const expectedSignatureBuffer = Buffer.from(expectedSignature, 'hex')
  
  if (signatureBuffer.length !== expectedSignatureBuffer.length || 
      !crypto.timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
    return false
  }

  // Verificar que el contenido cifrado del token coincida con las credenciales
  const expectedValue = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`${ADMIN_USER}:${ADMIN_PASS}`)
    .digest('hex')

  return value === expectedValue
}

/**
 * Autentica al administrador y firma digitalmente una cookie HMAC segura
 */
export async function loginAdmin(user: string, pass: string): Promise<AdminResponse> {
  const validated = loginSchema.safeParse({ user, pass })
  
  if (!validated.success) {
    return { ok: false, error: 'Credenciales con formato inválido' }
  }

  if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
    return { ok: false, error: 'Usuario o contraseña incorrectos' }
  }

  const cookieStore = cookies()

  // Calcular firma y armar token
  const expectedValue = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(`${ADMIN_USER}:${ADMIN_PASS}`)
    .digest('hex')
  
  const signature = crypto.createHmac('sha256', ADMIN_SECRET)
    .update(expectedValue)
    .digest('hex')

  const adminToken = `${expectedValue}.${signature}`

  // Guardar en cookie segura
  cookieStore.set('admin_session', adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 Horas de jornada
    path: '/',
  })

  return { ok: true }
}

/**
 * Destruye la cookie de sesión del administrador
 */
export async function logoutAdmin(): Promise<AdminResponse> {
  const cookieStore = cookies()
  cookieStore.delete('admin_session')
  return { ok: true }
}
