// filepath: d:/PROYECTOS/REMATE CAMPO/app/api/cron/send-notifications/route.ts
// @optimization: typescript-expert - Endpoint Cron para procesar y despachar notificaciones encoladas

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/notifications/resend'
import { sendWhatsApp } from '@/lib/notifications/twilio'

export const dynamic = 'force-dynamic'
export const maxDuration = 30 // 30 segundos límite en Edge

export async function GET(req: NextRequest) {
  // 1. Autorización de seguridad mediante Header
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    // Si es en desarrollo local, permitimos bypass con query param para facilitar testing manual
    const cronParam = req.nextUrl.searchParams.get('cron_secret')
    if (process.env.NODE_ENV !== 'production' && cronParam === process.env.CRON_SECRET) {
      // Permitido
    } else {
      return NextResponse.json({ error: 'Acceso no autorizado' }, { status: 401 })
    }
  }

  const supabase = createServerSupabase()

  // 2. Traer notificaciones pendientes con menos de 3 intentos
  const { data: pending, error } = await (supabase.from('notification_queue') as any)
    .select('*')
    .eq('status', 'pending')
    .lt('attempts', 3)
    .order('created_at')
    .limit(50)

  if (error) {
    console.error('Error de base de datos en cron de notificaciones:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  let sent = 0
  let failed = 0

  // 3. Iterar y despachar notificaciones según el canal
  for (const notification of (pending as any[]) || []) {
    try {
      const isEmail = notification.channel === 'email'
      
      const result = isEmail
        ? await sendEmail(notification.recipient, notification.subject || 'Notificación Remate Campo', notification.body)
        : await sendWhatsApp(notification.recipient, notification.body)

      if (result.ok) {
        await (supabase.from('notification_queue') as any)
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            attempts: notification.attempts + 1
          })
          .eq('id', notification.id)
        
        sent++
      } else {
        throw new Error(result.error || 'Error de despacho desconocido')
      }
    } catch (err: any) {
      console.error(`Error procesando notificación #${notification.id}:`, err)
      
      const nextAttempts = notification.attempts + 1
      await (supabase.from('notification_queue') as any)
        .update({
          status: nextAttempts >= 3 ? 'failed' : 'pending',
          attempts: nextAttempts,
          error: err.message || 'Excepción del despachador'
        })
        .eq('id', notification.id)
      
      failed++
    }
  }

  return NextResponse.json({
    processed: (pending || []).length,
    sent,
    failed
  })
}
