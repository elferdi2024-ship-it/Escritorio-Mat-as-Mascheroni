// filepath: d:/PROYECTOS/REMATE CAMPO/app/api/webhooks/mercadopago/route.ts
// @optimization: typescript-expert - Webhook de Mercado Pago con persistencia segura y actualización de transacciones

import { NextRequest, NextResponse } from 'next/server'
import { paymentClient } from '@/lib/mercadopago/client'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action') || ''
    const dataId = url.searchParams.get('data.id') || ''

    let topic = ''
    let id = ''

    // Mercado Pago puede enviar la info en query params o en el body
    if (dataId) {
      id = dataId
      topic = 'payment'
    } else {
      const body = await req.json().catch(() => ({}))
      topic = body.topic || body.type || ''
      id = body.data?.id || ''
    }

    if ((topic === 'payment' || action === 'payment.created') && id) {
      const supabase = createServerSupabase()
      
      // 1. Obtener la transacción desde la API de Mercado Pago
      const payment = await paymentClient.get({ id }) as any

      if (payment.status === 'approved') {
        const extRef = payment.external_reference || '' // lot-[id]-bid-[id]
        const preferenceId = payment.preference_id || ''

        // 2. Extraer lotId de la referencia externa
        const matches = extRef.match(/lot-(\d+)/)
        const lotId = matches ? Number(matches[1]) : null

        if (lotId) {
          // 3. Buscar si ya existe el registro de pago creado en pending
          const { data: existingPayment } = await (supabase.from('payments') as any)
            .select('*')
            .eq('lot_id', lotId)
            .eq('mp_preference_id', preferenceId)
            .single()

          if (existingPayment) {
            // Actualizar a completed
            await (supabase.from('payments') as any)
              .update({
                status: 'completed',
                created_at: new Date().toISOString() // Sincronizar fecha de pago
              })
              .eq('id', (existingPayment as any).id)
          } else {
            // Si por alguna razón no existía (ej: pago iniciado fuera de la Server Action)
            // Obtener el ganador del lote
            const { data: lot } = await (supabase.from('lots') as any)
              .select('winner_bid_id')
              .eq('id', lotId)
              .single()

            if (lot && (lot as any).winner_bid_id) {
              const { data: winnerBid } = await (supabase.from('bids') as any)
                .select('bidder_id')
                .eq('id', (lot as any).winner_bid_id)
                .single()

              if (winnerBid) {
                const amount = Number(payment.transaction_amount || 0)
                const baseAmount = Math.round((amount / 1.19) * 100) / 100
                const commission = Math.round((amount - baseAmount) * 100) / 100

                await (supabase.from('payments') as any)
                  .insert({
                    lot_id: lotId,
                    bidder_id: (winnerBid as any).bidder_id,
                    amount: baseAmount,
                    commission: commission,
                    total: amount,
                    method: 'mercadopago',
                    status: 'completed',
                    mp_preference_id: preferenceId
                  })
              }
            }
          }

          // 4. Encolar notificación de confirmación de pago al ganador
          // Se registra en la cola de notificaciones
          const { data: lotDetails } = await (supabase.from('lots') as any)
            .select('title, winner_bid_id')
            .eq('id', lotId)
            .single()

          if (lotDetails && (lotDetails as any).winner_bid_id) {
            const { data: winnerBid } = await (supabase.from('bids') as any)
              .select('bidder_id, bidders(name, email, phone)')
              .eq('id', (lotDetails as any).winner_bid_id)
              .single()

            if (winnerBid && (winnerBid as any).bidder_id) {
              const bidder = (winnerBid as any).bidders as unknown as { name: string; email: string; phone: string }
              await (supabase.from('notification_queue') as any)
                .insert({
                  lot_id: lotId,
                  bidder_id: (winnerBid as any).bidder_id,
                  type: 'payment_success',
                  status: 'pending',
                  payload: {
                    bidder_name: bidder.name,
                    bidder_email: bidder.email,
                    bidder_phone: bidder.phone,
                    lot_title: (lotDetails as any).title,
                    amount: payment.transaction_amount
                  }
                })
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Mercado Pago Webhook Exception:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
