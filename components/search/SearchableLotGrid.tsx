// filepath: d:/PROYECTOS/REMATE CAMPO/components/search/SearchableLotGrid.tsx
// @optimization: nextjs-best-practices - Filtros en URL como SSOT, con Client Isolation y serverState sync

'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import SearchFilters from './SearchFilters'
import LotGrid from '../auction/LotGrid'
import { searchLotsAction } from '@/app/actions/search'
import type { LotWithDetails } from '@/types'
import type { SearchFiltersInput } from '@/app/actions/search'

interface SearchableLotGridProps {
  initialLots: LotWithDetails[]
}

export default function SearchableLotGrid({ initialLots }: SearchableLotGridProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [lots, setLots] = useState<LotWithDetails[]>(initialLots)
  const [isPending, startTransition] = useTransition()

  // Parse filters from URL
  const queryParam = searchParams.get('q')
  const albumParam = searchParams.get('album')
  const minPriceParam = searchParams.get('min')
  const maxPriceParam = searchParams.get('max')
  const statusParam = searchParams.get('status')

  const activeFilters: SearchFiltersInput = {
    query: queryParam,
    album: albumParam ? Number(albumParam) : null,
    minPrice: minPriceParam ? Number(minPriceParam) : null,
    maxPrice: maxPriceParam ? Number(maxPriceParam) : null,
    status: (statusParam as any) || 'all',
  }

  const isFirstRender = React.useRef(true)

  // Trigger search action whenever URL parameters change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    startTransition(async () => {
      const results = await searchLotsAction(activeFilters)
      setLots(results)
    })
  }, [queryParam, albumParam, minPriceParam, maxPriceParam, statusParam])

  // Handle filter changes and update URL search params
  const handleFiltersChange = (newFilters: SearchFiltersInput) => {
    const params = new URLSearchParams()

    if (newFilters.query) params.set('q', newFilters.query)
    if (newFilters.album && newFilters.album > 0) params.set('album', String(newFilters.album))
    if (newFilters.minPrice) params.set('min', String(newFilters.minPrice))
    if (newFilters.maxPrice) params.set('max', String(newFilters.maxPrice))
    if (newFilters.status && newFilters.status !== 'all') params.set('status', newFilters.status)

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="w-full">
      <SearchFilters initialFilters={activeFilters} onFiltersChange={handleFiltersChange} />
      
      <div className="relative">
        {/* Spinner superpuesto sutil en transiciones rápidas */}
        {isPending && (
          <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] z-20 flex justify-center items-start pt-20 rounded-2xl pointer-events-none transition-all duration-300" />
        )}
        <LotGrid lots={lots} isLoading={isPending && lots.length === 0} />
      </div>
    </div>
  )
}
