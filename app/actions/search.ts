// filepath: d:/PROYECTOS/REMATE CAMPO/app/actions/search.ts
// @optimization: typescript-expert - Server Action de búsqueda full-text y filtros en base de datos combinados con fallback en memoria

'use server'

import { createServerSupabase } from '@/lib/supabase/server'
import { MOCK_LOTS, MOCK_BIDS } from '@/lib/auction/mock-data'
import type { LotWithDetails } from '@/types'

export interface SearchFiltersInput {
  query: string | null
  album: number | null
  minPrice: number | null
  maxPrice: number | null
  status: 'active' | 'extended' | 'closed' | 'all' | null
}

export async function searchLotsAction(filters: SearchFiltersInput): Promise<LotWithDetails[]> {
  const { query, album, minPrice, maxPrice, status } = filters
  const isDemo = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY

  if (isDemo) {
    return getMockFilteredLots(filters)
  }

  const supabase = createServerSupabase()

  try {
    let lots: any[] = []

    // 1. Si hay una consulta de texto, utilizar la RPC search_lots de PostgreSQL (Full-Text Search en español)
    if (query && query.trim().length > 0) {
      const { data, error } = await (supabase.rpc as any)('search_lots', {
        p_query: query.trim(),
        p_album: album || undefined
      })

      if (error) {
        console.error('Error de Supabase RPC search_lots:', error)
        throw new Error(error.message)
      }
      lots = data || []
    } else {
      // 2. Si no hay consulta de texto, hacer una consulta normal filtrada
      let dbQuery = (supabase.from('lots') as any)
        .select('*')

      if (album && album > 0) {
        dbQuery = dbQuery.eq('album', album)
      }

      if (status && status !== 'all') {
        dbQuery = dbQuery.eq('status', status)
      }

      const { data, error } = await dbQuery.order('sort_order')

      if (error) {
        console.error('Error de Supabase consultando lotes:', error)
        throw new Error(error.message)
      }
      lots = data || []
    }

    // Si la base de datos no tiene lotes y no se aplicó ningún filtro restrictivo de texto/álbum,
    // significa que la base de datos está vacía. Caemos en el set de datos simulados (mock).
    if (lots.length === 0 && (!query || query.trim().length === 0) && (!album || album === 0)) {
      console.warn('Base de datos vacía o inaccesible. Cargando datos simulados (mock).')
      return getMockFilteredLots(filters)
    }

    // 3. Procesar las pujas del lote para calcular current_price y bids_count de forma dinámica y veloz
    // y aplicar los filtros de precio (minPrice y maxPrice)
    const lotIds = lots.map(l => l.id)
    if (lotIds.length === 0) return []

    // Obtener todas las pujas asociadas a estos lotes para evitar N+1 selects
    const { data: bids, error: bidsError } = await (supabase.from('bids') as any)
      .select('lot_id, amount')
      .in('lot_id', lotIds)
      .order('created_at', { ascending: false })

    if (bidsError) {
      console.error('Error de Supabase al buscar pujas de lotes:', bidsError)
    }

    const processedLots: LotWithDetails[] = lots.map(lot => {
      const lotBids = bids?.filter((b: any) => b.lot_id === lot.id) || []
      const currentPrice = lotBids[0] ? Number(lotBids[0].amount) : Number(lot.starting_price)
      const bidsCount = lotBids.length

      return {
        ...lot,
        current_price: currentPrice,
        bids_count: bidsCount
      }
    })

    // 4. Filtrar por rango de precio a nivel de servidor
    let filtered = processedLots
    if (minPrice !== null && minPrice !== undefined) {
      filtered = filtered.filter(l => l.current_price >= minPrice)
    }
    if (maxPrice !== null && maxPrice !== undefined) {
      filtered = filtered.filter(l => l.current_price <= maxPrice)
    }

    return filtered
  } catch (err: any) {
    console.warn('Excepción en Server Action searchLotsAction, cayendo a Modo Demo:', err)
    return getMockFilteredLots(filters)
  }
}

function getMockFilteredLots(filters: SearchFiltersInput): LotWithDetails[] {
  const { query, album, minPrice, maxPrice, status } = filters
  let filtered = MOCK_LOTS.map(lot => {
    const lotBids = MOCK_BIDS.filter((b: any) => b.lot_id === lot.id) || []
    const currentPrice = lotBids[0] ? Number(lotBids[0].amount) : Number(lot.starting_price)
    const bidsCount = lotBids.length

    return {
      ...lot,
      current_price: currentPrice,
      bids_count: bidsCount
    } as LotWithDetails
  })

  if (query && query.trim().length > 0) {
    const q = query.toLowerCase().trim()
    filtered = filtered.filter(l => 
      l.title.toLowerCase().includes(q) || 
      (l.description && l.description.toLowerCase().includes(q))
    )
  }

  if (album && album > 0) {
    filtered = filtered.filter(l => l.album === album)
  }

  if (status && status !== 'all') {
    filtered = filtered.filter(l => l.status === status)
  }

  if (minPrice !== null && minPrice !== undefined) {
    filtered = filtered.filter(l => l.current_price >= minPrice)
  }

  if (maxPrice !== null && maxPrice !== undefined) {
    filtered = filtered.filter(l => l.current_price <= maxPrice)
  }

  return filtered
}

