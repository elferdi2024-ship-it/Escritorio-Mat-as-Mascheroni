// filepath: d:/PROYECTOS/REMATE CAMPO/app/page.tsx
// @optimization: nextjs-best-practices - Página principal como RSC (Server Component) que evita N+1 en el fetch inicial, inyecta micro-animaciones y skeletons premium

import React from 'react'
import HeroBanner from '@/components/layout/HeroBanner'
import SearchableLotGrid from '@/components/search/SearchableLotGrid'
import { InstallPWAButton } from '@/components/pwa/InstallPWAButton'
import { searchLotsAction } from '@/app/actions/search'
import type { LotWithDetails } from '@/types'

export const revalidate = 5 // ISR: Ultra-fast CDN delivery with 5s background revalidation, live synced via WebSockets

interface HomePageProps {
  searchParams: {
    q?: string
    album?: string
    min?: string
    max?: string
    status?: string
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY
  
  const queryParam = searchParams?.q || null
  const albumParam = searchParams?.album ? Number(searchParams.album) : null
  const minPriceParam = searchParams?.min ? Number(searchParams.min) : null
  const maxPriceParam = searchParams?.max ? Number(searchParams.max) : null
  const statusParam = (searchParams?.status as any) || 'all'

  const activeFilters = {
    query: queryParam,
    album: albumParam,
    minPrice: minPriceParam,
    maxPrice: maxPriceParam,
    status: statusParam,
  }

  const initialLots = await searchLotsAction(activeFilters)

  return (
    <div className="flex flex-col gap-6" id="home-page-container">
      {/* Botón flotante para PWA */}
      <InstallPWAButton />

      {/* Banner de Modo Demo Informativo */}
      {isDemoMode && (
        <div className="w-full bg-[var(--color-wheat)]/10 border border-[var(--color-wheat)]/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-premium animate-pulse-ring">
          <div className="flex items-center gap-3">
            <span className="text-2xl shrink-0">🚜</span>
            <div className="flex flex-col">
              <span className="text-sm font-display font-extrabold text-[var(--color-earth)] uppercase tracking-wider">Modo Demo Local Activo</span>
              <span className="text-xs text-neutral-500 font-sans">
                El archivo <code className="bg-neutral-100 px-1 py-0.5 rounded text-[var(--color-forest-dark)] font-bold">.env.local</code> no contiene credenciales válidas de Supabase. Mostrando datos estáticos de simulación.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-display font-extrabold bg-[var(--color-forest)] text-[var(--color-cream)] px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
            DEMO OFFLINE
          </span>
        </div>
      )}

      {/* Banner Editorial Principal */}
      <HeroBanner />

      {/* Grilla Filtrable e Interactiva de Lotes */}
      <div className="w-full" id="lotes">
        <div className="mb-6 flex flex-col gap-1">
          <h2 className="text-2xl md:text-3xl font-display font-black text-[var(--color-earth)] tracking-tight">
            Catálogo del Remate
          </h2>
          <p className="text-neutral-500 font-sans text-sm">
            Haga clic sobre un lote para visualizar fotos completas, historial de ofertas y pujar en tiempo real.
          </p>
        </div>

        <SearchableLotGrid initialLots={initialLots} />
      </div>
    </div>
  )
}
