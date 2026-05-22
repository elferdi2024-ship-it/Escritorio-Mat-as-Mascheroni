// filepath: d:/PROYECTOS/REMATE CAMPO/app/admin/dashboard/page.tsx
// @optimization: nextjs-best-practices - Dashboard de admin como RSC (Server Component) con protección e hidratación rápida libre de N+1

import React from 'react'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'
import { verifyAdminAuth } from '@/app/actions/admin'
import DashboardClient from '@/components/admin/DashboardClient'
import type { LotWithDetails } from '@/types'

export const revalidate = 0 // Disable caching for the management panel

export default async function AdminDashboardPage() {
  // 1. Doble protección de seguridad en el servidor
  const isAuthed = await verifyAdminAuth()
  if (!isAuthed) {
    redirect('/admin/login')
  }

  const supabase = createServerSupabase()

  // 2. Recuperar todos los lotes del remate
  const { data: lots, error: lotsError } = await (supabase.from('lots') as any)
    .select('*')
    .order('id', { ascending: true })

  if (lotsError) {
    console.error('Error al recuperar lotes en panel de administración:', lotsError)
    throw new Error('Error al cargar catálogo de gestión')
  }

  const detailedLots: LotWithDetails[] = []

  if (lots && lots.length > 0) {
    const lotIds = lots.map((l: any) => l.id)

    // 3. Obtener todas las pujas asociadas en un lote único (evitando consultas recursivas N+1)
    const { data: bids, error: bidsError } = await (supabase.from('bids') as any)
      .select('lot_id, amount')
      .in('lot_id', lotIds)
      .order('created_at', { ascending: false })

    if (bidsError) {
      console.error('Error al cargar pujas en panel de administración:', bidsError)
    }

    lots.forEach((lot: any) => {
      const lotBids = bids?.filter((b: any) => b.lot_id === lot.id) || []
      const currentPrice = lotBids[0] ? Number(lotBids[0].amount) : Number(lot.starting_price)
      const bidsCount = lotBids.length

      detailedLots.push({
        ...lot,
        current_price: currentPrice,
        bids_count: bidsCount,
      } as LotWithDetails)
    })
  }

  return (
    <div className="w-full">
      <DashboardClient lots={detailedLots} />
    </div>
  )
}
