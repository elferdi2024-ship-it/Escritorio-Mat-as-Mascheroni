// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/RealtimeLotSubscriber.tsx
// @optimization: nextjs-best-practices - Suscriptor Supabase Realtime a cambios de lotes y pujas, con audio y recarga selectiva

'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { playBidSound, playOutbidSound } from '@/lib/sounds'
import { useBidder } from '@/components/providers/BidderProvider'

interface RealtimeLotSubscriberProps {
  lotId: number
}

export function RealtimeLotSubscriber({ lotId }: RealtimeLotSubscriberProps) {
  const { toast } = useToast()
  const router = useRouter()
  const { bidder } = useBidder()
  const lastActiveBidderName = useRef<string | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // 1. Suscribirse a cambios en la tabla 'lots' para detectar prórrogas o cierres
    const lotChannel = supabase
      .channel(`lot-updates-${lotId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'lots', filter: `id=eq.${lotId}` },
        (payload) => {
          const newData = payload.new as { status: string; closing_time: string }
          const oldData = payload.old as { status: string }

          if (newData.status === 'extended' && oldData.status === 'active') {
            toast({
              title: '⚡ ¡LOTE EXTENDIDO!',
              description: 'Se registró una puja en los últimos minutos y el cierre se prorrogó 10 minutos adicionales.',
              variant: 'success'
            })
            playBidSound()
          }

          // Refrescar layouts y componentes para sincronizar estado
          router.refresh()
        }
      )
      .subscribe()

    // 2. Suscribirse a inserciones en la tabla 'bids'
    // Como las pujas cargan al bidder, podemos escuchar los inserts y activar el refresh del router
    const bidsChannel = supabase
      .channel(`bids-inserts-${lotId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bids', filter: `lot_id=eq.${lotId}` },
        async (payload) => {
          const newBid = payload.new as { bidder_name: string; bidder_session_id: string; amount: number }
          const bidderName = newBid.bidder_name || 'Un postor'

          if (bidderName !== bidder.name) {
            // El usuario actual fue superado (outbid)
            playOutbidSound()
            toast({
              title: '💸 ¡Nueva puja registrada!',
              description: `${bidderName} ofertó un monto de US$ ${newBid.amount.toLocaleString('es-UY')}.`,
              variant: 'destructive'
            })
          } else {
            // Puja propia confirmada
            playBidSound()
            toast({
              title: '✅ ¡Puja registrada con éxito!',
              description: `Sos el líder actual del lote con US$ ${newBid.amount.toLocaleString('es-UY')}.`,
              variant: 'success'
            })
          }

          router.refresh()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(lotChannel)
      supabase.removeChannel(bidsChannel)
    }
  }, [lotId, router, toast, bidder.name])

  return null
}
