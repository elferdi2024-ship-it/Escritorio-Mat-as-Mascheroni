// filepath: d:/PROYECTOS/REMATE CAMPO/app/ganadores/page.tsx
// @optimization: nextjs-best-practices - Página de lotes adjudicados (RSC) con de-duplicación de queries en bloque de ganadores

import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Award, ArrowRight } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'
import { formatCurrency } from '@/lib/auction/rules'
import { MOCK_LOTS, MOCK_BIDS } from '@/lib/auction/mock-data'

export const dynamic = 'force-dynamic' // Force dynamic rendering as it reads cookies through createServerSupabase

export const metadata: Metadata = {
  title: 'Lotes Adjudicados y Ganadores',
  description: 'Historial de adjudicaciones, ganadores y precios de cierre de nuestras subastas agrícolas en Uruguay.',
}

export default async function GanadoresPage() {
  const results: any[] = []
  let isDemoMode = false

  try {
    const supabase = createServerSupabase()

    // 1. Obtener lotes cerrados
    const { data: closedLots, error: closedLotsError } = await (supabase.from('lots') as any)
      .select('*')
      .eq('status', 'closed')
      .order('closing_time', { ascending: false })

    if (closedLotsError) {
      throw new Error(closedLotsError.message)
    }

    if (closedLots && closedLots.length > 0) {
      const winnerBidIds = closedLots
        .map((l: any) => l.winner_bid_id)
        .filter((id: any): id is number => id !== null && id !== undefined)

      // 2. Obtener pujas ganadoras asociadas en una consulta por lote en lote (evitando N+1)
      const { data: winningBids } = winnerBidIds.length > 0
        ? await (supabase.from('bids') as any).select('*').in('id', winnerBidIds)
        : { data: [] }

      closedLots.forEach((lot: any) => {
        const winningBid = winningBids?.find((b: any) => b.id === lot.winner_bid_id)
        results.push({
          ...lot,
          winner_name: winningBid ? winningBid.bidder_name : 'Sin ofertas',
          closing_price: winningBid ? Number(winningBid.amount) : Number(lot.starting_price),
        })
      })
    }
  } catch (error) {
    console.warn('Resilience: Falling back to mock closed lots for winners page:', error)
    isDemoMode = true

    // Fallback con mock data
    const closedLots = MOCK_LOTS.filter((l: any) => l.status === 'closed')
    
    closedLots.forEach((lot: any) => {
      const winningBid = MOCK_BIDS.find((b: any) => b.id === lot.winner_bid_id)
      results.push({
        ...lot,
        winner_name: winningBid ? winningBid.bidder_name : 'Sin ofertas',
        closing_price: winningBid ? Number(winningBid.amount) : Number(lot.starting_price),
      })
    })
  }

  return (
    <div className="flex flex-col gap-6 py-6" id="ganadores-page-container">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-neutral-200 pb-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-5xl font-display font-black text-[var(--color-earth)] tracking-tight">
            Lotes Adjudicados
          </h1>
          <p className="text-neutral-500 font-sans text-base leading-relaxed">
            Historial transparente de los equipos agrícolas subastados, sus ganadores y precios finales de martillo.
          </p>
        </div>

        {isDemoMode && (
          <span className="text-[10px] font-display font-extrabold bg-[var(--color-wheat)]/20 text-[var(--color-earth)] border border-[var(--color-wheat)]/40 px-3 py-1.5 rounded-full uppercase tracking-wider shrink-0 self-start sm:self-auto">
            🌾 MODO DEMO LOCAL
          </span>
        )}
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-md rounded-3xl border border-neutral-200 shadow-premium text-center">
          <Award className="w-16 h-16 text-neutral-300 mb-4" />
          <h3 className="text-xl font-display font-bold text-[var(--color-earth)] mb-1">Aún no hay lotes adjudicados</h3>
          <p className="text-neutral-500 font-sans text-sm max-w-sm">
            Los lotes aparecerán en este registro histórico una vez que finalice su período de cuenta regresiva oficial.
          </p>
          <Link
            href="/"
            className="mt-6 px-6 py-3 bg-[var(--color-forest)] text-white hover:bg-[var(--color-forest-dark)] font-display font-bold rounded-xl shadow-premium transition-premium"
          >
            Ver Lotes Activos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((lot) => {
            const hasWinner = lot.winner_bid_id !== null && lot.winner_name !== 'Sin ofertas'
            return (
              <div
                key={lot.id}
                className="bg-white rounded-2xl border border-neutral-200 shadow-premium overflow-hidden flex flex-col md:flex-row justify-between group"
              >
                {/* Imagen del Lote */}
                <div className="relative w-full md:w-44 aspect-video md:aspect-auto bg-neutral-100 shrink-0 overflow-hidden">
                  <img
                    src={lot.image_urls?.[0] || '/lote-59/lote-59.jpeg'}
                    alt={lot.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 bg-[var(--color-earth)] text-[var(--color-cream)] text-[10px] font-display font-bold rounded-sm uppercase">
                    Lote {lot.id}
                  </span>
                </div>

                {/* Detalles de la Adjudicación */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider mb-0.5">
                      Adjudicado el {new Date(lot.closing_time).toLocaleDateString('es-UY', { timeZone: 'America/Montevideo' })}
                    </span>
                    <h3 className="text-base font-display font-extrabold text-[var(--color-earth)] group-hover:text-[var(--color-forest)] transition-colors duration-200">
                      {lot.title}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-neutral-400 uppercase font-sans font-semibold">Adjudicatario</span>
                      <span className="text-xs font-sans font-bold text-neutral-700">
                        {hasWinner ? lot.winner_name : 'Remate desierto'}
                      </span>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-[9px] text-neutral-400 uppercase font-sans font-semibold">Monto Final</span>
                      <span className="text-base font-display font-black text-[var(--color-forest-dark)]">
                        {formatCurrency(lot.closing_price)}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/lote/${lot.id}`}
                    className="flex items-center justify-center gap-1.5 py-2 bg-neutral-50 hover:bg-[var(--color-cream)] border border-neutral-100 hover:border-neutral-200 rounded-xl text-xs font-display font-bold text-[var(--color-earth)] transition-premium"
                  >
                    <span>Ver detalle e historial</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
