// filepath: d:/PROYECTOS/REMATE CAMPO/app/api/analytics/track/route.ts
// @optimization: web-performance-optimization - Endpoint de registro de visitas a lotes en segundo plano

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const supabase = createServerSupabase()
    
    // Insertar en la tabla page_views de Supabase de forma rápida
    const { error } = await (supabase.from('page_views') as any)
      .insert({
        lot_id: data.lotId,
        bidder_sid: data.bidderSid,
        path: data.path,
        referrer: data.referrer || null,
        user_agent: data.userAgent || null,
        ip_address: data.ipAddress || null
      })

    if (error) {
      console.error('Error insertando analíticas:', error)
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error('Excepción en tracking de analíticas:', error)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }
}
