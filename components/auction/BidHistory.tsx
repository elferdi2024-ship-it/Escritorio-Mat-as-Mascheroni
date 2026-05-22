// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/BidHistory.tsx
// @optimization: ui-ux-pro-max - Historial de pujas premium con diseño editorial, animaciones sutiles y hora localizada (Uruguay)

'use client'

import React from 'react'
import type { Bid } from '@/types'
import { formatCurrency } from '@/lib/auction/rules'
import { User, Trophy, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BidHistoryProps {
  bids: Bid[]
  currentBidderId?: number
}

export function BidHistory({ bids, currentBidderId }: BidHistoryProps) {
  if (!bids || bids.length === 0) {
    return (
      <div className="bg-cream-dark/30 border border-glass-border rounded-premium-lg p-8 text-center shadow-inner-premium animate-fade-in">
        <div className="w-12 h-12 rounded-full bg-cream-dark/50 flex items-center justify-center mx-auto mb-3">
          <User className="w-5 h-5 text-earth/40" />
        </div>
        <p className="text-earth/60 font-sans text-sm font-medium">
          Aún no se han registrado ofertas para este lote.
        </p>
        <p className="text-forest text-xs font-bold mt-1 tracking-wider uppercase animate-pulse">
          ¡Sé el primero en pujar! 🚜
        </p>
      </div>
    )
  }

  const formatUruguayTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('es-UY', {
      timeZone: 'America/Montevideo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })
  }

  return (
    <div className="bg-glass-bg border border-glass-border rounded-premium-lg shadow-premium overflow-hidden transition-premium">
      <div className="px-5 py-4 border-b border-glass-border bg-cream-dark/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-forest" />
          <h3 className="font-display font-bold text-base text-forest-dark uppercase tracking-wider">
            Historial de Ofertas
          </h3>
        </div>
        <span className="text-xs font-sans font-extrabold px-2.5 py-1 bg-forest/10 text-forest rounded-full">
          {bids.length} {bids.length === 1 ? 'puja' : 'pujas'}
        </span>
      </div>

      <div className="max-h-[360px] overflow-y-auto divide-y divide-glass-border/60 scrollbar-thin">
        {bids.map((bid, index) => {
          const isLider = index === 0
          const isPropia = currentBidderId !== undefined && bid.bidder_id === currentBidderId

          return (
            <div
              key={bid.id}
              className={cn(
                "px-5 py-3.5 flex items-center gap-4 transition-colors duration-250",
                isLider ? "bg-forest/5" : "hover:bg-cream-dark/10"
              )}
            >
              {/* Avatar de Puja */}
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-premium transition-premium",
                  isLider 
                    ? "bg-wheat text-earth scale-105 border border-wheat/30 animate-pulse-ring" 
                    : "bg-cream-dark/40 text-earth/50"
                )}
              >
                {isLider ? <Trophy className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
              </div>

              {/* Detalles del Licitador */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-1.5">
                  <span className="font-display font-bold text-sm text-earth truncate">
                    {bid.bidder_name}
                  </span>
                  {isPropia && (
                    <span className="px-1.5 py-0.5 bg-forest text-cream text-[8px] font-display font-extrabold uppercase rounded shadow-premium tracking-wider">
                      Vos
                    </span>
                  )}
                  {isLider && (
                    <span className="px-1.5 py-0.5 bg-wheat text-earth text-[8px] font-display font-extrabold uppercase rounded shadow-premium tracking-wider">
                      Líder
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-sans font-bold text-earth/50 mt-0.5">
                  {formatUruguayTime(bid.created_at)}
                </p>
              </div>

              {/* Monto de la Oferta */}
              <div className="text-right shrink-0">
                <span 
                  className={cn(
                    "font-display font-extrabold tracking-tight text-sm md:text-base tabular-nums",
                    isLider ? "text-forest font-black" : "text-earth/80"
                  )}
                >
                  {formatCurrency(bid.amount)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
