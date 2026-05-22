// filepath: d:/PROYECTOS/REMATE CAMPO/components/layout/LiveTicker.tsx
// @optimization: nextjs-best-practices - Ticker de actividad en tiempo real con suscripción Supabase Realtime y transiciones de marquesina suaves

'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, Flame, AlertCircle } from 'lucide-react'

interface TickerMessage {
  id: string
  text: string
  type: 'bid' | 'info' | 'alert'
}

export default function LiveTicker() {
  const [messages, setMessages] = useState<TickerMessage[]>([
    { id: '1', text: 'Bienvenido al Remate Virtual Agrícola de Remate Campo / Barrio.uy', type: 'info' },
    { id: '2', text: 'Comisión de adjudicación: 12% Contado · 19% Mercado Pago', type: 'info' },
    { id: '3', text: 'REGLA DE ÚLTIMA HORA: De 19:00 a 20:00 solo ofertan postores con pujas previas al lote.', type: 'alert' },
  ])

  useEffect(() => {
    const supabase = createClient()

    // 1. Suscribirse a nuevas pujas para mostrarlas de inmediato en el ticker
    const channel = supabase
      .channel('ticker_bids')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'bids' },
        async (payload) => {
          const newBid = payload.new as any
          
          // Conseguir nombre del lote de forma complementaria (o genérico en fallback)
          const { data: lot } = await (supabase.from('lots') as any)
            .select('title')
            .eq('id', newBid.lot_id)
            .single()

          const lotTitle = (lot as any)?.title || `Lote ${newBid.lot_id}`
          const bidderName = newBid.bidder_name || 'Un postor'
          const amountFormatted = Number(newBid.amount).toLocaleString('es-UY')

          const text = `🔥 PUJA EN VIVO: ${bidderName} ofertó USD ${amountFormatted} en el lote "${lotTitle}"`
          
          setMessages((prev) => [
            { id: String(newBid.id), text, type: 'bid' },
            ...prev.slice(0, 5), // Mantener el buffer manejable
          ])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="w-full bg-[var(--color-earth)] text-[var(--color-cream)] border-b border-white/5 py-2.5 overflow-hidden shadow-inner-premium z-45">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-4">
        {/* Título Fijo */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-[var(--color-forest)] text-[var(--color-cream)] rounded-lg text-[10px] font-display font-extrabold uppercase tracking-widest shrink-0 shadow-premium">
          <Flame className="w-3.5 h-3.5 text-[var(--color-wheat)] animate-bounce" />
          <span>Actividad</span>
        </div>

        {/* Marquesina Deslizante */}
        <div className="relative flex-1 overflow-hidden h-6 flex items-center">
          <div className="flex gap-12 animate-[marquee_35s_linear_infinite] whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-center gap-2 text-xs font-sans font-medium">
                {msg.type === 'bid' && <TrendingUp className="w-4 h-4 text-[var(--color-wheat)] shrink-0" />}
                {msg.type === 'alert' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span className={msg.type === 'bid' ? 'text-[var(--color-wheat)] font-bold' : ''}>
                  {msg.text}
                </span>
                <span className="text-white/20 mx-4">•</span>
              </div>
            ))}
            {/* Duplicado para loop sin cortes */}
            {messages.map((msg) => (
              <div key={`dup-${msg.id}`} className="flex items-center gap-2 text-xs font-sans font-medium">
                {msg.type === 'bid' && <TrendingUp className="w-4 h-4 text-[var(--color-wheat)] shrink-0" />}
                {msg.type === 'alert' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span className={msg.type === 'bid' ? 'text-[var(--color-wheat)] font-bold' : ''}>
                  {msg.text}
                </span>
                <span className="text-white/20 mx-4">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
