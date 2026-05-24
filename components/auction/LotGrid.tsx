// filepath: d:/PROYECTOS/REMATE CAMPO/components/auction/LotGrid.tsx
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Gavel, ArrowRight, Tag, Clock, Eye, TrendingUp } from 'lucide-react'
import { CountdownBadge } from './CountdownBadge'
import type { LotWithDetails } from '@/types'
import { cn } from '@/lib/utils'

interface LotGridProps {
  lots: LotWithDetails[]
  isLoading: boolean
}

const ALBUM_NAMES: Record<number, string> = {
  1: 'Tractores & Maquinaria',
  2: 'Implementos Agrícolas',
  3: 'Herramientas & Taller',
  4: 'Repuestos & Varios',
}

function LotCard({ lot, index }: { lot: LotWithDetails; index: number }) {
  const [imgError, setImgError] = useState(false)
  const isClosed = lot.status === 'closed'
  const currentPrice = lot.current_price || lot.starting_price
  const mainImage = lot.image_urls?.[0] || '/lote-59/lote-59.jpeg'
  const albumName = ALBUM_NAMES[lot.album] || `Categoría ${lot.album}`

  return (
    <Link
      key={lot.id}
      href={`/lote/${lot.id}`}
      className={cn(
        'group relative flex flex-col h-full bg-white rounded-2xl overflow-hidden',
        'border border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
        'transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
        'hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(45,80,22,0.12),0_4px_12px_rgba(0,0,0,0.06)]',
        'hover:border-[var(--color-wheat-400)]/40',
        'active:scale-[0.98] active:translate-y-0',
        isClosed && 'opacity-80 grayscale-[20%] hover:grayscale-0 hover:opacity-100'
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* === IMAGEN === */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-200 shrink-0">
        <img
          src={imgError ? '/lote-59/lote-59.jpeg' : mainImage}
          alt={lot.title}
          loading={index < 6 ? 'eager' : 'lazy'}
          onError={() => setImgError(true)}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-[1.2s] ease-out"
        />

        {/* Degradado cinematográfico */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent pointer-events-none" />

        {/* Badge Lote - esquina superior izquierda */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-[0.15em] rounded-md uppercase border border-white/10">
            Lote {lot.id}
          </span>
        </div>

        {/* Countdown Badge - esquina superior derecha */}
        <div className="absolute top-3 right-3 z-10">
          <CountdownBadge closingTime={lot.closing_time} status={lot.status} />
        </div>

        {/* Hover overlay "Ver ficha" */}
        {!isClosed && (
          <div className="absolute inset-0 bg-[var(--color-forest)]/0 group-hover:bg-[var(--color-forest)]/20 transition-all duration-500 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-md rounded-lg text-[var(--color-forest)] text-xs font-bold uppercase tracking-wider opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-75 shadow-lg">
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Ficha Completa</span>
            </div>
          </div>
        )}

        {/* Imagen count badge */}
        {lot.image_urls && lot.image_urls.length > 1 && (
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold rounded-md border border-white/10">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
            <span>{lot.image_urls.length}</span>
          </div>
        )}
      </div>

      {/* === CONTENIDO === */}
      <div className="flex-1 flex flex-col p-5 gap-3">
        {/* Categoría */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[var(--color-forest)] uppercase tracking-[0.12em]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-forest)] opacity-60" />
            {albumName}
          </span>
        </div>

        {/* Título */}
        <h3 className="text-base md:text-lg font-display font-extrabold text-[var(--color-earth-950)] tracking-tight leading-snug line-clamp-2 group-hover:text-[var(--color-forest)] transition-colors duration-300">
          {lot.title}
        </h3>

        {/* Descripción */}
        <p className="text-neutral-500 text-[13px] leading-relaxed line-clamp-2 font-sans">
          {lot.description || 'Sin descripción adicional disponible.'}
        </p>

        {/* Spacer */}
        <div className="flex-1" />

        {/* === BLOQUE PRECIO + CTA === */}
        <div className="flex items-end justify-between pt-4 border-t border-neutral-100 mt-1">
          {/* Precio */}
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] text-neutral-400 uppercase tracking-[0.15em] font-bold">
              {isClosed ? 'Precio de Cierre' : 'Oferta Actual'}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-[var(--color-forest)] font-bold">USD</span>
              <span className="text-xl md:text-2xl font-display font-black text-[var(--color-earth-950)] tracking-tight tabular-nums leading-none">
                {currentPrice.toLocaleString('es-UY')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              {!isClosed && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              )}
              <span className="text-[10px] text-neutral-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {lot.bids_count || 0} {lot.bids_count === 1 ? 'oferta' : 'ofertas'}
              </span>
            </div>
          </div>

          {/* Botón CTA */}
          <div
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 shadow-sm',
              isClosed
                ? 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                : 'bg-[var(--color-forest)] text-white group-hover:bg-[var(--color-forest-dark)] group-hover:shadow-[0_4px_16px_rgba(45,80,22,0.3)] group-hover:translate-x-0.5'
            )}
          >
            <span>{isClosed ? 'Resultado' : 'Ofertar'}</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function LotGrid({ lots, isLoading }: LotGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden animate-pulse">
            <div className="aspect-[16/10] bg-gradient-to-br from-neutral-100 to-neutral-200" />
            <div className="p-5 flex flex-col gap-3">
              <div className="h-3 w-24 bg-neutral-200 rounded" />
              <div className="h-5 w-3/4 bg-neutral-200 rounded" />
              <div className="h-3 w-full bg-neutral-100 rounded" />
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-3">
                <div className="flex flex-col gap-1.5">
                  <div className="h-2 w-14 bg-neutral-100 rounded" />
                  <div className="h-6 w-24 bg-neutral-200 rounded" />
                </div>
                <div className="h-10 w-24 bg-neutral-200 rounded-xl" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (lots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white/60 backdrop-blur-md rounded-2xl border border-neutral-200 text-center">
        <div className="w-16 h-16 bg-[var(--color-forest-50)] rounded-2xl flex items-center justify-center mb-4">
          <Tag className="w-8 h-8 text-[var(--color-forest)]/40" />
        </div>
        <h3 className="text-xl font-display font-bold text-[var(--color-earth)] mb-2">No se encontraron lotes</h3>
        <p className="text-neutral-500 max-w-md text-sm">
          Modifique los filtros de búsqueda o el álbum seleccionado para ver otros equipos disponibles.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {lots.map((lot, index) => (
        <LotCard key={lot.id} lot={lot} index={index} />
      ))}
    </div>
  )
}
