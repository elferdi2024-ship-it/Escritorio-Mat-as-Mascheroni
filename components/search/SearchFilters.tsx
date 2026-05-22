// filepath: d:/PROYECTOS/REMATE CAMPO/components/search/SearchFilters.tsx
// @optimization: tailwind-patterns - Diseño premium HSL con filtros unificados, debounced inputs y transiciones suaves

'use client'

import React, { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react'
import type { SearchFiltersInput } from '@/app/actions/search'

interface SearchFiltersProps {
  initialFilters: SearchFiltersInput
  onFiltersChange: (filters: SearchFiltersInput) => void
}

const ALBUMES = [
  { id: 0, name: 'Todos los Lotes' },
  { id: 1, name: 'Cosechadoras & Tractores' },
  { id: 2, name: 'Sembradoras & Fumigadoras' },
  { id: 3, name: 'Herramientas & Repuestos' },
  { id: 4, name: 'Repuestos & Varios' },
]

export default function SearchFilters({ initialFilters, onFiltersChange }: SearchFiltersProps) {
  const [query, setQuery] = useState(initialFilters.query || '')
  const [album, setAlbum] = useState<number | null>(initialFilters.album)
  const [minPrice, setMinPrice] = useState<string>(initialFilters.minPrice ? String(initialFilters.minPrice) : '')
  const [maxPrice, setMaxPrice] = useState<string>(initialFilters.maxPrice ? String(initialFilters.maxPrice) : '')
  const [status, setStatus] = useState<SearchFiltersInput['status']>(initialFilters.status || 'all')
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      onFiltersChange({
        query: query.trim() || null,
        album,
        minPrice: minPrice ? Number(minPrice) : null,
        maxPrice: maxPrice ? Number(maxPrice) : null,
        status: status === 'all' ? null : status,
      })
    }, 300)

    return () => clearTimeout(handler)
  }, [query, album, minPrice, maxPrice, status])

  const handleReset = () => {
    setQuery('')
    setAlbum(0)
    setMinPrice('')
    setMaxPrice('')
    setStatus('all')
  }

  return (
    <div className="w-full bg-white/60 backdrop-blur-md rounded-2xl border border-[var(--color-glass-border)] shadow-premium p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        {/* Campo de búsqueda principal */}
        <div className="relative w-full lg:flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por marca, modelo, lote (ej. John Deere 7200)..."
            className="w-full pl-12 pr-4 py-3 bg-[var(--color-cream)] text-[var(--color-earth)] border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all placeholder-neutral-400 font-sans"
          />
        </div>

        {/* Botones de acción rápida */}
        <div className="flex w-full lg:w-auto gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center justify-center gap-2 px-5 py-3 border rounded-xl font-medium transition-all ${
              showAdvanced
                ? 'bg-[var(--color-forest)] text-white border-[var(--color-forest)]'
                : 'bg-white text-[var(--color-earth)] border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
            <span>Filtros Avanzados</span>
          </button>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-xl text-neutral-500 hover:text-[var(--color-forest)] hover:bg-neutral-50 transition-all"
            title="Restablecer filtros"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Panel de Álbumes (Tabs Horizontal con micro-interacciones) */}
      <div className="mt-6 border-t border-neutral-100 pt-5">
        <div className="flex flex-wrap gap-2">
          {ALBUMES.map((alb) => {
            const isActive = album === alb.id || (alb.id === 0 && !album)
            return (
              <button
                key={alb.id}
                onClick={() => setAlbum(alb.id === 0 ? null : alb.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[var(--color-forest)] text-white shadow-premium'
                    : 'bg-white text-[var(--color-earth)] border border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {alb.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Filtros avanzados expandibles */}
      <div
        className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 overflow-hidden ${
          showAdvanced ? 'max-h-[300px] mt-6 border-t border-neutral-100 pt-5 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Estado del Lote */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--color-earth)]/80">Estado del lote</label>
          <select
            value={status || 'all'}
            onChange={(e) => setStatus(e.target.value as any)}
            className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="extended">Prórroga activa</option>
            <option value="closed">Finalizados</option>
          </select>
        </div>

        {/* Precio Mínimo */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--color-earth)]/80">Precio mínimo (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Mínimo"
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Precio Máximo */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-[var(--color-earth)]/80">Precio máximo (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Máximo"
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-[var(--color-forest)] focus:ring-2 focus:ring-[var(--color-forest)]/20 transition-all text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
