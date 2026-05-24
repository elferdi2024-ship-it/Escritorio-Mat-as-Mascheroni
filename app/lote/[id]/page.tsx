// filepath: d:/PROYECTOS/REMATE CAMPO/app/lote/[id]/page.tsx
// @optimization: seo-audit - Detalle del lote como Server Component con generateMetadata dinámico, estructura semántica HTML5 (article, time, data) y A11y nativa

import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Info, Calendar } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'
import ImageGallery from '@/components/auction/ImageGallery'
import { CountdownTimer } from '@/components/auction/CountdownTimer'
import { RealtimeLotSubscriber } from '@/components/auction/RealtimeLotSubscriber'
import { BidHistory } from '@/components/auction/BidHistory'
import { WinnerBanner } from '@/components/auction/WinnerBanner'
import BidPanel from '@/components/auction/BidPanel'
import { formatCurrency } from '@/lib/auction/rules'
import { getMockLotDetails } from '@/lib/auction/mock-data'
import { LotChat } from '@/components/auction/LotChat'

export const revalidate = 5 // ISR: Ultra-fast CDN delivery with 5s background revalidation

export async function generateStaticParams() {
  return Array.from({ length: 20 }, (_, i) => ({
    id: String(i + 1),
  }))
}

interface LotPageProps {
  params: {
    id: string
  }
}

// 1. Metadatos dinámicos para SEO premium con fallback resiliente a Mock
export async function generateMetadata({ params }: LotPageProps): Promise<Metadata> {
  const lotId = Number(params.id)
  let lot: any = null

  try {
    const supabase = createServerSupabase()
    const { data } = await (supabase.from('lots') as any)
      .select('*')
      .eq('id', lotId)
      .single()
    lot = data
  } catch (error) {
    console.warn(`Resilience: Falling back to mock metadata for lot ID ${lotId}`)
  }

  if (!lot) {
    // Intentar mock
    lot = getMockLotDetails(lotId)
  }

  if (!lot) return { title: 'Lote no encontrado' }

  return {
    title: `Lote ${lot.id}: ${lot.title}`,
    description: lot.description || `Subasta del lote ${lot.id} en Remate Campo.`,
    openGraph: {
      title: `Lote ${lot.id}: ${lot.title} · Remate Campo`,
      description: lot.description || `Pujá online en tiempo real.`,
      images: lot.image_urls?.[0] ? [{ url: lot.image_urls[0] }] : [],
    },
  }
}

export default async function LotDetailPage({ params }: LotPageProps) {
  const lotId = Number(params.id)
  if (isNaN(lotId)) notFound()

  let lot: any = null
  let bids: any[] = []
  let isDemoMode = false

  try {
    const supabase = createServerSupabase()
    
    // Obtener detalles del lote
    const { data, error } = await (supabase.from('lots') as any)
      .select('*')
      .eq('id', lotId)
      .single()

    if (error || !data) {
      throw new Error(error?.message || 'Lote no encontrado en Supabase')
    }
    lot = data

    // Obtener el historial completo de pujas de este lote
    const { data: dbBids } = await (supabase.from('bids') as any)
      .select('*')
      .eq('lot_id', lotId)
      .order('amount', { ascending: false })

    bids = dbBids || []
  } catch (error) {
    console.warn(`Resilience: Error fetching lot ${lotId} from Supabase, loading from Mock:`, error)
    isDemoMode = true
    const mockDetails = getMockLotDetails(lotId)
    if (!mockDetails) {
      notFound()
    }
    lot = mockDetails
    bids = mockDetails.bids || []
  }

  const currentPrice = bids && bids.length > 0 ? Number(bids[0].amount) : Number(lot.starting_price)
  const isClosed = lot.status === 'closed'

  return (
    <article className="flex flex-col gap-6" id={`lote-article-${lot.id}`}>
      {/* Realtime Subscriber */}
      <RealtimeLotSubscriber lotId={lot.id} />

      {/* Migas de Pan / Volver */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-neutral-500 hover:text-[var(--color-forest)] font-sans text-sm font-semibold transition-premium"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>

        {isDemoMode && (
          <span className="text-[10px] font-display font-extrabold bg-[var(--color-wheat)]/20 text-[var(--color-earth)] border border-[var(--color-wheat)]/40 px-3 py-1 rounded-full uppercase tracking-wider shrink-0">
            🌾 MODO DEMO LOCAL
          </span>
        )}
      </div>

      {/* Winner Banner si está cerrado */}
      {isClosed && (
        <WinnerBanner
          lot={lot}
          winnerBid={bids?.[0] || null}
        />
      )}

      {/* Grid de Contenido Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Galería e Información (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Título de Lote */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-[var(--color-earth)] text-[var(--color-cream)] text-xs font-display font-bold rounded-premium-sm uppercase">
                Lote {lot.id}
              </span>
              <span className="px-3 py-1 bg-[var(--color-wheat)]/10 text-[var(--color-forest-dark)] border border-[var(--color-wheat)]/30 text-xs font-semibold rounded-premium-sm uppercase">
                Álbum {lot.album}
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-display font-black text-[var(--color-earth)] tracking-tight mt-1.5">
              {lot.title}
            </h1>
          </div>

          {/* Galería de Fotos */}
          <ImageGallery imageUrls={lot.image_urls} title={lot.title} />

          {/* Descripción Técnica Editorial */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-premium">
            <h3 className="text-base font-display font-bold text-[var(--color-earth)] mb-3 uppercase tracking-wider">
              Descripción del Equipo
            </h3>
            <p className="text-neutral-600 font-sans text-sm leading-relaxed whitespace-pre-line">
              {lot.description || 'No se ingresaron detalles descriptivos adicionales para este lote agrícola.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Historial de Ofertas */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-premium">
              <h3 className="text-base font-display font-bold text-[var(--color-earth)] mb-4 uppercase tracking-wider">
                Historial de Ofertas
              </h3>
              <BidHistory bids={bids || []} />
            </div>

            {/* Chat en vivo de negociación */}
            <LotChat lotId={lot.id} />
          </div>
        </div>

        {/* Columna Derecha: Countdown y Bid Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card de Cuenta Regresiva */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-premium flex flex-col gap-3">
            <span className="text-[10px] text-neutral-400 font-sans uppercase font-bold tracking-wider">Cierre programado</span>
            <div className="flex items-center gap-2 text-neutral-600 text-sm font-sans font-semibold">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <time dateTime={lot.closing_time}>
                {new Date(lot.closing_time).toLocaleString('es-UY', {
                  timeZone: 'America/Montevideo',
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </time>
            </div>
            <CountdownTimer closingTime={lot.closing_time} baseClosingTime={lot.base_closing_time} status={lot.status} />
          </div>

          {/* Panel de Ofertas */}
          <BidPanel
            lotId={lot.id}
            startingPrice={Number(lot.starting_price)}
            currentPrice={currentPrice}
            status={lot.status}
            highestBidderName={bids?.[0]?.bidder_name || null}
          />
        </div>

      </div>
    </article>
  )
}
