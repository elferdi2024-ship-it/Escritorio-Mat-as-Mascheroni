// filepath: d:/PROYECTOS/REMATE CAMPO/app/api/cron/close-lots/route.ts
// @optimization: typescript-expert - Endpoint Cron para cerrar lotes expirados oficialmente mediante Supabase RPC

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // 30 segundos de ejecución máxima en Edge

export async function GET(req: NextRequest) {
  // 1. Autorización de seguridad mediante Header o bypass en desarrollo
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    const cronParam = req.nextUrl.searchParams.get('cron_secret')
    if (process.env.NODE_ENV !== 'production' && cronParam === process.env.CRON_SECRET) {
      // Permitido en desarrollo local
    } else {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 })
    }
  }

  const supabase = createServerSupabase()

  // 2. Traer lotes activos o extendidos que ya alcanzaron su hora de cierre
  const { data: expiredLots, error } = await (supabase.from('lots') as any)
    .select('id, title, closing_time')
    .in('status', ['active', 'extended'])
    .lte('closing_time', new Date().toISOString())

  if (error) {
    console.error('Error de base de datos al buscar lotes expirados:', error)
    return NextResponse.json({ error: 'Database query error' }, { status: 500 })
  }

  let closedCount = 0

  // 3. Ejecutar el cierre de cada lote a través del procedimiento almacenado atómico
  for (const lot of (expiredLots as any[]) || []) {
    try {
      // Invocamos close_lot(p_lot_id) en el setup.sql el cual adjudica el ganador,
      // actualiza el status a 'closed', y liquida.
      const { data: isClosed, error: rpcError } = await (supabase as any).rpc('close_lot', {
        p_lot_id: lot.id
      })

      if (rpcError) {
        console.error(`Error de RPC close_lot para lote #${lot.id}:`, rpcError)
      } else if (isClosed) {
        closedCount++
      }
    } catch (err) {
      console.error(`Excepción al cerrar lote #${lot.id} (${lot.title}):`, err)
    }
  }

  return NextResponse.json({
    expired_detected: (expiredLots || []).length,
    closed_successfully: closedCount
  })
}
