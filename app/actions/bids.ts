// filepath: d:/PROYECTOS/REMATE CAMPO/app/actions/bids.ts
// @optimization: typescript-expert - Server Action de pujas robusta, tipada y con validación criptográfica HMAC

'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createServerSupabase } from '@/lib/supabase/server'
import { createSignedToken, verifyAndExtractToken } from '@/lib/security'
import { z } from 'zod'

const bidSchema = z.object({
  lotId: z.number().int().positive(),
  amount: z.number().positive(),
  bidderName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(60, 'El nombre es muy largo').trim(),
  phone: z.string().min(8, 'El teléfono es muy corto').max(20, 'El teléfono es muy largo').trim(),
  email: z.string().email('Debe ser un correo electrónico válido').trim(),
})

export type BidResponse = 
  | { ok: true; data: { bid_id: number | null } }
  | { ok: false; error: string }

export async function placeBidAction(
  lotId: number,
  amount: number,
  bidderName: string,
  phone: string,
  email: string
): Promise<BidResponse> {
  // 1. Validar inputs con Zod
  const validated = bidSchema.safeParse({ lotId, amount, bidderName, phone, email })
  if (!validated.success) {
    const errorMsg = validated.error.errors.map(e => e.message).join(', ')
    return { ok: false, error: `Datos inválidos: ${errorMsg}` }
  }

  const cookieStore = cookies()

  // 2. Rate limiting simple por lote: 1 puja cada 2 segundos por sesión
  const rateLimitKey = `last_bid_${lotId}`
  const lastBidTime = cookieStore.get(rateLimitKey)?.value
  if (lastBidTime && Date.now() - Number(lastBidTime) < 2000) {
    return { ok: false, error: 'Por favor, espera unos segundos antes de volver a pujar.' }
  }

  // 3. Obtener o inicializar la cookie firmada bidder_sid
  const rawCookieSid = cookieStore.get('bidder_sid')?.value
  let sessionUuid = rawCookieSid ? verifyAndExtractToken(rawCookieSid) : null

  if (!sessionUuid) {
    sessionUuid = crypto.randomUUID()
    const signedToken = createSignedToken(sessionUuid)
    cookieStore.set('bidder_sid', signedToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: '/'
    })
  }

  // 4. Instanciar Supabase cliente de servidor
  const supabase = createServerSupabase()

  // 5. Invocar la RPC 'place_bid' de PostgreSQL (ejecución atómica con SELECT FOR UPDATE)
  // Nota: La RPC en setup.sql acepta: p_lot_id, p_amount, p_cookie_sid, p_name, p_phone, p_email
  const { data, error } = await (supabase.rpc as any)('place_bid', {
    p_lot_id: lotId,
    p_amount: amount,
    p_session_id: sessionUuid,
    p_bidder_name: bidderName,
    p_phone: phone,
    p_email: email
  })

  if (error) {
    console.error('Error de Supabase RPC place_bid:', error)
    return { ok: false, error: error.message || 'Error del servidor al procesar la puja' }
  }

  const result = data as unknown as { ok: boolean; error: string | null; bid_id: number | null }

  if (!result || !result.ok) {
    return { ok: false, error: result?.error || 'No se pudo registrar la puja' }
  }

  // 6. Actualizar timestamp de rate limit y revalidar rutas Next.js
  cookieStore.set(rateLimitKey, String(Date.now()), {
    httpOnly: true,
    maxAge: 3, // Corta expiración
    path: '/'
  })

  revalidatePath(`/lote/${lotId}`)
  revalidatePath('/')
  revalidatePath('/ganadores')

  return {
    ok: true,
    data: {
      bid_id: result.bid_id
    }
  }
}
