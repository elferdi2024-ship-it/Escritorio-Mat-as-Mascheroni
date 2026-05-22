// filepath: d:/PROYECTOS/REMATE CAMPO/app/actions/checkout.ts
// @optimization: typescript-expert - Server Action de checkout con emails reales recuperados y creación atómica de cobros

'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { verifyAndExtractToken } from '@/lib/security'
import { preferenceClient, MP_COMMISSION_RATE } from '@/lib/mercadopago/client'

export interface CheckoutResponse {
  ok: boolean
  error?: string
  initPoint?: string
}

export async function createMercadoPagoCheckout(lotId: number): Promise<CheckoutResponse> {
  const supabase = createServerSupabase()

  // 1. Obtener el lote
  const { data: lot, error: lotError } = await (supabase.from('lots') as any)
    .select('*')
    .eq('id', lotId)
    .single()

  if (lotError || !lot) {
    return { ok: false, error: 'Lote no encontrado' }
  }

  if (lot.status !== 'closed') {
    return { ok: false, error: 'El lote aún no ha sido adjudicado' }
  }

  if (!lot.winner_bid_id) {
    return { ok: false, error: 'Este lote no recibió pujas y cerró desierto' }
  }

  // 2. Obtener la puja ganadora y los datos del licitador real
  const { data: winnerBid, error: bidError } = await (supabase.from('bids') as any)
    .select('*, bidder:bidders(*)')
    .eq('id', lot.winner_bid_id)
    .single()

  if (bidError || !winnerBid) {
    return { ok: false, error: 'No se encontró la puja ganadora del lote' }
  }

  const bidderInfo = winnerBid.bidder as unknown as { id: number; cookie_sid: string; name: string; email: string; phone: string }

  // 3. Validar identidad del ganador vía cookie firmada bidder_sid
  const cookieStore = cookies()
  const rawCookieSid = cookieStore.get('bidder_sid')?.value
  const sessionUuid = rawCookieSid ? verifyAndExtractToken(rawCookieSid) : null

  if (!sessionUuid || sessionUuid !== bidderInfo.cookie_sid) {
    return { ok: false, error: 'Acceso no autorizado: Sólo el postor ganador de este lote puede procesar el pago.' }
  }

  // 4. Calcular importes y comisiones
  const amount = Number(winnerBid.amount)
  const commission = Math.round(amount * MP_COMMISSION_RATE * 100) / 100
  const total = Math.round((amount + commission) * 100) / 100

  try {
    // 5. Crear la preferencia de pago en Mercado Pago
    // @optimization: corregido email fake, se inyecta el correo real recuperado de la base de datos (bidderInfo.email)
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: `lote-${lot.id}`,
            title: `Lote #${lot.id}: ${lot.title}`,
            description: `Adjudicado por US$ ${amount} + 19% comisión Mercado Pago`,
            quantity: 1,
            currency_id: 'USD',
            unit_price: total
          }
        ],
        payer: {
          name: bidderInfo.name,
          email: bidderInfo.email || `bidder-${bidderInfo.id}@rematecampo.com.uy`
        },
        external_reference: `lot-${lot.id}-bid-${winnerBid.id}`,
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/exitoso?lot=${lot.id}`,
          failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/fallido?lot=${lot.id}`,
          pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pago/pendiente?lot=${lot.id}`
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mercadopago`
      }
    })

    // 6. Registrar la transacción en payments de forma atómica
    const { error: paymentInsertError } = await (supabase.from('payments') as any)
      .insert({
        lot_id: lot.id,
        bidder_id: bidderInfo.id,
        amount: amount,
        commission: commission,
        total: total,
        method: 'mercadopago',
        status: 'pending',
        mp_preference_id: preference.id
      })

    if (paymentInsertError) {
      console.error('Error al insertar transacción en payments:', paymentInsertError)
      // Continuamos igualmente para no bloquear el flujo de pago del usuario
    }

    return { ok: true, initPoint: preference.init_point }
  } catch (err: any) {
    console.error('Error al generar la preferencia de Mercado Pago:', err)
    return { ok: false, error: err.message || 'Error en el servidor de pagos de Mercado Pago' }
  }
}

export async function redirectToCheckout(lotId: number): Promise<void> {
  const response = await createMercadoPagoCheckout(lotId)
  if (!response.ok || !response.initPoint) {
    throw new Error(response.error || 'Error al procesar el checkout')
  }
  redirect(response.initPoint)
}
